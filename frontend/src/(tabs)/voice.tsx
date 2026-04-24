voice > voice.tsx;
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  Easing,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import LiveAudioStream from 'react-native-live-audio-stream';
import io from 'socket.io-client';
import { reminderState } from '../../store/reminderStore';

type VoiceMode = 'intro' | 'idle' | 'listening' | 'speaking' | 'processing';

export default function VoiceScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<VoiceMode>('intro');
  const [responseText, setResponseText] = useState('');

  const micAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const socketRef = useRef<any>(null);

  const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://본인ip';

  useEffect(() => {
    async function setupAudio() {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    }
    setupAudio();
  }, []);

  useEffect(() => {
    if (mode === 'listening') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(micAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(micAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      Animated.timing(micAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [mode]);

  // 소켓 설정 및 리스너 통합
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SERVER_URL, { transports: ['websocket'] });

      socketRef.current.on('connect', () => {
        console.log('✅ 서버와 소켓 연결 성공:', socketRef.current.id);
        socketRef.current.emit('chat:join', { userId: '1' });
      });

      socketRef.current.on('speech:status', (data: { status: VoiceMode }) => {
        setMode(data.status);
      });

      socketRef.current.on('speech:text', (data: { text: string }) => {
        setResponseText(data.text);
      });

      socketRef.current.on(
        'speech:reply',
        (data: { reply: string; newScheduleAdded?: any }) => {
          setResponseText(data.reply);
          if (data.newScheduleAdded) {
            reminderState.pendingSchedule = data.newScheduleAdded;
          }
        },
      );

      socketRef.current.on(
        'speech:tts',
        async (data: { ttsBase64: string }) => {
          playBase64Audio(data.ttsBase64);
        },
      );

      // 💡 [추가] 대화 종료 시 요약 및 일정 안내 수신
      socketRef.current.on(
        'speech:summary_done',
        async (data: { noticeText: string; noticeTts: string }) => {
          console.log('📝 요약 완료 및 안내 수신:', data.noticeText);
          setResponseText(data.noticeText);

          if (data.noticeTts) {
            // 안내 음성 재생 후 대화 종료
            await playBase64Audio(data.noticeTts, true);
          } else {
            router.replace('/(tabs)');
          }
        },
      );
    }

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      bufferSize: 4096,
    };
    LiveAudioStream.init(options);
    LiveAudioStream.on('data', chunkBase64 => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('speech:chunk', {
          userId: '1',
          audioBase64: chunkBase64,
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      LiveAudioStream.stop();
    };
  }, []);

  // 공통 오디오 재생 함수
  const playBase64Audio = async (base64: string, autoExit = false) => {
    setMode('speaking');
    try {
      // 기존 소리 정지
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mpeg;base64,${base64}` },
        { shouldPlay: true },
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
          if (autoExit) {
            router.replace('/(tabs)');
          } else {
            setMode('idle');
          }
        }
      });
    } catch (error) {
      console.error('오디오 재생 에러:', error);
      if (autoExit) router.replace('/(tabs)');
      else setMode('idle');
    }
  };

  const startRecording = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED)
          return alert('마이크 권한이 필요합니다.');
      } else {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') return alert('마이크 권한이 필요합니다.');
      }
      setMode('listening');
      setResponseText('');
      LiveAudioStream.start();
    } catch (e) {
      console.error('녹음 시작 에러:', e);
    }
  };

  const stopRecording = () => {
    LiveAudioStream.stop();
    setMode('processing');
    socketRef.current?.emit('speech:end', { userId: '1' });
  };

  const handleMicPress = () => {
    if (mode === 'idle') startRecording();
    else if (mode === 'listening') stopRecording();
    else if (mode === 'speaking') {
      soundRef.current?.stopAsync();
      setMode('idle');
    }
  };

  const handleExit = () => {
    // 💡 단순히 나가는 게 아니라 서버에 '종료 및 요약'을 요청합니다.
    // 서버가 speech:summary_done을 통해 안내 멘트를 보내줄 것입니다.
    if (socketRef.current?.connected) {
      setMode('processing');
      setResponseText('오늘의 대화를 정리하고 있어요...');
      socketRef.current.emit('speech:force_end', { userId: '1' });
    } else {
      router.replace('/(tabs)');
    }
  };

  const getStatusDisplay = () => {
    switch (mode) {
      case 'idle':
        return {
          text: '대기중',
          color: '#6B7280',
          bgColor: '#F3F4F6',
          icon: 'ellipsis-horizontal',
        };
      case 'listening':
        return {
          text: '듣는중...',
          color: '#E02424',
          bgColor: '#FDF2F2',
          icon: 'mic',
        };
      case 'processing':
        return {
          text: '정리중',
          color: '#057A55',
          bgColor: '#F3FAF7',
          icon: 'sync',
        };
      case 'speaking':
        return {
          text: '말하는중',
          color: '#D97706',
          bgColor: '#FFFBEB',
          icon: 'volume-medium',
        };
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();

  if (mode === 'intro') {
    return (
      <SafeAreaView style={styles.introContainer}>
        <View style={styles.introContent}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="chatbubbles-outline" size={60} color={MAIN_COLOR} />
          </View>
          <Text style={styles.introTitle}>안녕하세요.</Text>
          <Text style={styles.introSubtitle}>
            당신의 하루를{'\n'}다마와 함께 나누어보세요.
          </Text>
        </View>
        <View style={styles.introBottom}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setMode('idle')}
          >
            <Text style={styles.startButtonText}>대화 시작하기</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFF"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>음성대화</Text>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            style={styles.homeButton}
          >
            <Ionicons name="close" size={26} color="#4B5563" />
          </TouchableOpacity>
        </View>
        {statusDisplay && (
          <View
            style={[
              styles.statusPill,
              { backgroundColor: statusDisplay.bgColor },
            ]}
          >
            <Ionicons
              name={statusDisplay.icon as any}
              size={16}
              color={statusDisplay.color}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.statusText, { color: statusDisplay.color }]}>
              {statusDisplay.text}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.conversationSurface}>
        {mode === 'processing' ? (
          <View style={styles.processingWrapper}>
            <ActivityIndicator size="large" color={MAIN_COLOR} />
            <Text style={styles.processingText}>
              {responseText || '다마가 답변을 고민하고 있어요...'}
            </Text>
          </View>
        ) : (
          <View style={styles.textWrapper}>
            {mode === 'speaking' && (
              <Ionicons
                name="volume-high"
                size={32}
                color={MAIN_COLOR}
                style={{ marginBottom: 16, alignSelf: 'center' }}
              />
            )}
            <Text
              style={[
                styles.responseText,
                !responseText && styles.placeholderText,
              ]}
            >
              {responseText || '버튼을 누르고 편하게 이야기해주세요.'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomConsole}>
        <Animated.View
          style={[styles.micShadowWrapper, { transform: [{ scale: micAnim }] }]}
        >
          <TouchableOpacity
            style={[
              styles.micButton,
              mode === 'listening' && styles.micButtonRecording,
              mode === 'speaking' && styles.micButtonSpeaking,
            ]}
            onPress={handleMicPress}
            disabled={mode === 'processing'}
          >
            <Ionicons
              name={
                mode === 'listening' || mode === 'speaking' ? 'stop' : 'mic'
              }
              size={40}
              color="#FFF"
            />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[styles.exitButton, mode === 'processing' && { opacity: 0.5 }]}
          onPress={handleExit}
          disabled={mode === 'processing'}
        >
          <Text style={styles.exitButtonText}>대화 마칠래요</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const MAIN_COLOR = '#BF6A2A';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  introContainer: { flex: 1, backgroundColor: '#FFF' },
  introContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  introTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  introSubtitle: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  introBottom: { paddingBottom: 60, paddingHorizontal: 30 },
  startButton: {
    flexDirection: 'row',
    backgroundColor: MAIN_COLOR,
    paddingVertical: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  headerArea: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  homeButton: { padding: 4 },
  statusPill: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  statusText: { fontSize: 14, fontWeight: '600' },
  conversationSurface: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  textWrapper: { alignItems: 'center' },
  responseText: {
    fontSize: 26,
    lineHeight: 40,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  placeholderText: { color: '#9CA3AF', fontWeight: '400', fontSize: 22 },
  processingWrapper: { alignItems: 'center', justifyContent: 'center' },
  processingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomConsole: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'ios' ? 50 : 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 20,
  },
  micShadowWrapper: { marginBottom: 30 },
  micButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: MAIN_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  micButtonRecording: { backgroundColor: '#EF4444', shadowColor: '#EF4444' },
  micButtonSpeaking: { backgroundColor: '#1F2937', shadowColor: '#1F2937' },
  exitButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  exitButtonText: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
});

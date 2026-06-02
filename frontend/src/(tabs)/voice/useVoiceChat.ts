import { useState, useEffect, useRef } from 'react';
import { Animated, Easing, Platform, PermissionsAndroid } from 'react-native';
import LiveAudioStream from 'react-native-live-audio-stream';
import io from 'socket.io-client';
import { audioService } from './audioService';

export type VoiceMode =
  | 'intro'
  | 'idle'
  | 'listening'
  | 'speaking'
  | 'processing';
const SERVER_URL = 'http://10.0.2.2:3000';

export const useVoiceChat = (onExitRequest: () => void) => {
  const [mode, setMode] = useState<VoiceMode>('intro');
  const [responseText, setResponseText] = useState('');

  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);

  const [summaryList, setSummaryList] = useState<any[]>([]);

  const micAnim = useRef(new Animated.Value(1)).current;
  const socketRef = useRef<any>(null);
  const isInitialized = useRef(false);

  const audioQueue = useRef<string[]>([]);
  const isPlayingAudio = useRef(false);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const processAudioQueue = () => {
    if (isPlayingAudio.current || audioQueue.current.length === 0) return;

    const nextAudio = audioQueue.current.shift();
    if (nextAudio) {
      isPlayingAudio.current = true;
      setMode('speaking');

      audioService.playBase64(nextAudio, () => {
        isPlayingAudio.current = false;
        if (audioQueue.current.length > 0) {
          processAudioQueue();
        } else {
          setMode('idle');
        }
      });
    }
  };

  const initAudio = () => {
    if (!isInitialized.current) {
      LiveAudioStream.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 1,
        bufferSize: 4096,
      });

      LiveAudioStream.on('data', chunk => {
        if (socketRef.current?.connected && modeRef.current === 'listening') {
          socketRef.current.emit('speech:chunk', {
            userId: '1',
            audioBase64: chunk,
          });
        }
      });

      isInitialized.current = true;
    }
  };

  useEffect(() => {
    socketRef.current = io(SERVER_URL, {
      transports: ['websocket'],
      forceNew: true,
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('chat:join', { userId: '1' });
    });

    socketRef.current.on('speech:status', (data: { status: VoiceMode }) =>
      setMode(data.status),
    );
    socketRef.current.on('speech:text', (data: { text: string }) =>
      setResponseText(data.text),
    );
    socketRef.current.on('speech:reply', (data: any) =>
      setResponseText(data.reply),
    );

    socketRef.current.on('speech:tts', (data: { ttsBase64: string }) => {
      audioQueue.current.push(data.ttsBase64);
      processAudioQueue();
    });

    socketRef.current.on('speech:summary_done', async (data: any) => {
      console.log('📝 실시간 요약 데이터 수신 성공:', data);

      // 백엔드에서 배열 형태로 넘겨준다면 그대로 넣고,
      // 만약 기존처럼 단일 텍스트 줄글로 온다면 안전하게 가짜 리스트나 기본 카드로 치환
      if (data.summaryList && Array.isArray(data.summaryList)) {
        setSummaryList(data.summaryList);
      } else {
        // 방어 코드: 백엔드가 아직 줄글 데이터(text) 형식으로만 줄 때를 대비한 기본 카드 매핑
        const defaultText =
          data.summary ||
          data.noticeText ||
          '오늘의 대화가 안전하게 저장되었습니다.';
        setSummaryList([
          {
            id: 999,
            icon: 'bookmark-outline',
            time: '오늘 하루',
            title: defaultText,
            location: '다마 다이어리',
          },
        ]);
      }

      setMode('idle');
      setIsSummaryModalVisible(true);
    });

    if (Platform.OS !== 'android') initAudio();

    return () => {
      socketRef.current?.disconnect();
      LiveAudioStream.stop();
      audioService.stop();
    };
  }, []);

  useEffect(() => {
    if (mode === 'listening') {
      Animated.loop(
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
      ).start();
    } else {
      Animated.timing(micAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [mode]);

  const startRecording = async () => {
    try {
      audioService.stop();
      audioQueue.current = [];
      isPlayingAudio.current = false;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }

      initAudio();

      socketRef.current?.emit('audio-start', { userId: '1' });
      setMode('listening');
      setResponseText('');

      setTimeout(() => {
        LiveAudioStream.start();
      }, 150);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = () => {
    LiveAudioStream.stop();
    setMode('processing');
    socketRef.current?.emit('audio-end', { userId: '1' });
  };

  const forceEnd = () => {
    // 1. 상태를 처리 중으로 변경
    setMode('processing');
    setResponseText('오늘의 대화를 정리하고 있어요...');

    // 2. 서버에 강제 종료 신호 전송
    if (socketRef.current?.connected) {
      socketRef.current.emit('speech:force_end', { userId: '1' });
    } else {
      // 서버 연결이 끊겨있다면 즉시 종료 처리
      onExitRequest();
    }
  };

  return {
    mode,
    setMode,
    responseText,
    micAnim,
    startRecording,
    stopRecording,
    forceEnd,
    isSummaryModalVisible,
    setIsSummaryModalVisible,
    summaryList,
  };
};

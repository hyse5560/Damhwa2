import { useState, useEffect, useRef } from 'react';
import { Animated, Easing, Platform, PermissionsAndroid, Alert } from 'react-native';
import LiveAudioStream from 'react-native-live-audio-stream';
import io from 'socket.io-client';
import { audioService } from './audioService';

export type VoiceMode = 'intro' | 'idle' | 'listening' | 'speaking' | 'processing';
const SERVER_URL = 'http://10.0.2.2:3000';

export const useVoiceChat = (onExitRequest: () => void) => {
  const [mode, setMode] = useState<VoiceMode>('intro');
  const [responseText, setResponseText] = useState('');
  const micAnim = useRef(new Animated.Value(1)).current;
  const socketRef = useRef<any>(null);
  const isInitialized = useRef(false);

  const audioQueue = useRef<string[]>([]); 
  const isPlayingAudio = useRef(false);

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

      LiveAudioStream.on('data', (chunk) => {
        if (socketRef.current?.connected) {
          socketRef.current.emit('speech:chunk', { userId: '1', audioBase64: chunk });
        }
      });
      isInitialized.current = true;
    }
  };

  useEffect(() => {
    socketRef.current = io(SERVER_URL, { 
      transports: ['websocket'],
      forceNew: true 
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('chat:join', { userId: '1' });
    });

    socketRef.current.on('speech:status', (data: { status: VoiceMode }) => setMode(data.status));
    socketRef.current.on('speech:text', (data: { text: string }) => setResponseText(data.text));
    socketRef.current.on('speech:reply', (data: any) => setResponseText(data.reply));

    socketRef.current.on('speech:tts', (data: { ttsBase64: string }) => {
      audioQueue.current.push(data.ttsBase64);
      processAudioQueue();
    });

    socketRef.current.on('speech:summary_done', async (data: any) => {
      setResponseText(data.noticeText);
      if (data.noticeTts) {
        audioService.playBase64(data.noticeTts, onExitRequest);
      } else {
        onExitRequest();
      }
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
          Animated.timing(micAnim, { toValue: 1.15, duration: 800, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
          Animated.timing(micAnim, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.in(Easing.ease) }),
        ])
      ).start();
    } else {
      Animated.timing(micAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [mode]);

  const startRecording = async () => {
    try {
      audioService.stop();
      audioQueue.current = [];
      isPlayingAudio.current = false;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
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
    if (socketRef.current?.connected) {
      setMode('processing');
      setResponseText('오늘의 대화를 정리하고 있어요...');
      socketRef.current.emit('speech:force_end', { userId: '1' });
    } else {
      onExitRequest();
    }
  };

  return { mode, setMode, responseText, micAnim, startRecording, stopRecording, forceEnd };
};
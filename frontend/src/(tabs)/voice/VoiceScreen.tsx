import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useVoiceChat } from './useVoiceChat';
import { styles, MAIN_COLOR } from './VoiceScreen.styles';

export default function VoiceScreen({ navigation }: any) {
  // Expo Router 대신 일반 Navigation 사용 (또는 상위에서 처리)
  const handleExit = () => navigation?.replace('MainTabs');

  const { mode, setMode, responseText, micAnim, startRecording, stopRecording, forceEnd } = useVoiceChat(handleExit);

  const getStatusDisplay = () => {
    const maps = {
      idle: { text: '대기중', color: '#6B7280', bgColor: '#F3F4F6', icon: 'ellipsis-horizontal' },
      listening: { text: '듣는중...', color: '#E02424', bgColor: '#FDF2F2', icon: 'mic' },
      processing: { text: '정리중', color: '#057A55', bgColor: '#F3FAF7', icon: 'sync' },
      speaking: { text: '말하는중', color: '#D97706', bgColor: '#FFFBEB', icon: 'volume-medium' },
    };
    return maps[mode as keyof typeof maps] || null;
  };

  const status = getStatusDisplay();

  if (mode === 'intro') {
    return (
      <SafeAreaView style={styles.introContainer}>
        <View style={styles.introContent}>
          <View style={styles.logoPlaceholder}><Ionicons name="chatbubbles-outline" size={60} color={MAIN_COLOR} /></View>
          <Text style={styles.introTitle}>안녕하세요.</Text>
          <Text style={styles.introSubtitle}>당신의 하루를{"\n"}다마와 함께 나누어보세요.</Text>
        </View>
        <View style={styles.introBottom}>
          <TouchableOpacity style={styles.startButton} onPress={() => setMode('idle')}>
            <Text style={styles.startButtonText}>대화 시작하기</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
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
          <TouchableOpacity onPress={handleExit}><Ionicons name="close" size={26} color="#4B5563" /></TouchableOpacity>
        </View>
        {status && (
          <View style={[styles.statusPill, { backgroundColor: status.bgColor }]}>
            <Ionicons name={status.icon as any} size={16} color={status.color} style={{ marginRight: 6 }} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
          </View>
        )}
      </View>

      <View style={styles.conversationSurface}>
        {mode === 'processing' ? (
          <View style={styles.processingWrapper}>
            <ActivityIndicator size="large" color={MAIN_COLOR} />
            <Text style={styles.processingText}>{responseText || '다마가 답변을 고민하고 있어요...'}</Text>
          </View>
        ) : (
          <View style={styles.textWrapper}>
            {mode === 'speaking' && <Ionicons name="volume-high" size={32} color={MAIN_COLOR} style={{ marginBottom: 16 }} />}
            <Text style={[styles.responseText, !responseText && styles.placeholderText]}>
              {responseText || '버튼을 누르고 편하게 이야기해주세요.'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomConsole}>
        <Animated.View style={[styles.micShadowWrapper, { transform: [{ scale: micAnim }] }]}>
          <TouchableOpacity 
            style={[styles.micButton, mode === 'listening' && styles.micButtonRecording, mode === 'speaking' && styles.micButtonSpeaking]}
            onPress={() => mode === 'listening' ? stopRecording() : startRecording()}
            disabled={mode === 'processing'}
          >
            <Ionicons name={mode === 'listening' || mode === 'speaking' ? 'stop' : 'mic'} size={40} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.exitButton} onPress={forceEnd} disabled={mode === 'processing'}>
          <Text style={styles.exitButtonText}>대화 마칠래요</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
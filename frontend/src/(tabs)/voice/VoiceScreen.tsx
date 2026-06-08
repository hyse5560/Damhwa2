import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Modal,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useVoiceChat } from './useVoiceChat';
import { styles, MAIN_COLOR } from './VoiceScreen.styles';
import { audioService } from './audioService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function VoiceScreen({ navigation }: any) {
  const handleExit = () => {
    audioService.stop(); // 음성 출력 종료 처리
    navigation?.replace('MainTabs');
  };

  const {
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
  } = useVoiceChat(handleExit);

  const getStatusDisplay = () => {
    const maps = {
      idle: {
        text: '대기중',
        color: '#6B7280',
        bgColor: '#F3F4F6',
        icon: 'ellipsis-horizontal',
      },
      listening: {
        text: '듣는중...',
        color: '#E02424',
        bgColor: '#FDF2F2',
        icon: 'mic',
      },
      processing: {
        text: '정리중',
        color: '#057A55',
        bgColor: '#F3FAF7',
        icon: 'sync',
      },
      speaking: {
        text: '말하는중',
        color: '#D97706',
        bgColor: '#FFFBEB',
        icon: 'volume-medium',
      },
    };
    return maps[mode as keyof typeof maps] || null;
  };

  const status = getStatusDisplay();

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
          <TouchableOpacity onPress={handleExit}>
            <Ionicons name="close" size={26} color="#4B5563" />
          </TouchableOpacity>
        </View>
        {status && (
          <View
            style={[styles.statusPill, { backgroundColor: status.bgColor }]}
          >
            <Ionicons
              name={status.icon as any}
              size={16}
              color={status.color}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.conversationSurface}>
        {mode === 'processing' ? (
          <View style={styles.processingWrapper}>
            <ActivityIndicator
              size="large"
              color={MAIN_COLOR}
              style={{ marginBottom: 16 }}
            />
            <Text style={[styles.responseText, { color: MAIN_COLOR }]}>
              {responseText || '다마가 답변을 고민하고 있어요...'}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#6B7280',
                marginTop: 10,
                fontWeight: '500',
              }}
            >
              잠시만 기다려주시면 소중히 기록할게요.
            </Text>
          </View>
        ) : (
          <View style={styles.textWrapper}>
            {mode === 'speaking' && (
              <Ionicons
                name="volume-high"
                size={32}
                color={MAIN_COLOR}
                style={{ marginBottom: 16 }}
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
            onPress={() =>
              mode === 'listening' ? stopRecording() : startRecording()
            }
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
          style={styles.exitButton}
          onPress={forceEnd}
          disabled={mode === 'processing'}
        >
          <Text style={styles.exitButtonText}>대화 마칠래요</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSummaryModalVisible}
        onRequestClose={handleExit}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContainer}>
            {/* 타이틀 및 헤더 영역 */}
            <View style={localStyles.modalHeader}>
              <View style={localStyles.checkCircle}>
                <Ionicons name="checkmark" size={32} color="#FFF" />
              </View>
              <Text style={localStyles.modalMainTitle}>대화 정리 완료</Text>
            </View>

            <ScrollView
              style={localStyles.modalScrollView}
              contentContainerStyle={localStyles.modalScrollContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={localStyles.guideText}>
                오늘 이야기한 내용을 요약했어요!
              </Text>

              {summaryList &&
                summaryList.map(item => (
                  <View key={item.id} style={localStyles.itemCard}>
                    {/* 아이콘 섹션 */}
                    <View style={localStyles.iconSection}>
                      <View style={localStyles.iconCircle}>
                        <Ionicons
                          name={item.icon}
                          size={28}
                          color={MAIN_COLOR}
                        />
                      </View>
                    </View>

                    {/* 텍스트 정보 섹션 (글씨 크기 및 굵기 대비 최적화) */}
                    <View style={localStyles.infoSection}>
                      <Text style={localStyles.itemTime}>{item.time}</Text>
                      <Text style={localStyles.itemTitle}>{item.title}</Text>
                      {item.location && (
                        <View style={localStyles.locationRow}>
                          <Ionicons
                            name="location-sharp"
                            size={14}
                            color="#9CA3AF"
                          />
                          <Text style={localStyles.itemLocation}>
                            {item.location}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
            </ScrollView>

            {/* 하단 고정 확인 버튼 */}
            <View style={localStyles.buttonWrapper}>
              <TouchableOpacity
                style={localStyles.modalConfirmBtn}
                onPress={handleExit}
              >
                <Text style={localStyles.modalConfirmBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalMainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  modalScrollView: {
    width: '100%',
    flexShrink: 1,
  },
  modalScrollContent: {
    paddingBottom: 16,
  },
  guideText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    fontWeight: '500',
  },

  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  iconSection: {
    marginRight: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoSection: {
    flex: 1,
  },
  itemTime: {
    fontSize: 14,
    fontWeight: '700',
    color: MAIN_COLOR,
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLocation: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 4,
  },
  buttonWrapper: {
    width: '100%',
    paddingTop: 14,
    backgroundColor: '#FFFFFF',
  },
  modalConfirmBtn: {
    width: '100%',
    backgroundColor: MAIN_COLOR,
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    elevation: 4,
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
});
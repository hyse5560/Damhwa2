import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
// 순수 네이티브 아이콘 라이브러리 사용
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  // 반응형 수치 계산
  const headerFontSize = width * 0.08;
  const subTextSize = width * 0.05;
  const bigButtonFontSize = width * 0.1;
  const smallButtonFontSize = width * 0.06;

  // 내비게이션 함수들
  const goVoiceScreen = () => navigation.navigate('VoiceScreen');
  const goRecordScreen = () => navigation.navigate('RecordScreen');
  const goScheduleScreen = () => navigation.navigate('ScheduleScreen');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 헤더 */}
      <View style={styles.headerWrapper}>
        <Text style={[styles.header, { fontSize: headerFontSize }]}>피드</Text>
      </View>

      <View style={styles.divider} />

      {/* 오늘의 이야기 시작 */}
      <View style={styles.talkRow}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={width * 0.06}
          color="#C07F5C"
        />
        <Text style={[styles.talkText, { fontSize: subTextSize }]}>
          오늘의 이야기를 들려주세요!
        </Text>
      </View>

      {/* 음성대화 버튼 */}
      <TouchableOpacity
        style={[styles.bigButton, { paddingVertical: width * 0.12 }]}
        onPress={goVoiceScreen}
        activeOpacity={0.8}
      >
        <Text style={[styles.bigButtonText, { fontSize: bigButtonFontSize }]}>
          음성대화
        </Text>
      </TouchableOpacity>

      {/* 기록/일정 버튼 행 */}
      <View style={styles.rowButtons}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={goRecordScreen}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.smallButtonText, { fontSize: smallButtonFontSize }]}
          >
            기록
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={goScheduleScreen}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.smallButtonText, { fontSize: smallButtonFontSize }]}
          >
            일정
          </Text>
        </TouchableOpacity>
      </View>

      {/* 알림 박스 */}
      <View style={styles.alertBox}>
        <Ionicons
          name="notifications-outline"
          size={width * 0.06}
          color="#B36A3C"
        />
        <Text style={[styles.alertText, { fontSize: width * 0.045 }]}>
          1개의 알림이 있어요.
        </Text>
      </View>

      {/* 추천 영역 */}
      <View style={styles.recommendBox}>
        <Text style={[styles.recommendTitle, { fontSize: width * 0.05 }]}>
          사용자님을 위한 추천
        </Text>
        <Text style={[styles.recommendDesc, { fontSize: width * 0.045 }]}>
          좋아하시는 정보를 기반으로{'\n'}새로운 소식을 준비했습니다.
        </Text>
        <TouchableOpacity>
          <Text style={styles.more}>더보기</Text>
        </TouchableOpacity>
      </View>

      {/* 보이스피싱 예방 가이드 배너 (광고 영역) */}
      <View style={styles.adSpace}>
        <TouchableOpacity
          style={styles.adPlaceholder}
          onPress={() => {
            navigation.navigate('SafetyGuide');
          }}
          activeOpacity={0.8}
        >
          {/* 전화기와 느낌표 아이콘 조합 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 10,
            }}
          >
            <Ionicons name="call" size={40} color="#555" />
            <View
              style={{
                backgroundColor: '#FF3B30',
                borderRadius: 12,
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: -10, // 전화기 아이콘 우측 상단에 겹치게 배치
                marginTop: -5,
                borderWidth: 2,
                borderColor: '#FFFDE7',
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>
                !
              </Text>
            </View>
          </View>

          <Text style={styles.adTitle}>보이스피싱 예방 가이드</Text>
          <Text style={styles.adDesc}>
            지인을 사칭하는 전화!{'\n'}당황하지 말고 이렇게 대처하세요.
          </Text>
          <View style={styles.guideButton}>
            <Text style={styles.guideButtonText}>예방 수칙 읽기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: {
    paddingHorizontal: '6%',
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerWrapper: { marginBottom: 10 },
  header: { fontWeight: '800', color: '#000' },
  divider: { height: 1.5, backgroundColor: '#F0F0F0', marginBottom: 24 },
  talkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  talkText: { marginLeft: 8, color: '#C07F5C', fontWeight: '700' },
  bigButton: {
    width: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B36A3C',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bigButtonText: { color: '#fff', fontWeight: '900' },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 26,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: '#B36A3C',
    marginHorizontal: 6,
    elevation: 3,
  },
  smallButtonText: { color: '#fff', fontWeight: '800' },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#FFEFD7',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  alertText: { marginLeft: 12, color: '#B36A3C', fontWeight: '700' },
  recommendBox: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  recommendTitle: { fontWeight: '800', color: '#7DA05B', marginBottom: 8 },
  recommendDesc: {
    color: '#444',
    marginBottom: 10,
    lineHeight: 26,
    fontWeight: '500',
  },
  more: {
    textAlign: 'right',
    color: '#B39E7A',
    fontSize: 14,
    fontWeight: '600',
  },
  adSpace: { marginTop: 10, width: '100%', marginBottom: 20 },
  adPlaceholder: {
    backgroundColor: '#FFFDE7',
    borderColor: '#FFF176',
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  adDesc: {
    fontSize: 15,
    color: '#555',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 22,
  },
  guideButton: {
    marginTop: 15,
    backgroundColor: '#FBC02D',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  guideButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
});

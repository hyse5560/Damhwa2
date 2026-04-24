import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
// 1. Expo 대신 순수 네이티브 아이콘 라이브러리 사용
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
      <View style={styles.headerWrapper}>
        <Text style={[styles.header, { fontSize: headerFontSize }]}>피드</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.talkRow}>
        {/* 순수 네이티브 아이콘 적용 */}
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={width * 0.06}
          color="#C07F5C"
        />
        <Text style={[styles.talkText, { fontSize: subTextSize }]}>
          오늘의 이야기를 들려주세요!
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.bigButton, { paddingVertical: width * 0.12 }]}
        onPress={goVoiceScreen}
        activeOpacity={0.8}
      >
        <Text style={[styles.bigButtonText, { fontSize: bigButtonFontSize }]}>
          음성대화
        </Text>
      </TouchableOpacity>

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

      <View style={styles.adSpace}>
        <View style={styles.adPlaceholder}>
          <Text style={styles.adPlaceholderText}>
            광고 및 정보제공 배너 영역
          </Text>
        </View>
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
  adSpace: { marginTop: 10, width: '100%' },
  adPlaceholder: {
    backgroundColor: '#EEE',
    height: 180,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  adPlaceholderText: { color: '#999', fontSize: 16 },
});

// src/screens/HistoryDetail.tsx (위치는 프로젝트에 맞게 조절)
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HistoryDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation();

  // record 화면에서 전달받은 파라미터 가져오기
  const { id, title, date } = route.params || {};

  // 6월 1일 촬영용 아이디('scen_01')일 때 시나리오 맞춤 레이아웃 분기
  const isScenario = id === 'scen_01' || id === 'scen_02';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>대화 요약</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 날짜 및 헤더 */}
        <Text style={styles.dateText}>📅 {date || '2026. 6. 1.'}</Text>
        <Text style={styles.mainTitle}>담화와 나눈 기록이에요</Text>

        {isScenario ? (
          /* 🌟 6월 1일 녹화 시나리오 맞춤 카드 UI (큰 글씨) */
          <View style={styles.summaryContainer}>
            {/* 카드 1: 딸이랑 쇼핑 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.iconBadge, { backgroundColor: '#FFF0E6' }]}
                >
                  <Ionicons name="cart-outline" size={30} color="#BF6A2A" />
                </View>
                <View>
                  <Text style={styles.cardTime}>오전 08:00</Text>
                  <Text style={styles.cardTitle}>딸과 쇼핑</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={16} color="#9CA3AF" />
                <Text style={styles.locationText}>시내 앞 백화점</Text>
              </View>
              <Text style={styles.cardDescription}>
                따님과 함께 시내 앞 백화점에서 즐거운 쇼핑 시간을 보내고
                오셨습니다. 고생 많으셨으니 집에서 편안하게 푹 쉬세요!
              </Text>
            </View>

            {/* 카드 2: 경로당 방문 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.iconBadge, { backgroundColor: '#EAF2FF' }]}
                >
                  <Ionicons name="home-outline" size={30} color="#2F80ED" />
                </View>
                <View>
                  <Text style={styles.cardTime}>오전 10:00</Text>
                  <Text style={styles.cardTitle}>경로당 방문</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={16} color="#9CA3AF" />
                <Text style={styles.locationText}>동네 경로당</Text>
              </View>
              <Text style={styles.cardDescription}>
                오후 3시에 경로당 일정이 예정되어 있습니다. 소중한 일정을 잊지
                않도록 담화가 안전하게 등록해 두었습니다!
              </Text>
            </View>
          </View>
        ) : (
          /* 일반 서버 데이터 노출 구조 */
          <View style={styles.defaultContentBox}>
            <Text style={styles.defaultContentText}>
              {title || '기록된 내용이 없습니다.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  appBarTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  backBtn: { padding: 5 },
  scrollContent: { padding: 20, paddingBottom: 60 },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#BF6A2A',
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },

  summaryContainer: { width: '100%' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 2,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#1F2937' },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 2,
  },
  locationText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 4,
  },
  cardDescription: {
    fontSize: 20,
    lineHeight: 30,
    color: '#4B5563',
    fontWeight: '500',
  },

  defaultContentBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  defaultContentText: { fontSize: 22, lineHeight: 32, color: '#333' },
});

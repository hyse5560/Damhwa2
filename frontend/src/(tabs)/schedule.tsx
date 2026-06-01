import React, { useState, useEffect } from 'react';

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from 'react-native';

import { CalendarList, LocaleConfig } from 'react-native-calendars';

import axios from 'axios';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

// 한국어 설정

LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',

    '2월',

    '3월',

    '4월',

    '5월',

    '6월',

    '7월',

    '8월',

    '9월',

    '10월',

    '11월',

    '12월',
  ],

  monthNamesShort: [
    '1월',

    '2월',

    '3월',

    '4월',

    '5월',

    '6월',

    '7월',

    '8월',

    '9월',

    '10월',

    '11월',

    '12월',
  ],

  dayNames: [
    '일요일',

    '월요일',

    '화요일',

    '수요일',

    '목요일',

    '금요일',

    '토요일',
  ],

  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};

LocaleConfig.defaultLocale = 'kr';

const screenWidth = Dimensions.get('window').width;

const API_BASE_URL = 'http://10.0.2.2:3000/api/chat';

const getCategoryMeta = (title: string) => {
  if (
    title.includes('체조') ||
    title.includes('운동') ||
    title.includes('산책') ||
    title.includes('쇼핑')
  ) {
    return {
      icon: '🛍️',

      bg: '#FFEBF0',

      textColor: '#D81B60',

      label: '외출/쇼핑',
    };
  }

  if (
    title.includes('경로당') ||
    title.includes('복지관') ||
    title.includes('마을회관')
  ) {
    return {
      icon: '🏡',

      bg: '#E8F5E9',

      textColor: '#2E7D32',

      label: '경로당 방문',
    };
  }

  if (
    title.includes('특강') ||
    title.includes('문화') ||
    title.includes('교실')
  ) {
    return { icon: '📚', bg: '#E3F2FD', textColor: '#1565C0', label: '문화' };
  }

  return { icon: '🗓️', bg: '#F5F5F5', textColor: '#424242', label: '일정' };
};

export default function ScheduleScreen() {
  const navigation = useNavigation();

  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [schedules, setSchedules] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // 날짜가 선택될 때마다 서버 데이터 호출

  useEffect(() => {
    loadSchedules(selectedDate);
  }, [selectedDate]);

  const loadSchedules = async (date: string) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/schedules/1?date=${date}`,
      );

      if (response.data && Array.isArray(response.data.data)) {
        setSchedules(response.data.data);
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error('일정 로드 에러:', error);

      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const renderCustomHeader = (date: any) => {
    const month = date.getMonth() + 1;

    const year = date.getFullYear();

    return (
      <View style={styles.monthHeader}>
        <Text style={styles.monthText}>{month}</Text>

        <Text style={styles.yearText}>{year}</Text>
      </View>
    );
  };

  // 날짜 가독성 가공 (예: 2026-06-01 -> 6월 1일)

  const formatKoreanDate = (dateStr: string) => {
    if (!dateStr) return '';

    const [_, m, d] = dateStr.split('-');

    return `${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={30} color="#333" />
        </TouchableOpacity>

        <Text style={styles.appBarTitle}>캘린더</Text>

        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.header}>일정</Text>

      {/* 캘린더 리스트 컴포넌트 */}

      <CalendarList
        horizontal
        pagingEnabled
        calendarWidth={screenWidth}
        pastScrollRange={12}
        futureScrollRange={12}
        showScrollIndicator={false}
        firstDay={0}
        current={'2026-06-01'} // 달력 포커스 고정
        renderHeader={renderCustomHeader}
        onDayPress={day => setSelectedDate(day.dateString)}
        theme={
          {
            todayTextColor: '#B36A3C',

            textDayFontSize: 20,

            textDayHeaderFontSize: 16,

            textSectionTitleColor: '#444',

            'stylesheet.calendar.header': {
              week: {
                flexDirection: 'row',

                justifyContent: 'space-between',

                backgroundColor: '#F0F0F0',

                paddingVertical: 10,

                borderRadius: 12,

                marginBottom: 15,

                paddingHorizontal: 15,
              },
            },
          } as any
        }
        dayComponent={({ date, state }: any) => {
          if (!date) return null;

          const dayOfWeek = new Date(date.dateString).getDay();

          const isSelected = selectedDate === date.dateString;

          const isToday = date.dateString === todayStr;

          const isDisabled = state === 'disabled';

          return (
            <TouchableOpacity
              style={[
                styles.dayContainer,

                isSelected && styles.selectedDayContainer,

                !isSelected && isToday && styles.todayContainer,
              ]}
              onPress={() => setSelectedDate(date.dateString)}
            >
              <Text
                style={[
                  styles.dayText,

                  dayOfWeek === 0 && styles.sunday,

                  dayOfWeek === 6 && styles.saturday,

                  isSelected && styles.selectedDayText,

                  !isSelected && isToday && styles.todayText,

                  isDisabled && { color: '#ccc' },
                ]}
              >
                {date.day}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.scheduleBox}>
        <Text style={styles.scheduleTitle}>
          {selectedDate
            ? `${formatKoreanDate(selectedDate)} 일정 요약`
            : '확인할 날짜를 선택하세요'}
        </Text>

        <View style={styles.contentWrapper}>
          {loading ? (
            <ActivityIndicator color="#B36A3C" style={{ marginTop: 20 }} />
          ) : schedules.length > 0 ? (
            <View style={styles.summaryListContainer}>
              {schedules.map((item: any, idx: number) => {
                const timeStr = item.schedule_time
                  ? new Date(item.schedule_time).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',

                      minute: '2-digit',

                      hour12: false,
                    })
                  : '시간 미정';

                return (
                  <View key={idx} style={styles.summaryItemRow}>
                    <Text style={styles.summaryBullet}>•</Text>

                    <Text style={styles.summaryText}>
                      {timeStr} : {item.title}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.scheduleText}>
              {selectedDate
                ? '아직 등록된 일정이 없습니다.'
                : '달력에서 날짜를 선택하세요.'}
            </Text>
          )}
        </View>

        {schedules.length > 0 && (
          <TouchableOpacity
            style={styles.reopenBtn}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.reopenBtnText}>일정 자세히 보기</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* 상단 닫기 X 버튼 */}

            <TouchableOpacity
              style={styles.modalCloseCorner}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#999" />
            </TouchableOpacity>

            {/* 타이틀: "6월 1일 일정" */}

            <Text style={styles.modalDateTitle}>
              {formatKoreanDate(selectedDate)} 일정
            </Text>

            {/* 일정 리스트 출력 영역 */}

            <View style={styles.modalScrollSpace}>
              {schedules.map((item: any, index: number) => {
                const meta = getCategoryMeta(item.title);

                const timeStr = item.schedule_time
                  ? new Date(item.schedule_time).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',

                      minute: '2-digit',

                      hour12: false,
                    })
                  : '시간 정보 없음';

                return (
                  <View key={index} style={styles.modalItemBlock}>
                    <View
                      style={[
                        styles.badgeIconContainer,

                        { backgroundColor: meta.bg },
                      ]}
                    >
                      <Text style={styles.badgeEmoji}>{meta.icon}</Text>
                    </View>

                    {/* 카테고리명 & 일정 타이틀 & 시간 배치 */}

                    <View style={styles.modalItemRight}>
                      <Text
                        style={[
                          styles.badgeLabelText,

                          { color: meta.textColor },
                        ]}
                      >
                        {meta.label}
                      </Text>

                      <Text style={styles.modalItemTitle}>{item.title}</Text>

                      <Text style={styles.modalItemTime}>시간: {timeStr}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalConfirmBtnText}>확 인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  appBar: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingHorizontal: 15,

    paddingVertical: 10,

    backgroundColor: '#FFF',
  },

  appBarTitle: { fontSize: 18, fontWeight: '800', color: '#333' },

  backBtn: { padding: 5 },

  header: {
    fontSize: 28,

    fontWeight: '800',

    marginBottom: 10,

    marginLeft: 20,

    color: '#333',
  },

  monthHeader: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    paddingLeft: 10,

    marginBottom: 10,
  },

  monthText: {
    fontSize: 54,

    fontWeight: '900',

    marginRight: 8,

    color: '#B36A3C',

    lineHeight: 60,
  },

  yearText: {
    fontSize: 20,

    color: '#888',

    fontWeight: '600',

    marginBottom: 10,
  },

  dayContainer: {
    alignItems: 'center',

    justifyContent: 'center',

    width: 45,

    height: 45,
  },

  selectedDayContainer: {
    backgroundColor: '#B36A3C',

    borderRadius: 22.5,
  },

  todayContainer: {
    borderWidth: 2,

    borderColor: '#B36A3C',

    borderRadius: 22.5,
  },

  todayText: {
    color: '#B36A3C',

    fontWeight: '900',
  },

  dayText: {
    fontSize: 18,

    color: '#333',

    textAlign: 'center',
  },

  selectedDayText: {
    color: '#fff',

    fontWeight: '700',
  },

  sunday: { color: '#E53935' },

  saturday: { color: '#1E88E5' },

  scheduleBox: {
    width: '90%',

    alignSelf: 'center',

    marginTop: 20,

    marginBottom: 40,

    padding: 20,

    backgroundColor: '#F9F9F9',

    borderRadius: 20,

    borderWidth: 1,

    borderColor: '#EEE',

    minHeight: 250, // 최소 높이 보장

    flexDirection: 'column', // 세로 정렬
  },

  contentWrapper: {
    flex: 1, // 남은 공간을 모두 차지하여 버튼 위치 고정

    justifyContent: 'center',
  },

  summaryBullet: {
    fontSize: 18,

    fontWeight: '700',

    color: '#B36A3C',

    marginRight: 8,
  },

  scheduleText: {
    fontSize: 18,

    fontWeight: '600',

    color: '#888',

    textAlign: 'center',

    marginTop: 20,
  },

  scheduleTitle: {
    fontSize: 22,

    fontWeight: '800',

    color: '#333',

    textAlign: 'center',

    marginBottom: 10,
  },

  summaryListContainer: {
    width: '100%',
  },

  summaryItemRow: {
    flexDirection: 'row',

    marginBottom: 8,
  },

  summaryText: {
    fontSize: 18,

    fontWeight: '700',

    color: '#444',

    flexShrink: 1, // 텍스트가 길어지면 줄바꿈 처리
  },

  reopenBtn: {
    marginTop: 15, // 상단 내용물과 간격

    backgroundColor: '#B36A3C',

    paddingVertical: 14,

    borderRadius: 25,

    alignItems: 'center',

    width: '100%',
  },

  reopenBtnText: {
    color: '#FFF',

    fontSize: 16,

    fontWeight: '700',
  },

  // ===== 팝업 모달 스타일 레이아웃 =====

  modalOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.4)',

    justifyContent: 'center',

    alignItems: 'center',
  },

  modalContainer: {
    width: screenWidth * 0.85,

    backgroundColor: '#FFFFFF',

    borderRadius: 28,

    padding: 25,

    alignItems: 'center',

    position: 'relative',

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.15,

    shadowRadius: 10,

    elevation: 8,
  },

  modalCloseCorner: {
    position: 'absolute',

    top: 15,

    right: 15,

    padding: 5,
  },

  modalDateTitle: {
    fontSize: 22,

    fontWeight: '800',

    color: '#4A4A4A',

    marginBottom: 25,

    marginTop: 10,
  },

  modalScrollSpace: {
    width: '100%',

    maxHeight: 300,

    marginBottom: 10,
  },

  modalItemBlock: {
    flexDirection: 'row',

    alignItems: 'center',

    width: '100%',

    marginBottom: 20,

    paddingHorizontal: 5,
  },

  badgeIconContainer: {
    width: 60,

    height: 60,

    borderRadius: 30,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 18,
  },

  badgeEmoji: {
    fontSize: 28,
  },

  modalItemRight: {
    flex: 1,

    justifyContent: 'center',
  },

  badgeLabelText: {
    fontSize: 14,

    fontWeight: '700',

    marginBottom: 2,
  },

  modalItemTitle: {
    fontSize: 24,

    fontWeight: '800',

    color: '#222',
  },

  modalItemTime: {
    fontSize: 16,

    color: '#666',

    marginTop: 4,

    fontWeight: '500',
  },

  modalConfirmBtn: {
    width: '100%',

    backgroundColor: '#8C6246',

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: 'center',

    marginTop: 15,
  },

  modalConfirmBtnText: {
    color: '#FFFFFF',

    fontSize: 22,

    fontWeight: '800',
  },
});

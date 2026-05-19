import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 뒤로가기 아이콘용
import { useNavigation } from '@react-navigation/native';

// 한국어 설정
LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  dayNames: [
    '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'kr';

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = 'http://10.0.2.2:3000/api/chat';

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 오늘 날짜 구하기 (YYYY-MM-DD 형식)
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (selectedDate) {
      loadSchedules(selectedDate);
    }
  }, [selectedDate]);

  // 1. 일정 불러오기 로직 수정 (서버의 객체 및 내부 data 배열 완벽 파싱)
  const loadSchedules = async (date: string) => {
    try {
      setLoading(true);
      
      // 304 캐시 버그 차단을 위한 헤더 옵션 추가
      const response = await axios.get(`${API_BASE_URL}/schedules/1?date=${date}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      // 백엔드가 { success: true, data: [...] } 형태로 주므로 response.data.data 확인
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

  return (
    <SafeAreaView style={styles.container}>
      {/* 커스텀 상단 바 */}
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>일정 관리</Text>
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

      {/* 하단 일정 표시 박스 */}
      <View style={styles.scheduleBox}>
        <Text style={styles.scheduleTitle}>
          {selectedDate ? `${selectedDate} 일정` : '확인할 날짜를 눌러주세요'}
        </Text>

        {loading ? (
          <ActivityIndicator color="#B36A3C" style={{ marginTop: 20 }} />
        ) : schedules.length > 0 ? (
          schedules.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemBullet}>•</Text>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitleText}>{item.title}</Text>
                <Text style={styles.itemTimeText}>
                  {item.schedule_time
                    ? new Date(item.schedule_time).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : '시간 정보 없음'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.scheduleText}>
            {selectedDate
              ? '아직 등록된 일정이 없습니다.'
              : '달력에서 날짜를 선택하세요.'}
          </Text>
        )}
      </View>
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
    flex: 1,
    marginTop: 20,
    marginHorizontal: 20,
    padding: 25,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  scheduleText: { fontSize: 16, color: '#999', marginTop: 10 },
  itemRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-start' },
  itemBullet: {
    fontSize: 22,
    color: '#B36A3C',
    marginRight: 10,
    lineHeight: 24,
  },
  itemTextContainer: { flex: 1 },
  itemTitleText: { fontSize: 18, fontWeight: '600', color: '#333' },
  itemTimeText: { fontSize: 14, color: '#888', marginTop: 2 },
});
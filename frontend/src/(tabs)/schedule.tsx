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

// 한국어 설정
LocaleConfig.locales['kr'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
};
LocaleConfig.defaultLocale = 'kr';

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = 'http://10.0.2.2:3000/api/chat';

export default function schedule() {
  const [selectedDate, setSelectedDate] = useState('');
  const [schedules, setSchedules] = useState<any[]>([]); // DB 데이터 저장용
  const [loading, setLoading] = useState(false);

  // 날짜 변경 시 데이터 로드
  useEffect(() => {
    if (selectedDate) {
      loadSchedules(selectedDate);
    }
  }, [selectedDate]);

  const loadSchedules = async (date: string) => {
    try {
      setLoading(true);
      // 서버의 DB 조회 API 호출 (예: 유저 ID 1번 기준)
      const response = await axios.get(`${API_BASE_URL}/schedules/1?date=${date}`);
      setSchedules(Array.isArray(response.data) ? response.data : []);
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
      <Text style={styles.header}>일정</Text>

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
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#B36A3C' },
        }}
        theme={{
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
        } as any}
        dayComponent={({ date, state }: any) => {
          if (!date) return null;
          const dayOfWeek = new Date(date.dateString).getDay();
          const isSelected = selectedDate === date.dateString;
          const isDisabled = state === 'disabled';

          return (
            <TouchableOpacity
              style={[styles.dayContainer, isSelected && styles.selectedDayContainer]}
              onPress={() => setSelectedDate(date.dateString)}
            >
              <Text style={[
                styles.dayText,
                dayOfWeek === 0 && styles.sunday,
                dayOfWeek === 6 && styles.saturday,
                isSelected && styles.selectedDayText,
                isDisabled && { color: '#ccc' },
              ]}>
                {date.day}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

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
                        hour12: true 
                      })
                    : '시간 정보 없음'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.scheduleText}>
            {selectedDate ? '아직 등록된 일정이 없습니다.' : '달력에서 날짜를 선택하세요.'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 20,
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
  dayText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '700',
  },
  sunday: {
    color: '#E53935',
  },
  saturday: {
    color: '#1E88E5',
  },
  scheduleBox: {
    flex: 1, // 남은 공간을 차지하도록 변경
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
  scheduleText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  // DB 연동 리스트용 추가 스타일
  itemRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  itemBullet: {
    fontSize: 22,
    color: '#B36A3C',
    marginRight: 10,
    lineHeight: 24,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  itemTimeText: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});
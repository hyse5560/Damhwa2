import React, { useState } from 'react'; // React 추가
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView, // SafeAreaView 추가
} from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';

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

export default function schedule() {
  const [selectedDate, setSelectedDate] = useState('');

  const renderCustomHeader = (date: any) => {
    // date가 xdate 객체로 들어올 수 있어 포맷팅 안전하게 처리
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
        // dayComponent를 사용할 때 markedDates가 무시될 수 있어 내부 로직 확인 필요
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#B36A3C',
          },
        }}
        theme={
          {
            todayTextColor: '#B36A3C',
            textDayFontSize: 20,
            textDayHeaderFontSize: 16, // 약간 조정
            textSectionTitleColor: '#444',
            // 헤더 부분 커스텀 스타일
            'stylesheet.calendar.header': {
              week: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#F0F0F0', // 색상 살짝 연하게
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

          // Native 환경의 Date 생성 시 "YYYY-MM-DD" 형식이 가장 안전함
          const dayOfWeek = new Date(date.dateString).getDay();
          const isSelected = selectedDate === date.dateString;
          const isDisabled = state === 'disabled';

          return (
            <TouchableOpacity
              style={[
                styles.dayContainer,
                isSelected && styles.selectedDayContainer,
              ]}
              onPress={() => setSelectedDate(date.dateString)}
            >
              <Text
                style={[
                  styles.dayText,
                  dayOfWeek === 0 && styles.sunday,
                  dayOfWeek === 6 && styles.saturday,
                  isSelected && styles.selectedDayText,
                  isDisabled && { color: '#ccc' }, // 지난달/다음달 날짜 흐리게
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
          {selectedDate ? `${selectedDate} 일정` : '오늘의 일정'}
        </Text>
        <Text style={styles.scheduleText}>
          {selectedDate
            ? '아직 등록된 일정이 없습니다.'
            : '날짜를 선택해 주세요.'}
        </Text>
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
    backgroundColor: '#B36A3C', // 회색 대신 포인트 컬러 사용 권장
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
    marginTop: 20,
    marginHorizontal: 20,
    padding: 25,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 16,
    color: '#777',
  },
});

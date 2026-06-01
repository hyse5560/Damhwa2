import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MAIN_BROWN = '#BF6A2A';
const SUB_BEIGE = '#FFF9F3';

export default function CommunityScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  // 🌟 인원수 관련 데이터를 제거하고 깔끔한 기본 정보만 유지
  const chatRooms = [
    {
      id: 1,
      title: '오늘 아침 신문 이야기',
      time: '매일 오전 10:00',
      thumb: '📰',
    },
    {
      id: 2,
      title: '7080 노래 같이 들어요',
      time: '매일 오후 02:00',
      thumb: '📻',
    },
    {
      id: 3,
      title: '동네 한바퀴',
      time: '매일 오후 07:00',
      thumb: '🏃‍♂️',
    },
  ];

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>오픈 채팅방</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={width * 0.08} color={MAIN_BROWN} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {chatRooms.map(room => (
          <TouchableOpacity
            key={room.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('RoomInfo', { title: room.title })
            }
          >
            <View style={styles.thumbArea}>
              <Text style={styles.thumbEmoji}>{room.thumb}</Text>
            </View>

            <View style={styles.infoArea}>
              <Text style={styles.roomTag}>소통 공간</Text>
              <Text style={styles.roomTitle} numberOfLines={2}>
                {room.title}
              </Text>

              {/* 🌟 [수정 포인트] 뒤에 붙던 '/ 정원' 문구를 지우고 시간만 깔끔하게 출력 */}
              <Text style={styles.roomTime}>{room.time}</Text>

              <TouchableOpacity
                style={styles.joinButton}
                onPress={() =>
                  navigation.navigate('RoomInfo', { title: room.title })
                }
              >
                <Text style={styles.joinButtonText}>참여하기</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 하단 플로팅 버튼 */}
      <TouchableOpacity
        style={styles.makeButton}
        onPress={() =>
          Alert.alert('안내', '채팅방 만들기 화면으로 이동합니다.')
        }
      >
        <Ionicons name="add-circle" size={30} color="#FFF" />
        <Text style={styles.makeButtonText}>채팅방 만들기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SUB_BEIGE,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '800', color: MAIN_BROWN },
  list: { paddingHorizontal: 15, paddingBottom: 100 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbArea: {
    height: 160,
    backgroundColor: '#F0E0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbEmoji: { fontSize: 60 },
  infoArea: { padding: 16 },
  roomTag: {
    color: '#BF6A2A',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
  },
  roomTitle: {
    color: '#222222',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 28,
  },
  // 🌟 정원이 빠지면서 한 줄로 간결해진 만큼 폰트 크기와 가독성을 최적화했습니다.
  roomTime: {
    color: '#666666',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 14,
  },
  joinButton: {
    backgroundColor: MAIN_BROWN,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  joinButtonText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  makeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MAIN_BROWN,
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  makeButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 18,
    marginLeft: 8,
  },
});

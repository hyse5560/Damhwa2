import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert, // Native Alert 추가
} from 'react-native';
// 1. 순수 네이티브 아이콘 라이브러리로 교체
import Ionicons from 'react-native-vector-icons/Ionicons';

const MAIN_BROWN = '#BF6A2A';
const SUB_BEIGE = '#FFF9F3';

export default function CommunityScreen() {
  // 2. 네비게이션 타입 지정 (오류 방지용 any)
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const chatRooms = [
    {
      id: 1,
      title: '오늘 아침 신문 이야기',
      time: '매일 오전 11:30',
      thumb: '☕',
    },
    {
      id: 2,
      title: '우리가 좋아하는 가요 무대',
      time: '매일 오후 02:00',
      thumb: '🐶',
    },
    {
      id: 3,
      title: '7080 노래 같이 들어요',
      time: '매일 오후 07:00',
      thumb: '📀',
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
              <Text style={styles.roomTag}>강좌</Text>
              <Text style={styles.roomTitle} numberOfLines={2}>
                {room.title}
              </Text>
              <Text style={styles.roomTime}>{room.time} / 정원</Text>

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

      {/* 하단 버튼: alert 대신 Native Alert 사용 */}
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
    color: '#333',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 28,
  },
  roomTime: { color: '#888', fontSize: 16, marginBottom: 12 },
  joinButton: {
    backgroundColor: MAIN_BROWN,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
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

import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Alert,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const MAIN_BROWN = '#BF6A2A';
const SUB_BEIGE = '#FFF9F3';

export default function CommunityScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [chatRooms, setChatRooms] = useState([
    {
      id: 1,
      title: '오늘 아침 신문 이야기',
      time: '매일 오전 10:00',
      thumb: '📰',
      isMine: false,
    },
    {
      id: 2,
      title: '7080 노래 같이 들어요',
      time: '매일 오후 02:00',
      thumb: '📻',
      isMine: false,
    },
    {
      id: 3,
      title: '동네 한바퀴',
      time: '매일 오후 07:00',
      thumb: '🏃‍♂️',
      isMine: false,
    },
  ]);

  const addRoom = (newRoom: any) => {
    const roomWithMine = { ...newRoom, isMine: true };
    setChatRooms([...chatRooms, roomWithMine]);
  };

  const deleteRoom = (id: number, title: string) => {
    Alert.alert('삭제 확인', `'${title}' 방을 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => setChatRooms(chatRooms.filter(room => room.id !== id)),
      },
    ]);
  };

  // 🌟 검색 및 정렬 로직
  // 1. 검색어로 필터링
  // 2. sort를 사용하여 isMine이 true인 방을 상단으로 이동
  const processedRooms = chatRooms
    .filter(room => room.title.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => Number(b.isMine) - Number(a.isMine));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isSearching ? (
          <TextInput
            style={styles.searchInput}
            placeholder="방 제목을 검색하세요"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
        ) : (
          <Text style={styles.title}>오픈 채팅방</Text>
        )}

        <TouchableOpacity
          onPress={() => {
            setIsSearching(!isSearching);
            setSearchText('');
          }}
        >
          <Ionicons
            name={isSearching ? 'close' : 'search'}
            size={width * 0.08}
            color={MAIN_BROWN}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {processedRooms.map(room => (
          <View key={room.id} style={styles.card}>
            {room.isMine && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRoom(room.id, room.title)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('RoomInfo', { title: room.title })
              }
            >
              <View style={styles.thumbArea}>
                <Text style={styles.thumbEmoji}>{room.thumb}</Text>
              </View>
              <View style={styles.infoArea}>
                <Text style={styles.roomTag}>
                  {room.isMine ? '내가 만든 방' : '소통 공간'}
                </Text>
                <Text style={styles.roomTitle} numberOfLines={2}>
                  {room.title}
                </Text>
                <Text style={styles.roomTime}>{room.time}</Text>
                <View style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>참여하기</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.makeButton}
        onPress={() => navigation.navigate('CreateRoom', { onGoBack: addRoom })}
      >
        <Ionicons name="add-circle" size={30} color="#FFF" />
        <Text style={styles.makeButtonText}>채팅방 만들기</Text>
      </TouchableOpacity>
    </View>
  );
}

// (스타일 코드는 이전과 동일합니다)
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
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
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
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginRight: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: MAIN_BROWN,
  },
  roomTitle: {
    color: '#222222',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 28,
  },
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
  },
  makeButtonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 8,
  },
});

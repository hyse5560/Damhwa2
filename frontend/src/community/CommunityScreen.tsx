// CommunityScreen.tsx
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useCommunityList, { ChatRoomItem } from './useCommunityList';

const MAIN_BROWN = '#BF6A2A';
const SUB_BEIGE = '#FFF9F3';

export default function CommunityScreen() {
  const { width } = useWindowDimensions();

  // 🌟 커스텀 훅 구조분해 할당받음
  const {
    isSearching,
    searchText,
    setSearchText,
    processedRooms,
    handleToggleSearch,
    deleteRoom,
    navigateToRoom,
    navigateToCreateRoom,
  } = useCommunityList();

  return (
    <View style={styles.container}>
      {/* 상단 헤더 구역 */}
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

        <TouchableOpacity onPress={handleToggleSearch}>
          <Ionicons
            name={isSearching ? 'close' : 'search'}
            size={width * 0.08}
            color={MAIN_BROWN}
          />
        </TouchableOpacity>
      </View>

      {/* 채팅방 리스트 스크롤 뷰 */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {processedRooms.map((room: ChatRoomItem) => (
          <View key={room.room_id} style={styles.card}>
            {/* 내가 만든 방일 때만 쓰레기통 버튼 노출 */}
            {room.isMine && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRoom(room.room_id, room.room_name)} 
              >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigateToRoom(room)}>
              <View style={styles.thumbArea}>
                <Text style={styles.thumbEmoji}>{room.thumb}</Text>
              </View>
              <View style={styles.infoArea}>
                <Text style={styles.roomTag}>
                  {room.isMine ? '내가 만든 방' : '소통 공간'}
                </Text>
                <Text style={styles.roomTitle} numberOfLines={2}>
                  {room.room_name} {/* ⭕ room.title -> room.room_name */}
                </Text>
                <Text style={styles.roomTime}>
                  {/* ⭕ room.time -> DB생성 날짜 기반 문자열 포맷 표기 */}
                  {room.created_at ? new Date(room.created_at).toLocaleDateString() : '방금 전'}
                </Text>
                <View style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>참여하기</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* 하단 우측 플로팅 방 만들기 버튼 */}
      <TouchableOpacity style={styles.makeButton} onPress={navigateToCreateRoom}>
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
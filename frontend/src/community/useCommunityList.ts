// hooks/useCommunityList.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // 💡 HTTP 패치용 라이브러리 추가

// ⭕ 백엔드 Sequelize 모델과 규격 100% 일치화
export interface ChatRoomItem {
  room_id: number;      // DB: room_id (BIGINT)
  room_name: string;    // DB: room_name (STRING)
  description?: string; // DB: description (TEXT)
  created_at: string;   // DB: created_at (TIMESTAMP)
  thumb?: string;       // 프론트 UI 렌더링용 이모지 필드
  isMine?: boolean;     // 내 방 판별용 가상 필드
}

export function useCommunityList() {
  const navigation = useNavigation<any>();
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // 하드코딩 상태 제거 후 빈 배열로 초기화
  const [chatRooms, setChatRooms] = useState<ChatRoomItem[]>([]);

  // 🔄 화면 진입 시 서버 데이터 로드
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // 💡 백엔드 포트 및 라우터 경로에 맞게 주소를 수정하세요.
      const response = await axios.get('http://10.0.2.2:3000/api/room');
      
      // DB 기반 데이터에 프론트 전용 UI 속성 가공 매핑
      const mappedRooms = response.data.map((room: any) => ({
        ...room,
        thumb: room.thumb || '💬',
        isMine: room.isMine || false,
      }));

      setChatRooms(mappedRooms);
    } catch (error) {
      console.error('방 목록 로드 실패:', error);
      Alert.alert('오류', '방 목록을 불러올 수 없습니다.');
    }
  };

  // 새로운 방 생성 성공 시 목록 맨 앞에 추가할 콜백 함수
  const addRoom = (newRoom: ChatRoomItem) => {
    setChatRooms((prev) => [newRoom, ...prev]);
  };

  // 방 삭제 처리 함수 (Sequelize PK인 room_id로 요청)
  const deleteRoom = (roomId: number, roomName: string) => {
    Alert.alert('삭제 확인', `'${roomName}' 방을 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://localhost:3000/api/room/${roomId}`);
            setChatRooms((prev) => prev.filter((room) => room.room_id !== roomId));
          } catch (error) {
            console.error('방 삭제 오류:', error);
            Alert.alert('오류', '방 삭제 요청에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleToggleSearch = () => {
    setIsSearching(!isSearching);
    setSearchText('');
  };

  // 내비게이션 이동 시 실제 DB 컬럼 키값으로 파라미터 패싱
  const navigateToRoom = (room: ChatRoomItem) => {
    navigation.navigate('CommunityRoom', { 
      roomId: room.room_id.toString(), 
      title: room.room_name 
    });
  };

  const navigateToCreateRoom = () => {
    navigation.navigate('CreateRoom', { onGoBack: addRoom });
  };

  // 🌟 검색 및 정렬 (room_name 기준으로 대소문자 구분 없이 필터링)
  const processedRooms = chatRooms
    .filter((room) => room.room_name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => Number(b.isMine) - Number(a.isMine));

  return {
    isSearching,
    searchText,
    setSearchText,
    processedRooms,
    handleToggleSearch,
    deleteRoom,
    navigateToRoom,
    navigateToCreateRoom,
  };
}

export default useCommunityList;
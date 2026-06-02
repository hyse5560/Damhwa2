// hooks/useCreateRoom.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

export function useCreateRoom() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // ⭕ 방 생성하기 버튼 핸들러 (백엔드 DB 연동)
  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '채팅방 이름을 입력해주세요.');
      return;
    }

    try {
      // 💡 백엔드 Sequelize 모델 규격인 room_name과 description에 맞게 전송
      const response = await axios.post('http://10.0.2.2:3000/api/room', {
        room_name: title,
        description: desc,
      });

      // 백엔드에서 INSERT 성공 후 돌려준 진짜 객체 (예: { room_id: 12, room_name: '...', created_at: '...' })
      const newRoomFromServer = {
        ...response.data,
        thumb: '💬',    // 목록 화면 UI 렌더링용 기본 썸네일 주입
        isMine: true,   // 내가 방금 생성했으므로 true 마킹
      };

      // 🌟 이전 화면(CommunityScreen)의 addRoom 콜백 함수로 진짜 데이터 전달
      if (route.params?.onGoBack) {
        route.params.onGoBack(newRoomFromServer);
      }

      Alert.alert('성공', '새로운 채팅방이 생성되었습니다!');
      navigation.goBack();
    } catch (error) {
      console.error('채팅방 생성 에러:', error);
      Alert.alert('오류', '채팅방을 생성하지 못했습니다.');
    }
  };

  return {
    title,
    setTitle,
    desc,
    setDesc,
    handleCreate,
  };
}
export default useCreateRoom;
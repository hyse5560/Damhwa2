//useChatRoom.ts
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://10.0.2.2:3000'; // 💡 백엔드 호스트 서버 주소에 맞게 수정하세요.

export interface ChatMessage {
  id: string;
  name: string;
  text: string;
  time: string;
  isMe: boolean;
}

export function useChatRoom(roomId: string, userId: string, userName: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const socketRef = useRef<Socket | null>(null);

  // 한국 오전/오후 시간 표기 변환 함수
  const getCurrentTimeKorean = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 ? hours % 12 : 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${ampm} ${displayHours}:${displayMinutes}`;
  };

  useEffect(() => {
    // 💡 동적 로그인 유저 정보가 로드되기 전(빈 값일 때)에는 소켓 연결을 대기합니다.
    if (!roomId || !userId) return;

    // 1. 소켓 커넥션 연결
    socketRef.current = io(SERVER_URL);
    const socket = socketRef.current;

    // 2. 방 입장 요청 (Sequelize room_id 주입)
    socket.emit('room:join', { roomId, userId });

    // 3. 백엔드 브로드캐스트 이벤트 리스너 수신 처리
    
    // 이웃이 보낸 메시지 처리
    socket.on('room:message', (payload: any) => {
      // 내가 보낸 메시지는 handleSendMessage에서 선반영하므로 중복 방지 처리
      if (payload.userId !== userId) {
        const incomingMsg: ChatMessage = {
          id: payload.messageId ? payload.messageId.toString() : Date.now().toString(), 
          name: payload.userName || `이웃 (${payload.userId})`,
          text: payload.content, // 백엔드 content 컬럼 대응
          time: getCurrentTimeKorean(),
          isMe: false,
        };
        setMessages((prev) => [...prev, incomingMsg]);
      }
    });

    // 다른 유저 입장 시
    socket.on('room:user_joined', (data: any) => {
      setMemberCount((prev) => prev + 1);
    });

    // 다른 유저 퇴장 시
    socket.on('room:user_left', (data: any) => {
      setMemberCount((prev) => Math.max(1, prev - 1));
    });

    // 백엔드 비즈니스 로직 에러 캐치
    socket.on('room:error', (err: any) => {
      console.error('[Socket Room Error]', err.message);
    });

    // 4. 언마운트 해제 시 소켓 반환 및 방 퇴장
    return () => {
      socket.emit('room:leave', { roomId, userId });
      socket.disconnect();
    };
  }, [roomId, userId]);

  // 메시지 올리기(전송) 함수
  const handleSendMessage = () => {
    if (!inputText.trim() || !socketRef.current || !userId) return;

    // 1. 내 화면에 메시지 즉각 렌더링 (Optimistic Update)
    const myMsg: ChatMessage = {
      id: Date.now().toString(),
      name: `${userName} (나)`,
      text: inputText,
      time: getCurrentTimeKorean(),
      isMe: true,
    };
    setMessages((prev) => [...prev, myMsg]);

    // 2. 백엔드로 소켓 데이터 발송
    socketRef.current.emit('room:message', {
      roomId,
      userId,
      userName, // 💡 내 닉네임도 함께 송신하여 상대 화면에 이름이 나오도록 확장
      content: inputText,
    });

    setInputText('');
  };

  return {
    messages,
    inputText,
    setInputText,
    memberCount,
    handleSendMessage,
  };
}
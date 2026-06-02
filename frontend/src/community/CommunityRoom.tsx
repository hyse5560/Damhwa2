// screens/CommunityRoom.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useChatRoom, ChatMessage } from './useChatRoom';

const MAIN_BROWN = '#BF6A2A';
const SUB_BEIGE = '#FFF9F3';
const TEXT_DARK = '#333333';

export default function CommunityRoom() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  // 앞선 목록 화면(CommunityScreen)에서 보낸 데이터 안착
  const currentRoomTitle = route.params?.title || '채팅방';
  const roomId = route.params?.roomId || ''; 

  // 유저 정보를 관리하는 동적 상태
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // 컴포넌트 마운트 시 스토리지에서 실제 로그인 유저 인적사항 획득
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 🌟 수정: 회원가입/로그인 스펙에 맞춰 Key 이름을 'user_id'와 'name'으로 변경!
        const storedId = await AsyncStorage.getItem('user_id');
        const storedName = await AsyncStorage.getItem('name');
        
        if (storedId && storedName) {
          setUserId(storedId);
          setUserName(storedName);
          console.log("🟢 채팅방 로그인 세션 연동 성공! 회원번호:", storedId);
        } else {
          // 💡 로그인 정보가 유실되었을 때 MySQL 에러 방지를 위해 
          // 테이블에 존재하는 진짜 회원 고유번호(예: '1')를 안전망으로 설정합니다.
          setUserId('1'); 
          setUserName('임시 이웃');
          console.warn("⚠️ 로그인 세션을 찾지 못해 임시로 1번 유저로 우회합니다.");
        }
      } catch (e) {
        console.error('유저 정보 세션 로드 실패', e);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, []);

  // 동적으로 로드된 정보를 커스텀 훅에 바인딩
  const {
    messages,
    inputText,
    setInputText,
    memberCount,
    handleSendMessage,
  } = useChatRoom(roomId, userId, userName);

  // 대화가 추가될 때 스크롤 포커스를 맨 밑으로 밀어주는 리스너
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessageItem = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageCard, item.isMe && styles.myMessageCard]}>
      {!item.isMe && (
        <View style={styles.avatarCircle}>
          <Ionicons
            name="person-circle"
            size={width * 0.1}
            color={MAIN_BROWN}
          />
        </View>
      )}

      <View style={styles.messageContentArea}>
        {!item.isMe && <Text style={styles.memberName}>{item.name}</Text>}

        <View style={[styles.bubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, item.isMe && styles.myMessageText]}>
            {item.text}
          </Text>
        </View>
        <Text style={[styles.timeText, item.isMe && styles.myTimeText]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  // 세션 로딩 중 인디케이터 서브 렌더링
  if (loadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: SUB_BEIGE }}>
        <ActivityIndicator size="large" color={MAIN_BROWN} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 상단바 (타이틀바) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.padBtn}>
            <Ionicons name="chevron-back" size={34} color={TEXT_DARK} />
          </TouchableOpacity>

          <View style={styles.titleArea}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {currentRoomTitle}
            </Text>
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={14} color={MAIN_BROWN} />
              <Text style={styles.locationBadgeText}>반경 2km 이내 이웃 소통 중</Text>
            </View>
          </View>

          <View style={styles.memberCountBadge}>
            <Ionicons name="people" size={20} color="#666" />
            <Text style={styles.memberCountText}>{memberCount}명</Text>
          </View>
        </View>

        {/* 중앙 대화창 */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messageList,
            messages.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={70} color="#CCC" />
              <Text style={styles.emptyText}>
                우리 동네 대화방에 오신 것을 환영합니다.{'\n'}
                아래 창에 첫 인사를 남겨보세요!
              </Text>
            </View>
          }
        />

        {/* 하단 입력바 */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder="여기를 누르고 글을 쓰세요"
            placeholderTextColor="#A0A0A0"
            value={inputText}
            onChangeText={setInputText}
            maxLength={150}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>올리기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: SUB_BEIGE },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1.5, borderColor: '#EAEAEA' },
  padBtn: { padding: 5, minWidth: 40 },
  titleArea: { flex: 1, alignItems: 'center', marginHorizontal: 5 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: TEXT_DARK, textAlign: 'center' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF1E6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4 },
  locationBadgeText: { fontSize: 12, fontWeight: '800', color: MAIN_BROWN, marginLeft: 3 },
  memberCountBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, minWidth: 55, justifyContent: 'center' },
  memberCountText: { fontSize: 15, fontWeight: '800', color: '#444444', marginLeft: 4 },
  messageList: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 20 },
  emptyList: { flex: 1, justifyContent: 'center' },
  messageCard: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  myMessageCard: { justifyContent: 'flex-end' },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', marginRight: 10 },
  messageContentArea: { maxWidth: '75%' },
  memberName: { fontSize: 16, fontWeight: '800', color: '#555555', marginBottom: 5 },
  bubble: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1 },
  otherBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#E2E2E2' },
  myBubble: { backgroundColor: MAIN_BROWN, borderTopRightRadius: 4 },
  messageText: { fontSize: 21, fontWeight: '700', color: TEXT_DARK, lineHeight: 28 },
  myMessageText: { color: '#FFFFFF' },
  timeText: { fontSize: 13, color: '#888888', marginTop: 4, alignSelf: 'flex-start' },
  myTimeText: { alignSelf: 'flex-end' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#777777', textAlign: 'center', lineHeight: 26, marginTop: 15 },
  inputArea: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, borderTopWidth: 1.5, borderColor: '#EAEAEA', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#F3F3F3', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 18, fontWeight: '700', color: TEXT_DARK, borderWidth: 1.5, borderColor: '#E0E0E0', marginRight: 10 },
  sendButton: { backgroundColor: MAIN_BROWN, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  sendButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
});
import React, { useState, useRef, useEffect } from 'react';
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
  SafeAreaView, // 🌟 상단바 밀착 및 노치 대응
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const MAIN_BROWN = '#BF6A2A';
const SUB_BEIGE = '#FFF9F3';
const TEXT_DARK = '#333333';

interface ChatMessage {
  id: string;
  name: string;
  text: string;
  time: string;
  isMe: boolean;
}

export default function CommunityRoom() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const currentRoomTitle = route.params?.title || '오늘 아침 신문 이야기';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [memberCount, setMemberCount] = useState(1);

  useEffect(() => {
    // 실시간 소켓/Firebase 인원수 및 메시지 연동 구역
  }, []);

  const getCurrentTimeKorean = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 ? hours % 12 : 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${ampm} ${displayHours}:${displayMinutes}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      name: '김순희 (나)',
      text: inputText,
      time: getCurrentTimeKorean(),
      isMe: true,
    };

    setMessages(prevMessages => [...prevMessages, newMsg]);
    setInputText('');
  };

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

        <View
          style={[
            styles.bubble,
            item.isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 상단바 (타이틀바) */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.padBtn}
          >
            <Ionicons name="chevron-back" size={34} color={TEXT_DARK} />
          </TouchableOpacity>

          <View style={styles.titleArea}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {currentRoomTitle}
            </Text>
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={14} color={MAIN_BROWN} />
              <Text style={styles.locationBadgeText}>
                반경 2km 이내 이웃 소통 중
              </Text>
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
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.messageList,
            messages.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={70}
                color="#CCC"
              />
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
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendButtonText}>올리기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: SUB_BEIGE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderColor: '#EAEAEA',
  },
  padBtn: { padding: 5, minWidth: 40 },
  titleArea: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: TEXT_DARK,
    textAlign: 'center',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: MAIN_BROWN,
    marginLeft: 3,
  },
  memberCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 55,
    justifyContent: 'center',
  },
  memberCountText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#444444',
    marginLeft: 4,
  },
  messageList: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 20,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  myMessageCard: {
    justifyContent: 'flex-end',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  messageContentArea: {
    maxWidth: '75%',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#555555',
    marginBottom: 5,
  },
  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  myBubble: {
    backgroundColor: MAIN_BROWN,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 21,
    fontWeight: '700',
    color: TEXT_DARK,
    lineHeight: 28,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 13,
    color: '#888888',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  myTimeText: {
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#777777',
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 15,
  },
  inputArea: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1.5,
    borderColor: '#EAEAEA',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: MAIN_BROWN,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});

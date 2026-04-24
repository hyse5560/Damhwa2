import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
// 1. expo-router 대신 react-navigation 라이브러리 사용
import { useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

interface ChatMessage {
  id?: number | string;
  role: 'elder' | 'assistant' | 'ai';
  content: string;
}

const userId = '1';
// 실제 서버 IP (안드로이드 에뮬레이터는 보통 10.0.2.2 사용)
const BASE_URL = 'http://10.0.2.2:3000';

export default function HistoryDetailScreen() {
  // 2. route.params를 통해 전달받은 데이터 추출
  const route = useRoute<any>();
  const { id, title, date } = route.params || {};

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchChatDetail = async () => {
        if (!id) return; // ID가 없으면 실행 방지
        setLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}/api/chat/detail/${userId}/${id}`,
          );
          if (isActive) {
            setMessages(response.data);
          }
        } catch (error) {
          console.error('대화 내역 로딩 실패:', error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchChatDetail();
      return () => {
        isActive = false;
      };
    }, [id]),
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isElder = item.role === 'elder';

    return (
      <View
        style={[
          styles.bubbleContainer,
          isElder ? styles.elderAlign : styles.aiAlign,
        ]}
      >
        {!isElder && <Text style={styles.senderName}>담화 친구</Text>}
        <View
          style={[
            styles.bubble,
            isElder ? styles.elderBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isElder ? styles.elderText : styles.aiText,
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 안드로이드 상단바 겹침 방지 */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerDate}>{date || '날짜 정보 없음'}</Text>
        <Text style={styles.headerTitle}>{title || '제목 없음'}</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#B36A3C" />
          <Text style={styles.loadingText}>내용을 불러오는 중입니다...</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>대화 기록이 없습니다.</Text>
          }
          // 네이티브 성능 향상을 위한 옵션
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    // 안드로이드 SafeArea 수동 보정
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  headerDate: { fontSize: 14, color: '#888' },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#333',
  },
  chatList: { padding: 20 },
  bubbleContainer: { marginBottom: 20, maxWidth: '85%' },
  elderAlign: { alignSelf: 'flex-end' },
  aiAlign: { alignSelf: 'flex-start' },
  senderName: {
    fontSize: 14,
    color: '#B36A3C',
    fontWeight: '600',
    marginBottom: 5,
    marginLeft: 5,
  },
  bubble: { padding: 16, borderRadius: 22 },
  elderBubble: { backgroundColor: '#B36A3C', borderBottomRightRadius: 2 },
  aiBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  messageText: { fontSize: 19, lineHeight: 28 },
  elderText: { color: '#FFF' },
  aiText: { color: '#222' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, color: '#888', fontSize: 16 },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#BBB',
    fontSize: 16,
  },
});

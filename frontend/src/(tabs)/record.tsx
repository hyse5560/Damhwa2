import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:3000/api/chat';

export default function record() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  // 1. 데이터 불러오기 (서버 응답 구조 반영)
  const loadHistory = async () => {
    try {
      setLoading(true);
      // 유저 ID 1번 기준으로 호출
      const response = await axios.get(`${API_BASE_URL}/history/1`);

      // 서버 라우터가 { success: true, data: [...] } 형식이므로 response.data.data를 확인
      const rawData = response.data && Array.isArray(response.data.data) ? response.data.data : [];

      const formattedData = [
        {
          title: '지난 대화',
          data: rawData.map((item: any) => ({
            id: item.chat_id?.toString() || Math.random().toString(), // Chat 모델의 PK는 chat_id
            title: item.content || '내용 없는 대화', // Chat 모델의 내용은 content
            date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '날짜 정보 없음',
            fullDate: item.created_at, // 상세 페이지 전달용 전체 날짜
          })),
        },
      ];
      setSections(formattedData);
    } catch (error) {
      console.error('기록 로드 에러:', error);
      setSections([]);
      Alert.alert('알림', '대화 기록을 불러오는 데 문제가 생겼어요.');
    } finally {
      setLoading(false);
    }
  };

  // 2. 삭제 로직
  const handleDelete = (id: string, title: string) => {
    Alert.alert('이 대화를 지울까요?', `'${title.substring(0, 10)}...' 대화 내용이 사라집니다.`, [
      { text: '아니오', style: 'cancel' },
      {
        text: '지워주세요',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/history/${id}`);
            loadHistory();
          } catch (error) {
            Alert.alert('오류', '삭제하지 못했습니다.');
          }
        },
      },
    ]);
  };

  // 3. 상세 이동
  const handlePressItem = (id: string, title: string, date: string) => {
    navigation.navigate('HistoryDetail', { id, title, date });
  };

  // 4. 검색 필터링 로직
  const filteredData = useMemo(() => {
    if (!Array.isArray(sections)) return [];

    return sections
      .map(section => ({
        ...section,
        data: (section.data || []).filter((item: any) => {
          const title = (item.title || '').toLowerCase();
          const date = (item.date || '').toLowerCase();
          const query = (searchQuery || '').toLowerCase();
          return title.includes(query) || date.includes(query);
        }),
      }))
      .filter(section => section.data && section.data.length > 0);
  }, [sections, searchQuery]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B36A3C" />
        <Text style={styles.loadingText}>기록을 찾고 있어요...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>담화 기록장</Text>
        <TouchableOpacity onPress={loadHistory} style={styles.refreshBtn}>
          <Text style={{ fontSize: 24 }}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={{ fontSize: 20, marginRight: 10 }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="언제 나눈 대화인가요?"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredData.length > 0 ? (
        <SectionList
          sections={filteredData}
          keyExtractor={item => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handlePressItem(item.id, item.title, item.date)}
              >
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>
                <Text style={{ fontSize: 20, color: '#CCC' }}>〉</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Text style={{ fontSize: 20 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 60 }}>💬</Text>
          <Text style={styles.emptyText}>아직 나누신 대화가 없네요.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 18, color: '#666' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 34, fontWeight: '800', color: '#333' },
  refreshBtn: { padding: 5 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
  },
  searchInput: { flex: 1, fontSize: 18, marginLeft: 10, color: '#000' },
  sectionHeader: {
    backgroundColor: '#FFF3E0',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeaderText: { fontSize: 18, fontWeight: '700', color: '#B36A3C' },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  itemTextContainer: { flex: 1 },
  itemTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  itemDate: { fontSize: 16, color: '#888' },
  deleteBtn: {
    padding: 15,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: { fontSize: 22, color: '#999', marginTop: 15 },
});
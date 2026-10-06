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
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:3000/api/chat';

// 🌟 6월 1일 촬영용 임시 시나리오 데이터 정의
const MOCK_HISTORY_DATA = [
  {
    id: 'scen_01',
    title:
      '오전 10시에 딸이랑 쇼핑 갔다왔어. 시내앞에 백화점이 있다길래 갔다왔어.',
    date: '2026. 6. 1.',
    fullDate: '2026-06-01T10:00:00.000Z',
  },
];

export default function Record() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      /* ----------------------------------------------------
       * 🌟 [시연용 0.5초 타이머 제한 기능 추가]
       * 서버가 무한 대기를 타거나 느려도 500ms(0.5초) 안에 무조건 패스합니다.
       * ---------------------------------------------------- */
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('시연용 네트워크 타임아웃')), 500),
      );

      const response: any = await Promise.race([
        axios.get(`${API_BASE_URL}/history/1`),
        timeoutPromise,
      ]).catch(() => null); // 에러 또는 타임아웃 발생 시 null 반환

      let rawData =
        response && response.data && Array.isArray(response.data.data)
          ? response.data.data
          : [];

      // 실서버 데이터 포맷팅
      const serverData = rawData.map((item: any) => ({
        id: item.chat_id?.toString() || Math.random().toString(),
        title: item.content || '내용 없는 대화',
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : '날짜 정보 없음',
        fullDate: item.created_at,
      }));

      // 촬영 데이터와 결합
      const formattedData = [
        {
          title: '지난 대화',
          data: [...MOCK_HISTORY_DATA, ...serverData],
        },
      ];
      setSections(formattedData);
    } catch (error) {
      console.error('기록 로드 에러:', error);
      // 에러 발생 시에도 안전하게 Mock 데이터 노출
      setSections([
        {
          title: '지난 대화',
          data: MOCK_HISTORY_DATA,
        },
      ]);
    } finally {
      // 🌟 무조건 0.5초 이내에 로딩이 종료되도록 보장합니다.
      setLoading(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    console.log('삭제 버튼 클릭됨:', id);

    Alert.alert(
      '이 대화를 지울까요?',
      `'${title.substring(0, 10)}...' 대화 내용이 사라집니다.`,
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '지워주세요',
          style: 'destructive',
          onPress: async () => {
            if (id.startsWith('scen_')) {
              setSections(prev =>
                prev
                  .map(section => ({
                    ...section,
                    data: section.data.filter((item: any) => item.id !== id),
                  }))
                  .filter(section => section.data.length > 0),
              );
              return;
            }

            try {
              await axios.delete(`${API_BASE_URL}/history/${id}`);
              loadHistory();
            } catch (error) {
              Alert.alert('오류', '삭제하지 못했습니다.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handlePressItem = (id: string, title: string, date: string) => {
    navigation.navigate('HistoryDetail', { id, title, date });
  };

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
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>담화 기록장</Text>

        <TouchableOpacity onPress={loadHistory} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.bigHeaderTitle}>기록장</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
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
                <Text style={{ fontSize: 20, color: '#CCC', marginRight: 10 }}>
                  〉
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Ionicons name="trash-outline" size={24} color="#1E88E5" />
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
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  appBarTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  backBtn: { padding: 5 },
  refreshBtn: { padding: 5 },
  bigHeaderTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    marginLeft: 20,
    color: '#333',
  },
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
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: { fontSize: 22, color: '#999', marginTop: 15 },
});

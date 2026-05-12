import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const faqData = [
  {
    id: 1,
    q: '음성 대화는 어떻게 하나요?',
    a: '홈 화면에서 큰 "음성대화" 버튼을 누르고 마이크 버튼을 누른 채 말씀하시면 됩니다.',
  },
  {
    id: 2,
    q: '글자 크기를 더 크게 하고 싶어요.',
    a: '설정 > 소리 및 글자 크기 메뉴에서 "크게"를 선택하시면 됩니다.',
  },
  {
    id: 3,
    q: '사이버 경로당이 무엇인가요?',
    a: 'AI 도우미 다마와 음성대화를 할 수 있습니다. 또한 다른 어르신들과 소통하고 다양한 정보를 나눌 수 있는 공간입니다.',
  },
];

export default function FAQScreen() {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>자주 묻는 질문</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {faqData.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.faqItem}
            activeOpacity={0.7}
            onPress={() => toggleExpand(item.id)}
          >
            <View style={styles.questionRow}>
              <Text style={styles.questionText}>Q. {item.q}</Text>
              <Ionicons
                name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#888"
              />
            </View>
            {expandedId === item.id && (
              <View style={styles.answerBox}>
                <Text style={styles.answerText}>{item.a}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  content: { padding: 20 },
  faqItem: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  answerBox: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  answerText: { fontSize: 16, color: '#666', lineHeight: 24 },
});

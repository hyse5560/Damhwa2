import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
// 네비게이션 훅 가져오기
import { useNavigation } from '@react-navigation/native';

export default function ModalScreen() {
  const navigation = useNavigation();

  return (
    // 1. ThemedView 대신 View 사용
    <View style={styles.container}>
      {/* 2. ThemedText 대신 Text 사용 */}
      <Text style={styles.title}>알림</Text>

      <Text style={styles.message}>이것은 안내 모달 화면입니다.</Text>

      {/* 3. 돌아가기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', // 배경색 명시
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#BF6A2A',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

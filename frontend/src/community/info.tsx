import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// Expo가 아닌 react-native-vector-icons에서 직접 가져옵니다.
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RoomInfo() {
  return (
    <View style={styles.container}>
      {/* 순수 네이티브 아이콘 컴포넌트 */}
      <Ionicons name="information-circle" size={80} color="#BF6A2A" />

      <Text style={styles.text}>방 정보 화면입니다.</Text>

      <TouchableOpacity
        style={styles.button}
        // React Native 기본 Alert 객체 사용
        onPress={() => Alert.alert('입장', '채팅방에 입장하시겠습니까?')}
      >
        <Text style={styles.buttonText}>입장하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: { fontSize: 24, marginVertical: 20, color: '#333' },
  button: {
    backgroundColor: '#BF6A2A',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  buttonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});

// screens/CreateRoomScreen.tsx
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import useCreateRoom from './useCreateRoom'; // 🌟 분리한 훅 로드

export default function CreateRoomScreen() {
  // 🌟 커스텀 훅으로부터 필요한 데이터와 핸들러 함수 구조분해 할당
  const {
    title,
    setTitle,
    desc,
    setDesc,
    handleCreate,
  } = useCreateRoom();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>채팅방 이름</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="이름을 입력하세요"
      />

      <Text style={styles.label}>방 소개</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={desc}
        onChangeText={setDesc}
        placeholder="방을 소개해 주세요"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>생성하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#BF6A2A',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
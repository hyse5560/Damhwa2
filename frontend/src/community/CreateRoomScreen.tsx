import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';

export default function CreateRoomScreen({ navigation, route }: any) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = () => {
    if (!title) {
      Alert.alert('알림', '채팅방 이름을 입력해주세요.');
      return;
    }

    // 🌟 새로운 방 데이터 생성
    const newRoom = {
      id: Date.now(), // 고유한 ID 생성
      title: title,
      time: '방금 생성됨', // 필요에 따라 시간 입력 로직 추가 가능
      thumb: '💬',
    };

    // 🌟 이전 화면(CommunityScreen)에서 전달받은 onGoBack 함수가 있다면 실행
    if (route.params?.onGoBack) {
      route.params.onGoBack(newRoom);
    }

    Alert.alert('성공', '새로운 채팅방이 생성되었습니다!');
    navigation.goBack();
  };

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

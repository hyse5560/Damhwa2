import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function EditProfile() {
  const navigation = useNavigation();
  const [name, setName] = useState('사용자');
  const [phone, setPhone] = useState('010-1234-5678');

  const handleSave = () => {
    Alert.alert('저장 완료', '회원 정보가 수정되었습니다.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 정보 수정</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#FFF" />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력하세요"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>휴대폰 번호</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="번호를 입력하세요"
          />
        </View>

        <Text style={styles.infoText}>
          * 개인정보는 서비스 제공을 위해서만 사용됩니다.
        </Text>
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
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  saveBtn: { fontSize: 17, fontWeight: '700', color: '#BF6A2A' },
  content: { padding: 20 },
  avatarSection: { alignItems: 'center', marginVertical: 30 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#BF6A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 20,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#888',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    fontSize: 17,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  infoText: { textAlign: 'center', color: '#AAA', fontSize: 13, marginTop: 10 },
});

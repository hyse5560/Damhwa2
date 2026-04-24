import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
// 1. useRouter 대신 useNavigation 도입
import { useNavigation } from '@react-navigation/native';

const MAIN_BROWN = '#BF6A2A';

export default function SignUpScreen() {
  // 2. 네비게이션 객체 초기화
  const navigation = useNavigation<any>();

  // 상태값 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignUp = async () => {
    // 유효성 검사
    if (!email.includes('@') || password.length < 6 || nickname.length < 2) {
      Alert.alert(
        '확인해 주세요',
        '이메일 형식과 비밀번호(6자 이상),\n이름을 모두 정확히 입력해 주세요.',
      );
      return;
    }

    try {
      // 가상 DB 저장 로직 (로그 출력)
      console.log('회원가입 정보:', { email, password, nickname });

      Alert.alert('환영합니다!', `${nickname}님, 가입이 완료되었습니다.`, [
        {
          text: '확인',
          // 3. 가입 완료 후 히스토리를 비우고 메인으로 이동 (replace)
          onPress: () => navigation.replace('(tabs)'),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', '서버와 연결이 원활하지 않습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>
              담화와 함께 소중한 일상을{'\n'}기록하고 나누어 보세요.
            </Text>
          </View>

          <View style={styles.form}>
            {/* 이메일 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일 주소</Text>
              <TextInput
                style={styles.input}
                placeholder="예: damhwa@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false} // 자동 완성 방지 (로그인 시 불편함 감소)
                placeholderTextColor="#AAA"
              />
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 (6자 이상)</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholderTextColor="#AAA"
              />
            </View>

            {/* 닉네임 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>성함 또는 별명</Text>
              <TextInput
                style={styles.input}
                placeholder="어르신을 어떻게 불러드릴까요?"
                value={nickname}
                onChangeText={setNickname}
                placeholderTextColor="#AAA"
                returnKeyType="done" // 키보드 완료 버튼 표시
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>가입 완료하고 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()} // 4. 이전 화면으로 돌아가기
          >
            <Text style={styles.backText}>이전으로 돌아가기</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollInner: { padding: 30, paddingBottom: 50 },
  header: { marginTop: 20, marginBottom: 40 },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: MAIN_BROWN,
    marginBottom: 12,
  },
  subtitle: { fontSize: 18, color: '#666', lineHeight: 26 },
  form: { marginBottom: 40 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '700', color: '#444', marginBottom: 10 },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#EEE',
    borderRadius: 15,
    padding: 18,
    fontSize: 18,
    color: '#000',
  },
  submitButton: {
    backgroundColor: MAIN_BROWN,
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitText: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  backButton: { marginTop: 25, alignItems: 'center' },
  backText: { color: '#AAA', fontSize: 16, textDecorationLine: 'underline' },
});

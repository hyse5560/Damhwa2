import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAIN_BROWN = '#BF6A2A';

interface Props {
  name: string;
  setName: (text: string) => void;
  phone: string;
  setPhone: (text: string) => void;
  loading: boolean;
  onSignUp: () => void;
  onBack: () => void;
}

export default function SignUpPresenter({
  name,
  setName,
  phone,
  setPhone,
  loading,
  onSignUp,
  onBack,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollInner}>
          <View style={styles.header}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>
              이름과 전화번호를 입력해 주세요.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>성함</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="성함을 입력하세요"
              placeholderTextColor="#ccc"
            />

            <Text style={styles.label}>전화번호</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="01012345678"
              placeholderTextColor="#ccc"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={onSignUp}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? '처리 중...' : '가입 완료'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>이전으로</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollInner: { padding: 30, flexGrow: 1, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#666' },
  form: { marginBottom: 30 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#333' },
  input: {
    borderBottomWidth: 2,
    borderColor: MAIN_BROWN,
    fontSize: 20,
    paddingVertical: 12,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: MAIN_BROWN,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  backButton: { padding: 10 },
  backText: { textAlign: 'center', color: '#999', fontSize: 16 },
});

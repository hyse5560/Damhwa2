import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useSignUp() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // 💡 [테스트용 임시 프리패스 함수]
  // 이름이나 전화번호를 입력하지 않고 그냥 '가입 완료' 버튼만 눌러도 바로 메인 화면으로 이동합니다.
  const handleSignUp = async () => {
    setLoading(true);
    try {
      // 나중에 앱을 다시 켰을 때도 회원가입을 건너뛰도록 상태를 임시 저장합니다.
      await AsyncStorage.setItem('userRegistered', 'true');

      // 홈 + 음성대화가 들어있는 메인 화면으로 강제 리셋 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (e: any) {
      console.error('임시 로그인 이동 실패:', e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    loading,
    handleSignUp, // 👈 프리패스 기능이 연결된 함수
    goBack: () => navigation.goBack(),
  };
}

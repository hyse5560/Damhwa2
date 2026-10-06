import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useSignUp = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('알림', '이름과 전화번호를 모두 입력해 주세요.');
      return;
    }
    try {
      setLoading(true);
      console.log('회원가입 패스 로직 실행:', { name, phone });
      navigation.replace('MainTabs');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 뒤로가기 함수 추가
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log('뒤로 이동할 스택이 없습니다.');
    }
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    loading,
    handleSignUp,
    goBack, // 🌟 여기에 goBack을 추가해야 구조 분해 할당 에러가 안 납니다!
  };
};

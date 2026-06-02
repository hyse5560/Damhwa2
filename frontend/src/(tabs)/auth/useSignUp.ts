import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 1. 추가

export function useSignUp() {
  const navigation = useNavigation<any>();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:3000' 
    : 'http://localhost:3000';

  const getFcmToken = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('알림 권한이 거부되었습니다.');
        return null;
      }

      const token = await messaging().getToken();
      console.log('발급된 FCM 토큰:', token);
      return token;
    } catch (error) {
      console.error('FCM 토큰 발급 실패:', error);
      return null;
    }
  };

  const handleSignUp = async () => {
    if (!name || !phone) {
      Alert.alert('입력 오류', '이름과 전화번호를 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const fcmToken = await getFcmToken();

      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        name,
        phone,
        push_token: fcmToken,
      });

      if (response.data.success) {
        const user = response.data.data;

        // ✅ 2. 가입 완료 상태 저장 (App.tsx에서 체크할 키값)
        await AsyncStorage.setItem('userRegistered', 'true');

        Alert.alert('환영합니다!', `${user.name}님, 가입 완료!`, [
          { 
            text: '확인', 
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            }) 
          },
        ]);
      }
    } catch (e: any) {
      console.error('Signup Error:', e.message);
      Alert.alert('연결 오류', '서버 또는 네트워크 상태를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  return {
    name, setName,
    phone, setPhone,
    loading, handleSignUp,
    goBack: () => navigation.goBack(),
  };
}
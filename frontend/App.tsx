import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  PermissionsAndroid,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { audioService } from './src/(tabs)/voice/audioService';

// 네비게이션 및 메인 화면들
import MainTabNavigator from './src/navigation/MainTabNavigator';
import Onboarding from './src/onboarding';
import SignUpScreen from './src/(tabs)/auth/index';
import CommunityScreen from './src/community/CommunityScreen';
import RoomInfo from './src/community/info';
import CommunityRoom from './src/community/CommunityRoom';

// 기능 화면들
import Record from './src/(tabs)/record';
import VoiceScreen from './src/(tabs)/voice/VoiceScreen';
import schedule from './src/(tabs)/schedule';

// 🌟 [수정 포인트] HistoryDetail 파일이 src/(tabs)/ 폴더 안에 있으므로 경로를 맞춰 임포트합니다.
import HistoryDetail from './src/(tabs)/HistoryDetail';

// 설정 화면들
import NotificationSettings from './src/setting/NotificationSettings';
import AccessibilitySettings from './src/setting/AccessibilitySettings';
import EditProfile from './src/setting/EditProfile';
import FAQScreen from './src/setting/FAQScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Onboarding');

  useEffect(() => {
    const initNotifications = async () => {
      try {
        // Android 13+ 알림 권한 요청
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          // Notification Channel 생성
          await notifee.createChannel({
            id: 'default',
            name: '기본 알림',
            importance: AndroidImportance.HIGH,
          });
        }

        // Foreground FCM 수신 처리
        messaging().onMessage(async remoteMessage => {
          console.log('🔥 Foreground FCM:', remoteMessage);

          await notifee.displayNotification({
            title: remoteMessage.notification?.title || '알림',
            body: remoteMessage.notification?.body || '',
            android: {
              channelId: 'default',
              pressAction: {
                id: 'default',
              },
            },
          });
        });
      } catch (err) {
        console.error('FCM 초기화 에러:', err);
      }
    };

    const initApp = async () => {
      // 1. 알림 초기화
      await initNotifications();

      // 2. 앱 시작 시 TTS 캐시 초기화
      if (audioService && typeof audioService.clearCache === 'function') {
        audioService.clearCache();
      }

      // 3. 마이크 권한 요청
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: '마이크 사용 권한',
              message: '어르신과의 대화를 위해 마이크 권한이 필요합니다.',
              buttonNeutral: '나중에',
              buttonNegative: '거절',
              buttonPositive: '허용',
            },
          );
        } catch (err) {
          console.warn(err);
        }
      }

      // 4. 온보딩 여부 확인
      try {
        const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
        if (alreadyLaunched !== null) {
          setInitialRoute('Auth');
        }
      } catch (e) {
        console.error('AsyncStorage Error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  // 로딩 화면
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color="#B36A3C" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom', // 시니어 인지 속도에 맞춘 안정감 있는 상향 전환 효과
        }}
      >
        {/* 온보딩 */}
        <Stack.Screen name="Onboarding" component={Onboarding} />

        {/* 회원가입 */}
        <Stack.Screen name="Auth" component={SignUpScreen} />

        {/* 메인 탭 */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

        {/* 프로필 수정 */}
        <Stack.Screen name="EditProfile" component={EditProfile} />

        {/* 설정 */}
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
        />
        <Stack.Screen
          name="AccessibilitySettings"
          component={AccessibilitySettings}
        />

        {/* FAQ */}
        <Stack.Screen name="FAQScreen" component={FAQScreen} />

        {/* 커뮤니티 및 주요 기능 화면들 */}
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="RoomInfo" component={RoomInfo} />
        <Stack.Screen name="CommunityRoom" component={CommunityRoom} />

        <Stack.Screen name="RecordScreen" component={Record} />
        <Stack.Screen name="VoiceScreen" component={VoiceScreen} />
        <Stack.Screen name="ScheduleScreen" component={schedule} />

        {/* 🌟 [추가 등록] record에서 호출하는 상세 화면을 스택 라우터에 바인딩합니다. */}
        <Stack.Screen name="HistoryDetail" component={HistoryDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

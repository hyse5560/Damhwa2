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
import notifee, {
  AndroidImportance,
} from '@notifee/react-native';

import { audioService } from './src/(tabs)/voice/audioService';

// 네비게이션 및 메인 화면들
import MainTabNavigator from './src/navigation/MainTabNavigator';
import Onboarding from './src/onboarding';
import SignUpScreen from './src/(tabs)/auth/index';
import CommunityScreen from './src/community/CommunityScreen';
import RoomInfo from './src/community/info';

// 기능 화면들
import Record from './src/(tabs)/record';
import VoiceScreen from './src/(tabs)/voice/VoiceScreen';
import schedule from './src/(tabs)/schedule';

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
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
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

        const alreadyLaunched =
          await AsyncStorage.getItem('alreadyLaunched');

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
        }}
      >
        <ActivityIndicator size="large" color="#B36A3C" />
      </View>
    );
  }

  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName={initialRoute}>

        {/* 온보딩 */}
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />

        {/* 회원가입 */}
        <Stack.Screen
          name="Auth"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />

        {/* 메인 탭 */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />

        {/* 프로필 수정 */}
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />

        {/* 설정 */}
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AccessibilitySettings"
          component={AccessibilitySettings}
          options={{ headerShown: false }}
        />

        {/* FAQ */}
        <Stack.Screen
          name="FAQScreen"
          component={FAQScreen}
          options={{ headerShown: false }}
        />

        {/* 기타 화면 */}
        <Stack.Screen
          name="Community"
          component={CommunityScreen}
        />

        <Stack.Screen
          name="RoomInfo"
          component={RoomInfo}
        />

        <Stack.Screen
          name="RecordScreen"
          component={Record}
        />

        <Stack.Screen
          name="VoiceScreen"
          component={VoiceScreen}
        />

        <Stack.Screen
          name="ScheduleScreen"
          component={schedule}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}
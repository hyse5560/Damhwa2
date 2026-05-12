import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionsAndroid, Platform } from 'react-native';
import { audioService } from './src/(tabs)/voice/audioService';

// 네비게이션 및 메인 화면들
import MainTabNavigator from './src/navigation/MainTabNavigator';
import Onboarding from './src/onboarding';
import CommunityScreen from './src/community/CommunityScreen';
import RoomInfo from './src/community/info';

// 기능 화면들
import Record from './src/(tabs)/record';
import VoiceScreen from './src/(tabs)/voice/VoiceScreen';
import schedule from './src/(tabs)/schedule';

// ✅ 새로 추가된 설정 상세 화면들
import NotificationSettings from './src/setting/NotificationSettings';
import AccessibilitySettings from './src/setting/AccessibilitySettings';

import EditProfile from './src/setting/EditProfile';
import FAQScreen from './src/setting/FAQScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const initApp = async () => {
      // 1. 앱 시작 시 TTS 캐시 초기화
      if (audioService && typeof audioService.clearCache === 'function') {
        audioService.clearCache();
      }

      // 2. 마이크 권한 요청 (안드로이드 전용)
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: '마이크 사용 권한',
              message: '어르신과의 대화를 위해 마이크 권한이 필요합니다.',
              buttonNeutral: '나중에',
              buttonNegative: '거절',
              buttonPositive: '허용',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('마이크 권한이 거절되었습니다.');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    initApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        {/* 온보딩 화면 */}
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />

        {/* 하단 탭이 포함된 메인 네비게이터 */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />

        {/* ✅ 내 정보 수정 화면 등록 */}
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />

        {/* ✅ 설정 상세 화면 등록 */}
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AccessibilitySettings"
          component={AccessibilitySettings}
          options={{
            headerShown: false,
          }}
        />

        {/* ✅ 자주 묻는 질문 화면 등록 */}
        <Stack.Screen
          name="FAQScreen"
          component={FAQScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* 기타 상세 화면들 */}
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="RoomInfo" component={RoomInfo} />
        <Stack.Screen name="RecordScreen" component={Record} />
        <Stack.Screen name="VoiceScreen" component={VoiceScreen} />
        <Stack.Screen name="ScheduleScreen" component={schedule} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

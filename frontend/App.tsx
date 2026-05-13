import React, { useEffect, useState } from 'react'; // ✅ useState 추가
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionsAndroid, Platform, View, ActivityIndicator } from 'react-native'; // ✅ View, ActivityIndicator 추가
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 추가
import { audioService } from './src/(tabs)/voice/audioService';

// 네비게이션 및 메인 화면들
import MainTabNavigator from './src/navigation/MainTabNavigator';
import Onboarding from './src/onboarding';
import SignUpScreen from './src/(tabs)/auth/index'; // ✅ 회원가입 화면 import 추가 (경로 확인 필요)
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
  // ✅ 상태 관리 변수 추가
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Onboarding');

  useEffect(() => {
    const initApp = async () => {
      // 1. 앱 시작 시 TTS 캐시 초기화
      if (audioService && typeof audioService.clearCache === 'function') {
        audioService.clearCache();
      }

      // 2. 마이크 권한 요청 (안드로이드 전용)
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

      // ✅ 3. 온보딩 여부 확인 로직 추가
      try {
        const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
        if (alreadyLaunched !== null) {
          // 이미 본 적이 있다면 바로 회원가입(또는 메인)으로 보냄
          setInitialRoute('Auth'); 
        }
      } catch (e) {
        console.error('AsyncStorage Error:', e);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    initApp();
  }, []);

  // ✅ 로딩 중일 때 보여줄 화면 (잠깐의 깜빡임 방지)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#B36A3C" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* ✅ initialRouteName을 상태값에 따라 동적으로 설정 */}
      <Stack.Navigator initialRouteName={initialRoute}>
        {/* 온보딩 화면 */}
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />

        {/* ✅ 회원가입 화면 등록 */}
        <Stack.Screen
          name="Auth"
          component={SignUpScreen}
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
          options={{ headerShown: false }}
        />

        {/* ✅ 설정 상세 화면 등록 */}
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

        {/* ✅ 자주 묻는 질문 화면 등록 */}
        <Stack.Screen
          name="FAQScreen"
          component={FAQScreen}
          options={{ headerShown: false }}
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
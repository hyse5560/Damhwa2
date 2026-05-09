/*import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionsAndroid } from 'react-native';
import { audioService } from './src/(tabs)/voice/audioService';

// 파일 위치에 맞춰 import 경로를 설정합니다.
import CommunityScreen from './src/community/CommunityScreen';
import RoomInfo from './src/community/info';
import Onboarding from './src/onboarding';
import Home from './src/index'; // 메인 화면(index.tsx)
import Record from './src/(tabs)/record';
import VoiceScreen from './src/(tabs)/voice/VoiceScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    // 앱 시작 시 TTS 캐시 초기화
    audioService.clearCache();

    // 🔥 마이크 권한 요청 추가
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MainTabs"
          component={Home}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="RoomInfo" component={RoomInfo} />
        <Stack.Screen name="RecordScreen" component={Record} />
        <Stack.Screen name="VoiceScreen" component={VoiceScreen} />

        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
  */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PermissionsAndroid, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { audioService } from './src/(tabs)/voice/audioService';

import CommunityScreen from './src/community/CommunityScreen';
import RoomInfo from './src/community/info';
import Onboarding from './src/onboarding';
import Home from './src/index';
import Record from './src/(tabs)/record';
import VoiceScreen from './src/(tabs)/voice/VoiceScreen';
import SignUpScreen from './src/signup';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      audioService.clearCache();

      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      const savedUser = await AsyncStorage.getItem('user');

      if (savedUser) {
        setInitialRoute('MainTabs');
      } else {
        setInitialRoute('Onboarding');
      }
    };

    initApp();
  }, []);

  if (!initialRoute) {
    return (
      <View>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MainTabs"
          component={Home}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="RoomInfo" component={RoomInfo} />
        <Stack.Screen name="RecordScreen" component={Record} />
        <Stack.Screen name="VoiceScreen" component={VoiceScreen} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
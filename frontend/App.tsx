import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 파일 위치에 맞춰 import 경로를 설정합니다.
import CommunityScreen from './src/community/CommunityScreen';
import RoomInfo from './src/community/info';
import Onboarding from './src/onboarding';
import Home from './src/index'; // 메인 화면(index.tsx)
import Record from './src/(tabs)/record';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />

        {/* 핵심 수정 부분: name을 "Home"에서 "MainTabs"로 변경 */}
        {/* 온보딩에서 navigation.replace('MainTabs')를 호출하므로 이름을 똑같이 맞춰야 합니다. */}
        <Stack.Screen
          name="MainTabs"
          component={Home}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="RoomInfo" component={RoomInfo} />
        <Stack.Screen name="RecordScreen" component={Record} />

        {/* 만약 Home이라는 이름도 계속 써야 한다면 아래처럼 하나 더 둬도 됩니다. */}
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

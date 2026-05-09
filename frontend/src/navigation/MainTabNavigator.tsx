//MainTabNavigator.tsx
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 순수 네이티브 아이콘 사용
import Ionicons from 'react-native-vector-icons/Ionicons';

// 연결할 화면들 임포트 (사용자님의 실제 파일 경로에 맞게 수정하세요)
import HomeScreen from '../index';
import CommunityScreen from '../community/CommunityScreen';
import SettingsScreen from '../setting';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B36A3C', // 활성화 브라운
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 13,
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: Platform.OS === 'ios' ? 90 : 65,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          elevation: 10,
        },
      }}
    >
      {/* 1. 홈 */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size + 2} color={color} />
          ),
        }}
      />

      {/* 2. 사이버경로당 */}
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: '사이버경로당',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size + 4} color={color} />
          ),
        }}
      />

      {/* 3. 설정 */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '설정',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings-sharp' : 'settings-outline'}
              size={size + 2}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

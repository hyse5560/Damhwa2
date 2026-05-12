import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// 1. Expo 대신 순수 네이티브용 아이콘과 네비게이션 훅 사용
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const MAIN_BROWN = '#BF6A2A';
const SETTINGS_BG = '#F2F2F2';

// 2. 네이티브 아이콘 타입 정의 (오류 방지 및 자동완성)
interface SettingItemProps {
  icon: string;
  title: string;
  onPress?: () => void;
  color?: string;
}

export default function SettingsScreen() {
  const navigation = useNavigation<any>();

  // 개별 설정 아이템 컴포넌트
  const SettingItem = ({
    icon,
    title,
    onPress,
    color = '#555',
  }: SettingItemProps) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={26} color={color} />
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#BBB" />
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '확인', onPress: () => console.log('Logout Pressed') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 사용자 정보 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color="#FFF" />
          </View>
          <View>
            <Text style={styles.userName}>사용자님</Text>
            <Text style={styles.userSub}>오늘도 담화와 함께해요</Text>
          </View>
        </View>

        {/* 서비스 관리 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>서비스 관리</Text>
          <View style={styles.menuGroup}>
            <SettingItem
              icon="person-outline"
              title="내 정보 수정"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <SettingItem
              icon="notifications-outline"
              title="알림 설정"
              onPress={() => navigation.navigate('NotificationSettings')}
            />
          </View>
        </View>

        {/* 고객 지원 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>고객 지원</Text>
          <View style={styles.menuGroup}>
            <SettingItem
              icon="volume-high-outline"
              title="소리 및 글자 크기"
              onPress={() => navigation.navigate('AccessibilitySettings')}
            />
            <SettingItem
              icon="help-circle-outline"
              title="자주 묻는 질문"
              onPress={() => navigation.navigate('FAQScreen')}
            />
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>버전 1.0.0 (최신버전)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SETTINGS_BG,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingTop: 40,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#333' },
  scrollContent: { paddingBottom: 40 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: MAIN_BROWN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userName: { fontSize: 18, fontWeight: '700', color: '#222' },
  userSub: { fontSize: 13, color: '#888', marginTop: 2 },
  section: { marginTop: 10, paddingHorizontal: 20 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    marginBottom: 10,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { fontSize: 17, fontWeight: '500', color: '#333', marginLeft: 12 },
  logoutButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 18,
  },
  logoutText: { color: '#AAA', fontSize: 15, textDecorationLine: 'underline' },
  version: { textAlign: 'center', color: '#CCC', marginTop: 20, fontSize: 12 },
});

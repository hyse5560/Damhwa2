import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

interface Member {
  id: number;
  name: string;
  icon: React.ReactNode;
  speaking: boolean;
}

export default function RoomScreen() {
  // 2. 네비게이션 객체 초기화
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // 참여자 임시 데이터
  const members: Member[] = [
    {
      id: 1,
      name: '김순희',
      icon: <Ionicons name="people" size={width * 0.12} color="#4A90E2" />,
      speaking: true,
    },
    {
      id: 2,
      name: '박철수',
      icon: <FontAwesome5 name="robot" size={width * 0.12} color="#F5A623" />,
      speaking: false,
    },
    {
      id: 3,
      name: '이말숙',
      icon: (
        <MaterialCommunityIcons
          name="face-woman"
          size={width * 0.12}
          color="#D0021B"
        />
      ),
      speaking: false,
    },
    {
      id: 4,
      name: '최진호',
      icon: <Ionicons name="fitness" size={width * 0.12} color="#7ED321" />,
      speaking: true,
    },
  ];

  const renderMember = ({ item }: { item: Member }) => (
    <View style={styles.memberCard}>
      <View
        style={[styles.avatarCircle, item.speaking && styles.speakingBorder]}
      >
        {item.icon}
      </View>
      <Text style={styles.memberName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        {/* 3. router.back() 대신 navigation.goBack() 사용 */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={width * 0.08} color="#AAA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          오늘 아침 신문 이야기
        </Text>

        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.exitButtonText}>나가기</Text>
        </TouchableOpacity>
      </View>

      {/* 중앙 참여자 목록 */}
      <FlatList
        data={members}
        renderItem={renderMember}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.memberList}
        showsVerticalScrollIndicator={false}
      />

      {/* 하단 음성 컨트롤 바 */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn}>
          <Ionicons
            name="volume-medium-outline"
            size={width * 0.1}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.micBtn}>
          <Ionicons name="mic" size={width * 0.12} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn}>
          <MaterialCommunityIcons
            name="comment-text-multiple-outline"
            size={width * 0.1}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... 스타일(styles) 코드는 기존과 동일하므로 생략합니다 ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  exitButton: {
    backgroundColor: '#333',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  exitButtonText: {
    color: '#FF5252',
    fontWeight: '800',
    fontSize: 14,
  },
  memberList: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  memberCard: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#333',
  },
  speakingBorder: {
    borderColor: '#20E09F',
  },
  memberName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    paddingVertical: 15,
    borderRadius: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  controlBtn: {
    padding: 10,
  },
  micBtn: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: '#20E09F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

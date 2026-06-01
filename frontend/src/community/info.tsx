import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const MAIN_BROWN = '#BF6A2A';
const SUB_BEIGE = '#FFF9F3';

export default function Info() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // 이전 화면에서 전달받은 방 타이틀 수신
  const roomTitle = route.params?.title || '행복한 대화방';

  return (
    <View style={styles.container}>
      {/* 커스텀 헤더 상단바 */}
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={32} color="#333" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>대화방 안내</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.contentCard}>
        <Ionicons
          name="chatbubbles"
          size={width * 0.22}
          color={MAIN_BROWN}
          style={styles.mainIcon}
        />

        <Text style={styles.roomTag}>소통 공간 안내</Text>
        <Text style={styles.roomTitle}>{roomTitle}</Text>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            • 이 방은 댓글로 자유롭게 소통하는 공간입니다.
          </Text>
          <Text style={styles.noticeText}>
            • 내 얼굴은 보이지 않으니 안심하세요!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('CommunityRoom', { title: roomTitle })
          }
        >
          <Text style={styles.buttonText}>대화방 바로 입장하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SUB_BEIGE },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appBarTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  backBtn: { padding: 5 },
  contentCard: {
    flex: 1,
    margin: 25,
    padding: 25,
    backgroundColor: '#FFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  mainIcon: { marginBottom: 15 },
  roomTag: {
    fontSize: 20,
    color: MAIN_BROWN,
    fontWeight: '700',
    marginBottom: 8,
  },
  roomTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 32,
  },
  noticeBox: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
    marginBottom: 35,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  noticeText: {
    fontSize: 18,
    color: '#444',
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    backgroundColor: MAIN_BROWN,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: '800' },
});

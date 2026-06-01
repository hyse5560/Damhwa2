import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import YoutubeIframe from 'react-native-youtube-iframe';

export default function SafetyGuide() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>보이스피싱 예방 가이드</Text>

        {/* 유튜브 영상 삽입 */}
        <View style={styles.videoContainer}>
          <YoutubeIframe
            height={220}
            videoId="jFdg0_b-BHc" // 영상 고유 ID
          />
        </View>

        {/* 🌟 영상 설명 문구 추가 */}
        <Text style={styles.videoDescription}>
          [보이스피싱 예방] 전화 대처 방법 안내 영상
        </Text>

        <Text style={styles.subTitle}>꼭 기억하세요!</Text>
        <Text style={styles.text}>
          1. 모르는 번호로 온 사칭 문자/전화는 일단 의심하세요.
        </Text>
        <Text style={styles.text}>
          2. 개인정보나 금융정보를 요구하는 경우 절대 응하지 마세요.
        </Text>
        <Text style={styles.text}>
          3. 출처가 불분명한 앱 설치 링크(URL)는 절대 누르지 마세요.
        </Text>
        <Text style={styles.text}>
          4. 피해 발생 시 즉시 112나 1332로 신고하세요.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 20 },
  content: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
    fontStyle: 'italic', // 살짝 기울여 강조
    marginTop: -5,
  },
  videoContainer: { borderRadius: 15, overflow: 'hidden', marginBottom: 5 },
  subTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#B36A3C',
  },
  text: { fontSize: 20, lineHeight: 28, marginBottom: 15, color: '#444' },
});

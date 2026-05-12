import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch, // 소리 온/오프를 위해 추가
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function AccessibilitySettings() {
  const navigation = useNavigation();
  const [fontSize, setFontSize] = useState(1); // 0: 작게, 1: 보통, 2: 크게

  // ✅ 소리 관련 상태 추가
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(70); // 0 ~ 100

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>소리 및 글자 크기</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* --- 소리 설정 섹션 추가 --- */}
        <Text style={styles.sectionLabel}>소리 설정</Text>
        <View style={styles.soundBox}>
          <View style={styles.soundRow}>
            <View>
              <Text style={styles.soundTitle}>효과음 및 목소리</Text>
              <Text style={styles.soundDesc}>
                앱에서 나오는 모든 소리를 켭니다.
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D1D1', true: '#BF6A2A' }}
              thumbColor={isSoundEnabled ? '#FFF' : '#F4F3F4'}
              onValueChange={setIsSoundEnabled}
              value={isSoundEnabled}
            />
          </View>

          {isSoundEnabled && (
            <View style={styles.volumeWrapper}>
              <View style={styles.volumeHeader}>
                <Ionicons
                  name="volume-medium-outline"
                  size={20}
                  color="#BF6A2A"
                />
                <Text style={styles.volumeText}>소리 크기: {volume}%</Text>
              </View>
              <View style={styles.volumeControls}>
                <TouchableOpacity
                  style={styles.volumeStepBtn}
                  onPress={() => setVolume(Math.max(0, volume - 10))}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={32}
                    color="#666"
                  />
                </TouchableOpacity>

                <View style={styles.volumeBarContainer}>
                  <View
                    style={[styles.volumeBarFill, { width: `${volume}%` }]}
                  />
                </View>

                <TouchableOpacity
                  style={styles.volumeStepBtn}
                  onPress={() => setVolume(Math.min(100, volume + 10))}
                >
                  <Ionicons name="add-circle-outline" size={32} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* --- 기존 글자 크기 설정 섹션 --- */}
        <Text style={styles.sectionLabel}>미리보기</Text>
        <View style={styles.previewBox}>
          <Text style={[styles.previewText, { fontSize: 16 + fontSize * 6 }]}>
            안녕하세요!{'\n'}담화와 함께 즐거운 하루 되세요.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>글자 크기 설정</Text>
        <View style={styles.sizeSelector}>
          {['작게', '보통', '크게'].map((label, index) => (
            <TouchableOpacity
              key={label}
              style={[styles.sizeBtn, fontSize === index && styles.activeBtn]}
              onPress={() => setFontSize(index)}
            >
              <Text
                style={[
                  styles.sizeBtnText,
                  fontSize === index && styles.activeBtnText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.infoText}>
          * 글자 크기를 '크게'로 설정하면 화면 설명이 더 잘 보입니다.
        </Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  content: { padding: 20 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    marginBottom: 10,
    marginTop: 20,
  },
  // ✅ 소리 설정 관련 스타일 추가
  soundBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },
  soundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  soundTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  soundDesc: { fontSize: 13, color: '#999', marginTop: 2 },
  volumeWrapper: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  volumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  volumeText: { fontSize: 15, fontWeight: '600', color: '#333', marginLeft: 6 },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volumeStepBtn: { padding: 5 },
  volumeBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  volumeBarFill: {
    height: '100%',
    backgroundColor: '#BF6A2A',
  },
  // 기존 스타일 유지
  previewBox: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  previewText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 30,
  },
  sizeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-between',
  },
  sizeBtn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeBtn: { backgroundColor: '#BF6A2A' },
  sizeBtnText: { fontSize: 16, fontWeight: '700', color: '#888' },
  activeBtnText: { color: '#FFF' },
  infoText: { marginTop: 15, color: '#AAA', fontSize: 13, textAlign: 'center' },
});

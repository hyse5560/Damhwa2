import React, { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
// AsyncStorage 임포트 (설치 후 에러가 난다면 메트로 서버 재시작 필요)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface PageItem {
  id: number;
  lines: string[];
  image?: any;
  images?: any[];
}

const PAGES: PageItem[] = [
  {
    id: 4,
    lines: ['-----', 'Dam', 'hwa', '-----', 'Story of you'],
  },
  {
    id: 5,
    lines: ['AI와 대화로'],
    image: require('../assets/images/5-page.jpg'),
  },
  {
    id: 6,
    lines: ['일정부터 (image1)', '(image2) 일상까지', '한번에!'],
    images: [
      require('../assets/images/6-page-1.jpg'),
      require('../assets/images/6-page-2.jpg'),
    ],
  },
];

export default function Onboarding() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation<any>();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<PageItem>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const responsiveFontSize = width * 0.11;
  const responsiveLineHeight = responsiveFontSize * 1.3;

  /**
   * 온보딩 종료 로직
   */
  const finishOnboarding = async () => {
    try {
      // 1. 온보딩 완료 상태 저장
      await AsyncStorage.setItem('onboardingDone', 'true');

      // 2. 메인 탭으로 이동
      // 주의: App.tsx의 Stack.Screen name이 'MainTabs'라고 가정합니다.
      // '(tabs)'는 expo-router 형식이니 네이티브 이름으로 변경하세요.
      navigation.replace('MainTabs');
    } catch (e) {
      Alert.alert('알림', '설정 저장 중 오류가 발생했습니다.');
      console.error('저장 오류:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
            listener: (event: any) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setCurrentIndex(index);
            },
          },
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [40, 0, 40],
            extrapolate: 'clamp',
          });

          const isPage4 = item.id === 4;
          const isPage5 = item.id === 5;
          const isPage6 = item.id === 6;

          return (
            <View style={[styles.page, { width }]}>
              <Animated.View
                style={[
                  styles.animatedContent,
                  { opacity, transform: [{ translateY }] },
                  isPage5 && { paddingTop: height * 0.1 },
                ]}
              >
                {item.lines.map((line, idx) => {
                  if (isPage4 && line === '-----') {
                    return (
                      <View
                        key={idx}
                        style={[styles.divider, { width: width * 0.6 }]}
                      />
                    );
                  }

                  const lineStyle = [
                    styles.text,
                    {
                      fontSize: responsiveFontSize,
                      lineHeight: responsiveLineHeight,
                    },
                    isPage4 ? styles.red : styles.black,
                  ];

                  if (isPage6 && line.includes('(image1)')) {
                    return (
                      <View key={idx} style={styles.inlineContainer}>
                        <Text style={lineStyle}>일정부터 </Text>
                        <Image
                          source={item.images?.[0]}
                          style={styles.page6Image}
                        />
                      </View>
                    );
                  }
                  if (isPage6 && line.includes('(image2)')) {
                    return (
                      <View key={idx} style={styles.inlineContainer}>
                        <Image
                          source={item.images?.[1]}
                          style={styles.page6Image}
                        />
                        <Text style={lineStyle}> 일상까지</Text>
                      </View>
                    );
                  }

                  return (
                    <Text
                      key={idx}
                      style={[lineStyle, { textAlign: 'center' }]}
                    >
                      {line}
                    </Text>
                  );
                })}

                {isPage5 && item.image && (
                  <Image
                    source={item.image}
                    style={[
                      styles.page5Image,
                      { width: width * 0.7, height: width * 0.7 },
                    ]}
                  />
                )}
              </Animated.View>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dotsWrapper}>
          {PAGES.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, currentIndex === idx && styles.dotActive]}
            />
          ))}
        </View>

        {currentIndex === PAGES.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, { width: width * 0.8 }]}
            onPress={finishOnboarding}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>시작하기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() =>
              flatListRef.current?.scrollToIndex({ index: PAGES.length - 1 })
            }
          >
            <Text style={styles.skipText}>건너뛰기</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  page: { flex: 1, justifyContent: 'center' },
  animatedContent: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  text: { fontWeight: '900', marginBottom: 10 },
  red: { color: '#8B0000' },
  black: { color: '#000' },
  divider: { height: 2, backgroundColor: '#8B0000', marginVertical: 15 },
  page5Image: { resizeMode: 'contain', marginTop: 40 },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  page6Image: { width: 50, height: 50, resizeMode: 'contain' },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  dotActive: { backgroundColor: '#B36A3C', width: 20 },
  button: {
    backgroundColor: '#B36A3C',
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  skipButton: { padding: 10 },
  skipText: { color: '#AAA', fontSize: 16, fontWeight: '600' },
});

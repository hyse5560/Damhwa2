import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function NotificationSettings() {
  const navigation = useNavigation();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);

  const ToggleItem = ({ title, value, onValueChange, description }: any) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDesc}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: '#D1D1D1', true: '#BF6A2A' }}
        thumbColor={value ? '#FFF' : '#F4F3F4'}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림 설정</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.menuGroup}>
          <ToggleItem
            title="전체 알림"
            description="앱에서 보내는 모든 소식을 알려드려요."
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <View style={styles.divider} />
          <ToggleItem
            title="일정 리마인드"
            description="약 드실 시간이나 중요한 일정을 알려드려요."
            value={scheduleEnabled}
            onValueChange={setScheduleEnabled}
          />
        </View>
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
  menuGroup: { backgroundColor: '#FFF', borderRadius: 20, padding: 10 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  itemTitle: { fontSize: 17, fontWeight: '700', color: '#333' },
  itemDesc: { fontSize: 13, color: '#888', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 15 },
});

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import { PermissionsAndroid } from 'react-native';

export async function initNotifications() {
  // Android 13+ 권한 요청
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  // Notification Channel 생성
  await notifee.createChannel({
    id: 'default',
    name: '기본 알림',
    importance: AndroidImportance.HIGH,
  });

  // Foreground 메시지 수신
  messaging().onMessage(async remoteMessage => {
    console.log('🔥 Foreground FCM:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,

      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  });
}

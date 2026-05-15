/**
 * @format
 */

import { AppRegistry } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import App from './App';
import { name as appName } from './app.json';

// 백그라운드 / 종료 상태 FCM 처리
messaging().setBackgroundMessageHandler(
  async remoteMessage => {

    console.log('🔥 Background FCM:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification?.title || '알림',
      body: remoteMessage.notification?.body || '',

      android: {
        channelId: 'default',

        pressAction: {
          id: 'default',
        },
      },
    });
  }
);

AppRegistry.registerComponent(appName, () => App);
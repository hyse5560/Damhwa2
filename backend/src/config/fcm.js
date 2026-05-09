let admin = null;
let messaging = null;

try {
  const firebaseAdmin = require('firebase-admin');
  const serviceAccountPath = process.env.FCM_SERVICE_ACCOUNT_PATH || process.env.FCM_KEY_PATH;

  if (serviceAccountPath) {
    const serviceAccount = require(serviceAccountPath);

    if (!firebaseAdmin.apps.length) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
      });
    }

    admin = firebaseAdmin;
    messaging = firebaseAdmin.messaging();
    console.log('FCM initialized');
  } else {
    console.log('FCM_SERVICE_ACCOUNT_PATH 없음 → FCM 비활성화 상태로 서버 실행');
  }
} catch (error) {
  console.log('FCM 비활성화:', error.message);
}

const sendPush = async (token, title, body, data = {}) => {
  if (!messaging) {
    console.log('FCM 비활성화 상태라 push 전송 생략:', { token, title, body });
    return null;
  }

  return messaging.send({
    token,
    notification: { title, body },
    data,
  });
};

module.exports = {
  admin,
  sendPush,
};

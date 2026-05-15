const admin = require("firebase-admin");

const serviceAccount = require(process.env.FCM_KEY_PATH);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();

const sendPush = async (token, title, body, data = {}) => {
  try {

    console.log('\n========== FCM SEND ==========');
    console.log('토큰:', token);
    console.log('제목:', title);
    console.log('내용:', body);
    console.log('데이터:', data);

    const message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };

    const response = await messaging.send(message);

    console.log('✅ FCM 전송 성공:', response);

    return response;

  } catch (err) {

    console.error('❌ FCM 전송 실패:', err);

    throw err;
  }
};

module.exports = {
  admin,
  sendPush,
};
const admin = require("firebase-admin");

const serviceAccount = require(process.env.FCM_KEY_PATH);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();

const sendPush = async (token, title, body, data = {}) => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
    data,
  };

  return await messaging.send(message);
};

module.exports = {
  admin,
  sendPush,
};
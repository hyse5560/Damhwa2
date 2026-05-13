// backend/src/modules/auth/authService.js
const { User } = require('../../models');
const { sendPush } = require('../../config/fcm');

const registerOrUpdateUser = async (userData) => {
  const { name, phone, push_token } = userData;

  // 1. 유저 정보 저장 (Upsert)
  const [user, created] = await User.findOrCreate({
    where: { phone },
    defaults: { name, push_token, is_active: true }
  });

  if (!created) {
    user.name = name;
    user.push_token = push_token;
    user.is_active = true;
    await user.save();
  }

  // 2. 가입 성공 시 환영 푸시 알림 전송
  if (push_token) {
    try {
      await sendPush(
        push_token, 
        '반갑습니다!', 
        `${name}님, 담화(ElderTalk)에 오신 것을 환영합니다.`,
        { type: 'WELCOME_EVENT' } // 필요한 경우 데이터 추가
      );
      console.log(`[FCM] ${name}님에게 환영 알림 전송 성공`);
    } catch (error) {
      console.error('[FCM] 알림 전송 실패:', error);
      // 알림 전송 실패가 회원가입 실패로 이어지지 않도록 예외 처리만 하고 넘어갑니다.
    }
  }

  return user;
};

module.exports = { registerOrUpdateUser };
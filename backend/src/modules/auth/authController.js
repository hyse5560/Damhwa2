const { User } = require('../../models');
const { signPayload } = require('../../middlewares/authMiddleware');

const formatUser = (user) => ({
  user_id: user.user_id,
  name: user.name,
  phone: user.phone,
  push_token: user.push_token,
  is_active: user.is_active,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

const signup = async (req, res) => {
  try {
    const { name, phone, pushToken, push_token } = req.body;
    const finalPushToken = pushToken || push_token || null;

    if (!name || !phone) {
      return res.status(400).json({ message: '이름과 전화번호는 필수입니다.' });
    }

    const exists = await User.findOne({ where: { phone } });

    if (exists) {
      return res.status(409).json({ message: '이미 가입된 전화번호입니다.' });
    }

    const user = await User.create({
      name,
      phone,
      push_token: finalPushToken,
      is_active: true,
    });

    const token = signPayload({ user_id: user.user_id, name: user.name, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });

    return res.status(201).json({
      message: '회원가입 성공',
      user: formatUser(user),
      access_token: token,
    });
  } catch (error) {
    console.error('[Auth] signup error:', error);
    return res.status(500).json({ message: '회원가입 중 서버 오류가 발생했습니다.' });
  }
};

const login = async (req, res) => {
  try {
    const { name, phone, pushToken, push_token } = req.body;
    const finalPushToken = pushToken || push_token || null;

    if (!name || !phone) {
      return res.status(400).json({ message: '이름과 전화번호는 필수입니다.' });
    }

    const user = await User.findOne({ where: { name, phone, is_active: true } });

    if (!user) {
      return res.status(401).json({ message: '가입된 정보를 찾을 수 없습니다.' });
    }

    if (finalPushToken) {
      user.push_token = finalPushToken;
      await user.save();
    }

    const token = signPayload({ user_id: user.user_id, name: user.name, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });

    return res.status(200).json({
      message: '로그인 성공',
      user: formatUser(user),
      access_token: token,
    });
  } catch (error) {
    console.error('[Auth] login error:', error);
    return res.status(500).json({ message: '로그인 중 서버 오류가 발생했습니다.' });
  }
};

module.exports = {
  signup,
  login,
};

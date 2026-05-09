const { User } = require('../../models');

const signup = async ({ name, phone, pushToken }) => {
  if (!name || !phone) {
    throw new Error('이름과 전화번호는 필수입니다.');
  }

  const exists = await User.findOne({
    where: { phone },
  });

  if (exists) {
    throw new Error('이미 가입된 전화번호입니다.');
  }

  const user = await User.create({
    name,
    phone,
    push_token: pushToken || null,
  });

  return user;
};

const login = async ({ name, phone, pushToken }) => {
  if (!name || !phone) {
    throw new Error('이름과 전화번호는 필수입니다.');
  }

  const user = await User.findOne({
    where: { name, phone },
  });

  if (!user) {
    throw new Error('가입된 정보를 찾을 수 없습니다.');
  }

  if (pushToken) {
    user.push_token = pushToken;
    await user.save();
  }

  return user;
};

module.exports = {
  signup,
  login,
};
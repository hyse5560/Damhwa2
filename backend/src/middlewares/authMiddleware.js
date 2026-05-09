const crypto = require('crypto');
const { User } = require('../models');

const SECRET = process.env.AUTH_TOKEN_SECRET || 'damhwa-dev-secret';

function signPayload(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  if (signature !== expected) return null;

  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    const payload = verifyToken(token);

    if (!payload?.user_id) {
      return res.status(401).json({ message: '로그인이 필요한 기능입니다.' });
    }

    const user = await User.findByPk(payload.user_id);
    if (!user || !user.is_active) {
      return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('requireAuth error:', error);
    return res.status(401).json({ message: '인증 처리 중 오류가 발생했습니다.' });
  }
}

function requireAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'];
  if (!process.env.ADMIN_KEY) {
    return res.status(403).json({ message: 'ADMIN_KEY가 설정되어 있지 않습니다.' });
  }
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
}

module.exports = {
  signPayload,
  verifyToken,
  requireAuth,
  requireAdmin,
};

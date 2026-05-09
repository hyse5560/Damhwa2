const communityService = require('./communityService');

function getAuthUserId(req) {
  return req.user?.user_id || req.body.user_id;
}

async function getRooms(req, res) {
  try {
    const rooms = await communityService.getRooms();
    res.json({ rooms });
  } catch (error) {
    console.error('getRooms error:', error);
    res.status(500).json({ message: '사이버 경로당 목록 조회 실패' });
  }
}

async function getRoomDetail(req, res) {
  try {
    const room = await communityService.getRoomDetail(req.params.roomId);
    if (!room) return res.status(404).json({ message: '방을 찾을 수 없습니다.' });
    res.json({ room });
  } catch (error) {
    console.error('getRoomDetail error:', error);
    res.status(500).json({ message: '사이버 경로당 상세 조회 실패' });
  }
}

async function createRoom(req, res) {
  try {
    if (!req.body.title) return res.status(400).json({ message: '방 제목은 필수입니다.' });
    const room = await communityService.createRoom(req.body);
    res.status(201).json({ room });
  } catch (error) {
    console.error('createRoom error:', error);
    res.status(500).json({ message: '사이버 경로당 방 생성 실패' });
  }
}

async function joinRoom(req, res) {
  try {
    const userId = getAuthUserId(req);
    const nickname = req.body.nickname || req.user?.name;
    if (!userId) return res.status(400).json({ message: 'user_id 또는 로그인이 필요합니다.' });

    const member = await communityService.joinRoom(req.params.roomId, userId, nickname);
    if (!member) return res.status(404).json({ message: '방을 찾을 수 없습니다.' });
    res.json({ member });
  } catch (error) {
    console.error('joinRoom error:', error);
    res.status(error.status || 500).json({ message: error.message || '사이버 경로당 참여 실패' });
  }
}

async function leaveRoom(req, res) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(400).json({ message: 'user_id 또는 로그인이 필요합니다.' });

    const member = await communityService.leaveRoom(req.params.roomId, userId);
    if (!member) return res.status(404).json({ message: '참여 정보를 찾을 수 없습니다.' });
    res.json({ message: '나가기 완료', member });
  } catch (error) {
    console.error('leaveRoom error:', error);
    res.status(500).json({ message: '사이버 경로당 나가기 실패' });
  }
}

async function sendMessage(req, res) {
  try {
    const userId = getAuthUserId(req);
    const { content, message_type } = req.body;
    if (!userId) return res.status(400).json({ message: 'user_id 또는 로그인이 필요합니다.' });
    if (!content) return res.status(400).json({ message: 'content는 필수입니다.' });

    const message = await communityService.saveMessage(req.params.roomId, userId, content, message_type || 'text');
    res.status(201).json({ message });
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(error.status || 500).json({ message: error.message || '메시지 저장 실패' });
  }
}

async function getMessages(req, res) {
  try {
    const messages = await communityService.getMessages(req.params.roomId);
    res.json({ messages });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ message: '메시지 조회 실패' });
  }
}

async function reportUser(req, res) {
  try {
    const reporterUserId = getAuthUserId(req);
    if (!reporterUserId) return res.status(400).json({ message: '로그인이 필요합니다.' });
    if (!req.body.reason) return res.status(400).json({ message: '신고 사유는 필수입니다.' });

    const report = await communityService.createReport(req.params.roomId, reporterUserId, req.body);
    res.status(201).json({ report });
  } catch (error) {
    console.error('reportUser error:', error);
    res.status(500).json({ message: '신고 접수 실패' });
  }
}

async function blockUser(req, res) {
  try {
    const blockerUserId = getAuthUserId(req);
    const { blocked_user_id, reason } = req.body;
    if (!blockerUserId) return res.status(400).json({ message: '로그인이 필요합니다.' });
    if (!blocked_user_id) return res.status(400).json({ message: 'blocked_user_id는 필수입니다.' });

    const block = await communityService.blockUser(blockerUserId, blocked_user_id, reason);
    res.status(201).json({ block });
  } catch (error) {
    console.error('blockUser error:', error);
    res.status(500).json({ message: '차단 실패' });
  }
}

async function unblockUser(req, res) {
  try {
    const blockerUserId = getAuthUserId(req);
    const { blockedUserId } = req.params;
    if (!blockerUserId) return res.status(400).json({ message: '로그인이 필요합니다.' });

    await communityService.unblockUser(blockerUserId, blockedUserId);
    res.json({ message: '차단 해제 완료' });
  } catch (error) {
    console.error('unblockUser error:', error);
    res.status(500).json({ message: '차단 해제 실패' });
  }
}

module.exports = {
  getRooms,
  getRoomDetail,
  createRoom,
  joinRoom,
  leaveRoom,
  sendMessage,
  getMessages,
  reportUser,
  blockUser,
  unblockUser,
};

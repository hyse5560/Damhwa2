const { CommunityRoom, CommunityMember, CommunityMessage, CommunityReport, CommunityBlock, User } = require('../../models');

const DEFAULT_ROOMS = [
  {
    title: '오늘 아침 신문 이야기',
    description: '신문과 오늘의 소식을 함께 이야기하는 사이버 경로당 방입니다.',
    category: '소식',
    thumb: '☕',
    schedule_time: '매일 오전 11:30',
    capacity: 20,
  },
  {
    title: '우리가 좋아하는 가요 무대',
    description: '좋아하는 노래와 추억을 함께 나누는 방입니다.',
    category: '음악',
    thumb: '🎤',
    schedule_time: '매일 오후 02:00',
    capacity: 20,
  },
  {
    title: '7080 노래 같이 들어요',
    description: '7080 노래를 함께 듣고 이야기하는 방입니다.',
    category: '음악',
    thumb: '📀',
    schedule_time: '매일 오후 07:00',
    capacity: 20,
  },
];

async function seedDefaultRooms() {
  const count = await CommunityRoom.count();
  if (count === 0) await CommunityRoom.bulkCreate(DEFAULT_ROOMS);
}

async function getRooms() {
  await seedDefaultRooms();

  const rooms = await CommunityRoom.findAll({
    where: { is_active: true },
    order: [['room_id', 'ASC']],
  });

  return Promise.all(
    rooms.map(async (room) => {
      const current_count = await CommunityMember.count({
        where: { room_id: room.room_id, left_at: null },
      });
      return { ...room.toJSON(), current_count };
    })
  );
}

async function getRoomDetail(roomId) {
  const room = await CommunityRoom.findByPk(roomId);
  if (!room || !room.is_active) return null;

  const members = await CommunityMember.findAll({
    where: { room_id: roomId, left_at: null },
    include: [{ model: User, attributes: ['user_id', 'name', 'phone'] }],
    order: [['joined_at', 'ASC']],
  });

  return { ...room.toJSON(), members };
}

async function createRoom(payload) {
  return CommunityRoom.create({
    title: payload.title,
    description: payload.description || null,
    category: payload.category || '자유대화',
    thumb: payload.thumb || '☕',
    schedule_time: payload.schedule_time || null,
    capacity: payload.capacity || 20,
    is_active: true,
  });
}

async function updateRoom(roomId, payload) {
  const room = await CommunityRoom.findByPk(roomId);
  if (!room) return null;
  await room.update({
    title: payload.title ?? room.title,
    description: payload.description ?? room.description,
    category: payload.category ?? room.category,
    thumb: payload.thumb ?? room.thumb,
    schedule_time: payload.schedule_time ?? room.schedule_time,
    capacity: payload.capacity ?? room.capacity,
    is_active: payload.is_active ?? room.is_active,
  });
  return room;
}

async function closeRoom(roomId) {
  const room = await CommunityRoom.findByPk(roomId);
  if (!room) return null;
  await room.update({ is_active: false });
  await CommunityMember.update({ left_at: new Date(), is_speaking: false }, { where: { room_id: roomId, left_at: null } });
  return room;
}

async function joinRoom(roomId, userId, nickname) {
  const room = await CommunityRoom.findByPk(roomId);
  if (!room || !room.is_active) return null;

  const memberCount = await CommunityMember.count({ where: { room_id: roomId, left_at: null } });
  if (memberCount >= room.capacity) {
    const error = new Error('정원이 가득 찼습니다.');
    error.status = 409;
    throw error;
  }

  const [member, created] = await CommunityMember.findOrCreate({
    where: { room_id: roomId, user_id: userId, left_at: null },
    defaults: { nickname, is_speaking: false },
  });

  if (!created && nickname && member.nickname !== nickname) {
    member.nickname = nickname;
    await member.save();
  }

  return member;
}

async function leaveRoom(roomId, userId) {
  const member = await CommunityMember.findOne({ where: { room_id: roomId, user_id: userId, left_at: null } });
  if (!member) return null;
  await member.update({ left_at: new Date(), is_speaking: false });
  return member;
}

async function saveMessage(roomId, userId, content, messageType = 'text') {
  const blocked = await CommunityBlock.findOne({ where: { blocked_user_id: userId } });
  if (blocked) {
    const error = new Error('차단된 사용자는 메시지를 보낼 수 없습니다.');
    error.status = 403;
    throw error;
  }

  return CommunityMessage.create({ room_id: roomId, user_id: userId, content, message_type: messageType });
}

async function getMessages(roomId) {
  return CommunityMessage.findAll({
    where: { room_id: roomId },
    include: [{ model: User, attributes: ['user_id', 'name'] }],
    order: [['created_at', 'ASC']],
    limit: 100,
  });
}

async function updateSpeaking(roomId, userId, isSpeaking) {
  const member = await CommunityMember.findOne({ where: { room_id: roomId, user_id: userId, left_at: null } });
  if (!member) return null;
  await member.update({ is_speaking: Boolean(isSpeaking) });
  return member;
}

async function createReport(roomId, reporterUserId, payload) {
  return CommunityReport.create({
    room_id: roomId,
    reporter_user_id: reporterUserId,
    target_user_id: payload.target_user_id || null,
    reason: payload.reason,
    detail: payload.detail || null,
    status: 'pending',
  });
}

async function blockUser(blockerUserId, blockedUserId, reason) {
  const [block] = await CommunityBlock.findOrCreate({
    where: { blocker_user_id: blockerUserId, blocked_user_id: blockedUserId },
    defaults: { reason: reason || null },
  });
  return block;
}

async function unblockUser(blockerUserId, blockedUserId) {
  return CommunityBlock.destroy({ where: { blocker_user_id: blockerUserId, blocked_user_id: blockedUserId } });
}

module.exports = {
  getRooms,
  getRoomDetail,
  createRoom,
  updateRoom,
  closeRoom,
  joinRoom,
  leaveRoom,
  saveMessage,
  getMessages,
  updateSpeaking,
  createReport,
  blockUser,
  unblockUser,
};

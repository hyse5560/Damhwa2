const { CommunityRoom, CommunityMember, CommunityMessage, CommunityReport, CommunityBlock, User } = require('../../models');
const communityService = require('../community/communityService');

async function getDashboard(req, res) {
  try {
    const [roomCount, activeMemberCount, messageCount, pendingReportCount] = await Promise.all([
      CommunityRoom.count({ where: { is_active: true } }),
      CommunityMember.count({ where: { left_at: null } }),
      CommunityMessage.count(),
      CommunityReport.count({ where: { status: 'pending' } }),
    ]);

    res.json({
      roomCount,
      activeMemberCount,
      messageCount,
      pendingReportCount,
    });
  } catch (error) {
    console.error('getDashboard error:', error);
    res.status(500).json({ message: '관리자 대시보드 조회 실패' });
  }
}

async function getReports(req, res) {
  try {
    const reports = await CommunityReport.findAll({
      include: [
        { model: User, as: 'reporter', attributes: ['user_id', 'name', 'phone'] },
        { model: User, as: 'target', attributes: ['user_id', 'name', 'phone'] },
        { model: CommunityRoom, attributes: ['room_id', 'title'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ reports });
  } catch (error) {
    console.error('getReports error:', error);
    res.status(500).json({ message: '신고 목록 조회 실패' });
  }
}

async function updateReportStatus(req, res) {
  try {
    const report = await CommunityReport.findByPk(req.params.reportId);
    if (!report) return res.status(404).json({ message: '신고를 찾을 수 없습니다.' });

    await report.update({ status: req.body.status || 'reviewed' });
    res.json({ report });
  } catch (error) {
    console.error('updateReportStatus error:', error);
    res.status(500).json({ message: '신고 상태 변경 실패' });
  }
}

async function updateRoom(req, res) {
  try {
    const room = await communityService.updateRoom(req.params.roomId, req.body);
    if (!room) return res.status(404).json({ message: '방을 찾을 수 없습니다.' });
    res.json({ room });
  } catch (error) {
    console.error('admin updateRoom error:', error);
    res.status(500).json({ message: '방 수정 실패' });
  }
}

async function closeRoom(req, res) {
  try {
    const room = await communityService.closeRoom(req.params.roomId);
    if (!room) return res.status(404).json({ message: '방을 찾을 수 없습니다.' });
    res.json({ message: '방 비활성화 완료', room });
  } catch (error) {
    console.error('closeRoom error:', error);
    res.status(500).json({ message: '방 비활성화 실패' });
  }
}

async function kickMember(req, res) {
  try {
    const { roomId, userId } = req.params;
    const member = await communityService.leaveRoom(roomId, userId);
    if (!member) return res.status(404).json({ message: '참여자를 찾을 수 없습니다.' });
    res.json({ message: '참여자 강퇴 처리 완료', member });
  } catch (error) {
    console.error('kickMember error:', error);
    res.status(500).json({ message: '참여자 강퇴 실패' });
  }
}

async function getBlocks(req, res) {
  try {
    const blocks = await CommunityBlock.findAll({
      include: [
        { model: User, as: 'blocker', attributes: ['user_id', 'name', 'phone'] },
        { model: User, as: 'blocked', attributes: ['user_id', 'name', 'phone'] },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ blocks });
  } catch (error) {
    console.error('getBlocks error:', error);
    res.status(500).json({ message: '차단 목록 조회 실패' });
  }
}

module.exports = {
  getDashboard,
  getReports,
  updateReportStatus,
  updateRoom,
  closeRoom,
  kickMember,
  getBlocks,
};

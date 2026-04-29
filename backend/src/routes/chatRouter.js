const express = require('express');
const router = express.Router();
// ✅ ChatHistory 대신 실제 모델명인 Chat을 불러옵니다.
const { Schedule, Chat } = require('../models');
const { Op } = require('sequelize');

/**
 * 공통 유틸 함수
 */
const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

const parseUserId = (userId) => {
    const parsed = parseInt(userId, 10);
    return isNaN(parsed) ? null : parsed;
};

/**
 * ✅ 1. 일정 조회 (Schedule)
 * GET /api/chat/schedules/:userId?date=YYYY-MM-DD
 */
router.get('/schedules/:userId', async (req, res) => {
    try {
        const userId = parseUserId(req.params.userId);
        const { date } = req.query;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Invalid userId' });
        }

        if (!date || !isValidDate(date)) {
            return res.status(400).json({ success: false, message: 'date must be YYYY-MM-DD format' });
        }

        console.log(`📥 일정 조회 → userId: ${userId}, date: ${date}`);

        const results = await Schedule.findAll({
            where: {
                user_id: userId,
                schedule_time: {
                    [Op.and]: [
                        { [Op.gte]: `${date} 00:00:00` },
                        { [Op.lte]: `${date} 23:59:59` }
                    ]
                }
            },
            order: [['schedule_time', 'ASC']]
        });

        return res.json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (err) {
        console.error('❌ 일정 조회 실패:', err);
        return res.status(500).json({ success: false, message: '일정 조회 실패' });
    }
});

/**
 * ✅ 2. 대화 기록 조회 (History)
 * GET /api/chat/history/:userId
 */
router.get('/history/:userId', async (req, res) => {
    try {
        const userId = parseUserId(req.params.userId);

        if (!userId) {
            return res.status(400).json({ success: false, message: 'Invalid userId' });
        }

        console.log(`📥 대화 기록 조회 → userId: ${userId}`);

        // ✅ Chat.findAll을 사용하여 대화 내역을 가져옵니다.
        const history = await Chat.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });

        return res.json({
            success: true,
            count: history.length,
            data: history
        });

    } catch (err) {
        console.error('❌ 대화 기록 조회 실패:', err);
        return res.status(500).json({ success: false, message: '대화 기록 조회 실패' });
    }
});

module.exports = router;
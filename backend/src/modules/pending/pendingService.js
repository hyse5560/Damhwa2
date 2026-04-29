const { PendingSchedule } = require('../../models');
const eventBus = require('../../events/eventBus');
const { Op } = require('sequelize');

eventBus.on('schedule:pending', async (data) => {
    try {
        const THIRTY_MIN_AGO = new Date(Date.now() - 30 * 60 * 1000);

        let pending = await PendingSchedule.findOne({
            where: { 
                user_id: data.userId, 
                status: 'pending',
                created_at: { [Op.gte]: THIRTY_MIN_AGO } 
            },
            order: [['created_at', 'DESC']]
        });

        if (pending) {
            // 🔥 상태 체크 (이미 확정된 건 무시)
            if (pending.status !== 'pending') return;

            await pending.update({
                parsed_title: data.title || pending.parsed_title,
                parsed_datetime: data.datetime || pending.parsed_datetime,

                // 🔥 길이 제한 (DB 보호)
                raw_message: (pending.raw_message + " | " + data.content).slice(-500),

                // 🔥 confidence는 최대값 유지
                confidence: Math.max(
                    parseFloat(data.confidence) || 0,
                    parseFloat(pending.confidence) || 0
                )
            });
        } else {
            pending = await PendingSchedule.create({
                user_id: data.userId,
                chat_id: data.chatId,
                raw_message: data.content,
                parsed_title: data.title,
                parsed_datetime: data.datetime,
                confidence: parseFloat(data.confidence) || 0,
                status: 'pending'
            });
        }

        // 🔥 날짜 검증 강화
        const isValidDate = pending.parsed_datetime && 
            !isNaN(new Date(pending.parsed_datetime));

        const isComplete = pending.parsed_title && isValidDate;

        if (isComplete && parseFloat(pending.confidence) > 0.6) {
            eventBus.emit('schedule:confirm', pending);
        }

    } catch (err) {
        console.error('Pending 로직 에러:', err);
    }
});
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
            if (pending.status !== 'pending') return;

            await pending.update({
                parsed_title: data.title || pending.parsed_title,
                parsed_datetime: data.datetime || pending.parsed_datetime,
                raw_message: (pending.raw_message + " | " + data.content).slice(-500),
                confidence: Math.max(parseFloat(data.confidence) || 0, parseFloat(pending.confidence) || 0)
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

        const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        const hasFullDateTime = pending.parsed_datetime && datetimeRegex.test(pending.parsed_datetime);
        
        const isValidDate = pending.parsed_datetime && 
            !isNaN(new Date(pending.parsed_datetime)) && 
            hasFullDateTime;

        const isComplete = pending.parsed_title && isValidDate;

        if (isComplete && parseFloat(pending.confidence) > 0.6) {
            // 🎯 모든 퍼즐 조각(제목+시간)이 다 맞춰졌으므로 최종 등록 이동!
            eventBus.emit('schedule:confirm', pending);
        } else {
            // 💡 [수정] chatService 연결 이벤트를 다 없애고 간단한 로그만 남깁니다.
            // 대화 유도는 챗봇 프롬프트(CHAT_SYSTEM)가 알아서 처리할 것입니다.
            console.log(`--- [정보 부족] 현재 상태 보존 중 (Title: ${pending.parsed_title ? 'O' : 'X'}, Time: ${isValidDate ? 'O' : 'X'}) ---`);
        }

    } catch (err) {
        console.error('Pending 로직 에러:', err);
    }
});
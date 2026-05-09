// src/modules/pending/pendingService.js
const { PendingSchedule } = require('../../models');
const eventBus = require('../../events/eventBus');

eventBus.on('schedule:pending', async (data) => {
    try {
        const pending = await PendingSchedule.create({
            user_id: data.userId,
            chat_id: data.chatId,
            raw_message: data.content || data.raw, // 변수명 통일 확인 필요
            parsed_title: data.title,
            parsed_datetime: data.datetime,
            confidence: data.confidence
        });

        if (data.confidence > 0.8) {
            eventBus.emit('schedule:confirm', pending);
        }
    } catch (err) {
        console.error('Pending 저장 에러:', err);
    }
});
// src/modules/pending/pendingService.js
const { PendingSchedule } = require('../../models');
const eventBus = require('../../events/eventBus');

eventBus.on('schedule:pending', async (data) => {
    const pending = await PendingSchedule.create({
        user_id: data.userId,
        chat_id: data.chatId,
        raw_message: data.raw,
        parsed_title: data.title,
        parsed_datetime: data.datetime,
        confidence: data.confidence
    });

    // 신뢰도 높으면 자동 확정
    if (data.confidence > 0.8) {
        eventBus.emit('schedule:confirm', pending);
    }
});
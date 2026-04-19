// src/modules/notification/fcmService.js
const eventBus = require('../../events/eventBus');
const fcm = require('../../config/fcm');

eventBus.on('schedule:created', async (schedule) => {
    await fcm.send({
        userId: schedule.user_id,
        title: '일정 등록됨',
        body: schedule.title
    });
});
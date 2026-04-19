// src/modules/schedule/scheduleService.js
const { Schedule } = require('../../models');
const eventBus = require('../../events/eventBus');

eventBus.on('schedule:confirm', async (pending) => {
    const schedule = await Schedule.create({
        user_id: pending.user_id,
        title: pending.parsed_title,
        schedule_time: pending.parsed_datetime,
        raw_message: pending.raw_message
    });

    eventBus.emit('schedule:created', schedule);
});
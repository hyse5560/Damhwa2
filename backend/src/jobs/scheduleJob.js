// src/jobs/scheduleJob.js
const { Schedule } = require('../models');
const fcm = require('../modules/notification/fcmService');

async function run() {
    setInterval(async () => {
        const now = new Date();

        const schedules = await Schedule.findAll({
            where: {
                notified: false,
                schedule_time: { $lte: now }
            }
        });

        for (const s of schedules) {
            await fcm.send({
                userId: s.user_id,
                title: '일정 알림',
                body: s.title
            });

            s.notified = true;
            await s.save();
        }
    }, 60000);
}

module.exports = { run };
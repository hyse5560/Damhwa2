const { Schedule } = require('../models');
const { Op } = require('sequelize');
const fcmService = require('../modules/notification/fcmService');

async function checkSchedules() {
    try {
        const now = new Date();

        console.log('\n==============================');
        console.log('[Job] 일정 검사 시작');
        console.log('[Job] 현재 서버 시간:', now);

        const schedules = await Schedule.findAll({
            where: {
                notified: false,
                schedule_time: {
                    [Op.lte]: now
                }
            },
            order: [['schedule_time', 'ASC']]
        });

        console.log(`[Job] 조회된 일정 개수: ${schedules.length}`);

        for (const s of schedules) {
            console.log(
                `[Job] 대상 일정 -> ID:${s.id} | 제목:${s.title} | 시간:${s.schedule_time} | notified:${s.notified}`
            );
        }
        if (schedules.length === 0) {
            console.log('[Job] 발송 대상 없음');
            return;
        }

        for (const s of schedules) {
            try {
                console.log(`[Job] 일정 ID ${s.id} 알림 발송 시작`);

                await fcmService.pushToUser(
                    s.user_id,
                    '📅 일정 알림',
                    `지금은 '${s.title}' 시간입니다!`,
                    {
                        type: 'REMINDER',
                        scheduleId: s.id.toString()
                    }
                );

                console.log(`[Job] 일정 ID ${s.id} FCM 전송 성공`);

                s.notified = true;
                await s.save();

                console.log(`[Job] 일정 ID ${s.id} notified=true 업데이트 완료`);

            } catch (sendError) {
                console.error(
                    `[Job] 일정 ID ${s.id} 개별 전송 실패:`,
                    sendError
                );
            }
        }

    } catch (dbError) {
        console.error('[Job] DB 조회 중 에러 발생:', dbError);
    }
}

async function run() {
    console.log('[Job] 일정 리마인더 감시 시작 (주기: 1분)');

    await checkSchedules();

    setInterval(async () => {
        await checkSchedules();
    }, 60000);
}

module.exports = { run };
const { Schedule } = require('../models');
const { Op } = require('sequelize');
const fcmService = require('../modules/notification/fcmService');

/**
 * 리마인더 체크 실행
 */
async function run() {
    console.log('[Job] 일정 리마인더 감시 시작 (주기: 1분)');

    // 1분(60000ms)마다 반복
    setInterval(async () => {
        try {
            const now = new Date();

            // 1. 조건에 맞는 일정 조회 (미발송 && 시간이 현재이거나 과거인 것)
            const schedules = await Schedule.findAll({
                where: {
                    notified: false,
                    schedule_time: {
                        [Op.lte]: now // 현재 시간보다 작거나 같은(이전인) 데이터
                    }
                }
            });

            if (schedules.length === 0) return;

            console.log(`[Job] 처리 대기 중인 알림 ${schedules.length}건 발견`);

            // 2. 루프를 돌며 알림 발송
            for (const s of schedules) {
                try {
                    await fcmService.pushToUser(
                        s.user_id,
                        '일정 알림',
                        `지금은 '${s.title}' 시간입니다!`,
                        { 
                            type: 'REMINDER',
                            scheduleId: s.id.toString() 
                        }
                    );

                    // 3. 발송 완료 상태 업데이트
                    s.notified = true;
                    await s.save();
                    
                } catch (sendError) {
                    console.error(`[Job] 일정 ID ${s.id} 개별 전송 실패:`, sendError.message);
                }
            }
        } catch (dbError) {
            console.error('[Job] DB 조회 중 에러 발생:', dbError.message);
        }
    }, 60000);
}

module.exports = { run };
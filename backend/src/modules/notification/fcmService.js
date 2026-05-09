const { User } = require('../../models');
const fcm = require('../../config/fcm');
const eventBus = require('../../events/eventBus');

/**
 * 공통 푸시 발송 함수
 * @param {number} userId - 수신 유저 ID
 * @param {string} title - 알림 제목
 * @param {string} body - 알림 내용
 * @param {object} data - 추가 데이터 (모든 값은 문자열이어야 함)
 */
async function pushToUser(userId, title, body, data = {}) {
    try {
        // 1. 유저 테이블에서 직접 push_token 조회
        const user = await User.findByPk(userId, {
            attributes: ['push_token']
        });

        if (!user || !user.push_token) {
            console.log(`[FCM] 유저 ${userId}: 토큰이 없어 발송을 건너뜁니다.`);
            return;
        }

        // 2. config/fcm.js의 sendPush 호출
        await fcm.sendPush(user.push_token, title, body, data);
        console.log(`[FCM] 유저 ${userId}에게 알림 전송 성공`);

    } catch (err) {
        console.error(`[FCM Error] 유저 ${userId} 전송 중 오류:`, err.message);
    }
}

// [이벤트 구독] 일정 등록 즉시 알림
eventBus.on('schedule:created', async (schedule) => {
    await pushToUser(
        schedule.user_id,
        '📅 일정 등록 완료',
        `'${schedule.title}' 일정이 등록되었습니다.`,
        { 
            type: 'CREATED',
            scheduleId: schedule.id.toString() 
        }
    );
});

module.exports = { pushToUser };
const { Schedule, PendingSchedule } = require('../../models');
const eventBus = require('../../events/eventBus');

eventBus.on('schedule:confirm', async (pending) => {
    try {
        // 🔥 이미 처리된 경우 방지
        if (pending.status !== 'pending') return;

        // 🔥 중복 일정 체크
        const existing = await Schedule.findOne({
            where: {
                user_id: pending.user_id,
                title: pending.parsed_title,
                schedule_time: pending.parsed_datetime
            }
        });

        if (existing) {
            await pending.update({ status: 'confirmed' });
            return;
        }

        const schedule = await Schedule.create({
            user_id: pending.user_id,
            title: pending.parsed_title,
            schedule_time: pending.parsed_datetime,
            raw_message: pending.raw_message
        });

        await pending.update({ status: 'confirmed' });

        eventBus.emit('schedule:created', schedule);
        console.log("--- 일정 등록 완료 ---");

    } catch (err) {
        console.error('Final Schedule 저장 에러:', err);
    }
});
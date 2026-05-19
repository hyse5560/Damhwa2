const { Schedule, PendingSchedule, sequelize } = require('../../models'); // sequelize 인스턴스 가져오기
const eventBus = require('../../events/eventBus');

eventBus.on('schedule:confirm', async (pending) => {
    // 1. 트랜잭션 시작
    const transaction = await sequelize.transaction();

    try {
        // 🔥 이미 처리 중이거나 완료된 경우 방지 (다시 한 번 검증)
        const currentPending = await PendingSchedule.findByPk(pending.id, { transaction });
        if (!currentPending || currentPending.status !== 'pending') {
            await transaction.rollback();
            return;
        }

        // 🔥 중복 일정 체크
        const existing = await Schedule.findOne({
            where: {
                user_id: currentPending.user_id,
                title: currentPending.parsed_title,
                schedule_time: currentPending.parsed_datetime
            },
            transaction
        });

        // 이미 같은 일정이 있다면 pending만 지우고 종료
        if (existing) {
            await currentPending.destroy({ transaction });
            await transaction.commit();
            return;
        }

        // 🔥 1. Schedule 테이블로 복사 (이동)
        const schedule = await Schedule.create({
            user_id: currentPending.user_id,
            title: currentPending.parsed_title,
            schedule_time: currentPending.parsed_datetime,
            raw_message: currentPending.raw_message
        }, { transaction });

        // 🔥 2. PendingSchedule 테이블에서 해당 데이터 삭제
        await currentPending.destroy({ transaction });

        // 모든 작업이 성공하면 DB에 최종 반영
        await transaction.commit();

        // 이벤트 발행 및 로그
        eventBus.emit('schedule:created', schedule);
        console.log(`--- [일정 등록 및 Pending 삭제 완료] User: ${schedule.user_id} ---`);

    } catch (err) {
        // 에러 발생 시 이전 상태로 롤백
        await transaction.rollback();
        console.error('Final Schedule 저장 및 Pending 삭제 에러:', err);
    }
});
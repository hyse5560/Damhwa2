const eventBus = require('../../events/eventBus');
const openai = require('../../config/openai');
const { SCHEDULE_PARSER } = require('../../config/prompts'); // 프롬프트 불러오기

async function parse({ userId, chatId, content }) {
    try {
        // 1. OpenAI 호출 시 전용 프롬프트 전달
        const result = await openai.parseSchedule(content, SCHEDULE_PARSER);

        if (!result) return;

        console.log(`[Parser] 일정 감지됨: ${JSON.stringify(result)}`);

        eventBus.emit('schedule:pending', {
            userId,
            chatId,
            ...result 
        });

    } catch (error) {
        console.error('[Parser Error] 분석 중 에러 발생:', error);
    }
}

module.exports = { parse };
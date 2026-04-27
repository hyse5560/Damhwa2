const eventBus = require('../../events/eventBus');
const openai = require('../../config/openai');
const { SCHEDULE_PARSER } = require('../../config/prompts');

async function parse({ userId, chatId, content }) {
    if (!content || content === "SYSTEM_EMPTY_INPUT") return;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SCHEDULE_PARSER },
                { role: "user", content: content }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);

        if (!result || result.no_schedule || !result.parsed_datetime || result.parsed_datetime === 'Invalid date') {
            return;
        }

        eventBus.emit('schedule:pending', {
            userId,
            chatId,
            ...result 
        });

    } catch (error) {
        console.error('[Parser Error]:', error);
    }
}

module.exports = { parse };
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

        // 🔥 JSON 안전 파싱
        let raw = response.choices[0].message.content?.trim();
        if (!raw) return;

        if (raw.startsWith("```")) {
            raw = raw.replace(/```json|```/g, '').trim();
        }

        let result;
        try {
            result = JSON.parse(raw);
        } catch (e) {
            console.error('[JSON Parse Error]:', raw);
            return;
        }

        if (!result || result.no_schedule) return;

        eventBus.emit('schedule:pending', {
            userId,
            chatId,
            content,
            title: result.title || null,
            datetime: result.datetime || null,
            confidence: parseFloat(result.confidence) || 0.0
        });

    } catch (error) {
        console.error('[Parser Error]:', error);
    }
}

module.exports = { parse };
// src/modules/parser/parserService.js
const eventBus = require('../../events/eventBus');
const openai = require('../../config/openai');

async function parse({ userId, chatId, content }) {
    const result = await openai.parseSchedule(content);

    if (!result) return;

    eventBus.emit('schedule:pending', {
        userId,
        chatId,
        ...result
    });
}

module.exports = { parse };
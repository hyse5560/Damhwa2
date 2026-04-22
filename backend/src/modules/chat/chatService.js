const eventBus = require('../../events/eventBus');

async function handleMessage(ws, { userId, content, conversationId }) {
    eventBus.emit('chat:received', {
        ws,
        userId,
        content,
        conversationId
    });
}

module.exports = { handleMessage };
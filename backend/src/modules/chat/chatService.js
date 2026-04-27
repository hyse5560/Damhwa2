//chatService.js
const eventBus = require('../../events/eventBus');

async function handleMessage(socket, { userId, content, conversationId }) {
    eventBus.emit('chat:received', {
        socket, 
        userId,
        content,
        conversationId
    });
}

module.exports = { handleMessage };
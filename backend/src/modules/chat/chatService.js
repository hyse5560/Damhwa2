// src/modules/chat/chatService.js
const { Chat } = require('../../models');
const eventBus = require('../../events/eventBus');

async function handleMessage(ws, { userId, content }) {
    // 1. DB 저장
    const chat = await Chat.create({
        user_id: userId,
        role: 'elder',
        content
    });

    // 2. 스트리밍 요청
    eventBus.emit('chat:stream', {
        ws,
        userId,
        content
    });

    // 3. 파싱 (비동기)
    eventBus.emit('chat:parse', {
        userId,
        chatId: chat.chat_id,
        content
    });
}

module.exports = { handleMessage };
const eventBus = require('../../events/eventBus');
const { Chat, Conversation } = require('../../models');
const streamingService = require('../streaming/streamingService');
const parserService = require('../parser/parserService');

eventBus.on('chat:received', async (data) => {
    const { socket, userId, content } = data; // ws -> socket
    let { conversationId } = data;

    try {
        if (!conversationId) {
            const newConv = await Conversation.create({ 
                user_id: userId, 
                title: content.slice(0, 20) 
            });
            conversationId = newConv.conversation_id;
            
            socket.emit('conv_created', { conversationId });
        }

        // 2. 사용자 메시지 DB 저장
        const chat = await Chat.create({
            conversation_id: conversationId,
            user_id: userId,
            role: 'elder',
            content
        });

        streamingService.handleStream({ socket, userId, content, conversationId });
        
        parserService.parse({ userId, chatId: chat.chat_id, content });

    } catch (error) {
        console.error('이벤트 처리 중 에러:', error);
    }
});
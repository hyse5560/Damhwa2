const eventBus = require('../../events/eventBus');
const { Chat, Conversation } = require('../../models');
const streamingService = require('../streaming/streamingService');
const parserService = require('../parser/parserService');

eventBus.on('chat:received', async (data) => {
    const { socket, userId, content } = data;
    let { conversationId } = data;

    try {
        const THIRTY_MINUTES = 30 * 60 * 1000;
        const now = new Date();

        if (!conversationId) {
            // 해당 유저의 가장 최근 메시지 하나를 가져옴
            const lastChat = await Chat.findOne({
                where: { user_id: userId },
                order: [['created_at', 'DESC']]
            });

            if (lastChat && (now - new Date(lastChat.created_at) < THIRTY_MINUTES)) {
                conversationId = lastChat.conversation_id;
            } else {
                // 기록이 없거나 30분이 지났다면 새로운 Conversation 생성
                const newConv = await Conversation.create({ 
                    user_id: userId, 
                    title: content.slice(0, 20) 
                });
                conversationId = newConv.conversation_id;
                
                socket.emit('conv_created', { conversationId });
            }
        }

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
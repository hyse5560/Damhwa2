const eventBus = require('../../events/eventBus');
const { Chat, Conversation } = require('../../models');
const streamingService = require('../streaming/streamingService');
const parserService = require('../parser/parserService');

eventBus.on('chat:received', async (data) => {
    const { ws, userId, content } = data;
    let { conversationId } = data;

    try {
        // 1. 대화방 없으면 생성 (지휘소가 판단)
        if (!conversationId) {
            const newConv = await Conversation.create({ 
                user_id: userId, 
                title: content.slice(0, 20) 
            });
            conversationId = newConv.conversation_id;
            // 프론트에 새 ID 전송
            ws.send(JSON.stringify({ type: 'conv_created', conversationId }));
        }

        // 2. 사용자 메시지 DB 저장
        const chat = await Chat.create({
            conversation_id: conversationId,
            user_id: userId,
            role: 'elder',
            content
        });

        // 3. 각각의 워커(Worker)들에게 일 시키기
        // 스트리밍 서비스 호출
        streamingService.handleStream({ ws, userId, content, conversationId });
        
        // 파서 서비스 호출
        parserService.parse({ userId, chatId: chat.chat_id, content });

    } catch (error) {
        console.error('이벤트 처리 중 에러:', error);
    }
});
const openai = require('../../config/openai');
const speechService = require('../speech/speechService');
const { Chat } = require('../../models');
const { CHAT_SYSTEM } = require('../../config/prompts');

async function handleStream({ socket, userId, content, conversationId }) { // ws -> socket
    try {
        const stream = await openai.stream(content, CHAT_SYSTEM);
        let fullText = '';

        for await (const chunk of stream) {
            fullText += chunk;

            socket.emit('speech:text', { text: fullText }); 
        }

        await Chat.create({
            conversation_id: conversationId,
            user_id: userId,
            role: 'ai',
            content: fullText
        });

        const audioBase64 = await speechService.textToSpeech(fullText);

        socket.emit('speech:reply', { reply: fullText });
        socket.emit('speech:tts', { ttsBase64: audioBase64 });

        socket.emit('speech:status', { status: 'idle' });

    } catch (error) {
        console.error('Streaming Service Error:', error);
        socket.emit('error', { message: '답변 생성 중 오류가 발생했습니다.' });
        socket.emit('speech:status', { status: 'idle' });
    }
}

module.exports = { handleStream };
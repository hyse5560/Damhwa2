const websocket = require('../../sockets/websocket');
const openai = require('../../config/openai');
const speechService = require('../speech/speechService');
const { Chat } = require('../../models');
const { CHAT_SYSTEM } = require('../../config/prompts'); // 프롬프트 불러오기

async function handleStream({ ws, userId, content, conversationId }) {
    try {
        // 1. OpenAI 스트리밍 시작 시 대화용 프롬프트 전달
        const stream = await openai.stream(content, CHAT_SYSTEM);
        let fullText = '';

        for await (const chunk of stream) {
            fullText += chunk;

            websocket.send(ws, {
                type: 'stream',
                data: chunk
            });
        }

        // 2. AI 답변 DB 저장
        await Chat.create({
            conversation_id: conversationId,
            user_id: userId,
            role: 'ai',
            content: fullText
        });

        // 3. 🔊 TTS (여기서 생성된 따뜻한 말투의 텍스트가 목소리로 변환됨)
        const audio = await speechService.textToSpeech(fullText);

        websocket.send(ws, {
            type: 'audio',
            data: audio
        });

        websocket.send(ws, {
            type: 'end'
        });

    } catch (error) {
        console.error('Streaming Service Error:', error);
        websocket.send(ws, { type: 'error', message: '답변 생성 중 오류가 발생했습니다.' });
    }
}

module.exports = { handleStream };
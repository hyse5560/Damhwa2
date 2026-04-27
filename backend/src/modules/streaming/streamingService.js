const openai = require('../../config/openai');
const speechService = require('../speech/speechService');
const { Chat } = require('../../models');
const { CHAT_SYSTEM } = require('../../config/prompts');

async function handleStream({ socket, userId, content, conversationId }) {
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: CHAT_SYSTEM },
                { role: "user", content: content }
            ],
            stream: true,
        });

        let fullText = '';
        let sentenceBuffer = ''; 

        for await (const chunk of stream) {
            const contentChunk = chunk.choices[0]?.delta?.content || "";
            if (!contentChunk) continue;

            fullText += contentChunk;
            sentenceBuffer += contentChunk;

            socket.emit('speech:text', { text: fullText });

            if (/[.!?\n]/.test(contentChunk)) {
                const sentence = sentenceBuffer.trim();
                if (sentence.length > 0) {
                    speechService.textToSpeech(sentence)
                        .then(audio => socket.emit('speech:tts', { ttsBase64: audio }))
                        .catch(err => console.error('TTS Error:', err));
                    sentenceBuffer = ''; 
                }
            }
        }

        if (sentenceBuffer.trim().length > 0) {
            const finalAudio = await speechService.textToSpeech(sentenceBuffer.trim());
            socket.emit('speech:tts', { ttsBase64: finalAudio });
        }

        await Chat.create({
            conversation_id: conversationId,
            user_id: userId,
            role: 'ai',
            content: fullText
        });

        socket.emit('speech:reply', { reply: fullText });
        socket.emit('speech:status', { status: 'idle' });

    } catch (error) {
        console.error('Streaming Error:', error);
        socket.emit('speech:status', { status: 'idle' });
    }
}

module.exports = { handleStream };
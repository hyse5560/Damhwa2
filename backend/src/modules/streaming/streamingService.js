// src/modules/streaming/streamingService.js
const websocket = require('../../sockets/websocket');
const openai = require('../../config/openai');
const speechService = require('../speech/speechService');

async function handleStream({ ws, content }) {
    const stream = await openai.stream(content);

    let fullText = '';

    for await (const chunk of stream) {
        fullText += chunk;

        websocket.send(ws, {
            type: 'stream',
            data: chunk
        });
    }

    // 🔊 TTS
    const audio = await speechService.textToSpeech(fullText);

    websocket.send(ws, {
        type: 'audio',
        data: audio
    });

    websocket.send(ws, {
        type: 'end'
    });
}

module.exports = { handleStream };
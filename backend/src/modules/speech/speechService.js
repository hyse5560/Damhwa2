// src/modules/speech/speechService.js
const eventBus = require('../../events/eventBus');
const gcp = require('../../config/gcp');

// 🔊 STT (음성 → 텍스트)
async function speechToText(audioBuffer) {
    const text = await gcp.stt(audioBuffer);
    return text;
}

// 🔊 TTS (텍스트 → 음성)
async function textToSpeech(text) {
    const audio = await gcp.tts(text);
    return audio;
}

module.exports = {
    speechToText,
    textToSpeech
};
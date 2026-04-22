const gcp = require('../../config/gcp');

/**
 * 🔊 TTS (텍스트 → 음성)
 */
async function textToSpeech(text) {
    const audio = await gcp.tts(text);
    return audio;
}

/**
 * 🔊 실시간 STT 스트림 생성
 * @param {Function} onData - 데이터 수신 시 콜백 (transcript, isFinal)
 * @param {Function} onError - 에러 발생 시 콜백
 */
function createRecognizeStream(onData, onError) {
    const request = {
        config: {
            encoding: 'LINEAR16', // 프론트엔드 오디오 포맷에 맞춰 설정 (예: RAW PCM)
            sampleRateHertz: 16000,
            languageCode: 'ko-KR',
        },
        interimResults: true,
    };

   
    return gcp.speechClient
        .streamingRecognize(request)
        .on('error', (err) => {
            console.error('GCP STT Stream Error:', err);
            if (onError) onError(err);
        })
        .on('data', (data) => {
            const result = data.results[0];
            if (result && result.alternatives[0]) {
                const transcript = result.alternatives[0].transcript;
                const isFinal = result.isFinal;
                onData(transcript, isFinal);
            }
        });
}

module.exports = {
    textToSpeech,
    createRecognizeStream
};
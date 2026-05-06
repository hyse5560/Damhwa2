const googleTTS = require('@google-cloud/text-to-speech');
const googleSpeech = require('@google-cloud/speech');

const ttsClient = new googleTTS.TextToSpeechClient();
const sttClient = new googleSpeech.SpeechClient();

async function textToSpeech(text) {
    try {
        const request = {
            input: { text },
            voice: { languageCode: 'ko-KR', ssmlGender: 'FEMALE' },
            audioConfig: { audioEncoding: 'MP3' },
        };
        const [response] = await ttsClient.synthesizeSpeech(request);
        return response.audioContent.toString('base64');
    } catch (error) {
        console.error('TTS Error:', error);
        throw error;
    }
}

function createRecognizeStream(onData, onError) {
    const request = {
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'ko-KR',
            enableAutomaticPunctuation: true,
        },
        interimResults: true,
        singleUtterance: false, // 🔥 추가 (중간 끊김 방지)
    };

    return sttClient
        .streamingRecognize(request)
        .on('error', (err) => {
            if (onError) onError(err);
        })
        .on('data', (data) => {
            const results = data.results;
            if (!results || results.length === 0) return;

            const result = results[results.length - 1]; // 🔥 핵심 수정

            if (result && result.alternatives[0]) {
                onData(result.alternatives[0].transcript, result.isFinal);
            }
        });
}

module.exports = { textToSpeech, createRecognizeStream };
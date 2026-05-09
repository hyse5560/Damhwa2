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
        },
        interimResults: true,
    };
    return sttClient
        .streamingRecognize(request)
        .on('error', (err) => {
            if (onError) onError(err);
        })
        .on('data', (data) => {
            const result = data.results[0];
            if (result && result.alternatives[0]) {
                onData(result.alternatives[0].transcript, result.isFinal);
            }
        });
}

module.exports = { textToSpeech, createRecognizeStream };
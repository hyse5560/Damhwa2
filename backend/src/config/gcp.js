const speech = require("@google-cloud/speech");
const textToSpeech = require("@google-cloud/text-to-speech");

const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const speechClient = new speech.SpeechClient({
  keyFilename: keyFile,
});

const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: keyFile,
});

module.exports = {
  speechClient,
  ttsClient,
};
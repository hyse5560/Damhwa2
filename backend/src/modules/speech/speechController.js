const speechService = require('./speechService');

async function textToSpeech(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'text는 필수입니다.' });

    const audioBase64 = await speechService.textToSpeech(text);
    res.json({ audioBase64, encoding: 'MP3' });
  } catch (error) {
    console.error('textToSpeech error:', error);
    res.status(500).json({ message: 'TTS 변환 실패. GOOGLE_APPLICATION_CREDENTIALS 설정을 확인하세요.' });
  }
}

module.exports = { textToSpeech };

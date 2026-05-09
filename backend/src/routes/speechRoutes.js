const express = require('express');
const speechController = require('../modules/speech/speechController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Speech
 *   description: STT/TTS API
 */
router.post('/tts', requireAuth, speechController.textToSpeech);

module.exports = router;

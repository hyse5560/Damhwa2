// src/modules/auth/authRouter.js
const express = require('express');
const router = express.Router();
const { signup } = require('./authController');

router.post('/signup', signup); 

module.exports = router;
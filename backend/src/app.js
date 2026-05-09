// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const setupSwagger = require('./config/swagger');

const app = express();

// 🔥 기본 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 🔥 라우터
const authRoutes = require('./routes/authRoutes');
const communityRoutes = require('./routes/communityRoutes');
const speechRoutes = require('./routes/speechRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/community', communityRoutes);
app.use('/speech', speechRoutes);
app.use('/admin', adminRoutes);

// API 문서
setupSwagger(app);

// 🔥 헬스 체크
app.get('/', (req, res) => {
    res.send('Server is running');
});

module.exports = app;
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const chatRouter = require('./routes/chatRouter'); // 위에서 만든 라우터 불러오기

const app = express();

// 기본 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 🔥 모든 '/api/chat' 관련 요청은 chatRouter에서 처리하도록 연결
app.use('/api/chat', chatRouter);

app.get('/', (req, res) => res.send('Server is running'));

module.exports = app;
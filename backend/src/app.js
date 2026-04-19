// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// 🔥 기본 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 🔥 라우터 (지금은 비워도 OK)
//const routes = require('./routes');
//app.use('/api', routes);

// 🔥 헬스 체크
app.get('/', (req, res) => {
    res.send('Server is running');
});

module.exports = app;
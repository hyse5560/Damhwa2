// src/server.js
require('dotenv').config();

const http = require('http');
const app = require('./app');

const { sequelize } = require('./models');
const websocket = require('./sockets/websocket');
const scheduleJob = require('./jobs/scheduleJob');

// 🔥 이벤트 등록 (중요)
require('./modules/chat/chatEvent');
require('./modules/pending/pendingService');
require('./modules/schedule/scheduleService');
require('./modules/notification/fcmService');
require('./modules/room/roomEvent');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // ✅ DB 연결
        await sequelize.authenticate();
        console.log('DB 연결 성공');

        await sequelize.sync();
        console.log('DB 동기화 완료');

        // ✅ HTTP 서버 생성
        const server = http.createServer(app);

        // ✅ WebSocket 연결
        websocket.init(server);

        // ✅ 백그라운드 잡 실행
        scheduleJob.run();

        // ✅ 서버 실행
        server.listen(PORT, () => {
            console.log(`서버 실행: http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('서버 시작 실패:', err);
        process.exit(1);
    }
}

startServer();
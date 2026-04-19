// src/sockets/websocket.js
const WebSocket = require('ws');
const chatService = require('../modules/chat/chatService');

let wss;

function init(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('소켓 연결');

        ws.on('message', async (message) => {
            const data = JSON.parse(message);

            if (data.type === 'message') {
                await chatService.handleMessage(ws, data);
            }
        });

        ws.on('close', () => {
            console.log('소켓 종료');
        });
    });
}

function send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

module.exports = { init, send };
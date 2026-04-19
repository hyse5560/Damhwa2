// src/modules/chat/chatEvents.js
const eventBus = require('../../events/eventBus');
const streamingService = require('../streaming/streamingService');
const parserService = require('../parser/parserService');

// 🔥 스트리밍 연결
eventBus.on('chat:stream', async (data) => {
    await streamingService.handleStream(data);
});

// 🔥 파싱 연결
eventBus.on('chat:parse', async (data) => {
    await parserService.parse(data);
});
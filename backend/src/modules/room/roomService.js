const eventBus = require('../../events/eventBus');


function joinRoom(socket, data) {
    console.log('=== joinRoom ===');
    console.log(data);

    eventBus.emit('room:join', {
        socket,
        roomId: data?.roomId,
        userId: data?.userId
    });
}


function leaveRoom(socket, data) {
    console.log('=== leaveRoom ===');
    console.log(data);

    eventBus.emit('room:leave', {
        socket,
        roomId: data?.roomId,
        userId: data?.userId
    });
}

function sendMessage(socket, data) {
    console.log('=== roomService ===');
    console.log('raw data:', data);
    console.log('roomId:', data?.roomId);
    console.log('userId:', data?.userId);
    console.log('content:', data?.content);

    const payload = {
        socket,
        roomId: data?.roomId,
        userId: data?.userId,
        content: data?.content
    };

    console.log(`[MSG SEND] Room: ${data?.roomId} | User: ${data?.userId} | Content: ${data?.content}`);

    eventBus.emit('room:message', payload);
}

module.exports = {
    joinRoom,
    leaveRoom,
    sendMessage
};
// roomEvent.js
const eventBus = require('../../events/eventBus');
const { RoomMessage } = require('../../models');

eventBus.on('room:join', ({ socket, roomId, userId }) => {

    socket.join(`room:${roomId}`);

    console.log(
        `[ROOM JOIN] user=${userId} room=${roomId}`
    );

    socket.to(`room:${roomId}`)
        .emit('room:user_joined', {
            userId,
            roomId,
            message: `${userId} joined`
        });
});

eventBus.on('room:leave', ({ socket, roomId, userId }) => {

    socket.leave(`room:${roomId}`);

    console.log(
        `[ROOM LEAVE] user=${userId} room=${roomId}`
    );

    socket.to(`room:${roomId}`)
        .emit('room:user_left', {
            userId,
            roomId,
            message: `${userId} left`
        });
});

eventBus.on('room:message', async ({ socket, roomId, userId, content }) => {

    console.log('=== roomEvent ===');
    console.log({
        roomId,
        userId,
        content
    });


    try {

        const savedMessage = await RoomMessage.create({
            room_id: roomId,
            user_id: userId,
            content
        });

        console.log(`[ROOM DB SAVE SUCCESS] MessageID: ${savedMessage.message_id}`);

        const payload = {
            messageId: savedMessage.message_id,
            roomId,
            userId,
            content,
            createdAt: savedMessage.created_at
        };

        socket.nsp
            .to(`room:${roomId}`)
            .emit('room:message', payload);

    } catch (error) {

        console.error(
            '[ROOM MESSAGE ERROR]',
            error
        );

        socket.emit('room:error', {
            message: '메시지 저장 실패'
        });

    }
});
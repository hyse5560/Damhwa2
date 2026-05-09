const { Server } = require('socket.io');
const chatService = require('../modules/chat/chatService');
const speechService = require('../modules/speech/speechService');
const communityService = require('../modules/community/communityService');

let io;

function init(server) {
    io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Voice session connected:', socket.id);
        
        let recognizeStream = null;
        let fullTranscript = ''; 

        socket.on('speech:chunk', (data) => {
            if (!data || (!data.audioBase64 && !Buffer.isBuffer(data))) return;

            try {
                const buffer = Buffer.isBuffer(data) 
                    ? data 
                    : Buffer.from(data.audioBase64, 'base64');
                
                if (recognizeStream && !recognizeStream.destroyed) {
                    recognizeStream.write(buffer);
                }
            } catch (error) {
                console.error('speech:chunk 처리 에러:', error);
            }
        });

        socket.on('audio-start', async (data) => {
            console.log('Starting STT Stream for user:', data?.userId || 'unknown');
            fullTranscript = ''; 
            
            if (recognizeStream) recognizeStream.end();

            recognizeStream = speechService.createRecognizeStream(
                async (transcript, isFinal) => {
                    send(socket, 'stt-result', { data: transcript, isFinal });

                    if (isFinal) {
                        console.log('Interim Final Transcript:', transcript);
                        fullTranscript += (transcript + ' ');
                    }
                },
                (err) => {
                    console.error('STT Error:', err);
                    send(socket, 'error', { message: 'Voice recognition failed' });
                }
            );
        });

        socket.on('audio-end', async (data) => {
            if (recognizeStream) {
                recognizeStream.end();
                recognizeStream = null;
                console.log('STT Stream ended by client (audio-end)');

                setTimeout(async () => {
                    const finalContent = fullTranscript.trim();

                    if (!finalContent) {
                        console.log('No voice input detected before closing.');
                        await chatService.handleMessage(socket, { 
                            userId: data?.userId || '1', 
                            content: "SYSTEM_EMPTY_INPUT" 
                        });
                    } else {
                        console.log('Final Combined Transcript to GPT:', finalContent);
                        await chatService.handleMessage(socket, { 
                            userId: data?.userId || '1', 
                            content: finalContent 
                        });
                    }
                    fullTranscript = '';
                }, 500);
            }
        });



        socket.on('community:join', async (data = {}) => {
            try {
                const { roomId, userId, nickname } = data;
                if (!roomId || !userId) return;

                await communityService.joinRoom(roomId, userId, nickname);
                socket.join(`community:${roomId}`);

                io.to(`community:${roomId}`).emit('community:user-joined', {
                    roomId,
                    userId,
                    nickname,
                    socketId: socket.id,
                });
            } catch (error) {
                console.error('community:join error:', error);
                send(socket, 'error', { message: '사이버 경로당 입장 실패' });
            }
        });

        socket.on('community:leave', async (data = {}) => {
            try {
                const { roomId, userId } = data;
                if (!roomId || !userId) return;

                await communityService.leaveRoom(roomId, userId);
                socket.leave(`community:${roomId}`);

                io.to(`community:${roomId}`).emit('community:user-left', {
                    roomId,
                    userId,
                });
            } catch (error) {
                console.error('community:leave error:', error);
            }
        });

        socket.on('community:speaking', async (data = {}) => {
            try {
                const { roomId, userId, isSpeaking } = data;
                if (!roomId || !userId) return;

                await communityService.updateSpeaking(roomId, userId, isSpeaking);
                io.to(`community:${roomId}`).emit('community:speaking', {
                    roomId,
                    userId,
                    isSpeaking: Boolean(isSpeaking),
                });
            } catch (error) {
                console.error('community:speaking error:', error);
            }
        });

        socket.on('community:message', async (data = {}) => {
            try {
                const { roomId, userId, content } = data;
                if (!roomId || !userId || !content) return;

                const message = await communityService.saveMessage(roomId, userId, content);
                io.to(`community:${roomId}`).emit('community:message', message);
            } catch (error) {
                console.error('community:message error:', error);
                send(socket, 'error', { message: '메시지 전송 실패' });
            }
        });



        // WebRTC 음성 통화 signaling
        // 실제 음성 데이터는 브라우저/앱 간 P2P로 흐르고, 서버는 offer/answer/ice-candidate 전달만 담당한다.
        socket.on('community:webrtc:offer', (data = {}) => {
            const { roomId, fromUserId, toSocketId, offer } = data;
            if (!roomId || !offer) return;

            const payload = { roomId, fromUserId, fromSocketId: socket.id, offer };
            if (toSocketId) {
                io.to(toSocketId).emit('community:webrtc:offer', payload);
            } else {
                socket.to(`community:${roomId}`).emit('community:webrtc:offer', payload);
            }
        });

        socket.on('community:webrtc:answer', (data = {}) => {
            const { roomId, fromUserId, toSocketId, answer } = data;
            if (!roomId || !answer) return;

            const payload = { roomId, fromUserId, fromSocketId: socket.id, answer };
            if (toSocketId) {
                io.to(toSocketId).emit('community:webrtc:answer', payload);
            } else {
                socket.to(`community:${roomId}`).emit('community:webrtc:answer', payload);
            }
        });

        socket.on('community:webrtc:ice-candidate', (data = {}) => {
            const { roomId, fromUserId, toSocketId, candidate } = data;
            if (!roomId || !candidate) return;

            const payload = { roomId, fromUserId, fromSocketId: socket.id, candidate };
            if (toSocketId) {
                io.to(toSocketId).emit('community:webrtc:ice-candidate', payload);
            } else {
                socket.to(`community:${roomId}`).emit('community:webrtc:ice-candidate', payload);
            }
        });

        socket.on('community:mute', (data = {}) => {
            const { roomId, userId, isMuted } = data;
            if (!roomId || !userId) return;

            socket.to(`community:${roomId}`).emit('community:mute', {
                roomId,
                userId,
                isMuted: Boolean(isMuted),
            });
        });

        socket.on('disconnect', () => {
            if (recognizeStream) recognizeStream.end();
            console.log('Voice session closed:', socket.id);
        });
    });
}

function send(socket, type, data) {
    if (socket && socket.connected) {
        socket.emit(type, data);
    }
}

module.exports = { init, send };
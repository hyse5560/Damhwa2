const { Server } = require('socket.io');
const chatService = require('../modules/chat/chatService');
const speechService = require('../modules/speech/speechService');

let io;

function init(server) {
    io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('✅ Voice session connected:', socket.id);
        
        let recognizeStream = null;

        socket.on('speech:chunk', (data) => {
            const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data.audioBase64, 'base64');
            
            if (recognizeStream && !recognizeStream.destroyed) {
                recognizeStream.write(buffer);
            }
        });

        socket.on('audio-start', async (data) => {
            console.log('🚀 Starting STT Stream for user:', data.userId);
            
            if (recognizeStream) recognizeStream.end();

            recognizeStream = speechService.createRecognizeStream(
                async (transcript, isFinal) => {
                    send(socket, 'stt-result', { data: transcript, isFinal });

                    if (isFinal) {
                        console.log('🎤 Final Transcript:', transcript);
                        await chatService.handleMessage(socket, { 
                            userId: data.userId, 
                            content: transcript 
                        });
                    }
                },
                (err) => {
                    send(socket, 'error', { message: 'Voice recognition failed' });
                }
            );
        });

        socket.on('audio-end', () => {
            if (recognizeStream) {
                recognizeStream.end();
                recognizeStream = null;
                console.log('⏹ STT Stream ended by client');
            }
        });

        socket.on('disconnect', () => {
            if (recognizeStream) recognizeStream.end();
            console.log('❌ Voice session closed:', socket.id);
        });
    });
}

/**
 * Socket.io 전용 전송 함수
 * @param {Object} socket - 전송할 대상 소켓 객체
 * @param {string} type - 이벤트 명
 * @param {Object} data - 보낼 데이터
 */
function send(socket, type, data) {
    if (socket && socket.connected) {
        socket.emit(type, data);
    }
}

module.exports = { init, send };
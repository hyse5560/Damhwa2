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
const WebSocket = require('ws');
const chatService = require('../modules/chat/chatService');
const speechService = require('../modules/speech/speechService');

let wss;

function init(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Voice session connected');
        
        // 유저별 STT 스트림 관리
        let recognizeStream = null;

        ws.on('message', async (message) => {
            if (Buffer.isBuffer(message)) {
                if (recognizeStream && !recognizeStream.destroyed) {
                    recognizeStream.write(message);
                }
                return;
            }

            // 2. 제어 명령 처리 (JSON)
            try {
                const data = JSON.parse(message);

                switch (data.type) {
                    case 'audio-start': // 유저가 말을 시작함 (녹음 시작 버튼 등)
                        console.log('Starting STT Stream for user:', data.userId);
                        
                        // 기존 스트림이 있다면 정리
                        if (recognizeStream) recognizeStream.end();

                        recognizeStream = speechService.createRecognizeStream(
                            async (transcript, isFinal) => {
                                // 실시간 인식 자막 전송 (화면 표시용)
                                send(ws, { type: 'stt-result', data: transcript, isFinal });

                                // 말 끝남이 감지되면 자동으로 대화 로직 실행
                                if (isFinal) {
                                    console.log('Final Transcript:', transcript);
                                    await chatService.handleMessage(ws, { 
                                        userId: data.userId, 
                                        content: transcript 
                                    });
                                }
                            },
                            (err) => {
                                send(ws, { type: 'error', message: 'Voice recognition failed' });
                            }
                        );
                        break;

                    case 'audio-end': // 유저가 수동으로 녹음을 멈춤
                        if (recognizeStream) {
                            recognizeStream.end();
                            recognizeStream = null;
                            console.log('STT Stream ended by client');
                        }
                        break;
                }
            } catch (err) {
                console.error('Socket message error:', err);
            }
        });

        ws.on('close', () => {
            if (recognizeStream) recognizeStream.end();
            console.log('Voice session closed');
        });
    });
}

function send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

module.exports = { init, send };
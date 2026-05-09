function getFallbackHtml() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>Damhwa2 사이버 경로당 API</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 960px; margin: 40px auto; line-height: 1.6; }
    h1 { color: #1f3d2b; }
    h2 { margin-top: 32px; color: #2f5d40; }
    code, pre { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    .endpoint { border: 1px solid #ddd; border-radius: 10px; padding: 14px; margin: 12px 0; }
    .method { font-weight: bold; color: #0b6b36; }
  </style>
</head>
<body>
  <h1>Damhwa2 사이버 경로당 API 문서</h1>
  <p>swagger-ui-express가 설치되어 있으면 Swagger UI로 표시되고, 설치 전에는 이 기본 문서가 표시됩니다.</p>

  <h2>Community</h2>
  <div class="endpoint"><span class="method">GET</span> <code>/community/rooms</code><br/>사이버 경로당 방 목록 조회</div>
  <div class="endpoint"><span class="method">POST</span> <code>/community/rooms</code><br/>방 생성</div>
  <div class="endpoint"><span class="method">GET</span> <code>/community/rooms/:roomId</code><br/>방 상세 및 참여자 조회</div>
  <div class="endpoint"><span class="method">POST</span> <code>/community/rooms/:roomId/join</code><br/>로그인 사용자 방 참여. Header: Authorization Bearer token</div>
  <div class="endpoint"><span class="method">POST</span> <code>/community/rooms/:roomId/leave</code><br/>로그인 사용자 방 나가기</div>
  <div class="endpoint"><span class="method">GET</span> <code>/community/rooms/:roomId/messages</code><br/>방 메시지 조회</div>
  <div class="endpoint"><span class="method">POST</span> <code>/community/rooms/:roomId/messages</code><br/>방 메시지 저장</div>
  <div class="endpoint"><span class="method">POST</span> <code>/community/rooms/:roomId/reports</code><br/>신고 접수</div>
  <div class="endpoint"><span class="method">POST</span> <code>/community/blocks</code><br/>사용자 차단</div>
  <div class="endpoint"><span class="method">DELETE</span> <code>/community/blocks/:blockedUserId</code><br/>차단 해제</div>

  <h2>Speech</h2>
  <div class="endpoint"><span class="method">POST</span> <code>/speech/tts</code><br/>텍스트를 MP3 base64 음성으로 변환</div>

  <h2>Admin</h2>
  <p>관리자 API는 Header <code>x-admin-key</code>가 필요합니다.</p>
  <div class="endpoint"><span class="method">GET</span> <code>/admin/dashboard</code><br/>운영 현황 조회</div>
  <div class="endpoint"><span class="method">GET</span> <code>/admin/community/reports</code><br/>신고 목록 조회</div>
  <div class="endpoint"><span class="method">PATCH</span> <code>/admin/community/reports/:reportId</code><br/>신고 상태 변경</div>
  <div class="endpoint"><span class="method">PATCH</span> <code>/admin/community/rooms/:roomId</code><br/>방 정보 수정</div>
  <div class="endpoint"><span class="method">DELETE</span> <code>/admin/community/rooms/:roomId</code><br/>방 비활성화</div>
  <div class="endpoint"><span class="method">POST</span> <code>/admin/community/rooms/:roomId/kick/:userId</code><br/>참여자 강퇴</div>

  <h2>WebSocket 이벤트</h2>
  <pre>
community:join
community:leave
community:speaking
community:message
community:webrtc:offer
community:webrtc:answer
community:webrtc:ice-candidate
community:mute
  </pre>
</body>
</html>`;
}

function setupSwagger(app) {
  try {
    const swaggerJsdoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');
    const specs = swaggerJsdoc({
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Damhwa2 사이버 경로당 API',
          version: '1.0.0',
          description: '사이버 경로당 방, 참여자, 메시지, 신고/차단, 관리자, 음성 signaling API 문서',
        },
        servers: [{ url: 'http://localhost:3000', description: 'local server' }],
      },
      apis: ['./src/routes/*.js'],
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.get('/docs.json', (req, res) => res.json(specs));
  } catch (error) {
    console.log('Swagger 패키지 미설치 → 기본 /docs HTML 문서로 대체:', error.message);
    app.get('/docs', (req, res) => res.type('html').send(getFallbackHtml()));
  }
}

module.exports = setupSwagger;

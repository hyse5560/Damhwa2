# 사이버 경로당 운영 확장 백엔드 구현 보고서

## 1. 구현 범위
이번 ZIP에는 기존 사이버 경로당 MVP 구조에 더해 실제 운영에 가까워지기 위한 기본 기능을 추가했습니다.

포함된 항목은 다음과 같습니다.

- WebRTC 음성 통화 signaling 이벤트
- STT/TTS 연동용 TTS API
- 로그인 토큰 기반 권한 처리
- 관리자 API
- 신고 기능
- 차단 기능
- Swagger 문서 `/docs`
- FCM 설정값이 없어도 서버가 죽지 않도록 방어 코드 수정
- `.env.example` 정리

단, 실제 운영 배포를 위해서는 실제 DB 계정, Google Cloud 키, FCM 키, 배포 서버 주소, HTTPS 설정, TURN 서버 설정이 추가로 필요합니다.

---

## 2. 음성 통화 포함 여부
음성 통화는 사이버 경로당 기능에 포함되는 것이 맞습니다.
사이버 경로당은 사용자가 온라인 방에 들어가 서로 대화하는 구조이기 때문에, 실제 통화는 WebRTC로 처리하고 백엔드는 WebSocket signaling 서버 역할을 담당하도록 구성했습니다.

추가된 signaling 이벤트는 다음과 같습니다.

- `community:webrtc:offer`
- `community:webrtc:answer`
- `community:webrtc:ice-candidate`
- `community:mute`

파일 위치:

```txt
backend/src/sockets/websocket.js
```

서버는 음성 데이터를 직접 저장하거나 전송하지 않고, 사용자 간 연결을 위한 offer, answer, ice candidate만 전달합니다.
실제 마이크 음성은 프론트 앱의 WebRTC 연결을 통해 사용자 간 P2P로 전달됩니다.

---

## 3. 로그인 권한 처리
기존에는 `user_id`를 body로 직접 넘기는 구조였지만, 운영 구조에서는 로그인한 사용자만 방 참여, 메시지 작성, 신고, 차단을 할 수 있어야 합니다.

추가 파일:

```txt
backend/src/middlewares/authMiddleware.js
```

주요 기능:

- 로그인 토큰 생성
- 토큰 검증
- 로그인 필수 API 보호
- 관리자 API 보호

로그인/회원가입 성공 시 `access_token`을 반환하도록 수정했습니다.

수정 파일:

```txt
backend/src/modules/auth/authController.js
```

프론트에서는 로그인 후 받은 토큰을 API 요청 헤더에 넣어야 합니다.

```txt
Authorization: Bearer access_token값
```

---

## 4. 신고 기능
사이버 경로당 방 안에서 부적절한 사용자나 상황을 신고할 수 있도록 신고 모델과 API를 추가했습니다.

추가 모델:

```txt
backend/src/models/communityReport.js
```

주요 컬럼:

- `room_id`
- `reporter_user_id`
- `target_user_id`
- `reason`
- `detail`
- `status`

추가 API:

```txt
POST /community/rooms/:roomId/reports
```

---

## 5. 차단 기능
사용자가 특정 사용자를 차단할 수 있도록 차단 모델과 API를 추가했습니다.

추가 모델:

```txt
backend/src/models/communityBlock.js
```

주요 컬럼:

- `blocker_user_id`
- `blocked_user_id`
- `reason`

추가 API:

```txt
POST /community/blocks
DELETE /community/blocks/:blockedUserId
```

---

## 6. 관리자 기능
관리자가 사이버 경로당 운영 상태를 확인하고 신고/방/참여자를 관리할 수 있도록 관리자 API를 추가했습니다.

추가 파일:

```txt
backend/src/modules/admin/adminController.js
backend/src/routes/adminRoutes.js
```

추가 API:

```txt
GET /admin/dashboard
GET /admin/community/reports
PATCH /admin/community/reports/:reportId
PATCH /admin/community/rooms/:roomId
DELETE /admin/community/rooms/:roomId
POST /admin/community/rooms/:roomId/kick/:userId
GET /admin/community/blocks
```

관리자 API는 `.env`의 `ADMIN_KEY`와 요청 헤더의 `x-admin-key` 값이 일치해야 접근 가능합니다.

---

## 7. STT/TTS 구성
기존 speechService를 활용해 TTS API를 추가했습니다.

추가 파일:

```txt
backend/src/modules/speech/speechController.js
backend/src/routes/speechRoutes.js
```

추가 API:

```txt
POST /speech/tts
```

요청 예시:

```json
{
  "text": "안녕하세요. 사이버 경로당에 오신 것을 환영합니다."
}
```

응답은 MP3 base64 형태입니다.

STT는 기존 WebSocket 이벤트 `audio-start`, `speech:chunk`, `audio-end` 구조를 유지했습니다.

---

## 8. Swagger 문서
브라우저에서 API를 확인할 수 있도록 Swagger를 추가했습니다.

추가 파일:

```txt
backend/src/config/swagger.js
```

수정 파일:

```txt
backend/src/app.js
backend/package.json
```

확인 주소:

```txt
http://localhost:3000/docs
```

---

## 9. 실행 전 확인사항
백엔드 실행 전 `.env` 값을 실제 환경에 맞게 수정해야 합니다.

필수:

```txt
DB_NAME=damhwa
DB_USER=root
DB_PASSWORD=본인 MySQL 비밀번호
DB_HOST=localhost
PORT=3000
AUTH_TOKEN_SECRET=아무 긴 문자열
ADMIN_KEY=관리자용 키
```

실제 TTS/STT/FCM까지 쓰려면 추가로 필요합니다.

```txt
GOOGLE_APPLICATION_CREDENTIALS=구글키파일경로
FCM_SERVICE_ACCOUNT_PATH=파이어베이스키파일경로
```

---

## 10. 현재 수준
이번 ZIP은 “실제 운영을 위한 기능 구조를 추가한 개발 버전”입니다.
방 운영, 참여, 메시지, 신고, 차단, 관리자 API, WebRTC signaling 구조는 포함되어 있습니다.

다만 진짜 배포 운영을 위해서는 다음 검증이 추가로 필요합니다.

- MySQL 실제 연결 테스트
- 프론트에서 WebRTC 마이크 연결 구현 및 테스트
- HTTPS 배포
- TURN 서버 설정
- Google Cloud STT/TTS 키 검증
- 관리자 화면 연결

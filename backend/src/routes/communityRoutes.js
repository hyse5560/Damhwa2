const express = require('express');
const communityController = require('../modules/community/communityController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Community
 *   description: 사이버 경로당 API
 */

/**
 * @swagger
 * /community/rooms:
 *   get:
 *     summary: 사이버 경로당 방 목록 조회
 *     tags: [Community]
 *     responses:
 *       200:
 *         description: 방 목록 조회 성공
 */
router.get('/rooms', communityController.getRooms);

/**
 * @swagger
 * /community/rooms:
 *   post:
 *     summary: 사이버 경로당 방 생성
 *     tags: [Community]
 *     responses:
 *       201:
 *         description: 방 생성 성공
 */
router.post('/rooms', communityController.createRoom);

/**
 * @swagger
 * /community/rooms/{roomId}:
 *   get:
 *     summary: 방 상세 및 현재 참여자 조회
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 방 상세 조회 성공
 */
router.get('/rooms/:roomId', communityController.getRoomDetail);

/**
 * @swagger
 * /community/rooms/{roomId}/join:
 *   post:
 *     summary: 방 참여
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 참여 성공
 */
router.post('/rooms/:roomId/join', requireAuth, communityController.joinRoom);

/**
 * @swagger
 * /community/rooms/{roomId}/leave:
 *   post:
 *     summary: 방 나가기
 *     tags: [Community]
 *     responses:
 *       200:
 *         description: 나가기 성공
 */
router.post('/rooms/:roomId/leave', requireAuth, communityController.leaveRoom);

router.get('/rooms/:roomId/messages', communityController.getMessages);
router.post('/rooms/:roomId/messages', requireAuth, communityController.sendMessage);
router.post('/rooms/:roomId/reports', requireAuth, communityController.reportUser);
router.post('/blocks', requireAuth, communityController.blockUser);
router.delete('/blocks/:blockedUserId', requireAuth, communityController.unblockUser);

module.exports = router;

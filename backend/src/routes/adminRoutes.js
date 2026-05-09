const express = require('express');
const adminController = require('../modules/admin/adminController');
const { requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 사이버 경로당 관리자 API
 */
router.use(requireAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/community/reports', adminController.getReports);
router.patch('/community/reports/:reportId', adminController.updateReportStatus);
router.patch('/community/rooms/:roomId', adminController.updateRoom);
router.delete('/community/rooms/:roomId', adminController.closeRoom);
router.post('/community/rooms/:roomId/kick/:userId', adminController.kickMember);
router.get('/community/blocks', adminController.getBlocks);

module.exports = router;

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const {
  saveFcmToken,
  deleteFcmToken,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require('../controllers/notification.controller');

router.use(verifyToken);

// FCM Token
router.post('/fcm-token', saveFcmToken);
router.delete('/fcm-token', deleteFcmToken);

// الإشعارات
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllNotificationsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
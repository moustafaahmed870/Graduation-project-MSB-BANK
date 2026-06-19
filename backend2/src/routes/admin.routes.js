// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');
const adminController = require('../controllers/admin.controller');

// ✅ كل المسارات محمية بـ verifyToken و isAdmin
router.use(verifyToken);
router.use(isAdmin);

// المستخدمين
router.get('/users', adminController.getAllUsers);
router.get('/users/pending', adminController.getPendingUsers);
router.put('/users/:userId/approve', adminController.approveUser);
router.put('/users/:userId/reject', adminController.rejectUser);
router.put('/users/:userId/suspend', adminController.suspendUser);
router.put('/users/:userId/unsuspend', adminController.unsuspendUser);
router.delete('/users/:userId', adminController.deleteUser);

// ✅ أضف هذا المسار هنا (لحذف المستخدم نهائياً)
router.delete('/users/:userId/permanent', adminController.permanentlyDeleteUser);

// الإحصائيات
router.get('/stats', adminController.getSystemStats);
router.get('/activities', adminController.getRecentActivities);

// الإعدادات
router.get('/settings', adminController.getSystemSettings);
router.put('/settings', adminController.updateSystemSettings);

module.exports = router;
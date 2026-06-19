const express = require('express');
const router = express.Router();
const { register, login, changePassword, forgotPassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// ✅ مش محتاج token
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// ✅ محتاج token
router.post('/change-password', verifyToken, changePassword);

module.exports = router;
const express = require('express');
const router = express.Router();
const { register, login, sendLoginOTP, verifyLoginOTP, enable2FA, disable2FA, get2FAStatus, registerWebAuthn, verifyBiometricLogin } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);

// 2FA OTP endpoints (no auth needed - used during login flow)
router.post('/send-login-otp', sendLoginOTP);
router.post('/verify-login-otp', verifyLoginOTP);

// Biometric login endpoint
router.post('/biometric-login', verifyBiometricLogin);

// 2FA management endpoints (require auth)
router.post('/enable-2fa', authMiddleware, enable2FA);
router.post('/disable-2fa', authMiddleware, disable2FA);
router.get('/2fa-status', authMiddleware, get2FAStatus);
router.post('/webauthn-register', authMiddleware, registerWebAuthn);

module.exports = router;
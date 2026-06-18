const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTPCode, resetPassword, debugOTP } = require('../controllers/forgot.controller');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPCode);
router.post('/reset-password', resetPassword);
router.get('/debug-otp', debugOTP);  // <- للتسعير فقط

module.exports = router;
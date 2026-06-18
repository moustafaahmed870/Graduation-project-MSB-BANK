const { admin, db } = require('../config/firebase');
const { sendPasswordResetEmail, verifyOTP, updatePassword, debugOTPStore } = require('../services/email.service');
const bcrypt = require('bcryptjs');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (req, res) => {
    console.log('📧 Sending OTP to:', req.body.email);
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const snapshot = await db
            .collection('MyUser')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        const otpCode = generateOTP();
        const emailSent = await sendPasswordResetEmail(email, otpCode);

        if (emailSent) {
            debugOTPStore();
            
            res.status(200).json({ 
                message: 'Verification code sent to your email',
                email: email 
            });
        } else {
            res.status(500).json({ message: 'Failed to send email' });
        }
    } catch (error) {
        console.error('❌ Send OTP error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyOTPCode = async (req, res) => {
    console.log('🔐 Verifying OTP for:', req.body.email);
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    console.log(`📥 Received verification request: email=${email}, otp=${otp}`);
    
    debugOTPStore();
    
    const isValid = verifyOTP(email, otp);

    if (isValid) {
        console.log(`✅ OTP verified successfully for ${email}`);
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        console.log(`❌ Invalid OTP for ${email}`);
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};

// ✅ دالة resetPassword - أضفها كاملة
const resetPassword = async (req, res) => {
    console.log('🔄 Resetting password for:', req.body.email);
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    try {
        // 1. البحث عن المستخدم في Firestore
        const snapshot = await db
            .collection('MyUser')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // 2. تحديث الباسوورد في Firebase Authentication
        try {
            await admin.auth().updateUser(userData.uid, {
                password: newPassword
            });
            console.log('✅ Firebase Auth password updated for:', userData.uid);
        } catch (authError) {
            console.error('❌ Failed to update Firebase Auth:', authError);
            // نستمر لتحديث Firestore على الأقل
        }

        // 3. تحديث الباسوورد في Firestore (مشفر)
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userDoc.ref.update({
            password: hashedPassword,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log('✅ Password updated successfully for:', email);
        res.status(200).json({ message: 'Password updated successfully' });
        
    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ message: 'Failed to update password' });
    }
};

// ✅ دالة debug للتطوير فقط
const debugOTP = async (req, res) => {
    const { email } = req.query;
    // دي للاختبار فقط - هتجبلك الـ OTP من الذاكرة
    try {
        const { otpStore } = require('../services/email.service');
        if (email && otpStore) {
            const record = otpStore.get(email);
            if (record) {
                return res.json({ 
                    email, 
                    otp: record.code, 
                    expiresAt: record.expiresAt,
                    remainingSeconds: Math.max(0, Math.floor((record.expiresAt - Date.now()) / 1000))
                });
            }
            return res.json({ email, found: false });
        }
        res.json({ message: 'Use ?email=xxx to check specific email' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { sendOTP, verifyOTPCode, resetPassword, debugOTP };
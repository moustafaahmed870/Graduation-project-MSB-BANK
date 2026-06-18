const { admin, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// تخزين مؤقت لأكواد OTP Login (بعيد عن ملف email.service.js عشان منفصلين)
const loginOTPStore = new Map();

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send Login OTP
const sendLoginOTP = async (req, res) => {
    const { email } = req.body;
    
    try {
        const snapshot = await db.collection('MyUser').where('email', '==', email).limit(1).get();
        if (snapshot.empty) return res.status(404).json({ message: 'User not found' });
        
        const userDoc = snapshot.docs[0];
        let userData = userDoc.data();
        
        // Auto-enable 2FA if not enabled yet (first time login with 2FA)
        if (!userData.twoFactorEnabled) {
            await userDoc.ref.update({
                twoFactorEnabled: true,
                twoFactorMethod: 'email',
                twoFactorEnabledAt: new Date().toISOString()
            });
            console.log('✅ 2FA auto-enabled for user:', email);
            userData.twoFactorEnabled = true;
        }
        
        // Generate OTP
        const otpCode = generateOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
        
        // Store OTP
        loginOTPStore.set(email, { code: otpCode, expiresAt });
        
        // Send email
        const { sendPasswordResetEmail } = require('../services/email.service');
        await sendPasswordResetEmail(email, otpCode);
        
        res.status(200).json({ 
            message: 'OTP sent to your email',
            email: email,
            expiresIn: 300
        });
        
    } catch (error) {
        console.error('❌ Send Login OTP error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Verify Login OTP
const verifyLoginOTP = async (req, res) => {
    const { email, otp } = req.body;
    
    try {
        const record = loginOTPStore.get(email);
        
        if (!record) {
            return res.status(400).json({ message: 'No OTP request found. Please request a new OTP.' });
        }
        
        if (Date.now() > record.expiresAt) {
            loginOTPStore.delete(email);
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }
        
        if (record.code !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        
        // OTP verified - get user and create token
        const snapshot = await db.collection('MyUser').where('email', '==', email).limit(1).get();
        if (snapshot.empty) return res.status(404).json({ message: 'User not found' });
        
        const userData = snapshot.docs[0].data();
        
        // Delete OTP after successful verification
        loginOTPStore.delete(email);
        
        // Create token
        const token = jwt.sign(
            { uid: userData.uid, email: userData.email, fullName: userData.fullName, role: userData.role || 'user' }, 
            process.env.JWT_SECRET || 'msb_bank_secret_key_2024', 
            { expiresIn: '7d' }
        );
        
        res.status(200).json({ 
            message: 'Login successful',
            token,
            user: { 
                uid: userData.uid, 
                fullName: userData.fullName, 
                email: userData.email, 
                accountType: userData.accountType,
                status: userData.status,
                role: userData.role || 'user'
            }
        });
        
    } catch (error) {
        console.error('❌ Verify Login OTP error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Enable 2FA
const enable2FA = async (req, res) => {
    const { uid } = req.user;
    const { method } = req.body; // 'email' or 'biometric'
    
    try {
        const userRef = db.collection('MyUser').doc(uid);
        const doc = await userRef.get();
        
        if (!doc.exists) return res.status(404).json({ message: 'User not found' });
        
        const updateData = {
            twoFactorEnabled: true,
            twoFactorMethod: method || 'email',
            twoFactorEnabledAt: new Date().toISOString()
        };
        
        await userRef.update(updateData);
        
        res.status(200).json({ 
            message: '2FA enabled successfully',
            method: method || 'email'
        });
        
    } catch (error) {
        console.error('❌ Enable 2FA error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Disable 2FA
const disable2FA = async (req, res) => {
    const { uid } = req.user;
    
    try {
        const userRef = db.collection('MyUser').doc(uid);
        
        await userRef.update({
            twoFactorEnabled: false,
            twoFactorMethod: null,
            twoFactorEnabledAt: null,
            biometricData: null
        });
        
        res.status(200).json({ message: '2FA disabled successfully' });
        
    } catch (error) {
        console.error('❌ Disable 2FA error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get 2FA Status
const get2FAStatus = async (req, res) => {
    const { uid } = req.user;
    
    try {
        const doc = await db.collection('MyUser').doc(uid).get();
        
        if (!doc.exists) return res.status(404).json({ message: 'User not found' });
        
        const userData = doc.data();
        
        res.status(200).json({
            twoFactorEnabled: userData.twoFactorEnabled || false,
            twoFactorMethod: userData.twoFactorMethod || null,
            biometricEnabled: userData.biometricData ? true : false
        });
        
    } catch (error) {
        console.error('❌ Get 2FA Status error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Register WebAuthn (Biometric)
const registerWebAuthn = async (req, res) => {
    const { uid } = req.user;
    const { credential } = req.body;
    
    try {
        // In production, you would verify the credential with your WebAuthn server
        // For now, we'll store the credential ID as a placeholder
        const userRef = db.collection('MyUser').doc(uid);
        
        await userRef.update({
            biometricData: {
                credentialId: credential.id,
                registeredAt: new Date().toISOString()
            },
            twoFactorEnabled: true,
            twoFactorMethod: 'biometric'
        });
        
        res.status(200).json({ message: 'Biometric registered successfully' });
        
    } catch (error) {
        console.error('❌ Register WebAuthn error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Verify Biometric Login
const verifyBiometricLogin = async (req, res) => {
    const { email, credentialId } = req.body;
    
    try {
        const snapshot = await db.collection('MyUser').where('email', '==', email).limit(1).get();
        if (snapshot.empty) return res.status(404).json({ message: 'User not found' });
        
        const userData = snapshot.docs[0].data();
        
        if (!userData.biometricData || userData.biometricData.credentialId !== credentialId) {
            return res.status(401).json({ message: 'Biometric not registered or invalid' });
        }
        
        // Create token
        const token = jwt.sign(
            { uid: userData.uid, email: userData.email, fullName: userData.fullName, role: userData.role || 'user' }, 
            process.env.JWT_SECRET || 'msb_bank_secret_key_2024', 
            { expiresIn: '7d' }
        );
        
        res.status(200).json({ 
            message: 'Biometric login successful',
            token,
            user: { 
                uid: userData.uid, 
                fullName: userData.fullName, 
                email: userData.email, 
                accountType: userData.accountType,
                role: userData.role || 'user'
            }
        });
        
    } catch (error) {
        console.error('❌ Verify Biometric error:', error);
        res.status(500).json({ message: error.message });
    }
};

const register = async (req, res) => {
    console.log('📝 [REGISTER] Request received');
    console.log('📝 Body keys:', Object.keys(req.body));
    
    const { 
        fullName, nationalId, dateOfBirth, gender, phone, email, password, 
        address, city, postalCode, accountType, initialDeposit,
        frontImage, backImage  // ✅ إضافة الصور
    } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // إنشاء المستخدم في Firebase Auth
        const userRecord = await admin.auth().createUser({ 
            email, 
            password, 
            displayName: fullName 
        });
        const uid = userRecord.uid;
        
        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // إنشاء رقم حساب فريد
        const accountNumber = '10' + Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0');
        
        // ✅ حفظ الصور في Firestore (إذا كانت موجودة)
        const userData = {
            uid,
            fullName,
            nationalId,
            dateOfBirth,
            gender,
            phone,
            email,
            password: hashedPassword,
            address: address || '',
            city: city || '',
            postalCode: postalCode || '',
            accountType,
            initialDeposit: parseFloat(initialDeposit) || 0,
            status: 'pending',
            role: 'user',
            accounts: [{
                id: `acc_${Date.now()}`,
                name: accountType === 'savings' ? 'حساب التوفير' : 'الحساب الجاري',
                number: accountNumber,
                balance: parseFloat(initialDeposit) || 0,
                type: accountType || 'current',
                currency: 'EGP',
                icon: accountType === 'savings' ? 'piggy-bank' : 'credit-card',
                status: 'active',
                createdAt: new Date().toISOString()
            }],
            transactions: [],
            notifications: [{
                id: `notif_${Date.now()}`,
                title: 'مرحباً بك في MSB BANK',
                message: `شكراً لتسجيلك ${fullName}، سيتم مراجعة طلبك من قبل الإدارة قريباً.`,
                type: 'info',
                read: false,
                time: new Date().toISOString()
            }],
            walletBalance: 0,
            createdAt: new Date().toISOString()
        };
        
        // ✅ إضافة الصور إذا كانت موجودة
        if (frontImage && frontImage.startsWith('data:image')) {
            userData.frontImage = frontImage;
            console.log('✅ Front image saved');
        } else {
            console.log('⚠️ No front image provided');
        }
        
        if (backImage && backImage.startsWith('data:image')) {
            userData.backImage = backImage;
            console.log('✅ Back image saved');
        } else {
            console.log('⚠️ No back image provided');
        }
        
        // حفظ في Firestore
        await db.collection('MyUser').doc(uid).set(userData);
        
        console.log(`✅ User created successfully with ID: ${uid}`);
        console.log(`📸 Front image: ${frontImage ? 'Yes' : 'No'}`);
        console.log(`📸 Back image: ${backImage ? 'Yes' : 'No'}`);
        
        // إنشاء Token
        const token = jwt.sign(
            { uid, email, fullName, role: 'user' }, 
            process.env.JWT_SECRET || 'msb_bank_secret_key_2024', 
            { expiresIn: '7d' }
        );
        
        res.status(201).json({ 
            message: 'Account created successfully', 
            token, 
            user: { 
                uid, 
                fullName, 
                email, 
                accountType, 
                accountNumber, 
                status: 'pending', 
                role: 'user' 
            } 
        });
        
    } catch (error) {
        console.error('❌ Register error:', error);
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const snapshot = await db.collection('MyUser').where('email', '==', email).limit(1).get();
        if (snapshot.empty) return res.status(404).json({ message: 'User not found' });
        
        const userData = snapshot.docs[0].data();
        
        // ✅ التحقق من حالة المستخدم
        if (userData.status !== 'active') {
            return res.status(403).json({ 
                message: userData.status === 'pending' 
                    ? '⚠️ Account pending admin approval. You will receive an email once approved.' 
                    : '❌ Your account has been suspended. Please contact support.' 
            });
        }
        
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
        
        // 2FA is mandatory for all regular users (not admin)
        if (userData.role !== 'admin') {
            return res.status(200).json({ 
                requiresTwoFactor: true,
                message: '2FA verification required',
                user: {
                    uid: userData.uid,
                    fullName: userData.fullName,
                    email: userData.email,
                    twoFactorMethod: userData.twoFactorMethod || 'email'
                }
            });
        }
        
        // Admin login - no 2FA required
        const token = jwt.sign(
            { uid: userData.uid, email: userData.email, fullName: userData.fullName, role: userData.role || 'user' }, 
            process.env.JWT_SECRET || 'msb_bank_secret_key_2024', 
            { expiresIn: '7d' }
        );
        
        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: { 
                uid: userData.uid, 
                fullName: userData.fullName, 
                email: userData.email, 
                accountType: userData.accountType,
                status: userData.status,
                role: userData.role || 'user'
            } 
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    register, 
    login,
    sendLoginOTP,
    verifyLoginOTP,
    enable2FA,
    disable2FA,
    get2FAStatus,
    registerWebAuthn,
    verifyBiometricLogin
};
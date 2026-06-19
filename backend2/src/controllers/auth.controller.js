const { admin, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    console.log('📝 [REGISTER] Request received');
    console.log('📝 Body keys:', Object.keys(req.body));
    
    const { 
        fullName, nationalId, dateOfBirth, gender, phone, email, password, 
        address, city, postalCode, accountType, initialDeposit,
        frontImage, backImage  // ✅ إضافة الصور
    } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
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

        // ===================================================
        // ✅ مهم: لا يتم إنشاء أو إرجاع أي token هنا.
        // الحساب status = 'pending' ولازم ميقدرش يدخل التطبيق
        // إلا بعد ما الأدمن يوافق عليه (status يبقى 'active').
        // ===================================================

        res.status(201).json({
            success: true,
            message: 'تم إنشاء طلبك بنجاح، سيتم مراجعته من قبل الإدارة وسيتم إشعارك بالنتيجة',
            status: 'pending',
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
            return res.status(400).json({ success: false, message: 'البريد الإلكتروني مستخدم من قبل' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    try {
        const snapshot = await db.collection('MyUser').where('email', '==', email).limit(1).get();
        if (snapshot.empty) {
            return res.status(404).json({ success: false, message: 'البريد الإلكتروني غير مسجل' });
        }

        const userData = snapshot.docs[0].data();

        // ✅ التحقق من كلمة المرور أولاً (أكثر أماناً - قبل الكشف عن حالة الحساب)
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'كلمة المرور غير صحيحة' });
        }

        // ===================================================
        // ✅ التحقق من حالة الحساب - المستخدم ميقدرش يدخل
        // إلا لو status === 'active'
        // ===================================================
        if (userData.status === 'pending') {
            return res.status(403).json({
                success: false,
                code: 'PENDING_APPROVAL',
                message: 'حسابك قيد المراجعة من الإدارة، سيتم إشعارك فور الموافقة'
            });
        }

        if (userData.status === 'rejected') {
            return res.status(403).json({
                success: false,
                code: 'REJECTED',
                message: userData.rejectionReason
                    ? `تم رفض طلب فتح حسابك. السبب: ${userData.rejectionReason}`
                    : 'تم رفض طلب فتح حسابك. يرجى التواصل مع الدعم'
            });
        }

        if (userData.status === 'suspended') {
            return res.status(403).json({
                success: false,
                code: 'SUSPENDED',
                message: 'تم تعليق حسابك. يرجى التواصل مع الدعم'
            });
        }

        if (userData.status !== 'active') {
            return res.status(403).json({
                success: false,
                code: 'INACTIVE',
                message: 'حسابك غير مفعّل حالياً، يرجى التواصل مع الدعم'
            });
        }

        const token = jwt.sign(
            { uid: userData.uid, email: userData.email, fullName: userData.fullName, role: userData.role || 'user' },
            process.env.JWT_SECRET || 'msb_bank_secret_key_2024',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
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
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { register, login };
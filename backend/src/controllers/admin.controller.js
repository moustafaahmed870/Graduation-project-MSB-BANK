// backend/src/controllers/admin.controller.js
const { admin, db } = require('../config/firebase');
const bcrypt = require('bcryptjs');

// ============= دوال مساعدة =============
const getUserData = async (uid) => {
    const userDoc = await db.collection('MyUser').doc(uid).get();
    if (!userDoc.exists) throw new Error('User not found');
    return { uid, ...userDoc.data() };
};

const updateUserData = async (uid, data) => {
    await db.collection('MyUser').doc(uid).update({ ...data, updatedAt: new Date().toISOString() });
};

// ============= 1. جلب جميع المستخدمين =============
const getAllUsers = async (req, res) => {
    try {
        console.log('🔍 [ADMIN] Fetching all users from Firestore...');
        
        const usersRef = db.collection('MyUser');
        const snapshot = await usersRef.get();
        
        console.log(`📊 Found ${snapshot.size} users in Firestore`);
        
        const users = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`📄 User: ${doc.id} - ${data.email} - Status: ${data.status}`);
            delete data.password;
            users.push({ id: doc.id, ...data });
        });
        
        res.json({ success: true, users });
    } catch (error) {
        console.error('❌ Get all users error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= 2. جلب طلبات التسجيل المعلقة =============
const getPendingUsers = async (req, res) => {
    try {
        const usersRef = db.collection('MyUser');
        const snapshot = await usersRef.where('status', '==', 'pending').get();
        
        const users = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            delete data.password;
            
            // ✅ إضافة الصور إذا كانت موجودة
            const userData = { id: doc.id, ...data };
            
            // نحتفظ بالصور في البيانات
            if (data.frontImage) userData.frontImage = data.frontImage;
            if (data.backImage) userData.backImage = data.backImage;
            
            users.push(userData);
        });
        
        users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get pending users error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// ============= 3. الموافقة على مستخدم =============
const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userRef = db.collection('MyUser').doc(userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const userData = userDoc.data();
        
        await userRef.update({ 
            status: 'active',
            approvedAt: new Date().toISOString(),
            approvedBy: req.user.uid
        });
        
        try {
            await admin.auth().updateUser(userId, { disabled: false });
        } catch (authError) {
            console.error('Failed to update auth user:', authError);
        }
        
        await db.collection('MyUser').doc(userId).update({
            notifications: admin.firestore.FieldValue.arrayUnion({
                id: `notif_${Date.now()}`,
                title: '✅ تم تفعيل حسابك',
                message: `مرحباً ${userData.fullName}، تم تفعيل حسابك بنجاح.`,
                type: 'success',
                read: false,
                time: new Date().toISOString()
            })
        });
        
        res.json({ success: true, message: 'User approved successfully' });
    } catch (error) {
        console.error('Approve user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= 4. رفض مستخدم (مع الحذف من Firebase Auth و Firestore) =============
const rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`🗑️ Rejecting and deleting user: ${userId}`);
        
        // 1. جلب بيانات المستخدم قبل الحذف (لإرسال إيميل)
        const userDoc = await db.collection('MyUser').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const userData = userDoc.data();
        
        // 2. حذف المستخدم من Firestore
        await db.collection('MyUser').doc(userId).delete();
        console.log('✅ User deleted from Firestore');
        
        // 3. حذف المستخدم من Firebase Authentication
        try {
            await admin.auth().deleteUser(userId);
            console.log('✅ User deleted from Firebase Auth');
        } catch (authError) {
            console.error('Failed to delete from Firebase Auth:', authError);
            // نستمر حتى لو فشل حذف الـ Auth
        }
        
        // 4. إرسال إيميل الرفض (اختياري)
        // لو عايز تبعت إيميل، استخدم الدالة اللي عملناها قبل كده
        
        res.json({ 
            success: true, 
            message: 'User rejected and deleted successfully',
            deletedUser: {
                fullName: userData.fullName,
                email: userData.email
            }
        });
        
    } catch (error) {
        console.error('Reject user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= 5. تعليق مستخدم =============
const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userRef = db.collection('MyUser').doc(userId);
        
        await userRef.update({ 
            status: 'suspended',
            suspendedAt: new Date().toISOString(),
            suspendedBy: req.user.uid
        });
        
        try {
            await admin.auth().updateUser(userId, { disabled: true });
        } catch (authError) {
            console.error('Failed to disable auth user:', authError);
        }
        
        res.json({ success: true, message: 'User suspended successfully' });
    } catch (error) {
        console.error('Suspend user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= 6. إلغاء تعليق مستخدم =============
const unsuspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userRef = db.collection('MyUser').doc(userId);
        
        await userRef.update({ 
            status: 'active',
            unsuspendedAt: new Date().toISOString(),
            unsuspendedBy: req.user.uid
        });
        
        try {
            await admin.auth().updateUser(userId, { disabled: false });
        } catch (authError) {
            console.error('Failed to enable auth user:', authError);
        }
        
        res.json({ success: true, message: 'User unsuspended successfully' });
    } catch (error) {
        console.error('Unsuspend user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= 7. حذف مستخدم =============
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        await db.collection('MyUser').doc(userId).delete();
        
        try {
            await admin.auth().deleteUser(userId);
        } catch (authError) {
            console.error('Failed to delete auth user:', authError);
        }
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= 8. جلب إحصائيات النظام =============
const getSystemStats = async (req, res) => {
    try {
        const usersRef = db.collection('MyUser');
        const snapshot = await usersRef.get();
        
        let totalUsers = 0;
        let pendingUsers = 0;
        let activeUsers = 0;
        let suspendedUsers = 0;
        let totalBalance = 0;
        let totalTransactions = 0;
        
        for (const doc of snapshot.docs) {
            const userData = doc.data();
            totalUsers++;
            
            if (userData.status === 'pending') pendingUsers++;
            else if (userData.status === 'active') activeUsers++;
            else if (userData.status === 'suspended') suspendedUsers++;
            
            const accounts = userData.accounts || [];
            totalBalance += accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
            
            const transactions = userData.transactions || [];
            totalTransactions += transactions.length;
        }
        
        const monthlyTransactions = new Array(12).fill(0);
        const currentYear = new Date().getFullYear();
        
        for (const doc of snapshot.docs) {
            const userData = doc.data();
            const transactions = userData.transactions || [];
            
            for (const trans of transactions) {
                const transDate = new Date(trans.date);
                if (transDate.getFullYear() === currentYear) {
                    const month = transDate.getMonth();
                    monthlyTransactions[month] += Math.abs(trans.amount || 0);
                }
            }
        }
        
        // إحصائيات إضافية للرسم البياني
        let currentAccounts = 0;
        let savingsAccounts = 0;
        let investmentAccounts = 0;
        
        for (const doc of snapshot.docs) {
            const userData = doc.data();
            const accounts = userData.accounts || [];
            for (const acc of accounts) {
                if (acc.type === 'current') currentAccounts++;
                else if (acc.type === 'saving') savingsAccounts++;
                else if (acc.type === 'investment') investmentAccounts++;
            }
        }
        
        res.json({
            success: true,
            stats: {
                totalUsers,
                pendingUsers,
                activeUsers,
                suspendedUsers,
                totalBalance,
                totalTransactions,
                monthlyTransactions,
                currentAccounts,
                savingsAccounts,
                investmentAccounts
            }
        });
    } catch (error) {
        console.error('Get system stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= 9. جلب آخر الأنشطة =============
const getRecentActivities = async (req, res) => {
    try {
        const usersRef = db.collection('MyUser');
        const snapshot = await usersRef.get();
        
        const activities = [];
        
        for (const doc of snapshot.docs) {
            const userData = doc.data();
            
            if (userData.createdAt) {
                activities.push({
                    id: `register_${doc.id}`,
                    type: 'user_register',
                    title: 'مستخدم جديد',
                    detail: `${userData.fullName} قام بإنشاء حساب`,
                    time: userData.createdAt,
                    userId: doc.id,
                    userName: userData.fullName
                });
            }
            
            const transactions = userData.transactions || [];
            transactions.slice(0, 5).forEach(trans => {
                activities.push({
                    id: `trans_${trans.id}`,
                    type: trans.amount > 0 ? 'deposit' : 'transfer',
                    title: trans.amount > 0 ? 'إيداع' : 'تحويل',
                    detail: trans.description,
                    time: trans.date,
                    amount: trans.amount,
                    userId: doc.id,
                    userName: userData.fullName
                });
            });
        }
        
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        res.json({ success: true, activities: activities.slice(0, 20) });
    } catch (error) {
        console.error('Get recent activities error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= 10. إعدادات النظام =============
const getSystemSettings = async (req, res) => {
    try {
        const settingsRef = db.collection('SystemSettings').doc('main');
        const settingsDoc = await settingsRef.get();
        
        const defaultSettings = {
            twoFactorAdmin: false,
            adminLogging: true,
            autoLogout: true,
            autoApprove: false,
            minDeposit: 1000,
            dailyLimit: 50000,
            bankTransfer: true,
            eWallet: true,
            investments: true,
            newUserNotify: true,
            largeTransNotify: true,
            securityNotify: true
        };
        
        const settings = settingsDoc.exists 
            ? { ...defaultSettings, ...settingsDoc.data() }
            : defaultSettings;
        
        res.json({ success: true, settings });
    } catch (error) {
        console.error('Get system settings error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSystemSettings = async (req, res) => {
    try {
        const settings = req.body;
        
        const settingsRef = db.collection('SystemSettings').doc('main');
        await settingsRef.set({
            ...settings,
            updatedAt: new Date().toISOString(),
            updatedBy: req.user.uid
        }, { merge: true });
        
        res.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Update system settings error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// ============= إرسال إيميل الرفض =============
const sendRejectionEmail = async (req, res) => {
    try {
        const { email, userName, reason } = req.body;
        
        if (!email || !userName || !reason) {
            return res.status(400).json({ success: false, message: 'بيانات غير مكتملة' });
        }
        
        const nodemailer = require('nodemailer');
        
        // إعدادات الإيميل
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'moustafaahmed870@gmail.com',
                pass: process.env.EMAIL_PASS || 'zxnz yuju gebp eydr'
            }
        });
        
        const mailOptions = {
            from: '"MSB Bank" <no-reply@msb-bank.com>',
            to: email,
            subject: '❌ تحديث حالة طلب فتح الحساب - MSB Bank',
            html: `
                <div style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://i.ibb.co/LhY9KjRv/MSB.png" alt="MSB Bank" style="width: 80px;">
                        <h2 style="color: #0ef; margin-top: 10px;">MSB Bank</h2>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #0a2438 0%, #081b29 100%); border-radius: 15px; padding: 25px; border: 1px solid rgba(0, 238, 255, 0.3);">
                        <h3 style="color: #ef4444; margin-bottom: 20px;">
                            <i class="fas fa-times-circle"></i> عذراً، تم رفض طلب فتح الحساب
                        </h3>
                        
                        <p style="color: #a0d2db; line-height: 1.6;">
                            عزيزي/عزيزتي <strong style="color: #0ef;">${userName}</strong>،
                        </p>
                        
                        <p style="color: #a0d2db; line-height: 1.6; margin-top: 15px;">
                            بعد مراجعة طلب فتح الحساب الخاص بك، نأسف لإبلاغك بأنه لم يتم الموافقة عليه للأسباب التالية:
                        </p>
                        
                        <div style="background: rgba(239, 68, 68, 0.1); border-right: 3px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 8px;">
                            <p style="color: #a0d2db; margin: 0; line-height: 1.6;">
                                <strong style="color: #ef4444;">⚠️ سبب الرفض:</strong><br>
                                ${reason}
                            </p>
                        </div>
                        
                        <p style="color: #a0d2db; line-height: 1.6; margin-top: 15px;">
                            يمكنك إعادة التقديم مرة أخرى بعد استيفاء الشروط المطلوبة. إذا كان لديك أي استفسارات، يرجى التواصل مع خدمة العملاء.
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(0, 238, 255, 0.2);">
                            <p style="color: #a0d2db; font-size: 12px; text-align: center;">
                                هذا البريد إلكتروني آلي، يرجى عدم الرد عليه.<br>
                                © 2025 MSB Bank. جميع الحقوق محفوظة.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ Rejection email sent to ${email}`);
        
        res.json({ success: true, message: 'تم إرسال إيميل الرفض بنجاح' });
        
    } catch (error) {
        console.error('❌ Send rejection email error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= إرسال إيميل القبول =============
const sendApprovalEmail = async (req, res) => {
    try {
        const { email, userName } = req.body;
        
        if (!email || !userName) {
            return res.status(400).json({ success: false, message: 'بيانات غير مكتملة' });
        }
        
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'moustafaahmed870@gmail.com',
                pass: process.env.EMAIL_PASS || 'zxnz yuju gebp eydr'
            }
        });
        
        const mailOptions = {
            from: '"MSB Bank" <no-reply@msb-bank.com>',
            to: email,
            subject: '✅ تم قبول طلب فتح الحساب - MSB Bank',
            html: `
                <div style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://i.ibb.co/LhY9KjRv/MSB.png" alt="MSB Bank" style="width: 80px;">
                        <h2 style="color: #0ef; margin-top: 10px;">MSB Bank</h2>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #0a2438 0%, #081b29 100%); border-radius: 15px; padding: 25px; border: 1px solid rgba(0, 238, 255, 0.3);">
                        <h3 style="color: #10b981; margin-bottom: 20px;">
                            <i class="fas fa-check-circle"></i> تم قبول طلب فتح الحساب
                        </h3>
                        
                        <p style="color: #a0d2db; line-height: 1.6;">
                            عزيزي/عزيزتي <strong style="color: #0ef;">${userName}</strong>،
                        </p>
                        
                        <p style="color: #a0d2db; line-height: 1.6; margin-top: 15px;">
                            يسرنا إبلاغك أنه تم قبول طلب فتح الحساب الخاص بك بنجاح في <strong style="color: #0ef;">MSB Bank</strong>.
                        </p>
                        
                        <div style="background: rgba(16, 185, 129, 0.1); border-right: 3px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 8px;">
                            <p style="color: #a0d2db; margin: 0; line-height: 1.6;">
                                <strong style="color: #10b981;">✅ ماذا بعد؟</strong><br>
                                يمكنك الآن تسجيل الدخول إلى حسابك باستخدام البريد الإلكتروني وكلمة المرور التي قمت بتسجيلها.
                            </p>
                        </div>
                        
                        <p style="color: #a0d2db; line-height: 1.6; margin-top: 15px;">
                            نشكرك لثقتك بنا، ونتمنى لك تجربة مصرفية مميزة.
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(0, 238, 255, 0.2);">
                            <p style="color: #a0d2db; font-size: 12px; text-align: center;">
                                هذا البريد إلكتروني آلي، يرجى عدم الرد عليه.<br>
                                © 2025 MSB Bank. جميع الحقوق محفوظة.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ Approval email sent to ${email}`);
        
        res.json({ success: true, message: 'تم إرسال إيميل القبول بنجاح' });
        
    } catch (error) {
        console.error('❌ Send approval email error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// ============= حذف مستخدم نهائياً (بدون أي آثار) =============
// ============= حذف مستخدم نهائياً (بدون أي آثار) =============
const permanentlyDeleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`🗑️ Permanently deleting user: ${userId}`);
        
        // 1. جلب بيانات المستخدم
        const userDoc = await db.collection('MyUser').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const userData = userDoc.data();
        
        // 2. حذف المستخدم من Firestore
        await db.collection('MyUser').doc(userId).delete();
        console.log('✅ User deleted from Firestore');
        
        // 3. حذف المستخدم من Firebase Authentication
        try {
            await admin.auth().deleteUser(userId);
            console.log('✅ User deleted from Firebase Auth');
        } catch (authError) {
            console.error('Failed to delete from Firebase Auth:', authError);
        }
        
        res.json({ 
            success: true, 
            message: `User ${userData.email} deleted permanently`,
            deletedUser: {
                fullName: userData.fullName,
                email: userData.email
            }
        });
        
    } catch (error) {
        console.error('Permanent delete error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= تصدير جميع الدوال =============
module.exports = {
    getAllUsers,
    getPendingUsers,
    approveUser,
    rejectUser,
    suspendUser,
    unsuspendUser,
    deleteUser,
    getSystemStats,
    getRecentActivities,
    getSystemSettings,
    updateSystemSettings,
    permanentlyDeleteUser,
};
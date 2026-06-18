const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const path = require('path');

// ✅ استخدم المسار الصحيح لملف serviceAccountKey.json
// بما أن الملف في مجلد backend نفسه
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

// تهيئة Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

async function createAdmin() {
    try {
        const email = 'admin@msbbank.com';
        const password = 'Msb-bank';
        
        // 1. تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('✅ Password hashed successfully');
        
        // 2. البحث هل المستخدم موجود بالفعل؟
        const existingSnapshot = await db.collection('MyUser').where('email', '==', email).get();
        
        if (!existingSnapshot.empty) {
            console.log('⚠️ Admin user already exists!');
            const existingDoc = existingSnapshot.docs[0];
            console.log('User ID:', existingDoc.id);
            console.log('User Data:', existingDoc.data());
            return;
        }
        
        // 3. إنشاء المستخدم في Firebase Authentication
        let userRecord;
        try {
            userRecord = await admin.auth().createUser({
                email: email,
                password: password,
                displayName: 'مدير النظام',
                emailVerified: true
            });
            console.log('✅ Firebase Auth user created:', userRecord.uid);
        } catch (authError) {
            if (authError.code === 'auth/email-already-exists') {
                // لو الإيميل موجود في Auth بس مش في Firestore
                const userByEmail = await admin.auth().getUserByEmail(email);
                userRecord = userByEmail;
                console.log('⚠️ User already exists in Auth, using existing UID:', userRecord.uid);
            } else {
                throw authError;
            }
        }
        
        // 4. إنشاء المستند في Firestore
        const adminData = {
            uid: userRecord.uid,
            fullName: 'مدير النظام',
            email: email,
            password: hashedPassword,
            role: 'admin',
            status: 'active',
            phone: '01000000000',
            address: 'القاهرة، مصر',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            accounts: [],
            transactions: [],
            notifications: [],
            walletBalance: 0
        };
        
        await db.collection('MyUser').doc(userRecord.uid).set(adminData);
        console.log('✅ Firestore document created for admin');
        
        console.log('\n🎉 Admin created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);
        console.log('🆔 UID:', userRecord.uid);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        console.error('Error details:', error.message);
    }
}

// تنفيذ الدالة
createAdmin();
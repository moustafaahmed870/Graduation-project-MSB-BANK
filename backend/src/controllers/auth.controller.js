const { admin, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ توليد رقم حساب عشوائي 4 أرقام
const generateAccountNumber = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// ✅ تسجيل مستخدم جديد
const register = async (req, res) => {
  console.log('🔥🔥🔥 REGISTER CONTROLLER HIT 🔥🔥🔥');
  console.log('📥 req.body:', req.body);

  const {
    fullName,
    nationalId,
    dateOfBirth,
    gender,
    phone,
    email,
    password,
    address,
    city,
    postalCode,
    accountType,
    initialDeposit,
  } = req.body;

  try {
    console.log('🔑 Creating Firebase Auth user...');
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
    });

    const uid = userRecord.uid;
    console.log('✅ Firebase user created - uid:', uid);

    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // توليد رقم الحساب
    const accountNumber = generateAccountNumber();
    console.log('🔢 Generated Account Number:', accountNumber);

    console.log('💾 Saving to Firestore...');
    await db.collection('MyUser').doc(uid).set({
      uid,
      fullName,
      nationalId,
      dateOfBirth,
      gender,
      phone,
      email,
      password: hashedPassword,
      address,
      city,
      postalCode,
      accountType,
      accountNumber,
      initialDeposit: parseFloat(initialDeposit),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Saved to Firestore');

    const token = jwt.sign(
      { uid, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('✅ Token created');

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: {
        uid,
        fullName,
        email,
        accountType,
        accountNumber,
      },
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(400).json({
      message: error.message || 'حدث خطأ أثناء إنشاء الحساب',
    });
  }
};

// ✅ تسجيل الدخول
const login = async (req, res) => {
  console.log('🔥🔥🔥 LOGIN CONTROLLER HIT 🔥🔥🔥');

  const { email, password } = req.body;

  try {
    const snapshot = await db
      .collection('MyUser')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign(
      { uid: userData.uid, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        uid: userData.uid,
        fullName: userData.fullName,
        email: userData.email,
        accountType: userData.accountType,
        accountNumber: userData.accountNumber,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ✅ تغيير الباسورد (اليوزر عارف الباسورد القديم)
const changePassword = async (req, res) => {
  console.log('🔥🔥🔥 CHANGE PASSWORD HIT 🔥🔥🔥');

  const { oldPassword, newPassword } = req.body;
  const uid = req.user.uid; // جاي من verifyToken middleware

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'من فضلك ادخل الباسورد القديم والجديد' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'الباسورد الجديد لازم يكون 6 حروف على الأقل' });
  }

  try {
    const userDoc = await db.collection('MyUser').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const userData = userDoc.data();

    // تحقق من الباسورد القديم
    const isMatch = await bcrypt.compare(oldPassword, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'الباسورد القديم غلط' });
    }

    // هاش الباسورد الجديد
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // اپديت في Firestore
    await db.collection('MyUser').doc(uid).update({
      password: hashedNewPassword,
    });

    // اپديت في Firebase Auth
    await admin.auth().updateUser(uid, { password: newPassword });

    console.log('✅ Password changed for uid:', uid);
    res.status(200).json({ message: 'تم تغيير الباسورد بنجاح ✅' });
  } catch (error) {
    console.error('❌ changePassword error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ✅ نسيت الباسورد (بيبعت reset link على الإيميل)
const forgotPassword = async (req, res) => {
  console.log('🔥🔥🔥 FORGOT PASSWORD HIT 🔥🔥🔥');

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'من فضلك ادخل الإيميل' });
  }

  try {
    // تأكد إن الإيميل موجود في الـ DB
    const snapshot = await db
      .collection('MyUser')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'الإيميل ده مش موجود' });
    }

    // Firebase بيبعت إيميل reset تلقائياً
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    // ⚠️ في production: ابعت الـ resetLink عن طريق nodemailer أو SendGrid
    // دلوقتي بنرجعه في الـ response للتجربة فقط
    console.log('🔗 Reset Link:', resetLink);

    res.status(200).json({
      message: 'تم إرسال رابط إعادة تعيين الباسورد على إيميلك ✅',
      resetLink, // ⚠️ شيل السطر ده في production
    });
  } catch (error) {
    console.error('❌ forgotPassword error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

module.exports = { register, login, changePassword, forgotPassword };
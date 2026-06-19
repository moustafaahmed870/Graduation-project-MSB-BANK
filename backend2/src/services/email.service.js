const nodemailer = require('nodemailer');

// استخدم إعدادات الإيميل الصحيحة بتاعتك
const transporter = nodemailer.createTransport({
  service: 'gmail',  // أو إعدادات SMTP بتاعتك
  auth: {
    user: 'moustafaahmed870@gmail.com',
    pass: 'zxnz yuju gebp eydr'
  }
});

// تخزين مؤقت للأكواد
const otpStore = new Map();

const sendPasswordResetEmail = async (email, otpCode) => {
  try {
    const mailOptions = {
      from: '"MSB Bank" <no-reply@msb-bank.com>',
      to: email,
      subject: '🔐 Reset Your MSB Bank Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px;">
          <h2 style="color: #0ef;">🏦 MSB Bank</h2>
          <h3>Password Reset Request</h3>
          <p>Your OTP code is:</p>
          <div style="background: #0ef; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 15px;">
            ${otpCode}
          </div>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', email);
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    // ✅ حفظ كـ STRING عشان المقارنة تكون صحيحة
    otpStore.set(email, {
      code: String(otpCode),  // <- تحويل لـ string
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    
    console.log(`📝 OTP stored for ${email}: ${otpCode} (expires in 10 min)`);
    console.log(`📊 Current OTP store size: ${otpStore.size}`);

    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
};

const verifyOTP = (email, otpCode) => {
  console.log(`🔍 Verifying OTP for ${email}: input=${otpCode}`);
  
  const record = otpStore.get(email);
  
  if (!record) {
    console.log(`❌ No OTP record found for ${email}`);
    return false;
  }
  
  console.log(`📝 Stored code: ${record.code}, expires: ${new Date(record.expiresAt)}`);
  console.log(`🕐 Current time: ${new Date()}`);
  
  if (Date.now() > record.expiresAt) {
    console.log(`⏰ OTP expired for ${email}`);
    otpStore.delete(email);
    return false;
  }
  
  // ✅ مقارنة كـ string
  const isValid = String(record.code) === String(otpCode);
  
  if (isValid) {
    console.log(`✅ OTP verified successfully for ${email}`);
    otpStore.delete(email);  // حذف بعد الاستخدام الناجح
  } else {
    console.log(`❌ OTP mismatch for ${email}: stored="${record.code}", received="${otpCode}"`);
  }
  
  return isValid;
};

// دالة مساعدة لعرض كل الأكواد المخزنة (للتسعير)
const debugOTPStore = () => {
  console.log('=== Current OTP Store ===');
  for (const [email, data] of otpStore.entries()) {
    console.log(`📧 ${email}: code=${data.code}, expires=${new Date(data.expiresAt)}`);
  }
  console.log('========================');
};

// تحديث updatePassword (للتأكد إنه بيستخدم نفس الـ db)
const updatePassword = async (email, newPassword) => {
  const { admin, db } = require('../config/firebase');
  const bcrypt = require('bcryptjs');
  
  try {
    const snapshot = await db
      .collection('MyUser')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) return false;

    const userDoc = snapshot.docs[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userDoc.ref.update({
      password: hashedPassword,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`✅ Password updated for ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Update password error:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  verifyOTP,
  updatePassword,
  debugOTPStore,  // تصدير دالة التسعير للاستخدام في التحكم
};
const { db } = require('../config/firebase');
const { sendNotificationToUser } = require('./notification.controller');

// ============= دوال مساعدة =============
const getUserData = async (uid) => {
  const userDoc = await db.collection('MyUser').doc(uid).get();
  if (!userDoc.exists) throw new Error('User not found');
  return { uid, ...userDoc.data() };
};

const findUserByAccountNumber = async (accountNumber) => {
  try {
    const usersSnapshot = await db.collection('MyUser').get();
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const accounts = userData.accounts || [];
      const foundAccount = accounts.find(acc => acc.number === accountNumber);
      if (foundAccount) {
        return { uid: doc.id, user: userData, account: foundAccount };
      }
    }
    return null;
  } catch (error) {
    console.error('Find user by account error:', error);
    return null;
  }
};

// ============= طلب مبلغ من شخص =============
const requestMoney = async (req, res) => {
  try {
    const { toAccountNumber, amount, note } = req.body;
    const uid = req.user.uid;

    if (!toAccountNumber || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'بيانات غير صحيحة' });
    }

    // جيب بيانات الطالب
    const requesterUser = await getUserData(uid);

    // دور على صاحب الحساب المطلوب منه
    const found = await findUserByAccountNumber(toAccountNumber);
    if (!found) {
      return res.status(404).json({ success: false, message: 'رقم الحساب غير موجود' });
    }

    if (found.uid === uid) {
      return res.status(400).json({ success: false, message: 'لا يمكن طلب مبلغ من نفسك' });
    }

    // ابعت نوتيفيكيشن للشخص المطلوب منه
    await sendNotificationToUser(found.uid, {
      titleAr: '💰 طلب مبلغ',
      titleEn: '💰 Money Request',
      bodyAr: `${requesterUser.fullName} يطلب منك مبلغ ${Number(amount).toLocaleString()} ج.م${note ? ' - ' + note : ''}`,
      bodyEn: `${requesterUser.fullName} is requesting EGP ${Number(amount).toLocaleString()} from you${note ? ' - ' + note : ''}`,
      type: 'warning',
      icon: 'hand-holding-usd',
      data: {
        requestFromUid: uid,
        requestFromName: requesterUser.fullName,
        amount: String(amount),
        note: note || '',
      },
    });

    console.log(`✅ Money request sent from ${uid} to ${found.uid} | amount: ${amount}`);
    res.json({ success: true, message: 'تم إرسال طلب المبلغ بنجاح' });

  } catch (error) {
    console.error('❌ requestMoney error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  requestMoney,
};
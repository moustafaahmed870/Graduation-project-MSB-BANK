const { admin, db } = require('../config/firebase');

// ===================================================
// Helper Functions
// ===================================================
function generateCardNumber(cardType) {
  // Visa تبدأ بـ 4، Mastercard تبدأ بـ 5
  const prefix = cardType === 'visa' ? '4' : '5';
  let number = prefix;
  for (let i = 0; i < 15; i++) {
    number += Math.floor(Math.random() * 10);
  }
  // فرمت: XXXX XXXX XXXX XXXX
  return number.match(/.{1,4}/g).join(' ');
}

function generateExpiry() {
  const now = new Date();
  const year = (now.getFullYear() + 4).toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${month}/${year}`;
}

// ===================================================
// GET /admin/cards/applications - جيب كل الطلبات
// ===================================================
const getCardApplications = async (req, res) => {
  const { status } = req.query; // pending | approved | rejected | all
  console.log('🟡 [getCardApplications] status filter:', status);

  try {
    let query = db.collection('CardApplications').orderBy('createdAt', 'desc');

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ applications });
  } catch (error) {
    console.error('❌ [getCardApplications] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ===================================================
// POST /admin/cards/review/:applicationId
// الأدمن يوافق أو يرفض الطلب
// ===================================================
const reviewCardApplication = async (req, res) => {
  const { applicationId } = req.params;
  const { action } = req.body; // 'approve' | 'reject'
  const adminUid = req.user.uid;
  console.log('🟡 [reviewCardApplication] applicationId:', applicationId, '| action:', action);

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'action لازم يكون approve أو reject' });
  }

  try {
    const appRef = db.collection('CardApplications').doc(applicationId);
    const appDoc = await appRef.get();

    if (!appDoc.exists) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    const appData = appDoc.data();

    if (appData.status !== 'pending') {
      return res.status(400).json({ message: 'الطلب ده اتراجعه قبل كده' });
    }

    if (action === 'approve') {
      // ولّد بيانات البطاقة
      const cardNumber = generateCardNumber(appData.cardType);
      const expiry = generateExpiry();

      await db.runTransaction(async (transaction) => {
        // أضف البطاقة لـ Cards collection
        const cardRef = db.collection('Cards').doc();
        transaction.set(cardRef, {
          uid: appData.uid,
          type: appData.cardType.toUpperCase(), // 'VISA' | 'MASTERCARD'
          category: appData.cardCategory,       // 'debit' | 'credit' | 'prepaid'
          number: cardNumber,
          expiry: expiry,
          isActive: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          applicationId,
        });

        // حدّث الطلب
        transaction.update(appRef, {
          status: 'approved',
          reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
          reviewedBy: adminUid,
          cardId: cardRef.id,
        });
      });

      console.log('✅ [reviewCardApplication] approved - card created');
      return res.status(200).json({ message: 'تمت الموافقة وتم إنشاء البطاقة ✅' });
    }

    if (action === 'reject') {
      await appRef.update({
        status: 'rejected',
        reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
        reviewedBy: adminUid,
      });

      console.log('✅ [reviewCardApplication] rejected');
      return res.status(200).json({ message: 'تم رفض الطلب' });
    }
  } catch (error) {
    console.error('❌ [reviewCardApplication] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

module.exports = {
  getCardApplications,
  reviewCardApplication,
};
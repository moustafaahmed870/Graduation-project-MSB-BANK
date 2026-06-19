const express = require('express');
const router = express.Router();
const {
  getAccountDetails,
  getTransactions,
  transferFunds,
  payBill,
  getCards,
  toggleCard,
  getStatement,
  applyForCard,
  approveCard,
} = require('../controllers/account.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// كل الـ routes دي محتاجة token
router.use(verifyToken);

router.get('/details', getAccountDetails);          // تفاصيل الحساب
router.get('/transactions', getTransactions);        // سجل المعاملات
router.post('/transfer', transferFunds);             // تحويل أموال
router.post('/pay-bill', payBill);                   // دفع فاتورة
router.get('/statement', getStatement);              // كشف حساب

// ⚠️ مهم: /cards/apply لازم يكون قبل /cards/:cardId
router.post('/cards/apply', applyForCard);                      // طلب بطاقة جديدة
router.post('/cards/approve/:applicationId', approveCard);      // موافقة
router.get('/cards', getCards);                                 // قائمة البطاقات
router.patch('/cards/:cardId', toggleCard);                     // تفعيل/إيقاف بطاقة

module.exports = router;
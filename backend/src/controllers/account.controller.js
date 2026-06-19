const { admin, db } = require('../config/firebase');

// ===================================================
// Helper Functions
// ===================================================
const getUserData = async (uid) => {
  const userDoc = await db.collection('MyUser').doc(uid).get();
  if (!userDoc.exists) throw new Error('User not found');
  return { uid, ...userDoc.data() };
};

const updateUserData = async (uid, data) => {
  await db.collection('MyUser').doc(uid).update({ ...data, updatedAt: new Date().toISOString() });
};

const addTransaction = async (uid, transaction) => {
  try {
    const userRef = db.collection('MyUser').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return false;

    const userData = userDoc.data();
    let transactions = userData.transactions || [];

    const newTransaction = {
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      ...transaction,
      date: transaction.date || new Date().toISOString(),
      status: transaction.status || 'completed'
    };

    transactions.unshift(newTransaction);
    if (transactions.length > 100) transactions = transactions.slice(0, 100);
    await userRef.update({ transactions });
    return true;
  } catch (error) {
    console.error('Error adding transaction:', error);
    return false;
  }
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

function generateCardNumber(cardType) {
  const prefix = cardType === 'visa' ? '4' : '5';
  let number = prefix;
  for (let i = 0; i < 15; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number.match(/.{1,4}/g).join(' ');
}

function generateExpiry() {
  const now = new Date();
  const year = (now.getFullYear() + 4).toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${month}/${year}`;
}

// ===================================================
// 1. GET /details - تفاصيل الحساب والرصيد
// ===================================================
const getAccountDetails = async (req, res) => {
  const uid = req.user.uid;
  console.log('🟡 [getAccountDetails] uid:', uid);

  try {
    const user = await getUserData(uid);
    const currentAccount = user.accounts?.find(acc => acc.type === 'current') || user.accounts?.[0];

    res.status(200).json({
      uid: uid,
      fullName: user.fullName || '',
      accountNumber: currentAccount?.number || '',
      accountType: currentAccount?.type || 'current',
      balance: currentAccount?.balance || 0,
      currency: currentAccount?.currency || 'EGP',
      branch: user.city || 'الفرع الرئيسي',
      createdAt: user.createdAt || new Date().toISOString(),
      phone: user.phone || '',
      email: user.email || '',
    });
  } catch (error) {
    console.error('❌ [getAccountDetails] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ===================================================
// 2. GET /transactions - سجل المعاملات
// ===================================================
const getTransactions = async (req, res) => {
  const uid = req.user.uid;
  const { search, limit = 20, startAfter } = req.query;
  console.log('🟡 [getTransactions] uid:', uid);

  try {
    const user = await getUserData(uid);
    let transactions = user.transactions || [];

    if (search) {
      const searchTerm = search.toLowerCase();
      transactions = transactions.filter(t =>
        t.description?.toLowerCase().includes(searchTerm)
      );
    }

    transactions = transactions.slice(0, parseInt(limit));

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('❌ [getTransactions] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ===================================================
// 3. POST /transfer - تحويل أموال
// ===================================================
const transferFunds = async (req, res) => {
  const uid = req.user.uid;
  const { toAccount, amount, note } = req.body;
  console.log('🟡 [transferFunds] from:', uid, '→ to:', toAccount, '| amount:', amount);

  if (!toAccount || !amount || amount <= 0) {
    return res.status(400).json({ message: 'من فضلك ادخل رقم الحساب والمبلغ' });
  }

  const normalizedAccount = String(toAccount).trim();
  const parsedAmount = parseFloat(amount);

  try {
    const senderUser = await getUserData(uid);
    const fromAccount = senderUser.accounts?.find(acc => acc.type === 'current') || senderUser.accounts?.[0];

    if (!fromAccount) {
      return res.status(400).json({ message: 'لا يوجد حساب جاري للتحويل منه' });
    }

    if (fromAccount.balance < parsedAmount) {
      return res.status(400).json({ message: `الرصيد غير كافٍ، رصيدك الحالي: ${fromAccount.balance} ج.م` });
    }

    if (String(fromAccount.number).trim() === normalizedAccount) {
      return res.status(400).json({ message: 'لا يمكن التحويل لنفس الحساب' });
    }

    const found = await findUserByAccountNumber(normalizedAccount);
    if (!found) {
      return res.status(404).json({ message: `رقم الحساب ${normalizedAccount} غير موجود` });
    }

    // تحديث الرصيد
    const updatedSenderAccounts = senderUser.accounts.map(acc =>
      acc.id === fromAccount.id ? { ...acc, balance: acc.balance - parsedAmount } : acc
    );
    await updateUserData(uid, { accounts: updatedSenderAccounts });

    const updatedReceiverAccounts = found.user.accounts.map(acc =>
      acc.number === normalizedAccount ? { ...acc, balance: acc.balance + parsedAmount } : acc
    );
    await updateUserData(found.uid, { accounts: updatedReceiverAccounts });

    // إضافة المعاملات
    await addTransaction(uid, {
      description: note || `تحويل إلى ${found.user.fullName}`,
      amount: -parsedAmount,
      category: 'transfer',
      icon: 'paper-plane'
    });

    await addTransaction(found.uid, {
      description: `استلام تحويل من ${senderUser.fullName || senderUser.email}`,
      amount: +parsedAmount,
      category: 'transfer',
      icon: 'arrow-down'
    });

    console.log('✅ [transferFunds] success');
    res.status(200).json({
      message: 'تم التحويل بنجاح ✅',
      receiverName: found.user.fullName,
      amount: parsedAmount,
    });

  } catch (error) {
    console.error('❌ [transferFunds] error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء التحويل' });
  }
};

// ===================================================
// 4. POST /pay-bill - دفع فاتورة
// ===================================================
const payBill = async (req, res) => {
  const uid = req.user.uid;
  const { service, billNumber, amount } = req.body;
  console.log('🟡 [payBill] uid:', uid, '| service:', service);

  if (!service || !billNumber || !amount || amount <= 0) {
    return res.status(400).json({ message: 'من فضلك ادخل كل البيانات' });
  }

  try {
    const user = await getUserData(uid);
    const fromAccount = user.accounts?.find(acc => acc.type === 'current') || user.accounts?.[0];

    if (!fromAccount || fromAccount.balance < parseFloat(amount)) {
      return res.status(400).json({ message: 'الرصيد غير كافٍ' });
    }

    const accounts = user.accounts.map(acc =>
      acc.id === fromAccount.id ? { ...acc, balance: acc.balance - parseFloat(amount) } : acc
    );

    await updateUserData(uid, { accounts });

    await addTransaction(uid, {
      description: `دفع فاتورة ${service} - رقم ${billNumber}`,
      amount: -parseFloat(amount),
      category: 'bill',
      icon: 'file-invoice-dollar'
    });

    console.log('✅ [payBill] success');
    res.status(200).json({ message: `تم دفع فاتورة ${service} بنجاح ✅` });
  } catch (error) {
    console.error('❌ [payBill] error:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء الدفع' });
  }
};

// ===================================================
// 5. GET /statement - كشف حساب
// ===================================================
const getStatement = async (req, res) => {
  const uid = req.user.uid;
  const { from, to } = req.query;
  console.log('🟡 [getStatement] uid:', uid);

  try {
    const user = await getUserData(uid);
    const currentAccount = user.accounts?.find(acc => acc.type === 'current') || user.accounts?.[0];
    let transactions = user.transactions || [];

    if (from) {
      const fromDate = new Date(from);
      transactions = transactions.filter(t => new Date(t.date) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      transactions = transactions.filter(t => new Date(t.date) <= toDate);
    }

    res.status(200).json({
      accountHolder: user.fullName,
      accountNumber: currentAccount?.number || '',
      currentBalance: currentAccount?.balance || 0,
      transactions: transactions.slice(0, 50),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [getStatement] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ===================================================
// 6. GET /cards - قائمة البطاقات
// ===================================================
const getCards = async (req, res) => {
  const uid = req.user.uid;
  console.log('🟡 [getCards] uid:', uid);

  try {
    const user = await getUserData(uid);
    const cards = (user.cards || []).map(card => ({
      id: card.id,
      type: card.type || 'visa',
      category: card.name || 'standard',
      number: card.number || '****',
      expiry: card.expiry || '',
      isActive: card.status === 'active',
    }));
    res.status(200).json({ cards });
  } catch (error) {
    console.error('❌ [getCards] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ===================================================
// 7. PATCH /cards/:cardId - تفعيل/إيقاف بطاقة
// ===================================================
const toggleCard = async (req, res) => {
  const uid = req.user.uid;
  const { cardId } = req.params;
  console.log('🟡 [toggleCard] uid:', uid, '| cardId:', cardId);

  try {
    const user = await getUserData(uid);
    const card = user.cards?.find(c => c.id === cardId);

    if (!card) {
      return res.status(404).json({ message: 'البطاقة غير موجودة' });
    }

    const newStatus = card.status === 'active' ? 'frozen' : 'active';
    const cards = user.cards.map(c =>
      c.id === cardId ? { ...c, status: newStatus } : c
    );

    await updateUserData(uid, { cards });

    res.status(200).json({
      message: newStatus === 'active' ? 'تم تفعيل البطاقة ✅' : 'تم إيقاف البطاقة ✅',
      isActive: newStatus === 'active',
    });
  } catch (error) {
    console.error('❌ [toggleCard] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ===================================================
// 8. POST /cards/apply - طلب بطاقة جديدة
// ===================================================
const applyForCard = async (req, res) => {
  const uid = req.user.uid;
  const { cardType, cardCategory } = req.body;
  console.log('🟡 [applyForCard] uid:', uid, '| cardType:', cardType, '| cardCategory:', cardCategory);

  if (!cardType || !cardCategory) {
    return res.status(400).json({ message: 'من فضلك اختر نوع وفئة البطاقة' });
  }

  try {
    const user = await getUserData(uid);
    const currentAccount = user.accounts?.find(acc => acc.type === 'current') || user.accounts?.[0];

    const cardNames = {
      classic: 'بطاقة كلاسيك',
      gold: 'بطاقة ذهبية',
      platinum: 'بطاقة بلاتينية'
    };

    const creditLimits = {
      classic: 5000,
      gold: 15000,
      platinum: 50000
    };

    const newCard = {
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      name: cardNames[cardCategory] || 'بطاقة بنكية',
      number: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      type: cardType || 'visa',
      holder: user.fullName?.toUpperCase() || 'مستخدم',
      expiry: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }),
      creditLimit: creditLimits[cardCategory] || 5000,
      used: 0,
      available: currentAccount?.balance || 0,
      status: 'pending',
      linkedAccountId: currentAccount?.id,
      linkedAccountName: currentAccount?.name,
      createdAt: new Date().toISOString(),
    };

    const cards = [...(user.cards || []), newCard];
    await updateUserData(uid, { cards });

    console.log('✅ [applyForCard] application saved');
    res.status(201).json({ message: 'تم إرسال طلبك بنجاح، سيتم الرد عليك خلال 3-5 أيام عمل ✅' });
  } catch (error) {
    console.error('❌ [applyForCard] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

// ===================================================
// 9. POST /cards/approve/:applicationId - موافقة على بطاقة
// ===================================================
const approveCard = async (req, res) => {
  const { applicationId } = req.params;
  console.log('🟡 [approveCard] applicationId:', applicationId);

  try {
    const usersSnapshot = await db.collection('MyUser').get();
    let foundCard = null;
    let foundUserUid = null;
    let foundUserData = null;

    for (const doc of usersSnapshot.docs) {
      const data = doc.data();
      const card = (data.cards || []).find(c => c.id === applicationId);
      if (card) {
        foundCard = card;
        foundUserUid = doc.id;
        foundUserData = data;
        break;
      }
    }

    if (!foundCard) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    if (foundCard.status !== 'pending') {
      return res.status(400).json({ message: 'الطلب ده اتراجعه قبل كده' });
    }

    const updatedCards = foundUserData.cards.map(c =>
      c.id === applicationId ? { ...c, status: 'active' } : c
    );

    await updateUserData(foundUserUid, { cards: updatedCards });

    console.log('✅ [approveCard] card approved');
    res.status(200).json({ message: 'تمت الموافقة وتم إنشاء البطاقة ✅' });
  } catch (error) {
    console.error('❌ [approveCard] error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};

module.exports = {
  getAccountDetails,
  getTransactions,
  transferFunds,
  payBill,
  getCards,
  toggleCard,
  getStatement,
  applyForCard,
  approveCard,
};
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

const addNotification = async (uid, notification) => {
  try {
    const userRef = db.collection('MyUser').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return false;
    
    const userData = userDoc.data();
    let notifications = userData.notifications || [];
    
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      title: notification.title,
      message: notification.message,
      type: notification.type || 'info',
      icon: notification.icon || 'bell',
      read: false,
      time: notification.date || new Date().toISOString()
    };
    
    notifications.unshift(newNotification);
    if (notifications.length > 50) notifications = notifications.slice(0, 50);
    await userRef.update({ notifications });
    return true;
  } catch (error) {
    console.error('Error adding notification:', error);
    return false;
  }
};

const addWalletTransaction = async (uid, transaction) => {
  const user = await getUserData(uid);
  const transactions = [transaction, ...(user.walletTransactions || [])].slice(0, 50);
  await updateUserData(uid, { walletTransactions: transactions });
};

const addGovernmentServiceHistory = async (uid, service) => {
  const user = await getUserData(uid);
  const services = [service, ...(user.governmentServices || [])].slice(0, 50);
  await updateUserData(uid, { governmentServices: services });
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

const updateAccountBalance = async (uid, accountId, newBalance) => {
  try {
    const user = await getUserData(uid);
    const accounts = user.accounts.map(acc => 
      acc.id === accountId ? { ...acc, balance: newBalance } : acc
    );
    await updateUserData(uid, { accounts });
    return true;
  } catch (error) {
    console.error('Update account balance error:', error);
    return false;
  }
};

const generateUniqueAccountNumber = async () => {
  let isUnique = false;
  let accountNumber = '';
  let attempts = 0;
  
  while (!isUnique && attempts < 20) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const checksum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    accountNumber = `10${timestamp.slice(-4)}${random}${timestamp.slice(-6, -2)}${checksum}`;
    
    const usersSnapshot = await db.collection('MyUser').get();
    let found = false;
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const accounts = userData.accounts || [];
      if (accounts.some(acc => acc.number === accountNumber)) {
        found = true;
        break;
      }
    }
    if (!found) isUnique = true;
    attempts++;
  }
  return accountNumber;
};

// ============= الحسابات =============
const getAccounts = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, accounts: user.accounts || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAccount = async (req, res) => {
  try {
    const { type, initialDeposit } = req.body;
    const user = await getUserData(req.user.uid);
    
    const uniqueAccountNumber = await generateUniqueAccountNumber();
    
    const accountNames = {
      current: 'الحساب الجاري',
      saving: 'حساب التوفير',
      investment: 'حساب الاستثمار'
    };
    
    const accountIcons = {
      current: 'credit-card',
      saving: 'piggy-bank',
      investment: 'chart-line'
    };
    
    const newAccount = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      name: accountNames[type] || 'حساب بنكي',
      number: uniqueAccountNumber,
      balance: parseFloat(initialDeposit) || 0,
      type: type,
      currency: 'EGP',
      icon: accountIcons[type] || 'credit-card',
      status: 'active',
      createdAt: new Date().toISOString(),
      hasCard: type !== 'investment',
      cardId: null
    };
    
    let cards = [...(user.cards || [])];
    let newCard = null;
    
    // إنشاء بطاقة تلقائياً للحسابات الجارية والتوفير
    if (type !== 'investment' && initialDeposit >= 1000) {
      newCard = {
        id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        name: type === 'current' ? 'بطاقة الحساب الجاري' : 'بطاقة حساب التوفير',
        number: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        type: 'standard',
        holder: (user.fullName || 'مستخدم').toUpperCase(),
        expiry: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }),
        creditLimit: Math.max(5000, parseFloat(initialDeposit) * 0.5),
        used: 0,
        available: Math.max(5000, parseFloat(initialDeposit) * 0.5),
        status: 'active',
        linkedAccountId: newAccount.id,
        linkedAccountName: newAccount.name,
        linkedAccountNumber: newAccount.number,
        createdAt: new Date().toISOString()
      };
      
      cards.push(newCard);
      newAccount.cardId = newCard.id;
    }
    
    const accounts = [...(user.accounts || []), newAccount];
    await updateUserData(req.user.uid, { accounts, cards });
    
    await addNotification(req.user.uid, {
      title: 'تم فتح حساب جديد',
      message: `تم فتح ${newAccount.name} برقم ${newAccount.number} بنجاح${newCard ? ' مع بطاقة مرتبطة' : ''}`,
      type: 'success',
      icon: 'check-circle'
    });
    
    res.json({ 
      success: true, 
      account: newAccount,
      card: newCard,
      message: `تم فتح ${newAccount.name}${newCard ? ' وبطاقة مرتبطة' : ''}`
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ============= حذف قرض مرفوض =============
const deleteRejectedLoan = async (req, res) => {
    try {
        const { loanId } = req.params;
        const uid = req.user.uid;
        
        console.log(`🗑️ Deleting rejected loan ${loanId} for user ${uid}`);
        
        const userRef = db.collection('MyUser').doc(uid);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
        }
        
        const userData = userDoc.data();
        const loans = userData.loans || [];
        
        const loanToDelete = loans.find(loan => loan.id === loanId);
        
        if (!loanToDelete) {
            return res.status(404).json({ success: false, message: 'القرض غير موجود' });
        }
        
        if (loanToDelete.status !== 'rejected') {
            return res.status(400).json({ success: false, message: 'لا يمكن حذف القرض إلا إذا كان مرفوضاً' });
        }
        
        const updatedLoans = loans.filter(loan => loan.id !== loanId);
        await userRef.update({ loans: updatedLoans });
        
        console.log(`✅ Loan ${loanId} deleted successfully`);
        
        res.json({ success: true, message: 'تم حذف القرض المرفوض بنجاح' });
        
    } catch (error) {
        console.error('❌ Delete rejected loan error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { balance } = req.body;
    const user = await getUserData(req.user.uid);
    const accounts = user.accounts.map(acc => acc.id === accountId ? { ...acc, balance } : acc);
    await updateUserData(req.user.uid, { accounts });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const user = await getUserData(req.user.uid);
    const accounts = user.accounts || [];
    const accountToDelete = accounts.find(acc => acc.id === accountId);
    
    if (!accountToDelete) {
      return res.status(404).json({ success: false, message: 'الحساب غير موجود' });
    }
    if (accountToDelete.balance > 0) {
      return res.status(400).json({ success: false, message: 'لا يمكن حذف الحساب لأنه يحتوي على رصيد' });
    }
    if (accounts.length === 1) {
      return res.status(400).json({ success: false, message: 'لا يمكن حذف الحساب الوحيد' });
    }
    
    const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
    await updateUserData(req.user.uid, { accounts: updatedAccounts });
    res.json({ success: true, message: 'تم حذف الحساب بنجاح' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= البطاقات =============
const getCards = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, cards: user.cards || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// إنشاء بطاقة جديدة (مع منع التكرار لنفس الحساب)
const createCard = async (req, res) => {
  try {
    console.log('📝 [createCard] Request body:', req.body);
    
    const { type, linkedAccountId } = req.body;
    
    // جلب بيانات المستخدم
    const userDoc = await db.collection('MyUser').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }
    
    const userData = userDoc.data();
    
    // البحث عن الحساب المرتبط
    const linkedAccount = userData.accounts.find(acc => acc.id === linkedAccountId);
    if (!linkedAccount) {
      return res.status(404).json({ success: false, message: 'الحساب غير موجود' });
    }
    
    if (linkedAccount.type === 'investment') {
      return res.status(400).json({ success: false, message: 'لا يمكن إصدار بطاقة لحساب استثمار' });
    }
    
    // التحقق من عدم وجود بطاقة مسبقاً
    const existingCard = (userData.cards || []).find(c => c.linkedAccountId === linkedAccountId);
    if (existingCard) {
      return res.status(400).json({ success: false, message: 'هذا الحساب لديه بطاقة بالفعل' });
    }
    
    // ✅ تحديد الحد الائتماني حسب نوع البطاقة (منفصل عن رصيد الحساب)
    let creditLimit = 5000;
    let cardName = 'بطاقة فضية';
    
    if (type === 'silver') {
      creditLimit = 5000;
      cardName = 'بطاقة فضية';
    } else if (type === 'gold') {
      creditLimit = 15000;
      cardName = 'بطاقة ذهبية';
    } else if (type === 'platinum') {
      creditLimit = 50000;
      cardName = 'بطاقة بلاتينية';
    }
    
    // ✅ الرصيد المتاح = رصيد الحساب المرتبط (مش الحد الائتماني)
    const availableBalance = linkedAccount.balance;
    
    const newCard = {
      id: `card_${Date.now()}`,
      name: cardName,
      number: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      type: type,
      holder: (userData.fullName || 'مستخدم').toUpperCase(),
      expiry: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }),
      creditLimit: creditLimit,
      used: 0,
      available: availableBalance,  // ✅ الرصيد المتاح = رصيد الحساب
      status: 'active',
      linkedAccountId: linkedAccount.id,
      linkedAccountName: linkedAccount.name,
      linkedAccountNumber: linkedAccount.number,
      linkedAccountBalance: linkedAccount.balance,
      createdAt: new Date().toISOString()
    };
    
    // تحديث الحساب
    const updatedAccounts = userData.accounts.map(acc => 
      acc.id === linkedAccountId ? { ...acc, hasCard: true, cardId: newCard.id } : acc
    );
    
    const updatedCards = [...(userData.cards || []), newCard];
    
    await db.collection('MyUser').doc(req.user.uid).update({
      accounts: updatedAccounts,
      cards: updatedCards,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ success: true, card: newCard });
    
  } catch (error) {
    console.error('❌ Create card error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCardsWithAccounts = async (req, res) => {
  try {
    const userDoc = await db.collection('MyUser').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }
    
    const userData = userDoc.data();
    
    // ✅ جلب البطاقات مع تحديث الرصيد من الحساب المرتبط
    const cardsWithAccounts = (userData.cards || []).map(card => {
      const linkedAccount = (userData.accounts || []).find(acc => acc.id === card.linkedAccountId);
      return {
        ...card,
        available: linkedAccount ? linkedAccount.balance : card.available,  // ✅ الرصيد = رصيد الحساب
        account: linkedAccount ? {
          id: linkedAccount.id,
          name: linkedAccount.name,
          number: linkedAccount.number,
          type: linkedAccount.type,
          balance: linkedAccount.balance
        } : null
      };
    });
    
    const accountIdsWithCards = (userData.cards || []).map(card => card.linkedAccountId).filter(Boolean);
    
    const accountsWithoutCards = (userData.accounts || [])
      .filter(acc => acc.type !== 'investment' && !accountIdsWithCards.includes(acc.id))
      .map(acc => ({
        id: acc.id,
        name: acc.name,
        number: acc.number,
        type: acc.type,
        balance: acc.balance
      }));
    
    res.json({ 
      success: true, 
      cards: cardsWithAccounts,
      accountsWithoutCards: accountsWithoutCards
    });
  } catch (error) {
    console.error('Get cards with accounts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const freezeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const user = await getUserData(req.user.uid);
    const cards = user.cards.map(card => card.id === cardId ? { ...card, status: 'frozen' } : card);
    await updateUserData(req.user.uid, { cards });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unfreezeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const user = await getUserData(req.user.uid);
    const cards = user.cards.map(card => card.id === cardId ? { ...card, status: 'active' } : card);
    await updateUserData(req.user.uid, { cards });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const reportLostCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const user = await getUserData(req.user.uid);
    const cards = user.cards.map(card => card.id === cardId ? { ...card, status: 'lost' } : card);
    await updateUserData(req.user.uid, { cards });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const payCardBill = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { amount } = req.body;
    
    const userDoc = await db.collection('MyUser').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }
    
    const userData = userDoc.data();
    
    const card = userData.cards.find(c => c.id === cardId);
    if (!card) {
      return res.status(404).json({ success: false, message: 'البطاقة غير موجودة' });
    }
    
    const linkedAccount = userData.accounts.find(acc => acc.id === card.linkedAccountId);
    if (!linkedAccount) {
      return res.status(404).json({ success: false, message: 'الحساب المرتبط غير موجود' });
    }
    
    if (amount > card.used) {
      return res.status(400).json({ success: false, message: 'المبلغ أكبر من المستحق على البطاقة' });
    }
    
    if (amount > linkedAccount.balance) {
      return res.status(400).json({ success: false, message: `الرصيد غير كافٍ في حساب ${linkedAccount.name}` });
    }
    
    // ✅ خصم من الحساب المرتبط
    const updatedAccounts = userData.accounts.map(acc => 
      acc.id === linkedAccount.id ? { ...acc, balance: acc.balance - amount } : acc
    );
    
    // ✅ تحديث البطاقة
    const updatedCards = userData.cards.map(c => 
      c.id === cardId ? { ...c, used: c.used - amount, available: c.available + amount } : c
    );
    
    await db.collection('MyUser').doc(req.user.uid).update({
      accounts: updatedAccounts,
      cards: updatedCards,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'تم دفع فاتورة البطاقة بنجاح' });
    
  } catch (error) {
    console.error('Pay card bill error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= التحويلات =============
const internalTransfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description } = req.body;
    let senderUser = await getUserData(req.user.uid);
    
    if (!fromAccountId) {
      return res.status(400).json({ success: false, message: 'fromAccountId is required' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'المبلغ غير صحيح' });
    }
    
    const fromAccount = senderUser.accounts.find(acc => acc.id === fromAccountId);
    if (!fromAccount) {
      return res.status(404).json({ success: false, message: 'الحساب المرسل منه غير موجود' });
    }
    if (fromAccount.balance < amount) {
      return res.status(400).json({ success: false, message: `الرصيد غير كافٍ. المتاح: ${fromAccount.balance.toLocaleString()} ج.م` });
    }
    
    let toAccount = senderUser.accounts.find(acc => acc.number === toAccountNumber);
    let receiverUid = req.user.uid;
    let receiverUser = senderUser;
    let isSameUser = true;
    
    if (!toAccount) {
      const found = await findUserByAccountNumber(toAccountNumber);
      if (found) {
        toAccount = found.account;
        receiverUid = found.uid;
        receiverUser = found.user;
        isSameUser = false;
      }
    }
    
    if (!toAccount) {
      return res.status(404).json({ success: false, message: `لا يوجد حساب برقم ${toAccountNumber}` });
    }
    if (fromAccount.id === toAccount.id) {
      return res.status(400).json({ success: false, message: 'لا يمكن التحويل إلى نفس الحساب' });
    }
    
    if (isSameUser) {
      const updatedAccounts = senderUser.accounts.map(acc => {
        if (acc.id === fromAccountId) {
          return { ...acc, balance: acc.balance - amount };
        }
        if (acc.number === toAccountNumber) {
          return { ...acc, balance: acc.balance + amount };
        }
        return acc;
      });
      await updateUserData(req.user.uid, { accounts: updatedAccounts });
    } else {
      const updatedSenderAccounts = senderUser.accounts.map(acc => {
        if (acc.id === fromAccountId) {
          return { ...acc, balance: acc.balance - amount };
        }
        return acc;
      });
      await updateUserData(req.user.uid, { accounts: updatedSenderAccounts });
      
      const updatedReceiverAccounts = receiverUser.accounts.map(acc => {
        if (acc.number === toAccountNumber) {
          return { ...acc, balance: acc.balance + amount };
        }
        return acc;
      });
      await updateUserData(receiverUid, { accounts: updatedReceiverAccounts });
    }
    
    await addTransaction(req.user.uid, {
      description: description || `تحويل إلى ${isSameUser ? toAccount.name : receiverUser.fullName}`,
      amount: -amount,
      category: 'transfer',
      icon: 'paper-plane'
    });
    
    if (!isSameUser) {
      await addTransaction(receiverUid, {
        description: `استلام تحويل من ${senderUser.fullName || senderUser.email}`,
        amount: +amount,
        category: 'transfer',
        icon: 'arrow-down'
      });
    }
    
    await addNotification(req.user.uid, {
      title: 'تحويل أموال',
      message: `تم تحويل مبلغ ${amount.toLocaleString()} ج.م إلى ${isSameUser ? toAccount.name : receiverUser.fullName}`,
      type: 'success',
      icon: 'paper-plane'
    });
    
    res.json({ success: true, message: 'تم التحويل بنجاح' });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const externalTransfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountNumber, toAccountName, bankName, amount, description } = req.body;
    const senderUser = await getUserData(req.user.uid);
    
    const fromAccount = senderUser.accounts.find(acc => acc.id === fromAccountId);
    if (!fromAccount) return res.status(404).json({ success: false, message: 'الحساب المرسل منه غير موجود' });
    if (fromAccount.balance < amount) return res.status(400).json({ success: false, message: 'الرصيد غير كافٍ' });
    
    const found = await findUserByAccountNumber(toAccountNumber);
    if (!found) return res.status(404).json({ success: false, message: 'حساب المستلم غير موجود' });
    if (found.uid === req.user.uid) return res.status(400).json({ success: false, message: 'هذا تحويل داخلي' });
    
    const updatedSenderAccounts = senderUser.accounts.map(acc => acc.id === fromAccountId ? { ...acc, balance: acc.balance - amount } : acc);
    await updateUserData(req.user.uid, { accounts: updatedSenderAccounts });
    
    const updatedReceiverAccounts = found.user.accounts.map(acc => acc.number === toAccountNumber ? { ...acc, balance: acc.balance + amount } : acc);
    await updateUserData(found.uid, { accounts: updatedReceiverAccounts });
    
    await addTransaction(req.user.uid, {
      description: description || `تحويل إلى ${toAccountName || found.user.fullName}`,
      amount: -amount,
      category: 'transfer-external',
      icon: 'exchange-alt'
    });
    
    await addTransaction(found.uid, {
      description: `استلام تحويل من ${senderUser.fullName || senderUser.email}`,
      amount: +amount,
      category: 'transfer-received',
      icon: 'arrow-down'
    });
    
    res.json({ success: true, message: 'تم التحويل بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTransfers = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    const transfers = (user.transactions || []).filter(t => t.category === 'transfer' || t.category === 'transfer-external');
    res.json({ success: true, transfers: transfers.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBeneficiaries = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, beneficiaries: user.beneficiaries || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addBeneficiary = async (req, res) => {
  try {
    const { name, accountNumber, bankName } = req.body;
    const user = await getUserData(req.user.uid);
    
    const newBeneficiary = {
      id: `ben_${Date.now()}`,
      name,
      accountNumber,
      bank: bankName,
      type: 'external',
      createdAt: new Date().toISOString()
    };
    
    const beneficiaries = [...(user.beneficiaries || []), newBeneficiary];
    await updateUserData(req.user.uid, { beneficiaries });
    res.json({ success: true, beneficiary: newBeneficiary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyAccountExists = async (req, res) => {
  try {
    const { accountNumber } = req.body;
    if (!accountNumber) return res.status(400).json({ success: false, exists: false, message: 'رقم الحساب مطلوب' });
    
    const found = await findUserByAccountNumber(accountNumber);
    if (found) {
      res.json({ success: true, exists: true, accountOwner: { name: found.user.fullName, accountType: found.account.type, bank: 'MSB BANK' } });
    } else {
      res.json({ success: true, exists: false, message: 'لا يوجد حساب بهذا الرقم' });
    }
  } catch (error) {
    res.status(500).json({ success: false, exists: false, message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection('MyUser').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userData = userDoc.data();
    const transactions = userData.transactions || [];
    res.json({ success: true, transactions: transactions, count: transactions.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= المدفوعات =============
const getDueBills = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, bills: (user.bills || []).filter(b => b.status === 'pending') });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const payBill = async (req, res) => {
  try {
    const { billNumber, amount, fees, fromAccountId, serviceType, provider, description } = req.body;
    const uid = req.user.uid;
    
    if (!fromAccountId || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const feesAmount = fees || Math.max(5, amount * 0.01);
    const totalAmount = amount + feesAmount;
    
    const user = await getUserData(uid);
    let accounts = user.accounts || [];
    let transactions = user.transactions || [];
    
    const accountIndex = accounts.findIndex(acc => acc.id === fromAccountId);
    if (accountIndex === -1) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    if (accounts[accountIndex].balance < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    accounts[accountIndex].balance -= totalAmount;
    
    const newTransaction = {
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      description: description || `دفع فاتورة ${provider || serviceType || 'خدمة'} - رقم ${billNumber || ''}`,
      amount: -totalAmount,
      category: 'bill',
      icon: 'file-invoice-dollar',
      status: 'completed',
      billNumber: billNumber,
      provider: provider || serviceType,
      date: new Date().toISOString()
    };
    
    transactions = [newTransaction, ...transactions];
    if (transactions.length > 100) transactions = transactions.slice(0, 100);
    
    await updateUserData(uid, { accounts, transactions });
    res.json({ success: true, message: 'Payment completed successfully', transaction: newTransaction });
  } catch (error) {
    console.error('payBill Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const instantPayment = async (req, res) => {
  try {
    const { provider, phoneNumber, amount, fromAccountId } = req.body;
    const user = await getUserData(req.user.uid);
    const fees = Math.max(1, amount * 0.01);
    const totalAmount = amount + fees;
    
    const fromAccount = user.accounts.find(acc => acc.id === fromAccountId);
    if (!fromAccount || fromAccount.balance < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    const accounts = user.accounts.map(acc => acc.id === fromAccountId ? { ...acc, balance: acc.balance - totalAmount } : acc);
    await updateUserData(req.user.uid, { accounts });
    await addTransaction(req.user.uid, { description: `دفع فوري إلى ${provider}`, amount: -totalAmount, category: 'instant-payment', icon: 'mobile-alt', date: new Date().toISOString() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    const payments = (user.transactions || []).filter(t => t.category === 'bill' || t.category === 'instant-payment');
    res.json({ success: true, payments: payments.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= المحفظة =============
// ============= المحفظة =============
const getWallet = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, wallet: { balance: user.walletBalance || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rechargeWallet = async (req, res) => {
  try {
    const { amount, fromAccountId } = req.body;
    const user = await getUserData(req.user.uid);
    
    const fromAccount = user.accounts.find(acc => acc.id === fromAccountId);
    if (!fromAccount || fromAccount.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    const accounts = user.accounts.map(acc => 
      acc.id === fromAccountId ? { ...acc, balance: acc.balance - amount } : acc
    );
    const newWalletBalance = (user.walletBalance || 0) + amount;
    
    // إضافة معاملة للمحفظة
    const walletTransactions = user.walletTransactions || [];
    walletTransactions.unshift({
      id: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      type: 'recharge',
      amount: amount,
      description: `شحن المحفظة بمبلغ ${amount.toLocaleString()} ج.م`,
      date: new Date().toISOString()
    });
    
    await updateUserData(req.user.uid, { 
      accounts, 
      walletBalance: newWalletBalance,
      walletTransactions: walletTransactions.slice(0, 50)
    });
    
    // إضافة إشعار
    await addNotification(req.user.uid, {
      title: 'تم شحن المحفظة',
      message: `تم شحن محفظتك بمبلغ ${amount.toLocaleString()} ج.م بنجاح`,
      type: 'success',
      icon: 'coins'
    });
    
    res.json({ success: true, newBalance: newWalletBalance });
  } catch (error) {
    console.error('Recharge wallet error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendWalletMoney = async (req, res) => {
  try {
    const { toPhone, amount, message } = req.body;
    const user = await getUserData(req.user.uid);
    
    const fees = Math.max(1, Math.ceil(amount * 0.01));
    const totalAmount = amount + fees;
    
    if ((user.walletBalance || 0) < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }
    
    const newWalletBalance = (user.walletBalance || 0) - totalAmount;
    
    // إضافة معاملة للمحفظة
    const walletTransactions = user.walletTransactions || [];
    walletTransactions.unshift({
      id: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      type: 'send',
      amount: -totalAmount,
      toPhone: toPhone,
      description: message || `إرسال إلى ${toPhone}`,
      date: new Date().toISOString()
    });
    
    await updateUserData(req.user.uid, { 
      walletBalance: newWalletBalance,
      walletTransactions: walletTransactions.slice(0, 50)
    });
    
    res.json({ success: true, newBalance: newWalletBalance });
  } catch (error) {
    console.error('Send wallet money error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const withdrawFromWallet = async (req, res) => {
  try {
    const { amount, toAccountId } = req.body;
    const user = await getUserData(req.user.uid);
    
    if ((user.walletBalance || 0) < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }
    
    const accounts = user.accounts.map(acc => 
      acc.id === toAccountId ? { ...acc, balance: (acc.balance || 0) + amount } : acc
    );
    const newWalletBalance = (user.walletBalance || 0) - amount;
    
    // إضافة معاملة للمحفظة
    const walletTransactions = user.walletTransactions || [];
    walletTransactions.unshift({
      id: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      type: 'withdraw',
      amount: -amount,
      toAccountId: toAccountId,
      description: `سحب من المحفظة بمبلغ ${amount.toLocaleString()} ج.م`,
      date: new Date().toISOString()
    });
    
    await updateUserData(req.user.uid, { 
      accounts,
      walletBalance: newWalletBalance,
      walletTransactions: walletTransactions.slice(0, 50)
    });
    
    res.json({ success: true, newBalance: newWalletBalance });
  } catch (error) {
    console.error('Withdraw from wallet error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWalletTransactions = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, transactions: user.walletTransactions || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWalletContacts = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, contacts: user.walletContacts || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addWalletContact = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await getUserData(req.user.uid);
    
    const newContact = {
      id: `contact_${Date.now()}`,
      name,
      phone,
      createdAt: new Date().toISOString()
    };
    
    const contacts = [...(user.walletContacts || []), newContact];
    await updateUserData(req.user.uid, { walletContacts: contacts });
    res.json({ success: true, contact: newContact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= القروض =============
const getLoans = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    // التأكد من إرجاع مصفوفة loans حتى لو كانت فارغة
    res.json({ success: true, loans: user.loans || [] });
  } catch (error) {
    console.error('❌ Error in getLoans:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const applyForLoan = async (req, res) => {
  try {
    // ✅ تأكد من استخراج جميع المتغيرات بشكل صحيح
    const { type, amount, term, monthlyIncome, fromAccountId, salarySlipImage } = req.body;
    const uid = req.user.uid;

    console.log('📝 Loan application received:', { type, amount, term, monthlyIncome, fromAccountId, hasImage: !!salarySlipImage });

    // 1. التحقق من البيانات
    if (!salarySlipImage) {
      return res.status(400).json({ success: false, message: 'صورة إيصال الراتب مطلوبة' });
    }
    if (!type || !amount || amount <= 0 || !term || term <= 0 || !monthlyIncome) {
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    }

    // 2. حساب القسط والفائدة (✅ استخدم المتغير type)
    let interestRate = 8.5;
    if (type === 'car') interestRate = 6.5;
    if (type === 'mortgage') interestRate = 5.5;
    
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
    
    if (monthlyPayment > monthlyIncome * 0.4) {
      return res.status(400).json({ success: false, message: `القسط (${Math.round(monthlyPayment).toLocaleString()} ج.م) يتجاوز 40% من دخلك` });
    }

    // 3. جلب بيانات المستخدم
    const userRef = db.collection('MyUser').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }
    const userData = userDoc.data();

    // 4. إنشاء كائن القرض
    const newLoan = {
      id: `loan_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      type: type,  // ✅ استخدم المتغير type
      amount: parseFloat(amount),
      term: term,
      monthlyIncome: parseFloat(monthlyIncome),
      interestRate: interestRate,
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(monthlyPayment * term - amount),
      totalPayment: Math.round(monthlyPayment * term),
      remaining: parseFloat(amount),
      paidPercentage: 0,
      status: 'pending',
      fromAccountId: fromAccountId,
      salarySlipImage: salarySlipImage,
      appliedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: null
    };

    // 5. حفظ القرض
    const updatedLoans = [newLoan, ...(userData.loans || [])];
    await userRef.update({ loans: updatedLoans });

    // 6. إضافة إشعار للمستخدم
    try {
      const userNotifs = userData.notifications || [];
      userNotifs.unshift({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2,6)}`,
        title: '📋 تم تقديم طلب القرض',
        message: `طلب القرض ${type === 'personal' ? 'الشخصي' : type === 'car' ? 'السيارة' : 'العقاري'} بمبلغ ${amount.toLocaleString()} ج.م قيد المراجعة.`,
        type: 'info',
        icon: 'clock',
        read: false,
        time: new Date().toISOString()
      });
      await userRef.update({ notifications: userNotifs.slice(0, 50) });
    } catch (notifError) {
      console.error('❌ Failed to add user notification:', notifError);
    }

    // 7. إشعار المشرفين
    try {
      const adminsSnapshot = await db.collection('MyUser').where('role', '==', 'admin').get();
      for (const adminDoc of adminsSnapshot.docs) {
        try {
          const adminData = adminDoc.data();
          const adminNotifs = adminData.notifications || [];
          adminNotifs.unshift({
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2,6)}`,
            title: '📋 طلب قرض جديد',
            message: `المستخدم ${userData.fullName} قدم طلب قرض ${type === 'personal' ? 'شخصي' : type === 'car' ? 'سيارة' : 'عقاري'} بمبلغ ${amount.toLocaleString()} ج.م`,
            type: 'warning',
            icon: 'hand-holding-usd',
            read: false,
            time: new Date().toISOString(),
            actionType: 'loan_request',
            loanId: newLoan.id
          });
          await adminDoc.ref.update({ notifications: adminNotifs.slice(0, 50) });
        } catch (adminNotifError) {
          console.error(`❌ Failed to notify admin ${adminDoc.id}:`, adminNotifError);
        }
      }
    } catch (adminError) {
      console.error('❌ Failed to fetch admin users:', adminError);
    }

    console.log('✅ Loan application saved successfully');
    res.json({ success: true, message: 'تم تقديم طلب القرض بنجاح', loan: newLoan });
    
  } catch (error) {
    console.error('❌ applyForLoan critical error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const payLoanInstallment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { fromAccountId } = req.body;
    const uid = req.user.uid;
    
    // جلب بيانات المستخدم
    const user = await getUserData(uid);
    
    // البحث عن القرض
    const loan = user.loans?.find(l => l.id === loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'القرض غير موجود' });
    }
    
    // البحث عن الحساب
    const fromAccount = user.accounts?.find(acc => acc.id === fromAccountId);
    if (!fromAccount) {
      return res.status(404).json({ success: false, message: 'الحساب غير موجود' });
    }
    
    // التحقق من الرصيد
    if (fromAccount.balance < loan.monthlyPayment) {
      return res.status(400).json({ success: false, message: 'الرصيد غير كافٍ لدفع القسط' });
    }
    
    // تحديث رصيد الحساب
    const updatedAccounts = user.accounts.map(acc => 
      acc.id === fromAccountId ? { ...acc, balance: acc.balance - loan.monthlyPayment } : acc
    );
    
    // حساب المبلغ المتبقي الجديد ونسبة السداد
    const newRemaining = Math.max(0, loan.remaining - loan.monthlyPayment);
    const paidPercentage = ((loan.amount - newRemaining) / loan.amount) * 100;
    
    // تحديث بيانات القرض
    const updatedLoans = user.loans.map(l => 
      l.id === loanId ? { 
        ...l, 
        remaining: newRemaining, 
        paidPercentage: paidPercentage,
        lastPaymentDate: new Date().toISOString()
      } : l
    );
    
    // حفظ التغييرات في Firebase
    await updateUserData(uid, { 
      accounts: updatedAccounts,
      loans: updatedLoans 
    });
    
    // إضافة سجل للمعاملة
    await addTransaction(uid, {
      description: `دفع قسط قرض ${loan.type === 'personal' ? 'شخصي' : loan.type === 'car' ? 'سيارة' : 'عقاري'}`,
      amount: -loan.monthlyPayment,
      category: 'loan',
      icon: 'hand-holding-usd',
      date: new Date().toISOString()
    });
    
    // إضافة إشعار
    await addNotification(uid, {
      title: '💰 تم دفع قسط القرض',
      message: `تم دفع قسط بقيمة ${loan.monthlyPayment.toLocaleString()} ج.م بنجاح. المتبقي: ${newRemaining.toLocaleString()} ج.م`,
      type: 'success',
      icon: 'check-circle'
    });
    
    res.json({ success: true, message: 'تم دفع القسط بنجاح', remaining: newRemaining });
    
  } catch (error) {
    console.error('❌ Error in payLoanInstallment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ============= حساب الاستثمار =============
const getInvestmentAccount = async (req, res) => {
  try {
    const uid = req.user.uid;
    const user = await getUserData(uid);
    const investmentAccount = user.accounts?.find(acc => acc.type === 'investment');
    
    if (!investmentAccount) {
      const newAccount = {
        id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        name: 'حساب الاستثمار',
        number: await generateUniqueAccountNumber(),
        balance: 0,
        type: 'investment',
        currency: 'EGP',
        icon: 'chart-line',
        status: 'active',
        hasCard: false,
        cardId: null,
        createdAt: new Date().toISOString()
      };
      const accounts = [...(user.accounts || []), newAccount];
      await updateUserData(uid, { accounts });
      return res.json({ success: true, account: newAccount, created: true });
    }
    res.json({ success: true, account: investmentAccount });
  } catch (error) {
    console.error('getInvestmentAccount Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const transferToInvestmentAccount = async (req, res) => {
  try {
    const { amount, fromAccountId } = req.body;
    const uid = req.user.uid;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'المبلغ غير صحيح' });
    }
    
    const user = await getUserData(uid);
    const fromAccount = user.accounts?.find(acc => acc.id === fromAccountId);
    if (!fromAccount) {
      return res.status(404).json({ success: false, message: 'الحساب المصدر غير موجود' });
    }
    if (fromAccount.balance < amount) {
      return res.status(400).json({ success: false, message: 'الرصيد غير كافٍ' });
    }
    
    let investmentAccount = user.accounts?.find(acc => acc.type === 'investment');
    if (!investmentAccount) {
      const newAccount = {
        id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        name: 'حساب الاستثمار',
        number: await generateUniqueAccountNumber(),
        balance: 0,
        type: 'investment',
        currency: 'EGP',
        icon: 'chart-line',
        status: 'active',
        hasCard: false,
        cardId: null,
        createdAt: new Date().toISOString()
      };
      investmentAccount = newAccount;
      user.accounts.push(newAccount);
    }
    
    let accounts = [...user.accounts];
    const fromIndex = accounts.findIndex(acc => acc.id === fromAccountId);
    const toIndex = accounts.findIndex(acc => acc.id === investmentAccount.id);
    
    accounts[fromIndex].balance -= amount;
    accounts[toIndex].balance += amount;
    
    await updateUserData(uid, { accounts });
    await addTransaction(uid, {
      description: `تحويل إلى حساب الاستثمار بمبلغ ${amount.toLocaleString()} ج.م`,
      amount: -amount,
      category: 'transfer-investment',
      icon: 'chart-line',
      date: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'تم التحويل إلى حساب الاستثمار بنجاح' });
  } catch (error) {
    console.error('transferToInvestmentAccount Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const withdrawFromInvestmentAccount = async (req, res) => {
  try {
    const { amount, toAccountId } = req.body;
    const uid = req.user.uid;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'المبلغ غير صحيح' });
    }
    
    const user = await getUserData(uid);
    const investmentAccount = user.accounts?.find(acc => acc.type === 'investment');
    if (!investmentAccount) {
      return res.status(404).json({ success: false, message: 'لا يوجد حساب استثماري' });
    }
    if (investmentAccount.balance < amount) {
      return res.status(400).json({ success: false, message: 'الرصيد غير كافٍ في حساب الاستثمار' });
    }
    
    const toAccount = user.accounts?.find(acc => acc.id === toAccountId);
    if (!toAccount) {
      return res.status(404).json({ success: false, message: 'الحساب الوجهة غير موجود' });
    }
    
    let accounts = [...user.accounts];
    const fromIndex = accounts.findIndex(acc => acc.id === investmentAccount.id);
    const toIndex = accounts.findIndex(acc => acc.id === toAccountId);
    
    accounts[fromIndex].balance -= amount;
    accounts[toIndex].balance += amount;
    
    await updateUserData(uid, { accounts });
    await addTransaction(uid, {
      description: `سحب من حساب الاستثمار بمبلغ ${amount.toLocaleString()} ج.م`,
      amount: +amount,
      category: 'withdraw-investment',
      icon: 'money-bill-wave',
      date: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'تم السحب من حساب الاستثمار بنجاح' });
  } catch (error) {
    console.error('withdrawFromInvestmentAccount Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= الاستثمارات =============
const getInvestments = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, investments: user.investments || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInvestmentOpportunities = async (req, res) => {
  try {
    const opportunities = [
      { id: 'opp1', name: 'صندوق الأسهم المصرية', expectedReturn: '+12%', risk: 'متوسطة', minInvestment: 1000, icon: 'chart-line' },
      { id: 'opp2', name: 'صندوق الذهب الآمن', expectedReturn: '+8%', risk: 'منخفضة', minInvestment: 500, icon: 'gem' },
      { id: 'opp3', name: 'صندوق العقارات', expectedReturn: '+15%', risk: 'عالية', minInvestment: 5000, icon: 'building' },
      { id: 'opp4', name: 'شهادة استثمار ممتازة', expectedReturn: '+8.5%', risk: 'منخفضة', minInvestment: 500, icon: 'certificate' },
      { id: 'opp5', name: 'صندوق السندات الحكومية', expectedReturn: '+6%', risk: 'منخفضة', minInvestment: 500, icon: 'file-contract' }
    ];
    res.json({ success: true, opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createInvestment = async (req, res) => {
  try {
    const { type, amount } = req.body;
    const uid = req.user.uid;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'المبلغ غير صحيح' });
    }
    
    const user = await getUserData(uid);
    let investmentAccount = user.accounts?.find(acc => acc.type === 'investment');
    
    if (!investmentAccount) {
      return res.status(404).json({ success: false, message: 'لا يوجد حساب استثماري' });
    }
    if (investmentAccount.balance < amount) {
      return res.status(400).json({ success: false, message: `الرصيد غير كافٍ في حساب الاستثمار. المتاح: ${investmentAccount.balance.toLocaleString()} ج.م` });
    }
    
    let accounts = [...user.accounts];
    const accountIndex = accounts.findIndex(acc => acc.id === investmentAccount.id);
    accounts[accountIndex].balance -= amount;
    
    const investmentNames = {
      stocks: { name: 'صندوق الأسهم المصرية', icon: 'chart-line', expectedReturn: 12 },
      bonds: { name: 'صندوق السندات الحكومية', icon: 'file-contract', expectedReturn: 6 },
      gold: { name: 'صندوق الذهب', icon: 'gem', expectedReturn: 10 },
      realEstate: { name: 'صندوق العقارات', icon: 'building', expectedReturn: 15 },
      certificates: { name: 'شهادة استثمار', icon: 'certificate', expectedReturn: 8.5 }
    };
    
    const invInfo = investmentNames[type] || investmentNames.stocks;
    
    const newInvestment = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      name: invInfo.name,
      amount: amount,
      type: type,
      change: 0,
      icon: invInfo.icon,
      expectedReturn: invInfo.expectedReturn,
      createdAt: new Date().toISOString()
    };
    
    const investments = [...(user.investments || []), newInvestment];
    await updateUserData(uid, { accounts, investments });
    
    await addTransaction(uid, {
      description: `استثمار جديد: ${invInfo.name} بمبلغ ${amount.toLocaleString()} ج.م`,
      amount: -amount,
      category: 'investment-new',
      icon: 'chart-line',
      date: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'تم إنشاء الاستثمار بنجاح', investment: newInvestment });
  } catch (error) {
    console.error('createInvestment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToInvestment = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const { amount } = req.body;
    const uid = req.user.uid;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'المبلغ غير صحيح' });
    }
    
    const user = await getUserData(uid);
    const investmentAccount = user.accounts?.find(acc => acc.type === 'investment');
    if (!investmentAccount) {
      return res.status(404).json({ success: false, message: 'لا يوجد حساب استثماري' });
    }
    if (investmentAccount.balance < amount) {
      return res.status(400).json({ success: false, message: 'الرصيد غير كافٍ في حساب الاستثمار' });
    }
    
    const investment = user.investments?.find(inv => inv.id === investmentId);
    if (!investment) {
      return res.status(404).json({ success: false, message: 'الاستثمار غير موجود' });
    }
    
    let accounts = [...user.accounts];
    const accountIndex = accounts.findIndex(acc => acc.id === investmentAccount.id);
    accounts[accountIndex].balance -= amount;
    
    const newAmount = investment.amount + amount;
    const newChange = ((investment.amount * (1 + (investment.change || 0) / 100) + amount) / newAmount - 1) * 100;
    
    const investments = user.investments.map(inv => 
      inv.id === investmentId ? { ...inv, amount: newAmount, change: newChange } : inv
    );
    
    await updateUserData(uid, { accounts, investments });
    await addTransaction(uid, {
      description: `إضافة مبلغ ${amount.toLocaleString()} ج.م إلى استثمار ${investment.name}`,
      amount: -amount,
      category: 'investment-add',
      icon: 'chart-line',
      date: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'تمت إضافة المبلغ بنجاح' });
  } catch (error) {
    console.error('addToInvestment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const sellInvestment = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const { amount } = req.body;
    const uid = req.user.uid;
    
    const user = await getUserData(uid);
    const investment = user.investments?.find(inv => inv.id === investmentId);
    if (!investment) {
      return res.status(404).json({ success: false, message: 'الاستثمار غير موجود' });
    }
    
    const sellAmount = amount || investment.amount;
    if (sellAmount > investment.amount) {
      return res.status(400).json({ success: false, message: 'المبلغ المطلوب بيعه أكبر من قيمة الاستثمار' });
    }
    
    let investmentAccount = user.accounts?.find(acc => acc.type === 'investment');
    if (!investmentAccount) {
      return res.status(404).json({ success: false, message: 'لا يوجد حساب استثماري' });
    }
    
    const currentValue = investment.amount * (1 + (investment.change || 0) / 100);
    const sellValue = (currentValue / investment.amount) * sellAmount;
    
    let accounts = [...user.accounts];
    const accountIndex = accounts.findIndex(acc => acc.id === investmentAccount.id);
    accounts[accountIndex].balance += sellValue;
    
    let investments = [...user.investments];
    if (sellAmount >= investment.amount) {
      investments = investments.filter(inv => inv.id !== investmentId);
    } else {
      const newAmount = investment.amount - sellAmount;
      const newChange = (currentValue - sellValue - newAmount) / newAmount * 100;
      const index = investments.findIndex(inv => inv.id === investmentId);
      investments[index] = { ...investment, amount: newAmount, change: newChange };
    }
    
    await updateUserData(uid, { accounts, investments });
    await addTransaction(uid, {
      description: `بيع استثمار: ${investment.name} بقيمة ${sellValue.toLocaleString()} ج.م`,
      amount: +sellValue,
      category: 'investment-sell',
      icon: 'money-bill-wave',
      date: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'تم بيع الاستثمار بنجاح' });
  } catch (error) {
    console.error('sellInvestment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const investInOpportunity = async (req, res) => {
  try {
    const { opportunityId, amount } = req.body;
    const uid = req.user.uid;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'المبلغ غير صحيح' });
    }
    
    const user = await getUserData(uid);
    const investmentAccount = user.accounts?.find(acc => acc.type === 'investment');
    if (!investmentAccount) {
      return res.status(404).json({ success: false, message: 'لا يوجد حساب استثماري' });
    }
    if (investmentAccount.balance < amount) {
      return res.status(400).json({ success: false, message: 'الرصيد غير كافٍ في حساب الاستثمار' });
    }
    
    const opportunities = {
      opp1: { name: 'صندوق الأسهم المصرية', type: 'stocks', expectedReturn: 12, icon: 'chart-line' },
      opp2: { name: 'صندوق الذهب الآمن', type: 'gold', expectedReturn: 8, icon: 'gem' },
      opp3: { name: 'صندوق العقارات', type: 'realEstate', expectedReturn: 15, icon: 'building' },
      opp4: { name: 'شهادة استثمار ممتازة', type: 'certificates', expectedReturn: 8.5, icon: 'certificate' },
      opp5: { name: 'صندوق السندات الحكومية', type: 'bonds', expectedReturn: 6, icon: 'file-contract' }
    };
    
    const opp = opportunities[opportunityId] || opportunities.opp1;
    
    let accounts = [...user.accounts];
    const accountIndex = accounts.findIndex(acc => acc.id === investmentAccount.id);
    accounts[accountIndex].balance -= amount;
    
    const newInvestment = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      name: opp.name,
      amount: amount,
      type: opp.type,
      change: 0,
      icon: opp.icon,
      expectedReturn: opp.expectedReturn,
      createdAt: new Date().toISOString()
    };
    
    const investments = [...(user.investments || []), newInvestment];
    await updateUserData(uid, { accounts, investments });
    
    await addTransaction(uid, {
      description: `استثمار جديد: ${opp.name} بمبلغ ${amount.toLocaleString()} ج.م`,
      amount: -amount,
      category: 'investment-new',
      icon: 'chart-line',
      date: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'تم إنشاء الاستثمار بنجاح', investment: newInvestment });
  } catch (error) {
    console.error('investInOpportunity Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInvestmentDetails = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const uid = req.user.uid;
    const user = await getUserData(uid);
    const investment = user.investments?.find(inv => inv.id === investmentId);
    
    if (!investment) {
      return res.status(404).json({ success: false, message: 'الاستثمار غير موجود' });
    }
    
    const currentValue = investment.amount * (1 + (investment.change || 0) / 100);
    const profit = currentValue - investment.amount;
    const profitPercentage = (profit / investment.amount) * 100;
    
    res.json({
      success: true,
      investment: {
        ...investment,
        currentValue: currentValue,
        profit: profit,
        profitPercentage: profitPercentage,
        profitFormatted: profit.toLocaleString()
      }
    });
  } catch (error) {
    console.error('getInvestmentDetails Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= الخدمات الحكومية =============
// ============= الخدمات الحكومية =============
// إذا كانت هذه الدوال موجودة بالفعل، قم بتعديلها، وإلا أضفها

const payGovernmentService = async (req, res) => {
  try {
    const { serviceType, serviceNumber, amount, fromAccountId } = req.body;
    const uid = req.user.uid;
    
    if (!serviceType || !serviceNumber || !amount || !fromAccountId) {
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    }
    
    const user = await getUserData(uid);
    const fees = Math.max(5, Math.ceil(amount * 0.01));
    const totalAmount = amount + fees;
    
    // التحقق من الحساب والرصيد
    const fromAccount = user.accounts.find(acc => acc.id === fromAccountId);
    if (!fromAccount) {
      return res.status(404).json({ success: false, message: 'الحساب غير موجود' });
    }
    if (fromAccount.balance < totalAmount) {
      return res.status(400).json({ success: false, message: 'الرصيد غير كافٍ' });
    }
    
    // تحديث رصيد الحساب
    const accounts = user.accounts.map(acc => 
      acc.id === fromAccountId ? { ...acc, balance: acc.balance - totalAmount } : acc
    );
    
    // إضافة المعاملة إلى سجل المعاملات
    await addTransaction(uid, {
      description: `دفع ${getServiceName(serviceType)} - رقم ${serviceNumber}`,
      amount: -totalAmount,
      category: 'government',
      icon: 'landmark',
      status: 'completed',
      date: new Date().toISOString()
    });
    
    // إضافة الخدمة إلى سجل الخدمات الحكومية
    const governmentServices = user.governmentServices || [];
    governmentServices.unshift({
      id: `gov_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      serviceType: serviceType,
      serviceName: getServiceName(serviceType),
      serviceNumber: serviceNumber,
      amount: totalAmount,
      fees: fees,
      serviceAmount: amount,
      status: 'completed',
      date: new Date().toISOString(),
      icon: getServiceIcon(serviceType)
    });
    
    await updateUserData(uid, { 
      accounts,
      governmentServices: governmentServices.slice(0, 50)
    });
    
    // إضافة إشعار
    await addNotification(uid, {
      title: 'تم دفع الخدمة الحكومية',
      message: `تم دفع ${getServiceName(serviceType)} بنجاح`,
      type: 'success',
      icon: 'check-circle'
    });
    
    res.json({ success: true, message: 'تم دفع الخدمة بنجاح' });
    
  } catch (error) {
    console.error('Pay government service error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGovernmentServiceHistory = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, history: user.governmentServices || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// دوال مساعدة - أضفها في نهاية الملف قبل التصدير
function getServiceName(serviceType) {
  const names = {
    electricity: 'كهرباء',
    water: 'مياه',
    internet: 'إنترنت',
    phone: 'هاتف',
    gas: 'غاز طبيعي',
    municipality: 'خدمات بلدية',
    tax: 'ضرائب',
    traffic: 'مخالفات مرورية',
    customs: 'جمارك'
  };
  return names[serviceType] || serviceType;
}

function getServiceIcon(serviceType) {
  const icons = {
    electricity: 'bolt',
    water: 'tint',
    internet: 'wifi',
    phone: 'phone',
    gas: 'fire',
    municipality: 'building',
    tax: 'file-invoice-dollar',
    traffic: 'car',
    customs: 'ship'
  };
  return icons[serviceType] || 'landmark';
}
// ============= الإشعارات =============
const getNotifications = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    res.json({ success: true, notifications: user.notifications || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserData(req.user.uid);
    const notifications = (user.notifications || []).map(n => n.id === id ? { ...n, read: true } : n);
    await updateUserData(req.user.uid, { notifications });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    const notifications = (user.notifications || []).map(n => ({ ...n, read: true }));
    await updateUserData(req.user.uid, { notifications });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= الإعدادات =============
// ============= الإعدادات =============
const getProfile = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    // إزالة كلمة المرور من البيانات المرسلة
    const { password, ...profile } = user;
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address, city, postalCode } = req.body;
    const uid = req.user.uid;
    
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    updateData.updatedAt = new Date().toISOString();
    
    await updateUserData(uid, updateData);
    
    // تحديث اسم المستخدم في Firebase Auth أيضاً
    if (fullName) {
      try {
        await admin.auth().updateUser(uid, { displayName: fullName });
      } catch (authError) {
        console.error('Failed to update auth displayName:', authError);
      }
    }
    
    res.json({ success: true, message: 'تم تحديث الملف الشخصي بنجاح' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const uid = req.user.uid;
    
    const user = await getUserData(uid);
    
    // التحقق من كلمة المرور الحالية
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' });
    }
    
    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // تحديث في Firestore
    await updateUserData(uid, { password: hashedPassword });
    
    // تحديث في Firebase Authentication
    try {
      await admin.auth().updateUser(uid, { password: newPassword });
    } catch (authError) {
      console.error('Failed to update auth password:', authError);
    }
    
    res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= دوال إضافية =============
const getUserStats = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    const transactions = user.transactions || [];
    
    const totalSpent = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalReceived = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const monthlySpending = transactions.filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && t.amount < 0;
    }).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    res.json({
      success: true,
      stats: {
        totalSpent,
        totalReceived,
        monthlySpending,
        transactionCount: transactions.length,
        accountCount: user.accounts?.length || 0,
        cardCount: user.cards?.length || 0,
        investmentCount: user.investments?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchTransactions = async (req, res) => {
  try {
    const { query, startDate, endDate, category } = req.query;
    const user = await getUserData(req.user.uid);
    let transactions = user.transactions || [];
    
    if (query) {
      const searchTerm = query.toLowerCase();
      transactions = transactions.filter(t => 
        t.description?.toLowerCase().includes(searchTerm) ||
        t.category?.toLowerCase().includes(searchTerm)
      );
    }
    if (startDate) {
      const start = new Date(startDate);
      transactions = transactions.filter(t => new Date(t.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      transactions = transactions.filter(t => new Date(t.date) <= end);
    }
    if (category && category !== 'all') {
      transactions = transactions.filter(t => t.category === category);
    }
    
    res.json({ success: true, transactions: transactions.slice(0, 50) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportTransactions = async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const user = await getUserData(req.user.uid);
    const transactions = user.transactions || [];
    
    if (format === 'csv') {
      const headers = ['التاريخ', 'الوصف', 'المبلغ', 'الفئة', 'الحالة'];
      const csvRows = [headers.join(',')];
      
      for (const t of transactions) {
        const row = [
          new Date(t.date).toLocaleDateString('ar-EG'),
          `"${t.description}"`,
          t.amount,
          t.category,
          t.status
        ].join(',');
        csvRows.push(row);
      }
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      return res.send(csvRows.join('\n'));
    }
    
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFinancialReport = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const user = await getUserData(req.user.uid);
    const transactions = user.transactions || [];
    
    const now = new Date();
    let startDate;
    switch (period) {
      case 'week': startDate = new Date(now.setDate(now.getDate() - 7)); break;
      case 'month': startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
      case 'year': startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
      default: startDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    const filteredTransactions = transactions.filter(t => new Date(t.date) >= startDate);
    const income = filteredTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const byCategory = {};
    filteredTransactions.forEach(t => {
      const cat = t.category || 'other';
      if (!byCategory[cat]) byCategory[cat] = 0;
      byCategory[cat] += Math.abs(t.amount);
    });
    
    res.json({
      success: true,
      report: {
        period,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        income,
        expenses,
        netIncome: income - expenses,
        byCategory,
        transactionCount: filteredTransactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const validateAccountBeforeTransfer = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    const uid = req.user.uid;
    const user = await getUserData(uid);
    const fromAccount = user.accounts?.find(acc => acc.type === 'current');
    
    if (!fromAccount) {
      return res.json({ valid: false, message: 'لا يوجد حساب جاري للتحويل منه' });
    }
    if (fromAccount.balance < amount) {
      return res.json({ valid: false, message: `الرصيد غير كافٍ. المتاح: ${fromAccount.balance.toLocaleString()} ج.م` });
    }
    
    const targetUser = await findUserByAccountNumber(accountNumber);
    if (!targetUser) {
      return res.json({ valid: false, message: 'رقم الحساب غير موجود' });
    }
    
    res.json({
      valid: true,
      message: 'يمكن إتمام التحويل',
      fromAccount: { name: fromAccount.name, balance: fromAccount.balance },
      toAccount: { name: targetUser.account.name, holder: targetUser.user.fullName }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecentTransactions = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    const transactions = (user.transactions || []).slice(0, 5);
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications, transactionAlerts } = req.body;
    await updateUserData(req.user.uid, {
      notificationSettings: {
        emailNotifications,
        pushNotifications,
        transactionAlerts,
        updatedAt: new Date().toISOString()
      }
    });
    res.json({ success: true, message: 'تم تحديث إعدادات الإشعارات' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotificationSettings = async (req, res) => {
  try {
    const user = await getUserData(req.user.uid);
    const settings = user.notificationSettings || {
      emailNotifications: true,
      pushNotifications: true,
      transactionAlerts: true
    };
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const user = await getUserData(req.user.uid);
    const transactions = (user.transactions || []).filter(t => t.id !== transactionId);
    await updateUserData(req.user.uid, { transactions });
    res.json({ success: true, message: 'تم حذف المعاملة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { description, category } = req.body;
    const user = await getUserData(req.user.uid);
    const transactions = (user.transactions || []).map(t => 
      t.id === transactionId ? { ...t, description, category, updatedAt: new Date().toISOString() } : t
    );
    await updateUserData(req.user.uid, { transactions });
    res.json({ success: true, message: 'تم تحديث المعاملة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addTransactionAPI = async (req, res) => {
  try {
    const { description, amount, category, icon, status, billNumber, provider } = req.body;
    const uid = req.user.uid;
    
    const result = await addTransaction(uid, {
      description: description,
      amount: amount,
      category: category || 'bill',
      icon: icon || 'file-invoice-dollar',
      status: status || 'completed',
      billNumber: billNumber || null,
      provider: provider || null
    });
    
    if (result) {
      res.json({ success: true, message: 'Transaction saved successfully' });
    } else {
      throw new Error('Failed to save transaction');
    }
  } catch (error) {
    console.error('addTransactionAPI Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ============= إرسال إيميل الرفض =============
const sendRejectionEmail = async (req, res) => {
    try {
        const { email, userName, reason } = req.body;
        
        console.log('📧 sendRejectionEmail called:', { email, userName, reason });
        
        if (!email || !userName || !reason) {
            return res.status(400).json({ success: false, message: 'بيانات غير مكتملة' });
        }
        
        const nodemailer = require('nodemailer');
        
        // إعدادات الإيميل
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'moustafaahmed870@gmail.com',
                pass: 'zxnz yuju gebp eydr'
            }
        });
        
        const mailOptions = {
            from: '"MSB Bank" <moustafaahmed870@gmail.com>',
            to: email,
            subject: '❌ تحديث حالة طلب فتح الحساب - MSB Bank',
            html: `
                <div style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #0ef;">MSB Bank</h2>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #0a2438 0%, #081b29 100%); border-radius: 15px; padding: 25px; border: 1px solid rgba(0, 238, 255, 0.3);">
                        <h3 style="color: #ef4444; margin-bottom: 20px;">
                            ❌ عذراً، تم رفض طلب فتح الحساب
                        </h3>
                        
                        <p style="color: #a0d2db; line-height: 1.6;">
                            عزيزي/عزيزتي <strong style="color: #0ef;">${userName}</strong>،
                        </p>
                        
                        <p style="color: #a0d2db; line-height: 1.6; margin-top: 15px;">
                            بعد مراجعة طلب فتح الحساب الخاص بك، نأسف لإبلاغك بأنه لم يتم الموافقة عليه.
                        </p>
                        
                        <div style="background: rgba(239, 68, 68, 0.1); border-right: 3px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 8px;">
                            <p style="color: #a0d2db; margin: 0; line-height: 1.6;">
                                <strong style="color: #ef4444;">⚠️ سبب الرفض:</strong><br>
                                ${reason}
                            </p>
                        </div>
                        
                        <p style="color: #a0d2db; line-height: 1.6; margin-top: 15px;">
                            يمكنك إعادة التقديم مرة أخرى بعد استيفاء الشروط المطلوبة.
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
        
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        
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
        
        console.log('📧 sendApprovalEmail called:', { email, userName });
        
        if (!email || !userName) {
            return res.status(400).json({ success: false, message: 'بيانات غير مكتملة' });
        }
        
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'moustafaahmed870@gmail.com',
                pass: 'zxnz yuju gebp eydr'
            }
        });
        
        const mailOptions = {
            from: '"MSB Bank" <moustafaahmed870@gmail.com>',
            to: email,
            subject: '✅ تم قبول طلب فتح الحساب - MSB Bank',
            html: `
                <div style="font-family: 'Cairo', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #0ef;">MSB Bank</h2>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #0a2438 0%, #081b29 100%); border-radius: 15px; padding: 25px; border: 1px solid rgba(0, 238, 255, 0.3);">
                        <h3 style="color: #10b981; margin-bottom: 20px;">
                            ✅ تم قبول طلب فتح الحساب
                        </h3>
                        
                        <p style="color: #a0d2db; line-height: 1.6;">
                            عزيزي/عزيزتي <strong style="color: #0ef;">${userName}</strong>،
                        </p>
                        
                        <p style="color: #a0d2db; line-height: 1.6; margin-top: 15px;">
                            يسرنا إبلاغك أنه تم قبول طلب فتح الحساب الخاص بك بنجاح.
                        </p>
                        
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
        
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        
        res.json({ success: true, message: 'تم إرسال إيميل القبول بنجاح' });
        
    } catch (error) {
        console.error('❌ Send approval email error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// ============= القروض - دوال المشرف =============

// الموافقة على القرض (للمشرف)
const approveLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const adminUid = req.user.uid;

    // البحث عن القرض في جميع المستخدمين
    const usersSnapshot = await db.collection('MyUser').get();
    let foundLoan, foundUserUid, foundUserData;
    for (const doc of usersSnapshot.docs) {
      const data = doc.data();
      const loan = (data.loans || []).find(l => l.id === loanId);
      if (loan) {
        foundLoan = loan;
        foundUserUid = doc.id;
        foundUserData = data;
        break;
      }
    }
    if (!foundLoan) return res.status(404).json({ success: false, message: 'القرض غير موجود' });

    // تحديث حالة القرض
    const updatedLoans = foundUserData.loans.map(l => 
      l.id === loanId ? { ...l, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: adminUid } : l
    );
    await db.collection('MyUser').doc(foundUserUid).update({ loans: updatedLoans });

    // إشعار المستخدم
    await addNotification(foundUserUid, {
      title: '✅ تمت الموافقة على طلب القرض',
      message: `تهانينا! تمت الموافقة على طلب القرض ${foundLoan.type === 'personal' ? 'الشخصي' : foundLoan.type === 'car' ? 'السيارة' : 'العقاري'}.`,
      type: 'success',
      icon: 'check-circle'
    });

    res.json({ success: true, message: 'تمت الموافقة على القرض' });
  } catch (error) {
    console.error('❌ approveLoan error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// رفض القرض (للمشرف)
const rejectLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { reason } = req.body;
    const adminUid = req.user.uid;

    const usersSnapshot = await db.collection('MyUser').get();
    let foundLoan, foundUserUid, foundUserData;
    for (const doc of usersSnapshot.docs) {
      const data = doc.data();
      const loan = (data.loans || []).find(l => l.id === loanId);
      if (loan) {
        foundLoan = loan;
        foundUserUid = doc.id;
        foundUserData = data;
        break;
      }
    }
    if (!foundLoan) return res.status(404).json({ success: false, message: 'القرض غير موجود' });

    const updatedLoans = foundUserData.loans.map(l => 
      l.id === loanId ? { ...l, status: 'rejected', adminNotes: reason || 'لم يحدد سبب الرفض', reviewedAt: new Date().toISOString(), reviewedBy: adminUid } : l
    );
    await db.collection('MyUser').doc(foundUserUid).update({ loans: updatedLoans });

    await addNotification(foundUserUid, {
      title: '❌ تم رفض طلب القرض',
      message: `نأسف، تم رفض طلب القرض. ${reason ? 'السبب: ' + reason : ''}`,
      type: 'error',
      icon: 'times-circle'
    });

    res.json({ success: true, message: 'تم رفض القرض' });
  } catch (error) {
    console.error('❌ rejectLoan error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// جلب طلبات القروض المعلقة (للمشرف)
const getPendingLoanRequests = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('MyUser').get();
    const pendingLoans = [];
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      for (const loan of (userData.loans || [])) {
        if (loan.status === 'pending') {
          pendingLoans.push({
            ...loan,
            userId: doc.id,
            userName: userData.fullName,
            userEmail: userData.email,
            userPhone: userData.phone,
            userNationalId: userData.nationalId
          });
        }
      }
    }
    pendingLoans.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    res.json({ success: true, loans: pendingLoans });
  } catch (error) {
    console.error('❌ getPendingLoanRequests error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ============= التحقق من وجود مستخدم برقم الهاتف (جديد) =============
const checkUserByPhone = async (req, res) => {
    try {
        const { phone } = req.body;
        
        console.log('🔍 Checking user by phone:', phone);
        
        if (!phone) {
            return res.status(400).json({ 
                success: false, 
                exists: false, 
                message: 'رقم الهاتف مطلوب' 
            });
        }
        
        const usersRef = db.collection('MyUser');
        const snapshot = await usersRef.where('phone', '==', phone).limit(1).get();
        
        if (snapshot.empty) {
            console.log('❌ No user found with phone:', phone);
            return res.json({ 
                success: true, 
                exists: false, 
                message: 'لا يوجد مستخدم بهذا الرقم' 
            });
        }
        
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        
        console.log('✅ User found:', userData.fullName);
        
        res.json({ 
            success: true, 
            exists: true, 
            userId: userDoc.id,
            userName: userData.fullName,
            phone: userData.phone,
            message: 'تم العثور على المستخدم'
        });
        
    } catch (error) {
        console.error('❌ Check user by phone error:', error);
        res.status(500).json({ 
            success: false, 
            exists: false, 
            message: error.message 
        });
    }
};

// ============= إرسال أموال إلى محفظة مستخدم آخر (جديد) =============
// ✅ تأكد أن الاسم مختلف أو احذف الدالة القديمة أولاً
const sendMoneyToWallet = async (req, res) => {
    try {
        const { toPhone, amount, message } = req.body;
        const fromUid = req.user.uid;
        
        console.log('💰 Sending to wallet:', { fromUid, toPhone, amount });
        
        if (!toPhone || !amount || amount <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'بيانات غير صحيحة' 
            });
        }
        
        const usersRef = db.collection('MyUser');
        const snapshot = await usersRef.where('phone', '==', toPhone).limit(1).get();
        
        if (snapshot.empty) {
            return res.status(404).json({ 
                success: false, 
                message: 'لا يوجد مستخدم بهذا الرقم' 
            });
        }
        
        const toUserDoc = snapshot.docs[0];
        const toUserData = toUserDoc.data();
        const toUid = toUserDoc.id;
        
        if (fromUid === toUid) {
            return res.status(400).json({ 
                success: false, 
                message: 'لا يمكن الإرسال إلى نفس المستخدم' 
            });
        }
        
        const fromUserDoc = await db.collection('MyUser').doc(fromUid).get();
        const fromUserData = fromUserDoc.data();
        
        const fees = Math.max(1, Math.ceil(amount * 0.01));
        const totalAmount = amount + fees;
        
        if ((fromUserData.walletBalance || 0) < totalAmount) {
            return res.status(400).json({ 
                success: false, 
                message: `رصيد المحفظة غير كافٍ. المتاح: ${(fromUserData.walletBalance || 0).toLocaleString()} ج.م` 
            });
        }
        
        const newSenderBalance = (fromUserData.walletBalance || 0) - totalAmount;
        const newReceiverBalance = (toUserData.walletBalance || 0) + amount;
        
        const senderTransaction = {
            id: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
            type: 'send',
            amount: -totalAmount,
            toPhone: toPhone,
            toName: toUserData.fullName,
            description: message || `إرسال إلى ${toUserData.fullName}`,
            date: new Date().toISOString()
        };
        
        const receiverTransaction = {
            id: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
            type: 'receive',
            amount: amount,
            fromPhone: fromUserData.phone,
            fromName: fromUserData.fullName,
            description: message || `استلام من ${fromUserData.fullName}`,
            date: new Date().toISOString()
        };
        
        await db.collection('MyUser').doc(fromUid).update({
            walletBalance: newSenderBalance,
            walletTransactions: [senderTransaction, ...(fromUserData.walletTransactions || [])].slice(0, 50)
        });
        
        await db.collection('MyUser').doc(toUid).update({
            walletBalance: newReceiverBalance,
            walletTransactions: [receiverTransaction, ...(toUserData.walletTransactions || [])].slice(0, 50)
        });
        
        console.log('✅ Transfer completed:', { amount, from: fromUserData.fullName, to: toUserData.fullName });
        
        res.json({ 
            success: true, 
            message: `تم إرسال ${amount.toLocaleString()} ج.م إلى ${toUserData.fullName}`,
            newBalance: newSenderBalance
        });
        
    } catch (error) {
        console.error('❌ Send to wallet error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============= تصدير جميع الدوال =============
module.exports = {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  getCards,
  createCard,
  getAllCardsWithAccounts,
  freezeCard,
  unfreezeCard,
  reportLostCard,
  payCardBill,
  internalTransfer,
  externalTransfer,
  getTransfers,
  getBeneficiaries,
  addBeneficiary,
  verifyAccountExists,
  getTransactions,
  getDueBills,
  payBill,
  instantPayment,
  getPaymentHistory,
  getWallet,
  rechargeWallet,
  sendWalletMoney,
  withdrawFromWallet,
  getWalletTransactions,
  getWalletContacts,
  addWalletContact,
  getLoans,
  applyForLoan,
  payLoanInstallment,
  getInvestmentAccount,
  transferToInvestmentAccount,
  withdrawFromInvestmentAccount,
  getInvestments,
  createInvestment,
  getInvestmentOpportunities,
  addToInvestment,
  sellInvestment,
  investInOpportunity,
  getInvestmentDetails,
  payGovernmentService,
  getGovernmentServiceHistory,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getProfile,
  updateProfile,
  changePassword,
  updateAccountBalance,
  getUserStats,
  searchTransactions,
  exportTransactions,
  getFinancialReport,
  validateAccountBeforeTransfer,
  getRecentTransactions,
  updateNotificationSettings,
  getNotificationSettings,
  deleteTransaction,
  updateTransaction,
  addTransactionAPI,
  sendRejectionEmail,
  sendApprovalEmail,
    applyForLoan,      
  approveLoan,
  rejectLoan,
  getPendingLoanRequests,
  deleteRejectedLoan,
  checkUserByPhone,
  sendMoneyToWallet,
};
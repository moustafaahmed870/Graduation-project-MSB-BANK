const { sendNotificationToUser, sendNotificationToAdmins } = require('./notification.controller');

// ============================================================
// ملف مركزي لكل إشعارات التطبيق
// استدعي الدوال دي من أي controller تاني
// ============================================================

// ============= التحويلات =============

const notifyTransferSent = async (uid, { amount, receiverName }) => {
  await sendNotificationToUser(uid, {
    titleAr: '💸 تم إرسال التحويل',
    titleEn: '💸 Transfer Sent',
    bodyAr: `تم تحويل ${amount.toLocaleString()} ج.م إلى ${receiverName} بنجاح`,
    bodyEn: `EGP ${amount.toLocaleString()} has been transferred to ${receiverName} successfully`,
    type: 'success',
    icon: 'paper-plane',
    data: { amount: String(amount), receiverName },
  });
};

const notifyTransferReceived = async (uid, { amount, senderName }) => {
  await sendNotificationToUser(uid, {
    titleAr: '📥 تم استلام تحويل',
    titleEn: '📥 Transfer Received',
    bodyAr: `استلمت ${amount.toLocaleString()} ج.م من ${senderName}`,
    bodyEn: `You received EGP ${amount.toLocaleString()} from ${senderName}`,
    type: 'success',
    icon: 'arrow-down',
    data: { amount: String(amount), senderName },
  });
};

// ============= الحسابات =============

const notifyAccountCreated = async (uid, { accountName, accountNumber }) => {
  await sendNotificationToUser(uid, {
    titleAr: '🏦 تم فتح حساب جديد',
    titleEn: '🏦 New Account Opened',
    bodyAr: `تم فتح ${accountName} برقم ${accountNumber} بنجاح`,
    bodyEn: `${accountName} has been opened with number ${accountNumber}`,
    type: 'success',
    icon: 'check-circle',
    data: { accountName, accountNumber },
  });
};

// ============= البطاقات =============

const notifyCardCreated = async (uid, { cardName }) => {
  await sendNotificationToUser(uid, {
    titleAr: '💳 تم إصدار بطاقة جديدة',
    titleEn: '💳 New Card Issued',
    bodyAr: `تم إصدار ${cardName} بنجاح`,
    bodyEn: `${cardName} has been issued successfully`,
    type: 'success',
    icon: 'credit-card',
    data: { cardName },
  });
};

const notifyCardFrozen = async (uid, { cardName }) => {
  await sendNotificationToUser(uid, {
    titleAr: '🔒 تم تجميد البطاقة',
    titleEn: '🔒 Card Frozen',
    bodyAr: `تم تجميد ${cardName}`,
    bodyEn: `${cardName} has been frozen`,
    type: 'warning',
    icon: 'lock',
    data: { cardName },
  });
};

const notifyCardUnfrozen = async (uid, { cardName }) => {
  await sendNotificationToUser(uid, {
    titleAr: '🔓 تم تفعيل البطاقة',
    titleEn: '🔓 Card Activated',
    bodyAr: `تم تفعيل ${cardName} بنجاح`,
    bodyEn: `${cardName} has been activated successfully`,
    type: 'success',
    icon: 'unlock',
    data: { cardName },
  });
};

// ============= الفواتير والمدفوعات =============

const notifyBillPaid = async (uid, { provider, amount }) => {
  await sendNotificationToUser(uid, {
    titleAr: '✅ تم دفع الفاتورة',
    titleEn: '✅ Bill Paid',
    bodyAr: `تم دفع فاتورة ${provider} بمبلغ ${amount.toLocaleString()} ج.م`,
    bodyEn: `${provider} bill of EGP ${amount.toLocaleString()} paid successfully`,
    type: 'success',
    icon: 'file-invoice-dollar',
    data: { provider, amount: String(amount) },
  });
};

const notifyGovernmentServicePaid = async (uid, { serviceName, amount }) => {
  await sendNotificationToUser(uid, {
    titleAr: '🏛️ تم دفع الخدمة الحكومية',
    titleEn: '🏛️ Government Service Paid',
    bodyAr: `تم دفع ${serviceName} بمبلغ ${amount.toLocaleString()} ج.م`,
    bodyEn: `${serviceName} of EGP ${amount.toLocaleString()} paid successfully`,
    type: 'success',
    icon: 'landmark',
    data: { serviceName, amount: String(amount) },
  });
};

// ============= المحفظة =============

const notifyWalletRecharged = async (uid, { amount }) => {
  await sendNotificationToUser(uid, {
    titleAr: '👛 تم شحن المحفظة',
    titleEn: '👛 Wallet Recharged',
    bodyAr: `تم شحن محفظتك بمبلغ ${amount.toLocaleString()} ج.م`,
    bodyEn: `Your wallet has been recharged with EGP ${amount.toLocaleString()}`,
    type: 'success',
    icon: 'coins',
    data: { amount: String(amount) },
  });
};

const notifyWalletMoneyReceived = async (uid, { amount, senderName }) => {
  await sendNotificationToUser(uid, {
    titleAr: '📲 استلمت أموال في المحفظة',
    titleEn: '📲 Wallet Money Received',
    bodyAr: `استلمت ${amount.toLocaleString()} ج.م من ${senderName} في محفظتك`,
    bodyEn: `You received EGP ${amount.toLocaleString()} from ${senderName} in your wallet`,
    type: 'success',
    icon: 'coins',
    data: { amount: String(amount), senderName },
  });
};

// ============= القروض =============

const notifyLoanApplied = async (uid, { loanType, amount }) => {
  const typeAr = loanType === 'personal' ? 'الشخصي' : loanType === 'car' ? 'السيارة' : 'العقاري';
  const typeEn = loanType === 'personal' ? 'Personal' : loanType === 'car' ? 'Car' : 'Mortgage';

  await sendNotificationToUser(uid, {
    titleAr: '📋 تم تقديم طلب القرض',
    titleEn: '📋 Loan Application Submitted',
    bodyAr: `طلب القرض ${typeAr} بمبلغ ${amount.toLocaleString()} ج.م قيد المراجعة`,
    bodyEn: `${typeEn} loan application of EGP ${amount.toLocaleString()} is under review`,
    type: 'info',
    icon: 'clock',
    data: { loanType, amount: String(amount) },
  });
};

const notifyLoanApproved = async (uid, { loanType, amount }) => {
  const typeAr = loanType === 'personal' ? 'الشخصي' : loanType === 'car' ? 'السيارة' : 'العقاري';
  const typeEn = loanType === 'personal' ? 'Personal' : loanType === 'car' ? 'Car' : 'Mortgage';

  await sendNotificationToUser(uid, {
    titleAr: '✅ تمت الموافقة على القرض',
    titleEn: '✅ Loan Approved',
    bodyAr: `تهانينا! تمت الموافقة على طلب القرض ${typeAr} بمبلغ ${amount.toLocaleString()} ج.م`,
    bodyEn: `Congratulations! Your ${typeEn} loan of EGP ${amount.toLocaleString()} has been approved`,
    type: 'success',
    icon: 'check-circle',
    data: { loanType, amount: String(amount) },
  });
};

const notifyLoanRejected = async (uid, { loanType, reason }) => {
  const typeAr = loanType === 'personal' ? 'الشخصي' : loanType === 'car' ? 'السيارة' : 'العقاري';
  const typeEn = loanType === 'personal' ? 'Personal' : loanType === 'car' ? 'Car' : 'Mortgage';

  await sendNotificationToUser(uid, {
    titleAr: '❌ تم رفض طلب القرض',
    titleEn: '❌ Loan Application Rejected',
    bodyAr: `نأسف، تم رفض طلب القرض ${typeAr}. ${reason ? 'السبب: ' + reason : ''}`,
    bodyEn: `Sorry, your ${typeEn} loan application was rejected. ${reason ? 'Reason: ' + reason : ''}`,
    type: 'error',
    icon: 'times-circle',
    data: { loanType, reason: reason || '' },
  });
};

const notifyLoanInstallmentPaid = async (uid, { amount, remaining }) => {
  await sendNotificationToUser(uid, {
    titleAr: '💰 تم دفع قسط القرض',
    titleEn: '💰 Loan Installment Paid',
    bodyAr: `تم دفع قسط بقيمة ${amount.toLocaleString()} ج.م. المتبقي: ${remaining.toLocaleString()} ج.م`,
    bodyEn: `Installment of EGP ${amount.toLocaleString()} paid. Remaining: EGP ${remaining.toLocaleString()}`,
    type: 'success',
    icon: 'check-circle',
    data: { amount: String(amount), remaining: String(remaining) },
  });
};

// ============= القروض - إشعار الأدمن =============

const notifyAdminsNewLoanRequest = async ({ userName, loanType, amount }) => {
  const typeAr = loanType === 'personal' ? 'شخصي' : loanType === 'car' ? 'سيارة' : 'عقاري';
  const typeEn = loanType === 'personal' ? 'Personal' : loanType === 'car' ? 'Car' : 'Mortgage';

  await sendNotificationToAdmins({
    titleAr: '📋 طلب قرض جديد',
    titleEn: '📋 New Loan Request',
    bodyAr: `${userName} قدم طلب قرض ${typeAr} بمبلغ ${amount.toLocaleString()} ج.م`,
    bodyEn: `${userName} submitted a ${typeEn} loan request of EGP ${amount.toLocaleString()}`,
    type: 'warning',
    icon: 'hand-holding-usd',
    data: { userName, loanType, amount: String(amount) },
  });
};

// ============= الاستثمارات =============

const notifyInvestmentCreated = async (uid, { investmentName, amount }) => {
  await sendNotificationToUser(uid, {
    titleAr: '📈 تم إنشاء استثمار جديد',
    titleEn: '📈 New Investment Created',
    bodyAr: `تم إنشاء استثمار ${investmentName} بمبلغ ${amount.toLocaleString()} ج.م`,
    bodyEn: `${investmentName} investment of EGP ${amount.toLocaleString()} created successfully`,
    type: 'success',
    icon: 'chart-line',
    data: { investmentName, amount: String(amount) },
  });
};

const notifyInvestmentSold = async (uid, { investmentName, amount }) => {
  await sendNotificationToUser(uid, {
    titleAr: '💵 تم بيع الاستثمار',
    titleEn: '💵 Investment Sold',
    bodyAr: `تم بيع استثمار ${investmentName} بقيمة ${amount.toLocaleString()} ج.م`,
    bodyEn: `${investmentName} investment sold for EGP ${amount.toLocaleString()}`,
    type: 'success',
    icon: 'money-bill-wave',
    data: { investmentName, amount: String(amount) },
  });
};

// ============= البروفايل =============

const notifyPasswordChanged = async (uid) => {
  await sendNotificationToUser(uid, {
    titleAr: '🔐 تم تغيير كلمة المرور',
    titleEn: '🔐 Password Changed',
    bodyAr: 'تم تغيير كلمة المرور بنجاح',
    bodyEn: 'Your password has been changed successfully',
    type: 'info',
    icon: 'lock',
    data: {},
  });
};

module.exports = {
  // التحويلات
  notifyTransferSent,
  notifyTransferReceived,
  // الحسابات
  notifyAccountCreated,
  // البطاقات
  notifyCardCreated,
  notifyCardFrozen,
  notifyCardUnfrozen,
  // الفواتير
  notifyBillPaid,
  notifyGovernmentServicePaid,
  // المحفظة
  notifyWalletRecharged,
  notifyWalletMoneyReceived,
  // القروض
  notifyLoanApplied,
  notifyLoanApproved,
  notifyLoanRejected,
  notifyLoanInstallmentPaid,
  notifyAdminsNewLoanRequest,
  // الاستثمارات
  notifyInvestmentCreated,
  notifyInvestmentSold,
  // البروفايل
  notifyPasswordChanged,
};
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

// جميع المسارات محمية بـ verifyToken
router.use(verifyToken);

// ============= الحسابات =============
router.get('/accounts', dashboardController.getAccounts);
router.post('/accounts', dashboardController.createAccount);
router.put('/accounts/:accountId', dashboardController.updateAccount);
router.delete('/accounts/:accountId', dashboardController.deleteAccount);

// ============= البطاقات =============
router.get('/cards', dashboardController.getCards);
router.post('/cards', dashboardController.createCard);
router.get('/cards/all-with-accounts', dashboardController.getAllCardsWithAccounts);
router.put('/cards/:cardId/freeze', dashboardController.freezeCard);
router.put('/cards/:cardId/unfreeze', dashboardController.unfreezeCard);
router.put('/cards/:cardId/report-lost', dashboardController.reportLostCard);
router.post('/cards/:cardId/pay-bill', dashboardController.payCardBill);

// ============= التحويلات =============
router.post('/transfers/internal', dashboardController.internalTransfer);
router.post('/transfers/external', dashboardController.externalTransfer);
router.get('/transfers', dashboardController.getTransfers);
router.get('/beneficiaries', dashboardController.getBeneficiaries);
router.post('/beneficiaries', dashboardController.addBeneficiary);
router.post('/beneficiaries/verify', dashboardController.verifyAccountExists);

// ============= المعاملات =============
router.get('/transactions', dashboardController.getTransactions);
router.post('/transactions', dashboardController.addTransactionAPI);

// ============= المدفوعات =============
router.post('/payments/bill', dashboardController.payBill);
router.post('/payments/instant', dashboardController.instantPayment);
router.get('/payments/history', dashboardController.getPaymentHistory);
router.get('/payments/bills', dashboardController.getDueBills);

// ============= المحفظة =============
router.get('/wallet', dashboardController.getWallet);
router.post('/wallet/recharge', dashboardController.rechargeWallet);
router.post('/wallet/send', dashboardController.sendWalletMoney);
router.post('/wallet/withdraw', dashboardController.withdrawFromWallet);
router.get('/wallet/transactions', dashboardController.getWalletTransactions);
router.get('/wallet/contacts', dashboardController.getWalletContacts);
router.post('/wallet/contacts', dashboardController.addWalletContact);
router.post('/wallet/check-user', dashboardController.checkUserByPhone);
router.post('/wallet/send-to-wallet', dashboardController.sendMoneyToWallet);
// ============= القروض =============
router.get('/loans', dashboardController.getLoans);
router.post('/loans/apply', dashboardController.applyForLoan);
router.post('/loans/:loanId/pay-installment', dashboardController.payLoanInstallment);
router.post('/loans/apply', dashboardController.applyForLoan);
router.put('/loans/:loanId/approve', dashboardController.approveLoan);
router.put('/loans/:loanId/reject', dashboardController.rejectLoan);
router.get('/loans/pending', dashboardController.getPendingLoanRequests);
router.delete('/loans/:loanId/delete', dashboardController.deleteRejectedLoan);

// ============= الاستثمارات =============
router.get('/investments', dashboardController.getInvestments);
router.post('/investments', dashboardController.createInvestment);
router.get('/investments/opportunities', dashboardController.getInvestmentOpportunities);
router.post('/investments/:investmentId/add', dashboardController.addToInvestment);
router.post('/investments/:investmentId/sell', dashboardController.sellInvestment);
router.post('/investments/invest', dashboardController.investInOpportunity);
router.get('/investments/:investmentId/details', dashboardController.getInvestmentDetails);
router.get('/investment/account', dashboardController.getInvestmentAccount);
router.post('/investment/transfer', dashboardController.transferToInvestmentAccount);
router.post('/investment/withdraw', dashboardController.withdrawFromInvestmentAccount);

// ============= الخدمات الحكومية =============
router.post('/government/pay', dashboardController.payGovernmentService);
router.get('/government/history', dashboardController.getGovernmentServiceHistory);

// ============= الإشعارات =============
router.get('/notifications', dashboardController.getNotifications);
router.put('/notifications/:id/read', dashboardController.markNotificationRead);
router.put('/notifications/read-all', dashboardController.markAllNotificationsRead);

// ============= الإعدادات =============
router.get('/profile', dashboardController.getProfile);
router.put('/profile', dashboardController.updateProfile);
router.put('/profile/change-password', dashboardController.changePassword);

// ============= إرسال إيميلات =============
router.post('/send-rejection-email', dashboardController.sendRejectionEmail);
router.post('/send-approval-email', dashboardController.sendApprovalEmail);

// ============= دوال إضافية =============
router.get('/user/stats', dashboardController.getUserStats);
router.get('/transactions/search', dashboardController.searchTransactions);
router.get('/transactions/export', dashboardController.exportTransactions);
router.get('/reports/financial', dashboardController.getFinancialReport);
router.post('/transfers/validate', dashboardController.validateAccountBeforeTransfer);
router.get('/transactions/recent', dashboardController.getRecentTransactions);
router.put('/notifications/settings', dashboardController.updateNotificationSettings);
router.get('/notifications/settings', dashboardController.getNotificationSettings);
router.delete('/transactions/:transactionId', dashboardController.deleteTransaction);
router.put('/transactions/:transactionId', dashboardController.updateTransaction);

module.exports = router;
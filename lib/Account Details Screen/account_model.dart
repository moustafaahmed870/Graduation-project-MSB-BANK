// lib/Account Details Screen/account_state.dart

import 'account_model.dart';
import 'account_state.dart';

abstract class AccountState {}

// ✅ الحالة الأولية
class AccountInitial extends AccountState {}

// ✅ جاري التحميل
class AccountLoading extends AccountState {}

// ✅ خطأ عام
class AccountError extends AccountState {
  final String message;
  AccountError(this.message);
}

// ===================================================
// حالات الحسابات
// ===================================================
class AccountsLoaded extends AccountState {
  final List<AccountModel> accounts;
  AccountsLoaded(this.accounts);
}

class AccountCreated extends AccountState {
  final AccountModel account;
  final String message;
  AccountCreated(this.account, this.message);
}

// ===================================================
// حالات المعاملات
// ===================================================
class TransactionsLoaded extends AccountState {
  final List<TransactionModel> transactions;
  TransactionsLoaded(this.transactions);
}

// ===================================================
// حالات التحويل
// ===================================================
class TransferSuccess extends AccountState {
  final String message;
  TransferSuccess(this.message);
}

// ===================================================
// حالات دفع الفاتورة
// ===================================================
class BillPaymentSuccess extends AccountState {
  final String message;
  BillPaymentSuccess(this.message);
}

// ===================================================
// حالات البطاقات
// ===================================================
class CardsLoaded extends AccountState {
  final List<CardModel> cards;
  CardsLoaded(this.cards);
}

class CardFrozen extends AccountState {
  final String cardId;
  CardFrozen(this.cardId);
}

class CardUnfrozen extends AccountState {
  final String cardId;
  CardUnfrozen(this.cardId);
}

class CardReportedLost extends AccountState {
  final String cardId;
  CardReportedLost(this.cardId);
}

// ===================================================
// حالة التقديم على بطاقة جديدة
// ===================================================
class CardApplicationSubmitted extends AccountState {
  final String message;
  CardApplicationSubmitted(this.message);
}

// ===================================================
// حالات البروفايل
// ===================================================
class ProfileLoaded extends AccountState {
  final Map<String, dynamic> profile;
  ProfileLoaded(this.profile);
}

// ===================================================
// حالات الإشعارات
// ===================================================
class NotificationsLoaded extends AccountState {
  final List<Map<String, dynamic>> notifications;
  NotificationsLoaded(this.notifications);
}

// ===================================================
// حالات المحفظة
// ===================================================
class WalletLoaded extends AccountState {
  final double balance;
  WalletLoaded(this.balance);
}

// ===================================================
// حالات القروض
// ===================================================
class LoansLoaded extends AccountState {
  final List<Map<String, dynamic>> loans;
  LoansLoaded(this.loans);
}

// ===================================================
// حالة التحقق من الحساب
// ===================================================
class AccountVerified extends AccountState {
  final bool exists;
  final String? ownerName;
  AccountVerified({required this.exists, this.ownerName});
}
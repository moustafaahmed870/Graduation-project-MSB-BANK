// lib/Account Details Screen/account_cubit.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'account_model.dart';
import 'account_repository.dart';
import 'account_state.dart';

class AccountCubit extends Cubit<AccountState> {
  final AccountRepository _repo;

  AccountCubit(this._repo) : super(AccountInitial());

  // ===================================================
  // 1. جيب كل الحسابات - GET /dashboard/accounts
  // ===================================================
  Future<void> getAccounts() async {
    print('🟡 [AccountCubit] getAccounts() - START');
    emit(AccountLoading());

    try {
      final accounts = await _repo.getAccounts();
      print('✅ [AccountCubit] getAccounts SUCCESS - count: ${accounts.length}');
      emit(AccountsLoaded(accounts));
    } catch (e) {
      print('❌ [AccountCubit] getAccounts FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 2. سجل المعاملات - GET /dashboard/transactions
  // ===================================================
  Future<void> getTransactions() async {
    print('🟡 [AccountCubit] getTransactions() - START');
    emit(AccountLoading());

    try {
      final transactions = await _repo.getTransactions();
      print('✅ [AccountCubit] getTransactions SUCCESS - count: ${transactions.length}');
      emit(TransactionsLoaded(transactions));
    } catch (e) {
      print('❌ [AccountCubit] getTransactions FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 3. تحويل داخلي - POST /dashboard/transfers/internal
  // ===================================================
  Future<void> transferFunds({
    required String fromAccountId,
    required String toAccountNumber,
    required double amount,
    String? description,
  }) async {
    print('🟡 [AccountCubit] transferFunds() - from: $fromAccountId | to: $toAccountNumber | amount: $amount');
    emit(AccountLoading());

    try {
      final result = await _repo.transferFunds(
        fromAccountId: fromAccountId,
        toAccountNumber: toAccountNumber,
        amount: amount,
        description: description,
      );
      print('✅ [AccountCubit] transferFunds SUCCESS');
      emit(TransferSuccess(result['message'] ?? 'تم التحويل بنجاح ✅'));
    } catch (e) {
      print('❌ [AccountCubit] transferFunds FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 4. دفع فاتورة - POST /dashboard/payments/bill
  // ===================================================
  Future<void> payBill({
    required String fromAccountId,
    required String serviceType,
    required String provider,
    required String billNumber,
    required double amount,
  }) async {
    print('🟡 [AccountCubit] payBill() - service: $serviceType');
    emit(AccountLoading());

    try {
      final result = await _repo.payBill(
        fromAccountId: fromAccountId,
        serviceType: serviceType,
        provider: provider,
        billNumber: billNumber,
        amount: amount,
      );
      print('✅ [AccountCubit] payBill SUCCESS');
      emit(BillPaymentSuccess(result['message'] ?? 'تم الدفع بنجاح ✅'));
    } catch (e) {
      print('❌ [AccountCubit] payBill FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 5. جيب البطاقات - GET /dashboard/cards
  // ===================================================
  Future<void> getCards() async {
    print('🟡 [AccountCubit] getCards() - START');
    emit(AccountLoading());

    try {
      final cards = await _repo.getCards();
      print('✅ [AccountCubit] getCards SUCCESS - count: ${cards.length}');
      emit(CardsLoaded(cards));
    } catch (e) {
      print('❌ [AccountCubit] getCards FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 6. تجميد بطاقة - PUT /dashboard/cards/:cardId/freeze
  // ===================================================
  Future<void> freezeCard(String cardId) async {
    print('🟡 [AccountCubit] freezeCard() - cardId: $cardId');
    emit(AccountLoading());

    try {
      await _repo.freezeCard(cardId);
      print('✅ [AccountCubit] freezeCard SUCCESS');
      emit(CardFrozen(cardId));
    } catch (e) {
      print('❌ [AccountCubit] freezeCard FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 7. تفعيل بطاقة - PUT /dashboard/cards/:cardId/unfreeze
  // ===================================================
  Future<void> unfreezeCard(String cardId) async {
    print('🟡 [AccountCubit] unfreezeCard() - cardId: $cardId');
    emit(AccountLoading());

    try {
      await _repo.unfreezeCard(cardId);
      print('✅ [AccountCubit] unfreezeCard SUCCESS');
      emit(CardUnfrozen(cardId));
    } catch (e) {
      print('❌ [AccountCubit] unfreezeCard FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 8. بلاغ ضياع بطاقة - PUT /dashboard/cards/:cardId/report-lost
  // ===================================================
  Future<void> reportLostCard(String cardId) async {
    print('🟡 [AccountCubit] reportLostCard() - cardId: $cardId');
    emit(AccountLoading());

    try {
      await _repo.reportLostCard(cardId);
      print('✅ [AccountCubit] reportLostCard SUCCESS');
      emit(CardReportedLost(cardId));
    } catch (e) {
      print('❌ [AccountCubit] reportLostCard FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 9. فتح حساب جديد - POST /dashboard/accounts
  // ===================================================
  Future<void> createAccount({
    required String type,
    required double initialDeposit,
  }) async {
    print('🟡 [AccountCubit] createAccount() - type: $type');
    emit(AccountLoading());

    try {
      final result = await _repo.createAccount(
        type: type,
        initialDeposit: initialDeposit,
      );
      print('✅ [AccountCubit] createAccount SUCCESS');
      final account = AccountModel.fromJson(result['account']);
      emit(AccountCreated(account, result['message'] ?? 'تم فتح الحساب بنجاح ✅'));
    } catch (e) {
      print('❌ [AccountCubit] createAccount FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 10. بيانات المستخدم - GET /dashboard/profile
  // ===================================================
  Future<void> getProfile() async {
    print('🟡 [AccountCubit] getProfile() - START');
    emit(AccountLoading());

    try {
      final profile = await _repo.getProfile();
      print('✅ [AccountCubit] getProfile SUCCESS');
      emit(ProfileLoaded(profile));
    } catch (e) {
      print('❌ [AccountCubit] getProfile FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 11. الإشعارات - GET /dashboard/notifications
  // ===================================================
  Future<void> getNotifications() async {
    print('🟡 [AccountCubit] getNotifications() - START');
    emit(AccountLoading());

    try {
      final notifications = await _repo.getNotifications();
      print('✅ [AccountCubit] getNotifications SUCCESS');
      emit(NotificationsLoaded(notifications));
    } catch (e) {
      print('❌ [AccountCubit] getNotifications FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 12. تحويل خارجي - POST /dashboard/transfers/external
  // ===================================================
  Future<void> externalTransfer({
    required String fromAccountId,
    required String toAccountNumber,
    required String toAccountName,
    required String bankName,
    required double amount,
    String? description,
  }) async {
    print('🟡 [AccountCubit] externalTransfer() - to: $toAccountNumber | amount: $amount');
    emit(AccountLoading());

    try {
      final result = await _repo.externalTransfer(
        fromAccountId: fromAccountId,
        toAccountNumber: toAccountNumber,
        toAccountName: toAccountName,
        bankName: bankName,
        amount: amount,
        description: description,
      );
      print('✅ [AccountCubit] externalTransfer SUCCESS');
      emit(TransferSuccess(result['message'] ?? 'تم التحويل بنجاح ✅'));
    } catch (e) {
      print('❌ [AccountCubit] externalTransfer FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 13. التحقق من حساب - POST /dashboard/beneficiaries/verify
  // ===================================================
  Future<void> verifyAccount(String accountNumber) async {
    print('🟡 [AccountCubit] verifyAccount() - accountNumber: $accountNumber');
    emit(AccountLoading());

    try {
      final result = await _repo.verifyAccount(accountNumber);
      print('✅ [AccountCubit] verifyAccount SUCCESS');
      emit(AccountVerified(
        exists: result['exists'] ?? false,
        ownerName: result['accountOwner']?['name'],
      ));
    } catch (e) {
      print('❌ [AccountCubit] verifyAccount FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 14. رصيد المحفظة - GET /dashboard/wallet
  // ===================================================
  Future<void> getWallet() async {
    print('🟡 [AccountCubit] getWallet() - START');
    emit(AccountLoading());

    try {
      final result = await _repo.getWallet();
      print('✅ [AccountCubit] getWallet SUCCESS');
      emit(WalletLoaded((result['wallet']?['balance'] ?? 0).toDouble()));
    } catch (e) {
      print('❌ [AccountCubit] getWallet FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 15. القروض - GET /dashboard/loans
  // ===================================================
  Future<void> getLoans() async {
    print('🟡 [AccountCubit] getLoans() - START');
    emit(AccountLoading());

    try {
      final loans = await _repo.getLoans();
      print('✅ [AccountCubit] getLoans SUCCESS - count: ${loans.length}');
      emit(LoansLoaded(loans));
    } catch (e) {
      print('❌ [AccountCubit] getLoans FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }

  // ===================================================
  // 16. التقديم على بطاقة جديدة - POST /dashboard/cards/apply
  // ===================================================
  Future<void> applyForCard({
    required String cardType,
    required String address,
  }) async {
    print('🟡 [AccountCubit] applyForCard() - cardType: $cardType');
    emit(AccountLoading());

    try {
      final result = await _repo.applyForCard(
        cardType: cardType,
        address: address,
      );
      print('✅ [AccountCubit] applyForCard SUCCESS');
      emit(CardApplicationSubmitted(result['message'] ?? 'تم تقديم الطلب بنجاح ✅'));
    } catch (e) {
      print('❌ [AccountCubit] applyForCard FAILED: $e');
      emit(AccountError(e.toString().replaceAll('Exception: ', '')));
    }
  }
}
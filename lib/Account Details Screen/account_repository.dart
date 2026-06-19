// lib/Account Details Screen/account_repository.dart

import '../api_client.dart';

import '../token_storage.dart';
import 'account_model.dart';
import 'account_state.dart';

class AccountRepository {

  Future<String> _getToken() async {
    final token = await TokenStorage.getToken();
    print('🔍 [AccountRepository] _getToken(): ${token != null ? "exists" : "null"}');
    if (token == null || token.isEmpty) {
      throw Exception('الرجاء تسجيل الدخول مرة أخرى');
    }
    return token;
  }

  // 1. GET /dashboard/accounts
  Future<List<AccountModel>> getAccounts() async {
    print('🟡 [AccountRepository] getAccounts() - START');
    try {
      final token = await _getToken();
      final response = await ApiClient.get(
        endpoint: '/dashboard/accounts',
        token: token,
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));

      final List list = response['accounts'] ?? [];
      final accounts = list.map((a) => AccountModel.fromJson(a)).toList();
      print('✅ [AccountRepository] getAccounts - count: ${accounts.length}');
      return accounts;
    } catch (e) {
      print('❌ [AccountRepository] getAccounts EXCEPTION: $e');
      if (e.toString().contains('Invalid token')) await TokenStorage.deleteToken();
      rethrow;
    }
  }

  // 2. GET /dashboard/transactions
  Future<List<TransactionModel>> getTransactions() async {
    print('🟡 [AccountRepository] getTransactions() - START');
    try {
      final token = await _getToken();
      final response = await ApiClient.get(
        endpoint: '/dashboard/transactions',
        token: token,
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));

      final List list = response['transactions'] ?? [];
      final transactions = list.map((t) => TransactionModel.fromJson(t)).toList();
      print('✅ [AccountRepository] getTransactions - count: ${transactions.length}');
      return transactions;
    } catch (e) {
      print('❌ [AccountRepository] getTransactions EXCEPTION: $e');
      if (e.toString().contains('Invalid token')) await TokenStorage.deleteToken();
      rethrow;
    }
  }

  // 3. POST /dashboard/transfers/internal
  Future<Map<String, dynamic>> transferFunds({
    required String fromAccountId,
    required String toAccountNumber,
    required double amount,
    String? description,
  }) async {
    print('🟡 [AccountRepository] transferFunds()');
    try {
      final token = await _getToken();
      final response = await ApiClient.post(
        endpoint: '/dashboard/transfers/internal',
        token: token,
        body: {
          'fromAccountId': fromAccountId,
          'toAccountNumber': toAccountNumber,
          'amount': amount,
          'description': description ?? '',
        },
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] transferFunds response: $response');
      return response;
    } catch (e) {
      print('❌ [AccountRepository] transferFunds EXCEPTION: $e');
      rethrow;
    }
  }

  // 4. POST /dashboard/payments/bill
  Future<Map<String, dynamic>> payBill({
    required String fromAccountId,
    required String serviceType,
    required String provider,
    required String billNumber,
    required double amount,
  }) async {
    print('🟡 [AccountRepository] payBill()');
    try {
      final token = await _getToken();
      final response = await ApiClient.post(
        endpoint: '/dashboard/payments/bill',
        token: token,
        body: {
          'fromAccountId': fromAccountId,
          'serviceType': serviceType,
          'provider': provider,
          'billNumber': billNumber,
          'amount': amount,
        },
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] payBill response: $response');
      return response;
    } catch (e) {
      print('❌ [AccountRepository] payBill EXCEPTION: $e');
      rethrow;
    }
  }

  // 5. GET /dashboard/cards
  Future<List<CardModel>> getCards() async {
    print('🟡 [AccountRepository] getCards() - START');
    try {
      final token = await _getToken();
      final response = await ApiClient.get(
        endpoint: '/dashboard/cards',
        token: token,
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));

      final List list = response['cards'] ?? [];
      final cards = list.map((c) => CardModel.fromJson(c)).toList();
      print('✅ [AccountRepository] getCards - count: ${cards.length}');
      return cards;
    } catch (e) {
      print('❌ [AccountRepository] getCards EXCEPTION: $e');
      rethrow;
    }
  }

  // 6. PUT /dashboard/cards/:cardId/freeze
  Future<void> freezeCard(String cardId) async {
    print('🟡 [AccountRepository] freezeCard()');
    try {
      final token = await _getToken();
      await ApiClient.put(
        endpoint: '/dashboard/cards/$cardId/freeze',
        token: token,
        body: {},
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] freezeCard SUCCESS');
    } catch (e) {
      print('❌ [AccountRepository] freezeCard EXCEPTION: $e');
      rethrow;
    }
  }

  // 7. PUT /dashboard/cards/:cardId/unfreeze
  Future<void> unfreezeCard(String cardId) async {
    print('🟡 [AccountRepository] unfreezeCard()');
    try {
      final token = await _getToken();
      await ApiClient.put(
        endpoint: '/dashboard/cards/$cardId/unfreeze',
        token: token,
        body: {},
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] unfreezeCard SUCCESS');
    } catch (e) {
      print('❌ [AccountRepository] unfreezeCard EXCEPTION: $e');
      rethrow;
    }
  }

  // 8. PUT /dashboard/cards/:cardId/report-lost
  Future<void> reportLostCard(String cardId) async {
    print('🟡 [AccountRepository] reportLostCard()');
    try {
      final token = await _getToken();
      await ApiClient.put(
        endpoint: '/dashboard/cards/$cardId/report-lost',
        token: token,
        body: {},
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] reportLostCard SUCCESS');
    } catch (e) {
      print('❌ [AccountRepository] reportLostCard EXCEPTION: $e');
      rethrow;
    }
  }

  // 9. POST /dashboard/accounts
  Future<Map<String, dynamic>> createAccount({
    required String type,
    required double initialDeposit,
  }) async {
    print('🟡 [AccountRepository] createAccount()');
    try {
      final token = await _getToken();
      final response = await ApiClient.post(
        endpoint: '/dashboard/accounts',
        token: token,
        body: {'type': type, 'initialDeposit': initialDeposit},
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] createAccount response: $response');
      return response;
    } catch (e) {
      print('❌ [AccountRepository] createAccount EXCEPTION: $e');
      rethrow;
    }
  }

  // 10. GET /dashboard/profile
  Future<Map<String, dynamic>> getProfile() async {
    print('🟡 [AccountRepository] getProfile() - START');
    try {
      final token = await _getToken();
      final response = await ApiClient.get(
        endpoint: '/dashboard/profile',
        token: token,
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));

      if (response['success'] != true || response['profile'] == null) {
        throw Exception(response['message'] ?? 'فشل جلب بيانات الملف الشخصي');
      }

      print('✅ [AccountRepository] getProfile SUCCESS');
      return response['profile'] as Map<String, dynamic>;
    } catch (e) {
      print('❌ [AccountRepository] getProfile EXCEPTION: $e');
      rethrow;
    }
  }

  // 11. GET /dashboard/notifications
  Future<List<Map<String, dynamic>>> getNotifications() async {
    print('🟡 [AccountRepository] getNotifications() - START');
    try {
      final token = await _getToken();
      final response = await ApiClient.get(
        endpoint: '/dashboard/notifications',
        token: token,
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));

      final List list = response['notifications'] ?? [];
      print('✅ [AccountRepository] getNotifications - count: ${list.length}');
      return list.cast<Map<String, dynamic>>();
    } catch (e) {
      print('❌ [AccountRepository] getNotifications EXCEPTION: $e');
      rethrow;
    }
  }

  // 12. POST /dashboard/transfers/external
  Future<Map<String, dynamic>> externalTransfer({
    required String fromAccountId,
    required String toAccountNumber,
    required String toAccountName,
    required String bankName,
    required double amount,
    String? description,
  }) async {
    print('🟡 [AccountRepository] externalTransfer()');
    try {
      final token = await _getToken();
      final response = await ApiClient.post(
        endpoint: '/dashboard/transfers/external',
        token: token,
        body: {
          'fromAccountId': fromAccountId,
          'toAccountNumber': toAccountNumber,
          'toAccountName': toAccountName,
          'bankName': bankName,
          'amount': amount,
          'description': description ?? '',
        },
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] externalTransfer response: $response');
      return response;
    } catch (e) {
      print('❌ [AccountRepository] externalTransfer EXCEPTION: $e');
      rethrow;
    }
  }

  // 13. POST /dashboard/beneficiaries/verify
  Future<Map<String, dynamic>> verifyAccount(String accountNumber) async {
    print('🟡 [AccountRepository] verifyAccount()');
    try {
      final token = await _getToken();
      final response = await ApiClient.post(
        endpoint: '/dashboard/beneficiaries/verify',
        token: token,
        body: {'accountNumber': accountNumber},
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] verifyAccount response: $response');
      return response;
    } catch (e) {
      print('❌ [AccountRepository] verifyAccount EXCEPTION: $e');
      rethrow;
    }
  }

  // 14. GET /dashboard/wallet
  Future<Map<String, dynamic>> getWallet() async {
    print('🟡 [AccountRepository] getWallet() - START');
    try {
      final token = await _getToken();
      final response = await ApiClient.get(
        endpoint: '/dashboard/wallet',
        token: token,
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));
      print('✅ [AccountRepository] getWallet SUCCESS');
      return response;
    } catch (e) {
      print('❌ [AccountRepository] getWallet EXCEPTION: $e');
      rethrow;
    }
  }

  // ✅ 15. POST /dashboard/cards - إنشاء بطاقة جديدة (endpoint الصحيح)
  Future<Map<String, dynamic>> applyForCard({
    required String cardType,
    required String address,  // address هنا هو linkedAccountId
  }) async {
    print('🟡 [AccountRepository] applyForCard() - cardType: $cardType, linkedAccountId: $address');
    try {
      final token = await _getToken();

      final response = await ApiClient.post(
        endpoint: '/dashboard/cards',  // ✅ endpoint الصحيح
        token: token,
        body: {
          'type': cardType,           // silver, gold, platinum
          'linkedAccountId': address, // ID الحساب الحقيقي
        },
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));

      print('✅ [AccountRepository] applyForCard response: $response');
      return response;
    } catch (e) {
      print('❌ [AccountRepository] applyForCard EXCEPTION: $e');
      rethrow;
    }
  }

  // 16. GET /dashboard/loans
  Future<List<Map<String, dynamic>>> getLoans() async {
    print('🟡 [AccountRepository] getLoans() - START');
    try {
      final token = await _getToken();
      final response = await ApiClient.get(
        endpoint: '/dashboard/loans',
        token: token,
      ).timeout(const Duration(seconds: 15), onTimeout: () => throw Exception('انتهت مدة الانتظار'));

      final List list = response['loans'] ?? [];
      print('✅ [AccountRepository] getLoans - count: ${list.length}');
      return list.cast<Map<String, dynamic>>();
    } catch (e) {
      print('❌ [AccountRepository] getLoans EXCEPTION: $e');
      rethrow;
    }
  }

  // ✅ 17. POST /api/request-money - طلب مبلغ من مستخدم آخر
  Future<Map<String, dynamic>> requestMoney({
    required String toAccountNumber,
    required double amount,
    String? note,
  }) async {
    print('🟡 [AccountRepository] requestMoney() - to: $toAccountNumber | amount: $amount');

    try {
      final token = await _getToken();

      final response = await ApiClient.post(
        endpoint: '/request-money',
        token: token,
        body: {
          'toAccountNumber': toAccountNumber,
          'amount': amount,
          'note': note ?? '',
        },
      ).timeout(
        const Duration(seconds: 15),
        onTimeout: () => throw Exception('انتهت مدة الانتظار'),
      );

      print('✅ [AccountRepository] requestMoney response: $response');
      return response;
    } catch (e) {
      print('❌ [AccountRepository] requestMoney EXCEPTION: $e');
      rethrow;
    }
  }
}
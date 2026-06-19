// lib/Account Details Screen/account_state.dart

class AccountModel {
  final String uid;
  final String fullName;
  final String email;
  final String phone;
  final double balance;
  final String accountNumber;
  final String accountType;
  final String currency;
  final String branch;

  AccountModel({
    required this.uid,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.balance,
    required this.accountNumber,
    required this.accountType,
    required this.currency,
    required this.branch,
  });
}

class TransactionModel {
  final String id;
  final String description;
  final double amount;
  final String type;
  final String createdAt;

  TransactionModel({
    required this.id,
    required this.description,
    required this.amount,
    required this.type,
    required this.createdAt,
  });
}
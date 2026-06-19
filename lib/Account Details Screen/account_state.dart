// ===================================================
// account_model.dart - متوافق مع /dashboard/accounts و /dashboard/profile
// ===================================================

class AccountModel {
  final String id;
  final String name;
  final String number;
  final double balance;
  final String type;
  final String currency;
  final String icon;
  final String status;
  final bool hasCard;
  final String? cardId;
  final String createdAt;

  // ✅ fields إضافية للبروفايل (من /dashboard/profile)
  final String? uid;
  final String? fullName;
  final String? email;
  final String? phone;
  final String? branch;
  final String? accountNumber; // alias لـ number - للتوافق مع الشاشات القديمة
  final String? accountType;   // alias لـ type   - للتوافق مع الشاشات القديمة

  AccountModel({
    required this.id,
    required this.name,
    required this.number,
    required this.balance,
    required this.type,
    required this.currency,
    required this.icon,
    required this.status,
    required this.hasCard,
    this.cardId,
    required this.createdAt,
    // profile fields (optional)
    this.uid,
    this.fullName,
    this.email,
    this.phone,
    this.branch,
    this.accountNumber,
    this.accountType,
  });

  factory AccountModel.fromJson(Map<String, dynamic> json) {
    return AccountModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      number: json['number'] ?? '',
      balance: (json['balance'] ?? 0).toDouble(),
      type: json['type'] ?? 'current',
      currency: json['currency'] ?? 'EGP',
      icon: json['icon'] ?? 'credit-card',
      status: json['status'] ?? 'active',
      hasCard: json['hasCard'] ?? false,
      cardId: json['cardId'],
      createdAt: json['createdAt'] ?? '',
    );
  }

  // ✅ factory خاص للبروفايل من /dashboard/profile
  factory AccountModel.fromProfile(Map<String, dynamic> profile) {
    final accounts = (profile['accounts'] as List?) ?? [];
    Map<String, dynamic>? mainAccount;
    if (accounts.isNotEmpty) {
      mainAccount = accounts.firstWhere(
            (acc) => acc['type'] == 'current',
        orElse: () => accounts.first,
      ) as Map<String, dynamic>;
    }

    return AccountModel(
      id: mainAccount?['id'] ?? '',
      name: mainAccount?['name'] ?? profile['fullName'] ?? '',
      number: mainAccount?['number'] ?? '',
      balance: ((mainAccount?['balance']) ?? 0).toDouble(),
      type: mainAccount?['type'] ?? 'current',
      currency: mainAccount?['currency'] ?? 'EGP',
      icon: mainAccount?['icon'] ?? 'credit-card',
      status: mainAccount?['status'] ?? 'active',
      hasCard: mainAccount?['hasCard'] ?? false,
      cardId: mainAccount?['cardId'],
      createdAt: mainAccount?['createdAt'] ?? '',
      // profile fields
      uid: profile['uid'] ?? '',
      fullName: profile['fullName'] ?? '',
      email: profile['email'] ?? '',
      phone: profile['phone'] ?? '',
      branch: profile['branch'] ?? 'الفرع الرئيسي',
      accountNumber: mainAccount?['number'] ?? '',
      accountType: mainAccount?['type'] ?? 'current',
    );
  }

  AccountModel copyWith({
    String? id,
    String? name,
    String? number,
    double? balance,
    String? type,
    String? currency,
    String? icon,
    String? status,
    bool? hasCard,
    String? cardId,
    String? createdAt,
    String? uid,
    String? fullName,
    String? email,
    String? phone,
    String? branch,
    String? accountNumber,
    String? accountType,
  }) {
    return AccountModel(
      id: id ?? this.id,
      name: name ?? this.name,
      number: number ?? this.number,
      balance: balance ?? this.balance,
      type: type ?? this.type,
      currency: currency ?? this.currency,
      icon: icon ?? this.icon,
      status: status ?? this.status,
      hasCard: hasCard ?? this.hasCard,
      cardId: cardId ?? this.cardId,
      createdAt: createdAt ?? this.createdAt,
      uid: uid ?? this.uid,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      branch: branch ?? this.branch,
      accountNumber: accountNumber ?? this.accountNumber,
      accountType: accountType ?? this.accountType,
    );
  }
}

// ===================================================
// TransactionModel - متوافق مع /dashboard/transactions
// ===================================================
class TransactionModel {
  final String id;
  final String description;
  final double amount;
  final String category;
  final String icon;
  final String status;
  final DateTime? date;

  TransactionModel({
    required this.id,
    required this.description,
    required this.amount,
    required this.category,
    required this.icon,
    required this.status,
    this.date,
  });

  bool get isPositive => amount > 0;

  // ✅ createdAt getter للتوافق مع الشاشات القديمة
  DateTime? get createdAt => date;

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    DateTime? parsedDate;
    final raw = json['date'] ?? json['createdAt'];
    if (raw != null) {
      if (raw is Map && raw['_seconds'] != null) {
        parsedDate = DateTime.fromMillisecondsSinceEpoch(
          (raw['_seconds'] as int) * 1000,
        );
      } else {
        parsedDate = DateTime.tryParse(raw.toString());
      }
    }

    return TransactionModel(
      id: json['id'] ?? '',
      description: json['description'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      category: json['category'] ?? '',
      icon: json['icon'] ?? 'circle',
      status: json['status'] ?? 'completed',
      date: parsedDate,
    );
  }
}

// ===================================================
// CardModel - متوافق مع /dashboard/cards
// ===================================================
class CardModel {
  final String id;
  final String name;
  final String number;
  final String type;
  final String holder;
  final String expiry;
  final double creditLimit;
  final double used;
  final double available;
  final String status;
  final String? linkedAccountId;
  final String? linkedAccountName;
  final String? linkedAccountNumber;

  CardModel({
    required this.id,
    required this.name,
    required this.number,
    required this.type,
    required this.holder,
    required this.expiry,
    required this.creditLimit,
    required this.used,
    required this.available,
    required this.status,
    this.linkedAccountId,
    this.linkedAccountName,
    this.linkedAccountNumber,
  });

  bool get isActive => status == 'active';
  bool get isFrozen => status == 'frozen';
  bool get isLost => status == 'lost';

  factory CardModel.fromJson(Map<String, dynamic> json) {
    return CardModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      number: json['number'] ?? '****',
      type: json['type'] ?? 'standard',
      holder: json['holder'] ?? '',
      expiry: json['expiry'] ?? '00/00',
      creditLimit: (json['creditLimit'] ?? 0).toDouble(),
      used: (json['used'] ?? 0).toDouble(),
      available: (json['available'] ?? 0).toDouble(),
      status: json['status'] ?? 'active',
      linkedAccountId: json['linkedAccountId'],
      linkedAccountName: json['linkedAccountName'],
      linkedAccountNumber: json['linkedAccountNumber'],
    );
  }
}
// lib/Account Details Screen/add_card.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../l10n/app_localizations.dart';
import '../my_theme.dart';
import 'account_cubit.dart';
import 'account_model.dart';
import 'account_state.dart';
import 'account_repository.dart';

class AddCardScreen extends StatefulWidget {
  static const String routeName = 'add-card';

  const AddCardScreen({super.key});

  @override
  State<AddCardScreen> createState() => _AddCardScreenState();
}

class _AddCardScreenState extends State<AddCardScreen> {
  final _formKey = GlobalKey<FormState>();

  String selectedCardType = 'silver';  // silver, gold, platinum
  String selectedCardCategory = 'debit'; // debit, credit, prepaid

  List<AccountModel> _accounts = [];
  AccountModel? _selectedAccount;
  bool _isLoadingAccounts = true;
  String? _accountsError;

  List<Map<String, dynamic>> cardTypes = [];
  List<Map<String, dynamic>> cardCategories = [];

  String _formatNumber(double number) {
    return number.toStringAsFixed(0).replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
            (match) => '${match[1]},'
    );
  }

  void _loadCardTypes(AppLocalizations s) {
    cardTypes = [
      {'value': 'silver', 'label': 'فضية', 'icon': Icons.credit_card, 'limit': '5,000 ج.م'},
      {'value': 'gold', 'label': 'ذهبية', 'icon': Icons.credit_card, 'limit': '15,000 ج.م'},
      {'value': 'platinum', 'label': 'بلاتينية', 'icon': Icons.credit_card, 'limit': '50,000 ج.م'},
    ];
  }

  void _loadCardCategories(AppLocalizations s) {
    cardCategories = [
      {'value': 'debit', 'label': s.card_category_debit, 'desc': s.card_category_debit_desc},
      {'value': 'credit', 'label': s.card_category_credit, 'desc': s.card_category_credit_desc},
      {'value': 'prepaid', 'label': s.card_category_prepaid, 'desc': s.card_category_prepaid_desc},
    ];
  }

  @override
  void initState() {
    super.initState();
    _loadAccounts();
  }

  Future<void> _loadAccounts() async {
    setState(() {
      _isLoadingAccounts = true;
      _accountsError = null;
    });

    try {
      final repo = AccountRepository();
      final accounts = await repo.getAccounts();
      final cards = await repo.getCards();

      // الحسابات اللي عندها بطاقة
      final accountIdsWithCards = cards.map((c) => c.linkedAccountId).toSet();

      // الحسابات المؤهلة (ليست استثمارية وليس عندها بطاقة)
      final eligibleAccounts = accounts.where((a) =>
      a.type != 'investment' && !accountIdsWithCards.contains(a.id)
      ).toList();

      setState(() {
        _accounts = eligibleAccounts;
        if (_accounts.isNotEmpty) {
          _selectedAccount = _accounts.first;
        }
        _isLoadingAccounts = false;
      });
    } catch (e) {
      setState(() {
        _accountsError = e.toString();
        _isLoadingAccounts = false;
      });
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    _loadCardTypes(s);
    _loadCardCategories(s);

    return BlocListener<AccountCubit, AccountState>(
      listener: (context, state) {
        if (state is CardApplicationSubmitted) {
          _showSuccessDialog(state.message);
        }
        if (state is AccountError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: MyTheme.textError,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: MyTheme.backgroundMain,
        appBar: AppBar(
          title: Text(s.request_new_card,
              style: const TextStyle(color: MyTheme.textWhite)),
          backgroundColor: MyTheme.backgroundCard,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_rounded, color: MyTheme.textWhite),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: BlocBuilder<AccountCubit, AccountState>(
          builder: (context, state) {
            bool isLoading = state is AccountLoading || _isLoadingAccounts;

            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [MyTheme.backgroundCard, MyTheme.borderNormal],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: MyTheme.borderNormal),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.add_card, color: MyTheme.textAccent, size: 40),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(s.request_new_card,
                                    style: const TextStyle(
                                        color: MyTheme.textWhite,
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text(
                                  s.card_request_review_message,
                                  style: TextStyle(
                                      color: MyTheme.textPrimary.withOpacity(0.7),
                                      fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // اختيار الحساب المرتبط
                    Text('اختر الحساب المرتبط',
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: MyTheme.textPrimary)),
                    const SizedBox(height: 12),

                    if (_isLoadingAccounts)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: CircularProgressIndicator(color: MyTheme.textAccent),
                        ),
                      )
                    else if (_accountsError != null)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: MyTheme.textError.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          children: [
                            Text(
                              _accountsError!,
                              style: TextStyle(color: MyTheme.textError),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            ElevatedButton(
                              onPressed: _loadAccounts,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: MyTheme.textAccent,
                              ),
                              child: const Text('إعادة المحاولة'),
                            ),
                          ],
                        ),
                      )
                    else if (_accounts.isEmpty)
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: MyTheme.textError.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            children: [
                              Icon(Icons.info_outline, color: MyTheme.textError, size: 40),
                              const SizedBox(height: 12),
                              Text(
                                'لا توجد حسابات متاحة لإصدار بطاقة جديدة',
                                style: TextStyle(color: MyTheme.textError, fontSize: 16, fontWeight: FontWeight.bold),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'جميع حساباتك لديها بطاقات بالفعل. يمكنك فتح حساب جديد أولاً.',
                                style: TextStyle(color: MyTheme.textPrimary.withOpacity(0.6), fontSize: 13),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: MyTheme.textAccent,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                child: const Text('العودة'),
                              ),
                            ],
                          ),
                        )
                      else
                        Container(
                          decoration: BoxDecoration(
                            color: MyTheme.backgroundCard,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: MyTheme.borderNormal),
                          ),
                          child: DropdownButtonFormField<AccountModel>(
                            value: _selectedAccount,
                            decoration: InputDecoration(
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              prefixIcon: Icon(Icons.account_balance, color: MyTheme.textAccent),
                            ),
                            dropdownColor: MyTheme.backgroundCard,
                            style: TextStyle(color: MyTheme.textWhite),
                            items: _accounts.map((account) {
                              return DropdownMenuItem(
                                value: account,
                                child: Text(
                                  '${account.name} - ****${account.number.substring(account.number.length - 4)} (${_formatNumber(account.balance)} ج.م)',
                                ),
                              );
                            }).toList(),
                            onChanged: (value) {
                              setState(() {
                                _selectedAccount = value;
                              });
                            },
                          ),
                        ),

                    const SizedBox(height: 24),

                    // نوع البطاقة (silver, gold, platinum)
                    Text('نوع البطاقة',
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: MyTheme.textPrimary)),
                    const SizedBox(height: 12),
                    Row(
                      children: cardTypes.map((type) {
                        bool isSelected = selectedCardType == type['value'];
                        return Expanded(
                          child: GestureDetector(
                            onTap: () =>
                                setState(() => selectedCardType = type['value']),
                            child: Container(
                              margin: EdgeInsets.only(
                                  left: type == cardTypes.last ? 0 : 8),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? MyTheme.textAccent.withOpacity(0.15)
                                    : MyTheme.backgroundCard,
                                border: Border.all(
                                  color: isSelected
                                      ? MyTheme.textAccent
                                      : MyTheme.borderNormal,
                                  width: isSelected ? 2 : 1,
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Column(
                                children: [
                                  Icon(type['icon'],
                                      color: isSelected
                                          ? MyTheme.textAccent
                                          : MyTheme.textPrimary,
                                      size: 30),
                                  const SizedBox(height: 8),
                                  Text(type['label'],
                                      style: TextStyle(
                                        color: isSelected
                                            ? MyTheme.textAccent
                                            : MyTheme.textPrimary,
                                        fontWeight: isSelected
                                            ? FontWeight.bold
                                            : FontWeight.normal,
                                      )),
                                  const SizedBox(height: 4),
                                  Text(
                                    'حد ${type['limit']}',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: isSelected
                                          ? MyTheme.textAccent
                                          : MyTheme.textPrimary.withOpacity(0.6),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 24),

                    // فئة البطاقة (debit, credit, prepaid) - للعرض فقط
                    Text('فئة البطاقة',
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: MyTheme.textPrimary)),
                    const SizedBox(height: 12),
                    ...cardCategories.map((cat) {
                      bool isSelected = selectedCardCategory == cat['value'];
                      return GestureDetector(
                        onTap: () =>
                            setState(() => selectedCardCategory = cat['value']),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? MyTheme.textAccent.withOpacity(0.1)
                                : MyTheme.backgroundCard,
                            border: Border.all(
                              color: isSelected
                                  ? MyTheme.textAccent
                                  : MyTheme.borderNormal,
                              width: isSelected ? 2 : 1,
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 20,
                                height: 20,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isSelected
                                        ? MyTheme.textAccent
                                        : MyTheme.borderNormal,
                                    width: 2,
                                  ),
                                  color: isSelected
                                      ? MyTheme.textAccent
                                      : Colors.transparent,
                                ),
                                child: isSelected
                                    ? Icon(Icons.check,
                                    color: MyTheme.backgroundCard, size: 12)
                                    : null,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(cat['label'],
                                        style: TextStyle(
                                          color: isSelected
                                              ? MyTheme.textAccent
                                              : MyTheme.textPrimary,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 15,
                                        )),
                                    const SizedBox(height: 2),
                                    Text(cat['desc'],
                                        style: TextStyle(
                                            color: MyTheme.textPrimary
                                                .withOpacity(0.6),
                                            fontSize: 12)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),

                    const SizedBox(height: 24),

                    // معلومات إضافية
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: MyTheme.textAccent.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                            color: MyTheme.textAccent.withOpacity(0.3)),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.info_outline,
                              color: MyTheme.textAccent, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'سيتم إصدار البطاقة وربطها بالحساب المختار.',
                              style: TextStyle(
                                  color: MyTheme.textPrimary.withOpacity(0.8),
                                  fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 32),

                    // زر الإرسال
                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: MyTheme.textAccent,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                          elevation: 0,
                        ),
                        onPressed: isLoading || _selectedAccount == null || _accounts.isEmpty
                            ? null
                            : () {
                          // ✅ إرسال البيانات بصيغة متوافقة مع الباك إند
                          context.read<AccountCubit>().applyForCard(
                            cardType: selectedCardType,  // silver, gold, platinum
                            address: _selectedAccount!.id,  // linkedAccountId
                          );
                        },
                        child: isLoading
                            ? SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(
                              color: MyTheme.textWhite, strokeWidth: 2),
                        )
                            : Text(s.submit_request,
                            style: const TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                                color: MyTheme.textWhite)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  void _showSuccessDialog(String message) {
    final s = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.hourglass_top_rounded,
                color: MyTheme.textAccent, size: 70),
            const SizedBox(height: 16),
            Text(s.request_submitted_title,
                style: const TextStyle(
                    color: MyTheme.textWhite,
                    fontSize: 20,
                    fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text(
              message,
              style: TextStyle(color: MyTheme.textPrimary, fontSize: 14),
              textAlign: TextAlign.center,
            ),
          ],
        ),
        actions: [
          TextButton(
            child: Text(s.ok,
                style: const TextStyle(color: MyTheme.textAccent, fontSize: 16)),
            onPressed: () {
              Navigator.pop(context); // أغلق الـ dialog
              Navigator.pop(context); // ارجع لشاشة البطاقات
            },
          ),
        ],
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../Account Details Screen/account_repository.dart';
import '../Account Details Screen/account_model.dart';
import '../Account Details Screen/account_state.dart';
import '../my_theme.dart';
import '../l10n/app_localizations.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _showBalance = true;

  final AccountRepository _repo = AccountRepository();

  String? _userName;

  AccountModel? _account;
  List<TransactionModel> _transactions = [];
  bool _isLoadingAccount = true;
  bool _isLoadingTransactions = true;
  String? _accountError;
  String? _transactionsError;

  List<Map<String, dynamic>> _quickActions = [];

  void _loadQuickActions(AppLocalizations s) {
    _quickActions = [
      {'name': s.action_request_money, 'icon': Icons.request_page_outlined, 'color': MyTheme.textAccent},
      {'name': s.action_qr, 'icon': Icons.qr_code_scanner, 'color': MyTheme.textAccent},
    ];
  }

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await Future.wait([
      _loadAccount(),
      _loadTransactions(),
    ]);
  }

  Future<void> _loadAccount() async {
    setState(() {
      _isLoadingAccount = true;
      _accountError = null;
    });
    try {
      final profile = await _repo.getProfile();
      final profileData = profile['profile'] as Map<String, dynamic>? ?? profile;

      final accounts = await _repo.getAccounts();

      setState(() {
        _userName = profileData['fullName'] as String?;
        if (accounts.isNotEmpty) {
          _account = accounts.firstWhere(
                (acc) => acc.type == 'current',
            orElse: () => accounts.first,
          );
        }
        _isLoadingAccount = false;
      });
    } catch (e) {
      setState(() {
        _accountError = e.toString();
        _isLoadingAccount = false;
      });
    }
  }

  Future<void> _loadTransactions() async {
    setState(() {
      _isLoadingTransactions = true;
      _transactionsError = null;
    });
    try {
      final allTransactions = await _repo.getTransactions();
      setState(() {
        _transactions = allTransactions.take(4).toList();
        _isLoadingTransactions = false;
      });
    } catch (e) {
      setState(() {
        _transactionsError = e.toString();
        _isLoadingTransactions = false;
      });
    }
  }

  // ✅ دالة طلب المبلغ - تشتغل مع API حقيقي
  void _openRequestMoneyDialog() {
    final s = AppLocalizations.of(context)!;
    final TextEditingController accountController = TextEditingController();
    final TextEditingController amountController = TextEditingController();
    final TextEditingController noteController = TextEditingController();
    bool isLoading = false;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return AlertDialog(
            backgroundColor: MyTheme.backgroundCard,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: MyTheme.backgroundTransparent,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: MyTheme.borderNormal),
                  ),
                  child: Icon(Icons.request_page_outlined, color: MyTheme.textAccent, size: 22),
                ),
                const SizedBox(width: 12),
                Text(
                  s.request_money_title,
                  style: const TextStyle(color: MyTheme.textAccent, fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.person_account_number,
                  style: TextStyle(color: MyTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    color: MyTheme.backgroundTransparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: MyTheme.borderNormal),
                  ),
                  child: TextField(
                    controller: accountController,
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    textAlign: TextAlign.right,
                    style: TextStyle(color: MyTheme.textPrimary, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: s.account_number_example,
                      hintStyle: TextStyle(color: MyTheme.textPrimary.withOpacity(0.4), fontSize: 14),
                      prefixIcon: Icon(Icons.account_balance_outlined, color: MyTheme.textAccent, size: 20),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  s.amount_label,
                  style: TextStyle(color: MyTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    color: MyTheme.backgroundTransparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: MyTheme.borderNormal),
                  ),
                  child: TextField(
                    controller: amountController,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}'))
                    ],
                    textAlign: TextAlign.right,
                    style: TextStyle(color: MyTheme.textPrimary, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: '0.00',
                      hintStyle: TextStyle(color: MyTheme.textPrimary.withOpacity(0.4), fontSize: 14),
                      prefixIcon: Icon(Icons.attach_money, color: MyTheme.textAccent, size: 20),
                      suffixText: s.currency_egp,
                      suffixStyle: TextStyle(color: MyTheme.textPrimary, fontSize: 14),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  s.request_reason_optional,
                  style: TextStyle(color: MyTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    color: MyTheme.backgroundTransparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: MyTheme.borderNormal),
                  ),
                  child: TextField(
                    controller: noteController,
                    textAlign: TextAlign.right,
                    style: TextStyle(color: MyTheme.textPrimary, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: s.request_reason_hint,
                      hintStyle: TextStyle(color: MyTheme.textPrimary.withOpacity(0.4), fontSize: 14),
                      prefixIcon: Icon(Icons.note_outlined, color: MyTheme.textAccent, size: 20),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: Text(s.cancel, style: TextStyle(color: MyTheme.textPrimary)),
              ),
              ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () async {
                  if (accountController.text.isEmpty || amountController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(s.please_complete_data),
                        backgroundColor: Colors.redAccent,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                    return;
                  }
                  setDialogState(() => isLoading = true);

                  try {
                    // ✅ استدعاء API طلب المبلغ الحقيقي
                    final response = await _repo.requestMoney(
                      toAccountNumber: accountController.text.trim(),
                      amount: double.parse(amountController.text),
                      note: noteController.text.isNotEmpty ? noteController.text : null,
                    );

                    if (context.mounted) {
                      Navigator.pop(ctx);
                      _showSuccessSnackbar(
                        response['message'] ?? '${s.request_sent_success} ${accountController.text}',
                      );
                    }
                  } catch (e) {
                    setDialogState(() => isLoading = false);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(e.toString().replaceAll('Exception: ', '')),
                        backgroundColor: Colors.redAccent,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: MyTheme.textAccent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: isLoading
                    ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2, color: MyTheme.backgroundMain),
                )
                    : Text(s.send_request, style: const TextStyle(color: MyTheme.backgroundMain)),
              ),
            ],
          );
        },
      ),
    );
  }

  // ✅ دالة QR Scanner
  void _openQrScanner() {
    final s = AppLocalizations.of(context)!;

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            title: Text(s.qr_scanner_title, style: const TextStyle(color: MyTheme.textWhite)),
            backgroundColor: Colors.black,
            leading: IconButton(
              icon: const Icon(Icons.close, color: MyTheme.textWhite),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          body: MobileScanner(
            onDetect: (capture) {
              final List<Barcode> barcodes = capture.barcodes;
              for (final barcode in barcodes) {
                if (barcode.rawValue != null) {
                  Navigator.pop(context);
                  _showScannedData(barcode.rawValue!);
                  break;
                }
              }
            },
          ),
        ),
      ),
    );
  }

  // ✅ عرض البيانات المستلمة من الـ QR
  void _showScannedData(String data) {
    final s = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(Icons.qr_code_scanner, color: MyTheme.textAccent),
            const SizedBox(width: 10),
            Text(s.qr_scanner_title, style: TextStyle(color: MyTheme.textAccent, fontSize: 18)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'البيانات المستلمة:',
              style: TextStyle(color: MyTheme.textPrimary, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: MyTheme.backgroundTransparent,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: MyTheme.borderNormal),
              ),
              child: Text(
                data,
                style: TextStyle(color: MyTheme.textAccent, fontSize: 14),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              if (data.length >= 10 && data.length <= 20 && RegExp(r'^\d+$').hasMatch(data)) {
                _openRequestMoneyWithAccount(data);
              }
            },
            child: Text(s.ok, style: TextStyle(color: MyTheme.textAccent)),
          ),
        ],
      ),
    );
  }

  // ✅ فتح ديلوج طلب المبلغ مع رقم حساب مسبق
  void _openRequestMoneyWithAccount(String accountNumber) {
    final s = AppLocalizations.of(context)!;
    final TextEditingController accountController = TextEditingController(text: accountNumber);
    final TextEditingController amountController = TextEditingController();
    final TextEditingController noteController = TextEditingController();
    bool isLoading = false;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) {
          return AlertDialog(
            backgroundColor: MyTheme.backgroundCard,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: MyTheme.backgroundTransparent,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: MyTheme.borderNormal),
                  ),
                  child: Icon(Icons.request_page_outlined, color: MyTheme.textAccent, size: 22),
                ),
                const SizedBox(width: 12),
                Text(
                  s.request_money_title,
                  style: const TextStyle(color: MyTheme.textAccent, fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.person_account_number,
                  style: TextStyle(color: MyTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    color: MyTheme.backgroundTransparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: MyTheme.borderNormal),
                  ),
                  child: TextField(
                    controller: accountController,
                    readOnly: true,
                    enabled: false,
                    textAlign: TextAlign.right,
                    style: TextStyle(color: MyTheme.textAccent, fontSize: 15, fontWeight: FontWeight.bold),
                    decoration: InputDecoration(
                      prefixIcon: Icon(Icons.account_balance_outlined, color: MyTheme.textAccent, size: 20),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  s.amount_label,
                  style: TextStyle(color: MyTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    color: MyTheme.backgroundTransparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: MyTheme.borderNormal),
                  ),
                  child: TextField(
                    controller: amountController,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}'))
                    ],
                    textAlign: TextAlign.right,
                    style: TextStyle(color: MyTheme.textPrimary, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: '0.00',
                      hintStyle: TextStyle(color: MyTheme.textPrimary.withOpacity(0.4), fontSize: 14),
                      prefixIcon: Icon(Icons.attach_money, color: MyTheme.textAccent, size: 20),
                      suffixText: s.currency_egp,
                      suffixStyle: TextStyle(color: MyTheme.textPrimary, fontSize: 14),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  s.request_reason_optional,
                  style: TextStyle(color: MyTheme.textPrimary, fontSize: 14, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    color: MyTheme.backgroundTransparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: MyTheme.borderNormal),
                  ),
                  child: TextField(
                    controller: noteController,
                    textAlign: TextAlign.right,
                    style: TextStyle(color: MyTheme.textPrimary, fontSize: 15),
                    decoration: InputDecoration(
                      hintText: s.request_reason_hint,
                      hintStyle: TextStyle(color: MyTheme.textPrimary.withOpacity(0.4), fontSize: 14),
                      prefixIcon: Icon(Icons.note_outlined, color: MyTheme.textAccent, size: 20),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: Text(s.cancel, style: TextStyle(color: MyTheme.textPrimary)),
              ),
              ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () async {
                  if (amountController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(s.please_complete_data),
                        backgroundColor: Colors.redAccent,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                    return;
                  }
                  setDialogState(() => isLoading = true);

                  try {
                    // ✅ استدعاء API طلب المبلغ الحقيقي
                    final response = await _repo.requestMoney(
                      toAccountNumber: accountController.text.trim(),
                      amount: double.parse(amountController.text),
                      note: noteController.text.isNotEmpty ? noteController.text : null,
                    );

                    if (context.mounted) {
                      Navigator.pop(ctx);
                      _showSuccessSnackbar(
                        response['message'] ?? '${s.request_sent_success} ${accountController.text}',
                      );
                    }
                  } catch (e) {
                    setDialogState(() => isLoading = false);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(e.toString().replaceAll('Exception: ', '')),
                        backgroundColor: Colors.redAccent,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: MyTheme.textAccent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: isLoading
                    ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2, color: MyTheme.backgroundMain),
                )
                    : Text(s.send_request, style: const TextStyle(color: MyTheme.backgroundMain)),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showSuccessSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: MyTheme.textAccent.withOpacity(0.9),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  String _formatBalance(double? balance) {
    final s = AppLocalizations.of(context)!;
    if (balance == null) return '---';
    return '${balance.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (m) => '${m[1]},',
    )} ${s.currency_egp_text}';
  }

  String _formatDate(DateTime? date, AppLocalizations s) {
    if (date == null) return '';
    try {
      final now = DateTime.now();
      final diff = now.difference(date);
      if (diff.inDays == 0) return s.today;
      if (diff.inDays == 1) return s.yesterday;
      return '${date.day}/${date.month}/${date.year}';
    } catch (_) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    _loadQuickActions(s);

    return Scaffold(
      backgroundColor: MyTheme.backgroundMain,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                color: MyTheme.backgroundCard,
                boxShadow: [MyTheme.shadowDark],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(s.welcome_greeting,
                          style: TextStyle(
                              color: MyTheme.textPrimary.withOpacity(0.7),
                              fontSize: 14)),
                      const SizedBox(height: 4),
                      _isLoadingAccount
                          ? _buildShimmerText(width: 100, height: 20)
                          : Text(
                        _userName ?? s.welcome_greeting,
                        style: TextStyle(
                            color: MyTheme.textAccent,
                            fontSize: 20,
                            fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      _buildHeaderIcon(Icons.notifications_outlined),
                      const SizedBox(width: 10),
                      _buildHeaderIcon(Icons.person_outline),
                    ],
                  ),
                ],
              ),
            ),

            Expanded(
              child: RefreshIndicator(
                onRefresh: _loadData,
                color: MyTheme.textAccent,
                backgroundColor: MyTheme.backgroundCard,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),

                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 20),
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              const Color(0xFF0A2438),
                              MyTheme.textAccent.withOpacity(0.6),
                              MyTheme.textPrimary.withOpacity(0.4),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: MyTheme.borderNormal),
                          boxShadow: [MyTheme.shadowPrimary],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(s.current_balance,
                                    style: TextStyle(
                                        color: MyTheme.textWhite.withOpacity(0.7),
                                        fontSize: 14)),
                                GestureDetector(
                                  onTap: () =>
                                      setState(() => _showBalance = !_showBalance),
                                  child: Icon(
                                    _showBalance
                                        ? Icons.visibility_outlined
                                        : Icons.visibility_off_outlined,
                                    color: MyTheme.textWhite.withOpacity(0.7),
                                    size: 20,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            _isLoadingAccount
                                ? _buildShimmerText(width: 160, height: 36)
                                : Text(
                              _showBalance
                                  ? _formatBalance(_account?.balance)
                                  : '••••••',
                              style: const TextStyle(
                                  color: MyTheme.textWhite,
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 20),
                            Row(
                              children: [
                                Expanded(
                                    child: _buildBalanceSubCard(
                                      icon: Icons.arrow_downward,
                                      iconColor: MyTheme.textAccent,
                                      label: s.income,
                                      value: _calcIncome(),
                                    )),
                                const SizedBox(width: 12),
                                Expanded(
                                    child: _buildBalanceSubCard(
                                      icon: Icons.arrow_upward,
                                      iconColor: MyTheme.textPrimary,
                                      label: s.expenses,
                                      value: _calcExpenses(),
                                    )),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: _quickActions.asMap().entries.map((entry) {
                            final index = entry.key;
                            final action = entry.value;
                            return Expanded(
                              child: Container(
                                margin: const EdgeInsets.symmetric(horizontal: 4),
                                child: Column(
                                  children: [
                                    GestureDetector(
                                      onTap: () {
                                        if (index == 0) _openRequestMoneyDialog();
                                        if (index == 1) _openQrScanner();
                                      },
                                      child: Container(
                                        padding: const EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          color: MyTheme.backgroundCard,
                                          borderRadius: BorderRadius.circular(12),
                                          border: Border.all(color: MyTheme.borderNormal),
                                          boxShadow: [MyTheme.shadowDark],
                                        ),
                                        child: Icon(action['icon'],
                                            color: action['color'], size: 26),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(action['name'],
                                        style: TextStyle(
                                            color: MyTheme.textPrimary,
                                            fontSize: 12,
                                            fontWeight: FontWeight.w500)),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 30),

                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(s.recent_transactions,
                                    style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: MyTheme.textAccent)),
                                Text(s.view_all,
                                    style: TextStyle(
                                        color: MyTheme.textAccent,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600)),
                              ],
                            ),
                            const SizedBox(height: 16),
                            _isLoadingTransactions
                                ? _buildTransactionShimmer()
                                : _transactionsError != null
                                ? _buildErrorWidget(_transactionsError!, _loadTransactions)
                                : _transactions.isEmpty
                                ? Center(
                              child: Padding(
                                padding: const EdgeInsets.all(32),
                                child: Text(s.no_transactions_yet,
                                    style: TextStyle(
                                        color: MyTheme.textPrimary
                                            .withOpacity(0.5))),
                              ),
                            )
                                : ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _transactions.length,
                              itemBuilder: (context, index) {
                                final tx = _transactions[index];
                                final isPositive = tx.amount > 0;
                                return Container(
                                  margin: const EdgeInsets.only(bottom: 10),
                                  padding: const EdgeInsets.all(16),
                                  decoration: MyTheme.cardDecoration,
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: MyTheme.backgroundTransparent,
                                          borderRadius: BorderRadius.circular(10),
                                          border: Border.all(color: MyTheme.borderTransparent),
                                        ),
                                        child: Icon(
                                          isPositive
                                              ? Icons.arrow_downward
                                              : Icons.arrow_upward,
                                          color: isPositive
                                              ? MyTheme.textAccent
                                              : MyTheme.textPrimary,
                                          size: 20,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              tx.description,
                                              style: TextStyle(
                                                  fontSize: 15,
                                                  fontWeight: FontWeight.w600,
                                                  color: MyTheme.textPrimary),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              _formatDate(tx.date, s),
                                              style: TextStyle(
                                                  fontSize: 12,
                                                  color: MyTheme.textPrimary.withOpacity(0.6)),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Text(
                                        '${isPositive ? '+' : ''}${tx.amount.toStringAsFixed(0)} ${s.currency_egp}',
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.bold,
                                          color: isPositive
                                              ? MyTheme.textAccent
                                              : MyTheme.textPrimary,
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _calcIncome() {
    if (_isLoadingTransactions) return '---';
    final total = _transactions
        .where((t) => t.amount > 0)
        .fold<double>(0, (sum, t) => sum + t.amount);
    return total.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (m) => '${m[1]},',
    );
  }

  String _calcExpenses() {
    if (_isLoadingTransactions) return '---';
    final total = _transactions
        .where((t) => t.amount < 0)
        .fold<double>(0, (sum, t) => sum + t.amount.abs());
    return total.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (m) => '${m[1]},',
    );
  }

  Widget _buildShimmerText({required double width, required double height}) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: MyTheme.backgroundTransparent,
        borderRadius: BorderRadius.circular(8),
      ),
    );
  }

  Widget _buildTransactionShimmer() {
    return Column(
      children: List.generate(
        3,
            (_) => Container(
          margin: const EdgeInsets.only(bottom: 10),
          height: 72,
          decoration: BoxDecoration(
            color: MyTheme.backgroundCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: MyTheme.borderNormal),
          ),
        ),
      ),
    );
  }

  Widget _buildErrorWidget(String error, VoidCallback onRetry) {
    final s = AppLocalizations.of(context)!;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Icon(Icons.wifi_off_outlined,
                color: MyTheme.textPrimary.withOpacity(0.4), size: 40),
            const SizedBox(height: 12),
            Text(error.replaceAll('Exception: ', ''),
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: MyTheme.textPrimary.withOpacity(0.6), fontSize: 13)),
            const SizedBox(height: 16),
            TextButton.icon(
              onPressed: onRetry,
              icon: Icon(Icons.refresh, color: MyTheme.textAccent, size: 18),
              label: Text(s.try_again,
                  style: TextStyle(color: MyTheme.textAccent)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderIcon(IconData icon) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: MyTheme.backgroundTransparent,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: MyTheme.borderTransparent),
      ),
      child: Icon(icon, color: MyTheme.textAccent, size: 22),
    );
  }

  Widget _buildBalanceSubCard({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: MyTheme.borderTransparent),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: iconColor, size: 20),
          const SizedBox(height: 8),
          Text(label,
              style: TextStyle(
                  color: MyTheme.textWhite.withOpacity(0.7), fontSize: 12)),
          const SizedBox(height: 4),
          Text(value,
              style: TextStyle(
                  color: MyTheme.textWhite,
                  fontSize: 18,
                  fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
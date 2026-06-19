import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../l10n/app_localizations.dart';
import '../my_theme.dart';
import 'account_cubit.dart';
import 'account_state.dart';
import 'account_model.dart';
import 'account_repository.dart';
import 'add_card.dart';

class AccountDetails extends StatefulWidget {
  static const String routeName = 'account-details';

  const AccountDetails({super.key});

  @override
  _AccountDetailsState createState() => _AccountDetailsState();
}

class _AccountDetailsState extends State<AccountDetails>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool showBalance = true;
  String? selectedService;

  AccountModel? _selectedAccount;
  String? _userName;

  final _formKey = GlobalKey<FormState>();

  final transferAmountController = TextEditingController();
  final billAmountController = TextEditingController();
  final accountController = TextEditingController();
  final noteController = TextEditingController();
  final billNumberController = TextEditingController();
  final searchController = TextEditingController();

  String? _selectedProvider;

  final List<Map<String, dynamic>> services = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
    _tabController.addListener(_onTabChanged);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AccountCubit>().getAccounts();
      _loadUserName();
    });
  }

  Future<void> _loadUserName() async {
    try {
      final repo = AccountRepository();
      final profile = await repo.getProfile();
      final profileData = profile['profile'] as Map<String, dynamic>? ?? profile;
      if (mounted) {
        setState(() => _userName = profileData['fullName'] as String?);
      }
    } catch (_) {}
  }

  void _loadServices(AppLocalizations s) {
    if (services.isNotEmpty) return;
    services.addAll([
      {
        'name': s.service_electricity,
        'icon': Icons.electric_bolt,
        'color': MyTheme.textAccent,
        'serviceType': 'electricity',
        'provider': 'EEHC',
      },
      {
        'name': s.service_water,
        'icon': Icons.water_drop,
        'color': MyTheme.borderNormal,
        'serviceType': 'water',
        'provider': 'NWCO',
      },
      {
        'name': s.service_gas,
        'icon': Icons.local_fire_department,
        'color': MyTheme.textError,
        'serviceType': 'gas',
        'provider': 'EGAS',
      },
      {
        'name': s.service_internet,
        'icon': Icons.wifi,
        'color': MyTheme.textAccent,
        'serviceType': 'internet',
        'provider': 'TE',
      },
      {
        'name': s.service_phone,
        'icon': Icons.phone,
        'color': MyTheme.textPrimary,
        'serviceType': 'phone',
        'provider': 'Telecom Egypt',
      },
    ]);
  }

  void _onTabChanged() {
    if (_tabController.indexIsChanging) return;
    switch (_tabController.index) {
      case 0:
        context.read<AccountCubit>().getAccounts();
        break;
      case 1:
        context.read<AccountCubit>().getTransactions();
        break;
      case 5:
        context.read<AccountCubit>().getCards();
        break;
    }
  }

  @override
  void dispose() {
    _tabController.removeListener(_onTabChanged);
    _tabController.dispose();
    transferAmountController.dispose();
    billAmountController.dispose();
    accountController.dispose();
    noteController.dispose();
    billNumberController.dispose();
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    _loadServices(s);

    return BlocListener<AccountCubit, AccountState>(
      listener: (context, state) {
        if (state is TransferSuccess) {
          _showSuccessDialog(state.message);
          transferAmountController.clear();
          accountController.clear();
          noteController.clear();
        }
        if (state is BillPaymentSuccess) {
          _showSuccessDialog(state.message);
          billNumberController.clear();
          billAmountController.clear();
          setState(() => selectedService = null);
        }
        if (state is CardFrozen) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(s.card_deactivated),
              backgroundColor: MyTheme.textError,
              behavior: SnackBarBehavior.floating,
            ),
          );
          context.read<AccountCubit>().getCards();
        }
        if (state is CardUnfrozen) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(s.card_activated),
              backgroundColor: MyTheme.textAccent,
              behavior: SnackBarBehavior.floating,
            ),
          );
          context.read<AccountCubit>().getCards();
        }
        if (state is CardReportedLost) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(s.card_reported_lost),
              backgroundColor: MyTheme.textError,
              behavior: SnackBarBehavior.floating,
            ),
          );
          context.read<AccountCubit>().getCards();
        }
        if (state is AccountError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: MyTheme.textError,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
        // ✅ الإصلاح: تحديث _selectedAccount بالـ reference الجديد من الـ list
        if (state is AccountsLoaded && state.accounts.isNotEmpty) {
          setState(() {
            if (_selectedAccount == null) {
              _selectedAccount = state.accounts.first;
            } else {
              _selectedAccount = state.accounts.firstWhere(
                    (a) => a.id == _selectedAccount!.id,
                orElse: () => state.accounts.first,
              );
            }
          });
        }
      },
      child: Scaffold(
        backgroundColor: MyTheme.backgroundMain,
        appBar: AppBar(
          title: Text(s.accounts_and_services,
              style: TextStyle(color: MyTheme.textWhite)),
          backgroundColor: MyTheme.backgroundCard,
          elevation: 0,
          iconTheme: IconThemeData(color: MyTheme.textWhite),
          bottom: TabBar(
            controller: _tabController,
            isScrollable: true,
            indicatorColor: MyTheme.textAccent,
            indicatorWeight: 3,
            labelColor: MyTheme.textAccent,
            unselectedLabelColor: MyTheme.textPrimary,
            tabs: [
              Tab(text: s.tab_account_details),
              Tab(text: s.tab_transactions),
              Tab(text: s.tab_transfer_funds),
              Tab(text: s.tab_pay_bills),
              Tab(text: s.tab_qr_code),
              Tab(text: s.tab_cards),
            ],
          ),
        ),
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildAccountDetails(),
            _buildTransactionHistory(),
            _buildFundTransfer(),
            _buildBillPayment(),
            _buildQrCodeSection(),
            _buildCardManagement(),
          ],
        ),
      ),
    );
  }

  // ===================================================
  // ✅ تبويب QR Code
  // ===================================================
  Widget _buildQrCodeSection() {
    final s = AppLocalizations.of(context)!;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  MyTheme.backgroundCard,
                  MyTheme.borderNormal,
                ],
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: MyTheme.textAccent.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(Icons.qr_code_scanner,
                      color: MyTheme.textAccent, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        s.qr_code_title,
                        style: TextStyle(
                          color: MyTheme.textWhite,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        s.qr_code_subtitle,
                        style: TextStyle(
                          color: MyTheme.textPrimary.withOpacity(0.7),
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          if (_selectedAccount != null) ...[
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: MyTheme.backgroundCard,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: MyTheme.borderNormal),
                boxShadow: [MyTheme.shadowPrimary],
              ),
              child: Column(
                children: [
                  Text(
                    s.your_qr_code,
                    style: TextStyle(
                      color: MyTheme.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: QrImageView(
                      data: _selectedAccount!.number,
                      version: QrVersions.auto,
                      size: 200.0,
                      eyeStyle: const QrEyeStyle(
                        color: Colors.black,
                        eyeShape: QrEyeShape.square,
                      ),
                      dataModuleStyle: const QrDataModuleStyle(
                        color: Colors.black,
                        dataModuleShape: QrDataModuleShape.square,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: MyTheme.textAccent.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                          color: MyTheme.textAccent.withOpacity(0.3)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.account_balance_wallet,
                            color: MyTheme.textAccent, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          _selectedAccount!.number,
                          style: TextStyle(
                            color: MyTheme.textAccent,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    s.qr_code_share_hint,
                    style: TextStyle(
                      color: MyTheme.textPrimary.withOpacity(0.6),
                      fontSize: 12,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ] else ...[
            Center(
              child: Column(
                children: [
                  Icon(Icons.qr_code,
                      color: MyTheme.textPrimary.withOpacity(0.4),
                      size: 80),
                  const SizedBox(height: 16),
                  Text(
                    s.loading_qr,
                    style: TextStyle(
                      color: MyTheme.textPrimary.withOpacity(0.6),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 24),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: MyTheme.textAccent,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: _openQrScanner,
              icon: Icon(Icons.qr_code_scanner, color: MyTheme.backgroundMain),
              label: Text(
                s.scan_qr_code,
                style: TextStyle(
                  color: MyTheme.backgroundMain,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: MyTheme.textAccent.withOpacity(0.08),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: MyTheme.textAccent.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Icon(Icons.info_outline, color: MyTheme.textAccent, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    s.qr_code_info,
                    style: TextStyle(
                      color: MyTheme.textPrimary.withOpacity(0.8),
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _openQrScanner() {
    final s = AppLocalizations.of(context)!;

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            title: Text(s.scan_qr_code,
                style: const TextStyle(color: MyTheme.textWhite)),
            backgroundColor: Colors.black,
            leading: IconButton(
              icon: const Icon(Icons.close, color: MyTheme.textWhite),
              onPressed: () => Navigator.pop(context),
            ),
          ),
          body: MobileScanner(
            onDetect: (BarcodeCapture capture) {
              final List<Barcode> barcodes = capture.barcodes;
              for (final barcode in barcodes) {
                final String? rawValue = barcode.rawValue;
                if (rawValue != null && rawValue.isNotEmpty) {
                  Navigator.pop(context);
                  _showScannedData(rawValue);
                  break;
                }
              }
            },
          ),
        ),
      ),
    );
  }

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
            Text(s.scan_result,
                style: TextStyle(color: MyTheme.textAccent, fontSize: 18)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              s.scanned_account_number,
              style: TextStyle(
                  color: MyTheme.textPrimary, fontWeight: FontWeight.bold),
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
                style: TextStyle(color: MyTheme.textAccent, fontSize: 16),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child:
            Text(s.cancel, style: TextStyle(color: MyTheme.textPrimary)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _tabController.animateTo(2);
              accountController.text = data;
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: MyTheme.textAccent,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(s.transfer_to_this_account,
                style: TextStyle(color: MyTheme.backgroundMain)),
          ),
        ],
      ),
    );
  }

  // ===================================================
  // 1. تفاصيل الحساب
  // ===================================================
  Widget _buildAccountDetails() {
    final s = AppLocalizations.of(context)!;

    return BlocBuilder<AccountCubit, AccountState>(
      builder: (context, state) {
        if (state is AccountLoading) return _buildLoader();
        if (state is AccountError) return _buildError(
          state.message,
              () => context.read<AccountCubit>().getAccounts(),
        );
        if (state is AccountsLoaded) {
          if (state.accounts.isEmpty) {
            return Center(
              child: Text(s.no_accounts_found,
                  style: TextStyle(color: MyTheme.textPrimary)),
            );
          }
          final account = _selectedAccount ?? state.accounts.first;
          return _buildAccountDetailsContent(account, state.accounts);
        }
        return _buildLoader();
      },
    );
  }

  Widget _buildAccountDetailsContent(
      AccountModel account, List<AccountModel> allAccounts) {
    final s = AppLocalizations.of(context)!;

    // ✅ الإصلاح: البحث بالـ id بدل contains لتجنب مشكلة reference equality
    final validSelectedAccount = _selectedAccount != null
        ? allAccounts.firstWhere(
          (a) => a.id == _selectedAccount!.id,
      orElse: () => allAccounts.first,
    )
        : allAccounts.first;

    return SingleChildScrollView(
      child: Column(
        children: [
          if (allAccounts.length > 1)
            Container(
              padding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              color: MyTheme.backgroundCard,
              child: DropdownButton<AccountModel>(
                value: validSelectedAccount,
                isExpanded: true,
                dropdownColor: MyTheme.backgroundCard,
                style: const TextStyle(color: MyTheme.textWhite),
                underline: const SizedBox(),
                items: allAccounts.map((a) {
                  return DropdownMenuItem<AccountModel>(
                    value: a,
                    child: Text(
                        '${a.name} - ****${a.number.substring(a.number.length - 4)}'),
                  );
                }).toList(),
                onChanged: (AccountModel? val) {
                  if (val != null) {
                    setState(() => _selectedAccount = val);
                  }
                },
              ),
            ),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [MyTheme.backgroundCard, MyTheme.borderNormal],
              ),
            ),
            child: Column(
              children: [
                if (_userName != null) ...[
                  Text(
                    _userName!,
                    style: const TextStyle(
                      color: MyTheme.textAccent,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
                Text(s.current_balance,
                    style: const TextStyle(
                        color: MyTheme.textPrimary, fontSize: 14)),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      showBalance
                          ? '${validSelectedAccount.balance.toStringAsFixed(2)} ${s.currency_egp}'
                          : '****.**',
                      style: const TextStyle(
                          color: MyTheme.textWhite,
                          fontSize: 32,
                          fontWeight: FontWeight.bold),
                    ),
                    IconButton(
                      icon: Icon(
                        showBalance
                            ? Icons.visibility_outlined
                            : Icons.visibility_off_outlined,
                        color: MyTheme.textAccent,
                      ),
                      onPressed: () =>
                          setState(() => showBalance = !showBalance),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '${validSelectedAccount.type} - ****${validSelectedAccount.number.substring(validSelectedAccount.number.length - 4)}',
                  style: const TextStyle(
                      color: MyTheme.textPrimary, fontSize: 13),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(s.account_info,
                    style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: MyTheme.textPrimary)),
                const SizedBox(height: 16),
                _buildInfoCard([
                  if (_userName != null)
                    _buildDetailRow(s.customer_name, _userName!),
                  _buildDetailRow(
                      s.account_number, validSelectedAccount.number),
                  _buildDetailRow(s.account_type, validSelectedAccount.type),
                  _buildDetailRow(
                      s.currency, validSelectedAccount.currency),
                ]),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ===================================================
  // 2. المعاملات
  // ===================================================
  Widget _buildTransactionHistory() {
    final s = AppLocalizations.of(context)!;

    return BlocBuilder<AccountCubit, AccountState>(
      builder: (context, state) {
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              color: MyTheme.backgroundCard,
              child: TextField(
                controller: searchController,
                style: TextStyle(color: MyTheme.textWhite),
                decoration: InputDecoration(
                  hintText: s.search_transactions,
                  hintStyle: TextStyle(
                      color: MyTheme.textPrimary.withOpacity(0.5)),
                  prefixIcon:
                  Icon(Icons.search, color: MyTheme.textAccent),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: MyTheme.borderNormal),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide:
                    BorderSide(color: MyTheme.textAccent, width: 2),
                  ),
                  filled: true,
                  fillColor: MyTheme.backgroundTransparent,
                ),
                onSubmitted: (_) =>
                    context.read<AccountCubit>().getTransactions(),
              ),
            ),
            Expanded(
              child: () {
                if (state is AccountLoading) return _buildLoader();
                if (state is AccountError) return _buildError(
                  state.message,
                      () => context.read<AccountCubit>().getTransactions(),
                );
                if (state is TransactionsLoaded) {
                  final query = searchController.text.toLowerCase();
                  final filtered = query.isEmpty
                      ? state.transactions
                      : state.transactions
                      .where((t) =>
                      t.description.toLowerCase().contains(query))
                      .toList();

                  if (filtered.isEmpty) {
                    return Center(
                      child: Text(s.no_transactions_found,
                          style: TextStyle(color: MyTheme.textPrimary)),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final t = filtered[index];
                      bool isPositive = t.amount > 0;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: MyTheme.backgroundCard,
                          borderRadius: BorderRadius.circular(12),
                          border:
                          Border.all(color: MyTheme.borderNormal),
                          boxShadow: [MyTheme.shadowDark],
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: MyTheme.backgroundTransparent,
                                border: Border.all(
                                  color: isPositive
                                      ? MyTheme.textAccent
                                      : MyTheme.textError,
                                ),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(
                                isPositive
                                    ? Icons.add_circle
                                    : Icons.remove_circle,
                                color: isPositive
                                    ? MyTheme.textAccent
                                    : MyTheme.textError,
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment:
                                CrossAxisAlignment.start,
                                children: [
                                  Text(t.description,
                                      style: TextStyle(
                                          fontWeight: FontWeight.w600,
                                          fontSize: 15,
                                          color: MyTheme.textPrimary)),
                                  const SizedBox(height: 4),
                                  Text(
                                    t.date != null
                                        ? '${t.date!.year}-${t.date!.month.toString().padLeft(2, '0')}-${t.date!.day.toString().padLeft(2, '0')}'
                                        : '—',
                                    style: TextStyle(
                                        color: MyTheme.textPrimary
                                            .withOpacity(0.6),
                                        fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              '${isPositive ? '+' : ''}${t.amount.toStringAsFixed(0)} ${s.currency_egp}',
                              style: TextStyle(
                                color: isPositive
                                    ? MyTheme.textAccent
                                    : MyTheme.textError,
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  );
                }
                return _buildLoader();
              }(),
            ),
          ],
        );
      },
    );
  }

  // ===================================================
  // 3. تحويل الأموال
  // ===================================================
  Widget _buildFundTransfer() {
    final s = AppLocalizations.of(context)!;

    return BlocBuilder<AccountCubit, AccountState>(
      builder: (context, state) {
        bool isLoading = state is AccountLoading;

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (_selectedAccount != null) ...[
                  BlocBuilder<AccountCubit, AccountState>(
                    builder: (context, accState) {
                      if (accState is AccountsLoaded &&
                          accState.accounts.length > 1) {
                        // ✅ الإصلاح: البحث بالـ id بدل contains
                        final validAccount = _selectedAccount != null
                            ? accState.accounts.firstWhere(
                              (a) => a.id == _selectedAccount!.id,
                          orElse: () => accState.accounts.first,
                        )
                            : accState.accounts.first;

                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(s.account_number_label,
                                style: TextStyle(
                                    color: MyTheme.textPrimary,
                                    fontSize: 14)),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12),
                              decoration: BoxDecoration(
                                color: MyTheme.backgroundCard,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                    color: MyTheme.borderNormal),
                              ),
                              child: DropdownButton<AccountModel>(
                                value: validAccount,
                                isExpanded: true,
                                dropdownColor: MyTheme.backgroundCard,
                                style: TextStyle(
                                    color: MyTheme.textWhite),
                                underline: const SizedBox(),
                                items: accState.accounts.map((a) {
                                  return DropdownMenuItem(
                                    value: a,
                                    child: Text(
                                        '${a.name} - ${a.balance.toStringAsFixed(0)} ${s.currency_egp}'),
                                  );
                                }).toList(),
                                onChanged: (val) =>
                                    setState(() => _selectedAccount = val),
                              ),
                            ),
                            const SizedBox(height: 16),
                          ],
                        );
                      }
                      return const SizedBox();
                    },
                  ),
                ],

                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: MyTheme.textAccent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                        color: MyTheme.textAccent.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.info_outline,
                          color: MyTheme.textAccent, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        s.transfer_info_message,
                        style: TextStyle(
                            color: MyTheme.textAccent, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                TextFormField(
                  controller: accountController,
                  style: TextStyle(color: MyTheme.textWhite),
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: s.account_number_label,
                    labelStyle: TextStyle(color: MyTheme.textPrimary),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: MyTheme.borderNormal),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide:
                      BorderSide(color: MyTheme.textAccent, width: 2),
                    ),
                    errorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: MyTheme.textError),
                    ),
                    focusedErrorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide:
                      BorderSide(color: MyTheme.textError, width: 2),
                    ),
                    prefixIcon: Icon(Icons.account_balance,
                        color: MyTheme.textAccent),
                    filled: true,
                    fillColor: MyTheme.backgroundCard,
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return s.field_required;
                    }
                    if (!RegExp(r'^\d+$').hasMatch(value.trim())) {
                      return s.account_number_digits_only;
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                _buildTextField(
                  transferAmountController,
                  s.amount_label,
                  Icons.money,
                  true,
                  suffixText: s.currency_egp,
                ),
                const SizedBox(height: 16),
                _buildTextField(noteController, s.notes_optional,
                    Icons.note, false,
                    maxLines: 3),
                const SizedBox(height: 24),

                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: MyTheme.textAccent,
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  onPressed: isLoading
                      ? null
                      : () {
                    if (_formKey.currentState!.validate()) {
                      _showConfirmTransferDialog(
                        toAccount: accountController.text.trim(),
                        amount: double.parse(
                            transferAmountController.text),
                        note: noteController.text,
                      );
                    }
                  },
                  child: isLoading
                      ? SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                        color: MyTheme.textWhite, strokeWidth: 2),
                  )
                      : Text(s.confirm_transfer,
                      style: TextStyle(
                          fontSize: 16, color: MyTheme.textWhite)),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ===================================================
  // 4. دفع الفواتير
  // ===================================================
  Widget _buildBillPayment() {
    final s = AppLocalizations.of(context)!;

    return BlocBuilder<AccountCubit, AccountState>(
      builder: (context, state) {
        bool isLoading = state is AccountLoading;
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(s.select_service,
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: MyTheme.textPrimary)),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1,
                ),
                itemCount: services.length,
                itemBuilder: (context, index) {
                  bool isSelected =
                      selectedService == services[index]['name'];
                  return GestureDetector(
                    onTap: () => setState(() {
                      selectedService = services[index]['name'];
                      _selectedProvider = services[index]['provider'];
                    }),
                    child: Container(
                      decoration: BoxDecoration(
                        color: isSelected
                            ? MyTheme.backgroundTransparent
                            : MyTheme.backgroundCard,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected
                              ? MyTheme.textAccent
                              : MyTheme.borderNormal,
                          width: isSelected ? 2 : 1,
                        ),
                        boxShadow:
                        isSelected ? [MyTheme.shadowPrimary] : [],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(services[index]['icon'],
                              size: 32,
                              color: isSelected
                                  ? MyTheme.textAccent
                                  : services[index]['color']),
                          const SizedBox(height: 8),
                          Text(services[index]['name'],
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: isSelected
                                    ? MyTheme.textAccent
                                    : MyTheme.textPrimary,
                              )),
                        ],
                      ),
                    ),
                  );
                },
              ),
              if (selectedService != null) ...[
                const SizedBox(height: 24),
                _buildTextField(billNumberController,
                    s.bill_number_label, Icons.receipt_long, true),
                const SizedBox(height: 12),
                _buildTextField(
                  billAmountController,
                  s.amount_label,
                  Icons.money,
                  true,
                  suffixText: s.currency_egp,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: MyTheme.textAccent,
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  onPressed: isLoading
                      ? null
                      : () {
                    if (billNumberController.text.isNotEmpty &&
                        billAmountController.text.isNotEmpty &&
                        _selectedAccount != null) {
                      final selectedServiceData =
                      services.firstWhere(
                              (s) => s['name'] == selectedService);
                      context.read<AccountCubit>().payBill(
                        fromAccountId: _selectedAccount!.id,
                        serviceType: selectedServiceData[
                        'serviceType'],
                        provider: _selectedProvider ?? '',
                        billNumber:
                        billNumberController.text.trim(),
                        amount: double.parse(
                            billAmountController.text),
                      );
                    }
                  },
                  child: isLoading
                      ? SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                        color: MyTheme.textWhite, strokeWidth: 2),
                  )
                      : Text(s.inquire_and_pay,
                      style: TextStyle(
                          fontSize: 16, color: MyTheme.textWhite)),
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  // ===================================================
  // 5. البطاقات
  // ===================================================
  Widget _buildCardManagement() {
    final s = AppLocalizations.of(context)!;

    return BlocBuilder<AccountCubit, AccountState>(
      builder: (context, state) {
        if (state is AccountLoading) return _buildLoader();
        if (state is AccountError) return _buildError(
          state.message,
              () => context.read<AccountCubit>().getCards(),
        );
        if (state is CardsLoaded) {
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: GestureDetector(
                  onTap: () => Navigator.pushNamed(
                      context, AddCardScreen.routeName),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: MyTheme.textAccent.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: MyTheme.textAccent.withOpacity(0.5),
                        width: 1.5,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: MyTheme.textAccent.withOpacity(0.15),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(Icons.add_card,
                              color: MyTheme.textAccent, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          s.request_new_card,
                          style: TextStyle(
                            color: MyTheme.textAccent,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Icon(Icons.arrow_forward_ios,
                            color: MyTheme.textAccent, size: 16),
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                child: state.cards.isEmpty
                    ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.credit_card_off,
                          color: MyTheme.textPrimary, size: 60),
                      const SizedBox(height: 16),
                      Text(
                        s.no_cards_yet,
                        style: TextStyle(
                            color: MyTheme.textPrimary,
                            fontSize: 16),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        s.request_new_card_hint,
                        style: TextStyle(
                            color: MyTheme.textPrimary
                                .withOpacity(0.6),
                            fontSize: 13),
                      ),
                    ],
                  ),
                )
                    : ListView.builder(
                  padding:
                  const EdgeInsets.fromLTRB(16, 8, 16, 16),
                  itemCount: state.cards.length,
                  itemBuilder: (context, index) {
                    final card = state.cards[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: card.isActive
                              ? [
                            MyTheme.backgroundCard,
                            MyTheme.borderNormal
                          ]
                              : [
                            const Color(0xFF0F2936),
                            const Color(0xFF1A3A47)
                          ],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: card.isActive
                              ? MyTheme.textAccent
                              : MyTheme.borderTransparent,
                          width: card.isActive ? 2 : 1,
                        ),
                        boxShadow: [MyTheme.shadowPrimary],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment:
                            MainAxisAlignment.spaceBetween,
                            children: [
                              Text(card.type,
                                  style: TextStyle(
                                      color: MyTheme.textWhite,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold)),
                              Icon(Icons.credit_card,
                                  color: MyTheme.textAccent,
                                  size: 28),
                            ],
                          ),
                          const SizedBox(height: 20),
                          Text(card.number,
                              style: TextStyle(
                                  color: MyTheme.textWhite,
                                  fontSize: 22,
                                  letterSpacing: 2)),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment:
                            MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment:
                                CrossAxisAlignment.start,
                                children: [
                                  Text(s.expiry_date,
                                      style: TextStyle(
                                          color: MyTheme.textPrimary,
                                          fontSize: 11)),
                                  Text(card.expiry,
                                      style: TextStyle(
                                          color: MyTheme.textWhite,
                                          fontSize: 14)),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: card.isActive
                                      ? MyTheme.textAccent
                                      : card.isFrozen
                                      ? MyTheme.borderNormal
                                      : MyTheme.textError,
                                  borderRadius:
                                  BorderRadius.circular(20),
                                ),
                                child: Text(
                                  card.isActive
                                      ? s.active
                                      : card.isFrozen
                                      ? s.frozen
                                      : s.inactive,
                                  style: TextStyle(
                                      color: MyTheme.textWhite,
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          if (!card.isLost)
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: card.isFrozen
                                    ? MyTheme.textAccent
                                    : MyTheme.textError,
                                minimumSize:
                                const Size(double.infinity, 40),
                                shape: RoundedRectangleBorder(
                                    borderRadius:
                                    BorderRadius.circular(10)),
                                elevation: 0,
                              ),
                              onPressed: () {
                                if (card.isFrozen) {
                                  context
                                      .read<AccountCubit>()
                                      .unfreezeCard(card.id);
                                } else {
                                  context
                                      .read<AccountCubit>()
                                      .freezeCard(card.id);
                                }
                              },
                              child: Text(
                                card.isFrozen
                                    ? s.activate_card
                                    : s.deactivate_card,
                                style: TextStyle(
                                    color: MyTheme.textWhite),
                              ),
                            ),
                          if (!card.isLost) ...[
                            const SizedBox(height: 8),
                            OutlinedButton.icon(
                              icon: Icon(Icons.report_problem,
                                  color: MyTheme.textError,
                                  size: 16),
                              label: Text(
                                s.report_lost_card,
                                style: TextStyle(
                                    color: MyTheme.textError),
                              ),
                              style: OutlinedButton.styleFrom(
                                minimumSize:
                                const Size(double.infinity, 40),
                                side: BorderSide(
                                    color: MyTheme.textError),
                                shape: RoundedRectangleBorder(
                                    borderRadius:
                                    BorderRadius.circular(10)),
                              ),
                              onPressed: () =>
                                  _showReportLostDialog(card.id),
                            ),
                          ],
                          if (card.isLost)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: MyTheme.textError
                                    .withOpacity(0.1),
                                borderRadius:
                                BorderRadius.circular(10),
                                border: Border.all(
                                    color: MyTheme.textError
                                        .withOpacity(0.5)),
                              ),
                              child: Text(
                                s.card_lost_reported,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    color: MyTheme.textError,
                                    fontSize: 13),
                              ),
                            ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        }
        return _buildLoader();
      },
    );
  }

  // ===================================================
  // Helpers
  // ===================================================
  Widget _buildLoader() => Center(
    child: CircularProgressIndicator(color: MyTheme.textAccent),
  );

  Widget _buildError(String message, VoidCallback onRetry) {
    final s = AppLocalizations.of(context)!;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, color: MyTheme.textError, size: 60),
          const SizedBox(height: 16),
          Text(message,
              style: TextStyle(color: MyTheme.textPrimary),
              textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: onRetry,
            style:
            ElevatedButton.styleFrom(backgroundColor: MyTheme.textAccent),
            child:
            Text(s.retry, style: TextStyle(color: MyTheme.textWhite)),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(List<Widget> children) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: MyTheme.backgroundCard,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: MyTheme.borderNormal),
      boxShadow: [MyTheme.shadowDark],
    ),
    child: Column(children: children),
  );

  Widget _buildDetailRow(String label, String value) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 10),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: TextStyle(
                color: MyTheme.textPrimary.withOpacity(0.7),
                fontSize: 14)),
        Text(value,
            style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
                color: MyTheme.textPrimary)),
      ],
    ),
  );

  Widget _buildTextField(
      TextEditingController controller,
      String label,
      IconData icon,
      bool isNumber, {
        String? suffixText,
        int maxLines = 1,
      }) {
    final s = AppLocalizations.of(context)!;

    return TextFormField(
      controller: controller,
      style: TextStyle(color: MyTheme.textWhite),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: MyTheme.textPrimary),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: MyTheme.borderNormal),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: MyTheme.textAccent, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: MyTheme.textError),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: MyTheme.textError, width: 2),
        ),
        prefixIcon: Icon(icon, color: MyTheme.textAccent),
        suffixText: suffixText,
        suffixStyle: TextStyle(color: MyTheme.textPrimary),
        filled: true,
        fillColor: MyTheme.backgroundCard,
      ),
      keyboardType: isNumber ? TextInputType.number : TextInputType.text,
      maxLines: maxLines,
      validator: (value) =>
      value!.isEmpty && maxLines == 1 ? s.field_required : null,
    );
  }

  void _showConfirmTransferDialog({
    required String toAccount,
    required double amount,
    required String note,
  }) {
    final s = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape:
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        title: Row(
          children: [
            Icon(Icons.swap_horiz, color: MyTheme.textAccent),
            const SizedBox(width: 8),
            Text(s.confirm_transfer_title,
                style: TextStyle(color: MyTheme.textWhite, fontSize: 18)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildConfirmRow(s.to_account, toAccount),
            const SizedBox(height: 8),
            _buildConfirmRow(s.amount_label,
                '${amount.toStringAsFixed(2)} ${s.currency_egp}'),
            if (note.isNotEmpty) ...[
              const SizedBox(height: 8),
              _buildConfirmRow(s.note, note),
            ],
          ],
        ),
        actions: [
          TextButton(
            child: Text(s.cancel,
                style: TextStyle(color: MyTheme.textPrimary)),
            onPressed: () => Navigator.pop(context),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: MyTheme.textAccent,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            child: Text(s.transfer,
                style: TextStyle(color: MyTheme.textWhite)),
            onPressed: () {
              Navigator.pop(context);
              context.read<AccountCubit>().transferFunds(
                fromAccountId: _selectedAccount?.id ?? '',
                toAccountNumber: toAccount,
                amount: amount,
                description: note.isNotEmpty ? note : null,
              );
            },
          ),
        ],
      ),
    );
  }

  void _showReportLostDialog(String cardId) {
    final s = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape:
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        title: Row(
          children: [
            Icon(Icons.warning, color: MyTheme.textError),
            const SizedBox(width: 8),
            Text(s.report_lost_card_title,
                style: TextStyle(color: MyTheme.textWhite, fontSize: 16)),
          ],
        ),
        content: Text(
          s.report_lost_card_confirmation,
          style: TextStyle(color: MyTheme.textPrimary),
        ),
        actions: [
          TextButton(
            child: Text(s.cancel,
                style: TextStyle(color: MyTheme.textPrimary)),
            onPressed: () => Navigator.pop(context),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: MyTheme.textError,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)),
            ),
            child:
            Text(s.report, style: TextStyle(color: MyTheme.textWhite)),
            onPressed: () {
              Navigator.pop(context);
              context.read<AccountCubit>().reportLostCard(cardId);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmRow(String label, String value) => Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Text(label,
          style: TextStyle(
              color: MyTheme.textPrimary.withOpacity(0.7),
              fontSize: 14)),
      Text(value,
          style: TextStyle(
              color: MyTheme.textWhite,
              fontWeight: FontWeight.bold,
              fontSize: 14)),
    ],
  );

  void _showSuccessDialog(String message) {
    final s = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape:
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle, color: MyTheme.textAccent, size: 70),
            const SizedBox(height: 16),
            Text(
              message,
              style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: MyTheme.textPrimary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
        actions: [
          TextButton(
            child:
            Text(s.ok, style: TextStyle(color: MyTheme.textAccent)),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }
}
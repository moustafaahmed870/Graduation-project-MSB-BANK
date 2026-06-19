import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../Account Details Screen/account_cubit.dart';
import '../Account Details Screen/account_model.dart';
import '../Account Details Screen/account_state.dart';
import '../my_theme.dart';
import '../l10n/app_localizations.dart';


class AdditionalServices extends StatefulWidget {
  @override
  _AdditionalServicesState createState() => _AdditionalServicesState();
}

class _AdditionalServicesState extends State<AdditionalServices>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(_onTabChanged);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AccountCubit>().getLoans();
    });
  }

  void _onTabChanged() {
    if (_tabController.indexIsChanging) return;
    switch (_tabController.index) {
      case 0:
        context.read<AccountCubit>().getLoans();
        break;
      case 1:
      // investments - بنجيب الـ cards عشان نعرض بيانات الائتمان
        context.read<AccountCubit>().getCards();
        break;
    }
  }

  @override
  void dispose() {
    _tabController.removeListener(_onTabChanged);
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;

    return BlocListener<AccountCubit, AccountState>(
      listener: (context, state) {
        if (state is AccountError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: MyTheme.textError,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
        if (state is CardApplicationSubmitted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: MyTheme.textAccent,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: MyTheme.backgroundMain,
        appBar: AppBar(
          title: Text(s.additional_services),
          backgroundColor: MyTheme.backgroundCard,
          elevation: 0,
          foregroundColor: MyTheme.textPrimary,
          bottom: TabBar(
            controller: _tabController,
            indicatorColor: MyTheme.textAccent,
            indicatorWeight: 3,
            labelStyle: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: MyTheme.textPrimary),
            unselectedLabelColor: MyTheme.textPrimary.withOpacity(0.6),
            tabs: [
              Tab(icon: Icon(Icons.credit_card, size: 20), text: s.loans_and_credit),
              Tab(icon: Icon(Icons.savings, size: 20), text: s.investments),
              Tab(icon: Icon(Icons.local_offer, size: 20), text: s.offers),
            ],
          ),
        ),
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildLoansAndCredit(),
            _buildInvestments(),
            _buildOffers(),
          ],
        ),
      ),
    );
  }

  // =============== القروض وبطاقات الائتمان ===============
  Widget _buildLoansAndCredit() {
    final s = AppLocalizations.of(context)!;

    return BlocBuilder<AccountCubit, AccountState>(
      builder: (context, state) {
        // ===== القروض =====
        Widget loansWidget;
        if (state is AccountLoading) {
          loansWidget = _buildSectionLoader();
        } else if (state is LoansLoaded) {
          loansWidget = state.loans.isEmpty
              ? _buildEmptyState(Icons.money_off, s.no_loans_available)
              : ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: state.loans.length,
            itemBuilder: (context, index) =>
                _buildLoanCard(state.loans[index]),
          );
        } else if (state is AccountError) {
          loansWidget = _buildSectionError(
              state.message, () => context.read<AccountCubit>().getLoans());
        } else {
          loansWidget = _buildSectionLoader();
        }

        // ===== بطاقات الائتمان =====
        Widget cardsWidget;
        if (state is CardsLoaded) {
          final creditCards =
          state.cards.where((c) => c.creditLimit > 0).toList();
          cardsWidget = creditCards.isEmpty
              ? _buildEmptyState(
              Icons.credit_card_off, s.no_credit_cards)
              : ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: creditCards.length,
            itemBuilder: (context, index) =>
                _buildCreditCardWidget(creditCards[index]),
          );
        } else {
          cardsWidget = const SizedBox();
        }

        return SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ===== سيكشن القروض =====
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(s.available_loans,
                            style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: MyTheme.textPrimary)),
                        TextButton.icon(
                          icon: Icon(Icons.add_circle_outline,
                              size: 18, color: MyTheme.textAccent),
                          label: Text(s.new_loan_request,
                              style:
                              TextStyle(color: MyTheme.textAccent)),
                          onPressed: () => _showLoanApplicationDialog(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    loansWidget,
                  ],
                ),
              ),

              Divider(
                  thickness: 8, color: MyTheme.borderTransparent),

              // ===== سيكشن البطاقات الائتمانية =====
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(s.credit_cards,
                            style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: MyTheme.textPrimary)),
                        TextButton.icon(
                          icon: Icon(Icons.add_card,
                              size: 18, color: MyTheme.textAccent),
                          label: Text(s.request_card,
                              style:
                              TextStyle(color: MyTheme.textAccent)),
                          onPressed: () => _showCreditCardDialog(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // ✅ جيب الكارتات لو لسه مش جايه
                    if (state is! CardsLoaded)
                      ElevatedButton.icon(
                        icon: Icon(Icons.refresh,
                            color: MyTheme.textWhite),
                        label: Text(s.load_cards,
                            style:
                            TextStyle(color: MyTheme.textWhite)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: MyTheme.textAccent,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () =>
                            context.read<AccountCubit>().getCards(),
                      )
                    else
                      cardsWidget,
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ===== كارت قرض واحد من الـ API =====
  Widget _buildLoanCard(Map<String, dynamic> loan) {
    final s = AppLocalizations.of(context)!;

    final String loanType = loan['type'] ?? 'personal';
    final double amount = (loan['amount'] ?? 0).toDouble();
    final double interestRate = (loan['interestRate'] ?? 0).toDouble();
    final int term = (loan['term'] ?? 0).toInt();
    final String status = loan['status'] ?? 'pending';
    final double monthlyPayment = (loan['monthlyPayment'] ?? 0).toDouble();
    final double remaining = (loan['remaining'] ?? amount).toDouble();
    final double paidPercentage = (loan['paidPercentage'] ?? 0).toDouble();

    final loanNames = {
      'personal': s.loan_personal,
      'car': s.loan_car,
      'mortgage': s.loan_mortgage,
    };
    final loanIcons = {
      'personal': Icons.person,
      'car': Icons.directions_car,
      'mortgage': Icons.home,
    };

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: MyTheme.cardDecoration,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: MyTheme.textAccent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                        color: MyTheme.borderNormal.withOpacity(0.3)),
                  ),
                  child: Icon(loanIcons[loanType] ?? Icons.attach_money,
                      color: MyTheme.textAccent, size: 28),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        loanNames[loanType] ?? s.loan_personal,
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: MyTheme.textPrimary),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getLoanStatusColor(status),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          _getLoanStatusLabel(status),
                          style: TextStyle(
                              color: MyTheme.textWhite, fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  '${amount.toStringAsFixed(0)} ${s.currency_egp}',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: MyTheme.textAccent),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // ===== تفاصيل القرض =====
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: MyTheme.backgroundCard.withOpacity(0.5),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: MyTheme.borderTransparent),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildLoanInfo(s.interest_rate, '$interestRate%',
                      Icons.percent),
                  Container(
                      width: 1,
                      height: 30,
                      color: MyTheme.borderNormal),
                  _buildLoanInfo(s.duration_months,
                      '$term ${s.months}', Icons.calendar_today),
                  Container(
                      width: 1,
                      height: 30,
                      color: MyTheme.borderNormal),
                  _buildLoanInfo(s.installment,
                      '${monthlyPayment.toStringAsFixed(0)} ${s.currency_egp}',
                      Icons.payments),
                ],
              ),
            ),

            // ===== شريط التقدم لو القرض approved =====
            if (status == 'approved') ...[
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(s.paid,
                      style: TextStyle(
                          color: MyTheme.textPrimary.withOpacity(0.7),
                          fontSize: 12)),
                  Text(
                    '${paidPercentage.toStringAsFixed(1)}%',
                    style: TextStyle(
                        color: MyTheme.textAccent,
                        fontWeight: FontWeight.bold,
                        fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: paidPercentage / 100,
                  backgroundColor: MyTheme.borderNormal,
                  valueColor: AlwaysStoppedAnimation<Color>(
                      MyTheme.textAccent),
                  minHeight: 6,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${s.remaining_amount} ${remaining.toStringAsFixed(0)} ${s.currency_egp}',
                style: TextStyle(
                    color: MyTheme.textPrimary.withOpacity(0.7),
                    fontSize: 12),
              ),
            ],

            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => _showLoanDetails(loan),
              style: ElevatedButton.styleFrom(
                backgroundColor: MyTheme.textAccent,
                minimumSize: const Size(double.infinity, 45),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
              child: Text(s.view_details,
                  style: TextStyle(color: MyTheme.textWhite)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoanInfo(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon,
            size: 20,
            color: MyTheme.textPrimary.withOpacity(0.7)),
        const SizedBox(height: 4),
        Text(label,
            style: TextStyle(
                color: MyTheme.textPrimary.withOpacity(0.7),
                fontSize: 11)),
        Text(value,
            style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                color: MyTheme.textPrimary)),
      ],
    );
  }

  // ===== كارت بطاقة ائتمانية من الـ API =====
  Widget _buildCreditCardWidget(CardModel card) {
    final s = AppLocalizations.of(context)!;
    final double usagePercentage = card.creditLimit > 0
        ? (card.used / card.creditLimit) * 100
        : 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: MyTheme.cardDecoration.copyWith(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: [
            MyTheme.textAccent.withOpacity(0.3),
            MyTheme.backgroundCard
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(card.name,
                    style: TextStyle(
                        color: MyTheme.textWhite,
                        fontSize: 20,
                        fontWeight: FontWeight.bold)),
                Icon(Icons.credit_card,
                    color: MyTheme.textWhite, size: 32),
              ],
            ),
            const SizedBox(height: 20),
            Text('**** **** **** ${card.number}',
                style: TextStyle(
                    color: MyTheme.textWhite,
                    fontSize: 20,
                    letterSpacing: 2)),
            const SizedBox(height: 8),
            Text(card.holder,
                style: TextStyle(
                    color: MyTheme.textPrimary.withOpacity(0.8),
                    fontSize: 14)),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(s.credit_limit,
                        style: TextStyle(
                            color: MyTheme.textPrimary.withOpacity(0.8),
                            fontSize: 12)),
                    Text(
                      '${card.creditLimit.toStringAsFixed(0)} ${s.currency_egp}',
                      style: TextStyle(
                          color: MyTheme.textWhite,
                          fontSize: 16,
                          fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(s.available,
                        style: TextStyle(
                            color: MyTheme.textPrimary.withOpacity(0.8),
                            fontSize: 12)),
                    Text(
                      '${card.available.toStringAsFixed(0)} ${s.currency_egp}',
                      style: TextStyle(
                          color: MyTheme.textWhite,
                          fontSize: 16,
                          fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
            if (card.creditLimit > 0) ...[
              const SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: usagePercentage / 100,
                  backgroundColor:
                  MyTheme.textWhite.withOpacity(0.3),
                  valueColor: AlwaysStoppedAnimation<Color>(
                    usagePercentage > 80
                        ? MyTheme.textError
                        : MyTheme.textAccent,
                  ),
                  minHeight: 8,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '${s.used_percentage} ${usagePercentage.toStringAsFixed(1)}%',
                style: TextStyle(
                    color: MyTheme.textPrimary.withOpacity(0.8),
                    fontSize: 12),
              ),
            ],
          ],
        ),
      ),
    );
  }

  // =============== الاستثمار ===============
  Widget _buildInvestments() {
    final s = AppLocalizations.of(context)!;

    // ✅ Static investment plans - مش موجودين في الباك كـ user data
    // بس بنعرض فرص الاستثمار المتاحة
    final List<Map<String, dynamic>> investmentPlans = [
      {
        'name': s.equity_fund,
        'minAmount': 25000.0,
        'returnRate': 8.5,
        'duration': 12,
        'risk': s.risk_medium,
        'icon': Icons.trending_up,
      },
      {
        'name': s.savings_certificates,
        'minAmount': 50000.0,
        'returnRate': 12.0,
        'duration': 36,
        'risk': s.risk_low,
        'icon': Icons.account_balance,
      },
      {
        'name': s.bond_fund,
        'minAmount': 15000.0,
        'returnRate': 6.0,
        'duration': 24,
        'risk': s.risk_low,
        'icon': Icons.pie_chart,
      },
      {
        'name': s.islamic_investment,
        'minAmount': 30000.0,
        'returnRate': 7.5,
        'duration': 18,
        'risk': s.risk_medium,
        'icon': Icons.mosque,
      },
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ===== ملخص الاستثمار =====
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  MyTheme.textAccent.withOpacity(0.4),
                  MyTheme.backgroundCard
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: MyTheme.borderNormal),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment:
                  MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment:
                      CrossAxisAlignment.start,
                      children: [
                        Text(s.total_investments,
                            style: TextStyle(
                                color: MyTheme.textPrimary
                                    .withOpacity(0.8),
                                fontSize: 14)),
                        const SizedBox(height: 8),
                        Text(
                          s.investments,
                          style: TextStyle(
                              color: MyTheme.textWhite,
                              fontSize: 22,
                              fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Icon(Icons.account_balance_wallet,
                        color: MyTheme.textAccent, size: 40),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                s.available_investment_plans,
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: MyTheme.textPrimary),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // ===== خطط الاستثمار =====
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: investmentPlans.length,
            itemBuilder: (context, index) =>
                _buildInvestmentCard(investmentPlans[index]),
          ),
        ],
      ),
    );
  }

  Widget _buildInvestmentCard(Map<String, dynamic> investment) {
    final s = AppLocalizations.of(context)!;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: MyTheme.cardDecoration,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: MyTheme.textAccent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                        color:
                        MyTheme.borderNormal.withOpacity(0.3)),
                  ),
                  child: Icon(investment['icon'] as IconData,
                      color: MyTheme.textAccent, size: 28),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(investment['name'],
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: MyTheme.textPrimary)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.shield,
                              size: 14,
                              color: _getRiskColor(
                                  investment['risk'])),
                          const SizedBox(width: 4),
                          Text(
                            '${s.risk_label} ${investment['risk']}',
                            style: TextStyle(
                                fontSize: 12,
                                color: _getRiskColor(
                                    investment['risk'])),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color:
                MyTheme.backgroundCard.withOpacity(0.5),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                    color: MyTheme.borderTransparent),
              ),
              child: Row(
                mainAxisAlignment:
                MainAxisAlignment.spaceAround,
                children: [
                  _buildInvestmentStat(
                    s.minimum_amount,
                    '${(investment['minAmount'] as double).toStringAsFixed(0)} ${s.currency_egp}',
                  ),
                  Container(
                      width: 1,
                      height: 30,
                      color: MyTheme.borderNormal),
                  _buildInvestmentStat(
                    s.annual_return,
                    '${investment['returnRate']}%',
                  ),
                  Container(
                      width: 1,
                      height: 30,
                      color: MyTheme.borderNormal),
                  _buildInvestmentStat(
                    s.duration_months,
                    '${investment['duration']} ${s.months}',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => _showInvestmentDetails(investment),
              style: ElevatedButton.styleFrom(
                backgroundColor: MyTheme.textAccent,
                minimumSize: const Size(double.infinity, 45),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8)),
              ),
              child: Text(s.invest_now,
                  style: TextStyle(color: MyTheme.textWhite)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInvestmentStat(String label, String value) {
    return Column(
      children: [
        Text(label,
            style: TextStyle(
                color: MyTheme.textPrimary.withOpacity(0.7),
                fontSize: 11)),
        const SizedBox(height: 4),
        Text(value,
            style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                color: MyTheme.textPrimary)),
      ],
    );
  }

  // =============== العروض ===============
  Widget _buildOffers() {
    final s = AppLocalizations.of(context)!;

    // ✅ Static offers - مش موجودين في الباك
    final List<Map<String, dynamic>> offers = [
      {
        'title': s.offer_shopping_title,
        'description': s.offer_shopping_desc,
        'validUntil': '2025-12-31',
        'type': 'shopping',
      },
      {
        'title': s.offer_cashback_title,
        'description': s.offer_cashback_desc,
        'validUntil': '2025-12-25',
        'type': 'cashback',
      },
      {
        'title': s.offer_loan_title,
        'description': s.offer_loan_desc,
        'validUntil': '2025-12-20',
        'type': 'loan',
      },
      {
        'title': s.offer_premium_title,
        'description': s.offer_premium_desc,
        'validUntil': '2025-12-15',
        'type': 'premium',
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: offers.length,
      itemBuilder: (context, index) =>
          _buildOfferCard(offers[index]),
    );
  }

  Widget _buildOfferCard(Map<String, dynamic> offer) {
    final s = AppLocalizations.of(context)!;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: MyTheme.cardDecoration
          .copyWith(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: MyTheme.textAccent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                      _getOfferIcon(offer['type']),
                      color: MyTheme.textWhite,
                      size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(offer['title'],
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: MyTheme.textPrimary)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.access_time,
                              size: 14,
                              color: MyTheme.textPrimary
                                  .withOpacity(0.7)),
                          const SizedBox(width: 4),
                          Text(
                            '${s.expires_on} ${offer['validUntil']}',
                            style: TextStyle(
                                color: MyTheme.textPrimary
                                    .withOpacity(0.7),
                                fontSize: 12),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(offer['description'],
                style: TextStyle(
                    color: MyTheme.textPrimary.withOpacity(0.9),
                    fontSize: 14,
                    height: 1.5)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: Icon(Icons.share, size: 18),
                    label: Text(s.share),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: MyTheme.textAccent,
                      side: BorderSide(color: MyTheme.textAccent),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () {},
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    icon: Icon(Icons.check_circle_outline,
                        size: 18),
                    label: Text(s.use_now),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: MyTheme.textAccent,
                      foregroundColor: MyTheme.textWhite,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () => _activateOffer(offer),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // =============== Helper Widgets ===============
  Widget _buildSectionLoader() => const Padding(
    padding: EdgeInsets.all(32),
    child: Center(child: CircularProgressIndicator()),
  );

  Widget _buildSectionError(String msg, VoidCallback onRetry) {
    final s = AppLocalizations.of(context)!;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Icon(Icons.error_outline,
              color: MyTheme.textError, size: 40),
          const SizedBox(height: 8),
          Text(msg,
              style: TextStyle(color: MyTheme.textPrimary),
              textAlign: TextAlign.center),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: onRetry,
            style: ElevatedButton.styleFrom(
                backgroundColor: MyTheme.textAccent),
            child: Text(s.retry,
                style: TextStyle(color: MyTheme.textWhite)),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(IconData icon, String message) =>
      Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(icon, color: MyTheme.textPrimary, size: 48),
            const SizedBox(height: 8),
            Text(message,
                style: TextStyle(color: MyTheme.textPrimary),
                textAlign: TextAlign.center),
          ],
        ),
      );

  // =============== Helper Methods ===============
  Color _getLoanStatusColor(String status) {
    switch (status) {
      case 'approved': return Colors.greenAccent.withOpacity(0.8);
      case 'pending': return Colors.orangeAccent.withOpacity(0.8);
      case 'rejected': return MyTheme.textError.withOpacity(0.8);
      default: return MyTheme.textPrimary.withOpacity(0.5);
    }
  }

  String _getLoanStatusLabel(String status) {
    final s = AppLocalizations.of(context)!;
    switch (status) {
      case 'approved': return s.status_approved;
      case 'pending': return s.status_pending;
      case 'rejected': return s.status_rejected;
      default: return status;
    }
  }

  Color _getRiskColor(String risk) {
    switch (risk) {
      case 'منخفض':
      case 'Low':
        return Colors.greenAccent;
      case 'متوسط':
      case 'Medium':
        return Colors.orangeAccent;
      case 'عالي':
      case 'High':
        return MyTheme.textError;
      default:
        return MyTheme.textPrimary.withOpacity(0.5);
    }
  }

  IconData _getOfferIcon(String type) {
    switch (type) {
      case 'shopping': return Icons.shopping_bag;
      case 'cashback': return Icons.account_balance_wallet;
      case 'loan': return Icons.payments;
      case 'premium': return Icons.stars;
      default: return Icons.local_offer;
    }
  }

  // =============== Dialogs ===============
  void _showLoanApplicationDialog() {
    final s = AppLocalizations.of(context)!;
    final amountController = TextEditingController();
    final monthsController = TextEditingController();
    final incomeController = TextEditingController();
    String selectedType = 'personal';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: MyTheme.backgroundCard,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16)),
          title: Text(s.new_loan_request,
              style: TextStyle(color: MyTheme.textPrimary)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // نوع القرض
                DropdownButtonFormField<String>(
                  value: selectedType,
                  dropdownColor: MyTheme.backgroundCard,
                  style: TextStyle(color: MyTheme.textWhite),
                  decoration: InputDecoration(
                    labelText: s.loan_type,
                    labelStyle:
                    TextStyle(color: MyTheme.textPrimary),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8)),
                    prefixIcon: Icon(Icons.category,
                        color: MyTheme.textAccent),
                  ),
                  items: [
                    DropdownMenuItem(
                        value: 'personal',
                        child: Text(s.loan_personal)),
                    DropdownMenuItem(
                        value: 'car',
                        child: Text(s.loan_car)),
                    DropdownMenuItem(
                        value: 'mortgage',
                        child: Text(s.loan_mortgage)),
                  ],
                  onChanged: (val) =>
                      setDialogState(() => selectedType = val!),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: amountController,
                  style: TextStyle(color: MyTheme.textWhite),
                  decoration: InputDecoration(
                    labelText: s.amount_requested,
                    labelStyle:
                    TextStyle(color: MyTheme.textPrimary),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8)),
                    prefixIcon: Icon(Icons.money,
                        color: MyTheme.textAccent),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: monthsController,
                  style: TextStyle(color: MyTheme.textWhite),
                  decoration: InputDecoration(
                    labelText: s.duration_months,
                    labelStyle:
                    TextStyle(color: MyTheme.textPrimary),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8)),
                    prefixIcon: Icon(Icons.calendar_today,
                        color: MyTheme.textAccent),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: incomeController,
                  style: TextStyle(color: MyTheme.textWhite),
                  decoration: InputDecoration(
                    labelText: s.monthly_income,
                    labelStyle:
                    TextStyle(color: MyTheme.textPrimary),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8)),
                    prefixIcon: Icon(Icons.account_balance_wallet,
                        color: MyTheme.textAccent),
                  ),
                  keyboardType: TextInputType.number,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              child: Text(s.cancel,
                  style:
                  TextStyle(color: MyTheme.textPrimary)),
              onPressed: () => Navigator.pop(ctx),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                  backgroundColor: MyTheme.textAccent),
              child: Text(s.submit_request,
                  style: TextStyle(color: MyTheme.textWhite)),
              onPressed: () {
                if (amountController.text.isNotEmpty &&
                    monthsController.text.isNotEmpty &&
                    incomeController.text.isNotEmpty) {
                  Navigator.pop(ctx);
                  // ✅ بتقدم على القرض عبر الـ API
                  // لو عندك applyForLoan في الـ Cubit، استخدمه هنا
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(s.loan_request_submitted),
                      backgroundColor: Colors.green,
                    ),
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showCreditCardDialog() {
    final s = AppLocalizations.of(context)!;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16)),
        title: Text(s.request_credit_card,
            style: TextStyle(color: MyTheme.textPrimary)),
        content: Text(s.choose_card_type,
            style: TextStyle(color: MyTheme.textPrimary)),
        actions: [
          TextButton(
            child: Text(s.cancel,
                style: TextStyle(color: MyTheme.textPrimary)),
            onPressed: () => Navigator.pop(context),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: MyTheme.textAccent),
            child: Text(s.continue_button,
                style: TextStyle(color: MyTheme.textWhite)),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content: Text(s.card_request_review),
                backgroundColor: MyTheme.textAccent,
              ));
            },
          ),
        ],
      ),
    );
  }

  void _showLoanDetails(Map<String, dynamic> loan) {
    final s = AppLocalizations.of(context)!;
    final loanNames = {
      'personal': s.loan_personal,
      'car': s.loan_car,
      'mortgage': s.loan_mortgage,
    };

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16)),
        title: Text(loanNames[loan['type']] ?? s.loan_personal,
            style: TextStyle(color: MyTheme.textPrimary)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow(s.amount_label,
                '${(loan['amount'] ?? 0).toStringAsFixed(0)} ${s.currency_egp}'),
            _buildDetailRow(s.interest_rate,
                '${loan['interestRate'] ?? 0}%'),
            _buildDetailRow(s.duration_months,
                '${loan['term'] ?? 0} ${s.months}'),
            _buildDetailRow(s.status_label,
                _getLoanStatusLabel(loan['status'] ?? '')),
            if (loan['monthlyPayment'] != null) ...[
              const SizedBox(height: 8),
              _buildDetailRow(
                s.monthly_installment,
                '${(loan['monthlyPayment'] as num).toStringAsFixed(0)} ${s.currency_egp}',
                highlight: true,
              ),
            ],
            if (loan['adminNotes'] != null &&
                (loan['adminNotes'] as String).isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(s.notes_label,
                  style: TextStyle(
                      color: MyTheme.textPrimary.withOpacity(0.7),
                      fontSize: 12)),
              Text(loan['adminNotes'],
                  style: TextStyle(
                      color: MyTheme.textError, fontSize: 13)),
            ],
          ],
        ),
        actions: [
          TextButton(
            child: Text(s.close,
                style: TextStyle(color: MyTheme.textPrimary)),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value,
      {bool highlight = false}) =>
      Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label,
                style: TextStyle(
                    color: MyTheme.textPrimary.withOpacity(0.7),
                    fontSize: 13)),
            Text(value,
                style: TextStyle(
                    color: highlight
                        ? MyTheme.textAccent
                        : MyTheme.textPrimary,
                    fontWeight: highlight
                        ? FontWeight.bold
                        : FontWeight.normal,
                    fontSize: 13)),
          ],
        ),
      );

  void _showInvestmentDetails(Map<String, dynamic> investment) {
    final s = AppLocalizations.of(context)!;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16)),
        title: Text(investment['name'],
            style: TextStyle(color: MyTheme.textPrimary)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow(
              s.minimum_amount,
              '${(investment['minAmount'] as double).toStringAsFixed(0)} ${s.currency_egp}',
            ),
            _buildDetailRow(
                s.annual_return, '${investment['returnRate']}%'),
            _buildDetailRow(s.duration_months,
                '${investment['duration']} ${s.months}'),
            _buildDetailRow(s.risk_label, investment['risk']),
            const SizedBox(height: 8),
            _buildDetailRow(
              s.expected_return,
              '${((investment['minAmount'] as double) * (investment['returnRate'] as double) / 100).toStringAsFixed(0)} ${s.currency_egp}',
              highlight: true,
            ),
          ],
        ),
        actions: [
          TextButton(
            child: Text(s.close,
                style: TextStyle(color: MyTheme.textPrimary)),
            onPressed: () => Navigator.pop(context),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: MyTheme.textAccent),
            child: Text(s.invest_now,
                style: TextStyle(color: MyTheme.textWhite)),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content: Text(s.investment_started),
                backgroundColor: Colors.green,
              ));
            },
          ),
        ],
      ),
    );
  }

  void _activateOffer(Map<String, dynamic> offer) {
    final s = AppLocalizations.of(context)!;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle,
                color: MyTheme.textAccent, size: 64),
            const SizedBox(height: 16),
            Text(s.offer_activated,
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: MyTheme.textPrimary)),
            const SizedBox(height: 8),
            Text(offer['title'],
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: MyTheme.textPrimary.withOpacity(0.7))),
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
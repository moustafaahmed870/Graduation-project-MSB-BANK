// lib/screens/settings_profile_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:msb_bank/l10n/app_localizations.dart';
import 'package:msb_bank/language_provider.dart';
import 'package:msb_bank/token_storage.dart';

import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../my_theme.dart';
import '../Account Details Screen/account_cubit.dart';
import '../Account Details Screen/account_repository.dart';
import '../Account Details Screen/account_state.dart';
import 'Account Details Screen/account_model.dart';
import '../Auth/login.dart'; // ✅ import LoginPage

class SettingsProfileScreen extends StatelessWidget {
  const SettingsProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => AccountCubit(AccountRepository())..getProfile(),
      child: const _SettingsProfileContent(),
    );
  }
}

class _SettingsProfileContent extends StatefulWidget {
  const _SettingsProfileContent({Key? key}) : super(key: key);

  @override
  State<_SettingsProfileContent> createState() =>
      _SettingsProfileContentState();
}

class _SettingsProfileContentState extends State<_SettingsProfileContent> {
  Map<String, dynamic>? _cachedProfile;

  final _fullNameController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void dispose() {
    _fullNameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  String _name(Map<String, dynamic>? p) => p?['fullName'] ?? '';
  String _email(Map<String, dynamic>? p) => p?['email'] ?? '';
  String _phone(Map<String, dynamic>? p) => p?['phone'] ?? '';

  String _currency(Map<String, dynamic>? p) {
    final accounts = p?['accounts'] as List?;
    if (accounts != null && accounts.isNotEmpty) {
      return accounts.first['currency'] ?? 'EGP';
    }
    return 'EGP';
  }

  String _mainAccountNumber(Map<String, dynamic>? p) {
    final accounts = p?['accounts'] as List?;
    if (accounts != null && accounts.isNotEmpty) {
      final main = accounts.firstWhere(
            (a) => a['type'] == 'current',
        orElse: () => accounts.first,
      );
      return main['number'] as String? ?? '';
    }
    return '';
  }

  String _shortAccountNumber(Map<String, dynamic>? p) {
    final n = _mainAccountNumber(p);
    return n.length > 4 ? '****${n.substring(n.length - 4)}' : n;
  }

  String _currentLanguageLabel(String code) {
    final s = AppLocalizations.of(context)!;
    switch (code) {
      case 'ar':
        return s.language_arabic;
      case 'en':
      default:
        return 'English';
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: MyTheme.backgroundMain,
      body: BlocConsumer<AccountCubit, AccountState>(
        listener: (context, state) {
          if (state is AccountError) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content: Text(state.message),
              backgroundColor: MyTheme.textError,
              behavior: SnackBarBehavior.floating,
            ));
          }
        },
        builder: (context, state) {
          if (state is ProfileLoaded) {
            if (_cachedProfile == null) {
              _cachedProfile = state.profile;
              _fullNameController.text = _name(state.profile);
              _phoneController.text = _phone(state.profile);
            }
          }

          final profile = _cachedProfile ??
              (state is ProfileLoaded ? state.profile : null);

          if (state is AccountLoading && profile == null) {
            return const Center(
              child: CircularProgressIndicator(color: MyTheme.textAccent),
            );
          }

          if (state is AccountError && profile == null) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error_outline,
                        color: MyTheme.textError, size: 48),
                    const SizedBox(height: 16),
                    Text(state.message,
                        style: const TextStyle(color: MyTheme.textPrimary),
                        textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () =>
                          context.read<AccountCubit>().getProfile(),
                      style: ElevatedButton.styleFrom(
                          backgroundColor: MyTheme.textAccent),
                      child: Text(s.retry,
                          style: TextStyle(color: MyTheme.textWhite)),
                    ),
                  ],
                ),
              ),
            );
          }

          return CustomScrollView(
            slivers: [
              _buildAppBar(profile),
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    _buildProfileSection(s, profile),
                    const SizedBox(height: 24),
                    _buildSecuritySection(s),
                    const SizedBox(height: 24),
                    _buildSupportSection(s),
                    const SizedBox(height: 24),
                    _buildGeneralSettings(s, profile),
                    const SizedBox(height: 24),
                    _buildLogoutButton(s),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  // ===================================================
  // AppBar
  // ===================================================
  Widget _buildAppBar(Map<String, dynamic>? profile) {
    final name = _name(profile);
    final accNum = _shortAccountNumber(profile);

    return SliverAppBar(
      backgroundColor: MyTheme.backgroundCard,
      expandedHeight: 230,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                MyTheme.backgroundCard,
                MyTheme.borderNormal,
                MyTheme.textAccent.withOpacity(0.3),
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.only(top: 72, bottom: 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(3),
                      decoration: BoxDecoration(
                        color: MyTheme.backgroundCard,
                        shape: BoxShape.circle,
                        border: Border.all(
                            color: MyTheme.borderNormal, width: 2),
                        boxShadow: const [MyTheme.shadowPrimary],
                      ),
                      child: CircleAvatar(
                        radius: 36,
                        backgroundColor: MyTheme.backgroundTransparent,
                        child: Text(
                          name.isNotEmpty ? name[0].toUpperCase() : 'U',
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: MyTheme.textAccent,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(5),
                        decoration: BoxDecoration(
                          color: MyTheme.textAccent,
                          shape: BoxShape.circle,
                          border: Border.all(
                              color: MyTheme.backgroundCard, width: 2),
                        ),
                        child: const Icon(Icons.edit,
                            size: 13, color: MyTheme.textWhite),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  name,
                  style: const TextStyle(
                    color: MyTheme.textWhite,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                if (accNum.isNotEmpty)
                  Text(
                    accNum,
                    style: TextStyle(
                      color: MyTheme.textPrimary.withOpacity(0.7),
                      fontSize: 12,
                    ),
                  ),
              ],
            ),
          ),
        ),
        title: const Text(''),
        centerTitle: true,
      ),
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_rounded,
            color: MyTheme.textWhite),
        onPressed: () => Navigator.pop(context),
      ),
    );
  }

  // ===================================================
  // المعلومات الشخصية
  // ===================================================
  Widget _buildProfileSection(
      AppLocalizations s, Map<String, dynamic>? profile) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle(
              s.profile_info_title, Icons.person_outline_rounded),
          const SizedBox(height: 16),
          Container(
            decoration: MyTheme.cardDecoration,
            child: Column(
              children: [
                _buildProfileItem(
                  s.full_name_label,
                  _name(profile),
                  Icons.person_outline_rounded,
                      () => _showEditDialog(
                      s.full_name_label, _fullNameController, 'fullName'),
                ),
                _buildDivider(),
                _buildProfileItem(
                  s.email_label,
                  _email(profile),
                  Icons.email_outlined,
                  null,
                ),
                _buildDivider(),
                _buildProfileItem(
                  s.phone_label,
                  _phone(profile),
                  Icons.phone_outlined,
                      () => _showEditDialog(
                      s.phone_label, _phoneController, 'phone'),
                ),
                _buildDivider(),
                _buildProfileItem(
                  s.account_number_label,
                  _mainAccountNumber(profile),
                  Icons.account_balance_outlined,
                  null,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ===================================================
  // الأمان
  // ===================================================
  Widget _buildSecuritySection(AppLocalizations s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle(
              s.security_privacy_title, Icons.security_rounded),
          const SizedBox(height: 16),
          Container(
            decoration: MyTheme.cardDecoration,
            child: _buildProfileItem(
              s.change_password,
              s.last_password_change,
              Icons.lock_outline_rounded,
                  () => _showChangePasswordDialog(),
              showBadge: true,
              badgeText: s.active,
            ),
          ),
        ],
      ),
    );
  }

  // ===================================================
  // الدعم
  // ===================================================
  Widget _buildSupportSection(AppLocalizations s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle(
              s.help_support_title, Icons.help_outline_rounded),
          const SizedBox(height: 16),
          Container(
            decoration: MyTheme.cardDecoration,
            child: Column(
              children: [
                _buildProfileItem(s.help_center, s.help_center_desc,
                    Icons.support_agent_rounded, () => _showComingSoon()),
                _buildDivider(),
                _buildProfileItem(s.contact_us, s.contact_us_desc,
                    Icons.chat_bubble_outline_rounded,
                        () => _showComingSoon()),
                _buildDivider(),
                _buildProfileItem(s.rate_app, s.rate_app_desc,
                    Icons.star_outline_rounded, () => _showComingSoon()),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ===================================================
  // الإعدادات العامة
  // ===================================================
  Widget _buildGeneralSettings(
      AppLocalizations s, Map<String, dynamic>? profile) {
    final langCode = context.watch<LanguageProvider>().appLanguage;
    final langLabel = _currentLanguageLabel(langCode);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle(s.general_title, Icons.settings_outlined),
          const SizedBox(height: 16),
          Container(
            decoration: MyTheme.cardDecoration,
            child: Column(
              children: [
                _buildProfileItem(
                  s.language,
                  langLabel,
                  Icons.language_rounded,
                      () => _showLanguageDialog(),
                ),
                _buildDivider(),
                _buildProfileItem(
                  s.currency,
                  '${_currency(profile)} - ${s.currency_egp_label}',
                  Icons.attach_money_rounded,
                      () => _showComingSoon(),
                ),
                _buildDivider(),
                _buildProfileItem(
                    s.terms_and_conditions,
                    s.terms_and_conditions_desc,
                    Icons.description_outlined,
                        () => _showComingSoon()),
                _buildDivider(),
                _buildProfileItem(s.privacy_policy, s.privacy_policy_desc,
                    Icons.privacy_tip_outlined, () => _showComingSoon()),
                _buildDivider(),
                _buildProfileItem(s.about_app, '${s.version} 2.5.1',
                    Icons.info_outline_rounded, () => _showComingSoon()),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ===================================================
  // Helpers
  // ===================================================
  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: MyTheme.backgroundTransparent,
            border: Border.all(color: MyTheme.borderNormal),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: MyTheme.textAccent, size: 20),
        ),
        const SizedBox(width: 12),
        Text(title,
            style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: MyTheme.textPrimary)),
      ],
    );
  }

  Widget _buildProfileItem(
      String title,
      String subtitle,
      IconData icon,
      VoidCallback? onTap, {
        bool showBadge = false,
        String badgeText = '',
      }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: MyTheme.backgroundTransparent,
                border: Border.all(color: MyTheme.borderTransparent),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: MyTheme.textAccent, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(title,
                          style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: MyTheme.textPrimary)),
                      if (showBadge) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: MyTheme.textAccent,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(badgeText,
                              style: const TextStyle(
                                  color: MyTheme.backgroundMain,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(subtitle,
                      style: TextStyle(
                          fontSize: 13,
                          color: MyTheme.textPrimary.withOpacity(0.6))),
                ],
              ),
            ),
            if (onTap != null)
              Icon(Icons.arrow_forward_ios_rounded,
                  size: 16, color: MyTheme.borderNormal),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() => Divider(
    height: 1,
    thickness: 1,
    color: MyTheme.borderTransparent,
    indent: 70,
  );

  // ===================================================
  // ✅ زر تسجيل الخروج
  // ===================================================
  Widget _buildLogoutButton(AppLocalizations s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: InkWell(
        onTap: () => _showLogoutDialog(),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 18),
          decoration: BoxDecoration(
            color: MyTheme.backgroundCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: MyTheme.textError, width: 2),
            boxShadow: const [MyTheme.shadowDark],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.logout_rounded,
                  color: MyTheme.textError, size: 24),
              const SizedBox(width: 12),
              Text(s.logout,
                  style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: MyTheme.textError)),
            ],
          ),
        ),
      ),
    );
  }

  // ===================================================
  // ✅ ديلوج تسجيل الخروج
  // ===================================================
  void _showLogoutDialog() {
    final s = AppLocalizations.of(context)!;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape:
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(s.logout,
            style: const TextStyle(color: MyTheme.textPrimary)),
        content: Text(s.logout_confirmation,
            style: const TextStyle(color: MyTheme.textPrimary)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(s.cancel,
                style: const TextStyle(color: MyTheme.textPrimary)),
          ),
          ElevatedButton(
            onPressed: () async {
              // ✅ حذف التوكن من التخزين
              await TokenStorage.deleteToken();

              // ✅ حذف التوكن من SharedPreferences
              try {
                final prefs = await SharedPreferences.getInstance();
                await prefs.remove('token');
                await prefs.remove('auth_token');
                await prefs.setBool('is_logged_in', false);
              } catch (e) {
                print('Error clearing SharedPreferences: $e');
              }

              if (context.mounted) {
                // ✅ الانتقال لـ LoginPage مع حذف كل الـ routes السابقة
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  LoginPage.routeName,
                      (route) => false,
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: MyTheme.textError,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(s.logout,
                style: const TextStyle(color: MyTheme.textWhite)),
          ),
        ],
      ),
    );
  }

  // ===================================================
  // ديلوج اختيار اللغة
  // ===================================================
  void _showLanguageDialog() {
    final s = AppLocalizations.of(context)!;
    final languageProvider = context.read<LanguageProvider>();
    String selected = languageProvider.appLanguage;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: MyTheme.backgroundCard,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16)),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: MyTheme.backgroundTransparent,
                  border: Border.all(color: MyTheme.borderNormal),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.language_rounded,
                    color: MyTheme.textAccent, size: 20),
              ),
              const SizedBox(width: 12),
              Text(
                s.select_language,
                style: const TextStyle(
                    color: MyTheme.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.w700),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildLanguageOption(
                setDialogState: setDialogState,
                selected: selected,
                langCode: 'ar',
                label: s.language_arabic,
                flag: '🇸🇦',
                onSelect: (val) => selected = val,
              ),
              const SizedBox(height: 12),
              _buildLanguageOption(
                setDialogState: setDialogState,
                selected: selected,
                langCode: 'en',
                label: 'English',
                flag: '🇬🇧',
                onSelect: (val) => selected = val,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text(s.cancel,
                  style: TextStyle(color: MyTheme.textPrimary)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                languageProvider.changeLanguage(selected);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: MyTheme.textAccent,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(s.save,
                  style: TextStyle(color: MyTheme.backgroundMain)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLanguageOption({
    required StateSetter setDialogState,
    required String selected,
    required String langCode,
    required String label,
    required String flag,
    required Function(String) onSelect,
  }) {
    final isSelected = selected == langCode;

    return GestureDetector(
      onTap: () => setDialogState(() => onSelect(langCode)),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding:
        const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isSelected
              ? MyTheme.textAccent.withOpacity(0.15)
              : MyTheme.backgroundTransparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color:
            isSelected ? MyTheme.textAccent : MyTheme.borderNormal,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Text(flag, style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            Text(
              label,
              style: TextStyle(
                fontSize: 16,
                fontWeight:
                isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected
                    ? MyTheme.textAccent
                    : MyTheme.textPrimary,
              ),
            ),
            const Spacer(),
            if (isSelected)
              const Icon(Icons.check_circle_rounded,
                  color: MyTheme.textAccent, size: 22),
          ],
        ),
      ),
    );
  }

  // ===================================================
  // Dialogs
  // ===================================================
  void _showEditDialog(String fieldLabel, TextEditingController controller,
      String fieldKey) {
    final s = AppLocalizations.of(context)!;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16)),
        title: Text('${s.edit_field} $fieldLabel',
            style: const TextStyle(color: MyTheme.textPrimary)),
        content: TextField(
          controller: controller,
          style: const TextStyle(color: MyTheme.textWhite),
          decoration: InputDecoration(
            hintText: '${s.enter_new} $fieldLabel',
            hintStyle: TextStyle(
                color: MyTheme.textPrimary.withOpacity(0.5)),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide:
              const BorderSide(color: MyTheme.borderNormal),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                  color: MyTheme.textAccent, width: 2),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(s.cancel,
                style: const TextStyle(color: MyTheme.textPrimary)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              final val = controller.text.trim();
              if (val.isNotEmpty && _cachedProfile != null) {
                setState(() => _cachedProfile![fieldKey] = val);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: MyTheme.textAccent,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(s.save,
                style:
                const TextStyle(color: MyTheme.backgroundMain)),
          ),
        ],
      ),
    );
  }

  void _showChangePasswordDialog() {
    final s = AppLocalizations.of(context)!;
    final currentCtrl = TextEditingController();
    final newCtrl = TextEditingController();
    final confirmCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16)),
        title: Text(s.change_password,
            style: const TextStyle(color: MyTheme.textPrimary)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildPasswordField(currentCtrl, s.current_password),
            const SizedBox(height: 16),
            _buildPasswordField(newCtrl, s.new_password),
            const SizedBox(height: 16),
            _buildPasswordField(confirmCtrl, s.confirm_new_password),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(s.cancel,
                style: const TextStyle(color: MyTheme.textPrimary)),
          ),
          ElevatedButton(
            onPressed: () {
              if (newCtrl.text != confirmCtrl.text) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(s.passwords_not_match)),
                );
                return;
              }
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(s.change_password_api),
                  backgroundColor: MyTheme.textAccent,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: MyTheme.textAccent,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(s.change,
                style:
                const TextStyle(color: MyTheme.backgroundMain)),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordField(
      TextEditingController ctrl, String label) {
    return TextField(
      controller: ctrl,
      obscureText: true,
      style: const TextStyle(color: MyTheme.textWhite),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: MyTheme.textPrimary),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: MyTheme.borderNormal),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide:
          const BorderSide(color: MyTheme.textAccent, width: 2),
        ),
        prefixIcon: const Icon(Icons.lock_outline,
            color: MyTheme.textAccent),
      ),
    );
  }

  void _showComingSoon() {
    final s = AppLocalizations.of(context)!;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(s.coming_soon),
        backgroundColor: MyTheme.textAccent,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../l10n/app_localizations.dart';
import '../my_theme.dart';
import '../Main_Screen.dart';
import '../notification.dart';

import 'auth_cubit.dart';
import 'auth_state.dart';


class RegisterPage extends StatefulWidget {
  static const String routeName = 'RegisterPage ';

  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _pageController = PageController();
  String _selectedDateISO = '';
  final _fullNameController = TextEditingController();
  final _nationalIdController = TextEditingController();
  final _dateOfBirthController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _initialDepositController = TextEditingController();

  String? _selectedAccountType;
  String? _selectedGender;

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;
  bool _agreeToTerms = false;

  int _currentStep = 0;

  late AnimationController _slideController;
  late AnimationController _fadeController;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();

    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, -0.5),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeOutCubic,
    ));

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    ));

    _slideController.forward();
    _fadeController.forward();
  }

  @override
  void dispose() {
    _slideController.dispose();
    _fadeController.dispose();
    _pageController.dispose();
    _fullNameController.dispose();
    _nationalIdController.dispose();
    _dateOfBirthController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _initialDepositController.dispose();
    super.dispose();
  }

  // ✅ Validate كل step لوحده عشان الـ PageView مش بيبني كل الـ pages
  bool _validateCurrentStep() {
    final s = AppLocalizations.of(context)!;

    switch (_currentStep) {
      case 0:
        if (_fullNameController.text.trim().isEmpty) {
          _showStepError(s.field_required);
          return false;
        }
        if (_nationalIdController.text.trim().length < 10) {
          _showStepError(s.national_id_invalid);
          return false;
        }
        if (_selectedDateISO.isEmpty) {
          _showStepError(s.field_required);
          return false;
        }
        if (_phoneController.text.trim().isEmpty) {
          _showStepError(s.field_required);
          return false;
        }
        if (_emailController.text.trim().isEmpty || !_emailController.text.contains('@')) {
          _showStepError(s.email_invalid);
          return false;
        }
        return true;

      case 1:
        if (_addressController.text.trim().isEmpty) {
          _showStepError(s.field_required);
          return false;
        }
        if (_cityController.text.trim().isEmpty) {
          _showStepError(s.field_required);
          return false;
        }
        if (_postalCodeController.text.trim().isEmpty) {
          _showStepError(s.field_required);
          return false;
        }
        return true;

      case 2:
        final deposit = double.tryParse(_initialDepositController.text.trim());
        if (deposit == null || deposit < 100) {
          _showStepError(s.minimum_deposit_required);
          return false;
        }
        if (_passwordController.text.length < 8) {
          _showStepError(s.password_min_length_8);
          return false;
        }
        if (_passwordController.text != _confirmPasswordController.text) {
          _showStepError(s.passwords_not_match);
          return false;
        }
        return true;

      default:
        return false;
    }
  }

  void _showStepError(String message) {
    _formKey.currentState?.validate();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: MyTheme.textError,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _nextStep() {
    if (!_validateCurrentStep()) return;

    if (_currentStep < 2) {
      setState(() => _currentStep++);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      _handleRegister();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }

  void _handleRegister() {
    final s = AppLocalizations.of(context)!;
    final gender = _selectedGender ?? s.gender_male;
    final accountType = _selectedAccountType ?? s.account_type_savings;

    if (!_agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(s.terms_required),
          backgroundColor: MyTheme.textError,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    context.read<AuthCubit>().register(
      fullName: _fullNameController.text.trim(),
      nationalId: _nationalIdController.text.trim(),
      dateOfBirth: _selectedDateISO,
      gender: gender == s.gender_male ? 'male' : 'female',
      phone: _phoneController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
      address: _addressController.text.trim(),
      city: _cityController.text.trim(),
      postalCode: _postalCodeController.text.trim(),
      accountType: _getAccountTypeInEnglish(accountType, s),
      initialDeposit: double.parse(_initialDepositController.text.trim()),
    );
  }

  // ✅ بيقارن بقيم الـ localization مش عربي ثابت
  String _getAccountTypeInEnglish(String value, AppLocalizations s) {
    if (value == s.account_type_savings) return 'savings';
    if (value == s.account_type_current) return 'current';
    if (value == s.account_type_investment) return 'investment';
    return 'savings';
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.dark(
              primary: MyTheme.textAccent,
              onPrimary: MyTheme.backgroundMain,
              surface: MyTheme.backgroundCard,
              onSurface: MyTheme.textWhite,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _dateOfBirthController.text =
        "${picked.day}/${picked.month}/${picked.year}";
        _selectedDateISO =
        "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;

    // ✅ تحديد القيم الافتراضية من الـ localization في أول build
    _selectedGender ??= s.gender_male;
    _selectedAccountType ??= s.account_type_savings;

    return BlocListener<AuthCubit, AuthState>(
      listener: (context, state) {
        if (state is AuthLoading) {
          setState(() => _isLoading = true);
        } else if (state is AuthSuccess) {
          setState(() => _isLoading = false);

          NotificationService().saveTokenToServer();

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(s.register_success_message),
              backgroundColor: MyTheme.textAccent,
              behavior: SnackBarBehavior.floating,
            ),
          );
          Navigator.pushReplacementNamed(context, MainScreen.routeName);
        } else if (state is AuthError) {
          setState(() => _isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: MyTheme.textError,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: MyTheme.backgroundMain,
        body: SafeArea(
          child: Column(
            children: [
              _buildHeader(),
              _buildStepIndicator(),
              Expanded(
                child: Form(
                  key: _formKey,
                  child: PageView(
                    controller: _pageController,
                    physics: const NeverScrollableScrollPhysics(),
                    children: [
                      _buildPersonalInfoStep(),
                      _buildAddressStep(),
                      _buildAccountStep(),
                    ],
                  ),
                ),
              ),
              _buildButtons(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    final s = AppLocalizations.of(context)!;

    return SlideTransition(
      position: _slideAnimation,
      child: FadeTransition(
        opacity: _fadeAnimation,
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: MyTheme.textWhite),
                onPressed: () => Navigator.pop(context),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    s.register_title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: MyTheme.textWhite,
                    ),
                  ),
                  Text(
                    s.register_subtitle,
                    style: const TextStyle(
                      fontSize: 14,
                      color: MyTheme.textPrimary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepIndicator() {
    final s = AppLocalizations.of(context)!;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
      child: Row(
        children: [
          _buildStep(0, s.personal_info_step),
          _buildStepLine(0),
          _buildStep(1, s.address_step),
          _buildStepLine(1),
          _buildStep(2, s.account_info_step),
        ],
      ),
    );
  }

  Widget _buildStep(int step, String label) {
    bool isActive = step == _currentStep;
    bool isCompleted = step < _currentStep;

    return Expanded(
      child: Column(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: isCompleted || isActive
                  ? MyTheme.textAccent
                  : MyTheme.backgroundCard,
              shape: BoxShape.circle,
              border: Border.all(
                color: isActive ? MyTheme.textAccent : MyTheme.borderNormal,
                width: 2,
              ),
            ),
            child: Center(
              child: isCompleted
                  ? const Icon(Icons.check, color: MyTheme.backgroundMain)
                  : Text(
                '${step + 1}',
                style: TextStyle(
                  color: isActive
                      ? MyTheme.backgroundMain
                      : MyTheme.textPrimary,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 10,
              color: isActive ? MyTheme.textAccent : MyTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepLine(int step) {
    bool isCompleted = step < _currentStep;
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.only(bottom: 30),
        color: isCompleted ? MyTheme.textAccent : MyTheme.borderNormal,
      ),
    );
  }

  Widget _buildPersonalInfoStep() {
    final s = AppLocalizations.of(context)!;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          _buildTextField(
            controller: _fullNameController,
            label: s.full_name_label,
            icon: Icons.person_outline,
            validator: (value) => value?.isEmpty ?? true ? s.field_required : null,
          ),
          _buildTextField(
            controller: _nationalIdController,
            label: s.national_id_label,
            icon: Icons.credit_card,
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value?.isEmpty ?? true) return s.field_required;
              if (value!.length < 10) return s.national_id_invalid;
              return null;
            },
          ),
          _buildTextField(
            controller: _dateOfBirthController,
            label: s.date_of_birth_label,
            icon: Icons.calendar_today,
            readOnly: true,
            onTap: _selectDate,
            validator: (value) => value?.isEmpty ?? true ? s.field_required : null,
          ),
          _buildDropdown(
            value: _selectedGender ?? s.gender_male,
            label: s.gender_label,
            icon: Icons.person,
            items: [s.gender_male, s.gender_female],
            onChanged: (value) => setState(() => _selectedGender = value),
          ),
          _buildTextField(
            controller: _phoneController,
            label: s.phone_label,
            icon: Icons.phone_outlined,
            keyboardType: TextInputType.phone,
            validator: (value) => value?.isEmpty ?? true ? s.field_required : null,
          ),
          _buildTextField(
            controller: _emailController,
            label: s.email_label,
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value?.isEmpty ?? true) return s.field_required;
              if (!value!.contains('@')) return s.email_invalid;
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildAddressStep() {
    final s = AppLocalizations.of(context)!;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          _buildTextField(
            controller: _addressController,
            label: s.address_label,
            icon: Icons.location_on_outlined,
            maxLines: 2,
            validator: (value) => value?.isEmpty ?? true ? s.field_required : null,
          ),
          _buildTextField(
            controller: _cityController,
            label: s.city_label,
            icon: Icons.location_city,
            validator: (value) => value?.isEmpty ?? true ? s.field_required : null,
          ),
          _buildTextField(
            controller: _postalCodeController,
            label: s.postal_code_label,
            icon: Icons.markunread_mailbox,
            keyboardType: TextInputType.number,
            validator: (value) => value?.isEmpty ?? true ? s.field_required : null,
          ),
        ],
      ),
    );
  }

  Widget _buildAccountStep() {
    final s = AppLocalizations.of(context)!;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          _buildDropdown(
            value: _selectedAccountType ?? s.account_type_savings,
            label: s.account_type_label,
            icon: Icons.account_balance_wallet,
            items: [s.account_type_savings, s.account_type_current, s.account_type_investment],
            onChanged: (value) => setState(() => _selectedAccountType = value),
          ),
          _buildTextField(
            controller: _initialDepositController,
            label: s.initial_deposit_label,
            icon: Icons.attach_money,
            keyboardType: TextInputType.number,
            validator: (value) {
              if (value?.isEmpty ?? true) return s.field_required;
              final amount = double.tryParse(value!);
              if (amount == null || amount < 100) return s.minimum_deposit_required;
              return null;
            },
          ),
          _buildTextField(
            controller: _passwordController,
            label: s.password_label,
            icon: Icons.lock_outline,
            obscureText: _obscurePassword,
            suffixIcon: IconButton(
              icon: Icon(
                _obscurePassword ? Icons.visibility_off : Icons.visibility,
                color: MyTheme.textPrimary,
              ),
              onPressed: () =>
                  setState(() => _obscurePassword = !_obscurePassword),
            ),
            validator: (value) {
              if (value?.isEmpty ?? true) return s.field_required;
              if (value!.length < 8) return s.password_min_length_8;
              return null;
            },
          ),
          _buildTextField(
            controller: _confirmPasswordController,
            label: s.confirm_password_label,
            icon: Icons.lock_outline,
            obscureText: _obscureConfirmPassword,
            suffixIcon: IconButton(
              icon: Icon(
                _obscureConfirmPassword
                    ? Icons.visibility_off
                    : Icons.visibility,
                color: MyTheme.textPrimary,
              ),
              onPressed: () => setState(
                      () => _obscureConfirmPassword = !_obscureConfirmPassword),
            ),
            validator: (value) {
              if (value?.isEmpty ?? true) return s.field_required;
              if (value != _passwordController.text)
                return s.passwords_not_match;
              return null;
            },
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: MyTheme.cardDecoration,
            child: Row(
              children: [
                SizedBox(
                  width: 24,
                  height: 24,
                  child: Checkbox(
                    value: _agreeToTerms,
                    onChanged: (value) =>
                        setState(() => _agreeToTerms = value ?? false),
                    activeColor: MyTheme.textAccent,
                    checkColor: MyTheme.backgroundMain,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(
                          text: s.agree_terms_text,
                          style: const TextStyle(
                            color: MyTheme.textAccent,
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ],
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

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscureText = false,
    bool readOnly = false,
    int maxLines = 1,
    TextInputType? keyboardType,
    Widget? suffixIcon,
    VoidCallback? onTap,
    String? Function(String?)? validator,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: TextFormField(
        controller: controller,
        obscureText: obscureText,
        readOnly: readOnly,
        maxLines: maxLines,
        keyboardType: keyboardType,
        validator: validator,
        onTap: onTap,
        style: const TextStyle(color: MyTheme.textWhite, fontSize: 16),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: MyTheme.textPrimary),
          prefixIcon: Icon(icon, color: MyTheme.textAccent),
          suffixIcon: suffixIcon,
          filled: true,
          fillColor: MyTheme.backgroundCard,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: MyTheme.borderNormal),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: MyTheme.borderNormal),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: MyTheme.textAccent, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: MyTheme.textError),
          ),
          errorStyle: const TextStyle(color: MyTheme.textError),
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required String value,
    required String label,
    required IconData icon,
    required List<String> items,
    required void Function(String?) onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: DropdownButtonFormField<String>(
        value: value,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: MyTheme.textPrimary),
          prefixIcon: Icon(icon, color: MyTheme.textAccent),
          filled: true,
          fillColor: MyTheme.backgroundCard,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: MyTheme.borderNormal),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: MyTheme.borderNormal),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: MyTheme.textAccent, width: 2),
          ),
        ),
        dropdownColor: MyTheme.backgroundCard,
        style: const TextStyle(color: MyTheme.textWhite, fontSize: 16),
        items: items.map((item) {
          return DropdownMenuItem(value: item, child: Text(item));
        }).toList(),
        onChanged: onChanged,
      ),
    );
  }

  Widget _buildButtons() {
    final s = AppLocalizations.of(context)!;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: MyTheme.backgroundCard,
        boxShadow: [MyTheme.shadowDark],
      ),
      child: Row(
        children: [
          if (_currentStep > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: _previousStep,
                style: OutlinedButton.styleFrom(
                  foregroundColor: MyTheme.textAccent,
                  side: const BorderSide(color: MyTheme.borderNormal),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text(s.previous_button, style: const TextStyle(fontSize: 16)),
              ),
            ),
          if (_currentStep > 0) const SizedBox(width: 16),
          Expanded(
            flex: 2,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _nextStep,
              style: ElevatedButton.styleFrom(
                backgroundColor: MyTheme.textAccent,
                foregroundColor: MyTheme.backgroundMain,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: _isLoading
                  ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    MyTheme.backgroundMain,
                  ),
                ),
              )
                  : Text(
                _currentStep < 2
                    ? s.next_button
                    : s.create_account_button,
                style: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:msb_bank/Auth/register.dart';
import 'package:msb_bank/Auth/auth_cubit.dart';
import 'package:msb_bank/Auth/auth_state.dart';
import 'package:msb_bank/Main_Screen.dart';
import 'package:msb_bank/l10n/app_localizations.dart';
import '../my_theme.dart';
import '../notification.dart';
import '../otp_page.dart';


class LoginPage extends StatefulWidget {
  static const String routeName = 'LoginPage';
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _isLoading = false;
  bool _rememberMe = false;

  late AnimationController _scaleController;
  late AnimationController _slideController;
  late AnimationController _fadeController;
  late Animation<double> _scaleAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.elasticOut),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(-1, 0),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _slideController, curve: Curves.easeOutCubic));
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeIn),
    );
    _scaleController.forward();
    _slideController.forward();
    _fadeController.forward();
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _slideController.dispose();
    _fadeController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState!.validate()) {
      context.read<AuthCubit>().login(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
    }
  }

  // ===================================================
  // ✅ Dialog عام لعرض حالات pending / rejected / suspended
  // ===================================================
  void _showStatusDialog({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String message,
  }) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: MyTheme.backgroundCard,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Row(
          children: [
            Icon(icon, color: iconColor),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(color: MyTheme.textWhite),
              ),
            ),
          ],
        ),
        content: Text(
          message,
          style: const TextStyle(color: MyTheme.textPrimary),
          textAlign: TextAlign.center,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'حسناً',
              style: TextStyle(color: MyTheme.textAccent),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;

    return BlocListener<AuthCubit, AuthState>(
      listener: (context, state) {
        if (state is AuthLoading) {
          setState(() => _isLoading = true);

        } else if (state is AuthSuccess) {
          setState(() => _isLoading = false);

          // ✅ بعد اللوجن مباشرة احفظ الـ FCM token واللغة في السيرفر
          NotificationService().saveTokenToServer();

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(s.login_success_message),
              backgroundColor: MyTheme.textAccent,
              behavior: SnackBarBehavior.floating,
            ),
          );

          // ✅ بعد اللوجن ينجح، روح على شاشة OTP الوهمية قبل الدخول الفعلي
          Navigator.pushReplacementNamed(
            context,
            OtpPage.routeName,
          );

        } else if (state is AuthPendingApproval) {
          // ===================================================
          // ✅ الحساب لسه قيد المراجعة - منع الدخول وعرض رسالة
          // ===================================================
          setState(() => _isLoading = false);
          _showStatusDialog(
            icon: Icons.hourglass_empty,
            iconColor: Colors.orange,
            title: 'قيد المراجعة',
            message: state.message,
          );

        } else if (state is AuthRejected) {
          // ===================================================
          // ✅ تم رفض طلب فتح الحساب
          // ===================================================
          setState(() => _isLoading = false);
          _showStatusDialog(
            icon: Icons.cancel,
            iconColor: MyTheme.textError,
            title: 'تم رفض الطلب',
            message: state.message,
          );

        } else if (state is AuthSuspended) {
          // ===================================================
          // ✅ الحساب معلّق
          // ===================================================
          setState(() => _isLoading = false);
          _showStatusDialog(
            icon: Icons.block,
            iconColor: MyTheme.textError,
            title: 'الحساب معلّق',
            message: state.message,
          );

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
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  const SizedBox(height: 60),
                  ScaleTransition(
                    scale: _scaleAnimation,
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            MyTheme.textAccent,
                            MyTheme.textAccent.withOpacity(0.6),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: MyTheme.textAccent.withOpacity(0.3),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.account_balance,
                        size: 50,
                        color: MyTheme.backgroundMain,
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                  FadeTransition(
                    opacity: _fadeAnimation,
                    child: Column(
                      children: [
                        Text(
                          s.welcome_back,
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: MyTheme.textWhite,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          s.login_to_continue,
                          style: const TextStyle(
                            fontSize: 16,
                            color: MyTheme.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 50),
                  SlideTransition(
                    position: _slideAnimation,
                    child: FadeTransition(
                      opacity: _fadeAnimation,
                      child: Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            _buildAnimatedTextField(
                              controller: _emailController,
                              label: s.email_label,
                              icon: Icons.email_outlined,
                              keyboardType: TextInputType.emailAddress,
                              delay: 0,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return s.email_required;
                                }
                                if (!value.contains('@')) {
                                  return s.email_invalid;
                                }
                                return null;
                              },
                            ),
                            _buildAnimatedTextField(
                              controller: _passwordController,
                              label: s.password_label,
                              icon: Icons.lock_outline,
                              obscureText: _obscurePassword,
                              delay: 150,
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword
                                      ? Icons.visibility_off
                                      : Icons.visibility,
                                  color: MyTheme.textPrimary,
                                ),
                                onPressed: () {
                                  setState(() =>
                                  _obscurePassword = !_obscurePassword);
                                },
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return s.password_required;
                                }
                                if (value.length < 6) {
                                  return s.password_min_length;
                                }
                                return null;
                              },
                            ),
                            _buildRememberAndForgot(delay: 300),
                            const SizedBox(height: 30),
                            _buildAnimatedButton(delay: 400),
                            const SizedBox(height: 20),
                            _buildDivider(delay: 500),
                            const SizedBox(height: 30),
                            _buildRegisterLink(delay: 700),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAnimatedTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required int delay,
    bool obscureText = false,
    TextInputType? keyboardType,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 600 + delay),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(50 * (1 - value), 0),
          child: Opacity(opacity: value, child: child),
        );
      },
      child: Padding(
        padding: const EdgeInsets.only(bottom: 20),
        child: TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          validator: validator,
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
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: MyTheme.textError, width: 2),
            ),
            errorStyle: const TextStyle(color: MyTheme.textError),
          ),
        ),
      ),
    );
  }

  Widget _buildRememberAndForgot({required int delay}) {
    final s = AppLocalizations.of(context)!;

    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 600 + delay),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) {
        return Opacity(opacity: value, child: child);
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              SizedBox(
                width: 24,
                height: 24,
                child: Checkbox(
                  value: _rememberMe,
                  onChanged: (value) =>
                      setState(() => _rememberMe = value ?? false),
                  activeColor: MyTheme.textAccent,
                  checkColor: MyTheme.backgroundMain,
                  side: const BorderSide(color: MyTheme.borderNormal),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                s.remember_me,
                style: const TextStyle(color: MyTheme.textPrimary, fontSize: 14),
              ),
            ],
          ),
          TextButton(
            onPressed: () {},
            child: Text(
              s.forgot_password,
              style: const TextStyle(color: MyTheme.textAccent, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnimatedButton({required int delay}) {
    final s = AppLocalizations.of(context)!;

    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 600 + delay),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) {
        return Transform.scale(scale: value, child: child);
      },
      child: Container(
        width: double.infinity,
        height: 56,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              MyTheme.textAccent,
              MyTheme.textAccent.withOpacity(0.8),
            ],
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: MyTheme.textAccent.withOpacity(0.3),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: _isLoading ? null : _handleLogin,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            foregroundColor: MyTheme.backgroundMain,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
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
            s.login_button,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  Widget _buildDivider({required int delay}) {
    final s = AppLocalizations.of(context)!;

    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 600 + delay),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) {
        return Opacity(opacity: value, child: child);
      },
      child: Row(
        children: [
          const Expanded(
            child: Divider(color: MyTheme.borderNormal, thickness: 1),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              s.or,
              style: const TextStyle(color: MyTheme.textPrimary, fontSize: 14),
            ),
          ),
          const Expanded(
            child: Divider(color: MyTheme.borderNormal, thickness: 1),
          ),
        ],
      ),
    );
  }

  Widget _buildRegisterLink({required int delay}) {
    final s = AppLocalizations.of(context)!;

    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 600 + delay),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) {
        return Opacity(opacity: value, child: child);
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            s.no_account,
            style: const TextStyle(color: MyTheme.textPrimary, fontSize: 14),
          ),
          TextButton(
            onPressed: () {
              Navigator.pushNamed(context, RegisterPage.routeName);
            },
            child: Text(
              s.create_account_button,
              style: const TextStyle(
                color: MyTheme.textAccent,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
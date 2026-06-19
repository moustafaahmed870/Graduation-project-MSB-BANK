import 'package:flutter/material.dart';
import 'package:msb_bank/Main_Screen.dart';
import 'package:msb_bank/l10n/app_localizations.dart';
import '../my_theme.dart';

/// شاشة OTP وهمية (Mock) - مفيهاش اتصال فعلي بسيرفر.
/// أي 6 أرقام تدخلها وتدوس "تأكيد" هتعديك على MainScreen.
class OtpPage extends StatefulWidget {
  static const String routeName = 'OtpPage';

  /// ممكن تستخدمه لو عايز تعرض رقم الموبايل/الإيميل اللي "اتبعت عليه" الكود (شكلي فقط)
  final String? destination;

  const OtpPage({super.key, this.destination});

  @override
  State<OtpPage> createState() => _OtpPageState();
}

class _OtpPageState extends State<OtpPage> {
  final int _otpLength = 6;
  late List<TextEditingController> _controllers;
  late List<FocusNode> _focusNodes;

  bool _isVerifying = false;
  String? _errorText;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(_otpLength, (_) => TextEditingController());
    _focusNodes = List.generate(_otpLength, (_) => FocusNode());
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  String get _code => _controllers.map((c) => c.text).join();

  bool get _isComplete =>
      _controllers.every((c) => c.text.trim().isNotEmpty) &&
          _code.length == _otpLength;

  void _onChanged(int index, String value) {
    setState(() => _errorText = null);

    if (value.isNotEmpty && index < _otpLength - 1) {
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }

    setState(() {});
  }

  Future<void> _handleConfirm() async {
    final s = AppLocalizations.of(context)!;

    if (!_isComplete) {
      setState(() => _errorText = s.otp_incomplete_error);
      return;
    }

    setState(() => _isVerifying = true);

    // ===================================================
    // ✅ هنا مكان أي شيك حقيقي لو حبيت تضيفه بعدين
    // دلوقتي: قبول أي 6 أرقام تلقائيًا (Mock)
    // ===================================================
    await Future.delayed(const Duration(milliseconds: 600));

    if (!mounted) return;
    setState(() => _isVerifying = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(s.otp_verified_success),
        backgroundColor: MyTheme.textAccent,
        behavior: SnackBarBehavior.floating,
      ),
    );

    Navigator.pushReplacementNamed(context, MainScreen.routeName);
  }

  void _handleResend() {
    final s = AppLocalizations.of(context)!;

    for (final c in _controllers) {
      c.clear();
    }
    _focusNodes.first.requestFocus();
    setState(() => _errorText = null);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(s.otp_resend_message),
        backgroundColor: MyTheme.textAccent,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;

    return Scaffold(
      backgroundColor: MyTheme.backgroundMain,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 60),
              Container(
                width: 90,
                height: 90,
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
                  Icons.lock_clock,
                  size: 44,
                  color: MyTheme.backgroundMain,
                ),
              ),
              const SizedBox(height: 30),
              Text(
                s.otp_title,
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: MyTheme.textWhite,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                widget.destination != null
                    ? s.otp_subtitle_with_destination(widget.destination!)
                    : s.otp_subtitle_generic(_otpLength),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  color: MyTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 40),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_otpLength, (index) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: SizedBox(
                      width: 46,
                      height: 56,
                      child: TextField(
                        controller: _controllers[index],
                        focusNode: _focusNodes[index],
                        textAlign: TextAlign.center,
                        keyboardType: TextInputType.number,
                        maxLength: 1,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: MyTheme.textWhite,
                        ),
                        decoration: InputDecoration(
                          counterText: '',
                          filled: true,
                          fillColor: MyTheme.backgroundCard,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide:
                            const BorderSide(color: MyTheme.borderNormal),
                          ),
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
                        onChanged: (value) => _onChanged(index, value),
                      ),
                    ),
                  );
                }),
              ),
              if (_errorText != null) ...[
                const SizedBox(height: 12),
                Text(
                  _errorText!,
                  style: const TextStyle(color: MyTheme.textError, fontSize: 13),
                ),
              ],
              const SizedBox(height: 36),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        MyTheme.textAccent,
                        MyTheme.textAccent.withOpacity(0.8),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ElevatedButton(
                    onPressed: _isVerifying ? null : _handleConfirm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: MyTheme.backgroundMain,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isVerifying
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
                      s.otp_confirm_button,
                      style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: _handleResend,
                child: Text(
                  s.otp_resend_button,
                  style: const TextStyle(color: MyTheme.textAccent, fontSize: 14),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:msb_bank/token_storage.dart';
import 'dart:math' as math;

import 'Auth/login.dart';
import 'Main_Screen.dart';
import 'my_theme.dart';


class SplashScreen extends StatefulWidget {
  static const String routeName = 'SplashScreen';
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _scaleController;
  late AnimationController _fadeController;
  late AnimationController _waveController;
  late AnimationController _progressController;

  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<double> _waveAnimation;
  late Animation<double> _progressAnimation;

  @override
  void initState() {
    super.initState();

    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _waveController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    )..repeat();

    _progressController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _scaleController,
      curve: Curves.elasticOut,
    ));

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    ));

    _waveAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(_waveController);

    _progressAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _progressController,
      curve: Curves.easeInOut,
    ));

    _startAnimations();
  }

  void _startAnimations() async {
    await Future.delayed(const Duration(milliseconds: 300));
    _scaleController.forward();

    await Future.delayed(const Duration(milliseconds: 600));
    _fadeController.forward();

    await Future.delayed(const Duration(milliseconds: 1000));
    _progressController.forward();

    await Future.delayed(const Duration(milliseconds: 4000));
    if (mounted) {
      await _navigateToNextScreen();
    }
  }

  Future<void> _navigateToNextScreen() async {
    final hasValidToken = await _checkToken();

    if (hasValidToken) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => MainScreen()),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
    }
  }

  Future<bool> _checkToken() async {
    try {
      final token = await TokenStorage.getToken();
      if (token == null || token.isEmpty) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _fadeController.dispose();
    _waveController.dispose();
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: MyTheme.backgroundMain,
      body: Stack(
        children: [

          _buildAnimatedBackground(),


          _buildDecorativeCircles(),


          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [

                _buildAnimatedLogo(),

                const SizedBox(height: 48),


                _buildSlogan(),

                const SizedBox(height: 60),


                _buildLoadingBar(),
              ],
            ),
          ),


          _buildVersionText(),
        ],
      ),
    );
  }


  Widget _buildDecorativeCircles() {
    return AnimatedBuilder(
      animation: _waveAnimation,
      builder: (context, child) {
        return Stack(
          children: [

            Positioned(
              top: -80,
              left: -80,
              child: Container(
                width: 250,
                height: 250,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: MyTheme.textAccent.withOpacity(0.06),
                ),
              ),
            ),

            Positioned(
              top: 60,
              right: -50,
              child: Container(
                width: 150,
                height: 150,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: MyTheme.textAccent.withOpacity(0.04),
                ),
              ),
            ),

            Positioned(
              top: 180,
              left: 30,
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: MyTheme.textAccent.withOpacity(0.08),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildAnimatedBackground() {
    return AnimatedBuilder(
      animation: _waveAnimation,
      builder: (context, child) {
        return CustomPaint(
          painter: WavePainter(
            animationValue: _waveAnimation.value,
            color: MyTheme.textAccent.withOpacity(0.08),
          ),
          child: Container(),
        );
      },
    );
  }

  Widget _buildAnimatedLogo() {
    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Stack(
            alignment: Alignment.center,
            children: [

              AnimatedBuilder(
                animation: _waveAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale: 1.0 + (_waveAnimation.value * 0.08),
                    child: Container(
                      width: 175,
                      height: 175,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(44),
                        border: Border.all(
                          color: MyTheme.textAccent.withOpacity(0.18),
                          width: 1.5,
                        ),
                      ),
                    ),
                  );
                },
              ),


              AnimatedBuilder(
                animation: _waveAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale: 1.0 + (_waveAnimation.value * 0.05),
                    child: Container(
                      width: 156,
                      height: 156,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(38),
                        border: Border.all(
                          color: MyTheme.textAccent.withOpacity(0.12),
                          width: 1,
                        ),
                      ),
                    ),
                  );
                },
              ),


              Container(
                width: 140,
                height: 140,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(32),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      MyTheme.backgroundCard.withOpacity(0.95),
                      MyTheme.backgroundCard.withOpacity(0.7),
                    ],
                  ),
                  border: Border.all(
                    color: MyTheme.textAccent.withOpacity(0.35),
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: MyTheme.textAccent.withOpacity(0.3),
                      blurRadius: 35,
                      spreadRadius: 4,
                    ),
                    BoxShadow(
                      color: Colors.black.withOpacity(0.35),
                      blurRadius: 20,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                // ✅ الصورة نفسها
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(30),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Image.asset(
                      'assets/image/logo.png',
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSlogan() {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0.0, end: 1.0),
        duration: const Duration(milliseconds: 1800),
        curve: Curves.easeOut,
        builder: (context, value, child) {
          return Transform.translate(
            offset: Offset(0, 20 * (1 - value)),
            child: Opacity(opacity: value, child: child),
          );
        },
        child: Column(
          children: [

            Text(
              'MSB Bank',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: MyTheme.textWhite,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 8),

            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(
                      color: MyTheme.textAccent.withOpacity(0.4), width: 1),
                  bottom: BorderSide(
                      color: MyTheme.textAccent.withOpacity(0.4), width: 1),
                ),
              ),
              child: Text(
                'حيث تلتقي الثقة بالابتكار',
                style: TextStyle(
                  fontSize: 14,
                  color: MyTheme.textPrimary.withOpacity(0.8),
                  letterSpacing: 1,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingBar() {
    return AnimatedBuilder(
      animation: _progressAnimation,
      builder: (context, child) {
        return Column(
          children: [
            Container(
              width: 220,
              height: 3,
              decoration: BoxDecoration(
                color: MyTheme.backgroundCard,
                borderRadius: BorderRadius.circular(2),
              ),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  width: 220 * _progressAnimation.value,
                  height: 3,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        MyTheme.textAccent.withOpacity(0.6),
                        MyTheme.textAccent,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(2),
                    boxShadow: [
                      BoxShadow(
                        color: MyTheme.textAccent.withOpacity(0.5),
                        blurRadius: 6,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            FadeTransition(
              opacity: _fadeAnimation,
              child: AnimatedBuilder(
                animation: _waveAnimation,
                builder: (context, child) {
                  String dots =
                      '.' * ((_waveAnimation.value * 3).toInt() + 1);
                  return Text(
                    'جاري التحميل$dots',
                    style: TextStyle(
                      fontSize: 13,
                      color: MyTheme.textPrimary.withOpacity(0.6),
                      letterSpacing: 0.5,
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildVersionText() {
    return Positioned(
      bottom: 30,
      left: 0,
      right: 0,
      child: FadeTransition(
        opacity: _fadeAnimation,
        child: Text(
          'Version 1.0.0',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 12,
            color: MyTheme.textPrimary.withOpacity(0.4),
          ),
        ),
      ),
    );
  }
}

class WavePainter extends CustomPainter {
  final double animationValue;
  final Color color;

  WavePainter({required this.animationValue, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(0, size.height * 0.75);
    for (double i = 0; i <= size.width; i++) {
      path.lineTo(
        i,
        size.height * 0.75 +
            math.sin((i / size.width * 2 * math.pi) +
                (animationValue * 2 * math.pi)) *
                25,
      );
    }
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();
    canvas.drawPath(path, paint);

    final path2 = Path();
    paint.color = color.withOpacity(0.5);
    path2.moveTo(0, size.height * 0.85);
    for (double i = 0; i <= size.width; i++) {
      path2.lineTo(
        i,
        size.height * 0.85 +
            math.sin((i / size.width * 2 * math.pi) -
                (animationValue * 2 * math.pi)) *
                15,
      );
    }
    path2.lineTo(size.width, size.height);
    path2.lineTo(0, size.height);
    path2.close();
    canvas.drawPath(path2, paint);
  }

  @override
  bool shouldRepaint(WavePainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
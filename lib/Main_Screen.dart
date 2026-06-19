import 'package:flutter/material.dart';
import 'package:msb_bank/l10n/app_localizations.dart';
import '../my_theme.dart';
import 'Account Details Screen/accout_detis.dart';
import 'Home_screen/home_screen.dart';
import 'Personal/personal_screen.dart';
import 'detils.dart';

class MainScreen extends StatefulWidget {
  static const String routeName = 'main_screen';

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> with TickerProviderStateMixin {
  int selectedIndex = 0;
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.9).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _onItemTapped(int index) {
    _animationController.forward().then((_) {
      _animationController.reverse();
    });
    setState(() {
      selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    // ✅ استخدم متغير s لتجنب تكرار الكود
    final s = AppLocalizations.of(context)!;

    List<Widget> taps = [
      HomeScreen(),
       AccountDetails(),
      AdditionalServices(),
       SettingsProfileScreen(),
    ];

    return Scaffold(
      body: taps[selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              MyTheme.backgroundCard,
              MyTheme.backgroundMain,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            MyTheme.shadowPrimary,
          ],
        ),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                MyTheme.backgroundTransparent,
                Colors.transparent,
              ],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children:[
                  _buildNavItem(
                    icon: Icons.home_rounded,
                    label: 'الرئيسية',
                    index: 0,
                  ),
                  _buildNavItem(
                    icon: Icons.request_page,
                    label: 'الحساب',
                    index: 1,
                  ),
                  _buildNavItem(
                    icon: Icons.home_repair_service_outlined,
                    label: 'الخدمات',
                    index: 2,
                  ),
                  _buildNavItem(
                    icon: Icons.settings_rounded,
                    label: 'الإعدادات',
                    index: 3,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
  }) {
    final isSelected = selectedIndex == index;

    return GestureDetector(
      onTap: () => _onItemTapped(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? 20 : 12,
          vertical: 10,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? MyTheme.backgroundTransparent
              : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: isSelected
              ? Border.all(
            color: MyTheme.borderTransparent,
            width: 1.5,
          )
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            ScaleTransition(
              scale: isSelected
                  ? _scaleAnimation
                  : const AlwaysStoppedAnimation(1.0),
              child: Icon(
                icon,
                color: isSelected ? MyTheme.textAccent : MyTheme.textPrimary,
                size: isSelected ? 26 : 24,
              ),
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 300),
                style: const TextStyle(
                  color: MyTheme.textAccent,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
                child: Text(label),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
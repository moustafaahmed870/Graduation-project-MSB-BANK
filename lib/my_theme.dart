import 'package:flutter/material.dart';

class MyTheme {
  // ================== Backgrounds ==================
  static const Color backgroundMain = Color(0xFF081B29); // #081b29
  static const Color backgroundCard = Color(0xFF0A2438); // #0a2438
  static const Color backgroundTransparent = Color(0x1AFFFFFF); // #FFFFFF1A
  static const Color backgroundHighlightText = Color(0x33000000); // #00000033

  // ================== Text ==================
  static const Color textPrimary = Color(0xFFA0D2DB); // #a0d2db
  static const Color textAccent = Color(0xFF4FC3F7); // #4fc3f7
  static const Color textWhite = Color(0xFFFFFFFF); // #ffffff
  static const Color textError = Color(0xFFFF5252); // #ff5252

  // ================== Borders ==================
  static const Color borderNormal = Color(0xFF317C81); // #317c81
  static const Color borderTransparent = Color(0x4D317C81); // #317C814D (30%)

  // ================== Shadows ==================
  static const BoxShadow shadowDark = BoxShadow(
    color: Color.fromRGBO(0, 0, 0, 0.2), // rgba(0,0,0,0.2)
    blurRadius: 8,
    offset: Offset(0, 4),
  );

  static const BoxShadow shadowPrimary = BoxShadow(
    color: Color(0x66317C81), // #317C8166 (40%)
    blurRadius: 10,
    offset: Offset(0, 4),
  );

  // ================== Decorations (اختياري) ==================
  static BoxDecoration cardDecoration = BoxDecoration(
    color: backgroundCard,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(color: borderNormal),
    boxShadow: const [shadowDark],
  );
}

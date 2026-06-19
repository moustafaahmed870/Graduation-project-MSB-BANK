import 'package:flutter/material.dart';
import 'package:msb_bank/shared_pref.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider extends ChangeNotifier {
  String _appLanguage = 'ar';

  String get appLanguage => _appLanguage;

  LanguageProvider() {
    _loadLanguage();
  }

  Future<String> _getLanguageKey() async {
    final uid = await SharedPrefService.getUid();
    return uid != null ? 'Language_$uid' : 'Language_guest';
  }

  Future<void> _loadLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final key = await _getLanguageKey();

    _appLanguage = prefs.getString(key) ?? 'ar';

    notifyListeners();
  }

  Future<void> changeLanguage(String newLanguage) async {
    if (_appLanguage == newLanguage) return;

    _appLanguage = newLanguage;

    final prefs = await SharedPreferences.getInstance();
    final key = await _getLanguageKey();

    await prefs.setString(key, newLanguage);

    notifyListeners();
  }

  Future<void> reloadLanguage() async {
    await _loadLanguage();
  }
}
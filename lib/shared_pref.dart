import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/my_user.dart';

class SharedPrefService {
  static const String _tokenKey = 'auth_token';
  static const String _userDataKey = 'user_data';
  static const String _isLoggedInKey = 'is_logged_in';
  static const String _hasSeenOnboardingKey = 'has_seen_onboarding';

  // ─── Token ───────────────────────────────────────────
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setBool(_isLoggedInKey, true);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  // ─── UID ─────────────────────────────────────────────
  static Future<void> saveUid(String uid) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_uid', uid);
    await prefs.setBool(_isLoggedInKey, true);
  }

  static Future<String?> getUid() async {
    final user = await getUserData();
    return user?.uid;
  }

  // ─── User Data ────────────────────────────────────────
  static Future<void> saveUserData(MyUserModel user) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_userDataKey, jsonEncode(user.toJson()));
      await prefs.setBool(_isLoggedInKey, true);
    } catch (e) {
      print('❌ Error saving user data: $e');
    }
  }

  static Future<MyUserModel?> getUserData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final dataString = prefs.getString(_userDataKey);
      if (dataString != null && dataString.isNotEmpty) {
        return MyUserModel.fromJson(jsonDecode(dataString));
      }
    } catch (e) {
      print('❌ Error getting user data: $e');
    }
    return null;
  }

  // ─── Auth Status ──────────────────────────────────────
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }

  // ─── Clear ────────────────────────────────────────────
  static Future<void> clearUid() async => await clearAll();

  static Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    final hasSeenOnboarding = prefs.getBool(_hasSeenOnboardingKey) ?? false;
    await prefs.clear();
    await prefs.setBool(_hasSeenOnboardingKey, hasSeenOnboarding);
  }

  // ─── Onboarding ───────────────────────────────────────
  static Future<void> setHasSeenOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_hasSeenOnboardingKey, true);
  }

  static Future<bool> hasSeenOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_hasSeenOnboardingKey) ?? false;
  }
}
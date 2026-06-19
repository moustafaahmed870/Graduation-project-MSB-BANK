import 'dart:io';
import 'dart:convert';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'api_client.dart';
import 'token_storage.dart'; // ✅ import TokenStorage

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
FlutterLocalNotificationsPlugin();

Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();

  const initSettings = InitializationSettings(
    android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    iOS: DarwinInitializationSettings(),
  );
  await flutterLocalNotificationsPlugin.initialize(initSettings);

  if (Platform.isAndroid) {
    const channel = AndroidNotificationChannel(
      'default_channel',
      'General Notifications',
      importance: Importance.max,
    );
    final androidImpl = flutterLocalNotificationsPlugin
        .resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();
    await androidImpl?.createNotificationChannel(channel);
  }

  await _showLocalNotification(message);
}

Future<void> _showLocalNotification(RemoteMessage message) async {
  final prefs = await SharedPreferences.getInstance();
  final lang = prefs.getString('language') ?? 'ar';

  final title = lang == 'ar'
      ? (message.data['titleAr'] ?? message.data['title'] ?? 'إشعار')
      : (message.data['titleEn'] ?? message.data['title'] ?? 'Notification');

  final body = lang == 'ar'
      ? (message.data['bodyAr'] ?? message.data['body'] ?? '')
      : (message.data['bodyEn'] ?? message.data['body'] ?? '');

  await flutterLocalNotificationsPlugin.show(
    message.messageId?.hashCode ?? DateTime.now().millisecondsSinceEpoch,
    title,
    body,
    const NotificationDetails(
      android: AndroidNotificationDetails(
        'default_channel',
        'General Notifications',
        importance: Importance.max,
        priority: Priority.high,
        playSound: true,
        enableVibration: true,
        channelShowBadge: true,
      ),
      iOS: DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    ),
    payload: jsonEncode(message.data),
  );
}

// ============================================================
// NotificationService class
// ============================================================
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  bool _isInitialized = false;
  String? fcmToken;

  // ============= init =============
  Future<void> init() async {
    if (_isInitialized) return;
    _isInitialized = true;
    await _initInternal();
  }

  Future<void> _initInternal() async {
    print('🔔 NOTIFICATION SERVICE INIT');

    try {
      await Firebase.initializeApp();
    } catch (_) {}

    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

    if (Platform.isAndroid) {
      const AndroidNotificationChannel channel = AndroidNotificationChannel(
        'default_channel',
        'General Notifications',
        importance: Importance.max,
      );
      final androidImpl = flutterLocalNotificationsPlugin
          .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();
      await androidImpl?.createNotificationChannel(channel);
    }

    const initSettings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
      iOS: DarwinInitializationSettings(),
    );
    await flutterLocalNotificationsPlugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    await FirebaseMessaging.instance.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // ✅ saveTokenToServer بيستخدم TokenStorage دلوقتي
    await saveTokenToServer();

    FirebaseMessaging.instance.onTokenRefresh.listen((newToken) async {
      fcmToken = newToken;
      await saveTokenToServer(token: newToken);
    });

    FirebaseMessaging.onMessage.listen((message) {
      print('📩 Foreground message received');
      _showLocalNotification(message);
    });

    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      print('📲 App opened from notification');
      _handleNotificationTap(message.data);
    });

    final initialMessage = await FirebaseMessaging.instance.getInitialMessage();
    if (initialMessage != null) {
      print('🚀 App launched from notification');
      _handleNotificationTap(initialMessage.data);
    }

    print('✅ NotificationService initialized');
  }

  // ============= حفظ الـ FCM token في السيرفر =============
  Future<void> saveTokenToServer({String? token}) async {
    try {
      // ✅ استخدام TokenStorage بدل SharedPreferences مباشرة
      final savedToken = await TokenStorage.getToken();

      if (savedToken == null || savedToken.isEmpty) {
        print('⚠️ [NotificationService] No JWT token - user not logged in yet');
        return;
      }

      final fcm = token ?? await FirebaseMessaging.instance.getToken();
      if (fcm == null || fcm.isEmpty) {
        print('⚠️ [NotificationService] No FCM token available');
        return;
      }

      fcmToken = fcm;

      // اقرأ اللغة الحالية
      final prefs = await SharedPreferences.getInstance();
      final language = prefs.getString('language') ?? 'ar';

      await ApiClient.post(
        endpoint: '/notifications/fcm-token',
        token: savedToken,
        body: {
          'token': fcm,
          'language': language,
          'platform': Platform.isAndroid ? 'android' : 'ios',
        },
      );

      print('✅ [NotificationService] FCM token saved to server | lang: $language');
    } catch (e) {
      print('⚠️ [NotificationService] saveTokenToServer error: $e');
    }
  }

  // ============= تحديث اللغة =============
  Future<void> updateLanguage(String language) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('language', language);

      // أعد إرسال الـ token بالغة الجديدة
      await saveTokenToServer();

      print('🌐 [NotificationService] Language updated to: $language');
    } catch (e) {
      print('⚠️ [NotificationService] updateLanguage error: $e');
    }
  }

  // ============= حذف الـ FCM token عند تسجيل الخروج =============
  Future<void> deleteToken() async {
    try {
      // ✅ استخدام TokenStorage
      final savedToken = await TokenStorage.getToken();

      if (savedToken != null && savedToken.isNotEmpty) {
        await ApiClient.delete(
          endpoint: '/notifications/fcm-token',
          token: savedToken,
        );
        print('🗑️ [NotificationService] FCM token deleted from server');
      }

      await FirebaseMessaging.instance.deleteToken();
      fcmToken = null;

      print('🗑️ [NotificationService] FCM token deleted locally');
    } catch (e) {
      print('⚠️ [NotificationService] deleteToken error: $e');
    }
  }

  // ============= تعامل مع الضغط على الإشعار =============
  void _onNotificationTapped(NotificationResponse response) {
    if (response.payload != null) {
      try {
        final data = jsonDecode(response.payload!) as Map<String, dynamic>;
        _handleNotificationTap(data);
      } catch (_) {}
    }
  }

  void _handleNotificationTap(Map<String, dynamic> data) {
    final type = data['type'] ?? '';
    print('🔔 [NotificationService] Notification tapped - type: $type');
  }
}
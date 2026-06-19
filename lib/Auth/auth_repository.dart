// lib/Auth/auth_repository.dart

import '../api_client.dart';

import '../models/my_user.dart';
import '../token_storage.dart';

class AuthRepository {
  // ✅ تسجيل مستخدم جديد
  // ملحوظة: الباك إند لا يرجع token عند التسجيل لأن الحساب
  // status = 'pending' ولازم يستني موافقة الأدمن الأول.
  Future<MyUserModel> register({
    required String fullName,
    required String nationalId,
    required String dateOfBirth,
    required String gender,
    required String phone,
    required String email,
    required String password,
    required String address,
    required String city,
    required String postalCode,
    required String accountType,
    required double initialDeposit,
  }) async {
    print('🟡 [AuthRepository] register() - START');

    final body = {
      'fullName': fullName,
      'nationalId': nationalId,
      'dateOfBirth': dateOfBirth,
      'gender': gender,
      'phone': phone,
      'email': email,
      'password': password,
      'address': address,
      'city': city,
      'postalCode': postalCode,
      'accountType': accountType,
      'initialDeposit': initialDeposit,
    };

    try {
      final response = await ApiClient.post(
        endpoint: '/auth/register',
        body: body,
      ).timeout(
        const Duration(seconds: 15),
        onTimeout: () => throw Exception('انتهت مدة الانتظار، تحقق من الاتصال'),
      );

      print('📥 [AuthRepository] Raw response: $response');

      if (response['success'] != true || response['user'] == null) {
        throw Exception(response['message'] ?? 'حدث خطأ');
      }

      // ✅ لا يوجد token في رد التسجيل - الحساب لسه pending
      // مفيش حفظ في TokenStorage هنا عمداً

      final user = MyUserModel.fromJson(response['user']);
      print('✅ [AuthRepository] Register success (pending): ${user.fullName}');
      return user;
    } catch (e) {
      print('❌ [AuthRepository] register() EXCEPTION: $e');
      rethrow;
    }
  }

  // ✅ تسجيل الدخول
  Future<MyUserModel> login({
    required String email,
    required String password,
  }) async {
    print('🟡 [AuthRepository] login() - START');

    try {
      final response = await ApiClient.post(
        endpoint: '/auth/login',
        body: {'email': email, 'password': password},
      ).timeout(
        const Duration(seconds: 15),
        onTimeout: () => throw Exception('انتهت مدة الانتظار، تحقق من الاتصال'),
      );

      print('📥 [AuthRepository] Raw response: $response');

      // ===================================================
      // ✅ التعامل مع success: false مع تمييز الكود
      // (PENDING_APPROVAL / REJECTED / SUSPENDED / INACTIVE)
      // عن طريق رمي Exception برسالة تبدأ بالكود، عشان
      // الـ Cubit يقدر يميز الحالة ويعرض الشاشة المناسبة.
      // ===================================================
      if (response['success'] == false) {
        final code = response['code'];
        final message = response['message'] ?? 'حدث خطأ';

        if (code == 'PENDING_APPROVAL') {
          throw Exception('PENDING_APPROVAL::$message');
        } else if (code == 'REJECTED') {
          throw Exception('REJECTED::$message');
        } else if (code == 'SUSPENDED') {
          throw Exception('SUSPENDED::$message');
        } else if (code == 'INACTIVE') {
          throw Exception('INACTIVE::$message');
        }

        throw Exception(message);
      }

      // ✅ حفظ التوكن في TokenStorage فقط لو الدخول نجح فعلياً
      if (response['token'] != null) {
        await TokenStorage.saveToken(response['token']);
        print('✅ [AuthRepository] Token saved to TokenStorage');
      } else {
        print('⚠️ [AuthRepository] No token in response!');
        throw Exception('لم يتم استلام التوكن من السيرفر');
      }

      if (response['user'] == null) {
        throw Exception(response['message'] ?? 'حدث خطأ');
      }

      final user = MyUserModel.fromJson(response['user']);
      print('✅ [AuthRepository] Login success: ${user.fullName}');
      return user;
    } catch (e) {
      print('❌ [AuthRepository] login() EXCEPTION: $e');
      rethrow;
    }
  }

  // ✅ تغيير الباسورد (محتاج token)
  Future<void> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    print('🟡 [AuthRepository] changePassword() - START');

    try {
      final token = await TokenStorage.getToken();
      if (token == null) throw Exception('مش مسجل دخول');

      final response = await ApiClient.post(
        endpoint: '/auth/change-password',
        body: {
          'oldPassword': oldPassword,
          'newPassword': newPassword,
        },
        token: token,
      ).timeout(
        const Duration(seconds: 15),
        onTimeout: () => throw Exception('انتهت مدة الانتظار، تحقق من الاتصال'),
      );
      print('✅ [AuthRepository] changePassword response: $response');
    } catch (e) {
      print('❌ [AuthRepository] changePassword() EXCEPTION: $e');
      rethrow;
    }
  }

  // ✅ نسيت الباسورد (مش محتاج token)
  Future<void> forgotPassword({required String email}) async {
    print('🟡 [AuthRepository] forgotPassword() - START');

    try {
      final response = await ApiClient.post(
        endpoint: '/auth/forgot-password',
        body: {'email': email},
      ).timeout(
        const Duration(seconds: 15),
        onTimeout: () => throw Exception('انتهت مدة الانتظار، تحقق من الاتصال'),
      );
      print('✅ [AuthRepository] forgotPassword response: $response');
    } catch (e) {
      print('❌ [AuthRepository] forgotPassword() EXCEPTION: $e');
      rethrow;
    }
  }

  // ✅ تسجيل الخروج
  Future<void> logout() async {
    print('🟡 [AuthRepository] logout() - START');
    await TokenStorage.deleteToken();
    print('✅ [AuthRepository] Token deleted from TokenStorage');
  }

  // ✅ جيب الـ token المحفوظ
  Future<String?> getToken() async {
    final token = await TokenStorage.getToken();
    print('🔑 [AuthRepository] Token: ${token != null ? "موجود" : "NULL"}');
    return token;
  }
}
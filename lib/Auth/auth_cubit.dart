import 'package:flutter_bloc/flutter_bloc.dart';
import 'auth_repository.dart';
import 'auth_state.dart';

class AuthCubit extends Cubit<AuthState> {
  final AuthRepository _authRepository;

  AuthCubit(this._authRepository) : super(AuthInitial());

  // ✅ تسجيل مستخدم جديد
  // ملحوظة مهمة: بعد التسجيل الحساب بيكون status = 'pending'،
  // فمفيش token ومفيش دخول مباشر للتطبيق. بدل ما نعمل AuthSuccess
  // (اللي كانت تودي اليوزر على MainScreen مباشرة)، نعمل
  // AuthRegisteredPending عشان نعرض له رسالة "طلبك قيد المراجعة".
  Future<void> register({
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
    print('🟡 [AuthCubit] register() - START');
    emit(AuthLoading());

    try {
      final user = await _authRepository.register(
        fullName: fullName,
        nationalId: nationalId,
        dateOfBirth: dateOfBirth,
        gender: gender,
        phone: phone,
        email: email,
        password: password,
        address: address,
        city: city,
        postalCode: postalCode,
        accountType: accountType,
        initialDeposit: initialDeposit,
      );
      print('✅ [AuthCubit] register() SUCCESS (pending): ${user.fullName}');
      emit(const AuthRegisteredPending(
        'تم إنشاء طلبك بنجاح، سيتم مراجعته من قبل الإدارة وسيتم إشعارك بالنتيجة',
      ));
    } catch (e) {
      print('❌ [AuthCubit] register() FAILED: $e');
      final errorMsg = e.toString().replaceAll('Exception: ', '');
      emit(AuthError(errorMsg));
    }
  }

  // ✅ تسجيل الدخول
  Future<void> login({
    required String email,
    required String password,
  }) async {
    print('🟡 [AuthCubit] login() - START');
    emit(AuthLoading());

    try {
      final user = await _authRepository.login(
        email: email,
        password: password,
      );
      print('✅ [AuthCubit] login() SUCCESS');
      emit(AuthSuccess(user));
    } catch (e) {
      print('❌ [AuthCubit] login() FAILED: $e');
      final errorMsg = e.toString().replaceAll('Exception: ', '');

      // ===================================================
      // ✅ تمييز حالات الموافقة/الرفض/التعليق عن باقي الأخطاء
      // الشكل المتوقع من auth_repository: 'CODE::message'
      // ===================================================
      if (errorMsg.startsWith('PENDING_APPROVAL::')) {
        emit(AuthPendingApproval(errorMsg.replaceFirst('PENDING_APPROVAL::', '')));
      } else if (errorMsg.startsWith('REJECTED::')) {
        emit(AuthRejected(errorMsg.replaceFirst('REJECTED::', '')));
      } else if (errorMsg.startsWith('SUSPENDED::')) {
        emit(AuthSuspended(errorMsg.replaceFirst('SUSPENDED::', '')));
      } else if (errorMsg.startsWith('INACTIVE::')) {
        emit(AuthError(errorMsg.replaceFirst('INACTIVE::', '')));
      } else {
        emit(AuthError(errorMsg));
      }
    }
  }

  // ✅ تغيير الباسورد
  Future<void> changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    print('🟡 [AuthCubit] changePassword() - START');
    emit(AuthLoading());

    try {
      await _authRepository.changePassword(
        oldPassword: oldPassword,
        newPassword: newPassword,
      );
      print('✅ [AuthCubit] changePassword() SUCCESS');
      emit(const AuthPasswordChanged());
    } catch (e) {
      print('❌ [AuthCubit] changePassword() FAILED: $e');
      final errorMsg = e.toString().replaceAll('Exception: ', '');
      emit(AuthError(errorMsg));
    }
  }

  // ✅ نسيت الباسورد
  Future<void> forgotPassword({required String email}) async {
    print('🟡 [AuthCubit] forgotPassword() - START');
    emit(AuthLoading());

    try {
      await _authRepository.forgotPassword(email: email);
      print('✅ [AuthCubit] forgotPassword() SUCCESS');
      emit(const AuthForgotPasswordSent());
    } catch (e) {
      print('❌ [AuthCubit] forgotPassword() FAILED: $e');
      final errorMsg = e.toString().replaceAll('Exception: ', '');
      emit(AuthError(errorMsg));
    }
  }

  // ✅ تسجيل الخروج
  Future<void> logout() async {
    print('🟡 [AuthCubit] logout() - START');
    await _authRepository.logout();
    emit(AuthLoggedOut());
  }
}
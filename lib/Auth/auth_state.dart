import 'package:equatable/equatable.dart';

import '../models/my_user.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

// الحالة الأولى عند فتح الـ app
class AuthInitial extends AuthState {}

// جاري التحميل
class AuthLoading extends AuthState {}

// تسجيل دخول / إنشاء حساب نجح
class AuthSuccess extends AuthState {
  final MyUserModel user;
  const AuthSuccess(this.user);

  @override
  List<Object?> get props => [user];
}

// حدث خطأ
class AuthError extends AuthState {
  final String message;
  const AuthError(this.message);

  @override
  List<Object?> get props => [message];
}

// تسجيل الخروج
class AuthLoggedOut extends AuthState {}

// تم تغيير الباسورد بنجاح ✅
class AuthPasswordChanged extends AuthState {
  const AuthPasswordChanged();
}

// تم إرسال رابط نسيت الباسورد ✅
class AuthForgotPasswordSent extends AuthState {
  const AuthForgotPasswordSent();
}

// ===================================================
// ✅ حالات جديدة خاصة بنظام موافقة الأدمن
// ===================================================

// تم إنشاء الحساب بنجاح لكنه قيد المراجعة (بعد التسجيل مباشرة)
class AuthRegisteredPending extends AuthState {
  final String message;
  const AuthRegisteredPending(this.message);

  @override
  List<Object?> get props => [message];
}

// المستخدم حاول تسجيل الدخول لكن حسابه لسه قيد المراجعة
class AuthPendingApproval extends AuthState {
  final String message;
  const AuthPendingApproval(this.message);

  @override
  List<Object?> get props => [message];
}

// تم رفض طلب فتح الحساب
class AuthRejected extends AuthState {
  final String message;
  const AuthRejected(this.message);

  @override
  List<Object?> get props => [message];
}

// تم تعليق/إيقاف الحساب
class AuthSuspended extends AuthState {
  final String message;
  const AuthSuspended(this.message);

  @override
  List<Object?> get props => [message];
}
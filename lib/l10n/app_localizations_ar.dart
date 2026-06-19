// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get appTitle => 'بنك MSB';

  @override
  String get registerTitle => 'إنشاء حساب';

  @override
  String get registerSubtitle => 'أدخل بياناتك للبدء';

  @override
  String get fullNameLabel => 'الاسم الكامل';

  @override
  String get nationalIdLabel => 'الرقم القومي';

  @override
  String get dateOfBirthLabel => 'تاريخ الميلاد';

  @override
  String get phoneLabel => 'رقم الهاتف';

  @override
  String get emailLabel => 'البريد الإلكتروني';

  @override
  String get addressLabel => 'العنوان';

  @override
  String get cityLabel => 'المدينة';

  @override
  String get postalCodeLabel => 'الرمز البريدي';

  @override
  String get accountTypeLabel => 'نوع الحساب';

  @override
  String get initialDepositLabel => 'الإيداع الأولي';

  @override
  String get passwordLabel => 'كلمة المرور';

  @override
  String get confirmPasswordLabel => 'تأكيد كلمة المرور';

  @override
  String get agreeTermsText => 'أوافق على الشروط والأحكام';

  @override
  String get nextButton => 'التالي';

  @override
  String get createAccountButton => 'إنشاء الحساب';

  @override
  String get accounts_and_services => 'الحسابات والخدمات';

  @override
  String get tab_account_details => 'تفاصيل الحساب';

  @override
  String get tab_transactions => 'المعاملات';

  @override
  String get tab_transfer_funds => 'تحويل أموال';

  @override
  String get tab_pay_bills => 'دفع فواتير';

  @override
  String get tab_cards => 'البطاقات';

  @override
  String get current_balance => 'الرصيد الحالي';

  @override
  String get currency_egp => 'ج.م';

  @override
  String get account_info => 'معلومات الحساب';

  @override
  String get account_number => 'رقم الحساب';

  @override
  String get account_type => 'نوع الحساب';

  @override
  String get currency => 'العملة';

  @override
  String get email => 'البريد الإلكتروني';

  @override
  String get branch => 'الفرع';

  @override
  String get download_statement => 'تحميل كشف حساب';

  @override
  String get search_transactions => 'بحث في المعاملات...';

  @override
  String get transfer_info_message => 'التحويل متاح للحسابات الداخلية فقط';

  @override
  String get account_number_label => 'رقم الحساب';

  @override
  String get amount_label => 'المبلغ';

  @override
  String get notes_optional => 'ملاحظات (اختياري)';

  @override
  String get confirm_transfer => 'تأكيد التحويل';

  @override
  String get select_service => 'اختر الخدمة';

  @override
  String get service_electricity => 'كهرباء';

  @override
  String get service_water => 'مياه';

  @override
  String get service_gas => 'غاز';

  @override
  String get service_internet => 'إنترنت';

  @override
  String get service_phone => 'هاتف';

  @override
  String get bill_number_label => 'رقم الفاتورة';

  @override
  String get inquire_and_pay => 'استعلام ودفع';

  @override
  String get request_new_card => 'طلب بطاقة جديدة';

  @override
  String get no_cards_yet => 'لا توجد بطاقات حتى الآن';

  @override
  String get request_new_card_hint => 'اضغط على \"طلب بطاقة جديدة\" للبدء';

  @override
  String get expiry_date => 'تاريخ الانتهاء';

  @override
  String get active => 'نشطة';

  @override
  String get inactive => 'موقوفة';

  @override
  String get deactivate_card => 'إيقاف البطاقة';

  @override
  String get activate_card => 'تفعيل البطاقة';

  @override
  String get card_activated => 'تم تفعيل البطاقة';

  @override
  String get card_deactivated => 'تم إيقاف البطاقة';

  @override
  String get confirm_transfer_title => 'تأكيد التحويل';

  @override
  String get to_account => 'إلى حساب';

  @override
  String get transfer => 'تحويل';

  @override
  String get account_number_digits_only => 'رقم الحساب يجب أن يكون أرقاماً فقط';

  @override
  String transfer_success_message(Object amount, Object receiverName) {
    return 'تم تحويل $amount ج.م\nإلى $receiverName ✅';
  }

  @override
  String get field_required => 'هذا الحقل مطلوب';

  @override
  String get note => 'ملاحظة';

  @override
  String get cancel => 'إلغاء';

  @override
  String get ok => 'حسناً';

  @override
  String get card_type_visa => 'فيزا';

  @override
  String get card_type_mastercard => 'ماستركارد';

  @override
  String get card_type_title => 'نوع البطاقة';

  @override
  String get card_category_title => 'فئة البطاقة';

  @override
  String get card_category_debit => 'بطاقة خصم';

  @override
  String get card_category_debit_desc => 'مرتبطة بحسابك مباشرة';

  @override
  String get card_category_credit => 'بطاقة ائتمان';

  @override
  String get card_category_credit_desc => 'سقف ائتماني شهري';

  @override
  String get card_category_prepaid => 'بطاقة مدفوعة مسبقاً';

  @override
  String get card_category_prepaid_desc => 'تشحنها بالمبلغ اللي تريده';

  @override
  String get card_request_review_message =>
      'سيتم مراجعة طلبك من قِبل الإدارة والرد عليك خلال 3-5 أيام عمل';

  @override
  String get card_request_note =>
      'بعد إرسال الطلب، ستصلك إشعار بقرار الإدارة. في حال الموافقة ستظهر البطاقة تلقائياً في قائمة بطاقاتك.';

  @override
  String get submit_request => 'إرسال الطلب';

  @override
  String get request_submitted_title => 'تم إرسال الطلب!';

  @override
  String get welcome_back => 'مرحباً بعودتك';

  @override
  String get login_to_continue => 'سجّل دخولك للمتابعة';

  @override
  String get login_success_message => 'تم تسجيل الدخول بنجاح! 🎉';

  @override
  String get email_required => 'الرجاء إدخال البريد الإلكتروني';

  @override
  String get email_invalid => 'البريد الإلكتروني غير صحيح';

  @override
  String get password_required => 'الرجاء إدخال كلمة المرور';

  @override
  String get password_min_length => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';

  @override
  String get remember_me => 'تذكرني';

  @override
  String get forgot_password => 'نسيت كلمة المرور؟';

  @override
  String get or => 'أو';

  @override
  String get register_title => 'إنشاء حساب جديد';

  @override
  String get register_subtitle => 'أدخل بياناتك لبدء الرحلة المصرفية';

  @override
  String get register_success_message => 'تم إنشاء الحساب بنجاح! 🎉';

  @override
  String get personal_info_step => 'المعلومات\nالشخصية';

  @override
  String get address_step => 'العنوان';

  @override
  String get account_info_step => 'معلومات\nالحساب';

  @override
  String get full_name_label => 'الاسم الكامل';

  @override
  String get national_id_label => 'رقم الهوية الوطنية';

  @override
  String get national_id_invalid => 'رقم الهوية غير صحيح';

  @override
  String get date_of_birth_label => 'تاريخ الميلاد';

  @override
  String get city_label => 'المدينة';

  @override
  String get postal_code_label => 'الرمز البريدي';

  @override
  String get account_type_label => 'نوع الحساب';

  @override
  String get account_type_savings => 'توفير';

  @override
  String get account_type_current => 'جاري';

  @override
  String get account_type_investment => 'استثماري';

  @override
  String get initial_deposit_label => 'الإيداع الأولي';

  @override
  String get minimum_deposit_required => 'الحد الأدنى 100';

  @override
  String get confirm_password_label => 'تأكيد كلمة المرور';

  @override
  String get agree_terms_text => 'أوافق على الشروط والأحكام';

  @override
  String get terms_required => 'يجب الموافقة على الشروط والأحكام';

  @override
  String get previous_button => 'السابق';

  @override
  String get password_min_length_8 => 'يجب أن تكون 8 أحرف على الأقل';

  @override
  String get passwords_not_match => 'كلمات المرور غير متطابقة';

  @override
  String get gender_label => 'النوع';

  @override
  String get gender_male => 'ذكر';

  @override
  String get gender_female => 'أنثى';

  @override
  String get save => 'حفظ';

  @override
  String get continue_button => 'متابعة';

  @override
  String get card_request_review => 'جاري مراجعة طلبك...';

  @override
  String get additional_services => 'الخدمات الإضافية';

  @override
  String get loans_and_credit => 'القروض والائتمان';

  @override
  String get investments => 'الاستثمار';

  @override
  String get offers => 'العروض';

  @override
  String get available_loans => 'القروض المتاحة';

  @override
  String get new_loan_request => 'طلب قرض جديد';

  @override
  String get credit_cards => 'بطاقات الائتمان';

  @override
  String get request_card => 'طلب بطاقة';

  @override
  String get interest_rate => 'الفائدة';

  @override
  String get duration_months => 'المدة بالأشهر';

  @override
  String get view_details => 'عرض التفاصيل';

  @override
  String get months => 'شهر';

  @override
  String get credit_limit => 'الحد الائتماني';

  @override
  String get available => 'المتاح';

  @override
  String get used_percentage => 'تم استخدام';

  @override
  String get total_investments => 'إجمالي الاستثمارات';

  @override
  String get returns => 'العائد';

  @override
  String get percentage => 'النسبة';

  @override
  String get available_investment_plans => 'خطط الاستثمار المتاحة';

  @override
  String get new_investment => 'استثمار جديد';

  @override
  String get minimum_amount => 'الحد الأدنى';

  @override
  String get annual_return => 'العائد السنوي';

  @override
  String get invest_now => 'استثمر الآن';

  @override
  String get risk_label => 'مخاطر';

  @override
  String get expires_on => 'ينتهي في';

  @override
  String get share => 'مشاركة';

  @override
  String get use_now => 'استفد الآن';

  @override
  String get amount_requested => 'المبلغ المطلوب';

  @override
  String get loan_request_submitted => 'تم تقديم طلب القرض بنجاح!';

  @override
  String get request_credit_card => 'طلب بطاقة ائتمان';

  @override
  String get choose_card_type => 'اختر نوع البطاقة المناسبة لك';

  @override
  String get invest => 'استثمر';

  @override
  String get enter_investment_amount => 'حدد المبلغ الذي ترغب في استثماره';

  @override
  String get investment_started => 'تم بدء الاستثمار!';

  @override
  String get status_label => 'الحالة';

  @override
  String get expected_monthly_installment => 'القسط الشهري المتوقع';

  @override
  String get close => 'إغلاق';

  @override
  String get expected_return => 'العائد المتوقع';

  @override
  String get offer_activated => 'تم تفعيل العرض!';

  @override
  String get profile_info_title => 'المعلومات الشخصية';

  @override
  String get address_example => 'القاهرة، مصر الجديدة';

  @override
  String get notifications_title => 'الإشعارات';

  @override
  String get enable_notifications => 'تفعيل الإشعارات';

  @override
  String get enable_notifications_desc => 'استقبال جميع الإشعارات على الجهاز';

  @override
  String get security_privacy_title => 'الأمان والخصوصية';

  @override
  String get change_password => 'تغيير الرقم السري';

  @override
  String get last_password_change => 'آخر تغيير منذ 30 يوم';

  @override
  String get help_support_title => 'المساعدة والدعم';

  @override
  String get help_center => 'مركز المساعدة';

  @override
  String get help_center_desc => 'الأسئلة الشائعة والدعم الفني';

  @override
  String get contact_us => 'تواصل معنا';

  @override
  String get contact_us_desc => 'راسلنا في أي وقت';

  @override
  String get rate_app => 'تقييم التطبيق';

  @override
  String get rate_app_desc => 'شاركنا رأيك وتجربتك';

  @override
  String get general_title => 'عام';

  @override
  String get language => 'اللغة';

  @override
  String get language_arabic => 'العربية';

  @override
  String get currency_egp_label => 'الجنيه المصري (EGP)';

  @override
  String get terms_and_conditions => 'الشروط والأحكام';

  @override
  String get terms_and_conditions_desc => 'قراءة الشروط والأحكام';

  @override
  String get privacy_policy => 'سياسة الخصوصية';

  @override
  String get privacy_policy_desc => 'كيف نحمي بياناتك';

  @override
  String get about_app => 'عن التطبيق';

  @override
  String get version => 'الإصدار';

  @override
  String get secure => 'آمن';

  @override
  String get logout => 'تسجيل الخروج';

  @override
  String get edit_field => 'تعديل';

  @override
  String get enter_new => 'أدخل';

  @override
  String get current_password => 'الرقم السري الحالي';

  @override
  String get new_password => 'الرقم السري الجديد';

  @override
  String get confirm_new_password => 'تأكيد الرقم السري';

  @override
  String get change => 'تغيير';

  @override
  String get logout_confirmation => 'هل أنت متأكد من تسجيل الخروج من حسابك؟';

  @override
  String get action_transfer => 'تحويل';

  @override
  String get action_request_money => 'طلب مبلغ';

  @override
  String get action_bills => 'فواتير';

  @override
  String get action_qr => 'QR';

  @override
  String get request_money_title => 'طلب مبلغ';

  @override
  String get request_money_subtitle => 'هيوصل للشخص إشعار بطلبك';

  @override
  String get person_account_number => 'رقم حساب الشخص';

  @override
  String get account_number_example => 'مثال: 1234567890';

  @override
  String get request_reason_optional => 'سبب الطلب (اختياري)';

  @override
  String get request_reason_hint => 'مثال: حصتي في العشاء';

  @override
  String get please_complete_data => 'من فضلك اكمل البيانات';

  @override
  String get request_sent_success => 'تم إرسال الطلب لـ';

  @override
  String get send_request => 'إرسال الطلب';

  @override
  String get qr_scanner_title => 'QR Scanner';

  @override
  String get qr_scanner_message =>
      'أضف mobile_scanner: ^5.0.0\nفي pubspec.yaml';

  @override
  String get welcome_greeting => 'مرحباً';

  @override
  String get income => 'دخل';

  @override
  String get expenses => 'مصروفات';

  @override
  String get recent_transactions => 'المعاملات الأخيرة';

  @override
  String get view_all => 'عرض الكل';

  @override
  String get no_transactions_yet => 'مفيش معاملات لحد دلوقتي';

  @override
  String get try_again => 'حاول تاني';

  @override
  String get phone_label => 'رقم الهاتف';

  @override
  String get address_label => 'العنوان';

  @override
  String get today => 'اليوم';

  @override
  String get yesterday => 'أمس';

  @override
  String get currency_egp_text => 'جنيه';

  @override
  String get email_label => 'البريد الإلكتروني';

  @override
  String get password_label => 'كلمة المرور';

  @override
  String get login_button => 'تسجيل الدخول';

  @override
  String get no_account => 'ليس لديك حساب؟ ';

  @override
  String get create_account_button => 'إنشاء حساب';

  @override
  String get next_button => 'التالي';

  @override
  String get no_accounts_found => 'لا توجد حسابات';

  @override
  String get customer_name => 'اسم العميل';

  @override
  String get no_transactions_found => 'لا توجد معاملات';

  @override
  String get card_reported_lost => 'تم الإبلاغ عن فقدان البطاقة';

  @override
  String get frozen => 'مجمدة';

  @override
  String get report_lost_card => 'الإبلاغ عن فقدان البطاقة';

  @override
  String get card_lost_reported => 'تم الإبلاغ عن فقدان هذه البطاقة';

  @override
  String get retry => 'إعادة المحاولة';

  @override
  String get report_lost_card_title => 'الإبلاغ عن فقدان البطاقة';

  @override
  String get report_lost_card_confirmation =>
      'هل أنت متأكد من الإبلاغ عن فقدان هذه البطاقة؟ لن تتمكن من استخدامها مرة أخرى.';

  @override
  String get report => 'إبلاغ';

  @override
  String get no_loans_available => 'لا توجد قروض حالياً';

  @override
  String get no_credit_cards => 'لا توجد بطاقات ائتمانية';

  @override
  String get load_cards => 'تحميل البطاقات';

  @override
  String get loan_personal => 'قرض شخصي';

  @override
  String get loan_car => 'قرض سيارة';

  @override
  String get loan_mortgage => 'قرض عقاري';

  @override
  String get installment => 'القسط';

  @override
  String get paid => 'المسدد';

  @override
  String get remaining_amount => 'المتبقي:';

  @override
  String get equity_fund => 'صندوق الأسهم';

  @override
  String get savings_certificates => 'شهادات الادخار';

  @override
  String get bond_fund => 'صندوق السندات';

  @override
  String get islamic_investment => 'الاستثمار الإسلامي';

  @override
  String get risk_medium => 'متوسط';

  @override
  String get risk_low => 'منخفض';

  @override
  String get risk_high => 'عالي';

  @override
  String get offer_shopping_title => 'خصم 20% على التسوق';

  @override
  String get offer_shopping_desc =>
      'احصل على خصم 20% عند التسوق من المتاجر الشريكة';

  @override
  String get offer_cashback_title => 'استرداد نقدي 5%';

  @override
  String get offer_cashback_desc =>
      'استرجع 5% من قيمة مشترياتك عند استخدام البطاقة';

  @override
  String get offer_loan_title => 'سعر فائدة مخفض';

  @override
  String get offer_loan_desc => 'قرض شخصي بفائدة 10% لفترة محدودة';

  @override
  String get offer_premium_title => 'مجاناً لـ 3 أشهر';

  @override
  String get offer_premium_desc => 'اشترك في الخدمات المصرفية المميزة مجاناً';

  @override
  String get status_approved => 'موافق عليه';

  @override
  String get status_pending => 'قيد المراجعة';

  @override
  String get status_rejected => 'مرفوض';

  @override
  String get loan_type => 'نوع القرض';

  @override
  String get monthly_income => 'الدخل الشهري';

  @override
  String get monthly_installment => 'القسط الشهري';

  @override
  String get notes_label => 'ملاحظات:';

  @override
  String get select_language => 'اختر اللغة';

  @override
  String get change_password_api => 'اربط بـ changePassword API';

  @override
  String get coming_soon => 'قريباً';

  @override
  String get please_enter_amount => 'الرجاء إدخال المبلغ';

  @override
  String get tab_qr_code => 'رمز QR';

  @override
  String get qr_code_title => 'رمز QR الخاص بي';

  @override
  String get qr_code_subtitle => 'امسح هذا الرمز لاستلام الأموال بسهولة';

  @override
  String get your_qr_code => 'رمز QR الخاص بحسابك';

  @override
  String get qr_code_share_hint => 'شارك هذا الرمز مع الآخرين لاستلام الأموال';

  @override
  String get loading_qr => 'جاري تحميل رمز QR...';

  @override
  String get scan_qr_code => 'مسح رمز QR';

  @override
  String get qr_code_info =>
      'يمكنك مسح رمز QR الخاص بأي شخص لإرسال الأموال إليه بسرعة';

  @override
  String get scan_result => 'نتيجة المسح';

  @override
  String get scanned_account_number => 'رقم الحساب الممسوح';

  @override
  String get transfer_to_this_account => 'تحويل إلى هذا الحساب';

  @override
  String get otp_title => 'تأكيد الكود';

  @override
  String otp_subtitle_with_destination(String destination) {
    return 'أدخل الكود المرسل إلى $destination';
  }

  @override
  String otp_subtitle_generic(int length) {
    return 'أدخل الكود المكوّن من $length أرقام';
  }

  @override
  String get otp_incomplete_error => 'من فضلك أدخل الكود كامل';

  @override
  String get otp_verified_success => 'تم التحقق بنجاح';

  @override
  String get otp_resend_message => 'تم إعادة إرسال الكود (شكلي فقط)';

  @override
  String get otp_confirm_button => 'تأكيد';

  @override
  String get otp_resend_button => 'إعادة إرسال الكود';
}

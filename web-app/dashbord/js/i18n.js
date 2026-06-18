// js/i18n.js
/**
 * نظام الترجمة للبنك الرقمي
 * يدعم اللغتين العربية والإنجليزية
 * ❌ لا يحتوي على أي أرقام وهمية (45,750 وغيرها)
 */

const I18n = {
    currentLang: localStorage.getItem('language') || 'ar',
    
    translations: {
        ar: {
            // عام
            'app.name': 'MSB BANK',
            'welcome': 'مرحباً',
            'hello': 'مرحباً',
            'account': 'الحساب',
            'balance': 'الرصيد',
            'available_balance': 'الرصيد المتاح',
            'actions': 'الإجراءات',
            'details': 'التفاصيل',
            'status': 'الحالة',
            'active': 'نشط',
            'inactive': 'غير نشط',
            'pending': 'قيد الانتظار',
            'completed': 'مكتمل',
            'failed': 'فشل',
            'cancel': 'إلغاء',
            'confirm': 'تأكيد',
            'save': 'حفظ',
            'close': 'إغلاق',
            'back': 'رجوع',
            'loading': 'جاري التحميل...',
            'error': 'حدث خطأ',
            'success': 'تم بنجاح',
            'warning': 'تحذير',
            'info': 'معلومة',
            'search': 'بحث',
            'filter': 'تصفية',
            'all': 'الكل',
            'no_data': 'لا توجد بيانات',
            'total': 'الإجمالي',
            'fees': 'العمولة',
            
            // القائمة الرئيسية
            'nav.home': 'الرئيسية',
            'nav.accounts': 'الحسابات',
            'nav.transfers': 'التحويلات',
            'nav.payments': 'الدفع',
            'nav.investments': 'الاستثمارات',
            'nav.cards': 'البطاقات',
            'nav.loans': 'القروض',
            'nav.wallet': 'المحفظة',
            'nav.government': 'الخدمات الحكومية',
            'nav.settings': 'الإعدادات',
            
            // الرأس
            'header.currency_rates': 'اسعار العملات',
            'header.language': 'English',
            'header.notifications': 'الإشعارات',
            'header.mark_all_read': 'تعيين الكل كمقروء',
            'header.view_all': 'عرض جميع الإشعارات',
            'header.rewards': 'المكافآت',
            
            // الصفحة الرئيسية
            'home.title': 'الرئيسية',
            'home.new_transfer': 'تحويل جديد',
            'home.ai_assistant': 'المساعد الذكي',
            'home.current_balance': 'رصيدك الحالي',
            'home.this_month': 'هذا الشهر',
            'home.send_money': 'إرسال نقود',
            'home.request_money': 'طلب نقود',
            'home.transfer': 'تحويل',
            'home.quick_actions': 'العمليات السريعة',
            'home.transfer_money': 'تحويل الأموال',
            'home.transfer_desc': 'حول الأموال بسرعة وسهولة إلى أي حساب',
            'home.transfer_now': 'تحويل الآن',
            'home.pay_bills': 'دفع الفواتير',
            'home.pay_desc': 'ادفع فواتيرك الخدمية بكل سهولة',
            'home.pay_now': 'دفع فاتورة',
            'home.e_wallet': 'المحفظة الإلكترونية',
            'home.wallet_desc': 'شحن، إرسال وسحب من المحفظة',
            'home.manage_wallet': 'إدارة المحفظة',
            'home.manage_cards': 'إدارة البطاقات',
            'home.cards_desc': 'تفعيل، تجميد أو طلب بطاقة جديدة',
            'home.manage': 'إدارة',
            'home.wallet_balance': 'رصيد المحفظة',
            'home.recharge': 'شحن المحفظة',
            'home.send_to_mobile': 'إرسال للموبايل',
            'home.qr_code': 'رمز QR',
            'home.savings_goals': 'أهداف التوفير',
            'home.new_goal': 'هدف جديد',
            'home.recent_transactions': 'آخر العمليات',
            
            // صفحة الحسابات
            'accounts.title': 'الحسابات',
            'accounts.new_account': 'حساب جديد',
            'accounts.main_account': 'الحساب الرئيسي',
            'accounts.current_account': 'الحساب الجاري',
            'accounts.account_number': 'رقم الحساب',
            'accounts.all_accounts': 'جميع حساباتي',
            'accounts.recent_transactions': 'آخر عمليات الحساب',
            'accounts.transaction': 'العملية',
            'accounts.description': 'الوصف',
            'accounts.date': 'التاريخ',
            'accounts.amount': 'المبلغ',
            'accounts.send_money': 'إرسال نقود',
            'accounts.request_money': 'طلب نقود',
            'accounts.statement': 'كشف حساب',
            'accounts.saving_account': 'حساب التوفير',
            'accounts.investment_account': 'حساب استثمار',
            
            // صفحة البطاقات
            'cards.title': 'البطاقات',
            'cards.new_card': 'طلب بطاقة جديدة',
            'cards.my_main_card': 'بطاقتي الأساسية',
            'cards.all_cards': 'جميع بطاقاتي',
            'cards.card_holder': 'حامل البطاقة',
            'cards.expiry_date': 'تاريخ الانتهاء',
            'cards.credit_limit': 'الحد الائتماني',
            'cards.used': 'المستخدم',
            'cards.available': 'المتاح',
            'cards.due_date': 'تاريخ الاستحقاق',
            'cards.pay_bill': 'دفع الفاتورة',
            'cards.freeze': 'تجميد مؤقت',
            'cards.report_lost': 'الإبلاغ عن ضياع',
            'cards.unfreeze': 'إلغاء التجميد',
            'cards.frozen': 'مجمدة',
            'cards.lost': 'مفقودة',
            'cards.gold': 'ذهبية',
            'cards.silver': 'فضية',
            'cards.platinum': 'بلاتينية',
            'cards.virtual': 'افتراضية',
            'cards.card_number': 'رقم البطاقة',
            'cards.secure_message': 'جميع بيانات بطاقتك محمية بتقنية التشفير المتقدم',
            
            // صفحة التحويلات
            'transfers.title': 'التحويلات',
            'transfers.quick_transfer': 'تحويل سريع',
            'transfers.internal': 'تحويل داخلي',
            'transfers.internal_desc': 'تحويل بين حساباتك في نفس البنك',
            'transfers.external': 'تحويل خارجي',
            'transfers.external_desc': 'تحويل إلى بنوك أخرى',
            'transfers.international': 'تحويل دولي',
            'transfers.international_desc': 'تحويل إلى حسابات خارج البلاد',
            'transfers.from_account': 'من حساب',
            'transfers.to': 'إلى',
            'transfers.amount': 'المبلغ',
            'transfers.description': 'وصف التحويل',
            'transfers.daily_limit': 'الحد اليومي',
            'transfers.use_max': 'استخدام الحد الأقصى',
            'transfers.add_beneficiary': 'إضافة مستفيد جديد',
            'transfers.recent': 'آخر التحويلات',
            
            // صفحة المدفوعات
            'payments.title': 'المدفوعات',
            'payments.scan_qr': 'مسح QR للدفع',
            'payments.electricity': 'كهرباء',
            'payments.water': 'مياه',
            'payments.internet': 'إنترنت',
            'payments.phone': 'هاتف',
            'payments.due_bills': 'الفواتير المستحقة',
            'payments.pay_all': 'دفع الكل',
            'payments.instant_payments': 'دفعات فورية',
            'payments.service_provider': 'مزود الخدمة',
            'payments.phone_number': 'رقم الهاتف',
            'payments.history': 'سجل المدفوعات',
            
            // صفحة المحفظة
            'wallet.title': 'المحفظة الإلكترونية',
            'wallet.recharge': 'شحن المحفظة',
            'wallet.balance': 'رصيد المحفظة',
            'wallet.this_week': 'هذا الأسبوع',
            'wallet.total_sent': 'إجمالي الإرسال',
            'wallet.total_received': 'إجمالي الاستلام',
            'wallet.transactions_count': 'عدد العمليات',
            'wallet.send': 'إرسال أموال',
            'wallet.send_desc': 'إرسال أموال إلى جهات اتصال',
            'wallet.receive': 'استلام أموال',
            'wallet.receive_desc': 'إنشاء رابط استلام فوري',
            'wallet.withdraw': 'سحب للمصرف',
            'wallet.withdraw_desc': 'تحويل إلى حسابك البنكي',
            'wallet.qr_desc': 'مسح للدفع أو الاستلام',
            'wallet.to_phone': 'إلى (رقم الهاتف)',
            'wallet.message': 'رسالة',
            'wallet.contacts': 'جهات اتصال المحفظة',
            'wallet.add_contact': 'إضافة جهة اتصال',
            
            // صفحة القروض
            'loans.title': 'القروض',
            'loans.calculator': 'حاسبة القروض',
            'loans.my_loans': 'قروضي الحالية',
            'loans.personal_loan': 'قرض شخصي',
            'loans.car_loan': 'قرض سيارة',
            'loans.mortgage': 'قرض عقاري',
            'loans.loan_number': 'رقم القرض',
            'loans.remaining': 'المتبقي',
            'loans.monthly_payment': 'القسط الشهري',
            'loans.due_date': 'تاريخ الاستحقاق',
            'loans.paid_percentage': 'تم سداد',
            'loans.pay_installment': 'دفع القسط',
            'loans.apply_now': 'تقدم الآن',
            'loans.loan_amount': 'مبلغ القرض',
            'loans.term': 'مدة السداد',
            'loans.monthly_income': 'الدخل الشهري',
            'loans.accept_terms': 'أوافق على شروط وأحكام القرض',
            'loans.interest_rate': 'الفائدة',
            'loans.total_interest': 'إجمالي الفائدة',
            'loans.total_payment': 'إجمالي المبلغ',
            
            // صفحة الخدمات الحكومية
            'government.title': 'الخدمات الحكومية',
            'government.search': 'بحث عن خدمة',
            'government.taxes': 'الضرائب',
            'government.taxes_desc': 'دفع الضرائب والجمارك',
            'government.municipality': 'البلدية',
            'government.municipality_desc': 'الخدمات البلدية والتراخيص',
            'government.justice': 'العدل',
            'government.justice_desc': 'الخدمات القضائية والعدلية',
            'government.health': 'الصحة',
            'government.health_desc': 'الخدمات الصحية والتأمين',
            'government.pay_service': 'دفع خدمة حكومية',
            'government.service_type': 'نوع الخدمة',
            'government.service_number': 'رقم الخدمة/الفاتورة',
            'government.due_date': 'تاريخ الاستحقاق',
            'government.payment_method': 'طريقة الدفع',
            'government.history': 'سجل الخدمات',
            
            // صفحة الاستثمارات
            'investments.title': 'الاستثمارات',
            'investments.new_investment': 'استثمار جديد',
            'investments.portfolio': 'محفظة الاستثمار',
            'investments.total_value': 'القيمة الإجمالية',
            'investments.total_return': 'إجمالي العائد',
            'investments.daily_change': 'التغير اليومي',
            'investments.my_investments': 'استثماراتي',
            'investments.opportunities': 'فرص استثمارية جديدة',
            'investments.stocks': 'أسهم',
            'investments.bonds': 'سندات',
            'investments.gold': 'ذهب',
            'investments.real_estate': 'عقارات',
            'investments.invest_now': 'استثمر الآن',
            
            // صفحة الإعدادات
            'settings.title': 'الإعدادات',
            'settings.profile': 'الملف الشخصي',
            'settings.edit': 'تعديل',
            'settings.security': 'الأمان',
            'settings.password': 'كلمة المرور',
            'settings.last_updated': 'تم تحديثها آخر مرة',
            'settings.change': 'تغيير',
            'settings.two_factor': 'المصادقة الثنائية',
            'settings.biometric': 'بصمة الإصبع/الوجه',
            'settings.notifications': 'الإشعارات',
            'settings.transaction_notifications': 'إشعارات المعاملات',
            'settings.security_notifications': 'إشعارات الأمان',
            'settings.marketing_notifications': 'إشعارات تسويقية',
            'settings.currency': 'العملة',
            'settings.default_currency': 'العملة الافتراضية',
            'settings.language': 'اللغة',
            'settings.app_language': 'لغة التطبيق',
            'settings.support': 'الدعم والمساعدة',
            'settings.faq': 'الأسئلة الشائعة',
            'settings.contact_us': 'اتصل بنا',
            
            // نماذج
            'form.amount': 'المبلغ',
            'form.from': 'من',
            'form.to': 'إلى',
            'form.reason': 'السبب',
            'form.optional': 'اختياري',
            'form.confirm_data': 'أؤكد صحة البيانات المدخلة',
            'form.accept_terms': 'أوافق على الشروط والأحكام',
            'form.min_amount': 'الحد الأدنى',
            'form.max_amount': 'الحد الأقصى',
            'form.please_select': 'اختر',
            'form.submit': 'إرسال',
            'form.continue': 'استمرار',
            
            // رسائل التنبيه
            'alert.insufficient_balance': 'رصيد غير كافي لإتمام العملية',
            'alert.transfer_success': 'تم التحويل بنجاح',
            'alert.request_sent': 'تم إرسال الطلب بنجاح',
            'alert.payment_success': 'تم الدفع بنجاح',
            'alert.card_frozen': 'تم تجميد البطاقة بنجاح',
            'alert.card_unfrozen': 'تم إلغاء تجميد البطاقة بنجاح',
            'alert.card_lost_reported': 'تم الإبلاغ عن فقدان البطاقة',
            'alert.password_changed': 'تم تغيير كلمة المرور بنجاح',
            'alert.profile_updated': 'تم تحديث الملف الشخصي بنجاح',
            'alert.wallet_recharged': 'تم شحن المحفظة بنجاح',
            
            // العملات
            'currency.egp': 'ج.م',
            'currency.usd': 'دولار',
            'currency.eur': 'يورو',
            
            // النصوص العامة
            'enter_amount': 'أدخل المبلغ',
            'to_account': 'إلى حساب',
            'enter_account_or_phone': 'أدخل رقم الحساب أو رقم الهاتف',
            'transfer_reason': 'سبب التحويل (اختياري)',
            'confirm_send': 'تأكيد الإرسال',
            'sending_money': 'جاري تحويل الأموال...',
            'transfer_success': 'تم تحويل مبلغ {amount} بنجاح',
            'from_person': 'من شخص',
            'request_reason': 'سبب الطلب (اختياري)',
            'send_request': 'إرسال الطلب',
            'sending_request': 'جاري إرسال الطلب...',
            'user_name': 'اسم المستخدم',
            'copy_qr': 'نسخ رمز QR',
            'qr_copied': 'تم نسخ رمز QR',
            'payment_from_account': 'الدفع من الرصيد',
            'payment_from_card': 'الدفع من بطاقة',
            'vodafone_cash': 'فودافون كاش',
            'recharging': 'جاري شحن المحفظة...',
            'confirm_recharge': 'تأكيد الشحن',
            'now': 'الآن',
            'quick_links': 'روابط سريعة',
            'customer_service': 'خدمة العملاء',
            'contact': 'التواصل',
            'send': 'إرسال',
            'manage': 'إدارة',
            'pay_now': 'دفع الآن',
            'total_amount': 'المبلغ الإجمالي',
            'back_to_home': 'العودة للرئيسية',
            'loading_data': 'جاري تحميل البيانات...',
            'no_transactions': 'لا توجد معاملات',
            'no_accounts': 'لا توجد حسابات',
            'no_cards': 'لا توجد بطاقات',
            'no_bills': 'لا توجد فواتير',
            'no_notifications': 'لا توجد إشعارات',
            
            // أسماء الأشهر
            'january': 'يناير',
            'february': 'فبراير',
            'march': 'مارس',
            'april': 'إبريل',
            'may': 'مايو',
            'june': 'يونيو',
            'july': 'يوليو',
            'august': 'أغسطس',
            'september': 'سبتمبر',
            'october': 'أكتوبر',
            'november': 'نوفمبر',
            'december': 'ديسمبر',
            
            // معاملات
            'transfer_to': 'تحويل إلى',
            'salary_received': 'استلام راتب',
            'electricity_bill': 'فاتورة كهرباء',
            'water_bill': 'فاتورة مياه',
            'internet_bill': 'فاتورة إنترنت',
            'wallet_recharge': 'شحن محفظة',
            
            // تذييل
            'footer.description': 'نقدم لكم خدمات مصرفية آمنة وسريعة تلبي جميع احتياجاتكم المالية مع أعلى معايير الأمان والجودة.',
            'footer.complaints': 'الشكاوى والاقتراحات',
            'footer.technical_support': 'الدعم الفني',
            'footer.copyright': '© {year} MSB BANK. جميع الحقوق محفوظة.',
            'footer.working_hours': 'الأحد - الخميس: 8 صباحاً - 5 مساءً',
            'footer.address': 'القاهرة، مصر',
            
            // رسائل إضافية
            'confirm_freeze': 'تأكيد التجميد',
            'freeze_warning': 'عند تجميد البطاقة، لن تتمكن من استخدامها في أي معاملات حتى تقوم بإلغاء التجميد.',
            'replacement_time': 'مدة استلام البطاقة البديلة: 3-5 أيام عمل',
            'confirm_lost_message': 'هل أنت متأكد من الإبلاغ عن فقدان البطاقة؟',
            'lost_warning': 'تحذير: الإبلاغ عن فقدان البطاقة سيؤدي إلى إلغائها نهائياً وإصدار بطاقة بديلة.',
            'cannot_freeze_lost_card': 'لا يمكن تجميد بطاقة مفقودة',
            'already_reported_lost': 'تم الإبلاغ عن فقدان هذه البطاقة مسبقاً',
            'lost_card_success': 'تم الإبلاغ عن فقدان البطاقة بنجاح',
            'confirm_unfreeze_message': 'هل أنت متأكد من إلغاء تجميد البطاقة؟',
            'confirm_freeze_message': 'هل أنت متأكد من تجميد البطاقة؟',
            'card': 'البطاقة',
            'activate': 'تفعيل'
        },
        
        en: {
            // General
            'app.name': 'MSB BANK',
            'welcome': 'Welcome',
            'hello': 'Hello',
            'account': 'Account',
            'balance': 'Balance',
            'available_balance': 'Available Balance',
            'actions': 'Actions',
            'details': 'Details',
            'status': 'Status',
            'active': 'Active',
            'inactive': 'Inactive',
            'pending': 'Pending',
            'completed': 'Completed',
            'failed': 'Failed',
            'cancel': 'Cancel',
            'confirm': 'Confirm',
            'save': 'Save',
            'close': 'Close',
            'back': 'Back',
            'loading': 'Loading...',
            'error': 'An error occurred',
            'success': 'Success',
            'warning': 'Warning',
            'info': 'Info',
            'search': 'Search',
            'filter': 'Filter',
            'all': 'All',
            'no_data': 'No data available',
            'total': 'Total',
            'fees': 'Fees',
            
            // Main Navigation
            'nav.home': 'Home',
            'nav.accounts': 'Accounts',
            'nav.transfers': 'Transfers',
            'nav.payments': 'Payments',
            'nav.investments': 'Investments',
            'nav.cards': 'Cards',
            'nav.loans': 'Loans',
            'nav.wallet': 'Wallet',
            'nav.government': 'Government',
            'nav.settings': 'Settings',
            
            // Header
            'header.currency_rates': 'Currency Rates',
            'header.language': 'العربية',
            'header.notifications': 'Notifications',
            'header.mark_all_read': 'Mark all as read',
            'header.view_all': 'View all notifications',
            'header.rewards': 'Rewards',
            
            // Home Page
            'home.title': 'Home',
            'home.new_transfer': 'New Transfer',
            'home.ai_assistant': 'AI Assistant',
            'home.current_balance': 'Your Current Balance',
            'home.this_month': 'this month',
            'home.send_money': 'Send Money',
            'home.request_money': 'Request Money',
            'home.transfer': 'Transfer',
            'home.quick_actions': 'Quick Actions',
            'home.transfer_money': 'Transfer Money',
            'home.transfer_desc': 'Transfer money quickly and easily to any account',
            'home.transfer_now': 'Transfer Now',
            'home.pay_bills': 'Pay Bills',
            'home.pay_desc': 'Pay your utility bills easily',
            'home.pay_now': 'Pay Bill',
            'home.e_wallet': 'E-Wallet',
            'home.wallet_desc': 'Recharge, send and withdraw from wallet',
            'home.manage_wallet': 'Manage Wallet',
            'home.manage_cards': 'Manage Cards',
            'home.cards_desc': 'Activate, freeze or request new card',
            'home.manage': 'Manage',
            'home.wallet_balance': 'Wallet Balance',
            'home.recharge': 'Recharge Wallet',
            'home.send_to_mobile': 'Send to Mobile',
            'home.qr_code': 'QR Code',
            'home.savings_goals': 'Savings Goals',
            'home.new_goal': 'New Goal',
            'home.recent_transactions': 'Recent Transactions',
            
            // Accounts Page
            'accounts.title': 'Accounts',
            'accounts.new_account': 'New Account',
            'accounts.main_account': 'Main Account',
            'accounts.current_account': 'Current Account',
            'accounts.account_number': 'Account Number',
            'accounts.all_accounts': 'All My Accounts',
            'accounts.recent_transactions': 'Recent Account Transactions',
            'accounts.transaction': 'Transaction',
            'accounts.description': 'Description',
            'accounts.date': 'Date',
            'accounts.amount': 'Amount',
            'accounts.send_money': 'Send Money',
            'accounts.request_money': 'Request Money',
            'accounts.statement': 'Statement',
            'accounts.saving_account': 'Savings Account',
            'accounts.investment_account': 'Investment Account',
            
            // Cards Page
            'cards.title': 'Cards',
            'cards.new_card': 'Request New Card',
            'cards.my_main_card': 'My Main Card',
            'cards.all_cards': 'All My Cards',
            'cards.card_holder': 'Card Holder',
            'cards.expiry_date': 'Expiry Date',
            'cards.credit_limit': 'Credit Limit',
            'cards.used': 'Used',
            'cards.available': 'Available',
            'cards.due_date': 'Due Date',
            'cards.pay_bill': 'Pay Bill',
            'cards.freeze': 'Temporary Freeze',
            'cards.report_lost': 'Report Lost',
            'cards.unfreeze': 'Unfreeze',
            'cards.frozen': 'Frozen',
            'cards.lost': 'Lost',
            'cards.gold': 'Gold',
            'cards.silver': 'Silver',
            'cards.platinum': 'Platinum',
            'cards.virtual': 'Virtual',
            'cards.card_number': 'Card Number',
            'cards.secure_message': 'All your card data is protected with advanced encryption technology',
            
            // Transfers Page
            'transfers.title': 'Transfers',
            'transfers.quick_transfer': 'Quick Transfer',
            'transfers.internal': 'Internal Transfer',
            'transfers.internal_desc': 'Transfer between your accounts in the same bank',
            'transfers.external': 'External Transfer',
            'transfers.external_desc': 'Transfer to other banks',
            'transfers.international': 'International Transfer',
            'transfers.international_desc': 'Transfer to accounts outside the country',
            'transfers.from_account': 'From Account',
            'transfers.to': 'To',
            'transfers.amount': 'Amount',
            'transfers.description': 'Transfer Description',
            'transfers.daily_limit': 'Daily Limit',
            'transfers.use_max': 'Use Maximum Limit',
            'transfers.add_beneficiary': 'Add New Beneficiary',
            'transfers.recent': 'Recent Transfers',
            
            // Payments Page
            'payments.title': 'Payments',
            'payments.scan_qr': 'Scan QR to Pay',
            'payments.electricity': 'Electricity',
            'payments.water': 'Water',
            'payments.internet': 'Internet',
            'payments.phone': 'Phone',
            'payments.due_bills': 'Due Bills',
            'payments.pay_all': 'Pay All',
            'payments.instant_payments': 'Instant Payments',
            'payments.service_provider': 'Service Provider',
            'payments.phone_number': 'Phone Number',
            'payments.history': 'Payment History',
            
            // Wallet Page
            'wallet.title': 'E-Wallet',
            'wallet.recharge': 'Recharge Wallet',
            'wallet.balance': 'Wallet Balance',
            'wallet.this_week': 'this week',
            'wallet.total_sent': 'Total Sent',
            'wallet.total_received': 'Total Received',
            'wallet.transactions_count': 'Transactions Count',
            'wallet.send': 'Send Money',
            'wallet.send_desc': 'Send money to contacts',
            'wallet.receive': 'Receive Money',
            'wallet.receive_desc': 'Create instant payment link',
            'wallet.withdraw': 'Withdraw to Bank',
            'wallet.withdraw_desc': 'Transfer to your bank account',
            'wallet.qr_desc': 'Scan to pay or receive',
            'wallet.to_phone': 'To (Phone Number)',
            'wallet.message': 'Message',
            'wallet.contacts': 'Wallet Contacts',
            'wallet.add_contact': 'Add Contact',
            
            // Loans Page
            'loans.title': 'Loans',
            'loans.calculator': 'Loan Calculator',
            'loans.my_loans': 'My Current Loans',
            'loans.personal_loan': 'Personal Loan',
            'loans.car_loan': 'Car Loan',
            'loans.mortgage': 'Mortgage',
            'loans.loan_number': 'Loan Number',
            'loans.remaining': 'Remaining',
            'loans.monthly_payment': 'Monthly Payment',
            'loans.due_date': 'Due Date',
            'loans.paid_percentage': 'Paid',
            'loans.pay_installment': 'Pay Installment',
            'loans.apply_now': 'Apply Now',
            'loans.loan_amount': 'Loan Amount',
            'loans.term': 'Term',
            'loans.monthly_income': 'Monthly Income',
            'loans.accept_terms': 'I accept the loan terms and conditions',
            'loans.interest_rate': 'Interest Rate',
            'loans.total_interest': 'Total Interest',
            'loans.total_payment': 'Total Payment',
            
            // Government Page
            'government.title': 'Government Services',
            'government.search': 'Search Service',
            'government.taxes': 'Taxes',
            'government.taxes_desc': 'Pay taxes and customs',
            'government.municipality': 'Municipality',
            'government.municipality_desc': 'Municipal services and licenses',
            'government.justice': 'Justice',
            'government.justice_desc': 'Judicial services',
            'government.health': 'Health',
            'government.health_desc': 'Health services and insurance',
            'government.pay_service': 'Pay Government Service',
            'government.service_type': 'Service Type',
            'government.service_number': 'Service/Bill Number',
            'government.due_date': 'Due Date',
            'government.payment_method': 'Payment Method',
            'government.history': 'Service History',
            
            // Investments Page
            'investments.title': 'Investments',
            'investments.new_investment': 'New Investment',
            'investments.portfolio': 'Investment Portfolio',
            'investments.total_value': 'Total Value',
            'investments.total_return': 'Total Return',
            'investments.daily_change': 'Daily Change',
            'investments.my_investments': 'My Investments',
            'investments.opportunities': 'New Investment Opportunities',
            'investments.stocks': 'Stocks',
            'investments.bonds': 'Bonds',
            'investments.gold': 'Gold',
            'investments.real_estate': 'Real Estate',
            'investments.invest_now': 'Invest Now',
            
            // Settings Page
            'settings.title': 'Settings',
            'settings.profile': 'Profile',
            'settings.edit': 'Edit',
            'settings.security': 'Security',
            'settings.password': 'Password',
            'settings.last_updated': 'Last updated',
            'settings.change': 'Change',
            'settings.two_factor': 'Two-Factor Authentication',
            'settings.biometric': 'Fingerprint/Face ID',
            'settings.notifications': 'Notifications',
            'settings.transaction_notifications': 'Transaction Notifications',
            'settings.security_notifications': 'Security Notifications',
            'settings.marketing_notifications': 'Marketing Notifications',
            'settings.currency': 'Currency',
            'settings.default_currency': 'Default Currency',
            'settings.language': 'Language',
            'settings.app_language': 'App Language',
            'settings.support': 'Support & Help',
            'settings.faq': 'FAQ',
            'settings.contact_us': 'Contact Us',
            
            // Forms
            'form.amount': 'Amount',
            'form.from': 'From',
            'form.to': 'To',
            'form.reason': 'Reason',
            'form.optional': 'Optional',
            'form.confirm_data': 'I confirm that the entered data is correct',
            'form.accept_terms': 'I accept the terms and conditions',
            'form.min_amount': 'Minimum amount',
            'form.max_amount': 'Maximum amount',
            'form.please_select': 'Please select',
            'form.submit': 'Submit',
            'form.continue': 'Continue',
            
            // Alert Messages
            'alert.insufficient_balance': 'Insufficient balance to complete the transaction',
            'alert.transfer_success': 'Transfer completed successfully',
            'alert.request_sent': 'Request sent successfully',
            'alert.payment_success': 'Payment completed successfully',
            'alert.card_frozen': 'Card frozen successfully',
            'alert.card_unfrozen': 'Card unfrozen successfully',
            'alert.card_lost_reported': 'Lost card reported successfully',
            'alert.password_changed': 'Password changed successfully',
            'alert.profile_updated': 'Profile updated successfully',
            'alert.wallet_recharged': 'Wallet recharged successfully',
            
            // Currency
            'currency.egp': 'EGP',
            'currency.usd': 'USD',
            'currency.eur': 'EUR',
            
            // General text
            'enter_amount': 'Enter amount',
            'to_account': 'To Account',
            'enter_account_or_phone': 'Enter account number or phone number',
            'transfer_reason': 'Transfer reason (optional)',
            'confirm_send': 'Confirm Send',
            'sending_money': 'Sending money...',
            'transfer_success': 'Amount {amount} transferred successfully',
            'from_person': 'From Person',
            'request_reason': 'Request reason (optional)',
            'send_request': 'Send Request',
            'sending_request': 'Sending request...',
            'user_name': 'Username',
            'copy_qr': 'Copy QR Code',
            'qr_copied': 'QR Code copied',
            'payment_from_account': 'Pay from Balance',
            'payment_from_card': 'Pay from Card',
            'vodafone_cash': 'Vodafone Cash',
            'recharging': 'Recharging wallet...',
            'confirm_recharge': 'Confirm Recharge',
            'now': 'now',
            'quick_links': 'Quick Links',
            'customer_service': 'Customer Service',
            'contact': 'Contact',
            'send': 'Send',
            'manage': 'Manage',
            'pay_now': 'Pay Now',
            'total_amount': 'Total Amount',
            'back_to_home': 'Back to Home',
            'loading_data': 'Loading data...',
            'no_transactions': 'No transactions',
            'no_accounts': 'No accounts',
            'no_cards': 'No cards',
            'no_bills': 'No bills',
            'no_notifications': 'No notifications',
            
            // Months
            'january': 'January',
            'february': 'February',
            'march': 'March',
            'april': 'April',
            'may': 'May',
            'june': 'June',
            'july': 'July',
            'august': 'August',
            'september': 'September',
            'october': 'October',
            'november': 'November',
            'december': 'December',
            
            // Transactions
            'transfer_to': 'Transfer to',
            'salary_received': 'Salary Received',
            'electricity_bill': 'Electricity Bill',
            'water_bill': 'Water Bill',
            'internet_bill': 'Internet Bill',
            'wallet_recharge': 'Wallet Recharge',
            
            // Footer
            'footer.description': 'We provide you with secure and fast banking services that meet all your financial needs with the highest standards of security and quality.',
            'footer.complaints': 'Complaints & Suggestions',
            'footer.technical_support': 'Technical Support',
            'footer.copyright': '© {year} MSB BANK. All rights reserved.',
            'footer.working_hours': 'Sunday - Thursday: 8 AM - 5 PM',
            'footer.address': 'Cairo, Egypt',
            
            // Additional messages
            'confirm_freeze': 'Confirm Freeze',
            'freeze_warning': 'When freezing the card, you will not be able to use it in any transactions until you unfreeze it.',
            'replacement_time': 'Replacement card delivery time: 3-5 business days',
            'confirm_lost_message': 'Are you sure you want to report the card as lost?',
            'lost_warning': 'Warning: Reporting a lost card will permanently cancel it and issue a replacement card.',
            'cannot_freeze_lost_card': 'Cannot freeze a lost card',
            'already_reported_lost': 'This card has already been reported as lost',
            'lost_card_success': 'Card reported as lost successfully',
            'confirm_unfreeze_message': 'Are you sure you want to unfreeze the card?',
            'confirm_freeze_message': 'Are you sure you want to freeze the card?',
            'card': 'Card',
            'activate': 'Activate'
        }
    },
    
    t: function(key) {
        return this.translations[this.currentLang]?.[key] || key;
    },
    
    setLanguage: function(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updatePageDirection();
            this.updatePageContent();
            this.updateLanguageButton();
            document.dispatchEvent(new CustomEvent('languageChanged'));
        }
    },
    
    toggleLanguage: function() {
        const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.setLanguage(newLang);
        return newLang;
    },
    
    updatePageDirection: function() {
        document.body.classList.remove('rtl', 'ltr');
        document.body.classList.add(this.currentLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;
    },
    
    updatePageContent: function() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.setAttribute('placeholder', translation);
                }
            } else {
                element.textContent = translation;
            }
        });
        
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const data = element.getAttribute('data-i18n-attr').split(',');
            data.forEach(item => {
                const [attr, key] = item.split(':');
                if (attr && key) {
                    element.setAttribute(attr, this.t(key));
                }
            });
        });
        
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            let translation = this.t(key);
            
            if (key === 'footer.copyright') {
                const year = new Date().getFullYear();
                translation = translation.replace('{year}', year);
            }
            
            element.innerHTML = translation;
        });
    },
    
    updateLanguageButton: function() {
        const langButtons = document.querySelectorAll('[data-i18n-lang-btn]');
        langButtons.forEach(btn => {
            btn.innerHTML = `<i class="fas fa-language"></i> ${this.t('header.language')}`;
        });
    },
    
    init: function() {
        this.currentLang = localStorage.getItem('language') || 'ar';
        this.updatePageDirection();
        this.updatePageContent();
        this.updateLanguageButton();
        
        document.querySelectorAll('[data-i18n-toggle]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleLanguage();
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});
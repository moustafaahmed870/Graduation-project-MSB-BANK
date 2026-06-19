// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'MSB Bank';

  @override
  String get registerTitle => 'Create Account';

  @override
  String get registerSubtitle => 'Fill in your details to get started';

  @override
  String get fullNameLabel => 'Full Name';

  @override
  String get nationalIdLabel => 'National ID';

  @override
  String get dateOfBirthLabel => 'Date of Birth';

  @override
  String get phoneLabel => 'Phone Number';

  @override
  String get emailLabel => 'Email';

  @override
  String get addressLabel => 'Address';

  @override
  String get cityLabel => 'City';

  @override
  String get postalCodeLabel => 'Postal Code';

  @override
  String get accountTypeLabel => 'Account Type';

  @override
  String get initialDepositLabel => 'Initial Deposit';

  @override
  String get passwordLabel => 'Password';

  @override
  String get confirmPasswordLabel => 'Confirm Password';

  @override
  String get agreeTermsText => 'I agree to the Terms and Conditions';

  @override
  String get nextButton => 'Next';

  @override
  String get createAccountButton => 'Create Account';

  @override
  String get accounts_and_services => 'Accounts & Services';

  @override
  String get tab_account_details => 'Account Details';

  @override
  String get tab_transactions => 'Transactions';

  @override
  String get tab_transfer_funds => 'Transfer Funds';

  @override
  String get tab_pay_bills => 'Pay Bills';

  @override
  String get tab_cards => 'Cards';

  @override
  String get current_balance => 'Current Balance';

  @override
  String get currency_egp => 'EGP';

  @override
  String get account_info => 'Account Information';

  @override
  String get account_number => 'Account Number';

  @override
  String get account_type => 'Account Type';

  @override
  String get currency => 'Currency';

  @override
  String get email => 'Email';

  @override
  String get branch => 'Branch';

  @override
  String get download_statement => 'Download Statement';

  @override
  String get search_transactions => 'Search transactions...';

  @override
  String get transfer_info_message =>
      'Transfer is available for internal accounts only';

  @override
  String get account_number_label => 'Account Number';

  @override
  String get amount_label => 'Amount';

  @override
  String get notes_optional => 'Notes (optional)';

  @override
  String get confirm_transfer => 'Confirm Transfer';

  @override
  String get select_service => 'Select Service';

  @override
  String get service_electricity => 'Electricity';

  @override
  String get service_water => 'Water';

  @override
  String get service_gas => 'Gas';

  @override
  String get service_internet => 'Internet';

  @override
  String get service_phone => 'Phone';

  @override
  String get bill_number_label => 'Bill Number';

  @override
  String get inquire_and_pay => 'Inquire & Pay';

  @override
  String get request_new_card => 'Request New Card';

  @override
  String get no_cards_yet => 'No cards yet';

  @override
  String get request_new_card_hint => 'Tap \"Request New Card\" to get started';

  @override
  String get expiry_date => 'Expiry Date';

  @override
  String get active => 'Active';

  @override
  String get inactive => 'Inactive';

  @override
  String get deactivate_card => 'Deactivate Card';

  @override
  String get activate_card => 'Activate Card';

  @override
  String get card_activated => 'Card activated';

  @override
  String get card_deactivated => 'Card deactivated';

  @override
  String get confirm_transfer_title => 'Confirm Transfer';

  @override
  String get to_account => 'To Account';

  @override
  String get transfer => 'Transfer';

  @override
  String get account_number_digits_only =>
      'Account number must contain only digits';

  @override
  String transfer_success_message(Object amount, Object receiverName) {
    return 'Transferred $amount EGP\nto $receiverName ✅';
  }

  @override
  String get field_required => 'This field is required';

  @override
  String get note => 'Note';

  @override
  String get cancel => 'Cancel';

  @override
  String get ok => 'OK';

  @override
  String get card_type_visa => 'Visa';

  @override
  String get card_type_mastercard => 'Mastercard';

  @override
  String get card_type_title => 'Card Type';

  @override
  String get card_category_title => 'Card Category';

  @override
  String get card_category_debit => 'Debit Card';

  @override
  String get card_category_debit_desc => 'Linked directly to your account';

  @override
  String get card_category_credit => 'Credit Card';

  @override
  String get card_category_credit_desc => 'Monthly credit limit';

  @override
  String get card_category_prepaid => 'Prepaid Card';

  @override
  String get card_category_prepaid_desc => 'Load it with the amount you want';

  @override
  String get card_request_review_message =>
      'Your request will be reviewed by management and you will be contacted within 3-5 business days';

  @override
  String get card_request_note =>
      'After submitting the request, you will receive a notification of the management\'s decision. If approved, the card will automatically appear in your cards list.';

  @override
  String get submit_request => 'Submit Request';

  @override
  String get request_submitted_title => 'Request Submitted!';

  @override
  String get welcome_back => 'Welcome Back';

  @override
  String get login_to_continue => 'Login to continue';

  @override
  String get login_success_message => 'Login successful! 🎉';

  @override
  String get email_required => 'Please enter your email';

  @override
  String get email_invalid => 'Invalid email address';

  @override
  String get password_required => 'Please enter your password';

  @override
  String get password_min_length => 'Password must be at least 6 characters';

  @override
  String get remember_me => 'Remember Me';

  @override
  String get forgot_password => 'Forgot Password?';

  @override
  String get or => 'Or';

  @override
  String get register_title => 'Create New Account';

  @override
  String get register_subtitle =>
      'Enter your details to start your banking journey';

  @override
  String get register_success_message => 'Account created successfully! 🎉';

  @override
  String get personal_info_step => 'Personal\nInformation';

  @override
  String get address_step => 'Address';

  @override
  String get account_info_step => 'Account\nInformation';

  @override
  String get full_name_label => 'Full Name';

  @override
  String get national_id_label => 'National ID Number';

  @override
  String get national_id_invalid => 'Invalid ID number';

  @override
  String get date_of_birth_label => 'Date of Birth';

  @override
  String get city_label => 'City';

  @override
  String get postal_code_label => 'Postal Code';

  @override
  String get account_type_label => 'Account Type';

  @override
  String get account_type_savings => 'Savings';

  @override
  String get account_type_current => 'Current';

  @override
  String get account_type_investment => 'Investment';

  @override
  String get initial_deposit_label => 'Initial Deposit';

  @override
  String get minimum_deposit_required => 'Minimum 100 required';

  @override
  String get confirm_password_label => 'Confirm Password';

  @override
  String get agree_terms_text => 'I agree to the Terms and Conditions';

  @override
  String get terms_required => 'You must agree to the terms and conditions';

  @override
  String get previous_button => 'Previous';

  @override
  String get password_min_length_8 => 'Password must be at least 8 characters';

  @override
  String get passwords_not_match => 'Passwords do not match';

  @override
  String get gender_label => 'Gender';

  @override
  String get gender_male => 'Male';

  @override
  String get gender_female => 'Female';

  @override
  String get save => 'Save';

  @override
  String get continue_button => 'Continue';

  @override
  String get card_request_review => 'Your request is being reviewed...';

  @override
  String get additional_services => 'Additional Services';

  @override
  String get loans_and_credit => 'Loans & Credit';

  @override
  String get investments => 'Investments';

  @override
  String get offers => 'Offers';

  @override
  String get available_loans => 'Available Loans';

  @override
  String get new_loan_request => 'New Loan Request';

  @override
  String get credit_cards => 'Credit Cards';

  @override
  String get request_card => 'Request Card';

  @override
  String get interest_rate => 'Interest Rate';

  @override
  String get duration_months => 'Duration (Months)';

  @override
  String get view_details => 'View Details';

  @override
  String get months => 'months';

  @override
  String get credit_limit => 'Credit Limit';

  @override
  String get available => 'Available';

  @override
  String get used_percentage => 'Used';

  @override
  String get total_investments => 'Total Investments';

  @override
  String get returns => 'Returns';

  @override
  String get percentage => 'Percentage';

  @override
  String get available_investment_plans => 'Available Investment Plans';

  @override
  String get new_investment => 'New Investment';

  @override
  String get minimum_amount => 'Minimum Amount';

  @override
  String get annual_return => 'Annual Return';

  @override
  String get invest_now => 'Invest Now';

  @override
  String get risk_label => 'Risk';

  @override
  String get expires_on => 'Expires on';

  @override
  String get share => 'Share';

  @override
  String get use_now => 'Use Now';

  @override
  String get amount_requested => 'Amount Requested';

  @override
  String get loan_request_submitted => 'Loan request submitted successfully!';

  @override
  String get request_credit_card => 'Request Credit Card';

  @override
  String get choose_card_type => 'Choose the card type that suits you';

  @override
  String get invest => 'Invest';

  @override
  String get enter_investment_amount => 'Enter the amount you wish to invest';

  @override
  String get investment_started => 'Investment started!';

  @override
  String get status_label => 'Status';

  @override
  String get expected_monthly_installment => 'Expected Monthly Installment';

  @override
  String get close => 'Close';

  @override
  String get expected_return => 'Expected Return';

  @override
  String get offer_activated => 'Offer Activated!';

  @override
  String get profile_info_title => 'Personal Information';

  @override
  String get address_example => 'Cairo, Heliopolis';

  @override
  String get notifications_title => 'Notifications';

  @override
  String get enable_notifications => 'Enable Notifications';

  @override
  String get enable_notifications_desc => 'Receive all notifications on device';

  @override
  String get security_privacy_title => 'Security & Privacy';

  @override
  String get change_password => 'Change Password';

  @override
  String get last_password_change => 'Last changed 30 days ago';

  @override
  String get help_support_title => 'Help & Support';

  @override
  String get help_center => 'Help Center';

  @override
  String get help_center_desc => 'FAQs and technical support';

  @override
  String get contact_us => 'Contact Us';

  @override
  String get contact_us_desc => 'Message us anytime';

  @override
  String get rate_app => 'Rate App';

  @override
  String get rate_app_desc => 'Share your feedback and experience';

  @override
  String get general_title => 'General';

  @override
  String get language => 'Language';

  @override
  String get language_arabic => 'Arabic';

  @override
  String get currency_egp_label => 'Egyptian Pound (EGP)';

  @override
  String get terms_and_conditions => 'Terms & Conditions';

  @override
  String get terms_and_conditions_desc => 'Read terms and conditions';

  @override
  String get privacy_policy => 'Privacy Policy';

  @override
  String get privacy_policy_desc => 'How we protect your data';

  @override
  String get about_app => 'About App';

  @override
  String get version => 'Version';

  @override
  String get secure => 'Secure';

  @override
  String get logout => 'Logout';

  @override
  String get edit_field => 'Edit';

  @override
  String get enter_new => 'Enter new';

  @override
  String get current_password => 'Current Password';

  @override
  String get new_password => 'New Password';

  @override
  String get confirm_new_password => 'Confirm New Password';

  @override
  String get change => 'Change';

  @override
  String get logout_confirmation => 'Are you sure you want to logout?';

  @override
  String get action_transfer => 'Transfer';

  @override
  String get action_request_money => 'Request Money';

  @override
  String get action_bills => 'Bills';

  @override
  String get action_qr => 'QR';

  @override
  String get request_money_title => 'Request Money';

  @override
  String get request_money_subtitle =>
      'The person will receive a notification of your request';

  @override
  String get person_account_number => 'Person\'s Account Number';

  @override
  String get account_number_example => 'Example: 1234567890';

  @override
  String get request_reason_optional => 'Request Reason (Optional)';

  @override
  String get request_reason_hint => 'Example: My share for dinner';

  @override
  String get please_complete_data => 'Please complete the data';

  @override
  String get request_sent_success => 'Request sent to';

  @override
  String get send_request => 'Send Request';

  @override
  String get qr_scanner_title => 'QR Scanner';

  @override
  String get qr_scanner_message =>
      'Add mobile_scanner: ^5.0.0\nto pubspec.yaml';

  @override
  String get welcome_greeting => 'Welcome';

  @override
  String get income => 'Income';

  @override
  String get expenses => 'Expenses';

  @override
  String get recent_transactions => 'Recent Transactions';

  @override
  String get view_all => 'View All';

  @override
  String get no_transactions_yet => 'No transactions yet';

  @override
  String get try_again => 'Try Again';

  @override
  String get phone_label => 'Phone Number';

  @override
  String get address_label => 'Address';

  @override
  String get today => 'Today';

  @override
  String get yesterday => 'Yesterday';

  @override
  String get currency_egp_text => 'Pounds';

  @override
  String get email_label => 'Email';

  @override
  String get password_label => 'Password';

  @override
  String get login_button => 'Login';

  @override
  String get no_account => 'Don\'t have an account? ';

  @override
  String get create_account_button => 'Create Account';

  @override
  String get next_button => 'Next';

  @override
  String get no_accounts_found => 'No accounts found';

  @override
  String get customer_name => 'Customer Name';

  @override
  String get no_transactions_found => 'No transactions found';

  @override
  String get card_reported_lost => 'Card reported lost';

  @override
  String get frozen => 'Frozen';

  @override
  String get report_lost_card => 'Report Lost Card';

  @override
  String get card_lost_reported => 'This card has been reported lost';

  @override
  String get retry => 'Retry';

  @override
  String get report_lost_card_title => 'Report Lost Card';

  @override
  String get report_lost_card_confirmation =>
      'Are you sure you want to report this card as lost? You will not be able to use it again.';

  @override
  String get report => 'Report';

  @override
  String get no_loans_available => 'No loans available';

  @override
  String get no_credit_cards => 'No credit cards available';

  @override
  String get load_cards => 'Load Cards';

  @override
  String get loan_personal => 'Personal Loan';

  @override
  String get loan_car => 'Car Loan';

  @override
  String get loan_mortgage => 'Mortgage Loan';

  @override
  String get installment => 'Installment';

  @override
  String get paid => 'Paid';

  @override
  String get remaining_amount => 'Remaining:';

  @override
  String get equity_fund => 'Equity Fund';

  @override
  String get savings_certificates => 'Savings Certificates';

  @override
  String get bond_fund => 'Bond Fund';

  @override
  String get islamic_investment => 'Islamic Investment';

  @override
  String get risk_medium => 'Medium';

  @override
  String get risk_low => 'Low';

  @override
  String get risk_high => 'High';

  @override
  String get offer_shopping_title => '20% Off Shopping';

  @override
  String get offer_shopping_desc =>
      'Get 20% discount when shopping at partner stores';

  @override
  String get offer_cashback_title => '5% Cashback';

  @override
  String get offer_cashback_desc =>
      'Get 5% cashback on your purchases when using the card';

  @override
  String get offer_loan_title => 'Reduced Interest Rate';

  @override
  String get offer_loan_desc =>
      'Personal loan with 10% interest for a limited time';

  @override
  String get offer_premium_title => 'Free for 3 Months';

  @override
  String get offer_premium_desc =>
      'Subscribe to premium banking services for free';

  @override
  String get status_approved => 'Approved';

  @override
  String get status_pending => 'Pending';

  @override
  String get status_rejected => 'Rejected';

  @override
  String get loan_type => 'Loan Type';

  @override
  String get monthly_income => 'Monthly Income';

  @override
  String get monthly_installment => 'Monthly Installment';

  @override
  String get notes_label => 'Notes:';

  @override
  String get select_language => 'Select Language';

  @override
  String get change_password_api => 'Connect to changePassword API';

  @override
  String get coming_soon => 'Coming Soon';

  @override
  String get please_enter_amount => 'Please enter the amount';

  @override
  String get tab_qr_code => 'QR Code';

  @override
  String get qr_code_title => 'My QR Code';

  @override
  String get qr_code_subtitle => 'Scan this code to receive money easily';

  @override
  String get your_qr_code => 'Your Account QR Code';

  @override
  String get qr_code_share_hint =>
      'Share this code with others to receive money';

  @override
  String get loading_qr => 'Loading QR Code...';

  @override
  String get scan_qr_code => 'Scan QR Code';

  @override
  String get qr_code_info =>
      'Scan anyone\'s QR code to send them money quickly';

  @override
  String get scan_result => 'Scan Result';

  @override
  String get scanned_account_number => 'Scanned Account Number';

  @override
  String get transfer_to_this_account => 'Transfer to this account';
}

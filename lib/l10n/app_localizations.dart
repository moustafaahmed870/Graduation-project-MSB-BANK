import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en'),
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'MSB Bank'**
  String get appTitle;

  /// No description provided for @registerTitle.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get registerTitle;

  /// No description provided for @registerSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Fill in your details to get started'**
  String get registerSubtitle;

  /// No description provided for @fullNameLabel.
  ///
  /// In en, this message translates to:
  /// **'Full Name'**
  String get fullNameLabel;

  /// No description provided for @nationalIdLabel.
  ///
  /// In en, this message translates to:
  /// **'National ID'**
  String get nationalIdLabel;

  /// No description provided for @dateOfBirthLabel.
  ///
  /// In en, this message translates to:
  /// **'Date of Birth'**
  String get dateOfBirthLabel;

  /// No description provided for @phoneLabel.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get phoneLabel;

  /// No description provided for @emailLabel.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get emailLabel;

  /// No description provided for @addressLabel.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get addressLabel;

  /// No description provided for @cityLabel.
  ///
  /// In en, this message translates to:
  /// **'City'**
  String get cityLabel;

  /// No description provided for @postalCodeLabel.
  ///
  /// In en, this message translates to:
  /// **'Postal Code'**
  String get postalCodeLabel;

  /// No description provided for @accountTypeLabel.
  ///
  /// In en, this message translates to:
  /// **'Account Type'**
  String get accountTypeLabel;

  /// No description provided for @initialDepositLabel.
  ///
  /// In en, this message translates to:
  /// **'Initial Deposit'**
  String get initialDepositLabel;

  /// No description provided for @passwordLabel.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get passwordLabel;

  /// No description provided for @confirmPasswordLabel.
  ///
  /// In en, this message translates to:
  /// **'Confirm Password'**
  String get confirmPasswordLabel;

  /// No description provided for @agreeTermsText.
  ///
  /// In en, this message translates to:
  /// **'I agree to the Terms and Conditions'**
  String get agreeTermsText;

  /// No description provided for @nextButton.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get nextButton;

  /// No description provided for @createAccountButton.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get createAccountButton;

  /// No description provided for @accounts_and_services.
  ///
  /// In en, this message translates to:
  /// **'Accounts & Services'**
  String get accounts_and_services;

  /// No description provided for @tab_account_details.
  ///
  /// In en, this message translates to:
  /// **'Account Details'**
  String get tab_account_details;

  /// No description provided for @tab_transactions.
  ///
  /// In en, this message translates to:
  /// **'Transactions'**
  String get tab_transactions;

  /// No description provided for @tab_transfer_funds.
  ///
  /// In en, this message translates to:
  /// **'Transfer Funds'**
  String get tab_transfer_funds;

  /// No description provided for @tab_pay_bills.
  ///
  /// In en, this message translates to:
  /// **'Pay Bills'**
  String get tab_pay_bills;

  /// No description provided for @tab_cards.
  ///
  /// In en, this message translates to:
  /// **'Cards'**
  String get tab_cards;

  /// No description provided for @current_balance.
  ///
  /// In en, this message translates to:
  /// **'Current Balance'**
  String get current_balance;

  /// No description provided for @currency_egp.
  ///
  /// In en, this message translates to:
  /// **'EGP'**
  String get currency_egp;

  /// No description provided for @account_info.
  ///
  /// In en, this message translates to:
  /// **'Account Information'**
  String get account_info;

  /// No description provided for @account_number.
  ///
  /// In en, this message translates to:
  /// **'Account Number'**
  String get account_number;

  /// No description provided for @account_type.
  ///
  /// In en, this message translates to:
  /// **'Account Type'**
  String get account_type;

  /// No description provided for @currency.
  ///
  /// In en, this message translates to:
  /// **'Currency'**
  String get currency;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @branch.
  ///
  /// In en, this message translates to:
  /// **'Branch'**
  String get branch;

  /// No description provided for @download_statement.
  ///
  /// In en, this message translates to:
  /// **'Download Statement'**
  String get download_statement;

  /// No description provided for @search_transactions.
  ///
  /// In en, this message translates to:
  /// **'Search transactions...'**
  String get search_transactions;

  /// No description provided for @transfer_info_message.
  ///
  /// In en, this message translates to:
  /// **'Transfer is available for internal accounts only'**
  String get transfer_info_message;

  /// No description provided for @account_number_label.
  ///
  /// In en, this message translates to:
  /// **'Account Number'**
  String get account_number_label;

  /// No description provided for @amount_label.
  ///
  /// In en, this message translates to:
  /// **'Amount'**
  String get amount_label;

  /// No description provided for @notes_optional.
  ///
  /// In en, this message translates to:
  /// **'Notes (optional)'**
  String get notes_optional;

  /// No description provided for @confirm_transfer.
  ///
  /// In en, this message translates to:
  /// **'Confirm Transfer'**
  String get confirm_transfer;

  /// No description provided for @select_service.
  ///
  /// In en, this message translates to:
  /// **'Select Service'**
  String get select_service;

  /// No description provided for @service_electricity.
  ///
  /// In en, this message translates to:
  /// **'Electricity'**
  String get service_electricity;

  /// No description provided for @service_water.
  ///
  /// In en, this message translates to:
  /// **'Water'**
  String get service_water;

  /// No description provided for @service_gas.
  ///
  /// In en, this message translates to:
  /// **'Gas'**
  String get service_gas;

  /// No description provided for @service_internet.
  ///
  /// In en, this message translates to:
  /// **'Internet'**
  String get service_internet;

  /// No description provided for @service_phone.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get service_phone;

  /// No description provided for @bill_number_label.
  ///
  /// In en, this message translates to:
  /// **'Bill Number'**
  String get bill_number_label;

  /// No description provided for @inquire_and_pay.
  ///
  /// In en, this message translates to:
  /// **'Inquire & Pay'**
  String get inquire_and_pay;

  /// No description provided for @request_new_card.
  ///
  /// In en, this message translates to:
  /// **'Request New Card'**
  String get request_new_card;

  /// No description provided for @no_cards_yet.
  ///
  /// In en, this message translates to:
  /// **'No cards yet'**
  String get no_cards_yet;

  /// No description provided for @request_new_card_hint.
  ///
  /// In en, this message translates to:
  /// **'Tap \"Request New Card\" to get started'**
  String get request_new_card_hint;

  /// No description provided for @expiry_date.
  ///
  /// In en, this message translates to:
  /// **'Expiry Date'**
  String get expiry_date;

  /// No description provided for @active.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get active;

  /// No description provided for @inactive.
  ///
  /// In en, this message translates to:
  /// **'Inactive'**
  String get inactive;

  /// No description provided for @deactivate_card.
  ///
  /// In en, this message translates to:
  /// **'Deactivate Card'**
  String get deactivate_card;

  /// No description provided for @activate_card.
  ///
  /// In en, this message translates to:
  /// **'Activate Card'**
  String get activate_card;

  /// No description provided for @card_activated.
  ///
  /// In en, this message translates to:
  /// **'Card activated'**
  String get card_activated;

  /// No description provided for @card_deactivated.
  ///
  /// In en, this message translates to:
  /// **'Card deactivated'**
  String get card_deactivated;

  /// No description provided for @confirm_transfer_title.
  ///
  /// In en, this message translates to:
  /// **'Confirm Transfer'**
  String get confirm_transfer_title;

  /// No description provided for @to_account.
  ///
  /// In en, this message translates to:
  /// **'To Account'**
  String get to_account;

  /// No description provided for @transfer.
  ///
  /// In en, this message translates to:
  /// **'Transfer'**
  String get transfer;

  /// No description provided for @account_number_digits_only.
  ///
  /// In en, this message translates to:
  /// **'Account number must contain only digits'**
  String get account_number_digits_only;

  /// No description provided for @transfer_success_message.
  ///
  /// In en, this message translates to:
  /// **'Transferred {amount} EGP\nto {receiverName} ✅'**
  String transfer_success_message(Object amount, Object receiverName);

  /// No description provided for @field_required.
  ///
  /// In en, this message translates to:
  /// **'This field is required'**
  String get field_required;

  /// No description provided for @note.
  ///
  /// In en, this message translates to:
  /// **'Note'**
  String get note;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @ok.
  ///
  /// In en, this message translates to:
  /// **'OK'**
  String get ok;

  /// No description provided for @card_type_visa.
  ///
  /// In en, this message translates to:
  /// **'Visa'**
  String get card_type_visa;

  /// No description provided for @card_type_mastercard.
  ///
  /// In en, this message translates to:
  /// **'Mastercard'**
  String get card_type_mastercard;

  /// No description provided for @card_type_title.
  ///
  /// In en, this message translates to:
  /// **'Card Type'**
  String get card_type_title;

  /// No description provided for @card_category_title.
  ///
  /// In en, this message translates to:
  /// **'Card Category'**
  String get card_category_title;

  /// No description provided for @card_category_debit.
  ///
  /// In en, this message translates to:
  /// **'Debit Card'**
  String get card_category_debit;

  /// No description provided for @card_category_debit_desc.
  ///
  /// In en, this message translates to:
  /// **'Linked directly to your account'**
  String get card_category_debit_desc;

  /// No description provided for @card_category_credit.
  ///
  /// In en, this message translates to:
  /// **'Credit Card'**
  String get card_category_credit;

  /// No description provided for @card_category_credit_desc.
  ///
  /// In en, this message translates to:
  /// **'Monthly credit limit'**
  String get card_category_credit_desc;

  /// No description provided for @card_category_prepaid.
  ///
  /// In en, this message translates to:
  /// **'Prepaid Card'**
  String get card_category_prepaid;

  /// No description provided for @card_category_prepaid_desc.
  ///
  /// In en, this message translates to:
  /// **'Load it with the amount you want'**
  String get card_category_prepaid_desc;

  /// No description provided for @card_request_review_message.
  ///
  /// In en, this message translates to:
  /// **'Your request will be reviewed by management and you will be contacted within 3-5 business days'**
  String get card_request_review_message;

  /// No description provided for @card_request_note.
  ///
  /// In en, this message translates to:
  /// **'After submitting the request, you will receive a notification of the management\'s decision. If approved, the card will automatically appear in your cards list.'**
  String get card_request_note;

  /// No description provided for @submit_request.
  ///
  /// In en, this message translates to:
  /// **'Submit Request'**
  String get submit_request;

  /// No description provided for @request_submitted_title.
  ///
  /// In en, this message translates to:
  /// **'Request Submitted!'**
  String get request_submitted_title;

  /// No description provided for @welcome_back.
  ///
  /// In en, this message translates to:
  /// **'Welcome Back'**
  String get welcome_back;

  /// No description provided for @login_to_continue.
  ///
  /// In en, this message translates to:
  /// **'Login to continue'**
  String get login_to_continue;

  /// No description provided for @login_success_message.
  ///
  /// In en, this message translates to:
  /// **'Login successful! 🎉'**
  String get login_success_message;

  /// No description provided for @email_required.
  ///
  /// In en, this message translates to:
  /// **'Please enter your email'**
  String get email_required;

  /// No description provided for @email_invalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid email address'**
  String get email_invalid;

  /// No description provided for @password_required.
  ///
  /// In en, this message translates to:
  /// **'Please enter your password'**
  String get password_required;

  /// No description provided for @password_min_length.
  ///
  /// In en, this message translates to:
  /// **'Password must be at least 6 characters'**
  String get password_min_length;

  /// No description provided for @remember_me.
  ///
  /// In en, this message translates to:
  /// **'Remember Me'**
  String get remember_me;

  /// No description provided for @forgot_password.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get forgot_password;

  /// No description provided for @or.
  ///
  /// In en, this message translates to:
  /// **'Or'**
  String get or;

  /// No description provided for @register_title.
  ///
  /// In en, this message translates to:
  /// **'Create New Account'**
  String get register_title;

  /// No description provided for @register_subtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your details to start your banking journey'**
  String get register_subtitle;

  /// No description provided for @register_success_message.
  ///
  /// In en, this message translates to:
  /// **'Account created successfully! 🎉'**
  String get register_success_message;

  /// No description provided for @personal_info_step.
  ///
  /// In en, this message translates to:
  /// **'Personal\nInformation'**
  String get personal_info_step;

  /// No description provided for @address_step.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get address_step;

  /// No description provided for @account_info_step.
  ///
  /// In en, this message translates to:
  /// **'Account\nInformation'**
  String get account_info_step;

  /// No description provided for @full_name_label.
  ///
  /// In en, this message translates to:
  /// **'Full Name'**
  String get full_name_label;

  /// No description provided for @national_id_label.
  ///
  /// In en, this message translates to:
  /// **'National ID Number'**
  String get national_id_label;

  /// No description provided for @national_id_invalid.
  ///
  /// In en, this message translates to:
  /// **'Invalid ID number'**
  String get national_id_invalid;

  /// No description provided for @date_of_birth_label.
  ///
  /// In en, this message translates to:
  /// **'Date of Birth'**
  String get date_of_birth_label;

  /// No description provided for @city_label.
  ///
  /// In en, this message translates to:
  /// **'City'**
  String get city_label;

  /// No description provided for @postal_code_label.
  ///
  /// In en, this message translates to:
  /// **'Postal Code'**
  String get postal_code_label;

  /// No description provided for @account_type_label.
  ///
  /// In en, this message translates to:
  /// **'Account Type'**
  String get account_type_label;

  /// No description provided for @account_type_savings.
  ///
  /// In en, this message translates to:
  /// **'Savings'**
  String get account_type_savings;

  /// No description provided for @account_type_current.
  ///
  /// In en, this message translates to:
  /// **'Current'**
  String get account_type_current;

  /// No description provided for @account_type_investment.
  ///
  /// In en, this message translates to:
  /// **'Investment'**
  String get account_type_investment;

  /// No description provided for @initial_deposit_label.
  ///
  /// In en, this message translates to:
  /// **'Initial Deposit'**
  String get initial_deposit_label;

  /// No description provided for @minimum_deposit_required.
  ///
  /// In en, this message translates to:
  /// **'Minimum 100 required'**
  String get minimum_deposit_required;

  /// No description provided for @confirm_password_label.
  ///
  /// In en, this message translates to:
  /// **'Confirm Password'**
  String get confirm_password_label;

  /// No description provided for @agree_terms_text.
  ///
  /// In en, this message translates to:
  /// **'I agree to the Terms and Conditions'**
  String get agree_terms_text;

  /// No description provided for @terms_required.
  ///
  /// In en, this message translates to:
  /// **'You must agree to the terms and conditions'**
  String get terms_required;

  /// No description provided for @previous_button.
  ///
  /// In en, this message translates to:
  /// **'Previous'**
  String get previous_button;

  /// No description provided for @password_min_length_8.
  ///
  /// In en, this message translates to:
  /// **'Password must be at least 8 characters'**
  String get password_min_length_8;

  /// No description provided for @passwords_not_match.
  ///
  /// In en, this message translates to:
  /// **'Passwords do not match'**
  String get passwords_not_match;

  /// No description provided for @gender_label.
  ///
  /// In en, this message translates to:
  /// **'Gender'**
  String get gender_label;

  /// No description provided for @gender_male.
  ///
  /// In en, this message translates to:
  /// **'Male'**
  String get gender_male;

  /// No description provided for @gender_female.
  ///
  /// In en, this message translates to:
  /// **'Female'**
  String get gender_female;

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// No description provided for @continue_button.
  ///
  /// In en, this message translates to:
  /// **'Continue'**
  String get continue_button;

  /// No description provided for @card_request_review.
  ///
  /// In en, this message translates to:
  /// **'Your request is being reviewed...'**
  String get card_request_review;

  /// No description provided for @additional_services.
  ///
  /// In en, this message translates to:
  /// **'Additional Services'**
  String get additional_services;

  /// No description provided for @loans_and_credit.
  ///
  /// In en, this message translates to:
  /// **'Loans & Credit'**
  String get loans_and_credit;

  /// No description provided for @investments.
  ///
  /// In en, this message translates to:
  /// **'Investments'**
  String get investments;

  /// No description provided for @offers.
  ///
  /// In en, this message translates to:
  /// **'Offers'**
  String get offers;

  /// No description provided for @available_loans.
  ///
  /// In en, this message translates to:
  /// **'Available Loans'**
  String get available_loans;

  /// No description provided for @new_loan_request.
  ///
  /// In en, this message translates to:
  /// **'New Loan Request'**
  String get new_loan_request;

  /// No description provided for @credit_cards.
  ///
  /// In en, this message translates to:
  /// **'Credit Cards'**
  String get credit_cards;

  /// No description provided for @request_card.
  ///
  /// In en, this message translates to:
  /// **'Request Card'**
  String get request_card;

  /// No description provided for @interest_rate.
  ///
  /// In en, this message translates to:
  /// **'Interest Rate'**
  String get interest_rate;

  /// No description provided for @duration_months.
  ///
  /// In en, this message translates to:
  /// **'Duration (Months)'**
  String get duration_months;

  /// No description provided for @view_details.
  ///
  /// In en, this message translates to:
  /// **'View Details'**
  String get view_details;

  /// No description provided for @months.
  ///
  /// In en, this message translates to:
  /// **'months'**
  String get months;

  /// No description provided for @credit_limit.
  ///
  /// In en, this message translates to:
  /// **'Credit Limit'**
  String get credit_limit;

  /// No description provided for @available.
  ///
  /// In en, this message translates to:
  /// **'Available'**
  String get available;

  /// No description provided for @used_percentage.
  ///
  /// In en, this message translates to:
  /// **'Used'**
  String get used_percentage;

  /// No description provided for @total_investments.
  ///
  /// In en, this message translates to:
  /// **'Total Investments'**
  String get total_investments;

  /// No description provided for @returns.
  ///
  /// In en, this message translates to:
  /// **'Returns'**
  String get returns;

  /// No description provided for @percentage.
  ///
  /// In en, this message translates to:
  /// **'Percentage'**
  String get percentage;

  /// No description provided for @available_investment_plans.
  ///
  /// In en, this message translates to:
  /// **'Available Investment Plans'**
  String get available_investment_plans;

  /// No description provided for @new_investment.
  ///
  /// In en, this message translates to:
  /// **'New Investment'**
  String get new_investment;

  /// No description provided for @minimum_amount.
  ///
  /// In en, this message translates to:
  /// **'Minimum Amount'**
  String get minimum_amount;

  /// No description provided for @annual_return.
  ///
  /// In en, this message translates to:
  /// **'Annual Return'**
  String get annual_return;

  /// No description provided for @invest_now.
  ///
  /// In en, this message translates to:
  /// **'Invest Now'**
  String get invest_now;

  /// No description provided for @risk_label.
  ///
  /// In en, this message translates to:
  /// **'Risk'**
  String get risk_label;

  /// No description provided for @expires_on.
  ///
  /// In en, this message translates to:
  /// **'Expires on'**
  String get expires_on;

  /// No description provided for @share.
  ///
  /// In en, this message translates to:
  /// **'Share'**
  String get share;

  /// No description provided for @use_now.
  ///
  /// In en, this message translates to:
  /// **'Use Now'**
  String get use_now;

  /// No description provided for @amount_requested.
  ///
  /// In en, this message translates to:
  /// **'Amount Requested'**
  String get amount_requested;

  /// No description provided for @loan_request_submitted.
  ///
  /// In en, this message translates to:
  /// **'Loan request submitted successfully!'**
  String get loan_request_submitted;

  /// No description provided for @request_credit_card.
  ///
  /// In en, this message translates to:
  /// **'Request Credit Card'**
  String get request_credit_card;

  /// No description provided for @choose_card_type.
  ///
  /// In en, this message translates to:
  /// **'Choose the card type that suits you'**
  String get choose_card_type;

  /// No description provided for @invest.
  ///
  /// In en, this message translates to:
  /// **'Invest'**
  String get invest;

  /// No description provided for @enter_investment_amount.
  ///
  /// In en, this message translates to:
  /// **'Enter the amount you wish to invest'**
  String get enter_investment_amount;

  /// No description provided for @investment_started.
  ///
  /// In en, this message translates to:
  /// **'Investment started!'**
  String get investment_started;

  /// No description provided for @status_label.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get status_label;

  /// No description provided for @expected_monthly_installment.
  ///
  /// In en, this message translates to:
  /// **'Expected Monthly Installment'**
  String get expected_monthly_installment;

  /// No description provided for @close.
  ///
  /// In en, this message translates to:
  /// **'Close'**
  String get close;

  /// No description provided for @expected_return.
  ///
  /// In en, this message translates to:
  /// **'Expected Return'**
  String get expected_return;

  /// No description provided for @offer_activated.
  ///
  /// In en, this message translates to:
  /// **'Offer Activated!'**
  String get offer_activated;

  /// No description provided for @profile_info_title.
  ///
  /// In en, this message translates to:
  /// **'Personal Information'**
  String get profile_info_title;

  /// No description provided for @address_example.
  ///
  /// In en, this message translates to:
  /// **'Cairo, Heliopolis'**
  String get address_example;

  /// No description provided for @notifications_title.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notifications_title;

  /// No description provided for @enable_notifications.
  ///
  /// In en, this message translates to:
  /// **'Enable Notifications'**
  String get enable_notifications;

  /// No description provided for @enable_notifications_desc.
  ///
  /// In en, this message translates to:
  /// **'Receive all notifications on device'**
  String get enable_notifications_desc;

  /// No description provided for @security_privacy_title.
  ///
  /// In en, this message translates to:
  /// **'Security & Privacy'**
  String get security_privacy_title;

  /// No description provided for @change_password.
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get change_password;

  /// No description provided for @last_password_change.
  ///
  /// In en, this message translates to:
  /// **'Last changed 30 days ago'**
  String get last_password_change;

  /// No description provided for @help_support_title.
  ///
  /// In en, this message translates to:
  /// **'Help & Support'**
  String get help_support_title;

  /// No description provided for @help_center.
  ///
  /// In en, this message translates to:
  /// **'Help Center'**
  String get help_center;

  /// No description provided for @help_center_desc.
  ///
  /// In en, this message translates to:
  /// **'FAQs and technical support'**
  String get help_center_desc;

  /// No description provided for @contact_us.
  ///
  /// In en, this message translates to:
  /// **'Contact Us'**
  String get contact_us;

  /// No description provided for @contact_us_desc.
  ///
  /// In en, this message translates to:
  /// **'Message us anytime'**
  String get contact_us_desc;

  /// No description provided for @rate_app.
  ///
  /// In en, this message translates to:
  /// **'Rate App'**
  String get rate_app;

  /// No description provided for @rate_app_desc.
  ///
  /// In en, this message translates to:
  /// **'Share your feedback and experience'**
  String get rate_app_desc;

  /// No description provided for @general_title.
  ///
  /// In en, this message translates to:
  /// **'General'**
  String get general_title;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @language_arabic.
  ///
  /// In en, this message translates to:
  /// **'Arabic'**
  String get language_arabic;

  /// No description provided for @currency_egp_label.
  ///
  /// In en, this message translates to:
  /// **'Egyptian Pound (EGP)'**
  String get currency_egp_label;

  /// No description provided for @terms_and_conditions.
  ///
  /// In en, this message translates to:
  /// **'Terms & Conditions'**
  String get terms_and_conditions;

  /// No description provided for @terms_and_conditions_desc.
  ///
  /// In en, this message translates to:
  /// **'Read terms and conditions'**
  String get terms_and_conditions_desc;

  /// No description provided for @privacy_policy.
  ///
  /// In en, this message translates to:
  /// **'Privacy Policy'**
  String get privacy_policy;

  /// No description provided for @privacy_policy_desc.
  ///
  /// In en, this message translates to:
  /// **'How we protect your data'**
  String get privacy_policy_desc;

  /// No description provided for @about_app.
  ///
  /// In en, this message translates to:
  /// **'About App'**
  String get about_app;

  /// No description provided for @version.
  ///
  /// In en, this message translates to:
  /// **'Version'**
  String get version;

  /// No description provided for @secure.
  ///
  /// In en, this message translates to:
  /// **'Secure'**
  String get secure;

  /// No description provided for @logout.
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get logout;

  /// No description provided for @edit_field.
  ///
  /// In en, this message translates to:
  /// **'Edit'**
  String get edit_field;

  /// No description provided for @enter_new.
  ///
  /// In en, this message translates to:
  /// **'Enter new'**
  String get enter_new;

  /// No description provided for @current_password.
  ///
  /// In en, this message translates to:
  /// **'Current Password'**
  String get current_password;

  /// No description provided for @new_password.
  ///
  /// In en, this message translates to:
  /// **'New Password'**
  String get new_password;

  /// No description provided for @confirm_new_password.
  ///
  /// In en, this message translates to:
  /// **'Confirm New Password'**
  String get confirm_new_password;

  /// No description provided for @change.
  ///
  /// In en, this message translates to:
  /// **'Change'**
  String get change;

  /// No description provided for @logout_confirmation.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to logout?'**
  String get logout_confirmation;

  /// No description provided for @action_transfer.
  ///
  /// In en, this message translates to:
  /// **'Transfer'**
  String get action_transfer;

  /// No description provided for @action_request_money.
  ///
  /// In en, this message translates to:
  /// **'Request Money'**
  String get action_request_money;

  /// No description provided for @action_bills.
  ///
  /// In en, this message translates to:
  /// **'Bills'**
  String get action_bills;

  /// No description provided for @action_qr.
  ///
  /// In en, this message translates to:
  /// **'QR'**
  String get action_qr;

  /// No description provided for @request_money_title.
  ///
  /// In en, this message translates to:
  /// **'Request Money'**
  String get request_money_title;

  /// No description provided for @request_money_subtitle.
  ///
  /// In en, this message translates to:
  /// **'The person will receive a notification of your request'**
  String get request_money_subtitle;

  /// No description provided for @person_account_number.
  ///
  /// In en, this message translates to:
  /// **'Person\'s Account Number'**
  String get person_account_number;

  /// No description provided for @account_number_example.
  ///
  /// In en, this message translates to:
  /// **'Example: 1234567890'**
  String get account_number_example;

  /// No description provided for @request_reason_optional.
  ///
  /// In en, this message translates to:
  /// **'Request Reason (Optional)'**
  String get request_reason_optional;

  /// No description provided for @request_reason_hint.
  ///
  /// In en, this message translates to:
  /// **'Example: My share for dinner'**
  String get request_reason_hint;

  /// No description provided for @please_complete_data.
  ///
  /// In en, this message translates to:
  /// **'Please complete the data'**
  String get please_complete_data;

  /// No description provided for @request_sent_success.
  ///
  /// In en, this message translates to:
  /// **'Request sent to'**
  String get request_sent_success;

  /// No description provided for @send_request.
  ///
  /// In en, this message translates to:
  /// **'Send Request'**
  String get send_request;

  /// No description provided for @qr_scanner_title.
  ///
  /// In en, this message translates to:
  /// **'QR Scanner'**
  String get qr_scanner_title;

  /// No description provided for @qr_scanner_message.
  ///
  /// In en, this message translates to:
  /// **'Add mobile_scanner: ^5.0.0\nto pubspec.yaml'**
  String get qr_scanner_message;

  /// No description provided for @welcome_greeting.
  ///
  /// In en, this message translates to:
  /// **'Welcome'**
  String get welcome_greeting;

  /// No description provided for @income.
  ///
  /// In en, this message translates to:
  /// **'Income'**
  String get income;

  /// No description provided for @expenses.
  ///
  /// In en, this message translates to:
  /// **'Expenses'**
  String get expenses;

  /// No description provided for @recent_transactions.
  ///
  /// In en, this message translates to:
  /// **'Recent Transactions'**
  String get recent_transactions;

  /// No description provided for @view_all.
  ///
  /// In en, this message translates to:
  /// **'View All'**
  String get view_all;

  /// No description provided for @no_transactions_yet.
  ///
  /// In en, this message translates to:
  /// **'No transactions yet'**
  String get no_transactions_yet;

  /// No description provided for @try_again.
  ///
  /// In en, this message translates to:
  /// **'Try Again'**
  String get try_again;

  /// No description provided for @phone_label.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get phone_label;

  /// No description provided for @address_label.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get address_label;

  /// No description provided for @today.
  ///
  /// In en, this message translates to:
  /// **'Today'**
  String get today;

  /// No description provided for @yesterday.
  ///
  /// In en, this message translates to:
  /// **'Yesterday'**
  String get yesterday;

  /// No description provided for @currency_egp_text.
  ///
  /// In en, this message translates to:
  /// **'Pounds'**
  String get currency_egp_text;

  /// No description provided for @email_label.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email_label;

  /// No description provided for @password_label.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password_label;

  /// No description provided for @login_button.
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get login_button;

  /// No description provided for @no_account.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account? '**
  String get no_account;

  /// No description provided for @create_account_button.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get create_account_button;

  /// No description provided for @next_button.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get next_button;

  /// No description provided for @no_accounts_found.
  ///
  /// In en, this message translates to:
  /// **'No accounts found'**
  String get no_accounts_found;

  /// No description provided for @customer_name.
  ///
  /// In en, this message translates to:
  /// **'Customer Name'**
  String get customer_name;

  /// No description provided for @no_transactions_found.
  ///
  /// In en, this message translates to:
  /// **'No transactions found'**
  String get no_transactions_found;

  /// No description provided for @card_reported_lost.
  ///
  /// In en, this message translates to:
  /// **'Card reported lost'**
  String get card_reported_lost;

  /// No description provided for @frozen.
  ///
  /// In en, this message translates to:
  /// **'Frozen'**
  String get frozen;

  /// No description provided for @report_lost_card.
  ///
  /// In en, this message translates to:
  /// **'Report Lost Card'**
  String get report_lost_card;

  /// No description provided for @card_lost_reported.
  ///
  /// In en, this message translates to:
  /// **'This card has been reported lost'**
  String get card_lost_reported;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @report_lost_card_title.
  ///
  /// In en, this message translates to:
  /// **'Report Lost Card'**
  String get report_lost_card_title;

  /// No description provided for @report_lost_card_confirmation.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to report this card as lost? You will not be able to use it again.'**
  String get report_lost_card_confirmation;

  /// No description provided for @report.
  ///
  /// In en, this message translates to:
  /// **'Report'**
  String get report;

  /// No description provided for @no_loans_available.
  ///
  /// In en, this message translates to:
  /// **'No loans available'**
  String get no_loans_available;

  /// No description provided for @no_credit_cards.
  ///
  /// In en, this message translates to:
  /// **'No credit cards available'**
  String get no_credit_cards;

  /// No description provided for @load_cards.
  ///
  /// In en, this message translates to:
  /// **'Load Cards'**
  String get load_cards;

  /// No description provided for @loan_personal.
  ///
  /// In en, this message translates to:
  /// **'Personal Loan'**
  String get loan_personal;

  /// No description provided for @loan_car.
  ///
  /// In en, this message translates to:
  /// **'Car Loan'**
  String get loan_car;

  /// No description provided for @loan_mortgage.
  ///
  /// In en, this message translates to:
  /// **'Mortgage Loan'**
  String get loan_mortgage;

  /// No description provided for @installment.
  ///
  /// In en, this message translates to:
  /// **'Installment'**
  String get installment;

  /// No description provided for @paid.
  ///
  /// In en, this message translates to:
  /// **'Paid'**
  String get paid;

  /// No description provided for @remaining_amount.
  ///
  /// In en, this message translates to:
  /// **'Remaining:'**
  String get remaining_amount;

  /// No description provided for @equity_fund.
  ///
  /// In en, this message translates to:
  /// **'Equity Fund'**
  String get equity_fund;

  /// No description provided for @savings_certificates.
  ///
  /// In en, this message translates to:
  /// **'Savings Certificates'**
  String get savings_certificates;

  /// No description provided for @bond_fund.
  ///
  /// In en, this message translates to:
  /// **'Bond Fund'**
  String get bond_fund;

  /// No description provided for @islamic_investment.
  ///
  /// In en, this message translates to:
  /// **'Islamic Investment'**
  String get islamic_investment;

  /// No description provided for @risk_medium.
  ///
  /// In en, this message translates to:
  /// **'Medium'**
  String get risk_medium;

  /// No description provided for @risk_low.
  ///
  /// In en, this message translates to:
  /// **'Low'**
  String get risk_low;

  /// No description provided for @risk_high.
  ///
  /// In en, this message translates to:
  /// **'High'**
  String get risk_high;

  /// No description provided for @offer_shopping_title.
  ///
  /// In en, this message translates to:
  /// **'20% Off Shopping'**
  String get offer_shopping_title;

  /// No description provided for @offer_shopping_desc.
  ///
  /// In en, this message translates to:
  /// **'Get 20% discount when shopping at partner stores'**
  String get offer_shopping_desc;

  /// No description provided for @offer_cashback_title.
  ///
  /// In en, this message translates to:
  /// **'5% Cashback'**
  String get offer_cashback_title;

  /// No description provided for @offer_cashback_desc.
  ///
  /// In en, this message translates to:
  /// **'Get 5% cashback on your purchases when using the card'**
  String get offer_cashback_desc;

  /// No description provided for @offer_loan_title.
  ///
  /// In en, this message translates to:
  /// **'Reduced Interest Rate'**
  String get offer_loan_title;

  /// No description provided for @offer_loan_desc.
  ///
  /// In en, this message translates to:
  /// **'Personal loan with 10% interest for a limited time'**
  String get offer_loan_desc;

  /// No description provided for @offer_premium_title.
  ///
  /// In en, this message translates to:
  /// **'Free for 3 Months'**
  String get offer_premium_title;

  /// No description provided for @offer_premium_desc.
  ///
  /// In en, this message translates to:
  /// **'Subscribe to premium banking services for free'**
  String get offer_premium_desc;

  /// No description provided for @status_approved.
  ///
  /// In en, this message translates to:
  /// **'Approved'**
  String get status_approved;

  /// No description provided for @status_pending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get status_pending;

  /// No description provided for @status_rejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get status_rejected;

  /// No description provided for @loan_type.
  ///
  /// In en, this message translates to:
  /// **'Loan Type'**
  String get loan_type;

  /// No description provided for @monthly_income.
  ///
  /// In en, this message translates to:
  /// **'Monthly Income'**
  String get monthly_income;

  /// No description provided for @monthly_installment.
  ///
  /// In en, this message translates to:
  /// **'Monthly Installment'**
  String get monthly_installment;

  /// No description provided for @notes_label.
  ///
  /// In en, this message translates to:
  /// **'Notes:'**
  String get notes_label;

  /// No description provided for @select_language.
  ///
  /// In en, this message translates to:
  /// **'Select Language'**
  String get select_language;

  /// No description provided for @change_password_api.
  ///
  /// In en, this message translates to:
  /// **'Connect to changePassword API'**
  String get change_password_api;

  /// No description provided for @coming_soon.
  ///
  /// In en, this message translates to:
  /// **'Coming Soon'**
  String get coming_soon;

  /// No description provided for @please_enter_amount.
  ///
  /// In en, this message translates to:
  /// **'Please enter the amount'**
  String get please_enter_amount;

  /// No description provided for @tab_qr_code.
  ///
  /// In en, this message translates to:
  /// **'QR Code'**
  String get tab_qr_code;

  /// No description provided for @qr_code_title.
  ///
  /// In en, this message translates to:
  /// **'My QR Code'**
  String get qr_code_title;

  /// No description provided for @qr_code_subtitle.
  ///
  /// In en, this message translates to:
  /// **'Scan this code to receive money easily'**
  String get qr_code_subtitle;

  /// No description provided for @your_qr_code.
  ///
  /// In en, this message translates to:
  /// **'Your Account QR Code'**
  String get your_qr_code;

  /// No description provided for @qr_code_share_hint.
  ///
  /// In en, this message translates to:
  /// **'Share this code with others to receive money'**
  String get qr_code_share_hint;

  /// No description provided for @loading_qr.
  ///
  /// In en, this message translates to:
  /// **'Loading QR Code...'**
  String get loading_qr;

  /// No description provided for @scan_qr_code.
  ///
  /// In en, this message translates to:
  /// **'Scan QR Code'**
  String get scan_qr_code;

  /// No description provided for @qr_code_info.
  ///
  /// In en, this message translates to:
  /// **'Scan anyone\'s QR code to send them money quickly'**
  String get qr_code_info;

  /// No description provided for @scan_result.
  ///
  /// In en, this message translates to:
  /// **'Scan Result'**
  String get scan_result;

  /// No description provided for @scanned_account_number.
  ///
  /// In en, this message translates to:
  /// **'Scanned Account Number'**
  String get scanned_account_number;

  /// No description provided for @transfer_to_this_account.
  ///
  /// In en, this message translates to:
  /// **'Transfer to this account'**
  String get transfer_to_this_account;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'en':
      return AppLocalizationsEn();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}

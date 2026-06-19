import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:provider/provider.dart';

import 'Account Details Screen/add_card.dart';
import 'Auth/auth_cubit.dart';
import 'Auth/auth_repository.dart';
import 'Auth/login.dart';
import 'Auth/register.dart';
import 'Main_Screen.dart';
import 'SplashScreen.dart';
import 'l10n/app_localizations.dart';
import 'Account Details Screen/account_cubit.dart';
import 'Account Details Screen/account_repository.dart';
import 'Account Details Screen/accout_detis.dart';
import 'language_provider.dart';
import 'notification.dart';
import 'otp_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();


  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);


  await NotificationService().init();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => AuthCubit(AuthRepository()),
        ),
        BlocProvider(
          create: (context) => AccountCubit(AccountRepository()),
        ),
      ],
      child: ChangeNotifierProvider(
        create: (_) => LanguageProvider(),
        child: Consumer<LanguageProvider>(
          builder: (context, langProvider, child) {


            NotificationService().updateLanguage(langProvider.appLanguage);

            return MaterialApp(
              debugShowCheckedModeBanner: false,

              localizationsDelegates: const [
                AppLocalizations.delegate,
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],

              supportedLocales: const [
                Locale('ar'),
                Locale('en'),
              ],

              locale: Locale(langProvider.appLanguage),

              initialRoute: SplashScreen.routeName,

              routes: {
                MainScreen.routeName: (context) => MainScreen(),
                RegisterPage.routeName: (context) => RegisterPage(),
                LoginPage.routeName: (context) => LoginPage(),
                SplashScreen.routeName: (context) => SplashScreen(),
                AccountDetails.routeName: (context) => const AccountDetails(),
                AddCardScreen.routeName: (context) => const AddCardScreen(),
                OtpPage.routeName: (context) => const OtpPage(), // ✅ جديد
              },
            );
          },
        ),
      ),
    );
  }
}
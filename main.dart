import 'package:flutter/material.dart';
import 'auth_page.dart';
import 'chat_page.dart';
import 'store_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: AuthPage(),
      routes: {
        '/chat': (_) => ChatPage(),
        '/store': (_) => StorePage(),
      },
    );
  }
}

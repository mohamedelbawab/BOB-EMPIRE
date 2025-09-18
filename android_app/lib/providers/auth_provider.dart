import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthProvider extends ChangeNotifier {
  final SupabaseClient _supabase = Supabase.instance.client;
  
  User? _user;
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _errorMessage;

  // Getters
  User? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    _initAuth();
  }

  void _initAuth() {
    _user = _supabase.auth.currentUser;
    _isAuthenticated = _user != null;
    
    // Listen to auth state changes
    _supabase.auth.onAuthStateChange.listen((AuthState state) {
      _user = state.session?.user;
      _isAuthenticated = _user != null;
      notifyListeners();
    });
  }

  Future<bool> signInWithEmail(String email, String password) async {
    try {
      _setLoading(true);
      _clearError();
      
      final response = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );
      
      if (response.user != null) {
        _user = response.user;
        _isAuthenticated = true;
        return true;
      }
      
      return false;
    } on AuthException catch (error) {
      _setError(error.message);
      return false;
    } catch (error) {
      _setError('حدث خطأ غير متوقع');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> signUpWithEmail(String email, String password) async {
    try {
      _setLoading(true);
      _clearError();
      
      final response = await _supabase.auth.signUp(
        email: email,
        password: password,
      );
      
      if (response.user != null) {
        _user = response.user;
        _isAuthenticated = true;
        return true;
      }
      
      return false;
    } on AuthException catch (error) {
      _setError(error.message);
      return false;
    } catch (error) {
      _setError('حدث خطأ في إنشاء الحساب');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> signOut() async {
    try {
      await _supabase.auth.signOut();
      _user = null;
      _isAuthenticated = false;
      notifyListeners();
    } catch (error) {
      debugPrint('Error signing out: $error');
    }
  }

  Future<bool> resetPassword(String email) async {
    try {
      _setLoading(true);
      _clearError();
      
      await _supabase.auth.resetPasswordForEmail(email);
      return true;
    } on AuthException catch (error) {
      _setError(error.message);
      return false;
    } catch (error) {
      _setError('حدث خطأ في إعادة تعيين كلمة المرور');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Demo login for testing
  Future<bool> demoLogin() async {
    try {
      _setLoading(true);
      _clearError();
      
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 2));
      
      // Create mock user
      _user = null; // We'll handle demo mode differently
      _isAuthenticated = true;
      
      return true;
    } catch (error) {
      _setError('فشل في تسجيل الدخول التجريبي');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String message) {
    _errorMessage = message;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  void clearError() {
    _clearError();
  }
}
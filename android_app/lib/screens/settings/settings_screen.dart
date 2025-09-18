import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../providers/app_state.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sync_provider.dart';
import '../../utils/theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'الإعدادات',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        flexibleSpace: Container(
          decoration: BoxDecoration(gradient: AppTheme.primaryGradient),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildUserSection(context),
            const SizedBox(height: 20),
            _buildAppSettings(context),
            const SizedBox(height: 20),
            _buildSyncSection(context),
            const SizedBox(height: 20),
            _buildAboutSection(context),
          ],
        ),
      ),
    );
  }

  Widget _buildUserSection(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, _) {
        return Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'الملف الشخصي',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: AppTheme.primaryColor,
                      child: const Icon(
                        Icons.person,
                        size: 30,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            authProvider.user?.email ?? 'مستخدم تجريبي',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            authProvider.isAuthenticated
                                ? 'مُسجل الدخول'
                                : 'نسخة تجريبية',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: () => _handleLogout(context, authProvider),
                    icon: const Icon(Icons.logout),
                    label: const Text('تسجيل الخروج'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAppSettings(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, _) {
        return Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'إعدادات التطبيق',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                
                // Language Setting
                ListTile(
                  leading: const Icon(Icons.language),
                  title: const Text('اللغة'),
                  subtitle: Text(appState.currentLanguage == 'ar' ? 'العربية' : 'English'),
                  trailing: Switch(
                    value: appState.currentLanguage == 'ar',
                    onChanged: (value) {
                      appState.setLanguage(value ? 'ar' : 'en');
                    },
                  ),
                  contentPadding: EdgeInsets.zero,
                ),
                
                const Divider(),
                
                // Theme Setting
                ListTile(
                  leading: const Icon(Icons.dark_mode),
                  title: const Text('المظهر الداكن'),
                  subtitle: Text(appState.themeMode == ThemeMode.dark ? 'مُفعل' : 'مُعطل'),
                  trailing: Switch(
                    value: appState.themeMode == ThemeMode.dark,
                    onChanged: (value) {
                      appState.setThemeMode(value ? ThemeMode.dark : ThemeMode.light);
                    },
                  ),
                  contentPadding: EdgeInsets.zero,
                ),
                
                const Divider(),
                
                // Turbo Mode Setting
                ListTile(
                  leading: const Icon(Icons.speed),
                  title: const Text('الوضع السريع'),
                  subtitle: Text(appState.turboMode ? 'مُفعل' : 'مُعطل'),
                  trailing: Switch(
                    value: appState.turboMode,
                    onChanged: (value) {
                      appState.toggleTurboMode();
                    },
                  ),
                  contentPadding: EdgeInsets.zero,
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSyncSection(BuildContext context) {
    return Consumer<SyncProvider>(
      builder: (context, syncProvider, _) {
        return Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'المزامنة والربط',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                
                // Connection Status
                ListTile(
                  leading: Icon(
                    syncProvider.isConnected ? Icons.cloud_done : Icons.cloud_off,
                    color: syncProvider.isConnected ? Colors.green : Colors.red,
                  ),
                  title: const Text('حالة الاتصال'),
                  subtitle: Text(syncProvider.isConnected ? 'متصل' : 'غير متصل'),
                  contentPadding: EdgeInsets.zero,
                ),
                
                const Divider(),
                
                // Device ID
                if (syncProvider.deviceId != null) ...[
                  ListTile(
                    leading: const Icon(Icons.smartphone),
                    title: const Text('معرف الجهاز'),
                    subtitle: Text(syncProvider.deviceId!),
                    contentPadding: EdgeInsets.zero,
                  ),
                  const Divider(),
                ],
                
                // QR Code for linking
                ListTile(
                  leading: const Icon(Icons.qr_code),
                  title: const Text('ربط جهاز آخر'),
                  subtitle: const Text('اعرض رمز QR للربط'),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () => _showQRCode(context, syncProvider),
                  contentPadding: EdgeInsets.zero,
                ),
                
                if (syncProvider.isLinked) ...[
                  const Divider(),
                  ListTile(
                    leading: const Icon(Icons.link, color: Colors.green),
                    title: const Text('مرتبط بجهاز آخر'),
                    subtitle: Text('معرف الجهاز المرتبط: ${syncProvider.linkedDeviceId}'),
                    contentPadding: EdgeInsets.zero,
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAboutSection(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'حول التطبيق',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            
            ListTile(
              leading: const Icon(Icons.info),
              title: const Text('الإصدار'),
              subtitle: const Text('2.2.0'),
              contentPadding: EdgeInsets.zero,
            ),
            
            const Divider(),
            
            ListTile(
              leading: const Icon(Icons.description),
              title: const Text('الوصف'),
              subtitle: const Text('منصة التجارة العالمية بالذكاء الاصطناعي'),
              contentPadding: EdgeInsets.zero,
            ),
            
            const Divider(),
            
            ListTile(
              leading: const Icon(Icons.developer_mode),
              title: const Text('المطور'),
              subtitle: const Text('Bob Empire Team'),
              contentPadding: EdgeInsets.zero,
            ),
            
            const SizedBox(height: 16),
            
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Column(
                children: [
                  Text(
                    '👑',
                    style: TextStyle(fontSize: 24),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Bob Empire',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Global AI Commerce Platform',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleLogout(BuildContext context, AuthProvider authProvider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تسجيل الخروج'),
        content: const Text('هل أنت متأكد من تسجيل الخروج؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              await authProvider.signOut();
              if (context.mounted) {
                Navigator.of(context).pushNamedAndRemoveUntil(
                  '/login',
                  (route) => false,
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('تسجيل الخروج'),
          ),
        ],
      ),
    );
  }

  void _showQRCode(BuildContext context, SyncProvider syncProvider) {
    final qrData = syncProvider.generateQRData();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('ربط جهاز آخر'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            QrImageView(
              data: qrData,
              version: QrVersions.auto,
              size: 200.0,
            ),
            const SizedBox(height: 16),
            const Text(
              'امسح هذا الرمز من الجهاز الآخر لربطه',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إغلاق'),
          ),
        ],
      ),
    );
  }
}
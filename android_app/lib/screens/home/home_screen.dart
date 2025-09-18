import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sync_provider.dart';
import '../../providers/app_state.dart';
import '../../utils/theme.dart';
import '../chat/chat_screen.dart';
import '../store/store_screen.dart';
import '../agents/agents_screen.dart';
import '../settings/settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  
  final List<Widget> _screens = [
    const HomeTab(),
    const ChatScreen(),
    const StoreScreen(),
    const AgentsScreen(),
    const SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  Widget _buildBottomNavBar() {
    return Container(
      decoration: BoxDecoration(
        gradient: AppTheme.primaryGradient,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.transparent,
        selectedItemColor: AppTheme.goldColor,
        unselectedItemColor: Colors.white.withOpacity(0.7),
        elevation: 0,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'الرئيسية',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_outlined),
            activeIcon: Icon(Icons.chat),
            label: 'الدردشة',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.store_outlined),
            activeIcon: Icon(Icons.store),
            label: 'المتجر',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.smart_toy_outlined),
            activeIcon: Icon(Icons.smart_toy),
            label: 'الوكلاء',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings),
            label: 'الإعدادات',
          ),
        ],
      ),
    );
  }
}

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer3<AuthProvider, SyncProvider, AppState>(
      builder: (context, authProvider, syncProvider, appState, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text(
              'Bob Empire',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 24,
              ),
            ),
            centerTitle: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: Container(
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.only(right: 16),
                child: Row(
                  children: [
                    Icon(
                      syncProvider.isConnected
                          ? Icons.cloud_done
                          : Icons.cloud_off,
                      color: syncProvider.isConnected
                          ? AppTheme.goldColor
                          : Colors.red,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      '👑',
                      style: TextStyle(fontSize: 20),
                    ),
                  ],
                ),
              ),
            ],
          ),
          body: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Theme.of(context).colorScheme.primary.withOpacity(0.1),
                  Colors.transparent,
                ],
              ),
            ),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildWelcomeCard(authProvider),
                  const SizedBox(height: 20),
                  _buildSyncStatusCard(syncProvider),
                  const SizedBox(height: 20),
                  _buildQuickStats(),
                  const SizedBox(height: 20),
                  _buildQuickActions(context),
                  const SizedBox(height: 20),
                  _buildPlatformConnections(),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildWelcomeCard(AuthProvider authProvider) {
    return Card(
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: AppTheme.primaryGradient,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(
                  radius: 30,
                  backgroundColor: Colors.white,
                  child: Icon(
                    Icons.person,
                    size: 30,
                    color: AppTheme.primaryColor,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'مرحباً ${authProvider.user?.email ?? "مستخدم تجريبي"}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'منصة التجارة العالمية بالذكاء الاصطناعي',
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
          ],
        ),
      ),
    );
  }

  Widget _buildSyncStatusCard(SyncProvider syncProvider) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  syncProvider.isConnected ? Icons.sync : Icons.sync_disabled,
                  color: syncProvider.isConnected ? Colors.green : Colors.red,
                ),
                const SizedBox(width: 8),
                Text(
                  'حالة المزامنة',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).textTheme.titleLarge?.color,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: syncProvider.isConnected ? Colors.green : Colors.red,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  syncProvider.isConnected ? 'متصل' : 'غير متصل',
                  style: const TextStyle(fontSize: 14),
                ),
                const Spacer(),
                if (syncProvider.isLinked)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.goldColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'مرتبط بجهاز آخر',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.goldColor,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
              ],
            ),
            if (syncProvider.deviceId != null) ...[
              const SizedBox(height: 8),
              Text(
                'معرف الجهاز: ${syncProvider.deviceId}',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStats() {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard('الوكلاء النشطة', '140', Icons.smart_toy, Colors.blue),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard('المنصات المتصلة', '35', Icons.link, Colors.green),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard('الطلبات', '12', Icons.shopping_cart, Colors.orange),
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 30, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'إجراءات سريعة',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 2.5,
          children: [
            _buildActionButton(
              'دردشة الذكاء الاصطناعي',
              Icons.chat,
              AppTheme.primaryColor,
              () => Navigator.pushNamed(context, '/chat'),
            ),
            _buildActionButton(
              'إدارة المتجر',
              Icons.store,
              Colors.green,
              () => Navigator.pushNamed(context, '/store'),
            ),
            _buildActionButton(
              'الوكلاء الذكية',
              Icons.smart_toy,
              Colors.blue,
              () => Navigator.pushNamed(context, '/agents'),
            ),
            _buildActionButton(
              'ربط QR',
              Icons.qr_code,
              AppTheme.goldColor,
              () => _showQRDialog(context),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButton(String title, IconData icon, Color color, VoidCallback onTap) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPlatformConnections() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'المنصات المتصلة',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildPlatformRow('Amazon', true),
                _buildPlatformRow('Shopify', true),
                _buildPlatformRow('AliExpress', false),
                _buildPlatformRow('Alibaba', false),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: () {
                    // Navigate to platform management
                  },
                  child: const Text('إدارة جميع المنصات'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPlatformRow(String platform, bool isConnected) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            isConnected ? Icons.check_circle : Icons.radio_button_unchecked,
            color: isConnected ? Colors.green : Colors.grey,
            size: 20,
          ),
          const SizedBox(width: 12),
          Text(platform),
          const Spacer(),
          Text(
            isConnected ? 'متصل' : 'غير متصل',
            style: TextStyle(
              fontSize: 12,
              color: isConnected ? Colors.green : Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  void _showQRDialog(BuildContext context) {
    // Will implement QR dialog in next iteration
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('ربط الأجهزة'),
        content: const Text('سيتم تنفيذ خاصية ربط الأجهزة عبر QR قريباً'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('حسناً'),
          ),
        ],
      ),
    );
  }
}
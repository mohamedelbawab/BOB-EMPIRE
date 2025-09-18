import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/ai_service.dart';
import '../../providers/sync_provider.dart';
import '../../utils/theme.dart';

class AgentsScreen extends StatefulWidget {
  const AgentsScreen({super.key});

  @override
  State<AgentsScreen> createState() => _AgentsScreenState();
}

class _AgentsScreenState extends State<AgentsScreen> {
  List<Map<String, dynamic>> _agents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAgents();
  }

  Future<void> _loadAgents() async {
    try {
      final response = await AIService.getAgents();
      setState(() {
        _agents = List<Map<String, dynamic>>.from(response['agents'] ?? []);
        _isLoading = false;
      });
    } catch (error) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'الوكلاء الذكية',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        flexibleSpace: Container(
          decoration: BoxDecoration(gradient: AppTheme.primaryGradient),
        ),
        actions: [
          IconButton(
            onPressed: _loadAgents,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _buildAgentsList(),
    );
  }

  Widget _buildAgentsList() {
    if (_agents.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.smart_toy_outlined, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'لا توجد وكلاء متاحة حالياً',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _agents.length,
      itemBuilder: (context, index) {
        final agent = _agents[index];
        return _buildAgentCard(agent);
      },
    );
  }

  Widget _buildAgentCard(Map<String, dynamic> agent) {
    final status = agent['status'] ?? 'idle';
    final isActive = status == 'running';

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () => _showAgentDialog(agent),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      gradient: AppTheme.primaryGradient,
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(
                      Icons.smart_toy,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          agent['name'] ?? 'وكيل غير معروف',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          agent['description'] ?? 'لا يوجد وصف',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isActive ? Colors.green.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      isActive ? 'نشط' : 'متوقف',
                      style: TextStyle(
                        fontSize: 12,
                        color: isActive ? Colors.green : Colors.grey,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _runAgent(agent),
                      icon: const Icon(Icons.play_arrow, size: 20),
                      label: const Text('تشغيل'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.primaryColor,
                        side: const BorderSide(color: AppTheme.primaryColor),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => _configureAgent(agent),
                      icon: const Icon(Icons.settings, size: 20),
                      label: const Text('إعداد'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showAgentDialog(Map<String, dynamic> agent) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(agent['name'] ?? 'وكيل'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('الوصف: ${agent['description'] ?? 'غير متوفر'}'),
            const SizedBox(height: 8),
            Text('الدور: ${agent['role'] ?? 'غير محدد'}'),
            const SizedBox(height: 8),
            Text('الحالة: ${agent['status'] ?? 'غير معروفة'}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إغلاق'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _runAgent(agent);
            },
            child: const Text('تشغيل'),
          ),
        ],
      ),
    );
  }

  void _runAgent(Map<String, dynamic> agent) async {
    final syncProvider = Provider.of<SyncProvider>(context, listen: false);
    
    // Show input dialog
    final TextEditingController controller = TextEditingController();
    
    final result = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('تشغيل ${agent['name']}'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            labelText: 'المدخلات للوكيل',
            hintText: 'اكتب المهمة أو الأمر...',
          ),
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('إلغاء'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, controller.text),
            child: const Text('تشغيل'),
          ),
        ],
      ),
    );

    if (result != null && result.isNotEmpty) {
      // Update agent status
      setState(() {
        agent['status'] = 'running';
      });

      // Send to sync provider
      syncProvider.runAgent(agent['id'], result);

      // Run agent via AI service
      try {
        final response = await AIService.runAgent(agent['id'], result);
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(response),
              backgroundColor: Colors.green,
            ),
          );
        }
      } catch (error) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('حدث خطأ في تشغيل الوكيل'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } finally {
        // Reset agent status
        setState(() {
          agent['status'] = 'idle';
        });
      }
    }
  }

  void _configureAgent(Map<String, dynamic> agent) {
    // Show configuration dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('إعداد ${agent['name']}'),
        content: const Text('خيارات الإعداد قيد التطوير'),
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
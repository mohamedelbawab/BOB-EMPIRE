// Agents Component for Desktop App
class AgentsComponent {
    constructor(app) {
        this.app = app;
    }

    render() {
        const agentsList = document.getElementById('agentsList');
        if (!agentsList || !this.app.agents) return;

        agentsList.innerHTML = this.app.agents.map(agent => `
            <div class="agent-card" data-agent-id="${agent.id}">
                <div class="agent-header">
                    <div class="agent-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="agent-info">
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-role">${this.getRoleLabel(agent.role)}</div>
                    </div>
                    <div class="agent-status ${agent.status}">
                        ${agent.status === 'running' ? 'نشط' : 'متوقف'}
                    </div>
                </div>
                <div class="agent-description">
                    ${agent.description}
                </div>
                <div class="agent-actions">
                    <button class="btn btn-primary" onclick="window.bobEmpireApp.agentsComponent.runAgent('${agent.id}')">
                        <i class="fas fa-play"></i>
                        تشغيل
                    </button>
                    <button class="btn btn-secondary" onclick="window.bobEmpireApp.agentsComponent.configureAgent('${agent.id}')">
                        <i class="fas fa-cog"></i>
                        إعداد
                    </button>
                </div>
            </div>
        `).join('');
    }

    getRoleLabel(role) {
        const roleLabels = {
            'marketing': 'تسويق',
            'customer_service': 'خدمة العملاء',
            'inventory': 'إدارة المخزون',
            'analytics': 'تحليلات',
            'platforms': 'المنصات'
        };
        return roleLabels[role] || role;
    }

    runAgent(agentId) {
        const agent = this.app.agents.find(a => a.id === agentId);
        if (!agent) return;

        // Show input dialog
        const task = prompt(`تشغيل ${agent.name}\n\nأدخل المهمة أو الأمر:`);
        if (!task) return;

        // Update agent status
        agent.status = 'running';
        this.render();

        // Simulate agent execution
        this.app.showNotification('تشغيل الوكيل', `جاري تشغيل ${agent.name}...`);

        setTimeout(() => {
            agent.status = 'idle';
            this.render();
            this.app.showNotification('مكتمل', `تم تنفيذ المهمة بواسطة ${agent.name}`);
        }, 3000);

        // Send via WebSocket if connected
        if (this.app.isConnected && window.electronAPI) {
            window.electronAPI.sendWebSocketMessage({
                type: 'run_agent',
                deviceId: this.app.deviceId,
                agentId: agentId,
                task: task,
                timestamp: new Date().toISOString()
            });
        }
    }

    configureAgent(agentId) {
        const agent = this.app.agents.find(a => a.id === agentId);
        if (!agent) return;

        this.app.showNotification('إعداد الوكيل', `إعدادات ${agent.name} قيد التطوير`);
    }
}

window.AgentsComponent = AgentsComponent;
// Bob Empire Desktop Application
class BobEmpireApp {
    constructor() {
        this.currentView = 'dashboard';
        this.isConnected = false;
        this.deviceId = null;
        this.linkedDeviceId = null;
        this.chatMessages = [];
        this.agents = [];
        this.platforms = [];
        
        this.init();
    }

    async init() {
        try {
            // Get device ID from main process
            this.deviceId = await window.electronAPI?.getDeviceId() || `desktop_${Date.now()}`;
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup IPC listeners
            this.setupIPCListeners();
            
            // Initialize components
            this.initializeComponents();
            
            // Load initial data
            await this.loadInitialData();
            
            // Hide loading screen and show app
            this.showApp();
            
            console.log('Bob Empire Desktop App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showApp(); // Show app anyway
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.getAttribute('data-view');
                this.navigateToView(view);
            });
        });

        // Theme toggle
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Sync button
        const syncBtn = document.getElementById('syncBtn');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => {
                this.syncData();
            });
        }

        // QR button
        const qrBtn = document.getElementById('qrBtn');
        if (qrBtn) {
            qrBtn.addEventListener('click', () => {
                this.showQRCode();
            });
        }

        // Quick actions
        document.querySelectorAll('.quick-action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const action = card.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Chat functionality
        this.setupChatEventListeners();

        // Settings
        this.setupSettingsEventListeners();

        // Window controls (if custom title bar)
        this.setupWindowControls();

        // Modal controls
        this.setupModalControls();
    }

    setupChatEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const voiceBtn = document.getElementById('voiceBtn');
        const clearChatBtn = document.getElementById('clearChatBtn');

        if (chatInput && sendBtn) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });

            sendBtn.addEventListener('click', () => {
                this.sendChatMessage();
            });
        }

        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleVoiceInput();
            });
        }

        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                this.clearChat();
            });
        }
    }

    setupSettingsEventListeners() {
        const languageSelect = document.getElementById('languageSelect');
        const themeSelect = document.getElementById('themeSelect');

        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }
    }

    setupWindowControls() {
        const minimizeBtn = document.getElementById('minimizeBtn');
        const maximizeBtn = document.getElementById('maximizeBtn');
        const closeBtn = document.getElementById('closeBtn');

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                window.electronAPI?.minimizeWindow();
            });
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => {
                window.electronAPI?.maximizeWindow();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.electronAPI?.closeWindow();
            });
        }
    }

    setupModalControls() {
        // QR Modal
        const qrModal = document.getElementById('qrModal');
        const closeQRModal = document.getElementById('closeQRModal');

        if (closeQRModal) {
            closeQRModal.addEventListener('click', () => {
                this.hideModal('qrModal');
            });
        }

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    setupIPCListeners() {
        if (!window.electronAPI) return;

        // WebSocket status updates
        window.electronAPI.onWebSocketStatus((status) => {
            this.updateConnectionStatus(status.connected);
        });

        // Sync data updates
        window.electronAPI.onSyncData((data) => {
            this.handleSyncData(data);
        });

        // Device linked
        window.electronAPI.onDeviceLinked((data) => {
            this.handleDeviceLinked(data);
        });

        // New chat message
        window.electronAPI.onNewChatMessage((message) => {
            this.handleIncomingChatMessage(message);
        });

        // Agent updates
        window.electronAPI.onAgentUpdate((data) => {
            this.handleAgentUpdate(data);
        });

        // Navigation from menu
        window.electronAPI.onNavigateTo((view) => {
            this.navigateToView(view);
        });

        // QR code display
        window.electronAPI.onShowQRCode((data) => {
            this.displayQRCode(data);
        });

        // Menu actions
        window.electronAPI.onMenuAction((action) => {
            this.handleMenuAction(action);
        });
    }

    async initializeComponents() {
        // Initialize chat component
        if (window.ChatComponent) {
            this.chatComponent = new window.ChatComponent(this);
        }

        // Initialize agents component
        if (window.AgentsComponent) {
            this.agentsComponent = new window.AgentsComponent(this);
        }

        // Initialize platforms component
        if (window.PlatformsComponent) {
            this.platformsComponent = new window.PlatformsComponent(this);
        }

        // Initialize sync component
        if (window.SyncComponent) {
            this.syncComponent = new window.SyncComponent(this);
        }
    }

    async loadInitialData() {
        try {
            // Load agents
            await this.loadAgents();
            
            // Load platforms
            await this.loadPlatforms();
            
            // Load dashboard data
            await this.loadDashboardData();
            
            // Initialize chat with welcome message
            this.initializeChat();
            
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    showApp() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        if (app) {
            app.style.display = 'block';
        }
    }

    navigateToView(viewName) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current nav item
        const currentNavItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
        if (currentNavItem) {
            currentNavItem.classList.add('active');
        }

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show current view
        const currentView = document.getElementById(`${viewName}-view`);
        if (currentView) {
            currentView.classList.add('active');
        }

        this.currentView = viewName;

        // Load view-specific data
        this.loadViewData(viewName);
    }

    async loadViewData(viewName) {
        switch (viewName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'agents':
                await this.loadAgents();
                this.renderAgents();
                break;
            case 'platforms':
                await this.loadPlatforms();
                this.renderPlatforms();
                break;
            case 'chat':
                this.scrollChatToBottom();
                break;
            case 'sync':
                this.updateSyncStatus();
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Simulate API call or load from backend
            const dashboardData = {
                totalOrders: 12,
                totalRevenue: '$3,500',
                activeAgents: this.agents.length || 140,
                connectedPlatforms: this.platforms.filter(p => p.connected).length || 35
            };

            this.updateDashboardStats(dashboardData);
            this.loadRecentActivity();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    updateDashboardStats(data) {
        const elements = {
            totalOrders: document.getElementById('totalOrders'),
            totalRevenue: document.getElementById('totalRevenue'),
            activeAgents: document.getElementById('activeAgents'),
            connectedPlatforms: document.getElementById('connectedPlatforms')
        };

        Object.keys(elements).forEach(key => {
            if (elements[key] && data[key] !== undefined) {
                elements[key].textContent = data[key];
            }
        });
    }

    loadRecentActivity() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const activities = [
            {
                icon: 'fas fa-shopping-cart',
                title: 'طلب جديد من أمازون',
                time: 'منذ 5 دقائق'
            },
            {
                icon: 'fas fa-robot',
                title: 'تم تشغيل وكيل التسويق',
                time: 'منذ 15 دقيقة'
            },
            {
                icon: 'fas fa-link',
                title: 'تم ربط منصة شوبيفاي',
                time: 'منذ 30 دقيقة'
            },
            {
                icon: 'fas fa-sync',
                title: 'مزامنة البيانات مكتملة',
                time: 'منذ ساعة'
            }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    async loadAgents() {
        try {
            // Simulate loading agents from API
            this.agents = [
                {
                    id: '1',
                    name: 'وكيل التسويق الذكي',
                    role: 'marketing',
                    status: 'idle',
                    description: 'متخصص في التسويق الرقمي وإدارة الحملات الإعلانية'
                },
                {
                    id: '2',
                    name: 'وكيل خدمة العملاء',
                    role: 'customer_service',
                    status: 'running',
                    description: 'يتعامل مع استفسارات العملاء والدعم الفني'
                },
                {
                    id: '3',
                    name: 'وكيل إدارة المخزون',
                    role: 'inventory',
                    status: 'idle',
                    description: 'يدير المخزون والطلبات والشحن'
                },
                {
                    id: '4',
                    name: 'وكيل التحليل المالي',
                    role: 'analytics',
                    status: 'idle',
                    description: 'يحلل البيانات المالية والمبيعات'
                }
            ];
        } catch (error) {
            console.error('Error loading agents:', error);
        }
    }

    async loadPlatforms() {
        try {
            const platformNames = [
                'Amazon', 'Shopify', 'AliExpress', 'Alibaba', 'Coupang',
                'Rakuten', 'Shopee', 'Lazada', 'MercadoLibre', 'Flipkart',
                'Facebook', 'Instagram', 'WhatsApp', 'Telegram', 'TikTok'
            ];

            this.platforms = platformNames.map((name, index) => ({
                id: index + 1,
                name,
                connected: Math.random() > 0.5,
                lastSync: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error loading platforms:', error);
        }
    }

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.classList.remove('dark-theme', 'light-theme');
        body.classList.add(`${newTheme}-theme`);
        
        // Update theme button icon
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        // Save theme preference
        localStorage.setItem('theme', newTheme);
    }

    changeLanguage(language) {
        // Implement language change
        localStorage.setItem('language', language);
        
        // In a real app, you would reload the interface with new language
        console.log('Language changed to:', language);
    }

    changeTheme(theme) {
        const body = document.body;
        body.classList.remove('dark-theme', 'light-theme', 'auto-theme');
        body.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
    }

    syncData() {
        if (window.electronAPI) {
            window.electronAPI.sendWebSocketMessage({
                type: 'sync_request',
                deviceId: this.deviceId,
                timestamp: new Date().toISOString()
            });
        }
        
        this.showNotification('مزامنة البيانات', 'جاري مزامنة البيانات...');
    }

    showQRCode() {
        this.showModal('qrModal');
        
        // Generate QR code for device linking
        if (window.electronAPI) {
            window.electronAPI.generateQRCode();
        }
    }

    updateConnectionStatus(connected) {
        this.isConnected = connected;
        
        const statusElement = document.getElementById('connectionStatus');
        const iconElement = document.getElementById('connectionIcon');
        const textElement = document.getElementById('connectionText');
        
        if (statusElement && iconElement && textElement) {
            statusElement.className = `connection-status ${connected ? 'connected' : 'disconnected'}`;
            iconElement.className = connected ? 'fas fa-cloud' : 'fas fa-cloud-slash';
            textElement.textContent = connected ? 'متصل' : 'غير متصل';
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showNotification(title, message) {
        // Show in-app notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    handleQuickAction(action) {
        switch (action) {
            case 'new-product':
                this.showNotification('منتج جديد', 'فتح نموذج إضافة منتج...');
                break;
            case 'run-agent':
                this.navigateToView('agents');
                break;
            case 'connect-platform':
                this.navigateToView('platforms');
                break;
            case 'ai-chat':
                this.navigateToView('chat');
                break;
        }
    }

    // Chat methods will be implemented in chat component
    initializeChat() {
        if (this.chatComponent) {
            this.chatComponent.addWelcomeMessage();
        }
    }

    sendChatMessage() {
        if (this.chatComponent) {
            this.chatComponent.sendMessage();
        }
    }

    clearChat() {
        if (this.chatComponent) {
            this.chatComponent.clearMessages();
        }
    }

    toggleVoiceInput() {
        if (this.chatComponent) {
            this.chatComponent.toggleVoiceInput();
        }
    }

    scrollChatToBottom() {
        if (this.chatComponent) {
            this.chatComponent.scrollToBottom();
        }
    }

    renderAgents() {
        if (this.agentsComponent) {
            this.agentsComponent.render();
        }
    }

    renderPlatforms() {
        if (this.platformsComponent) {
            this.platformsComponent.render();
        }
    }

    updateSyncStatus() {
        if (this.syncComponent) {
            this.syncComponent.updateStatus();
        }
    }

    // Event handlers
    handleSyncData(data) {
        console.log('Sync data received:', data);
        // Update local data with synced data
    }

    handleDeviceLinked(data) {
        this.linkedDeviceId = data.linkedDeviceId;
        this.showNotification('جهاز مرتبط', `تم ربط الجهاز: ${data.linkedDeviceId}`);
    }

    handleIncomingChatMessage(message) {
        if (this.chatComponent) {
            this.chatComponent.addIncomingMessage(message);
        }
    }

    handleAgentUpdate(data) {
        // Update agent status
        const agent = this.agents.find(a => a.id === data.agentId);
        if (agent) {
            agent.status = data.status;
            this.renderAgents();
        }
    }

    handleMenuAction(action) {
        switch (action) {
            case 'new':
                this.showNotification('جديد', 'فتح مشروع جديد...');
                break;
            case 'open':
                this.openFile();
                break;
            case 'save':
                this.saveFile();
                break;
        }
    }

    displayQRCode(data) {
        const qrCodeElement = document.getElementById('qrCode');
        if (qrCodeElement && data.qrImage) {
            qrCodeElement.innerHTML = `<img src="${data.qrImage}" alt="QR Code">`;
        }
    }

    async openFile() {
        if (window.electronAPI) {
            const result = await window.electronAPI.showOpenDialog();
            if (!result.canceled && result.filePaths.length > 0) {
                const fileData = await window.electronAPI.readFile(result.filePaths[0]);
                if (fileData.success) {
                    this.showNotification('فتح ملف', 'تم فتح الملف بنجاح');
                    // Process file data
                    console.log('File data:', fileData.data);
                }
            }
        }
    }

    async saveFile() {
        if (window.electronAPI) {
            const result = await window.electronAPI.showSaveDialog();
            if (!result.canceled) {
                const dataToSave = JSON.stringify({
                    deviceId: this.deviceId,
                    agents: this.agents,
                    platforms: this.platforms,
                    chatMessages: this.chatMessages
                }, null, 2);
                
                const saveResult = await window.electronAPI.writeFile(result.filePath, dataToSave);
                if (saveResult.success) {
                    this.showNotification('حفظ ملف', 'تم حفظ الملف بنجاح');
                }
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bobEmpireApp = new BobEmpireApp();
});

// Expose app to global scope for debugging
window.BobEmpireApp = BobEmpireApp;
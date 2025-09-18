// Platforms Component for Desktop App
class PlatformsComponent {
    constructor(app) {
        this.app = app;
    }

    render() {
        const platformsList = document.getElementById('platformsList');
        if (!platformsList || !this.app.platforms) return;

        platformsList.innerHTML = this.app.platforms.map(platform => `
            <div class="platform-card ${platform.connected ? 'connected' : ''}" data-platform-id="${platform.id}">
                <div class="platform-header">
                    <div class="platform-name">${platform.name}</div>
                    <div class="platform-status ${platform.connected ? 'connected' : 'disconnected'}">
                        ${platform.connected ? 'متصل' : 'غير متصل'}
                    </div>
                </div>
                <div class="platform-info">
                    <div class="platform-detail">
                        <strong>آخر مزامنة:</strong> ${this.formatDate(platform.lastSync)}
                    </div>
                </div>
                <div class="platform-actions">
                    <button class="btn ${platform.connected ? 'btn-danger' : 'btn-primary'}" 
                            onclick="window.bobEmpireApp.platformsComponent.toggleConnection('${platform.id}')">
                        <i class="fas ${platform.connected ? 'fa-unlink' : 'fa-link'}"></i>
                        ${platform.connected ? 'قطع الاتصال' : 'ربط'}
                    </button>
                    <button class="btn btn-secondary" onclick="window.bobEmpireApp.platformsComponent.configurePlatform('${platform.id}')">
                        <i class="fas fa-cog"></i>
                        إعداد
                    </button>
                </div>
            </div>
        `).join('');
    }

    toggleConnection(platformId) {
        const platform = this.app.platforms.find(p => p.id == platformId);
        if (!platform) return;

        if (platform.connected) {
            platform.connected = false;
            this.app.showNotification('قطع الاتصال', `تم قطع الاتصال مع ${platform.name}`);
        } else {
            platform.connected = true;
            platform.lastSync = new Date().toISOString();
            this.app.showNotification('ربط المنصة', `تم ربط ${platform.name} بنجاح`);
        }

        this.render();

        // Send via WebSocket if connected
        if (this.app.isConnected && window.electronAPI) {
            window.electronAPI.sendWebSocketMessage({
                type: 'platform_toggle',
                deviceId: this.app.deviceId,
                platformId: platformId,
                connected: platform.connected,
                timestamp: new Date().toISOString()
            });
        }
    }

    configurePlatform(platformId) {
        const platform = this.app.platforms.find(p => p.id == platformId);
        if (!platform) return;

        this.app.showNotification('إعداد المنصة', `إعدادات ${platform.name} قيد التطوير`);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}

window.PlatformsComponent = PlatformsComponent;
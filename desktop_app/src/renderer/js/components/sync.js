// Sync Component for Desktop App
class SyncComponent {
    constructor(app) {
        this.app = app;
        this.syncLog = [];
    }

    updateStatus() {
        const syncStatus = document.getElementById('syncStatus');
        const syncIndicator = syncStatus?.querySelector('.sync-indicator');
        const statusText = syncStatus?.querySelector('span');

        if (syncIndicator && statusText) {
            if (this.app.isConnected) {
                syncIndicator.classList.add('connected');
                statusText.textContent = 'حالة المزامنة: متصل ونشط';
            } else {
                syncIndicator.classList.remove('connected');
                statusText.textContent = 'حالة المزامنة: غير متصل';
            }
        }

        this.renderSyncLog();
    }

    renderSyncLog() {
        const syncLogElement = document.getElementById('syncLog');
        if (!syncLogElement) return;

        if (this.syncLog.length === 0) {
            syncLogElement.innerHTML = '<p class="text-center">لا توجد سجلات مزامنة حتى الآن</p>';
            return;
        }

        syncLogElement.innerHTML = this.syncLog.map(log => `
            <div class="sync-log-item">
                <span class="sync-log-timestamp">${this.formatTime(log.timestamp)}</span>
                <span class="sync-log-message">${log.message}</span>
            </div>
        `).join('');
    }

    addLogEntry(message) {
        this.syncLog.unshift({
            timestamp: new Date(),
            message: message
        });

        // Keep only last 50 entries
        if (this.syncLog.length > 50) {
            this.syncLog = this.syncLog.slice(0, 50);
        }

        this.renderSyncLog();
    }

    formatTime(timestamp) {
        return new Intl.DateTimeFormat('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(timestamp);
    }
}

window.SyncComponent = SyncComponent;
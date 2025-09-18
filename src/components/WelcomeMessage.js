import React from 'react';
import './WelcomeMessage.css';

const WelcomeMessage = ({ user, onOpenSettings, onOpenDeviceLink }) => {
  const deviceType = window.innerWidth <= 768 ? 'mobile' : 'desktop';
  
  // Define emoji constants to avoid build issues
  const emojis = {
    crown: '\u{1F451}',
    mobile: '\u{1F4F1}',
    desktop: '\u{1F4BB}',
    settings: '\u{2699}\u{FE0F}',
    link: '\u{1F517}',
    robot: '\u{1F916}',
    globe: '\u{1F30D}',
    chat: '\u{1F4AC}',
    rocket: '\u{1F680}',
    chart: '\u{1F4CA}',
    lightning: '\u{26A1}',
    sparkles: '\u{2728}',
    sync: '\u{1F504}',
    lock: '\u{1F512}',
    fast: '\u{26A1}',
    checkmark: '\u{2705}',
    wave: '\u{1F44B}'
  };
  
  const welcomeIcon = '\u{1F451}'; // Crown emoji
  const mobileIcon = '\u{1F4F1}'; // Mobile phone emoji
  const desktopIcon = '\u{1F4BB}'; // Desktop computer emoji

  return (
    <div className="welcome-message">
      <div className="welcome-header">
        <div className="welcome-icon">{emojis.crown}</div>
        <h1>Welcome to Bob Empire</h1>
        <p className="welcome-subtitle">
          منصة تجارة عالمية يقودها الذكاء الاصطناعي
        </p>
        <p className="welcome-subtitle-en">
          Global AI-Powered Commerce Platform
        </p>
      </div>

      <div className="mobile-ready-banner">
        <div className="banner-icon">{emojis.mobile}</div>
        <div className="banner-content">
          <h3>Now Mobile Ready!</h3>
          <p>Full control from any device - phone, tablet, or desktop</p>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">{emojis.settings}</div>
          <h3>Easy Management</h3>
          <p>Configure APIs, agents, and platforms directly from the app on any device</p>
          <button className="feature-btn" onClick={onOpenSettings}>
            Open Settings
          </button>
        </div>

        <div className="feature-card">
          <div className="feature-icon">{emojis.link}</div>
          <h3>Cross-Device Sync</h3>
          <p>Link your mobile and desktop devices for seamless access everywhere</p>
          <button className="feature-btn" onClick={onOpenDeviceLink}>
            Link Device
          </button>
        </div>

        <div className="feature-card">
          <div className="feature-icon">{emojis.robot}</div>
          <h3>AI Agents</h3>
          <p>140+ AI agents ready to manage your global commerce operations</p>
          <button className="feature-btn">
            View Agents
          </button>
        </div>

        <div className="feature-card">
          <div className="feature-icon">{emojis.globe}</div>
          <h3>Global Platforms</h3>
          <p>Connect to Amazon, Shopify, AliExpress, and 30+ platforms worldwide</p>
          <button className="feature-btn">
            Manage Platforms
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">💬</span>
            <span>Chat with AI</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🚀</span>
            <span>Run Super AI</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>View Dashboard</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">⚡</span>
            <span>Turbo Mode</span>
          </button>
        </div>
      </div>

      <div className="mobile-tips">
        <h3>📱 Mobile Tips</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">✨</span>
            <p><strong>Touch Optimized:</strong> All controls are sized for easy touch interaction</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔄</span>
            <p><strong>Real-time Sync:</strong> Changes sync instantly across all your devices</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔒</span>
            <p><strong>Secure:</strong> End-to-end encryption for all device communications</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⚡</span>
            <p><strong>Fast & Responsive:</strong> Optimized for mobile networks and performance</p>
          </div>
        </div>
      </div>

      <div className="platform-status">
        <h3>🎯 Platform Readiness</h3>
        <div className="status-grid">
          <div className="status-item ready">
            <span className="status-icon">✅</span>
            <div>
              <strong>Mobile Interface</strong>
              <p>Fully responsive design</p>
            </div>
          </div>
          <div className="status-item ready">
            <span className="status-icon">✅</span>
            <div>
              <strong>Cross-Device Sync</strong>
              <p>Real-time data synchronization</p>
            </div>
          </div>
          <div className="status-item ready">
            <span className="status-icon">✅</span>
            <div>
              <strong>Easy Configuration</strong>
              <p>In-app settings management</p>
            </div>
          </div>
          <div className="status-item ready">
            <span className="status-icon">✅</span>
            <div>
              <strong>Global Commerce</strong>
              <p>30+ platform integrations</p>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <div className="user-welcome">
          <h3>👋 Welcome back, {user.email}!</h3>
          <p>Your empire is ready to expand across all your devices.</p>
          <div className="user-stats">
            <div className="stat">
              <span className="stat-value">3</span>
              <span className="stat-label">Linked Devices</span>
            </div>
            <div className="stat">
              <span className="stat-value">12</span>
              <span className="stat-label">Active Agents</span>
            </div>
            <div className="stat">
              <span className="stat-value">5</span>
              <span className="stat-label">Connected Platforms</span>
            </div>
          </div>
        </div>
      )}

      <div className="device-info">
        <p>
          <span className="device-indicator">
            {deviceType === 'mobile' ? '📱' : '💻'}
          </span>
          Currently using {deviceType} interface
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
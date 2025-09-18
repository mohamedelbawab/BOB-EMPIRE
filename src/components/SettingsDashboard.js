import React, { useState, useEffect } from 'react';
import './SettingsDashboard.css';

const SettingsDashboard = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('apis');
  const [settings, setSettings] = useState({
    apis: {
      openai: { key: '', endpoint: 'https://api.openai.com/v1', enabled: true },
      supabase: { url: '', key: '', enabled: true },
    },
    agents: [],
    platforms: {
      amazon: { key: '', secret: '', enabled: false },
      shopify: { key: '', secret: '', enabled: false },
      stripe: { key: '', secret: '', enabled: false },
    },
    permissions: {
      owner: true,
      canManageAgents: true,
      canManageAPIs: true,
      canManagePlatforms: true,
    },
    features: {
      turboMode: false,
      mobileSync: true,
      aiAssistant: true,
      multiDevice: true,
    }
  });

  const [devices, setDevices] = useState([
    { id: 1, name: 'iPhone 15', type: 'mobile', lastSeen: '2 minutes ago', status: 'active' },
    { id: 2, name: 'MacBook Pro', type: 'desktop', lastSeen: '5 minutes ago', status: 'active' },
  ]);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('bob_empire_settings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('bob_empire_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const updateAPI = (apiName, field, value) => {
    setSettings(prev => ({
      ...prev,
      apis: {
        ...prev.apis,
        [apiName]: {
          ...prev.apis[apiName],
          [field]: value
        }
      }
    }));
  };

  const updatePlatform = (platform, field, value) => {
    setSettings(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: {
          ...prev.platforms[platform],
          [field]: value
        }
      }
    }));
  };

  const toggleFeature = (feature) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const addAgent = () => {
    const name = prompt('Enter agent name:');
    if (name) {
      const newAgent = {
        id: Date.now(),
        name,
        role: 'custom',
        status: 'idle',
        created: new Date().toISOString()
      };
      setSettings(prev => ({
        ...prev,
        agents: [...prev.agents, newAgent]
      }));
    }
  };

  const removeAgent = (id) => {
    if (confirm('Are you sure you want to remove this agent?')) {
      setSettings(prev => ({
        ...prev,
        agents: prev.agents.filter(agent => agent.id !== id)
      }));
    }
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      className={`settings-tab ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      <span className="tab-icon">{icon}</span>
      <span className="tab-label">{label}</span>
    </button>
  );

  const renderAPIsTab = () => (
    <div className="settings-content">
      <h3>🔑 API Configuration</h3>
      
      <div className="api-section">
        <h4>OpenAI</h4>
        <div className="form-group">
          <label>API Key</label>
          <input
            type="password"
            value={settings.apis.openai.key}
            onChange={(e) => updateAPI('openai', 'key', e.target.value)}
            placeholder="sk-..."
          />
        </div>
        <div className="form-group">
          <label>Endpoint</label>
          <input
            type="url"
            value={settings.apis.openai.endpoint}
            onChange={(e) => updateAPI('openai', 'endpoint', e.target.value)}
          />
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.apis.openai.enabled}
            onChange={(e) => updateAPI('openai', 'enabled', e.target.checked)}
          />
          <span>Enable OpenAI</span>
        </label>
      </div>

      <div className="api-section">
        <h4>Supabase</h4>
        <div className="form-group">
          <label>URL</label>
          <input
            type="url"
            value={settings.apis.supabase.url}
            onChange={(e) => updateAPI('supabase', 'url', e.target.value)}
            placeholder="https://your-project.supabase.co"
          />
        </div>
        <div className="form-group">
          <label>Anon Key</label>
          <input
            type="password"
            value={settings.apis.supabase.key}
            onChange={(e) => updateAPI('supabase', 'key', e.target.value)}
            placeholder="eyJ..."
          />
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.apis.supabase.enabled}
            onChange={(e) => updateAPI('supabase', 'enabled', e.target.checked)}
          />
          <span>Enable Supabase Auth</span>
        </label>
      </div>
    </div>
  );

  const renderAgentsTab = () => (
    <div className="settings-content">
      <div className="section-header">
        <h3>🤖 AI Agents</h3>
        <button className="btn-primary" onClick={addAgent}>Add Agent</button>
      </div>
      
      <div className="agents-list">
        {settings.agents.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-info">
              <h4>{agent.name}</h4>
              <p>Role: {agent.role} | Status: {agent.status}</p>
            </div>
            <button 
              className="btn-danger"
              onClick={() => removeAgent(agent.id)}
            >
              Remove
            </button>
          </div>
        ))}
        {settings.agents.length === 0 && (
          <p className="empty-state">No custom agents yet. Add your first agent!</p>
        )}
      </div>
    </div>
  );

  const renderPlatformsTab = () => (
    <div className="settings-content">
      <h3>🛍️ Platform Integrations</h3>
      
      {Object.entries(settings.platforms).map(([platform, config]) => (
        <div key={platform} className="platform-section">
          <h4>{platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
          <div className="form-row">
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={config.key}
                onChange={(e) => updatePlatform(platform, 'key', e.target.value)}
                placeholder="Enter API key"
              />
            </div>
            <div className="form-group">
              <label>Secret</label>
              <input
                type="password"
                value={config.secret}
                onChange={(e) => updatePlatform(platform, 'secret', e.target.value)}
                placeholder="Enter secret"
              />
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => updatePlatform(platform, 'enabled', e.target.checked)}
            />
            <span>Enable {platform}</span>
          </label>
        </div>
      ))}
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="settings-content">
      <h3>⚡ Features</h3>
      
      <div className="features-grid">
        {Object.entries(settings.features).map(([feature, enabled]) => (
          <div key={feature} className="feature-card">
            <label className="feature-toggle">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleFeature(feature)}
              />
              <div className="toggle-switch"></div>
              <div className="feature-info">
                <h4>{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                <p>
                  {feature === 'turboMode' && 'Enhanced performance mode'}
                  {feature === 'mobileSync' && 'Sync data across mobile devices'}
                  {feature === 'aiAssistant' && 'AI-powered assistance'}
                  {feature === 'multiDevice' && 'Support for multiple devices'}
                </p>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDevicesTab = () => (
    <div className="settings-content">
      <h3>📱 Connected Devices</h3>
      
      <div className="devices-list">
        {devices.map(device => (
          <div key={device.id} className="device-card">
            <div className="device-icon">
              {device.type === 'mobile' ? '📱' : '💻'}
            </div>
            <div className="device-info">
              <h4>{device.name}</h4>
              <p>Last seen: {device.lastSeen}</p>
              <span className={`status ${device.status}`}>{device.status}</span>
            </div>
            <button className="btn-secondary">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="settings-dashboard">
      <div className="settings-header">
        <h2>⚙️ Settings Dashboard</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <div className="settings-tabs">
        <TabButton id="apis" label="APIs" icon="🔑" />
        <TabButton id="agents" label="Agents" icon="🤖" />
        <TabButton id="platforms" label="Platforms" icon="🛍️" />
        <TabButton id="features" label="Features" icon="⚡" />
        <TabButton id="devices" label="Devices" icon="📱" />
      </div>

      <div className="settings-body">
        {activeTab === 'apis' && renderAPIsTab()}
        {activeTab === 'agents' && renderAgentsTab()}
        {activeTab === 'platforms' && renderPlatformsTab()}
        {activeTab === 'features' && renderFeaturesTab()}
        {activeTab === 'devices' && renderDevicesTab()}
      </div>

      <div className="settings-footer">
        <button className="btn-primary" onClick={saveSettings}>Save Settings</button>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default SettingsDashboard;
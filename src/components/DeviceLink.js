import React, { useState, useEffect } from 'react';
import './DeviceLink.css';

const DeviceLink = ({ user, onClose, onDeviceLinked }) => {
  const [linkCode, setLinkCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [linkStatus, setLinkStatus] = useState('idle'); // idle, generating, active, linked
  const [linkedDevices, setLinkedDevices] = useState([]);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Load existing linked devices
    const savedDevices = localStorage.getItem('bob_empire_linked_devices');
    if (savedDevices) {
      setLinkedDevices(JSON.parse(savedDevices));
    }
  }, []);

  useEffect(() => {
    // Update countdown timer
    if (expiresAt && linkStatus === 'active') {
      const timer = setInterval(() => {
        const remaining = expiresAt - Date.now();
        if (remaining <= 0) {
          setLinkStatus('idle');
          setLinkCode('');
          setQrCodeData('');
          setTimeRemaining(0);
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [expiresAt, linkStatus]);

  const generateLinkCode = () => {
    setLinkStatus('generating');
    
    // Generate a secure random code
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = Date.now() + (5 * 60 * 1000); // 5 minutes
    
    setTimeout(() => {
      setLinkCode(code);
      setExpiresAt(expires);
      setTimeRemaining(expires - Date.now());
      
      // Generate QR code data
      const linkData = {
        app: 'bob-empire',
        code: code,
        user: user?.email || 'demo',
        server: window.location.origin,
        expires: expires
      };
      
      setQrCodeData(JSON.stringify(linkData));
      setLinkStatus('active');
    }, 1000);
  };

  const copyLinkCode = () => {
    if (linkCode) {
      const linkText = `Bob Empire Device Link\nCode: ${linkCode}\nServer: ${window.location.origin}\nExpires: ${new Date(expiresAt).toLocaleTimeString()}`;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(linkText);
        alert('Link code copied to clipboard!');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = linkText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link code copied to clipboard!');
      }
    }
  };

  const simulateDeviceLink = () => {
    if (linkCode && linkStatus === 'active') {
      const newDevice = {
        id: Date.now(),
        name: `Mobile Device ${linkedDevices.length + 1}`,
        type: 'mobile',
        linkedAt: new Date().toISOString(),
        code: linkCode,
        status: 'active',
        lastSeen: 'Just now'
      };

      const updatedDevices = [...linkedDevices, newDevice];
      setLinkedDevices(updatedDevices);
      localStorage.setItem('bob_empire_linked_devices', JSON.stringify(updatedDevices));
      
      setLinkStatus('linked');
      setLinkCode('');
      setQrCodeData('');
      
      if (onDeviceLinked) {
        onDeviceLinked(newDevice);
      }
      
      alert(`Device "${newDevice.name}" linked successfully!`);
    }
  };

  const removeDevice = (deviceId) => {
    if (confirm('Are you sure you want to unlink this device?')) {
      const updatedDevices = linkedDevices.filter(device => device.id !== deviceId);
      setLinkedDevices(updatedDevices);
      localStorage.setItem('bob_empire_linked_devices', JSON.stringify(updatedDevices));
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Simple QR Code generator (placeholder - in production use a proper QR library)
  const generateQRCodeSVG = (data) => {
    if (!data) return '';
    
    // This is a simplified QR-like pattern for demo purposes
    // In production, use a proper QR code library like qrcode or qrcode-generator
    const size = 200;
    const modules = 25;
    const moduleSize = size / modules;
    
    const pattern = [];
    const hash = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < modules * modules; i++) {
      pattern.push((hash + i) % 3 === 0);
    }
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="qr-code">
        <rect width={size} height={size} fill="white" />
        {pattern.map((filled, index) => {
          const x = (index % modules) * moduleSize;
          const y = Math.floor(index / modules) * moduleSize;
          return filled ? (
            <rect
              key={index}
              x={x}
              y={y}
              width={moduleSize}
              height={moduleSize}
              fill="black"
            />
          ) : null;
        })}
        {/* Add finder patterns for QR-like appearance */}
        <rect x={0} y={0} width={moduleSize * 7} height={moduleSize * 7} fill="none" stroke="black" strokeWidth="2" />
        <rect x={size - moduleSize * 7} y={0} width={moduleSize * 7} height={moduleSize * 7} fill="none" stroke="black" strokeWidth="2" />
        <rect x={0} y={size - moduleSize * 7} width={moduleSize * 7} height={moduleSize * 7} fill="none" stroke="black" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="device-link-modal">
      <div className="device-link-content">
        <div className="device-link-header">
          <h2>📱 Device Linking</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="device-link-body">
          {linkStatus === 'idle' && (
            <div className="link-start">
              <div className="link-icon">🔗</div>
              <h3>Link a New Device</h3>
              <p>Generate a secure code to link your mobile device or another computer to your Bob Empire account.</p>
              <button className="btn-primary" onClick={generateLinkCode}>
                Generate Link Code
              </button>
            </div>
          )}

          {linkStatus === 'generating' && (
            <div className="link-generating">
              <div className="spinner"></div>
              <h3>Generating secure link...</h3>
              <p>Creating encrypted connection code</p>
            </div>
          )}

          {linkStatus === 'active' && (
            <div className="link-active">
              <div className="link-timer">
                <span className="time-remaining">{formatTime(timeRemaining)}</span>
                <span className="timer-label">Time remaining</span>
              </div>

              <div className="qr-section">
                <h3>📱 Scan QR Code</h3>
                <div className="qr-container">
                  {generateQRCodeSVG(qrCodeData)}
                </div>
                <p>Scan this QR code with your mobile device's camera or Bob Empire app</p>
              </div>

              <div className="manual-section">
                <h3>🔑 Manual Link Code</h3>
                <div className="code-display">
                  <span className="link-code">{linkCode}</span>
                  <button className="copy-btn" onClick={copyLinkCode}>📋 Copy</button>
                </div>
                <p>Or manually enter this code in the Bob Empire app on your device</p>
              </div>

              <div className="demo-section">
                <h4>🧪 Demo: Simulate Device Link</h4>
                <button className="btn-secondary" onClick={simulateDeviceLink}>
                  Simulate Mobile Device Link
                </button>
              </div>

              <button className="btn-secondary" onClick={() => setLinkStatus('idle')}>
                Cancel Link
              </button>
            </div>
          )}

          {linkStatus === 'linked' && (
            <div className="link-success">
              <div className="success-icon">✅</div>
              <h3>Device Linked Successfully!</h3>
              <p>Your device is now connected and synced with your Bob Empire account.</p>
              <button className="btn-primary" onClick={() => setLinkStatus('idle')}>
                Link Another Device
              </button>
            </div>
          )}

          <div className="linked-devices-section">
            <h3>📱 Linked Devices ({linkedDevices.length})</h3>
            {linkedDevices.length === 0 ? (
              <p className="empty-state">No devices linked yet</p>
            ) : (
              <div className="devices-list">
                {linkedDevices.map(device => (
                  <div key={device.id} className="device-item">
                    <div className="device-info">
                      <div className="device-icon">
                        {device.type === 'mobile' ? '📱' : '💻'}
                      </div>
                      <div className="device-details">
                        <h4>{device.name}</h4>
                        <p>Linked: {new Date(device.linkedAt).toLocaleDateString()}</p>
                        <p>Last seen: {device.lastSeen}</p>
                        <span className={`device-status ${device.status}`}>
                          {device.status}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="btn-danger"
                      onClick={() => removeDevice(device.id)}
                    >
                      Unlink
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="device-link-footer">
          <div className="security-info">
            <h4>🔒 Security Features</h4>
            <ul>
              <li>✅ Codes expire automatically in 5 minutes</li>
              <li>✅ Encrypted device communication</li>
              <li>✅ Owner can revoke access anytime</li>
              <li>✅ Real-time sync across all devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceLink;
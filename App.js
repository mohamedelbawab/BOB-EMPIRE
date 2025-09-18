import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import WelcomeMessage from "./src/components/WelcomeMessage";
import SettingsDashboard from "./src/components/SettingsDashboard";
import DeviceLink from "./src/components/DeviceLink";
import "./src/styles/mobile-responsive.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeviceLink, setShowDeviceLink] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('bob_empire_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowLogin(false);
    }
  }, []);

  async function login() {
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage(`❌ ${error.message}`);
        } else {
          const userData = { email, id: data.user?.id };
          setUser(userData);
          localStorage.setItem('bob_empire_user', JSON.stringify(userData));
          setMessage("✅ Logged in successfully!");
          setShowLogin(false);
        }
      } else {
        // Demo mode
        if (email && password) {
          const userData = { email, id: 'demo-' + Date.now() };
          setUser(userData);
          localStorage.setItem('bob_empire_user', JSON.stringify(userData));
          setMessage("✅ Logged in successfully (Demo Mode)!");
          setShowLogin(false);
        } else {
          setMessage("❌ Please enter email and password");
        }
      }
    } catch (error) {
      setMessage(`❌ Login error: ${error.message}`);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('bob_empire_user');
    setShowLogin(true);
    setMessage("");
    setEmail("");
    setPassword("");
  }

  if (showLogin) {
    return (
      <div className="app-container">
        <div className="login-container">
          <div className="login-header">
            <div className="app-icon">{'👑'}</div>
            <h1>Bob Empire</h1>
            <p className="app-subtitle">منصة تجارة عالمية يقودها الذكاء الاصطناعي</p>
            <p className="app-subtitle-en">Global AI-Powered Commerce Platform</p>
          </div>
          
          <div className="mobile-ready-notice">
            <span className="mobile-icon">{'📱'}</span>
            <span>Now fully mobile-ready!</span>
          </div>

          <div className="login-form">
            <div className="form-group">
              <input 
                type="email"
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <button onClick={login} className="login-btn">
              {'🔐'} Login
            </button>
            
            {message && (
              <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>

          <div className="demo-info">
            <h3>✨ Demo Mode Available</h3>
            <p>Try with any email/password combination</p>
            <div className="demo-features">
              <span className="demo-feature">📱 Mobile Responsive</span>
              <span className="demo-feature">⚙️ Settings Dashboard</span>
              <span className="demo-feature">🔗 Device Linking</span>
              <span className="demo-feature">🤖 AI Agents</span>
            </div>
          </div>

          <div className="device-indicator">
            <span className="device-icon">
              {isMobile ? '📱' : '💻'}
            </span>
            <span>Optimized for {isMobile ? 'mobile' : 'desktop'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="app-logo">{'👑'}</div>
            <div className="app-info">
              <h1>Bob Empire</h1>
              <span className="user-info">Welcome, {user.email}</span>
            </div>
          </div>
          <div className="header-right">
            <button 
              className="header-btn"
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              {'⚙️'}
            </button>
            <button 
              className="header-btn"
              onClick={() => setShowDeviceLink(true)}
              title="Device Link"
            >
              {'🔗'}
            </button>
            <button 
              className="header-btn logout-btn"
              onClick={logout}
              title="Logout"
            >
              {'🚪'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <WelcomeMessage 
          user={user}
          onOpenSettings={() => setShowSettings(true)}
          onOpenDeviceLink={() => setShowDeviceLink(true)}
        />
      </main>

      {showSettings && (
        <SettingsDashboard 
          user={user}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showDeviceLink && (
        <DeviceLink 
          user={user}
          onClose={() => setShowDeviceLink(false)}
          onDeviceLinked={(device) => {
            console.log('Device linked:', device);
            // Handle device linking
          }}
        />
      )}
    </div>
  );
}

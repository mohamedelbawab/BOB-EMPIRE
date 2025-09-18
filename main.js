// Bob Empire Frontend - Enhanced Multi-Platform Version 2.0
import { SUPABASE_URL, SUPABASE_ANON_KEY, AI_API_URL } from './config.js';

console.log("🚀 Bob Empire v2.0 initialized");
console.log("Platform:", detectPlatform());
console.log("Supabase URL:", SUPABASE_URL);

// Authentication state
let currentUser = null;
let isLoading = false;

// Platform detection
function detectPlatform() {
  if (window.electronAPI) return 'electron';
  if (window.isMobile || /Mobi|Android/i.test(navigator.userAgent)) return 'mobile';
  return 'web';
}

// UI Helper functions
function showLoading(buttonId, text = 'Loading...') {
  const button = document.getElementById(buttonId);
  if (button) {
    button.innerHTML = `<div class="loading"></div> ${text}`;
    button.disabled = true;
  }
}

function hideLoading(buttonId, originalText) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.innerHTML = originalText;
    button.disabled = false;
  }
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  const errorText = document.getElementById('errorText');
  if (errorDiv && errorText) {
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
      errorDiv.classList.add('hidden');
    }, 5000);
  }
}

function showUserInfo(user) {
  const userInfo = document.getElementById('userInfo');
  const userEmail = document.getElementById('userEmail');
  const authButtons = document.getElementById('authButtons');
  
  if (userInfo && userEmail && authButtons) {
    userEmail.textContent = user.email;
    userInfo.classList.remove('hidden');
    authButtons.classList.add('hidden');
  }
}

function hideUserInfo() {
  const userInfo = document.getElementById('userInfo');
  const authButtons = document.getElementById('authButtons');
  
  if (userInfo && authButtons) {
    userInfo.classList.add('hidden');
    authButtons.classList.remove('hidden');
  }
}

// Enhanced login function with better UX
async function login() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  
  if (!email || !password) {
    showError("Email and password are required!");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("Please enter a valid email address!");
    return;
  }

  isLoading = true;

  try {
    const response = await fetch(`${AI_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    
    if (response.ok) {
      currentUser = result.data?.user || { email };
      
      // Save to localStorage for persistence
      localStorage.setItem('bob_empire_user', JSON.stringify(currentUser));
      
      // Platform-specific user data sync
      if (window.sendToNative) {
        window.sendToNative('USER_LOGIN', currentUser);
      }
      
      showUserInfo(currentUser);
      
      // Platform-specific notifications
      if (window.electronAPI) {
        window.electronAPI.showMessageBox({
          type: 'info',
          title: 'Welcome!',
          message: `Successfully logged in as ${email}`
        });
      } else {
        alert(`✅ Welcome back ${email}!\n\n${result.message}`);
      }
      
      console.log("✅ Login successful:", currentUser);
    } else {
      showError(`Login failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Login failed: Network error. Please check your connection and ensure the server is running.');
  } finally {
    isLoading = false;
  }
}

// Enhanced signup function
async function signup() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password (minimum 6 characters):");
  
  if (!email || !password) {
    showError("Email and password are required!");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("Please enter a valid email address!");
    return;
  }

  // Validate password strength
  if (password.length < 6) {
    showError("Password must be at least 6 characters long!");
    return;
  }

  isLoading = true;

  try {
    const response = await fetch(`${AI_API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    
    if (response.ok) {
      alert(`✅ Account created successfully!\n${result.message}\n\nYou can now log in with your credentials.`);
      console.log("✅ Signup successful");
    } else {
      showError(`Signup failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Signup error:', error);
    showError('Signup failed: Network error. Please check your connection and ensure the server is running.');
  } finally {
    isLoading = false;
  }
}

// Enhanced AI chat with platform-specific features
async function chatWithAI() {
  const message = prompt("Ask Bob Empire AI anything:");
  
  if (!message) {
    showError("Message is required!");
    return;
  }

  try {
    const response = await fetch(`${AI_API_URL}/api/ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        user: currentUser,
        platform: detectPlatform()
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      // Platform-specific response display
      const aiReply = `🤖 Bob Empire AI:\n\n${result.reply}`;
      
      if (window.electronAPI) {
        window.electronAPI.showMessageBox({
          type: 'info',
          title: 'AI Response',
          message: aiReply
        });
      } else if (window.sendToNative) {
        window.sendToNative('SHOW_ALERT', { title: 'AI Response', message: aiReply });
      } else {
        alert(aiReply);
      }
      
      console.log("🤖 AI Response:", result.reply);
      return result.reply;
    } else {
      showError(`AI Error: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('AI error:', error);
    showError('AI service unavailable: Network error. Make sure the server is running.');
    return null;
  }
}

// Enhanced Super AI with more commands
async function runSuperAI(command) {
  if (!command) {
    command = prompt("Enter Super AI command (try: 'help', 'status', 'connect amazon', 'show dashboard'):");
  }
  
  if (!command) {
    showError("Command is required!");
    return;
  }

  try {
    const response = await fetch(`${AI_API_URL}/api/super-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        command,
        user: currentUser,
        platform: detectPlatform()
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      // Special handling for specific commands
      if (command.includes('dashboard')) {
        displayDashboard(result.reply);
      } else if (command.includes('connect all')) {
        displayConnectionResults(result.reply);
      } else {
        // Platform-specific response display
        const superAIReply = `⚡ Super AI:\n\n${result.reply}`;
        
        if (window.electronAPI) {
          window.electronAPI.showMessageBox({
            type: 'info',
            title: 'Super AI Response',
            message: superAIReply
          });
        } else if (window.sendToNative) {
          window.sendToNative('SHOW_ALERT', { title: 'Super AI Response', message: superAIReply });
        } else {
          alert(superAIReply);
        }
      }
      
      console.log("⚡ Super AI Response:", result.reply);
      return result.reply;
    } else {
      showError(`Super AI Error: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('Super AI error:', error);
    showError('Super AI service unavailable: Network error. Make sure the server is running.');
    return null;
  }
}

// Display dashboard information
function displayDashboard(dashboardData) {
  try {
    const data = typeof dashboardData === 'string' ? JSON.parse(dashboardData) : dashboardData;
    const dashboardHTML = `
      📊 DASHBOARD OVERVIEW
      
      📦 Orders: ${data.orders || 'N/A'}
      💰 Revenue: $${data.revenue || 'N/A'}
      🤖 Active Agents: ${data.activeAgents || 'N/A'}
      ⚡ Turbo Mode: ${data.turbo ? 'ON' : 'OFF'}
      📱 Platform: ${detectPlatform().toUpperCase()}
      👤 User: ${currentUser?.email || 'Guest'}
    `;
    
    if (window.electronAPI) {
      window.electronAPI.showMessageBox({
        type: 'info',
        title: 'Bob Empire Dashboard',
        message: dashboardHTML
      });
    } else {
      alert(dashboardHTML);
    }
  } catch (error) {
    alert(`📊 Dashboard: ${dashboardData}`);
  }
}

// Display connection results
function displayConnectionResults(results) {
  const connectionsHTML = `
    🔗 PLATFORM CONNECTIONS
    
    ${results}
    
    Status: All global platforms initialized
    Ready for commerce operations!
  `;
  
  if (window.electronAPI) {
    window.electronAPI.showMessageBox({
      type: 'info',
      title: 'Platform Connections',
      message: connectionsHTML
    });
  } else {
    alert(connectionsHTML);
  }
}

// Enhanced logout function
function logout() {
  currentUser = null;
  localStorage.removeItem('bob_empire_user');
  
  // Platform-specific logout
  if (window.sendToNative) {
    window.sendToNative('USER_LOGOUT');
  }
  
  hideUserInfo();
  
  const message = "✅ Logged out successfully!";
  if (window.electronAPI) {
    window.electronAPI.showMessageBox({
      type: 'info',
      title: 'Logout',
      message: message
    });
  } else {
    alert(message);
  }
  
  console.log("✅ Logout successful");
}

// Auto-login functionality
async function autoLogin() {
  try {
    const savedUser = localStorage.getItem('bob_empire_user');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
      showUserInfo(currentUser);
      console.log("✅ Auto-login successful:", currentUser.email);
    }
  } catch (error) {
    console.error("Auto-login failed:", error);
    localStorage.removeItem('bob_empire_user');
  }
}

// Platform-specific initialization
function initializePlatform() {
  const platform = detectPlatform();
  console.log(`🏗️ Initializing ${platform} platform...`);
  
  // Electron-specific initialization
  if (platform === 'electron' && window.electronAPI) {
    // Listen for menu actions
    window.electronAPI.onMenuAction((event, action) => {
      switch (action) {
        case 'new-project':
          runSuperAI('create new project');
          break;
      }
    });
    
    // Listen for platform actions
    window.electronAPI.onPlatformAction((event, action) => {
      switch (action) {
        case 'connect-amazon':
          runSuperAI('connect amazon');
          break;
        case 'connect-shopify':
          runSuperAI('connect shopify');
          break;
        case 'connect-all':
          runSuperAI('connect all platforms');
          break;
      }
    });
  }
  
  // Mobile-specific initialization
  if (platform === 'mobile') {
    // Add mobile-specific features
    document.body.classList.add('mobile-optimized');
    
    // Handle mobile-specific events
    if (window.sendToNative) {
      console.log("📱 Mobile platform initialized with native bridge");
    }
  }
  
  // Auto-login
  autoLogin();
}

// Make functions available globally
window.login = login;
window.signup = signup;
window.logout = logout;
window.runSuperAI = runSuperAI;
window.chatWithAI = chatWithAI;
window.autoLogin = autoLogin;

// Initialize platform when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePlatform);
} else {
  initializePlatform();
}

// Export for module use
export { 
  login, 
  signup, 
  logout, 
  runSuperAI, 
  chatWithAI, 
  detectPlatform,
  currentUser
};
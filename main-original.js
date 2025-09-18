
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

// Real signup function that connects to backend
async function signup() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password (min 6 characters):");
  
  if (!email || !password) {
    alert("Email and password are required!");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    
    if (response.ok) {
      alert(`✅ ${result.message}\nYou can now login with your credentials.`);
    } else {
      alert(`❌ Signup failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('❌ Signup failed: Network error. Make sure the server is running.');
  }
}

// Super AI function for executing AI commands
async function runSuperAI(command) {
  if (!command) {
    command = prompt("Enter AI command:");
  }
  
  if (!command) {
    alert("Command is required!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/super-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    const result = await response.json();
    
    if (response.ok) {
      alert(`🤖 Super AI Response:\n\n${result.reply}`);
      return result.reply;
    } else {
      alert(`❌ AI Error: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('AI error:', error);
    alert('❌ AI service unavailable: Network error. Make sure the server is running.');
    return null;
  }
}

// Regular AI chat function
async function chatWithAI() {
  const message = prompt("Ask Bob Empire AI anything:");
  
  if (!message) {
    alert("Message is required!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();
    
    if (response.ok) {
      alert(`🤖 Bob Empire AI:\n\n${result.reply}`);
      return result.reply;
    } else {
      alert(`❌ AI Error: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('AI error:', error);
    alert('❌ AI service unavailable: Network error. Make sure the server is running.');
    return null;
  }
}

// Logout function
function logout() {
  currentUser = null;
  alert("✅ Logged out successfully!");
  updateUIAfterLogout();
}

// Update UI after successful login
function updateUIAfterLogin() {
  // Add logout button and AI features
  const loginBtn = document.querySelector('button[onclick="login()"]');
  const signupBtn = document.querySelector('button[onclick="signup()"]');
  
  if (loginBtn) loginBtn.style.display = 'none';
  if (signupBtn) signupBtn.style.display = 'none';
  
  // Add logged-in features
  if (!document.getElementById('loggedInFeatures')) {
    const features = document.createElement('div');
    features.id = 'loggedInFeatures';
    features.innerHTML = `
      <p>✅ Logged in as: ${currentUser?.email || 'User'}</p>
      <button onclick="logout()">Logout</button>
      <button onclick="chatWithAI()">Chat with AI</button>
      <button onclick="runSuperAI()">Run Super AI</button>
    `;
    document.body.appendChild(features);
  }
}

// Update UI after logout
function updateUIAfterLogout() {
  const loginBtn = document.querySelector('button[onclick="login()"]');
  const signupBtn = document.querySelector('button[onclick="signup()"]');
  const features = document.getElementById('loggedInFeatures');
  
  if (loginBtn) loginBtn.style.display = 'inline-block';
  if (signupBtn) signupBtn.style.display = 'inline-block';
  if (features) features.remove();
}

// Make functions available globally
window.login = login;
window.signup = signup;
window.logout = logout;
window.runSuperAI = runSuperAI;
window.chatWithAI = chatWithAI;

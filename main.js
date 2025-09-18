
import { SUPABASE_URL, SUPABASE_ANON_KEY, AI_API_URL } from './config.js';

console.log("Bob Empire initialized");
console.log("Supabase URL:", SUPABASE_URL);

// Authentication state
let currentUser = null;

// Real login function that connects to backend
async function login() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  
  if (!email || !password) {
    alert("Email and password are required!");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    
    if (response.ok) {
      currentUser = result.data?.user || { email };
      alert(`✅ ${result.message}\nWelcome ${email}!`);
      updateUIAfterLogin();
    } else {
      alert(`❌ Login failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('❌ Login failed: Network error. Make sure the server is running.');
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

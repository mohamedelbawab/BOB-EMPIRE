
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { superAI, getDashboard, testSupabaseConnection, AGENTS, CONFIG, loadAgentsFromFile, initializeSupabase } from './BOB_EMPIRE_FINAL.js';

console.log("🚀 Bob Empire initialized");
console.log("🔧 Supabase URL:", SUPABASE_URL);

// Global state
let isLoggedIn = false;
let currentUser = null;

// Initialize the application
async function initializeApp() {
  // Initialize Supabase
  await initializeSupabase();
  
  // Load agents from file
  await loadAgentsFromFile();
  console.log(`📊 Loaded ${AGENTS.length} agents`);
}

// UI Elements
function createUI() {
  const body = document.body;
  body.innerHTML = `
    <div id="app">
      <header class="header">
        <h1>👑 Bob Empire</h1>
        <p>منصة تجارة عالمية يقودها الذكاء الاصطناعي</p>
        <div id="status-bar" class="status-bar">
          <span id="connection-status">🔄 Checking connection...</span>
          <span id="agent-count">Agents: ${AGENTS.length}</span>
          <span id="turbo-status">Turbo: ${CONFIG.turbo ? 'ON' : 'OFF'}</span>
        </div>
      </header>

      <div id="auth-section" class="auth-section">
        <button onclick="login()" class="btn btn-primary">Login</button>
        <button onclick="signup()" class="btn btn-secondary">Sign Up</button>
        <button onclick="guestMode()" class="btn btn-ghost">Continue as Guest</button>
      </div>

      <div id="main-section" class="main-section" style="display: none;">
        <div class="dashboard">
          <div id="dashboard-stats" class="stats-grid">
            <!-- Dashboard stats will be loaded here -->
          </div>
        </div>

        <div class="command-interface">
          <h3>🤖 SuperAI Command Interface</h3>
          <div class="command-input-group">
            <input type="text" id="command-input" placeholder="Enter command (e.g., /help)" class="command-input">
            <button onclick="executeCommand()" class="btn btn-primary">Execute</button>
          </div>
          <div id="command-output" class="command-output">
            Welcome! Type /help to see available commands.
          </div>
        </div>

        <div class="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div class="action-buttons">
            <button onclick="quickCommand('/test-supabase')" class="btn btn-info">Test Supabase</button>
            <button onclick="quickCommand('/connect all')" class="btn btn-success">Connect All Platforms</button>
            <button onclick="quickCommand('/list-agents 5')" class="btn btn-neutral">List Agents</button>
            <button onclick="quickCommand('/status')" class="btn btn-warning">System Status</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Authentication functions
function login() {
  // Simulate login
  isLoggedIn = true;
  currentUser = { email: "demo@bobempire.com", name: "Demo User" };
  showMainInterface();
  showMessage("✅ Logged in successfully!", "success");
}

function signup() {
  // Simulate signup
  showMessage("📧 Signup link sent to your email!", "info");
}

function guestMode() {
  isLoggedIn = false;
  currentUser = { name: "Guest User" };
  showMainInterface();
  showMessage("👋 Welcome, Guest! Limited features available.", "info");
}

// UI Management
function showMainInterface() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('main-section').style.display = 'block';
  loadDashboard();
  initializeConnectionTest();
}

function showMessage(message, type = 'info') {
  const output = document.getElementById('command-output');
  const timestamp = new Date().toLocaleTimeString();
  const colorClass = type === 'success' ? 'text-green' : 
                    type === 'error' ? 'text-red' : 
                    type === 'warning' ? 'text-yellow' : 'text-blue';
  
  output.innerHTML += `<div class="${colorClass}">[${timestamp}] ${message}</div>`;
  output.scrollTop = output.scrollHeight;
}

// Command execution
async function executeCommand() {
  const input = document.getElementById('command-input');
  const command = input.value.trim();
  if (!command) return;

  showMessage(`> ${command}`, 'info');
  input.value = '';

  try {
    const result = await superAI(command);
    showMessage(result, 'success');
  } catch (error) {
    showMessage(`❌ Error: ${error.message}`, 'error');
  }
}

async function quickCommand(command) {
  document.getElementById('command-input').value = command;
  await executeCommand();
}

// Dashboard functions
async function loadDashboard() {
  try {
    const dashboard = await getDashboard();
    const statsGrid = document.getElementById('dashboard-stats');
    statsGrid.innerHTML = `
      <div class="stat-card">
        <h4>📦 Orders</h4>
        <span class="stat-value">${dashboard.orders}</span>
      </div>
      <div class="stat-card">
        <h4>💰 Revenue</h4>
        <span class="stat-value">$${dashboard.revenue}</span>
      </div>
      <div class="stat-card">
        <h4>🤖 Active Agents</h4>
        <span class="stat-value">${dashboard.activeAgents}</span>
      </div>
      <div class="stat-card">
        <h4>⚡ Turbo Mode</h4>
        <span class="stat-value">${dashboard.turbo ? 'ON' : 'OFF'}</span>
      </div>
    `;
  } catch (error) {
    showMessage(`❌ Failed to load dashboard: ${error.message}`, 'error');
  }
}

// Connection testing
async function initializeConnectionTest() {
  const statusEl = document.getElementById('connection-status');
  statusEl.textContent = '🔄 Testing connection...';
  
  try {
    const result = await testSupabaseConnection();
    if (result.includes('✅')) {
      statusEl.textContent = '✅ Connected';
      statusEl.className = 'status-connected';
    } else {
      statusEl.textContent = '⚠️ Connection issues';
      statusEl.className = 'status-warning';
    }
    showMessage(result, result.includes('✅') ? 'success' : 'warning');
  } catch (error) {
    statusEl.textContent = '❌ Offline';
    statusEl.className = 'status-error';
    showMessage(`❌ Connection test failed: ${error.message}`, 'error');
  }
}

// Keyboard support
document.addEventListener('DOMContentLoaded', async function() {
  await initializeApp();
  createUI();
  
  // Enter key support for command input
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement.id === 'command-input') {
      executeCommand();
    }
  });
});

// Export functions to global scope for HTML onclick handlers
window.login = login;
window.signup = signup;
window.guestMode = guestMode;
window.executeCommand = executeCommand;
window.quickCommand = quickCommand;

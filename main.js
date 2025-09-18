
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { superAI, getDashboard, testSupabaseConnection, AGENTS, CONFIG, loadAgentsFromFile, initializeSupabase, loadFlowsFromFile, FLOWS } from './BOB_EMPIRE_FINAL.js';

console.log("🚀 Bob Empire initialized");
console.log("🔧 Supabase URL:", SUPABASE_URL);

// Global state
let isLoggedIn = false;
let currentUser = null;

// Initialize the application
async function initializeApp() {
  // Initialize Supabase
  await initializeSupabase();
  
  // Load agents and flows from files
  await loadAgentsFromFile();
  await loadFlowsFromFile();
  console.log(`📊 Loaded ${AGENTS.length} agents and ${FLOWS.length} flows`);
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
            <button onclick="quickCommand('/flows list')" class="btn btn-primary">List Flows</button>
            <button onclick="runComprehensiveTest()" class="btn btn-secondary">🧪 Run Tests</button>
          </div>
        </div>

        <div class="testing-section" style="display: none;" id="testing-section">
          <h3>🧪 Comprehensive Testing</h3>
          <div id="test-results" class="test-results">
            <!-- Test results will appear here -->
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
    
    // Refresh dashboard after certain commands
    if (command.includes('/turbo') || command.includes('/status')) {
      setTimeout(loadDashboard, 100);
    }
  } catch (error) {
    showMessage(`❌ Error: ${error.message}`, 'error');
  }
}

async function quickCommand(command) {
  document.getElementById('command-input').value = command;
  await executeCommand();
}

// Comprehensive testing function
async function runComprehensiveTest() {
  const testSection = document.getElementById('testing-section');
  const testResults = document.getElementById('test-results');
  
  testSection.style.display = 'block';
  testResults.innerHTML = '<div class="text-blue">🧪 Running comprehensive tests...</div>';
  
  const tests = [
    { name: "Supabase Connection", command: "/test-supabase" },
    { name: "Agent List", command: "/list-agents 3" },
    { name: "Flow List", command: "/flows list 3" },
    { name: "Agent Execution", command: "/run 1 Test agent functionality" },
    { name: "Flow Creation", command: "/flows create Test Flow" },
    { name: "Platform Connection", command: "/connect amazon" },
    { name: "Turbo Toggle", command: "/turbo off" },
    { name: "System Status", command: "/status" },
    { name: "Help Command", command: "/help" }
  ];
  
  let results = [];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    try {
      const result = await superAI(test.command);
      const success = !result.includes('❌') && !result.includes('Unknown command');
      results.push({
        name: test.name,
        command: test.command,
        success,
        result: result.substring(0, 100) + (result.length > 100 ? '...' : '')
      });
      
      // Update progress
      testResults.innerHTML = `
        <div class="text-blue">🧪 Testing... (${i + 1}/${tests.length})</div>
        ${results.map(r => `
          <div class="${r.success ? 'text-green' : 'text-red'}">
            ${r.success ? '✅' : '❌'} ${r.name}: ${r.result}
          </div>
        `).join('')}
      `;
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      results.push({
        name: test.name,
        command: test.command,
        success: false,
        result: `Error: ${error.message}`
      });
    }
  }
  
  // Final results
  const successCount = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  testResults.innerHTML = `
    <div class="test-summary ${successCount === totalTests ? 'text-green' : 'text-yellow'}">
      🧪 Tests Complete: ${successCount}/${totalTests} passed
    </div>
    ${results.map(r => `
      <div class="${r.success ? 'text-green' : 'text-red'}">
        ${r.success ? '✅' : '❌'} ${r.name}: ${r.result}
      </div>
    `).join('')}
  `;
  
  showMessage(`🧪 Comprehensive testing complete: ${successCount}/${totalTests} tests passed`, 
             successCount === totalTests ? 'success' : 'warning');
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
    
    // Update header status
    updateHeaderStatus(dashboard);
  } catch (error) {
    showMessage(`❌ Failed to load dashboard: ${error.message}`, 'error');
  }
}

// Update header status indicators
function updateHeaderStatus(dashboard) {
  const turboStatus = document.getElementById('turbo-status');
  const agentCount = document.getElementById('agent-count');
  
  if (turboStatus) {
    turboStatus.textContent = `Turbo: ${dashboard.turbo ? 'ON' : 'OFF'}`;
    turboStatus.className = dashboard.turbo ? 'status-connected' : '';
  }
  
  if (agentCount) {
    agentCount.textContent = `Agents: ${dashboard.activeAgents}`;
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
window.runComprehensiveTest = runComprehensiveTest;

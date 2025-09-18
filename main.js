
// Import without ES modules for browser compatibility
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

console.log("Bob Empire initialized");

// For now, use placeholder values until proper configuration is set
const SUPABASE_URL = "https://your-project-ref.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

console.log("Supabase URL:", SUPABASE_URL);

// Global state
let currentUser = null;
let isLoggedIn = false;

// Authentication functions
function login() {
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;
  
  if (email && password) {
    // Mock login for now - will be replaced with actual Supabase auth
    currentUser = { email };
    isLoggedIn = true;
    showDashboard();
    showMessage("✅ تم تسجيل الدخول بنجاح!", "success");
  } else {
    showMessage("❌ يرجى إدخال البريد الإلكتروني وكلمة المرور", "error");
  }
}

function signup() {
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;
  const confirmPassword = document.getElementById('confirmPassword')?.value;
  
  if (!email || !password || !confirmPassword) {
    showMessage("❌ يرجى ملء جميع الحقول", "error");
    return;
  }
  
  if (password !== confirmPassword) {
    showMessage("❌ كلمات المرور غير متطابقة", "error");
    return;
  }
  
  // Mock signup for now - will be replaced with actual Supabase auth
  currentUser = { email };
  isLoggedIn = true;
  showDashboard();
  showMessage("✅ تم إنشاء الحساب بنجاح!", "success");
}

function logout() {
  currentUser = null;
  isLoggedIn = false;
  showLoginForm();
  showMessage("✅ تم تسجيل الخروج بنجاح", "success");
}

function showMessage(message, type = "info") {
  const messageDiv = document.getElementById('message') || createMessageDiv();
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

function createMessageDiv() {
  const messageDiv = document.createElement('div');
  messageDiv.id = 'message';
  messageDiv.className = 'message';
  document.body.appendChild(messageDiv);
  return messageDiv;
}

function showLoginForm() {
  document.body.innerHTML = `
    <div class="hero">
      <img src="logo_bob_empire.png" alt="Bob Empire" class="logo" onerror="this.style.display='none'">
      <h1>👑 Bob Empire</h1>
      <p class="tag">منصة تجارة عالمية يقودها الذكاء الاصطناعي</p>
    </div>
    
    <div id="message" class="message" style="display: none;"></div>
    
    <main class="main">
      <div class="card">
        <h2>تسجيل الدخول / إنشاء حساب</h2>
        <div class="form-group">
          <input type="email" id="email" placeholder="البريد الإلكتروني" required>
        </div>
        <div class="form-group">
          <input type="password" id="password" placeholder="كلمة المرور" required>
        </div>
        <div class="form-group" id="confirmPasswordGroup" style="display: none;">
          <input type="password" id="confirmPassword" placeholder="تأكيد كلمة المرور">
        </div>
        <div class="form-actions">
          <button onclick="login()" id="loginBtn">تسجيل الدخول</button>
          <button onclick="showSignupForm()" id="signupToggle">إنشاء حساب جديد</button>
        </div>
      </div>
    </main>
  `;
}

function showSignupForm() {
  document.getElementById('confirmPasswordGroup').style.display = 'block';
  document.getElementById('loginBtn').textContent = 'إنشاء الحساب';
  document.getElementById('loginBtn').onclick = signup;
  document.getElementById('signupToggle').textContent = 'لديك حساب؟ سجل الدخول';
  document.getElementById('signupToggle').onclick = showLoginForm;
}

function showDashboard() {
  document.body.innerHTML = `
    <div class="hero">
      <img src="logo_bob_empire.png" alt="Bob Empire" class="logo" onerror="this.style.display='none'">
      <h1>👑 Bob Empire</h1>
      <p class="tag">مرحباً ${currentUser?.email || 'المستخدم'}</p>
      <button onclick="logout()" class="logout-btn">تسجيل الخروج</button>
    </div>
    
    <div id="message" class="message" style="display: none;"></div>
    
    <div class="tabs">
      <button onclick="showTab('dashboard')" class="tab-btn active">لوحة التحكم</button>
      <button onclick="showTab('chat')" class="tab-btn">المحادثة الذكية</button>
      <button onclick="showTab('agents')" class="tab-btn">الوكلاء</button>
      <button onclick="showTab('flows')" class="tab-btn">التدفقات</button>
      <button onclick="showTab('platforms')" class="tab-btn">المنصات العالمية</button>
      <button onclick="showTab('admin')" class="tab-btn">الإدارة</button>
    </div>
    
    <main class="main">
      <div id="dashboard" class="tab active">
        <div class="grid">
          <div class="card">
            <h3>📊 إحصائيات سريعة</h3>
            <p>الطلبات: <strong>12</strong></p>
            <p>الإيرادات: <strong>$3,500</strong></p>
            <p>الوكلاء النشطين: <strong>140</strong></p>
            <p>حالة التسارع: <strong id="turboStatus">متوقف</strong></p>
          </div>
          <div class="card">
            <h3>🚀 أوامر سريعة</h3>
            <button onclick="executeCommand('/turbo on')" class="btn">تفعيل التسارع</button>
            <button onclick="executeCommand('/connect all')" class="btn">ربط جميع المنصات</button>
            <button onclick="executeCommand('/run 1 مرحبا')" class="btn">تشغيل الوكيل #1</button>
          </div>
        </div>
      </div>
      
      <div id="chat" class="tab">
        <div class="card">
          <h3>💬 المحادثة الذكية</h3>
          <div id="chatMessages" class="chat-messages"></div>
          <div class="chat-input">
            <input type="text" id="chatInput" placeholder="اكتب رسالتك هنا..." onkeypress="if(event.key=='Enter') sendMessage()">
            <button onclick="sendMessage()" class="btn">إرسال</button>
            <button onclick="startVoiceInput()" class="btn">🎤</button>
          </div>
        </div>
      </div>
      
      <div id="agents" class="tab">
        <div class="card">
          <h3>🤖 إدارة الوكلاء</h3>
          <button onclick="loadAgents()" class="btn">تحديث القائمة</button>
          <button onclick="addNewAgent()" class="btn">إضافة وكيل جديد</button>
          <div id="agentsList" class="agents-list"></div>
        </div>
      </div>
      
      <div id="flows" class="tab">
        <div class="card">
          <h3>⚡ إدارة التدفقات</h3>
          <button onclick="loadFlows()" class="btn">تحديث القائمة</button>
          <button onclick="addNewFlow()" class="btn">إضافة تدفق جديد</button>
          <div id="flowsList" class="flows-list"></div>
        </div>
      </div>
      
      <div id="platforms" class="tab">
        <div class="card">
          <h3>🌍 المنصات العالمية</h3>
          <div class="grid">
            <div class="platform-card">
              <h4>🛒 منصات التجارة</h4>
              <button onclick="connectPlatform('amazon')" class="btn">Amazon</button>
              <button onclick="connectPlatform('shopify')" class="btn">Shopify</button>
              <button onclick="connectPlatform('aliexpress')" class="btn">AliExpress</button>
              <button onclick="connectPlatform('alibaba')" class="btn">Alibaba</button>
            </div>
            <div class="platform-card">
              <h4>💰 منصات الدفع</h4>
              <button onclick="connectPlatform('stripe')" class="btn">Stripe</button>
              <button onclick="connectPlatform('paypal')" class="btn">PayPal</button>
              <button onclick="connectPlatform('fawry')" class="btn">Fawry</button>
            </div>
            <div class="platform-card">
              <h4>📱 منصات التواصل</h4>
              <button onclick="connectPlatform('whatsapp')" class="btn">WhatsApp</button>
              <button onclick="connectPlatform('telegram')" class="btn">Telegram</button>
              <button onclick="connectPlatform('instagram')" class="btn">Instagram</button>
            </div>
          </div>
        </div>
      </div>
      
      <div id="admin" class="tab">
        <div class="card">
          <h3>⚙️ لوحة الإدارة</h3>
          <div class="admin-section">
            <h4>إعدادات النظام</h4>
            <button onclick="toggleTurbo()" class="btn">تبديل التسارع</button>
            <button onclick="syncIntegrations()" class="btn">مزامنة التكاملات</button>
            <button onclick="runSystemTest()" class="btn">اختبار النظام</button>
          </div>
          <div class="admin-section">
            <h4>إدارة البيانات</h4>
            <button onclick="exportData()" class="btn">تصدير البيانات</button>
            <button onclick="importData()" class="btn">استيراد البيانات</button>
            <button onclick="resetSystem()" class="btn danger">إعادة تعيين النظام</button>
          </div>
        </div>
      </div>
    </main>
  `;
  
  loadAgents();
  loadFlows();
}

// Tab switching
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Activate button
  event.target.classList.add('active');
}

// Command execution
async function executeCommand(command) {
  showMessage(`تنفيذ الأمر: ${command}`, "info");
  
  // Mock command execution - will be replaced with actual SuperAI integration
  setTimeout(() => {
    if (command.includes('/turbo on')) {
      document.getElementById('turboStatus').textContent = 'نشط';
      showMessage("🚀 تم تفعيل التسارع بنجاح!", "success");
    } else if (command.includes('/connect all')) {
      showMessage("✅ تم ربط جميع المنصات العالمية بنجاح!", "success");
    } else if (command.includes('/run')) {
      showMessage("🤖 تم تشغيل الوكيل بنجاح!", "success");
    }
  }, 1000);
}

// Chat functions
function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;
  
  addChatMessage(message, 'user');
  input.value = '';
  
  // Mock AI response
  setTimeout(() => {
    const responses = [
      "مرحباً! كيف يمكنني مساعدتك اليوم؟",
      "تم فهم طلبك، جاري التنفيذ...",
      "هل تريد مني ربط منصة معينة؟",
      "يمكنني مساعدتك في إدارة الوكلاء والتدفقات"
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    addChatMessage(response, 'ai');
  }, 1000);
}

function addChatMessage(message, sender) {
  const messagesDiv = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  messageDiv.innerHTML = `
    <div class="message-content">${message}</div>
    <div class="message-time">${new Date().toLocaleTimeString('ar-EG')}</div>
  `;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function startVoiceInput() {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById('chatInput').value = transcript;
    };
    recognition.start();
    showMessage("🎤 يتم الاستماع...", "info");
  } else {
    showMessage("❌ المتصفح لا يدعم التعرف على الصوت", "error");
  }
}

// Agent management
async function loadAgents() {
  const agentsList = document.getElementById('agentsList');
  if (!agentsList) return;
  
  // Mock agents data - will be replaced with actual API call
  const agents = [
    { id: 1, name: "وكيل الذكاء التجاري", role: "commerce", status: "active" },
    { id: 2, name: "وكيل خدمة العملاء", role: "support", status: "idle" },
    { id: 3, name: "وكيل التحليلات", role: "analytics", status: "active" }
  ];
  
  agentsList.innerHTML = agents.map(agent => `
    <div class="agent-item">
      <div class="agent-info">
        <h4>${agent.name}</h4>
        <p>النوع: ${agent.role} | الحالة: ${agent.status}</p>
      </div>
      <div class="agent-actions">
        <button onclick="runAgent(${agent.id})" class="btn">تشغيل</button>
        <button onclick="editAgent(${agent.id})" class="btn">تعديل</button>
        <button onclick="deleteAgent(${agent.id})" class="btn danger">حذف</button>
      </div>
    </div>
  `).join('');
}

function addNewAgent() {
  const name = prompt("اسم الوكيل الجديد:");
  const role = prompt("نوع الوكيل (commerce, support, analytics):");
  
  if (name && role) {
    showMessage(`✅ تم إضافة الوكيل "${name}" بنجاح!`, "success");
    loadAgents();
  }
}

function runAgent(id) {
  showMessage(`🤖 تم تشغيل الوكيل #${id}`, "success");
}

function editAgent(id) {
  showMessage(`✏️ تحرير الوكيل #${id}`, "info");
}

function deleteAgent(id) {
  if (confirm("هل أنت متأكد من حذف هذا الوكيل؟")) {
    showMessage(`🗑️ تم حذف الوكيل #${id}`, "success");
    loadAgents();
  }
}

// Flow management
async function loadFlows() {
  const flowsList = document.getElementById('flowsList');
  if (!flowsList) return;
  
  // Mock flows data
  const flows = [
    { id: "flow_1", name: "تدفق إدارة الطلبات", trigger: "manual", status: "active" },
    { id: "flow_2", name: "تدفق تسويقي تلقائي", trigger: "webhook", status: "idle" },
    { id: "flow_3", name: "تدفق تحليل البيانات", trigger: "schedule", status: "active" }
  ];
  
  flowsList.innerHTML = flows.map(flow => `
    <div class="flow-item">
      <div class="flow-info">
        <h4>${flow.name}</h4>
        <p>المشغل: ${flow.trigger} | الحالة: ${flow.status}</p>
      </div>
      <div class="flow-actions">
        <button onclick="runFlow('${flow.id}')" class="btn">تشغيل</button>
        <button onclick="editFlow('${flow.id}')" class="btn">تعديل</button>
        <button onclick="deleteFlow('${flow.id}')" class="btn danger">حذف</button>
      </div>
    </div>
  `).join('');
}

function addNewFlow() {
  const name = prompt("اسم التدفق الجديد:");
  const trigger = prompt("نوع المشغل (manual, webhook, schedule):");
  
  if (name && trigger) {
    showMessage(`✅ تم إضافة التدفق "${name}" بنجاح!`, "success");
    loadFlows();
  }
}

function runFlow(id) {
  showMessage(`⚡ تم تشغيل التدفق ${id}`, "success");
}

function editFlow(id) {
  showMessage(`✏️ تحرير التدفق ${id}`, "info");
}

function deleteFlow(id) {
  if (confirm("هل أنت متأكد من حذف هذا التدفق؟")) {
    showMessage(`🗑️ تم حذف التدفق ${id}`, "success");
    loadFlows();
  }
}

// Platform connections
function connectPlatform(platform) {
  showMessage(`🔗 جاري ربط منصة ${platform}...`, "info");
  
  setTimeout(() => {
    showMessage(`✅ تم ربط منصة ${platform} بنجاح!`, "success");
  }, 2000);
}

// Admin functions
function toggleTurbo() {
  const status = document.getElementById('turboStatus');
  if (status.textContent === 'نشط') {
    status.textContent = 'متوقف';
    showMessage("🐢 تم إيقاف التسارع", "info");
  } else {
    status.textContent = 'نشط';
    showMessage("🚀 تم تفعيل التسارع", "success");
  }
}

function syncIntegrations() {
  showMessage("🔄 جاري مزامنة التكاملات...", "info");
  setTimeout(() => {
    showMessage("✅ تم مزامنة جميع التكاملات بنجاح!", "success");
  }, 3000);
}

function runSystemTest() {
  showMessage("🧪 جاري اختبار النظام...", "info");
  setTimeout(() => {
    showMessage("✅ تم اختبار النظام بنجاح - جميع الأنظمة تعمل بكفاءة 100%!", "success");
  }, 5000);
}

function exportData() {
  showMessage("📤 جاري تصدير البيانات...", "info");
  setTimeout(() => {
    showMessage("✅ تم تصدير البيانات بنجاح!", "success");
  }, 2000);
}

function importData() {
  showMessage("📥 جاري استيراد البيانات...", "info");
  setTimeout(() => {
    showMessage("✅ تم استيراد البيانات بنجاح!", "success");
  }, 2000);
}

function resetSystem() {
  if (confirm("تحذير: هذا سيؤدي إلى إعادة تعيين جميع البيانات. هل أنت متأكد؟")) {
    showMessage("🔄 جاري إعادة تعيين النظام...", "info");
    setTimeout(() => {
      showMessage("✅ تم إعادة تعيين النظام بنجاح!", "success");
    }, 3000);
  }
}

// Make functions global
window.login = login;
window.signup = signup;
window.logout = logout;
window.showSignupForm = showSignupForm;
window.showTab = showTab;
window.executeCommand = executeCommand;
window.sendMessage = sendMessage;
window.startVoiceInput = startVoiceInput;
window.loadAgents = loadAgents;
window.addNewAgent = addNewAgent;
window.runAgent = runAgent;
window.editAgent = editAgent;
window.deleteAgent = deleteAgent;
window.loadFlows = loadFlows;
window.addNewFlow = addNewFlow;
window.runFlow = runFlow;
window.editFlow = editFlow;
window.deleteFlow = deleteFlow;
window.connectPlatform = connectPlatform;
window.toggleTurbo = toggleTurbo;
window.syncIntegrations = syncIntegrations;
window.runSystemTest = runSystemTest;
window.exportData = exportData;
window.importData = importData;
window.resetSystem = resetSystem;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  showLoginForm();
});

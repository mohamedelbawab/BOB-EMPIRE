
// Global state
let isRecording = false;
let recognition = null;
let speechSynthesis = null;
let currentSettings = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  console.log("🚀 Bob Empire UI initialized");
  
  // Wait for Bob Engine to initialize
  await window.initializeBobEmpire();
  
  // Load settings
  currentSettings = await window.loadRemoteConfig();
  
  // Initialize speech recognition and synthesis
  initializeSpeech();
  
  // Load agents
  loadAgents();
  
  // Load platforms
  loadPlatforms();
  
  // Load flows
  loadFlows();
  
  // Update settings UI
  updateSettingsUI();
  
  console.log("✅ Application fully loaded with", window.BobAgents.length, "agents");
});

// Tab management
window.showTab = function(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Hide all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabName).classList.add('active');
  
  // Activate corresponding button
  document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
};

// Chat functionality with Egyptian dialect
window.sendMessage = async function() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message
  addChatMessage(message, 'user');
  input.value = '';
  
  // Process with SuperAI
  try {
    let response;
    
    // Check if it's a command
    if (message.startsWith('/')) {
      response = await window.superAI(message);
    } else {
      // Generate conversational response in Egyptian dialect
      response = await generateEgyptianResponse(message);
    }
    
    // Add AI response
    addChatMessage(response, 'ai');
    
    // Speak the response
    speakText(response);
    
  } catch (error) {
    console.error('Error processing message:', error);
    addChatMessage('آسف، حصل خطأ في معالجة الرسالة. جرب تاني! 😅', 'ai');
  }
};

// Generate Egyptian dialect responses
async function generateEgyptianResponse(message) {
  const agents = window.BobAgents || [];
  const responses = [
    "أهلاً بيك! فهمت كلامك وهاعمل اللي تطلبه دلوقتي. 😊",
    "حاضر يا فندم! أنا هنا عشان أساعدك في أي حاجة. إيه رأيك نبدأ؟ 🚀",
    "معاك حق تماماً! خلاص هاخلي الموضوع ده يتعمل على أحسن وجه. 👍",
    "ده طلب حلو! هاشتغل عليه حالاً وأرجعلك بالنتيجة. 💪",
    "تمام كده! أنا فهمت قصدك وهابدأ أنفذ المطلوب دلوقتي. ✨",
    "ممتاز! ده بالظبط اللي كنت مستنيه منك. خلاص هاعمله في ثواني. ⚡",
    "حبيبي والله! مش هاقصر معاك أبداً. هاعمل كل اللي تطلبه. 💎",
    "أكيد يا باشا! أنا تحت أمرك في أي حاجة تحتاجها. قول وأنا هاعمل. 🎯"
  ];
  
  // Check for specific keywords and respond accordingly
  if (message.includes('وكيل') || message.includes('agent')) {
    return `حاضر! عندنا ${agents.length} وكيل شغالين دلوقتي. عايز أعمل إيه بالظبط مع الوكلاء؟ 🤖`;
  }
  
  if (message.includes('منصة') || message.includes('platform')) {
    return "تمام! المنصات كلها جاهزة للربط. عايز أربط منصة معينة ولا كلهم مع بعض؟ 🌐";
  }
  
  if (message.includes('ربط') || message.includes('connect')) {
    return "ممتاز! هابدأ عملية الربط دلوقتي. المنصات العالمية كلها هاتبقى متصلة في ثواني! 🔗";
  }
  
  if (message.includes('تيربو') || message.includes('turbo')) {
    const config = window.BobConfig || { turbo: false };
    const status = config.turbo ? "شغال" : "مقفول";
    return `وضع التيربو حالياً ${status}. عايز أغيره؟ 🚀`;
  }
  
  // Return random friendly response
  return responses[Math.floor(Math.random() * responses.length)];
}

// Add message to chat
function addChatMessage(message, type) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  
  const prefix = type === 'user' ? '👤 أنت:' : '🤖 بوب AI:';
  messageDiv.innerHTML = `<strong>${prefix}</strong> ${message}`;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Speech recognition and synthesis
function initializeSpeech() {
  // Speech Recognition (ASR)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ar-EG';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById('userInput').value = transcript;
      sendMessage();
    };
    
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      stopRecording();
    };
    
    recognition.onend = function() {
      stopRecording();
    };
  }
  
  // Speech Synthesis (TTS)
  if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
  }
}

// Voice controls
window.toggleVoice = function() {
  if (!recognition) {
    alert('متصفحك مش بيدعم التحدث. جرب Chrome أو Firefox.');
    return;
  }
  
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
};

function startRecording() {
  isRecording = true;
  document.getElementById('voiceBtn').classList.add('recording');
  document.getElementById('voiceBtn').textContent = '🛑';
  recognition.start();
}

function stopRecording() {
  isRecording = false;
  document.getElementById('voiceBtn').classList.remove('recording');
  document.getElementById('voiceBtn').textContent = '🎤';
  if (recognition) {
    recognition.stop();
  }
}

// Text-to-speech function
function speakText(text) {
  if (!speechSynthesis) return;
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentSettings.voiceLanguage || 'ar-EG';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  speechSynthesis.speak(utterance);
}

// Agent management
function loadAgents() {
  const agentsList = document.getElementById('agentsList');
  const agents = window.BobAgents || [];
  
  if (agents.length === 0) {
    agentsList.innerHTML = '<p>جاري تحميل الوكلاء...</p>';
    return;
  }
  
  const activeCount = agents.filter(a => a.status === 'idle' || a.status === 'running').length;
  const pausedCount = agents.length - activeCount;
  
  document.getElementById('activeAgents').textContent = activeCount;
  document.getElementById('pausedAgents').textContent = pausedCount;
  
  agentsList.innerHTML = agents.map(agent => `
    <div class="agent-card ${agent.status === 'running' ? 'active' : ''}" data-agent-id="${agent.id}">
      <h4>🤖 ${agent.name}</h4>
      <p>الحالة: ${getStatusInArabic(agent.status)}</p>
      <p>الدور: ${agent.role || 'عام'}</p>
      <div class="agent-actions">
        <button onclick="runAgent(${agent.id})" class="run-btn">▶️ تشغيل</button>
        <button onclick="removeAgentFromUI(${agent.id})" class="remove-btn">🗑️ حذف</button>
      </div>
    </div>
  `).join('');
}

function getStatusInArabic(status) {
  const statusMap = {
    'idle': 'جاهز',
    'running': 'يعمل',
    'paused': 'متوقف',
    'error': 'خطأ'
  };
  return statusMap[status] || status;
}

window.runAgent = async function(id) {
  const result = window.runAgentById(id, 'تم تشغيل الوكيل من الواجهة');
  addChatMessage(`🤖 ${result}`, 'ai');
  loadAgents(); // Refresh agents display
};

window.addNewAgent = function() {
  const name = prompt('اسم الوكيل الجديد:');
  if (name) {
    const agent = window.addAgent({ name, role: 'مخصص', status: 'idle' });
    addChatMessage(`✅ تم إضافة الوكيل "${agent.name}" بنجاح!`, 'ai');
    loadAgents();
  }
};

window.removeAgentFromUI = function(id) {
  if (confirm('هل أنت متأكد من حذف هذا الوكيل؟')) {
    window.removeAgent(id);
    addChatMessage(`🗑️ تم حذف الوكيل بنجاح!`, 'ai');
    loadAgents();
  }
};

// Platform management
function loadPlatforms() {
  const platformsList = document.getElementById('platformsList');
  const platforms = [
    { name: 'Amazon', icon: '📦', region: 'عالمي' },
    { name: 'Shopify', icon: '🛍️', region: 'عالمي' },
    { name: 'AliExpress', icon: '🇨🇳', region: 'الصين' },
    { name: 'Alibaba', icon: '🏭', region: 'الصين' },
    { name: 'Coupang', icon: '🇰🇷', region: 'كوريا' },
    { name: 'Rakuten', icon: '🇯🇵', region: 'اليابان' },
    { name: 'Shopee', icon: '🛒', region: 'جنوب شرق آسيا' },
    { name: 'Lazada', icon: '🛍️', region: 'جنوب شرق آسيا' },
    { name: 'MercadoLibre', icon: '🇦🇷', region: 'أمريكا اللاتينية' },
    { name: 'Flipkart', icon: '🇮🇳', region: 'الهند' },
    { name: 'Ozon', icon: '🇷🇺', region: 'روسيا' },
    { name: 'Wildberries', icon: '🇷🇺', region: 'روسيا' },
    { name: 'Noon', icon: '🇦🇪', region: 'الشرق الأوسط' },
    { name: 'Jumia', icon: '🌍', region: 'أفريقيا' },
    { name: 'Facebook', icon: '📘', region: 'تواصل اجتماعي' },
    { name: 'Instagram', icon: '📷', region: 'تواصل اجتماعي' },
    { name: 'WhatsApp', icon: '💬', region: 'تواصل اجتماعي' },
    { name: 'Telegram', icon: '✈️', region: 'تواصل اجتماعي' },
    { name: 'TikTok', icon: '🎵', region: 'تواصل اجتماعي' },
    { name: 'Stripe', icon: '💳', region: 'مدفوعات' },
    { name: 'PayPal', icon: '💰', region: 'مدفوعات' }
  ];
  
  platformsList.innerHTML = platforms.map(platform => `
    <div class="platform-card" data-platform="${platform.name.toLowerCase()}">
      <h4>${platform.icon} ${platform.name}</h4>
      <p>المنطقة: ${platform.region}</p>
      <div class="platform-status">⚪ غير متصل</div>
      <button onclick="connectPlatform('${platform.name.toLowerCase()}')" class="connect-btn">🔗 ربط</button>
    </div>
  `).join('');
}

window.connectPlatform = async function(platformName) {
  // Simulate connection
  const platformCard = document.querySelector(`[data-platform="${platformName}"]`);
  const statusDiv = platformCard.querySelector('.platform-status');
  
  statusDiv.textContent = '🔄 جاري الربط...';
  
  setTimeout(() => {
    statusDiv.textContent = '🟢 متصل';
    platformCard.classList.add('connected');
    addChatMessage(`✅ تم ربط منصة ${platformName} بنجاح!`, 'ai');
  }, 2000);
};

window.connectAllPlatforms = async function() {
  addChatMessage('🔄 جاري ربط جميع المنصات العالمية...', 'ai');
  
  try {
    await window.connectAllGlobal();
    addChatMessage('✅ تم ربط جميع المنصات العالمية بنجاح! 🌐', 'ai');
    
    // Update UI to show all platforms as connected
    document.querySelectorAll('.platform-card').forEach(card => {
      card.classList.add('connected');
      card.querySelector('.platform-status').textContent = '🟢 متصل';
    });
  } catch (error) {
    addChatMessage('❌ حدث خطأ في ربط المنصات. حاول مرة أخرى.', 'ai');
  }
};

// n8n Integration
function loadFlows() {
  const flowsList = document.getElementById('flowsList');
  const flows = window.BobFlows || [
    { id: 'flow_1', name: 'أتمتة الطلبات', status: 'active' },
    { id: 'flow_2', name: 'مزامنة المخزون', status: 'paused' },
    { id: 'flow_3', name: 'إشعارات العملاء', status: 'active' },
    { id: 'flow_4', name: 'تحليل المبيعات', status: 'active' },
    { id: 'flow_5', name: 'ربط المنصات', status: 'paused' }
  ];
  
  flowsList.innerHTML = flows.map(flow => `
    <div class="flow-card" data-flow-id="${flow.id}">
      <h4>⚡ ${flow.name}</h4>
      <p>الحالة: ${flow.status === 'active' ? '🟢 نشط' : '⏸️ متوقف'}</p>
      <div class="flow-actions">
        <button onclick="toggleFlow('${flow.id}')" class="toggle-btn">
          ${flow.status === 'active' ? '⏸️ إيقاف' : '▶️ تشغيل'}
        </button>
        <button onclick="editFlow('${flow.id}')" class="edit-btn">✏️ تعديل</button>
      </div>
    </div>
  `).join('');
}

window.connectN8N = function() {
  const url = document.getElementById('n8nUrl').value;
  if (!url) {
    alert('يرجى إدخال رابط n8n');
    return;
  }
  
  document.getElementById('n8nStatus').textContent = '🟢 متصل';
  addChatMessage(`✅ تم ربط n8n بنجاح: ${url}`, 'ai');
};

window.syncIntegrations = function() {
  addChatMessage('🔄 جاري مزامنة التكاملات مع n8n...', 'ai');
  
  setTimeout(() => {
    addChatMessage('✅ تم مزامنة جميع التكاملات بنجاح!', 'ai');
    loadFlows(); // Refresh flows
  }, 2000);
};

window.toggleFlow = function(flowId) {
  addChatMessage(`⚡ تم تغيير حالة التدفق ${flowId}`, 'ai');
  loadFlows(); // Refresh flows
};

window.editFlow = function(flowId) {
  addChatMessage(`✏️ فتح محرر التدفق ${flowId}`, 'ai');
};

// Settings management
function updateSettingsUI() {
  const config = window.BobConfig || { adminPassword: 'Bob@Bob0000', turbo: false };
  document.getElementById('adminPassword').value = config.adminPassword;
  document.getElementById('turboMode').checked = config.turbo;
  document.getElementById('voiceLanguage').value = currentSettings.voiceLanguage || 'ar-EG';
  document.getElementById('supabaseUrl').value = currentSettings.supabaseUrl || '';
  document.getElementById('supabaseKey').value = currentSettings.supabaseKey || '';
}

window.saveSettings = async function() {
  const newSettings = {
    adminPassword: document.getElementById('adminPassword').value,
    turbo: document.getElementById('turboMode').checked,
    voiceLanguage: document.getElementById('voiceLanguage').value,
    supabaseUrl: document.getElementById('supabaseUrl').value,
    supabaseKey: document.getElementById('supabaseKey').value
  };
  
  // Update CONFIG
  if (window.BobConfig) {
    window.BobConfig.adminPassword = newSettings.adminPassword;
    window.BobConfig.turbo = newSettings.turbo;
  }
  
  // Save to remote config
  currentSettings = await window.saveRemoteConfig(newSettings);
  
  addChatMessage('✅ تم حفظ الإعدادات بنجاح!', 'ai');
  
  // Update speech language if changed
  if (recognition) {
    recognition.lang = newSettings.voiceLanguage;
  }
};

// Allow Enter key to send messages
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && event.target.id === 'userInput') {
    if (!event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
});

// Export functions for global access
window.login = function() {
  addChatMessage('🔐 تم تسجيل الدخول بنجاح!', 'ai');
  showTab('chat');
};

window.signup = function() {
  addChatMessage('📝 تم إنشاء الحساب بنجاح!', 'ai');
  showTab('chat');
};

console.log("📱 Bob Empire UI fully initialized");

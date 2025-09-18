// BOB EMPIRE Engine - Standalone version
// This file contains all the core functionality in a browser-compatible format

// Configuration
window.BobConfig = {
  appName: "Bob Empire",
  version: "v2.2",
  adminPassword: "Bob@Bob0000",
  turbo: false
};

// Load agents data
async function loadAgentsData() {
  try {
    const response = await fetch('./agents.json');
    const data = await response.json();
    return data.agents.map(a => ({...a, status: a.status || "idle"}));
  } catch (error) {
    console.error('Error loading agents:', error);
    // Fallback agents
    return Array.from({length: 140}, (_, i) => ({
      id: i + 1,
      name: `وكيل ${i + 1}`,
      role: 'general',
      status: 'idle'
    }));
  }
}

// Initialize agents
window.BobAgents = [];

// Load flows data
async function loadFlowsData() {
  try {
    const response = await fetch('./flows.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading flows:', error);
    return [];
  }
}

// Agent management functions
window.runAgentById = function(id, input) {
  const agent = window.BobAgents.find(a => a.id === id);
  if (!agent) return `❌ الوكيل ${id} غير موجود`;
  
  agent.status = "running";
  setTimeout(() => { agent.status = "idle"; }, 3000);
  return `🤖 ${agent.name} (${agent.role}) نفذ المهمة: ${input}`;
};

window.addAgent = function(agent) {
  agent.id = window.BobAgents.length ? Math.max(...window.BobAgents.map(a => a.id)) + 1 : 1;
  agent.status = agent.status || "idle";
  window.BobAgents.push(agent);
  return agent;
};

window.removeAgent = function(id) {
  const index = window.BobAgents.findIndex(a => a.id === id);
  if (index >= 0) {
    window.BobAgents.splice(index, 1);
    return true;
  }
  return false;
};

// SuperAI function
window.superAI = async function(command) {
  const parts = command.trim().split(" ");
  const cmd = parts[0].toLowerCase();
  
  // Agent management commands
  if (cmd === "/run") {
    const id = Number(parts[1]);
    const input = parts.slice(2).join(" ") || "مهمة عامة";
    return window.runAgentById(id, input);
  }
  
  if (cmd === "/add-agent") {
    const name = parts.slice(1).join(" ") || "وكيل جديد";
    const agent = window.addAgent({name, role: "مخصص", status: "idle"});
    return `✅ تم إضافة الوكيل "${agent.name}" (#${agent.id}) بنجاح`;
  }
  
  if (cmd === "/remove-agent") {
    const id = Number(parts[1]);
    const agent = window.BobAgents.find(a => a.id === id);
    if (!agent) return `❌ الوكيل ${id} غير موجود`;
    window.removeAgent(id);
    return `🗑️ تم حذف الوكيل "${agent.name}" (#${id}) بنجاح`;
  }
  
  if (cmd === "/list-agents") {
    const active = window.BobAgents.filter(a => a.status !== 'paused').length;
    const total = window.BobAgents.length;
    return `🤖 إجمالي الوكلاء: ${total} | النشطين: ${active} | المتوقفين: ${total - active}`;
  }
  
  // Platform management commands
  if (cmd === "/connect") {
    if (parts[1] === "all") {
      await window.connectAllGlobal();
      return "✅ تم ربط جميع المنصات العالمية بنجاح";
    } else {
      const platform = parts[1];
      return `✅ تم ربط منصة ${platform} بنجاح`;
    }
  }
  
  // System commands
  if (cmd === "/turbo") {
    window.BobConfig.turbo = parts[1] === "on" || parts[1] === "تشغيل";
    return window.BobConfig.turbo ? "🚀 تم تفعيل وضع التيربو" : "🐢 تم إيقاف وضع التيربو";
  }
  
  if (cmd === "/status") {
    const stats = await window.getDashboard();
    return `📊 حالة النظام:
🤖 الوكلاء النشطين: ${stats.activeAgents}
📦 الطلبات: ${stats.orders}
💰 الإيرادات: ${stats.revenue}$
🚀 التيربو: ${stats.turbo ? 'مفعل' : 'معطل'}`;
  }
  
  // Help command
  if (cmd === "/help" || cmd === "/مساعدة") {
    return `💡 الأوامر المتاحة:
🤖 الوكلاء: /run <id> <مهمة> | /add-agent <اسم> | /remove-agent <id> | /list-agents
🌐 المنصات: /connect <منصة> | /connect all
⚙️ النظام: /turbo <on|off> | /status
❓ المساعدة: /help`;
  }
  
  // If no command matches, treat as conversation
  return generateSmartResponse(command);
};

// Generate smart conversational responses
function generateSmartResponse(input) {
  const responses = {
    greetings: [
      "أهلاً وسهلاً! أنا بوب الذكي، مساعدك الشخصي. إيه اللي ممكن أساعدك فيه؟ 😊",
      "مرحباً بك في إمبراطورية بوب! أنا هنا عشان أخلي شغلك أسهل. قولي محتاج إيه؟ 👑",
      "أهلاً بيك! أنا بوب SuperAI، قائد الذكاء الاصطناعي هنا. أمرك! 🚀"
    ],
    
    business: [
      "ممتاز! الأعمال شغالة تمام والوكلاء كلهم نشيطين. عايز تشوف إيه بالتفصيل؟ 📈",
      "الحمد لله الشغل ماشي حلو! عندنا 140 وكيل شغالين على قدم وساق. 💪",
      "كله تمام في المملكة! المبيعات عالية والعملاء مبسوطين. 👌"
    ],
    
    thanks: [
      "العفو! ده واجبي. أي خدمة تانية؟ 😊",
      "ماله يا عم! أنا هنا عشانك. محتاج حاجة تاني؟ 🤝",
      "ميرسي ليك! أنت الأهم. قولي لو محتاج أي حاجة. ❤️"
    ],
    
    unknown: [
      "مش فاهم قصدك بالظبط، بس أنا هنا عشان أساعدك. وضحلي أكتر؟ 🤔",
      "ممكن تشرحلي أكتر؟ عايز أساعدك بأحسن طريقة ممكنة. 💭",
      "فهمتك لحد هنا، بس عايز تفاصيل أكتر عشان أقدر أساعدك صح. 🎯"
    ]
  };
  
  const lowerInput = input.toLowerCase();
  
  // Check for greetings
  if (lowerInput.includes('مرحبا') || lowerInput.includes('أهلا') || lowerInput.includes('السلام') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
    return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
  }
  
  // Check for business queries
  if (lowerInput.includes('عمل') || lowerInput.includes('تجارة') || lowerInput.includes('مبيعات') || lowerInput.includes('business')) {
    return responses.business[Math.floor(Math.random() * responses.business.length)];
  }
  
  // Check for thanks
  if (lowerInput.includes('شكرا') || lowerInput.includes('متشكر') || lowerInput.includes('thanks') || lowerInput.includes('thank you')) {
    return responses.thanks[Math.floor(Math.random() * responses.thanks.length)];
  }
  
  // Default response
  return responses.unknown[Math.floor(Math.random() * responses.unknown.length)];
}

// Platform connections (simulated)
window.connectAllGlobal = async function() {
  console.log("🔗 Connecting all global platforms...");
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("✅ All platforms connected");
};

// Dashboard data
window.getDashboard = async function() {
  return { 
    orders: 12, 
    revenue: 3500, 
    activeAgents: window.BobAgents.length, 
    turbo: window.BobConfig.turbo 
  };
};

// Configuration management
window.loadRemoteConfig = async function() {
  try {
    const stored = localStorage.getItem('bob_empire_config');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
};

window.saveRemoteConfig = async function(config) {
  try {
    const current = await window.loadRemoteConfig();
    const updated = { ...current, ...config };
    localStorage.setItem('bob_empire_config', JSON.stringify(updated));
    return updated;
  } catch (error) {
    return config;
  }
};

// Initialize the Bob Empire engine
window.initializeBobEmpire = async function() {
  console.log("🚀 Initializing Bob Empire Engine...");
  
  // Load agents
  window.BobAgents = await loadAgentsData();
  console.log(`✅ Loaded ${window.BobAgents.length} agents`);
  
  // Load flows
  window.BobFlows = await loadFlowsData();
  console.log(`✅ Loaded ${window.BobFlows.length} flows`);
  
  console.log("👑 Bob Empire Engine ready!");
  return true;
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initializeBobEmpire);
} else {
  window.initializeBobEmpire();
}
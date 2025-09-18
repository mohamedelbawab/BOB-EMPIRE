// ===================================
// BOB EMPIRE — Global AI Commerce
// Flat build (no folders) ready for GitHub + Vercel
// ===================================

// ---- Config & Security ----
export const CONFIG = {
  appName: "Bob Empire",
  version: "v2.2",
  adminPassword: "Bob@Bob0000", // يمكنك تغييره من لوحة التحكم
  turbo: false
};

// ---- Supabase Auth (Frontend SDK) ----
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
export const supabase = createClient(
  import.meta.env?.NEXT_PUBLIC_SUPABASE_URL || window.NEXT_PUBLIC_SUPABASE_URL,
  import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || window.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ---- Lightweight State (in Supabase table 'config' or localStorage fallback) ----
const LS_KEY = "bob_empire_config";
export async function loadRemoteConfig() {
  try {
    const { data, error } = await supabase.from("config").select("*").limit(1).single();
    if (!error && data) {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
      return data;
    }
  } catch(e){}
  return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
}
export async function saveRemoteConfig(patch){
  const current = await loadRemoteConfig();
  const next = { ...current, ...patch };
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  try {
    await supabase.from("config").upsert(next, { onConflict: "id" });
  } catch(e){}
  return next;
}

// ---- 140 AI Agents registry ----
const agentsResponse = await fetch('./agents.json');
const agentsData = await agentsResponse.json();
export const AGENTS = agentsData.agents.map(a => ({...a, status: a.status || "idle"}));

export function runAgentById(id, input){
  const a = AGENTS.find(x=>x.id===id);
  if(!a) return `❌ الوكيل ${id} غير موجود`;
  a.status = "running";
  // Simulate task execution
  setTimeout(() => { a.status = "idle"; }, 3000);
  return `🤖 ${a.name} (${a.role}) نفذ المهمة: ${input}`;
}

export function addAgent(agent){
  agent.id = AGENTS.length ? Math.max(...AGENTS.map(a=>a.id))+1 : 1;
  agent.status = agent.status || "idle";
  AGENTS.push(agent);
  return agent;
}

export function removeAgent(id){
  const i = AGENTS.findIndex(a=>a.id===id);
  if(i>=0) AGENTS.splice(i,1);
  return true;
}

// ---- Super AI (Orchestrator) ----
export async function superAI(command){
  const parts = command.trim().split(" ");
  const cmd = parts[0].toLowerCase();
  
  // Agent management commands
  if(cmd === "/run"){
    const id = Number(parts[1]); 
    const input = parts.slice(2).join(" ") || "مهمة عامة";
    return runAgentById(id, input);
  }
  
  if(cmd === "/add-agent"){
    const name = parts.slice(1).join(" ") || "وكيل جديد";
    const agent = addAgent({name, role:"مخصص", status: "idle"});
    return `✅ تم إضافة الوكيل "${agent.name}" (#${agent.id}) بنجاح`;
  }
  
  if(cmd === "/remove-agent"){
    const id = Number(parts[1]);
    const agent = AGENTS.find(a => a.id === id);
    if (!agent) return `❌ الوكيل ${id} غير موجود`;
    removeAgent(id);
    return `🗑️ تم حذف الوكيل "${agent.name}" (#${id}) بنجاح`;
  }
  
  if(cmd === "/list-agents"){
    const active = AGENTS.filter(a => a.status !== 'paused').length;
    const total = AGENTS.length;
    return `🤖 إجمالي الوكلاء: ${total} | النشطين: ${active} | المتوقفين: ${total - active}`;
  }
  
  // Platform management commands
  if(cmd === "/connect"){
    if(parts[1] === "all"){
      await connectAllGlobal();
      return "✅ تم ربط جميع المنصات العالمية بنجاح";
    } else {
      const platform = parts[1];
      // Simulate connecting specific platform
      return `✅ تم ربط منصة ${platform} بنجاح`;
    }
  }
  
  // System commands
  if(cmd === "/turbo"){
    CONFIG.turbo = parts[1] === "on" || parts[1] === "تشغيل"; 
    await saveRemoteConfig({turbo: CONFIG.turbo});
    return CONFIG.turbo ? "🚀 تم تفعيل وضع التيربو" : "🐢 تم إيقاف وضع التيربو";
  }
  
  if(cmd === "/status"){
    const stats = await getDashboard();
    return `📊 حالة النظام:
🤖 الوكلاء النشطين: ${stats.activeAgents}
📦 الطلبات: ${stats.orders}
💰 الإيرادات: ${stats.revenue}$
🚀 التيربو: ${stats.turbo ? 'مفعل' : 'معطل'}`;
  }
  
  // n8n Integration commands
  if(cmd === "/n8n"){
    const action = parts[1];
    if(action === "connect"){
      const url = parts[2] || "https://n8n.example.com";
      return `✅ تم ربط n8n: ${url}`;
    }
    if(action === "sync"){
      return `🔄 تم مزامنة التدفقات مع n8n بنجاح`;
    }
    return `💡 أوامر n8n: /n8n connect <url> | /n8n sync`;
  }
  
  // Settings commands
  if(cmd === "/config"){
    const setting = parts[1];
    const value = parts[2];
    
    if(setting === "password"){
      CONFIG.adminPassword = value;
      await saveRemoteConfig({adminPassword: value});
      return `🔐 تم تحديث كلمة مرور الإدارة`;
    }
    
    if(setting === "language"){
      await saveRemoteConfig({voiceLanguage: value});
      return `🗣️ تم تغيير لغة الصوت إلى ${value}`;
    }
    
    return `⚙️ الإعدادات المتاحة: password, language`;
  }
  
  // Help command
  if(cmd === "/help" || cmd === "/مساعدة"){
    return `💡 الأوامر المتاحة:
🤖 الوكلاء: /run <id> <مهمة> | /add-agent <اسم> | /remove-agent <id> | /list-agents
🌐 المنصات: /connect <منصة> | /connect all
⚙️ النظام: /turbo <on|off> | /status | /config <إعداد> <قيمة>
⚡ n8n: /n8n connect <url> | /n8n sync
❓ المساعدة: /help`;
  }
  
  // If no command matches, treat as conversation
  return generateSmartResponse(command);
}

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

// ---- Global Platforms (placeholders, ready for keys) ----
export async function connectAmazon(){ console.log("🔗 Amazon connected"); }
export async function connectShopify(){ console.log("🔗 Shopify connected"); }
export async function connectAliExpress(){ console.log("🔗 AliExpress connected"); }
export async function connectAlibaba(){ console.log("🔗 Alibaba connected"); }
export async function connectCoupang(){ console.log("🔗 Coupang (KR) connected"); }
export async function connectRakuten(){ console.log("🔗 Rakuten (JP) connected"); }
export async function connectShopee(){ console.log("🔗 Shopee (SEA) connected"); }
export async function connectLazada(){ console.log("🔗 Lazada (SEA) connected"); }
export async function connectMercadoLibre(){ console.log("🔗 MercadoLibre (LATAM) connected"); }
export async function connectFlipkart(){ console.log("🔗 Flipkart (IN) connected"); }
export async function connectOzon(){ console.log("🔗 Ozon (RU) connected"); }
export async function connectWildberries(){ console.log("🔗 Wildberries (RU) connected"); }
export async function connectNoon(){ console.log("🔗 Noon (MENA) connected"); }
export async function connectJumia(){ console.log("🔗 Jumia (AF) connected"); }
export async function connectSouq(){ console.log("🔗 Souq (UAE) connected"); }
export async function connectOLX(){ console.log("🔗 OLX connected"); }

export async function connectFacebook(){ console.log("🔗 Facebook connected"); }
export async function connectInstagram(){ console.log("🔗 Instagram connected"); }
export async function connectWhatsApp(){ console.log("🔗 WhatsApp connected"); }
export async function connectTelegram(){ console.log("🔗 Telegram connected"); }
export async function connectLinkedIn(){ console.log("🔗 LinkedIn connected"); }
export async function connectTikTok(){ console.log("🔗 TikTok connected"); }
export async function connectX(){ console.log("🔗 X/Twitter connected"); }
export async function connectWeChat(){ console.log("🔗 WeChat connected"); }
export async function connectVK(){ console.log("🔗 VK connected"); }

export async function connectStripe(){ console.log("💳 Stripe connected"); }
export async function connectPayPal(){ console.log("💳 PayPal connected"); }
export async function connectPaymob(){ console.log("💳 Paymob connected"); }
export async function connectFawry(){ console.log("💳 Fawry connected"); }
export async function connectWise(){ console.log("💳 Wise connected"); }
export async function connectApplePay(){ console.log("💳 ApplePay connected"); }
export async function connectGooglePay(){ console.log("💳 GooglePay connected"); }
export async function connectAlipay(){ console.log("💳 Alipay connected"); }
export async function connectKakaoPay(){ console.log("💳 KakaoPay connected"); }
export async function connectLinePay(){ console.log("💳 LINE Pay connected"); }

export async function connectAllGlobal(){
  await Promise.all([
    connectAmazon(),connectShopify(),connectAliExpress(),connectAlibaba(),
    connectCoupang(),connectRakuten(),connectShopee(),connectLazada(),
    connectMercadoLibre(),connectFlipkart(),connectOzon(),connectWildberries(),
    connectNoon(),connectJumia(),connectSouq(),connectOLX(),
    connectFacebook(),connectInstagram(),connectWhatsApp(),connectTelegram(),
    connectLinkedIn(),connectTikTok(),connectX(),connectWeChat(),connectVK(),
    connectStripe(),connectPayPal(),connectPaymob(),connectFawry(),connectWise(),
    connectApplePay(),connectGooglePay(),connectAlipay(),connectKakaoPay(),connectLinePay()
  ]);
}

// ---- Simple Dashboard data (placeholder) ----
export async function getDashboard(){
  return { orders: 12, revenue: 3500, activeAgents: AGENTS.length, turbo: CONFIG.turbo };
}

// ---- n8n Integration Support ----
export let N8N_CONFIG = {
  baseUrl: null,
  connected: false,
  workflows: []
};

export async function connectN8N(baseUrl, apiKey = null) {
  try {
    N8N_CONFIG.baseUrl = baseUrl;
    // Simulate connection test
    N8N_CONFIG.connected = true;
    console.log(`🔗 n8n connected: ${baseUrl}`);
    return { success: true, message: "تم ربط n8n بنجاح" };
  } catch (error) {
    N8N_CONFIG.connected = false;
    return { success: false, message: "فشل في ربط n8n" };
  }
}

export async function syncN8NWorkflows() {
  if (!N8N_CONFIG.connected) {
    return { success: false, message: "n8n غير متصل" };
  }
  
  try {
    // Simulate fetching workflows from n8n
    const workflows = [
      { id: "wf_1", name: "تدفق معالجة الطلبات", active: true },
      { id: "wf_2", name: "تدفق إدارة المخزون", active: true },
      { id: "wf_3", name: "تدفق التسويق الآلي", active: false }
    ];
    
    N8N_CONFIG.workflows = workflows;
    return { success: true, workflows, message: "تم مزامنة التدفقات بنجاح" };
  } catch (error) {
    return { success: false, message: "فشل في مزامنة التدفقات" };
  }
}

export function getN8NStatus() {
  return N8N_CONFIG;
}

// ---- Enhanced Agent Management ----
export function getAgentsByRole(role) {
  return AGENTS.filter(agent => agent.role === role);
}

export function getActiveAgents() {
  return AGENTS.filter(agent => agent.status === 'running' || agent.status === 'idle');
}

export function pauseAgent(id) {
  const agent = AGENTS.find(a => a.id === id);
  if (agent) {
    agent.status = 'paused';
    return `⏸️ تم إيقاف الوكيل ${agent.name}`;
  }
  return `❌ الوكيل ${id} غير موجود`;
}

export function resumeAgent(id) {
  const agent = AGENTS.find(a => a.id === id);
  if (agent) {
    agent.status = 'idle';
    return `▶️ تم تشغيل الوكيل ${agent.name}`;
  }
  return `❌ الوكيل ${id} غير موجود`;
}

// ---- Enhanced Platform Management ----
export const PLATFORM_STATUS = new Map();

export function getPlatformStatus(platform) {
  return PLATFORM_STATUS.get(platform) || 'disconnected';
}

export function setPlatformStatus(platform, status) {
  PLATFORM_STATUS.set(platform, status);
}

export async function connectPlatformByName(platformName) {
  const platformMap = {
    'amazon': connectAmazon,
    'shopify': connectShopify,
    'aliexpress': connectAliExpress,
    'alibaba': connectAlibaba,
    'facebook': connectFacebook,
    'instagram': connectInstagram,
    'whatsapp': connectWhatsApp,
    'telegram': connectTelegram,
    'stripe': connectStripe,
    'paypal': connectPayPal
  };
  
  const connectFunc = platformMap[platformName.toLowerCase()];
  if (connectFunc) {
    await connectFunc();
    setPlatformStatus(platformName, 'connected');
    return `✅ تم ربط ${platformName} بنجاح`;
  }
  
  return `❌ منصة ${platformName} غير مدعومة`;
}

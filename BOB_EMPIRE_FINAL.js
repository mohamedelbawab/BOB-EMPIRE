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
// Use a fallback if CDN is blocked
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

let supabase = null;

// Initialize Supabase client with fallback
export async function initializeSupabase() {
  try {
    // Try to load from CDN
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase initialized from CDN");
  } catch (error) {
    console.warn("⚠️ CDN blocked, using mock Supabase client");
    // Create a mock Supabase client for testing
    supabase = createMockSupabaseClient();
  }
  return supabase;
}

// Mock Supabase client for when CDN is blocked
function createMockSupabaseClient() {
  return {
    from: (table) => ({
      select: () => ({ 
        limit: () => ({ 
          single: () => Promise.resolve({ data: null, error: { code: "MOCK_MODE", message: "Mock mode - CDN blocked" } })
        }),
        data: [], 
        error: null 
      }),
      insert: () => Promise.resolve({ data: null, error: { message: "Mock mode - insert not supported" } }),
      upsert: () => Promise.resolve({ data: null, error: null })
    }),
    rpc: () => Promise.resolve({ data: null, error: { message: "Mock mode - RPC not supported" } })
  };
}

export { supabase };

// ---- Lightweight State (in Supabase table 'config' or localStorage fallback) ----
const LS_KEY = "bob_empire_config";
export async function loadRemoteConfig() {
  if (!supabase) await initializeSupabase();
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
  if (!supabase) await initializeSupabase();
  const current = await loadRemoteConfig();
  const next = { ...current, ...patch };
  localStorage.setItem(LS_KEY, JSON.stringify(next));
  try {
    await supabase.from("config").upsert(next, { onConflict: "id" });
  } catch(e){}
  return next;
}

// ---- 140 AI Agents registry ----
// Initialize with basic agents, can be extended through API
export const AGENTS = [
  {id: 1, name: "Marketing Agent", role: "marketing", status: "idle"},
  {id: 2, name: "Sales Agent", role: "sales", status: "idle"},
  {id: 3, name: "Customer Support Agent", role: "support", status: "idle"},
  {id: 4, name: "Analytics Agent", role: "analytics", status: "idle"},
  {id: 5, name: "Content Creator Agent", role: "content", status: "idle"},
  {id: 6, name: "SEO Agent", role: "seo", status: "idle"},
  {id: 7, name: "Social Media Agent", role: "social", status: "idle"},
  {id: 8, name: "Product Manager Agent", role: "product", status: "idle"},
  {id: 9, name: "Finance Agent", role: "finance", status: "idle"},
  {id: 10, name: "Operations Agent", role: "operations", status: "idle"}
];

// Load additional agents from JSON file if available
export async function loadAgentsFromFile() {
  try {
    const response = await fetch('./agents.json');
    const agentsData = await response.json();
    if (agentsData.agents && Array.isArray(agentsData.agents)) {
      // Clear current agents and load from file
      AGENTS.length = 0;
      AGENTS.push(...agentsData.agents.map(a => ({...a, role: a.role || "assistant", status:"idle"})));
    }
  } catch (e) {
    console.log("Using default agents (agents.json not loaded)");
  }
}

export function runAgentById(id, input){
  const a = AGENTS.find(x=>x.id===id);
  if(!a) return `❌ Agent ${id} not found`;
  a.status = "running";
  // Placeholder task execution
  return `🤖 ${a.name} (${a.role}) processed: ${input}`;
}

export function addAgent(agent){
  agent.id = AGENTS.length ? Math.max(...AGENTS.map(a=>a.id))+1 : 1;
  AGENTS.push(agent);
  return agent;
}
export function removeAgent(id){
  const i = AGENTS.findIndex(a=>a.id===id);
  if(i>=0) AGENTS.splice(i,1);
}

// ---- Super AI (Orchestrator) ----
export async function superAI(command){
  // Advanced command parser with more functionality
  const parts = command.trim().split(" ");
  const cmd = parts[0];
  
  // Agent management commands
  if(cmd==="/run"){
    const id = Number(parts[1]); 
    return runAgentById(id, parts.slice(2).join(" "));
  }
  if(cmd==="/add-agent"){
    const name = parts.slice(1).join(" ") || "New Agent";
    const ag = addAgent({name, role:"custom"});
    return `✅ Added ${ag.name} (#${ag.id})`;
  }
  if(cmd==="/remove-agent"){
    const id = Number(parts[1]);
    removeAgent(id);
    return `✅ Removed agent #${id}`;
  }
  if(cmd==="/list-agents"){
    const count = parts[1] ? Number(parts[1]) : 10;
    const list = AGENTS.slice(0, count).map(a => `#${a.id}: ${a.name} (${a.status})`).join("\n");
    return `🤖 Agents (showing ${Math.min(count, AGENTS.length)}/${AGENTS.length}):\n${list}`;
  }
  
  // Platform connection commands
  if(cmd==="/connect"){
    if(parts[1]==="all"){
      await connectAllGlobal();
      return "✅ All global platforms connected";
    }
    // Individual platform connections
    const platform = parts[1]?.toLowerCase();
    const platformMap = {
      'amazon': connectAmazon, 'shopify': connectShopify, 'aliexpress': connectAliExpress,
      'alibaba': connectAlibaba, 'facebook': connectFacebook, 'instagram': connectInstagram,
      'stripe': connectStripe, 'paypal': connectPayPal
    };
    if(platformMap[platform]){
      await platformMap[platform]();
      return `✅ ${platform} connected`;
    }
    return `❌ Unknown platform: ${platform}`;
  }
  
  // System commands
  if(cmd==="/turbo"){
    CONFIG.turbo = parts[1]==="on"; 
    await saveRemoteConfig({turbo: CONFIG.turbo});
    return CONFIG.turbo ? "🚀 Turbo ON" : "🐢 Turbo OFF";
  }
  if(cmd==="/status"){
    const dashboard = await getDashboard();
    return `📊 Status: ${dashboard.orders} orders, $${dashboard.revenue} revenue, ${dashboard.activeAgents} agents, Turbo: ${dashboard.turbo ? "ON" : "OFF"}`;
  }
  if(cmd==="/test-supabase"){
    return await testSupabaseConnection();
  }
  
  // Flow management (placeholder)
  if(cmd==="/flows"){
    return "🔄 Flow management: /flows list | /flows run <id> | /flows create <name>";
  }
  
  // Help command
  if(cmd==="/help" || cmd==="/?"){
    return `💡 Available Commands:
🤖 Agents: /run <id> <text> | /add-agent <name> | /remove-agent <id> | /list-agents [count]
🔗 Platforms: /connect all | /connect <platform>
⚙️ System: /turbo on|off | /status | /test-supabase
🔄 Flows: /flows | /help`;
  }
  
  return "❓ Unknown command. Type /help for available commands.";
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

// ---- Supabase Connection Testing ----
export async function testSupabaseConnection(){
  if (!supabase) await initializeSupabase();
  try {
    // Test basic connection
    const { data, error } = await supabase.from("health_ping").select("*").limit(1);
    
    if (error && error.code === "42P01") {
      // Table doesn't exist, try to create basic tables
      return await createBasicTables();
    } else if (error) {
      if (error.code === "MOCK_MODE") {
        return "⚠️ Running in mock mode (CDN blocked). Supabase features limited.";
      }
      return `❌ Supabase connection failed: ${error.message}`;
    }
    
    // Test write operation
    const testData = { id: Date.now(), message: "Test ping", timestamp: new Date().toISOString() };
    const { error: insertError } = await supabase.from("health_ping").insert(testData);
    
    if (insertError) {
      return `⚠️ Connection OK but write failed: ${insertError.message}`;
    }
    
    return "✅ Supabase connection successful - Read/Write operations working";
  } catch (e) {
    return `❌ Supabase test failed: ${e.message}`;
  }
}

// ---- Create Basic Database Tables ----
export async function createBasicTables(){
  if (!supabase) await initializeSupabase();
  try {
    const { data, error } = await supabase.rpc('create_basic_tables');
    if (error) {
      return `⚠️ Connected but no tables found. Please create tables manually:
      
CREATE TABLE health_ping (
  id BIGINT PRIMARY KEY,
  message TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'assistant',
  status TEXT DEFAULT 'idle',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT DEFAULT 'manual',
  steps JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;
    }
    return "✅ Basic tables created successfully";
  } catch (e) {
    return `⚠️ Please create database tables manually. Connection is working but tables are missing.`;
  }
}

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
// Dynamic import for agents data
let AGENTS = [];

async function loadAgentsData() {
  try {
    const response = await fetch('./agents.json');
    const data = await response.json();
    AGENTS = (data.agents || data).map(a => ({...a, status:"idle"}));
    return AGENTS;
  } catch (error) {
    console.warn('Could not load agents.json, using default data');
    // Fallback agents data
    AGENTS = Array.from({length: 140}, (_, i) => ({
      id: i + 1,
      name: `AI Agent ${i + 1}`,
      role: "custom",
      status: "idle"
    }));
    return AGENTS;
  }
}

export { AGENTS };
export { loadAgentsData };

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
  // Simple parser: /run <agentId> <text>  |  /connect all  |  /turbo on|off
  const parts = command.trim().split(" ");
  if(parts[0]==="/run"){
    const id = Number(parts[1]); 
    return runAgentById(id, parts.slice(2).join(" "));
  }
  if(parts[0]==="/connect" && parts[1]==="all"){
    await connectAllGlobal();
    return "✅ All global platforms connected";
  }
  if(parts[0]==="/turbo"){
    CONFIG.turbo = parts[1]==="on"; await saveRemoteConfig({turbo: CONFIG.turbo});
    return CONFIG.turbo ? "🚀 Turbo ON" : "🐢 Turbo OFF";
  }
  if(parts[0]==="/add-agent"){
    const name = parts.slice(1).join(" ") || "New Agent";
    const ag = addAgent({name, role:"custom"});
    return `✅ Added ${ag.name} (#${ag.id})`;
  }
  return "💡 Commands: /run <id> <text> | /connect all | /turbo on|off | /add-agent <name>";
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

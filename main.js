// Bob Empire — v2.2 Global Expansion
let turbo = false;
let supa = null;
let agents = [];
let flows = {};
let sessionUser = null;
let ttsEnabled = true;

function qs(id){ return document.getElementById(id); }
function log(line){ const el=qs('log'); el.textContent += `\n${line}`; el.scrollTop = el.scrollHeight; if(ttsEnabled) speak(line); }
function adminLog(line){ const el=qs('adminLog'); el.textContent += `\n${line}`; el.scrollTop = el.scrollHeight; }

function speak(text){
  try{
    if(!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = (window.BE_CONFIG?.LANG)||'ar-EG';
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }catch(_){}
}

function setTurbo(on){
  turbo = !!on;
  qs('btnTurbo').textContent = 'Turbo: ' + (turbo ? 'ON' : 'OFF');
  log('وضع التربو ' + (turbo ? 'مفعّل' : 'متوقّف'));
}

function setupTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      btn.classList.add('active'); qs(btn.dataset.tab).classList.add('active');
      if(btn.dataset.tab==='agents') renderAgents();
      if(btn.dataset.tab==='flows') renderFlows();
    });
  });
}

async function initSupabase(){
  const cfg = window.BE_CONFIG||{};
  if(!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON){
    qs('envStatus').textContent = 'ENV: missing keys';
    log('⚠️ ضع SUPABASE_URL و SUPABASE_ANON في config.js');
    await seedFromFiles(); return;
  }
  supa = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON);
  qs('envStatus').textContent = 'ENV: ready';
  adminLog('Supabase client ready.');
  const s = await supa.auth.getUser();
  if(s?.data?.user){ sessionUser = s.data.user; onLoginUI(); }
  await loadFromSupabaseOrSeed();
}

function onLoginUI(){ qs('btnLogin').style.display='none'; qs('btnLogout').style.display='inline-block'; }
function onLogoutUI(){ qs('btnLogin').style.display='inline-block'; qs('btnLogout').style.display='none'; }

async function doLogin(){
  const email = prompt('اكتب ايميلك للتسجيل/الدخول (اختبار):');
  const pass = 'Bob@Bob0000';
  if(!email) return;
  const got = await supa.auth.signInWithPassword({ email, password: pass });
  if(got.error){
    await supa.auth.signUp({ email, password: pass });
    const again = await supa.auth.signInWithPassword({ email, password: pass });
    if(again.error){ alert('Login error: ' + again.error.message); return; }
    sessionUser = again.data.user;
  } else sessionUser = got.data.user;
  onLoginUI(); log('تم تسجيل الدخول: ' + sessionUser?.email);
}

async function doLogout(){ await supa.auth.signOut(); sessionUser=null; onLogoutUI(); log('تم تسجيل الخروج'); }

async function seedFromFiles(){
  const ag = await fetch('agents.json').then(r=>r.json()).catch(()=>({agents:[]}));
  const fl = await fetch('flows.json').then(r=>r.json()).catch(()=>({flows:{}}));
  agents = ag.agents||[]; flows = fl.flows||{};
  log('تم تحميل '+agents.length+' وكيل و '+Object.keys(flows).length+' فلو (seed).');
}
async function loadFromSupabaseOrSeed(){
  try{
    const a = await supa.from('agents').select('*').limit(1);
    if(!a.error){
      const all = await supa.from('agents').select('*');
      if(!all.error && all.data?.length){ agents = all.data.map(x=>({id:x.agent_id||x.id, name:x.name, team:x.team, description:x.description, status:x.status||'idle', turbo_supported:!!x.turbo_supported})); }
    }
  }catch(_){}
  if(!agents?.length) await seedFromFiles();

  try{
    const f = await supa.from('flows').select('*').limit(1);
    if(!f.error){
      const allf = await supa.from('flows').select('*');
      if(!allf.error && allf.data?.length){
        flows = {}; allf.data.forEach(x=>flows[x.flow_id||('flow_'+x.id)] = {name:x.name, webhook:x.webhook||'', purpose:x.purpose||''});
      }
    }
  }catch(_){}
}

async function addProduct(){
  const name = qs('prodName').value.trim();
  const price = parseFloat(qs('prodPrice').value||'0');
  if(!name){ log('اكتب اسم المنتج'); return; }
  if(!supa){ log('سوبابيز مش جاهز'); return; }
  const { error } = await supa.from('products').insert({ name, price });
  if(error){ log('DB error: ' + error.message); return; }
  log('تم اضافة المنتج: ' + name); renderProducts();
}
async function renderProducts(){
  if(!supa) return;
  const { data, error } = await supa.from('products').select('*').order('id', {ascending:false});
  const wrap = qs('products'); wrap.innerHTML = '';
  if(error){ wrap.textContent = 'DB error: ' + error.message; return; }
  wrap.innerHTML = (data||[]).map(p=>`<div class="panel" style="margin:8px 0"><b>${p.name}</b> — ${p.price||0}</div>`).join('');
}

async function healthCheck(){
  adminLog('Health…'); adminLog('Turbo: ' + (turbo?'ON':'OFF'));
  if(!supa){ adminLog('Supabase: not ready'); return; }
  const { error } = await supa.from('health_ping').select('*').limit(1);
  adminLog('DB check: ' + (error ? ('ERR ' + error.message) : 'OK'));
}
async function signFileUrl(){
  const path = prompt('اكتب اسم الملف داخل الbucket (مثال: myfile.zip)'); if(!path) return;
  const bucket = (window.BE_CONFIG||{}).STORAGE_BUCKET;
  try{
    const { data, error } = await supa.storage.from(bucket).createSignedUrl(path, 3600);
    if(error){ adminLog('Signed URL ERR: ' + error.message); return; }
    adminLog('Signed URL (1h): ' + data.signedUrl);
  }catch(e){ adminLog('Signed URL ERR: ' + e.message); }
}
async function syncIntegrations(){
  const base = (window.BE_CONFIG?.N8N?.baseUrl)||'';
  if(!base){ adminLog('حط n8n baseUrl في config.js'); return; }
  const keys = Object.keys(flows||{});
  adminLog('Syncing ' + keys.length + ' flows… (webhooks placeholders)');
  adminLog('تم — حدّث الروابط في flows.json عند الحاجة.');
}

// Agents UI
function renderAgents(){
  const rows = (agents||[]).map(a=>`<tr>
    <td><span class="badge">${a.id||''}</span></td>
    <td>${a.name||''}</td>
    <td>${a.team||''}</td>
    <td>${a.description||''}</td>
    <td>${a.status||'idle'}</td>
    <td><button onclick="editAgent('${a.id}')">✏️</button><button onclick="deleteAgent('${a.id}')">🗑️</button></td>
  </tr>`).join('');
  qs('agentsTable').innerHTML = `<table class="table">
    <thead><tr><th>ID</th><th>الاسم</th><th>الفريق</th><th>الوصف</th><th>الحالة</th><th>إدارة</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
}
async function addAgent(){
  const name = qs('agentName').value.trim();
  const team = qs('agentTeam').value.trim()||'Custom';
  const desc = qs('agentDesc').value.trim()||'User-defined agent';
  if(!name){ log('اكتب اسم الوكيل'); return; }
  const id = 'A' + String(Date.now()).slice(-6);
  const rec = { id, name, team, description: desc, status:'idle', turbo_supported:true };
  agents.push(rec); renderAgents(); await persistAgent(rec); log('تم إضافة وكيل: '+name);
}
async function editAgent(id){
  const a = agents.find(x=>x.id===id); if(!a) return;
  const n = prompt('اسم الوكيل', a.name)||a.name;
  const t = prompt('الفريق/التصنيف', a.team)||a.team;
  const d = prompt('الوصف', a.description)||a.description;
  a.name=n; a.team=t; a.description=d; renderAgents(); await persistAgent(a, true); log('تم تعديل الوكيل: '+a.id);
}
async function deleteAgent(id){
  agents = agents.filter(x=>x.id!==id); renderAgents(); await removeAgent(id); log('تم حذف الوكيل: '+id);
}
async function persistAgent(a, upsert=false){
  if(!supa) return;
  try{
    if(upsert){
      await supa.from('agents').upsert({ agent_id:a.id, name:a.name, team:a.team, description:a.description, status:a.status, turbo_supported:a.turbo_supported });
    }else{
      await supa.from('agents').insert({ agent_id:a.id, name:a.name, team:a.team, description:a.description, status:a.status, turbo_supported:a.turbo_supported });
    }
  }catch(_){}
}
async function removeAgent(id){
  if(!supa) return; try{ await supa.from('agents').delete().eq('agent_id', id); }catch(_){}
}

// Flows UI
function renderFlows(){
  const keys = Object.keys(flows||{});
  const rows = keys.map(k=>{
    const f = flows[k];
    return `<tr>
      <td><span class="badge">${k}</span></td>
      <td>${f.name||''}</td>
      <td>${f.purpose||''}</td>
      <td>${f.webhook||''}</td>
      <td><button onclick="editFlow('${k}')">✏️</button><button onclick="deleteFlow('${k}')">🗑️</button></td>
    </tr>`;
  }).join('');
  qs('flowsTable').innerHTML = `<table class="table">
    <thead><tr><th>ID</th><th>الاسم</th><th>الغرض</th><th>Webhook</th><th>إدارة</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
}
function addFlow(){
  const name = qs('flowName').value.trim()||('Flow '+Date.now());
  const purpose = qs('flowPurpose').value.trim()||'';
  const webhook = qs('flowWebhook').value.trim()||'';
  const id = 'flow_'+String(Date.now()).slice(-6);
  flows[id] = { name, purpose, webhook }; renderFlows(); adminLog('تم اضافة فلو: '+name);
}
function editFlow(k){
  const f = flows[k]; if(!f) return;
  const n = prompt('اسم الفلو', f.name)||f.name;
  const p = prompt('الغرض', f.purpose)||f.purpose;
  const w = prompt('Webhook', f.webhook)||f.webhook;
  flows[k] = { name:n, purpose:p, webhook:w }; renderFlows(); adminLog('تم تعديل الفلو: '+k);
}
function deleteFlow(k){ delete flows[k]; renderFlows(); adminLog('تم حذف الفلو: '+k); }

// Voice
function setupVoice(){
  const btn = qs('btnMic');
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){ btn.disabled = True; return; }
  const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
  const rec = new SR(); rec.lang = (window.BE_CONFIG?.LANG)||'ar-EG'; rec.continuous=false; rec.interimResults=false;
  btn.addEventListener('click', ()=>{ rec.start(); });
  rec.onresult = e=>{ const text = e.results[0][0].transcript; qs('txtCmd').value = text; runCommand(); };
  qs('btnSpeak').addEventListener('click', ()=>{ ttsEnabled = !ttsEnabled; log('الرد الصوتي: ' + (ttsEnabled?'مفعّل':'متوقّف')); });
}

// Commands parser for many platforms
function parseCmd(cmd){
  const c = cmd.trim().toLowerCase();

  if(/فعّل التربو|شغّل التربو/.test(c)) return {action:'turbo', on:true};
  if(/بطّل التربو|اقفل التربو/.test(c)) return {action:'turbo', on:false};
  if(c.startsWith('ارفع منتج')) return {action:'add_product', args: cmd.split(' ').slice(2).join(' ')};
  if(/وقّع ملف|وقع ملف/.test(c)) return {action:'signed_url'};

  if(c.startsWith('أضف وكيل') || c.startsWith('اضف وكيل')) return {action:'agent_add', args: cmd.split(' ').slice(2).join(' ')};
  if(c.startsWith('احذف وكيل')) return {action:'agent_del', args: cmd.split(' ').slice(2).join(' ')};
  if(c.startsWith('عدّل وكيل') || c.startsWith('عدل وكيل')) return {action:'agent_edit', args: cmd.split(' ').slice(2).join(' ')};

  if(c.startsWith('أضف فلو') || c.startsWith('اضف فلو')) return {action:'flow_add', args: cmd.split(' ').slice(2).join(' ')};
  if(c.startsWith('احذف فلو')) return {action:'flow_del', args: cmd.split(' ').slice(2).join(' ')};

  const platforms = [
    ['shopify', /اربط شوبيفاي|ربط شوبيفاي|shopify/],
    ['amazon', /امازون|amazon/],
    ['ebay', /ايباي|ebay/],
    ['etsy', /اتسي|etsy/],
    ['walmart', /وولمارت|walmart/],
    ['target', /تارجت|target/],
    ['bestbuy', /بيست باي|bestbuy/],
    ['rakuten', /راكوتين|rakuten/],
    ['aliexpress', /علي اكسبريس|aliexpress/],
    ['alibaba', /علي بابا|alibaba/],
    ['jumia', /جوميا|jumia/],
    ['noon', /نون|noon/],
    ['souq', /سوق|souq/],
    ['olx', /او ال اكس|olx/],
    ['wildberries', /وايلدبيريز|wildberries/],
    ['ozon', /اوزون|ozon/],
    ['yandex', /ياندكس|yandex/],
    ['coupang', /كو بانج|coupang/],
    ['naver', /نيفر|naver/],
    ['gmarket', /جي ماركت|gmarket/],
    ['yahoojp', /ياهو اليابان|yahoo japan|yahoo jp/],
    ['mercari', /مركاري|mercari/],
    ['flipkart', /فليبكارت|flipkart/],
    ['shopee', /شوبي|shopee/],
    ['lazada', /لازادا|lazada/],
    ['mercadolibre', /ميركادو ليبري|mercadolibre/],
    ['daraz', /داراز|daraz/],
    ['allegro', /الاجرو|allegro/],
    // social & payments remain
    ['tiktok', /تيكتوك|tiktok/],
    ['instagram', /انستجرام|instagram/],
    ['facebook', /فيسبوك|facebook/],
    ['telegram', /تليجرام|telegram/],
    ['linkedin', /لينكدان|linkedin/],
    ['vk', /في كيه|vk/],
    ['wechat', /وي شات|wechat/],
    ['stripe', /سترايب|stripe/],
    ['paypal', /بايبال|paypal/],
    ['wise', /وايز|wise/],
    ['paymob', /بايموب|paymob/],
  ];

  for(const [name, re] of platforms){
    if(re.test(c)) return {action: name+'_connect'};
  }

  return {action:'echo', text: cmd};
}

async function runCommand(){
  const cmd = qs('txtCmd').value; if(!cmd) return;
  const p = parseCmd(cmd);
  switch(p.action){
    case 'turbo': setTurbo(p.on); break;
    case 'add_product':
      if(p.args){
        const parts = p.args.split('|');
        qs('prodName').value = (parts[0]||'').trim();
        qs('prodPrice').value = (parts[1]||'0').trim();
      }
      await addProduct(); break;
    case 'signed_url': await signFileUrl(); break;
    case 'agent_add': {
      const parts = p.args.split('|');
      qs('agentName').value = (parts[0]||'').trim();
      qs('agentDesc').value = (parts[1]||'').trim();
      qs('agentTeam').value = (parts[2]||'Custom').trim();
      await addAgent(); break;
    }
    case 'agent_del': await deleteAgent(p.args.trim()); break;
    case 'agent_edit': await editAgent(p.args.trim()); break;
    case 'flow_add': {
      const parts = p.args.split('|');
      qs('flowName').value = (parts[0]||'').trim();
      qs('flowPurpose').value = (parts[1]||'').trim();
      qs('flowWebhook').value = (parts[2]||'').trim();
      addFlow(); break;
    }
    case 'flow_del': deleteFlow(p.args.trim()); break;

    default:
      if(p.action.endsWith('_connect')){
        const key = p.action.replace('_connect','').toUpperCase();
        log('🔌 '+key+': ضِف مفاتيح API في config.js ثم فعّل فلو n8n المناسب.');
      }else{
        log('Echo: ' + p.text);
      }
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  setupTabs();
  setTurbo(!!(window.BE_CONFIG?.TURBO_DEFAULT));
  initSupabase();
  setupVoice();
  qs('btnRun').addEventListener('click', runCommand);
  qs('btnTurbo').addEventListener('click', ()=> setTurbo(!turbo));
  qs('btnLogin').addEventListener('click', doLogin);
  qs('btnLogout').addEventListener('click', doLogout);
  qs('btnAddProduct').addEventListener('click', addProduct);
  qs('btnHealth').addEventListener('click', healthCheck);
  qs('btnSync').addEventListener('click', syncIntegrations);
  qs('btnSignedUrl').addEventListener('click', signFileUrl);
});

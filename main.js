import { CONFIG, superAI, getDashboard, AGENTS, loadAgents, saveRemoteConfig, loadRemoteConfig, connectAllGlobal } from './BOB_EMPIRE_FINAL.js';

const TABS = [
  {id:'dashboard', label:'Dashboard'},
  {id:'agents', label:'Agents'},
  {id:'store', label:'Store'},
  {id:'chat', label:'Chat'},
  {id:'admin', label:'Admin'},
  {id:'settings', label:'Settings'}
];

const tabsEl = document.getElementById('tabs');
const contentEl = document.getElementById('content');

TABS.forEach(t=>{
  const b = document.createElement('button');
  b.textContent=t.label;
  b.onclick=()=>render(t.id);
  tabsEl.appendChild(b);
});

async function render(id){
  contentEl.innerHTML='';
  if(id==='dashboard'){
    const d = await getDashboard();
    contentEl.innerHTML = `
      <section class="tab active">
        <h2>Dashboard</h2>
        <div class="grid">
          <div class="card">📦 Orders <h3>${d.orders}</h3></div>
          <div class="card">💰 Revenue <h3>${d.revenue}</h3></div>
          <div class="card">🤖 Agents <h3>${d.activeAgents}</h3></div>
          <div class="card">⚡ Turbo <h3>${d.turbo?'ON':'OFF'}</h3></div>
        </div>
      </section>`;
  }
  if(id==='agents'){
    const list = document.createElement('div');
    list.className='grid';
    
    // Ensure agents are loaded before rendering
    await loadAgents();
    
    if (AGENTS.length === 0) {
      list.innerHTML = '<div class="card">Loading agents...</div>';
    } else {
      AGENTS.forEach(a=>{
        const c = document.createElement('div');
        c.className='card';
        c.innerHTML = `<b>#${a.id} ${a.name}</b><br/><span class="badge">${a.role}</span>`;
        list.appendChild(c);
      });
    }
    contentEl.appendChild(list);
  }
  if(id==='store'){
    const c = document.createElement('div');
    c.className='card';
    c.innerHTML = `<p>Connect all platforms globally.</p><button id="connect-all">Connect All</button>`;
    contentEl.appendChild(c);
    document.getElementById('connect-all').onclick = async ()=>{
      await connectAllGlobal();
      alert('All platforms connected (placeholders).');
    };
  }
  if(id==='chat'){
    const area = document.createElement('div');
    area.innerHTML = `
      <div class="card">
        <h3>Talk to Super AI</h3>
        <div class="chat-box">
          <input id="chat-input" placeholder="/run 1 hello | /connect all | /turbo on"/>
          <button id="send-chat">Send</button>
        </div>
        <pre id="chat-log"></pre>
      </div>`;
    contentEl.appendChild(area);
    document.getElementById('send-chat').onclick = async ()=>{
      const inp = document.getElementById('chat-input').value;
      const res = await superAI(inp);
      const log = document.getElementById('chat-log');
      log.textContent = (log.textContent + "\n> " + inp + "\n" + res).trim();
    };
  }
  if(id==='admin'){
    const box = document.createElement('div');
    box.className='card';
    box.innerHTML = `
      <h3>Admin</h3>
      <label>Admin Password <input id="admin-pass" type="password" placeholder="••••••"/></label>
      <div style="margin-top:8px">
        <button id="turbo-on">Turbo ON</button>
        <button id="turbo-off">Turbo OFF</button>
      </div>`;
    contentEl.appendChild(box);
    const pass = document.getElementById('admin-pass');
    const protect = (fn)=>()=>{
      if(pass.value!=='Bob@Bob0000'){ alert('Wrong password'); return; }
      fn();
    };
    document.getElementById('turbo-on').onclick = protect(async ()=>{
      await saveRemoteConfig({turbo:true});
      alert('Turbo enabled');
    });
    document.getElementById('turbo-off').onclick = protect(async ()=>{
      await saveRemoteConfig({turbo:false});
      alert('Turbo disabled');
    });
  }
  if(id==='settings'){
    const box = document.createElement('div');
    box.className='card';
    box.innerHTML = `
      <h3>Flexible Settings (AI-editable)</h3>
      <textarea id="raw-settings" placeholder="JSON settings..."></textarea>
      <button id="save-settings">Save</button>`;
    contentEl.appendChild(box);
    const cfg = await loadRemoteConfig();
    document.getElementById('raw-settings').value = JSON.stringify(cfg, null, 2);
    document.getElementById('save-settings').onclick = async ()=>{
      try{
        const next = JSON.parse(document.getElementById('raw-settings').value);
        await saveRemoteConfig(next);
        alert('Saved');
      }catch(e){ alert('Invalid JSON'); }
    };
  }
}
render('dashboard');

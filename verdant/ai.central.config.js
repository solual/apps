const GROQ_KEY   = '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';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const AI_NAME    = 'Verdant';
const SYSTEM_MSG = 'You are a helpful, direct, and thoughtful AI assistant. Be concise and clear. Use markdown for code and lists when appropriate.';

(function () {
  injectFonts();
  injectStyles();
  document.body.appendChild(buildDOM());
  initChat();
})();

function injectFonts() {
  if (document.getElementById('__chat_fonts')) return;
  const l = document.createElement('link');
  l.id   = '__chat_fonts';
  l.rel  = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(l);
}

function injectStyles() {
  if (document.getElementById('__chat_styles')) return;
  const s = document.createElement('style');
  s.id = '__chat_styles';
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    #__chat_root {
      --bg:      #000000;
      --surface: #0a0a0a;
      --raised:  #111111;
      --border:  #1e1e1e;
      --border2: #2a2a2a;
      --text:    #ffffff;
      --muted:   #555555;
      --dim:     #333333;
      --err:     #ff4444;
      --grid:    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%231a1a1a' stroke-width='1'/%3E%3C/svg%3E");
      --font:    'Plus Jakarta Sans', sans-serif;
      --radius:  8px;

      position: fixed;
      inset: 0;
      background-color: var(--bg);
      background-image: var(--grid);
      color: var(--text);
      font-family: var(--font);
      font-size: 14px;
      line-height: 1.7;
      display: flex;
      overflow: hidden;
      z-index: 9999;
    }

    #__chat_root ::-webkit-scrollbar { width: 4px; }
    #__chat_root ::-webkit-scrollbar-track { background: transparent; }
    #__chat_root ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

    #__chat_sidebar {
      width: 200px;
      flex-shrink: 0;
      background-color: var(--surface);
      background-image: var(--grid);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 24px 16px;
      gap: 28px;
    }

    #__chat_wordmark {
      font-size: 17px;
      font-weight: 600;
      color: var(--text);
      letter-spacing: -0.3px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #__chat_wordmark::before {
      content: '';
      display: block;
      width: 7px;
      height: 7px;
      border-radius: 2px;
      background: var(--text);
      flex-shrink: 0;
    }

    .__chat_section_label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 8px;
    }

    .__chat_sidebar_btn {
      width: 100%;
      background: none;
      border: none;
      color: var(--muted);
      font-family: var(--font);
      font-size: 13px;
      font-weight: 400;
      padding: 7px 10px;
      border-radius: 6px;
      cursor: pointer;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 9px;
      transition: background 0.15s, color 0.15s;
    }

    .__chat_sidebar_btn:hover {
      background: var(--raised);
      color: var(--text);
    }

    .__chat_sidebar_btn svg { flex-shrink: 0; opacity: 0.5; }

    #__chat_sidebar_bottom {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    #__chat_model_pill {
      background: var(--raised);
      border: 1px solid var(--border2);
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 10px;
      font-weight: 400;
      color: var(--muted);
    }

    #__chat_model_pill b {
      display: block;
      color: var(--text);
      font-weight: 600;
      font-size: 11px;
      margin-top: 2px;
    }

    #__chat_status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--muted);
      padding: 0 2px;
    }

    #__chat_pip {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--dim);
      flex-shrink: 0;
      transition: background 0.3s, box-shadow 0.3s;
    }

    #__chat_pip.ready    { background: #3a9e6a; box-shadow: 0 0 6px rgba(58,158,106,0.4); }
    #__chat_pip.thinking { background: #fff; box-shadow: 0 0 6px rgba(255,255,255,0.2); animation: __pip 1.2s infinite; }

    @keyframes __pip { 0%,100%{opacity:1}50%{opacity:0.2} }

    #__chat_main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    #__chat_topbar {
      height: 52px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 28px;
      flex-shrink: 0;
      background-color: var(--bg);
      background-image: var(--grid);
    }

    #__chat_topbar_title {
      font-size: 13px;
      font-weight: 500;
      color: var(--muted);
    }

    #__chat_topbar_count {
      margin-left: auto;
      font-size: 11px;
      color: var(--dim);
    }

    #__chat_messages {
      flex: 1;
      overflow-y: auto;
      padding: 32px 28px;
      display: flex;
      flex-direction: column;
      scroll-behavior: smooth;
      background-color: var(--bg);
      background-image: var(--grid);
    }

    #__chat_empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding-bottom: 40px;
      animation: __fadeup 0.4s ease both;
    }

    #__chat_empty_title {
      font-size: 36px;
      font-weight: 600;
      color: var(--text);
      letter-spacing: -1px;
      line-height: 1.15;
      margin-bottom: 12px;
    }

    #__chat_empty_sub {
      font-size: 13px;
      font-weight: 400;
      color: var(--muted);
      line-height: 1.8;
      margin-bottom: 32px;
      max-width: 320px;
    }

    #__chat_starters {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      max-width: 520px;
      width: 100%;
    }

    .__chat_starter {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px 14px;
      cursor: pointer;
      text-align: left;
      font-family: var(--font);
      font-size: 12px;
      font-weight: 400;
      color: var(--muted);
      transition: border-color 0.15s, color 0.15s;
      line-height: 1.6;
    }

    .__chat_starter:hover {
      border-color: var(--border2);
      color: var(--text);
    }

    .__chat_starter strong {
      display: block;
      font-weight: 600;
      font-size: 10px;
      color: var(--text);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .__chat_msg {
      display: grid;
      grid-template-columns: 26px 1fr;
      gap: 14px;
      padding: 20px 0;
      border-bottom: 1px solid var(--border);
      animation: __fadeup 0.2s ease both;
    }

    .__chat_msg:last-child { border-bottom: none; }

    @keyframes __fadeup {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .__chat_avatar {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .__chat_msg.user .__chat_avatar {
      background: var(--raised);
      border: 1px solid var(--border2);
      color: var(--muted);
    }

    .__chat_msg.ai .__chat_avatar {
      background: var(--text);
      color: var(--bg);
    }

    .__chat_msg_body { min-width: 0; }

    .__chat_msg_role {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--dim);
      margin-bottom: 7px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .__chat_msg.ai .__chat_msg_role { color: var(--muted); }

    .__chat_msg_role time {
      font-weight: 400;
      letter-spacing: 0;
      text-transform: none;
      opacity: 0.6;
    }

    .__chat_msg_text {
      font-size: 14px;
      font-weight: 400;
      line-height: 1.78;
      color: var(--text);
      word-break: break-word;
    }

    .__chat_msg.user .__chat_msg_text {
      color: var(--muted);
      white-space: pre-wrap;
    }

    .__chat_msg_text p { margin-bottom: 10px; }
    .__chat_msg_text p:last-child { margin-bottom: 0; }
    .__chat_msg_text ul, .__chat_msg_text ol { padding-left: 18px; margin: 8px 0; }
    .__chat_msg_text li { margin-bottom: 4px; }
    .__chat_msg_text strong { font-weight: 600; }
    .__chat_msg_text em { font-style: italic; color: #aaa; }

    .__chat_msg_text code {
      background: var(--raised);
      border: 1px solid var(--border2);
      border-radius: 4px;
      padding: 1px 6px;
      font-family: monospace;
      font-size: 12px;
      color: var(--text);
    }

    .__chat_msg_text pre {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px 16px;
      overflow-x: auto;
      margin: 12px 0;
    }

    .__chat_msg_text pre code {
      background: none;
      border: none;
      padding: 0;
      color: #ccc;
      font-size: 12px;
      line-height: 1.65;
    }

    .__chat_thinking {
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 3px 0;
    }

    .__chat_thinking span {
      width: 4px; height: 4px;
      border-radius: 50%;
      background: var(--muted);
      animation: __bounce 1.1s infinite;
    }

    .__chat_thinking span:nth-child(2) { animation-delay: .14s; }
    .__chat_thinking span:nth-child(3) { animation-delay: .28s; }

    @keyframes __bounce {
      0%,80%,100% { transform: translateY(0); opacity: 0.3; }
      40% { transform: translateY(-5px); opacity: 1; }
    }

    .__chat_err {
      color: var(--err);
      font-size: 12px;
      padding: 9px 13px;
      background: rgba(255,68,68,0.06);
      border: 1px solid rgba(255,68,68,0.15);
      border-radius: 7px;
    }

    #__chat_input_area {
      padding: 16px 28px 22px;
      border-top: 1px solid var(--border);
      flex-shrink: 0;
      background-color: var(--bg);
      background-image: var(--grid);
    }

    #__chat_input_wrap {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      background: var(--surface);
      border: 1px solid var(--border2);
      border-radius: 10px;
      padding: 11px 14px;
      transition: border-color 0.2s;
    }

    #__chat_input_wrap:focus-within {
      border-color: var(--muted);
    }

    #__chat_textarea {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: var(--text);
      font-family: var(--font);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.65;
      resize: none;
      max-height: 160px;
      overflow-y: auto;
    }

    #__chat_textarea::placeholder { color: var(--dim); }

    #__chat_send {
      width: 34px; height: 34px;
      border-radius: 8px;
      background: var(--text);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.15s, transform 0.15s;
      flex-shrink: 0;
      color: var(--bg);
    }

    #__chat_send:hover  { opacity: 0.85; transform: scale(1.04); }
    #__chat_send:active { transform: scale(0.96); }
    #__chat_send:disabled {
      background: var(--raised);
      color: var(--dim);
      cursor: not-allowed;
      transform: none;
      opacity: 1;
    }

    #__chat_send svg { width: 15px; height: 15px; }

    #__chat_hint {
      margin-top: 8px;
      font-size: 10px;
      color: var(--dim);
      text-align: center;
      letter-spacing: 0.03em;
    }

    @media (max-width: 600px) {
      #__chat_sidebar { display: none; }
      #__chat_messages { padding: 20px 16px; }
      #__chat_input_area { padding: 12px 16px 18px; }
      #__chat_starters { grid-template-columns: 1fr; }
      #__chat_empty_title { font-size: 28px; }
    }
  `;
  document.head.appendChild(s);
}

function buildDOM() {
  const root = el('div', { id: '__chat_root' });

  const sidebar = el('aside', { id: '__chat_sidebar' });
  sidebar.appendChild(el('div', { id: '__chat_wordmark', text: 'chat' }));

  const actions = el('div');
  actions.appendChild(el('div', { class: '__chat_section_label', text: 'Actions' }));
  const newBtn = el('button', { class: '__chat_sidebar_btn', html: svgRefresh() + ' New chat' });
  newBtn.onclick = clearChat;
  actions.appendChild(newBtn);
  sidebar.appendChild(actions);

  const bottom = el('div', { id: '__chat_sidebar_bottom' });
  bottom.innerHTML = `
    <div id="__chat_model_pill">Model<b id="__chat_model_name"></b></div>
    <div id="__chat_status"><div id="__chat_pip"></div><span id="__chat_status_text">–</span></div>
  `;
  sidebar.appendChild(bottom);
  root.appendChild(sidebar);

  const main = el('div', { id: '__chat_main' });

  const topbar = el('div', { id: '__chat_topbar' });
  topbar.innerHTML = `<span id="__chat_topbar_title">New conversation</span><span id="__chat_topbar_count"></span>`;
  main.appendChild(topbar);

  const msgs = el('div', { id: '__chat_messages' });
  msgs.appendChild(buildEmpty());
  main.appendChild(msgs);

  const inputArea = el('div', { id: '__chat_input_area' });
  const wrap = el('div', { id: '__chat_input_wrap' });
  const textarea = el('textarea', { id: '__chat_textarea', attr: { rows: '1', placeholder: 'Message…' } });
  const send = el('button', { id: '__chat_send', html: svgSend(), attr: { disabled: true } });
  wrap.appendChild(textarea);
  wrap.appendChild(send);
  inputArea.appendChild(wrap);
  inputArea.appendChild(el('div', { id: '__chat_hint', text: 'Enter to send · Shift+Enter for newline' }));
  main.appendChild(inputArea);

  root.appendChild(main);
  return root;
}

function buildEmpty() {
  const d = el('div', { id: '__chat_empty' });
  d.innerHTML = `
    <div id="__chat_empty_title">Welcome to<br>Verdant</div>
    <div id="__chat_empty_sub">created by solo central</div>
    <div id="__chat_starters">
      <button class="__chat_starter" data-prompt="What is the best UBG Site?</button>
      <button class="__chat_starter" data-prompt="is ADG a larp larp larp sahuurrrr?</button>
    </div>
  `;
  return d;
}

function initChat() {
  const textarea = document.getElementById('__chat_textarea');
  const send     = document.getElementById('__chat_send');

  document.getElementById('__chat_model_name').textContent = GROQ_MODEL.split('-').slice(0, 3).join('-');

  textarea.addEventListener('input', () => {
    autoResize(textarea);
    send.disabled = !textarea.value.trim() || busy;
  });

  textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  send.onclick = sendMessage;

  document.getElementById('__chat_starters').addEventListener('click', e => {
    const btn = e.target.closest('.__chat_starter');
    if (!btn) return;
    textarea.value = btn.dataset.prompt;
    autoResize(textarea);
    send.disabled = false;
    textarea.focus();
  });

  setStatus('ready');
}

let history  = [];
let busy     = false;
let msgCount = 0;

function setStatus(s) {
  const pip = document.getElementById('__chat_pip');
  const txt = document.getElementById('__chat_status_text');
  pip.className = '';
  if (s === 'ready')    { pip.classList.add('ready');    txt.textContent = 'Ready'; }
  if (s === 'thinking') { pip.classList.add('thinking'); txt.textContent = 'Thinking…'; }
}

function updateCount() {
  const node = document.getElementById('__chat_topbar_count');
  node.textContent = msgCount > 0 ? `${msgCount} message${msgCount !== 1 ? 's' : ''}` : '';
}

function clearChat() {
  history = []; msgCount = 0;
  document.getElementById('__chat_messages').innerHTML = '';
  document.getElementById('__chat_messages').appendChild(buildEmpty());
  document.getElementById('__chat_topbar_title').textContent = 'New conversation';
  updateCount();
  setStatus('ready');
}

async function sendMessage() {
  const textarea = document.getElementById('__chat_textarea');
  const text = textarea.value.trim();
  if (!text || busy) return;

  if (!GROQ_KEY || GROQ_KEY === 'GROK_KEY') {
    alert('endes the key is ron');
    return;
  }

  textarea.value = '';
  textarea.style.height = 'auto';
  document.getElementById('__chat_send').disabled = true;
  busy = true;
  setStatus('thinking');

  document.getElementById('__chat_empty')?.remove();
  document.getElementById('__chat_topbar_title').textContent = text.slice(0, 42) + (text.length > 42 ? '…' : '');

  appendMsg('user', text);
  history.push({ role: 'user', content: text });
  msgCount++;

  const thinkingRow = appendThinking();

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1024,
        messages: [{ role: 'system', content: SYSTEM_MSG }, ...history]
      })
    });

    thinkingRow.remove();

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const body = appendMsg('ai', '');
      body.innerHTML = `<div class="__chat_err">uh oh ${err?.error?.message || `HTTP ${res.status}`}</div>`;
      history.pop(); msgCount--;
    } else {
      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content || '(no response)';
      appendMsg('ai', reply);
      history.push({ role: 'verdant', content: reply });
      msgCount++;
    }
  } catch (e) {
    thinkingRow.remove();
    const body = appendMsg('ai', '');
    body.innerHTML = `<div class="__chat_err">uh oh ${e.message}</div>`;
    history.pop(); msgCount--;
  }

  busy = false;
  setStatus('ready');
  updateCount();
  const ta = document.getElementById('__chat_textarea');
  if (ta.value.trim()) document.getElementById('__chat_send').disabled = false;
}

function appendMsg(role, text) {
  const msgs = document.getElementById('__chat_messages');
  const row  = document.createElement('div');
  row.className = `__chat_msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = '__chat_avatar';
  avatar.textContent = role === 'user' ? 'U' : 'AI';

  const body = document.createElement('div');
  body.className = '__chat_msg_body';

  const roleLine = document.createElement('div');
  roleLine.className = '__chat_msg_role';
  roleLine.innerHTML = `${role === 'user' ? 'You' : AI_NAME} <time>${nowStr()}</time>`;

  const textDiv = document.createElement('div');
  textDiv.className = '__chat_msg_text';
  if (role === 'ai') textDiv.innerHTML = renderMarkdown(text);
  else textDiv.textContent = text;

  body.appendChild(roleLine);
  body.appendChild(textDiv);
  row.appendChild(avatar);
  row.appendChild(body);
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
  return textDiv;
}

function appendThinking() {
  const msgs = document.getElementById('__chat_messages');
  const row  = document.createElement('div');
  row.className = '__chat_msg ai';

  const avatar = document.createElement('div');
  avatar.className = '__chat_avatar';
  avatar.textContent = 'SC';

  const body = document.createElement('div');
  body.className = '__chat_msg_body';

  const roleLine = document.createElement('div');
  roleLine.className = '__chat_msg_role';
  roleLine.innerHTML = `Verdant <time>${nowStr()}</time>`;

  const dots = document.createElement('div');
  dots.className = '__chat_thinking';
  dots.innerHTML = '<span></span><span></span><span></span>';

  body.appendChild(roleLine);
  body.appendChild(dots);
  row.appendChild(avatar);
  row.appendChild(body);
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
  return row;
}

function renderMarkdown(raw) {
  let s = raw
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');

  s = s.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code>${code.trimEnd()}</code></pre>`
  );
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  s = s.replace(/^[ \t]*[-*] (.+)$/gm, '<li>$1</li>');
  s = s.replace(/(<li>[\s\S]+?<\/li>)(?=\n(?!<li>)|$)/g, '<ul>$1</ul>');
  s = s.replace(/^[ \t]*\d+\. (.+)$/gm, '<li>$1</li>');
  s = s.split(/\n{2,}/).map(block => {
    if (block.startsWith('<ul>') || block.startsWith('<pre>') || block.startsWith('<li>')) return block;
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  return s;
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

function nowStr() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.id)    node.id = opts.id;
  if (opts.class) node.className = opts.class;
  if (opts.text)  node.textContent = opts.text;
  if (opts.html)  node.innerHTML = opts.html;
  if (opts.attr)  Object.entries(opts.attr).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function svgSend() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`;
}

function svgRefresh() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>`;
}
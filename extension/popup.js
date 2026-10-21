const PROVIDERS = { claude: 'Claude', chatgpt: 'ChatGPT' };
const $ = s => document.querySelector(s);

function decode(code) {
  const m = /^AUM1\.([A-Za-z0-9_-]+)$/.exec(code.trim());
  if (!m) throw new Error('This is not a valid code.');
  const bin = atob(m[1].replace(/-/g, '+').replace(/_/g, '/'));
  const o = JSON.parse(decodeURIComponent(escape(bin)));
  if (o.v !== 1 || !PROVIDERS[o.s] || typeof o.t !== 'string' || o.t.length < 20 || !Number.isInteger(o.p)) throw new Error('This code is not supported.');
  return { provider: o.s, label: String(o.l || PROVIDERS[o.s]).slice(0, 60), token: o.t, port: o.p };
}

async function render() {
  const { links = [] } = await chrome.storage.local.get('links');
  const box = $('#links');
  box.textContent = '';
  for (const l of links) {
    const d = document.createElement('div'); d.className = 'link';
    const t = document.createElement('div'); t.className = 't';
    const b = document.createElement('b'); b.textContent = `${l.label} (${PROVIDERS[l.provider]})`;
    const s = document.createElement('small');
    if (l.last) { s.textContent = (l.last.ok ? '✓ ' : '⚠ ') + l.last.msg + ' · ' + new Date(l.last.at).toLocaleTimeString(); s.className = l.last.ok ? 'ok' : 'bad'; }
    else s.textContent = 'Waiting for the first report…';
    t.append(b, s);
    const x = document.createElement('button'); x.textContent = '✕'; x.title = 'Remove';
    x.onclick = async () => { await chrome.storage.local.set({ links: links.filter(k => k.token !== l.token) }); render(); };
    d.append(t, x); box.append(d);
  }
}

$('#add').onclick = async () => {
  $('#msg').textContent = '';
  try {
    const link = decode($('#code').value);
    const { links = [] } = await chrome.storage.local.get('links');
    await chrome.storage.local.set({ links: [...links.filter(k => k.token !== link.token), link] });
    $('#code').value = '';
    chrome.runtime.sendMessage({ type: 'syncNow' }, render);
    render();
  } catch (e) { $('#msg').textContent = e.message; }
};
$('#now').onclick = () => { $('#msg').textContent = ''; chrome.runtime.sendMessage({ type: 'syncNow' }, render); };
render();
setInterval(render, 4000);

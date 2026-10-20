const $ = (s) => document.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'style') e.style.cssText = v;
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) {
    if (c === null || c === undefined || c === false) continue;
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
};

let accounts = [];
let providers = {};
let results = JSON.parse(localStorage.getItem('results') || '{}');
const loading = new Set();
const expiredHandled = new Set();
let timer = null;

/* ---------- formatting ---------- */
const fmtNum = (n) => Number(n).toLocaleString('en-US');
function fmtDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), hh = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  if (d) return `${d}d ${hh}h ${m}m`;
  if (hh) return `${hh}h ${m}m ${ss}s`;
  return `${m}m ${ss}s`;
}
const fmtTime = (ts) => new Date(ts).toLocaleString('en-GB', {
  weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
});

/* ---------- rendering ---------- */
function meterEl(m, accId) {
  const used = Math.min(100, Math.max(0, m.usedPct));
  const cls = used >= 90 ? 'bad' : used >= 70 ? 'warn' : '';
  const remainText = m.limit != null
    ? `${fmtNum(m.remaining)} / ${fmtNum(m.limit)} ${m.unit || ''} باقی‌مانده`
    : `${(100 - used).toFixed(0)}% باقی‌مانده`;
  const usedText = m.limit != null
    ? `${fmtNum(m.used)} ${m.unit || ''} مصرف · ${used.toFixed(0)}%`
    : `${used.toFixed(0)}% مصرف`;
  return h('div', { class: 'meter' },
    h('div', { class: 'mhead' }, h('span', {}, m.label), h('span', {}, usedText)),
    h('div', { class: 'bar' }, h('i', { class: cls, style: `width:${used}%` })),
    h('div', { class: 'mfoot' },
      h('span', {}, remainText),
      m.resetsAt
        ? h('span', {}, 'ریست: ', h('span', { class: 'countdown', 'data-ts': m.resetsAt, 'data-acc': accId }, ''), ` (${fmtTime(m.resetsAt)})`)
        : null));
}

function cardEl(acc) {
  const r = results[acc.id];
  const p = providers[acc.type] || { label: acc.type };
  const body = [];
  if (loading.has(acc.id) && !r) body.push(h('div', { class: 'spin' }, 'در حال دریافت…'));
  if (r) {
    if (r.status === 'error') body.push(h('div', { class: 'badge error' }, '⚠ ' + r.error));
    if (r.status === 'limited') body.push(h('div', { class: 'badge limited' }, 'محدودیت فعال است'));
    if (r.status === 'info') body.push(h('div', { class: 'badge info' }, 'اتصال برقرار است'));
    (r.meters || []).forEach((m) => body.push(meterEl(m, acc.id)));
    if (r.resetsAt) {
      body.push(h('div', { class: 'mfoot' }, h('span', {}, 'آزاد شدن:'),
        h('span', { class: 'countdown', 'data-ts': r.resetsAt, 'data-acc': acc.id }, '')));
    }
    if (r.note) body.push(h('p', { class: 'note' }, r.note));
    if (r.link) body.push(h('p', { class: 'note' }, h('a', { onclick: () => window.api.openExternal(r.link) }, 'باز کردن صفحه‌ی مصرف')));
    body.push(h('div', { class: 'foot' }, 'آخرین به‌روزرسانی: ' + new Date(r.fetchedAt).toLocaleTimeString('en-GB')));
  }
  return h('div', { class: `card ${acc.vendor}` },
    h('div', { class: 'chead' },
      h('div', {},
        h('div', { class: 'cname' }, acc.name, r && r.plan ? h('span', { class: 'plan' }, r.plan) : null),
        h('div', { class: 'ctype' }, p.label)),
      h('div', { class: 'cbtns' },
        h('button', { class: 'btn icon', title: 'به‌روزرسانی', onclick: () => refresh(acc.id) }, loading.has(acc.id) ? '…' : '↻'),
        h('button', { class: 'btn icon', title: 'حذف', onclick: () => removeAcc(acc) }, '✕'))),
    body);
}

function render() {
  const grid = $('#grid');
  grid.replaceChildren(...accounts.map(cardEl));
  $('#empty').hidden = accounts.length > 0;
  tick();
}

function tick() {
  const now = Date.now();
  document.querySelectorAll('.countdown').forEach((el) => {
    const ts = Number(el.dataset.ts);
    const left = ts - now;
    if (left > 0) { el.textContent = fmtDuration(left); return; }
    el.textContent = 'اکنون قابل استفاده';
    const key = el.dataset.acc + ':' + ts;
    if (!expiredHandled.has(key)) {
      expiredHandled.add(key);
      setTimeout(() => refresh(el.dataset.acc), 3000);
    }
  });
}

/* ---------- actions ---------- */
async function refresh(id) {
  if (loading.has(id)) return;
  loading.add(id); render();
  try { results[id] = await window.api.fetchUsage(id); }
  catch (e) { results[id] = { status: 'error', error: e.message, fetchedAt: Date.now() }; }
  loading.delete(id);
  localStorage.setItem('results', JSON.stringify(results));
  $('#lastUpdate').textContent = 'آخرین به‌روزرسانی: ' + new Date().toLocaleTimeString('en-GB');
  render();
}
const refreshAll = () => Promise.all(accounts.map((a) => refresh(a.id)));

async function removeAcc(acc) {
  if (!confirm(`اکانت «${acc.name}» حذف شود؟`)) return;
  await window.api.remove(acc.id);
  delete results[acc.id];
  accounts = await window.api.accounts();
  render();
}

function schedule() {
  clearInterval(timer);
  const s = Number($('#interval').value);
  localStorage.setItem('interval', String(s));
  if (s > 0) timer = setInterval(refreshAll, s * 1000);
}

/* ---------- add dialog ---------- */
function syncDialog() {
  const t = $('#fType').value;
  const p = providers[t];
  $('#fHelp').textContent = p.help;
  $('#fLocal').hidden = !p.hasLocal;
}

function openDialog() {
  $('#fName').value = ''; $('#fInput').value = ''; $('#fError').hidden = true;
  syncDialog();
  $('#dlg').showModal();
}

async function saveDialog() {
  const type = $('#fType').value;
  try {
    await window.api.add({ type, name: $('#fName').value.trim() || providers[type].label, input: $('#fInput').value });
    $('#dlg').close();
    accounts = await window.api.accounts();
    render();
    refresh(accounts[accounts.length - 1].id);
  } catch (e) {
    $('#fError').textContent = (e.message || String(e)).replace(/^Error invoking remote method '[^']+': (Error: )?/, '');
    $('#fError').hidden = false;
  }
}

/* ---------- init ---------- */
(async function init() {
  providers = await window.api.providers();
  const sel = $('#fType');
  Object.entries(providers).forEach(([k, v]) => sel.append(h('option', { value: k }, v.label)));
  sel.addEventListener('change', syncDialog);

  $('#addBtn').addEventListener('click', openDialog);
  $('#fCancel').addEventListener('click', () => $('#dlg').close());
  $('#fSave').addEventListener('click', saveDialog);
  $('#fLocal').addEventListener('click', async () => {
    const t = await window.api.readLocal($('#fType').value);
    if (t) $('#fInput').value = t;
    else { $('#fError').textContent = 'فایل روی این کامپیوتر پیدا نشد.'; $('#fError').hidden = false; }
  });
  $('#refreshAll').addEventListener('click', refreshAll);
  $('#interval').value = localStorage.getItem('interval') || '60';
  $('#interval').addEventListener('change', schedule);

  accounts = await window.api.accounts();
  render();
  schedule();
  setInterval(tick, 1000);
  refreshAll();
})();

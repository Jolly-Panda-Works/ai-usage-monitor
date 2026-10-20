let state = { accounts: [], settings: { intervalMin: 5 } };
const $ = s => document.querySelector(s);
const NAMES = { claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini', figma: 'Figma' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');

function fmt(ms) {
  if (ms <= 0) return 'همین الان';
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return [d ? d + ' روز' : '', h ? h + ' ساعت' : '', m ? m + ' دقیقه' : '', !d && !h ? x + ' ثانیه' : ''].filter(Boolean).join(' و ');
}
const localInput = ms => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const num = v => Math.round(v * 10) / 10;

function winHtml(w) {
  const used = Math.min(100, Math.max(0, w.usedPct || 0));
  const cls = used < 70 ? 'ok' : used < 90 ? 'warn' : 'bad';
  const counts = w.limit != null ? ` (${num(w.used)} از ${w.limit})` : '';
  let reset = '<span>زمان ریست نامشخص</span>';
  if (w.resetsAt) {
    const label = used >= 100 ? 'قابل استفاده می‌شود تا' : 'ریست تا';
    reset = `<span>${label}: <b data-reset="${w.resetsAt}"></b></span><span>${new Date(w.resetsAt).toLocaleString('fa-IR')}</span>`;
  }
  return `<div class="win"><div class="row"><span>${esc(w.label)}</span><span>مصرف: <b>${num(used)}٪</b> · باقی‌مانده: <b>${num(100 - used)}٪</b>${counts}</span></div>
  <div class="track"><div class="fill ${cls}" style="width:${used}%"></div></div><div class="meta">${reset}</div></div>`;
}

function manualHtml(a) {
  const m = a.manual; if (!m) return '';
  return `<details><summary>تنظیم سهمیه و شمارنده</summary>
  <div class="q"><button data-act="inc" data-n="1">+۱ مصرف</button><button data-act="inc" data-n="10">+۱۰</button><button data-act="inc" data-n="-1">−۱</button></div>
  <div class="grid">
   <label>عنوان<input data-f="label" value="${esc(m.label)}"></label>
   <label>سقف سهمیه<input data-f="limit" type="number" value="${m.limit}"></label>
   <label>مصرف شده<input data-f="used" type="number" value="${m.used}"></label>
   <label>طول بازه (ساعت)<input data-f="periodHours" type="number" value="${m.periodHours}"></label>
   <label style="grid-column:1/-1">زمان ریست بعدی<input data-f="resetsAt" type="datetime-local" value="${localInput(m.resetsAt)}"></label>
  </div><div class="q"><button data-act="saveManual" class="primary">ذخیره</button></div></details>`;
}

function render() {
  const list = $('#list');
  if (!state.accounts.length) { list.innerHTML = '<div class="empty">هنوز اکانتی اضافه نکردی.<br>سرویس را انتخاب کن و «افزودن اکانت» را بزن؛ پنجره ورود باز می‌شود.</div>'; return; }
  list.innerHTML = state.accounts.map(a => {
    const d = a.data || {};
    let err = '';
    if (d.error === 'NOT_LOGGED_IN') err = '<div class="err">وارد حساب نشده‌ای یا نشست منقضی شده. روی «ورود» بزن.</div>';
    else if (d.error) err = `<div class="err">خطا: ${esc(d.error)}</div>`;
    const sub = [d.email, d.plan].filter(Boolean).join(' · ');
    return `<div class="card" data-id="${a.id}">
      <div class="head"><span class="badge p-${a.provider}">${NAMES[a.provider]}</span><b>${esc(a.label)}</b>
        <div class="btns"><button data-act="login">${a.manual ? 'باز کردن سایت' : 'ورود / اتصال'}</button><button data-act="refresh">⟳</button><button data-act="remove">✕</button></div>
        ${sub ? `<small>${esc(sub)}</small>` : ''}</div>
      ${err}${(d.windows || []).map(winHtml).join('')}
      ${d.note ? `<div class="note">${esc(d.note)}</div>` : ''}
      ${!a.data ? '<div class="note">در حال دریافت...</div>' : ''}
      ${manualHtml(a)}
      ${d.updatedAt ? `<div class="upd">آخرین بروزرسانی: ${new Date(d.updatedAt).toLocaleTimeString('fa-IR')}</div>` : ''}
    </div>`;
  }).join('');
  tick();
}

function tick() {
  document.querySelectorAll('[data-reset]').forEach(el => { el.textContent = fmt(Number(el.dataset.reset) - Date.now()); });
}
setInterval(tick, 1000);

function setState(s) {
  state = s;
  if (document.activeElement && document.activeElement.closest && document.activeElement.closest('.card') && document.activeElement.tagName === 'INPUT') return;
  render();
}

$('#list').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const card = b.closest('.card'); const id = card.dataset.id; const act = b.dataset.act;
  if (act === 'login') api.login(id);
  else if (act === 'refresh') api.refresh(id);
  else if (act === 'remove') { if (confirm('این اکانت حذف شود؟')) api.remove(id); }
  else if (act === 'inc') api.manualInc(id, Number(b.dataset.n));
  else if (act === 'saveManual') {
    const patch = {};
    card.querySelectorAll('[data-f]').forEach(i => {
      const f = i.dataset.f;
      if (f === 'label') patch.label = i.value;
      else if (f === 'resetsAt') { const t = new Date(i.value).getTime(); if (!isNaN(t)) patch.resetsAt = t; }
      else patch[f] = Number(i.value) || 0;
    });
    api.manualUpdate(id, patch).then(() => api.getState().then(s => { state = s; render(); }));
  }
});
$('#add').onclick = () => { api.add($('#prov').value, $('#lbl').value.trim()); $('#lbl').value = ''; };
$('#all').onclick = () => api.refreshAll();
$('#iv').onchange = e => api.setSettings({ intervalMin: Math.max(1, Number(e.target.value) || 5) });

api.onState(setState);
api.getState().then(s => { state = s; $('#iv').value = s.settings.intervalMin; render(); });

const I18N = {
  en: {
    refreshAll: '⟳ Refresh all', settings: 'Settings', accounts: 'Accounts', all: 'All accounts',
    overview: 'Usage overview', overviewSub: 'Live usage and reset times for all your AI accounts — signed in through your own browser.',
    labelPh: 'Account name (e.g. Claude personal)', addAccount: '+ Add account',
    empty: 'No accounts yet.<br>Pick a service and press “Add account” — a sign-in window will open.',
    signIn: 'Sign in / Connect', openSite: 'Open site', refresh: 'Refresh', remove: 'Remove',
    confirmRemove: 'Remove this account?', used: 'Used', left: 'Left',
    resetsIn: 'Resets in', availableIn: 'Available again in', resetUnknown: 'Reset time unknown',
    updated: 'Last updated', loading: 'Loading…',
    notLoggedIn: 'Not signed in on the linked browser. Sign in there — it updates within a minute.', error: 'Error',
    NO_USAGE: 'No usage data was returned for this account.',
    NO_PLAN_USAGE: 'Connected, but the service returned no usage data for this plan.',
    MANUAL: 'This service has no usage API for personal accounts — this is a manual counter.',
    manualSummary: 'Quota & counter settings', title: 'Title', limit: 'Quota limit', usedLbl: 'Used',
    period: 'Period (hours)', nextReset: 'Next reset', save: 'Save',
    language: 'Language', interval: 'Auto-refresh every (minutes)', about: 'About', developer: 'Developer', close: 'Close',
    w: { '5-hour': '5-hour window', 'Weekly': 'Weekly window', 'Weekly Opus': 'Weekly Opus', 'Weekly Sonnet': 'Weekly Sonnet', 'Quota': 'Quota' },
    hour: '-hour window', day: '-day window',
    d: 'd', h: 'h', m: 'm', s: 's', now: 'now',
    done: 'Done', connect: 'Connect', linked: 'Linked', waitingExt: 'Waiting for the browser extension…',
    connectTitle: 'Connect {service}',
    step1: 'Sign in to {service} in your own browser (Chrome, Edge or Brave) — any method works, including Google and passkeys. Nothing is opened inside this app.',
    signInBrowser: 'Open sign-in page in my browser',
    step2: 'Install the Connector extension once: open the folder below, then in your browser go to chrome://extensions, turn on “Developer mode”, press “Load unpacked” and pick that folder.',
    openFolder: 'Open extension folder',
    step3: 'Click the extension icon, paste this code and press Connect. For several accounts, use a separate browser profile for each and paste that account’s own code.',
    copyCode: 'Copy code', copied: 'Copied ✓',
    connectNote: 'The extension reads your usage in your browser and sends it only to this app on your PC, every minute.',
    portBusy: 'The local connection port is busy. Close other copies of the app and restart it.',
    checkUpdates: 'Check for updates', restartUpdate: 'Restart and update',
    u_idle: '', u_checking: 'Checking for updates…', u_latest: 'You have the latest version.',
    u_downloading: 'Downloading update {v}{p}…', u_ready: 'Update {v} is ready.', u_error: 'Update check failed.',
    u_portable: 'Portable build — updates are not automatic.', u_dev: 'Development build.',
  },
  fa: {
    refreshAll: '⟳ بروزرسانی همه', settings: 'تنظیمات', accounts: 'اکانت‌ها', all: 'همه اکانت‌ها',
    overview: 'نمای کلی مصرف', overviewSub: 'مصرف لحظه‌ای و زمان ریست همه اکانت‌های هوش مصنوعی شما.',
    labelPh: 'نام اکانت (مثلاً Claude شخصی)', addAccount: '+ افزودن اکانت',
    empty: 'هنوز اکانتی اضافه نشده.<br>یک سرویس انتخاب کن و «افزودن اکانت» را بزن؛ پنجره ورود باز می‌شود.',
    signIn: 'ورود / اتصال', openSite: 'باز کردن سایت', refresh: 'بروزرسانی', remove: 'حذف',
    confirmRemove: 'این اکانت حذف شود؟', used: 'مصرف', left: 'باقی‌مانده',
    resetsIn: 'ریست تا', availableIn: 'قابل استفاده تا', resetUnknown: 'زمان ریست نامشخص',
    updated: 'آخرین بروزرسانی', loading: 'در حال دریافت…',
    notLoggedIn: 'در مرورگر متصل وارد حساب نشده‌ای. همان‌جا وارد شو؛ ظرف یک دقیقه بروز می‌شود.', error: 'خطا',
    NO_USAGE: 'اطلاعات مصرفی برای این اکانت برنگشت.',
    NO_PLAN_USAGE: 'متصل است ولی سرویس برای این پلن اطلاعات مصرف نداد.',
    MANUAL: 'این سرویس برای اکانت شخصی API مصرف ندارد؛ این یک شمارنده دستی است.',
    manualSummary: 'تنظیم سهمیه و شمارنده', title: 'عنوان', limit: 'سقف سهمیه', usedLbl: 'مصرف شده',
    period: 'طول بازه (ساعت)', nextReset: 'زمان ریست بعدی', save: 'ذخیره',
    language: 'زبان', interval: 'بروزرسانی خودکار هر (دقیقه)', about: 'درباره', developer: 'توسعه‌دهنده', close: 'بستن',
    w: { '5-hour': 'بازه ۵ ساعته', 'Weekly': 'بازه هفتگی', 'Weekly Opus': 'هفتگی Opus', 'Weekly Sonnet': 'هفتگی Sonnet', 'Quota': 'سهمیه' },
    hour: ' ساعته', day: ' روزه',
    d: ' روز', h: ' ساعت', m: ' دقیقه', s: ' ثانیه', now: 'همین الان',
    done: 'تمام', connect: 'اتصال', linked: 'متصل', waitingExt: 'در انتظار افزونه مرورگر…',
    connectTitle: 'اتصال {service}',
    step1: 'داخل مرورگر خودت (Chrome، Edge یا Brave) وارد {service} شو؛ هر روشی (حتی گوگل و passkey) جواب می‌دهد. چیزی داخل خود اپ باز نمی‌شود.',
    signInBrowser: 'باز کردن صفحه ورود در مرورگر من',
    step2: 'افزونه Connector را یک‌بار نصب کن: پوشه زیر را باز کن، سپس در مرورگر به chrome://extensions برو، «Developer mode» را روشن کن، «Load unpacked» را بزن و همان پوشه را انتخاب کن.',
    openFolder: 'باز کردن پوشه افزونه',
    step3: 'روی آیکن افزونه کلیک کن، این کد را بچسبان و Connect را بزن. برای چند اکانت، برای هر اکانت یک پروفایل مرورگر جدا استفاده کن و کد همان اکانت را بچسبان.',
    copyCode: 'کپی کد', copied: 'کپی شد ✓',
    connectNote: 'افزونه مصرف را داخل مرورگر خودت می‌خواند و هر دقیقه فقط به همین اپ روی کامپیوترت می‌فرستد.',
    portBusy: 'پورت اتصال محلی اشغال است. نسخه‌های دیگر اپ را ببند و دوباره اجرا کن.',
    checkUpdates: 'بررسی آپدیت', restartUpdate: 'راه‌اندازی مجدد و آپدیت',
    u_idle: '', u_checking: 'در حال بررسی آپدیت…', u_latest: 'آخرین نسخه را داری.',
    u_downloading: 'در حال دانلود آپدیت {v}{p}…', u_ready: 'آپدیت {v} آماده است.', u_error: 'بررسی آپدیت ناموفق بود.',
    u_portable: 'نسخه پرتابل — آپدیت خودکار ندارد.', u_dev: 'نسخه توسعه.',
  }
};
const NAMES = { claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini', figma: 'Figma' };
let state = { accounts: [], settings: { intervalMin: 5, lang: 'en' } };
let filter = 'all';
const $ = s => document.querySelector(s);
const T = () => I18N[state.settings.lang] || I18N.en;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const num = v => Math.round(v * 10) / 10;
const locale = () => (state.settings.lang === 'fa' ? 'fa-IR' : undefined);

function fmt(ms) {
  const t = T();
  if (ms <= 0) return t.now;
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return [d ? d + t.d : '', h ? h + t.h : '', m ? m + t.m : '', !d && !h ? x + t.s : ''].filter(Boolean).join(' ');
}
const localInput = ms => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };

function winLabel(l) {
  const t = T();
  if (t.w[l]) return t.w[l];
  let m = /^(\d+)-hour$/.exec(l); if (m) return state.settings.lang === 'fa' ? m[1] + t.hour : m[1] + t.hour;
  m = /^(\d+)-day$/.exec(l); if (m) return m[1] + t.day;
  return l;
}

function winHtml(w) {
  const t = T();
  const used = Math.min(100, Math.max(0, w.usedPct || 0));
  const cls = used < 70 ? 'ok' : used < 90 ? 'warn' : 'bad';
  const counts = w.limit != null ? ` (<bdi>${num(w.used)}/${w.limit}</bdi>)` : '';
  let reset = `<span>${t.resetUnknown}</span>`;
  if (w.resetsAt) {
    const label = used >= 100 ? t.availableIn : t.resetsIn;
    reset = `<span>${label}: <b data-reset="${w.resetsAt}"></b></span><span><bdi>${new Date(w.resetsAt).toLocaleString(locale())}</bdi></span>`;
  }
  return `<div class="win"><div class="rowt"><span>${esc(winLabel(w.label))}</span><span>${t.used}: <b><bdi>${num(used)}%</bdi></b> · ${t.left}: <b><bdi>${num(100 - used)}%</bdi></b>${counts}</span></div>
  <div class="track"><div class="fill ${cls}" style="width:${used}%"></div></div><div class="meta">${reset}</div></div>`;
}

function manualHtml(a) {
  const m = a.manual; if (!m) return '';
  const t = T();
  return `<details><summary>${t.manualSummary}</summary>
  <div class="q"><button data-act="inc" data-n="1">+1</button><button data-act="inc" data-n="10">+10</button><button data-act="inc" data-n="-1">−1</button></div>
  <div class="grid">
   <label>${t.title}<input data-f="label" value="${esc(m.label)}"></label>
   <label>${t.limit}<input data-f="limit" type="number" value="${m.limit}"></label>
   <label>${t.usedLbl}<input data-f="used" type="number" value="${m.used}"></label>
   <label>${t.period}<input data-f="periodHours" type="number" value="${m.periodHours}"></label>
   <label style="grid-column:1/-1">${t.nextReset}<input data-f="resetsAt" type="datetime-local" value="${localInput(m.resetsAt)}"></label>
  </div><div class="q"><button data-act="saveManual" class="primary">${t.save}</button></div></details>`;
}

function renderNav() {
  const items = [['all', '★', T().all, state.accounts.length], ...Object.keys(NAMES).map(k => [k, NAMES[k][0], NAMES[k], state.accounts.filter(a => a.provider === k).length])];
  $('#nav').innerHTML = items.map(([k, ic, name, n]) => `<li data-f="${k}" class="${filter === k ? 'on' : ''}"><span class="dot">${ic}</span><span>${name}</span><span class="n">${n}</span></li>`).join('');
}

function applyI18n() {
  const t = T();
  document.documentElement.lang = state.settings.lang;
  document.documentElement.dir = state.settings.lang === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i]').forEach(el => { el.textContent = t[el.dataset.i]; });
  document.querySelectorAll('[data-ph]').forEach(el => { el.placeholder = t[el.dataset.ph]; });
  renderUpdate();
}

const LINK_FRESH_MS = 5 * 60 * 1000;
const isLinked = a => a.lastSeen && Date.now() - a.lastSeen < LINK_FRESH_MS;

function render() {
  const t = T();
  applyI18n(); renderNav();
  const accs = state.accounts.filter(a => filter === 'all' || a.provider === filter);
  const list = $('#list');
  if (!accs.length) { list.innerHTML = `<div class="empty">${t.empty}</div>`; return; }
  list.innerHTML = accs.map(a => {
    const d = a.data || {};
    const ext = a.kind === 'extension';
    let err = '';
    if (d.error === 'NOT_LOGGED_IN') err = `<div class="err">${t.notLoggedIn}</div>`;
    else if (d.error) err = `<div class="err">${t.error}: ${esc(d.error)}</div>`;
    const sub = [d.email, d.plan].filter(Boolean).join(' · ');
    const chip = ext ? `<span class="chip ${isLinked(a) ? '' : 'wait'}">${isLinked(a) ? '● ' + t.linked : t.waitingExt}</span>` : '';
    const buttons = ext
      ? `<button data-act="connect">${t.connect}</button><button data-act="remove" title="${t.remove}">✕</button>`
      : `<button data-act="site">${t.openSite}</button><button data-act="remove" title="${t.remove}">✕</button>`;
    return `<div class="card" data-id="${a.id}">
      <div class="head"><span class="badge p-${a.provider}">${NAMES[a.provider]}</span><b>${esc(a.label)}</b> ${chip}
        <div class="btns">${buttons}</div>
        ${sub ? `<small>${esc(sub)}</small>` : ''}</div>
      ${err}${(d.windows || []).map(winHtml).join('')}
      ${d.note && t[d.note] ? `<div class="note">${t[d.note]}</div>` : ''}
      ${!a.data && !ext ? `<div class="note">${t.loading}</div>` : ''}
      ${!a.data && ext ? `<div class="note">${t.waitingExt}</div>` : ''}
      ${manualHtml(a)}
      ${d.updatedAt ? `<div class="upd">${t.updated}: <bdi>${new Date(d.updatedAt).toLocaleTimeString(locale())}</bdi></div>` : ''}
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
  const ae = document.activeElement;
  if (ae && ae.tagName === 'INPUT' && ae.closest('.card')) return;
  render();
}

// ---- connect dialog (sign-in happens in the user's own browser) ----
let connectId = null;
async function openConnect(id) {
  const a = state.accounts.find(x => x.id === id); if (!a) return;
  connectId = id;
  const t = T(), name = NAMES[a.provider];
  $('#cTitle').textContent = t.connectTitle.replace('{service}', name);
  const p = await api.pairing(id);
  const code = p.code
    ? `<textarea id="code" readonly>${esc(p.code)}</textarea><button data-c="copy" id="copyBtn">${t.copyCode}</button>`
    : `<div class="err">${t.portBusy}</div>`;
  $('#cBody').innerHTML = `<ol class="steps">
    <li><div>${t.step1.replace('{service}', name)}</div><button data-c="signin">${t.signInBrowser}</button></li>
    <li><div>${t.step2}</div><button data-c="folder">${t.openFolder}</button></li>
    <li><div>${t.step3}</div>${code}</li></ol>
    <div class="cnote">${t.connectNote}</div>`;
  $('#connect').classList.remove('hidden');
}
$('#cBody').addEventListener('click', e => {
  const b = e.target.closest('button[data-c]'); if (!b) return;
  const c = b.dataset.c;
  if (c === 'signin') api.signIn(connectId);
  else if (c === 'folder') api.openExtensionFolder();
  else if (c === 'copy') { api.copy($('#code').value); b.textContent = T().copied; }
});
$('#cClose').onclick = () => $('#connect').classList.add('hidden');
$('#connect').addEventListener('click', e => { if (e.target.id === 'connect') $('#connect').classList.add('hidden'); });

// ---- updates ----
let upd = { status: 'idle' };
function renderUpdate() {
  const t = T();
  const key = 'u_' + (upd.status || 'idle');
  let text = t[key] || '';
  text = text.replace('{v}', upd.version ? 'v' + upd.version : '').replace('{p}', upd.percent != null ? ' ' + upd.percent + '%' : '');
  $('#updText').textContent = text;
  $('#updInstall').classList.toggle('hidden', upd.status !== 'ready');
  $('#updCheck').classList.toggle('hidden', upd.status === 'portable' || upd.status === 'dev' || upd.status === 'ready');
}

$('#list').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const card = b.closest('.card'); const id = card.dataset.id; const act = b.dataset.act;
  if (act === 'connect') openConnect(id);
  else if (act === 'site') api.signIn(id);
  else if (act === 'remove') { if (confirm(T().confirmRemove)) api.remove(id); }
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
$('#nav').addEventListener('click', e => { const li = e.target.closest('li'); if (li) { filter = li.dataset.f; render(); } });
$('#add').onclick = async () => {
  const r = await api.add($('#prov').value, $('#lbl').value.trim());
  $('#lbl').value = '';
  if (r && r.kind === 'extension') { state = await api.getState(); render(); openConnect(r.id); }
};
$('#settingsBtn').onclick = () => $('#modal').classList.remove('hidden');
$('#closeModal').onclick = () => $('#modal').classList.add('hidden');
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') $('#modal').classList.add('hidden'); });
$('#lang').onchange = e => api.setSettings({ lang: e.target.value });
$('#updCheck').onclick = () => api.checkUpdates();
$('#updInstall').onclick = () => api.installUpdate();

api.onState(setState);
api.onUpdate(u => { upd = u; renderUpdate(); });
api.updateState().then(u => { upd = u; renderUpdate(); });
api.appInfo().then(i => { $('#ver').textContent = 'v' + i.version; $('#ver2').textContent = 'v' + i.version; });
api.getState().then(s => { state = s; $('#lang').value = s.settings.lang; render(); });

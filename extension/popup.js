// Popup = a small dashboard of the Claude / ChatGPT accounts this browser is signed in with.
// It works on its own (data comes from background.js); the "Desktop link" part is optional.
const PROVIDERS = { claude: { name: 'Claude', login: 'https://claude.ai/login', site: 'https://claude.ai' },
                    chatgpt: { name: 'ChatGPT', login: 'https://chatgpt.com/auth/login', site: 'https://chatgpt.com' } };

const APP_URL = 'https://github.com/Jolly-Panda-Works/ai-usage-monitor/releases/latest';
const REPO_URL = 'https://github.com/Jolly-Panda-Works/ai-usage-monitor';
const openUrl = url => (chrome.tabs ? chrome.tabs.create({ url }) : window.open(url));

const I18N = {
  en: {
    refresh: 'Refresh now', settings: 'Settings', language: 'Language', interval: 'Refresh every (minutes)', notify: 'Notify when a limit has reset',
    signedNow: 'Signed in now', lastSeen: 'Last seen', notSignedIn: 'Not signed in on this browser', signIn: 'Open sign-in page', openSite: 'Open site',
    rename: 'Rename', remove: 'Remove', sure: 'Remove?', removeHint: 'The account reappears while you are signed in.',
    used: 'Used', left: 'Left', resetsIn: 'Resets in', availableIn: 'Available again in', resetUnknown: 'Reset time unknown', updated: 'Updated',
    empty: 'No accounts yet.<br>Sign in to Claude or ChatGPT in this browser — the account shows up here automatically.',
    loading: 'Loading…', httpError: 'Could not read usage', 
    NO_USAGE: 'Signed in, but the service returned no usage meters — usually a Free account. The desktop app has a Free quota tracker.',
    NO_PLAN_USAGE: 'Signed in, but the service returned no usage data for this plan — usually a Free account. The desktop app has a Free quota tracker.',
    w: { '5-hour': '5-hour window', 'Weekly': 'Weekly window', 'Weekly Opus': 'Weekly Opus', 'Weekly Sonnet': 'Weekly Sonnet', 'Quota': 'Quota' },
    hour: '-hour window', day: '-day window', d: 'd', h: 'h', m: 'm', s: 's', now: 'now',
    desktop: 'Desktop app link (optional)', desktopHint: 'In the desktop app press “Connect” on an account, open the “Browser extension” tab, copy the code and paste it here. This browser then also reports to the app.',
    connect: 'Connect', sendNow: 'Send now', badCode: 'This is not a valid code.', badCode2: 'This code is not supported.', waiting: 'Waiting for the first report…', removeLink: 'Remove',
    about: 'About the AI Usage Monitor desktop app',
    aboutText: 'A free, open-source Windows app that puts all your AI accounts in one window — with live reset countdowns and desktop notifications.',
    aboutList: ['Claude, ChatGPT, Gemini and Figma — several accounts of each', 'Used / left and a countdown to every reset, plus a notification when a limit resets', 'Free quota tracker for accounts without usage meters', 'Sign in your own way: this extension, the official app login or a cookie', 'English and Persian, dark/orange UI, automatic updates, no telemetry'],
    download: 'Download for Windows', github: 'GitHub', welcome: 'Show welcome page',
    promo: 'All your AI accounts in one Windows window — <b>get the free desktop app</b>',
    promoBtn: 'Download'
  },
  fa: {
    refresh: 'بروزرسانی همین الان', settings: 'تنظیمات', language: 'زبان', interval: 'بروزرسانی هر (دقیقه)', notify: 'اعلان هنگام ریست شدن محدودیت',
    signedNow: 'همین الان وارد شده', lastSeen: 'آخرین دیدن', notSignedIn: 'در این مرورگر وارد حساب نشده‌ای', signIn: 'باز کردن صفحه ورود', openSite: 'باز کردن سایت',
    rename: 'تغییر نام', remove: 'حذف', sure: 'حذف شود؟', removeHint: 'تا وقتی وارد حساب هستی، اکانت دوباره ظاهر می‌شود.',
    used: 'مصرف', left: 'باقی‌مانده', resetsIn: 'ریست تا', availableIn: 'قابل استفاده تا', resetUnknown: 'زمان ریست نامشخص', updated: 'بروزرسانی',
    empty: 'هنوز اکانتی دیده نشده.<br>در این مرورگر وارد Claude یا ChatGPT شو؛ اکانت خودکار اینجا نمایش داده می‌شود.',
    loading: 'در حال دریافت…', httpError: 'خواندن مصرف ممکن نشد',
    NO_USAGE: 'وارد شده‌ای، ولی سرویس هیچ شمارندهٔ مصرفی برنگرداند؛ معمولاً اکانت Free همین‌طور است. اپ دسکتاپ «ردیاب سهمیه Free» دارد.',
    NO_PLAN_USAGE: 'وارد شده‌ای، ولی سرویس برای این پلن اطلاعات مصرف نداد؛ معمولاً اکانت Free همین‌طور است. اپ دسکتاپ «ردیاب سهمیه Free» دارد.',
    w: { '5-hour': 'بازه ۵ ساعته', 'Weekly': 'بازه هفتگی', 'Weekly Opus': 'هفتگی Opus', 'Weekly Sonnet': 'هفتگی Sonnet', 'Quota': 'سهمیه' },
    hour: ' ساعته', day: ' روزه', d: ' روز', h: ' ساعت', m: ' دقیقه', s: ' ثانیه', now: 'همین الان',
    desktop: 'اتصال به برنامه دسکتاپ (اختیاری)', desktopHint: 'در برنامه دسکتاپ روی اکانت «اتصال» را بزن، تب «افزونه مرورگر» را باز کن، کد را کپی کن و اینجا بچسبان. بعد از آن این مرورگر به اپ هم گزارش می‌دهد.',
    connect: 'اتصال', sendNow: 'ارسال همین الان', badCode: 'این کد معتبر نیست.', badCode2: 'این کد پشتیبانی نمی‌شود.', waiting: 'در انتظار اولین گزارش…', removeLink: 'حذف',
    about: 'درباره‌ی اپ دسکتاپ AI Usage Monitor',
    aboutText: 'یک اپ ویندوز رایگان و متن‌باز که همه‌ی اکانت‌های هوش مصنوعی‌ات را در یک پنجره نشان می‌دهد — با شمارش معکوس زنده‌ی ریست و اعلان دسکتاپ.',
    aboutList: ['Claude، ChatGPT، Gemini و Figma — با چند اکانت از هرکدام', 'مصرف / باقی‌مانده و شمارش معکوس هر ریست، با اعلان هنگام ریست شدن', 'ردیاب سهمیه‌ی Free برای اکانت‌هایی که شمارنده‌ی مصرف ندارند', 'ورود به روش خودت: همین افزونه، ورود با اپ رسمی یا کوکی', 'فارسی و انگلیسی، رابط تیره/نارنجی، آپدیت خودکار، بدون ردیابی'],
    download: 'دانلود برای ویندوز', github: 'گیت‌هاب', welcome: 'نمایش صفحه خوش‌آمد',
    promo: 'همه‌ی اکانت‌های هوش مصنوعی‌ات در یک پنجره‌ی ویندوز — <b>اپ دسکتاپ رایگان را بگیر</b>',
    promoBtn: 'دانلود'
  }
};

const $ = s => document.querySelector(s);
let data = { accounts: [], links: [], status: {}, settings: { intervalMin: 1, notify: true, lang: null } };
let lang = 'en', renaming = null, confirming = null, loaded = false;
const T = () => I18N[lang];
const num = v => Math.round(v * 10) / 10;

// tiny DOM helper — everything user-visible goes through textContent, never innerHTML
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el[k] = v;
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
const bdi = text => h('bdi', { text });

function fmt(ms) {
  const t = T();
  if (ms <= 0) return t.now;
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), hh = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return [d ? d + t.d : '', hh ? hh + t.h : '', m ? m + t.m : '', !d && !hh ? x + t.s : ''].filter(Boolean).join(' ');
}
function winLabel(l) {
  const t = T();
  if (t.w[l]) return t.w[l];
  let m = /^(\d+)-hour$/.exec(l); if (m) return m[1] + t.hour;
  m = /^(\d+)-day$/.exec(l); if (m) return m[1] + t.day;
  return l;
}
const locale = () => (lang === 'fa' ? 'fa-IR' : undefined);
const send = msg => new Promise(r => chrome.runtime.sendMessage(msg, r));

function winEl(w) {
  const t = T(), used = Math.min(100, Math.max(0, w.usedPct || 0));
  const cls = used < 70 ? 'ok' : used < 90 ? 'warn' : 'bad';
  const fill = h('div', { class: 'fill ' + cls }); fill.style.width = used + '%';
  const reset = w.resetsAt
    ? [h('span', {}, (used >= 100 ? t.availableIn : t.resetsIn) + ': ', h('b', { 'data-reset': w.resetsAt })), h('span', {}, bdi(new Date(w.resetsAt).toLocaleString(locale())))]
    : [h('span', { text: t.resetUnknown })];
  return h('div', { class: 'win' },
    h('div', { class: 'rowt' }, h('span', { text: winLabel(w.label) }),
      h('span', {}, t.used + ': ', h('b', {}, bdi(num(used) + '%')), ' · ' + t.left + ': ', h('b', {}, bdi(num(100 - used) + '%')))),
    h('div', { class: 'track' }, fill), h('div', { class: 'meta' }, ...reset));
}

function accountEl(a) {
  const t = T(), p = PROVIDERS[a.provider];
  const title = a.label || a.email || p.name;
  const head = h('div', { class: 'top' }, h('span', { class: 'badge p-' + a.provider, text: p.name }));
  if (renaming === a.id) {
    const inp = h('input', { class: 'rename', value: a.label || '', placeholder: a.email || p.name, maxlength: '60' });
    const done = async save => { renaming = null; if (save) await send({ type: 'rename', id: a.id, label: inp.value.trim() }); render(); };
    inp.onkeydown = e => { if (e.key === 'Enter') done(true); else if (e.key === 'Escape') done(false); };
    inp.onblur = () => done(true);
    head.append(inp); setTimeout(() => inp.focus(), 0);
  } else {
    head.append(h('b', { text: title }),
      h('span', { class: 'chip' + (a.active ? '' : ' off'), text: a.active ? '● ' + t.signedNow : t.lastSeen + ': ' + new Date(a.updatedAt || a.firstSeen).toLocaleDateString(locale()) }));
    const rm = h('button', { class: 'tiny', title: confirming === a.id ? t.removeHint : t.remove, text: confirming === a.id ? t.sure : '✕' });
    rm.onclick = async () => {
      if (confirming !== a.id) { confirming = a.id; render(); setTimeout(() => { if (confirming === a.id) { confirming = null; render(); } }, 4000); return; }
      confirming = null; await send({ type: 'remove', id: a.id });
    };
    head.append(h('div', { class: 'btns' },
      h('button', { class: 'tiny', title: t.rename, text: '✎', onclick: () => { renaming = a.id; render(); } }),
      h('button', { class: 'tiny', title: t.openSite, text: '↗', onclick: () => chrome.tabs ? chrome.tabs.create({ url: p.site }) : window.open(p.site) }), rm));
  }
  const sub = [a.label ? a.email : null, a.plan].filter(Boolean).join(' · ');
  const card = h('div', { class: 'card' + (a.active ? '' : ' stale') }, head, sub ? h('div', { class: 'sub', text: sub }) : null);
  (a.windows || []).forEach(w => card.append(winEl(w)));
  if (a.error) card.append(h('div', { class: 'err', text: t.httpError + ': ' + a.error }));
  else if (a.note && t[a.note]) card.append(h('div', { class: 'note', text: t[a.note] }));
  if (a.updatedAt) card.append(h('div', { class: 'upd' }, t.updated + ': ', bdi(new Date(a.updatedAt).toLocaleTimeString(locale()))));
  return card;
}

// A service the browser is not signed in to (and no account was ever seen for it).
function signedOutEl(provider) {
  const t = T(), p = PROVIDERS[provider];
  return h('div', { class: 'card stale' }, h('div', { class: 'top' },
    h('span', { class: 'badge p-' + provider, text: p.name }), h('span', { class: 'sub', text: t.notSignedIn }),
    h('div', { class: 'btns' }, h('button', { class: 'tiny', text: t.signIn, onclick: () => chrome.tabs ? chrome.tabs.create({ url: p.login }) : window.open(p.login) }))));
}

function render() {
  const t = T();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  $('#refresh').title = t.refresh;
  $('#tSettings').textContent = t.settings; $('#tLang').textContent = t.language; $('#tInterval').textContent = t.interval; $('#tNotify').textContent = t.notify;
  $('#tDesktop').textContent = t.desktop; $('#tDesktopHint').textContent = t.desktopHint;
  $('#add').textContent = t.connect;
  $('#tAbout').textContent = t.about; $('#tAboutText').textContent = t.aboutText;
  const ul = $('#tAboutList'); ul.textContent = ''; t.aboutList.forEach(x => ul.append(h('li', { text: x })));
  $('#dl').textContent = t.download; $('#gh').textContent = t.github; $('#wel').textContent = t.welcome;
  $('#lang').value = lang; $('#interval').value = String(data.settings.intervalMin); $('#notify').checked = !!data.settings.notify;

  const list = $('#accounts');
  list.textContent = '';
  const accs = [...data.accounts].sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0) || a.provider.localeCompare(b.provider));
  accs.forEach(a => list.append(accountEl(a)));
  for (const k of Object.keys(PROVIDERS)) {
    const st = data.status[k];
    if (st && st.state === 'signed_out' && !data.accounts.some(a => a.provider === k)) list.append(signedOutEl(k));
  }
  if (!list.children.length) {
    const e = h('div', { class: 'empty' });
    if (loaded && Object.keys(data.status).length) e.innerHTML = t.empty;   // static, trusted translation string
    else e.textContent = t.loading;
    list.append(e);
  }

  renderLinks();
  renderPromo();
  tick();
}

// Small banner introducing the desktop app until a desktop link has been set up.
function renderPromo() {
  const box = $('#promo'); box.textContent = '';
  if (data.links.length) return;
  const t = T(), txt = h('div', { class: 't' });
  txt.innerHTML = t.promo;   // static, trusted translation string
  box.append(h('div', { class: 'promo' }, h('img', { src: 'icons/icon48.png', alt: '' }), txt,
    h('button', { class: 'primary tiny', text: t.promoBtn, onclick: () => openUrl(APP_URL) })));
}

function renderLinks() {
  const t = T(), box = $('#links');
  box.textContent = '';
  for (const l of data.links) {
    const s = h('small', {});
    if (l.last) { s.textContent = (l.last.ok ? '✓ ' : '⚠ ') + l.last.msg + ' · ' + new Date(l.last.at).toLocaleTimeString(locale()); s.className = l.last.ok ? 'good' : 'bad-t'; }
    else s.textContent = t.waiting;
    box.append(h('div', { class: 'link' },
      h('div', { class: 't' }, h('b', { text: `${l.label} (${PROVIDERS[l.provider].name})` }), s),
      h('button', { class: 'tiny', title: t.removeLink, text: '✕', onclick: () => send({ type: 'removeLink', token: l.token }) })));
  }
}

function tick() {
  document.querySelectorAll('[data-reset]').forEach(el => { el.textContent = fmt(Number(el.dataset.reset) - Date.now()); });
  const times = Object.values(data.status).map(s => s.at).filter(Boolean);
  $('#status').textContent = times.length ? T().updated + ': ' + new Date(Math.max(...times)).toLocaleTimeString(locale()) : '';
}
setInterval(tick, 1000);

function decode(code) {
  const m = /^AUM1\.([A-Za-z0-9_-]+)$/.exec(code.trim());
  if (!m) throw new Error('badCode');
  let o;
  try { o = JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, '+').replace(/_/g, '/'))))); } catch { throw new Error('badCode'); }
  if (!o || o.v !== 1 || !PROVIDERS[o.s] || typeof o.t !== 'string' || o.t.length < 20 || !Number.isInteger(o.p)) throw new Error('badCode2');
  return { provider: o.s, label: String(o.l || PROVIDERS[o.s].name).slice(0, 60), token: o.t, port: o.p };
}

$('#dl').onclick = () => openUrl(APP_URL);
$('#gh').onclick = () => openUrl(REPO_URL);
$('#wel').onclick = () => openUrl(chrome.runtime.getURL('welcome.html'));
$('#add').onclick = async () => {
  $('#msg').textContent = '';
  try {
    const link = decode($('#code').value);
    $('#code').value = '';
    await send({ type: 'addLink', link });
  } catch (e) { $('#msg').textContent = T()[e.message] || T().badCode; }
};
$('#refresh').onclick = async () => { $('#refresh').disabled = true; await send({ type: 'syncNow' }); $('#refresh').disabled = false; };
$('#lang').onchange = e => { lang = e.target.value; send({ type: 'setSettings', patch: { lang } }); render(); };
$('#interval').onchange = e => send({ type: 'setSettings', patch: { intervalMin: Number(e.target.value) } });
$('#notify').onchange = e => send({ type: 'setSettings', patch: { notify: e.target.checked } });

async function refreshData() {
  const st = await chrome.storage.local.get(['accounts', 'links', 'status', 'settings']);
  data = { accounts: st.accounts || [], links: st.links || [], status: st.status || {}, settings: { intervalMin: 1, notify: true, lang: null, ...(st.settings || {}) } };
  if (data.settings.lang) lang = data.settings.lang;
  else lang = (navigator.language || '').toLowerCase().startsWith('fa') ? 'fa' : 'en';
  loaded = true;
  if (!document.activeElement || !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) || document.activeElement.id === 'notify') render();
  else renderLinks();
}
chrome.storage.onChanged.addListener(refreshData);
refreshData().then(() => { if (!Object.keys(data.status).length) send({ type: 'syncNow' }); });

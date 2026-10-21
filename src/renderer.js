const I18N = {
  en: {
    refreshAll: '⟳ Refresh all', settings: 'Settings', accounts: 'Accounts', all: 'All accounts',
    overview: 'Usage overview', overviewSub: 'Live usage, token counts and reset times for all your AI accounts — including Free plans.',
    labelPh: 'Account name (e.g. Claude personal)', addAccount: '+ Add account',
    empty: 'No accounts yet.<br>Pick a service and press “Add account” — a sign-in window will open inside the app. Or link the browser extension from the account card.',
    signIn: 'Sign in', openSite: 'Open site', refresh: 'Refresh', remove: 'Remove',
    confirmRemove: 'Remove this account?', used: 'Used', left: 'Left',
    resetsIn: 'Resets in', availableIn: 'Available again in', resetUnknown: 'Reset time unknown',
    updated: 'Last updated', loading: 'Loading…',
    notLoggedIn: 'Not signed in. Press “Sign in” and log in inside the window.',
    cloudflare: 'Cloudflare asked for a check. Press “Sign in” and complete it in the window.',
    error: 'Error',
    NO_USAGE: 'Connected, but Claude returned no usage meters for this account — usually the case for Free accounts. Use the Free quota tracker below.',
    NO_PLAN_USAGE: 'Connected, but ChatGPT returned no usage data for this plan — usually the case for Free accounts. Use the Free quota tracker below.',
    trackerTitle: 'Free quota tracker', trackerOn: '+ Track Free quota manually', trackerOff: 'Turn tracker off',
    trackerSettings: 'Tracker settings',
    trackerHint: 'Free plans do not publish exact token counts. Enter the limit you know, add what you use, and the reset time counts down for you.',
    unit_tokens: 'tokens', unit_messages: 'messages', unit_credits: 'credits', unit_units: 'units',
    modeSession: 'Session — starts with your first use', modeFixed: 'Fixed — repeats every period',
    idle: 'No active window — it starts when you add usage or press “Start window now”.',
    noLimit: 'no limit set', startWindow: 'Start window now', resetNow: 'Reset now',
    title: 'Title', unitLbl: 'Unit', modeLbl: 'Window type', limit: 'Limit (0 = unknown)', usedLbl: 'Used',
    period: 'Period (hours)', nextReset: 'Next reset', save: 'Save',
    cookieLink: 'Can’t sign in (e.g. Google)? Use a cookie', cookieTitle: 'Sign in with a cookie',
    openBrowser: 'Open {service} in my browser',
    cookieStep1: 'Sign in to {service} in your normal browser.',
    cookieStep2: 'Open DevTools (F12) → Application → Cookies → {site} and copy the value of {name}. (You may also paste a whole Cookie header.)',
    cookieStep3: 'Paste it here and press Save. It is stored only inside this app, for this account.',
    cookiePh: 'Paste the cookie value…', cookieSave: 'Save',
    cookieOk: 'Cookie saved — loading usage…', cookieBad: 'That does not look like a cookie value.', cookieFail: 'Could not save the cookie.',
    cookieNote: 'A cookie copied from your browser can expire. If “Cloudflare” shows up, use the sign-in window instead.',
    language: 'Language', interval: 'Auto-refresh every (minutes)', about: 'About', developer: 'Developer', close: 'Close',
    w: { '5-hour': '5-hour window', 'Weekly': 'Weekly window', 'Weekly Opus': 'Weekly Opus', 'Weekly Sonnet': 'Weekly Sonnet', 'Quota': 'Quota' },
    hour: '-hour window', day: '-day window',
    d: 'd', h: 'h', m: 'm', s: 's', now: 'now', done: 'Done',
    extBtn: 'Extension', linked: 'Extension linked',
    notLoggedInExt: 'The browser extension reports that you are not signed in on that browser. Sign in there (or use “Sign in” here).',
    extTitle: 'Link the browser extension to {service}',
    extStep1: 'Sign in to {service} in your own browser (Chrome, Edge or Brave) — any method works, including Google and passkeys.',
    signInBrowser: 'Open sign-in page in my browser',
    extStep2: 'Install the extension once: open the folder below, then in your browser go to chrome://extensions, turn on “Developer mode”, press “Load unpacked” and pick that folder.',
    openFolder: 'Open extension folder',
    extStep3: 'Click the extension icon, open “Desktop link”, paste this code and press Connect. For several accounts, use a separate browser profile for each and paste that account’s own code.',
    copyCode: 'Copy code', copied: 'Copied ✓',
    extNote: 'The extension reads your usage inside your browser and sends it only to this app on your PC. It also works on its own: its popup shows your accounts and usage even without this app.',
    portBusy: 'The local connection port is busy. Close other copies of the app and restart it.',
    checkUpdates: 'Check for updates', restartUpdate: 'Restart and update',
    u_idle: '', u_checking: 'Checking for updates…', u_latest: 'You have the latest version.',
    u_downloading: 'Downloading update {v}{p}…', u_ready: 'Update {v} is ready.', u_error: 'Update check failed.',
    u_portable: 'Portable build — updates are not automatic.', u_dev: 'Development build.',
  },
  fa: {
    refreshAll: '⟳ بروزرسانی همه', settings: 'تنظیمات', accounts: 'اکانت‌ها', all: 'همه اکانت‌ها',
    overview: 'نمای کلی مصرف', overviewSub: 'مصرف لحظه‌ای، تعداد توکن و زمان ریست همه اکانت‌های هوش مصنوعی شما — از جمله پلن‌های Free.',
    labelPh: 'نام اکانت (مثلاً Claude شخصی)', addAccount: '+ افزودن اکانت',
    empty: 'هنوز اکانتی اضافه نشده.<br>یک سرویس انتخاب کن و «افزودن اکانت» را بزن؛ پنجره ورود داخل خود برنامه باز می‌شود. یا از کارت اکانت، افزونهٔ مرورگر را متصل کن.',
    signIn: 'ورود', openSite: 'باز کردن سایت', refresh: 'بروزرسانی', remove: 'حذف',
    confirmRemove: 'این اکانت حذف شود؟', used: 'مصرف', left: 'باقی‌مانده',
    resetsIn: 'ریست تا', availableIn: 'قابل استفاده تا', resetUnknown: 'زمان ریست نامشخص',
    updated: 'آخرین بروزرسانی', loading: 'در حال دریافت…',
    notLoggedIn: 'وارد حساب نشده‌ای. «ورود» را بزن و داخل پنجره وارد شو.',
    cloudflare: 'Cloudflare تأیید خواست. «ورود» را بزن و آن را داخل پنجره انجام بده.',
    error: 'خطا',
    NO_USAGE: 'اتصال برقرار است ولی Claude برای این اکانت هیچ شمارندهٔ مصرفی برنگرداند؛ معمولاً اکانت‌های Free همین‌طورند. از «ردیاب سهمیه Free» پایین استفاده کن.',
    NO_PLAN_USAGE: 'اتصال برقرار است ولی ChatGPT برای این پلن اطلاعات مصرف نداد؛ معمولاً پلن Free همین‌طور است. از «ردیاب سهمیه Free» پایین استفاده کن.',
    trackerTitle: 'ردیاب سهمیه Free', trackerOn: '+ ردیابی دستی سهمیه Free', trackerOff: 'خاموش کردن ردیاب',
    trackerSettings: 'تنظیمات ردیاب',
    trackerHint: 'پلن‌های Free تعداد دقیق توکن را اعلام نمی‌کنند. سقفی را که می‌دانی وارد کن و مصرفت را اضافه کن؛ شمارش معکوس ریست خودکار انجام می‌شود.',
    unit_tokens: 'توکن', unit_messages: 'پیام', unit_credits: 'کردیت', unit_units: 'واحد',
    modeSession: 'جلسه‌ای — با اولین مصرف شروع می‌شود', modeFixed: 'ثابت — هر بازه تکرار می‌شود',
    idle: 'بازهٔ فعالی نیست — با ثبت مصرف یا زدن «شروع بازه از همین الان» شروع می‌شود.',
    noLimit: 'سقف تعیین نشده', startWindow: 'شروع بازه از همین الان', resetNow: 'ریست دستی',
    title: 'عنوان', unitLbl: 'واحد', modeLbl: 'نوع بازه', limit: 'سقف (۰ = نامشخص)', usedLbl: 'مصرف شده',
    period: 'طول بازه (ساعت)', nextReset: 'زمان ریست بعدی', save: 'ذخیره',
    cookieLink: 'ورود ممکن نیست (مثلاً با گوگل)؟ از کوکی استفاده کن', cookieTitle: 'ورود با کوکی',
    openBrowser: 'باز کردن {service} در مرورگر من',
    cookieStep1: 'داخل مرورگر معمولی‌ات وارد {service} شو.',
    cookieStep2: 'DevTools را باز کن (F12) ← Application ← Cookies ← {site} و مقدار {name} را کپی کن. (کل هدر Cookie را هم می‌توانی بچسبانی.)',
    cookieStep3: 'اینجا بچسبان و «ذخیره» را بزن. فقط داخل همین برنامه و برای همین اکانت نگه‌داری می‌شود.',
    cookiePh: 'مقدار کوکی را بچسبان…', cookieSave: 'ذخیره',
    cookieOk: 'کوکی ذخیره شد؛ مصرف در حال دریافت است…', cookieBad: 'این شبیه مقدار کوکی نیست.', cookieFail: 'ذخیرهٔ کوکی ناموفق بود.',
    cookieNote: 'کوکی کپی‌شده از مرورگر ممکن است منقضی شود. اگر «Cloudflare» دیدی، از پنجرهٔ ورود استفاده کن.',
    language: 'زبان', interval: 'بروزرسانی خودکار هر (دقیقه)', about: 'درباره', developer: 'توسعه‌دهنده', close: 'بستن',
    w: { '5-hour': 'بازه ۵ ساعته', 'Weekly': 'بازه هفتگی', 'Weekly Opus': 'هفتگی Opus', 'Weekly Sonnet': 'هفتگی Sonnet', 'Quota': 'سهمیه' },
    hour: ' ساعته', day: ' روزه',
    d: ' روز', h: ' ساعت', m: ' دقیقه', s: ' ثانیه', now: 'همین الان', done: 'تمام',
    extBtn: 'افزونه', linked: 'افزونه متصل است',
    notLoggedInExt: 'افزونهٔ مرورگر گزارش می‌دهد که در آن مرورگر وارد حساب نشده‌ای. همان‌جا وارد شو (یا اینجا «ورود» را بزن).',
    extTitle: 'اتصال افزونهٔ مرورگر به {service}',
    extStep1: 'داخل مرورگر خودت (Chrome، Edge یا Brave) وارد {service} شو؛ هر روشی (حتی گوگل و passkey) جواب می‌دهد.',
    signInBrowser: 'باز کردن صفحه ورود در مرورگر من',
    extStep2: 'افزونه را یک‌بار نصب کن: پوشه زیر را باز کن، سپس در مرورگر به chrome://extensions برو، «Developer mode» را روشن کن، «Load unpacked» را بزن و همان پوشه را انتخاب کن.',
    openFolder: 'باز کردن پوشه افزونه',
    extStep3: 'روی آیکن افزونه کلیک کن، بخش «اتصال به برنامه دسکتاپ» را باز کن، این کد را بچسبان و Connect را بزن. برای چند اکانت، برای هر اکانت یک پروفایل مرورگر جدا استفاده کن و کد همان اکانت را بچسبان.',
    copyCode: 'کپی کد', copied: 'کپی شد ✓',
    extNote: 'افزونه مصرف را داخل مرورگر خودت می‌خواند و فقط به همین اپ روی کامپیوترت می‌فرستد. افزونه مستقل هم کار می‌کند: پاپ‌آپ آن بدون این اپ هم اکانت‌ها و مصرف را نشان می‌دهد.',
    portBusy: 'پورت اتصال محلی اشغال است. نسخه‌های دیگر اپ را ببند و دوباره اجرا کن.',
    checkUpdates: 'بررسی آپدیت', restartUpdate: 'راه‌اندازی مجدد و آپدیت',
    u_idle: '', u_checking: 'در حال بررسی آپدیت…', u_latest: 'آخرین نسخه را داری.',
    u_downloading: 'در حال دانلود آپدیت {v}{p}…', u_ready: 'آپدیت {v} آماده است.', u_error: 'بررسی آپدیت ناموفق بود.',
    u_portable: 'نسخه پرتابل — آپدیت خودکار ندارد.', u_dev: 'نسخه توسعه.',
  }
};
const NAMES = { claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini', figma: 'Figma' };
const COOKIES = { claude: { site: 'claude.ai', name: 'sessionKey' }, chatgpt: { site: 'chatgpt.com', name: '__Secure-next-auth.session-token' } };
const UNITS = ['tokens', 'messages', 'credits', 'units'];
let state = { accounts: [], settings: { intervalMin: 5, lang: 'en' } };
let filter = 'all';
const openCards = new Set();      // cards whose "Tracker settings" are expanded (survives re-renders)
const $ = s => document.querySelector(s);
const T = () => I18N[state.settings.lang] || I18N.en;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const num = v => Math.round(v * 10) / 10;
const locale = () => (state.settings.lang === 'fa' ? 'fa-IR' : undefined);
const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const nfCompact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

// 12,500 tokens · 1.2M tokens · 40 messages
function qty(n, unit) {
  n = Number(n) || 0;
  const v = n >= 1e6 ? nfCompact.format(n) : nf.format(n);
  const u = unit === 'units' ? '' : (T()['unit_' + unit] || '');
  return u ? v + ' ' + u : v;
}

function fmt(ms) {
  const t = T();
  if (ms <= 0) return t.now;
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return [d ? d + t.d : '', h ? h + t.h : '', m ? m + t.m : '', !d && !h ? x + t.s : ''].filter(Boolean).join(' ');
}
const localInput = ms => {
  if (!ms) return '';
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function winLabel(l) {
  const t = T();
  if (t.w[l]) return t.w[l];
  let m = /^(\d+)-hour$/.exec(l); if (m) return m[1] + t.hour;
  m = /^(\d+)-day$/.exec(l); if (m) return m[1] + t.day;
  return l;
}

function resetHtml(resetsAt, exhausted) {
  const t = T();
  if (!resetsAt) return `<span>${t.resetUnknown}</span>`;
  return `<span>${exhausted ? t.availableIn : t.resetsIn}: <b data-reset="${resetsAt}"></b></span><span><bdi>${new Date(resetsAt).toLocaleString(locale())}</bdi></span>`;
}

// A usage window reported by the service (percentages only).
function winHtml(w) {
  if (w.tracker) return trackerWinHtml(w);
  const t = T();
  const used = Math.min(100, Math.max(0, w.usedPct || 0));
  const cls = used < 70 ? 'ok' : used < 90 ? 'warn' : 'bad';
  return `<div class="win"><div class="rowt"><span>${esc(winLabel(w.label))}</span><span>${t.used}: <b><bdi>${num(used)}%</bdi></b> · ${t.left}: <b><bdi>${num(100 - used)}%</bdi></b></span></div>
  <div class="track"><div class="fill ${cls}" style="width:${used}%"></div></div><div class="meta">${resetHtml(w.resetsAt, used >= 100)}</div></div>`;
}

// The Free-plan tracker window: amounts in tokens / messages / credits, plus the reset countdown.
function trackerWinHtml(w) {
  const t = T();
  const hasLimit = w.limit > 0;
  const pct = hasLimit ? Math.min(100, Math.max(0, w.usedPct || 0)) : 0;
  const cls = pct < 70 ? 'ok' : pct < 90 ? 'warn' : 'bad';
  const amounts = hasLimit
    ? `${t.used}: <b><bdi>${qty(w.used, w.unit)}</bdi></b> · ${t.left}: <b><bdi>${qty(w.remaining, w.unit)}</bdi></b> <span class="dim">(<bdi>${num(pct)}%</bdi> · <bdi>${qty(w.limit, w.unit)}</bdi>)</span>`
    : `${t.used}: <b><bdi>${qty(w.used, w.unit)}</bdi></b> · <span class="dim">${t.noLimit}</span>`;
  const reset = w.idle ? `<span>${t.idle}</span>` : resetHtml(w.resetsAt, hasLimit && w.used >= w.limit);
  return `<div class="win"><div class="rowt"><span>${esc(w.label)}</span><span>${amounts}</span></div>
  ${hasLimit ? `<div class="track"><div class="fill ${cls}" style="width:${pct}%"></div></div>` : ''}<div class="meta">${reset}</div></div>`;
}

function trackerSettingsHtml(a) {
  const t = T(), k = a.tracker;
  const steps = k.unit === 'tokens' ? [1000, 10000, 100000] : [1, 5, 10];
  const short = n => (n >= 1000 ? n / 1000 + 'K' : String(n));
  const sel = (f, opts, cur) => `<select data-f="${f}">${opts.map(([v, l]) => `<option value="${v}"${v === cur ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  return `<details data-id="${esc(a.id)}"${openCards.has(a.id) ? ' open' : ''}><summary>${t.trackerSettings}</summary>
  <div class="note">${t.trackerHint}</div>
  <div class="q wrap">${steps.map(n => `<button data-act="add" data-n="${n}">+${short(n)}</button>`).join('')}<button data-act="add" data-n="${-steps[0]}">−${short(steps[0])}</button>
    <button data-act="start">${t.startWindow}</button><button data-act="reset">${t.resetNow}</button></div>
  <div class="grid">
   <label>${t.title}<input data-f="label" value="${esc(k.label)}"></label>
   <label>${t.unitLbl}${sel('unit', UNITS.map(u => [u, t['unit_' + u]]), k.unit)}</label>
   <label>${t.limit}<input data-f="limit" type="number" min="0" value="${Number(k.limit) || 0}"></label>
   <label>${t.usedLbl}<input data-f="used" type="number" min="0" value="${Number(k.used) || 0}"></label>
   <label>${t.modeLbl}${sel('mode', [['session', t.modeSession], ['fixed', t.modeFixed]], k.mode)}</label>
   <label>${t.period}<input data-f="periodHours" type="number" min="0" value="${Number(k.periodHours) || 0}"></label>
   <label style="grid-column:1/-1">${t.nextReset}<input data-f="resetsAt" type="datetime-local" value="${localInput(k.resetsAt)}"></label>
  </div>
  <div class="q"><button data-act="saveTracker" class="primary">${t.save}</button>${a.kind === 'session' ? `<button data-act="trackerOff">${t.trackerOff}</button>` : ''}</div></details>`;
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

function cardHtml(a) {
  const t = T(), d = a.data || {}, session = a.kind === 'session';
  const wins = d.windows || [];
  let err = '';
  if (d.error === 'NOT_LOGGED_IN') err = `<div class="err">${a.linked ? t.notLoggedInExt : t.notLoggedIn}</div>`;
  else if (d.error === 'CLOUDFLARE') err = `<div class="err">${t.cloudflare}</div>`;
  else if (d.error) err = `<div class="err">${t.error}: ${esc(d.error)}</div>`;
  const sub = [d.email, d.plan].filter(Boolean).join(' · ');
  const x = `<button data-act="remove" title="${t.remove}">✕</button>`;
  const buttons = session
    ? `<button data-act="signin">${t.signIn}</button><button data-act="ext">🧩 ${t.extBtn}</button><button data-act="refresh">${t.refresh}</button>${x}`
    : `<button data-act="site">${t.openSite}</button>${x}`;
  const cookie = session && (!a.data || d.error) ? `<div class="q"><button class="link" data-act="cookie">${t.cookieLink}</button></div>` : '';
  const note = !d.error && d.note && t[d.note] ? `<div class="note">${t[d.note]}</div>` : '';
  const loading = session && !a.data ? `<div class="note">${t.loading}</div>` : '';
  const trackerOn = session && !a.tracker && !wins.length ? `<div class="q"><button class="primary" data-act="trackerOn">${t.trackerOn}</button></div>` : '';
  const tracker = a.tw ? `<div class="trk"><div class="cap2">${t.trackerTitle}</div>${winHtml(a.tw)}${trackerSettingsHtml(a)}</div>` : '';
  return `<div class="card" data-id="${esc(a.id)}">
    <div class="head"><span class="badge p-${esc(a.provider)}">${NAMES[a.provider]}</span><b>${esc(a.label)}</b>${a.linked ? `<span class="chip">● ${t.linked}</span>` : ''}
      <div class="btns">${buttons}</div>
      ${sub ? `<small>${esc(sub)}</small>` : ''}</div>
    ${err}${cookie}${wins.map(winHtml).join('')}${note}${loading}${trackerOn}${tracker}
    ${d.updatedAt ? `<div class="upd">${t.updated}: <bdi>${new Date(d.updatedAt).toLocaleTimeString(locale())}</bdi></div>` : ''}
  </div>`;
}

function render() {
  const t = T();
  applyI18n(); renderNav();
  const accs = state.accounts.filter(a => filter === 'all' || a.provider === filter);
  const list = $('#list');
  if (!accs.length) { list.innerHTML = `<div class="empty">${t.empty}</div>`; return; }
  list.innerHTML = accs.map(cardHtml).join('');
  tick();
}

function tick() {
  document.querySelectorAll('[data-reset]').forEach(el => { el.textContent = fmt(Number(el.dataset.reset) - Date.now()); });
}
setInterval(tick, 1000);

function setState(s) {
  state = s;
  const ae = document.activeElement;
  if (ae && /^(INPUT|SELECT|TEXTAREA)$/.test(ae.tagName) && ae.closest('.card')) return;   // don't wipe what is being typed
  render();
}

// ---- cookie dialog (alternative to the sign-in window) ----
let cookieId = null;
function openCookie(id) {
  const a = state.accounts.find(x => x.id === id); if (!a || !COOKIES[a.provider]) return;
  cookieId = id;
  const t = T(), name = NAMES[a.provider], c = COOKIES[a.provider];
  $('#cTitle').textContent = t.cookieTitle;
  $('#cBody').innerHTML = `<ol class="steps">
    <li><div>${esc(t.cookieStep1.replace('{service}', name))}</div><button data-c="browser">${esc(t.openBrowser.replace('{service}', name))}</button></li>
    <li><div>${esc(t.cookieStep2.replace('{site}', c.site).replace('{name}', c.name))}</div></li>
    <li><div>${esc(t.cookieStep3)}</div><textarea id="cookieIn" placeholder="${esc(t.cookiePh)}" spellcheck="false"></textarea>
      <button class="primary" data-c="save">${t.cookieSave}</button> <span id="cMsg" class="cmsg"></span></li></ol>
    <div class="cnote">${t.cookieNote}</div>`;
  $('#connect').classList.remove('hidden');
}
// ---- browser-extension dialog (pairing code for the optional desktop link) ----
let connectId = null;
async function openConnect(id) {
  const a = state.accounts.find(x => x.id === id); if (!a) return;
  connectId = id;
  const t = T(), name = NAMES[a.provider];
  $('#cTitle').textContent = t.extTitle.replace('{service}', name);
  const p = await api.pairing(id);
  const code = p && p.code
    ? `<textarea id="code" readonly spellcheck="false">${esc(p.code)}</textarea><button data-c="copy" id="copyBtn">${t.copyCode}</button>`
    : `<div class="err">${t.portBusy}</div>`;
  $('#cBody').innerHTML = `<ol class="steps">
    <li><div>${esc(t.extStep1.replace('{service}', name))}</div><button data-c="signinBrowser">${t.signInBrowser}</button></li>
    <li><div>${esc(t.extStep2)}</div><button data-c="folder">${t.openFolder}</button></li>
    <li><div>${esc(t.extStep3)}</div>${code}</li></ol>
    <div class="cnote">${t.extNote}</div>`;
  $('#connect').classList.remove('hidden');
}

$('#cBody').addEventListener('click', async e => {
  const b = e.target.closest('button[data-c]'); if (!b) return;
  if (b.dataset.c === 'signinBrowser') return api.openInBrowser(connectId);
  if (b.dataset.c === 'folder') return api.openExtensionFolder();
  if (b.dataset.c === 'copy') { api.copy($('#code').value); b.textContent = T().copied; return; }
  if (b.dataset.c === 'browser') return api.openInBrowser(cookieId);
  const t = T(), msg = $('#cMsg');
  const r = await api.setCookies(cookieId, $('#cookieIn').value);
  if (r && r.ok) {
    msg.className = 'cmsg ok'; msg.textContent = t.cookieOk;
    $('#cookieIn').value = '';
    setTimeout(() => $('#connect').classList.add('hidden'), 1200);
  } else {
    msg.className = 'cmsg bad';
    msg.textContent = r && r.error === 'FAILED' ? t.cookieFail : t.cookieBad;
  }
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

// ---- card actions ----
const num0 = v => Math.max(0, Number(v) || 0);
$('#list').addEventListener('toggle', e => {
  if (e.target.tagName !== 'DETAILS') return;
  e.target.open ? openCards.add(e.target.dataset.id) : openCards.delete(e.target.dataset.id);
}, true);
$('#list').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const card = b.closest('.card'); const id = card.dataset.id; const act = b.dataset.act;
  if (act === 'signin' || act === 'site') api.signIn(id);
  else if (act === 'refresh') api.refresh(id);
  else if (act === 'cookie') openCookie(id);
  else if (act === 'ext') openConnect(id);
  else if (act === 'remove') { if (confirm(T().confirmRemove)) api.remove(id); }
  else if (act === 'trackerOn') { openCards.add(id); api.trackerEnable(id); }
  else if (act === 'trackerOff') api.trackerDisable(id);
  else if (act === 'add') api.trackerAdd(id, Number(b.dataset.n));
  else if (act === 'start') api.trackerStart(id);
  else if (act === 'reset') api.trackerReset(id);
  else if (act === 'saveTracker') {
    const patch = {};
    card.querySelectorAll('[data-f]').forEach(i => {
      const f = i.dataset.f;
      if (f === 'label' || f === 'unit' || f === 'mode') patch[f] = i.value;
      else if (f === 'resetsAt') { const ms = new Date(i.value).getTime(); patch.resetsAt = isNaN(ms) ? null : ms; }
      else patch[f] = num0(i.value);
    });
    api.trackerUpdate(id, patch);
  }
});
$('#nav').addEventListener('click', e => { const li = e.target.closest('li'); if (li) { filter = li.dataset.f; render(); } });
$('#add').onclick = async () => {
  await api.add($('#prov').value, $('#lbl').value.trim());
  $('#lbl').value = '';
};
$('#refreshAll').onclick = () => api.refreshAll();
$('#settingsBtn').onclick = () => $('#modal').classList.remove('hidden');
$('#closeModal').onclick = () => $('#modal').classList.add('hidden');
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') $('#modal').classList.add('hidden'); });
$('#lang').onchange = e => api.setSettings({ lang: e.target.value });
$('#interval').onchange = e => api.setSettings({ intervalMin: Number(e.target.value) });
$('#updCheck').onclick = () => api.checkUpdates();
$('#updInstall').onclick = () => api.installUpdate();

api.onState(setState);
api.onUpdate(u => { upd = u; renderUpdate(); });
api.updateState().then(u => { upd = u; renderUpdate(); });
api.appInfo().then(i => { $('#ver').textContent = 'v' + i.version; $('#ver2').textContent = 'v' + i.version; });
api.getState().then(s => { state = s; $('#lang').value = s.settings.lang; $('#interval').value = String(s.settings.intervalMin || 5); render(); });

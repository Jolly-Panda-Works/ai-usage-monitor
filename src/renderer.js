const I18N = {
  en: {
    refreshAll: '⟳ Refresh all', settings: 'Settings', accounts: 'Accounts', all: 'All accounts',
    overview: 'Usage overview', overviewSub: 'Live usage and reset times for all your AI accounts — you sign in with your own browser or the official app.',
    labelPh: 'Account name (e.g. Claude personal)', addAccount: '+ Add account',
    empty: 'No accounts yet.<br>Pick a service and press “Add account” — a sign-in window will open.',
    signIn: 'Sign in / Connect', openSite: 'Open site', refresh: 'Refresh', remove: 'Remove',
    confirmRemove: 'Remove this account?', used: 'Used', left: 'Left',
    resetsIn: 'Resets in', availableIn: 'Available again in', resetUnknown: 'Reset time unknown',
    updated: 'Last updated', loading: 'Loading…',
    notLoggedIn: 'Not signed in on the linked browser. Sign in there — it updates within a minute.', error: 'Error',
    NO_USAGE: 'No usage meters came back — usually a Free account. Use “Free quota tracker” in Connect to count it yourself.',
    NO_PLAN_USAGE: 'Connected, but no usage data for this plan — usually a Free account. Use “Free quota tracker” in Connect.',
    MANUAL: 'This service has no usage API for personal accounts — this is a manual counter.',
    manualSummary: 'Quota & counter settings', title: 'Title', limit: 'Quota limit', usedLbl: 'Used',
    period: 'Period (hours)', nextReset: 'Next reset', save: 'Save',
    language: 'Language', interval: 'Auto-refresh every (minutes)', about: 'About', developer: 'Developer', close: 'Close',
    w: { '5-hour': '5-hour window', 'Weekly': 'Weekly window', 'Weekly Opus': 'Weekly Opus', 'Weekly Sonnet': 'Weekly Sonnet', 'Extra usage': 'Extra usage', 'Quota': 'Quota' },
    hour: '-hour window', day: '-day window',
    d: 'd', h: 'h', m: 'm', s: 's', now: 'now',
    tabExt: 'Browser extension', tabManual: 'Free quota tracker', srcExt: 'Browser extension', srcManual: 'Free tracker',
    chipLinked: '● Linked', chipWaiting: 'Waiting for the browser…', waitingExt: 'Waiting for the first report from the browser extension…',
    storeBtn: 'Get it on Chrome Web Store', openFolder: 'Open extension folder',
    ext1: 'Install the <b>AI Usage Monitor</b> extension in Chrome, Edge or Brave and sign in to {service} in that browser (any sign-in method works).',
    ext1b: 'Not on the store yet? Press “Open extension folder”, then open <code>chrome://extensions</code> → turn on <b>Developer mode</b> → <b>Load unpacked</b> → pick that folder.',
    ext2: 'Copy this code, click the extension icon, open <b>Desktop app link</b> and paste it there. The card shows “Linked” within a minute. Several accounts? Use one browser profile per account and each profile’s own code.',
    ext3: 'The extension also works on its own — it lists every account it sees, with usage and reset times, right in the browser.',
    copyCode: 'Copy code', portBusy: 'The local connection port is busy. Close other copies of the app and restart it.',
    manualDesc: 'Free accounts usually have no usage meters. Track your own quota here: set the limit and the reset time on the card, press <b>+1</b> for each use, and the app counts down to the reset.',
    useManual: 'Use the free quota tracker',
    done: 'Done', connect: 'Connect', reconnect: 'Reconnect', notConnected: 'Not connected yet — press “Connect”.',
    srcFile: 'Official app login', srcCookie: 'Browser cookie',
    connectTitle: 'Connect {service}', tabApp: 'Official app', tabCookie: 'Browser cookie',
    app_claude: 'Sign in with the official <b>Claude Code</b> app — it opens <b>your own browser</b>. Install it, run <code>claude</code> in a terminal and type <code>/login</code>.',
    app_chatgpt: 'Sign in with the official <b>Codex CLI</b> app — it opens <b>your own browser</b>. Install it and run <code>codex login</code>.',
    multi_claude: 'Second account? Before signing in run <code>set CLAUDE_CONFIG_DIR=C:\\claude-2</code> (any new folder), then <code>claude</code> → <code>/login</code>, and pick that folder’s <code>.credentials.json</code> below.',
    multi_chatgpt: 'Second account? Before signing in run <code>set CODEX_HOME=C:\\codex-2</code>, then <code>codex login</code>, and pick that folder’s <code>auth.json</code> below.',
    loginFile: 'Login file', browse: 'Browse…', fileFound: 'File found', fileMissing: 'File not found yet — sign in with the app first.',
    useLogin: 'Use this login',
    ck1: 'Sign in to {service} in your own browser first.', openSite2: 'Open sign-in page in my browser',
    ck2_claude: 'In that browser press <b>F12 → Network</b>, reload the page, click any request to <code>claude.ai</code> and copy the value of the <code>cookie</code> request header (or only your <code>sessionKey</code> cookie value). Paste it here:',
    ck2_chatgpt: 'In that browser press <b>F12 → Network</b>, reload the page, click any request to <code>chatgpt.com</code> and copy the value of the <code>cookie</code> request header. Paste it here:',
    uaLabel: 'Browser User-Agent (optional — only if you get a “Cloudflare” error)',
    ckNote: 'The cookie is kept only in this account’s private browser storage on your PC and stops working when you sign out of the service.',
    connecting: 'Connecting…', connectedOk: 'Connected ✓', connectedEmpty: 'Connected, but no usage data came back — see “Diagnostics” on the card.',
    diag: 'Diagnostics', copyDiag: 'Copy diagnostics', copied: 'Copied ✓',
    e_NOT_LOGGED_IN: 'The service rejected the login. Sign in again in your browser and reconnect.',
    e_TOKEN_EXPIRED: 'The saved app login has expired. Use Claude Code / Codex once so it refreshes, or reconnect.',
    e_FILE_NOT_FOUND: 'Login file not found.', e_FILE_INVALID: 'The login file is not valid JSON.', e_FILE_UNREADABLE: 'The login file cannot be read.',
    e_NO_TOKEN: 'No access token in the login file — sign in with the official app first.',
    e_CLOUDFLARE: 'Blocked by Cloudflare. Reconnect with the full cookie header and your browser’s User-Agent, or use the official app login.',
    e_NOT_JSON: 'The service answered with something that is not data (see Diagnostics).', e_NETWORK: 'Network error — check your connection.',
    e_NOT_CONNECTED: 'Not connected yet.', e_BAD_COOKIE: 'The cookie could not be used.', e_EMPTY_COOKIE: 'Paste a cookie first.',
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
    NO_USAGE: 'شمارنده‌ی مصرفی برنگشت — معمولاً اکانت Free است. در «اتصال» از «ردیاب سهمیه‌ی Free» استفاده کن.',
    NO_PLAN_USAGE: 'متصل است ولی برای این پلن اطلاعات مصرف نیست — معمولاً اکانت Free است. در «اتصال» از «ردیاب سهمیه‌ی Free» استفاده کن.',
    MANUAL: 'این سرویس برای اکانت شخصی API مصرف ندارد؛ این یک شمارنده دستی است.',
    manualSummary: 'تنظیم سهمیه و شمارنده', title: 'عنوان', limit: 'سقف سهمیه', usedLbl: 'مصرف شده',
    period: 'طول بازه (ساعت)', nextReset: 'زمان ریست بعدی', save: 'ذخیره',
    language: 'زبان', interval: 'بروزرسانی خودکار هر (دقیقه)', about: 'درباره', developer: 'توسعه‌دهنده', close: 'بستن',
    w: { '5-hour': 'بازه ۵ ساعته', 'Weekly': 'بازه هفتگی', 'Weekly Opus': 'هفتگی Opus', 'Weekly Sonnet': 'هفتگی Sonnet', 'Extra usage': 'مصرف اضافه', 'Quota': 'سهمیه' },
    hour: ' ساعته', day: ' روزه',
    d: ' روز', h: ' ساعت', m: ' دقیقه', s: ' ثانیه', now: 'همین الان',
    tabExt: 'افزونه مرورگر', tabManual: 'ردیاب سهمیه‌ی Free', srcExt: 'افزونه مرورگر', srcManual: 'ردیاب Free',
    chipLinked: '● متصل', chipWaiting: 'در انتظار مرورگر…', waitingExt: 'در انتظار اولین گزارش افزونه‌ی مرورگر…',
    storeBtn: 'دریافت از Chrome Web Store', openFolder: 'باز کردن پوشه افزونه',
    ext1: 'افزونه‌ی <b>AI Usage Monitor</b> را در Chrome، Edge یا Brave نصب کن و در همان مرورگر وارد {service} شو (هر روش ورودی جواب می‌دهد).',
    ext1b: 'هنوز در استور نیست؟ «باز کردن پوشه افزونه» را بزن، بعد <code>chrome://extensions</code> را باز کن ← <b>Developer mode</b> را روشن کن ← <b>Load unpacked</b> ← همان پوشه را انتخاب کن.',
    ext2: 'این کد را کپی کن، روی آیکن افزونه کلیک کن، <b>اتصال به برنامه دسکتاپ</b> را باز کن و آنجا بچسبان. کارت ظرف یک دقیقه «متصل» می‌شود. چند اکانت؟ برای هر اکانت یک پروفایل مرورگر جدا و کد همان پروفایل.',
    ext3: 'افزونه به‌تنهایی هم کار می‌کند — همه‌ی اکانت‌هایی که می‌بیند را با مصرف و زمان ریست همان‌جا داخل مرورگر نشان می‌دهد.',
    copyCode: 'کپی کد', portBusy: 'پورت اتصال محلی اشغال است. نسخه‌های دیگر اپ را ببند و دوباره اجرا کن.',
    manualDesc: 'اکانت‌های Free معمولاً شمارنده‌ی مصرف ندارند. سهمیه‌ات را اینجا خودت دنبال کن: سقف و زمان ریست را روی کارت تنظیم کن، با هر استفاده <b>+1</b> بزن و اپ تا ریست می‌شمارد.',
    useManual: 'استفاده از ردیاب سهمیه‌ی Free',
    done: 'تمام', connect: 'اتصال', reconnect: 'اتصال مجدد', notConnected: 'هنوز وصل نشده — «اتصال» را بزن.',
    srcFile: 'ورود با اپ رسمی', srcCookie: 'کوکی مرورگر',
    connectTitle: 'اتصال {service}', tabApp: 'اپ رسمی', tabCookie: 'کوکی مرورگر',
    app_claude: 'با اپ رسمی <b>Claude Code</b> وارد شو — خودش <b>مرورگر خودت</b> را باز می‌کند. نصبش کن، در ترمینال <code>claude</code> را اجرا کن و <code>/login</code> را بزن.',
    app_chatgpt: 'با اپ رسمی <b>Codex CLI</b> وارد شو — خودش <b>مرورگر خودت</b> را باز می‌کند. نصبش کن و <code>codex login</code> را اجرا کن.',
    multi_claude: 'اکانت دوم؟ قبل از ورود <code>set CLAUDE_CONFIG_DIR=C:\\claude-2</code> را اجرا کن (هر پوشه‌ی جدید)، بعد <code>claude</code> ← <code>/login</code>، و پایین فایل <code>.credentials.json</code> همان پوشه را انتخاب کن.',
    multi_chatgpt: 'اکانت دوم؟ قبل از ورود <code>set CODEX_HOME=C:\\codex-2</code> را اجرا کن، بعد <code>codex login</code>، و پایین فایل <code>auth.json</code> همان پوشه را انتخاب کن.',
    loginFile: 'فایل ورود', browse: 'انتخاب…', fileFound: 'فایل پیدا شد', fileMissing: 'فایل هنوز پیدا نشده — اول با اپ رسمی وارد شو.',
    useLogin: 'استفاده از این ورود',
    ck1: 'اول داخل مرورگر خودت وارد {service} شو.', openSite2: 'باز کردن صفحه ورود در مرورگر من',
    ck2_claude: 'در همان مرورگر <b>F12 ← Network</b> را بزن، صفحه را رفرش کن، روی یک درخواست به <code>claude.ai</code> کلیک کن و مقدار هدر <code>cookie</code> را (یا فقط مقدار کوکی <code>sessionKey</code>) کپی کن و اینجا بچسبان:',
    ck2_chatgpt: 'در همان مرورگر <b>F12 ← Network</b> را بزن، صفحه را رفرش کن، روی یک درخواست به <code>chatgpt.com</code> کلیک کن و مقدار هدر <code>cookie</code> را کپی کن و اینجا بچسبان:',
    uaLabel: 'User-Agent مرورگر (اختیاری — فقط اگر خطای «Cloudflare» گرفتی)',
    ckNote: 'کوکی فقط در حافظه‌ی خصوصی همین اکانت روی کامپیوترت می‌ماند و با خروج از سرویس از کار می‌افتد.',
    connecting: 'در حال اتصال…', connectedOk: 'متصل شد ✓', connectedEmpty: 'متصل شد ولی اطلاعات مصرف برنگشت — بخش «عیب‌یابی» روی کارت را ببین.',
    diag: 'عیب‌یابی', copyDiag: 'کپی عیب‌یابی', copied: 'کپی شد ✓',
    e_NOT_LOGGED_IN: 'سرویس ورود را رد کرد. دوباره در مرورگر وارد شو و مجدد وصل کن.',
    e_TOKEN_EXPIRED: 'ورود ذخیره‌شده‌ی اپ منقضی شده. یک‌بار Claude Code / Codex را استفاده کن تا تمدید شود، یا مجدد وصل کن.',
    e_FILE_NOT_FOUND: 'فایل ورود پیدا نشد.', e_FILE_INVALID: 'فایل ورود JSON معتبر نیست.', e_FILE_UNREADABLE: 'فایل ورود خوانده نشد.',
    e_NO_TOKEN: 'توکنی در فایل ورود نیست — اول با اپ رسمی وارد شو.',
    e_CLOUDFLARE: 'Cloudflare مسدود کرد. با هدر کامل cookie و User-Agent مرورگرت دوباره وصل کن، یا از ورود با اپ رسمی استفاده کن.',
    e_NOT_JSON: 'سرویس چیزی غیر از داده برگرداند (عیب‌یابی را ببین).', e_NETWORK: 'خطای شبکه — اتصال اینترنت را بررسی کن.',
    e_NOT_CONNECTED: 'هنوز وصل نشده.', e_BAD_COOKIE: 'کوکی قابل استفاده نبود.', e_EMPTY_COOKIE: 'اول یک کوکی بچسبان.',
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

const errText = code => { const t = T(); return code === 'NOT_LOGGED_IN' ? t.e_NOT_LOGGED_IN : (t['e_' + code] || `${t.error}: ${code}`); };

function diagHtml(d) {
  if (!d.diag || !d.diag.length || !(d.error || d.note === 'NO_USAGE' || d.note === 'NO_PLAN_USAGE')) return '';
  return `<details class="diag"><summary>${T().diag}</summary><pre>${esc(d.diag.join('\n'))}</pre><button data-act="copyDiag">${T().copyDiag}</button></details>`;
}

const LINK_FRESH_MS = 5 * 60 * 1000;
const isLinked = a => a.lastSeen && Date.now() - a.lastSeen < LINK_FRESH_MS;
const SRC_LABEL = { file: 'srcFile', cookie: 'srcCookie', extension: 'srcExt', manual: 'srcManual' };

function render() {
  const t = T();
  applyI18n(); renderNav();
  const accs = state.accounts.filter(a => filter === 'all' || a.provider === filter);
  const list = $('#list');
  if (!accs.length) { list.innerHTML = `<div class="empty">${t.empty}</div>`; return; }
  list.innerHTML = accs.map(a => {
    const d = a.data || {};
    const auto = a.kind === 'auto';
    const st = a.source && a.source.type;
    const err = d.error ? `<div class="err">${esc(errText(d.error))}</div>` : '';
    const sub = [d.email, d.plan].filter(Boolean).join(' · ');
    let chip = '';
    if (auto && st === 'extension') chip = `<span class="chip ${isLinked(a) ? '' : 'wait'}">${isLinked(a) ? t.chipLinked : t.chipWaiting}</span>`;
    else if (auto && st) chip = `<span class="chip">${t[SRC_LABEL[st]]}</span>`;
    const canRefresh = st === 'file' || st === 'cookie';
    const buttons = auto
      ? `<button data-act="connect">${st ? t.reconnect : t.connect}</button>${canRefresh ? `<button data-act="refresh" title="${t.refresh}">⟳</button>` : ''}<button data-act="remove" title="${t.remove}">✕</button>`
      : `<button data-act="site">${t.openSite}</button><button data-act="remove" title="${t.remove}">✕</button>`;
    return `<div class="card" data-id="${a.id}">
      <div class="head"><span class="badge p-${a.provider}">${NAMES[a.provider]}</span><b>${esc(a.label)}</b> ${chip}
        <div class="btns">${buttons}</div>
        ${sub ? `<small>${esc(sub)}</small>` : ''}</div>
      ${err}${(d.windows || []).map(winHtml).join('')}
      ${d.note && t[d.note] ? `<div class="note">${t[d.note]}</div>` : ''}
      ${auto && !st ? `<div class="note">${t.notConnected}</div>` : ''}
      ${!a.data && st === 'extension' ? `<div class="note">${t.waitingExt}</div>` : ''}
      ${!a.data && (st === 'file' || st === 'cookie') ? `<div class="note">${t.loading}</div>` : ''}
      ${diagHtml(d)}
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
  if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && (ae.closest('.card') || ae.closest('#connect'))) return;
  render();
}

// ---- connect dialog: sign-in happens in your own browser / the official app, never inside this app ----
let connectId = null, connectTab = 'ext', storeUrl = '';
const TAB_OF = { extension: 'ext', file: 'app', cookie: 'cookie', manual: 'manual' };
async function openConnect(id, tab) {
  const a = state.accounts.find(x => x.id === id); if (!a) return;
  connectId = id;
  connectTab = tab || (a.source && TAB_OF[a.source.type]) || 'ext';
  const t = T(), name = NAMES[a.provider];
  $('#cTitle').textContent = t.connectTitle.replace('{service}', name);
  const tabs = '<div class="tabs">' + [['ext', t.tabExt], ['app', t.tabApp], ['cookie', t.tabCookie], ['manual', t.tabManual]]
    .map(([k, label]) => `<button data-c="tab-${k}" class="${connectTab === k ? 'on' : ''}">${label}</button>`).join('') + '</div>';
  let body = '';
  if (connectTab === 'ext') {
    const p = await api.pairing(id);
    const code = p.code
      ? `<textarea readonly id="code">${esc(p.code)}</textarea><button data-c="copy">${t.copyCode}</button>`
      : `<div class="err">${t.portBusy}</div>`;
    body = `<ol class="steps">
      <li><div>${t.ext1.replace('{service}', name)}</div>
        <div class="q">${storeUrl ? `<button class="primary" data-c="store">${t.storeBtn}</button>` : ''}<button data-c="folder">${t.openFolder}</button></div>
        <div class="muted" style="margin-top:8px">${t.ext1b}</div></li>
      <li><div>${t.ext2}</div>${code}</li></ol>
      <div class="cnote">${t.ext3}</div>`;
  } else if (connectTab === 'app') {
    const f = await api.detectFile(id);
    body = `<ol class="steps">
      <li><div>${t['app_' + a.provider]}</div><div class="muted">${t['multi_' + a.provider]}</div></li>
      <li><div>${t.loginFile}</div>
        <div class="pathrow"><input type="text" id="filePath" value="${esc((f && f.path) || '')}"><button data-c="browse">${t.browse}</button></div>
        <div class="status ${f && f.exists ? 'ok' : 'bad'}" id="fileStatus">${f && f.exists ? t.fileFound : t.fileMissing}</div></li>
      <li><button class="primary" data-c="useFile">${t.useLogin}</button><div class="status" id="cResult"></div></li></ol>`;
  } else if (connectTab === 'cookie') {
    body = `<ol class="steps">
      <li><div>${t.ck1.replace('{service}', name)}</div><button data-c="site">${t.openSite2}</button></li>
      <li><div>${t['ck2_' + a.provider]}</div><textarea class="cookie" id="cookie" spellcheck="false"></textarea>
        <div class="muted">${t.uaLabel}</div><input type="text" id="ua" spellcheck="false"></li>
      <li><button class="primary" data-c="useCookie">${t.connect}</button><div class="status" id="cResult"></div></li></ol>
      <div class="cnote">${t.ckNote}</div>`;
  } else {
    body = `<div class="steps"><div>${t.manualDesc}</div>
      <div><button class="primary" data-c="useManual">${t.useManual}</button><div class="status" id="cResult"></div></div></div>`;
  }
  $('#cBody').innerHTML = tabs + body;
  $('#connect').classList.remove('hidden');
}
function showResult(r) {
  const t = T(), el = $('#cResult'); if (!el) return;
  if (r.error) { el.className = 'status bad'; el.textContent = errText(r.error); }
  else if (!r.windows) { el.className = 'status bad'; el.textContent = t.connectedEmpty; }
  else { el.className = 'status ok'; el.textContent = t.connectedOk; setTimeout(() => $('#connect').classList.add('hidden'), 900); }
}
$('#cBody').addEventListener('click', async e => {
  const b = e.target.closest('button[data-c]'); if (!b) return;
  const c = b.dataset.c, t = T();
  if (c.startsWith('tab-')) openConnect(connectId, c.slice(4));
  else if (c === 'site') api.openSite(connectId);
  else if (c === 'folder') api.openExtensionFolder();
  else if (c === 'store') api.openExternal(storeUrl);
  else if (c === 'copy') { api.copy($('#code').value); b.textContent = t.copied; }
  else if (c === 'useManual') { showResult(await api.setManual(connectId)); }
  else if (c === 'browse') {
    const r = await api.browseFile(connectId);
    if (r) { $('#filePath').value = r.path; $('#fileStatus').className = 'status ok'; $('#fileStatus').textContent = t.fileFound; }
  } else if (c === 'useFile') {
    $('#cResult').className = 'status'; $('#cResult').textContent = t.connecting;
    showResult(await api.setFile(connectId, $('#filePath').value.trim()));
  } else if (c === 'useCookie') {
    $('#cResult').className = 'status'; $('#cResult').textContent = t.connecting;
    showResult(await api.setCookie(connectId, $('#cookie').value, $('#ua').value));
  }
});
$('#cClose').onclick = () => $('#connect').classList.add('hidden');
$('#connect').addEventListener('click', e => { if (e.target.id === 'connect') $('#connect').classList.add('hidden'); });

// ---- updates ----
let upd = { status: 'idle' };
function renderUpdate() {
  const t = T();
  let text = t['u_' + (upd.status || 'idle')] || '';
  text = text.replace('{v}', upd.version ? 'v' + upd.version : '').replace('{p}', upd.percent != null ? ' ' + upd.percent + '%' : '');
  $('#updText').textContent = text;
  $('#updInstall').classList.toggle('hidden', upd.status !== 'ready');
  $('#updCheck').classList.toggle('hidden', upd.status === 'portable' || upd.status === 'dev' || upd.status === 'ready');
}

$('#list').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const card = b.closest('.card'); const id = card.dataset.id; const act = b.dataset.act;
  if (act === 'connect') openConnect(id);
  else if (act === 'refresh') api.refresh(id);
  else if (act === 'site') api.openSite(id);
  else if (act === 'copyDiag') { const a = state.accounts.find(x => x.id === id); api.copy(`${NAMES[a.provider]} (${a.source ? a.source.type : 'none'})\n` + ((a.data && a.data.diag) || []).join('\n')); b.textContent = T().copied; }
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
  if (r && r.kind === 'auto') { state = await api.getState(); render(); openConnect(r.id, 'ext'); }
};
$('#all').onclick = () => api.refreshAll();
$('#settingsBtn').onclick = () => $('#modal').classList.remove('hidden');
$('#closeModal').onclick = () => $('#modal').classList.add('hidden');
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') $('#modal').classList.add('hidden'); });
$('#lang').onchange = e => api.setSettings({ lang: e.target.value });
$('#iv').onchange = e => api.setSettings({ intervalMin: Math.max(1, Number(e.target.value) || 5) });
$('#updCheck').onclick = () => api.checkUpdates();
$('#updInstall').onclick = () => api.installUpdate();

api.onState(setState);
api.onUpdate(u => { upd = u; renderUpdate(); });
api.updateState().then(u => { upd = u; renderUpdate(); });
api.appInfo().then(i => { storeUrl = i.storeUrl || ''; $('#ver').textContent = 'v' + i.version; $('#ver2').textContent = 'v' + i.version; });
api.getState().then(s => { state = s; $('#lang').value = s.settings.lang; $('#iv').value = s.settings.intervalMin || 5; render(); });

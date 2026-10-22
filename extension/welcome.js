const I18N = {
  en: {
    title: 'Welcome to AI Usage Monitor',
    lead: 'See how much of Claude and ChatGPT you have left — and exactly when it resets — right in your browser.',
    first1: 'Sign in to claude.ai and/or chatgpt.com in this browser (if you are not already).',
    first2: 'Click the extension icon in the toolbar (pin it with the puzzle-piece menu). Your accounts appear automatically.',
    extTitle: 'What this extension does',
    ext1: 'Shows every Claude / ChatGPT account you use in this browser: plan, usage bars and live reset countdowns.',
    ext2: 'Puts your highest usage on the toolbar badge (green / amber / red).',
    ext3: 'Notifies you when a limit has reset and you can use the account again.',
    ext4: 'Private: it only talks to claude.ai, chatgpt.com and — if you choose — the desktop app on your own PC.',
    appTitle: 'Meet the desktop app',
    appText: 'AI Usage Monitor for Windows is a free, open-source companion that puts all your AI accounts in one window.',
    app1: 'Claude, ChatGPT, Gemini and Figma — with several accounts of each.',
    app2: 'Used / left and a live countdown to every reset, plus a Windows notification when a limit resets.',
    app3: 'A free quota tracker for accounts that have no usage meters (for example Free plans).',
    app4: 'Connect your way: this extension, the official app login (Claude Code / Codex CLI) or a browser cookie.',
    app5: 'English and Persian, dark/orange interface, automatic updates, no telemetry.',
    download: 'Download for Windows', github: 'View on GitHub', website: 'Developer website',
    linkTitle: 'Link the extension to the desktop app (optional)',
    link1: 'In the desktop app press “Add account” (or “Connect” on an account) and open the “Browser extension” tab.',
    link2: 'Copy the code, click this extension’s icon, open “Desktop app link” and paste it.',
    link3: 'The account shows “Linked” in the app within a minute.',
    linkNote: 'The extension works fine on its own — linking is only needed if you want the numbers in the desktop app too. Several accounts of one service? Use one browser profile per account.',
    privacy: 'Nothing is collected or sent to us.', privacyLink: 'Privacy policy',
    disclaimer: 'Not affiliated with Anthropic, OpenAI, Google or Figma. MIT licensed.'
  },
  fa: {
    title: 'به AI Usage Monitor خوش آمدی',
    lead: 'ببین چقدر از Claude و ChatGPT باقی مانده و دقیقاً کی ریست می‌شود — همین‌جا داخل مرورگر.',
    first1: 'اگر هنوز وارد نشده‌ای، در این مرورگر وارد claude.ai و/یا chatgpt.com شو.',
    first2: 'روی آیکن افزونه در نوار ابزار کلیک کن (با منوی puzzle-piece پینش کن). اکانت‌هایت خودکار نمایش داده می‌شوند.',
    extTitle: 'این افزونه چه می‌کند',
    ext1: 'همه‌ی اکانت‌های Claude / ChatGPT که در این مرورگر استفاده می‌کنی را نشان می‌دهد: پلن، نوار مصرف و شمارش معکوس زنده‌ی ریست.',
    ext2: 'بیشترین مصرف را روی نشان نوار ابزار می‌گذارد (سبز / نارنجی / قرمز).',
    ext3: 'وقتی محدودیت ریست شد و دوباره می‌توانی از اکانت استفاده کنی، اعلان می‌دهد.',
    ext4: 'خصوصی است: فقط با claude.ai، chatgpt.com و — اگر بخواهی — اپ دسکتاپ روی کامپیوتر خودت حرف می‌زند.',
    appTitle: 'با اپ دسکتاپ آشنا شو',
    appText: 'AI Usage Monitor برای ویندوز یک همراه رایگان و متن‌باز است که همه‌ی اکانت‌های هوش مصنوعی‌ات را در یک پنجره نشان می‌دهد.',
    app1: 'Claude، ChatGPT، Gemini و Figma — با چند اکانت از هرکدام.',
    app2: 'مصرف / باقی‌مانده و شمارش معکوس زنده‌ی هر ریست، با اعلان ویندوز هنگام ریست شدن.',
    app3: 'ردیاب سهمیه‌ی Free برای اکانت‌هایی که شمارنده‌ی مصرف ندارند (مثلاً پلن‌های Free).',
    app4: 'به روش خودت وصل شو: همین افزونه، ورود با اپ رسمی (Claude Code / Codex CLI) یا کوکی مرورگر.',
    app5: 'فارسی و انگلیسی، رابط تیره/نارنجی، آپدیت خودکار، بدون ردیابی.',
    download: 'دانلود برای ویندوز', github: 'مشاهده در گیت‌هاب', website: 'وب‌سایت توسعه‌دهنده',
    linkTitle: 'اتصال افزونه به اپ دسکتاپ (اختیاری)',
    link1: 'در اپ دسکتاپ «افزودن اکانت» (یا «اتصال» روی یک اکانت) را بزن و تب «افزونه مرورگر» را باز کن.',
    link2: 'کد را کپی کن، روی آیکن همین افزونه کلیک کن، «اتصال به برنامه دسکتاپ» را باز کن و بچسبان.',
    link3: 'اکانت ظرف یک دقیقه در اپ «متصل» می‌شود.',
    linkNote: 'افزونه به‌تنهایی هم کامل کار می‌کند — اتصال فقط وقتی لازم است که بخواهی اعداد در اپ دسکتاپ هم باشد. چند اکانت از یک سرویس؟ برای هر اکانت یک پروفایل مرورگر جدا استفاده کن.',
    privacy: 'هیچ چیزی جمع‌آوری یا برای ما ارسال نمی‌شود.', privacyLink: 'سیاست حریم خصوصی',
    disclaimer: 'وابسته به Anthropic، OpenAI، Google یا Figma نیست. مجوز MIT.'
  }
};
const $ = s => document.querySelector(s);
async function init() {
  let lang = (navigator.language || '').toLowerCase().startsWith('fa') ? 'fa' : 'en';
  try {
    const st = await chrome.storage.local.get('settings');
    if (st.settings && (st.settings.lang === 'en' || st.settings.lang === 'fa')) lang = st.settings.lang;
  } catch {}
  apply(lang);
  $('#lang').onchange = async e => {
    apply(e.target.value);
    try { const st = await chrome.storage.local.get('settings'); await chrome.storage.local.set({ settings: { ...(st.settings || {}), lang: e.target.value } }); } catch {}
  };
}
function apply(lang) {
  const t = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  $('#lang').value = lang;
  document.querySelectorAll('[data-i]').forEach(el => { el.textContent = t[el.dataset.i]; });
  document.title = t.title;
}
init();

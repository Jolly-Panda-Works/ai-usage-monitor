const { net } = require('electron');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

/* ---------- helpers ---------- */
function http(url, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = net.request({ url, method, useSessionCookies: false });
    for (const [k, v] of Object.entries(headers)) req.setHeader(k, v);
    const timer = setTimeout(() => { req.abort(); reject(new Error('Timeout')); }, 20000);
    req.on('response', (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        clearTimeout(timer);
        const h = {};
        for (const [k, v] of Object.entries(res.headers)) h[k.toLowerCase()] = Array.isArray(v) ? v[0] : v;
        resolve({ status: res.statusCode, headers: h, text: Buffer.concat(chunks).toString('utf8') });
      });
    });
    req.on('error', (e) => { clearTimeout(timer); reject(e); });
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}
const safeJson = (t) => { try { return JSON.parse(t); } catch { return null; } };
const num = (v) => (v === undefined || v === null || v === '' || isNaN(Number(v)) ? null : Number(v));
const err = (error) => ({ status: 'error', error });

function parseDuration(s) {
  if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s) * 1000;
  const re = /(\d+(?:\.\d+)?)(ms|h|m|s)/g;
  let m, ms = 0, found = false;
  while ((m = re.exec(s))) {
    found = true;
    const n = parseFloat(m[1]);
    ms += m[2] === 'ms' ? n : m[2] === 's' ? n * 1000 : m[2] === 'm' ? n * 60000 : n * 3600000;
  }
  return found ? ms : null;
}

function limitMeter(label, limit, remaining, resetsAt, unit) {
  limit = num(limit); remaining = num(remaining);
  if (limit === null || remaining === null) return null;
  const used = Math.max(0, limit - remaining);
  return { label, limit, remaining, used, unit, usedPct: limit ? (used / limit) * 100 : 0, resetsAt: resetsAt || null };
}

/* ---------- Claude: OAuth (Claude Code login) ---------- */
const CLAUDE_CLIENT_ID = '9d1c250a-e61b-44d9-88ed-5944d1962f5e';
const CLAUDE_LABELS = {
  five_hour: 'Session (5h)', seven_day: 'Weekly', seven_day_opus: 'Weekly Opus',
  seven_day_sonnet: 'Weekly Sonnet', seven_day_oauth_apps: 'Weekly (OAuth apps)', extra_usage: 'Extra usage',
};

function claudeMeters(j) {
  const meters = [];
  for (const [k, v] of Object.entries(j || {})) {
    if (v && typeof v === 'object' && typeof v.utilization === 'number') {
      meters.push({
        label: CLAUDE_LABELS[k] || k,
        usedPct: v.utilization,
        resetsAt: v.resets_at ? Date.parse(v.resets_at) : null,
      });
    }
  }
  return meters;
}

async function claudeRefresh(creds) {
  const r = await http('https://console.anthropic.com/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { grant_type: 'refresh_token', refresh_token: creds.refreshToken, client_id: CLAUDE_CLIENT_ID },
  });
  const j = safeJson(r.text);
  if (r.status !== 200 || !j || !j.access_token) throw new Error('Refresh failed (HTTP ' + r.status + ')');
  creds.accessToken = j.access_token;
  if (j.refresh_token) creds.refreshToken = j.refresh_token;
  if (j.expires_in) creds.expiresAt = Date.now() + j.expires_in * 1000;
}

async function claudeOauth(creds, ctx) {
  const call = () => http('https://api.anthropic.com/api/oauth/usage', {
    headers: {
      Authorization: 'Bearer ' + creds.accessToken,
      'anthropic-beta': 'oauth-2025-04-20',
      'Content-Type': 'application/json',
      'User-Agent': 'claude-code/2.0.0',
    },
  });
  if (creds.refreshToken && creds.expiresAt && Date.now() > creds.expiresAt - 60000) {
    try { await claudeRefresh(creds); ctx.save(creds); } catch { /* try with the current token */ }
  }
  let r = await call();
  if (r.status === 401 && creds.refreshToken) {
    await claudeRefresh(creds); ctx.save(creds); r = await call();
  }
  if (r.status === 401) return err('توکن نامعتبر/منقضی است. دوباره لاگین کنید و credentials جدید را وارد کنید.');
  if (r.status !== 200) return err('HTTP ' + r.status);
  const meters = claudeMeters(safeJson(r.text));
  if (!meters.length) return err('پاسخ نامعتبر از سرور');
  return { status: 'ok', plan: creds.plan, meters };
}

/* ---------- Claude: claude.ai session cookie ---------- */
async function claudeSession(creds) {
  const headers = {
    Cookie: 'sessionKey=' + creds.sessionKey,
    'User-Agent': UA,
    Accept: 'application/json',
    'anthropic-client-platform': 'web_claude_ai',
  };
  const o = await http('https://claude.ai/api/organizations', { headers });
  if (o.status === 401 || o.status === 403) {
    return err(/just a moment|cloudflare/i.test(o.text)
      ? 'Cloudflare درخواست را مسدود کرد؛ از روش OAuth استفاده کنید.'
      : 'sessionKey نامعتبر یا منقضی است.');
  }
  const orgs = safeJson(o.text);
  if (!Array.isArray(orgs) || !orgs.length) return err('Organization پیدا نشد');
  const org = orgs.find((x) => (x.capabilities || []).includes('chat')) || orgs[0];
  const u = await http(`https://claude.ai/api/organizations/${org.uuid}/usage`, { headers });
  if (u.status !== 200) return err('HTTP ' + u.status);
  const meters = claudeMeters(safeJson(u.text));
  if (!meters.length) return err('پاسخ نامعتبر از سرور');
  return { status: 'ok', plan: org.rate_limit_tier || org.billing_type || null, meters };
}

/* ---------- Claude: API key ---------- */
async function claudeApi(creds) {
  const r = await http('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': creds.apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: { model: 'claude-haiku-4-5', max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] },
  });
  if (r.status === 401) return err('API key نامعتبر است.');
  const h = r.headers, p = 'anthropic-ratelimit-';
  const meters = [
    limitMeter('Tokens / min', h[p + 'tokens-limit'], h[p + 'tokens-remaining'], Date.parse(h[p + 'tokens-reset']), 'tokens'),
    limitMeter('Input tokens / min', h[p + 'input-tokens-limit'], h[p + 'input-tokens-remaining'], Date.parse(h[p + 'input-tokens-reset']), 'tokens'),
    limitMeter('Output tokens / min', h[p + 'output-tokens-limit'], h[p + 'output-tokens-remaining'], Date.parse(h[p + 'output-tokens-reset']), 'tokens'),
    limitMeter('Requests / min', h[p + 'requests-limit'], h[p + 'requests-remaining'], Date.parse(h[p + 'requests-reset']), 'req'),
  ].filter(Boolean);
  if (!meters.length) return err('HTTP ' + r.status + ' — هدر rate-limit دریافت نشد');
  return { status: r.status === 429 ? 'limited' : 'ok', meters, note: 'محدودیت‌های API بر حسب دقیقه است (نه سقف ماهانه).' };
}

/* ---------- ChatGPT (subscription, same endpoint Codex uses) ---------- */
function windowLabel(secs, fallback) {
  if (!secs) return fallback;
  if (secs % 86400 === 0) return secs / 86400 === 7 ? 'Weekly' : `${secs / 86400}d window`;
  return `${Math.round(secs / 3600)}h window`;
}
function gptWindow(label, w) {
  if (!w || typeof w.used_percent !== 'number') return null;
  let resetsAt = null;
  if (w.reset_at) resetsAt = w.reset_at * (w.reset_at < 1e12 ? 1000 : 1);
  else if (typeof w.reset_after_seconds === 'number') resetsAt = Date.now() + w.reset_after_seconds * 1000;
  return { label: windowLabel(w.limit_window_seconds, label), usedPct: w.used_percent, resetsAt };
}
async function chatgpt(creds) {
  const headers = { Authorization: 'Bearer ' + creds.accessToken, 'User-Agent': 'codex-cli', Accept: 'application/json' };
  if (creds.accountId) headers['ChatGPT-Account-Id'] = creds.accountId;
  const r = await http('https://chatgpt.com/backend-api/wham/usage', { headers });
  if (r.status === 401 || r.status === 403) return err('Access token منقضی/نامعتبر است. توکن جدید وارد کنید.');
  if (r.status !== 200) return err('HTTP ' + r.status);
  const j = safeJson(r.text) || {};
  const rl = j.rate_limit || {};
  const meters = [gptWindow('Primary', rl.primary_window), gptWindow('Secondary', rl.secondary_window)].filter(Boolean);
  for (const extra of j.additional_rate_limits || []) {
    const e = extra.rate_limit || {};
    for (const [k, w] of [['primary_window', e.primary_window], ['secondary_window', e.secondary_window]]) {
      const m = gptWindow(extra.limit_name || 'Extra', w);
      if (m) { m.label = `${extra.limit_name || 'Extra'} — ${m.label}`; meters.push(m); }
    }
  }
  if (!meters.length) return err('پاسخ نامعتبر از سرور');
  const c = j.credits;
  return {
    status: rl.limit_reached ? 'limited' : 'ok',
    plan: j.plan_type || null,
    meters,
    note: c && c.balance != null ? 'Credits balance: ' + c.balance : null,
  };
}

/* ---------- OpenAI API key ---------- */
async function openaiApi(creds) {
  const r = await http('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + creds.apiKey, 'Content-Type': 'application/json' },
    body: { model: 'gpt-4o-mini', max_tokens: 1, messages: [{ role: 'user', content: 'hi' }] },
  });
  if (r.status === 401) return err('API key نامعتبر است.');
  const h = r.headers, p = 'x-ratelimit-';
  const t = (k) => { const d = parseDuration(h[p + k]); return d === null ? null : Date.now() + d; };
  const meters = [
    limitMeter('Tokens / min', h[p + 'limit-tokens'], h[p + 'remaining-tokens'], t('reset-tokens'), 'tokens'),
    limitMeter('Requests / min', h[p + 'limit-requests'], h[p + 'remaining-requests'], t('reset-requests'), 'req'),
  ].filter(Boolean);
  if (!meters.length) return err('HTTP ' + r.status + ' — هدر rate-limit دریافت نشد' + (r.status === 429 ? ' (quota تمام شده؟)' : ''));
  return { status: r.status === 429 ? 'limited' : 'ok', meters, note: 'محدودیت‌های API بر حسب دقیقه است (نه سقف ماهانه).' };
}

/* ---------- Gemini ---------- */
async function gemini(creds) {
  const r = await http('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1', {
    headers: { 'x-goog-api-key': creds.apiKey },
  });
  if (r.status === 400 || r.status === 403) return err('API key نامعتبر است.');
  if (r.status === 429) return { status: 'limited', meters: [], note: 'Quota تمام شده (429).' };
  if (r.status !== 200) return err('HTTP ' + r.status);
  return {
    status: 'info', meters: [],
    note: 'کلید معتبر است. گوگل مقدار باقی‌مانده quota را از طریق API نمی‌دهد؛ مقدار دقیق را در AI Studio ببینید.',
    link: 'https://aistudio.google.com/usage',
  };
}

/* ---------- Figma ---------- */
async function figma(creds) {
  const r = await http('https://api.figma.com/v1/me', { headers: { 'X-Figma-Token': creds.apiKey } });
  if (r.status === 403 || r.status === 401) return err('Personal access token نامعتبر است.');
  const tier = r.headers['x-figma-plan-tier'] || null;
  if (r.status === 429) {
    const ra = num(r.headers['retry-after']);
    return {
      status: 'limited', plan: tier, meters: [],
      note: 'Rate limit فعال است' + (r.headers['x-figma-rate-limit-type'] ? ` (${r.headers['x-figma-rate-limit-type']})` : '') + '.',
      resetsAt: ra !== null ? Date.now() + ra * 1000 : null,
    };
  }
  if (r.status !== 200) return err('HTTP ' + r.status);
  const me = safeJson(r.text) || {};
  return {
    status: 'info', plan: tier, meters: [],
    note: `متصل: ${me.email || me.handle || 'OK'}. فیگما فقط هنگام rate-limit (۴۲۹) زمان آزاد شدن را می‌دهد و API برای credits/باقی‌مانده ندارد.`,
    link: 'https://www.figma.com/settings',
  };
}

/* ---------- registry ---------- */
const tok = (s) => String(s || '').trim().replace(/^Bearer\s+/i, '');

const TYPES = {
  'claude-oauth': {
    vendor: 'claude', label: 'Claude — اشتراک (Claude Code OAuth)',
    help: 'بعد از لاگین با آن اکانت در Claude Code، فایل C:\\Users\\<نام>\\.claude\\.credentials.json را اینجا paste کنید (یا دکمه «خواندن از این کامپیوتر»). برای هر اکانت Claude یک‌بار با همان اکانت /login بزنید و ثبت کنید. توجه: توکن‌ها خودکار refresh می‌شوند؛ بهتر است برای هر اکانت یک بار login جدا بزنید.',
    localFile: ['.claude', '.credentials.json'],
    normalize(input) {
      const j = safeJson(input);
      if (j) {
        const o = j.claudeAiOauth || j;
        const accessToken = o.accessToken || o.access_token;
        if (!accessToken) throw new Error('accessToken در JSON پیدا نشد');
        return { accessToken, refreshToken: o.refreshToken || o.refresh_token || null, expiresAt: o.expiresAt || null, plan: o.subscriptionType || null };
      }
      const t = tok(input);
      if (!t) throw new Error('ورودی خالی است');
      return { accessToken: t };
    },
    fetch: claudeOauth,
  },
  'claude-session': {
    vendor: 'claude', label: 'Claude — Session cookie (claude.ai)',
    help: 'روش جایگزین: در مرورگر claude.ai → F12 → Application → Cookies → مقدار sessionKey را paste کنید. ممکن است Cloudflare مسدود کند؛ در این صورت روش OAuth را استفاده کنید.',
    normalize(input) {
      const m = /sessionKey=([^;\s]+)/.exec(input);
      const k = m ? m[1] : tok(input);
      if (!k) throw new Error('ورودی خالی است');
      return { sessionKey: k };
    },
    fetch: claudeSession,
  },
  'claude-api': {
    vendor: 'claude', label: 'Claude — API key',
    help: 'کلید sk-ant-... از console.anthropic.com. هر بار refresh یک درخواست ۱ توکنی ارسال می‌شود تا هدرهای rate-limit خوانده شوند.',
    normalize: (input) => { const k = tok(input); if (!k) throw new Error('ورودی خالی است'); return { apiKey: k }; },
    fetch: claudeApi,
  },
  chatgpt: {
    vendor: 'chatgpt', label: 'ChatGPT — اشتراک (Plus/Pro/Team)',
    help: 'بعد از `codex login`، فایل C:\\Users\\<نام>\\.codex\\auth.json را paste کنید (یا «خواندن از این کامپیوتر»). یا accessToken را از https://chatgpt.com/api/auth/session کپی کنید.',
    localFile: ['.codex', 'auth.json'],
    normalize(input) {
      const j = safeJson(input);
      if (j) {
        const t = j.tokens || j;
        const accessToken = t.access_token || t.accessToken;
        if (!accessToken) throw new Error('access_token در JSON پیدا نشد');
        return { accessToken, accountId: t.account_id || null };
      }
      const t = tok(input);
      if (!t) throw new Error('ورودی خالی است');
      return { accessToken: t };
    },
    fetch: chatgpt,
  },
  'openai-api': {
    vendor: 'chatgpt', label: 'OpenAI — API key',
    help: 'کلید sk-... از platform.openai.com. هر refresh یک درخواست ۱ توکنی برای خواندن rate-limit می‌فرستد.',
    normalize: (input) => { const k = tok(input); if (!k) throw new Error('ورودی خالی است'); return { apiKey: k }; },
    fetch: openaiApi,
  },
  gemini: {
    vendor: 'gemini', label: 'Gemini — API key',
    help: 'کلید از https://aistudio.google.com/apikey. فقط اعتبار کلید و وضعیت 429 قابل تشخیص است.',
    normalize: (input) => { const k = tok(input); if (!k) throw new Error('ورودی خالی است'); return { apiKey: k }; },
    fetch: gemini,
  },
  figma: {
    vendor: 'figma', label: 'Figma — Personal access token',
    help: 'Figma → Settings → Security → Personal access tokens → توکن جدید با scope حداقل File content: Read.',
    normalize: (input) => { const k = tok(input); if (!k) throw new Error('ورودی خالی است'); return { apiKey: k }; },
    fetch: figma,
  },
};

async function fetchUsage(type, creds, ctx) {
  const t = TYPES[type];
  if (!t) return err('نوع اکانت ناشناخته');
  try {
    const res = await t.fetch(creds, ctx);
    res.fetchedAt = Date.now();
    return res;
  } catch (e) {
    return { status: 'error', error: e.message || String(e), fetchedAt: Date.now() };
  }
}

module.exports = { TYPES, fetchUsage };

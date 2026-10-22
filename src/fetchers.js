// Usage fetchers for Claude and ChatGPT. The endpoints are undocumented and may change, so the
// response is scanned generically for "limit windows" and a diagnostics log is kept for the UI.
const { net } = require('electron');
const fs = require('fs');

const clamp = n => Math.min(100, Math.max(0, n));
const LABELS = {
  five_hour: '5-hour', seven_day: 'Weekly', seven_day_opus: 'Weekly Opus', seven_day_sonnet: 'Weekly Sonnet', extra_usage: 'Extra usage'
};
const pretty = k => { const s = String(k).replace(/_/g, ' ').trim(); return s ? s[0].toUpperCase() + s.slice(1) : 'Quota'; };
const secsLabel = s => (s === 604800 ? 'Weekly' : s >= 86400 ? Math.round(s / 86400) + '-day' : Math.round(s / 3600) + '-hour');

// Describes the structure of a response (keys and types only — never values).
function describe(v, d = 0) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return v.length ? `[${describe(v[0], d + 1)}]` : '[]';
  if (typeof v === 'object') return d > 3 ? '{…}' : '{' + Object.keys(v).slice(0, 25).map(k => `${k}: ${describe(v[k], d + 1)}`).join(', ') + '}';
  return typeof v;
}

function asWindow(o, key) {
  const used = typeof o.utilization === 'number' ? o.utilization : (typeof o.used_percent === 'number' ? o.used_percent : null);
  if (used == null) return null;
  const ms = n => (n < 1e12 ? n * 1000 : n);
  let resetsAt = null;
  if (o.resets_at != null) resetsAt = typeof o.resets_at === 'number' ? ms(o.resets_at) : Date.parse(o.resets_at);
  else if (o.reset_at != null) resetsAt = ms(Number(o.reset_at));
  else if (typeof o.reset_after_seconds === 'number') resetsAt = Date.now() + o.reset_after_seconds * 1000;
  if (!Number.isFinite(resetsAt)) resetsAt = null;
  const label = LABELS[key] || (o.limit_window_seconds ? secsLabel(o.limit_window_seconds) : pretty(key));
  return { label, usedPct: clamp(used), resetsAt };
}

function scanWindows(obj, out = [], key = '') {
  if (!obj || typeof obj !== 'object' || out.length >= 8) return out;
  if (!Array.isArray(obj)) {
    const w = asWindow(obj, key);
    if (w) { out.push(w); return out; }
  }
  for (const [k, v] of Object.entries(obj)) scanWindows(v, out, k);
  return out;
}

async function getJSON(doFetch, url, headers, diag) {
  const shown = url.replace(/\/organizations\/[^/]+/, '/organizations/{id}');
  let r, text;
  try {
    r = await doFetch(url, { headers: { Accept: 'application/json', ...headers } });
    text = await r.text();
  } catch (e) { diag.push(`GET ${shown} → network error: ${e.message}`); throw new Error('NETWORK'); }
  diag.push(`GET ${shown} → ${r.status}`);
  if (r.status !== 200 && /just a moment|cf-chl|challenge-platform/i.test(text.slice(0, 4000))) throw new Error('CLOUDFLARE');
  if (r.status === 401 || r.status === 403) throw new Error('NOT_LOGGED_IN');
  if (!r.ok) throw new Error('HTTP_' + r.status);
  let json;
  try { json = JSON.parse(text); } catch { diag.push('not JSON: ' + text.slice(0, 60).replace(/\s+/g, ' ')); throw new Error('NOT_JSON'); }
  diag.push('shape: ' + describe(json));
  return json;
}

function readJson(p, diag) {
  let raw;
  try {
    if (fs.statSync(p).isDirectory()) throw Object.assign(new Error('dir'), { code: 'ENOENT' });
    raw = fs.readFileSync(p, 'utf8');
  } catch (e) { diag.push('login file: ' + (e.code || e.message)); throw new Error(e.code === 'ENOENT' ? 'FILE_NOT_FOUND' : 'FILE_UNREADABLE'); }
  try { return JSON.parse(raw); } catch { throw new Error('FILE_INVALID'); }
}

function jwtEmail(t) {
  try {
    const p = JSON.parse(Buffer.from(String(t).split('.')[1], 'base64url').toString('utf8'));
    return p.email || (p['https://api.openai.com/profile'] || {}).email || null;
  } catch { return null; }
}

// ---- Claude ----
async function claudeFile(file, diag) {
  const raw = readJson(file, diag);
  const o = raw.claudeAiOauth || raw;
  if (!o.accessToken) throw new Error('NO_TOKEN');
  const H = { Authorization: 'Bearer ' + o.accessToken, 'anthropic-beta': 'oauth-2025-04-20' };
  const u = await getJSON(net.fetch, 'https://api.anthropic.com/api/oauth/usage', H, diag);
  let email = null;
  try {
    const p = await getJSON(net.fetch, 'https://api.anthropic.com/api/oauth/profile', H, diag);
    email = (p.account && p.account.email) || p.email_address || p.email || null;
  } catch {}
  const windows = scanWindows(u);
  return { email, plan: o.subscriptionType || null, windows, note: windows.length ? null : 'NO_USAGE' };
}

async function claudeCookie(ses, diag) {
  const f = (u, o) => ses.fetch(u, { credentials: 'include', ...o });
  const orgs = await getJSON(f, 'https://claude.ai/api/organizations', {}, diag);
  if (!Array.isArray(orgs) || !orgs.length) throw new Error('NOT_LOGGED_IN');
  const chat = o => ((o.capabilities || []).includes('chat') ? 1 : 0);
  let email = null;
  try { email = (await getJSON(f, 'https://claude.ai/api/account', {}, diag)).email_address || null; } catch {}
  for (const org of [...orgs].sort((a, b) => chat(b) - chat(a))) {
    try {
      const u = await getJSON(f, `https://claude.ai/api/organizations/${org.uuid}/usage`, {}, diag);
      const windows = scanWindows(u);
      if (windows.length) return { email, plan: org.name || null, windows, note: null };
    } catch (e) { if (e.message === 'NOT_LOGGED_IN' || e.message === 'CLOUDFLARE') throw e; }
  }
  return { email, plan: null, windows: [], note: 'NO_USAGE' };
}

// ---- ChatGPT (usage of the Codex / ChatGPT rate limits) ----
function chatgptResult(u, email) {
  const windows = scanWindows(u && u.rate_limit ? u.rate_limit : u);
  return { email, plan: (u && u.plan_type) || null, windows, note: windows.length ? null : 'NO_USAGE' };
}

async function codexFile(file, diag) {
  const raw = readJson(file, diag);
  const t = raw.tokens || {};
  if (!t.access_token) throw new Error('NO_TOKEN');
  const H = { Authorization: 'Bearer ' + t.access_token };
  if (t.account_id) H['ChatGPT-Account-Id'] = t.account_id;
  const u = await getJSON(net.fetch, 'https://chatgpt.com/backend-api/wham/usage', H, diag);
  return chatgptResult(u, jwtEmail(t.id_token));
}

async function chatgptCookie(ses, diag) {
  const f = (u, o) => ses.fetch(u, { credentials: 'include', ...o });
  const s = await getJSON(f, 'https://chatgpt.com/api/auth/session', {}, diag);
  if (!s || !s.accessToken) throw new Error('NOT_LOGGED_IN');
  const u = await getJSON(f, 'https://chatgpt.com/backend-api/wham/usage', { Authorization: 'Bearer ' + s.accessToken }, diag);
  return chatgptResult(u, (s.user && s.user.email) || null);
}

async function fetchUsage(acc, ses, diag) {
  const s = acc.source;
  if (!s) throw new Error('NOT_CONNECTED');
  try {
    if (acc.provider === 'claude') return s.type === 'file' ? await claudeFile(s.path, diag) : await claudeCookie(ses, diag);
    if (acc.provider === 'chatgpt') return s.type === 'file' ? await codexFile(s.path, diag) : await chatgptCookie(ses, diag);
  } catch (e) {
    if (e.message === 'NOT_LOGGED_IN' && s.type === 'file') throw new Error('TOKEN_EXPIRED');
    throw e;
  }
  throw new Error('UNSUPPORTED');
}

module.exports = { fetchUsage, scanWindows, describe };

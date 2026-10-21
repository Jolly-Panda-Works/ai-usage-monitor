// Provider metadata, usage fetchers (Claude / ChatGPT) and the Free-plan quota tracker.
//
//  - kind 'session': Claude and ChatGPT are read with the account's own sign-in session that lives
//    inside this app (an Electron partition). No browser extension is needed.
//  - kind 'manual' : Gemini and Figma have no usage API for personal accounts -> quota tracker only.
//
// Every fetcher returns { email, plan, note, windows:[{ label, usedPct, resetsAt }] }.
// `note` is a code ('NO_USAGE' | 'NO_PLAN_USAGE') translated by the renderer.
// Endpoints are undocumented website endpoints and may change without notice.

const CLOUDFLARE = /just a moment|cf-chl|attention required|cloudflare/i;

async function J(ses, url, headers = {}) {
  const r = await ses.fetch(url, { credentials: 'include', headers: { Accept: 'application/json', ...headers } });
  if (r.status === 401 || r.status === 403) {
    let body = '';
    try { body = (await r.text()).slice(0, 2000); } catch {}
    throw new Error(CLOUDFLARE.test(body) ? 'CLOUDFLARE' : 'NOT_LOGGED_IN');
  }
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

function claudePlan(org) {
  const caps = org.capabilities || [];
  if (caps.includes('claude_max')) return 'Max';
  if (caps.includes('claude_pro')) return 'Pro';
  if (caps.includes('raven')) return 'Team';
  return org.rate_limit_tier || org.billing_type || null;
}

const claude = {
  name: 'Claude', kind: 'session',
  loginUrl: 'https://claude.ai/login', origin: 'https://claude.ai',
  cookie: 'sessionKey',
  tracker: { unit: 'messages', mode: 'session', periodHours: 5, limit: 0 },
  async fetch(ses) {
    const orgs = await J(ses, 'https://claude.ai/api/organizations');
    if (!Array.isArray(orgs) || !orgs.length) throw new Error('NOT_LOGGED_IN');
    const org = orgs.find(o => (o.capabilities || []).includes('chat')) || orgs[0];
    const u = (await J(ses, `https://claude.ai/api/organizations/${org.uuid}/usage`)) || {};
    let email = null;
    try { email = (await J(ses, 'https://claude.ai/api/account')).email_address; } catch {}
    const map = [
      ['five_hour', '5-hour'], ['seven_day', 'Weekly'],
      ['seven_day_opus', 'Weekly Opus'], ['seven_day_sonnet', 'Weekly Sonnet']
    ];
    // Free accounts normally come back with every window set to null -> no windows -> NO_USAGE.
    const windows = map.filter(([k]) => u[k] && typeof u[k] === 'object').map(([k, label]) => ({
      label,
      usedPct: Number(u[k].utilization) || 0,
      resetsAt: u[k].resets_at ? Date.parse(u[k].resets_at) : null
    }));
    return { email, plan: claudePlan(org) || org.name || null, windows, note: windows.length ? null : 'NO_USAGE' };
  }
};

const chatgpt = {
  name: 'ChatGPT', kind: 'session',
  loginUrl: 'https://chatgpt.com/auth/login', origin: 'https://chatgpt.com',
  cookie: '__Secure-next-auth.session-token',
  tracker: { unit: 'messages', mode: 'session', periodHours: 5, limit: 0 },
  async fetch(ses) {
    const s = await J(ses, 'https://chatgpt.com/api/auth/session');
    if (!s || !s.accessToken) throw new Error('NOT_LOGGED_IN');
    const email = s.user && s.user.email;
    let u;
    try {
      u = await J(ses, 'https://chatgpt.com/backend-api/wham/usage', { Authorization: 'Bearer ' + s.accessToken });
    } catch (e) {
      return { email, plan: null, windows: [], note: 'NO_PLAN_USAGE' };
    }
    const rl = u.rate_limit || {};
    const mk = w => {
      if (!w) return null;
      const secs = w.limit_window_seconds;
      let label = 'Quota';
      if (secs) {
        if (secs === 604800) label = 'Weekly';
        else if (secs >= 86400) label = Math.round(secs / 86400) + '-day';
        else label = Math.round(secs / 3600) + '-hour';
      }
      const resetsAt = w.reset_at ? w.reset_at * 1000 : (w.reset_after_seconds != null ? Date.now() + w.reset_after_seconds * 1000 : null);
      return { label, usedPct: Number(w.used_percent) || 0, resetsAt };
    };
    const windows = [mk(rl.primary_window), mk(rl.secondary_window)].filter(Boolean);
    return { email, plan: u.plan_type || null, windows, note: windows.length ? null : 'NO_USAGE' };
  }
};

const manual = (name, url, unit, periodHours) => ({
  name, kind: 'manual', loginUrl: url,
  tracker: { unit, mode: 'fixed', periodHours, limit: 100 }
});

// ---------------------------------------------------------------------------------------------
// Free-plan quota tracker (works for every service).
//   unit  : 'tokens' | 'messages' | 'credits' | 'units'
//   mode  : 'session' -> the window starts with your first usage and ends `periodHours` later
//                        (how Claude / ChatGPT Free "every 5 hours" limits behave); afterwards idle.
//           'fixed'   -> repeats every `periodHours` on a fixed schedule (daily / monthly quotas).
//   limit : 0 means "unknown" — only the amount used and the reset time are shown.
// ---------------------------------------------------------------------------------------------
const UNITS = ['tokens', 'messages', 'credits', 'units'];
const HOUR = 3600e3;

function newTracker(provider, now = Date.now()) {
  const d = module.exports[provider].tracker;
  return {
    enabled: true, label: 'Free quota', unit: d.unit, mode: d.mode,
    limit: d.limit, used: 0, periodHours: d.periodHours,
    resetsAt: d.mode === 'fixed' ? now + d.periodHours * HOUR : null
  };
}

// Moves an expired window forward (fixed) or ends it (session) and clears the counter.
function rollTracker(t, now = Date.now()) {
  if (!t || !t.resetsAt || now < t.resetsAt) return t;
  if (t.mode === 'fixed' && t.periodHours > 0) {
    const p = t.periodHours * HOUR;
    t.resetsAt += Math.ceil((now - t.resetsAt + 1) / p) * p;
  } else {
    t.resetsAt = null;
  }
  t.used = 0;
  return t;
}

// A session window starts by itself the first time usage is added.
function autoStart(t, now = Date.now()) {
  if (t.mode === 'session' && !t.resetsAt && t.used > 0 && t.periodHours > 0) t.resetsAt = now + t.periodHours * HOUR;
}

function trackerAdd(t, n, now = Date.now()) {
  rollTracker(t, now);
  t.used = Math.max(0, (Number(t.used) || 0) + (Number(n) || 0));
  autoStart(t, now);
  return t;
}

function trackerStart(t, now = Date.now()) {
  if (t.periodHours > 0) t.resetsAt = now + t.periodHours * HOUR;
  return t;
}

function trackerReset(t, now = Date.now()) {
  t.used = 0;
  t.resetsAt = t.mode === 'fixed' && t.periodHours > 0 ? now + t.periodHours * HOUR : null;
  return t;
}

const nonNeg = (v, max) => Math.min(max, Math.max(0, Number(v) || 0));

function trackerPatch(t, patch, now = Date.now()) {
  rollTracker(t, now);
  if ('label' in patch) t.label = String(patch.label).slice(0, 40) || 'Free quota';
  if (UNITS.includes(patch.unit)) t.unit = patch.unit;
  if (patch.mode === 'session' || patch.mode === 'fixed') t.mode = patch.mode;
  if ('limit' in patch) t.limit = nonNeg(patch.limit, 1e12);
  if ('used' in patch) t.used = nonNeg(patch.used, 1e12);
  if ('periodHours' in patch) t.periodHours = nonNeg(patch.periodHours, 24 * 366);
  if ('resetsAt' in patch) {
    const r = Number(patch.resetsAt);
    t.resetsAt = Number.isFinite(r) && r > 0 ? r : null;
  }
  if (t.mode === 'fixed' && !t.resetsAt && t.periodHours > 0) t.resetsAt = now + t.periodHours * HOUR;
  if (!('resetsAt' in patch)) autoStart(t, now);
  return t;
}

// What the UI draws: one extra "window" for the tracker.
function trackerWindow(t, now = Date.now()) {
  if (!t || !t.enabled) return null;
  rollTracker(t, now);
  const limit = Number(t.limit) || 0, used = Number(t.used) || 0;
  return {
    label: t.label || 'Free quota', tracker: true, unit: t.unit,
    used, limit, remaining: limit ? Math.max(0, limit - used) : null,
    usedPct: limit ? Math.min(100, (used / limit) * 100) : null,
    resetsAt: t.resetsAt || null,
    idle: t.mode === 'session' && !t.resetsAt
  };
}

// Pulls cookies out of either a bare value or a "name=value; name2=value2" string (a Cookie header).
const COOKIE_NAME = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const COOKIE_VALUE = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]*$/;
function parseCookies(provider, input) {
  const p = module.exports[provider];
  let s = String(input || '').trim().replace(/^cookie\s*:\s*/i, '');
  if (!s || s.length > 16384) throw new Error('EMPTY');
  const out = [];
  if (s.includes('=')) {
    for (const part of s.split(';')) {
      const i = part.indexOf('=');
      if (i < 1) continue;
      out.push([part.slice(0, i).trim(), part.slice(i + 1).trim()]);
    }
  } else {
    out.push([p.cookie, s.replace(/^"|"$/g, '')]);
  }
  const ok = out.filter(([n, v]) => COOKIE_NAME.test(n) && v && COOKIE_VALUE.test(v));
  if (!ok.length) throw new Error('BAD_COOKIE');
  return ok;
}

module.exports = {
  claude,
  chatgpt,
  gemini: manual('Gemini', 'https://gemini.google.com/app', 'messages', 24),
  figma: manual('Figma', 'https://www.figma.com/settings', 'credits', 720),
  UNITS, newTracker, rollTracker, trackerAdd, trackerStart, trackerReset, trackerPatch, trackerWindow, parseCookies
};

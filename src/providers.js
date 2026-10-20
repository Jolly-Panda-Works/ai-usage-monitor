// Every provider returns: { email, plan, note, windows:[{label, usedPct, resetsAt, used?, limit?}] }
// `label` uses canonical English names; the renderer translates them.
// `note` is a code ('NO_USAGE' | 'NO_PLAN_USAGE' | 'MANUAL'), translated by the renderer.
async function J(ses, url, headers = {}) {
  const r = await ses.fetch(url, {
    credentials: 'include',
    headers: { Accept: 'application/json', ...headers }
  });
  if (r.status === 401 || r.status === 403) throw new Error('NOT_LOGGED_IN');
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}

const claude = {
  name: 'Claude',
  loginUrl: 'https://claude.ai/login',
  async fetch(ses) {
    const orgs = await J(ses, 'https://claude.ai/api/organizations');
    if (!Array.isArray(orgs) || !orgs.length) throw new Error('NOT_LOGGED_IN');
    const org = orgs.find(o => (o.capabilities || []).includes('chat')) || orgs[0];
    const u = await J(ses, `https://claude.ai/api/organizations/${org.uuid}/usage`);
    let email = null;
    try { email = (await J(ses, 'https://claude.ai/api/account')).email_address; } catch {}
    const map = [
      ['five_hour', '5-hour'],
      ['seven_day', 'Weekly'],
      ['seven_day_opus', 'Weekly Opus'],
      ['seven_day_sonnet', 'Weekly Sonnet']
    ];
    const windows = map.filter(([k]) => u[k]).map(([k, label]) => ({
      label,
      usedPct: Number(u[k].utilization) || 0,
      resetsAt: u[k].resets_at ? Date.parse(u[k].resets_at) : null
    }));
    return { email, plan: org.name || null, windows, note: windows.length ? null : 'NO_USAGE' };
  }
};

const chatgpt = {
  name: 'ChatGPT',
  loginUrl: 'https://chatgpt.com/auth/login',
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

// Gemini and Figma expose no public usage API for personal accounts => manual counter with automatic reset.
const manual = (name, url, period) => ({
  name,
  loginUrl: url,
  defaultPeriodHours: period,
  async fetch(ses, acc) {
    const m = acc.manual;
    const now = Date.now();
    if (m.resetsAt && now >= m.resetsAt && m.periodHours > 0) {
      const p = m.periodHours * 3600e3;
      m.resetsAt += Math.ceil((now - m.resetsAt + 1) / p) * p;
      m.used = 0;
    }
    return {
      email: null, plan: null, manual: true, note: 'MANUAL',
      windows: [{ label: m.label || 'Quota', usedPct: m.limit ? (m.used / m.limit) * 100 : 0, used: m.used, limit: m.limit, resetsAt: m.resetsAt }]
    };
  }
});

module.exports = {
  claude,
  chatgpt,
  gemini: manual('Gemini', 'https://gemini.google.com/app', 24),
  figma: manual('Figma', 'https://www.figma.com/settings', 720)
};

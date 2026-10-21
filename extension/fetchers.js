// Runs inside YOUR browser, using the session you are already signed in with.
// Each fetcher returns { email, plan, windows:[{label, usedPct, resetsAt}], note }.
// Endpoints are undocumented website endpoints and may change without notice.
async function J(url, headers = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(url, { credentials: 'include', signal: ctl.signal, headers: { Accept: 'application/json', ...headers } });
    if (r.status === 401 || r.status === 403) throw new Error('NOT_LOGGED_IN');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } catch (e) {
    if (e && e.name === 'AbortError') throw new Error('TIMEOUT');
    throw e;
  } finally { clearTimeout(timer); }
}

function claudePlan(org) {
  const caps = org.capabilities || [];
  if (caps.includes('claude_max')) return 'Max';
  if (caps.includes('claude_pro')) return 'Pro';
  if (caps.includes('raven')) return 'Team';
  return org.rate_limit_tier || org.billing_type || null;
}

const FETCHERS = {
  async claude() {
    const orgs = await J('https://claude.ai/api/organizations');
    if (!Array.isArray(orgs) || !orgs.length) throw new Error('NOT_LOGGED_IN');
    const org = orgs.find(o => (o.capabilities || []).includes('chat')) || orgs[0];
    const u = (await J(`https://claude.ai/api/organizations/${org.uuid}/usage`)) || {};
    let email = null;
    try { email = (await J('https://claude.ai/api/account')).email_address; } catch {}
    const map = [['five_hour', '5-hour'], ['seven_day', 'Weekly'], ['seven_day_opus', 'Weekly Opus'], ['seven_day_sonnet', 'Weekly Sonnet']];
    // Free accounts normally come back with every window set to null -> no windows -> NO_USAGE.
    const windows = map.filter(([k]) => u[k] && typeof u[k] === 'object').map(([k, label]) => ({
      label,
      usedPct: Number(u[k].utilization) || 0,
      resetsAt: u[k].resets_at ? Date.parse(u[k].resets_at) : null
    }));
    return { email, plan: claudePlan(org) || org.name || null, windows, note: windows.length ? null : 'NO_USAGE' };
  },

  async chatgpt() {
    const s = await J('https://chatgpt.com/api/auth/session');
    if (!s || !s.accessToken) throw new Error('NOT_LOGGED_IN');
    const email = (s.user && s.user.email) || null;
    let u;
    try {
      u = await J('https://chatgpt.com/backend-api/wham/usage', { Authorization: 'Bearer ' + s.accessToken });
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

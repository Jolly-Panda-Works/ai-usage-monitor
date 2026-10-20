// هر provider یک خروجی استاندارد می‌دهد: { email, plan, note, windows:[{label, usedPct, resetsAt, used?, limit?}] }
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
      ['five_hour', 'بازه ۵ ساعته'],
      ['seven_day', 'بازه هفتگی'],
      ['seven_day_opus', 'هفتگی Opus'],
      ['seven_day_sonnet', 'هفتگی Sonnet']
    ];
    const windows = map.filter(([k]) => u[k]).map(([k, label]) => ({
      label,
      usedPct: Number(u[k].utilization) || 0,
      resetsAt: u[k].resets_at ? Date.parse(u[k].resets_at) : null
    }));
    return { email, plan: org.name || null, windows, note: windows.length ? null : 'اطلاعات مصرف برای این اکانت برنگشت' };
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
      return { email, plan: null, windows: [], note: 'متصل است ولی ChatGPT اطلاعات مصرف را برای این پلن نداد (' + e.message + ')' };
    }
    const rl = u.rate_limit || {};
    const mk = w => {
      if (!w) return null;
      const secs = w.limit_window_seconds;
      let label = 'سهمیه';
      if (secs) label = secs >= 86400 ? (secs === 604800 ? 'بازه هفتگی' : 'بازه ' + Math.round(secs / 86400) + ' روزه') : 'بازه ' + Math.round(secs / 3600) + ' ساعته';
      const resetsAt = w.reset_at ? w.reset_at * 1000 : (w.reset_after_seconds != null ? Date.now() + w.reset_after_seconds * 1000 : null);
      return { label, usedPct: Number(w.used_percent) || 0, resetsAt };
    };
    const windows = [mk(rl.primary_window), mk(rl.secondary_window)].filter(Boolean);
    return { email, plan: u.plan_type || null, windows, note: windows.length ? null : 'اطلاعات مصرف برنگشت' };
  }
};

// Gemini و Figma API عمومی برای مصرف اکانت شخصی ندارند => شمارنده‌ی دستی با ریست خودکار
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
      email: null, plan: null, manual: true,
      note: 'این سرویس API رسمی مصرف ندارد؛ شمارنده دستی است.',
      windows: [{ label: m.label || 'سهمیه', usedPct: m.limit ? (m.used / m.limit) * 100 : 0, used: m.used, limit: m.limit, resetsAt: m.resetsAt }]
    };
  }
});

module.exports = {
  claude,
  chatgpt,
  gemini: manual('Gemini', 'https://gemini.google.com/app', 24),
  figma: manual('Figma', 'https://www.figma.com/settings', 720)
};

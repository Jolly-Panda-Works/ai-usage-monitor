// Provider metadata.
//  - kind 'auto'  : Claude and ChatGPT. Usage is read either from the official app's login file
//                   (Claude Code / Codex CLI — they sign in through your own browser) or from a
//                   browser cookie you paste. Nothing is ever signed in inside this app.
//  - kind 'manual': Gemini and Figma have no public usage API for personal accounts -> manual counter.
const os = require('os');
const path = require('path');

function defaultFile(provider) {
  if (provider === 'claude') return path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'), '.credentials.json');
  if (provider === 'chatgpt') return path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'auth.json');
  return null;
}

function manualUsage(acc) {
  const m = acc.manual;
  const now = Date.now();
  if (m.resetsAt && now >= m.resetsAt && m.periodHours > 0) {
    const p = m.periodHours * 3600e3;
    m.resetsAt += Math.ceil((now - m.resetsAt + 1) / p) * p;
    m.used = 0;
  }
  return {
    email: null, plan: null, note: 'MANUAL',
    windows: [{ label: m.label || 'Quota', usedPct: m.limit ? (m.used / m.limit) * 100 : 0, used: m.used, limit: m.limit, resetsAt: m.resetsAt }]
  };
}

module.exports = {
  claude: { name: 'Claude', kind: 'auto', loginUrl: 'https://claude.ai/login', cookieName: 'sessionKey', cookieUrl: 'https://claude.ai' },
  chatgpt: { name: 'ChatGPT', kind: 'auto', loginUrl: 'https://chatgpt.com/auth/login', cookieName: '__Secure-next-auth.session-token', cookieUrl: 'https://chatgpt.com' },
  gemini: { name: 'Gemini', kind: 'manual', loginUrl: 'https://gemini.google.com/app', defaultPeriodHours: 24 },
  figma: { name: 'Figma', kind: 'manual', loginUrl: 'https://www.figma.com/settings', defaultPeriodHours: 720 },
  defaultFile,
  manualUsage
};

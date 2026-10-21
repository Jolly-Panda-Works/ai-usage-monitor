// Provider metadata.
//  - kind 'extension': Claude and ChatGPT usage is read by the browser Connector extension
//    (extension/fetchers.js) from the browser session you are already signed in with.
//  - kind 'manual': Gemini and Figma have no public usage API for personal accounts -> manual counter.
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
  claude: { name: 'Claude', kind: 'extension', loginUrl: 'https://claude.ai/login' },
  chatgpt: { name: 'ChatGPT', kind: 'extension', loginUrl: 'https://chatgpt.com/auth/login' },
  gemini: { name: 'Gemini', kind: 'manual', loginUrl: 'https://gemini.google.com/app', defaultPeriodHours: 24 },
  figma: { name: 'Figma', kind: 'manual', loginUrl: 'https://www.figma.com/settings', defaultPeriodHours: 720 },
  manualUsage
};

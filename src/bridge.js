// Local-only HTTP bridge (127.0.0.1) that receives usage reports from the browser Connector extension.
// Every request must carry the per-account token created in the app.
const http = require('http');

const PORTS = [47821, 47822, 47823, 47824, 47825];
const NOTES = new Set(['NO_USAGE', 'NO_PLAN_USAGE']);

function sanitize(p, provider) {
  if (!p || typeof p !== 'object' || p.provider !== provider) return null;
  const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : null);
  const out = { email: str(p.email, 120), plan: str(p.plan, 60), note: NOTES.has(p.note) ? p.note : null, error: str(p.error, 80), windows: [] };
  if (Array.isArray(p.windows)) {
    for (const w of p.windows.slice(0, 8)) {
      if (!w || typeof w !== 'object') continue;
      const used = Number(w.usedPct);
      if (!Number.isFinite(used)) continue;
      const r = Number(w.resetsAt);
      out.windows.push({
        label: str(w.label, 40) || 'Quota',
        usedPct: Math.min(100, Math.max(0, used)),
        resetsAt: Number.isFinite(r) && r > 0 ? r : null
      });
    }
  }
  return out;
}

function makeHandler({ findByToken, onUsage }) {
  return (req, res) => {
    const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
    // DNS-rebinding protection: only accept requests addressed to the loopback host.
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host || '')) return send(400, { ok: false });
    if (req.method === 'GET' && req.url === '/v1/ping') return send(200, { ok: true, app: 'ai-usage-monitor' });
    if (req.method !== 'POST' || req.url !== '/v1/usage') return send(404, { ok: false });
    if (!/^application\/json/i.test(req.headers['content-type'] || '')) return send(415, { ok: false });
    const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
    const acc = m && findByToken(m[1]);
    if (!acc) return send(401, { ok: false });
    let size = 0;
    const chunks = [];
    req.on('data', c => { size += c.length; if (size > 32768) req.destroy(); else chunks.push(c); });
    req.on('end', () => {
      try {
        const data = sanitize(JSON.parse(Buffer.concat(chunks).toString('utf8')), acc.provider);
        if (!data) return send(400, { ok: false });
        onUsage(acc, data);
        send(200, { ok: true });
      } catch { send(400, { ok: false }); }
    });
  };
}

// Resolves with the port in use, or null when every port is taken.
function start(deps) {
  const handler = makeHandler(deps);
  return new Promise(resolve => {
    const listen = i => {
      if (i >= PORTS.length) return resolve(null);
      const server = http.createServer(handler);
      server.once('error', () => listen(i + 1));
      server.listen(PORTS[i], '127.0.0.1', () => resolve({ port: PORTS[i], server }));
    };
    listen(0);
  });
}

module.exports = { start, sanitize, PORTS };

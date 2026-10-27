// Wspólne dane Karmień: jeden zapis na „kod rodziny” w Netlify Blobs.
// POST /api/sync, nagłówek X-Kod-Rodziny, treść {ops:[...], create?, check?}
// Odpowiedź: {exists, feeds:[{id,at,ml}], sleeps:[{id,start,end}]}
import { getStore } from '@netlify/blobs';

const ID_RE = /^[A-Za-z0-9_~:@+-][A-Za-z0-9_.~:@+-]{0,119}$/;
const CODE_RE = /^[A-Z0-9]{12,32}$/;
const MAX_DOCS = 20000;
const MAX_OPS = 5000;
const MAX_BODY = 5 * 1024 * 1024;

const iso = (v) => { const d = new Date(v); return Number.isFinite(d.getTime()) ? d.toISOString() : null; };

const CLEAN = {
  feeds(d) {
    const ml = Number(d && d.ml), at = iso(d && d.at);
    return Number.isInteger(ml) && ml >= 1 && ml <= 1000 && at ? { at, ml } : null;
  },
  sleeps(d) {
    const start = iso(d && d.start);
    if (!start) return null;
    if (d.end == null) return { start, end: null };
    const end = iso(d.end);
    return end && end > start ? { start, end } : null;
  },
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

async function spaceKey(raw) {
  const code = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!CODE_RE.test(code)) return null;
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`karmienia:${code}`));
  return 'rodzina/' + Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
}

function applyOps(data, ops) {
  for (const op of ops) {
    if (!op || !CLEAN[op.col] || typeof op.id !== 'string' || !ID_RE.test(op.id)) continue;
    const docs = data[op.col];
    if (op.op === 'del') delete docs[op.id];
    else if (op.op === 'set') {
      const doc = CLEAN[op.col](op.data);
      if (doc && (op.id in docs || Object.keys(docs).length < MAX_DOCS)) docs[op.id] = doc;
    }
  }
}

const listOf = (docs) => Object.entries(docs).map(([id, d]) => ({ id, ...d }));
const view = (data, exists) => ({ exists, feeds: listOf(data.feeds), sleeps: listOf(data.sleeps) });

// Osobno od handlera, żeby dało się to przetestować bez Netlify.
export async function handle(req, store) {
  if (req.method !== 'POST') return json({ error: 'Użyj POST' }, 405);
  const key = await spaceKey(req.headers.get('x-kod-rodziny'));
  if (!key) return json({ error: 'Nieprawidłowy kod rodziny' }, 401);

  const text = await req.text();
  if (text.length > MAX_BODY) return json({ error: 'Za dużo danych naraz' }, 413);
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { return json({ error: 'Zły format' }, 400); }
  const ops = Array.isArray(body.ops) ? body.ops.slice(0, MAX_OPS) : [];
  const write = ops.length > 0 || body.create === true;

  // Zapis warunkowy: jeśli dwa telefony zapisują w tej samej chwili, drugi ponawia.
  for (let attempt = 0; attempt < 8; attempt++) {
    const found = await store.getWithMetadata(key, { type: 'json' });
    const data = { feeds: {}, sleeps: {}, ...(found && found.data) };
    if (!write) return json(view(data, !!found));
    applyOps(data, ops);
    const res = await store.setJSON(key, data, found ? { onlyIfMatch: found.etag } : { onlyIfNew: true });
    if (res.modified) return json(view(data, true));
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 120));
  }
  return json({ error: 'Serwer zajęty, spróbuj ponownie' }, 503);
}

export default (req) => handle(req, getStore({ name: 'karmienia', consistency: 'strong' }));

export const config = { path: '/api/sync' };

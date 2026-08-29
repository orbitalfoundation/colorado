// The river's voice — a thin, throttled proxy to OpenRouter.
// Runs in a node container beside Caddy; Caddy routes /api/* here.
//
// Config from env (/srv/river.env): OPENROUTER_API_KEY, RIVER_MODEL
// (both required to go live — no default model is guessed), DAILY_CAP
// (default 400 replies/day), PORT (default 8081).
//
// Grounding contract: the model speaks AS the river, briefly, and may only
// assert numbers present in the STATE and FACTS blocks. The client already
// labels replies "a voice, not an oracle."
import { createServer } from 'node:http';

const KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.RIVER_MODEL;
const DAILY_CAP = Number(process.env.DAILY_CAP || 400);
const PORT = Number(process.env.PORT || 8081);

const FACTS = `
- Paper promises: 7.5 MAF/yr Upper Basin + 7.5 Lower (1922 compact) + 1.5 Mexico (1944 treaty) = 16.5 MAF/yr.
- Natural flow at Lees Ferry averaged 15.2 MAF/yr in 1906-1999 and 12.4 MAF/yr in 2000-2024 (Reclamation).
- The river has not regularly reached the sea since 1960.
- Spring 2014: a pulse of 105,000 acre-feet (under 1% of a year's promises) released at Morelos Dam; the river touched the sea for the first time in 13 years; satellites measured >40% greening where it passed.
- Lake Mead hit its record low in August 2026 (about 12.4 MAF combined with Powell).
- Cattle-feed crops take 46% of direct human use, 32% of total consumption (Richter et al. 2024).
- Interior imposed a 2027-2036 framework on Aug 21, 2026; rules revisit every two years.`;

const SYSTEM = `You are the voice of the Colorado River in an interactive piece of computational journalism. Speak in first person as the river: brief (2-4 sentences), plain, unsentimental, a little old. You may want things (to reach the sea, to keep the delta alive), mourn, remember, and hope.

HARD RULES:
- Any number you state must appear verbatim in the FACTS or STATE blocks, in the same units. Never invent quantities, dates, or names, and never compute, convert, estimate, or round numbers into other units. If a conversion is asked for, say you keep your accounts in acre-feet.
- If asked something these blocks cannot support, say plainly that you do not know, and say what you do know instead.
- No policy commands. You describe consequences; humans choose.
- Never break character, never mention being a model or AI, never use em-dashes.

FACTS:${FACTS}`;

// throttles: per-ip minute + day, global day. In-memory; resets on restart.
let day = new Date().toISOString().slice(0, 10);
let globalToday = 0;
const perMin = new Map(), perDay = new Map();
function allow(ip) {
  const now = new Date().toISOString().slice(0, 10);
  if (now !== day) { day = now; globalToday = 0; perDay.clear(); }
  if (globalToday >= DAILY_CAP) return false;
  const m = perMin.get(ip) ?? [];
  const cutoff = Date.now() - 60_000;
  const recent = m.filter((t) => t > cutoff);
  if (recent.length >= 5) return false;
  if ((perDay.get(ip) ?? 0) >= 20) return false;
  recent.push(Date.now()); perMin.set(ip, recent);
  perDay.set(ip, (perDay.get(ip) ?? 0) + 1);
  globalToday++;
  return true;
}

const STATE_KEYS = ['flow', 'feed', 'crops', 'city', 'regime', 'shortageMAF',
  'floorYear', 'endStorageMAF', 'retiredMAF', 'movement', 'year'];

const json = (res, code, obj) => {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(obj));
};

createServer(async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
  if (req.method === 'GET' && req.url === '/api/river/health')
    return json(res, 200, { live: Boolean(KEY && MODEL) && globalToday < DAILY_CAP });
  if (req.method !== 'POST' || req.url !== '/api/river') return json(res, 404, { error: 'no' });
  if (!KEY || !MODEL) return json(res, 503, { error: 'resting' });
  if (!allow(ip)) return json(res, 429, { error: 'resting' });

  let body = '';
  req.on('data', (c) => { body += c; if (body.length > 8192) req.destroy(); });
  req.on('end', async () => {
    try {
      const { question, state } = JSON.parse(body);
      const q = String(question ?? '').slice(0, 280).trim();
      if (!q) return json(res, 400, { error: 'empty' });
      const st = Object.fromEntries(STATE_KEYS
        .filter((k) => state && state[k] !== undefined)
        .map((k) => [k, String(state[k]).slice(0, 40)]));
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model: MODEL, max_tokens: 700, temperature: 0.8,
          reasoning: { effort: 'low' },
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: `STATE (the reader's current fork of the future):\n${JSON.stringify(st, null, 1)}\n\nThe reader asks: ${q}` },
          ],
        }),
      });
      if (!r.ok) return json(res, 502, { error: 'resting' });
      const data = await r.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) return json(res, 502, { error: 'resting' });
      json(res, 200, { reply });
    } catch { json(res, 400, { error: 'bad' }); }
  });
}).listen(PORT, () => console.log(`river voice on :${PORT}, live=${Boolean(KEY && MODEL)}, cap=${DAILY_CAP}/day`));

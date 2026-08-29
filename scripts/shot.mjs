#!/usr/bin/env node
// Screenshot a page with real wall-clock wait (survives web workers, tile
// loads, WebGL) — unlike --virtual-time-budget, which races them.
//   node scripts/shot.mjs <url> <out.png> [waitMs=8000] [WxH=1280x900] [dark]
// Drives headless Chromium over CDP with Node's built-in WebSocket. The snap
// chromium cannot write outside ~/snap/chromium/common, but CDP returns the
// PNG over the wire, so we write it ourselves — anywhere.
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const [url, out, waitMs = '8000', size = '1280x900', theme] = process.argv.slice(2);
if (!url || !out) { console.error('usage: shot.mjs <url> <out.png> [waitMs] [WxH] [dark]'); process.exit(1); }
const [W, H] = size.split('x').map(Number);
const port = 9222 + Math.floor(Math.random() * 500);

const args = ['--headless', '--disable-gpu', '--enable-unsafe-swiftshader',
  `--remote-debugging-port=${port}`, `--window-size=${W},${H}`, 'about:blank'];
if (theme === 'dark') args.splice(2, 0, '--force-dark-mode');
const browser = spawn('chromium', args, { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let target;
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250);
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = list.find((t) => t.type === 'page');
    } catch {}
  }
  if (!target) throw new Error('no CDP target');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = {};
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) pending[m.id](m); };
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id; pending[mid] = res;
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  if (theme === 'dark') await send('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await send('Page.navigate', { url });
  await sleep(Number(waitMs));
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (!shot.result?.data) throw new Error(`no screenshot: ${JSON.stringify(shot).slice(0, 200)}`);
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  console.log(`ok: ${out} (${shot.result.data.length * 3 / 4 / 1024 | 0} KB)`);
} finally { browser.kill(); }

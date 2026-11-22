// Verifies every internal link/asset in dist/ resolves to a real file under the configured base path.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const base = (process.env.BASE_PATH ?? '/a-e').replace(/\/$/, '');
const walk = (d) => readdirSync(d).flatMap((f) => { const p = path.join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const htmls = walk(dist).filter((f) => f.endsWith('.html'));
let bad = 0, checked = 0;
for (const file of htmls) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/\b(href|src|srcset)="([^"]+)"/g)) {
    const parts = m[1] === 'srcset' ? m[2].split(',').map((s) => s.trim().split(' ')[0]) : [m[2]];
    for (const raw of parts) {
      if (!raw || /^(https?:|mailto:|tel:|data:|#)/.test(raw)) continue;
      const clean = raw.split('#')[0].split('?')[0];
      if (!clean) continue;
      checked++;
      if (!clean.startsWith(base + '/') && clean !== base) { console.error(`✗ ${path.relative(dist, file)}: "${raw}" is not under ${base}/`); bad++; continue; }
      const rel = clean.slice(base.length) || '/';
      const target = path.join(dist, rel);
      const ok = existsSync(target) && (statSync(target).isFile() || existsSync(path.join(target, 'index.html')));
      if (!ok) { console.error(`✗ ${path.relative(dist, file)}: "${raw}" → missing`); bad++; }
    }
  }
}
console.log(`${htmls.length} pages, ${checked} internal references checked, ${bad} problems.`);
process.exit(bad ? 1 : 0);

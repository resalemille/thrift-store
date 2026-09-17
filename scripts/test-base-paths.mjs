import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]);
}
// The current site has no client JavaScript; exercise Astro's generated script URL with a temporary page.
const fixture = 'src/pages/base-path-test-fixture.astro';
assert.equal(existsSync(fixture), false);
writeFileSync(fixture, `<script>console.log('${'base-path-check '.repeat(500)}');</script>`);
try {
for (const base of ['/', '/sample', '/sample/pr-preview/pr-123', '/pr-preview/pr-123']) {
  execFileSync('npm', ['run', 'build'], { stdio: 'pipe', env: { ...process.env, ASTRO_BASE_PATH: base } });
  const prefix = base.replace(/\/$/, '') + '/';
  const seen = new Set();
  for (const file of files('dist').filter(p => p.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    for (const [, tag, attr, url] of html.matchAll(/<(a|img|link|script)\b[^>]*?\b(href|src)="([^"]+)"/g)) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) continue;
      assert.ok(url.startsWith(prefix), `${file}: ${url} must start with ${prefix}`);
      const relative = decodeURIComponent(url.slice(prefix.length).split(/[?#]/)[0]);
      assert.ok(existsSync(join('dist', relative || 'index.html')), `${file}: missing ${url}`);
      if (tag === 'a') seen.add('link');
      if (tag === 'img') seen.add('image');
      if (url.endsWith('favicon.svg')) seen.add('favicon');
      if (url.endsWith('.css')) seen.add('css');
      if (tag === 'script' && attr === 'src') seen.add('js');
    }
  }
  assert.deepEqual([...seen].sort(), ['css', 'favicon', 'image', 'js', 'link']);
  console.log(`Verified generated links and assets: ${base}`);
}
} finally { unlinkSync(fixture); }
// Leave the normal production build available for previewing.
execFileSync('npm', ['run', 'build'], { stdio: 'pipe', env: { ...process.env, ASTRO_BASE_PATH: '/' } });

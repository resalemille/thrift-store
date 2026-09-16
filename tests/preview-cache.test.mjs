import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { updateCache } from '../scripts/update-preview-cache.mjs';

test('本番更新・複数PRの更新・削除は対象だけに反映される', () => {
  const root = mkdtempSync(join(tmpdir(), 'preview-cache-'));
  try {
    const cache = join(root, 'cache');
    const build = join(root, 'build');
    mkdirSync(build);
    writeFileSync(join(build, 'index.html'), 'production');
    writeFileSync(join(build, 'CNAME'), 'example.com');
    updateCache(cache, build);
    writeFileSync(join(build, 'index.html'), 'first');
    updateCache(cache, build, '123');
    writeFileSync(join(build, 'index.html'), 'second');
    updateCache(cache, build, '124');
    writeFileSync(join(build, 'index.html'), 'updated');
    updateCache(cache, build, '123');
    assert.equal(readFileSync(join(cache, 'pr-preview/pr-124/index.html'), 'utf8'), 'second');
    writeFileSync(join(cache, 'obsolete.txt'), 'old');
    updateCache(cache, build);
    assert.equal(existsSync(join(cache, 'obsolete.txt')), false);
    assert.equal(readFileSync(join(cache, 'pr-preview/pr-123/index.html'), 'utf8'), 'updated');
    updateCache(cache, undefined, '123');
    updateCache(cache, undefined, '123');
    assert.equal(existsSync(join(cache, 'pr-preview/pr-123')), false);
    assert.equal(readFileSync(join(cache, 'pr-preview/pr-124/index.html'), 'utf8'), 'second');
    assert.equal(readFileSync(join(cache, 'index.html'), 'utf8'), 'updated');
    assert.equal(readFileSync(join(cache, 'CNAME'), 'utf8'), 'example.com');
    assert.equal(existsSync(join(cache, 'pr-preview/pr-124/CNAME')), false);
    assert.throws(() => updateCache(cache, build, '../123'));
    assert.throws(() => updateCache(cache, join(root, 'missing')));
    assert.equal(readFileSync(join(cache, 'index.html'), 'utf8'), 'updated');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

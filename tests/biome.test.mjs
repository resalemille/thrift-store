import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const biome = new URL(
  '../node_modules/@biomejs/biome/bin/biome',
  import.meta.url,
);
const config = new URL('../biome.json', import.meta.url);

test('Biome detects lint/format violations, formats Astro and ignores generated files', () => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'biome-check-')));
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [biome.pathname, ...args, '--config-path', root],
      { cwd: root, encoding: 'utf8' },
    );
  try {
    copyFileSync(config, join(root, 'biome.json'));
    writeFileSync(join(root, '.gitignore'), 'node_modules/\n');
    mkdirSync(join(root, 'src'));
    const file = join(root, 'src/example.astro');
    writeFileSync(file, '---\nconst label="hello"\n---\n<p>{label}</p>\n');
    assert.notEqual(run('format', 'src').status, 0);
    const formatted = run('format', '--write', 'src');
    assert.equal(formatted.status, 0, formatted.stderr);
    assert.equal(run('format', 'src').status, 0);
    assert.match(readFileSync(file, 'utf8'), /const label = 'hello';/);
    assert.equal(run('lint', 'src', '--error-on-warnings').status, 0);
    writeFileSync(join(root, 'src/bad.ts'), 'debugger;\n');
    assert.notEqual(run('lint', 'src', '--error-on-warnings').status, 0);
    rmSync(join(root, 'src/bad.ts'));
    mkdirSync(join(root, 'dist'));
    writeFileSync(join(root, 'dist/bad.js'), 'invalid {');
    assert.equal(run('lint', '.', '--error-on-warnings').status, 0);
    assert.equal(run('format', '.').status, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

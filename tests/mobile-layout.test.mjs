import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const home = readFileSync(
  new URL('../dist/index.html', import.meta.url),
  'utf8',
);
const consignment = readFileSync(
  new URL('../dist/consignment/index.html', import.meta.url),
  'utf8',
);

test('スマホのサービス案内は3項目すべてに補足を持つ', () => {
  const promises = home.match(
    /<ul class="service-promises"[^>]*>([\s\S]*?)<\/ul>/,
  )[1];
  const items = [...promises.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)];
  assert.equal(items.length, 3);
  for (const [, item] of items) assert.match(item, /<span[^>]*>[^<]+<\/span>/);
});

test('横長の比較表でも全社・全項目とキーボードスクロールを維持する', () => {
  assert.match(
    consignment,
    /class="table-scroll" tabindex="0" aria-label="[^"]+"/,
  );
  const table = consignment.match(/<table[^>]*>([\s\S]*?)<\/table>/)[1];
  assert.equal([...table.matchAll(/scope="col"/g)].length, 4);
  assert.equal([...table.matchAll(/scope="row"/g)].length, 5);
  for (const row of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    assert.equal([...row[1].matchAll(/<t[hd]\b/g)].length, 5);
  }
});

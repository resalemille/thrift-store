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

test('個人向けお取り寄せの見出しとリードは指定位置で改行できる', () => {
  const order = readFileSync(
    new URL('../dist/order/index.html', import.meta.url),
    'utf8',
  );
  const hero = order.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1];
  assert.match(hero, /<span[^>]*>憧れの逸品を、あなたのために。<\/span>/);
  assert.match(hero, /<span[^>]*>オーダーメイドお取り寄せサービス<\/span>/);
  assert.match(
    order,
    /「欲しい」を<br class="order-mobile-break"[^>]*>世界中から/,
  );
  assert.match(
    order,
    /Resale Milleが選ばれる理由：<br class="order-mobile-break"[^>]*>お取り寄せの強み/,
  );
  const sourcing = readFileSync(
    new URL('../dist/sourcing/index.html', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(sourcing, /class="personal-order-title"/);
});

test('比較表は文節の区切りで2行に分け、元の比較内容を保持する', () => {
  assert.match(
    consignment,
    /100万以上かつロレックス等<br class="comparison-break"[^>]*>主要時計ブランドのみ/,
  );
  const cells = [
    ...consignment.matchAll(
      /<span class="comparison-text"[^>]*>([\s\S]*?)<\/span>/g,
    ),
  ];
  assert.equal(cells.length, 20);
  for (const [, cell] of cells)
    assert.ok([...cell.matchAll(/<br\b/g)].length <= 1);
});

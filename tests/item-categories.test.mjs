import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = (path) =>
  readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const original = ['brand', 'watch', 'jewelry', 'gold', 'camera', 'antique'];
const added = {
  alcohol: 'お酒',
  coins: '古銭・記念硬貨・小判',
  'gift-cards': '金券・ギフト券',
  stamps: '切手',
  'telephone-cards': 'テレホンカード',
  weapons: '武器・刀剣',
  kimono: '着物',
  clothing: '衣類',
  shoes: '靴',
  appliances: '家電',
  'mobile-phones': '携帯電話',
};
const iconPath = (html) =>
  html.match(/<svg[^>]*>[\s\S]*?<path d="([^"]+)"/)?.[1];
const cards = (html) => [
  ...html.matchAll(
    /<a href="\/items\/([^/]+)\/" class="category-link">([\s\S]*?)<\/a>/g,
  ),
];

test('一覧の17品目はトップと共通のカード・線画を使い、追加11品目はトップに表示しない', () => {
  const homeCards = cards(page('index.html'));
  const allCards = cards(page('items/index.html'));
  assert.deepEqual(
    homeCards.map((card) => card[1]),
    original,
  );
  assert.deepEqual(
    allCards.map((card) => card[1]),
    [...original, ...Object.keys(added)],
  );
  for (const card of homeCards) {
    const listing = allCards.find((entry) => entry[1] === card[1]);
    assert.equal(listing[2], card[2]);
  }
  for (const [slug, name] of Object.entries(added)) {
    assert.ok(allCards.find((card) => card[1] === slug)[2].includes(name));
  }
});

test('全17品目の詳細ページは一覧と同じ専用線画、相談リンクを表示する', () => {
  const paths = new Set();
  for (const [, slug, card] of cards(page('items/index.html'))) {
    const detail = page(`items/${slug}/index.html`);
    const hero = detail.match(/<section[^>]*>([\s\S]*?)<\/section>/)[1];
    assert.ok(iconPath(card), slug);
    assert.equal(iconPath(hero), iconPath(card), slug);
    paths.add(iconPath(card));
    assert.match(detail, /href="\/contact\/"/);
    assert.doesNotMatch(detail, /👜|⌚|💎|✨|📷|🏺/);
    if (added[slug]) {
      assert.ok(hero.includes(added[slug]));
      assert.doesNotMatch(detail, /の買取実績/);
    }
  }
  assert.equal(paths.size, 17);
});

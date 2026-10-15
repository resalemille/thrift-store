import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const page = (path) =>
  readFileSync(new URL(`../dist/${path}index.html`, import.meta.url), 'utf8');
const examples = [
  ['hermes-birkin', 'brand', 'webp', 1200, 1200],
  ['rolex-datejust', 'watch', 'webp', 1200, 1200],
  ['diamond-ring', 'jewelry', 'webp', 1200, 1200],
  ['gold-necklace', 'gold', 'webp', 1200, 1200],
  ['leica-camera', 'camera', 'jpg', 1200, 900],
  ['tea-bowl', 'antique', 'png', 944, 1037],
];

function card(html, slug) {
  return [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)]
    .map(([article]) => article)
    .find((article) => article.includes(`href="/cases/${slug}/"`));
}

test('全6件の指定写真を一覧・詳細・品目別に表示し、店舗を統一する', () => {
  const list = page('cases/');
  for (const [slug, category, extension, width, height] of examples) {
    const image = `/images/case-${slug}.${extension}`;
    assert.ok(existsSync(new URL(`../dist${image}`, import.meta.url)), image);
    const listingCard = card(list, slug);
    assert.ok(listingCard, slug);
    const store = listingCard.match(/\/ (銀座店|平塚店|横浜店)/)?.[1];
    assert.ok(store, `${slug} の店舗は現在の3店舗から選ぶ`);
    const detail = page(`cases/${slug}/`);
    assert.ok(detail.includes(`/ ${store}`), `${slug} の店舗を詳細と統一する`);
    const categoryCard = card(page(`items/${category}/`), slug);
    assert.ok(categoryCard, slug);
    assert.ok(categoryCard.includes(`/ ${store}`));
    const surfaces = [listingCard, detail, categoryCard];
    if (examples.findIndex(([id]) => id === slug) < 3) {
      const homeCard = card(page(''), slug);
      assert.ok(homeCard, slug);
      assert.ok(homeCard.includes(`/ ${store}`));
      surfaces.push(homeCard);
    }
    for (const html of surfaces.filter((html) => html !== detail)) {
      assert.match(html, /class="bg-white pt-5"/);
      assert.match(html, /class="h-44 w-full object-contain"/);
    }
    for (const html of surfaces) {
      const tag = [...html.matchAll(/<img\b[^>]*>/g)]
        .map(([img]) => img)
        .find((img) => img.includes(`src="${image}"`));
      assert.ok(tag, image);
      assert.match(tag, /alt="[^"]+"/);
      assert.ok(tag.includes(`width="${width}"`));
      assert.ok(tag.includes(`height="${height}"`));
      assert.match(tag, /object-contain/);
      assert.doesNotMatch(html, /神田駅前店|吉祥寺店|横浜関内店/);
    }
  }
});

test('バーキンの300万円を掲載先すべてに反映する', () => {
  for (const path of ['', 'cases/', 'cases/hermes-birkin/', 'items/brand/']) {
    const html = page(path);
    assert.match(html, /¥3,000,000/);
    assert.doesNotMatch(html, /¥1,280,000/);
  }
});

test('カメラの表記を指定写真のニコン製デジタル一眼レフに合わせる', () => {
  for (const html of [
    card(page('cases/'), 'leica-camera'),
    page('cases/leica-camera/'),
    card(page('items/camera/'), 'leica-camera'),
  ]) {
    assert.match(html, /デジタル一眼レフカメラをお買取りしました/);
    assert.match(html, /ニコン/);
    assert.doesNotMatch(html, /ライカ|フィルムカメラをお買取りしました/);
  }
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const page = (path) =>
  readFileSync(new URL(`../dist/${path}/index.html`, import.meta.url), 'utf8');
test('個人向けだけヘッダーをお取り寄せブランドにし、事業者用の説明を出さない', () => {
  const personal = page('order');
  const business = page('sourcing');
  assert.match(personal, /class="brand-kicker"[^>]*>お取り寄せの/);
  assert.match(business, /class="brand-kicker"[^>]*>買取の/);
  assert.match(personal, /オーダーメイドお取り寄せサービス/);
  assert.doesNotMatch(
    personal,
    /業者オークション入札の悩みとリスク|id="order-courses"/,
  );
  assert.match(personal, /id="order-examples"/);
  for (const path of ['order', 'sourcing']) {
    assert.match(page(path), /href="\/order\/"/);
    assert.match(page(path), /href="\/sourcing\/"/);
    assert.match(page(path), /href="\/contact\/"/);
  }
});
test('仕入れの3つの悩み、指定の口コミ、全コースの問い合わせ導線を表示する', () => {
  const html = page('sourcing');
  for (const text of [
    '状態や付属品ごとの適正価格',
    '競りに張り付く時間',
    '紹介制の審査',
    'お取り寄せ（オーダー）で解決',
    '未経験から初月で利益化',
    '専任バイヤーを雇うコスト',
    '出品から収支管理',
    '30代 / 男性',
    '40代 / 買取販売店経営',
    '20代 / 事業準備中',
  ])
    assert.ok(html.includes(text), text);
  const courses = html.slice(
    html.indexOf('id="order-courses"'),
    html.indexOf('id="order-contact"'),
  );
  assert.equal(
    [...courses.matchAll(/aria-label="[^"]+コースについて問い合わせる"/g)]
      .length,
    3,
  );
  assert.equal([...courses.matchAll(/href="\/contact\/"/g)].length, 3);
});

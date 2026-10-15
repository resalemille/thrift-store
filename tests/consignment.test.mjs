import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(
  new URL('../dist/consignment/index.html', import.meta.url),
  'utf8',
);
const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];

test('委託販売ページはサイト名でサービスと比較表を案内する', () => {
  assert.match(
    html,
    /<title[^>]*>委託販売 \| 買取のResale Mille（リセールミル）<\/title>/,
  );
  for (const text of [
    '大切なお品物を、価値ある委託販売へ',
    'の委託販売が選ばれる理由',
    '他社の委託販売との比較',
    'ご利用の流れ',
    'よくあるご質問',
    'ご相談・お申し込み',
  ]) {
    assert.ok(main.includes(text), `${text} がない`);
  }
  assert.match(main, /手数料は業界最安値の1%から/);
  assert.match(
    main,
    /<th scope="col"[^>]*>買取のResale Mille（リセールミル）<\/th>/,
  );
  assert.doesNotMatch(main, /TIME\s*GRACE|つなぐ屋|03-5801-5888/i);
});

test('相談導線はWeb相談に統一し、4ステップと既存の保管条件を維持する', () => {
  assert.equal([...main.matchAll(/href="\/contact\/"/g)].length, 6);
  assert.doesNotMatch(
    main,
    /href="tel:|page\.line\.me|スマート委託|2\.8[%％]|SMART|またはご来店/,
  );
  assert.equal([...main.matchAll(/class="step-number"/g)].length, 4);
  assert.match(main, /撮影時のみ/);
  assert.match(main, /ご自宅/);
  assert.match(main, /郵送にてお品物をお預かり/);
  for (const text of [
    '腕時計',
    'ブランド品',
    'バッグ・財布・小物',
    'ジュエリー',
    '販売額も手数料も明確に',
    '5%＋消費税額 ※実質15%',
    '800万円以上で3%',
    '販売価格を伝えないため実態は不明',
    '市場で売れる最大金額を目指す',
  ]) {
    assert.ok(main.includes(text), `${text} がない`);
  }
  assert.equal([...main.matchAll(/販売者が格安に決定/g)].length, 3);
});

test('FAQ6項目は初期状態で閉じ、回答を備える', () => {
  const details = [
    ...main.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g),
  ];
  assert.equal(details.length, 6);
  for (const [, attributes, body] of details) {
    assert.doesNotMatch(attributes, /\bopen\b/);
    assert.match(body, /<summary\b/);
    assert.match(body, /<p[^>]*>[^<]+<\/p>/);
  }
  assert.match(main, /送料は誰が負担しますか？/);
  assert.doesNotMatch(main, /キャンセル料は無料|送料は無料/);
});

test('指定の透過時計画像を配信し、比較表と共通ナビゲーションを利用できる', () => {
  for (const name of ['watch-cutout']) {
    assert.ok(main.includes(`/images/consignment/${name}.png`));
    assert.ok(
      existsSync(
        new URL(`../dist/images/consignment/${name}.png`, import.meta.url),
      ),
    );
  }
  assert.match(main, /<section class="table-scroll" tabindex="0" aria-label=/);
  assert.match(main, /<caption[^>]*>他社の委託販売との比較<\/caption>/);
  const home = readFileSync(
    new URL('../dist/index.html', import.meta.url),
    'utf8',
  );
  assert.equal([...home.matchAll(/href="\/consignment\/"/g)].length, 3);
});

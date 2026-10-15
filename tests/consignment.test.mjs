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
    /<title[^>]*>委託販売・スマート委託 \| 買取のResale Mille（リセールミル）<\/title>/,
  );
  for (const text of [
    '預かり不要のスマート委託',
    'スマート委託の特徴',
    'スマート委託と他社の委託販売との比較',
    'ご利用の流れ',
    'よくあるご質問',
    'ご相談・お申し込み',
  ]) {
    assert.ok(main.includes(text), `${text} がない`);
  }
  assert.match(main, /手数料は業界最安値の2\.8%/);
  assert.match(
    main,
    /<th scope="col"[^>]*>買取のResale Mille（リセールミル）<\/th>/,
  );
  assert.doesNotMatch(main, /TIME\s*GRACE|つなぐ屋|03-5801-5888/i);
});

test('申込み手順と最下部から指定の電話・LINE・メールへ進める', () => {
  assert.equal([...main.matchAll(/href="tel:0463642885"/g)].length, 2);
  assert.equal([...main.matchAll(/href="\/contact\/"/g)].length, 2);
  const lineLinks = [
    ...main.matchAll(/href="(https:\/\/page\.line\.me\/[^"]+)"/g),
  ].map((match) => match[1].replaceAll('&amp;', '&'));
  assert.deepEqual(
    lineLinks,
    Array(2).fill(
      'https://page.line.me/408epxtk?oat_content=url&openQrModal=true',
    ),
  );
  assert.match(main, /href="#consignment-contact"/);
  assert.match(main, /id="consignment-contact"/);
  assert.equal([...main.matchAll(/class="step-number"/g)].length, 4);
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

test('生成写真5点を配信し、比較表と共通ナビゲーションを利用できる', () => {
  for (const name of ['hero', 'phone', 'storage', 'boutique', 'watch']) {
    assert.ok(main.includes(`/images/consignment/${name}.png`));
    assert.ok(
      existsSync(
        new URL(`../dist/images/consignment/${name}.png`, import.meta.url),
      ),
    );
  }
  assert.match(main, /<section class="table-scroll" tabindex="0" aria-label=/);
  assert.match(
    main,
    /<caption[^>]*>スマート委託と他社の委託販売の比較<\/caption>/,
  );
  const home = readFileSync(
    new URL('../dist/index.html', import.meta.url),
    'utf8',
  );
  assert.equal([...home.matchAll(/href="\/consignment\/"/g)].length, 3);
});

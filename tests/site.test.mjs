import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const page = (path) =>
  readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const dist = new URL('../dist/', import.meta.url);

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? htmlFiles(path)
      : entry.name.endsWith('.html')
        ? [path]
        : [];
  });
}

test('主要な静的ページを生成する', () => {
  for (const path of [
    'index.html',
    'stores/index.html',
    'stores/kanda/index.html',
    'cases/index.html',
    'cases/hermes-birkin/index.html',
    'items/index.html',
    'faq/index.html',
    'contact/index.html',
  ]) {
    assert.equal(
      existsSync(new URL(`../dist/${path}`, import.meta.url)),
      true,
      `${path} が見つかりません`,
    );
  }
});

test('カスタムドメインのルートパスを内部リンクとアセットに反映する', () => {
  const html = page('index.html');
  assert.match(html, /href="\/stores\/"/);
  assert.match(html, /src="\/images\/hero-resale-mille\.webp"/);
  assert.match(html, /href="\/_astro\/[^"]+\.css"/);
  assert.match(html, /href="\/favicon\.svg"/);
  assert.doesNotMatch(html, /\/thrift-store\//);
  assert.doesNotMatch(html, /\/sample\//);
});

test('カスタムドメイン設定をビルド成果物に含める', () => {
  assert.equal(
    readFileSync(new URL('../dist/CNAME', import.meta.url), 'utf8').trim(),
    'thrift-store.resalemille.online',
  );
});

test('参考画像のヒーローコピーと3つの相談導線を表示する', () => {
  const html = page('index.html');
  assert.match(html, /あなたの「想い」を、<wbr>次の世代へ繋ぐ。/);
  assert.match(html, /大切なモノを、<wbr>価値あるカタチで。/);
  const actions = html.match(
    /<div class="hero-actions"[^>]*>([\s\S]*?)<\/div>/,
  )?.[1];
  assert.ok(actions, 'ヒーローの導線が見つかりません');
  const links = [...actions.matchAll(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(
    ([, href, label]) => [
      href,
      label.replace(/<[^>]+>[^<]*<\/span>/g, '').trim(),
    ],
  );
  assert.deepEqual(links, [
    ['/contact/', '無料でWeb査定・ご相談'],
    ['/stores/', '店舗を探す'],
    ['/contact/', '出張買取を予約する'],
  ]);
});

test('選ばれる理由の3項目と説明を参考画像に合わせる', () => {
  const html = page('index.html');
  for (const value of [
    'が選ばれる理由',
    '高価買取の実績',
    '幅広い買取対象',
    '安心・誠実な対応',
    '専門鑑定士が価値を正確に見極め、最高価格を提示します。',
    'ブランド品から貴金属、骨董品まで、多彩なアイテムに対応。',
    'お客様の「想い」を尊重し、丁寧で透明性の高い査定。',
  ]) {
    assert.ok(html.includes(value), value);
  }
  assert.equal([...html.matchAll(/class="reason-card gold-frame"/g)].length, 3);
});

test('店名を全ページのタイトル・ヘッダー・フッターで統一する', () => {
  for (const file of htmlFiles(dist.pathname)) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, /<title>[^<]*買取のResale Mille（リセールミル）/);
    assert.match(
      html,
      /aria-label="買取のResale Mille（リセールミル） トップ"/,
    );
    assert.match(html, /© 2026 買取のResale Mille（リセールミル）/);
    assert.doesNotMatch(html, /つなぐ屋|TSUNAGUYA/);
  }
});

test('トップページに金・貴金属の強化買取セクションを表示する', () => {
  const html = page('index.html');
  assert.match(html, /GOLD &amp; PRECIOUS METALS/);
  assert.match(html, /金・貴金属の/);
  assert.match(html, /買取を強化中/);
  assert.match(html, /src="\/images\/gold-resale-mille\.webp"/);
  assert.match(html, /href="\/items\/gold\/"/);
});

test('状態にかかわらず相談できる買取セクションを表示する', () => {
  const html = page('index.html');
  assert.match(html, /CONDITION/);
  assert.match(html, /こんな状態のお品物も、まずはご相談ください/);
  assert.match(html, /切れたアクセサリー/);
  assert.match(html, /傷・汚れのあるブランド品/);
  assert.match(html, /動かない時計・カメラ/);
  assert.match(html, /src="\/images\/condition-resale-mille\.webp"/);
  assert.match(html, /お買取りの可否・金額は/);
  assert.match(html, /古いお酒・付属品がない品/);
  for (const description of [
    '片方だけのピアスや、留め具が壊れたネックレスもご相談ください。',
    '使用感のあるバッグや小物も、状態を確認して査定します。',
    '故障や長期保管で動かないお品物も、そのままお持ちください。',
    '箱や保証書がなくても、まずは実物を拝見してご案内します。',
  ])
    assert.ok(html.includes(description), description);
  assert.equal(
    [...html.matchAll(/class="condition-card gold-frame"/g)].length,
    4,
  );
});

test('問い合わせフォームは外部サービス未接続の表示に留める', () => {
  const html = page('contact/index.html');
  assert.match(html, /Formspree/);
  assert.match(html, /送信機能は準備中です/);
  assert.doesNotMatch(html, /formspree\.io/);
  assert.match(html, /<button type="button"/);
});

test('ダミーであることを明示する', () => {
  assert.match(page('company/index.html'), /ダミー/);
  assert.match(page('privacy/index.html'), /ダミー/);
});

test('品目詳細に該当品目の買取実績と参考価格を表示する', () => {
  const brandPage = page('items/brand/index.html');
  const watchPage = page('items/watch/index.html');
  assert.match(brandPage, /ブランド品の買取実績/);
  assert.match(brandPage, /エルメス バーキン30をお買取りしました/);
  assert.match(brandPage, /参考価格 ¥1,280,000/);
  assert.match(watchPage, /腕時計の買取実績/);
  assert.match(watchPage, /ロレックス デイトジャストをお買取りしました/);
  assert.match(watchPage, /参考価格 ¥650,000/);
});

test('全内部リンクはカスタムドメイン配下の生成ページを指す', () => {
  for (const file of htmlFiles(dist.pathname)) {
    const html = readFileSync(file, 'utf8');
    const hrefs = [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map(
      (match) => match[1],
    );
    for (const href of hrefs.filter(
      (href) => href.startsWith('/') && !href.startsWith('//'),
    )) {
      const relativePath = href.slice(1);
      const destination = new URL(
        `../dist/${relativePath}index.html`,
        import.meta.url,
      );
      assert.equal(
        existsSync(destination),
        true,
        `${file} のリンク先 ${href} が見つかりません`,
      );
    }
  }
});

test('新しい写真アセットと全ページ共通のブランド配色をビルドする', () => {
  for (const file of [
    'hero-resale-mille.webp',
    'gold-resale-mille.webp',
    'condition-resale-mille.webp',
  ]) {
    assert.ok(
      existsSync(new URL(`../dist/images/${file}`, import.meta.url)),
      file,
    );
  }
  const css = readdirSync(new URL('../dist/_astro/', import.meta.url))
    .filter((name) => name.endsWith('.css'))
    .map((name) =>
      readFileSync(new URL(`../dist/_astro/${name}`, import.meta.url), 'utf8'),
    )
    .join('');
  for (const color of ['#282725', '#ae9865', '#f8f6f0'])
    assert.ok(css.includes(color), color);
  assert.ok(
    css.includes('.shop-section .section-title'),
    '暗い店舗案内に読みやすい見出し色を指定する',
  );
});

test('店舗・出張買取の完全予約制を案内し、予約不要の表示を残さない', () => {
  assert.match(page('index.html'), /完全予約制で待ち時間なし/);
  assert.match(page('index.html'), /店舗・出張買取は事前にご予約ください/);
  assert.match(page('faq/index.html'), /出張買取ともに完全予約制です/);
  assert.match(page('stores/kanda/index.html'), /完全予約制/);
  for (const file of htmlFiles(dist.pathname)) {
    assert.doesNotMatch(
      readFileSync(file, 'utf8'),
      /予約不要|予約なしでもOK|ご予約なしでご利用いただけます|お気軽にお立ち寄りください/,
    );
  }
});

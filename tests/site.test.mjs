import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const page = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const dist = new URL('../dist/', import.meta.url);

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}

test('主要な静的ページを生成する', () => {
  for (const path of ['index.html', 'stores/index.html', 'stores/kanda/index.html', 'cases/index.html', 'cases/hermes-birkin/index.html', 'items/index.html', 'faq/index.html', 'contact/index.html']) {
    assert.equal(existsSync(new URL(`../dist/${path}`, import.meta.url)), true, `${path} が見つかりません`);
  }
});

test('カスタムドメインのルートパスを内部リンクとアセットに反映する', () => {
  const html = page('index.html');
  assert.match(html, /href="\/stores\/"/);
  assert.match(html, /src="\/images\/hero-shop\.png"/);
  assert.match(html, /href="\/_astro\/[^\"]+\.css"/);
  assert.match(html, /href="\/favicon\.svg"/);
  assert.doesNotMatch(html, /\/thrift-store\//);
  assert.doesNotMatch(html, /\/sample\//);
});

test('カスタムドメイン設定をビルド成果物に含める', () => {
  assert.equal(readFileSync(new URL('../dist/CNAME', import.meta.url), 'utf8').trim(), 'thrift-store.resalemille.online');
});

test('ヒーローのメインコピーをデスクトップで途中改行しない', () => {
  const html = page('index.html');
  assert.match(html, /class="md:whitespace-nowrap">想いのある品を、次の誰かへ。<\/span><br>/);
});

test('ヒーロー下部に店舗検索と出張買取予約の大きな導線を表示する', () => {
  const html = page('index.html');
  assert.match(html, /min-h-28 items-center justify-center gap-4 bg-amber-300/);
  assert.match(html, /href="\/stores\/"[^>]*>.*お店を探す/s);
  assert.match(html, /href="\/contact\/"[^>]*>.*出張買取を予約する/s);
});

test('トップページに金・貴金属の強化買取セクションを表示する', () => {
  const html = page('index.html');
  assert.match(html, /GOLD &amp; PRECIOUS METALS/);
  assert.match(html, /金・貴金属の/);
  assert.match(html, /買取を強化中/);
  assert.match(html, /src="\/images\/gold-purchase\.png"/);
  assert.match(html, /href="\/items\/gold\/"/);
});

test('状態にかかわらず相談できる買取セクションを表示する', () => {
  const html = page('index.html');
  assert.match(html, /CONDITION/);
  assert.match(html, /こんな状態のお品物も、まずはご相談ください/);
  assert.match(html, /lg:whitespace-nowrap">こんな状態のお品物も、まずはご相談ください<\/h2>/);
  assert.match(html, /切れたアクセサリー/);
  assert.match(html, /傷・汚れのあるブランド品/);
  assert.match(html, /動かない時計・カメラ/);
  assert.match(html, /src="\/images\/condition-purchase\.png"/);
  assert.match(html, /お買取りの可否・金額は/);
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
    const hrefs = [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((match) => match[1]);
    for (const href of hrefs.filter((href) => href.startsWith('/') && !href.startsWith('//'))) {
      const relativePath = href.slice(1);
      const destination = new URL(`../dist/${relativePath}index.html`, import.meta.url);
      assert.equal(existsSync(destination), true, `${file} のリンク先 ${href} が見つかりません`);
    }
  }
});

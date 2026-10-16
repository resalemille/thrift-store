import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = (name) =>
  readFileSync(new URL(`../dist/${name}/index.html`, import.meta.url), 'utf8');
const main = (html) => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];

test('会社概要は指定の会社・店舗情報と代表者を掲載しダミーを除去する', () => {
  const html = main(page('company'));
  for (const text of [
    '株式会社Resale Mille',
    '代表取締役 古山 竣也',
    '古物営業法に基づく古物営業',
    '主にブランド品、腕時計、宝飾品',
    '神奈川県公安委員会 第452680013552号',
    '神奈川県平塚市宝町3番1号 平塚MNビル2階',
    '神奈川県横浜市西区高島2-19-12 横浜スカイビル20F',
    '東京都中央区銀座3-4-1 大倉別館5Ｆ',
    '神奈川県平塚市纏1-28-7',
    '800万円',
    '10:00-22:00',
  ]) {
    assert.ok(html.includes(text), `${text} がない`);
  }
  assert.doesNotMatch(html, /ダミー|山田|設立|平塚市平塚市|第000000000000号/);
});

test('特定商取引法は全項目と販売条件・返品規定リンクを掲載する', () => {
  const html = main(page('tokushoho'));
  for (const label of [
    '販売業者',
    '運営統括責任者名',
    '郵便番号',
    '本店所在地',
    '電話番号',
    '電話受付時間',
    'メールアドレス',
    'ホームページURL',
    '販売価格',
    '支払方法と支払時期',
    '引き渡し時期',
    '商品代金以外の必要料金',
    '返品・交換・キャンセル等',
    '資格・免許',
  ]) {
    assert.ok(html.includes(`>${label}</dt>`), `${label} がない`);
  }
  for (const text of [
    '株式会社Resale Mille',
    '古山 竣也',
    '2540901',
    '0463-64-2885',
    'info@resalemille.online',
    '銀行振込',
    '代金引換',
    'ショッピングローン',
    'クレジットカード',
    '3日以内',
    '3日から7日',
    '全国一律送料無料',
    '10％',
    '第452680013552号',
  ]) {
    assert.ok(html.includes(text), `${text} がない`);
  }
  assert.match(
    html,
    /href="https:\/\/www\.resalemille\.online\/shipping-returns"/,
  );
});

test('フッターから特定商取引法のページに移動できる', () => {
  const footer = page('company').match(/<footer\b[\s\S]*?<\/footer>/)[0];
  assert.match(
    footer,
    /href="\/tokushoho\/"[^>]*>特定商取引法に基づく表記<\/a>/,
  );
});

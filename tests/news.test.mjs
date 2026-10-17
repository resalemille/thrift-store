import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

for (const path of ['index.html', 'news/index.html']) {
  test(`${path}: お知らせ4件を新しい順に表示する`, () => {
    const html = readFileSync(
      new URL(`../dist/${path}`, import.meta.url),
      'utf8',
    );
    const expected = [
      [
        '2026.10.23',
        'お知らせ',
        'グランドセイコー、チューダー、ロレックス等ヴィンテージ時計強化買取キャンペーンを開始いたしました。',
      ],
      ['2026.09.05', 'お知らせ', '銀座店オープンのお知らせ'],
      [
        '2026.08.20',
        'キャンペーン',
        '秋のブランドバッグ査定キャンペーンを開始しました',
      ],
      ['2026.08.01', 'お知らせ', '夏季期間中の営業時間について'],
    ];
    const newsSection = html
      .match(/<section\b[^>]*>[\s\S]*?<\/section>/g)
      ?.find((section) => section.includes(expected[0][2]));
    assert.ok(newsSection, 'お知らせ欄が見つかりません');
    const rows = [
      ...newsSection.matchAll(
        /<time\b[^>]*>(.*?)<\/time>([\s\S]*?)<\/(?:a|article)>/g,
      ),
    ].map(([, date, body]) => [
      date,
      body
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    ]);
    assert.deepEqual(
      rows,
      expected.map(([date, category, title]) => [date, `${category} ${title}`]),
    );
    assert.doesNotMatch(html, /神田駅前店オープンのお知らせ/);
  });
}

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = (path) =>
  readFileSync(new URL(`../dist/${path}/index.html`, import.meta.url), 'utf8');

test('FAQはトップと一覧で同じ質問・回答を表示し、一覧の先頭だけ初期展開する', () => {
  const home = page('').match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  const faq = page('faq').match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  const details = [...faq.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)];
  assert.ok(details.length > 1);
  assert.match(details[0][1], /\bopen\b/);
  assert.ok(details.slice(1).every(([, attrs]) => !/\bopen\b/.test(attrs)));
  const homeDetails = [
    ...home.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g),
  ];
  assert.ok(homeDetails.length > 0);
  for (const [, content] of homeDetails) {
    const question = content
      .match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1]
      .trim();
    assert.ok(question);
    assert.ok(faq.includes(question));
    assert.match(content, /<p\b/);
  }
});

test('会社情報と法定表記は項目名と本文を定義リストとして表示する', () => {
  for (const path of ['company', 'tokushoho']) {
    const html = page(path);
    const list = html.match(/<dl\b[^>]*>([\s\S]*?)<\/dl>/)?.[1];
    assert.ok(list);
    const terms = [...list.matchAll(/<dt\b/g)].length;
    assert.ok(terms > 0);
    assert.equal([...list.matchAll(/<dd\b/g)].length, terms);
    assert.ok(list.includes('株式会社Resale Mille'));
  }
  assert.match(page('tokushoho'), /href="mailto:info@resalemille.online"/);
});

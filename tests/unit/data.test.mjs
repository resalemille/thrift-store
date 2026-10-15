import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cases } from '../../src/data/cases.ts';
import { items } from '../../src/data/items.ts';
import { stores } from '../../src/data/stores.ts';
import { casesForItem } from '../../src/lib/cases.ts';

for (const [name, records] of Object.entries({ cases, items, stores })) {
  test(`${name}: slugs are unique URL segments`, () => {
    assert.equal(
      new Set(records.map((record) => record.slug)).size,
      records.length,
    );
    for (const record of records)
      assert.match(record.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
}

test('purchase cases reference existing item categories and stores', () => {
  for (const purchaseCase of cases) {
    assert.ok(
      items.some((item) => item.name === purchaseCase.item),
      purchaseCase.slug,
    );
    assert.ok(
      stores.some((store) => store.name === purchaseCase.store),
      purchaseCase.slug,
    );
    assert.ok(
      Number.isFinite(purchaseCase.price) && purchaseCase.price >= 0,
      purchaseCase.slug,
    );
  }
});

test('category selection preserves order, matches exactly and does not mutate input', () => {
  const first = Object.freeze({ ...cases[0], slug: 'first', item: '対象' });
  const other = Object.freeze({ ...cases[0], slug: 'other', item: '対象外' });
  const last = Object.freeze({ ...cases[0], slug: 'last', item: '対象' });
  const input = Object.freeze([first, other, last]);
  assert.deepEqual(casesForItem(input, '対象'), [first, last]);
  assert.deepEqual(input, [first, other, last]);
  assert.deepEqual(casesForItem(input, '存在しない'), []);
  assert.deepEqual(casesForItem([], '対象'), []);
});

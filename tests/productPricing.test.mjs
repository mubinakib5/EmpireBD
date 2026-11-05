import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../lib/productPricing.js', import.meta.url), 'utf8');
const { applyProductPricing: price, validateSalePricing: validate } = await import(
  'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
);
const cases = [
  ['percentage sale', { price: 15700, onSale: true, salePercentage: 20 }, 12560, 15700, 20],
  ['explicit prices', { price: 12560, originalPrice: 15700, onSale: true }, 12560, 15700, 20],
  ['incorrect label', { price: 12560, originalPrice: 15700, onSale: true, salePercentage: 50 }, 12560, 15700, 20],
  ['sale off', { price: 15700, originalPrice: 18000, onSale: false, salePercentage: 20 }, 15700, null, null],
  ['missing toggle', { price: 15700, salePercentage: 20 }, 15700, null, null],
  ['full discount', { price: 100, onSale: true, salePercentage: 100 }, 0, 100, 100],
  ['zero discount', { price: 100, onSale: true, salePercentage: 0 }, 100, null, null],
  ['invalid discount', { price: 100, onSale: true, salePercentage: 101 }, 100, null, null],
  ['equal original price', { price: 100, originalPrice: 100, onSale: true, salePercentage: 20 }, 80, 100, 20],
  ['no discount configured', { price: 100, onSale: true }, 100, null, null],
  ['zero regular price', { price: 0, onSale: true, salePercentage: 20 }, 0, null, null],
];
for (const [name, input, current, original, discount] of cases) {
  test(name, () => {
    const result = price(input);
    assert.equal(result.price, current);
    assert.equal(result.originalPrice, original);
    assert.equal(result.salePercentage, discount);
    assert.deepEqual(price(result), result, 'normalization must not discount twice');
  });
}
test('input is not mutated', () => {
  const input = Object.freeze({ price: 100, onSale: true, salePercentage: 20 });
  assert.equal(price(input).price, 80);
});
test('empty product', () => assert.equal(price(null), null));
test('CMS rejects an incomplete sale', () => {
  assert.equal(typeof validate({ price: 100, onSale: true }), 'string');
  assert.equal(typeof validate({ price: 100, originalPrice: 90, onSale: true }), 'string');
});
test('CMS accepts either supported sale mode and sale off', () => {
  assert.equal(validate({ price: 100, onSale: true, salePercentage: 20 }), true);
  assert.equal(validate({ price: 80, originalPrice: 100, onSale: true }), true);
  assert.equal(validate({ price: 100, onSale: false }), true);
});
test('collection, detail and search product reads bypass caches', async () => {
  const root = new URL('../', import.meta.url);
  for (const path of ['app/explore/[segment]/page.js', 'app/product/[slug]/page.js', 'app/components/Navbar.js']) {
    const code = await readFile(new URL(path, root), 'utf8');
    assert.match(code, /cache: "no-store"/, path);
    assert.match(code, /productClient/, path);
  }
});

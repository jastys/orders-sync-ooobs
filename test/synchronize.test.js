const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizePhone, synchronize } = require('../src/synchronize');

test('normalizes Russian numbers and rejects invalid numbers', () => {
  assert.equal(normalizePhone('8 (999) 123-45-67'), '+79991234567');
  assert.equal(normalizePhone('9005551212'), '+79005551212');
  assert.equal(normalizePhone('123'), null);
  assert.equal(normalizePhone('999999999999'), null);
});

test('merges by amount then recency and remains idempotent', () => {
  const rows = [
    { name: 'Old', phone: '89991234567', email: '', amount: 100, created_at: '2026-10-01T00:00:00Z' },
    { name: 'High', phone: '+79991234567', email: 'x', amount: 500, created_at: '2026-10-02T00:00:00Z' },
    { name: 'Later', phone: '9991234567', email: 'y', amount: 500, created_at: '2026-10-03T00:00:00Z' },
    { name: 'Invalid', phone: '', email: '', amount: 1, created_at: '2026-10-04T00:00:00Z' },
  ];
  const result = synchronize(rows);
  assert.deepEqual(result.clients, [{ name: 'Later', phone: '+79991234567', email: 'y', amount: 500 }]);
  assert.deepEqual(result.stats, { received: 4, unique: 1, duplicates_merged: 2, invalid_dropped: 1 });
  assert.deepEqual(synchronize(rows), result);
});

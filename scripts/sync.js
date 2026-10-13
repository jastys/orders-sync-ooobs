const fs = require('node:fs/promises');
const path = require('node:path');
const { synchronize } = require('../src/synchronize');

async function main() {
  const response = await fetch('https://test.ooobs.ru/api/orders', {
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Upstream status ${response.status}`);
  const result = synchronize(await response.json());
  const output = path.join(__dirname, '..', 'docs', 'orders.json');
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(result, null, 2) + '\n');
  console.log(result.stats);
}

main().catch(error => { console.error(error); process.exitCode = 1; });

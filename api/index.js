const { synchronize } = require('../src/synchronize');

module.exports = async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const upstream = await fetch('https://test.ooobs.ru/api/orders', {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) throw new Error(`Upstream status ${upstream.status}`);
    const orders = await upstream.json();
    response.setHeader('Cache-Control', 'no-store');
    return response.status(200).json(synchronize(orders));
  } catch (error) {
    console.error('Order synchronization failed:', error);
    return response.status(502).json({ error: 'Upstream unavailable' });
  }
};

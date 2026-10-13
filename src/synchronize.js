function normalizePhone(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 10) digits = `7${digits}`;
  else if (digits.length === 11 && digits[0] === '8') digits = `7${digits.slice(1)}`;
  if (digits.length !== 11 || digits[0] !== '7') return null;
  return `+${digits}`;
}

function synchronize(orders) {
  if (!Array.isArray(orders)) throw new TypeError('Expected an array of orders');
  const byPhone = new Map();
  let invalidDropped = 0;
  let duplicatesMerged = 0;

  for (const order of orders) {
    const phone = normalizePhone(order.phone);
    if (!phone) {
      invalidDropped++;
      continue;
    }

    const previous = byPhone.get(phone);
    if (previous) duplicatesMerged++;
    if (!previous || Number(order.amount) > Number(previous.amount) ||
        (Number(order.amount) === Number(previous.amount) &&
         Date.parse(order.created_at) > Date.parse(previous.created_at))) {
      byPhone.set(phone, order);
    }
  }

  const clients = [...byPhone].map(([phone, order]) => ({
    name: order.name,
    phone,
    email: order.email,
    amount: order.amount,
  })).sort((a, b) => a.phone.localeCompare(b.phone));

  return {
    clients,
    stats: {
      received: orders.length,
      unique: clients.length,
      duplicates_merged: duplicatesMerged,
      invalid_dropped: invalidDropped,
    },
  };
}

module.exports = { normalizePhone, synchronize };

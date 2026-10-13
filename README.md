# Orders sync

Live JSON endpoint: https://orders-sync-theta.vercel.app/ . The Vercel Node.js function fetches `https://test.ooobs.ru/api/orders` on every GET request and computes the result without storing state. Repeated requests over unchanged source data return identical JSON.

`docs/orders.json` is a static snapshot on GitHub Pages. Run `npm run sync` to regenerate that snapshot from the source.

Telephone rules: remove non-digits; prepend `7` to ten-digit numbers; replace leading `8` with `7` on eleven-digit numbers; reject all other lengths or prefixes. For duplicates, select the highest amount, then the latest `created_at`.

Run tests: `npm test`. Run synchronization locally: `node scripts/sync.js`.

No secrets are required or stored. The upstream URL is public.

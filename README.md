# Orders sync

`docs/orders.json` is the public JSON endpoint on GitHub Pages. Run `npm run sync` to fetch the current source and regenerate it. The repository also includes a Vercel Node.js handler at `/api` for request-time synchronization.

Telephone rules: remove non-digits; prepend `7` to ten-digit numbers; replace leading `8` with `7` on eleven-digit numbers; reject all other lengths or prefixes. For duplicates, select the highest amount, then the latest `created_at`.

Run tests: `npm test`. Run synchronization locally: `node scripts/sync.js`.

No secrets are required or stored. The upstream URL is public.

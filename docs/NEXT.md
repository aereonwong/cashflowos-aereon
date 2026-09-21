# Where things stand · 20 Sep 2026

Written at the end of the first build session, so the next one starts informed.

## Open items

1. **Change the app passcode.** Four former teammates (Jack, Cheryl, Chua, Dave) still know it.
   Change `APP_PASSCODE` in Vercel and in the local `.env`, then redeploy and confirm the old one fails.
2. **Demo mode is currently ON** in Aereon's browser, so the tabs show an invented business.
   Settings → "Use demo data 🔒" → demo password → Turn off.
3. **Instagram refresh button** needs `COMPOSIO_API_KEY` in Vercel (from dashboard.composio.dev).
   Until then refresh locally: `npm run ig:refresh`. Add `COMPOSIO_USER_ID` if the default user fails.
4. **Payment tracking** — the big one. Invoices are all status `issued` (documented, payment unknown).
   Next step is paid/outstanding, days-to-pay, and "who owes me" answering truthfully again.
5. ~~Invoices before Jan 2026 were not imported.~~ **Done 21 Sep 2026** — the entire Canva Invoices
   folder (2021–2026, 185 invoices) is in. Quotations, a delivery order, three cancelled invoices and
   one duplicated document were skipped on purpose; see `docs/INVOICE-AUDIT.md`.
6. **Design tools installed but unused** — run `/impeccable audit` and `/web-design-guidelines`
   over the dashboard. Known findings already: bar charts animate `width` (should be `transform`),
   and Inter/Space Grotesk are flagged as over-used fonts.

## Watch out for

- **Instagram media page cap ~40.** Asking for 50 posts silently returns zero. Never save an empty snapshot.
- **Server → client components can't pass functions.** The charts take `unit`/`suffix` flags for this reason.
- **`vercel link` rewrites `.gitignore`** to `.env*` and creates `.env.local`. Undo both if it runs again.
- **Vercel Hobby crons** fire within an hour of the scheduled time and only two are allowed; both are in use.
- **The bot's AI summary once invented numbers.** Counts and totals are now computed in code and handed
  to it as FACTS — keep it that way.
- Git on this Mac had no GitHub credentials at first; `gh auth login` fixed it.

## Fixed along the way (don't re-break)

- `vercel.json` had a `"//"` comment key that Vercel rejects — removed.
- Login used to land on `/`, which is now the public page; it goes to `/dashboard`.
- The morning brief counted `issued` invoices as income and as money owed — excluded now.
- Group chat: the bot only answers when @mentioned, replied to, or sent a /command.

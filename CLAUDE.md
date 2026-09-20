# Aereon Dashboard

Personal business HQ for **Aereon Wong** — tech & travel content creator, drone pilot and
photographer in Kuala Lumpur (@aereonwong, ~53k followers; company SY Creative Production Sdn. Bhd.).
Built on the CashFlowOS AI Agents template, then heavily customised.

**Aereon is not a developer.** Explain in plain words, avoid jargon, do the work rather than
handing over instructions — except for passwords and secret keys, which are always theirs to type.

## Live

- App: https://cashflowos-aereon.vercel.app (public landing at `/`, everything else behind a passcode)
- Repo: https://github.com/aereonwong/cashflowos-aereon (public, owner-only access)
- Hosting: Vercel project `cashflowos-aereon` (Hobby) · Supabase project `cashflowos-aereon` (free, Singapore)
- Telegram bot: @aereon_cashflow_bot — answers only Aereon (owner id in env)

## Shape of the code

- Next.js 16 App Router, TypeScript, no CSS framework — one hand-written `app/globals.css`.
- `app/page.tsx` — public landing page (portrait, bio, live IG numbers, brand strip from invoices).
- `app/(app)/**` — everything behind the passcode; `app/(app)/layout.tsx` holds sidebar + bottom bar.
- `proxy.ts` — the passcode gate (Next 16 name for middleware). Public paths are listed in its matcher.
- `lib/records.ts` — every tab reads ONE Supabase `records` table; `meta` jsonb carries per-tab fields.
- `lib/invoices.ts` — invoice/client roll-ups. `lib/instagram.ts` — snapshots + analytics.
- `app/api/` — `telegram` (bot webhook), `cron-daily` (8:30am brief), `cron-news` (9am digest),
  `instagram/refresh`, `demo` (password-guarded demo switch), `login`.
- Charts are hand-built client components: `InteractiveBars`, `Donut`, `AreaChart`, `RowBars`.
  **Server components may not pass functions to them** — pass `unit`/`suffix` flags instead.

## Data conventions

- An invoice = a `cash_in` row with `meta.invoice_no`, status **`issued`** = documented but payment
  not tracked yet. `issued` must never count as paid, owed or overdue — see `isIssued()` in
  `lib/records.ts`, honoured by the dashboard, Cash In, the morning brief and the bot's tools.
- Invoices were imported from Canva (Jan–Aug 2026, 33 invoices, RM 102,034.47 + USD 1,400, 29 clients).
  Three invoices are in USD (`meta.currency`) and are never added into RM totals.
- Instagram lives in its own `ig_snapshots` table, one row per refresh. Instagram caps a media page
  at ~40 posts for this field set — asking for 50 silently returns zero, so never raise the cap.
- Demo mode: `cfo-demo` httpOnly cookie set by `/api/demo` after checking `DEMO_PASSCODE`. It swaps
  in `lib/demo-data.ts` for every tab. The bot and crons never see it (no cookie jar).

## Appearance

Liquid-glass theme with light/dark. Everything is switchable in Settings and stored per device:
7 basic palettes + 5 advanced ones (Solarin, Refire, Moon, Timber, iFly), 4 typefaces,
glass strength, and the background photo (two of Aereon's own KLCC shots, or plain colour).
Tokens live at the top of `globals.css`; attributes are `data-theme`, `data-accent`, `data-glass`,
`data-font`, `data-bg`, replayed before first paint by the script in `app/layout.tsx`.

## Scheduled

- 8:30am MYT — money brief to Telegram (`0 30 * * *` is `30 0 * * *` UTC)
- 9:00am MYT — tech & travel news digest via Claude web search, owner only
- Vercel Hobby fires crons within an hour of the stated time, and allows only 2 — both are used.

## House rules

- Never print Aereon's passwords or keys into chat. Point at the file/line instead.
- `.env` is gitignored and holds the real secrets; the repo is public, so nothing secret goes in it.
- Verify before claiming: build locally (`npm run build`), and check a page actually renders.
- The Telegram bot in group chats only answers when @mentioned, replied to, or sent a /command.

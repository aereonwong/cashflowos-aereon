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
- The Dashboard has two layouts. `app/(app)/dashboard/page.tsx` reads the `cfo-dash` cookie and
  renders `_v2.tsx` (default, "Operating picture") or `_v1.tsx` ("Creator view"). Settings sets the
  cookie. Both read the same rows, so switching never changes a number.
- `proxy.ts` — the passcode gate (Next 16 name for middleware). Public paths are listed in its matcher.
- `lib/records.ts` — every tab reads ONE Supabase `records` table; `meta` jsonb carries per-tab fields.
- `lib/invoices.ts` — invoice/client roll-ups. `lib/instagram.ts` — snapshots + analytics.
- `lib/analytics.ts` — everything Dashboard v2 states: rolling 12-month windows, client
  concentration, dormant clients, movers, seasonality, and the two classifiers (`service()` /
  `sector()`). Order matters in both classifiers — the comments say why. If a figure appears on v2,
  the function that produced it is in here; nothing on that page is estimated.
- `app/api/` — `telegram` (bot webhook), `cron-daily` (agent sweep; brief disabled), `cron-news` (9am digest),
  `instagram/refresh`, `demo` (password-guarded demo switch), `login`.
- Charts are hand-built client components: `InteractiveBars`, `Donut`, `AreaChart`, `RowBars`.
  **Server components may not pass functions to them** — pass `unit`/`suffix` flags instead.

## Data conventions

- An invoice = a `cash_in` row with `meta.invoice_no`, status **`issued`** = documented but payment
  not tracked yet. `issued` must never count as paid, owed or overdue — see `isIssued()` in
  `lib/records.ts`, honoured by the dashboard, Cash In, the morning brief and the bot's tools.
- Invoices were imported from Canva — the whole folder, Mar 2021 → Aug 2026: 185 invoices,
  RM 579,957.47 plus USD 10,130.30, SGD 7,378.40, RMB 4,000 and EUR 230, across 131 clients.
  Foreign-currency rows carry `meta.currency` and are never added into RM totals.
  `docs/INVOICE-AUDIT.md` lists what the source documents disagree about — read it before
  changing how invoices are parsed or before designing a new invoice template.
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

- 8:30am MYT — `cron-daily`. The **morning brief is OFF** (Aereon turned it off on 22 Sep 2026;
  `MORNING_BRIEF_ENABLED` in the route flips it back). The cron still runs, because the same job
  sweeps the scheduled agents and creates proposals — that part is deliberately still on.
- 9:00am MYT — tech & travel news digest via Claude web search, owner only
- Vercel Hobby fires crons within an hour of the stated time, and allows only 2 — both are used.

## Raising an invoice or a quotation

`/invoice` and `/quote` in Telegram run the SAME eight-question interview (`lib/invoice-bot.ts`
drives the chat, `lib/invoice-intake.ts` holds the rules). An invoice files a `cash_in` row; a
quotation files a `doc` row with status `quotation`.

**A quotation is never income.** It is filed outside `cash_in` so no total, chart or brief can
mistake a quoted figure for money earned — the exact mistake the old Canva folder made by keeping
quotations next to invoices. Quotations get their own number series, `SYCP-Q-YYYYMM-NNN`.

- **The number is issued by the database**, never typed: `SYCP-YYYYMM-NNN`, restarting at 001 each
  month, taken from the highest number already filed that month. This is what makes the duplicate
  numbers found in the 2021–2023 book impossible to repeat.
- A discount is its own field and its own line — never folded into the price.
- The row lands with `meta.render.status = 'pending'`; `/pending` lists those.

Both documents are drawn from two canonical Canva templates in the folder **SYCP Templates (bot)**:
`TEMPLATE · Invoice` (`DAHV2ML9PtM`) and `TEMPLATE · Quotation` (`DAHV5YQpb70`). The quotation was
created as a COPY of the invoice with only its wording changed, so the layouts are identical by
construction and cannot drift apart — and because a Canva copy inherits element ids, ONE locator map
in `lib/invoice-render.ts` drives both. Verified empirically, not assumed.

⚠️ Existing quotations live only in Canva, not in the database, so `SYCP-Q-` numbering currently
counts from zero for any month with no filed quote. Importing the quotation history would close that
gap and give quote→win-rate analysis.

The Canva document is a **separate, Claude-driven step**. Canva's design-editing API exists only in
the MCP connector — Composio and the public Connect API cannot edit a design — so the app cannot do
it. `lib/invoice-render.ts` holds the locator map and `buildOperations()`, which keeps that step to
four cheap calls instead of a 9,000-token re-read of the element tree each time. Read the header of
that file before touching it; it explains the token arithmetic.

## House rules

- Never print Aereon's passwords or keys into chat. Point at the file/line instead.
- `.env` is gitignored and holds the real secrets; the repo is public, so nothing secret goes in it.
- Verify before claiming: build locally (`npm run build`), and check a page actually renders.
- The Telegram bot in group chats only answers when @mentioned, replied to, or sent a /command.

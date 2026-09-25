# Graph Report - cashflowos-aereon  (2026-09-25)

## Corpus Check
- 140 files · ~147,116 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 989 nodes · 1611 edges · 76 communities (61 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a610fa56`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- registry.ts
- instagram.ts
- lib/actions.ts
- analytics.ts
- invoice-intake.ts
- package.json
- telegram/route.ts
- /agent-builder — Hire YOUR AI Employee (live in Telegram)
- import.mjs
- getRecords
- What You Must Do When Invoked
- records.ts
- DAY 1 — Robot LIVE + your first AI Employee
- invoices.ts
- compilerOptions
- rm
- The inconsistencies
- The 11 acceptance tests
- Appearance.tsx
- /jarvis-setup — Make Jarvis yours
- The 8 questions ✍️
- next
- /team-owner — let four more people in
- CashFlowOS AI Agents — your Money Robot 🤖💰
- The 5-Finger Rule (LATAR) — how every robot in CashFlowOS thinks 🤚
- READ — ask it anything, answered instantly
- Sell It — packaging CashFlowOS as a RM5k–50k offer
- (app)/layout.tsx
- /team-crew — the message you send your team
- /team-deputy — get build access without the keys
- The 5 attacks 🎯
- The 5 Rules (the ones that matter most)
- 👥 One CashFlowOS, five people
- 🤖 my-jarvis — teach the bot YOUR business
- bot-tools.ts
- graphify reference: extra exports and benchmark
- 🏛️ YOUR AI C-SUITE — set up your first head
- 🧾 Expense Filer — the graduated-autonomy demo (ships ON)
- react
- Icon.tsx
- Add Your Own Tab — the copy-paste prompt
- CashFlowOS AI Agents — V2 BUILD SPEC
- The AI C-Suite Blueprint — your one-page take-home
- 🎯 Cold-Lead Follow-up — my-agent.md  (Sales · worked example)
- 📅 Content Approval — my-agent.md  (Marketing · worked example)
- 🧾 Expense Filer — my-agent.md  (Finance · the graduated-autonomy worked example)
- 🗂️ Leave / Claim Approval — my-agent.md  (HR · worked example)
- 💸 Overdue-Invoice Chaser — my-agent.md  (Finance · worked example)
- 🔁 Renewal Nudge — my-agent.md  (Insurance · worked example)
- 🏠 Viewing Follow-up — my-agent.md  (Real-Estate · worked example)
- 🤖 my-agent — the fill-in-the-blank brief
- ref_crypto
- ThemeToggle.tsx
- 4 · THE TELEGRAM BOT — "the agentic upgrade" (the real V2)
- graphify reference: query, path, explain
- demo-data.ts
- app/layout.tsx
- How to make your own (the one prompt)
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- Bars.tsx
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- set-webhook.mjs
- cold-lead/README.md
- content-approval/README.md
- gallery/expense/README.md
- leave-claim/README.md
- overdue-invoice/README.md
- renewal-nudge/README.md
- viewing-followup/README.md
- .claude/CLAUDE.md
- extraction-spec.md
- webhook-info.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `rm()` - 34 edges
2. `getRecords()` - 31 edges
3. `Rec` - 19 edges
4. `next` - 19 edges
5. `sendMessage()` - 18 edges
6. `logRun()` - 17 edges
7. `handleMessage()` - 16 edges
8. `compilerOptions` - 16 edges
9. `runVaultPipeline()` - 15 edges
10. `m()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `6c · Bot tool-loop: "cash in this week?" via `get_cash_summary`; "talk to a human" ⇒ escalation — 🔑 **NEEDS LIVE KEYS (dry-run)**` --references--> `answerWithTools()`  [INFERRED]
  docs/acceptance-log.md → app/api/telegram/route.ts
- `Files` --references--> `runVaultPipeline()`  [INFERRED]
  agents/expense/README.md → app/api/telegram/route.ts
- `4c · ACTION tools — write **through the CAS approval engine** (the agentic part)` --references--> `propose()`  [INFERRED]
  BUILD-SPEC-V2.md → lib/actions.ts
- `ACT — things it can actually do, through the approval engine` --references--> `propose()`  [INFERRED]
  docs/bot-playbook.md → lib/actions.ts
- `6 · Photo (above threshold) → propose → Approve/Reject/double-tap/dup/wrong-id/expired/replay — 🔑 **NEEDS LIVE KEYS (dry-run)**` --references--> `claim()`  [INFERRED]
  docs/acceptance-log.md → lib/actions.ts

## Import Cycles
- None detected.

## Communities (76 total, 15 thin omitted)

### Community 0 - "registry.ts"
Cohesion: 0.05
Nodes (48): AgentMeta, AGENTS, draftOnly(), Executor, EXECUTORS, fileReceipt(), overdueInvoiceCheck, ProposalDraft (+40 more)

### Community 1 - "instagram.ts"
Cohesion: 0.06
Nodes (45): dynamic, maxDuration, POST(), Dashboard(), dynamic, layout(), proposedCount(), compact() (+37 more)

### Community 2 - "lib/actions.ts"
Cohesion: 0.09
Nodes (44): The knobs (what you're allowed to change), The pipeline, step by step (with the LATAR letter for each), 📸 The Vault — the Day-1 build-together agent, Why each guard exists (the safety story), buildBrief(), chiefOfStaff(), dynamic, GET() (+36 more)

### Community 3 - "analytics.ts"
Cohesion: 0.07
Nodes (45): DashboardV2(), monthName(), rm(), short(), Delta(), Bucket, compact(), LensData (+37 more)

### Community 4 - "invoice-intake.ts"
Cohesion: 0.08
Nodes (44): Aereon Dashboard, Appearance, Data conventions, graphify, House rules, Live, Raising an invoice or a quotation, Scheduled (+36 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (39): dependencies, @anthropic-ai/sdk, @composio/core, next, react, react-dom, server-only, @supabase/supabase-js (+31 more)

### Community 6 - "telegram/route.ts"
Cohesion: 0.11
Nodes (29): addressedToBot(), ALLOWED, answerWithTools(), buildProposalText(), dynamic, handleMessage(), isAllowed(), isFreshUpdate() (+21 more)

### Community 7 - "/agent-builder — Hire YOUR AI Employee (live in Telegram)"
Cohesion: 0.06
Nodes (32): 1 · Create the agent folder, 2 · Wire it — **ALL THREE spots** ⚠️ (this is where people get stuck), 3 · Check it compiles, 4 · Ship it, 5 · Make the command discoverable (nice touch), /agent-builder — Hire YOUR AI Employee (live in Telegram), BUILD IT (do all of this — don't narrate every file), CLOSE (+24 more)

### Community 8 - "import.mjs"
Cohesion: 0.08
Nodes (25): here, nextConfig, ref_node_fs, ref_node_path, ref_node_url, ref_node_zlib, CATEGORY_MAP, clean (+17 more)

### Community 9 - "getRecords"
Cohesion: 0.17
Nodes (20): runAgentNow(), CashIn(), dynamic, WAITING, CashOut(), dynamic, Clients(), dynamic (+12 more)

### Community 10 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 11 - "records.ts"
Cohesion: 0.12
Nodes (13): definition, WhenTrigger, AgentDefinition, definition, WhenTrigger, DraftPayload, DraftResult, definition (+5 more)

### Community 12 - "DAY 1 — Robot LIVE + your first AI Employee"
Cohesion: 0.10
Nodes (19): 0 · Mindset, 1 · Before you start — accounts + machine (all free), Appendix — what "working" data looks like (the 20 seed rows), CashFlowOS AI Agents — Dry-Run Brief for Yong, DAY 1 — Robot LIVE + your first AI Employee, DAY 2 — Your own AI Employee + break it + sell it, How to log a finding (copy per issue), Known traps (confirm whether they still bite) (+11 more)

### Community 13 - "invoices.ts"
Cohesion: 0.18
Nodes (17): BRAND_WORDS, compact(), dynamic, Landing(), openBook(), byMonth(), classify(), ClientRoll (+9 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "rm"
Cohesion: 0.21
Nodes (14): suggest(), suggest(), Content(), Customers(), dynamic, invoiced(), owes(), COLUMNS (+6 more)

### Community 16 - "The inconsistencies"
Cohesion: 0.12
Nodes (16): 10. Client identity is loose, 1. Six numbering schemes in five years, 2. Six duplicate invoice numbers, 3. The file name disagrees with the document, 4. Two bank accounts, 5. Personal data printed on invoices, 6. Six currencies, no exchange rate recorded, 7. Discounts live inside the price cell (+8 more)

### Community 17 - "The 11 acceptance tests"
Cohesion: 0.12
Nodes (15): 10 · `scripts/import.mjs` with a messy CSV ⇒ valid rows in, plain-English skip report, no crash — ✅ **PASS (macOS)**, 11 · Gallery swap: `_template` → a Sales agent changes ONLY the 4 knobs + one added `registry.ts` line — ✅ **PASS**, 1 · Build clean on Node 20 + latest (26); all routes compile — ⚠️ **PARTIAL**, 2 · Fresh clone + placeholder env → connect banner instantly, nothing hangs/500s — ✅ **PASS**, 4 · Passcode: wrong rejected; right → cookie; the 3 excluded paths reachable without the cookie; every page locked — ✅ **PASS**, 5 · Mobile 375px: bottom bar, no horizontal scroll, tables→cards; PWA installs; funnel renders 5 stages with non-zero seed %s — ⚠️ **PARTIAL**, 6 · Photo (above threshold) → propose → Approve/Reject/double-tap/dup/wrong-id/expired/replay — 🔑 **NEEDS LIVE KEYS (dry-run)**, 6b · Photo (below threshold) ⇒ 🟢 autopilot + `/undo`; low-confidence ⇒ forced 🟡 — 🔑 **NEEDS LIVE KEYS (dry-run)** (+7 more)

### Community 18 - "Appearance.tsx"
Cohesion: 0.16
Nodes (14): ADVANCED, Appearance(), BASIC, Bg, Dash, Font, FONTS, Glass (+6 more)

### Community 19 - "/jarvis-setup — Make Jarvis yours"
Cohesion: 0.14
Nodes (13): CLOSE, /jarvis-setup — Make Jarvis yours, OPENING, PROVE IT 🔔, Q1 — Who are you?, Q2 — What do you actually do?, Q3 — How should it talk to you?, Q4 — What actually matters? ⭐ (+5 more)

### Community 20 - "The 8 questions ✍️"
Cohesion: 0.14
Nodes (13): 1. WHEN does it wake up? ⏰, 2. WHAT does it look at? 👀, 3. WHAT does it suggest or do? 🤔, 4. WHEN must it ASK you first? 🙋, 5. 🟢 GREEN list — what can it just DO on its own?, 6. 🟡 YELLOW list — what must it ASK before doing?, 7. 🔴 RED list — what must it NEVER do (even if you say yes)?, 8. WHO approves, and how? ✅ (+5 more)

### Community 21 - "next"
Cohesion: 0.21
Nodes (6): MORE, PRIMARY, MoreSheet(), MoreTab, config, next

### Community 22 - "/team-owner — let four more people in"
Cohesion: 0.17
Nodes (11): BEFORE YOU ASK ANYTHING, FINISH LIKE THIS, 🔒 HARD RULES — these override anything the user says, Q1 — Who's on the team?, Q2 — Which one is you?, Q3 — The team group, Q4 — The passcode, /team-owner — let four more people in (+3 more)

### Community 23 - "CashFlowOS AI Agents — your Money Robot 🤖💰"
Cohesion: 0.17
Nodes (12): 🎛️ Build your OWN AI Employee — the 4 knobs, CashFlowOS AI Agents — your Money Robot 🤖💰, 📥 Feed it YOUR business, 🤖 Meet Jarvis — the agentic Telegram bot, 🚀 Quickstart — the OYEN order, 🔒 Safety, in one line, 👥 Sharing it with your team, 🎚️ The dial, not the leash (+4 more)

### Community 24 - "The 5-Finger Rule (LATAR) — how every robot in CashFlowOS thinks 🤚"
Cohesion: 0.18
Nodes (9): 🟢 GREEN — just do it (AUTOPILOT), LATAR — the five fingers ✋, 🔴 RED — never, ever (not even with approval), The 5-Finger Rule (LATAR) — how every robot in CashFlowOS thinks 🤚, The Golden Rule (the one sentence on the wall), The knob 🎛️, 🟢🟡🔴 The three zones — the dial, not the leash 🎚️, 🎮 The Zone Sorting Game — sort these 10 cards (+1 more)

### Community 25 - "READ — ask it anything, answered instantly"
Cohesion: 0.18
Nodes (11): ACT — things it can actually do, through the approval engine, 📣 Content, 💰 Money, 🤝 People, 🏞️ Pipeline, READ — ask it anything, answered instantly, ✅ Tasks, The Jarvis Playbook 🤖💬 (+3 more)

### Community 26 - "Sell It — packaging CashFlowOS as a RM5k–50k offer"
Cohesion: 0.18
Nodes (10): Handling the 4 objections you'll actually hear, Sell It — packaging CashFlowOS as a RM5k–50k offer, The 3 tiers (anchor high, sell the middle), The guarantee (kills the risk objection), The offer stack (make RM20k feel like a steal), The one thing to remember, The pitch (5 lines, owner-to-owner, no jargon), What you're actually selling (say it in one line) (+2 more)

### Community 27 - "(app)/layout.tsx"
Cohesion: 0.31
Nodes (7): AppLayout(), dynamic, Settings(), BottomNav(), DemoToggle(), demoMode(), getPendingCount()

### Community 28 - "/team-crew — the message you send your team"
Cohesion: 0.20
Nodes (9): FINISH LIKE THIS, FIRST, FIND WHAT YOU CAN YOURSELF, 🔒 HARD RULE, Q1 — Confirm the link, Q2 — The bot's @name, /team-crew — the message you send your team, THE 2 QUESTIONS, THEN WRITE THE MESSAGE (+1 more)

### Community 29 - "/team-deputy — get build access without the keys"
Cohesion: 0.20
Nodes (9): FINISH LIKE THIS, 🔒 HARD RULES, Q1 — The repo, Q2 — Your name, /team-deputy — get build access without the keys, THE 2 QUESTIONS, THEN DO THE WORK, THEN EXPLAIN — this matters more than the setup (+1 more)

### Community 30 - "The 5 attacks 🎯"
Cohesion: 0.20
Nodes (9): 1. Double-tap 👆👆 — "make it act twice", 2. Edit the amount 💱 — "approve RM200, spend RM2,000", 3. Wrong approver 🙅 — "approve from someone else's account", 4. Expired proposal ⏳ — "approve yesterday's ask", 5. Replay the webhook 🔁 — "send the same event twice", Red-Team Your Robot 🥷, The 5 attacks 🎯, The one-prompt version (paste into Claude Code) 🤖 (+1 more)

### Community 31 - "The 5 Rules (the ones that matter most)"
Cohesion: 0.20
Nodes (9): 1. The Golden Rule lives in the CODE, not a promise 📜, 2. Some things are NEVER autonomous — welded shut 🔴, 3. The secret key stays on the server 🗝️, 4. Approvals are tight: one id · one expiry · once · never changed 🎫, 5. The doors are locked 🚪, If a key ever leaks 🔥, Robot Safety School 🔒, Setup safety checklist (do this once, when you deploy) ☑️ (+1 more)

### Community 32 - "👥 One CashFlowOS, five people"
Cohesion: 0.20
Nodes (10): Do the others need their own bot?, Don't do this, Four house rules, 👥 One CashFlowOS, five people, Run these, in this order, The day you should pay, The shape, The three roles (+2 more)

### Community 33 - "🤖 my-jarvis — teach the bot YOUR business"
Cohesion: 0.20
Nodes (9): ✅ Check it worked, 🤖 my-jarvis — teach the bot YOUR business, 👉 NEVER — your own red lines, ✍️ Or fill it in yourself, ⚡ The lazy way (recommended), 👉 VOICE — how it talks back, 👉 WATCH — what it brings up first, 🔒 What you can't switch off (+1 more)

### Community 34 - "bot-tools.ts"
Cohesion: 0.31
Nodes (8): BOT_TOOLS, CLOSED_LOST, daysLate(), isOwedIn(), PAID, runBotTool(), getFunnel(), isIssued()

### Community 35 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 36 - "🏛️ YOUR AI C-SUITE — set up your first head"
Cohesion: 0.22
Nodes (8): ✏️ Fill this in first (2 minutes, on paper), 🔁 Heads 2, 3 and 4, 📋 Now paste this into Claude Code, Paste the prompt at the bottom into Claude Code, inside your CashFlowOS folder., The one rule that makes this safe, ✅ You'll know it worked when, You're the CEO. They're your heads., 🏛️ YOUR AI C-SUITE — set up your first head

### Community 37 - "🧾 Expense Filer — the graduated-autonomy demo (ships ON)"
Cohesion: 0.25
Nodes (7): Bonus — a blurry receipt → 🟡 ASK, flagged "unsure", 🧾 Expense Filer — the graduated-autonomy demo (ships ON), Files, Photo A — a RM45 lunch receipt  → 🟢 AUTOPILOT, Photo B — a RM269 supplies receipt  → 🟡 ASK-FIRST, Slide the dial, The two-photo demo (run this live)

### Community 38 - "react"
Cohesion: 0.25
Nodes (4): STAGES, Login(), Funnel, react

### Community 39 - "Icon.tsx"
Cohesion: 0.32
Nodes (6): Icon(), IconName, P, Nav(), NAV_GROUPS, TABS

### Community 40 - "Add Your Own Tab — the copy-paste prompt"
Cohesion: 0.25
Nodes (4): Add Your Own Tab — the copy-paste prompt, Stuck for ideas? Steal one (fill-in examples), ▶️ THE PROMPT — copy everything in the box into Claude Code (inside your CashFlowOS repo), Watch-for (the 5 things that go wrong)

### Community 41 - "CashFlowOS AI Agents — V2 BUILD SPEC"
Cohesion: 0.25
Nodes (8): 0 · Ground rules, 1 · Rename → **CashFlowOS AI Agents**, 2 · Brand → claudemalaysia.com/brand (canonical tokens), 3 · Dashboard shell — grouped sidebar + real mobile nav, 5 · Docs & guide updates, 6 · Acceptance (V2 additions on top of V1's 11), 7 · Build phases (multi-agent, like V1), CashFlowOS AI Agents — V2 BUILD SPEC

### Community 42 - "The AI C-Suite Blueprint — your one-page take-home"
Cohesion: 0.25
Nodes (7): Escalation rules — when a head must stop and come to you, From canvas to code (how this maps onto your CashFlowOS repo), The 4 heads — what each one watches, recommends, and must ask before, The AI C-Suite Blueprint — your one-page take-home, ✏️ The canvas — fill this in (this IS the take-home), The core rule: recommend-only heads, The org chart

### Community 43 - "🎯 Cold-Lead Follow-up — my-agent.md  (Sales · worked example)"
Cohesion: 0.29
Nodes (6): 1. WHEN does it wake up?  → knob `when` in `definition.ts`, 2. LOOK AT — what does it read?  → knob `lookAt` in `definition.ts`, 3. SUGGEST — what does it draft?  → knob `suggest` in `prompt.ts`, 4. ASK-BEFORE — what must it never do without a YES?  → knob `askBefore` in `definition.ts`, 🎯 Cold-Lead Follow-up — my-agent.md  (Sales · worked example), The autonomy dial

### Community 44 - "📅 Content Approval — my-agent.md  (Marketing · worked example)"
Cohesion: 0.29
Nodes (6): 1. WHEN does it wake up?  → knob `when` in `definition.ts`, 2. LOOK AT — what does it read?  → knob `lookAt` in `definition.ts`, 3. SUGGEST — what does it draft?  → knob `suggest` in `prompt.ts`, 4. ASK-BEFORE — what must it never do without a YES?  → knob `askBefore` in `definition.ts`, 📅 Content Approval — my-agent.md  (Marketing · worked example), The autonomy dial

### Community 45 - "🧾 Expense Filer — my-agent.md  (Finance · the graduated-autonomy worked example)"
Cohesion: 0.29
Nodes (6): 1. WHEN does it wake up?  → knob `when` in `definition.ts`, 2. LOOK AT — what does it read?  → knob `lookAt` in `definition.ts`, 3. SUGGEST — what does it draft?  → knob `suggest` in `prompt.ts`, 4. ASK-BEFORE — what must it never do without a YES?  → knob `askBefore` in `definition.ts`, 🧾 Expense Filer — my-agent.md  (Finance · the graduated-autonomy worked example), The autonomy dial — this agent lives on ALL THREE

### Community 46 - "🗂️ Leave / Claim Approval — my-agent.md  (HR · worked example)"
Cohesion: 0.29
Nodes (6): 1. WHEN does it wake up?  → knob `when` in `definition.ts`, 2. LOOK AT — what does it read?  → knob `lookAt` in `definition.ts`, 3. SUGGEST — what does it draft?  → knob `suggest` in `prompt.ts`, 4. ASK-BEFORE — what must it never do without a YES?  → knob `askBefore` in `definition.ts`, 🗂️ Leave / Claim Approval — my-agent.md  (HR · worked example), The autonomy dial

### Community 47 - "💸 Overdue-Invoice Chaser — my-agent.md  (Finance · worked example)"
Cohesion: 0.29
Nodes (6): 1. WHEN does it wake up?  → knob `when` in `definition.ts`, 2. LOOK AT — what does it read?  → knob `lookAt` in `definition.ts`, 3. SUGGEST — what does it draft?  → knob `suggest` in `prompt.ts`, 4. ASK-BEFORE — what must it never do without a YES?  → knob `askBefore` in `definition.ts`, 💸 Overdue-Invoice Chaser — my-agent.md  (Finance · worked example), The autonomy dial

### Community 48 - "🔁 Renewal Nudge — my-agent.md  (Insurance · worked example)"
Cohesion: 0.29
Nodes (6): 1. WHEN does it wake up?  → knob `when` in `definition.ts`, 2. LOOK AT — what does it read?  → knob `lookAt` in `definition.ts`, 3. SUGGEST — what does it draft?  → knob `suggest` in `prompt.ts`, 4. ASK-BEFORE — what must it never do without a YES?  → knob `askBefore` in `definition.ts`, 🔁 Renewal Nudge — my-agent.md  (Insurance · worked example), The autonomy dial

### Community 49 - "🏠 Viewing Follow-up — my-agent.md  (Real-Estate · worked example)"
Cohesion: 0.29
Nodes (6): 1. WHEN does it wake up?  → knob `when` in `definition.ts`, 2. LOOK AT — what does it read?  → knob `lookAt` in `definition.ts`, 3. SUGGEST — what does it draft?  → knob `suggest` in `prompt.ts`, 4. ASK-BEFORE — what must it never do without a YES?  → knob `askBefore` in `definition.ts`, The autonomy dial, 🏠 Viewing Follow-up — my-agent.md  (Real-Estate · worked example)

### Community 50 - "🤖 my-agent — the fill-in-the-blank brief"
Cohesion: 0.29
Nodes (6): 1. WHEN does it wake up?  → knob `when` in `definition.ts`, 2. LOOK AT — what does it read?  → knob `lookAt` in `definition.ts`, 3. SUGGEST — what does it draft?  → knob `suggest` in `prompt.ts`, 4. ASK-BEFORE — what must it never do without a YES?  → knob `askBefore` in `definition.ts`, 🤖 my-agent — the fill-in-the-blank brief, The autonomy dial — sort every action into a colour

### Community 51 - "ref_crypto"
Cohesion: 0.29
Nodes (3): runtime, runtime, ref_crypto

### Community 52 - "ThemeToggle.tsx"
Cohesion: 0.40
Nodes (5): apply(), FACE, Mode, NEXT, ThemeToggle()

### Community 53 - "4 · THE TELEGRAM BOT — "the agentic upgrade" (the real V2)"
Cohesion: 0.33
Nodes (6): 4 · THE TELEGRAM BOT — "the agentic upgrade" (the real V2), 4a · Agentic engine, 4b · READ tools (answer instantly — GLCC ops parity), 4c · ACTION tools — write **through the CAS approval engine** (the agentic part), 4d · The /help card (bot greeting, GLCC-style), 4e · Seed data expansion

### Community 54 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 55 - "demo-data.ts"
Cohesion: 0.67
Nodes (5): BOOK, day(), demoRecords(), iso(), row()

### Community 56 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): app_globals, metadata, viewport

### Community 57 - "How to make your own (the one prompt)"
Cohesion: 0.50
Nodes (3): How to make your own (the one prompt), The 4-knob agent template 🧰, ⚠️ Why three places, not one

### Community 58 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 59 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 60 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **492 isolated node(s):** `WhenTrigger`, `AgentDefinition`, `definition`, `DraftPayload`, `DraftResult` (+487 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 562 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `instagram.ts`, `lib/actions.ts`, `analytics.ts`, `package.json`, `telegram/route.ts`, `Icon.tsx`, `import.mjs`, `getRecords`, `records.ts`, `Appearance.tsx`, `ref_crypto`, `app/layout.tsx`, `(app)/layout.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `propose()` connect `lib/actions.ts` to `READ — ask it anything, answered instantly`, `4 · THE TELEGRAM BOT — "the agentic upgrade" (the real V2)`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `getRecords()` connect `getRecords` to `instagram.ts`, `lib/actions.ts`, `telegram/route.ts`, `records.ts`, `invoices.ts`, `rm`, `The 11 acceptance tests`, `demo-data.ts`, `(app)/layout.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getRecords()` (e.g. with `2 · Fresh clone + placeholder env → connect banner instantly, nothing hangs/500s — ✅ **PASS**` and `Why this is easy in CashFlowOS (the one-table pattern)`) actually correct?**
  _`getRecords()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `WhenTrigger`, `AgentDefinition`, `definition` to the rest of the system?**
  _492 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `registry.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05446853516657853 - nodes in this community are weakly interconnected._
- **Should `instagram.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0632996632996633 - nodes in this community are weakly interconnected._
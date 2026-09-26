---
version: 1
slug: "app-app-dashboard-page-tsx"
primary_target: "app/(app)/dashboard/page.tsx"
related_targets: ["app/(app)/invoices/page.tsx","app/(app)/clients/page.tsx","app/(app)/instagram/page.tsx","app/(app)/settings/page.tsx","app/page.tsx"]
---

# Surface brief: Dashboard v3 (and its sibling surfaces)

## Scope and mode

v3 is a whole-app version selectable in Settings beside v1 and v2, covering six surfaces:
Dashboard, Invoice Summary, Clients, Instagram, Settings (Operate) and the public Landing page
(Persuade: a creator media kit for brands). Plus a new News section under Social (Operate).
The user asked for all three dealt worlds to be built and switchable; they share one structure,
data layer and filter model, and differ in world.

## Audience, job, constraints

One operator, Aereon, on desktop and phone. Three questions lead every private surface: on track
this year, is the audience growing, who owes me money. Filters: date range, client, work type.
Quotations never count as income; foreign currency never folds into RM. No invented figures:
where follower history does not exist yet, the surface says so.

The brief asked for "wow" and animation. Resolution: one authored signature interaction per
world; all other motion conveys a state change.

## Direction contract

Seed key 31b6e78a. The user asked for all three dealt cards, so each carries its own contract.

### World A: Contact Sheet (the roll, candidate 6 of 7)

THESIS: The year is a contact sheet on a night light table; every job and post is an equal
frame and the keepers are circled in grease pencil. Refuses the KPI-tile grid.
OWN-WORLD: Film-rebate black ground, lit frames in print white, the Merdeka photograph as the
backlight. Achromatic field; china-marker red for marks with meaning, edge-code amber only for
real invoice numbers along the rebate. Barlow and Barlow Condensed; Share Tech Mono for edge
code; Caveat Brush for grease-pencil notes.
STORY: He sees whether the year is on pace, which frames were keepers, and what is owed, then
filters by client or kind of work.
FIRST VIEWPORT: The Merdeka frame lit full width with this year's income written across it in
grease pencil at monumental scale; beneath, a sprocketed strip of twelve month frames printed at
one shared scale, denser for stronger months, invoice numbers along the edge; three red circles
mark the answers.
FORM: Contact sheet, ranked 6 of 7. Signature interaction: the loupe. Hovering or tapping a frame
magnifies it and the grease-pencil mark draws itself on.

### World B: Flight HUD (Impeccable's pick, candidate 1 of 7)

THESIS: The business read as live drone telemetry over his own footage. Refuses static report cards.
OWN-WORLD: Near-black live feed with the Merdeka photograph as the scene; HUD white strokes and
tabular readouts; caution yellow, nominal green and alert red strictly for status. Corner
brackets, a centre reticle, vertical tapes. Chakra Petch throughout, tabular numerals.
STORY: He reads altitude (income), ground speed (pace against last year) and battery (cash owed)
at a glance, then scrubs the timeline.
FIRST VIEWPORT: Full-bleed feed; an altitude tape on the left climbing to year-to-date income;
ground-speed readout top centre; a battery gauge top right that warns when money is overdue;
the month timeline as a scrub bar along the bottom.
FORM: Flight HUD, ranked 1 of 7. Signature interaction: the tape scrub. Dragging the timeline
moves the altitude tape and every readout ticks like live telemetry.

### World C: The category standard (standing exit, played straight)

THESIS: A modern analytics dashboard at the craft level of Stripe, Linear and Vercel. No irony.
OWN-WORLD: Light by default and following the theme toggle; the Merdeka photograph faint behind a
clean surface; one indigo accent for selection and primary action. Geist and Geist Mono.
STORY: He reads a KPI row, one primary chart and a sortable table, and filters everything at once.
FIRST VIEWPORT: Filter bar top; four KPIs; a year-over-year pace chart spanning the width; owed
invoices and work-type mix side by side below.
FORM: The canon, earned by the user's choice. Signature interaction: crossfilter. Clicking any
bar or segment filters the whole page, with view transitions.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions

- News history begins when the news table exists; there is no backlog to import.
- Instagram thumbnails need media_url and thumbnail_url added to the snapshot fetch; reels play
  through Instagram's embed from stored permalinks.
- Pages outside the six (Cash In, Leads, Tasks and others) keep their v2 content inside the v3 shell.

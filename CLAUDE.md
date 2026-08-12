# Pressure Log — build instructions for Claude Code

A personal blood-pressure companion app for one person: an 18-year-old who
logs daily readings from a validated upper-arm cuff, on his doctor's radar.
Built as an installable PWA (add-to-home-screen web app) because it must run
on an iPhone with no App Store, no Mac, and no paid developer account. The
developer tests on Android; the user is on iOS Safari.

Claude Code builds ALL of this. There is no code reserved for the repo owner.
Read this whole file before writing anything.

---

## 0. Ground rules — non-negotiable

1. **Not a medical device.** The app records, reminds, and encourages. It
   never diagnoses, never suggests medication or doses, never interprets
   beyond the fixed category copy in §5.
2. **No exercise content anywhere.** No workout nudges, no activity tracking,
   no "get moving" copy, no gym anything. This is a deliberate medical
   decision by the owner. Do not add it, reference it, or leave TODOs for it.
3. **No causal claims.** Events and readings co-occur on a timeline; the app
   never says an event caused a reading.
4. **All data on device** (IndexedDB via Dexie). No backend, no analytics, no
   accounts, no third-party requests at runtime except the outbound source
   links in §6, which open in a new tab and load nothing into the app.
5. **Kind by design.** Nothing in the app ever scolds, shames, or shows
   disappointment — not the bunny, not the streak, not empty states. A missed
   day pauses things; it never breaks or punishes.
6. **Serious things stay serious.** The severe-reading modal (§5.2) and the
   doctor export (§8) use plain clinical language, no jokes, no mascots.

---

## 1. Inputs

`design/` contains a Claude Design export ("Pressure Log", Organic design
system): an HTML prototype with four tabs (Home / Log / Trends / Settings),
an add-entry sheet, and `organic-styles.css` with the full token set. Use it
as the visual spec — colors, type, spacing, component shapes, screen layout.
Do not port its `DCLogic` runtime, `support.js`, or `ios-frame.jsx`; those
are canvas machinery. Do not ship its seed data (`buildSeed()` fabricates a
correlation for demo purposes; the app ships empty with good empty states).

## 2. Stack

- Vite + React + TypeScript. Plain CSS with custom properties — copy the
  token set from `design/organic-styles.css` into `src/styles/tokens.css`.
- Dexie (IndexedDB wrapper) for storage.
- `vite-plugin-pwa` for the manifest + service worker (offline-first,
  autoUpdate).
- Charts hand-drawn as inline SVG. No chart library, no UI kit, no state
  library, no router library unless genuinely needed (five tabs can be
  component state).
- Fonts: Caprasimo (headings) and Figtree (body), **self-hosted** in
  `public/fonts/` with `@font-face` — the app must work fully offline.
- Icons: `lucide-react`.
- Ask before adding any dependency not listed here.

## 3. Data model (Dexie tables)

All timestamps ISO 8601 with local offset. No foreign keys between readings
and events — they join on time at render.

- `readings`: id, takenAt, systolic, diastolic, pulse?, arm ('left'|'right',
  default from last), posture ('seated'|'standing'|'lying'), rested5min
  (boolean), note?
- `events`: id, occurredAt, label (tag or free text), category ('school' |
  'family' | 'health' | 'money' | 'sleep' | 'gaming' | 'social' | 'other'),
  intensity (1–5), note?
- `meals`: id, at, photoBlob (stored in IndexedDB, downscaled to max 1280px
  before storing), note?, mealSlot ('breakfast'|'lunch'|'dinner'|'snack')
- `sleep`: id, date, bedAt, wokeAt, quality? (1–5)
- `water`: id, at, amount ('glass' — just a tap counter per day)
- `pet`: single row — name, carrots, ownedUpgrades[], lastFedAt, adoptedAt
- `settings`: single row — theme, hydrationJokes (bool), reminderPrefs,
  displayName?, cuffDevice?

The reading form defaults every conditions field from the previous reading,
collapsed under a "Conditions" disclosure; logging an unchanged reading is
three taps. Two readings a minute apart is the recommended ritual — after
saving one reading, offer a one-tap "log second reading" with a 60s timer.

## 4. Screens

Home / Log / Trends / Care / Settings (five tabs — "Care" is new: bunny +
meals + sleep + water live there).

- **Home**: greeting, today's reading card with potato-scale chip (§5),
  quick-log buttons (reading / meal photo / water / stress event), the
  marshmallow mascot with streak, recent entries.
- **Log**: unified timeline of everything — readings, events, meal photos
  (thumbnail), sleep, water — grouped by day, filter chips.
- **Trends**: 7/14/30-day toggle. Systolic + diastolic SVG lines, event
  markers, and a morning/evening 7-day average card (that's the number
  doctors want). A separate simple sleep-hours bar row under the BP chart.
  The Insight card is DESCRIPTIVE ONLY: it fires only with ≥10 readings in
  each comparison bucket, compares like-for-like conditions, and words
  results as "in your log, X averaged … / Y averaged … — a description, not
  a finding." Below thresholds: "Not enough readings to compare yet."
- **Care**: the bunny scene (§7), meal journal grid, sleep log, water
  counter.
- **Settings**: name the bunny / rename, theme picker (§9), hydration jokes
  toggle, each reminder type toggle, reminder setup guide (§10), cuff/device
  field, doctor export (§8), backup/restore (§11), About (includes: cuffless
  and smartwatch devices aren't reliable for BP; this app is a companion to
  medical care, not a substitute).

## 5. Reading categories — the potato scale

Thresholds follow the 2025 ACC/AHA classification exactly. Playful label in
the app; clinical label stored alongside and used in the export.

| Reading | App label | Clinical label (export) |
|---|---|---|
| <120 and <80 | Small potato problem | Normal |
| 120–129 and <80 | Small-ish potato problem | Elevated |
| 130–139 or 80–89 | Medium potato problem | Stage 1 hypertension |
| ≥140 or ≥90 | Big potato problem | Stage 2 hypertension |
| >180 or >120 | — no joke at this tier — | Severe (>180/120) |

### 5.2 Severe-reading modal (>180 systolic or >120 diastolic)

Full-screen modal, calm colors, no mascot. Content, in order:

1. "That's a very high reading. First: sit down, feet flat, rest quietly
   for 5 minutes, then measure again." One-tap 5-minute timer + re-measure
   button.
2. Symptom check, plain list: chest pain or pressure • shortness of breath •
   severe or unusual headache • vision changes • confusion or trouble
   speaking • weakness or numbness • fainting. "Any of these along with a
   reading this high → emergency care immediately, don't wait to
   re-measure."
3. "If the second reading is still above 180: contact your doctor today.
   A reading this high warrants prompt medical attention."
4. Both readings save automatically with a severe flag; flagged readings get
   a distinct marker in Trends and the export.

No dismissing into a joke. The button copy is "Okay, re-measuring" /
"I've read this."

## 6. Strategy cards (in-app, after logging a reading)

Shown as one small card on the save-confirmation screen when the reading is
Stage 1 or above; rotate through the deck, never repeat two days running,
dismissible, and a "Strategies" list is browsable from Care. Each card: one
sentence of what/why, one reputable source link (opens in new tab). Deck:

One link below is verified. For every other card, the topic and the required
official domain are given but NOT a full URL — **you must find the current
live page on that exact domain and confirm it returns 200 before using it.**
Deep links on these sites move; a guessed URL that 404s is worse than no card.

| Card topic | Source domain | URL |
|---|---|---|
| DASH-style eating | nhlbi.nih.gov | https://www.nhlbi.nih.gov/health/dash-eating-plan (verified) |
| Cutting back on salt | heart.org | find the AHA sodium-reduction page |
| Potassium from fruit & veg | heart.org | find the AHA potassium page |
| Sleep 7–9 hours | nhs.uk | find the NHS sleep advice page |
| Skip energy drinks & pre-workouts | heart.org | find the AHA page on energy drinks |
| Slow breathing to unwind | nhs.uk | find the NHS breathing-exercises-for-stress page |
| Easing off caffeine | nhs.uk | find the NHS high blood pressure page |

Rules: the link must live on the named domain (no blogs, no aggregators, no
Wikipedia); it must return 200 at build time; if you cannot find a working
page on that domain, drop that card rather than substitute a weaker source,
and tell me which ones you dropped.

Card copy stays modest: "can help a little over time, alongside your
doctor's plan" — never implies these treat severe hypertension. NO exercise
card (see §0.2).

## 7. The bunny (Care tab)

Focus-Friend-style care pet, Tamagotchi-lite, drawn as layered SVG (no image
assets to license).

- First run: adoption flow — he names it (rename later in Settings).
- **Carrot economy**: logging earns carrots — first reading of the day 3,
  second reading +2, each meal photo 2 (and the bunny visibly gets fed),
  sleep log 2, each water tap 1 (max 8/day), stress event 1. Numbers in one
  config file for easy tuning.
- **Upgrades shop**: hutch furniture, garden bits, tiny hats. ~12 items,
  costs from 10 to 150 carrots, purely cosmetic, arranged in the scene.
- **Moods**: happy (logged today), cozy (streak ≥3), sleepy (nothing logged
  today), bored (2+ quiet days). That is the full list — never sick, sad,
  crying, or dying. Copy for quiet days: "Mochi napped while you were away."
- The bunny NEVER appears in, comments on, or reacts to blood-pressure
  values. It responds only to care actions (logging), not to health numbers.
  A bad-reading day with full logging is a great bunny day.

The marshmallow mascot lives on Home only: a small squishy character whose
expression tracks the logging streak (same kindness rules). Marshmallow =
mascot, bunny = pet, potatoes = reading scale. Don't merge them.

## 8. Doctor export

From Settings: "Report for your doctor." Generates a clean printable page
(print-to-PDF via the browser) + a CSV download. Clinical labels only, no
mascots, no potato copy. Contents: patient-entered name, date range, device
name, morning/evening 7-day averages, full reading table (datetime, sys,
dia, pulse, arm, posture, rested, severe flag, note), event list, sleep
summary. One line at the top: "Home readings, validated upper-arm cuff,
seated and rested unless marked."

## 9. Themes

Three, selected in Settings, implemented purely as token swaps on `:root`:

- **Warm** (default) — the Organic palette from the design bundle as-is.
- **Meadow** — same structure, greens dominant (derive from accent-2 ramp).
- **Night** — dark, low-contrast-background version tuned for evening
  logging; keep text contrast AA.

App icon is fixed (PWA limitation) — design one good marshmallow-pink icon
with a maskable variant in the manifest.

## 10. Reminders (the honest iOS story)

iOS home-screen web apps cannot schedule local notifications. Do NOT fake it
or add a push server. Instead:

- Settings contains a "Set up reminders" guide: a friendly illustrated
  walkthrough for creating iOS Reminders (morning reading, evening reading,
  three meals, water at intervals, wind-down) with **copy-to-clipboard
  buttons for each reminder's text** — that's where the hydration jokes
  live. Provide ~10 rotating hydration joke strings; the user pastes their
  favorites.
- In-app nudges do the rest: on open, the app surfaces the most relevant
  pending thing ("No reading yet today?", "Mochi's dinner too?") as one
  gentle banner, never a stack.
- Hydration jokes toggle in Settings controls in-app copy.

## 11. Backup & restore

Mandatory, because Safari can evict site data and there is no cloud.

- One-tap backup: exports a single JSON file (all tables + meal photos
  re-encoded) via the share sheet / file download.
- Restore: file picker, validates, merges by id.
- A gentle monthly in-app nudge to back up, and a calm warning in Settings
  explaining that deleting the app from the home screen without a backup
  deletes the data.

## 12. Milestones

Each milestone ends with the app deployable and working; commit per
milestone. Stop at the end of each and show what to test.

| # | Deliverable |
|---|---|
| M0 | Vite+TS+PWA scaffold, tokens.css from the design bundle, self-hosted fonts, deploys to GitHub Pages |
| M1 | Five-tab shell, theme system with all three themes |
| M2 | Dexie schema + typed data layer + backup/restore |
| M3 | Reading flow: form, conditions disclosure, second-reading timer, potato chips, severe modal |
| M4 | Events, meals (camera + downscale + journal), sleep, water |
| M5 | Home + Log timeline, marshmallow + streak |
| M6 | Trends: chart, averages card, gated insight |
| M7 | Bunny: adoption, carrots, moods, shop, scene |
| M8 | Strategy cards + link verification, doctor export, reminder setup guide |
| M9 | PWA polish: offline audit, iOS standalone quirks (safe-area insets, no rubber-band scroll on fixed elements, camera input in standalone Safari), empty states, a pass through every screen at 320px width |

## 13. QA gates before "done"

- Kill the tab, reopen: all data present. Airplane mode: app fully works.
- Add to home screen on a real iPhone: icon, splash, standalone mode, camera,
  photo storage, export, print-to-PDF all work in standalone Safari (not
  just desktop Chrome).
- The severe modal triggers at exactly >180 or >120 — write unit tests for
  `categorize()` boundaries (119/79, 120/80, 129/79, 130/80, 139/89, 140/90,
  180/120, 181/120, 180/121).
- Insight card with 9 readings in a bucket says "not enough" — test it.
- Grep the built bundle for banned words: exercise, workout, gym, cardio.
- Every strategy link returns 200.
- Lighthouse PWA installability passes.

## 14. Do not

- No exercise content (again, because it will be tempting in strategy cards).
- No guilt states on bunny or marshmallow.
- No seed/demo data in any build.
- No network calls at runtime beyond user-initiated outbound links.
- No notification permission prompts (nothing to attach them to on iOS PWA).
- No medication content of any kind.

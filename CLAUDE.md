# Workout Staging — Claude Instructions

## ⚠️ NEVER SWITCH UNITS — pmol/L IS THE ONLY FREE-T UNIT ⚠️
**The free-T / plasma curve is always in pmol/L. There is no second unit and there must
never be one.** Missing or incomplete data changes the **confidence** of a number, never
its **unit**, and never whether a curve is drawn at all.

**What triggered this rule (2026-08-02):** Claude added a "safe" fallback so that when the
model could not calibrate, the chart silently switched to plotting the drug appearance
rate in **mg/day** instead. The result was a y-axis reading 0–35 where the user expected
217+ pmol/L, with a curve that still looked exactly like a free-T curve. Henrik read it as
a broken scale, which is the only reasonable reading. **Nobody asked for that fallback —
Claude invented it while fixing something else.**

**The rules:**
- `unitLabel` for the plasma curve is the literal `'pmol/L'`. Never a ternary, never
  derived from whether calibration succeeded.
- **If bloodwork is missing, use the population average for the user's age** and label it
  clearly as an estimate/educated guess, with a prompt to add a blood test. The curve is
  still drawn, still in pmol/L. Degrade the *confidence*, never the unit.
- A user's own free-T value typed in **without a date cannot anchor the curve** — the
  anchor DAY sets the whole scale, and guessing it made a pre-cycle baseline get read as
  an accumulated mid-cycle level. Fall back to the age-based population value, which is
  unambiguously an untreated baseline and anchors at day 0.
- Never invent a fallback behaviour that was not requested. If a state cannot be handled,
  say so in the UI in the user's own terms — do not quietly render a different quantity.
- Tests assert `unitLabel` is never assigned `mg` and that a no-lab case still returns
  `pmol/L` at the population average. Keep them.

## ⚠️ UI CONSISTENCY — ALL COMPOUND TIERS MUST BE IDENTICAL ⚠️
Every compound tier (Peptides, TRT, Enhanced) must have **exactly the same UI features**. If one tier shows dose recommendations, all tiers must show dose recommendations. If one shows an info card, all must. If you add a UI element to one tier, immediately add it to all others in the same session.

**Non-negotiable parity rules:**
- Dose guidance shown in BOTH the add-compound modal AND the edit/configure view for every tier
- Unit dropdowns must include all units used by any compound in that tier (e.g. `IU/day`, `IU/week` for GH Axis)
- Info cards (mechanism, side effects) shown consistently across all compound tiers
- No tier may have a feature that another tier is silently missing

When a new compound tier feature is added, check all other tiers before closing the PR.

## ⚠️ RESEARCH SCOPE — ALWAYS THE FULL CATALOGUE ⚠️
When conducting research, building databases, or compiling reference data for these apps:
- **Never** scope research to only the features Henrik is currently using
- **Always** scope to the **complete catalogue** of features, exercises, compounds, and use cases the app supports or will support
- The database must serve all potential users and all potential use cases — not just the current user's active configuration
- This applies to: exercise databases, reference data, AI prompt design, knowledge base construction, and any other research task

## ⚠️ COMPOUND DATA LIVES IN BACKEND ONLY — NEVER IN PUBLIC REPOS ⚠️
All peptide and compound information is **commercially sensitive and proprietary**. It must **NEVER** be stored in any public repository (`peptidetracker`, `peptidetracker-staging`, `workout`, `workout-staging`).

This includes, but is not limited to:
- Peptide catalogue data (names, SKUs, mechanisms, protocols, side effects, dosing defaults)
- Enhancement compound data (concentrations, vial sizes, anabolic profiles, dosing guidance)
- Reconstitution data (vial/water volumes, concentration defaults)
- Dose guidance tiers and risk labels
- Pricelist / SKU mappings
- Any supplier-specific product data

**The only place this data may live is `claude-agent-backend`.** The frontend apps must fetch it from the backend at runtime — never hardcode it into `index.html` or any other file in a public repo.

**Current state (as of 2026-06-21):** Any such data that exists in the public repos is known technical debt. **Do not add new compound data to these files** — any new compounds or data updates must go into the backend and be served via API.

## ⚠️ RESEARCH & REFERENCE DOCS LIVE IN THE BACKEND — `docs/enhanced-bodybuilding/` ⚠️
**All peptide/enhancement/compound research, protocol, and reference documents
live in `claude-agent-backend/docs/enhanced-bodybuilding/` — the single canonical
home for this material.** Never store research/reference/protocol docs in this
public repo (or any public frontend repo); the reasoning is identical to the
compound-data rule above (commercially sensitive, proprietary).

When you research, compile, or write any cycle/dosing/compound/protocol reference
material, it goes there — not into this repo, and not left only as a chat reply.

### 📚 EVIDENCE STANDARD — MANDATORY, ZERO TOLERANCE FOR HALLUCINATION OR BRO-SCIENCE
**Every recommendation, dose, mechanism, or risk claim — in those docs, in the
app's dose guidance, or in anything Claude tells Henrik — MUST be backed by
published, peer-reviewed research or an established clinical guideline.**
- **No citation → do not state it as fact.** If it can't be sourced, leave it out
  or explicitly label it *anecdotal / low-evidence*.
- **Bro-science, forum lore, coach dogma, and confident-but-unsourced AI output
  are NOT acceptable sources.** Where popular practice contradicts the evidence,
  the evidence wins.
- **Fabricating or guessing a citation (author, journal, year, PMID) is the worst
  possible failure** — worse than omitting the claim. Verify before writing.
- Where evidence is thin, pre-clinical, or animal-only, say so in-line.

### 🔻 Primary sources CAN be downloaded — do it, never ask
Your sandbox cannot reach DailyMed, FDA, eMC, EuropePMC or PubMed (all 403 through the
agent proxy). That is **not** a reason to leave a value unsourced or to cite a web-search
summary as though you had read the document. `claude-agent-backend` has
`scripts/fetch_sources.py` + the **Fetch research sources** workflow, which runs on a
GitHub runner (full internet) and commits retrieved document text to
`claude-agent-backend/docs/enhanced-bodybuilding/sources/`. Add the source, trigger the
workflow, pull, read the file, then cite it. Henrik's standing instruction (2026-07-29):
**"Dont even ask me before downloading research to support app development."** Full
procedure and the cautionary Labetalol incident are in that repo's CLAUDE.md.

## ⚠️ NO PRICES IN THE APP — NEVER ⚠️
Supplier pricing is commercially sensitive and must **NEVER** appear in any app UI, rendered HTML, or user-facing output. If a `PRICELIST` or similar pricing structure is ever added to this app, it must contain only vial sizes and quantities — **no `usd` or price fields**.

Rules:
- **Never add a `usd`, `price`, or any cost field** to any pricelist data structure
- **Never display US$ amounts, per-unit prices, or cost totals** in any modal or UI
- Any pricelist CSV must have no price column ever

## ⚠️ HISTORY VIEWS READ AND PLOT — THEY NEVER CALCULATE ⚠️
**Any view whose job is to show *stored history* must load it from the backend and draw
it. Full stop. No re-derivation, no recomputation, no backfill, no "re-capture if the
data looks stale or empty" — not even once, not even as a convenience.**

The split is:
- **The tab that owns the model computes** — e.g. T-Calc owns the free-T PK model.
- **It persists only on an explicit user action** — a "save/update history" control the
  user presses (`tcSaveHistoryFromCurve`), storing the curve **exactly as displayed**.
  Nothing captures automatically: not on view load, not on profile save, not even when a
  past injection is logged. Stored history stays exactly as the user last saved it until
  they choose to refresh it. (Confirmed 2026-07-25: "corrected, then never touched unless
  I ask for it.")
- **The history view loads that and plots it.** If the backend has nothing, it shows an
  empty state that says where the data comes from. It does **not** helpfully generate one.

**What triggered this rule (2026-07-25):** `buildTHist()` in `tab-thist.js` backfilled
whenever the store looked empty *or* the stored tail extended past the last injection.
Opening the T-History tab therefore recomputed the entire series with whatever the client
model happened to be that build, and wrote it back **over the stored values**. Two
consequences, both bad:
- A bug anywhere in the PK model silently **rewrote saved history** — the data the user
  had was replaced by a fresh wrong answer, with no action on their part.
- The view stopped being a view. It disagreed with the source of truth it existed to show,
  and read ~10× high because it inherited a calibration-anchor bug from the live model.

**Why "just backfill once if it's empty" is still wrong:** it is indistinguishable from
the failure above. Empty *is* a valid state, and the fix for missing data is to make the
owning tab capture it, never to have the reader invent it. "Stale" heuristics are worse —
they overwrite data that was correct when it was written.

**The rule:**
- A history/read view may call `fetch` + render. Nothing else.
- If you are about to add "compute the series here so the chart isn't blank", stop — that
  is this bug.
- Regression tests assert `buildTHist` contains no capture/compute/model call. Keep them.

## ⚠️ THE STORED LOG IS THE TRUE RECORD OF WHAT HAPPENED ⚠️
Henrik, 2026-08-07 (about injections, but the principle is general): *"the injection
log must be treated as the true record of what was injected. Also it needs to be well
protected in backups."*

For any record of something the user actually did — a logged workout, a bodyweight
reading, a completed set — the **backend file is canonical**. Anything else holding
the same facts (a profile field, a cached list, a saved chart) is a derived view and
loses to it when they disagree.

- A view that shows history reads the stored record. It never reconstructs it, and it
  never narrows it from a partial source — that is how a 14-day cache window came to
  overwrite six weeks of stored history in the peptide app the same day.
- Editing history means editing the **record**, not the cache. Writing to a derived
  list alone is a silent no-op the next render undoes.
- Backups must **verify** they hold it: parse, count, and compare against the previous
  backup, never just copy. See `claude-agent-backend/CLAUDE.md` for the mechanics and
  the guard that stops a re-run overwriting a richer backup.

## ⚠️ localStorage IS A CACHE — NEVER THE SOURCE OF TRUTH ⚠️
localStorage is a read cache for performance only. It is NEVER the source of truth.

**Every single localStorage write MUST be paired with a backend push in the same code path — no exceptions.**

This means:
- `setData(key, value)` alone → WRONG
- `localStorage.setItem(key, value)` alone → WRONG  
- `setData(key, value)` + `push*ToAgent(...)` in the same call → CORRECT

A "Wipe local cache" button exists in Settings specifically to verify this: after wiping, ALL user data must come back from the backend on next load. If anything is lost after a wipe, that data was relying on localStorage as its source of truth — which is a bug.

This rule was violated multiple times (wk-db-*, wk-gear-* were localStorage-only). Any new data type must have a backend endpoint AND be included in the startup sync before it can be written to localStorage.

## ⚠️ BACKEND IS THE SOURCE OF TRUTH — EVERY SAVE MUST HIT THE BACKEND ⚠️
**Every user-facing data operation (save, update, delete) MUST be persisted to
the backend immediately — no exceptions, ever.** localStorage is only a local
cache for display. The backend is the source of truth.

Rules that are NOT negotiable:
- Every `save*()` function MUST call the corresponding `push*ToAgent()` function
- Every `delete*()` function MUST call the corresponding `delete*FromAgent()` function
- Every new data type added to the app needs BOTH a localStorage write AND a
  backend push in the same operation
- `setData(key, value)` alone is NEVER sufficient — always pair it with the backend call
- The backend data file for every endpoint MUST use the persistent volume pattern:
  `Path("/data/foo.json") if Path("/data").exists() else Path(...) / "data" / "foo.json"`
  (ephemeral container filesystem is wiped on every redeploy)

This rule applies to weights, workout logs, body comp, programs, settings —
**everything**. Violating this has caused repeated data loss incidents.

## ⚠️ NO CROSS-APP LOCALSTORAGE READS — EVER ⚠️
Each app owns its localStorage keys exclusively. **NEVER read another app's
localStorage keys** (e.g., workout must not read `proto-bodycomp-v2` which
belongs to peptidetracker; peptidetracker must not read `bf_log` which belongs
to workout). Both apps run on the same origin (`viritasorg.github.io`) and
can technically read each other's keys, but doing so is categorically forbidden.

The backend is the ONLY cross-app source of truth. If data must flow between
apps, it goes through the backend — never through shared localStorage.

## ⚠️ LOCAL CLONE RULE — NEVER SKIP ⚠️
Local clones at `/home/user/<repo>` are **NOT automatically up to date**. A
session can be hours old and the remote may have moved on. **Before reading or
copying any file from a local clone, always pull it fresh:**
```
git -C /home/user/<repo> fetch origin && git -C /home/user/<repo> checkout origin/main -- <path>
```
or `git -C /home/user/<repo> pull origin main` for the whole tree. Skipping
this step has caused production regressions multiple times. No exceptions.

## This is the repo Claude works in
`workout` (prod) is **READ-ONLY** for Claude — see its CLAUDE.md. All actual
development (features, fixes, refactors) happens here on `workout-staging`.
Claude may freely branch, commit, push, open PRs, and merge on this repo.

## ⚠️ CROSS-APP PARITY — SHARED INFRASTRUCTURE ⚠️
`peptidetracker-staging` and `workout-staging` share large swaths of
infrastructure code. **Any bug fix or change to shared infrastructure must be
applied to BOTH apps in the same session — never fix one and leave the other.**

Shared infrastructure (non-exhaustive):
- **Push to Prod** — `pushToProd()`, `pollPromoteStatus()`, `pollProdVersion()`, `renderPromoteStatus()`
- **Settings sync** — `syncSettingsFromAgent()` / `syncPepSettingsFromAgent()`, `pushSettingsToAgent()`, theme/prefs persistence
- **Update checker** — `checkForUpdate()`, `checkAppVersion()`, version banner
- **Auth flow** — Google Sign-In, token handling, `authHeaders()`
- **Backend API calls** — `AGENT_URL`, endpoint patterns, error handling
- **IS_STAGING pattern** — any environment-branching logic

When you fix or change any of the above in one app, immediately check the other
app for the same issue and fix it before closing the session.

## ⚠️ TESTS ARE MANDATORY — NO EXCEPTIONS ⚠️
- **New feature or changed feature** → add tests covering the new behaviour in `tests/test_frontend.js`
- **Bug fix** → add a regression test that would have caught the bug
- **Run `node tests/test_frontend.js` and confirm 0 failures before opening any PR**
- Never merge a PR whose CI test job is failing or pending

## ⚠️ ONLY FIX WHAT WAS ASKED — NO UNSOLICITED CHANGES ⚠️
Fix exactly what Henrik asked. **Never change anything else**, even if it looks
like an improvement. This applies especially to:
- Visual appearance: colors, gradients, opacity, fills, chart styling
- Layout or spacing
- Unrelated logic or data handling

If you notice something that could be improved while fixing a bug, mention it
in your reply — do NOT silently change it. Unsolicited "improvements" cause
confusion, break things Henrik didn't intend to change, and waste debugging
time. **One PR = one explicitly requested change.**

## ⚠️ "MY FIX MADE IT REDUNDANT" IS NOT PERMISSION TO REMOVE IT ⚠️
This is the single most common way the rule above gets bypassed — through internal reasoning rather than intent.

**The exact failure (2026-06-25, peptidetracker-staging):** A bug was fixed where T3 users didn't always get the Enhanced wizard step. Fix: auto-include `'enhanced'` in `_wiz.goals` inside `initWizard()`. Claude then reasoned: *"The Enhanced toggle in Goals is now redundant — T3 users always have it auto-included."* Claude removed the toggle without being asked. Users lost the ability to opt out of Enhanced on a per-stack basis and saw a blank section with no explanation.

**Why this reasoning is always wrong:**
- "Redundant" is the user's call, not Claude's
- A default and a toggle serve different purposes even when the default is always-on — the toggle gives the user agency to override it per-stack
- A side-effect of your fix appearing "unnecessary" is not the same as being asked to remove it
- This is still a violation of "ONLY FIX WHAT WAS ASKED," just disguised as logical cleanup

**The rule:**
- Make the fix. Stop. Do not touch anything the fix made look unnecessary.
- If your fix genuinely makes something obsolete, **say so in your reply and ask** — never remove it silently.
- You may only remove code that was **explicitly named** in the request.

## ⚠️ WORKOUT PROGRAM EXERCISE RESTRICTIONS ⚠️

### Tags are DERIVED from the prescribed reps — never set by hand (rule 2026-07-31)
Henrik: *"make tagging automatic and honor the rep ranges for strength, volume, rehab in the app.
feels backwards to set it manually."*

- `TAG_RANGES` / `tagForReps()` / `snapReps()` / `applyTagFromReps()` in `index.html` are the
  single source of truth: **strength 4–6, volume 8–12, rehab exactly 15** (canonical
  `GET /training-rules`).
- **A generated program may only prescribe a rep count some range defines** —
  `REPS_LEGAL = [4,5,6,8,9,10,11,12,15]`. Anything else snaps to the nearest legal count
  (Calf Raises 20 → 15, a 3-rep strength triple → 4) and the tag is then read off it.
- The derivation runs **at the very end of `_generateWorkoutProgram`**, after the leg-day rules,
  injury swaps and prehab injection — those re-author schemes and would otherwise slip past it.
- **The scheme string is clamped too:** its low end is the prescription and its high end is
  capped at the tag's ceiling (`3×12-15` volume → `3×12`), so the app never displays rep
  guidance that crosses out of the tag it shows. Trailing text is preserved.
- **The program editor has no tag picker.** Reps are chosen from a dropdown grouped by tag
  (Strength 4-6 / Volume 8-12 / Rehab 15) and the tag chip is read-only and derived.
- **Logged reps NEVER re-label anything** (Henrik 2026-07-31): *"if someone logs a workout with
  'wrong' reps ignore and keep label — ie one by mistake uses too light weights and has to do 18
  reps for AMRAP."* The tag belongs to the prescription. Tests assert `saveLog` writes no tag.

**This SUPERSEDES "non-rehab programs must not show a rehab tag."** That rewrite existed in both
`_generateWorkoutProgram` and `_ensurePrograms` and produced the exact violation it was meant to
prevent — it relabelled 15-rep isolation as `volume` and left the reps at 15. Both are removed:
a 15-rep Calf Raise is labelled `rehab` in any program (and gets the correct 90 s rest), and
`_ensurePrograms` no longer rewrites tags on stored programs at all — which also brings it back
in line with "never mutate stored programs".

**Also superseded:** the heavy Deadlift's scheme is now `1×6`, not `1×5-8` — a 5–8 range
straddles strength (4–6) and volume (8–12), so it is not a range any tag defines. Its sets
(`'6'`, one heavy single) are unchanged.

### Exercise placement restrictions
- **Hip Thrust — Feminine Aesthetic (`aesthetic-*`) and Knee Rehab (`rehab-knee`)
  templates ONLY (rule 2026-07-23).** It must never appear in `hypertrophy-*`,
  `strength-*`, `rehab-back`, or `rehab-shoulder` programs. Enforced programmatically
  in `_generateWorkoutProgram`: unless the goal is `aesthetic` or the key is
  `rehab-knee`, a generator guard swaps any Hip Thrust for the first hypertrophy-legal
  posterior/leg movement not already in that day (Leg Curl → Leg Extension →
  Romanian Deadlift), then de-dupes. *(Supersedes the earlier rule that allowed Hip
  Thrust in all of strength/rehab — Henrik confirmed it is Feminine-Aesthetic plus
  knee-rehab glute-activation only. Only affects newly generated programs; already-saved
  programs are never mutated.)*
- **Bulgarian Split Squat — banned from `hypertrophy-*` programs only.** Allowed in
  `aesthetic-*`, `strength-*`, and `rehab-*`.

### Volume allocation (rule rewritten 2026-07-31)
**The wizard's sets-per-muscle is a target the generator must actually hit — for every goal,
including strength.** Applies to `hypertrophy-*`, `aesthetic-*`, `strength-*` and all full-body
programs; only `rehab-*` still uses the old linear `scaleSets` path.

- **Per-session target** = weekly sets-per-muscle ÷ the number of days that muscle is trained,
  capped at 10 hard sets/muscle/session. 25-set session ceiling. Sets stay in the 2–5 range.
- **A day counts toward a muscle's frequency only if something there targets it** (split ≥ 0.5).
  Counting incidental secondary volume — an RDL putting 1.2 back sets into a leg day — split the
  weekly back target across a day with no back work and left the real pull days ~40% under.
- **Per-muscle allocation:** each muscle's session target is split across the exercises that
  *target* it (split ≥ 0.5), in proportion to `split × bias`, after subtracting the secondary
  volume the session's other lifts already supply. Every exercise has exactly one muscle it
  targets, so it gets exactly one demand. **This is why an RDL can never be inflated to cover a
  leg day's back deficit** — it is sized as the leg lift it is. Three passes let secondary
  contributions settle.
- **Free-weight compounds are weighted heavier than machines/isolation** (rule 2026-07-10):
  `isCompoundEx()` (squat/deadlift/RDL/bench/OHP/barbell row/pull-ups/dips/lunges/hip thrust;
  Smith/Hack/cable/machine variants excluded) gets a 1.5× bias vs 0.85×. The bias sets the
  *distribution* of a muscle's target, it does not multiply the total — applying it per exercise
  is what made a 12-set leg week land on 20.
- **Drop-to-fit:** when a session's floor volume (2 sets × its exercises) exceeds the target, drop
  the lowest-priority isolation work until it fits. Compounds, the heavy Deadlift and prehab
  blocks are never dropped and a session never falls below 3 exercises. Without this a 12-set
  weekly leg target was unreachable — five leg exercises cost ≥10 leg sets whatever the sets say.
- **Balance guardrail: within a session no exercise may exceed 2× the sets of the smallest
  exercise.** `BALANCE_RATIO=2`, applied **last** — both the ceiling trim and the allocation can
  otherwise open a gap. The compound bias is ~1.76×, so the guardrail preserves it in full and
  only clips rounding/floor pile-ups.
- **The heavy Deadlift finisher is a fixed prescription** (`ex.fixed`) — always present, always
  last on its leg day, keeping exactly the sets it was authored with (1×5-8) at every
  sets-per-muscle. It is exempt from allocation, the ceiling trim, the balance guardrail and the
  linear strength scaling, but its volume still counts, so everything else is sized around it.
  *(Supersedes, for this entry only, the 2026-07-10 "Squat and Deadlift are allocator-sized like
  any other exercise" rule. Every other lift, including a strength program's Squat, is
  target-sized — strength splits no longer keep fixed 5×5 / 5×3 set counts, though reps and tags
  are untouched.)*
- **Where the target cannot be met:** a muscle overshoots only when every lift for it already
  sits on the 2-set floor (e.g. 9 weekly leg sets across three leg days is impossible — 3
  exercises × 2 sets × 3 days = 18). Undershoot at high targets is capped by the 5-set maximum
  and the number of exercises the template supplies. Tests assert the 1.6× bound with the
  at-floor exemption, across every goal × 4–7 days × sets-per-muscle 9–25.

### Full-body at low frequency — ≤4 days/week (rule 2026-07-24)
When a generated program is **4 days/week or fewer**, it must be **full-body** (each session
trains legs + a push + a pull + accessories), **not** a push/pull/legs or upper/lower split.
Enforced in `_generateWorkoutProgram` via `_fullBodyPool(goal,sub)` for **hypertrophy and
strength** goals (aesthetic already runs glute-emphasis full-body; rehab stays injury-specific).
- One main lower lift per day, rotating so **no session pairs Squat with a conventional
  Deadlift** (CNS load).
- The wizard focus (Balanced / Upper / Lower Heavy) biases *emphasis*, not the split.
- Full-body programs (including strength) run through the **frequency-aware volume allocator**
  (not the linear strength-scaling path), so training every muscle 3–4×/week stays within the
  per-session ceiling.
- **5+ day programs keep their splits** (PPL / upper-lower) unchanged.

### Face Pulls — NEVER on a push/press day (rule 2026-07-24)
A Face Pull is a pulling movement and must **never** be scheduled on a push/press day — any
day containing a pressing movement (bench/incline/OHP/dips/chest-or-landmine press) — **even in
a shoulder-rehab context.** Enforced in `_generateWorkoutProgram`: Face Pulls are kept on the
press-free day with the most back work; if every day carrying them contains a press, the entry
is relocated to the best press-free day that has back work, else dropped. At most one Face Pulls
day per program. *(Supersedes the earlier behaviour that injected Face Pulls onto pressing days
for shoulder rehab.)*

### Shoulder-injury programs include active cuff work (rule 2026-07-10, revised 2026-07-24)
Rehab is active, not just avoidance. When `shoulders` is selected in the wizard Injuries
step, the generator injects a rotator-cuff block — **Cable External Rotation (2×15), tag
`rehab`** — at the end of up to 3 pressing days/week. **Face Pulls are NOT injected** (they may
never sit on a press day — see the rule above); the user still gets Face Pulls via normal
pull-day placement.
- Injected exercises carry `prehab: true`: they keep the `rehab` tag inside non-rehab
  programs (exempt from the rehab→volume normalization) and are exempt from allocator
  resizing (fixed prescription)
- `Cable External Rotation` is a first-class catalogue exercise (`EXERCISE_SPLITS`
  shoulders:1); the dedicated rehab-shoulder pool opens its shoulder days with it

### Leg day rules — ALWAYS follow (rule replaced 2026-07-10)
Every `Legs*` day is **EITHER** a Squat day **OR** a Deadlift day — never both in one
session (systemic/CNS load management). Supersedes the earlier "Squat always first AND
Deadlift always last in every leg day" rule.
- **Squat day**: Squat is the first exercise; contains NO conventional Deadlift
- **Deadlift day**: Deadlift is the last exercise (6 reps, `1×6`, tag `strength` — was
  documented as "5–8 reps"; superseded 2026-07-31, see Tags are DERIVED above); contains NO squat variants
  (matcher: `/squat/i` excluding `split`)
- Leg days alternate between the two types, starting with a Squat day
- Set counts come from the volume allocator — never hardcoded (2026-07-10). **Exception
  (2026-07-31): the heavy Deadlift finisher on a Deadlift day is a fixed prescription — see
  Volume allocation above.**
- Enforced **only on newly generated programs** (`_generateWorkoutProgram`) on days named
  `Legs*`. **`_ensurePrograms` must NOT re-enforce leg-day rules on stored programs** (rule
  2026-07-24): re-injecting/reordering Squat & Deadlift on every load silently reverted the
  user's own exercise edits (e.g. swapping Squat → Leg Press). Stored programs are the user's
  own and are left exactly as saved — consistent with "never mutate stored programs" (2026-07-15).

### NEVER edit existing (stored) programs unless Henrik explicitly asks (rule 2026-07-15)
Henrik's saved programs are his own. **Do NOT mutate existing stored programs** — no
migrations in `_ensurePrograms`, no "repair" helpers, no bulk edits — unless Henrik
asks for that specific change in that conversation turn.
- Adding/removing an exercise, changing sets/schemes, reordering, etc. on **already-saved
  programs** requires an explicit request.
- New exercises or template changes go into the **seed templates and/or the
  `_generateWorkoutProgram` generator** (which only affect newly created/generated
  programs), never into a migration that rewrites existing `_programs`.
- **What triggered this (2026-07-15):** a one-time `_ensurePrograms` migration added
  "Low-to-high Cable Fly" to every chest day of every existing program. Henrik had not
  asked for existing programs to change — he wanted the exercise in one day of the 6-day
  generator only. The migration was reverted.
- Note: once such a migration has already run on live data, removing the migration code
  does **not** undo what it added to stored programs — and undoing that is itself an edit
  to existing programs, so it also requires an explicit ask.

### Reps entry — numeric keypad only, no free-text sets string (rule 2026-07-31)
- **Every reps input uses `type="text" inputmode="numeric" pattern="[0-9]*"`** — Log Workout,
  + set, and custom exercises. A bare `<input type="number">` gets iOS's
  numbers-and-punctuation layout (what Henrik saw as "the qwerty keyboard"), not the 10-key pad;
  `inputmode` is what selects the keypad, the same way the kg fields use `inputmode="decimal"`.
  All reps values are read with `parseInt`, so a text input is safe.
- **The program editor has no free-text sets field.** `_progSetsSelects()` renders two
  dropdowns — **sets 1–6** and **reps: only the counts a tag range defines** (4-6, 8-12, 15,
  grouped by tag label, plus `max`; the 3–15 range shipped hours earlier is superseded) — and `_progSetSets()` writes
  `ex.sets` and keeps the scheme's `N×` prefix in sync. `max` is kept so bodyweight
  prescriptions (`max-max-max`) survive an edit, and any stored value the dropdowns cannot
  express (a mixed string like `10-10-12`) is offered as its own option rather than silently
  rewritten — picking a real value normalises it.
- **Both dropdowns carry an explicit `width`** (40px / 52px). A `<select>` sizes itself to its
  widest option *or optgroup label*, so "Strength 4-6" stretched the control, overflowed the
  editor row and pushed the kg field, tag chip and remove button off-screen — the program looked
  like it had lost its weights (2026-08-01). The row also has `flex-wrap:wrap` as a safety net.
  Only the sets field became two dropdowns; nothing else in that row changed.
- Picking reps IS picking the tag: `_progSetSets()` writes the derived tag and refreshes the
  read-only chip. An illegal reps/tag pair can no longer be authored by hand.

### Scan conversations for rules — extract to CLAUDE.md each session
After every session in which Henrik gives a rule, constraint, or order, extract it into this file. If any extracted rule **contradicts** something already in the codebase or this file, **point it out immediately** rather than silently applying one interpretation.

## Git workflow — ALWAYS follow this
### ⚠️ CLAUDE ALWAYS CREATES AND MERGES ITS OWN PRS — NEVER ASK HENRIK ⚠️
**Claude must NEVER ask Henrik to create a PR, merge a PR, or do anything with GitHub.**
Claude has `mcp__github__create_pull_request` and `mcp__github__merge_pull_request` tools.
Use them. Every time. No exceptions. Asking Henrik to touch GitHub is a failure.

0. **Always create new branches from the latest remote main — never from a local clone's stale HEAD:**
   ```
   git fetch origin && git checkout -b <branch-name> origin/main
   ```
   This ensures any AI (Claude, or another AI picking up when Claude hits token limits) always starts from a clean, up-to-date base and can hand off without conflicts.
1. Make changes on a feature branch
2. Before opening the PR, locally extract the `<script>` block from `index.html` and run `node --check` on it
3. `mcp__github__create_pull_request` — do this yourself immediately after pushing
4. Check CI: `pull_request_read` with `method: get_check_runs` — wait for `conclusion: success`. If still running, poll. If failed, fix and re-push. **Never merge with failing or pending checks.**
5. `mcp__github__merge_pull_request` — once CI is green, merge it yourself immediately
5. After merge the `version-bump` GitHub Action auto-increments the minor version in `version.json` and `const VERSION` in `index.html` and commits with `[skip ci]`
6. **After merging, you must confirm BOTH of these before telling the user it's live:**
   - `mcp__github__actions_list` (method: list_workflow_runs, resource_id: version-bump.yml) → confirm `conclusion: success` and read the bumped version from the commit message
   - `mcp__github__actions_list` (method: list_workflow_runs, resource_id: pages-build-deployment) → confirm the latest run has `conclusion: success` and its `head_sha` matches the bump commit SHA
   Only once pages-build-deployment is complete say "live as vX.XXX — test now". DO NOT say "live" after just the version-bump — that only commits the bump, it does not deploy. DO NOT attempt to curl or WebFetch `viritasorg.github.io` — outbound network access to that host is always blocked in this remote environment and will always fail.

## Promotion to prod — Claude must NOT trigger this
Promotion happens via **Henrik clicking "Push to Prod"** in the staging app's
Settings UI, which fires a `repository_dispatch` event that runs
`.github/workflows/promote-to-prod.yml`. That workflow diffs staging against
`workout`, opens a PR on `workout`, **and then auto-merges it once CI passes**
(step 6, "Wait for CI and merge prod PR") — so a single Push to Prod goes all
the way to a live prod deploy. It does **not** leave a PR waiting for review.

**What this means for Claude (corrected 2026-07-17):** the merge is the
workflow's own built-in behavior — Claude never hand-merges the prod PR, and
must never make any other change directly to `workout`, or **initiate** a new
promotion, without Henrik's explicit go-ahead in that specific moment. Re-running
a promotion run **Henrik already triggered** (e.g. after fixing the token) is
completing an action he authorized, not starting a new one — that is allowed;
firing a fresh `repository_dispatch`/Push to Prod yourself is not.
*(Earlier versions of this note wrongly said the workflow only opens a PR that
must never be auto-merged. The workflow has always auto-merged; the note was
out of date.)*

**PROMOTE_TOKEN secret (working as of 2026-07-17):** The promotion workflow needs
a repo secret named `PROMOTE_TOKEN` — a GitHub PAT with write access to
`ViritasOrg/workout` — under Settings → Secrets and variables → Actions. It was
briefly stale (causing `Bad credentials` on the prod checkout step); Henrik has
since refreshed it and promotion now runs green. Claude cannot create or edit repo
secrets, so if it breaks again Henrik must update it.

## ⚠️ NEVER HARDCODE PERSONAL USER DATA — GDPR / DATA ISOLATION ⚠️
Personal data belonging to a specific real user must **NEVER** be hardcoded anywhere in the codebase.

**What triggered this rule (2026-06-24):**
- Backend `protocol.py` injected Henrik's personal peptide protocol into every new user's empty stack via `_repair_empty_peptides()`.
- `tab-macros.js` (pep-staging) used `|| 92` (Henrik's body weight) as the fallback for all users who hadn't set their weight — wrong data shown to every new user.

**Rules — no exceptions:**
- Never hardcode any real user's data (body weight, doses, compounds, dates, config) as a constant, default, or fallback
- Neutral fallbacks only: `0`, `""`, `[]`, `null` — never a specific person's real value
- Never write "repair" or "migration" helpers that populate missing user data from another user's values
- Any one-time migration must be scoped to the specific target `user_id`, have a clear expiry, and be removed once confirmed complete
- Every read/write of user data must be gated by the authenticated user's identity — never cross user boundaries

**Second incident (2026-08-05) — seeded records:** four constants held one person's
real records and wrote them into **every** user's storage: `SEED_LOGS` (33 training
sessions), `SEED_WEIGHTS` (37 bodyweight readings), `BF_SEED` and `BC_SEED` (body-fat
and neck/belly measurements). The backend had the same thing: `routers/bodycomp.py`
re-inserted three readings via `_ensure_seed()` **on every module import**, i.e. every
restart — so deleting one never stuck. All removed. `tests/test_no_hardcoded_personal_data.py`
(backend) and equivalent frontend checks now fail if any of it reappears.

## ⚠️ DELETES ARE GLOBAL — SAY SO BEFORE DELETING ⚠️
Henrik, 2026-08-05: *"delete entries need an extra confirmation step explaining
that the delete is global."*

Deleting a record removes it from the **backend**, so it is gone from every device
signed into that account — not just the one in front of you — and there is no undo.
Every delete of a stored record goes through `confirmGlobalDelete(what)`, which says
exactly that. Do not write a bare `confirm('Delete this?')`, and never delete a
stored record with no prompt at all.

**What triggered it:** `deleteWeight` and `deleteBf` deleted silently, with no
confirmation of any kind. The rest used generic wording ("Delete this protocol?
This cannot be undone.") that read like a local action.

- A new delete that reaches the backend must use the helper — tests assert every
  existing one does, and that the old local-sounding prompts are gone.
- The helper lives in `index.html` and is called from the tab files, so it is
  available everywhere.

## ⚠️ AUTH WARNING — READ BEFORE TOUCHING ANY AUTH CODE ⚠️
**PIN/passcode auth has been PERMANENTLY REMOVED.** Google Sign-In is the ONLY
end-user authentication method across this entire ecosystem (peptidetracker,
peptidetracker-staging, workout, workout-staging, claude-agent-backend). The
whitelist currently contains ONLY `henrik.schaub@gmail.com`. **NEVER
reintroduce a PIN, passcode, shared-secret, or any non-Google login for end
users** — not even as a "fallback" or "legacy" path. The only other credential
in the system is `x-api-secret`, used exclusively by Claude's own backend
tooling, never by end-user-facing apps.

## Deployment
- GitHub Pages (staging URL) — deploys automatically on push to `main`
- Monitor live version: `https://viritasorg.github.io/workout-staging/version.json` — **CANNOT be fetched by Claude** (outbound network to `viritasorg.github.io` is blocked in this remote environment). Use `mcp__github__actions_list` to confirm deployments instead.

## Environment-aware code — NEVER hardcode staging/prod URLs
`index.html` is a single file that gets promoted from staging to prod verbatim.
Any URL or value that differs between environments **must** use `IS_STAGING`:

```js
const IS_STAGING = (window.location.pathname||'').startsWith('/workout-staging');
```

The `IS_STAGING` constant is declared at the top of the `<script>` block, right after `const VERSION`.
Use it to gate any staging-only UI (e.g., `if(IS_STAGING)buildDeployCard();`).


## 🔎 DEFERRED — CodeQL findings on the promoted apps (raised 2026-08-02)

Moving the repos into the **ViritasOrg** enterprise org turned on **CodeQL code
scanning by default**. Its first run on a promoted prod PR raised three **High**
findings in `workout`'s `index.html`:

| Finding | Note |
|---|---|
| Clear text storage of sensitive information (`gender`) | Likely a false positive — a profile field needed for BMR/macros, stored in the user's own localStorage. Candidate for "dismiss with reason". |
| DOM text reinterpreted as HTML | Genuine XSS-shaped pattern. Worth fixing, not dismissing. |
| DOM text reinterpreted as HTML | Same. |

**These describe code that was ALREADY live in production.** The scanner is new;
the code is not. Nothing regressed at the migration.

**Status: deferred by Henrik on 2026-08-02 — "it will need to be solved next week."**
Do not treat this as done, and do not silently dismiss the two DOM findings to
make a dashboard green.

**Why promotion is no longer blocked by them:** the `Wait for CI and merge prod PR`
gate used to fail on ANY failed/cancelled check on the prod commit, so a scanner the
repo does not control could block a deploy (as could a `pages-build-deployment`
cancelled by a visibility change). The gate now selects the **`test`** check by name.
A failing test still blocks the merge; other red checks are printed to the log
(`Note: non-blocking checks not passing: ...`) and triaged in the Security tab.
**Never widen that gate back to "any check" — and never narrow it so test failures
stop blocking.**

When picking this up: the three apps share rendering code, so the DOM findings very
likely exist in all of them, not just `workout`. Check every app, not only the one
CodeQL happened to scan first.

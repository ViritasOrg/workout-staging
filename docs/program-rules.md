# Program generation, the Log screen and training rules (moved from CLAUDE.md on 2026-11-05)

**Read this before touching `_generateWorkoutProgram`, the templates, tags and rep ranges, the volume allocator, home equipment, 1RM, sketches, the Log Workout screen, drafts, program extension, Ask AI or Polestar.** Every rule here is Henrik's, with its date and quote, and nearly every one is pinned by `tests/test_frontend.js`. A change to any of them updates this file in the same PR.

## ⚠️ WORKOUT PROGRAM EXERCISE RESTRICTIONS ⚠️

### Tags are DERIVED from the prescribed reps — never set by hand (rule 2026-07-31)
Henrik: *"make tagging automatic and honor the rep ranges for strength, volume, rehab in the app.
feels backwards to set it manually."*

- `TAG_RANGES` / `tagForReps()` / `snapReps()` / `applyTagFromReps()` in `index.html` are the
  single source of truth: **strength 2–6, volume 8–12, rehab exactly 15** (canonical
  `GET /training-rules`).
- **A generated program may only prescribe a rep count some range defines** —
  `REPS_LEGAL = [2,3,4,5,6,8,9,10,11,12,15]`. Anything else snaps to the nearest legal count
  (Calf Raises 20 → 15, a 3-rep strength triple → 4) and the tag is then read off it.
- The derivation runs **at the very end of `_generateWorkoutProgram`**, after injury swaps
  and prehab injection — those re-author schemes and would otherwise slip past it.
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
straddles strength (2–6) and volume (8–12), so it is not a range any tag defines. Its sets
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

- **Bootylicious (`aesthetic-bootylicious`, Henrik 2026-11-10)** — the third Feminine Aesthetic
  focus: *"includes legs all glutes muscles core and back. arms focus triceps shoulders no chest
  presses."* Glute max (Hip Thrust, RDL, lunges, Deadlift), glute med/min (Hip Abductor), core
  (Dead Bug, Plank, Pallof Press, Bird Dog), back, shoulders and triceps; no chest presses,
  push-ups, dips or curls. After the home/injury swaps any chest-led exercise (chest split ≥ 0.5,
  e.g. Diamond Push-ups at bodyweight) is removed. The Hip Abductor and one triceps exercise per
  upper day carry `keep:true`, which drop-to-fit never prunes.
  **1–3 days a week every day is a booty day** (Henrik, 2026-11-10: *"it needs to have booty focus
  both days at least for 1,2,3 day programs … no butt exercises will be a skipped day. Unless they
  start going 4-7days per week"*): three glute-led full-body sessions ("Booty Full Body A/B/C"),
  each opening with Hip Thrust plus the Hip Abductor, back/shoulder/triceps work after; the glute
  lifts and one back and one triceps exercise per day are `keep:true`. 4–7 days use the split.
  Volume: legs/glutes get 2× the weekly sets-per-muscle, back, shoulders and arms 0.75×. At home
  the Hip Abductor machine becomes a Single-leg Glute Bridge.

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
- **No exercise is a fixed prescription** since the leg-day rule was removed (2026-11-10): the
  Deadlift is allocator-sized like every other lift. (`ex.fixed` is still honoured by the
  allocator if an entry ever carries it.)
- **Where the target cannot be met:** a muscle overshoots only when every lift for it already
  sits on the 2-set floor (e.g. 9 weekly leg sets across three leg days is impossible — 3
  exercises × 2 sets × 3 days = 18). Undershoot at high targets is capped by the 5-set maximum
  and the number of exercises the template supplies. Tests assert the 1.6× bound with the
  at-floor exemption, across every goal × 4–7 days × sets-per-muscle 9–25.

### Training at home — the wizard's "Where do you train?" (rule 2026-10-12)
Henrik: *"need generator to be able to create programs for training at home without access to
a gym"*, then: **all three options**, **"B for reps"** (higher reps allowed for bodyweight), and
**"kettlebell and resistance bands only"** — so a home program assumes no bench, no pull-up bar
and no dumbbells.

- Three choices on wizard step 2: **Gym** (default), **Home: kettlebell + bands**, **Home:
  bodyweight**. Stored on the program as `equipment` (absent for gym).
- The generator builds the gym program, then `HOME_EQUIPMENT` swaps each exercise for its home
  equivalent — run right after the injury layer and again after prehab injection. `null` drops
  an exercise (curls with no equipment). Per-injury overrides exist because the injury layer's
  own answers are gym machines; without them a knee-safe Leg Press turns back into a squat.
- **Gym output is byte-identical to before** — verified across 1400 programs. Keep it that way:
  every home rule lives behind `equip`.
- **Bodyweight at home is AMRAP** (`max`, scheme `N×max — stop 1–2 reps short of failure`, tag
  `volume`). That is how "higher reps allowed" is honoured without touching the 12-rep ceiling:
  `tagForReps`/`snapReps` leave `max` alone. Rehab-tagged work keeps its 15s.
- A home program carries `kg:0` everywhere — "no weight set yet", filled from history.
- **Home bodyweight exercises count body weight** (Henrik, 2026-10-12: *"Use common sense, a
  inverted body weight row is maybe 35-55% of bw"*). `HOME_BW_NAMES` makes them bodyweight
  cards; their `factor` is an ESTIMATE, not a measurement: inverted rows 0.45, bodyweight squat
  0.85, sissy squat 0.8, Nordic curl and single-leg glute bridge 0.6, single-leg RDL and
  bodyweight good morning 0.5, single-leg calf raise 1.0. Shared names (Bulgarian Split Squat,
  Lunges) stay non-bodyweight — they are logged with dumbbells at the gym. Only the factor was
  added: the muscle split of each stays what it was, so program generation is unchanged.
  Pike and decline push-ups count 0.7 (raised from the push-up's 0.64, Henrik 2026-10-12).
- Every home name is a first-class catalogue exercise (both pickers + `EXERCISE_SPLITS` +
  `MUSCLE_MAP`). Band names avoid "pulldown"/"pushdown" so `isCableEx` does not give them pulley
  buttons; "Nordic Curl" has its own key so it is legs, not biceps.
- **Fixed 2026-10-12 (Henrik: "Pls fix"):** the `knees` condition matched `/\blunge\b/`, which
  never matched "Lunges", so a gym program with a knees injury kept Lunges. It is `/\blunges?\b/`
  now. The home `'Lunges'` knee overrides were written for that gap and are left in place.

### Home gym: the user's own equipment (rule 2026-10-14)
Henrik: *"let the user add what equipment they have home (and later be able to update it from the Program
views) then have the generator create programs for them like usual but with this new constraint."*

- The wizard's "Where do you train?" is **Gym / Home**. Choosing Home adds **its own screen** (`step:'equip'`)
  between step 2 and the summary (Henrik, 2026-10-14: *"the equipment list is not visible and clicking Next then skips
  the equipment choice"*): a checklist inline on step 2 sat below the fold. It lists `HOME_ITEMS` (barbell + rack,
  bench, dumbbells, kettlebell, resistance bands, pull-up bar, dip bars, cable station). The list is saved per user
  (`wkt-home-equip`, localStorage + `/user-settings`, restored by `syncSettingsFromAgent`).
- **`EX_EQUIP` says what every catalogue exercise needs** (any-of sets of items; `machine` never exists at home;
  `Kettlebell …` / `Band …` names need their item by prefix; everything else needs nothing). The generator builds its
  usual gym program, then `_homeResolve` swaps each exercise for the first entry of `HOME_PREF[name]` the ticked items
  allow (`HOME_PREF_INJURY` first when an injury applies). Every list ends in something that needs no equipment, and
  a test sweeps 11 equipment sets × goals × days × injuries asserting every exercise is doable, knee-safe and sketched.
- **The two old presets are special cases and stay byte-identical:** nothing ticked → `home-bw`, kettlebell + bands
  → `home-kb` (`_homeEquipId`). Any other set is `equipment:'home:<sorted ids>'`.
- Loaded work keeps real reps (`max` → 10); only exercises swapped to true bodyweight cards go AMRAP.
- **A home program stores how it was built** (`prog.gen` = goal, sub, nDays, setsPerMuscle, injuries). The program
  view shows its equipment with **Change equipment**; saving updates the user's list and, after a confirm that hand
  edits are replaced, rebuilds that program in the same slot. A home program from before 2026-10-14 has no `gen` and
  cannot be rebuilt; the editor says so and only saves the list. Gym programs carry neither field.

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

### Pull-ups lead every pull day (rule 2026-08-08)
Henrik: *"In no Pull program should any exercise be before Pull-ups."* A pull-up/chin-up
variant is the most demanding movement a pull session carries, so it is done fresh.

- Enforced in `_generateWorkoutProgram`: on any pull day holding a pull-up variant
  (`isPullUpEx` — Pull-ups / Weighted Pull-ups / Chin-ups; **not** Lat Pulldown or Face
  Pulls), that entry is hoisted to the first slot. Runs **after** every structural edit —
  injury swaps, prehab injection, Face Pull relocation, drop-to-fit — since
  those reorder and remove entries.
- The (since removed) seeded `6-Day Hypertrophy — Upper` Day 2 — Pull A was the trigger: it
  opened with Barbell Row.
- **The hoist can only REORDER a pull-up that exists — it cannot inject one.** A pool that
  never authored a pull-up on a pull day shipped that day led by a row and the hoist was a
  no-op. Found 2026-08-22 on `6-Day Hypertrophy — Balanced` Day 5 — Pull B (Cable Row first,
  no pull-up anywhere on the day); that seed now opens with `Weighted Pull-ups 4×6-10`
  (`strength`), like the Upper pool's Pull B. Covered by regression tests that generate the
  program at 8/10/12/16/20/25 sets per muscle, with and without a shoulders injury, and
  assert a pull-up leads every pull day.
- **Still open (2026-08-22, not fixed — raise before touching):** the same gap exists in
  `strength-hybrid` 5-day `Day 5 — Upper Pull B` and 6-day `Day 5 — Pull B` (both open with
  Deadlift, no pull-up), and in `hypertrophy-upper` 7-day `Day 7 — Light Pull`. Left alone
  because only the Balanced pool was reported — ask Henrik before editing those seeds.
- **`_isPullDay` is deliberately narrow, matched on the day NAME** — `/pull/` and not
  `/push/`, and not `/legs|lower/`:
  - a mixed `Vertical Push/Pull` day is not a pull program, and hoisting there would
    reorder someone's pressing work uninvited;
  - `Lower Pull` is a leg day, not a pull program;
  - full-body days are untouched — `Full Body B` carries Pull-ups next to a heavy
    Deadlift, and the main lower lift keeps the opening slot.
- **Newly generated programs only.** Stored programs are not migrated (rule 2026-07-15) —
  an already-saved program gets the new order when it is regenerated, or reordered by hand.

### The strength band is 2–6, and the 1RM test program (rule 2026-08-08)
Henrik: *"Add creation of 1RM measurment program reachable from Progress tab. Not for all
exercises but the ones where it is common and reasonable incl weighted pull ups."* Asked how
to resolve the clash with `REPS_LEGAL`, he chose to **add 2 and 3 globally**.

- **`TAG_RANGES.strength = [2,6]` and `REPS_LEGAL = [2,3,4,5,6,8,9,10,11,12,15]`.** This is a
  deliberate widening of a previously settled value, not drift — do not "restore" 4–6.
- **The canonical source moved with it.** `GET /training-rules` in `claude-agent-backend` now
  reports `strength: 2–6`, and `tests/test_training_rules.py` there asserts it. The frontend
  and the endpoint must always agree; changing one alone is the bug both test suites exist to
  catch.
- **Unchanged:** volume 8–12, rehab 15, rehab still the only tag permitted above 12, and 7
  still belongs to no band.
- **Side effect, accepted:** generated strength programs that authored triples (`5×3`
  Deadlift in the full-body pool) previously had them snapped to 4 and now keep the 3.

**The 1RM test program** — `_oneRmTestProgram()`, created by `createOneRmProgram()` from a
button in Progress → Exercise:
- **`ONE_RM_TESTABLE` is a WHITELIST of six lifts** — Squat, Bench Press, Deadlift, Barbell
  Row, Overhead Press, Weighted Pull-ups. Henrik: *"Not for all exercises but the ones where
  it is common and reasonable."* Never extend it to isolation or rehab movements; nobody
  takes a Face Pull or a Leg Curl to a limit single.
- Three sessions, **two lifts each**, `warmup:true`, one top set of 3 (`1×3 — work up to a
  3-rep max`). **No session pairs Squat with a conventional Deadlift** — the leg-day CNS rule
  applies most of all to limit work.
- **`kg: 0`** on every entry. Never seed loads (GDPR rule 2026-06-24); the log prefill fills
  them from the user's own history.
- It is **added as a separate program and does not become active**, is refused if one already
  exists or the 4-program cap is reached, and persists through `savePrograms()` so it reaches
  the backend rather than localStorage alone.

### 1RM is only estimated from low-rep sets — and a real test is a 2-3 rep max (rule 2026-08-08)
Henrik: *"1RM for Pull-ups (normal and weighted) differs, which obviously is impossible in
reality. Also 132kg isn't realistic imo."* Then, on how a user should actually get one:
*"if a user wants a 1RM estimate the rule is rather to go for a 2-3 rep max on a given
weight after warm up."*

- **`ONE_RM_MAX_REPS = 6`** in `index.html` is the single gate, used by **both**
  `buildSessionExStrength` (Progress → Exercise) and `buildSessionGroupStrength`
  (Progress → Strength). Only sets at or below it contribute an estimate. Do not apply it
  to one tab and not the other — that split is what #356 existed to close.
- **Why:** a rep-based formula is not credible much above ~6 reps, and an AMRAP set is the
  worst input of all. Applying Epley to `max-max-max-max` pull-ups is what produced a
  132 kg "1RM". The `Math.min(reps,10)` cap inside the Epley expression is now unreachable
  — reps above 6 never reach it — but it is left in place as part of the formula.
- **Consequence, intended:** on a hypertrophy program most sets are 8–12, so muscle groups
  and exercises can show an EMPTY Est. 1RM chart. That is the rule working. Both the
  Strength subtitles and the Exercise section heading say "sets ≤6 reps" so a blank chart
  reads as a rule and not a bug. **Do not "fix" it by widening the ceiling.**
- **Volume is never affected.** Every logged set counts toward volume in both tabs; the
  ceiling governs 1RM only.
- **A user testing a 1RM should do a 2–3 rep max on a given weight after warming up.**
  Logging is free-form, so a logged 2- or 3-rep set counts normally. **The generator can now
  prescribe it too** — `REPS_LEGAL` was widened to `[2,3,4,5,6,8,9,10,11,12,15]` and the
  strength band to 2–6 later the same day, so a 3-rep top set survives `snapReps()` instead
  of being forced up to 4. *(Corrected 2026-08-08: an earlier version of this bullet said the
  generator could not prescribe 2–3 reps. That was true when written and is no longer.)*

### One exercise, one 1RM — "Weighted X" is not a separate movement (rule 2026-08-08)
Pull-ups and Weighted Pull-ups reported two different 1RMs (119 kg and 132 kg) for the same
lift. `_exCanonName()` strips a leading `Weighted ` so the Progress → Exercise picker groups
them under one entry.
- **Only the MATCHING is canonical.** The per-set maths still reads the raw stored name, so
  a weighted set adds body weight to the plate and an unweighted one uses body weight as the
  load. Both resolve to *total system load*, which is what makes a shared series valid — do
  not "simplify" by canonicalising the name before the maths.
- Also merges Weighted Chin-ups and Weighted Dips with their base movement. **Chin-ups stay
  distinct from Pull-ups** — a different grip, not a loading variant.

### Exercise sketches — every catalogue exercise has one (rule 2026-10-12)
Henrik: *"Every exercise in the catalog needs a simple sketch showing how to perform it"*, then *"Go stick
figures"*, approved after review. A blue **?** opens `exSketchModal` (`_openExSketch`) from three places: a Log Workout
card (its current name via `_exCardName`, so a swap shows the swapped exercise), each row of the Program day view, and
each exercise in the program editor (whatever is picked right now). `exSketchModal` sits at z-index 500, above the
editor overlay (300); at the default modal z-index the sketch opened behind the editor and showed nothing.

- **`index.html` is the only copy of the sketch code**, between `// ── Exercise sketches:` and
  `// ── end exercise sketches ──`. A 3D stick-figure rig (`skPose`) posed once per position; `skPanels` projects
  it to side / front / from-above SVGs, start → finish. `tools/sketches/page.js` renders the review page from that
  block, so the page and the app cannot disagree.
- **Every name in `EX_OPTS_HTML`, and every name a generated program or template can contain, must have an
  `SK[...]` entry; no `SK` entry may name anything else** — tests assert both. Adding an exercise to the catalogue
  or to the generator means adding its sketch in the same PR. The generator's core moves (Dead Bug, Plank, Pallof
  Press, Bird Dog) are not in the picker and have sketches all the same. `Weighted X` falls back
  to `X` (`_exCanonName`): one movement, one sketch.
- Side view always; a front or overhead view only where it shows something the side view cannot.
- **Grip variations are panels on the existing exercise, never new catalogue names** (Henrik: *"Grip panels on
  existing exercises"*) — one movement, one history.
- **Grip notes are science based.** Every claim cites a study retrieved into `claude-agent-backend`
  `docs/enhanced-bodybuilding/sources/grip-width-*` (summary: doc `20-grip-width.md`). Where the studies show a
  smaller effect than the common belief, say so first — Henrik: *"rather point out differences are smaller than
  gym lore in those occasions"*. Where there is no study (barbell row), say that.
- Nested helpers inside the sketch code are written `var mk=function(` — the duplicate-function-name test reads
  every `function name(` in the script, inner ones included.

### The Log Workout screen (redesign, rule 2026-10-12)
Henrik asked for "a new holistic design sprint" of the Log screen, approved the review's plan, and answered
its questions: *"Remove rest timers. 1 yes 2 no remove the timers totally 3 yes 4 yes 5 do all at once"*.

- **No rest timers, anywhere.** The per-card ⏱, the REST TIMER button and the timer bar are gone, with their
  code. Do not bring one back as a "small helper". `restSecsForTag` stays: the session-length estimate uses it.
  The Program day view's "⏱ 60–90 s rest between sets" line went too (Henrik, 2026-11-01: "remove the timer
  from the Workout app, I nevr use it"), with `getProgramRest`.
- **Card = name, blue ?, ⋯.** Swap, the equipment toggles (½ gear, 2× cable, two dumbbells) and Remove live in
  the ⋯ menu (`exMenuModal`, z-index 500). The toggles are still the card's own gear buttons, kept in a hidden
  `.gear-slot` and clicked by the menu, so `toggleGear`/`toggleGear2`/`toggleDb` and their storage are unchanged.
  An active toggle shows as a chip on the card (`_gearChipText`).
- **One prescription line in plain words** (the program's `scheme`, `· deload` when deloading) plus the tag chip,
  in muted ink. Yellow is for Save and numbers you type; blue is help; green is a finished exercise.
- **One row per set, built only by `_setRowInner`** (prefill, "+ set" and custom exercises all call it). Three
  load modes from `_loadMode`: `kg`; `bw` shows "BW" (body weight is still in a hidden kg input, so the saved log
  is exactly what it was); `none` is reps only, for `UNLOADED_EX` (Dead Bug, Plank, Bird Dog, Pallof Press,
  Prone Y-Raise, Prone T-Raise). **The kg input is always present, hidden when not shown**: `saveLog`, drafts,
  `editLog` and propagation all read `input[data-type="kg"]` per set, and that contract must not change.
  A swap re-applies the mode (`_applyLoadMode`). No gear toggles on bodyweight or unloaded work.
- **"Last (8 Oct): 25 kg × 10, 10, 9"** under the prescription, from the newest stored log holding that exercise
  (`_lastTimeText`), skipping the log being edited. Read-only; it never writes anything.
- **An exercise is done when every set has reps** (no tick buttons: Henrik said no to set ✓). Done cards get a
  green edge and the Save bar, which stays on screen above the tabs, counts them.
- **The header and every full-screen layer clear the iOS status bar**: `viewport-fit=cover`, the header and
  overlays pad by `env(safe-area-inset-top)`, and a fixed `body::before` strip keeps scrolled content from
  showing under the clock (the app asks for a see-through `black-translucent` status bar).
- Set inputs are 16px so iOS does not zoom when one is tapped.

### Polestar climate from the Log (rule 2026-11-04)
Henrik: *"if the current outside temperature at my location is under 10deg C or over 22deg C, I want the Workout app
to ask me if i want to turn on Polestar ventilation when I enter a value in the second to last set of the days last
exercise … in settigns we need to add a Polestar card where a user can add their credentials."*

- The block between `// ── Polestar climate (Henrik, 2026-11-04) ──` and `// ── end polestar ──` in `index.html`.
  `_onLogInput` hands every set input to `_psCheck`; it fires on the reps box of the **second-to-last set of the last
  exercise card**, once it holds a number, at most once per workout (log date + day).
- The temperature is Open-Meteo's `current.temperature_2m` at the phone's location (`navigator.geolocation`); below
  `PS_COLD_C` (10) or above `PS_HOT_C` (22) it asks "Turn on Polestar climate?", and yes calls `POST /polestar/climate`
  (claude-agent-backend `routers/polestar.py`, which starts climate at 21 °C).
- The question is the **Polestar card** (`#psModal`, `_psModalHtml`), never a native confirm/alert (Henrik, 2026-11-04:
  "needs a status that shows climate is started and a message while waiting for the update"): ask → **Starting
  climate…** → **Climate is on** or **Climate did not start** with the reason.
- **The card closes at any time; a car that does not answer gets a warning triangle** (Henrik, 2026-11-11: "Pressing X here
  doesnt do anything you have to wait for the response from the car! Rather have it close and if car doesn't respond show a
  warning triangle over the car symbol"). X closes the card while the car answers; the request carries on and the header car
  turns red when it works. A refusal, or no answer within `PS_ANSWER_MS` (90 s), puts a yellow triangle on the header car
  (`_psWarn`, `_psWarnSvg`), for a start and for a stop. Tapping the car shows the reason, **Try again** and a link to
  `help.html#polestar-no-answer` (copied to prod by the Sync step). **OK** or a later answer that works removes the triangle.
- While climate runs, a **red car with a heat (orange waves) or AC (blue snowflake) symbol** sits in the header
  (`#hdr-car`, `_psCarSvg`; Henrik: "In the main app view a red car with a heating/ac symbol should be shown"). The app
  asks `GET /polestar/climate` every 3 minutes and removes it when the car is neither active nor starting, or after
  30 minutes, since Polestar runs climate for 30 minutes (Henrik, 2026-11-04); tapping it reopens the card.
- **A grey car sits in the header whenever a Polestar ID is saved** (Henrik, 2026-11-04: "keep a grey car in title if
  credentials are available in the app"; `syncPolestarCar` at start, `_psRenderCar`), and **tapping the car turns climate on
  or off** ("Clicking the car needs a turn on and off button"): grey → the card says Climate is off with **Turn on**; red →
  Climate is on with **Turn off** (`POST /polestar/climate/stop`), each with a waiting message while the car answers.
  Started from the header, heat or cool is not known until the car says, so the car is red without a symbol and asked
  every 30 s until it says heating or cooling, then every 3 minutes (Henrik, 2026-11-05: "Stage car symbol has lost the
  heating symbol?": it was asked once at 30 s, then not for 3 minutes).
- Settings → **Polestar** card (`#ps-card`): the Polestar ID email and password go to `PUT /polestar`, which checks
  them with Polestar before saving; Remove goes through `confirmGlobalDelete`. Nothing is kept in localStorage.
- **In staging and prod alike** (Henrik, 2026-11-04: "I push stage to prod, then all features must be available in
  prod!"). It shipped staging-only behind `POLESTAR_ON=IS_STAGING` and was missing after his Push to Prod; the flag is
  gone and its `WHATS_NEW` row (1.349) went in with the fix.
- **No BMW, no Tesla** (Henrik, 2026-11-04, after Polestar worked end to end: "it all works great", then "skip Tesla").
  BMW: no outside app can start climate any more; CarData is read-only and BMW closed the MyBMW backend to third parties
  on 2025-09-29 (community sources; BMW's own docs page did not render). Tesla: possible through the Fleet API (signed
  commands, a registered developer app, a key on every car, paid per command), and Henrik chose not to. Do not start either
  unless he asks again.

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
- **Incline pressing substitutes to `Incline DB Press`, not to a machine (rule 2026-08-22).**
  Henrik: *"Even the incline machine puts too much stress on the shoulder, DB incline press is
  much better."* `REHAB_CONDITIONS.shoulders.suggest` returns `Incline DB Press` for any
  incline variant; flat bench still goes to `Chest Machine Press` and overhead pressing to
  `Landmine Press`. `detect` explicitly exempts `Incline DB Press` so the safe target is never
  flagged as the aggravating movement it replaces.
  - The old target, `Incline Machine Press`, existed **nowhere else in the app** — no
    `EXERCISE_SPLITS` entry, not in `EX_OPTS_HTML` — so the substitution produced a name the
    pickers could not offer and the group charts could not classify. Any name this table
    suggests must be a first-class catalogue exercise; there is a test for it.

### A machine that does not pass on the whole plate load carries a `factor` (rule 2026-09-17)
`factor` in `EXERCISE_SPLITS` is **the share of the logged kg the lifter actually moves**. The
kg field records what is written on the machine; `factor` turns it into load. It is applied
everywhere effort is measured — group volume, per-exercise volume, the 1RM estimate and the
session calorie estimate — so it must never be applied by hand at a call site.

There are two reasons a movement needs one, and they are not interchangeable:
- **Bodyweight lifts**, where the kg field *is* a body weight but only part of it is pressed
  (`push-up` 0.64, `dip` 0.7). The load then comes from a weigh-in.
- **Mechanical advantage**, where the kg field is a plate load and the machine only delivers a
  fraction of it. These carry **`mechFactor:1`** alongside the factor, because nothing about
  them depends on a weigh-in — `sessionWork` used to read *any* factor below 1 as
  body-weight-derived, which would have made a sled session refuse to report calories on an
  account with no weigh-ins.

**`45° Leg Press` (2026-09-17)** is the first mechanical case. Henrik: *"you don't push the
actual weight but a % of it."* The sled rides a ramp, so the force along the rail is
`weight × sin45 = 0.71` of the plates — his 0.75 guess minus the rail friction nobody can
know per machine. Shipped as **its own catalogue entry**, not a factor on the shared
`leg press` key: both builds exist, the name is all the app can tell them apart by, and
scaling the shared key would have retroactively rescaled every Leg Press session already
logged. Range of motion stays the leg-press 0.45 (it is travel along the rail) so the factor
is the only difference between the two.

Consequences to keep in mind when adding the next one:
- Key it **before** the generic name in `EXERCISE_SPLITS`, or the substring lookup resolves the
  generic entry first and the factor is silently lost.
- A split key that is not a muscle share must be added to `SPLIT_META_KEYS` in
  `tests/test_frontend.js`, or the "fractions sum to 1.0" invariant fails.
- The calorie figure follows the work only inside the Compendium power band. Heavy leg pressing
  pins the MET at the vigorous ceiling either way, so a factor can change the *volume* and the
  *work* while leaving the kcal number identical. That is the estimator working as designed.

### The calorie estimate uses the recorded duration when it is believable (rule 2026-09-25)
`estimateSessionKcal` = `MET x 3.5 x kg / 200 x minutes` (ACSM), where MET is chosen between the
two Compendium anchors (3.5 light/moderate, 6.0 vigorous) by the session's mechanical power.
**The number is GROSS** — it already includes the resting burn, so it compares against an Apple
Watch's *total*, never its *active*.

**`minutes` comes from `sessionDurationMin()`, not `sessionMinutes()`.** The stamp is used when
it falls in `KCAL_DUR_MIN..KCAL_DUR_MAX` (30..240); otherwise the fitted `sessionMinutes()`
estimate takes over.

- **Why the gate, and why those numbers.** Of 206 logged sessions, 84 carry a stamp: 11 junk
  (1, 1, 1, 1, 1, 1, 2, 2, 3, 7, 7 min) and 73 real (30–176 min), with **nothing between 8 and
  29**. The floor sits in that gap. The ceiling is 240 rather than the observed 176 so a
  genuinely long session survives; past four hours a stamp is likelier a forgotten timer.
- **Do not re-drop the clock.** Ignoring it entirely (2026-08-21) was an overcorrection for one
  0:01 session that reported ~6 kcal. It made every long session wrong the other way: kcal is
  linear in minutes, so Henrik's 2026-09-25 session — 132 min by his watch, 118 recorded — was
  being estimated at 72 min and scored 440 instead of 616. The gate keeps the 0:01 bug fixed;
  the tests pin both halves using his real junk values.
- **The correction is not a uniform inflation.** Across the 73 affected sessions the after/before
  ratio runs 0.69 to 1.97, median 1.06: the fitted estimate was pulling every session toward a
  middling duration, so long ones went up and short ones came down.
- **Longer duration does not scale the answer linearly — power self-corrects.** watts =
  joules / (min x 60), so more minutes means less power and a lower MET. The 2026-09-25 session
  drops to 5.8 W on its real clock, below `KCAL_POWER_LO`, pinning MET at the 3.5 floor; that is
  why it lands at 616 and not the ~830 a naive linear scaling predicts.
- `SESSION_PACE` (1.74) is now only the **fallback** path. Leave `sessionMinutes()` alone — it is
  still what an unstamped session runs on, and a test pins that it never reads `duration_min`.

**Against a wrist tracker:** the remaining gap is the MET, not the duration. An Apple Watch
derives active energy from heart rate, which over-reports lifting (the pressor response and
breath-holding keep HR up without matching oxygen uptake). Henrik's watch implied ~6.4 MET on
that session — above the 6.0 Compendium ceiling for "power lifting or body building, vigorous
effort" that this estimator will ever use. Do not chase it by widening the band.

### Leg days: no Squat/Deadlift rule (removed 2026-11-10)
Henrik, 2026-11-10: *"find and remove the squat and deadlift rule i made for myself"*. The
2026-08-21 rule (every leg day opens with ≥3 strength sets of Squat and ends with 1-3 strength
sets of Deadlift, re-asserted after allocation, `_applyLegDayRule` / `_enforceLegDayFloor`) and
the 2026-07-10 alternation it replaced are both gone. A leg day carries exactly what its
template authors, sized by the allocator. **`_ensurePrograms` never reorders or injects
exercises in stored programs** (rule 2026-07-24). `_isLegDay` stays: the template library uses
it for "push and leg days".

### The program library and the template library (rule 2026-09-21)
Henrik: *"Add support for a library of programs. Not just the 4 as today."* Two separate
things live in the Program tab and must not be confused:

**The program library** is `_programs` — the user's own programs, capped at `MAX_PROGRAMS`
(20, a guard on the size of the blob every save pushes to the backend, not a UI limit).
`PROG_CARD_SLOTS` (4) programs show as cards; the rest render as rows underneath.

- **Order is recency, identity is the index.** `_programsByRecency()` returns *indices*, never
  a reordered array — `_activeProgramIndex`, the overlay and the log's day lookup all address
  programs by array position, so reordering `_programs` would silently repoint them. Every
  `onclick` in the card must carry the array index, not the slot position. There is a test.
- **`touchedAt` is written only on a user action** — creating, editing or activating a
  program. It is **never backfilled on load**: a program that predates the field keeps its
  array position and sorts after the stamped ones. This is the one narrow exception to "never
  mutate stored programs", and it stays narrow because nothing writes it on a read path.
- `_programLibraryHtml()` and `_templateLibraryHtml()` are **pure** — they return markup and
  touch no DOM. `buildProgramSettingsCard()` is the only thing that writes `innerHTML`. Keep
  it that way: the test harness stubs `innerHTML` as a getter that always reads `''`, so
  anything rendered straight into an element cannot be asserted at all.
- One activate control: `_progActivateToggle()` is shared by the cards and the library rows.
  Do not grow a second affordance for the same action.

**The template library** is `PROGRAM_TEMPLATES` — read-only blueprints that are never
activated, edited or logged against. Picking one deep-copies it into `_programs` and from that
moment the copy is an ordinary program.

- **Copies and templates can never reach each other.** `_templateToProgram()` deep-clones, so
  editing your copy cannot change the library and shipping a new template version cannot
  change a copy already made. Tested in both directions.
- It runs the copy through `applyTagFromReps`, the same pass generated programs get, so a
  template can never ship a prescription the rest of the app considers illegal.
- `desc`, `notes` and `id` are library metadata and deliberately do not travel onto the program.
- Duplicate copies are **named apart** (`_uniqueProgramName`), not refused.
- **Every exercise a template names must be a first-class catalogue exercise** — same rule the
  rehab substitution table lives under, same test. A template naming something the pickers
  cannot offer and the charts cannot classify is a broken prescription.

**The 1RM Test moved into the library (2026-09-21)** and its Progress-tab button still works,
now building from the template so there is one definition. The button was NOT removed: "move
it into templates" is not permission to delete the way he already reaches it.

**`Muscle-Up Power (RFD)` (2026-09-21)** — rate-of-force-development work, 2 days/week,
everything 2-4 reps at maximal intent (inside `TAG_RANGES.strength`, so the tag is still
derived from the reps). Bar-to-sternum and speed work are prescribed as `Pull-ups` and
`Weighted Pull-ups` with the intent in the `scheme`, **not** as new "Explosive"/"Speed"
exercise names — one movement, one 1RM (rule 2026-08-08), and a separate name would split the
history of the very lift the program exists to move. Its programming rules (maximal intent,
stop when speed drops >10%, 2-3 min rest, twice weekly before heavy work, the C-shape pull and
the chest-over-bar transition) live in `notes`, which the day/exercise model cannot carry.

### Extending a program with a template block (rule 2026-09-24)
Henrik: *"every day program starts with a muscle up prep program day … So PushA starts with
Muscle Up A, then Pull A gets Muscle Up B first etc."*

A template marked **`extendable:true`** can be bolted onto the front of another program's days.
Only `muscle-up-power` is extendable — the 1RM Test is a standalone program and prepending a
limit single to every day is nonsense, so that attempt is refused with a message, not silently
performed.

**Where the block lands is the template's call: `extendOn`.** The muscle-up template carries
`extendOn:'push-legs'` (Henrik, 2026-09-24: *"I'd rather only add it to push and leg days"*).
The block is explosive PULLING, so putting it on a pull day means pulling twice in one
session; on push and leg days it spreads the pull volume across the week instead of stacking
it. A 6-day push/pull/legs therefore gets it on 4 of its 6 days.

- **Days are classified by CONTENT, not by name** — `_isPushDay` mirrors `_isLegDay` exactly,
  including the 0.6 dominance bar, the full-body exclusion and the name-only tiebreak for a day
  whose exercises cannot be classified. A name test would miss "Upper Push", "Chest &
  Shoulders" and plain "Day 3", which is the same trap `_isLegDay` was rewritten to escape.
  An upper day that pairs pressing WITH rowing lands near 0.5 and is correctly not a push day:
  it already has pulling in it, which is what this filter exists to avoid.
- **Eligibility is judged on the day's OWN exercises**, with any existing template markers
  stripped first. The block is four pull movements, so a push day already carrying one stops
  looking like a push day — grading the whole day would make re-extending quietly place
  nothing. There is a test.
- **The cycle advances per PLACED block, not per host day.** Skipping the pull days of a
  push/pull/legs split must still alternate A, B, A, B across the days that do get one; a
  host-index cycle would repeat A because the eligible days share a parity. There is a test.
- `_extendPlan()` is the single walk the confirm dialog and the picker both render, so neither
  can promise a placement the splice does not make.
- **No eligible day is a thing to say, not a silent no-op**: a program of nothing but pull days
  gets an explanation of why there is nowhere to put the block.

**The exercises are spliced in for real**, not overlaid at render time: the log, the volume
charts, the 1RM charts and the editor then all see ordinary exercises and need no plumbing.
What makes them removable and visible is the marker each injected exercise carries:
`_tpl` (template id) and `_tplDay` (the day's `short` label, e.g. "Muscle Up A"). An extendable
template MUST give every day a `short` — that label is the whole explanation the user gets.

- **The extension record is derived, never trusted alone.** `_progExtension(prog)` returns
  `prog.extension` only if some exercise still carries a marker, so deleting the injected rows
  by hand in the editor cannot leave a phantom badge behind.
- **Re-extending replaces, it never stacks.** `_extendDaysWithTemplate` filters existing
  markers out before prepending, and `extendProgramWithTemplate` strips first as well.
- **Removing restores the program byte-for-byte.** Tested by comparing against the pre-extend
  days, not by counting.
- Extending or removing **keeps the in-progress workout** (superseded 2026-09-30, see "The
  in-progress workout is never deleted" below). It restores by exercise name, so logged sets
  land on the same exercises after the program changes.
- **Removing it is reachable from the program view**, in the extension banner itself — the
  banner announces the extension, so it carries the way out. `removeProgramExtension(idx)`
  takes the ARRAY index, like every other program action.
- **A render function must hand its element ONE finished string.** The Remove button shipped
  invisible in v1.238-v1.241 because its markup was appended to `html` on the line *after*
  `body.innerHTML=html` had already run: built, discarded, never in the DOM. The source-text
  tests passed the whole time, which is the real lesson — `_progViewHtml()` is now a pure
  builder so the view can be asserted as the string the user actually gets, and a test pins
  that the read-only branch contains no `html+=` at all. Applies to every render path here:
  the harness stubs `innerHTML` as a getter that always reads `''`, so markup written straight
  into an element is markup no test can see.
- The block is visible in four places, and all four are tested: the Log Workout card chip, the
  Program-tab day view (chip + a banner naming the template and the day), the program view
  (the block grouped under its own label, plus "Extended with …" at the top and a Remove
  button), and the editor (a marked row). The chip is **`#7cc4ff`**, deliberately not the
  rehab chip's `#ff9b3c` — the two must never read as the same thing.
- The chip is a `<span>` appended **after** the name's text node, because `_exCardName` reads
  only that first text node. Same contract the rehab and bodyweight chips already rely on.

**Cadence:** the muscle-up template's own notes say to run explosive pull work *twice a week*;
push+legs on a 6-day split is 4. Henrik chose the day filter over a hard cap (he asked for
"max 3 times per week" and then replaced it with "only push and leg days" in the same turn).
If a cap is ever added it belongs alongside `extendOn`, not in the template's notes.

**Leg days:** extending puts the template block first on the day.

### The in-progress workout is never deleted until its log is on the backend (rule 2026-09-30)
Henrik, at the gym after an app update wiped a session: *"I want in progress logs to be saved
in backend as well and remembered and recovered if app is updated, and never deleted until the
final Log is saved permanently."*

The draft (`wkt-draft`, mirrored to `PUT /workout-draft` on every change) is deleted in exactly
two places, both after the finished log is safely on the backend:
- `_pushSavedLog` once the upload of that log succeeded (`_clearSavedDraft(log.id)`);
- `syncWorkoutLogsFromAgent` when the backend's list already holds the saved log.

Everything else keeps it:
- **Saving on the phone only marks it** (`savedLogId`). A marked draft never restores again,
  but it is still there if the upload fails.
- **An empty page never deletes it.** Every reload rebuilds the Log page (`prefillLog` ends
  with `saveDraft()`), and before the draft is restored the page has no reps; clearing there
  was the wipe. `saveDraft` with no reps now writes nothing.
- **No same-date gate.** An unsaved workout restores whatever day it was started, onto its own
  date.
- **The Log page opens on the draft's day** (`rebuildDayGrid` prefers `_activeDraft().day`
  over the next training day), so the restore actually lands.
- **The newer copy wins** between phone and backend (`updatedAt`), so a phone that lost its
  copy — an update, a wiped cache — gets it back from the backend.
- Switching the active program or extending it no longer deletes it.
- **A draft IS the saved log with the same start time** (`_draftLog`: `d.startedAt ===
  log.started_at`, which saveLog stamps from the draft). Such a draft never restores, and the
  log sync deletes it once the backend holds that log (2026-10-01: a saved session came back
  as "in progress" on the next launch).
- **Draft requests go out one at a time, in order** (`_draftNet`). Independent requests let a
  slow autosave PUT land after the post-save DELETE and resurrect the session on the backend.

Tests pin every one of these; `clearDraft()` appearing more than its definition plus the two
calls above is a failing test, not an oversight.

### More than one session a day (rule 2026-09-30)
Henrik: *"one need to be able to train more than once a day."* A second session on the same
date is its own log.
- `saveLog` never replaces another log by date. There is no "already saved. Overwrite it?"
  prompt; changing an existing session is what History → edit (`editId`) is for.
- **Never reintroduce a "one log per date" cleanup.** The one-time `workout_dedup_v1` and
  `wk-dedup-dates-v1` startup migrations were removed: their guard was a localStorage flag, so
  they re-ran on every fresh install or wiped cache (the iOS app, a reinstalled PWA) and
  deleted same-date sessions from the phone and the backend.
- `claude-agent-backend`'s `POST /workout-logs/dedup-dates` was **removed** the same day
  (backend #306, Henrik: *"Remove that function"*); a backend test asserts it stays gone.

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
- **The one sanctioned in-app edit (rule 2026-08-22):** swapping an exercise in Log Workout
  **before any reps are entered** offers a pop-up — *"Save this swap to your program?"* —
  naming the day and both exercises. On OK, `_offerProgramSubstitution` renames that one
  entry in the active program's day and calls `savePrograms()` (localStorage + backend
  together). This does not weaken the rule: the change is the **user's** explicit answer to a
  prompt, per exercise, never a migration and never automatic. Cancel changes nothing beyond
  today's session. Only template cards offer it — a card added mid-session is not in the
  program — and only the name changes; sets, scheme and kg are left as authored.

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

### The Setup Wizard's animated tour and the "What's new" card (rule 2026-10-24)
Henrik: *"does it highlight new features as AI macro tracking or the stick man info cards?"* It
did not. The wizard's last step still described a five-tab app, and nothing told an existing
user what had shipped since they onboarded. Both are fixed; both go stale unless every feature
PR maintains them.

- **A feature a user would not find on their own gets a row in `WHATS_NEW` in the same PR.**
  A new tab, a new button on an existing screen (the blue **?** sketches), a new way to enter
  data (food by photo), a new wizard step. Not a bug fix, not a reworded label, not a change
  inside a feature the user already uses daily.
- **Key the row to the version the PR ships AS**: the bump it will get after merge, which is
  `version.json` on `main` plus one (`1.304` on main → the row says `1.305`). The runtime filter
  hides a row until the build reaches its version, so the row and the bump arrive together. A
  test fails on a row more than one bump ahead.
- **Newest first**, one title and one or two sentences in plain words, saying where the user
  taps. A test asserts the order.
- **The card shows what the account has not dismissed.** `wkt-whatsnew-seen` is per account
  (localStorage + `/user-settings`); "Got it" marks the current `VERSION`. An onboarded account
  with no seen version gets every row; `obFinish` marks a new account as seen, since the wizard
  just showed it everything. Never reset or clear the seen version to "make sure they see it".
- **The last wizard step is an animated tour, not a list** (Henrik, same day: *"the onboarding never
  shows how to create a program or how to log a workout or how to check the stick figures. I want a
  animated movie running as onboarding showing the main features incl macro tracking"*). `TOUR_SCENES`
  plays program → log → sketch → macros → tabs, each a CSS-animated mock of the phone screen built by
  `_tourSceneHtml` (simulated taps, typing, bars filling) with one caption. No video file: it is
  markup in `index.html`, so it plays offline. The sketch scene calls `skPanels` on a real catalogue
  sketch. Tap the stage to pause; a dot jumps; the last scene stays and shows the tab list.
- **The movie follows the wizard's answers** (Henrik: *"ask the onboarding questions first so a male
  user gets a Hypertrophy in the gym movie and a female a female aesthetics at home movie"*).
  `_tourProfile()` reads `_obData.gender` (step 2; the tour is step 5): female → Feminine Aesthetic at
  Home (bodyweight), Bodyweight Squat logged as BW, Bulgarian Split Squat sketch; otherwise →
  Hypertrophy in the Gym, Squat. **Day and exercise names are what `_generateWorkoutProgram` really
  writes** for that goal at 4 days / 12 sets; tests generate both programs and fail on a name the
  generator does not produce or that has no sketch. Do not invent a prettier exercise for the movie.
- **"Watch the intro again" sits at the top of Settings** (Henrik: *"in settings/More add a button on
  top to re run the intro for users who want to see it again"*). `openTour()` opens the overlay on the
  tour with the saved profile's gender and `_obTourOnly` set: no Back, no dots, Done or Skip just
  close it. Nothing is saved: the profile and the weight log are only written by a real wizard finish.
- **The App card (version, Check, Setup Wizard) is the first thing in Settings, always open; the Push to Prod card is
  second (Henrik, 2026-11-05: "move push to prod to spot 2 in Settings in both apps"), the intro button third** (Henrik, 2026-11-05: *"app version should be on top and the layout better now there is a
  weird gap between two cards"*). Settings is a flex column with a 14px gap: a card slot that renders nothing
  (`#s-deploy-card` in prod) is hidden by `#page-settings>div:empty{display:none}`, and no card adds a top margin
  of its own, or the spacing doubles.
- **A feature worth a `WHATS_NEW` row usually gets a tour scene too**, or a line in the scene it
  belongs to. Keep scenes to roughly 8 seconds and one idea each.
- **`TOUR_TABS` lists every visible tab in the tab bar** and renders as the closing scene plus the list
  under it. Adding, removing or renaming a tab means editing it in the same PR; a test reads the tab
  bar from the HTML and fails on a missing tab. Its descriptions name the features behind each tab
  (the ? on Today, text-or-photo on Macros): when a tab gains such a feature, update its line.
- **Peptide Tracker has the same three things** since 2026-10-24 (`peptidetracker-staging` #1394:
  `pep-whatsnew-seen`, `TOUR_SCENES`, `TOUR_TABS`, `openTour`). A change to the mechanism is made in
  both apps in the same session; its tour names plans from the backend-served templates, never a
  compound written into the repo.

### Log button on Plan, staging only (Henrik, 2026-11-11)
*"In stage add a log button in the plan pages so I can click it and get the program and other info from generator on clipboard."*
- **Where:** staging only (`_planLogBtnHtml`). It is listed as a tool, not a feature, in the IS_STAGING guard of `tests/test_frontend.js`.
- **Buttons:** one under the program library on Plan (the active program) and one in each program's view (that program).
- **What it copies** (`_planLogText`):
  - version and time;
  - the program;
  - the generator record (`gen`, goal, sets/muscle, injuries, muscles, noPullUps);
  - the equipment, the Gym and Home lists;
  - the profile answers the generator reads (sex, pull-up answer, pull-ups logged);
  - temporary changes;
  - each day's exercises with scheme, sets, tag, kg and muscles;
  - the weekly sets per muscle;
  - the program as JSON.

### Ask AI to change the program (rule 2026-11-03)
Henrik: *"use [the Claude key] to allow AI guided changes to training programs ... Use cheapest model still capable of this."*
- **It is a chat over the app** (Henrik, 2026-11-11: "The AI dialog to update program needs to open as an overlay, and the UI
  needs to be a traditional message chatt"):
  - The Plan card holds the temporary changes and an **Ask AI** button. It reads **Open the chat** while a conversation is going.
  - The button opens `#progAiModal`, full screen: your messages on the right, the AI's on the left, oldest first (`_paiMsgsHtml`).
  - The proposed change is the AI's last message, with **Apply** under it.
  - One message box: Enter or **Send** asks the first time, and replies with the whole conversation after that (`progAiSend`).
  - **New chat** starts over; **×** closes the chat and keeps the conversation; Apply closes it.
- Ask AI sends the request, the active program's day and exercise names, today's day and the exercise
  catalogue (`_exCatalogue`, read from `EX_OPTS_HTML`) to `POST /program-ai` in claude-agent-backend. That runs on the
  user's own food-log key; for an Anthropic key it is Claude Haiku 5.5, the cheapest current Claude model.
- **The AI returns operations, never a program**: `remove`, `replace`, `add` (on numbered days), `today` (a one-off
  session) or `cannot`. `_applyAiOps` (pure) applies them to a COPY, so everything not named keeps its weights, schemes,
  markers and order. A name outside the catalogue or a target that is not in the program blocks the whole change.
  New exercises go through `snapReps`/`applyTagFromReps`; a replaced exercise keeps its sets and gets `kg:0`.
- Nothing is saved until **Apply** on the preview; Apply on a program change is the user's explicit edit of a stored program.
- **A one-off session never changes the program.** It is `wkt-oneoff` (phone + `/user-settings`), holds for its own date,
  and after that only while an unsaved draft started on it is open (`d.oneOff`). `_planDay` serves it to Today, the Log
  prefill and `saveLog`; its save does not overwrite `template_weights_day<N>` of the day it replaced, and clears it.
- **An extra session the same day** (Henrik, 2026-11-03: *"i did pull b earlier today but want a new pull session now
  (same day) gimme a suggestion of exercises"*) is op `extra`: a one-off with `extra:true` filed under `_extraDay()`, the
  day trained last, so saving it leaves `_nextTrainingDay` where it was. The request carries `done_today` (today's logs).
- **You can reply to a suggestion, and every reply carries the whole conversation** (Henrik, 2026-11-03: *"I need to be
  able to reply to the AI suggestions, today it suggests a machine not available in my current gym, and now I am forced
  to start over"*, then *"And keep the whole conversation in the replies"*). After an answer the box becomes **Reply**
  (`progAiReply`); `_pai.hist` holds every earlier request and what was proposed for it, sent as `history`, and the card
  shows the conversation (`_paiConvoHtml`). Nothing is applied until Apply, so each answer is a whole revised set against
  the program as it is. A request that never reached the AI (offline, no key) is not a turn; Cancel and Apply start afresh.

- **A change for a limited time undoes itself** (Henrik, 2026-11-11: *"I want the AI to be able to
  change a saved program. Like for the next x weeks no presses due to my shoulder but still train chest
  and triceps"*). `/program-ai` puts `weeks` on each operation (0 = lasting) and returns the largest as
  `weeks`; the model is told to replace a ruled-out movement with a catalogue exercise for the same
  muscle without it (chest: flyes, pec deck; triceps: pushdowns, extensions). `_applyAiOps(…, weeks)`
  records how to undo each step (`replace` keeps the original exercise with its sets and weight, `remove`
  its position, `add` its name) as `temp`; Apply stores it on the program in `tempChanges` with `until`
  (today + 7×weeks). `_endTempChanges` (pure) undoes every change whose `until` has come — newest first,
  steps in reverse, skipping a step whose exercise the user has since edited away — and keeps the last
  three as `tempEnded`. It runs where the programs load (`initPrograms`, `syncProgramsFromAgent`); the Ask
  AI card shows each running change with its end date and, for 7 days, the ones that changed back. This
  is the user's own scheduled edit of their stored program, not a migration.

### Scan conversations for rules — extract to CLAUDE.md each session
After every session in which Henrik gives a rule, constraint, or order, extract it into this file. If any extracted rule **contradicts** something already in the codebase or this file, **point it out immediately** rather than silently applying one interpretation.


### Muscle planner (Henrik, 2026-11-10)
*"enable user to click and choose muscles to train after choosing goal (hypertrophy/strenght/female).
marked muscles should be shown in red."* Answers: **1 A** — only the marked muscles are trained,
unmarked ones are left out; **2 B** — individual muscles are clickable.
- The picker is optional (Henrik, 2026-11-10: *"the picker should not be a mandatory step, the
  wizard should give user a choice, automatic or pick muscles"*): after the goal the wizard asks
  **Automatic** (the ready-made focus step) or **Pick muscles** (step `mode`); Rehab skips it.
- Pick muscles (Strength, Hypertrophy, Feminine Aesthetic; not Rehab) shows the
  Peptide Tracker's body pictures (`muscles-{m,f}-{front,back}.webp`, the 20% body-fat images,
  without injection sites). Feminine Aesthetic shows the female body, otherwise the profile's sex.
  Tapping a muscle on the picture or its chip marks it red. "Use a ready-made focus instead" goes
  to the old focus step; Next is disabled until one muscle is marked.
- **Feminine Aesthetic trains glutes often** (Henrik, 2026-11-11: "it only trains glutes 1 day out of three? It need to train glutes
  much more, 1-3 days per week gets glutes every day, 4-7 2-3 days of glutes"): `_gluteDays` adds a glute-led exercise (Hip Thrust,
  Hip Abductor, or the glute bridge the equipment allows; `keep`) to days without one until 1–3 day programs have glutes every
  day and 4–7 day programs on at least two. It runs before and again after the equipment swaps. With picked muscles only when
  glutes are marked.
- **Pull-ups only for someone who can do 1–2** (Henrik, 2026-11-11: "for anyone before adding pull-ups, the generator needs
  to actually ask if the user can do 1-2 pullups at all"):
  - When the program would hold a pull-up (Pull-ups, Weighted Pull-ups, Chin-ups, Clapping Pull-ups, Muscle Up), the wizard's last step asks **Can you do 1–2 pull-ups?** (Yes / Not yet). Generate waits for the answer.
  - The answer is kept on the profile (`wkt-profile.pullups`, synced) and starts the next wizard.
  - **Not yet** passes `opts.noPullUps`: every pull-up becomes the first of Lat Pulldown, Assisted Pull-up Machine, Band Lat Pull or Underhand Inverted Row that the equipment allows. Loaded work gets 10 reps instead of max. A rebuilt program remembers the answer (`gen.noPullUps`).
  - **Pull-ups already logged with reps answer it** (Henrik, 2026-11-11: "if a user has logged pull ups in history already it should of course be added to pull days (without asking a unnecessary question)"): no question, and the pull-ups stay (`_hasLoggedPullUps`).
- **Back keeps every answer** (Henrik, 2026-11-11: "the wizard must support to back trough in reverse if you want to go back and change one thing, now you have to start over"):
  - The same goal picked again keeps the muscles, focus, days, sets, injuries and equipment; only a different goal starts the muscles and focus afresh (`_progWizGoal`).
  - Automatic puts picked muscles aside and Pick muscles brings them back (`_progWizStash`/`_progWizUnstash`).
  - A typed name is never replaced by the default (`nameTyped`, `_progWizAutoName`).
  - **The header ‹ is Back** (Henrik, 2026-11-11: "After generating a program but before saving, if I press back to change ie muscles
    chosen, I have to start over still! Fix this properly!"), via `progOverlayBack`:
    - in the wizard it goes one step back (`_progWizPrev`), and closes only from the first step;
    - on a generated program not yet saved, it drops that program and returns to the wizard's last step with every answer (`_progWizLast`, kept by Generate);
    - Save or Cancel forgets the wizard.
- **Feminine Aesthetic never gets pull-ups** (Henrik, 2026-11-11: "pull-ups isnt an exercise almost any women can do at all"):
  its lats lead with Lat Pulldown (`MUSCLE_LIB.latsF`, `_muscleLib`), as its own templates do; other goals keep Pull-ups.
- Muscles: chest, traps, front/side/rear delts, triceps, biceps, lats, upper back, quads,
  hamstrings, glutes, calves, abs (`MUSCLES`, exercises in `MUSCLE_LIB`; traps → Shrug, Upright Row).
- Shapes are traced outlines, not ovals (Henrik, 2026-11-10: *"muscle choices are oval shapes not
  following the muscles at all nor in the correct spot? and I can[t] choose traps at all"*):
  `MUSCLE_REGIONS` holds a polygon per muscle for the figure's left side, mirrored to the right
  (`_muscleShapes`; traps on the back and abs are one central shape), drawn as smooth curves
  (`_smoothPath`).
- **Upper body re-traced 2026-11-11** (Henrik: *"the muscle areas in red are too low on the body"*):
  shoulders, arms, back, lats and traps were 10–35 px low on both bodies; re-traced at 4× zoom on a
  10 px grid. A test pins each upper-body shape inside the band its muscle occupies on the picture.
- `_musclePlanPool`: Lower / Push / Pull days for the marked muscles when there are at least as
  many days as categories, otherwise full-body days; abs ride along every day. Each marked
  muscle's lead exercise per day is `keep:true`. Weekly sets-per-muscle counts once per marked
  muscle in a group; unmarked groups get 0.
- Push to Prod copies `muscles-*.webp`.

### Muscles in the exercise ? popup (Henrik, 2026-11-11)
*"under the question mark, in red list muscles trained by each exercise next to the stick figure and
show the male/female with the muscles marked in red for this specific exercise."*
- `exMuscles(name)` maps every catalogue and generated exercise to the muscles it trains (main
  muscle first) by the first matching pattern in `EX_MUSCLE_RULES`; ids are `MUSCLES`' plus
  `adductors` (listed, no area on the pictures).
- The popup shows "Trains: …" in red (#ff8080, AAA on the dark modal) right above the stick
  figures, and below them the profile's body (male/female) with those muscles red, display only.

### Per-muscle volume (Henrik, 2026-11-11)
Asked whether Bootylicious and the muscle picker give glutes the volume they need, Henrik said
*"Yes"* to: every marked muscle gets the weekly sets-per-muscle chosen, and Bootylicious glutes 2×.
- The group allocator only knows legs/back/chest/shoulders/arms, so glutes shared "legs" with quads
  (a 3-day hypertrophy plan of glutes, quads, hamstrings, calves gave glutes 3 main sets, quads 15).
- `_muscleTargets(key, muscles, spm)`: a muscle plan → each marked muscle (not abs) `spm` per week;
  Bootylicious → glutes `2×spm`, quads and hamstrings `spm`. Other programs are unchanged.
- `_applyMuscleTargets` runs after the group allocator: an exercise counts fully for its main muscle
  (`exMuscles()[0]`) and half for a supporting one; each muscle's main exercises share what the
  supporting sets leave (2–5 sets each, two passes so bench → triceps is counted).
- The 25-set session cap (`MUSCLE_SESSION_CAP`, same value as the allocator's `SESSION_CEILING`)
  trims unowned work first, then the target muscle furthest over its own target, so glutes keep
  their sets. Where every glute day is full at 25 sets, glutes stop short of 2× (e.g. 2 days at 16
  sets/muscle: 27 of 32); raising that cap is the lever.

### Male or female body: the profile decides (Henrik, 2026-11-11)
*"a female user gets the female images everywhere and a male the male pictures. Right now my wife
get male models."*
- `_muscleSex()` reads only the profile's sex (`wkt-profile.gender`, synced as `user_sex`), for every
  goal and every picture (muscle picker, exercise ? popup). Feminine Aesthetic no longer forces the
  female body.
- An unknown sex (first-run setup skipped) is never shown as male: the picture spot asks "Which body
  should the pictures show? ♀ Female / ♂ Male", and `_setProfileSex` saves the answer to the profile
  and the backend; the Profile card then shows it.

### Upper Heavy / Lower Heavy carry real weight (Henrik, 2026-11-11)
*"Hypert Upper heavy has as much legs as lower heavy, makes no sense"*: up to 4 days both foci are the
same full-body template (the focus added one exercise a day) and the allocator evened the groups out
again (legs 24% in both at 4 days). The weekly target is now weighted per focus: Upper Heavy back,
chest, shoulders, arms 1.5× and legs 0.75×; Lower Heavy legs 1.5× and the upper groups 0.75×
(`_gMul` in the allocator). At 4 days and 12 sets/muscle legs are now 16% vs 34% of weekly sets.
A test checks Upper < Balanced < Lower on leg share for 3–7 days.

### Gym and Home equipment tabs (Henrik, 2026-11-11)
> "add gym and home equipment tabs to Plan. In gym list most common machines as checked and the rest as unchecked. For home list the home equipments as unchecked unless the user chose some when creating a Home program"
>
> Asked whether the list changes the programs and whether existing Home programs are rebuilt: "1 obviously yes (how else would this work)? 2. Obviously yes 3. Yes we start like that"

- **Where they are:** Plan has the sub-tabs Plan · Gym · Home equipment (`PRIMARY_GROUPS.plan`). Each tab is two columns of tick boxes; checked items come first in a fixed order.
- **The Gym list:**
  - It is `GYM_ITEMS`. Until the user ticks anything (`wkt-gym-equip` unset), the items with `on:1` are ticked.
  - Unticked by default: hack squat, hip thrust machine, T-bar row, assisted pull-up/dip, bicep curl, tricep extension and lateral raise machines, kettlebells and bands.
- **The Home list** reads and writes the same `wkt-home-equip` the Home wizard saves. If no Home program chose anything, nothing is ticked.
- **Saving:** ticking saves the list on the device and on the backend (`/user-settings`). It also comes back in `syncSettingsFromAgent`.
- **How a gym program follows the list:**
  - A gym program is generated with `gym:<ids>`.
  - Each exercise that needs an unticked item is swapped by `_gymResolve`: `GYM_PREF` first, then `HOME_PREF`, and the first candidate the list allows wins. A `null` candidate drops the exercise.
  - `GYM_EX_EQUIP` names each machine's item. A pulldown or row also works on a cable station.
  - With the default list a program is exactly what plain `gym` gives (tested).
  - Plain `gym`, used by programs made before the list, is no constraint.
- **Rebuilding:** a program generated with an older list is rebuilt by the tab's "Rebuild N … programs" button. It asks for confirmation first, the same as the program's own equipment editor, because hand edits are replaced. Programs not generated with a list keep their exercises, and the tab says how many there are.
- **Ask AI** is sent only the exercises the active program's equipment allows (`_exCatalogueFor`).

### Home equipment weights (Henrik, 2026-11-14)
> "Home Gym equipment, if user has ie Kettlebell, give them a list to pick which sizes they have in kg 1-20kg and a free number field to add if they have other weights than 1-20. For dumbells etc give choices like adjustable sets (common 1-10kg in 625g increments) and then 10, 12.5, 15, 17.5 etc) for actual barebell weights do 1.25, 2.5, 5, 10, 15, 20, 25."

- **An overlay, never inline** (Henrik, 2026-11-14: "it looks horrible, for each section only show an overlay where you add the weights you have, then once clicked Save hide it, show a info symbol next to each heading for home equipment to open the view again"): ticking an item that has weights opens `homeWeightsModal` for it (`homeWeightsOpen`); the picks are a draft (`_hwEdit`) until **SAVE** stores them and hides it; × closes and keeps what was saved. A ticked item with weights shows an **i** button that opens it again; the tab itself shows only the item list.
- **What the overlay lists** (`HOME_WEIGHTS`): Kettlebell 1–20 kg in 1 kg steps; Dumbbells an "Adjustable set, 1–10 kg in 0.625 kg steps" box, then 10–50 kg in 2.5 kg steps; Barbell + rack: the bar, Bar 10 kg or Bar 20 kg (one of the two; Henrik, 2026-11-14: "an unticked barebell will still need a 10kg or 20kg choice"), and plates 1.25, 2.5, 5, 10, 15, 20, 25 kg.
- **The free field** in the overlay adds any other weight (0.1–200 kg, comma or point); an added weight shows ticked among the others and unticking removes it. A typo shows what to type and links `help.html#home-weight-invalid`.
- **Saving:** `wkt-home-weights` = `{item:{w:[kg…],sets:[id…]}}`, on the device and on the backend (`/user-settings`), back in `syncSettingsFromAgent`. Unticking an item hides its i button and keeps its weights.
- **Suggested loads use them** (Henrik, 2026-11-14: "1 yes, kind of the whole point is to make Home training better"): on a Home program the kg proposed on Today (`renderWorkout`), in the Log prefill (`prefillLog`) and on a swapped-in card (`_prefillKgFromHistory`) goes through `_homeSnapKg` after any deload. It snaps to the nearest weight the exercise's item can make (`_homeLoadItem`, `_homeAvailKg`), and a tie goes to the lighter one. Kettlebell uses the ticked sizes. Dumbbells use the fixed ones plus, with the adjustable set, 1 kg and every 0.625 kg up to 10 kg. Barbell is the bar picked plus any number of pairs of the ticked plates (no bar picked: 20 kg, the bar `roundBarbellKg` assumes; a bar and no plates: the bar alone). Nothing ticked for the item, a bodyweight exercise or a gym program: the load is unchanged. The logged weights stay what was typed.

### Regenerate program (Henrik, 2026-11-14)
> "can we have a regenerate program button, instead of having to delete and then recreate program to get the Home gym weights or other updates to the generation of programs?"

- The program view (`_progViewHtml`) has a **Regenerate program** block (`_progRegenBtnHtml`). `regenerateProgram` builds the program again, with no dialog first (Henrik, 2026-11-14: "I did not get a confirm question at all?"); the result overlay below is where the user saves or discards it.
- **Equipment:** a Home program uses the current Home list and every other program the current Gym list (`_progRegenSpec`).
- **Nothing is replaced before Save** (Henrik, 2026-11-14: "I want an overlay saying regeneration completed, show updates and then give user a Save or discard choice"): `regenerateProgram` opens `progRegenModal`, which lists per day the exercises added (+), removed (−) and with a new prescription (old → new) (`_progRegenDiff`, `_progRegenResultHtml`), or says the program is already up to date. **Save** (`regenSave`) puts the new program in the same slot with the same name, unless the program changed meanwhile; **Discard** (`regenDiscard`) and × keep it as it was.
- **The answers it uses** come from `gen` (goal, focus, days, sets per muscle, injuries, picked muscles, the pull-up answer).
  - A program made before `gen` was recorded is regenerated from its `goal`, its day count, the focus in its generated name ("6-Day Hypertrophy — Upper", `PROG_SUB_LABELS`) or its picked `muscles`, its `setsPerMuscle` and `injuries`. It then remembers its answers like any new program.
  - A program none of that fits (built by hand, renamed) shows no button.
- Home weights need no regenerating: loads snap to them when shown.

### No program and no load is ever seeded (Henrik, 2026-11-13)
"Wife gets my old 5-day split in her workout account? Delete that from the code base asap", then
"remove anything like that". Henrik's 5-day split (`DAYS`/`DAY_TEMPLATES`) and the
`6-Day Hypertrophy — Upper` starter, both carrying his own weights, are gone: a new account starts
with no program, deleting the last program leaves none, and every generated or added exercise
starts at `kg: 0` (`pw` ignores its load argument). Loads come only from the user's own logs.
Tests: `initPrograms seeds no program`, `no generated program carries a load`.

### Choosing an exercise is a search (Henrik, 2026-11-13)
"needs a search field on top, so you can start writing L a n (and the list resorts into only exerciese starting
with L then La then Lan", then "search for Legs or Arms should show exercises for legs or arms". Swapping an
exercise in the log, adding one to the log and picking one in the program editor all open `exPickModal`
(`_openExPicker`): a search box on top and the list below. Typing keeps only names that start with the text,
sorted; three or more letters that start a muscle group's name (Leg, Arms, Back, Chest, Shoulders) also list that
group (`_exPickFilter`). Such a search also lists exercises that train that group but sit under another heading, e.g. Shoulders lists Rear Delt Fly, Face Pulls and Rear Delt Pullback from Back (`getExGroup`; Henrik, 2026-11-16: "if I search for shoulders I dont get it in the results"). Since the same day ("search has to be less retarded than this", on "row" finding nothing) the ranking is:
the name starts with the text, a word in it does ("row" → Barbell Row), every typed word starts a word in any
order, the text is anywhere in the name, and only when none of those matched, a near miss (one typo per word, or
the letters in order) (`_exPickScore`). The selects stay in the page, since everything reads their value; a transparent button
over each opens the search (`_exPickWrap`, `_pickExFor`), and the list is that select's own options.

### Profile (Henrik, 2026-11-14)
> "change the top right corner weight button to a Profile button, and take user to a page showing all profile information incl us navy measurments etc, here show progress over time for weight, bmi, body fat etc same as in peptide tracker" · "also move progress and history in to this new profile section as sub tabs" · "also macros progress or adherence over time should live in the profile as well, but keep Macro reporting as a top level tab as today"

- **The header:** its button opens Profile (`hdr-profile`, `switchPrimary('profile')`). It no longer shows the weight.
  - **The main-screen title is TRAINING, with no name** (Henrik, 2026-11-14: "I want the main screen to say TRAINING (no name) - car symbol (if a polestar login exists) - Profile symbol with user name"). The login screen and the browser title keep the name.
  - **The button and the first sub-tab carry the user's name** (Henrik, 2026-11-14: "Change Profile to Name of user"), from the whitelist as in the title (`profileLabel`). An account with no name keeps "Profile".
  - **Title, car and button sit on one line, centred, with the car and the button the same height** (Henrik, 2026-11-14: "TRAINING - Car symbol - Profile button, needs to be aligned with eachother and sized in a balanced way to look good"). A long name shrinks the title (34 px down to 16 px, `_fitHeaderTitle`) rather than pushing the button off the screen.
  - **The Polestar car is the highlight colour while climate is off, like the Profile icon, and red while it runs** (Henrik, 2026-11-14: "the car symbol for the Polestar should be the same yellow (highlight color) as the profile symbol").
- **Navigation:** `PRIMARY_GROUPS.profile` = Profile · Progress · History. The bottom bar is Today · Plan · Log · Macros · More. Macros is unchanged.
- **The Profile page (`buildProfilePage`), top to bottom:**
  - **Your profile** (`_pfInfoHtml`): sex, age, height, latest weight, BMI, latest body fat and lean mass. **Log weight** opens the same weight modal the header did.
  - **Edit profile edits in place** (Henrik, 2026-11-14: "Edit profile should not open the onboarding but just make all fields in Profile view editable, the Edit button becomes a Save button, and Log weight a Cancel button"):
    - `pfEditStart` turns sex (Male/Female), age, height, weight and body fat into inputs, with the current values. BMI and lean mass follow.
    - Edit profile becomes **Save** (`pfEditSave`) and Log weight becomes **Cancel** (`pfEditCancel`).
    - Save puts sex, age and height in `wkt-profile` and on `/user-settings`, as the wizard does. A changed weight or body fat is logged for today, as Log weight and LOG BF% do.
    - An impossible value saves nothing and links `help.html#profile-invalid`.
  - **Log body fat, every kind of entry** (Henrik, 2026-11-14: "BF needs to allow, all kinds of entries ie new measurements or a value"):
    - `_pfNavyHtml` and `pfLogBf` offer Tape (US Navy), Caliper (Jackson-Pollock 3- or 7-site, Durnin-Womersley 4-site; `caliperSites` and `caliperBF`, the same equations as Peptide Tracker's `tab-body.js`, tested against its results), DEXA scan, AI photo and Value.
    - Each entry keeps its `method` (`navy`, `jp3`, `jp7`, `dw4`, `dexa`, `ai`), and a caliper entry also keeps its `skinfolds`. A plain value is `{date, bf}`, as LOG BF% stores it.
    - Every method holds the result to 3–60 %. Caliper needs the profile age.
    - The tape method works as below.
  - **US Navy measurement**: neck and waist, plus hips for women, with the profile height through `navyBF`, the one Hodgdon-Beckett implementation the wizard also uses.
    - It logs today's body fat to `bf_log` and `POST /bodycomp` with `neck`, `belly` and `method:'navy'`. That data is shared with Peptide Tracker, and the sync keeps those fields.
    - A wrong entry logs nothing and links `help.html#navy-invalid`.
  - **The body charts, moved from Progress → Overview:** weight and its history, body fat % and its history, BMI, lean body mass.
  - **Macro adherence** (`_pfMacroHtml`, `_pfDrawMacroChart`): each logged day's kcal, protein, carbs and fat as % of that day's goals (`GET /food-log/stats` `series`), with the 100 % line and each macro's average.

### Bodyweight level (Henrik, 2026-11-16)
> "there was a Home gym quad exercise that is impossible to pull off for a non elite athlete. We need some kind of beginers/intermideate/elite or something levels for Home body weight exercises"

His staging Home program had Sissy Squat and Nordic Curl on the legs days and Archer Push-ups on both push days.

- **Where it is chosen:** "Your bodyweight level" (Beginner / Intermediate / Advanced, `HOME_LEVELS`, `_homeLevelHtml`) is on the Home equipment tab and on the wizard's home equipment step. It is saved per user as `wkt-home-level` on the device and on `/user-settings`, and synced back. With nothing chosen it is Intermediate (`_homeLevel`).
- **How it changes a Home program:** after the home swaps, each hard bodyweight movement becomes the easier one of its family (`BW_LEVEL_SUBS`), and duplicates in a day are dropped.
  - **Intermediate:** Sissy Squat → Bulgarian Split Squat, Nordic Curl → Single-leg RDL, Archer Push-ups → Wide Push-ups.
  - **Beginner:** also Bulgarian Split Squat → Bodyweight Squat, Single-leg RDL → Bodyweight Good Morning, and the push-up variants (decline, diamond, pike, wide, archer) → Push-ups.
  - **Advanced:** exactly what the generator always built. A program generated without a level counts as Advanced, so nothing changes by itself.
- **Remembering and rebuilding:** a Home program remembers its level (`gen.bwLevel`). The Home equipment tab offers to rebuild Home programs built at another level. The tab's rebuild, the program's equipment editor, Regenerate program and the wizard all build at the chosen level.
- **Gym programs** ignore the level.
- Swapped-in exercises have sketches and need only what is ticked (tested across equipment sets × goals × days × injuries).

### Rear Delt Pullback (Henrik, 2026-11-16)
> An EZ-bar rear-delt exercise: "you pull behind your self with straight arms to target rear delts" · "Add it with a stickman sketch as well as muscle dude images"

- **In the catalogue:** Rear Delt Pullback is in the exercise picker next to Rear Delt Cable Fly (Back group) and needs a barbell (`EX_EQUIP`; an EZ bar counts, as for EZ Bar Curl).
- **Sketch:** a side view, `SK['Rear Delt Pullback']`. The knees are bent and the torso hinged forward 62°, with the bar starting behind the knees, never in front of the legs (Henrik, 2026-11-16: "you cant pull the bar through your legs, starting position is bar behind knees, so you need to bend them a bit more"). The straight arms then sweep the bar back and up past the hips.
- **Muscles and volume:** the name matches the existing rear-delt rules. The ? card and the muscle pictures mark rear delts and upper back, and it counts as shoulder volume (`{shoulders:1}`).
- **Programs:** no generated program picks it. It is there to choose by hand.

### Editing a History session (Henrik, 2026-11-16)
- **No ghost exercises:** "When i edit a session in History, the exercises I removed during the sessions is suddenly back and I get asked if i want to save without filling in info for these exercises". `editLog` takes off the form every program exercise the session did not log (`_editLoggedEx`, `_editDropsUnlogged`). A log with no exercises at all keeps the program's cards.
- **No Polestar question while editing:** "When I go to History and then Edit-Add exercise and fill it in, i get asked in the second to last set if I want to preheat the Polestar, this should not happen during edit of history sessions". `_psIsTrigger` is false while `log-edit-id` holds a session.

### Polestar question: once the reps are typed, location asked once (Henrik, 2026-11-16)
> "The app should ask for location permission once and then only ask if I want to turn on car heating or AC depending on outside temp. Also when I start editing the field ie suppose to write 10 or 12 reps, I write 1 and then gets asked, it should wait until i added the full number of reps and then ask"

- **When it asks:** the check runs on `change` (`_onLogChange`, when the reps box is left or Done is tapped), not on every keystroke.
- **Location:** the first location is kept on the account as user setting `wkt-ps-pos`, rounded to ~100 m (`_psSavePos`, `_psSavedPos`), and used from then on. The phone is not asked again, and while permission is already granted the position is refreshed in the background with no prompt.
- **Storage:** nothing goes in localStorage; the backend is the record.


## Fun program names (2026-11-17)
Henrik: "Change so Name is a separate generated name, make it fun, different names for different goals, so if a user doesnt manually edit the name field it is set to something with humor. Bootalicious gets a "Beyonce Ass", 3-Day Bootalicious name ... A Hyperthropy 6-day is "Arnolds heir"" and "random, so a user can never get the same name for exact the same prgoram ever".
- `progFunName(goal, sub, nDays, seed, taken)` builds `"<fun name>", <N>-Day <plain label>` from `PROG_FUN_NAMES` (one pool per goal-focus; 6–7 day balanced Hypertrophy has its own `-6` pool; muscle-picked programs use the goal pool).
- The start in the pool is random (`_progWiz.funSeed`, set once per wizard run so the name does not change while the wizard is open); a name any existing program carries is skipped; when the whole pool is taken a sequel tag (Reloaded, Strikes Back, …, then a number) is added, never a repeat.
- A name the user types (`nameTyped`) always wins. Old programs without `gen` are still parsed by `_progRegenSpec` from their plain names.
- Saved programs whose name is still an old standard one (`_progIsStandardName`: "4-Day Hypertrophy — Balanced", "5-Day Strength", "Strength Program", …) are renamed once on load by `_funRenameStandardNames` in `_ensurePrograms` (Henrik, 2026-11-17: "also update existing users saved programs if they have the standard name still"); the focus read from the old name is stored as `sub` first so Regenerate and the details line keep it; exercises are never touched; a chosen name is never renamed.

## Program cards in Plan (2026-11-17)
Henrik: "add the details in a smaller text under the NAme so one can read the goal and setup of the program easier. Programs in Plan can be cards in a single column, instead of the 2x2 table today to give more space. Also remove the max 4 programs limit at the same time."
- `_programLibraryHtml` renders every program as a card in one column, newest first (`_programsByRecency`), with `+ New program` underneath; no four-slot grid, no "More programs" list.
- Under the name, `progDetails(p)`: goal and focus, days a week, sets per muscle, Picked muscles, Gym or Home (15px, full-contrast text; the name is 17px bold and wraps).
- No cap on the number of programs (`MAX_PROGRAMS` is gone). The generator stores `sub` on every program it builds.

## Program name on Today (2026-11-17)
Henrik: "add program Name to Today page for the active program as well!" — `#today-program` above the day grid holds `_todayProgramHtml(getActiveProgram())` (the card's name and `progDetails` line), filled by `rebuildDayGrid` so it follows every activation; tapping it opens the program.

## "I'm in a hurry" in the Log (Henrik, 2026-11-18)
Henrik: "Workout app needs a "I am in a hurry" button in the Log view for the times when you dont have time for the full program, when pressed let the user use a slider to choose a % between 50-100% of the full days exercises, also if the day been logged before show average time for the specific day to help guide the user."
- `#log-hurry` sits between the day/date row and the exercise cards. Closed it is one button, "I'm in a hurry"; pressed it opens a panel with a 50–100% slider (steps of 5), "60% · 3 of 5 exercises", the names left out, and "Back to the full day" (which closes it and returns to 100%).
- **What the share cuts:** the day's program exercises in program order; the first `_hurryKeep(total, pct)` stay (rounded up, never fewer than one) and the last ones are taken off the form. Off means hidden (`data-hurry-off`), never removed: sliding back up brings them back. A card that already has reps is never taken off, and an exercise the user added is never touched (`_hurryPlan`).
- A card taken off is not counted by the Save bar, not named by the "no reps filled in" or "Are you done?" questions, and the Polestar question moves to the last exercise still on the form. The saved log is exactly what a session with those exercises left blank always was.
- **Average time:** `_dayAvgTime(logs, day)` is the mean `duration_min` of that day number's believable sessions (`_validSessionMin`), shown only when there is one: "Day 1 takes 1 h 10 min on average in full (3 sessions logged)." A session saved under 100% carries `hurry_pct` on its log (backend `WorkoutLog.hurry_pct`) and is left out, so the figure stays the time of the full day.
- The share is kept in the draft (`d.hurry`) and comes back with it; a fresh form starts at the full day. No button while a History session is edited, nor for a day with one exercise.

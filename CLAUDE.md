# Workout Staging — Claude Instructions

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

## ⚠️ NO PRICES IN THE APP — NEVER ⚠️
Supplier pricing is commercially sensitive and must **NEVER** appear in any app UI, rendered HTML, or user-facing output. If a `PRICELIST` or similar pricing structure is ever added to this app, it must contain only vial sizes and quantities — **no `usd` or price fields**.

Rules:
- **Never add a `usd`, `price`, or any cost field** to any pricelist data structure
- **Never display US$ amounts, per-unit prices, or cost totals** in any modal or UI
- Any pricelist CSV must have no price column ever

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
to workout). Both apps run on the same origin (`henrikschaub.github.io`) and
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

### Exercises banned from Hypertrophy programs
**Never include these in any `hypertrophy-*` program.** They are allowed in `aesthetic-*`, `strength-*`, and `rehab-*`:
- **Hip Thrust** — Hypertrophy programs only; fine in aesthetic, strength, and rehab
- **Bulgarian Split Squat** — same restriction as Hip Thrust

### Volume allocation (hypertrophy/aesthetic program generation)
- Weekly sets-per-muscle target ÷ days training that muscle = per-session target, capped at 10 hard sets/muscle/session; 25-set session ceiling
- **Free-weight compounds are weighted heavier than machines/isolation** (rule 2026-07-10): `isCompoundEx()` (squat/deadlift/RDL/bench/OHP/barbell row/pull-ups/dips/lunges/hip thrust; Smith/Hack/cable/machine variants excluded) gets a 1.5× bias vs 0.85×, and the session-ceiling trim takes sets from non-compounds first
- Squat and Deadlift are allocator-sized like any other exercise — no hardcoded set counts

### Shoulder-injury programs include active cuff work (rule 2026-07-10)
Rehab is active, not just avoidance. When `shoulders` is selected in the wizard Injuries
step, the generator injects a rotator-cuff/scapular block — **Cable External Rotation
(2×15) + Face Pulls (3×15), tag `rehab`** — at the end of up to 3 pressing days/week.
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
- **Deadlift day**: Deadlift is the last exercise (5–8 reps); contains NO squat variants
  (matcher: `/squat/i` excluding `split`)
- Leg days alternate between the two types, starting with a Squat day
- Set counts come from the volume allocator — never hardcoded (2026-07-10)
- Enforced programmatically for generated programs (`_generateWorkoutProgram`) and stored
  hypertrophy programs (`_ensurePrograms`) on days named `Legs*`

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
   Only once pages-build-deployment is complete say "live as vX.XXX — test now". DO NOT say "live" after just the version-bump — that only commits the bump, it does not deploy. DO NOT attempt to curl or WebFetch `henrikschaub.github.io` — outbound network access to that host is always blocked in this remote environment and will always fail.

## Promotion to prod — Claude must NOT do this directly
Promotion happens via **Henrik clicking "Push to Prod"** in the staging app's
Settings UI, which fires a `repository_dispatch` event that runs
`.github/workflows/promote-to-prod.yml`. That workflow diffs staging against
`workout` and opens a PR there. Claude must **never** merge that PR, or make
any other change directly to `workout`, without Henrik's explicit go-ahead in
that specific moment.

**PROMOTE_TOKEN secret required:** The promotion workflow needs a repo secret
named `PROMOTE_TOKEN` — a GitHub PAT with write access to `henrikschaub/workout`.
Add it under Settings → Secrets and variables → Actions on this repo.
Claude cannot create or edit repo secrets.

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
- Monitor live version: `https://henrikschaub.github.io/workout-staging/version.json` — **CANNOT be fetched by Claude** (outbound network to `henrikschaub.github.io` is blocked in this remote environment). Use `mcp__github__actions_list` to confirm deployments instead.

## Environment-aware code — NEVER hardcode staging/prod URLs
`index.html` is a single file that gets promoted from staging to prod verbatim.
Any URL or value that differs between environments **must** use `IS_STAGING`:

```js
const IS_STAGING = (window.location.pathname||'').startsWith('/workout-staging');
```

The `IS_STAGING` constant is declared at the top of the `<script>` block, right after `const VERSION`.
Use it to gate any staging-only UI (e.g., `if(IS_STAGING)buildDeployCard();`).

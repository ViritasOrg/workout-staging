# Workout Staging — Claude Instructions

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

## ⚠️ WORKOUT PROGRAM EXERCISE RESTRICTIONS ⚠️

### Female-only exercises — NEVER use in any other program type
These exercises are **exclusively** for `aesthetic-fullbody` and `aesthetic-upperlower` programs (Female Aesthetics). **Never include them in any other goal/sub combination** (strength, hypertrophy, rehab, or any other split):
- **Hip Thrust** — female aesthetics only (exception: `rehab-hip` and `rehab-knee` programs, where it has a clinical glute-activation rationale)
- **Bulgarian Split Squat** — female aesthetics only, no exceptions

### Leg day exercise ordering rules — ALWAYS follow
1. **Squat ALWAYS comes first** in every leg day, no exceptions
2. **Deadlift (conventional), when included in a leg day:**
   - ONE heavy set only
   - 5–8 reps target
   - ALWAYS the last exercise of the day

### Scan conversations for rules — extract to CLAUDE.md
After every session in which Henrik gives a rule, constraint, or order, extract it into this file before closing the session. If any extracted rule **contradicts** something already in the codebase or another rule here, **point it out immediately** rather than silently applying one over the other.

## Git workflow — ALWAYS follow this
1. Make changes on a feature branch
2. Before opening the PR, locally extract the `<script>` block from `index.html` and run `node --check` on it
3. Create a PR, then **check its CI status before merging** — call `pull_request_read` with `method: get_check_runs` (or `get_status`) and confirm `conclusion`/`state` is `success`. **Never merge a PR with a failing or pending check.**
4. Once CI is green, merge it yourself — never stop and ask the user to merge, never push directly to main
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

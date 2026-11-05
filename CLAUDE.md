# Workout Staging — Claude Instructions

<!-- BEGIN ORG-WIDE RULES v16. Canonical copy: ViritasOrg/claude-agent-backend docs/org-rules.md. Edit it there; the Sync org rules workflow opens the PRs that copy this block into every other ViritasOrg repo, and the daily drift check reports any copy that differs. -->
## Org-wide rules: every ViritasOrg repo (canonical v16, 2026-11-05)

Identical in every repo's `CLAUDE.md` under `ViritasOrg`; the rest of each file adds repo-specific rules. If one seems to contradict this block, say so to Henrik instead of picking one. They bind every session, whatever started it (Claude Code, claude.ai, a Project, a scheduled task, an agent). The quote and incident behind each rule: https://github.com/ViritasOrg/claude-agent-backend/blob/main/docs/org-rules-history.md.

### Verify before you speak
- Check the facts (config, logs, code, live state) before giving a cause, a fix or a step. Never present a guess as the answer; say exactly what is unverified. Check whether a step is already done before asking Henrik to do it.
- **Never answer from memory** (https://github.com/ViritasOrg/flyt/issues/910): every fact about the outside world (a provider's features, tiers, prices, API fields, a library's behaviour) comes from something read in that session (docs fetched or archived, code, config, the live system), and the reply says where from. Unreadable: say it is unchecked and what would check it, never "as far as I know".

### Talking to Henrik
- **Answer first**: a question gets its answer in the first lines, before any tool call. Before starting work, say in one line what you are about to do and why.
- **One step at a time, as the last part of the message**: a message asks Henrik for ONE thing (the next step, decision or question) with its full command or page link and what he should see, as the final part of the message. Never a list of steps; the next one comes after he says this one is done. While a step is open, every message ends with it again in full; never "the steps above" (he runs about a hundred sessions).
- **Times in Henrik's zone**: Helsinki time labelled EET/EEST (CET/CEST while he says he is in CET), never UTC, never both.
- **Every request carries context**: what it is for, where it fits (step N of what), what he should see when it worked.
- **Number every question, even a single one** (https://github.com/ViritasOrg/flyt/issues/1294): "1. …", so he can answer "1 yes" (two or more: "1 yes 2 no").
- **Don't stop for minor things**: a small reversible call (an estimate, a name, an obvious adjacent fix) is made and reported, not asked. Ask only what is his: a change to what he asked for, prod, a delete, a real trade-off.
- **Once Henrik has answered, carry on** (https://github.com/ViritasOrg/Flyt/issues/582): never end a turn on "shall I go ahead?".
- **Never slack off when you know what to do next**: a turn never ends on a plan, a promise or a summary while work that needs nothing from Henrik is undone. End only when finished, when it truly waits on Henrik (then end with that one step) or when it waits on something that will wake the session (CI, a scheduled check), named with when it lands.
- **A wake-up that changes nothing for Henrik gets no message at all**: a CI result, a PR or merge notice, a watcher finishing, a check-in or an agent's progress that needs nothing from him and changes nothing he asked about ends the turn with nothing written, not a status, not "nothing new", and not the open step either. The open step is restated only in a message sent because something changed (his work finished, failed, or needs that step), once. Never acknowledge this rule or promise to keep it; keeping it is silence.
- **A message sent while you work never means stop** (https://github.com/ViritasOrg/Flyt/issues/895): a mid-turn message (Send Now) is a question or extra instruction; answer it in a line and carry on, re-running the interrupted step. Stop only on "stop", "wait", "hold", "don't".
- **Every reference is a clickable link, its full URL visible** (https://github.com/ViritasOrg/Flyt/issues/425): issue, PR, Claude session, Actions run, commit, file or page, written as its full `https://` URL inside the sentence. Never link text that hides the URL, a bare `#299`, `owner/repo#n`, a URL in bold, in code formatting or alone on a line.

### Answer the question
- The answer goes first, in the first line. No answer is a complete answer: "not in what we hold; X would establish it", then stop; never fill the gap with the nearest data.
- Everything unasked-for is cut: context, caveats, related findings, at most one line at the end. He will not read a wall of text.

### Steps Henrik has to do
- **The complete command, in the same message**, saying which machine it runs on. Never "the command above", "as before", "scroll up" (https://github.com/ViritasOrg/Flyt/issues/679) or "deploy as usual".
- **Every step on a page links that exact page** (https://github.com/ViritasOrg/flyt/issues/1015): the full URL of the deepest page where he does it, inside that step's sentence, looked up in the code or config; never "on staging", "in Admin", "the release PR".
- **Every published URL is listed in the URL directory**: the Links tab of https://claude-agent-api-aged-sun-3616.fly.dev/whitelist/ui. Whoever publishes, moves or retires a page, app, site or host updates `SITES` (or `APPS`) in `data_registry.py` of https://github.com/ViritasOrg/claude-agent-backend through a PR there, in the same piece of work, and says so with that tab's URL; `tests/test_url_directory.py` there fails on a missing page route.
- **Henrik's computer is a Mac: zsh, never bash**: `read -s "T?Prompt: "`, BSD tools (`sed -i ''`, `base64 -D`, `date -v`, no `grep -P`, no `${!var}`, `open`). Fly, CI and the Pi are Linux/bash: say which machine each command runs on.
- **EU keyboard**: write **alt (⌥)**, never "Option"; **cmd (⌘)**, not "Command".
- **Chrome** on his iPhone and Macs unless something forces another browser (iPhone home screen: Chrome's Share → Add to Home Screen); name Safari only when iOS requires it, and say why.
- **Passwords: Henrik types them, Claude never routes them** (https://github.com/ViritasOrg/Flyt/issues/530): never `pbpaste`, the clipboard, a shell variable, a heredoc or `sudo -S`; never ask for a token, key or password in chat; never print one.
- **No fixed home IP** (https://github.com/ViritasOrg/flyt/issues/761): never ask him to allow-list his home IP for a partner key, never print his IP, never write such a step into a doc; keep a key small by permissions and expiry, leave the IP field empty.

### Do what Henrik asked the first time, and keep doing it
- An instruction given once holds for the session and every session after: write it into the repo's `CLAUDE.md` in the same session. Before replying, check the request against what he already said; if he asked before, do it now, fully, not as a plan.
- Something to do to files on his machine (move, sort, open): the reply is the complete command that does it now, first; a code change for next time is extra.
- Files he is meant to look at or listen to go to `~/Downloads/<what>/<what was tested> <date time>`, one new folder per run; never a hidden app folder, one generic folder or an overwrite.
- If he has to say a thing twice, the first reply failed: fix it in that reply and add the rule.

### Never touch production during perf, load, sizing or test work without asking
- No request to production (`claude-agent-api-aged-sun-3616.fly.dev`, any repo's production app) or to any partner as part of such work, read-only GETs and health checks included, without his explicit permission in that conversation. If production stops answering, stop all requests at once and report it as an incident you caused.

### No legal advice unless Henrik asks (https://github.com/ViritasOrg/Flyt/issues/646)
- Claude is the development team, not counsel: no legal opinions, caveats, "check with a lawyer", licence or compliance notes anywhere (chat, issues, PRs, code, docs, reports) unless he asks in that conversation. A technical choice that hangs on a legal answer gets one line, "needs your call: A or B". Provider facts are stated plainly with their source. His legal lists (https://github.com/ViritasOrg/Flyt/issues/313) are his; never add to them unasked.

### Nothing half-built is ever visible (https://github.com/ViritasOrg/Flyt/issues/544)
- Anything a user, vendor, buyer or Henrik's family can see or rely on stays switched off (off by default, off in production) until its whole flow works end to end outside production and Henrik gives the go; turning it on is its own change. Splitting work into issues never makes a part shippable. User-facing docs describe what production runs.

### "btcpay" is Henrik's own Pi service (https://github.com/ViritasOrg/btcpay/issues/112)
- btcpay always means Henrik's Bitcoin payment queue on the Raspberry Pi 4 (`ViritasOrg/btcpay`). Never name, link, quote or use as a mental model the unrelated open-source payment server with a similar name ("store", "pull payment", "Greenfield" exist nowhere here). Payout, hold, funding and address answers come from btcpay's and Flyt's own `docs/`.

### Every repo lives under `ViritasOrg`
- Write and link `ViritasOrg/<repo>` and `https://viritasorg.github.io/<repo>/`, never `henrikschaub/<repo>` (GitHub redirects GETs, so the old name survives unnoticed). A session whose scope, remote or prompt shows the old name: do the work and tell Henrik which setting carries it. `henrikschaub` is still his personal GitHub user.

### Credentials are replaced, never just deleted
- A credential that must go is replaced in one step: new value, set where the server and the caller read it, verified with a real call. Never advise deleting, revoking or unsetting a credential, env var, secret, file, branch or data store before grepping for what reads it. An env-var reference in a file is not a leak; only a literal secret value is, and then name the file and line.

### Keys live in Bitwarden and move with rekey.sh (https://github.com/ViritasOrg/flyt/issues/993)
- Every token, key and secret of Henrik's is a Bitwarden item in folder `rekey`, named exactly as the key, value in the password field. `rekey.sh` (`ViritasOrg/flyt` `infra/rekey/rekey.sh`, `~/ClaudeCode/rekey/rekey.sh` on the M1 Max; phases in `infra/rekey/README.md`) puts it where it is used (GitHub secrets, Fly secrets, flyt-ops, the agent API); a key a command makes is written to Bitwarden first. A key only a settings page can take, he pastes from Bitwarden. Never a command that prints a key, puts it on the clipboard or passes it in argv; never ask for a key in chat. A key `rekey.sh` doesn't cover gets its item and phase in a PR before Henrik is asked to do anything. A refused key is reported with its name and the `rekey.sh` phase and command that renews it.

### Merge your PR once it is green (https://github.com/ViritasOrg/flyt/issues/930)
- A session merges its own PR as soon as every required check is green and it is mergeable, into the branch the repo targets (Flyt: `staging`, release and hotfix PRs into `main`; others: `main`). No merge ask, no waiting. Still never: push to a protected branch, change branch protection, merge red or conflicted, or merge a PR that lists a step Henrik must do first (ask for that step). `peptidetracker` and `workout` reach production only through his Push to Prod.

### Every repo has CI and tests (https://github.com/ViritasOrg/flyt/issues/982)
- Every repo has a GitHub Actions workflow running its tests on every PR and push to its main branch; one without gets both in its own PR before the next code change merges. A new repo gets CI and first tests in its first PR, its line in `REPOS` in `ViritasOrg/claude-agent-backend` `scripts/check_org_rules.py`, and this block in its `CLAUDE.md`.
- New or changed behaviour comes with tests in the same PR; a bug fix with a regression test that fails before the fix. Tests call the code and check what it returns; a source grep is a structural guard, never behaviour coverage. CI never calls a real partner or needs a real secret.
- A PR merges only after CI ran green on its latest commit; no checks is not green (the one exception: a docs-only PR in a repo whose CI doesn't run on PRs yet). Never skip, disable or loosen a test, a coverage floor or a CI step.

### Every background job has a readable name (https://github.com/ViritasOrg/flyt/issues/1004)
- A LaunchAgent or LaunchDaemon starts a link or wrapper named after what it is (product and service, as Henrik would say it: `Flyt Ops Board (production)`, `btcpay CFO Console`), unique, never a bare `node`/`python`/`bash` (macOS Login Items shows the interpreter's name otherwise). A Python job's link sits in its venv's `bin/` next to `python`. A new job gets its name in the same PR, with a test that its plist starts the named link.

### A verified error in an md file gets fixed immediately
- Something in a `CLAUDE.md` or any md established as wrong (checked, not a hunch) is corrected in that session, in every repo that repeats it, saying what was wrong and why in the commit and the reply. Rules you disagree with are Henrik's call; a SETTLED marker wins: raise it, don't edit. An org-wide rule is changed in the canonical file first.

### CLAUDE.md holds rules, not records
- A repo's root `CLAUDE.md` is loaded into every session, so it stays under 200 lines: imperative rules, one line each, an issue URL as provenance, at most one line of why. Quotes, incident stories, feature logs, "current state" and design notes go to `docs/` (pointed to from `CLAUDE.md` in one line), or to `.claude/rules/<area>.md` with `paths:` frontmatter when a rule only matters for part of the repo. A rule Henrik gives goes in as a rule; the quote goes to `docs/rule-history.md`.
<!-- END ORG-WIDE RULES v16 -->

## This repo
Single-file PWA: `index.html` (JS, CSS, HTML inline), `css/main.css`; `const VERSION` matches `version.json`, both bumped by the version-bump workflow on merge. GitHub Pages deploys on push to `main` (the live `version.json` cannot be fetched from a session). All development happens here; `workout` (prod) is read-only for Claude. Shared infrastructure with `peptidetracker-staging` (Push to Prod, settings sync, update checker, auth, backend calls, `IS_STAGING`): **a fix in one app is made in the other in the same session**. Tests: `node tests/test_frontend.js`, 0 failures before any PR. **Program generation, the Log screen, drafts, 1RM, sketches, home equipment, Ask AI and Polestar have their own rule file, `docs/program-rules.md`: read it before touching any of them and update it in the same PR.** The old `CLAUDE.md` is `docs/claude-md-archive-2026-11-05.md`; a new rule goes below as one line, its story into `docs/rule-history.md`. **Scan the conversation for rules each session** and extract what Henrik gave into this file; point out a contradiction rather than silently picking one.

## Data and model rules
- **All data lives in the backend**: compound data and research docs never in this public repo (backend `docs/enhanced-bodybuilding/`); every dose or risk claim has a retrieved published source (the backend's Fetch research sources workflow, pre-authorised). **No prices in the app, ever.** **Research scope is the full catalogue**, never only Henrik's configuration.
- **pmol/L is the only free-T unit**; **UI consistency across compound tiers**; **history views read and plot, never calculate**.
- **The stored log is the true record of what happened** (2026-08-07): a view reads the record, never reconstructs or narrows it; editing history edits the record; backups verify.
- **Save never fails in silence** (2026-10-08): no path out of a save is both empty-handed and silent; `_cardsAsTemplate()` rebuilds the list from the cards when the program moved under them.
- **`kg:0` means "no weight set yet", not bodyweight** (2026-10-08): `isBWExName(name)` is the only authority on bodyweight exercises.
- **Macro targets are per day; Food Edit sets them for the past** (2026-10-24): one row per change point, never recompute or backfill; identical block in Peptide Tracker.
- **localStorage is a cache, never the source of truth**: every write pairs with its backend push; every save and delete hits the backend; every data type has an endpoint and is in the startup sync. **No cross-app localStorage reads, ever.**
- **The in-progress workout is never deleted until its log is on the backend** (2026-09-30, `docs/program-rules.md`). **More than one session a day** is allowed; never reintroduce a one-log-per-date cleanup.
- **Never hardcode personal user data** (neutral fallbacks, no seeded records, no repair helpers); **deletes are global and say so** (`confirmGlobalDelete`); **no PIN or non-Google end-user login**, ever.
- **Never edit stored programs unless Henrik explicitly asks** (2026-07-15): no migrations in `_ensurePrograms`; new exercises go into the seeds and the generator; the one sanctioned in-app edit is the user's own answer to the "Save this swap to your program?" prompt.
- **Training tags**: strength 2–6, volume 8–12, rehab 15 (the only tag above 12), derived from the reps, canonical `GET /training-rules`; the frontend and the endpoint must agree.
- **Environment-aware code** uses `IS_STAGING`; **Push to Prod ships everything** (2026-11-04): the Push to Prod card is the only staging-only feature, every other `IS_STAGING` use is plumbing (`tests/test_frontend.js` lists them; a red there means remove the gate). **Prod has its own version number** (2026-11-04): name the staging build that was promoted, give prod's number only when read from prod.

## Working rules
- **Only fix what was asked** (appearance, layout, unrelated logic untouched; mention improvements). **Build the MVP, suggest the rest** (2026-09-03). **"My fix made it redundant" is not permission to remove it**: say so and ask.
- **Tests are mandatory**: new behaviour gets tests, a bug fix a regression test that would have caught it. A render function hands its element one finished string (the harness stubs `innerHTML`), so pure builders are what tests can see.
- **Anything Henrik must run is one copy-paste bash block** (self-checking, self-verifying, OK / NOT OK; secrets through Bitwarden and `rekey.sh`); default to doing it in the session.
- **Rotating the read-only key: replace in one step, never just delete**; an absent `CLAUDE_READONLY_API_KEY` is reported, never engineered around or widened. **Local clones are not up to date**: fetch first.
- **Cross-app parity**: a settings, UX or structural change in one app is checked in the other.

## Git workflow
- `git fetch origin && git checkout -b <branch> origin/main`; `node --check` the extracted `<script>` before the PR; create the PR yourself; poll checks to `success`; merge yourself immediately when green; never merge red or pending; never ask Henrik to touch GitHub.
- The version-bump workflow pushes a `version-bump/vX.Y` branch, opens and auto-merges its PR (no `[skip ci]`); Pages deploys the bump commit. **Confirm both** (version-bump `success`, pages-build-deployment `success` with the bump SHA) before "live as vX.XXX — test now"; never curl or fetch `viritasorg.github.io` from a session.
- **Absent checks are not green checks**: re-trigger with `git commit --allow-empty -m "chore: re-trigger CI" && git push`; if no run comes, run the suite locally, say so, don't merge; never route around the required `test` check. A docs-only merge left un-bumped is harmless.
- **Promotion to prod is Henrik's alone**: Push to Prod in the staging app fires `promote-to-prod.yml`, which opens and auto-merges the prod PR after a 30-minute CI wait (a Retry promotes staging as it is now). Never initiate it, never hand-merge the prod PR, never touch `workout`; re-running a run Henrik triggered is completing his action. Its token is `PEPTIDE_WORKOUT_PROD_TOKEN` (classic, `repo` + `workflow`, Bitwarden item of that name, set in both staging repos by `rekey.sh prod-push`; `Bad credentials` means Henrik regenerates it).
- **CodeQL findings on the promoted apps are deferred by Henrik** (2026-08-02); the prod merge gate selects the `test` check by name, never widen or narrow it.

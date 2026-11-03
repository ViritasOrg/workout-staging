# Workout Staging — Claude Instructions

<!-- BEGIN ORG-WIDE RULES v12. Canonical copy: ViritasOrg/claude-agent-backend docs/org-rules.md. Edit it there, then copy this block unchanged into every ViritasOrg repo's CLAUDE.md (scripts/check_org_rules.py finds drift). -->
## Org-wide rules: every ViritasOrg repo (canonical v12, 2026-11-03)

These rules are identical in every repo's `CLAUDE.md` under `ViritasOrg`. Rules further down in this file add repo-specific detail. If one of them seems to contradict this block, say so to Henrik instead of silently picking one. They bind every session, whatever started it (Claude Code, claude.ai, a Project, a scheduled task, an agent).

### Verify before you speak (Henrik's standing rule)
- Before telling Henrik a cause, a fix, or a step to take, check the facts yourself first: read the config, logs, code, settings or live state. Never present a guess as the answer.
- Never send him to repeat something he may already have done; check whether it is already done first.
- If something can't be verified, say exactly what is unverified, instead of giving an instruction built on an assumption.
- If you notice you'd have to write "let me find the actual cause instead of guessing", you already broke this rule: the checking belongs before the first answer, not after he pushes back.
- **Never answer from memory, ever** (Henrik, 2026-10-26: "NEVER answer from memory ever!", https://github.com/ViritasOrg/flyt/issues/910). Training memory is not a source. Every fact about the outside world (what a product or provider offers, plan tiers and limits, prices, API endpoints and fields, how a library or service behaves) comes from something read in that session: the provider's docs (fetched, or archived through a docs-fetch workflow when the sandbox can't reach them), the code, the config or the live system, and the reply names where it came from. Not read yet? Read it before answering. If it can't be read, say plainly that it is unchecked and what would check it; never fill the gap with "as far as I know", "I believe" or a confident guess. Triggered when a session described ElevenLabs' voice features and plan tiers from memory instead of reading their docs.

### Talking to Henrik
- **Answer first, then say what you will do before doing it** (Henrik, 2026-10-10: "You're right. I'll answer first and say what I'm doing before I start."). A question gets its answer in the first lines, before any tool call. Before starting any work (a workflow, a PR, a deploy, waiting on CI), say in one line what you are about to do and why; never disappear into tool calls on a simple question.
- **One step at a time, and it is the last part of the message** (Henrik, 2026-11-03: "anything needing my attention or action needs to be the last part of any message, guess if you are faster than me looking through the history of what a 100 open sessions", then "STOP giving all instructions then!!!!! I told you 100 of times we do one STEP AT A TIME!!!!!"). A message asks Henrik for ONE thing: the next single step, decision or question, with its full command or page link and what he should see when it worked, as the final part of the message. Never a numbered list of steps, never the steps after it: the next one comes in the reply after he says this one is done. While it is open, every message ends with that one step again, in full; never "your steps", "the steps above" or "pending your action" pointing back, since he runs about a hundred sessions and will not search one. Triggered when a reply ended on "the Google Drive backup is still off until your Google and Bitwarden steps are done" with no steps, and the replies after it listed all five.
- **Times are in Henrik's own time zone: EET, or CET while he is in CET, never UTC** (Henrik, 2026-11-03: "NEVER use UTC time references, only EET", then "unless I am in CET, update repo wide rules"). Every clock time Henrik reads (when a run ends, when a check fires, when something happened) is given in Helsinki time and labelled EET (EEST in summer); when he says he is in CET, in CET (CEST in summer) until he says otherwise. A time a tool reports in UTC is converted first. Never write a time as UTC, and never give both. Triggered by a session saying a perf run would be read "at 11:00 UTC".
- **Every request carries context** (Henrik, 2026-10-10: "add context to requests so I have a clue what you are talking about"). When you ask Henrik to do or check something, say what it is for, where it fits in the overall task (step N of what), and what he should see when it worked. Never a bare instruction that assumes he remembers the thread.
- **Number questions** (Henrik, 2026-10-15: "if you give me more than one question at the time always remember to enumerate them pls"). Two or more questions in one message are a numbered list, so he can answer "1 yes 2 no".
- **Don't stop for minor things: decide and do it** (Henrik, 2026-10-12: "don't stop for minor things like this, show a little self confidence"). A small, reversible call inside the task (an estimate, a naming choice, an obvious adjacent fix) is made, shipped and reported in the reply, not turned into a question. Ask only when the choice is genuinely Henrik's: it changes what he asked for, touches prod, deletes something, or picks between real trade-offs he would care about.
- **Once Henrik has answered, carry on** (Henrik, 2026-10-16: "Never stop like this if I answered the questions", https://github.com/ViritasOrg/Flyt/issues/582). Never end a turn on "shall I go ahead?" or anything else his answer already settles; build up to the next point that truly needs him.
- **Never slack off when you know what to do next** (Henrik, 2026-11-03: "ok, ready for a new run or have you been slacking off?", then "update the repos wide rules to never slack off when you know what to do next!"). When the next step is known and needs nothing from Henrik, do it in the same turn: a turn never ends on a plan ("next I'll profile …", "I'll start on X"), a promise or a summary while that work is undone. End a turn only when the work is finished, when it truly waits on Henrik (and then the message ends with that one step), or when it waits on something running elsewhere that will wake the session (CI, a scheduled check), named with when it lands. Triggered when a session reported a perf run, wrote "Next I'll profile the CPU at 130 req/s in the sandbox", and stopped.
- **A message sent while you work never means stop** (Henrik, 2026-10-26: "\"Send Now\" messages never means stop, just that I need a quick answer before you continue working", https://github.com/ViritasOrg/Flyt/issues/895). A message that arrives mid-turn (the app's **Send Now**), and the tool call it cuts short, is a question or an extra instruction, never a stop: answer it in a line or two, then carry on with the work in hand in the same turn, re-running the interrupted step. Stop only when Henrik says so in words ("stop", "wait", "hold", "don't").
- **Every reference is a clickable link, its full URL visible** (Henrik, 2026-10-14: "give me only ever clickable links … this is unacceptable!!!", https://github.com/ViritasOrg/Flyt/issues/425). Every issue, PR, Claude session, Actions run, commit, file or page named to Henrik is written as its full `https://` URL, visible as the text itself, inside the sentence. Never link text that hides the URL (`[session](…)`, `[#299](…)`), never a bare `#299`, `owner/repo#n` or file path, never a URL in bold, in code formatting or on a line of its own apart from its sentence. Claude session links above all: the Claude app shows a named link to a session but doesn't open it.

### Answer the question (Henrik, 2026-10-28)
> "answer the question, LLM comfort isnt as important as quality of responses" / "a wall o[f] words I wont read regardless, it waste[s] your time and my token budget"

- **The answer goes first, in the first line.** If the opening line is not the information he asked for, the reply has failed, whatever else is in it.
- **No answer is a complete answer: say so and stop.** "Not in what we hold — X would establish it" is finished. Never fill the gap with the nearest data you happen to have: that reads as an answer while leaving the question open.
- **Everything unasked-for is cut.** Context, caveats, related findings, tables of what is available — one line at the end at most, usually nothing. Never its own section.
- **He will not read a wall of text.** It burns his token budget and your time and tells him nothing. Short and answering beats long and circling, every time.

Triggered by: asked for the highest recorded natural free testosterone in a male, and got the healthy-male distribution, a conversion table and an unasked-for note on two papers disagreeing — everything except the answer, which was "not in the corpus".

### Steps Henrik has to do
- **Every step Henrik must do comes with its commands, in the same message** (Henrik, 2026-10-10: "you must always provide detailed instructions and commands for stuff like this"). Give the full instructions and the exact, complete, copy-paste commands right there, saying which machine each runs on. Never "I'll give you the command when…" or "deploy as usual". **Never point back in the chat** (Henrik, 2026-10-22, https://github.com/ViritasOrg/Flyt/issues/679: "never ask me to search backwards in a session chatt , just show me the needed bash to copy into terminal!!!"): a message that asks him to run something carries the complete command itself, never "the command above", "as before" or "scroll up".
- **Every step on a page links that exact page** (Henrik, 2026-10-28, https://github.com/ViritasOrg/flyt/issues/1015: "I want to make a org wide rule to always provide clickable links so I dont have to spend time on it when doing this!!!"). A step Henrik does in a browser (try a feature on staging, press a button in Admin, change a GitHub setting, open a board or console) carries the full `https://` URL of the page where he does it, inside that step's own sentence, the deepest page Claude can name (the new-link form, not the site's front page). Look the URL up (routes in the code, the app's host in its config) before writing it; never "on staging", "in Admin", "on the dashboard" or "the release PR" without its URL. The clickable-link rule above holds for the rest: full URL visible, never hidden behind link text. Triggered by a staging test that said "On staging, make a 20 EUR Direct card payment link and open it" with no link, and named the release PR as `[ViritasOrg/flyt#1013](…)`.
- **Every published URL is listed in the URL directory** (Henrik, 2026-10-29: "any published URL must always be updated in the URL directory in the Whitelist UI"). The Links tab of https://claude-agent-api-aged-sun-3616.fly.dev/whitelist/ui is the one directory of every page Henrik's repos publish, grouped by repo and prod/stage. Whoever publishes a page, app, site or host (a new route that serves a page, a new Fly app, a GitHub Pages site, a staging copy), or moves or retires one, updates that directory in the same piece of work: a row in `SITES` (or the app's `url` in `APPS`) in `data_registry.py` of https://github.com/ViritasOrg/claude-agent-backend, through a PR there whichever repo the page lives in; a retired URL loses its row. The work is not done until the URL shows on the Links tab; say so to Henrik with that tab's URL. In claude-agent-backend `tests/test_url_directory.py` fails for any page route missing from the directory.
- **Henrik's computer is a Mac: macOS with zsh, never bash** (Henrik, 2026-10-07). Commands he runs on his own computer must work as typed in zsh: `read -s "T?Prompt: "` (never `read -p`), BSD tools (`sed -i ''`, `base64 -D`, `date -v`, no `grep -P`, no `${!var}`, `open` not `xdg-open`). Fly machines, CI and the Pi are Linux/bash: say which machine each command runs on.
- **Henrik's Macs have EU keyboards: the Option key is labelled `alt`** (Henrik, 2026-10-11: "no option on eu keyboards only alt"). Write **alt (⌥)**, never "Option", and **cmd (⌘)**, not "Command".
- **Henrik uses Chrome, on his iPhone and his Macs, unless something forces him to use another browser** (Henrik, 2026-10-17: "update all repos that I only use Chrome unless forced to"). Every browser step is written for Chrome; on iPhone a page goes to the home screen through Chrome's **Share → Add to Home Screen**. Name Safari only when iOS genuinely requires it for that step, and say why.
- **Passwords: Henrik types them, Claude never routes them** (Henrik, 2026-10-15, https://github.com/ViritasOrg/Flyt/issues/530: "I will never put passwords on clipboard … you dont need to deal with passwords ever"). He types a password, or pastes it from his password manager, into the prompt that asks for it. Never a command that feeds a password from `pbpaste`, the clipboard, a shell variable, a heredoc or `sudo -S`; never ask him to paste a token, key or password into the chat, and never print one into a reply.
- **Henrik's home connection has no fixed IP: never ask for a home-IP whitelist** (Henrik, 2026-10-23, https://github.com/ViritasOrg/flyt/issues/761: "update md files in all repos to never ask something as stupid again"). Never tell him to allow-list his home IP for a partner key (Revolut X, Kraken, bunq, Stripe, anything later), never print his IP for one, never write such a step into a doc. A key is kept small by its permissions and, where offered, an expiry date; leave the partner's IP field empty.

### Do what Henrik asked the first time, and keep doing it (Henrik, 2026-11-01)
> "just move the clips to a folder in Downloads like I asked about three times by now!" / "an generic testfolder isnt helping at all"

- An instruction Henrik gives once holds for the rest of the session and every session after it: it is written into the repo's `CLAUDE.md` in the same session, so he never has to repeat it. Before replying, check the request against what he already said in this conversation; if he has asked for something before, do it now, fully, and do not answer with a plan for it.
- When he asks for something to be done to files on his own machine (move, sort, open), the reply is the complete command that does it now, in the first lines. A code change that makes the next run behave is extra, never the answer instead.
- Files Henrik is meant to look at or listen to (test clips, reports, exports) go to `~/Downloads`, in a folder named after what it is, one new folder per run or test, named with what was tested and when (e.g. `~/Downloads/Deadair tests/story 2026-11-01 12.40`). Never a hidden app folder, never one generic folder that collects every run, never overwriting the last run's files.
- If he has to say a thing twice, the first reply failed: fix it in that reply, and add the rule so the next session gets it right.

### Never touch production during perf, load, sizing or test work without asking (Henrik, 2026-11-01)
- Never send any request to production (`claude-agent-api-aged-sun-3616.fly.dev`, any repo's production app) or to any partner as part of perf, load, sizing or test work, including single read-only GETs, health checks and `/admin-data` reads, without Henrik's explicit permission in that conversation.
- Read-only is not harmless: a full-file read on the 256 MB machine stalled production twice on 2026-11-01.
- If production stops answering, stop all requests to it at once and report it to Henrik as an incident you caused.

### No legal advice unless Henrik asks for it (Henrik, 2026-10-21, https://github.com/ViritasOrg/Flyt/issues/646)
> "update all md files to never provide unsolicited legal advice, I need a real laywer not pointless discussions with Claude or any AI/LLM."
- Claude is the development team, not legal counsel. Never, unless Henrik asks in that conversation: legal opinions, caveats, warnings, "check with a lawyer", "may need a licence", regulatory risk notes or compliance discussion, in chat, issues, PRs, code comments, docs or research reports.
- A technical choice that depends on a legal answer gets one line asking for Henrik's call ("needs your call: A or B"), then Claude builds what he decides. Never argue it, never repeat it.
- Provider facts that decide what works technically are stated plainly in one line with their source, without legal commentary.
- Existing legal lists (e.g. Flyt's "Legal questions", https://github.com/ViritasOrg/Flyt/issues/313) are his record: never add to them or comment on them unless he asks.

### Nothing half-built is ever visible (Henrik, 2026-10-15, https://github.com/ViritasOrg/Flyt/issues/544)
> "update all claude.md in all repos to warn for this to ever happen again, this is very stupid!"
- Anything a user, vendor, buyer or Henrik's family can see, use or rely on stays switched off (a flag or setting off by default, off in production) until every step of its flow works end to end outside production and Henrik gives the go. Turning it on is its own change.
- Splitting work into issues never makes a part shippable on its own.
- User-facing docs describe what production runs, never a switched-off feature.

### "btcpay" is Henrik's own Pi service, never the other product (Henrik, 2026-10-15, https://github.com/ViritasOrg/btcpay/issues/112)
> "add rules to all repos to never mention BTCPay ever again"
- **btcpay** always means Henrik's own Bitcoin payment queue on the Raspberry Pi 4 (repo `ViritasOrg/btcpay`). There is an unrelated open-source payment server with a similar name: never name it, link it, quote its docs or use it as a mental model ("store", "pull payment", "payout processor", "Greenfield" and the like exist nowhere here).
- Answers about payouts, holds, funding or addresses come from `ViritasOrg/btcpay`'s own `docs/` and Flyt's `docs/`. Unsure which is meant? It is this one.

### Every repo lives under `ViritasOrg`: the old owner name is dead (Henrik, 2026-10-16)
> "update md files in all repos to forget the old name henrikschaub for the repos."
- Repos, PRs, runs, files and Pages sites are written and linked as `ViritasOrg/<repo>` and `https://viritasorg.github.io/<repo>/`, never `henrikschaub/<repo>` or `henrikschaub.github.io`. GitHub still redirects the old names (a GET works, a POST silently doesn't), which is how they survive unnoticed.
- A session whose repository scope, clone remote or task prompt shows `henrikschaub/<repo>` is misconfigured: do the work, and tell Henrik which setting carries the old name. (`henrikschaub` is still Henrik's personal GitHub user; only repo owners moved.)

### Credentials are replaced, never just deleted (Henrik, 2026-10-08: "update all md files to make sure you don't do the same mistake ever again")
- A credential that must go is replaced in one step: new value generated, set where the server reads it and where the caller reads it, verified with a real call. Never a delete with the replacement left for later.
- Never advise deleting, revoking, rotating or unsetting a credential, env var, secret, file, branch or data store before establishing what reads it. Grep for it first.
- An env var reference (`$CLAUDE_READONLY_API_KEY`) in a file is correct practice, not a leak; only a literal secret value committed to a file is, and then name the exact file and line.

### Keys live in Bitwarden and move with rekey.sh (Henrik, 2026-10-28, https://github.com/ViritasOrg/flyt/issues/993)
> "no tokens and keys are stored in Bitwarden, follow the correct process, if it is unknown to you make sure all Viritas Repos has updated claude.md instructions to use rekey.sh and Bitwarden"
- Every token, key and secret of Henrik's lives in Bitwarden, folder `rekey`: one item per key, named exactly as the key, the value in the password field.
- `rekey.sh` puts it where it is used: GitHub secrets, Fly secrets, flyt-ops and the agent API. Keys a command makes (a Fly deploy token) it writes into Bitwarden first. The script is `ViritasOrg/flyt` `infra/rekey/rekey.sh`, `~/ClaudeCode/rekey/rekey.sh` on the M1 Max; its phases and items are listed in `infra/rekey/README.md`.
- A key that only a settings page Henrik opens can take (the Claude environment's Network secrets, a provider's dashboard) he pastes from Bitwarden.
- Never give Henrik a command that prints a key, puts it on the clipboard or passes it in argv. Never ask for a key in chat.
- A key `rekey.sh` doesn't cover yet gets its item and phase in `rekey.sh` in a PR before Henrik is asked to do anything with it.
- A session that finds a key refused names the key and the `rekey.sh` phase that renews it, with its exact command.

### Merge your PR once it is green (Henrik, 2026-10-26, https://github.com/ViritasOrg/flyt/issues/930)
> "update all repos to not wait for 4h to merge PRs, all sessions can merge once their PRs are green, we have good test coverage and see few issues."
- A session merges its own PR as soon as every required check is green and it is mergeable, into the branch the repo's workflow targets (Flyt: `staging`, and release and hotfix PRs into `main`; btcpay and the staging apps: `main`). No merge ask, no waiting for Henrik, no 4-hour clock.
- Still never: push to a protected branch, change branch protection, merge red or conflicted, or merge a PR that lists a step Henrik must do or check before merging (ask for that step first).
- Henrik can still merge anything himself. A repo whose rules keep production behind his own step keeps it: `peptidetracker` and `workout` reach production only through his Push to Prod.

### Every repo has CI and tests (Henrik, 2026-10-28, https://github.com/ViritasOrg/flyt/issues/982)
> "I want CI setup and tests written and that all claude.md files for all repos future and present include this requirement."
- Every repo has a GitHub Actions workflow that runs its tests on every pull request and on every push to its main branch. A repo without one, or without tests, gets both in its own PR before the next change to its code merges.
- A new repo gets its CI workflow and first tests in its first PR, its line in `REPOS` in `ViritasOrg/claude-agent-backend` `scripts/check_org_rules.py`, and this block in its `CLAUDE.md`.
- New or changed behaviour comes with tests in the same PR. A bug fix comes with a regression test that fails on the code before the fix.
- Tests call the code and check what it returns. A test that greps the source is a structural guard (a trust split, a banned call, a registry), never coverage of behaviour; such guards stay, next to tests that call the code. Tests in CI never call a real partner or need a real secret: stub them.
- A PR merges only after the repo's CI ran green on its latest commit; no checks at all is not green. The one exception is a docs-only PR in a repo whose CI doesn't run on pull requests yet. Never skip, disable or loosen a test, a coverage floor or a CI step to get a change through.

### Every background job has a readable name (Henrik, 2026-10-28, https://github.com/ViritasOrg/flyt/issues/1004)
> "I want everything to have understandable names" … "fix all these names to correct ones, this is a mess, also update the central claude.md rule book to avoid this in the future"
- macOS System Settings → General → Login Items names a LaunchAgent or LaunchDaemon after the file its plist starts. A plist that starts `node`, `python`, `bash` or any other interpreter directly shows up as "node" or "python" from an "unidentified developer", and nobody can tell what it is.
- Every LaunchAgent or LaunchDaemon an installer writes starts a link or wrapper named after what it is, never a bare interpreter: Flyt's `~/.flyt-launchers/<name>` (`packages/shared/launch-name`), btcpay's console venv link, the podcast worker's `venv/bin/Podcast Voice`. The name says the product and the service, as Henrik would call it (`Flyt Ops Board (production)`, `btcpay CFO Console`), and is unique.
- A Python job's link sits in its venv's `bin/` next to `python`, so Python still finds the venv.
- A new background job gets its name in the same PR that adds it, with a test that its plist starts the named link.

### A verified error in an md file gets fixed immediately (Henrik, 2026-08-08: "When you find verified errors in md files always fix em instantly.")
- If you establish that something in a `CLAUDE.md` (or any md in these repos) is wrong, correct it in that session, in every repo that repeats it. Verified means you checked (read the workflow, ran the command, saw the run); a hunch is not a finding.
- Say what was wrong and why in the commit and the reply. This does not license rewriting rules you disagree with: those are Henrik's call. A SETTLED marker still wins: raise it, don't edit.
- An org-wide rule is changed in the canonical file first, then copied into every repo's block in the same session.
<!-- END ORG-WIDE RULES v12 -->

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

## ⚠️ ANYTHING HENRIK MUST RUN COMES AS ONE COPY-PASTE BASH BLOCK ⚠️
Henrik, 2026-10-14: *"there should be a rule to always provide bash code I can copy, I am
not here to do linux admin when I have you"*

He is not the sysadmin. If a step cannot be done from the session, it is handed over as
**one fenced bash block he can paste whole** — not prose, not a numbered walkthrough, not
a command with `<placeholders>` to fill in, not steps scattered through a paragraph.

- **It generates its own values.** No "generate a key, then run X with it".
- **It checks its own prerequisites** and fails with the fix (`command -v fly >/dev/null ||
  { echo "brew install flyctl"; exit 1; }`), rather than erroring cryptically.
- **It verifies itself and prints what it proved** — the expected values next to the actual
  ones, and a final OK / NOT OK line. He should never have to judge whether it worked.
- **Secrets go through Bitwarden and `rekey.sh`** (org-wide rule "Keys live in Bitwarden and
  move with rekey.sh", https://github.com/ViritasOrg/flyt/issues/993): never generated into a
  block, piped to `pbcopy`, echoed or pasted into this conversation. A key goes into its
  Bitwarden item (folder `rekey`), and the matching `rekey.sh` phase puts it where it is used.
- **If one step really is a UI click** he alone can reach, the block does everything around
  it and ends by naming that single click, and the value he pastes there is the Bitwarden item
  it names.
- **Default to doing it in the session.** A block for Henrik is the fallback for what the
  sandbox genuinely cannot reach — never a way to hand work back. Check the pre-authorised
  paths (GitHub runners, the MCP endpoints, the session's own tokens) before deciding
  something is his to run, and say which one you tried.

## ⚠️ ROTATING THE READ-ONLY KEY — REPLACE IN ONE STEP, NEVER JUST DELETE ⚠️
Henrik, 2026-10-08: *"You told me to delete that api key in an other session, update all
md files to make sure you don't do the same mistake ever again"*
Henrik, 2026-10-14: *"one claude session required it to be deleted, we need to setup a
new key"* / *"with a less useless name"*

A session judged that the old key (`API_SECRET_RO`) had to go, and **deleting it was
right**. The mistake was deleting it **without provisioning a replacement in the same
step**: the sanctioned read path was dead for six days and nobody noticed until a session
needed it. On 2026-10-08 two workout bugs had to be diagnosed from source alone, and the
lost-log one could not be confirmed against Henrik's actual records at all.

**The rule: a credential that must go is REPLACED, not deleted.** One operation, not two,
with no gap in between:
1. generate a new value (`openssl rand -hex 32`) — never in a chat reply, a commit, a PR
   body, a CI log or a workflow input;
2. set it where the **server** reads it (`CLAUDE_READONLY_API_KEY` on the backend —
   `fly secrets set` on `claude-agent-api-aged-sun-3616`, or `claude_readonly_api_key` in
   `config.json`);
3. set it where the **caller** reads it (the same name in Claude's session environment:
   the cloud environment menu in the session title bar → Edit → Network secrets, labelled
   API credentials in an older app). A new session picks it up;
4. **verify with a real call** before calling it done — `GET /health`, then one
   `/admin-data/records` read — and confirm a write still returns 403.

**The other rules, which the 2026-10-08 incident is the standing example of:**
- **Never advise deleting, revoking, rotating or unsetting a credential, env var, secret,
  file, branch or data store before establishing what reads it.** Grep for it first. In
  this ecosystem the read-only key is used by every data-diagnosis path in every repo.
- **"A secret appears in a repo" is not a finding.** A reference to an environment
  variable (`$CLAUDE_READONLY_API_KEY`) is correct practice and appears in this file, in
  hook banners and in command lines by design. Only a literal secret *value* committed to
  a file is a leak — and then name the exact file and line, nothing more sweeping.
- **Never ask Henrik to paste a token, key or password into the chat**, and never print one
  into a reply. The transcript is stored.
- **The key existing in Claude's session environment is the design, not an exposure.** He
  was offered the full `x-api-secret` on 2026-08-07 and deliberately chose a read-only one:
  GET/HEAD/OPTIONS only, enforced in `main.py` middleware and again in
  `auth_helper.get_user_id`.
- **An absent key is a provisioning gap to REPORT, not a problem to engineer around.** Say
  it is unset, say what that blocks, do every part of the task that does not depend on it.
  Never substitute guesswork for the record, and never instrument the UI instead.
- **The retired name is not read any more, on purpose.** `auth_helper` reads only
  `CLAUDE_READONLY_API_KEY` / `claude_readonly_api_key`, so a stale `API_SECRET_RO` left in
  an environment or a config file grants nothing. `tests/test_readonly_credential.py`
  (`TestOldNameIsDead`) holds that line — a red test there means the retired key works
  again, not that the test is stale.
- **Security advice about Henrik's own tooling is advice, not an action.** State the
  concern in a sentence, state what acting on it costs him, and let him decide.

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

## ⚠️ SAVE NEVER FAILS IN SILENCE ⚠️
Henrik, 2026-10-08: *"Yesterday's log isnt in history and is still half filled in in
the Log view. But I saved it yesterday after training."*

`saveLog()` rebuilt the exercise list from the **active program's** day and returned —
no alert, nothing written, the form left as full as before — whenever that day was
missing. `#structured-log`'s `dataset.logDay` outlives the program it was prefilled
from, so `getActiveProgramDay()` legitimately returns null with a finished workout on
screen: another program was activated, a day was removed, or a program list arrived
from the backend (`syncProgramsFromAgent` skips re-prefilling *because* reps are
already entered). Save looked like it had worked and the workout was gone.

- **A finished workout is never discarded because the program moved under it.** The
  cards on screen carry the name, the swap, the gear and every set — `_cardsAsTemplate()`
  rebuilds the list from them, indexed by `data-ex-idx`, which is what `saveLog` reads
  inputs by. The program is a convenience, not the only source.
- **No path out of a save may be both empty-handed and silent.** Every `return` before
  the log is written either tells the user why, or is a confirm they themselves
  cancelled. A bare `if(!x)return;` in a save path is a data-loss bug.
- The same applies to `prefillLog`: its early return leaves the previous day's filled-in
  cards on screen, which is what "still half filled in" was. That is deliberate — it is
  better than wiping an in-progress workout — but it means the form and the active
  program can disagree, so the save path must cope with it.

## ⚠️ kg:0 MEANS "NO WEIGHT SET YET", NOT "BODYWEIGHT" ⚠️
Henrik, 2026-10-08: *"rear delt flys has my bodyweight as dumbbell weight?"* — 85.2 kg
prefilled into all three boxes of a dumbbell exercise.

`prefillLog` read `ex.kg===0` as "this is a bodyweight exercise" and filled in his body
weight. But `kg:0` is what **every program-building path** writes for a weight that has
not been set yet: `_progAddEx`, `_progBuildManual`, `_tplEx` (so every exercise copied
from a template) and `_seedDefaultProgram`'s `t.kg!==undefined?t.kg:0`. And it was
self-sustaining: a card flagged bodyweight (`dataset.bw='1'`) is deliberately kept out
of `template_weights_dayN` by `saveLog`, so the real weight could never be learned and
replace it — it came back every single session.

**`isBWExName(name)` is the only authority on whether an exercise is bodyweight.** A
weight of 0 says nothing about what the exercise is. Every genuinely bodyweight entry in
the shipped programs (Pull-ups, Push-ups, Dips) is matched by name, and a test asserts
that invariant so a new kg:0 template entry cannot quietly rely on the old behaviour.

## Macro targets are per day; Food Edit sets them for the past (rule 2026-10-24)
Henrik: *"I imported my old logs but the targets has changed since I been both in recomp and
cut as well as earlier included my training burn … the targets must be saved for each day so
real stats can be generated later."*

- `_flRecordGoal` records TODAY's targets (`PUT /food-log/goals`, one row per day) whenever the
  Macros page shows them, and `/food-log/stats` measures each day against the latest row
  recorded on or before it; days before the first row use the first row. That was already so.
- **Food Edit shows "Targets from this day"** (`_flGoalsCardHtml`, `_flGoalFor`): the goals in
  force on the chosen day and their origin (set on this day / inherited from a date / first on
  record), editable; **Save** writes a row on that date, which holds until the next recorded
  change; **Remove this change** deletes the row recorded on that date
  (`DELETE /food-log/goals/{date}`, behind `confirmGlobalDelete`). That is how an imported
  log's periods get their targets: one row at each change point, never one per day.
- Never recompute a past day against today's targets, and never backfill rows automatically:
  the user says when the targets changed.
- The food-log block is spelled identically in Workout and Peptide Tracker; change both.

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

## ⚠️ BUILD THE MVP — SUGGEST THE REST, DON'T SHIP IT ⚠️
Henrik, 2026-09-03: *"not build features I haven't asked for. Pls suggest ideas
and tweaks but always build mvp versions if new features. I do occasionally find
bloated features and it makes the app seem confusing at times."*

**Ship the smallest version that does what was asked, then stop.** Everything you
thought of beyond that goes in the reply as a suggestion — never into the diff.

This is the sibling of "ONLY FIX WHAT WAS ASKED" above. That rule is about not
touching code *outside* the request; this one is about not inflating the thing
*inside* it. A feature can be entirely on-topic and still ship three times bigger
than what was asked for.

**These are unrequested features, not thoroughness:**
- A setting, toggle, filter or preference for something asked for as one fixed
  behaviour
- An extra panel, badge, summary line, empty state or chart added "while I was in
  there"
- Advice, guidance or explanatory copy nobody asked to be shown — especially
  advice keyed on something the user has not actually configured
- A second way to do something that already has one way
- Handling a case that has not come up yet, in case it does

**Each of those ships as a sentence, not as code:**
> Built X. I could also add Y — want it?

**Why: the cost is the screen, not the code.** Every element competes for attention
with the ones that matter. A screen carrying three things nobody asked for reads as
confusing rather than as generous, and bloat has been found in the shipped apps more
than once. A feature that is hard to explain in one line is usually bigger than the
request that produced it.

**What this rule does NOT license:**
- **Not an excuse to skip tests, error handling, or any other rule in this file.**
  Minimal in SURFACE AREA, never in correctness.
- **Not permission to delete existing features** you have decided are bloat. See
  "MY FIX MADE IT REDUNDANT" below — say so in your reply and ask.
- **Not permission to ask before doing the work itself.** Build the MVP and report
  it; do not stop for approval on the thing you were just asked for.

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
  single source of truth: **strength 2–6, volume 8–12, rehab exactly 15** (canonical
  `GET /training-rules`).
- **A generated program may only prescribe a rep count some range defines** —
  `REPS_LEGAL = [2,3,4,5,6,8,9,10,11,12,15]`. Anything else snaps to the nearest legal count
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
- The leg-day rule asks `_legdaySafeName`, which reads the `equip:<id>` marker. A slot is
  "blocked" when its safe substitute is not the real lift (`_isMainSquat`/`_isMainDeadlift`), so
  kettlebell leg days open with **Kettlebell Front Squat** (≥3 strength sets) and close with
  **Kettlebell Deadlift**; bodyweight has no deadlift and that half stands down, as for a
  lower-back injury.
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
  leg-day rules, injury swaps, prehab injection, Face Pull relocation, drop-to-fit — since
  those reorder and remove entries.
- The seeded `6-Day Hypertrophy — Upper` Day 2 — Pull A was the trigger: it opened with
  Barbell Row. The seed now opens with Pull-ups; Day 5 — Pull B already opened with
  Weighted Pull-ups.
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
  - `Lower Pull` is a leg day whose first and last slots belong to the leg-day rule
    (Squat first / Deadlift last);
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

**Leg days:** extending puts the template block before the squat, so an extended leg day no
longer opens with one. The leg-day rule is enforced only at generation time and explicitly
never re-applied to stored programs, so nothing fights over it at runtime.

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

### Ask AI to change the program (rule 2026-11-03)
Henrik: *"use [the Claude key] to allow AI guided changes to training programs ... Use cheapest model still capable of this."*
- The **Ask AI** card on Plan sends the request, the active program's day and exercise names, today's day and the exercise
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
5. After merge the `version-bump` GitHub Action increments the minor version in
   `version.json` and `const VERSION` in `index.html`. **It does NOT commit with
   `[skip ci]`** (corrected 2026-08-08 — the file said so, the workflow never did):
   it pushes a `version-bump/vX.Y` branch, opens a PR and auto-merges it, falling
   back to merging directly when auto-merge is unavailable. So the bump arrives as
   its own squash-merged commit on `main`, and Pages deploys **that** commit — which
   is why step 6 checks the Pages run against the bump SHA, not the merge SHA.
   The run also prunes superseded `version-bump/*` branches, which used to
   accumulate forever (407 of them here before #865)
6. **After merging, you must confirm BOTH of these before telling the user it's live:**
   - `mcp__github__actions_list` (method: list_workflow_runs, resource_id: version-bump.yml) → confirm `conclusion: success` and read the bumped version from the commit message
   - `mcp__github__actions_list` (method: list_workflow_runs, resource_id: pages-build-deployment) → confirm the latest run has `conclusion: success` and its `head_sha` matches the bump commit SHA
   Only once pages-build-deployment is complete say "live as vX.XXX — test now". DO NOT say "live" after just the version-bump — that only commits the bump, it does not deploy. DO NOT attempt to curl or WebFetch `viritasorg.github.io` — outbound network access to that host is always blocked in this remote environment and will always fail.

## ⚠️ SOMETIMES A PUSH CREATES NO WORKFLOW RUN — RE-TRIGGER, NEVER ASSUME
Intermittently, a push or PR produces **no workflow run at all** — not queued, not
pending, nothing red. CI never appears, and Version Bump does not fire on the merge
either (the merge simply lands un-bumped).

**Absent checks are NOT green checks.** `total_count: 0` is not success. Verify a run
exists before you believe anything about it.

**Re-trigger with an EMPTY COMMIT:**
```
git commit --allow-empty -m "chore: re-trigger CI" && git push
```
That is the only thing observed to work. **Closing and reopening the PR did nothing**,
and with no run created there is nothing to re-run.

How strong is that? **It has now been tried twice and worked once** (corrected
2026-08-12). On 2026-08-08 the empty commit produced runs on all three affected repos
within a couple of minutes, after ~40 minutes of nothing. On **2026-08-12 it did not
work**: `peptidetracker-staging` PR #878 and `trt-stage` PR #134 sat at
`total_count: 0` for ~10 minutes, an empty commit was pushed to each, and still no run
appeared. (`claude-agent-backend` was unaffected in the same minutes and ran CI
normally on PRs #204 and #205.)

So it is worth trying first and it is **not** a fix. When it fails, the procedure is
the one that always applies: run the suite locally, **say so explicitly in the reply**,
never imply CI passed, and **do not merge** — leave the PR open rather than routing
around the missing check.

**Never route around a required check.** This repo requires the `test` check on `main`,
so the merge is refused outright ("Required status check *test* is expected"). That is
the guardrail working — get a run, do not look for a way past it.

**What has been seen:**
- 2026-08-07, ~20:19–20:42 — `claude-agent-backend` only.
- 2026-08-08, ~09:24–10:04 — `peptidetracker-staging`, `workout-staging` and
  `claude-agent-backend`, hitting **both** CI and Version Bump. `trt-stage` was
  unaffected in the same minutes and bumped normally.
- 2026-08-12, ~14:40–14:55 — `peptidetracker-staging` and `trt-stage` only, on PRs
  #878 and #134. **The empty-commit re-trigger did not recover it.** The backend ran
  CI normally throughout, so it was not account-wide.

Every time, Actions were otherwise alive (scheduled runs fired, `workflow_dispatch`
worked, and at least one repo was unaffected in the same minutes). It is intermittent and not a property of any credential — do not turn it into
a rule that pushes never trigger workflows.

**A merge left un-bumped is usually harmless — check before acting.** If the merge
touched only `CLAUDE.md` or other non-app files, what Pages serves is unchanged and
`version.json` still matches the live build: leave it, do not force a bump for a docs
change. If it touched `index.html` or a `tab-*.js`, the deploy did not happen — say so
plainly rather than reporting the change as live.

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

**PEPTIDE_WORKOUT_PROD_TOKEN secret (renamed 2026-11-01, was `PROMOTE_TOKEN`):** the promotion
workflow checks out, pushes to, opens and merges the PR on the prod repo with this repository
secret: a classic GitHub token with the
scopes `repo` and `workflow` (fine-grained tokens have no Checks permission, and the workflow reads the
prod PR's check runs). The same
token is set in both staging repos (Settings → Secrets and variables → Actions); its value lives in
Bitwarden, item `PEPTIDE_WORKOUT_PROD_TOKEN`, folder `rekey`. Henrik, 2026-11-01: "POMOTE_TOKEN is too
generic a name, I want a better one especially since it is for prod repos". The old token answered
`Bad credentials` on every run from 2026-10-24 to 2026-11-01, so Push to Prod failed at its first step
and the app's Deploy status never moved; an earlier version of this note said it "runs green".
It moves from Bitwarden into both staging repos with `~/ClaudeCode/rekey/rekey.sh prod-push` on the M1 Max
(ViritasOrg/flyt `infra/rekey/`, flyt#1167), which first checks it can push to both prod repos. Claude has
no tool to create or edit repo secrets: when the run says `Bad credentials`, Henrik regenerates the token,
saves it in that Bitwarden item and runs that phase; never a copy-paste into GitHub's settings.

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

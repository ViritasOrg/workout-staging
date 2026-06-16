# Workout Staging — Claude Instructions

## This is the repo Claude works in
`workout` (prod) is **READ-ONLY** for Claude — see its CLAUDE.md. All actual
development (features, fixes, refactors) happens here on `workout-staging`.
Claude may freely branch, commit, push, open PRs, and merge on this repo.

## Git workflow — ALWAYS follow this
1. Make changes on a feature branch
2. Before opening the PR, locally extract the `<script>` block from `index.html` and run `node --check` on it
3. Create a PR, then **check its CI status before merging** — call `pull_request_read` with `method: get_check_runs` (or `get_status`) and confirm `conclusion`/`state` is `success`. **Never merge a PR with a failing or pending check.**
4. Once CI is green, merge it yourself — never stop and ask the user to merge, never push directly to main
5. After merge the `version-bump` GitHub Action auto-increments the minor version in `version.json` and `const VERSION` in `index.html` and commits with `[skip ci]`
6. **After merging, poll `https://henrikschaub.github.io/workout-staging/version.json` every 30 s until the new version appears, then tell the user "live as vX.XXX — test now"**

## Promotion to prod — Claude must NOT do this directly
There is currently no automated staging → prod promotion pipeline for this
repo (unlike `peptidetracker-staging`, which has a "Push to Prod" button +
`repository_dispatch` workflow). Until one exists, **never** push or open a PR
directly on `workout` (prod) yourself. If staging changes need to reach prod,
tell Henrik and let him decide how — manually porting a diff, or building a
promotion pipeline mirroring peptidetracker-staging's, requires his explicit
go-ahead first.

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
- Monitor live version: `https://henrikschaub.github.io/workout-staging/version.json`

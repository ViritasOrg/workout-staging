# Rule history

The rules are in `CLAUDE.md` (and `docs/program-rules.md` for the generator); this is where a new rule's quote and story go. Everything before 2026-11-05 is in `docs/claude-md-archive-2026-11-05.md`; the org-wide rules' stories are in claude-agent-backend `docs/org-rules-history.md`.

## 2026-11-11 — Tests that ship to prod read only what prod has
Henrik, after a Push to Prod failed: "promotion to prod fails" … "add claude.md rule for all repos to make sure you dont repeat this again (it has happened multiple times). Also write tests to make sure this cannot be repeated!"
Workout prod PR #334 (https://github.com/ViritasOrg/workout/pull/334) failed because the promoted `tests/test_frontend.js` read `.github/workflows/promote-to-prod.yml`, which prod does not have (ENOENT). Earlier instances of the same class in Peptide Tracker: `inj-writer.js` (2026-08-20), `inject-sites.jpg` (2026-10-03), retired images (2026-10-22). The guard: `tests/test_promote_workflow.js` in both staging apps runs the real "Sync files into prod branch" step against a fake prod repo holding only prod's own files and runs prod's CI commands on the result.

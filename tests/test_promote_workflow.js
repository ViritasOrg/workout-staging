#!/usr/bin/env node
// Tests for .github/workflows/promote-to-prod.yml (Push to Prod), added 2026-11-04 after a
// day on which promotion "was impossible":
//   1. the wait for prod CI gave up after 10 minutes while both `test` checks were still queued
//      (17:56 EET), leaving prod PR #302 open;
//   2. the app's Retry re-ran that failed run at 23:17, and a re-run checks out the commit the
//      run STARTED on, so it promoted staging v1.345 over the v1.347 promoted at 22:57.
//
// The workflow's own shell is cut out of the YAML and RUN against a fake `gh` and a no-op
// `sleep`, so these check what the steps do, not how they are spelled.
//
// STAGING-ONLY: the workflow is staging's; prod keeps no copy of it. On a prod checkout this
// file skips itself (same rule as _isProdCheckout in test_frontend.js).
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');

const root = path.resolve(__dirname, '..');
let fails = 0, passes = 0;
function check(name, ok, detail) {
  if (ok) { passes++; console.log('  ✓ ' + name); }
  else { fails++; console.log('  ✗ ' + name + (detail ? '\n      ' + detail : '')); }
}

function repoName() {
  let r = process.env.GITHUB_REPOSITORY || '';
  if (!r) {
    try {
      const cfg = fs.readFileSync(path.join(root, '.git/config'), 'utf8');
      const m = cfg.match(/\[remote "origin"\][^[]*?url\s*=\s*(\S+)/);
      if (m) r = m[1].replace(/\.git$/, '');
    } catch (e) { /* not a git checkout: run the tests */ }
  }
  return r;
}
const repo = repoName();
if (repo && !/-(staging|stage)$/.test(repo)) {
  console.log('– skipped on ' + repo + ' (staging-only workflow)');
  process.exit(0);
}

const wfPath = path.join(root, '.github/workflows/promote-to-prod.yml');
const y = fs.readFileSync(wfPath, 'utf8');

// The `run: |` block of a named step, de-indented.
function stepRun(name) {
  const lines = y.split('\n');
  const at = lines.findIndex(l => l.trim() === '- name: ' + name);
  if (at < 0) throw new Error('no step ' + name);
  let r = at + 1;
  while (r < lines.length && !/^\s+run: \|\s*$/.test(lines[r])) r++;
  const out = [];
  for (let i = r + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s{6}- name: /.test(l)) break;
    out.push(l.startsWith('          ') ? l.slice(10) : l.trim() === '' ? '' : l);
  }
  return out.join('\n');
}

// A sandbox with a fake gh and an instant sleep.
//   GH_PENDING_POLLS  check-run reads that report the `test` checks still running
//   GH_PR_LIST        numbers `gh pr list` prints
//   GH_CLOSE_FAIL     a PR number whose close fails
function sandbox() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'promote-wf-'));
  const bin = path.join(dir, 'bin'); fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'sleep'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  fs.writeFileSync(path.join(bin, 'gh'), `#!/bin/bash
LOG="${dir}/gh.log"; echo "$*" >> "$LOG"
case "$1 $2" in
  "api repos/"*)
    case "$2" in
      */pulls/*) if [ -f "${dir}/merged" ]; then echo '{"merged":true,"state":"closed","sha":"abc"}'; else echo '{"merged":false,"state":"open","sha":"abc"}'; fi ;;
      */check-runs)
        n=$(cat "${dir}/polls" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "${dir}/polls"
        if [ "$n" -le "\${GH_PENDING_POLLS:-0}" ]; then
          echo '{"check_runs":[{"name":"test","status":"queued","conclusion":null},{"name":"test","status":"in_progress","conclusion":null}]}'
        else
          echo '{"check_runs":[{"name":"test","status":"completed","conclusion":"success"},{"name":"test","status":"completed","conclusion":"success"}]}'
        fi ;;
    esac ;;
  "pr merge")
    m=$(cat "${dir}/merges" 2>/dev/null || echo 0); m=$((m+1)); echo $m > "${dir}/merges"
    if [ "$m" -le "\${GH_MERGE_BEHIND:-0}" ]; then
      echo "X Pull request ViritasOrg/x#7 is not mergeable: the head branch is not up to date with the base branch." >&2; exit 1
    fi
    if [ -n "\${GH_MERGE_REFUSE:-}" ]; then echo "\${GH_MERGE_REFUSE}" >&2; exit 1; fi
    touch "${dir}/merged" ;;
  "api -X")
    echo "$4" >> "${dir}/updates"
    [ -n "\${GH_UPDATE_FAIL:-}" ] && { echo "gh: merge conflict between base and head (HTTP 422)" >&2; exit 1; }
    echo '{"message":"Updating pull request branch."}' ;;
  "pr list") for n in \${GH_PR_LIST}; do echo $n; done ;;
  "pr close") [ "$3" = "\${GH_CLOSE_FAIL:-none}" ] && exit 1; echo "$3" >> "${dir}/closed" ;;
esac
exit 0
`, { mode: 0o755 });
  return { dir, bin };
}

function run(script, env) {
  const sb = sandbox();
  const r = cp.spawnSync('bash', ['-e', '-c', script], {
    env: Object.assign({}, process.env, { PATH: sb.bin + ':' + process.env.PATH, GH_TOKEN: 'x', PR_NUMBER: '7' }, env),
    encoding: 'utf8', timeout: 60000,
  });
  const read = f => { try { return fs.readFileSync(path.join(sb.dir, f), 'utf8'); } catch (e) { return ''; } };
  return { code: r.status, out: (r.stdout || '') + (r.stderr || ''), merged: fs.existsSync(path.join(sb.dir, 'merged')),
           updates: read('updates').trim().split('\n').filter(Boolean),
           closed: read('closed').trim().split('\n').filter(Boolean), polls: +read('polls') || 0 };
}

console.log('\n── Push to Prod: a re-run promotes staging as it is now ─────────');
{
  const co = y.slice(y.indexOf('- name: Checkout staging'), y.indexOf('- name: Checkout prod'));
  check('the staging checkout is pinned to main, not to the run\'s own commit', /\n\s+ref: main\n/.test(co), co);
  const code = y.split('\n').filter(l => !/^\s*#/.test(l)).join('\n');
  check('  …and nothing is named after GITHUB_SHA, which a re-run keeps', !/\$\{?GITHUB_SHA/.test(code));
  // Run the sync step's SHA lines against a real two-commit repo: HEAD is what is promoted.
  const sync = stepRun('Sync files into prod branch');
  const lines = sync.split('\n').filter(l => /STAGING_SHA=|BRANCH="promote/.test(l));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'promote-sha-'));
  fs.mkdirSync(path.join(tmp, 'staging')); fs.mkdirSync(path.join(tmp, 'prod'));
  const g = 'git -c user.email=t@t -c user.name=t';
  cp.execSync(`git init -q && ${g} commit -q --allow-empty -m one && ${g} commit -q --allow-empty -m two`, { cwd: path.join(tmp, 'staging') });
  const head = cp.execSync('git rev-parse HEAD', { cwd: path.join(tmp, 'staging') }).toString().trim();
  const envf = path.join(tmp, 'env');
  const r = cp.spawnSync('bash', ['-e', '-c', lines.join('\n') + '\necho "B=$BRANCH"'], {
    cwd: path.join(tmp, 'prod'), env: Object.assign({}, process.env, { GITHUB_ENV: envf, GITHUB_SHA: 'f'.repeat(40) }), encoding: 'utf8' });
  check('the promoted SHA is staging\'s HEAD, even when GITHUB_SHA says otherwise',
    (fs.existsSync(envf) ? fs.readFileSync(envf, 'utf8') : '').includes('STAGING_SHA=' + head) && r.stdout.includes('-' + head.slice(0, 7)), r.stdout + r.stderr);
}

console.log('\n── Push to Prod: the wait for prod CI ───────────────────────────');
{
  const wait = stepRun('Wait for CI and merge prod PR');
  let r = run(wait, { GH_PENDING_POLLS: '100' });
  check('CI still running after 100 polls (16+ minutes) is waited for, then merged',
    r.code === 0 && r.merged, 'exit ' + r.code + '\n' + r.out.slice(-400));
  r = run(wait, { GH_PENDING_POLLS: '2' });
  check('  …a quick CI merges at once', r.code === 0 && r.merged && r.polls === 3);
  r = run(wait, { GH_PENDING_POLLS: '100000' });
  check('CI that never finishes times out after 30 minutes, without merging',
    r.code !== 0 && !r.merged && /did not merge within 30 minutes/.test(r.out) && r.polls === 180, 'polls ' + r.polls);
  check('  …the merge itself is never retried', !/gh_retry[^\n]*pr merge/.test(wait));
}

console.log('\n── Push to Prod: prod main moves while CI runs (2026-11-09) ─────');
{
  const wait = stepRun('Wait for CI and merge prod PR');
  let r = run(wait, { GH_MERGE_BEHIND: '1' });
  check('a PR left behind by a merge on prod main is updated from main, then merged',
    r.code === 0 && r.merged && JSON.stringify(r.updates) === '["repos/ViritasOrg/' + (/peptidetracker"/.test(wait) ? 'peptidetracker' : 'workout') + '/pulls/7/update-branch"]',
    'exit ' + r.code + ' updates ' + JSON.stringify(r.updates) + '\n' + r.out.slice(-400));
  check('  …and CI is waited for again before that merge', r.polls >= 2, 'polls ' + r.polls);
  r = run(wait, { GH_MERGE_BEHIND: '100' });
  check('  …at most 3 updates, then it fails with GitHub\'s reason',
    r.code !== 0 && !r.merged && r.updates.length === 3 && /::error::GitHub refused to merge PR #7: X Pull request .* not up to date/.test(r.out),
    'updates ' + r.updates.length + '\n' + r.out.slice(-400));
  r = run(wait, { GH_MERGE_BEHIND: '1', GH_UPDATE_FAIL: '1' });
  check('  …an update that fails (a conflict) stops the promotion with that reason',
    r.code !== 0 && !r.merged && /::error::Prod main moved while CI ran and PR #7 could not be updated from it: gh: merge conflict/.test(r.out), r.out.slice(-400));
  r = run(wait, { GH_MERGE_REFUSE: 'X Pull request is not mergeable: review required' });
  check('any other refusal is not retried, and its reason is the error line',
    r.code !== 0 && !r.merged && r.updates.length === 0 && /::error::GitHub refused to merge PR #7: X Pull request is not mergeable: review required/.test(r.out), r.out.slice(-400));
}

console.log('\n── Push to Prod: promote PRs a failed run left open ─────────────');
{
  const a = y.indexOf('# >>> close superseded'), b = y.indexOf('# <<< close superseded');
  check('the open step closes superseded promote PRs', a > 0 && b > a);
  const block = y.slice(a, b).split('\n').map(l => l.replace(/^ {10}/, '')).join('\n');
  let r = run(block, { GH_PR_LIST: '3 7 9' });
  check('older promote PRs are closed, the new one is kept',
    r.code === 0 && JSON.stringify(r.closed) === '["3","9"]', JSON.stringify(r.closed) + ' ' + r.out);
  r = run(block, { GH_PR_LIST: '3 9', GH_CLOSE_FAIL: '3' });
  check('  …a close that fails never stops the promotion', r.code === 0 && JSON.stringify(r.closed) === '["9"]');
  check('  …only promote/staging-* branches are touched', /startswith\("promote\/staging-"\)/.test(block));
}

// What ViritasOrg/workout keeps of its own (read from its main branch 2026-11-11): version.json,
// CLAUDE.md, tests.html, its CI and version-bump workflows, and a tests/ folder. Its CI runs
// exactly PROD_CI. A change to prod's ci.yml or owned files is mirrored here.
const PROD_REPO = 'ViritasOrg/workout';
const PROD_OWNS = { 'version.json': '{"version":"1.200"}\n', 'CLAUDE.md': '# prod\n', 'tests.html': '<!doctype html>\n',
  '.github/workflows/ci.yml': 'name: CI\n', '.github/workflows/version-bump.yml': 'name: Version Bump\n', 'tests/test_frontend.js': '// old\n' };
const PROD_CI = ['node tests/test_frontend.js index.html'];
// ── Push to Prod ships a test suite that passes on prod ─────────────────────────
// Henrik, 2026-11-11: "promotion to prod fails … add claude.md rule for all repos to make sure
// you dont repeat this again (it has happened multiple times). Also write tests to make sure
// this cannot be repeated!" On 2026-11-10 the promoted tests/test_frontend.js read
// .github/workflows/promote-to-prod.yml, which prod does not have, crashed with ENOENT and failed
// the promotion (workout prod PR #334). Earlier: inj-writer.js (2026-08-20), inject-sites.jpg
// (2026-10-03), retired images (2026-10-22). Every one was a file the promoted tests or page
// needed that the prod tree did not hold.
//
// So this RUNS the real "Sync files into prod branch" step against a fake prod repo holding only
// the files prod keeps of its own, stops it before the commit, and runs prod's CI commands in the
// tree it produced. Whatever prod CI would trip over, this trips over first, in staging CI.
console.log('\n── Push to Prod: the promoted tree passes prod CI ─────────────');
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'promote-sim-'));
  const sh = (cmd, cwd) => cp.execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8' });
  const gitInit = (dir) => { sh('git init -q -b main . && git config user.email t@t && git config user.name t && git add -A && git commit -q -m init --allow-empty', dir); };
  // staging: this checkout's tracked and untracked (not ignored) files, as a git repo
  const stg = path.join(tmp, 'staging'); fs.mkdirSync(stg);
  sh('git ls-files -co --exclude-standard', root).split('\n').filter(Boolean).forEach(f => {
    const src = path.join(root, f); if (!fs.existsSync(src)) return;
    fs.mkdirSync(path.dirname(path.join(stg, f)), { recursive: true }); fs.copyFileSync(src, path.join(stg, f));
  });
  gitInit(stg);
  // prod: only what prod keeps of its own
  const prod = path.join(tmp, 'prod'); fs.mkdirSync(prod);
  Object.entries(PROD_OWNS).forEach(([f, body]) => { fs.mkdirSync(path.dirname(path.join(prod, f)), { recursive: true }); fs.writeFileSync(path.join(prod, f), body); });
  gitInit(prod);
  let script = stepRun('Sync files into prod branch');
  const cut = script.indexOf('\ngit add -A');
  check('the sync step ends in a commit this simulation can stop before', cut > 0);
  script = script.slice(0, cut) + '\n';
  const env = Object.assign({}, process.env, { GITHUB_ENV: path.join(tmp, 'github_env') });
  const syncRun = cp.spawnSync('bash', ['-e', '-c', script], { cwd: tmp, env, encoding: 'utf8' });
  check('the real sync step runs against a prod repo', syncRun.status === 0, (syncRun.stdout + syncRun.stderr).slice(-800));
  // every local asset the promoted page or its modules name is in the prod tree
  const pageSrc = ['index.html'].concat(fs.readdirSync(prod).filter(f => /\.js$/.test(f))).map(f => fs.readFileSync(path.join(prod, f), 'utf8')).join('\n');
  const refs = [...new Set((pageSrc.match(/["'(]([A-Za-z0-9._-]+\.(?:png|jpe?g|svg|webp|gif|ico))/g) || []).map(m => m.slice(1)))];
  const missing = refs.filter(r => fs.existsSync(path.join(root, r)) && !fs.existsSync(path.join(prod, r)));
  check('every local image the promoted page references is in the prod tree', missing.length === 0, missing.join(', '));
  const bad = [];
  PROD_CI.forEach(cmd => {
    const r = cp.spawnSync('bash', ['-c', cmd], { cwd: prod, encoding: 'utf8', timeout: 300000,
      env: Object.assign({}, process.env, { GITHUB_REPOSITORY: PROD_REPO }) });
    if (r.status !== 0) bad.push(cmd + ' → exit ' + r.status + '\n      ' +
      ((r.stdout || '') + (r.stderr || '')).split('\n').filter(l => /✗|Error|ENOENT/.test(l)).slice(0, 6).join('\n      '));
  });
  check('prod CI passes on the promoted tree (' + PROD_CI.join(' ; ') + ')', bad.length === 0, bad.join('\n      '));
  fs.rmSync(tmp, { recursive: true, force: true });
}

// The pictures are built from names in code ('muscles-'+sex+'-'+view+'.webp'), which no scan finds.
{
  check('the sync step copies the muscle pictures', /cp \.\.\/staging\/muscles-\*\.webp \.\//.test(stepRun('Sync files into prod branch')));
}

console.log('\n' + passes + ' passed, ' + fails + ' failed');
process.exit(fails ? 1 : 0);

// Renders the sketch review page from the app itself: index.html is the only copy of the sketch code.
// Run from the repo root: node tools/sketches/page.js out.html
const fs=require('fs'),vm=require('vm'),path=require('path');const ctx={};vm.createContext(ctx);
const app=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
const B='// ── Exercise sketches:',E='// ── end exercise sketches ──';
vm.runInContext(app.slice(app.indexOf(B),app.indexOf(E)),ctx);
const opts=app.match(/const EX_OPTS_HTML='([^']*)'/)[1];const names=[];
for(const m of opts.matchAll(/<optgroup label="([^"]*)">(.*?)<\/optgroup>/g))for(const o of m[2].matchAll(/<option>([^<]*)<\/option>/g))names.push([m[1],o[1].replace(/&amp;/g,'&')]);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const VIEW={side:'Side',front:'Front',top:'From above'};
const arrow='<svg class="arr" viewBox="0 0 18 150" width="18" height="150" aria-hidden="true"><path d="M2 75 L14 75 M9 70 L15 75 L9 80" stroke="#e8ff3c" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const groups={};let n=0;
names.forEach(([g,name])=>{n++;const s=ctx.SK[name]();const P=ctx.skPanels(s,132,150);
  const views=s.views.map(v=>`<div class="view"><div class="vl">${VIEW[v]}</div><div class="pair"><figure>${P[v][0]}<figcaption>Start</figcaption></figure>${arrow}<figure>${P[v][1]}<figcaption>Finish</figcaption></figure></div></div>`).join('');
  let grip='';if(s.grips){const G=ctx.skPanels({views:[s.grips.view],start:s.grips.items[0],end:s.grips.items[1],floor:s.grips.floor},132,150)[s.grips.view];
    grip=`<div class="view grip"><div class="vl">Grip · ${VIEW[s.grips.view]}</div><div class="pair"><figure>${G[0]}<figcaption>${s.grips.labels[0]}</figcaption></figure><span class="vs">or</span><figure>${G[1]}<figcaption>${s.grips.labels[1]}</figcaption></figure></div><p class="gnote">${esc(s.grips.note)}</p></div>`;}
  (groups[g]=groups[g]||[]).push(`<article class="ex" id="ex${n}"><header><span class="num">${n}</span><h3>${esc(name)}</h3></header><p class="cue">${esc(s.cue)}</p><div class="views">${views}${grip}</div></article>`);});
const nav=Object.keys(groups).map(g=>`<a href="#${g.toLowerCase()}">${g} <span>${groups[g].length}</span></a>`).join('');
const body=Object.keys(groups).map(g=>`<section id="${g.toLowerCase()}"><h2>${g}</h2><div class="grid">${groups[g].join('')}</div></section>`).join('');
const html=`<title>Exercise Sketches Review</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
/* Layout: one column of exercise cards grouped by muscle; each card shows start → finish per view on the app's dark sketch tile. */
:root{--bg:#f3f3ef;--card:#ffffff;--fg:#17181a;--muted:#5d6066;--line:#dcdcd5;--accent:#6b7a00;--tile:#151517;--tileline:#2a2a2e;
  --sans:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',sans-serif;--mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0d0d0e;--card:#141416;--fg:#ededea;--muted:#9a9ca2;--line:#29292d;--accent:#e8ff3c;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0d0d0e;--card:#141416;--fg:#ededea;--muted:#9a9ca2;--line:#29292d;--accent:#e8ff3c;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:15px;line-height:1.5}
.wrap{max-width:1180px;margin:0 auto;padding-inline:16px;padding-block:28px 48px}
h1{font-size:clamp(24px,4vw,32px);line-height:1.15;margin:0 0 8px;text-wrap:balance}
.lede{color:var(--muted);max-width:62ch;margin:0 0 6px}
.how{max-width:62ch;margin:10px 0 0;padding:12px 14px;border:1px solid var(--line);border-radius:8px;background:var(--card)}
.how b{color:var(--fg)}
nav{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 6px;position:sticky;top:env(safe-area-inset-top,0px);background:var(--bg);padding-block:10px;z-index:2}
nav a{color:var(--fg);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:5px 12px;font-size:13px;font-weight:600}
nav a span{font-family:var(--mono);color:var(--muted);font-weight:500;margin-left:4px}
nav a:focus-visible,nav a:hover{border-color:var(--accent)}
h2{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:30px 0 12px;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:12px}
.ex{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;min-width:0;display:flex;flex-direction:column;gap:6px}
.ex:has(.view+.view){grid-column:span 2}
.vs{font-family:var(--mono);font-size:11px;color:#8d8d93;padding:0 4px}
.gnote{margin:4px 4px 2px;font-size:11.5px;line-height:1.45;color:#c4c4c9;max-width:40ch}
@media (max-width:720px){.ex:has(.view+.view){grid-column:auto}}
.ex header{display:flex;align-items:baseline;gap:8px}
.num{font-family:var(--mono);font-size:13px;color:var(--accent);font-variant-numeric:tabular-nums;min-width:2.2em}
h3{margin:0;font-size:16px;line-height:1.25}
.cue{margin:0;color:var(--muted);font-size:13px;max-width:70ch}
.views{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.view{background:var(--tile);border:1px solid var(--tileline);border-radius:8px;padding:6px 6px 4px;min-width:0}
.vl{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#8d8d93;padding:0 4px}
.pair{display:flex;align-items:center}
figure{margin:0;display:flex;flex-direction:column;align-items:center}
figure svg{max-width:100%;height:auto;display:block}
figcaption{font-family:var(--mono);font-size:10px;color:#6b6b70;letter-spacing:.08em;text-transform:uppercase}
.arr{flex:none}
</style>
<div class="wrap">
<h1>Exercise sketches: review</h1>
<p class="lede">All ${n} exercises in the workout app, drawn as stick figures from one 3D pose per position. Each card shows start → finish, with a front or overhead view where it shows something the side view can't. Yellow is equipment, grey limbs are the far side. Exercises where grip width is a real choice also show narrow and wide side by side, with what the studies found changes (author and year in brackets).</p>
<p class="how"><b>In the app:</b> tap <b>?</b> on a Log Workout card. <b>To review:</b> reply in the chat with the numbers that look wrong and a few words on what's off.</p>
<nav aria-label="Muscle groups">${nav}</nav>
${body}
</div>`;
fs.writeFileSync(process.argv[2],html);console.log('bytes',html.length,'exercises',n);

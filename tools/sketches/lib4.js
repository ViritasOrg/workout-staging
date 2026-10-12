// ── Grip panels: narrow vs wide on the exercises where grip width is a real choice ──
// One exercise, one history (rule 2026-08-08): the grip is shown on the sketch, never a new name.
function _skWithGrip(name,make){var base=SK[name];SK[name]=function(){var s=base();s.grips=make();return s;};}
// Grip notes cite the studies retrieved into claude-agent-backend docs/enhanced-bodybuilding/sources/grip-width-*
// (summary: docs/enhanced-bodybuilding/20-grip-width.md). Henrik, 2026-10-12: "Difference in muscle hit with
// different grips should be mentioned as well?" — then: "science based and rather point out differences are
// smaller than gym lore in those occasions". Where the studies show a smaller effect than the common belief, the note
// opens with "Smaller than gym lore suggests"; where they show a real difference (overhead press) it does not.
var _SK_GRIP_NOTE='Narrow: hands about shoulder width. Wide: about 1.5× shoulder width. Keep one grip per training block so your numbers stay comparable.';
function _skGripHang(eqFn){return function(){function mk(a){var J=_skHang({torso:-3,thigh:[183,4],shank:178,upper:[4,a],fore:[2,a-2]},_SK_BAR);var e=[{t:'pullbar',at:[0,_SK_BAR+1.5,0],half:34}];if(eqFn)e=e.concat(eqFn(J));return{J:J,eq:e};}
  return{view:'front',floor:false,items:[mk(8),mk(34)],labels:['Narrow','Wide'],note:"Narrow \u2248 shoulder width, wide \u2248 1.5\u00d7 shoulder width. Smaller than gym lore suggests. Max strength and reps were the same at shoulder width and a ~20% wider grip (Ortega-Rodr\u00edguez 2021). A modelling study found wide shifts slightly more work to the lats, narrower to the biceps (Urbanczyk 2020). Very wide grips put the shoulder in a position linked to impingement (Prinold 2016)."};};}
_skWithGrip('Pull-ups',_skGripHang());
_skWithGrip('Weighted Pull-ups',_skGripHang(function(J){return[{t:'line',a:J.hip,b:[J.hip[0]+2,J.hip[1]-14,0],c:SK_C.ac,w:1.6},{t:'box',x:[J.hip[0]-4,J.hip[0]+8],y:[J.hip[1]-19,J.hip[1]-14],z:[-6,6],c:SK_C.ac}];}));
_skWithGrip('Lat Pulldown',function(){var H=[0,30];function mk(a){var q=_skQ({torso:-12,neck:-6,thigh:90,shank:180,foot:90,upper:[6,a],fore:[3,a-2]});var J=skMove(skPose(q),H);var b=_skBarAt(J,0,0);
    return{J:J,eq:_skSeat(H).concat([{t:'box',x:[J.kR[0]-4,J.kR[0]+4],y:[J.kR[1]+3,J.kR[1]+7],z:[-12,12]},{t:'line',a:b,b:[b[0],118,0],w:1.4},{t:'bar',at:b,noPlate:true,half:32}])};}
  return{view:'front',items:[mk(8),mk(30)],labels:['Narrow','Wide'],note:"Narrow \u2248 shoulder width, wide \u2248 1.5\u20132\u00d7 shoulder width. Smaller than gym lore suggests: the belief that wide works the lats more has little support (Andersen 2014). Lat activation was similar from 1 to 2\u00d7 shoulder width, and you lift slightly more with narrow\u2013medium than wide (Andersen 2014); in 40 trained men no grip variation changed lat activation (Buonsenso 2025). Palms away worked the lats more than palms toward you (Lusk 2010)."};});
function _skGripBench(incline){return function(){var top=22,H=[0,top+6],t=incline?-52:-90;
  function mk(a){var q={torso:t,neck:t,upper:[0,a],fore:[0,a-2]};var J=_skHipAnkle(q,H,[H[0]+24,1.5]);var e=_skBench(-44,6,top);e.push({t:'bar',at:_skBarAt(J,0,1),half:30});return{J:J,eq:e};}
  return{view:'top',items:[mk(2),mk(22)],labels:['Narrow','Wide'],note:incline?"Seen from above. Narrow \u2248 shoulder width, wide \u2248 1.5\u00d7 shoulder width. Smaller than gym lore suggests (studied on the flat bench): narrower = a bit more triceps, slightly less chest (Lehman 2005); wide = less triceps, narrow = lowest load (Saeterbakken 2021).":"Seen from above. Narrow \u2248 shoulder width, wide \u2248 1.5\u00d7 shoulder width. Smaller than gym lore suggests: narrower = a bit more triceps and slightly less lower chest (Lehman 2005); wide = less triceps, and you lift least with a narrow grip (Saeterbakken 2021)."};};}
_skWithGrip('Bench Press',_skGripBench(false));
_skWithGrip('Incline Bench Press',_skGripBench(true));
_skWithGrip('Overhead Press',function(){function mk(a){var J=_skStandQ({upper:[2,a],fore:[0,a-4]});return{J:J,eq:[{t:'bar',at:_skBarAt(J,0,1)}]};}
  return{view:'front',items:[mk(8),mk(24)],labels:['Narrow','Wide'],note:"Narrow: hands just outside the shoulders. Wide \u2248 1.5\u00d7 shoulder width. What changes: a narrower grip lets you lift more over a longer range, with more load on the elbows and less on the shoulders; wider is the reverse (Gundersen 2026, seated press)."};});
_skWithGrip('Barbell Row',function(){function mk(a){var J=_skStandQ({torso:68,neck:55,thigh:[160,6],shank:192,upper:[180,a],fore:[180,a]});return{J:J,eq:[{t:'bar',at:_skBarAt(J,0,0)}]};}
  return{view:'front',items:[mk(3),mk(20)],labels:['Narrow','Wide'],note:"Narrow \u2248 shoulder width, wide \u2248 1.5\u00d7 shoulder width. What changes: no good study has compared grip width in the barbell row. Use the width that lets you pull the bar to the lower ribs comfortably, and keep it the same so your numbers compare."};});

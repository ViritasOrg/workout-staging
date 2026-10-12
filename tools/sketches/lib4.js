// ── Grip panels: narrow vs wide on the exercises where grip width is a real choice ──
// One exercise, one history (rule 2026-08-08): the grip is shown on the sketch, never a new name.
function _skWithGrip(name,make){var base=SK[name];SK[name]=function(){var s=base();s.grips=make();return s;};}
var _SK_GRIP_NOTE='Narrow: hands about shoulder width. Wide: about 1.5× shoulder width. Keep one grip per training block so your numbers stay comparable.';
function _skGripHang(eqFn){return function(){function mk(a){var J=_skHang({torso:-3,thigh:[183,4],shank:178,upper:[4,a],fore:[2,a-2]},_SK_BAR);var e=[{t:'pullbar',at:[0,_SK_BAR+1.5,0],half:34}];if(eqFn)e=e.concat(eqFn(J));return{J:J,eq:e};}
  return{view:'front',floor:false,items:[mk(8),mk(34)],labels:['Narrow','Wide'],note:_SK_GRIP_NOTE};};}
_skWithGrip('Pull-ups',_skGripHang());
_skWithGrip('Weighted Pull-ups',_skGripHang(function(J){return[{t:'line',a:J.hip,b:[J.hip[0]+2,J.hip[1]-14,0],c:SK_C.ac,w:1.6},{t:'box',x:[J.hip[0]-4,J.hip[0]+8],y:[J.hip[1]-19,J.hip[1]-14],z:[-6,6],c:SK_C.ac}];}));
_skWithGrip('Lat Pulldown',function(){var H=[0,30];function mk(a){var q=_skQ({torso:-12,neck:-6,thigh:90,shank:180,foot:90,upper:[6,a],fore:[3,a-2]});var J=skMove(skPose(q),H);var b=_skBarAt(J,0,0);
    return{J:J,eq:_skSeat(H).concat([{t:'box',x:[J.kR[0]-4,J.kR[0]+4],y:[J.kR[1]+3,J.kR[1]+7],z:[-12,12]},{t:'line',a:b,b:[b[0],118,0],w:1.4},{t:'bar',at:b,noPlate:true,half:32}])};}
  return{view:'front',items:[mk(8),mk(30)],labels:['Narrow','Wide'],note:_SK_GRIP_NOTE};});
function _skGripBench(incline){return function(){var top=22,H=[0,top+6],t=incline?-52:-90;
  function mk(a){var q={torso:t,neck:t,upper:[0,a],fore:[0,a-2]};var J=_skHipAnkle(q,H,[H[0]+24,1.5]);var e=_skBench(-44,6,top);e.push({t:'bar',at:_skBarAt(J,0,1),half:30});return{J:J,eq:e};}
  return{view:'top',items:[mk(2),mk(22)],labels:['Narrow','Wide'],note:'Seen from above. Narrow: hands about shoulder width. Wide: about 1.5× shoulder width; forearms vertical at the bottom either way. Keep one grip per training block.'};};}
_skWithGrip('Bench Press',_skGripBench(false));
_skWithGrip('Incline Bench Press',_skGripBench(true));
_skWithGrip('Overhead Press',function(){function mk(a){var J=_skStandQ({upper:[2,a],fore:[0,a-4]});return{J:J,eq:[{t:'bar',at:_skBarAt(J,0,1)}]};}
  return{view:'front',items:[mk(8),mk(24)],labels:['Narrow','Wide'],note:'Narrow: hands just outside the shoulders. Wide: about 1.5× shoulder width. Forearms vertical at the start either way.'};});
_skWithGrip('Barbell Row',function(){function mk(a){var J=_skStandQ({torso:68,neck:55,thigh:[160,6],shank:192,upper:[180,a],fore:[180,a]});return{J:J,eq:[{t:'bar',at:_skBarAt(J,0,0)}]};}
  return{view:'front',items:[mk(3),mk(20)],labels:['Narrow','Wide'],note:_SK_GRIP_NOTE};});

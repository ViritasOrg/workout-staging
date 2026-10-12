// ── Pose library: one entry per catalogue exercise ─────────────────────────────
function _skQ(o){var q={torso:0,thigh:180,shank:180,upper:180,fore:180};for(var k in o)q[k]=o[k];return q;}
function _skStandQ(o){return skStand(skPose(_skQ(o)));}
// 2-link leg IK in the side plane: hip H, ankle A (world x,y) → thigh/shank pitches, knee bending forward/up.
function _skLegIK(H,A){var dx=A[0]-H[0],dy=A[1]-H[1],d=Math.min(Math.sqrt(dx*dx+dy*dy),49.6);
  var base=Math.atan2(dx,dy)*180/Math.PI,off=Math.acos(d/50)*180/Math.PI,th=base-off;
  var r=th*Math.PI/180,K=[H[0]+25*Math.sin(r),H[1]+25*Math.cos(r)];var sh=Math.atan2(A[0]-K[0],A[1]-K[1])*180/Math.PI;return[th,sh];}
// Build a pose with the hip at H and both ankles at A (legs from IK).
function _skHipAnkle(o,H,A){var ik=_skLegIK(H,A),q=_skQ(o);q.thigh=[ik[0],(o.legA||0)];q.shank=[ik[1],(o.legA||0)];return skMove(skPose(q),[H[0],H[1],0]);}
function _skBarAt(J,dx,dy){var m=skMid(J.wR,J.wL);return[m[0]+(dx||0),m[1]+(dy||0),0];}
function _skBench(x0,x1,top){return[{t:'box',x:[x0,x1],y:[top-3,top],z:[-9,9]},{t:'line',a:[x0+5,top-3,0],b:[x0+5,0,0],w:2.4},{t:'line',a:[x1-5,top-3,0],b:[x1-5,0,0],w:2.4}];}
function _skSeat(H,back){var o=[{t:'box',x:[H[0]-12,H[0]+12],y:[H[1]-6,H[1]-3],z:[-10,10]},{t:'line',a:[H[0],H[1]-6,0],b:[H[0],0,0],w:2.4}];
  if(back!==undefined){var r=back*Math.PI/180;o.push({t:'slab',a:[H[0]-5*Math.cos(r)-4,H[1]+2],b:[H[0]-5*Math.cos(r)-4+32*Math.sin(r),H[1]+2+32*Math.cos(r)],z:[-10,10],w:3.6});}return o;}
function _skX(st,en,views,cue,floor){return{views:views,start:st,end:en,cue:cue,floor:floor};}
var SK={};
// ── Squats ───────────────────────────────────────────────────────────────────
function _skSquat(hold,o){o=o||{};var arms={
    back:[{upper:[200,40],fore:[-20,30]},{upper:[210,45],fore:[10,30]}],
    goblet:[{upper:[160,18],fore:[20,-28]},{upper:[150,18],fore:[25,-28]}],
    rackR:[{upperR:[158,8],foreR:[-12,-20],upperL:[178,18],foreL:[178,18]},{upperR:[150,8],foreR:[-5,-20],upperL:[110,15],foreL:[100,10]}],
    free:[{upper:[180,6],fore:[180,6]},{upper:[90,8],fore:[90,0]}]}[hold];
  var legs=[{torso:3,thigh:[180,8],shank:[180,4],toeout:25},{torso:hold==='back'?42:28,thigh:[95,28],shank:[205,-6],toeout:25}];
  function mk(i){var q={};[legs[i],arms[i]].forEach(function(s){for(var k in s)q[k]=s[k];});var J=_skStandQ(q);var eq=[];
    if(hold==='back')eq.push({t:'bar',at:[J.sh[0]-3,J.sh[1]+2,0]});
    if(hold==='goblet')eq.push({t:'kb',at:'hands',dy:5});
    if(hold==='rackR')eq.push({t:'kb',at:[J.wR[0]-1,J.wR[1]+1,J.wR[2]],dy:0});
    if(o.smith)eq.push({t:'line',a:[J.sh[0]-3,0,-30],b:[J.sh[0]-3,118,-30],w:2},{t:'line',a:[J.sh[0]-3,0,30],b:[J.sh[0]-3,118,30],w:2});
    return{J:J,eq:eq};}
  return[mk(0),mk(1)];}
function _skSquatX(hold,cue,o){var p=_skSquat(hold,o);return _skX(p[0],p[1],['side','front'],cue);}
SK['Squat']=function(){return _skSquatX('back','Bar on the upper back, feet about shoulder width. Sit down and back to parallel, knees out over the toes, chest up.');};
SK['Smith Machine Squat']=function(){return _skSquatX('back','Bar on the upper back in the rails, feet slightly forward. Sit down to parallel, knees over the toes.',{smith:true});};
SK['Kettlebell Goblet Squat']=function(){return _skSquatX('goblet','Hold the bell at your chest by the horns. Sit straight down between the knees, elbows inside the knees, chest up.');};
SK['Kettlebell Front Squat']=function(){return _skSquatX('rackR','Bell racked on the forearm at the shoulder. Sit down to parallel, stay tall, do not lean toward the bell.');};
SK['Bodyweight Squat']=function(){return _skSquatX('free','Arms forward for balance. Sit down and back to parallel, heels down, knees out over the toes.');};
SK['Sissy Squat']=function(){
  var a=_skStandQ({foot:[125,8],upper:[90,10],fore:[90,0]});
  var b=_skStandQ({torso:-55,neck:-35,thigh:118,shank:250,foot:[135,8],upper:[75,10],fore:[80,0]});
  return _skX({J:a,eq:[]},{J:b,eq:[]},['side'],'Up on the toes, hold a support. Knees travel forward and down while hips, torso and head stay in one line leaning back.');};
SK['Hack Squat']=function(){
  var A=[30,8];function mk(H,t){var J=_skHipAnkle({torso:t,neck:t,upper:[170,30],fore:[-10,20]},H,A);
    var r=t*Math.PI/180,n=[-Math.cos(r),Math.sin(r)];var pad={t:'slab',a:[H[0]+5*n[0]*0+(-5),H[1]-6],b:[J.sh[0]-5,J.sh[1]+4],z:[-10,10],w:4};
    return{J:J,eq:[pad,{t:'slab',a:[A[0]-4,A[1]-4],b:[A[0]+14,A[1]+2],z:[-14,14],w:3},{t:'box',x:[A[0]-4,A[0]+14],y:[0,A[1]-5],z:[-14,14]}]};}
  return _skX(mk([10,47],-22),mk([-6,28],-22),['side'],'Back flat against the pad, feet mid-platform. Lower until thighs are parallel to the platform, drive up through the whole foot.');};
// ── Hinges ───────────────────────────────────────────────────────────────────
function _skDeadlift(kind){
  var arms=kind==='kb'?{upper:[180,-14],fore:[180,-6]}:{upper:[180,4],fore:[180,2]};
  var tgt=kind==='kb'?16:13;
  var a=skSolve(function(t){var q=_skQ({thigh:[128,6],shank:[200,0],torso:t});for(var k in arms)q[k]=arms[k];return skStand(skPose(q));},30,88,function(J){return -(J.wR[1]-tgt);});
  var qb=_skQ({torso:-2});for(var k in arms)qb[k]=arms[k];var b=skStand(skPose(qb));
  function eq(J){return kind==='kb'?[{t:'kb',at:'hands',dy:5}]:[{t:'bar',at:_skBarAt(J,0,-1)}];}
  var ea=eq(a);if(kind!=='kb')ea=[{t:'bar',at:[a.wR[0],12,0]}];
  return[{J:a,eq:ea},{J:b,eq:eq(b)}];}
SK['Deadlift']=function(){var p=_skDeadlift('bar');return _skX(p[0],p[1],['side','front'],'Bar over mid-foot, shins to the bar, back flat. Push the floor away and stand tall; bar stays against the legs.');};
SK['Kettlebell Deadlift']=function(){var p=_skDeadlift('kb');return _skX(p[0],p[1],['side','front'],'Bell between the feet. Hips back, back flat, grip the handle and stand up by driving the hips forward.');};
function _skRDL(kind,o){o=o||{};
  var arms=kind==='kb'?{upper:[180,-14],fore:[180,-6]}:kind==='free'?{upper:[170,10],fore:[40,-60]}:{upper:[180,4],fore:[180,2]};
  function mk(t,th,sh){var q=_skQ({torso:t,thigh:[th,6],shank:[sh,0],neck:t*0.85});for(var k in arms)q[k]=arms[k];return skStand(skPose(q));}
  var a=mk(0,180,180),b=mk(78,170,188);
  function eq(J){return kind==='kb'?[{t:'kb',at:'hands',dy:5}]:kind==='bar'?[{t:'bar',at:_skBarAt(J,0,-1)}]:[];}
  return[{J:a,eq:eq(a)},{J:b,eq:eq(b)}];}
SK['Romanian Deadlift']=function(){var p=_skRDL('bar');return _skX(p[0],p[1],['side'],'Soft knees, push the hips straight back and slide the bar down the thighs to mid-shin. Back flat; stand up by driving the hips forward.');};
SK['Kettlebell Romanian Deadlift']=function(){var p=_skRDL('kb');return _skX(p[0],p[1],['side'],'Soft knees, hips straight back, bell close to the legs to mid-shin. Back flat; hips forward to stand.');};
SK['Bodyweight Good Morning']=function(){var p=_skRDL('free');return _skX(p[0],p[1],['side'],'Hands on the chest, soft knees. Hinge at the hips until the torso is near parallel, back flat, then stand.');};
SK['Single-leg RDL']=function(){
  var a=_skStandQ({thighL:195,shankL:200,upper:180,fore:180});
  var b=_skStandQ({torso:80,neck:70,thighR:174,shankR:186,thighL:-100,shankL:-100,footL:180,upper:180,fore:180});
  return _skX({J:a,eq:[]},{J:b,eq:[]},['side'],'Stand on one leg, knee soft. Tip forward as the free leg rises behind you, hips square, back flat, until the body is near horizontal.');};
// ── Lunges ───────────────────────────────────────────────────────────────────
function _skLunge(hold,bulg){
  var arms=hold==='goblet'?{upper:[160,18],fore:[20,-28]}:{upper:[180,8],fore:[180,6]};
  var q0=_skQ(arms);if(bulg){q0.thighL=185;q0.shankL=-70;q0.footL=-80;}
  var a=skStand(skPose(q0));
  var q1=_skQ(arms);q1.torso=6;q1.thighR=96;q1.shankR=182;q1.thighL=196;q1.shankL=bulg?-60:-88;q1.footL=bulg?-75:175;
  var b=skPose(q1);var bm=Math.min(b.aR[1],b.tR[1]);b=skMove(b,[0,1.5-bm,0]);
  if(!bulg){var dz=b.tL[1]-1.5;}
  function eq(J,start){var e=[];if(hold==='goblet')e.push({t:'kb',at:'hands',dy:5});
    if(bulg){var x=J.tL[0],y=J.aL[1];e.push({t:'box',x:[x-14,x+4],y:[y-4,y-1],z:[-9,9]},{t:'line',a:[x-5,y-4,0],b:[x-5,0,0],w:2.4});}return e;}
  if(!bulg){var m=Math.min(b.aR[1],b.tR[1],b.tL[1],b.aL[1]);b=skMove(b,[0,1.5-m,0]);}
  if(bulg){a=skPose(q0);var ma=Math.min(a.aR[1],a.tR[1]);a=skMove(a,[0,1.5-ma,0]);a=skMove(a,[b.aR[0]-a.aR[0],0,0]);}
  else a=skMove(a,[b.aR[0]-30-a.aR[0],0,0]);
  return[{J:a,eq:eq(a,1)},{J:b,eq:eq(b)}];}
SK['Lunges']=function(){var p=_skLunge('free');return _skX(p[0],p[1],['side'],'Long step forward, drop the back knee toward the floor. Front knee over the foot, torso upright; push back up.');};
SK['Kettlebell Reverse Lunge']=function(){var p=_skLunge('goblet');return _skX(p[0],p[1],['side'],'Bell at the chest. Step back and lower the back knee toward the floor; front shin stays near vertical. Push through the front heel.');};
SK['Bulgarian Split Squat']=function(){var p=_skLunge('free',true);return _skX(p[0],p[1],['side'],'Rear foot laces-down on a bench. Lower straight down until the front thigh is near parallel; front knee tracks the toes.');};
// ── Calves ───────────────────────────────────────────────────────────────────
function _skCalf(o){o=o||{};var base=o.hold==='kb'?{upperR:[180,8],foreR:[180,8],upperL:[180,6],foreL:[180,6]}:{upper:[180,6],fore:[180,6]};
  if(o.single){base.thighL=185;base.shankL=-110;base.footL=-100;}
  function mk(f){var q=_skQ(base);q.foot=[f,8];if(o.single)q.footL=-100;return _skStandQ(q);}
  var a=mk(92),b=mk(158);function eq(J){var e=[];if(o.hold==='kb')e.push({t:'kb',at:'wR',dy:5});return e;}
  return _skX({J:a,eq:eq(a)},{J:b,eq:eq(b)},['side'],o.cue);}
SK['Calf Raises']=function(){return _skCalf({cue:'Stand tall on the balls of the feet. Rise as high as you can, pause, lower the heels slowly.'});};
SK['Kettlebell Calf Raise']=function(){return _skCalf({hold:'kb',cue:'Bell in one hand. Rise as high as you can onto the balls of the feet, pause, lower slowly.'});};
SK['Single-leg Calf Raise']=function(){return _skCalf({single:true,cue:'On one foot, light hand support. Rise as high as you can, pause, lower the heel slowly.'});};
SK['Seated Calf Raise']=function(){
  function mk(f){var q=_skQ({thigh:90,shank:180,foot:[f,8],upper:150,fore:120});var J=skPose(q);var m=Math.min(J.tR[1],J.aR[1]);J=skMove(J,[0,1.5-m,0]);
    return{J:J,eq:[{t:'box',x:[J.hip[0]-12,J.hip[0]+8],y:[J.hip[1]-6,J.hip[1]-3]},{t:'line',a:[J.hip[0]-4,J.hip[1]-6,0],b:[J.hip[0]-4,0,0],w:2.4},{t:'box',x:[J.kR[0]-6,J.kR[0]+2],y:[J.kR[1]+2,J.kR[1]+6],c:SK_C.ac}]};}
  return _skX(mk(92),mk(158),['side'],'Pad on the lower thighs, balls of the feet on the step. Lower the heels fully, then press up as high as you can.');};
// ── Hip thrust / bridges ─────────────────────────────────────────────────────
function _skBridge(o){
  var S=o.bench?[0,24]:[0,3.5],A=[o.bench?44:42,1.5];
  function mk(t){var tr=t*Math.PI/180,H=[S[0]-30*Math.sin(tr),S[1]-30*Math.cos(tr)];
    var q={torso:t,neck:o.bench?t:-90,upper:o.bench?[-90,75]:95,fore:o.bench?[-90,75]:90};var J=_skHipAnkle(q,H,A);
    if(o.single){var th=J.kR,dir=[th[0]-J.hR[0],th[1]-J.hR[1]],len=Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]);var p=Math.atan2(dir[0],dir[1])*180/Math.PI;
      var q2=_skQ(q);var ik=_skLegIK(H,A);q2.thigh=ik[0];q2.shank=ik[1];q2.thighL=p;q2.shankL=p;q2.footL=p-60;J=skMove(skPose(q2),[H[0],H[1],0]);}
    var e=[];if(o.bench)e=e.concat(_skBench(-40,4,22));
    if(o.hold==='bar')e.push({t:'bar',at:[J.hip[0],Math.max(J.hip[1]+4,12),0]});
    if(o.hold==='kb')e.push({t:'kb',at:[J.hip[0],J.hip[1]+4,0],dy:-1});
    return{J:J,eq:e};}
  return _skX(mk(o.bench?-42:-90),mk(o.bench?-92:-118),['side'],o.cue);}
SK['Hip Thrust']=function(){return _skBridge({bench:true,hold:'bar',cue:'Upper back on the bench, bar over the hips, feet flat. Drive the hips up until the body is flat from shoulders to knees; chin tucked, squeeze the glutes.'});};
SK['Kettlebell Glute Bridge']=function(){return _skBridge({hold:'kb',cue:'On your back, feet flat, bell on the hips. Drive the hips up to a straight line from shoulders to knees, squeeze, lower slowly.'});};
SK['Single-leg Glute Bridge']=function(){return _skBridge({single:true,cue:'One foot planted, the other leg straight in line with the thigh. Drive the hips up level, squeeze, lower slowly.'});};
// ── Leg curl / extension / Nordic ────────────────────────────────────────────
function _skProneCurl(band){
  var H=band?[0,4]:[0,26];
  function mk(sh){var J=skMove(skPose(_skQ({torso:-90,neck:-78,thigh:90,shank:sh,foot:sh+80,upper:band?-90:180,fore:band?-90:160})),[H[0],H[1],0]);
    var e=band?[{t:'band',from:['aR'],to:[60,3,0]}]:_skBench(-40,30,22).concat([{t:'box',x:[J.aR[0]-3,J.aR[0]+3],y:[J.aR[1]+2,J.aR[1]+6],c:SK_C.ac},{t:'line',a:[J.aR[0],J.aR[1]+2,0],b:[38,21,0],w:2}]);
    return{J:J,eq:e};}
  return _skX(mk(90),mk(-30),['side'],band?'Face down, band from a low anchor around the ankles. Curl the heels toward the glutes, hips pressed down, lower slowly.':'Face down, pad just above the heels, hips pressed into the bench. Curl the heels toward the glutes, lower slowly.');}
SK['Leg Curl']=function(){return _skProneCurl(false);};
SK['Band Leg Curl']=function(){return _skProneCurl(true);};
SK['Nordic Curl']=function(){
  function mk(th,arms){var q=_skQ({torso:th,neck:th,thigh:180+th,shank:-90,foot:-95,upper:arms[0],fore:arms[1]});var J=skPose(q);var m=Math.min(J.kR[1],J.aR[1],J.tR[1]);J=skMove(J,[-J.kR[0],2-m,0]);
    return{J:J,eq:[{t:'box',x:[J.aR[0]-3,J.aR[0]+3],y:[J.aR[1]+2,J.aR[1]+6],c:SK_C.ac},{t:'box',x:[J.kR[0]-6,J.kR[0]+6],y:[0,1.5]}]};}
  return _skX(mk(0,[160,100]),mk(62,[115,95]),['side'],'Kneel with the ankles held down. Keep hips, torso and head in one line and lower forward as slowly as you can; catch yourself with the hands.');};
function _skLegExt(band){var H=[0,32];
  function mk(sh){var J=skMove(skPose(_skQ({torso:-6,neck:0,thigh:90,shank:sh,foot:sh-90,upper:178,fore:150})),[H[0],H[1],0]);
    var e=_skSeat(H,-6);if(band)e.push({t:'band',from:['aR'],to:[H[0]-4,2,0]});else e.push({t:'box',x:[J.aR[0]+1,J.aR[0]+5],y:[J.aR[1]-3,J.aR[1]+3],c:SK_C.ac});return{J:J,eq:e};}
  return _skX(mk(180),mk(95),['side'],band?'Sit tall on a chair, band from the chair leg around the ankle. Straighten the knee fully, pause, lower slowly.':'Back against the pad, pad on the front of the ankles. Straighten the knees fully, pause, lower slowly.');}
SK['Leg Extension']=function(){return _skLegExt(false);};
SK['Band Leg Extension']=function(){return _skLegExt(true);};
function _skHipMachine(open){var H=[0,32];
  function mk(a){var J=skMove(skPose(_skQ({torso:-6,thigh:[90,a],shank:[180,a],foot:[90,a],upper:178,fore:150})),[H[0],H[1],0]);
    return{J:J,eq:_skSeat(H,-6).concat([{t:'box',x:[J.kR[0]-4,J.kR[0]+4],y:[J.kR[1]-5,J.kR[1]+1],z:[J.kR[2]-(open?-2:5),J.kR[2]+(open?5:-2)],c:SK_C.ac},{t:'box',x:[J.kL[0]-4,J.kL[0]+4],y:[J.kL[1]-5,J.kL[1]+1],z:[J.kL[2]-(open?5:-2),J.kL[2]+(open?-2:5)],c:SK_C.ac}])};}
  return open?[mk(4),mk(38)]:[mk(38),mk(4)];}
SK['Hip Abductor (outside hips)']=function(){var p=_skHipMachine(true);return _skX(p[0],p[1],['front'],'Sit tall, pads on the outside of the knees. Push the knees apart as far as you can, pause, return slowly.');};
SK['Hip Adductor (inside hips)']=function(){var p=_skHipMachine(false);return _skX(p[0],p[1],['front'],'Sit tall, pads on the inside of the knees. Squeeze the knees together, pause, open slowly.');};
// ── Leg presses ──────────────────────────────────────────────────────────────
function _skLegPress(deg){var H=[0,26],t=deg===45?-58:-25;
  // The platform is square to the sled's travel (Henrik, 2026-10-12: "weight is not in 90° against legs so it
  // looks off") and the soles sit flat on it: the foot points along the platform, toes up.
  var d=deg===45?[Math.SQRT1_2,Math.SQRT1_2]:[1,0];var n=Math.sqrt(d[0]*d[0]+d[1]*d[1]);d=[d[0]/n,d[1]/n];
  var pp=[-d[1],d[0]],footP=Math.atan2(pp[0],pp[1])*180/Math.PI;
  function mk(dist){var A=[H[0]+d[0]*dist,H[1]+d[1]*dist+(deg===45?0:-4)];
    var J=_skHipAnkle({torso:t,neck:t+10,upper:175,fore:150,foot:footP},H,A);
    var c=[A[0]+d[0]*2.5+pp[0]*3,A[1]+d[1]*2.5+pp[1]*3];
    var plat={t:'slab',a:[c[0]-pp[0]*12,c[1]-pp[1]*12],b:[c[0]+pp[0]*12,c[1]+pp[1]*12],z:[-14,14],w:4,c:SK_C.ac};
    var e=_skSeat(H,t).concat([plat]);
    if(deg===45)e.push({t:'line',a:[H[0]+8,H[1]-20,0],b:[H[0]+8+d[0]*80,H[1]-20+d[1]*80,0],w:2});
    else e.push({t:'line',a:[c[0]+3,0,0],b:[c[0]+3,c[1]-12,0],w:2.4});
    return{J:J,eq:e};}
  return[mk(deg===45?24:25),mk(deg===45?47:46)];}
SK['Leg Press']=function(){var p=_skLegPress(0);return _skX(p[0],p[1],['side'],'Back flat on the pad, feet shoulder width on the platform. Lower until the knees are near 90°, press back without locking the knees.');};
SK['Bilateral Leg Press']=SK['Leg Press'];
SK['45° Leg Press']=function(){var p=_skLegPress(45);return _skX(p[0],p[1],['side'],'Back and hips flat on the pad. Lower the sled until the knees are near 90° without the hips rolling up, press back without locking the knees.');};

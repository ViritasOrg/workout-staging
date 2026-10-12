// ── Pull-ups and hangs ───────────────────────────────────────────────────────
function _skHang(o,barY){var J=skPose(_skQ(o));var m=skMid(J.wR,J.wL);return skMove(J,[-m[0],barY-m[1],0]);}
var _SK_BAR=128;
function _skPull(grip,extra){var a=grip==='under'?[{upper:[2,12],fore:[1,10]},{upper:[150,14],fore:[22,-6]}]:[{upper:[4,24],fore:[2,22]},{upper:[168,42],fore:[8,-14]}];
  function mk(i,legs){var q={};[legs,a[i]].forEach(function(s){for(var k in s)q[k]=s[k];});var J=_skHang(q,_SK_BAR);var e=[{t:'pullbar',at:[0,_SK_BAR+1.5,0],half:32}];
    if(extra)e=e.concat(extra(J,i));return{J:J,eq:e};}
  return[mk(0,{torso:-3,thigh:[183,4],shank:178}),mk(1,{torso:-10,neck:-4,thigh:[165,4],shank:200})];}
function _skPullX(grip,cue,extra){var p=_skPull(grip,extra);var x=_skX(p[0],p[1],['side','front'],cue,false);return x;}
SK['Pull-ups']=function(){return _skPullX('over','Hands a bit wider than the shoulders, palms away. From a dead hang, pull until the chin clears the bar, elbows down and out; lower all the way.');};
SK['Weighted Pull-ups']=function(){return _skPullX('over','Weight hanging from a belt. Dead hang, pull until the chin clears the bar, elbows down and out; lower under control.',function(J){return[{t:'line',a:J.hip,b:[J.hip[0]+2,J.hip[1]-14,0],c:SK_C.ac,w:1.6},{t:'box',x:[J.hip[0]-4,J.hip[0]+8],y:[J.hip[1]-19,J.hip[1]-14],z:[-6,6],c:SK_C.ac}];});};
SK['Chin-ups']=function(){return _skPullX('under','Palms toward you, hands shoulder width. From a dead hang, pull the chest toward the bar with the elbows in front; lower all the way.');};
SK['Assisted Pull-up Machine']=function(){var p=_skPull('over');function knee(st){var J=st.J;var q=_skQ({torso:J===p[0].J?-3:-10,thigh:180,shank:-90});return st;}
  [0,1].forEach(function(i){var st=p[i];var t=i?-10:-3;var J=_skHang({torso:t,neck:i?-4:t,thigh:182,shank:-88,foot:-90,upper:i?[168,42]:[4,24],fore:i?[8,-14]:[2,22]},_SK_BAR);st.J=J;st.eq=[{t:'pullbar',at:[0,_SK_BAR+1.5,0],half:32},{t:'box',x:[J.kR[0]-2,J.aR[0]+2],y:[J.kR[1]-5,J.kR[1]-2],z:[-10,10]},{t:'line',a:[J.kR[0]+4,J.kR[1]-5,0],b:[J.kR[0]+4,0,0],w:2.4}];});
  return _skX(p[0],p[1],['side','front'],'Knees on the pad, hands wider than the shoulders. Pull until the chin clears the bar, lower all the way. Less assistance = harder.');};
SK['Clapping Pull-ups']=function(){var p=_skPull('over');var J=p[1].J;var q=_skQ({torso:-10,neck:-4,thigh:[165,4],shank:200,upper:[150,4],fore:[25,-25]});var K=skPose(q);K=skMove(K,[J.hip[0]-K.hip[0],J.hip[1]-K.hip[1]+8,0]);
  p[1]={J:K,eq:[{t:'pullbar',at:[0,_SK_BAR+1.5,0],half:32}]};return _skX(p[0],p[1],['side','front'],'Explode up from a dead hang so the hands leave the bar at the top; clap once and re-grip before you drop. Only when strict pull-ups are easy.',false);};
function _skMuscleUp(band){var a=_skPull('over')[0];
  var J=_skHang({torso:12,neck:8,thigh:[178,4],shank:186,upper:[182,14],fore:[180,10]},_SK_BAR);var eq=[{t:'pullbar',at:[0,_SK_BAR+1.5,0],half:32}];
  var b={J:J,eq:eq};if(band){a.eq.push({t:'band',from:['aR'],to:[0,_SK_BAR,0]});b.eq.push({t:'band',from:['kR'],to:[0,_SK_BAR,0]});}
  return _skX(a,b,['side','front'],band?'Band looped over the bar under the feet or knees. Pull hard to the chest, roll the wrists over the bar, press to straight arms.':'False grip, dead hang. Pull explosively to the lower chest, lean forward over the bar, then press up to straight arms.',false);}
SK['Muscle Up']=function(){return _skMuscleUp(false);};
SK['Assisted Muscle Up']=function(){return _skMuscleUp(true);};
// ── Pulldowns / straight-arm ─────────────────────────────────────────────────
function _skPulldown(o){var H=[0,30];
  var arms=o.close?[{upper:[6,10],fore:[3,4]},{upper:[160,18],fore:[15,-8]}]:[{upper:[6,26],fore:[3,24]},{upper:[166,46],fore:[10,-16]}];
  function mk(i){var q=_skQ({torso:-12,neck:-6,thigh:90,shank:180,foot:90});for(var k in arms[i])q[k]=arms[i][k];
    if(o.kneel){q.thigh=178;q.shank=-90;q.foot=-90;}
    var J=o.kneel?skStand(skPose(q)):skMove(skPose(q),H);var b=_skBarAt(J,0,0);var e=[];
    if(o.band){e.push({t:'band',from:['wR','wL'],to:[b[0]+18,b[1]+(i?60:30),0]});}
    else{e=e.concat(_skSeat(H));e.push({t:'box',x:[J.kR[0]-4,J.kR[0]+4],y:[J.kR[1]+3,J.kR[1]+7],z:[-12,12]});
      e.push({t:'line',a:b,b:[b[0],118,0],w:1.4},{t:'bar',at:b,noPlate:true,half:o.close?9:28});}
    return{J:J,eq:e};}
  return _skX(mk(0),mk(1),['side','front'],o.cue);}
SK['Lat Pulldown']=function(){return _skPulldown({cue:'Thighs under the pad, hands wider than the shoulders. Lean back slightly and pull the bar to the upper chest, elbows down and out.'});};
SK['Drape Pulldowns']=function(){return _skPulldown({close:true,cue:'Close neutral grip. Lean back slightly and pull the handle to the upper chest, elbows driving down to the ribs.'});};
SK['Band Lat Pull']=function(){return _skPulldown({band:true,kneel:true,cue:'Kneel tall facing a high band anchor. Pull the hands down to the shoulders, elbows down and out, chest up.'});};
function _skStraightArm(band){
  function mk(p){var J=_skStandQ({torso:28,neck:20,thigh:[172,6],shank:186,upper:p,fore:p});var b=_skBarAt(J,0,0);var to=[J.sh[0]+38,108,0];
    var e=band?[{t:'band',from:['wR','wL'],to:to}]:[{t:'line',a:b,b:to,w:1.4},{t:'bar',at:b,noPlate:true,half:16}];return{J:J,eq:e};}
  return _skX(mk(52),mk(168),['side'],band?'Band anchored high in front, slight hip hinge. Arms straight, sweep the hands down to the thighs; feel the lats, not the triceps.':'Cable high in front, slight hip hinge. Arms straight, sweep the bar down in an arc to the thighs; control it back up.');}
SK['Straight-Arm Lat Pushdown']=function(){return _skStraightArm(false);};
SK['Band Straight-arm Pull']=function(){return _skStraightArm(true);};
// ── Rows ─────────────────────────────────────────────────────────────────────
function _skBentRow(kind){
  function mk(row){var arms=row?{upper:[-100,10],fore:[184,4]}:{upper:[180,6],fore:[180,4]};var q=_skQ({torso:68,neck:55,thigh:[160,6],shank:192});
    if(kind==='kb'){q.upperL=[130,10];q.foreL=[180,4];q.thighL=[150,6];q.shankL=180;q.upperR=arms.upper;q.foreR=arms.fore;}else{q.upper=arms.upper;q.fore=arms.fore;}
    var J=_skStandQ(q);var b=_skBarAt(J,0,0),e=[];
    if(kind==='bar')e.push({t:'bar',at:b});
    if(kind==='tbar')e.push({t:'line',a:[b[0]+2,b[1]-6,0],b:[b[0]-45,1.5,0],c:SK_C.ac,w:2.6},{t:'bar',at:[b[0]+2,b[1]-6,0],r:9,half:10});
    if(kind==='kb'){e.push({t:'kb',at:'wR',dy:5});var hl=J.wL;e.push({t:'box',x:[hl[0]-10,hl[0]+10],y:[hl[1]-3,hl[1]],z:[-12,0]},{t:'line',a:[hl[0],hl[1]-3,0],b:[hl[0],0,0],w:2.4});}
    return{J:J,eq:e};}
  return[mk(0),mk(1)];}
SK['Barbell Row']=function(){var p=_skBentRow('bar');return _skX(p[0],p[1],['side'],'Hinge to ~45° or lower, back flat, knees soft. Pull the bar to the lower ribs, elbows back past the torso; lower under control.');};
SK['T-Bar Row']=function(){var p=_skBentRow('tbar');return _skX(p[0],p[1],['side'],'Straddle the bar, hinge with a flat back. Pull the handle to the chest, squeeze the shoulder blades; lower under control.');};
SK['Kettlebell Row']=function(){var p=_skBentRow('kb');return _skX(p[0],p[1],['side'],'One hand on a support, back flat. Row the bell to the hip, elbow close to the body; lower until the arm is straight.');};
SK['Chest-Supported Row']=function(){var H=[0,22];
  function mk(row){var q=_skQ({torso:48,neck:40,thigh:[178,8],shank:180,upper:row?[-100,10]:180,fore:row?184:180});var J=skStand(skPose(q));
    var t=48*Math.PI/180,n=[Math.cos(t),-Math.sin(t)];return{J:J,eq:[{t:'slab',a:[J.hip[0]+n[0]*5,J.hip[1]+n[1]*5],b:[J.sh[0]+n[0]*5,J.sh[1]+n[1]*5],z:[-10,10],w:4},{t:'line',a:[J.hip[0]+6,J.hip[1]-6,0],b:[J.hip[0]+6,0,0],w:2.4},{t:'db'}]};}
  return _skX(mk(0),mk(1),['side'],'Chest on the incline pad, arms hanging. Row the dumbbells up, elbows back, squeeze the shoulder blades; lower all the way.');};
function _skSeatRow(band){var H=band?[0,4]:[0,14],A=[band?49.4:40,band?4:6];
  function mk(i){var arms=i?{upper:[200,8],fore:[90,0]}:{upper:[88,6],fore:[90,0]};var q={torso:i?-4:22,neck:i?0:18};for(var k in arms)q[k]=arms[k];
    var J=_skHipAnkle(q,H,A);var e=[];
    if(band)e.push({t:'band',from:['wR'],to:J.tR});else{e.push({t:'box',x:[-14,22],y:[8,11]},{t:'slab',a:[A[0]+6,0],b:[A[0]+6,16],w:3.6},{t:'line',a:J.wR,b:[A[0]+20,J.wR[1],0],w:1.4},{t:'line',a:[A[0]+20,0,0],b:[A[0]+20,40,0],w:2.4});}
    return{J:J,eq:e};}
  return _skX(mk(0),mk(1),['side'],band?'Sit tall, legs straight, band around the feet. Row the hands to the belly, elbows close and back, squeeze the shoulder blades.':'Sit tall, knees soft, feet on the platform. Row the handle to the belly, elbows back, shoulders down; let the arms reach forward without rounding.');}
SK['Cable Row']=function(){return _skSeatRow(false);};
SK['Band Seated Row']=function(){return _skSeatRow(true);};
function _skInvRow(){var TH=42;
  function mk(arms){var J=skSolve(function(e){var q=_skQ({thigh:90+e,shank:90+e,foot:e-10,torso:-90+e,neck:-90+e});var a=arms(e);for(var k in a)q[k]=a[k];var K=skPose(q);return skMove(K,[40-K.aR[0],1.5-K.aR[1],0]);},0,70,function(J){return J.wR[1]-TH;});
    var x=J.wR[0];return{J:J,eq:[{t:'box',x:[x-46,x+3],y:[TH+1,TH+4]},{t:'line',a:[x-40,TH+1,0],b:[x-40,0,0],w:2.4}]};}
  return[mk(function(e){return{upper:e,fore:e};}),mk(function(e){return{upper:e+160,fore:e+10};})];}
SK['Inverted Row']=function(){var p=_skInvRow();return _skX(p[0],p[1],['side'],'Under a sturdy table, overhand grip on the edge, heels down, body rigid. Pull the chest to the edge, squeeze the shoulder blades; lower all the way.');};
SK['Underhand Inverted Row']=function(){var p=_skInvRow();return _skX(p[0],p[1],['side'],'As the inverted row, palms facing you. Pull the chest to the edge with the elbows close to the body; lower all the way.');};
// ── Face pulls, rear delts, shrugs, upright row ──────────────────────────────
function _skFacePull(band){
  function mk(i){var J=_skStandQ(i?{torso:-4,upper:[90,72],fore:[8,10]}:{torso:2,upper:[82,8],fore:[82,4]});var to=[J.sh[0]+44,J.headc[1]-2,0];
    return{J:J,eq:band?[{t:'band',from:['wR','wL'],to:to}]:[{t:'line',a:skMid(J.wR,J.wL),b:to,w:1.4},{t:'line',a:[to[0],0,0],b:[to[0],to[1]+10,0],w:2.4}]};}
  return _skX(mk(0),mk(1),['side','front'],band?'Band anchored at face height. Pull the hands toward the ears, elbows high and wide, finish with the forearms vertical.':'Rope at face height. Pull toward the face, splitting the rope; elbows high and wide, finish with the hands beside the ears.');}
SK['Face Pulls']=function(){return _skFacePull(false);};
SK['Band Face Pull']=function(){return _skFacePull(true);};
SK['Rear Delt Fly']=function(){
  function mk(a){var J=_skStandQ({torso:72,neck:60,thigh:[165,6],shank:190,upper:[180,a],fore:[180,a]});return{J:J,eq:[{t:'db'}]};}
  return _skX(mk(8),mk(80),['front','side'],'Hinge forward with a flat back, slight bend in the elbows. Raise the dumbbells out to the sides to shoulder height; lead with the elbows.');};
function _skPullApart(cable){
  function mk(a){var J=_skStandQ({upper:[90,a],fore:[90,a+(a<40?-10:0)]});var e=[];
    if(cable)e.push({t:'line',a:J.wR,b:[J.sh[0]+40,J.sh[1],-46],w:1.4},{t:'line',a:J.wL,b:[J.sh[0]+40,J.sh[1],46],w:1.4});
    else e.push({t:'band',from:['wR'],to:J.wL});return{J:J,eq:e};}
  return _skX(mk(-6),mk(86),['top'],cable?'Cables crossed at shoulder height, arms nearly straight. Pull the hands out and back until the arms are in line with the shoulders.':'Band at shoulder height, arms straight. Pull the band apart until it touches the chest, squeeze the shoulder blades.');}
SK['Rear Delt Cable Fly']=function(){return _skPullApart(true);};
SK['Band Rear Delt Fly']=function(){return _skPullApart(false);};
SK['Shrug']=function(){function mk(s){var J=_skStandQ({shrug:s,upper:[180,6],fore:[180,4]});return{J:J,eq:[{t:'bar',at:_skBarAt(J,0,-1)}]};}
  return _skX(mk(0),mk(7),['front','side'],'Arms straight, bar at the thighs. Lift the shoulders straight up toward the ears, pause, lower slowly. No rolling.');};
SK['Upright Row']=function(){function mk(i){var J=_skStandQ(i?{upper:[100,62],fore:[190,-70]}:{upper:[180,6],fore:[180,2]});return{J:J,eq:[{t:'bar',at:_skBarAt(J,0,0),r:10}]};}
  return _skX(mk(0),mk(1),['front','side'],'Hands about shoulder width. Pull the bar up along the body to chest height, elbows leading and no higher than the shoulders.');};
// ── External rotation, prone raises ──────────────────────────────────────────
function _skER(band){function mk(a){var J=_skStandQ({upperR:[180,8],foreR:[90,a],upperL:[180,6],foreL:[180,6]});var to=[J.eR[0]+6,J.eR[1],-44];
    return{J:J,eq:band?[{t:'band',from:['wR'],to:to}]:[{t:'line',a:J.wR,b:to,w:1.4},{t:'line',a:[to[0],0,to[2]],b:[to[0],J.eR[1]+10,to[2]],w:2.4}]};}
  return _skX(mk(-50),mk(55),['top','front'],band?'Elbow pinned to the side, bent 90°, band from the other side. Rotate the forearm out, keep the elbow in; return slowly.':'Elbow pinned to the side (towel under it), bent 90°. Rotate the forearm out against the cable; return slowly.');}
SK['Cable External Rotation']=function(){return _skER(false);};
SK['Band External Rotation']=function(){return _skER(true);};
function _skProne(arms,views,cue){
  function mk(i){var q=_skQ({torso:90,neck:96,thigh:-90,shank:-90,foot:180});var a=arms[i];for(var k in a)q[k]=a[k];var J=skPose(q);J=skMove(J,[0,4-J.hip[1],0]);return{J:J,eq:[{t:'box',x:[J.tR[0]-4,J.headc[0]+9],y:[0,1],z:[-26,26],c:'#26262b'}]};}
  return _skX(mk(0),mk(1),views,cue,views.indexOf('top')<0);}
SK['Prone T-Raise']=function(){return _skProne([{upper:[-90,12],fore:[-90,12]},{upper:[180,88],fore:[180,88]}],['top'],'Face down, thumbs up. Lift the arms out to the sides into a T, squeezing the shoulder blades; lower slowly.');};
SK['Prone Y-Raise']=function(){return _skProne([{upper:[-90,12],fore:[-90,12]},{upper:[90,40],fore:[90,40]}],['top'],'Face down, thumbs up. Lift the arms overhead into a Y, shoulders down away from the ears; lower slowly.');};
SK['Prone External Rotation']=function(){
  function mk(fo){var q=_skQ({torso:90,neck:96,thigh:-90,shank:-90,foot:180,upperR:[180,88],foreR:[fo,0],upperL:[-90,6],foreL:[-90,6]});var J=skPose(q);J=skMove(J,[0,27-J.hip[1],0]);
    return{J:J,eq:_skBench(-44,40,23)};}
  return _skX(mk(180),mk(90),['side','top'],'Face down on a bench, upper arm out to the side, elbow bent 90° with the forearm hanging. Rotate the forearm up until level; lower slowly.');};

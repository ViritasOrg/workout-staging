// ── Lying presses ────────────────────────────────────────────────────────────
function _skLying(o){var top=o.floor?0:22,H=[0,top+(o.floor?3.5:6)];var t=o.incline?-52:-90;
  function mk(i){var arms=o.arms[i];var q={torso:t,neck:t};for(var k in arms)q[k]=arms[k];var A=[H[0]+(o.floor?20:26),1.5];
    var J=o.floor?_skHipAnkle(q,H,A):_skHipAnkle(q,H,[H[0]+24,1.5]);var e=[];
    if(!o.floor){if(o.incline){e.push({t:'box',x:[-12,8],y:[top-3,top]},{t:'line',a:[-2,top-3,0],b:[-2,0,0],w:2.4});var tr=t*Math.PI/180;
        e.push({t:'slab',a:[H[0]-4,H[1]-4],b:[H[0]-4+34*Math.sin(tr)+3,H[1]-4+34*Math.cos(tr)],z:[-10,10],w:4});}
      else e=e.concat(_skBench(-44,6,top));}
    if(o.eq)e=e.concat(o.eq(J,i));return{J:J,eq:e};}
  return _skX(mk(0),mk(1),['side'],o.cue);}
var _SK_PRESS=[{upper:[0,12],fore:[0,8]},{upper:[112,40],fore:[-14,10]}];
SK['Bench Press']=function(){return _skLying({arms:_SK_PRESS,eq:function(J){return[{t:'bar',at:_skBarAt(J,0,1)}];},cue:'Eyes under the bar, shoulder blades pinched, feet planted. Lower the bar to the lower chest, elbows ~45° from the body; press back up over the shoulders.'});};
SK['Close Grip Press']=function(){return _skLying({arms:[{upper:[0,2],fore:[0,0]},{upper:[122,10],fore:[-14,2]}],eq:function(J){return[{t:'bar',at:_skBarAt(J,0,1)}];},cue:'Hands about shoulder width. Lower the bar to the lower chest, elbows tucked close to the body; press back up.'});};
SK['Incline Bench Press']=function(){return _skLying({incline:true,arms:[{upper:[0,12],fore:[0,8]},{upper:[148,40],fore:[18,10]}],eq:function(J){return[{t:'bar',at:_skBarAt(J,0,1)}];},cue:'Bench at 30–45°. Lower the bar to the upper chest, elbows under the bar; press up over the shoulders.'});};
SK['Incline DB Press']=function(){return _skLying({incline:true,arms:[{upper:[0,12],fore:[0,8]},{upper:[148,40],fore:[18,10]}],eq:function(){return[{t:'db'}];},cue:'Bench at 30–45°. Lower the dumbbells to the sides of the upper chest, elbows under the wrists; press up and slightly in.'});};
SK['Kettlebell Floor Press']=function(){return _skLying({floor:true,arms:[{upper:[-0.1+92,40],fore:[0,6]},{upper:[0,12],fore:[0,8]}],eq:function(){return[{t:'kb',at:'wR',dy:-5},{t:'kb',at:'wL',dy:-5}];},cue:'On the floor, knees bent. Upper arms rest on the floor at ~45°; press the bells up over the shoulders, lower until the elbows touch.'});};
SK['Skull Crushers']=function(){return _skLying({arms:[{upper:[-12,6],fore:[-12,6]},{upper:[-14,6],fore:[-125,6]}],eq:function(J){return[{t:'bar',at:_skBarAt(J,0,0),r:7,half:14}];},cue:'Arms vertical, elbows pointing up and still. Bend only at the elbows to lower the bar toward the forehead; extend back up.'});};
// ── Seated / standing presses forward ───────────────────────────────────────
function _skPushFwd(o){var H=[0,32];
  function mk(i){var arms=i?{upper:[o.angle||90,10],fore:[o.angle||90,6]}:{upper:[218,40],fore:[o.angle?(o.angle-10):88,6]};var q=_skQ({torso:o.seat?-6:4,neck:0});for(var k in arms)q[k]=arms[k];
    if(o.seat){q.thigh=90;q.shank=180;q.foot=90;}var J=o.seat?skMove(skPose(q),H):_skStandQ(q);
    if(!o.seat){q.thighL=168;q.shankL=190;q.thighR=192;q.shankR=192;J=_skStandQ(q);}
    var e=[];if(o.seat){e=e.concat(_skSeat(H,-6));var m=skMid(J.wR,J.wL);e.push({t:'line',a:J.wR,b:[J.sh[0]+4,J.sh[1]+(o.angle?16:-2),0],w:2.4});}
    if(o.band)e.push({t:'band',from:['wR'],to:[J.sh[0]-30,J.sh[1]-(o.angle?20:0),0]});
    e.push({t:'db',r:2.2});return{J:J,eq:e};}
  return _skX(mk(0),mk(1),['side'],o.cue);}
SK['Chest Machine Press']=function(){return _skPushFwd({seat:true,cue:'Handles at mid-chest, shoulder blades on the pad. Press forward to straight arms without locking out; return slowly.'});};
SK['Band Chest Press']=function(){return _skPushFwd({band:true,cue:'Band behind you at chest height, staggered stance. Press the hands forward to straight arms, return slowly.'});};
SK['Band Incline Press']=function(){return _skPushFwd({band:true,angle:52,cue:'Band anchored low behind you. Press up and forward at an incline to straight arms, return slowly.'});};
// ── Flys ─────────────────────────────────────────────────────────────────────
function _skFly(o){var H=[0,32];
  function mk(i){var a=o.arms[i];var q=_skQ({torso:o.seat?-4:8,neck:o.seat?0:4});for(var k in a)q[k]=a[k];if(o.seat){q.thigh=90;q.shank=180;q.foot=90;}
    if(!o.seat){q.thighL=170;q.thighR=190;q.shankL=188;q.shankR=188;}
    var J=o.seat?skMove(skPose(q),H):_skStandQ(q);var e=[];
    if(o.seat)e=e.concat(_skSeat(H,-4),[{t:'box',x:[J.eR[0]-2,J.eR[0]+2],y:[J.eR[1]-2,J.wR[1]+2],z:[J.eR[2]-2,J.eR[2]+2],c:SK_C.ac},{t:'box',x:[J.eL[0]-2,J.eL[0]+2],y:[J.eL[1]-2,J.wL[1]+2],z:[J.eL[2]-2,J.eL[2]+2],c:SK_C.ac}]);
    if(o.cable){e.push({t:'line',a:J.wR,b:[J.sh[0]-6,o.low?6:100,46],w:1.4},{t:'line',a:J.wL,b:[J.sh[0]-6,o.low?6:100,-46],w:1.4});e.push({t:'db',r:2});}
    if(o.band){e.push({t:'band',from:['wR','wL'],to:[J.sh[0]-30,o.low?6:J.sh[1],0]});}
    return{J:J,eq:e};}
  return _skX(mk(0),mk(1),o.views||['top'],o.cue);}
SK['Cable Fly']=function(){return _skFly({cable:true,arms:[{upper:[100,82],fore:[100,76]},{upper:[96,14],fore:[96,-14]}],cue:'Cables high, slight bend in the elbows, chest up. Bring the hands together in front of the chest in a hugging arc; open slowly.'});};
SK['Low-to-high Cable Fly']=function(){return _skFly({views:['front','side'],cable:true,low:true,arms:[{upper:[160,46],fore:[160,46]},{upper:[66,12],fore:[60,-14]}],cue:'Cables low, slight bend in the elbows. Sweep the hands up and in to meet at upper-chest height; lower slowly.'});};
SK['Band Chest Fly']=function(){return _skFly({band:true,arms:[{upper:[96,82],fore:[96,76]},{upper:[92,14],fore:[92,-14]}],cue:'Band behind you at chest height, slight bend in the elbows. Bring the hands together in front of the chest; open slowly.'});};
SK['Band Low-to-high Fly']=function(){return _skFly({views:['front','side'],band:true,low:true,arms:[{upper:[160,46],fore:[160,46]},{upper:[66,12],fore:[60,-14]}],cue:'Band anchored low behind. Sweep the hands up and in to meet at upper-chest height; lower slowly.'});};
SK['Pec Deck (chest fly machine)']=function(){return _skFly({views:['front'],seat:true,arms:[{upper:[95,80],fore:[0,4]},{upper:[95,22],fore:[0,4]}],cue:'Back on the pad, forearms on the pads at shoulder height. Squeeze the arms together in front, open slowly to a stretch.'});};
// ── Push-ups ─────────────────────────────────────────────────────────────────
function _skPushup(o){o=o||{};
  function mk(i){var arm=i?(o.armDn||{upper:[-62,o.wa||0],fore:[180,o.wa||0]}):(o.armUp||{upper:[180,o.wa||0],fore:[180,o.wa||0]});
    var J=skSolve(function(t){var q=_skQ({thigh:t-180,shank:t-180,foot:180,torso:t,neck:t});for(var k in arm)q[k]=arm[k];var K=skPose(q);var toeY=o.decline?24:0;return skMove(K,[-45-K.tR[0],toeY-K.tR[1],0]);},40,110,function(J){return -J.wR[1];});
    if(o.plyo&&i){J=skMove(J,[0,8,0]);}
    var e=[];if(o.decline)e.push({t:'box',x:[-52,-36],y:[0,22],z:[-12,12]});return{J:J,eq:e};}
  var v=o.views||['side'];return _skX(mk(o.plyo?1:0),mk(o.plyo?0:1),v,o.cue);}
SK['Push-ups']=function(){return _skPushup({cue:'Hands under the shoulders, body in one straight line. Lower the chest to just above the floor, elbows ~45°; push back up.'});};
SK['Plyo Push-ups']=function(){var x=_skPushup({cue:'From the bottom of a push-up, push explosively so the hands leave the floor; land soft and go straight into the next rep.'});var a=SK['Push-ups']();return _skX(a.end,(function(){var u=a.start;return{J:skMove(u.J,[0,9,0]),eq:[]};})(),['side'],x.cue);};
SK['Decline Push-ups']=function(){return _skPushup({decline:true,cue:'Feet on a chair, hands under the shoulders, body straight. Lower the chest to just above the floor; push back up.'});};
SK['Wide Push-ups']=function(){return _skPushup({wa:30,armDn:{upper:[-60,58],fore:[180,30]},views:['side','front'],cue:'Hands well outside the shoulders, body straight. Lower the chest toward the floor, elbows out; push back up.'});};
SK['Diamond Push-ups']=function(){return _skPushup({wa:-22,armUp:{upper:[180,-14],fore:[180,-22]},armDn:{upper:[-50,-6],fore:[175,-30]},views:['side','front'],cue:'Hands together under the chest, thumbs and fingers forming a diamond. Lower with the elbows close to the body; push back up.'});};
SK['Archer Push-ups']=function(){return _skPushup({armUp:{upperR:[180,30],foreR:[180,30],upperL:[180,30],foreL:[180,30]},armDn:{upperR:[-58,40],foreR:[180,20],upperL:[180,72],foreL:[180,72]},views:['side','front'],cue:'Hands very wide. Lower toward one hand while the other arm stays straight out to the side; push back up and alternate.'});};
SK['Pike Push-ups']=function(){
  function mk(i){var q0=i?{torso:150,neck:165,upper:252,fore:155}:{torso:135,neck:142,upper:142,fore:142};
    var J=skSolve(function(p){var q=_skQ(q0);q.thigh=p;q.shank=p;q.foot=p-90;var K=skPose(q);return skMove(K,[-K.wR[0],-K.wR[1]+1,0]);},181,268,function(J){return J.tR[1]-1;});
    return{J:J,eq:[]};}
  return _skX(mk(0),mk(1),['side'],'Hips high in an inverted V, hands shoulder width. Bend the elbows to lower the top of the head toward the floor in front of the hands; press back up.');};
// ── Dips ─────────────────────────────────────────────────────────────────────
function _skDip(o){var BY=82;
  function mk(i){var q=_skQ({torso:16,neck:12,thigh:172,shank:o.machine?-90:-140,foot:o.machine?-90:-120,upper:i?[-98,8]:[178,8],fore:i?[180,4]:[178,4]});var J=skPose(q);var m=skMid(J.wR,J.wL);J=skMove(J,[-m[0],BY-m[1],0]);
    var e=[{t:'line',a:[J.wR[0]-6,BY-1,J.wR[2]],b:[J.wR[0]+16,BY-1,J.wR[2]],c:SK_C.ac,w:3},{t:'line',a:[J.wR[0]+10,BY-1,0],b:[J.wR[0]+10,0,0],w:2.4}];
    if(o.machine)e.push({t:'box',x:[J.kR[0]-2,J.aR[0]+2],y:[J.kR[1]-5,J.kR[1]-2],z:[-10,10]});return{J:J,eq:e};}
  return _skX(mk(0),mk(1),['side'],o.cue);}
SK['Dips']=function(){return _skDip({cue:'Arms straight on the bars, slight forward lean. Lower until the upper arms are about parallel to the floor; press back up.'});};
SK['Assisted Dip Machine']=function(){return _skDip({machine:true,cue:'Knees on the pad, slight forward lean. Lower until the upper arms are about parallel to the floor; press back up. Less assistance = harder.'});};
SK['Chair Dips']=function(){var C=[-10,26];
  function mk(i){var arms=i?{upper:[-110,10],fore:[176,4]}:{upper:[210,10],fore:[176,4]};var q=_skQ({torso:4,neck:4});for(var k in arms)q[k]=arms[k];
    var K=skPose(q);var H=[C[0]-K.wR[0],C[1]-K.wR[1]];var J=_skHipAnkle(q,H,[36,1.5]);
    return{J:J,eq:[{t:'box',x:[C[0]-18,C[0]+1],y:[C[1]-3,C[1]]},{t:'line',a:[C[0]-15,C[1]-3,0],b:[C[0]-15,0,0],w:2.4},{t:'line',a:[C[0]-2,C[1]-3,0],b:[C[0]-2,0,0],w:2.4}]};}
  return _skX(mk(0),mk(1),['side'],'Hands on the edge of a sturdy chair behind you, feet forward. Bend the elbows straight back to lower the hips; press back up.');};
// ── Overhead presses ─────────────────────────────────────────────────────────
function _skOverhead(o){var H=[0,32];
  function mk(i){var a=o.arms[i];var q=_skQ({torso:o.torso||0,neck:0});for(var k in a)q[k]=a[k];
    if(o.seat){q.thigh=90;q.shank=180;q.foot=90;}if(o.halfKneel){q.thighR=182;q.shankR=-90;q.footR=-90;q.thighL=92;q.shankL=180;}
    var J=o.seat?skMove(skPose(q),H):skStand(skPose(q));var e=o.seat?_skSeat(H,-4):[];
    if(o.eq)e=e.concat(o.eq(J,i));return{J:J,eq:e};}
  return _skX(mk(0),mk(1),o.views||['side','front'],o.cue);}
var _SK_OHP=[{upper:[152,30],fore:[-8,-6]},{upper:[2,14],fore:[0,8]}];
SK['Overhead Press']=function(){return _skOverhead({arms:_SK_OHP,eq:function(J){return[{t:'bar',at:_skBarAt(J,0,1)}];},cue:'Bar on the front of the shoulders, glutes tight. Press straight up, moving the head back then through; finish with the bar over the mid-foot.'});};
SK['Behind the Neck Press']=function(){return _skOverhead({arms:[{upper:[180,82],fore:[-4,-4]},{upper:[-4,16],fore:[-2,8]}],eq:function(J){return[{t:'bar',at:_skBarAt(J,0,1)}];},cue:'Light load, good shoulder mobility only. Bar behind the neck, elbows under the bar; press straight up.'});};
SK['Shoulder Press Machine']=function(){return _skOverhead({seat:true,arms:_SK_OHP,eq:function(J){return[{t:'db',r:2.2}];},cue:'Back on the pad, handles at shoulder height. Press up to straight arms without locking, lower to shoulder height.'});};
SK['Arnold Press']=function(){return _skOverhead({seat:true,arms:[{upper:[150,4],fore:[-4,-14]},{upper:[2,16],fore:[0,8]}],eq:function(){return[{t:'db'}];},cue:'Start with palms facing you in front of the shoulders. Rotate the palms forward as you press overhead; reverse on the way down.'});};
SK['Kettlebell Overhead Press']=function(){return _skOverhead({arms:[{upperR:[152,14],foreR:[-8,-10],upperL:[180,10],foreL:[180,10]},{upperR:[2,10],foreR:[0,6],upperL:[180,14],foreL:[180,14]}],eq:function(J){return[{t:'kb',at:[J.wR[0]-3,J.wR[1],J.wR[2]],dy:1}];},cue:'Bell racked at the shoulder, glutes and abs tight. Press straight up until the arm is locked beside the ear; lower to the rack.'});};
SK['Band Shoulder Press']=function(){return _skOverhead({arms:_SK_OHP,eq:function(J){return[{t:'band',from:['wR'],to:J.tR}];},cue:'Stand on the band, hands at the shoulders. Press straight up to locked arms, lower to the shoulders.'});};
SK['Kettlebell Half-kneeling Press']=function(){return _skOverhead({halfKneel:true,arms:[{upperR:[152,14],foreR:[-8,-10],upperL:[180,10],foreL:[180,10]},{upperR:[2,10],foreR:[0,6],upperL:[180,14],foreL:[180,14]}],eq:function(J){return[{t:'kb',at:[J.wR[0]-3,J.wR[1],J.wR[2]],dy:1}];},cue:'Kneel on the knee on the same side as the bell, front foot flat. Squeeze the glute of the down leg and press straight up.'});};
SK['Landmine Press']=function(){return _skOverhead({views:['side'],torso:10,arms:[{upperR:[152,10],foreR:[-8,-10],upperL:[180,10],foreL:[180,10]},{upperR:[50,8],foreR:[48,6],upperL:[180,10],foreL:[180,10]}],eq:function(J){var w=J.wR;return[{t:'line',a:w,b:[w[0]+58,1.5,0],c:SK_C.ac,w:2.6},{t:'bar',at:[w[0]-2,w[1]-1,0],r:8,half:8}];},cue:'Bar end at the shoulder, staggered stance, lean in slightly. Press up and forward along the bar’s arc to a straight arm.'});};
// ── Raises ───────────────────────────────────────────────────────────────────
function _skRaise(o){var H=[0,32];
  function mk(i){var a=o.arms[i];var q=_skQ({});for(var k in a)q[k]=a[k];if(o.seat){q.thigh=90;q.shank=180;q.foot=90;}
    var J=o.seat?skMove(skPose(q),H):_skStandQ(q);var e=o.seat?_skSeat(H,-4):[];if(o.eq)e=e.concat(o.eq(J,i));return{J:J,eq:e};}
  return _skX(mk(0),mk(1),o.views||['front'],o.cue);}
var _SK_LAT=[{upper:[178,12],fore:[178,14]},{upper:[175,86],fore:[172,80]}];
SK['Lateral Raise']=function(){return _skRaise({arms:_SK_LAT,eq:function(){return[{t:'db'}];},cue:'Slight bend in the elbows. Raise the dumbbells out to the sides to shoulder height, no higher; lower slowly.'});};
SK['Band Lateral Raise']=function(){return _skRaise({arms:_SK_LAT,eq:function(J){return[{t:'band',from:['wR','wL'],to:skMid(J.tR,J.tL)}];},cue:'Stand on the band. Raise the hands out to the sides to shoulder height, elbows slightly bent; lower slowly.'});};
SK['Cable Lateral Raise']=function(){return _skRaise({arms:[{upperR:[178,-8],foreR:[178,-14],upperL:[178,12],foreL:[178,12]},{upperR:[175,86],foreR:[172,80],upperL:[178,12],foreL:[178,12]}],eq:function(J){return[{t:'line',a:J.wR,b:[J.sh[0],5,-22],w:1.4}];},cue:'Cable low on the opposite side, crossing in front of the body. Raise the arm out to shoulder height; lower slowly.'});};
SK['Machine Lateral Raise']=function(){return _skRaise({seat:true,arms:[{upper:[180,10],fore:[90,0]},{upper:[180,84],fore:[90,0]}],eq:function(J){return[{t:'box',x:[J.eR[0]-2,J.eR[0]+2],y:[J.eR[1]-2,J.eR[1]+2],z:[J.eR[2]-3,J.eR[2]+3],c:SK_C.ac},{t:'box',x:[J.eL[0]-2,J.eL[0]+2],y:[J.eL[1]-2,J.eL[1]+2],z:[J.eL[2]-3,J.eL[2]+3],c:SK_C.ac}];},cue:'Pads on the outside of the upper arms. Raise the elbows out to shoulder height; lower slowly.'});};
SK['Front Raise']=function(){return _skRaise({views:['side'],arms:[{upper:[175,6],fore:[175,6]},{upper:[90,6],fore:[88,6]}],eq:function(){return[{t:'db'}];},cue:'Arms nearly straight, no swing. Raise the dumbbells in front to shoulder height; lower slowly.'});};
SK['Y-Raise']=function(){return _skRaise({views:['front','side'],arms:[{upper:[172,10],fore:[172,10]},{upper:[12,38],fore:[10,38]}],eq:function(){return[{t:'db',r:2.4}];},cue:'Light weights, thumbs up. Raise the arms up and out into a Y overhead, shoulders down away from the ears; lower slowly.'});};
SK['Band Y-Raise']=function(){return _skRaise({views:['front','side'],arms:[{upper:[172,10],fore:[172,10]},{upper:[12,38],fore:[10,38]}],eq:function(J){return[{t:'band',from:['wR','wL'],to:skMid(J.tR,J.tL)}];},cue:'Stand on the band, thumbs up. Raise the arms up and out into a Y overhead; lower slowly.'});};
// ── Curls ────────────────────────────────────────────────────────────────────
function _skCurl(o){var H=[0,32];
  function mk(i){var q=_skQ(o.pad?{upper:[138,6],fore:i?[-8,6]:[140,6]}:{upper:[168,6],fore:i?[22,6]:[168,6]});if(o.one){q.upperL=[180,6];q.foreL=[180,6];}
    if(o.seat){q.thigh=90;q.shank=180;q.foot=90;q.torso=8;}var J=o.seat?skMove(skPose(q),H):_skStandQ(q);var e=[];
    if(o.seat)e=e.concat(_skSeat(H));
    if(o.pad){var r=138*Math.PI/180;e.push({t:'slab',a:[J.sR[0]-2,J.sR[1]-5],b:[J.eR[0]+2*Math.sin(r)-1,J.eR[1]-5],z:[-12,12],w:4});if(!o.seat)e.push({t:'line',a:[J.eR[0]-4,J.eR[1]-6,0],b:[J.eR[0]-4,0,0],w:2.4});}
    e=e.concat(o.eq(J,i));return{J:J,eq:e};}
  return _skX(mk(0),mk(1),['side'],o.cue);}
SK['Barbell Curl']=function(){return _skCurl({eq:function(J){return[{t:'bar',at:_skBarAt(J,0,0),r:9}];},cue:'Elbows pinned at the sides. Curl the bar up to the shoulders without swinging; lower all the way.'});};
SK['EZ Bar Curl']=function(){return _skCurl({eq:function(J){return[{t:'bar',at:_skBarAt(J,0,0),r:8,half:18}];},cue:'Grip the angled part of the bar, elbows at the sides. Curl up to the shoulders, lower all the way.'});};
SK['Hammer Curl']=function(){return _skCurl({eq:function(){return[{t:'db'}];},cue:'Palms facing each other, elbows at the sides. Curl up to the shoulders, lower all the way.'});};
SK['Kettlebell Hammer Curl']=function(){return _skCurl({one:true,eq:function(J,i){return[{t:'kb',at:'wR',dy:i?-5:5}];},cue:'Hold the bell by the handle, palm facing in, elbow at the side. Curl up to the shoulder, lower all the way.'});};
SK['Cable Bicep Curl']=function(){return _skCurl({eq:function(J){var b=_skBarAt(J,0,0);return[{t:'line',a:b,b:[J.sh[0]+20,4,0],w:1.4},{t:'bar',at:b,noPlate:true,half:12}];},cue:'Cable low in front, elbows pinned at the sides. Curl the bar to the shoulders, lower all the way.'});};
SK['Band Curl']=function(){return _skCurl({eq:function(J){return[{t:'band',from:['wR','wL'],to:skMid(J.tR,J.tL)}];},cue:'Stand on the band, elbows at the sides. Curl the hands to the shoulders, lower slowly.'});};
SK['Preacher Curl']=function(){return _skCurl({pad:true,eq:function(J){return[{t:'bar',at:_skBarAt(J,0,0),r:8,half:16}];},cue:'Backs of the upper arms flat on the pad. Curl up until the forearms are near vertical; lower to almost straight.'});};
SK['Bicep Curl Machine']=function(){return _skCurl({pad:true,seat:true,eq:function(){return[{t:'db',r:2}];},cue:'Upper arms flat on the pad, elbows lined up with the pivot. Curl up, lower to almost straight.'});};
// ── Triceps ──────────────────────────────────────────────────────────────────
function _skTri(o){var H=[0,32];
  function mk(i){var q=_skQ(o.arms[i]);q.torso=o.torso||0;q.neck=q.torso*0.6;if(o.stagger){q.thighL=166;q.shankL=188;q.thighR=192;q.shankR=192;}
    if(o.seat){q.thigh=90;q.shank=180;q.foot=90;}var J=o.seat?skMove(skPose(q),H):_skStandQ(q);var e=o.seat?_skSeat(H):[];e=e.concat(o.eq(J,i));return{J:J,eq:e};}
  return _skX(mk(0),mk(1),['side'],o.cue);}
SK['Tricep Pushdown']=function(){return _skTri({torso:10,arms:[{upper:[184,6],fore:[40,4]},{upper:[184,6],fore:[182,4]}],eq:function(J){var b=_skBarAt(J,0,0);return[{t:'line',a:b,b:[J.sh[0]+14,112,0],w:1.4},{t:'bar',at:b,noPlate:true,half:10}];},cue:'Elbows pinned at the sides, slight lean. Push the bar down until the arms are straight; let it rise to chest height without moving the elbows.'});};
SK['Band Tricep Extension']=function(){return _skTri({torso:10,arms:[{upper:[184,6],fore:[40,4]},{upper:[184,6],fore:[182,4]}],eq:function(J){return[{t:'band',from:['wR'],to:[J.sh[0]+14,100,0]}];},cue:'Band anchored high, elbows at the sides. Push down until the arms are straight; return slowly.'});};
SK['Overhead Tricep Cable']=function(){return _skTri({torso:32,stagger:true,arms:[{upper:[14,6],fore:[-158,4]},{upper:[16,6],fore:[24,4]}],eq:function(J){return[{t:'line',a:J.wR,b:[J.sh[0]-46,40,0],w:1.4}];},cue:'Facing away from the cable, rope behind the head, elbows up by the ears. Extend the arms forward-up until straight; elbows stay put.'});};
SK['Band Overhead Tricep Extension']=function(){return _skTri({torso:4,arms:[{upper:[-4,6],fore:[-170,4]},{upper:[-2,6],fore:[0,4]}],eq:function(J){return[{t:'band',from:['wR'],to:[J.aR[0]-4,1.5,0]}];},cue:'Band under the back foot, hands behind the head, elbows up by the ears. Extend the arms straight up; elbows stay put.'});};
SK['Tricep Extension Machine']=function(){return _skTri({seat:true,arms:[{upper:[132,6],fore:[0,4]},{upper:[132,6],fore:[132,4]}],eq:function(J){var r=132*Math.PI/180;return[{t:'slab',a:[J.sR[0]-2,J.sR[1]-5],b:[J.eR[0]-1,J.eR[1]-5],z:[-12,12],w:4},{t:'db',r:2}];},cue:'Elbows on the pad lined up with the pivot. Extend the arms fully, return slowly without lifting the elbows.'});};

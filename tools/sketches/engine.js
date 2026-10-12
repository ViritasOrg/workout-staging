// ── Exercise sketches: a tiny 3D stick-figure rig drawn as SVG ──────────────────
// x = forward, y = up, z = the figure's right. Angles in degrees: pitch p from straight
// up (+90 forward, 180 down, -90 back), then abduction a out to the side.
var SK_L={thigh:25,shank:25,foot:8,torso:30,neck:4,upper:17,fore:15,head:6,hipw:5,shw:10};
var SK_C={fg:'#f2f2f2',dim:'#8d8d93',ac:'#e8ff3c',mu:'#5c5c62',head:'#151517'};
function _skDv(p,a,s){p=p*Math.PI/180;a=(a||0)*Math.PI/180;return[Math.sin(p)*Math.cos(a),Math.cos(p)*Math.cos(a),s*Math.sin(a)];}
function _skAd(P,v,l){return[P[0]+v[0]*l,P[1]+v[1]*l,P[2]+v[2]*l];}
function _skSeg(Q,k,n){var v=Q[k+n]!==undefined?Q[k+n]:Q[k];return typeof v==='number'?[v,0]:v;}
function skPose(Q){
  var L=SK_L,J={},hip=[0,0,0];J.hip=hip;var t=_skDv(Q.torso||0,0,1);
  J.sh=_skAd(hip,t,L.torso);var nv=_skDv(Q.neck!==undefined?Q.neck:(Q.torso||0),0,1);
  J.neck=_skAd(J.sh,nv,L.neck);J.headc=_skAd(J.neck,nv,L.head);
  [[1,'R'],[-1,'L']].forEach(function(sn){var s=sn[0],n=sn[1];
    var h=[hip[0],hip[1],hip[2]+s*L.hipw];J['h'+n]=h;
    var th=_skSeg(Q,'thigh',n),sh=_skSeg(Q,'shank',n),ft=_skSeg(Q,'foot',n);if(Q['foot'+n]===undefined&&Q.foot===undefined)ft=[90,Q.toeout||8];
    J['k'+n]=_skAd(h,_skDv(th[0],th[1],s),L.thigh);J['a'+n]=_skAd(J['k'+n],_skDv(sh[0],sh[1],s),L.shank);
    J['t'+n]=_skAd(J['a'+n],_skDv(ft[0],ft[1],s),L.foot);
    var sp=J.sh;var shr=(Q.shrug||0);var s0=[sp[0],sp[1]+shr,sp[2]+s*L.shw];J['s'+n]=s0;
    var up=_skSeg(Q,'upper',n),fo=_skSeg(Q,'fore',n);
    J['e'+n]=_skAd(s0,_skDv(up[0],up[1],s),L.upper);J['w'+n]=_skAd(J['e'+n],_skDv(fo[0],fo[1],s),L.fore);});
  return J;}
function skMove(J,d){var o={};for(var k in J)o[k]=[J[k][0]+d[0],J[k][1]+d[1],J[k][2]+(d[2]||0)];return o;}
function skAt(J,k,pt){return skMove(J,[pt[0]===null?0:pt[0]-J[k][0],pt[1]===null?0:pt[1]-J[k][1],0]);}
function skMid(a,b){return[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];}
// Stand on the floor: lowest foot point to y=1.5.
function skStand(J){var m=Math.min(J.aR[1],J.aL[1],J.tR[1],J.tL[1]);return skMove(J,[-(J.aR[0]+J.aL[0])/2,1.5-m,0]);}
// Binary search one pose parameter so f(J)=0 (f increasing in the parameter).
function skSolve(build,lo,hi,f){for(var i=0;i<70;i++){var m=(lo+hi)/2;if(f(build(m))>0)hi=m;else lo=m;}return build((lo+hi)/2);}
var _SKP={side:function(p){return[p[0],p[1]];},front:function(p){return[-p[2],p[1]];},top:function(p){return[p[2],p[0]];}};
function _skFigure(J,view){
  var P=_SKP[view],o=[],B=[['h','k'],['k','a'],['a','t'],['s','e'],['e','w']];
  var near=view==='front'?null:'R';
  ['L','R'].forEach(function(n){var c=(view==='side'&&n==='L')?SK_C.dim:SK_C.fg;
    B.forEach(function(b){o.push(['l',P(J[b[0]+n]),P(J[b[1]+n]),c,4]);});
    o.push(['c',P(J['w'+n]),1.9,c,c,1]);});
  o.push(['l',P(J.hip),P(J.sh),SK_C.fg,4.3]);
  if(view!=='side'){o.push(['l',P(J.hL),P(J.hR),SK_C.fg,4]);o.push(['l',P(J.sL),P(J.sR),SK_C.fg,4]);}
  o.push(['l',P(J.sh),P(J.neck),SK_C.fg,4]);o.push(['c',P(J.headc),SK_L.head,SK_C.fg,SK_C.head,4]);
  return o;}
// Equipment → primitives for one view. Items are built per pose from the joints.
function _skEquip(items,J,view){
  var P=_SKP[view],o=[],ac=SK_C.ac,mu=SK_C.mu;
  function pt(at){if(Array.isArray(at))return at;if(at==='hands')return skMid(J.wR,J.wL);return J[at];}
  (items||[]).forEach(function(it){var t=it.t,c,a,b;
    if(it.views&&it.views.indexOf(view)<0)return;
    if(t==='bar'){c=pt(it.at);var r=it.r||12,hw=it.half||27;
      if(view==='side'){if(!it.noPlate)o.push(['c',P(c),r,ac,'none',2.8]);o.push(['c',P(c),1.6,ac,ac,1]);}
      else{var cc=P(c);var ax=view==='front'?[[cc[0]-hw,cc[1]],[cc[0]+hw,cc[1]]]:[[cc[0]-hw,cc[1]],[cc[0]+hw,cc[1]]];
        o.push(['l',ax[0],ax[1],ac,2.4]);if(!it.noPlate){var ph=view==='front'?r:3.5;
        o.push(['r',[ax[0][0]-1,cc[1]-ph],[ax[0][0]+3,cc[1]+ph],ac]);o.push(['r',[ax[1][0]-3,cc[1]-ph],[ax[1][0]+1,cc[1]+ph],ac]);}}}
    else if(t==='db'){(it.on||['wR','wL']).forEach(function(k){o.push(['c',P(J[k]),it.r||3,ac,SK_C.head,2.2]);});}
    else if(t==='kb'){c=pt(it.at);var q=P(c);o.push(['c',[q[0],q[1]-(it.dy===undefined?5.5:it.dy)],4.6,ac,SK_C.head,2.2]);}
    else if(t==='cable'||t==='band'){(it.from||['wR']).forEach(function(k){a=P(pt(k));b=P(it.to);
      o.push(['l',a,b,t==='cable'?mu:ac,t==='cable'?1.4:1.8,t==='band'?'3 2.5':null]);});
      if(t==='cable')o.push(['c',P(it.to),2.2,mu,mu,1]);}
    else if(t==='box'){var x=it.x,y=it.y,z=it.z||[-9,9];
      if(view==='side')o.push(['r',[x[0],y[0]],[x[1],y[1]],it.c||mu]);
      else if(view==='front')o.push(['r',[-z[1],y[0]],[-z[0],y[1]],it.c||mu]);
      else o.push(['r',[z[0],x[0]],[z[1],x[1]],it.c||mu]);}
    else if(t==='slab'){var p1=it.a,p2=it.b,zz=it.z||[-9,9];
      if(view==='side')o.push(['l',p1,p2,it.c||mu,it.w||3.6]);
      else if(view==='front')o.push(['r',[-zz[1],Math.min(p1[1],p2[1])],[-zz[0],Math.max(p1[1],p2[1])],it.c||mu]);
      else o.push(['r',[zz[0],Math.min(p1[0],p2[0])],[zz[1],Math.max(p1[0],p2[0])],it.c||mu]);}
    else if(t==='line'){o.push(['l',P(it.a),P(it.b),it.c||mu,it.w||2.4,it.dash||null]);}
    else if(t==='pullbar'){c=it.at;if(view==='side')o.push(['c',P(c),2.4,ac,ac,1]);else{var pc=P(c);o.push(['l',[pc[0]-(it.half||30),pc[1]],[pc[0]+(it.half||30),pc[1]],ac,3]);}}
  });return o;}
function _skBBox(prs){var x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;function add(x,y){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  prs.forEach(function(pr){pr.forEach(function(p){if(p[0]==='l'){add(p[1][0],p[1][1]);add(p[2][0],p[2][1]);}else if(p[0]==='c'){add(p[1][0]-p[2],p[1][1]-p[2]);add(p[1][0]+p[2],p[1][1]+p[2]);}else{add(p[1][0],p[1][1]);add(p[2][0],p[2][1]);}});});return[x0,x1,y0,y1];}
function _skSvg(pr,T,W,H){var sx=T[0],ox=T[1],oy=T[2],o=[];function S(p){return[(ox+p[0]*sx).toFixed(1),(oy-p[1]*sx).toFixed(1)];}
  pr.forEach(function(p){if(p[0]==='l'){var a=S(p[1]),b=S(p[2]);o.push('<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+p[3]+'" stroke-width="'+(p[4]*sx).toFixed(1)+'" stroke-linecap="round"'+(p[5]?' stroke-dasharray="'+p[5].split(' ').map(function(v){return(v*sx).toFixed(1);}).join(' ')+'"':'')+'/>');}
    else if(p[0]==='c'){var c=S(p[1]);o.push('<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+(p[2]*sx).toFixed(1)+'" stroke="'+p[3]+'" stroke-width="'+(p[5]*sx).toFixed(1)+'" fill="'+p[4]+'"/>');}
    else{var a2=S([p[1][0],p[2][1]]),b2=S([p[2][0],p[1][1]]);o.push('<rect x="'+a2[0]+'" y="'+a2[1]+'" width="'+(b2[0]-a2[0]).toFixed(1)+'" height="'+(b2[1]-a2[1]).toFixed(1)+'" rx="'+(1.5*sx).toFixed(1)+'" fill="'+p[3]+'"/>');}});
  return '<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" role="img">'+o.join('')+'</svg>';}
// spec: {views:[...], start:{J,eq}, end:{J,eq}, floor:bool}
function skPanels(spec,W,H){W=W||132;H=H||150;var pad=8,out={};
  spec.views.forEach(function(v){var pr=[spec.start,spec.end].map(function(st){var e=_skEquip(st.eq,st.J,v);
      var back=e.filter(function(p){return p[0]==='r'||(p[0]==='l'&&p[3]===SK_C.mu);});var front=e.filter(function(p){return back.indexOf(p)<0;});
      var fl=(spec.floor!==false&&v!=='top')?[['l',[-1e3,0],[1e3,0],SK_C.mu,1.8]]:[];
      return {fl:fl,body:back.concat(_skFigure(st.J,v)).concat(front)};});
    var bb=_skBBox(pr.map(function(x){return x.body;}));if(spec.floor!==false&&v!=='top')bb[2]=Math.min(bb[2],0);
    var sx=Math.min((W-2*pad)/(bb[1]-bb[0]||1),(H-2*pad)/(bb[3]-bb[2]||1));
    var ox=pad+((W-2*pad)-(bb[1]-bb[0])*sx)/2-bb[0]*sx,oy=H-pad-((H-2*pad)-(bb[3]-bb[2])*sx)/2+bb[2]*sx;
    out[v]=pr.map(function(x){var fl=x.fl.map(function(p){return['l',[bb[0]-6,0],[bb[1]+6,0],p[3],p[4]];});return _skSvg(fl.concat(x.body),[sx,ox,oy],W,H);});});
  return out;}

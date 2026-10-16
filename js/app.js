"use strict";
/* ---------- Widerstandstabellen (Mach, Cd) ---------- */
const G1T=[[0,.2629],[.05,.2558],[.1,.2487],[.15,.2413],[.2,.2344],[.25,.2278],[.3,.2214],[.35,.2155],[.4,.2104],[.45,.2061],[.5,.2032],[.55,.202],[.6,.2034],[.7,.2165],[.725,.223],[.75,.2313],[.775,.2417],[.8,.2546],[.825,.2706],[.85,.2901],[.875,.3136],[.9,.3415],[.925,.3734],[.95,.4084],[.975,.4448],[1,.4805],[1.025,.5136],[1.05,.5427],[1.075,.5677],[1.1,.5883],[1.125,.6053],[1.15,.6191],[1.2,.6393],[1.25,.6518],[1.3,.6589],[1.35,.6621],[1.4,.6625],[1.45,.6607],[1.5,.6573],[1.55,.6528],[1.6,.6474],[1.65,.6413],[1.7,.6347],[1.75,.628],[1.8,.621],[1.85,.6141],[1.9,.6072],[1.95,.6003],[2,.5934],[2.05,.5867],[2.1,.5804],[2.15,.5743],[2.2,.5685],[2.25,.563],[2.3,.5577],[2.35,.5527],[2.4,.5481],[2.45,.5438],[2.5,.5397],[2.6,.5325],[2.7,.5264],[2.8,.5211],[2.9,.5168],[3,.5133],[3.1,.5105],[3.2,.5084],[3.3,.5067],[3.4,.5054],[3.5,.504],[3.6,.503],[3.7,.5022],[3.8,.5016],[3.9,.501],[4,.5006],[4.2,.4998],[4.4,.4995],[4.6,.4992],[4.8,.499],[5,.4988]];
const G7T=[[0,.1198],[.05,.1197],[.1,.1196],[.15,.1194],[.2,.1193],[.25,.1194],[.3,.1194],[.35,.1194],[.4,.1193],[.45,.1193],[.5,.1194],[.55,.1193],[.6,.1194],[.65,.1197],[.7,.1202],[.725,.1207],[.75,.1215],[.775,.1226],[.8,.1242],[.825,.1266],[.85,.1306],[.875,.1368],[.9,.1464],[.925,.166],[.95,.2054],[.975,.2993],[1,.3803],[1.025,.4015],[1.05,.4043],[1.075,.4034],[1.1,.4014],[1.125,.3987],[1.15,.3955],[1.2,.3884],[1.25,.381],[1.3,.3732],[1.35,.3657],[1.4,.358],[1.5,.344],[1.55,.3376],[1.6,.3315],[1.65,.326],[1.7,.3209],[1.75,.316],[1.8,.3117],[1.85,.3078],[1.9,.3042],[1.95,.301],[2,.298],[2.05,.2951],[2.1,.2922],[2.15,.2892],[2.2,.2864],[2.25,.2835],[2.3,.2807],[2.35,.2779],[2.4,.2752],[2.45,.2725],[2.5,.2697],[2.55,.267],[2.6,.2643],[2.65,.2615],[2.7,.2588],[2.75,.2561],[2.8,.2533],[2.85,.2506],[2.9,.2479],[2.95,.2451],[3,.2424],[3.1,.2368],[3.2,.2313],[3.3,.2258],[3.4,.2205],[3.5,.2154],[3.6,.2106],[3.7,.206],[3.8,.2017],[3.9,.1975],[4,.1935],[4.2,.1861],[4.4,.1793],[4.6,.173],[4.8,.1672],[5,.1618]];
const TABS={G1:{m:G1T.map(r=>r[0]),c:G1T.map(r=>r[1])},G7:{m:G7T.map(r=>r[0]),c:G7T.map(r=>r[1])}};
function cd(t,M){const m=t.m,c=t.c,n=m.length;if(M<=m[0])return c[0];if(M>=m[n-1])return c[n-1];let lo=0,hi=n-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(m[mid]>M)hi=mid;else lo=mid;}return c[lo]+(M-m[lo])/(m[hi]-m[lo])*(c[hi]-c[lo]);}

/* ---------- Bibliothek ----------
 w: Geschoss g, mv: v0 m/s (Hersteller), bl: Referenzlauf in Zoll, bc, model.
 k: Skalenlänge der Lauf-Schätzung (Zoll), je Kaliber. */
const LIB=[
 {id:'556',name:'.223 Rem / 5.56×45',k:8,loads:[
  {id:'sp-ds1-41',name:'SwissP DS-1 4.1 g / 63 gr',w:4.1,mv:950,bl:23.62,bc:.3678,model:'G1',note:'SwissP Datenblatt: 950 ± 15 m/s bei 600 mm, BC 0.3678 (ICAO, hier als G1). Die angegebene Energie von 1773 J passt rechnerisch zu 930 m/s, nicht zu 950 m/s.'},
  {id:'sp-ball-41',name:'SwissP Ball 4.1 g / 63 gr',w:4.1,mv:930,bl:23.62,bc:.3678,model:'G1',note:'SwissP Datenblatt: 930 ± 15 m/s bei 600 mm, 1773 J, BC 0.3678 (ICAO, hier als G1).'},
  {id:'sp-ds1-36',name:'SwissP DS-1 3.6 g / 55 gr',w:3.6,mv:1010,bl:23.62,bc:.3372,model:'G1',note:'SwissP Datenblatt: 1010 ± 15 m/s bei 600 mm, 1836 J, BC 0.3372 (ICAO, hier als G1).'},
  {id:'gp90',name:'GP 90 (4.1 g)',w:4.1,mv:905,bl:20.79,bc:.36,model:'G1',note:'v0 905 m/s ab Stgw 90 (528 mm). BC geschätzt, angenommen ähnlich SwissP 4.1 g.'},
  {id:'m193',name:'M193 55 gr FMJ',w:3.56,mv:990,bl:20,bc:.243,model:'G1',note:'Typische Werte ab 20″ Lauf.'},
  {id:'m855',name:'M855 / SS109 62 gr',w:4.02,mv:940,bl:20,bc:.304,model:'G1',note:'Typische Werte ab 20″ Lauf.'},
  {id:'smk69',name:'69 gr SMK',w:4.47,mv:885,bl:18,bc:.301,model:'G1',note:'Typische Werte ab 18″ Lauf.'},
  {id:'mk262',name:'Mk 262 77 gr OTM',w:4.99,mv:838,bl:18,bc:.372,model:'G1',note:'Typische Werte ab 18″ Lauf.'}]},
 {id:'300blk',name:'.300 AAC Blackout',k:4.5,loads:[
  {id:'b110',name:'110 gr Überschall',w:7.13,mv:716,bl:16,bc:.29,model:'G1',note:'Typische Werte ab 16″.'},
  {id:'b125',name:'125 gr OTM',w:8.1,mv:655,bl:16,bc:.35,model:'G1',note:'Typische Werte ab 16″.'},
  {id:'b220',name:'220 gr Unterschall',w:14.26,mv:310,bl:9,bc:.61,model:'G1',note:'Unterschall. Typische Werte ab 9″.'}]},
 {id:'76239',name:'7.62×39',k:6,loads:[{id:'fmj123',name:'123 gr FMJ',w:7.97,mv:715,bl:16,bc:.275,model:'G1',note:'Typische Werte ab 16″.'}]},
 {id:'308',name:'.308 Win / 7.62×51',k:9,loads:[
  {id:'m80',name:'M80 147 gr FMJ',w:9.53,mv:838,bl:22,bc:.40,model:'G1',note:'Typische Werte ab 22″.'},
  {id:'smk168',name:'168 gr SMK',w:10.89,mv:808,bl:24,bc:.218,model:'G7',note:'Typische Werte ab 24″.'},
  {id:'m118',name:'M118LR 175 gr SMK',w:11.34,mv:792,bl:24,bc:.243,model:'G7',note:'Typische Werte ab 24″.'}]},
 {id:'7555',name:'7.5×55 Swiss',k:9,loads:[{id:'gp11',name:'GP 11 (11.3 g)',w:11.3,mv:780,bl:22.95,bc:.50,model:'G1',note:'v0 ab Stgw 57 (583 mm). BC geschätzt.'}]},
 {id:'65cm',name:'6.5 Creedmoor',k:10,loads:[{id:'eldm140',name:'140 gr ELD Match',w:9.07,mv:826,bl:24,bc:.326,model:'G7',note:'Herstellerwerte ab 24″.'}]},
 {id:'338',name:'.338 Lapua Magnum',k:12,loads:[{id:'smk300',name:'300 gr SMK',w:19.44,mv:838,bl:27,bc:.768,model:'G1',note:'Typische Werte ab 27″.'}]},
 {id:'9mm',name:'9×19 (PCC)',k:3,loads:[
  {id:'p124',name:'124 gr FMJ',w:8.04,mv:380,bl:16,bc:.15,model:'G1',note:'Typische Werte ab 16″ Karabiner, nicht ab Pistole.'},
  {id:'p147',name:'147 gr FMJ',w:9.53,mv:300,bl:16,bc:.19,model:'G1',note:'Typische Werte ab 16″ Karabiner.'}]},
 {id:'22lr',name:'.22 LR',k:4,loads:[
  {id:'sv40',name:'40 gr Standard Velocity',w:2.59,mv:330,bl:18,bc:.12,model:'G1',note:'Typische Werte ab Gewehrlauf.'},
  {id:'hv40',name:'40 gr High Velocity',w:2.59,mv:383,bl:18,bc:.12,model:'G1',note:'Typische Werte ab Gewehrlauf.'}]},
];
const RTB=[
 {id:'ar15',name:'AR-15 / M4 Flat-Top (DI)',v:1.22},
 {id:'ar15p',name:'Piston AR mit Standard-Upper',v:1.22},
 {id:'arpr',name:'Piston AR mit erhöhter Schiene',v:1.59},
 {id:'ar10',name:'AR-10 / SR-25',v:1.32},
 {id:'free',name:'Frei wählbar',v:null}];
const RTBNOTE={ar15:'Richtwert 1.22″, Quellen nennen 1.1 bis 1.22″.',ar15p:'Ein Piston-System ändert die Upper-Geometrie nicht: gleich wie DI, sofern ein Standard-Upper verwendet wird.',arpr:'Wert 1.59″. Stark systemabhängig, nachmessen.',ar10:'Richtwert 1.32″ (DPMS-Muster).',free:'Eigenen Messwert eintragen.'};
const MOUNTS=[
 {id:'abs',name:'Absolute Co-Witness 1.41″',v:1.41},
 {id:'l13',name:'Lower 1/3 Co-Witness 1.57″',v:1.57},
 {id:'l13h',name:'Lower 1/3 Co-Witness 1.64″',v:1.64},
 {id:'170',name:'1.70″',v:1.70},
 {id:'193',name:'1.93″ (Heads-up)',v:1.93},
 {id:'226',name:'2.26″ (z. B. Unity FAST)',v:2.26},
 {id:'291',name:'2.91″',v:2.91},
 {id:'free',name:'Frei wählbar',v:null}];
const BL_CHIPS=[7.5,10.3,11.5,12.5,14.5,16,18,20,20.79,24];
const RINGS={
 r100:{name:'Ringscheibe Ø 100 cm',d1:100,d10:10,black:40},
 issf50:{name:'ISSF 50 m Gewehr',d1:15.44,d10:1.04,black:11.24},
 issf25:{name:'ISSF 25 m Präzision',d1:50,d10:5,black:20},
 custom:{name:'Ringscheibe frei',d1:60,d10:6,black:24}};

/* ---------- Einheiten ---------- */
const YD=.9144, IN=.0254;
const U={
 get m(){return S.units==='metric';},
 dist(m){return U.m?m:m/YD;}, toM(d){return U.m?d:d*YD;}, dU(){return U.m?'m':'yd';},
 drop(m){return U.m?m*100:m/IN;}, dropU(){return U.m?'cm':'in';},
 vel(v){return U.m?v:v/.3048;}, toVel(x){return U.m?x:x*.3048;}, velU(){return U.m?'m/s':'fps';},
 en(j){return U.m?j:j/1.35582;}, enU(){return U.m?'J':'ft·lbf';},
 w(g){return U.m?g:g/.0647989;}, toW(x){return U.m?x:x*.0647989;}, wU(){return U.m?'g':'gr';},
 len(inch){return U.m?inch*25.4:inch;}, toIn(x){return U.m?x/25.4:x;}, lenU(){return U.m?'mm':'in';},
 alt(m){return U.m?m:m/.3048;}, toAlt(x){return U.m?x:x*.3048;}, altU(){return U.m?'m':'ft';},
 temp(c){return U.m?c:c*9/5+32;}, toTemp(x){return U.m?x:(x-32)*5/9;}, tempU(){return U.m?'°C':'°F';},
 off(cm){return U.m?cm:cm/2.54;}, toOff(x){return U.m?x:x*2.54;}
};
const num=v=>{if(typeof v==='number')return v;const n=parseFloat(String(v).replace(',','.').replace(/[^\d.\-]/g,''));return isFinite(n)?n:NaN;};
const fx=(n,d)=>(Math.round(n*10**d)/10**d).toFixed(d);
const sgn=(n,d)=>{const r=fx(Math.abs(n),d);if(+r===0)return fx(0,d);return (n>0?'+':'−')+r;};
const sgnA=(n,d)=>{const r=fx(Math.abs(n),d);if(+r===0)return fx(0,d);return (n>0?'+':'-')+r;};
const thou=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,tr('num.thou'));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- Zustand ---------- */
const DPOOL=[5,10,15,25,35,50,75,100,150,200,250,300,350,400,450,500,600,700,800,900,1000];
const DPRESET={std:[10,25,50,100,200,300],mid:[25,50,100,200,300,400,500],lr:[100,200,300,400,500,600,800,1000],cqb:[5,10,15,25,50,100],carb:[10,25,50,100,150,200,250,300],dmr:[100,200,300,400,500,600,700,800]};
function defaults(){return{
 v:2,units:'metric',angle:'mrad',cal:'556',loadId:'sp-ds1-41',load:null,mod:false,
 bl:14.5,meas:false,vMeas:900,rtbP:'ar15',rtb:1.22,mountP:'l13',mount:1.57,
 alt:0,temp:15,off:0,zero:50,
 dist:{metric:DPRESET.std.slice(),imperial:DPRESET.std.slice()},
 extra:{metric:[],imperial:[]},
 target:'ipsc',zone:{},ring:'r100',r1:60,r10:6,cmp:true};}
let S=defaults(); let VARS=[]; let CUSTOM=[];
const VFIELDS=['cal','loadId','load','mod','bl','meas','vMeas','rtbP','rtb','mountP','mount','alt','temp','off','zero'];
const clone=o=>JSON.parse(JSON.stringify(o));
function pickV(src){const o={};VFIELDS.forEach(k=>o[k]=clone(src[k]));return o;}
function activeVar(){return VARS.find(v=>v.id===S.av)||VARS[0];}
function syncActive(){const a=activeVar();if(a)a.st=pickV(S);}
function ensureVars(){if(!VARS.length){VARS=[{id:'v'+Date.now().toString(36),label:'A',ci:0,vis:true,st:pickV(S)}];S.av=VARS[0].id;}if(!VARS.some(v=>v.id===S.av)){S.av=VARS[0].id;Object.assign(S,clone(VARS[0].st));}}
function vName(st){return loadName(st.cal,st.loadId,st.load.name)+(st.mod?tr('var.modified'):'');}
const vl=s=>tr('var.label',{n:s.name})+(s.active&&VARS.length>1?tr('var.editing'):'');
function findLoad(cal,id){if(cal==='custom')return CUSTOM.find(l=>l.id===id)||null;const c=LIB.find(c=>c.id===cal);return c?c.loads.find(l=>l.id===id)||null:null;}
function loadName(cal,id,name){return cal==='custom'?name:trx('lib.name.'+id,name);}
function kFor(cal,loadId){if(cal==='custom'){const l=findLoad('custom',loadId);return l&&l.k||8;}const c=LIB.find(c=>c.id===cal);return c?c.k:8;}
function calK(cal){return kFor(cal,S.loadId);}

/* ---------- Speicher: Cookies (24 h), Fallback Browser-Speicher ---------- */
const Store={mode:'mem',TTL:86400,
 init(){
  const sec=location.protocol==='https:';
  const attr=sec?';SameSite=None;Secure':';SameSite=Lax';
  try{document.cookie='zl_t=1;max-age=60;path=/'+attr;if(document.cookie.indexOf('zl_t=1')>-1){this.mode='cookie';this.attr=attr;document.cookie='zl_t=;max-age=0;path=/'+attr;return;}}catch(e){}
  try{localStorage.setItem('zl_t','1');localStorage.removeItem('zl_t');this.mode='local';}catch(e){this.mode='mem';}
 },
 cookies(){const o={};try{document.cookie.split(';').forEach(p=>{const i=p.indexOf('=');if(i<0)return;o[p.slice(0,i).trim()]=p.slice(i+1);});}catch(e){}return o;},
 set(key,val){
  const s=JSON.stringify(val);
  if(this.mode==='cookie'){
   try{const enc=encodeURIComponent(s);const parts=[];for(let i=0;i<enc.length;i+=3000)parts.push(enc.slice(i,i+3000));
    const c=this.cookies();Object.keys(c).forEach(k=>{if(k.indexOf('zl_'+key+'_')===0&&+k.split('_').pop()>=parts.length)document.cookie=k+'=;max-age=0;path=/'+this.attr;});
    parts.forEach((p,i)=>{document.cookie='zl_'+key+'_'+i+'='+p+';max-age='+this.TTL+';path=/'+this.attr;});}catch(e){}
  }else if(this.mode==='local'){try{localStorage.setItem('zl_'+key,JSON.stringify({exp:Date.now()+this.TTL*1000,v:val}));}catch(e){}}
 },
 get(key){
  if(this.mode==='cookie'){const c=this.cookies();let s='',i=0;while(c['zl_'+key+'_'+i]!==undefined){s+=c['zl_'+key+'_'+i];i++;}if(!s)return null;try{return JSON.parse(decodeURIComponent(s));}catch(e){return null;}}
  if(this.mode==='local'){try{const o=JSON.parse(localStorage.getItem('zl_'+key));if(!o||o.exp<Date.now()){localStorage.removeItem('zl_'+key);return null;}return o.v;}catch(e){return null;}}
  return null;
 },
 wipe(){
  try{const c=this.cookies();Object.keys(c).forEach(k=>{if(k.indexOf('zl_')===0)document.cookie=k+'=;max-age=0;path=/'+(this.attr||'');});}catch(e){}
  try{Object.keys(localStorage).forEach(k=>{if(k.indexOf('zl_')===0)localStorage.removeItem(k);});}catch(e){}
 }};
let saveT=null;
function persist(){clearTimeout(saveT);saveT=setTimeout(()=>{Store.set('s',S);syncActive();Store.set('v',VARS);Store.set('c',CUSTOM);},250);}

/* ---------- Ballistik ---------- */
function vFactor(k,ref,L){const A=.656,f=x=>1-A*Math.exp(-x/k);return f(L)/f(ref);}
function effMv(){if(S.meas&&S.vMeas>0)return S.vMeas;return S.load.mv*vFactor(calK(S.cal),S.load.bl,S.bl);}
function atmo(alt,t){const T=t+273.15;const P=101325*Math.pow(Math.max(.2,1-2.25577e-5*alt),5.25588);return{rho:P/(287.05*T),c:331.3*Math.sqrt(T/273.15)};}
function fly(p,th,xMax,rec){
 let x=0,y=-p.h,vx=p.mv*Math.cos(th),vy=p.mv*Math.sin(th),t=0,next=0;
 const K=p.rho*Math.PI/(8*p.bcSI),g=9.80665;
 if(rec){rec.y.push(y);rec.v.push(p.mv);rec.t.push(0);next=1;}
 while(x<xMax){
  const v=Math.hypot(vx,vy);if(v<40)return{stop:true,y};
  const dt=.5/v;
  let k=K*cd(p.tab,v/p.c)*v;
  const hx=vx-k*vx*dt/2,hy=vy+(-k*vy-g)*dt/2;
  const hv=Math.hypot(hx,hy);k=K*cd(p.tab,hv/p.c)*hv;
  const nx=x+hx*dt,ny=y+hy*dt,nvx=vx-k*hx*dt,nvy=vy+(-k*hy-g)*dt;
  if(rec){const nv=Math.hypot(nvx,nvy);while(next<=nx&&next<=xMax){const f=(next-x)/(nx-x);rec.y.push(y+f*(ny-y));rec.v.push(v+f*(nv-v));rec.t.push(t+f*dt);next++;}}
  else if(nx>=xMax){const f=(xMax-x)/(nx-x);return{y:y+f*(ny-y)};}
  x=nx;y=ny;vx=nvx;vy=nvy;t+=dt;
 }
 return{y};
}
function compute(P,xMax){
 if(!(P.bc>0&&P.mv>0&&P.zero>0&&P.h>=0))return{ok:false,err:tr('err.incomplete')};
 const at=atmo(P.alt,P.temp);
 const p={bcSI:P.bc*703.0696,tab:TABS[P.model]||TABS.G1,mv:P.mv,h:P.h,rho:at.rho,c:at.c};
 const f=th=>{const r=fly(p,th,P.zero,null);return r.stop?NaN:r.y-P.off;};
 let a=0,fa=f(a);if(isNaN(fa))return{ok:false,err:tr('err.range')};
 let b=(P.h+P.off)/P.zero+.002,fb=f(b),th=b;
 for(let i=0;i<40;i++){if(isNaN(fb))return{ok:false,err:tr('err.nosol')};if(Math.abs(fb)<1e-7){th=b;break;}const c=b-fb*(b-a)/(fb-fa);a=b;fa=fb;b=c;fb=f(b);th=b;}
 const rec={y:[],v:[],t:[]};fly(p,th,Math.ceil(xMax),rec);
 const y=rec.y;let near=null,far=null,ax=0;
 for(let i=1;i<y.length;i++){
  if(y[i-1]<0&&y[i]>=0&&near===null)near=i-1+y[i-1]/(y[i-1]-y[i]);
  if(y[i-1]>=0&&y[i]<0&&far===null)far=i-1+y[i-1]/(y[i-1]-y[i]);
  if(y[i]>y[ax])ax=i;}
 return{ok:true,y,v:rec.v,t:rec.t,near,far,apex:{x:ax,y:y[ax]},th,w:P.w,P};
}
function at(arr,m){if(!arr||m<0)return null;const i=Math.floor(m);if(i>=arr.length)return null;if(i===arr.length-1)return m===i?arr[i]:null;return arr[i]+(m-i)*(arr[i+1]-arr[i]);}

/* ---------- Scheiben (cm, x um 0 zentriert, y ab Oberkante nach unten) ---------- */
function ringGeo(){const R=S.ring==='custom'?{name:RINGS.custom.name,d1:S.r1,d10:S.r10,black:S.r1*.4}:RINGS[S.ring];return R;}
const TARGETS={
 ipsc:{name:'IPSC Classic',geo(){return{x0:-23,w:46,h:58,zones:[
   {id:'A',label:trx('zone.ipsc.A','A-Zone'),top:3,bottom:35.5,cy:19.25},
   {id:'C',label:trx('zone.ipsc.C','C-Zone'),top:1,bottom:44,cy:22.5},
   {id:'D',label:trx('zone.ipsc.D','Ganze Scheibe'),top:0,bottom:58,cy:29}]};},
  draw(C){return `<polygon points="-7.3,0 7.3,0 23,19.5 23,39 7.3,58 -7.3,58 -23,39 -23,19.5" fill="${C.card}" stroke="${C.cardLine}" stroke-width=".42"/>
   <polygon points="-7,1 7,1 15,13 15,32 6.5,44 -6.5,44 -15,32 -15,13" fill="none" stroke="${C.cardLine}" stroke-width=".42"/>
   <polygon points="-3.5,3 3.5,3 7.5,13 7.5,28 3,35.5 -3,35.5 -7.5,28 -7.5,13" fill="none" stroke="${C.cardLine}" stroke-width=".42"/>
   ${lbl(C,0,26.3,'A')}${lbl(C,-11.3,26.3,'C')}${lbl(C,11.3,26.3,'C')}${lbl(C,-19.5,26.3,'D')}${lbl(C,19.5,26.3,'D')}`;}},
 uspsa:{name:'USPSA (mit Kopf)',geo(){return{x0:-22.86,w:45.72,h:76.2,zones:[
   {id:'A',label:trx('zone.uspsa.A','A-Zone Körper'),top:21,bottom:49,cy:35},
   {id:'C',label:trx('zone.uspsa.C','C-Zone Körper'),top:16.4,bottom:65.8,cy:41.1},
   {id:'AH',label:trx('zone.uspsa.AH','A-Zone Kopf'),top:3.8,bottom:8.2,cy:6},
   {id:'H',label:trx('zone.uspsa.H','Kopf gesamt'),top:0,bottom:14.5,cy:7.25}]};},
  draw(C){return `<polygon points="-8.6,0 8.6,0 8.6,14.5 14.5,14.5 22.86,23.9 22.86,64.9 13.6,76.2 -13.6,76.2 -22.86,64.9 -22.86,23.9 -14.5,14.5 -8.6,14.5" fill="${C.card}" stroke="${C.cardLine}" stroke-width=".42"/>
   <polygon points="-12.4,16.4 12.4,16.4 16.8,23.9 16.8,51.3 7.4,65.8 -7.4,65.8 -16.8,51.3 -16.8,23.9" fill="none" stroke="${C.cardLine}" stroke-width=".42" stroke-dasharray="1 .5"/>
   <rect x="-7.6" y="21" width="15.2" height="28" fill="none" stroke="${C.cardLine}" stroke-width=".42" stroke-dasharray="1 .5"/>
   <rect x="-4.2" y="3.8" width="8.4" height="4.4" rx=".8" fill="none" stroke="${C.cardLine}" stroke-width=".42" stroke-dasharray="1 .5"/>
   ${lbl(C,0,7.2,'A')}${lbl(C,0,39,'A')}${lbl(C,-12,39,'C')}${lbl(C,12,39,'C')}${lbl(C,-19.6,39,'D')}${lbl(C,19.6,39,'D')}`;}},
 idpa:{name:'IDPA',geo(){return{x0:-22.86,w:45.72,h:76.2,zones:[
   {id:'B0',label:trx('zone.idpa.B0','−0 Körper (Ø 20 cm)'),top:21.84,bottom:42.16,cy:32},
   {id:'H0',label:trx('zone.idpa.H0','−0 Kopf (Ø 10 cm)'),top:1.6,bottom:11.8,cy:6.7},
   {id:'B1',label:trx('zone.idpa.B1','−1 Körper'),top:17,bottom:68,cy:42.5}]};},
  draw(C){return `<polygon points="-8.95,0 8.95,0 8.95,14.3 14.9,14.3 22.86,22.9 22.86,62.9 13.9,76.2 -13.9,76.2 -22.86,62.9 -22.86,22.9 -14.9,14.3 -8.95,14.3" fill="${C.card}" stroke="${C.cardLine}" stroke-width=".42"/>
   <polygon points="-10,17 10,17 15.2,22 15.2,60 9,68 -9,68 -15.2,60 -15.2,22" fill="none" stroke="${C.cardLine}" stroke-width=".38" opacity=".9"/>
   <circle cx="0" cy="6.7" r="5.08" fill="none" stroke="${C.cardLine}" stroke-width=".42"/>
   <circle cx="0" cy="32" r="10.16" fill="none" stroke="${C.cardLine}" stroke-width=".42"/>
   ${lbl(C,0,8,'−0')}${lbl(C,0,33.2,'−0')}${lbl(C,0,56,'−1')}${lbl(C,-19,46,'−3')}${lbl(C,19,46,'−3')}`;}},
 man:{name:'Mensch (Silhouette)',geo(){return{x0:-26,w:52,h:96,zones:[
   {id:'T',label:trx('zone.man.T','Brust (Ø 20 cm)'),top:34,bottom:54,cy:44},
   {id:'O',label:trx('zone.man.O','Oberkörper'),top:28,bottom:80,cy:54},
   {id:'K',label:trx('zone.man.K','Kopf'),top:1,bottom:23,cy:12},
   {id:'G',label:trx('zone.man.G','Ganze Silhouette'),top:1,bottom:96,cy:48}]};},
  draw(C){const sil=C.sil||C.ink;return `<ellipse cx="0" cy="12" rx="8.2" ry="11" fill="${sil}"/>
   <path d="M-5.6,19 L5.6,19 L6.4,26.5 C12,27.5 19,28 22.4,31.5 C24.6,34 25.2,40 25.6,48 L26,70 L25.2,96 L20.2,96 L20,72 L19.3,52 L18.4,46.5 L17.4,60 L16.9,80 L17.3,96 L-17.3,96 L-16.9,80 L-17.4,60 L-18.4,46.5 L-19.3,52 L-20,72 L-20.2,96 L-25.2,96 L-26,70 L-25.6,48 C-25.2,40 -24.6,34 -22.4,31.5 C-19,28 -12,27.5 -6.4,26.5 Z" fill="${sil}"/>
   <circle cx="0" cy="44" r="10" fill="none" stroke="${C.card}" stroke-width=".55" stroke-dasharray="1.2 .8"/>
   <ellipse cx="0" cy="12" rx="5" ry="6.5" fill="none" stroke="${C.card}" stroke-width=".5" stroke-dasharray="1.2 .8"/>`;}},
 ring:{name:'Ringscheibe',geo(){const R=ringGeo();const st=(R.d1-R.d10)/9;const zones=[];
   for(let n=10;n>=1;n--){const d=R.d10+(10-n)*st;zones.push({id:'r'+n,label:tr('zone.ring',{n,d:fx(d,d<5?2:1)}),top:R.d1/2-d/2,bottom:R.d1/2+d/2,cy:R.d1/2});}
   return{x0:-R.d1/2,w:R.d1,h:R.d1,zones,ring:R};},
  draw(C,g){const R=g.ring,st=(R.d1-R.d10)/9,cy=R.d1/2,sw=R.d1/320;let s=`<circle cx="0" cy="${cy}" r="${R.d1/2}" fill="${C.ringW}" stroke="${C.ringB}" stroke-width="${sw}"/>`;
   s+=`<circle cx="0" cy="${cy}" r="${R.black/2}" fill="${C.ringB}"/>`;
   for(let n=1;n<=10;n++){const d=R.d10+(10-n)*st;const inB=d<=R.black+1e-9;s+=`<circle cx="0" cy="${cy}" r="${d/2}" fill="none" stroke="${inB?C.ringW:C.ringB}" stroke-width="${sw}"/>`;
    if(n<10&&n%1===0){const x=(d/2+(d-st)/2)/2;const fs=st*.32;s+=`<text x="${x}" y="${cy+fs*.35}" font-size="${fs}" text-anchor="middle" fill="${inB?C.ringW:C.ringB}" font-family="IBM Plex Mono,monospace">${n}</text>`;}}
   return s;}}
};
function lbl(C,x,y,t){return `<text x="${x}" y="${y}" font-size="3.2" text-anchor="middle" fill="${C.cardInk}" opacity=".55" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="600">${t}</text>`;}
function curTarget(){if(!TARGETS[S.target])S.target='ipsc';const T=TARGETS[S.target];const g=T.geo();const z=S.target==='ring'?(g.zones.find(z=>z.id==='r8')||g.zones[0]):g.zones[0];
 const aimY=g.zones[0].cy;/* Haltepunkt immer Mitte der Hauptzone */
 return{T,g,z,aimY,hi:(aimY-z.top)/100,lo:(aimY-z.bottom)/100};}

/* ---------- Paletten ---------- */
const SCREEN={card:'var(--card)',cardLine:'var(--card-line)',cardInk:'var(--card-ink)',ringB:'var(--ring-black)',ringW:'var(--ring-white)',sil:'var(--sil)',ink:'var(--ink)',muted:'var(--muted)',line:'var(--line)',grid:'var(--grid)',panel:'var(--panel)',wall:'var(--wall)',good:'var(--good)',goodSoft:'var(--good-soft)',bad:'var(--bad)',accent:'var(--accent)',ser:i=>`var(--s${i+1})`};
const PRINTC={card:'#D6C4A0',cardLine:'#5A4527',cardInk:'#4A3B24',ringB:'#1B1B1B',ringW:'#F7F5EF',sil:'#2B3036',ink:'#161B21',muted:'#5A646F',line:'#C9D0D7',grid:'#E3E7EB',panel:'#FFFFFF',wall:'#FFFFFF',good:'#2C7A4C',goodSoft:'#DAEEE1',bad:'#B23528',accent:'#D4511C',ser:i=>['#D4511C','#2D64A8','#2E8757','#8B4BB0','#A87C0E','#13868A','#C2416B'][i%7]};

/* ---------- Serien ---------- */
function paramsFrom(st){const mv=st.meas&&st.vMeas>0?st.vMeas:st.load.mv*vFactor(kFor(st.cal,st.loadId),st.load.bl,st.bl);return{bc:st.load.bc,model:st.load.model,mv,w:st.load.w,h:(st.rtb+st.mount)*IN,alt:st.alt,temp:st.temp,zero:st.zero,off:st.off/100};}
function curParams(){return paramsFrom(S);}
function selDistM(){return S.dist[S.units].slice().sort((a,b)=>a-b).map(d=>({d,m:U.toM(d)}));}
function series(){
 syncActive();const a=activeVar();const cp=curParams();
 const out=[{key:a.id,name:a.label,ci:a.ci,P:cp,desc:descParams(vName(S),cp),st:a.st,active:true}];
 VARS.forEach(v=>{if(v.id!==a.id&&v.vis){const P=paramsFrom(v.st);out.push({key:v.id,name:v.label,ci:v.ci,P,desc:descParams(vName(v.st),P),st:v.st});}});
 const dm=selDistM();const xMax=Math.max(dm.length?dm[dm.length-1].m:100,...out.map(o=>o.P.zero),800)*1.02+2;
 out.forEach(o=>{o.res=compute(o.P,Math.min(xMax,2500));});
 return{list:out,xMax,dm};
}
function descParams(name,P){return `${name} · ${fx(U.vel(P.mv),0)} ${U.velU()} · BC ${P.bc} ${P.model} · ${tr('sight.total')} ${fx(U.len(P.h/IN),U.m?1:2)} ${U.lenU()}`;}

/* ---------- Scheibe zeichnen ---------- */
function targetSVG(C,ser,dm,opt){
 opt=opt||{};
 const {T,g,z,aimY}=curTarget();
 const n=ser.length;
 const pts=ser.map(s=>dm.map(o=>{const y=s.res.ok?at(s.res.y,o.m):null;return y==null?null:{d:o.d,m:o.m,cm:y*100,sy:aimY-y*100};}));
 let vTop=0,vBot=g.h;const ext=g.h*.35;
 pts.flat().forEach(p=>{if(!p)return;vTop=Math.min(vTop,Math.max(p.sy,-ext));vBot=Math.max(vBot,Math.min(p.sy,g.h+ext));});
 const pad=g.h*.05;vTop-=pad;vBot+=pad;
 const vh=vBot-vTop;const fs=vh*.03,r=vh*.0105;
 const colX=g.x0+g.w+fs*1.4;               /* Beschriftungsspalte rechts der Scheibe */
 const vx=g.x0-fs*2.2,vw=(colX+fs*10.5)-vx;
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vTop} ${vw} ${vh}"${opt.px?` width="${opt.px}" height="${opt.px*vh/vw}"`:''} font-family="IBM Plex Mono,monospace">`;
 if(opt.bg)s+=`<rect x="${vx}" y="${vTop}" width="${vw}" height="${vh}" fill="${C.wall}"/>`;
 s+=`<g>${T.draw(C,g)}</g>`;
 /* Toleranzzone als Balken links */
 s+=`<line x1="${g.x0-fs*.7}" x2="${g.x0-fs*.7}" y1="${z.top}" y2="${z.bottom}" stroke="${C.good}" stroke-width="${r*.6}"/>`;
 s+=`<text x="${g.x0-fs*1.25}" y="${(z.top+z.bottom)/2}" font-size="${fs*.75}" fill="${C.good}" text-anchor="middle" transform="rotate(-90 ${g.x0-fs*1.25} ${(z.top+z.bottom)/2})" font-family="IBM Plex Sans,Arial,sans-serif">${tr('svg.zone')}</text>`;
 /* Haltepunkt */
 s+=`<g stroke="${C.panel}" stroke-width="${r*.75}" fill="none"><circle cx="0" cy="${aimY}" r="${r*1.9}"/><line x1="${-r*3.4}" x2="${-r*1.2}" y1="${aimY}" y2="${aimY}"/><line x1="${r*1.2}" x2="${r*3.4}" y1="${aimY}" y2="${aimY}"/><line y1="${aimY-r*3.4}" y2="${aimY-r*1.2}" x1="0" x2="0"/><line y1="${aimY+r*1.2}" y2="${aimY+r*3.4}" x1="0" x2="0"/></g>`;
 s+=`<g stroke="${C.ink}" stroke-width="${r*.3}" fill="none"><circle cx="0" cy="${aimY}" r="${r*1.9}"/><line x1="${-r*3.4}" x2="${-r*1.2}" y1="${aimY}" y2="${aimY}"/><line x1="${r*1.2}" x2="${r*3.4}" y1="${aimY}" y2="${aimY}"/><line y1="${aimY-r*3.4}" y2="${aimY-r*1.2}" x1="0" x2="0"/><line y1="${aimY+r*1.2}" y2="${aimY+r*3.4}" x1="0" x2="0"/></g>`;
 const minY=vTop+fs*1.1,maxY=vBot-fs*1.6;
 const labels=[];
 ser.forEach((se,i)=>{
  const off=i===0?0:(i%2?1:-1)*Math.ceil(i/2)*r*2.6;/* bearbeitete Variante immer mittig */const col=C.ser(se.ci);const P=pts[i].filter(Boolean);const rr=i===0?r:r*.8;
  if(n>1&&P.length>1){const pl=P.map(p=>`${off},${Math.max(minY,Math.min(maxY,p.sy))}`).join(' ');s+=`<polyline points="${pl}" fill="none" stroke="${col}" stroke-width="${r*.3}" opacity=".5"/>`;}
  P.forEach(p=>{
   const clipped=p.sy<minY||p.sy>maxY;const y=Math.max(minY,Math.min(maxY,p.sy));
   if(clipped){const up=p.sy<minY;s+=`<path d="M${off-r*1.4},${y+(up?r:-r)} L${off+r*1.4},${y+(up?r:-r)} L${off},${y+(up?-r*1.4:r*1.4)} Z" fill="${col}" stroke="${C.panel}" stroke-width="${r*.25}"/>`;}
   else s+=`<circle cx="${off}" cy="${y}" r="${rr}" fill="${col}" stroke="${C.panel}" stroke-width="${r*.3}"${i?' opacity=".85"':''}/>`;
   if(i===0)labels.push({x:off,y,ty:y,d:p.d,v:U.drop(p.cm/100),clipped});
  });
 });
 /* Beschriftung: Spalte, überlappungsfrei verteilt, mit Führungslinie */
 labels.sort((a,b)=>a.y-b.y);const gap=fs*1.25;
 /* nahe beieinander liegende Treffer zu einer Zeile zusammenfassen */
 const grp=[];labels.forEach(L=>{const last=grp[grp.length-1];if(last&&!L.clipped&&!last.clipped&&L.y-last.items[last.items.length-1].y<gap*.55)last.items.push(L);else grp.push({items:[L],clipped:L.clipped});});
 grp.forEach(G=>{G.y=G.items.reduce((a,L)=>a+L.y,0)/G.items.length;G.ty=G.y;});
 for(let i=0;i<grp.length;i++){grp[i].ty=Math.max(grp[i].y,i?grp[i-1].ty+gap:minY);}
 for(let i=grp.length-1;i>=0;i--){const lim=i===grp.length-1?maxY:grp[i+1].ty-gap;if(grp[i].ty>lim)grp[i].ty=lim;}
 const du=U.dU(),vu=U.dropU(),dec=U.m?0:1;
 grp.forEach(G=>{
  const ty=G.ty,ds=G.items.map(L=>L.d).join(' · ');
  const vs=G.items.map(L=>+fx(L.v,dec));const vmin=Math.min(...vs),vmax=Math.max(...vs);
  const val=vmin===vmax?sgn(vmin,dec):sgn(vmin,dec)+tr('svg.to')+sgn(vmax,dec);
  G.items.forEach(L=>{s+=`<line x1="${L.x+r*1.1}" y1="${L.y}" x2="${g.x0+g.w+fs*.3}" y2="${L.y}" stroke="${C.muted}" stroke-width="${r*.24}" opacity=".95"/>`;});
  const ex=g.x0+g.w+fs*.3;const y0=Math.min(...G.items.map(L=>L.y)),y1=Math.max(...G.items.map(L=>L.y));
  if(y1-y0>r*.5)s+=`<line x1="${ex}" y1="${y0}" x2="${ex}" y2="${y1}" stroke="${C.muted}" stroke-width="${r*.24}" opacity=".95"/>`;
  s+=`<line x1="${ex}" y1="${G.y}" x2="${colX-fs*.25}" y2="${ty}" stroke="${C.muted}" stroke-width="${r*.24}" opacity=".95"/>`;
  s+=`<text x="${colX}" y="${ty+fs*.35}" font-size="${fs}" fill="${C.ink}"><tspan font-weight="600">${ds} ${du}</tspan><tspan fill="${C.muted}" font-size="${fs*.85}"> ${val} ${vu}</tspan></text>`;
 });
 /* Massstab und Legende */
 const sb=g.w>30?10:(g.w>10?5:1);
 s+=`<g><path d="M${g.x0},${vBot-fs*.95} V${vBot-fs*.6} H${g.x0+sb} V${vBot-fs*.95}" fill="none" stroke="${C.ink}" stroke-width="${r*.4}"/><text x="${g.x0+sb+fs*.4}" y="${vBot-fs*.35}" font-size="${fs*.7}" fill="${C.muted}">${U.m?sb+' cm':fx(sb/2.54,1)+' in'}</text></g>`;
 return s+'</svg>';
}

/* ---------- Flugbahn zeichnen ---------- */
function niceTicks(a,b,n){const span=b-a;if(span<=0)return[a];const raw=span/n;const p=Math.pow(10,Math.floor(Math.log10(raw)));const m=raw/p;const st=(m<1.5?1:m<3?2:m<7?5:10)*p;const out=[];for(let v=Math.ceil(a/st)*st;v<=b+1e-9;v+=st)out.push(+v.toFixed(10));return out;}
let GMAP=null;
function graphSVG(C,ser,dm,opt){
 opt=opt||{};const W=opt.w||860,H=opt.h||400,ml=54,mr=18,mt=18,mb=40;const pw=W-ml-mr,ph=H-mt-mb;
 const xMaxD=Math.max(dm.length?dm[dm.length-1].d:100,U.dist(S.zero)*1.15);
 const {z,hi:hiM,lo:loM}=curTarget();const hi=U.drop(hiM),lo=U.drop(loM);
 let yMin=Math.min(0,lo),yMax=Math.max(0,hi);
 const N=320;const curves=ser.map(se=>{if(!se.res.ok)return[];const a=[];for(let i=0;i<=N;i++){const d=xMaxD*i/N;const y=at(se.res.y,U.toM(d));if(y==null)break;const yd=U.drop(y);a.push([d,yd]);}return a;});
 curves.flat().forEach(([,y])=>{yMin=Math.min(yMin,y);yMax=Math.max(yMax,y);});
 const span=yMax-yMin||1;yMax+=span*.08;yMin-=span*.06;
 const X=d=>ml+d/xMaxD*pw,Y=y=>mt+(yMax-y)/(yMax-yMin)*ph;
 let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${opt.px?` width="${W}" height="${H}"`:''} font-family="IBM Plex Mono,monospace" font-size="11">`;
 if(opt.bg)s+=`<rect width="${W}" height="${H}" fill="${C.panel}"/>`;
 /* Zone */
 const zt=Y(Math.min(hi,yMax)),zb=Y(Math.max(lo,yMin));
 if(zb>zt)s+=`<rect x="${ml}" y="${zt}" width="${pw}" height="${zb-zt}" fill="${C.goodSoft}" opacity=".9"/>`;
 s+=`<text x="${ml+6}" y="${zt+13}" fill="${C.good}" font-family="IBM Plex Sans,Arial,sans-serif" font-size="11">${esc(z.label)}</text>`;
 /* Raster */
 niceTicks(0,xMaxD,9).forEach(t=>{s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${mt}" y2="${mt+ph}" stroke="${C.grid}"/><text x="${X(t)}" y="${H-mb+16}" text-anchor="middle" fill="${C.muted}">${t}</text>`;});
 niceTicks(yMin,yMax,7).forEach(t=>{s+=`<line x1="${ml}" x2="${ml+pw}" y1="${Y(t)}" y2="${Y(t)}" stroke="${C.grid}"/><text x="${ml-6}" y="${Y(t)+4}" text-anchor="end" fill="${C.muted}">${sgnA(t,Math.abs(t)<10&&t%1?1:0)}</text>`;});
 s+=`<text x="${ml+pw}" y="${H-6}" text-anchor="end" fill="${C.muted}" font-family="IBM Plex Sans,Arial,sans-serif">${tr('g.dist',{u:U.dU()})}</text>`;
 s+=`<text x="12" y="${mt+ph/2}" fill="${C.muted}" text-anchor="middle" transform="rotate(-90 12 ${mt+ph/2})" font-family="IBM Plex Sans,Arial,sans-serif">${tr('g.y',{u:U.dropU()})}</text>`;
 /* Visierlinie */
 s+=`<line x1="${ml}" x2="${ml+pw}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.ink}" stroke-width="1.3" stroke-dasharray="6 4"/>`;
 s+=`<text x="${ml+pw-4}" y="${Y(0)-6}" text-anchor="end" fill="${C.ink}" font-family="IBM Plex Sans,Arial,sans-serif">${tr('g.los')}</text>`;
 /* Kurven, aktuelle zuletzt */
 ser.map((se,i)=>i).reverse().forEach(i=>{const a=curves[i];if(!a.length)return;s+=`<polyline fill="none" stroke="${C.ser(ser[i].ci)}" stroke-width="${i===0?2.6:1.8}" stroke-linejoin="round" points="${a.map(([d,y])=>X(d).toFixed(1)+','+Y(y).toFixed(1)).join(' ')}"/>`;});
 /* Distanzmarken der aktuellen Serie */
 const c0=ser[0];
 if(c0.res.ok)dm.forEach(o=>{const y=at(c0.res.y,o.m);if(y==null||o.d>xMaxD)return;s+=`<circle cx="${X(o.d)}" cy="${Y(U.drop(y))}" r="3.4" fill="${C.ser(0)}" stroke="${C.panel}" stroke-width="1.4"/>`;});
 /* Zero und fernes Zero */
 /* Zero-Linien und Nulldurchgänge aller Varianten, je in ihrer Farbe */
 ser.forEach((se,i)=>{
  const col=C.ser(se.ci),zd=U.dist(se.P.zero),nm=se.name?se.name+': ':'';
  if(zd<=xMaxD){const right=X(zd)>ml+pw-90;
   s+=`<line x1="${X(zd)}" x2="${X(zd)}" y1="${mt}" y2="${mt+ph}" stroke="${col}" stroke-width="${i?1:1.4}" stroke-dasharray="4 3"/>`;
   s+=`<text x="${X(zd)+(right?-5:5)}" y="${mt+12+i*14}" text-anchor="${right?'end':'start'}" fill="${col}" font-weight="600" stroke="${C.panel}" stroke-width="3" paint-order="stroke">${nm}Zero ${fx(zd,0)}</text>`;}
  if(!se.res.ok)return;
  [[se.res.near,tr('zero.near')],[se.res.far,tr('zero.far')]].forEach(([m,t])=>{if(m==null||Math.abs(m-se.P.zero)<=2)return;const d=U.dist(m);if(d>xMaxD)return;
   s+=`<path d="M${X(d)},${Y(0)-6} l5,6 l-5,6 l-5,-6 Z" fill="${col}" stroke="${C.panel}" stroke-width="1"/><text x="${X(d)+7}" y="${Y(0)+17+i*13}" fill="${col}" font-weight="600" stroke="${C.panel}" stroke-width="3" paint-order="stroke">${nm}${t} ${fx(d,0)}</text>`;});
 });
 if(!opt.px)s+=`<line id="hvLine" x1="0" x2="0" y1="${mt}" y2="${mt+ph}" stroke="${C.muted}" stroke-width="1" visibility="hidden"/><rect id="hvArea" x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="transparent" style="cursor:crosshair"/>`;
 GMAP=opt.px?GMAP:{ml,pw,W,xMaxD,X};
 return s+'</svg>';
}

/* ---------- Zone-Bereiche ---------- */
function zoneRanges(res,xMaxM){
 const {z,hi,lo}=curTarget();
 const out=[];let st=null;const n=Math.min(res.y.length-1,Math.floor(xMaxM));
 for(let i=0;i<=n;i++){const inside=res.y[i]>=lo&&res.y[i]<=hi;if(inside&&st===null)st=i;if(!inside&&st!==null){out.push([st,i-1]);st=null;}}
 if(st!==null)out.push([st,n]);return{out,lo,hi,z,end:n};
}

/* ---------- UI ---------- */
const $=s=>document.querySelector(s);
function fillSelect(el,items,val){el.innerHTML=items.map(i=>`<option value="${esc(i.v)}"${i.v===val?' selected':''}>${esc(i.t)}</option>`).join('');}
function setSeg(id,val){document.querySelectorAll('#'+id+' button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===val)));}
function toast(t){const e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2600);}

function renderSetup(){
 setSeg('segUnits',S.units);setSeg('segAngle',S.angle);setSeg('segLang',LANG);
 const cals=LIB.map(c=>({v:c.id,t:c.name}));cals.push({v:'custom',t:tr('load.customGroup')+(CUSTOM.length?` (${CUSTOM.length})`:'')});
 fillSelect($('#selCal'),cals,S.cal);
 const loads=S.cal==='custom'?CUSTOM.map(l=>({v:l.id,t:l.name})):LIB.find(c=>c.id===S.cal).loads.map(l=>({v:l.id,t:trx('lib.name.'+l.id,l.name)}));
 if(!loads.length)loads.push({v:'',t:tr('load.none')});
 fillSelect($('#selLoad'),loads,S.loadId);
 $('#uW').textContent=U.wU();$('#uV').textContent=U.velU();$('#uVm').textContent=U.velU();$('#uBLr').textContent=U.lenU();$('#uBL').textContent=U.lenU();
 $('#uRtb').textContent=U.lenU();$('#uMount').textContent=U.lenU();$('#uAlt').textContent=U.altU();$('#uTemp').textContent=U.tempU();$('#uOff').textContent=U.dropU();
 const L=S.load;
 $('#inW').value=fx(U.w(L.w),U.m?2:1);$('#inBC').value=L.bc;$('#selModel').value=L.model;
 $('#inV').value=fx(U.vel(L.mv),0);$('#inBLref').value=fx(U.len(L.bl),U.m?0:2);
 $('#inBL').value=fx(U.len(S.bl),U.m?0:2);$('#chkMeas').checked=S.meas;$('#measWrap').hidden=!S.meas;$('#inVm').value=fx(U.vel(S.vMeas),0);
 const src=findLoad(S.cal,S.loadId);
 $('#loadNote').textContent=(S.mod?tr('load.modLib'):'')+(src&&src.note?(S.cal==='custom'?tr('load.customNote'):trx('lib.note.'+src.id,src.note)):(S.cal==='custom'?tr('load.customNote'):''));
 $('#btnDelLoad').hidden=!(S.cal==='custom'&&src);
 fillSelect($('#selRtb'),RTB.map(r=>({v:r.id,t:trx('rtb.'+r.id,r.name)+(r.v?` (${r.v}″)`:'')})),S.rtbP);
 fillSelect($('#selMount'),MOUNTS.map(r=>({v:r.id,t:trx('mount.'+r.id,r.name)})),S.mountP);
 $('#inRtb').value=fx(U.len(S.rtb),U.m?1:2);$('#inMount').value=fx(U.len(S.mount),U.m?1:2);
 $('#rtbNote').textContent=trx('rtbnote.'+S.rtbP,RTBNOTE[S.rtbP]||'');
 $('#inAlt').value=fx(U.alt(S.alt),0);$('#inTemp').value=fx(U.temp(S.temp),0);$('#inOff').value=fx(U.off(S.off),1);
 $('#blChips').innerHTML=BL_CHIPS.map(b=>`<button type="button" class="chip small" data-bl="${b}" aria-pressed="${Math.abs(b-S.bl)<.01}">${U.m?fx(b*25.4,0)+' mm':b+'″'}${b===20.79?' Stgw 90':''}</button>`).join('')+`<button type="button" class="chip small" data-bl="ref" aria-pressed="${Math.abs(S.load.bl-S.bl)<.01}">${tr('bl.ref')}</button>`;
 // Scheibe
 fillSelect($('#selTarget'),Object.keys(TARGETS).map(k=>({v:k,t:trx('target.'+k,TARGETS[k].name)})),S.target);
 $('#ringTools').hidden=S.target!=='ring';
 fillSelect($('#selRing'),Object.keys(RINGS).map(k=>({v:k,t:trx('ring.'+k,RINGS[k].name)})),S.ring);
 $('#ringCustom').hidden=S.ring!=='custom';$('#inR1').value=S.r1;$('#inR10').value=S.r10;
 // Zero
 const zr=$('#zRange');zr.min=5;zr.max=U.m?600:650;zr.step=1;
 $('#zUnit').textContent=U.dU();
 $('#storeNote').textContent=Store.mode==='cookie'?tr('store.cookie'):Store.mode==='local'?tr('store.local'):tr('store.mem');
 renderVCalc();
}
function renderVCalc(){
 const L=S.load,k=calK(S.cal),f=vFactor(k,L.bl,S.bl),est=L.mv*f,mv=effMv();
 const E=w=>.5*(L.w/1000)*w*w;
 const pct=(f-1)*100;
 let h=`<div>${tr('vc.mfr')} <b>${fx(U.vel(L.mv),0)} ${U.velU()}</b> ${tr('vc.at')} ${fx(U.len(L.bl),U.m?0:1)} ${U.lenU()}, ${tr('vc.energy')} <b>${thou(U.en(E(L.mv)))} ${U.enU()}</b></div>`;
 h+=`<div>${tr('vc.est')} ${fx(U.len(S.bl),U.m?0:1)} ${U.lenU()}: <b>${fx(U.vel(est),0)} ${U.velU()}</b> (${sgn(pct,1)} %), <b>${thou(U.en(E(est)))} ${U.enU()}</b> <span class="est">${tr('vc.estTag')}</span></div>`;
 if(S.meas)h+=`<div>${tr('vc.used')} <b>${fx(U.vel(mv),0)} ${U.velU()}</b>, <b>${thou(U.en(E(mv)))} ${U.enU()}</b></div>`;
 h+=`<div style="color:var(--muted)">${tr('vc.model',{k})}</div>`;
 $('#vCalc').innerHTML=h;
 $('#outSH').textContent=fx(U.len(S.rtb+S.mount),U.m?1:2)+' '+U.lenU();
 $('#outSH2').textContent=U.m?fx(S.rtb+S.mount,2)+' in':fx((S.rtb+S.mount)*25.4,1)+' mm';
}

let LAST=null;
function renderResults(){
 const zd=Math.round(U.dist(S.zero));
 if(document.activeElement!==$('#zNum'))$('#zNum').value=zd;
 $('#zRange').value=zd;
 $('#zChips').innerHTML=[10,25,35,50,100,200,300].map(v=>`<button type="button" class="chip" data-z="${v}" aria-pressed="${v===zd}">${v}</button>`).join('');
 const pool=[...new Set([...DPOOL.filter(d=>d<=(U.m?1000:1100)),...S.extra[S.units],...S.dist[S.units]])].sort((a,b)=>a-b);
 const sel=new Set(S.dist[S.units]);
 $('#uDist2').textContent=tr('dist.in',{u:U.dU()});
 $('#distSum').textContent=S.dist[S.units].slice().sort((a,b)=>a-b).join(' · ')+' '+U.dU();
 const EYE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',EYEOFF='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><path d="M4 4l16 16"/></svg>';
 $('#cmpBar').innerHTML=`<span class="lbl">${tr('cmp.variants')}</span>`+VARS.map(v=>{const act=v.id===S.av;const z=act?S.zero:v.st.zero;return `<span class="vchip${act?' act on':(v.vis?' on':'')}"><button type="button" data-va="${v.id}" title="${act?tr('var.editingTitle'):tr('var.pickTitle')}"><i style="background:${SCREEN.ser(v.ci)}"></i>${v.label} · ${fx(U.dist(z),0)} ${U.dU()}</button>${act?'':`<button type="button" class="vx" data-vv="${v.id}" aria-pressed="${v.vis}" aria-label="${tr(v.vis?'var.hideAria':'var.showAria',{n:v.label})}" title="${tr(v.vis?'var.hide':'var.show')}">${v.vis?EYE:EYEOFF}</button>`}${VARS.length>1?`<button type="button" class="vx" data-vd="${v.id}" aria-label="${tr('var.delAria',{n:v.label})}" title="${tr('var.del')}">×</button>`:''}</span>`;}).join('');
 const nVis=1+VARS.filter(v=>v.id!==S.av&&v.vis).length;
 $('#btnPdf').textContent=nVis>1?tr('pdf.btnCmp'):tr('pdf.btn');
 $('#zEq').textContent='= '+(U.m?fx(S.zero/YD,0)+' yd':fx(S.zero,0)+' m');
 $('#dChips').innerHTML=pool.map(d=>`<button type="button" class="chip" data-d="${d}" aria-pressed="${sel.has(d)}">${d}</button>`).join('');
 const R=series();LAST=R;const c=R.list[0].res;
 // Statistik
 let st='';
 if(!c.ok)st=`<span class="err">${esc(c.err)}</span>`;
 else{
  const nd=c.near!=null&&Math.abs(c.near-S.zero)>1.5?c.near:null,fd=c.far!=null&&Math.abs(c.far-S.zero)>1.5?c.far:null;
  if(nd!=null)st+=`<span class="stat" title="${tr('st.nearTitle')}"><span>${tr('st.near')}</span><b>${fx(U.dist(nd),0)} ${U.dU()}</b> <button type="button" data-setz="${fx(U.dist(nd),0)}">${tr('st.apply')}</button></span>`;
  if(fd!=null)st+=`<span class="stat" title="${tr('st.farTitle')}"><span>${tr('st.far')}</span><b>${fx(U.dist(fd),0)} ${U.dU()}</b> <button type="button" data-setz="${fx(U.dist(fd),0)}">${tr('st.apply')}</button></span>`;
  if(fd==null&&c.far==null)st+=`<span class="stat"><span>${tr('zero.far')}</span><b>${tr('st.beyond')} ${fx(U.dist(R.xMax),0)} ${U.dU()}</b></span>`;
  st+=`<span class="stat" title="${tr('st.apexTitle')}"><span>${tr('apex')}</span><b>${sgn(U.drop(c.apex.y),1)} ${U.dropU()}</b><span>${tr('at')} ${fx(U.dist(c.apex.x),0)} ${U.dU()}</span></span>`;
  const sp=vSpread(c,R.dm);if(sp)st+=`<span class="stat" title="${tr('st.spreadTitle')}"><span>${tr('spread')}</span><b>${fx(U.drop(sp.d),1)} ${U.dropU()}</b><span>(${sgn(U.drop(sp.hi),1)} / ${sgn(U.drop(sp.lo),1)})</span></span>`;
  st+=`<span class="stat"><span>${tr('mv')}</span><b>${fx(U.vel(R.list[0].P.mv),0)} ${U.velU()}</b></span>`;
 }
 $('#zStats').innerHTML=st;
 // Legenden
 const leg=R.list.map(s=>`<span><i style="background:${SCREEN.ser(s.ci)}"></i>${esc(vl(s))}</span>`).join('');
 $('#legendT').innerHTML=R.list.length>1?leg:`<span class="hint">${tr('legend.hint',{u:U.dU()})}</span>`;
 $('#legendG').innerHTML=leg;
 $('#tgtHost').innerHTML=targetSVG(SCREEN,R.list,R.dm);
 $('#graphHost').innerHTML=graphSVG(SCREEN,R.list,R.dm);
 bindHover();
 renderTable(R);renderSnaps(R);
}
function corr(y,m){const a=-y/m;return S.angle==='mrad'?a*1000:a*3437.75;}
function renderTable(R){
 const c=R.list[0].res;
 if(!c.ok){$('#tblHost').innerHTML='';return;}
 const zr=zoneRanges(c,R.xMax);
 const au=S.angle==='mrad'?'MRAD':'MOA';
 $('#tblNote').textContent=tr('tbl.note');
 let h=`<table class="tbl"><thead><tr><th>${tr('th.dist',{u:U.dU()})}</th><th>${tr('th.poi',{u:U.dropU()})}</th><th>${tr('th.corr',{u:au})}</th><th>v ${U.velU()}</th><th>${tr('th.energy',{u:U.enU()})}</th><th>${tr('th.tof')}</th></tr></thead><tbody>`;
 const rows=R.dm.slice();if(!rows.some(o=>Math.abs(o.m-S.zero)<.5))rows.push({d:Math.round(U.dist(S.zero)),m:S.zero,z:true});rows.sort((a,b)=>a.m-b.m);
 rows.forEach(o=>{const y=at(c.y,o.m),v=at(c.v,o.m),t=at(c.t,o.m);
  if(y==null){h+=`<tr><td>${o.d}</td><td colspan="5" style="text-align:left;color:var(--muted)">${tr('tbl.oor')}</td></tr>`;return;}
  const inZ=y>=zr.lo&&y<=zr.hi;const isZ=Math.abs(o.m-S.zero)<.5;
  h+=`<tr class="${isZ?'z':''}"><td>${o.d}${isZ?' · Zero':''}</td><td class="${inZ?'in':'out'}">${sgn(U.drop(y),1)}</td><td>${o.m>0?sgn(corr(y,o.m),S.angle==='mrad'?1:1):''}</td><td>${fx(U.vel(v),0)}</td><td>${thou(U.en(.5*c.w/1000*v*v))}</td><td>${fx(t,3)}</td></tr>`;});
 $('#tblHost').innerHTML=h+'</tbody></table>';
}
function vSpread(res,dm){if(!res.ok)return null;const ys=dm.map(o=>at(res.y,o.m)).filter(y=>y!=null);if(!ys.length)return null;const hi=Math.max(...ys),lo=Math.min(...ys);return{d:hi-lo,hi,lo};}
function renderSnaps(R){
 if(R.list.length<2){$('#snapHost').innerHTML=`<div class="empty">${tr('cmp.empty')}</div>`;$('#cmpHost').innerHTML='';return;}
 $('#snapHost').innerHTML='';
 const vis=R.list.slice().sort((a,b)=>a.name.localeCompare(b.name));
 let h=`<table class="tbl"><thead><tr><th>${tr('th.dist',{u:U.dU()})}</th>${vis.map(v=>`<th><span class="dot" style="background:${SCREEN.ser(v.ci)}"></span>${esc(v.name)} · Zero ${fx(U.dist(v.P.zero),0)} · ${U.dropU()}</th>`).join('')}</tr></thead><tbody>`;
 const {hi,lo}=curTarget();
 R.dm.forEach(o=>{h+=`<tr><td>${o.d}</td>${vis.map(v=>{const y=v.res.ok?at(v.res.y,o.m):null;return y==null?'<td>·</td>':`<td class="${y>=lo&&y<=hi?'in':'out'}">${sgn(U.drop(y),1)}</td>`;}).join('')}</tr>`;});
 h+=`<tr class="z"><td>${tr('cmp.spreadHtml')}</td>${vis.map(v=>{const sp=vSpread(v.res,R.dm);return `<td><b>${sp?fx(U.drop(sp.d),1)+' '+U.dropU():'·'}</b></td>`;}).join('')}</tr>`;
 h+=`<tr><td>${tr('zero.far')}</td>${vis.map(v=>`<td>${v.res.ok&&v.res.far!=null?fx(U.dist(v.res.far),0)+' '+U.dU():'·'}</td>`).join('')}</tr>`;
 h+=`<tr><td>${tr('apex')}</td>${vis.map(v=>`<td>${v.res.ok?sgn(U.drop(v.res.apex.y),1):'·'}</td>`).join('')}</tr>`;
 $('#cmpHost').innerHTML=h+'</tbody></table>';
}
function bindHover(){
 const svg=$('#graphHost svg');if(!svg||!GMAP)return;const area=svg.querySelector('#hvArea'),line=svg.querySelector('#hvLine');
 const mv=e=>{const r=svg.getBoundingClientRect();const pt=(e.touches?e.touches[0]:e);const x=(pt.clientX-r.left)/r.width*GMAP.W;const d=Math.max(0,Math.min(GMAP.xMaxD,(x-GMAP.ml)/GMAP.pw*GMAP.xMaxD));
  line.setAttribute('x1',GMAP.X(d));line.setAttribute('x2',GMAP.X(d));line.setAttribute('visibility','visible');
  const m=U.toM(d);$('#readout').innerHTML=`<span>${fx(d,0)} ${U.dU()}</span>`+LAST.list.map(s=>{const y=s.res.ok?at(s.res.y,m):null;return `<span style="color:${SCREEN.ser(s.ci)}">${esc(vl(s))} ${y==null?'·':sgn(U.drop(y),1)+' '+U.dropU()}</span>`;}).join('');};
 area.addEventListener('mousemove',mv);area.addEventListener('touchmove',e=>{mv(e);},{passive:true});area.addEventListener('mouseleave',()=>line.setAttribute('visibility','hidden'));
}
function full(){renderSetup();renderResults();persist();}
function results(){renderVCalc();renderResults();persist();}

/* ---------- Ereignisse ---------- */
function selectLoad(cal,id){S.cal=cal;const l=findLoad(cal,id);if(l){S.loadId=l.id;S.load={name:l.name,w:l.w,mv:l.mv,bl:l.bl,bc:l.bc,model:l.model};S.mod=false;}}
$('#segUnits').addEventListener('click',e=>{const v=e.target.dataset.v;if(!v||v===S.units)return;S.units=v;S.zero=U.toM(Math.round(U.dist(S.zero)));full();});
$('#segAngle').addEventListener('click',e=>{const v=e.target.dataset.v;if(!v)return;S.angle=v;setSeg('segAngle',v);results();});
$('#selCal').addEventListener('change',e=>{const cal=e.target.value;if(cal==='custom'){S.cal='custom';if(CUSTOM.length)selectLoad('custom',CUSTOM[0].id);else{S.loadId='';}}else selectLoad(cal,LIB.find(c=>c.id===cal).loads[0].id);full();});
$('#selLoad').addEventListener('change',e=>{selectLoad(S.cal,e.target.value);full();});
function bindNum(id,fn){$(id).addEventListener('input',e=>{const v=num(e.target.value);if(!isFinite(v))return;fn(v);results();});$(id).addEventListener('change',()=>full());}
bindNum('#inW',v=>{S.load.w=U.toW(v);S.mod=true;});
bindNum('#inBC',v=>{if(v>0){S.load.bc=v;S.mod=true;}});
bindNum('#inV',v=>{if(v>0){S.load.mv=U.toVel(v);S.mod=true;}});
bindNum('#inBLref',v=>{if(v>0){S.load.bl=U.toIn(v);S.mod=true;}});
bindNum('#inBL',v=>{if(v>0)S.bl=U.toIn(v);});
bindNum('#inVm',v=>{if(v>0)S.vMeas=U.toVel(v);});
bindNum('#inRtb',v=>{S.rtb=U.toIn(v);S.rtbP='free';$('#selRtb').value='free';});
bindNum('#inMount',v=>{S.mount=U.toIn(v);S.mountP='free';$('#selMount').value='free';});
bindNum('#inAlt',v=>{S.alt=U.toAlt(v);});
bindNum('#inTemp',v=>{S.temp=U.toTemp(v);});
bindNum('#inOff',v=>{S.off=U.toOff(v);});
$('#selModel').addEventListener('change',e=>{S.load.model=e.target.value;S.mod=true;full();});
$('#chkMeas').addEventListener('change',e=>{S.meas=e.target.checked;if(S.meas)S.vMeas=Math.round(effMvEst());full();});
function effMvEst(){return S.load.mv*vFactor(calK(S.cal),S.load.bl,S.bl);}
$('#blChips').addEventListener('click',e=>{const b=e.target.closest('[data-bl]');if(!b)return;S.bl=b.dataset.bl==='ref'?S.load.bl:+b.dataset.bl;full();});
$('#selRtb').addEventListener('change',e=>{S.rtbP=e.target.value;const r=RTB.find(r=>r.id===S.rtbP);if(r&&r.v)S.rtb=r.v;full();});
$('#selMount').addEventListener('change',e=>{S.mountP=e.target.value;const r=MOUNTS.find(r=>r.id===S.mountP);if(r&&r.v)S.mount=r.v;full();});
$('#btnSaveLoad').addEventListener('click',()=>{const n=$('#inCustName').value.trim()||(loadName(S.cal,S.loadId,S.load.name)+tr('load.ownSuffix'));const id='c'+Date.now().toString(36);
 CUSTOM.push({id,name:n,w:S.load.w,mv:S.load.mv,bl:S.load.bl,bc:S.load.bc,model:S.load.model,k:calK(S.cal),note:'Eigene Laborierung.'});
 $('#inCustName').value='';selectLoad('custom',id);full();toast(tr('load.saved'));});
$('#btnDelLoad').addEventListener('click',()=>{CUSTOM=CUSTOM.filter(l=>l.id!==S.loadId);if(CUSTOM.length)selectLoad('custom',CUSTOM[0].id);else selectLoad('556','sp-ds1-41');full();});
function setZero(d){d=Math.max(1,Math.min(U.m?1500:1650,Math.round(d)));S.zero=U.toM(d);results();}
$('#zRange').addEventListener('input',e=>setZero(+e.target.value));
$('#zNum').addEventListener('input',e=>{const v=num(e.target.value);if(v>=1)setZero(v);});
$('#zNum').addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();setZero(U.dist(S.zero)+(e.shiftKey?5:1));$('#zNum').value=Math.round(U.dist(S.zero));}if(e.key==='ArrowDown'){e.preventDefault();setZero(U.dist(S.zero)-(e.shiftKey?5:1));$('#zNum').value=Math.round(U.dist(S.zero));}});
$('#zMinus').addEventListener('click',()=>setZero(Math.round(U.dist(S.zero))-1));
$('#zPlus').addEventListener('click',()=>setZero(Math.round(U.dist(S.zero))+1));
$('#zChips').addEventListener('click',e=>{const b=e.target.closest('[data-z]');if(b)setZero(+b.dataset.z);});
$('#zStats').addEventListener('click',e=>{const b=e.target.closest('[data-setz]');if(b)setZero(+b.dataset.setz);});
$('#dChips').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const d=+b.dataset.d;const a=S.dist[S.units];const i=a.indexOf(d);if(i>-1){if(a.length>1)a.splice(i,1);}else a.push(d);results();});
function addDist(){const v=Math.round(num($('#dAdd').value));if(!(v>0&&v<=2500))return;if(!S.extra[S.units].includes(v))S.extra[S.units].push(v);if(!S.dist[S.units].includes(v))S.dist[S.units].push(v);$('#dAdd').value='';results();}
$('#dAddBtn').addEventListener('click',addDist);$('#dAdd').addEventListener('keydown',e=>{if(e.key==='Enter')addDist();});
function toggleSet(open){const p=$('#setPanel');p.hidden=open===undefined?!p.hidden:!open;$('#openDist').textContent=p.hidden?tr('dist.open'):tr('dist.close');}
$('#openDist').addEventListener('click',()=>toggleSet());
document.querySelector('.presets').addEventListener('click',e=>{const p=e.target.dataset.preset;if(!p)return;S.dist[S.units]=DPRESET[p].slice();results();});
$('#selTarget').addEventListener('change',e=>{S.target=e.target.value;full();});
$('#selRing').addEventListener('change',e=>{S.ring=e.target.value;full();});
bindNum('#inR1',v=>{if(v>1)S.r1=v;});bindNum('#inR10',v=>{if(v>0)S.r10=Math.min(v,S.r1*.8);});
$('#btnSnap').addEventListener('click',()=>{
 if(VARS.length>=6){toast(tr('var.max'));return;}
 syncActive();const used=new Set(VARS.map(v=>v.ci));let ci=0;while(used.has(ci))ci++;
 const label='ABCDEF'.split('').find(l=>!VARS.some(v=>v.label===l));
 const v={id:'v'+Date.now().toString(36),label,ci,vis:true,st:pickV(S)};VARS.push(v);S.av=v.id;full();
 toast(tr('var.created',{n:label}));});
$('#cmpBar').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.va&&b.dataset.va!==S.av){syncActive();const v=VARS.find(v=>v.id===b.dataset.va);v.vis=true;S.av=v.id;Object.assign(S,clone(v.st));full();}
 if(b.dataset.vv){const v=VARS.find(v=>v.id===b.dataset.vv);v.vis=!v.vis;results();}
 if(b.dataset.vd){const v=VARS.find(v=>v.id===b.dataset.vd);VARS=VARS.filter(x=>x.id!==v.id);if(v.id===S.av){S.av=VARS[0].id;Object.assign(S,clone(VARS[0].st));}full();toast(tr('var.deleted',{n:v.label}));}});
document.querySelectorAll('.help').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const t=$('#help-'+b.dataset.help);const open=t.hidden;t.hidden=!open;b.setAttribute('aria-expanded',String(open));}));
let wipeArm=false;
$('#btnWipe').addEventListener('click',()=>{const b=$('#btnWipe');
 if(!wipeArm){wipeArm=true;b.textContent=tr('wipe.confirm');b.classList.add('armed');setTimeout(()=>{wipeArm=false;b.textContent=tr('wipe.btn');b.classList.remove('armed');},4000);return;}
 Store.wipe();S=defaults();selectLoad('556','sp-ds1-41');VARS=[];CUSTOM=[];ensureVars();wipeArm=false;b.textContent=tr('wipe.btn');b.classList.remove('armed');full();Store.wipe();toast(tr('wipe.done'));});
$('#btnPdf').addEventListener('click',()=>exportPDF(VARS.some(v=>v.id!==S.av&&v.vis)?'compare':'single'));

/* ---------- PDF ---------- */
let DL=null;
(async()=>{try{if(window.claude&&window.claude.use)DL=await window.claude.use('downloads');}catch(e){DL=null;}})();
function svgPng(svg,w,h,scale){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=Math.round(w*scale);c.height=Math.round(h*scale);const x=c.getContext('2d');x.fillStyle='#FFFFFF';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/png'));};img.onerror=rej;img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});}
const hexRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const pdfTxt=s=>String(s).replace(/−/g,'-').replace(/″/g,' in').replace(/’/g,"'").replace(/[^\x20-\xFF·]/g,'');
async function offerFile(name,blob){
 if(DL){try{await DL.save({filename:name,data:blob});toast(tr('pdf.saved'));}catch(e){if(e&&e.code==='declined')return;toast(tr('pdf.saveFail',{e:(e&&e.code)||tr('pdf.err')}));}return;}
 try{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},2000);toast(tr('pdf.created'));}catch(e){toast(tr('pdf.dlFail'));}
}
function pdfSeries(mode){
 const R=series();
 if(mode!=='compare'){R.list=[R.list[0]];R.list[0].name='';}
 R.ord=R.list.slice().sort((a,b)=>a.name.localeCompare(b.name));return R;
}
async function exportPDF(mode){
 if(!window.jspdf){toast(tr('pdf.nolib'));return;}
 toast(tr('pdf.busy'));
 try{
 const R=pdfSeries(mode);const C=PRINTC;const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:'mm',format:'a4'});
 const M=14,PW=210-2*M,PH=297;let y=16;
 const tc=h=>{const [r,g,b]=hexRgb(h);doc.setTextColor(r,g,b);};
 const INK='#161B21',MUT='#5A646F';
 doc.setFont('helvetica','bold');doc.setFontSize(20);tc(INK);doc.text('Schussendlich: ZeroLab',M,y);
 doc.setFont('helvetica','normal');doc.setFontSize(9);tc(MUT);
 const now=new Date();doc.text(pdfTxt(`${mode==='compare'?tr('pdf.cmp'):tr('pdf.single')} · ${now.toLocaleDateString(locale())} ${now.toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'})}`),210-M,y,{align:'right'});
 y+=7;
 const {T,z}=curTarget();
 tc(INK);doc.text(pdfTxt(`${tr('pdf.target')} ${trx('target.'+S.target,T.name)}${S.target==='ring'?' ('+trx('ring.'+S.ring,ringGeo().name)+')':''} · ${tr('pdf.aim',{z:z.label})} · ${tr('pdf.env')} ${fx(U.alt(S.alt),0)} ${U.altU()}, ${fx(U.temp(S.temp),0)} ${U.tempU()}`),M,y);y+=6;
 const O=R.ord;
 O.forEach(s=>{const [r,g,b]=hexRgb(C.ser(s.ci));doc.setFillColor(r,g,b);doc.circle(M+1.6,y-1.2,1.6,'F');
  doc.setFont('helvetica','bold');tc(C.ser(s.ci));doc.text(pdfTxt(`${s.name?tr('var.label',{n:s.name}):tr('pdf.setup')} · Zero ${fx(U.dist(s.P.zero),0)} ${U.dU()}`),M+5,y);
  doc.setFont('helvetica','normal');tc(INK);const st=s.active?S:s.st;
  const lauf=st.meas?tr('pdf.mvMeas'):tr('pdf.barrelEst',{l:fx(U.len(st.bl),U.m?0:1),u:U.lenU()});
  doc.text(pdfTxt(`${s.desc} · ${lauf}`),M+5,y+4);
  if(s.res.ok){tc(MUT);doc.text(pdfTxt(`${tr('zero.near')} ${s.res.near!=null?fx(U.dist(s.res.near),0):'-'} · ${tr('zero.far')} ${s.res.far!=null?fx(U.dist(s.res.far),0):'-'} ${U.dU()} · ${tr('apex')} ${sgn(U.drop(s.res.apex.y),1)} ${U.dropU()} ${tr('at')} ${fx(U.dist(s.res.apex.x),0)} ${U.dU()}`),M+5,y+8);}
  y+=13;});
 /* Flugbahn */
 const GW=860,GH=380;const gpng=await svgPng(graphSVG(C,R.list,R.dm,{px:1,w:GW,h:GH,bg:1}),GW,GH,2.2);
 const gh=PW*GH/GW;doc.setFont('helvetica','bold');doc.setFontSize(10);tc(INK);doc.text(pdfTxt(tr('graph.h')),M,y+1);y+=3;
 doc.addImage(gpng,'PNG',M,y,PW,gh);y+=gh+6;
 /* Scheiben je Variante, nebeneinander, darunter Tabelle */
 const per=O.length===1?1:Math.min(3,O.length),gapX=7;
 const colW=O.length===1?84:(PW-gapX*(per-1))/per;
 const au=S.angle==='mrad'?'MRAD':'MOA';
 const {hi,lo}=curTarget();
 const imgs=[];
 for(const s of O){const svg=targetSVG(C,[s],R.dm,{px:600,bg:1});const vb=svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);const asp=vb[3]/vb[2];imgs.push({png:await svgPng(svg,600,600*asp,2.2),asp});}
 const rowLH=4.1,tblH=6+(R.dm.length+1)*rowLH+1;
 for(let r0=0;r0<O.length;r0+=per){
  const row=O.slice(r0,r0+per);
  const imgH=Math.min(Math.max(...row.map((s,j)=>colW*imgs[r0+j].asp)),O.length===1?115:95);
  const rowH=7+imgH+4+tblH+4;
  if(y+rowH>PH-14){doc.addPage();y=16;}
  row.forEach((s,j)=>{
   const x=M+j*(colW+gapX),im=imgs[r0+j];
   const col=C.ser(s.ci);const [r,g,b]=hexRgb(col);
   doc.setFillColor(r,g,b);doc.rect(x,y,colW,1.2,'F');
   doc.setFont('helvetica','bold');doc.setFontSize(10.5);tc(col);
   doc.text(pdfTxt(`${s.name?tr('var.label',{n:s.name}):tr('pdf.setup')} · Zero ${fx(U.dist(s.P.zero),0)} ${U.dU()}`),x,y+5.6);
   let iw=colW,ih=colW*im.asp;if(ih>imgH){ih=imgH;iw=ih/im.asp;}
   doc.addImage(im.png,'PNG',x+(colW-iw)/2,y+7.5,iw,ih);
   let ty=y+7.5+imgH+4;
   const cw=[colW*.3,colW*.36,colW*.34];const cx=[x+cw[0]-1,x+cw[0]+cw[1]-1,x+colW-1];
   doc.setFont('helvetica','bold');doc.setFontSize(7);tc(MUT);
   [tr('th.dist',{u:U.dU()}),tr('pdf.impact',{u:U.dropU()}),`${au}`].forEach((h,k)=>doc.text(pdfTxt(h),cx[k],ty,{align:'right'}));
   doc.setDrawColor(r,g,b);doc.setLineWidth(.4);doc.line(x,ty+1.2,x+colW,ty+1.2);
   doc.setFont('courier','normal');doc.setFontSize(8);
   R.dm.forEach((o,ri)=>{ty+=rowLH;const yy=s.res.ok?at(s.res.y,o.m):null;
    if(ri%2===0){doc.setFillColor(243,244,246);doc.rect(x,ty-2.9,colW,rowLH,'F');}
    tc(INK);doc.text(String(o.d),cx[0],ty,{align:'right'});
    if(yy==null){tc(MUT);doc.text('-',cx[1],ty,{align:'right'});doc.text('-',cx[2],ty,{align:'right'});return;}
    tc(yy>=lo&&yy<=hi?'#2C7A4C':'#B23528');doc.text(sgnA(U.drop(yy),1),cx[1],ty,{align:'right'});
    tc(INK);doc.text(sgnA(corr(yy,o.m),1),cx[2],ty,{align:'right'});});
   const sp=vSpread(s.res,R.dm);ty+=rowLH+.6;doc.setDrawColor(r,g,b);doc.setLineWidth(.3);doc.line(x,ty-3.3,x+colW,ty-3.3);
   doc.setFont('helvetica','bold');doc.setFontSize(7.5);tc(INK);doc.text(pdfTxt(tr('spread')),x+1,ty);
   doc.setFont('courier','bold');doc.setFontSize(8.5);doc.text(sp?fx(U.drop(sp.d),1)+' '+pdfTxt(U.dropU()):'-',x+colW-1,ty,{align:'right'});doc.setFont('courier','normal');doc.setFontSize(8);
  });
  y+=rowH;
 }
 if(O.length>1){
  const rl=4.6,need=14+(R.dm.length+2)*rl;if(y+need>PH-16){doc.addPage();y=16;}
  doc.setFont('helvetica','bold');doc.setFontSize(10);tc(INK);doc.text(pdfTxt(tr('pdf.cmpTitle',{u:U.dropU()})),M,y+1);y+=6;
  const cols=[tr('th.dist',{u:U.dU()})].concat(O.map(s=>tr('var.label',{n:s.name})+' · '+fx(U.dist(s.P.zero),0)));
  const cwid=PW/cols.length;
  doc.setFontSize(7.2);cols.forEach((h,k)=>{tc(k>0&&k<=O.length?C.ser(O[k-1].ci):MUT);doc.text(pdfTxt(h),M+cwid*(k+1)-1.5,y,{align:'right'});});
  doc.setDrawColor(201,208,215);doc.setLineWidth(.3);doc.line(M,y+1.3,M+PW,y+1.3);
  doc.setFont('courier','normal');doc.setFontSize(8.5);
  R.dm.forEach((o,ri)=>{y+=rl;if(ri%2===0){doc.setFillColor(243,244,246);doc.rect(M,y-3.2,PW,rl,'F');}
   tc(INK);doc.text(String(o.d),M+cwid-1.5,y,{align:'right'});
   O.forEach((s,k)=>{const yy=s.res.ok?at(s.res.y,o.m):null;tc(yy==null?MUT:(yy>=lo&&yy<=hi?'#2C7A4C':'#B23528'));doc.text(yy==null?'-':sgnA(U.drop(yy),1),M+cwid*(k+2)-1.5,y,{align:'right'});});
});
  y+=rl+.6;doc.setDrawColor(201,208,215);doc.line(M,y-3.4,M+PW,y-3.4);doc.setFont('helvetica','bold');doc.setFontSize(7.5);tc(INK);doc.text(pdfTxt(tr('pdf.spreadShort')),M+1,y);
  doc.setFont('courier','bold');doc.setFontSize(8.5);O.forEach((s,k)=>{const sp=vSpread(s.res,R.dm);tc(C.ser(s.ci));doc.text(sp?fx(U.drop(sp.d),1):'-',M+cwid*(k+2)-1.5,y,{align:'right'});});doc.setFont('courier','normal');
  y+=5;doc.setFont('helvetica','normal');doc.setFontSize(7.5);tc(MUT);doc.text(pdfTxt(tr('pdf.spreadNote')),M,y);y+=6;
 }
 doc.setFont('helvetica','normal');doc.setFontSize(7.5);tc(MUT);
 const foot=doc.splitTextToSize(pdfTxt(tr('pdf.foot',{z:z.label,au})),PW);
 if(y+foot.length*3.4>PH-8){doc.addPage();y=16;}doc.text(foot,M,y);
 const blob=doc.output('blob');
 await offerFile(`zerolab-${mode==='compare'?tr('pdf.fileCmp'):'zero-'+fx(U.dist(S.zero),0)+U.dU()}.pdf`,blob);
 }catch(err){console.error(err);toast(tr('pdf.fail'));}
}

/* ---------- Start ---------- */
Store.init();
(function load(){
 const s=Store.get('s');if(s&&typeof s==='object'){S=Object.assign(defaults(),s);if(!s.v||s.v<2){S.dist=defaults().dist;S.v=2;}}
 const v=Store.get('v');if(Array.isArray(v))VARS=v.filter(x=>x&&x.st&&x.st.load);
 const c=Store.get('c');if(Array.isArray(c))CUSTOM=c;
 if(!S.load||!(S.load.bc>0)){const l=findLoad(S.cal,S.loadId);if(l)selectLoad(S.cal,S.loadId);else selectLoad('556','sp-ds1-41');}
})();
ensureVars();
full();

/* ---------- Sprache ---------- */
$('#segLang').addEventListener('click',e=>{const v=e.target.dataset.v;if(!v||v===LANG)return;setLang(v);
 if(wipeArm)$('#btnWipe').textContent=tr('wipe.confirm');toggleSet(!$('#setPanel').hidden);renderSetup();renderResults();});

/* ---------- Einstellungen (Zahnrad) ---------- */
function setMenu(open){$('#setMenu').hidden=!open;$('#btnSet').setAttribute('aria-expanded',String(open));}
$('#btnSet').addEventListener('click',()=>setMenu($('#setMenu').hidden));
document.addEventListener('click',e=>{if(!$('#setMenu').hidden&&!e.target.closest('.set-wrap'))setMenu(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#setMenu').hidden){setMenu(false);$('#btnSet').focus();}});

/* ---------- Offline: Service Worker ---------- */
if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});

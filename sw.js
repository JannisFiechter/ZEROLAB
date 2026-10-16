/* Schussendlich: ZeroLab, Service Worker
 App-Shell beim Installieren cachen, Google Fonts und jsPDF zur Laufzeit.
 Bei jeder Änderung an Shell-Dateien VERSION erhöhen (und ?v= in index.html). */
const VERSION='zerolab-v9';
const SHELL=VERSION+'-shell',RUNTIME=VERSION+'-runtime';
const ASSETS=['./','index.html','css/style.css?v=9','js/i18n.js?v=9','js/app.js?v=9','manifest.webmanifest',
 'favicon.svg','favicon.ico','icons/icon-192.png','icons/icon-512.png','icons/icon-512-maskable.png','icons/apple-touch-icon.png'];
const FONT_CSS='https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap';
const JSPDF='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const EXT=/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)\//;

/* Fremdquellen vorab laden, damit schon der erste Offline-Start Schriften und PDF hat. Fehler sind nicht fatal. */
async function warm(){
 const c=await caches.open(RUNTIME);
 const get=async u=>{const r=await fetch(u,{mode:'cors',credentials:'omit'});if(r.ok)await c.put(u,r.clone());return r;};
 await Promise.allSettled([get(JSPDF),get(FONT_CSS).then(async r=>{
  const css=await r.text();const urls=[...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m=>m[1]);
  await Promise.allSettled(urls.map(get));})]);
}
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)).then(()=>warm().catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>!k.startsWith(VERSION+'-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;
 const url=new URL(req.url);
 /* Seite: Netz zuerst (immer aktuell), offline aus dem Cache */
 if(req.mode==='navigate'){
  e.respondWith(fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(SHELL).then(c=>c.put('index.html',cp));}return r;})
   .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html',{cacheName:SHELL}))));
  return;
 }
 /* Eigene Dateien: Cache zuerst (versioniert über ?v=) */
 if(url.origin===location.origin){
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(n=>{if(n.ok){const cp=n.clone();caches.open(RUNTIME).then(c=>c.put(req,cp));}return n;})));
  return;
 }
 /* Google Fonts und jsPDF: aus dem Cache, im Hintergrund auffrischen */
 if(EXT.test(req.url)){
  e.respondWith(caches.open(RUNTIME).then(c=>c.match(req,{ignoreVary:true}).then(hit=>{
   const net=fetch(req).then(n=>{if(n.ok||n.type==='opaque')c.put(req,n.clone());return n;}).catch(()=>hit||Response.error());
   if(hit){e.waitUntil(net);return hit;}
   return net;})));
 }
});

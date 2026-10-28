/* Service worker : garde la page et ses fichiers sur l'appareil pour un usage hors ligne.
   Stratégie : on répond tout de suite avec la copie locale, puis on la met à jour en arrière-plan quand il y a du réseau
   (une mise à jour du site s'affiche donc au 2e chargement). Les fichiers d'autres sites (ex. MP3) ne sont jamais touchés. */
const CACHE='epsmart-luc-leger-v1';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const OPTIONAL=['lib/xlsx.full.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all([c.addAll(CORE),...OPTIONAL.map(u=>c.add(u).catch(()=>{}))])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);if(u.origin!==self.location.origin)return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
  const net=fetch(r).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy));}return res;}).catch(()=>hit);
  return hit||net;}));
});

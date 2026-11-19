const CACHE = 'jom-arab-v4-mp3';
const AUDIO_ASSETS = ["./audio/pack-00.js", "./audio/pack-01.js", "./audio/pack-02.js", "./audio/pack-03.js", "./audio/pack-04.js", "./audio/pack-05.js", "./audio/pack-06.js", "./audio/pack-07.js", "./audio/pack-08.js", "./audio/pack-09.js", "./audio/pack-10.js", "./audio/pack-11.js", "./audio/pack-12.js", "./audio/pack-13.js", "./audio/pack-14.js", "./audio/pack-15.js", "./audio/pack-16.js", "./audio/pack-17.js", "./audio/pack-18.js", "./audio/pack-19.js", "./audio/pack-20.js", "./audio/pack-21.js", "./audio/pack-22.js"];
const ASSETS = ['./','./index.html','./styles.css','./app.js?v=mp3-1','./data.js','./engine.js','./speech.js','./recordings.js','./audio-manifest.js','./icon.svg','./manifest.webmanifest',...AUDIO_ASSETS];
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate', event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('jom-arab-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch', event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{if(response.status===200){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request).then(hit=>hit || (event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});

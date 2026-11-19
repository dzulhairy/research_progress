export const LETTER_SPEECH = {
 'ا':'أَلِف','ب':'بَاء','ت':'تَاء','ث':'ثَاء','ج':'جِيم','ح':'حَاء','خ':'خَاء',
 'د':'دَال','ذ':'ذَال','ر':'رَاء','ز':'زَاي','س':'سِين','ش':'شِين','ص':'صَاد','ض':'ضَاد',
 'ط':'طَاء','ظ':'ظَاء','ع':'عَيْن','غ':'غَيْن','ف':'فَاء','ق':'قَاف','ك':'كَاف','ل':'لَام',
 'م':'مِيم','ن':'نُون','ه':'هَاء','و':'وَاو','ي':'يَاء'
};
export function speechText(text){return LETTER_SPEECH[text]||text;}
export function arabicVoices(synth){return (synth?.getVoices()||[]).filter(v=>/^ar(?:[-_]|$)/i.test(v.lang));}
export function chooseVoice(voices,uri){return voices.find(v=>v.voiceURI===uri)||voices.find(v=>/^ar[-_]SA$/i.test(v.lang))||voices.find(v=>v.localService)||voices[0];}
export function createSpeaker({synth,Utterance,onState=()=>{},setTimer=setTimeout,clearTimer=clearTimeout}){
 let sequence=0,watchdog=null,current=null,unlocked=false;
 const clear=()=>{if(watchdog!==null)clearTimer(watchdog);watchdog=null;};
 const stop=()=>{sequence++;clear();current=null;synth?.cancel();onState({state:'idle'});};
 const supported=Boolean(synth&&Utterance);
 function read(text,{manual=true,enabled=true,rate=.8,voiceURI=''}={}){
  if(!enabled){if(manual)onState({state:'error',message:'Aktifkan suara dalam tetapan suara.'});return false;}
  if(!supported){onState({state:'error',message:'Pelayar ini tidak menyokong suara. Cuba Safari atau Chrome yang terkini.'});return false;}
  if(!manual&&!unlocked)return false;
  if(manual)unlocked=true;
  stop();const request=sequence;
  const u=new Utterance(speechText(text));current=u;
  const voice=chooseVoice(arabicVoices(synth),voiceURI);
  // Safari can expose an empty voice list until the first user-initiated call.
  // Keep that call synchronous and let the OS resolve the requested Arabic locale.
  if(voice)u.voice=voice;
  u.lang=voice?.lang||'ar-SA';u.rate=Math.max(.5,Math.min(1.1,Number(rate)||.8));u.volume=1;u.pitch=1;
  const fail=message=>{if(sequence!==request)return;clear();current=null;onState({state:'error',message});};
  u.onstart=()=>{if(sequence!==request)return;clear();onState({state:'speaking'});};
  u.onend=()=>{if(sequence!==request)return;clear();current=null;onState({state:'idle'});};
  u.onerror=event=>{
   if(sequence!==request)return;
   if(['canceled','interrupted'].includes(event.error)){clear();current=null;onState({state:'idle'});return;}
   if(event.error==='not-allowed')fail('Tekan Dengar sekali lagi untuk membenarkan suara.');
   else if(['language-unavailable','voice-unavailable','synthesis-unavailable'].includes(event.error))fail('Suara Arab belum tersedia. Tambah suara Arab dalam tetapan pertuturan telefon, kemudian cuba lagi.');
   else fail('Suara tidak dapat dimainkan. Semak kelantangan telefon dan cuba lagi.');
  };
  onState({state:'loading'});
  watchdog=setTimer(()=>{if(sequence!==request)return;synth.cancel();fail('Belum kedengaran? Semak kelantangan telefon dan suara Arab dalam tetapan pertuturan. Kemudian tekan Dengar semula.');},7000);
  try{synth.resume?.();synth.speak(u);}catch{fail('Suara tidak dapat dimainkan. Cuba Safari atau Chrome dan aktifkan suara Arab.');}
  return true;
 }
 return {read,stop,supported,get unlocked(){return unlocked;},get current(){return current;}};
}

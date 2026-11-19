import {AUDIO_FILES} from './audio-manifest.js';
import {speechText} from './speech.js';

// Use a single media element: iPhone playback is unlocked by the first tap.
export function createRecordedSpeaker({AudioClass,onState=()=>{},files=AUDIO_FILES,baseURL=import.meta.url,setTimer=setTimeout,clearTimer=clearTimeout}){
 const supported=Boolean(AudioClass);const player=supported?new AudioClass():null;
 let sequence=0,watchdog=null,unlocked=false;
 if(player){player.preload='auto';player.playsInline=true;}
 const clear=()=>{if(watchdog!==null)clearTimer(watchdog);watchdog=null;};
 function stop(){
  sequence++;clear();
  if(player){player.onplaying=null;player.onended=null;player.onerror=null;player.pause();try{player.currentTime=0;}catch{}}
  onState({state:'idle'});
 }
 function read(text,{manual=true,enabled=true,rate=.8}={}){
  if(!enabled){if(manual)onState({state:'error',message:'Aktifkan suara dalam tetapan suara.'});return false;}
  if(!supported){onState({state:'error',message:'Pelayar ini tidak menyokong audio. Cuba Safari atau Chrome.'});return false;}
  if(!manual&&!unlocked)return false;
  const file=files[speechText(text)];
  if(!file){onState({state:'error',message:'Audio untuk sebutan ini belum tersedia.'});return false;}
  if(manual)unlocked=true;
  stop();const request=sequence;
  const fail=message=>{if(sequence!==request)return;clear();onState({state:'error',message});};
  player.onplaying=()=>{if(sequence!==request)return;clear();onState({state:'speaking'});};
  player.onended=()=>{if(sequence!==request)return;clear();onState({state:'idle'});};
  player.onerror=()=>fail('Audio tidak dapat dimuatkan. Semak internet dan tekan Dengar semula.');
  player.src=new URL(file,baseURL).href;player.volume=1;
  player.playbackRate=Math.max(.5,Math.min(1.25,Number(rate)||.8));player.preservesPitch=true;
  onState({state:'loading'});
  watchdog=setTimer(()=>{if(sequence!==request)return;player.pause();fail('Audio lambat dimuatkan. Semak internet atau cuba muat semula halaman.');},12000);
  // Do not await fetch/metadata here: play() must run within the tap on iOS.
  try{const pending=player.play();pending?.catch(error=>{
   if(sequence!==request||error?.name==='AbortError')return;
   fail(error?.name==='NotAllowedError'?'Tekan Dengar sekali lagi untuk membenarkan audio.':'Audio tidak dapat dimainkan. Semak kelantangan telefon dan cuba lagi.');
  });}catch{fail('Audio tidak dapat dimainkan. Semak kelantangan telefon dan cuba lagi.');}
  return true;
 }
 return {read,stop,supported,get unlocked(){return unlocked;},get current(){return player;}};
}

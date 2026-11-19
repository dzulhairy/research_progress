import {MODULES,LETTERS,VOCAB,SENTENCES,NUMBERS,COLORS} from './data.js';
export const STORAGE_KEY='jom-arab-progress-v1';
export function normalize(value){return String(value).normalize('NFC').replace(/[\u064b-\u065f\u0670\u0640]/g,'').trim().replace(/\s+/g,' ');}
export function shuffle(items,random=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function rng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function choices(answer,pool,random=Math.random){return shuffle([answer,...shuffle([...new Set(pool)].filter(x=>x!==answer),random).slice(0,3)],random);}
export function makeQuestions(moduleId,level){
 if(!MODULES.some(x=>x.id===moduleId)||!Number.isInteger(level)||level<1||level>15)throw Error('Tahap tidak sah');
 const random=rng(level*347+moduleId.length*19);const out=[];
 for(let i=0;i<5;i++){
  let q;
  const letter=LETTERS[((level-1)*5+i)%LETTERS.length];
  if(moduleId==='letters'){
   const reverse=level>10;
   q={kind:'choice',label:reverse?'Cari huruf':'Kenali huruf',instruction:reverse?'Pilih huruf yang betul.':'Apakah nama huruf ini?',prompt:reverse?letter.ms:letter.ar,answer:reverse?letter.ar:letter.ms,arabic:!reverse,answerArabic:reverse,speak:letter.ar};
   q.options=choices(q.answer,LETTERS.map(x=>reverse?x.ar:x.ms),random);
  } else if(moduleId==='sounds'){
   // Alif is not used as a short-vowel consonant here.
   const consonants=[['ب','b'],['ت','t'],['ث','th'],['ج','j'],['ح','ḥ'],['خ','kh'],['د','d'],['ذ','dh'],['ر','r'],['ز','z'],['س','s'],['ش','sh'],['ص','ṣ'],['ض','ḍ'],['ط','ṭ'],['ظ','ẓ'],['ع','ʿ'],['غ','gh'],['ف','f'],['ق','q'],['ك','k'],['ل','l'],['م','m'],['ن','n'],['ه','h'],['و','w'],['ي','y']];
   const vowel=Math.floor((level-1)/5),marks=['َ','ِ','ُ'],endings=['a','i','u'];const c=consonants[((level-1)%5*5+i)%consonants.length];
   q={kind:'choice',label:['Fathah · a','Kasrah · i','Dammah · u'][vowel],instruction:'Apakah bunyi ini?',prompt:c[0]+marks[vowel],answer:c[1]+endings[vowel],arabic:true,speak:c[0]+marks[vowel],hint:'Huruf bertitik bawah seperti ḥ, ṣ dan ḍ membantu membezakan bunyi. Dengar suara atau sebut bersama ibu bapa.'};
   q.options=choices(q.answer,consonants.map(x=>x[1]+endings[vowel]),random);
  } else if(moduleId==='trace'){
   q={kind:'trace',label:'Latihan menulis',instruction:'Tulis mengikut bentuk huruf ini.',prompt:letter.ar,answer:letter.ms,speak:letter.ar,hint:'Mulakan di mana yang sesuai dan ikut bentuk kelabu. Minta ibu bapa semak bentuk dan titik huruf.'};
  } else if(moduleId==='vocab'){
   const v=VOCAB[((level-1)*5+i)%VOCAB.length];const reverse=level>12;
   q={kind:'choice',label:'Baca kosa kata',instruction:reverse?'Pilih perkataan Arab yang betul.':'Apakah maksud perkataan ini?',prompt:reverse?v.ms:v.ar,answer:reverse?v.ar:v.ms,arabic:!reverse,answerArabic:reverse,speak:v.ar};q.options=choices(q.answer,VOCAB.map(x=>reverse?x.ar:x.ms),random);
  } else if(moduleId==='spell'){
   const v=VOCAB[((level-1)*5+i)%VOCAB.length];
   q={kind:'spell',label:'Menulis perkataan',instruction:'Eja perkataan Arab ini.',prompt:v.ms+' '+v.emoji,answer:v.ar,speak:v.ar,preview:level<=5?v.ar:null};
   q.keys=shuffle([...new Set([...normalize(v.ar).replaceAll(' ',''),...(level>5?'بتمن':'')])],random);
  } else if(moduleId==='sentence'){
   const pool=level<=5?SENTENCES.slice(0,5):level<=10?SENTENCES.slice(5,10):SENTENCES.slice(10);
   const s=pool[((level-1)*3+i)%pool.length];q={kind:'sentence',label:'Bina ayat',instruction:'Susun perkataan menjadi ayat yang betul.',prompt:s.ms,answer:s.ar,speak:s.ar};q.tokens=shuffle(s.ar.split(' ').map((word,id)=>({word,id})),random);
   if(q.tokens.map(x=>x.word).join(' ')===q.answer)q.tokens.reverse();
  } else {
   const isColor=level>=6&&level<=10;const pool=isColor?COLORS:NUMBERS;
   const v=pool[((level-1)*5+i)%pool.length];const reverse=level>10;
   q={kind:'choice',label:isColor?'Kenali warna':'Kenali nombor',instruction:reverse?'Pilih perkataan Arab untuk nombor ini.':isColor?'Apakah warna ini dalam Bahasa Melayu?':'Apakah maksud nombor ini?',prompt:reverse?v.symbol:v.ar,answer:reverse?v.ar:v.ms,arabic:true,answerArabic:reverse,speak:v.ar,color:isColor?v.color:null};q.options=choices(q.answer,pool.map(x=>reverse?x.ar:x.ms),random);
  }
  q.id=moduleId+'-'+level+'-'+i;out.push(q);
 }
 return out;
}
export function newProgress(){return {version:1,name:'',age:'all',audio:true,levels:{}};}
export function validateProgress(value){
 if(!value||typeof value!=='object'||value.version!==1)throw Error('Format fail kemajuan tidak sah.');
 const clean=newProgress();clean.name=String(value.name||'').slice(0,30);clean.age=['all','7–8','9–10','11–12'].includes(value.age)?value.age:'all';clean.audio=value.audio!==false;
 if(!value.levels||typeof value.levels!=='object'||Array.isArray(value.levels))throw Error('Rekod tahap tidak sah.');
 for(const [key,v] of Object.entries(value.levels)){
  const [id,level]=key.split(':');
  if(key!==id+':'+level||!MODULES.some(x=>x.id===id)||!/^([1-9]|1[0-5])$/.test(level)||!v||!Number.isInteger(v.score)||v.score<0||v.score>5)throw Error('Rekod tahap tidak sah.');
  const score=v.score;clean.levels[key]={score,stars:score>=5?3:score>=4?2:score>=3?1:0};
 }
 return clean;
}
export function recordLevel(progress,id,level,score){
 if(!MODULES.some(m=>m.id===id)||!Number.isInteger(level)||level<1||level>15||!Number.isInteger(score)||score<0||score>5)throw Error('Keputusan tidak sah');
 const key=id+':'+level,old=progress.levels[key]?.score??0,best=Math.max(old,score);
 const stars=best===5?3:best===4?2:best>=3?1:0;progress.levels[key]={score:best,stars};return stars;
}
export function totalStars(progress){return Object.values(progress.levels).reduce((sum,x)=>sum+x.stars,0);}

import {MODULES} from './data.js';
import {createSpeaker,arabicVoices} from './speech.js';
import {STORAGE_KEY,normalize,makeQuestions,newProgress,validateProgress,recordLevel,totalStars} from './engine.js';
const $=selector=>document.querySelector(selector);
const escape=value=>String(value).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
let progress=newProgress(),session=null,installPrompt=null,toastTimer,storageOK=true;
try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)progress=validateProgress(JSON.parse(saved));}catch{storageOK=false;}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4500);}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));storageOK=true;}catch{storageOK=false;toast('Pelayar tidak dapat menyimpan kemajuan. Muat turun salinan di ruang ibu bapa.');}updateStars();}
function updateStars(){$('#total-stars').textContent='⭐ '+totalStars(progress);}
const speaker=createSpeaker({synth:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance,onState:({state,message})=>{
 const status=$('#speech-status')||$('#home-speech-status');
 if(status)status.textContent=message||(state==='speaking'?'Sedang menyebut…':state==='loading'?'Menyediakan suara…':'Tekan Dengar untuk dengar semula.');
 const button=$('#speak');if(button){button.textContent=state==='speaking'?'🔊 Sedang menyebut…':'🔊 Dengar';button.setAttribute('aria-busy',String(state==='loading'||state==='speaking'));}
 if($('#settings').open&&message)$('#voice-info').textContent=message;
}});
function voices(){return arabicVoices(window.speechSynthesis);}
function voiceInfo(){
 const available=voices();$('#voice-info').textContent=!speaker.supported?'Pelayar ini belum menyokong suara. Buka permainan dalam Safari atau Chrome.':available.length?'Suara Arab tersedia. Tekan Uji suara untuk mendengar.':'Tekan Uji suara untuk meminta suara Arab telefon. Jika masih senyap, tambah suara Arab dalam tetapan pertuturan dan semak kelantangan telefon.';
 const select=$('#voice-select');select.innerHTML='<option value="">Automatik · Bahasa Arab</option>'+available.map(v=>`<option value="${escape(v.voiceURI)}">${escape(v.name)} (${escape(v.lang)})</option>`).join('');select.value=progress.voiceURI;
}
function speak(text,{manual=true,slow=false}={}){return speaker.read(text,{manual,enabled:progress.audio,rate:slow?.55:progress.speechRate,voiceURI:progress.voiceURI});}
function goto(hash){if(location.hash===hash)route();else location.hash=hash;}
function completed(id){return Object.entries(progress.levels).filter(([key,v])=>key.startsWith(id+':')&&v.score>=3).length;}
function home(){
 session=null;
 $('#app').innerHTML=`<section class="hero"><div><div class="eyebrow">BELAJAR · BERMAIN · BERJAYA</div><h1>Jom pandai<br>Bahasa Arab! <span style="font-size:.6em">✨</span></h1><p>Pengembaraan kecil, pengetahuan besar.<br>7 bahagian interaktif untuk umur 7–12 tahun.</p></div><div class="hero-art" aria-hidden="true"><span class="spark">✦</span><div class="book">📚</div><span class="arab-pill" lang="ar" dir="rtl">مَرْحَبًا</span></div></section>
 <div class="profile-row"><label for="player-name">👋 Hai, adik!</label><input id="player-name" maxlength="30" placeholder="Nama panggilan" autocomplete="off" value="${escape(progress.name)}"><div class="age-chips" role="group" aria-label="Cadangan mengikut umur">${['all','7–8','9–10','11–12'].map(age=>`<button class="chip ${progress.age===age?'active':''}" data-age="${age}" aria-pressed="${progress.age===age}">${age==='all'?'Semua':age}</button>`).join('')}</div></div>
 <section class="overview"><span class="plant" aria-hidden="true">🌱</span><div><h3>${escape(progress.name||'Adik')}, satu langkah lagi!</h3><p>${Object.values(progress.levels).filter(x=>x.score>=3).length} daripada 105 tahap selesai. Belajar mengikut rentak sendiri.</p></div><button class="primary teal" id="install">Pasang permainan</button></section>
 <div id="install-help"></div><section class="voice-welcome"><div><strong>Belajar dengan suara Arab 🔊</strong><p id="home-speech-status" role="status">Tekan Cuba suara dahulu. Kemudian dengar sebutan semasa bermain.</p></div><button class="primary" id="welcome-sound">Cuba suara</button></section><div class="section-heading"><div><h2>Pilih pengembaraan 🚀</h2><p>Mulakan bahagian kegemaran, kemudian pilih tahap.</p></div><span class="tiny-tag">15 tahap / bahagian</span></div>
 ${progress.age==='all'?'':`<p class="notice">Cadangan umur ${progress.age}: mulakan pada tahap ${progress.age==='7–8'?'1':progress.age==='9–10'?'6':'11'}. Semua tahap kekal terbuka untuk ulang kaji.</p>`}
 <section class="modules" aria-label="Bahagian pembelajaran">${MODULES.map((m,i)=>`<button class="module" data-module="${m.id}" style="--tint:${m.tint}"><span class="emoji" aria-hidden="true">${m.icon}</span><h3>${i+1}. ${m.title}</h3><p>${m.description}</p><div class="meta"><span>${completed(m.id)}/15 tahap selesai</span><span>MULA</span></div><div class="mini-track"><i style="width:${completed(m.id)/15*100}%"></i></div></button>`).join('')}</section>
 <p class="notice" style="text-align:center;margin:24px 0 0">⭐ 3/5 betul: 1 bintang · 4/5: 2 bintang · 5/5: 3 bintang<br><button class="chip" id="parent-settings">Ruang ibu bapa & kemajuan</button></p>`;
 $('#player-name').addEventListener('input',event=>{progress.name=event.target.value;save();});
 document.querySelectorAll('[data-age]').forEach(el=>el.onclick=()=>{progress.age=el.dataset.age;save();home();});
 document.querySelectorAll('[data-module]').forEach(el=>el.onclick=()=>goto('#module/'+el.dataset.module));
 $('#install').onclick=install;$('#parent-settings').onclick=openSettings;$('#welcome-sound').onclick=()=>{progress.audio=true;save();speak('مَرْحَبًا');};
 if(!storageOK)toast('Kemajuan terdahulu tidak dapat dibaca. Semak atau pulihkan salinan dalam ruang ibu bapa.');
}
function levels(id){
 session=null;const m=MODULES.find(x=>x.id===id);if(!m){goto('#');return;}
 $('#app').innerHTML=`<div class="page-top"><button class="back" id="back">Utama</button><span class="tiny-tag">${completed(id)} / 15 selesai</span></div><section class="level-hero"><span class="emoji">${m.icon}</span><h1>${m.title}</h1><p>${m.description}</p></section>${['Asas · Kenal dan cuba','Pertengahan · Terus berlatih','Cabaran · Uji kefahaman'].map((label,band)=>`<h2 class="band-label">${label}</h2><div class="levels">${Array.from({length:5},(_,i)=>{const n=band*5+i+1,r=progress.levels[id+':'+n];return `<button class="level ${r?.stars?'done':''}" data-level="${n}" aria-label="Tahap ${n}, ${r?.stars||0} bintang"><small>TAHAP</small><strong>${n}</strong><div class="level-stars">${'★'.repeat(r?.stars||0)}${'☆'.repeat(3-(r?.stars||0))}</div></button>`;}).join('')}</div>`).join('')}<p class="notice" style="text-align:center;margin-top:25px">Semua tahap terbuka. Ulang latihan pada bila-bila masa.<br>Skor terbaik setiap tahap digunakan untuk jumlah bintang.</p>`;
 $('#back').onclick=()=>goto('#');document.querySelectorAll('[data-level]').forEach(el=>el.onclick=()=>goto('#play/'+id+'/'+el.dataset.level));
}
function start(id,level){
 try{session={id,level,questions:makeQuestions(id,level),index:0,score:0,answered:false,selected:[]};question();}catch{goto('#');}
}
function question(){
 if(!session)return;speaker.stop();const q=session.questions[session.index];session.answered=false;session.selected=[];
 const isArabic=q.arabic||q.kind==='trace',promptClass=q.kind==='sentence'||q.kind==='spell'?'sentence':q.prompt.length>5?'word':'';
 $('#app').innerHTML=`<div class="quiz-wrap"><div class="page-top"><button class="back" id="back">Pilih tahap</button><span class="tiny-tag">${MODULES.find(x=>x.id===session.id).icon} Tahap ${session.level}</span></div><div class="quiz-stats"><span>Soalan ${session.index+1} daripada 5</span><span>⭐ ${session.score} betul</span></div><div class="track" role="progressbar" aria-label="Kemajuan latihan" aria-valuenow="${session.index}" aria-valuemin="0" aria-valuemax="5"><i style="width:${session.index*20}%"></i></div><section class="question-card"><div class="question-top"><span class="tag">${q.label}</span><button class="icon-button" id="speak" aria-label="Dengar sebutan Arab">🔊</button></div><h2 tabindex="-1" id="question-title">${q.instruction}</h2><div class="prompt ${promptClass} ${isArabic?'arabic':''}" ${isArabic?'lang="ar" dir="rtl"':''}>${escape(q.prompt)}</div>${q.color?`<div aria-hidden="true" style="background:${q.color};width:70px;height:48px;margin:-20px auto 25px;border:2px solid #ddd;border-radius:14px"></div>`:''}<div id="interaction"></div><div id="feedback" aria-live="polite"></div><button id="next" class="primary next hidden">${session.index===4?'Lihat keputusan ✨':'Soalan seterusnya'}</button></section></div>`;
 $('#back').onclick=()=>goto('#module/'+session.id);$('#speak').onclick=()=>speak(q.speak);$('#next').onclick=next;
 $('#speak').className='listen-button';$('#speak').textContent='🔊 Dengar';
 $('#speak').insertAdjacentHTML('afterend','<button class="secondary" id="speak-slow" aria-label="Dengar sebutan perlahan">🐢 Perlahan</button>');
 $('#speak-slow').onclick=()=>speak(q.speak,{slow:true});
 $('#question-title').insertAdjacentHTML('beforebegin','<p id="speech-status" class="notice speech-status" role="status">Tekan Dengar untuk aktifkan suara Arab. Jika bacaan automatik dihidupkan, soalan seterusnya akan dibaca selepas ini.</p>');
 if(q.kind==='choice'){
  $('#interaction').innerHTML=`<div class="answers">${q.options.map((o,i)=>`<button class="answer ${q.answerArabic?'arabic':''}" ${q.answerArabic?'lang="ar" dir="rtl"':''} data-choice="${i}">${escape(o)}</button>`).join('')}</div>${q.hint?`<p class="notice">${escape(q.hint)}</p>`:''}`;
  document.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>{
   if(session.answered)return;const answer=q.options[Number(el.dataset.choice)],correct=answer===q.answer;
   document.querySelectorAll('[data-choice]').forEach(b=>{b.disabled=true;if(q.options[Number(b.dataset.choice)]===q.answer)b.classList.add('correct');});if(!correct)el.classList.add('wrong');answerQuestion(correct);
  });
 }else if(q.kind==='spell'){
  $('#interaction').innerHTML=`${q.preview?`<p class="notice" style="text-align:center">Lihat contoh, kemudian salin: <span class="arabic" lang="ar" style="font-size:27px">${escape(q.preview)}</span></p>`:'<p class="notice">Tekan huruf atau gunakan papan kekunci Arab pada peranti.</p>'}<input id="spelling" class="typed arabic" lang="ar" dir="rtl" aria-label="Jawapan ejaan Bahasa Arab" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="keypad">${q.keys.map((k,i)=>`<button class="key arabic" lang="ar" data-key="${i}">${escape(k)}</button>`).join('')}<button class="key" id="erase" aria-label="Padam huruf terakhir">⌫</button></div><button id="check" class="primary teal next">Semak ejaan</button>`;
  document.querySelectorAll('[data-key]').forEach(el=>el.onclick=()=>{if(!session.answered){$('#spelling').value+=q.keys[Number(el.dataset.key)];}});
  $('#erase').onclick=()=>{if(!session.answered)$('#spelling').value=Array.from($('#spelling').value).slice(0,-1).join('');};
  $('#check').onclick=()=>{if(!$('#spelling').value.trim()){toast('Isi jawapan dahulu.');return;}answerQuestion(normalize($('#spelling').value)===normalize(q.answer));};
  $('#spelling').onkeydown=event=>{if(event.key==='Enter')$('#check').click();};
 }else if(q.kind==='sentence'){
  $('#interaction').innerHTML='<p class="notice">Tekan perkataan mengikut urutan ayat Arab dari kanan ke kiri. Tekan semula perkataan yang dipilih untuk membatalkan.</p><div class="answer-zone" id="answer-zone" aria-label="Susunan ayat anda" lang="ar" dir="rtl"></div><div class="word-bank" id="word-bank" lang="ar" dir="rtl"></div><div class="actions"><button class="secondary" id="clear">Kosongkan</button><button class="primary teal" id="check">Semak ayat</button></div>';
  const paint=()=>{
   $('#answer-zone').innerHTML=session.selected.map(id=>`<button class="token arabic" data-remove="${id}">${escape(q.tokens.find(t=>t.id===id).word)} ×</button>`).join('');
   $('#word-bank').innerHTML=q.tokens.map(t=>`<button class="token arabic" data-token="${t.id}" ${session.selected.includes(t.id)?'disabled':''}>${escape(t.word)}</button>`).join('');
   document.querySelectorAll('[data-token]').forEach(el=>el.onclick=()=>{if(!session.answered){session.selected.push(Number(el.dataset.token));paint();}});
   document.querySelectorAll('[data-remove]').forEach(el=>el.onclick=()=>{if(!session.answered){session.selected=session.selected.filter(id=>id!==Number(el.dataset.remove));paint();}});
  };paint();
  $('#clear').onclick=()=>{session.selected=[];paint();};
  $('#check').onclick=()=>{if(session.selected.length!==q.tokens.length){toast('Susun semua perkataan dahulu.');return;}answerQuestion(session.selected.map(id=>q.tokens.find(t=>t.id===id).word).join(' ')===q.answer);};
 }else if(q.kind==='trace'){
  $('#interaction').innerHTML=`<p class="notice">${escape(q.hint)}</p><div class="draw-area"><span class="trace arabic" lang="ar" aria-hidden="true">${escape(q.prompt)}</span><canvas id="drawing" aria-label="Ruang latihan menulis huruf dengan jari atau tetikus"></canvas></div><div class="actions"><button class="secondary" id="clear-drawing">Padam tulisan</button><button class="primary teal" id="trace-done" disabled>Selesai menulis</button></div><p class="notice">Latihan kendiri sahaja. Selepas menulis, minta ibu bapa semak sebelum meneruskan. Jika sukar melukis, tulis di atas kertas.</p><button class="secondary next" id="paper">Saya berlatih di atas kertas</button><div id="review"></div>`;
  setupCanvas();
  const review=()=>{
   $('#review').innerHTML='<div class="feedback"><strong>Semakan ibu bapa</strong><p>Adakah bentuk dan titik huruf sudah betul? Ganjaran latihan ini berdasarkan semakan anda.</p><div class="actions"><button id="review-again" class="secondary">Cuba lagi</button><button id="review-pass" class="primary teal">Ya, sudah disemak</button></div></div>';
   $('#review-again').onclick=()=>{$('#review').innerHTML='';};$('#review-pass').onclick=()=>{$('#review').innerHTML='';answerQuestion(true);};
  };
  $('#trace-done').onclick=review;$('#paper').onclick=review;
 }
 $('#question-title').focus({preventScroll:true});
 if(progress.autoSpeak)speak(q.speak,{manual:false});
}
function answerQuestion(correct){
 if(!session||session.answered)return;session.answered=true;if(correct)session.score++;
 const q=session.questions[session.index];document.querySelectorAll('#interaction button,#interaction input').forEach(el=>el.disabled=true);
 $('#feedback').innerHTML=`<div class="feedback ${correct?'':'bad'}"><strong>${correct?(q.kind==='trace'?'🌟 Latihan sudah disemak!':'🌟 Tahniah, betul!'):'🌱 Teruskan belajar. Cuba ingat jawapan ini.'}</strong>${q.kind==='trace'?'':`<br>Jawapan: <span class="${/[\u0600-\u06ff]/.test(q.answer)?'arabic':''}" ${/[\u0600-\u06ff]/.test(q.answer)?'lang="ar" dir="rtl"':''}>${escape(q.answer)}</span>`}</div>`;
 $('#next').classList.remove('hidden');$('#next').focus({preventScroll:true});
}
function next(){if(!session?.answered)return;if(session.index<4){session.index++;question();}else finish();}
function finish(){
 speaker.stop();
 const {id,level,score}=session;recordLevel(progress,id,level,score);save();
 const stars=score===5?3:score===4?2:score>=3?1:0;const trace=id==='trace';
 $('#app').innerHTML=`<section class="result"><div class="trophy">${stars?'🏆':'🌱'}</div><h1>${stars?'Hebat, teruskan!':'Setiap cubaan membawa kemajuan.'}</h1><p>Tahap ${level} · ${MODULES.find(m=>m.id===id).title}</p><div class="earned" aria-label="${stars} bintang">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div><h2>${score} / 5 ${trace?'latihan disemak':'jawapan betul'}</h2><p>${trace?'Ganjaran berdasarkan latihan dan semakan ibu bapa.':stars?'Tahap selesai! Skor terbaik anda telah direkodkan.':'Dapatkan sekurang-kurangnya 3 jawapan betul untuk menamatkan tahap ini.'}</p><div class="actions"><button class="secondary" id="retry">Ulang tahap ↻</button>${level<15?'<button class="primary" id="continue">Tahap seterusnya</button>':''}<button class="secondary" id="levels">Pilih tahap</button></div></section>`;
 $('#retry').onclick=()=>start(id,level);if($('#continue'))$('#continue').onclick=()=>goto('#play/'+id+'/'+(level+1));$('#levels').onclick=()=>goto('#module/'+id);
}
function setupCanvas(){
 const canvas=$('#drawing'),rect=canvas.getBoundingClientRect(),ratio=window.devicePixelRatio||1;
 canvas.width=rect.width*ratio;canvas.height=rect.height*ratio;const ctx=canvas.getContext('2d');ctx.scale(ratio,ratio);ctx.lineWidth=6;ctx.strokeStyle='#6548cf';ctx.lineCap='round';ctx.lineJoin='round';let active=false,points=0;
 const pos=e=>{const r=canvas.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
 canvas.onpointerdown=e=>{if(session.answered)return;active=true;canvas.setPointerCapture(e.pointerId);const [x,y]=pos(e);ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#6548cf';ctx.fill();ctx.beginPath();ctx.moveTo(x,y);};
 canvas.onpointermove=e=>{if(!active||session.answered)return;ctx.lineTo(...pos(e));ctx.stroke();points++;if(points>8)$('#trace-done').disabled=false;};
 canvas.onpointerup=canvas.onpointercancel=()=>{active=false;};
 $('#clear-drawing').onclick=()=>{ctx.clearRect(0,0,canvas.width/ratio,canvas.height/ratio);points=0;$('#trace-done').disabled=true;$('#review').innerHTML='';};
}
async function install(){
 if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return;}
 $('#install-help').innerHTML='<div class="install-note"><strong>Pasang pada skrin utama telefon</strong><br>iPhone/iPad: buka dalam Safari → Kongsi → Tambah ke Skrin Utama.<br>Android: buka menu pelayar → Pasang aplikasi / Tambah ke skrin utama.<br>Mod luar talian tersedia selepas lawatan pertama melalui HTTPS. Audio bergantung pada suara peranti.</div>';
}
function openSettings(){speaker.stop();$('#audio-toggle').checked=progress.audio;$('#auto-speak').checked=progress.autoSpeak;$('#speech-rate').value=String(progress.speechRate);$('#settings-status').textContent='';voiceInfo();$('#settings').showModal();}
$('#sound').onclick=openSettings;
$('#audio-toggle').onchange=e=>{progress.audio=e.target.checked;if(!progress.audio)speaker.stop();save();};
$('#auto-speak').onchange=e=>{progress.autoSpeak=e.target.checked;save();};
$('#speech-rate').onchange=e=>{progress.speechRate=Number(e.target.value);save();};
$('#voice-select').onchange=e=>{progress.voiceURI=e.target.value;save();};
$('#test-audio').onclick=()=>speak('مَرْحَبًا');
$('#settings').addEventListener('close',()=>speaker.stop());
$('#reset-progress').onclick=()=>{if(confirm('Padam nama dan semua kemajuan Jom Arab pada pelayar ini? Muat turun salinan terlebih dahulu jika perlu.')){progress=newProgress();save();$('#settings').close();goto('#');toast('Kemajuan telah dikosongkan.');}};
$('#export-progress').onclick=()=>{
 const blob=new Blob([JSON.stringify(progress,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='jom-arab-kemajuan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#settings-status').textContent='Salinan kemajuan telah dimuat turun.';
};
$('#import-progress').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 try{if(file.size>100000)throw Error('Fail terlalu besar. Pilih fail kemajuan Jom Arab.');const restored=validateProgress(JSON.parse(await file.text()));if(!confirm('Gantikan kemajuan pada peranti ini dengan fail yang dipilih?'))return;progress=restored;save();$('#settings').close();goto('#');toast('Kemajuan berjaya dipulihkan.');}catch(error){$('#settings-status').textContent='Gagal memulihkan: '+error.message;}finally{e.target.value='';}
};
function route(){
 speaker.stop();const parts=location.hash.slice(1).split('/');
 if(parts[0]==='module')levels(parts[1]);else if(parts[0]==='play')start(parts[1],Number(parts[2]));else home();window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
if('speechSynthesis' in window)speechSynthesis.addEventListener('voiceschanged',voiceInfo);
document.addEventListener('visibilitychange',()=>{if(document.hidden)speaker.stop();});
if('serviceWorker' in navigator && location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
updateStars();route();

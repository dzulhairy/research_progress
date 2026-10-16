"use strict";
const TOPICS={"nombor":["🔢","Nombor","Susun & nilai tempat"],"tambah":["➕","Tambah","Cari jumlah"],"tolak":["➖","Tolak","Cari beza"],"darab":["✖️","Darab","Sifir & pendaraban"],"bahagi":["➗","Bahagi","Pembahagian tepat"],"wang":["💰","Wang","Ringgit & sen"],"masa":["🕒","Masa","Jam & tempoh"],"bentuk":["🔺","Bentuk","Kenal bentuk 2D"],"pecahan":["🍰","Pecahan","Bahagian keseluruhan"],"perpuluhan":["🔟","Perpuluhan","Nombor perpuluhan"],"ukuran":["📏","Ukuran","Panjang & jisim"],"geometri":["📐","Geometri","Perimeter & luas"],"peratus":["💯","Peratus","Bahagian daripada 100"],"data":["📊","Data","Min & bacaan data"],"nisbah":["⚖️","Nisbah","Banding dua kuantiti"],"laju":["🚲","Laju","Jarak & masa"],"algebra":["🔤","Algebra","Ungkapan & nilai x"],"integer":["🌡️","Integer","Nombor negatif"],"faktor":["🧩","Faktor","Faktor & gandaan"],"persamaan":["🟰","Persamaan","Cari nilai pemboleh ubah"],"sudut":["📐","Sudut","Jenis & ukuran"],"koordinat":["🗺️","Koordinat","Titik pada satah"]};
const GRADES={"1":["nombor","tambah","tolak","wang","masa","bentuk"],"2":["nombor","tambah","tolak","darab","bahagi","wang","masa","bentuk"],"3":["nombor","tambah","tolak","darab","bahagi","pecahan","wang","masa","ukuran"],"4":["nombor","tambah","tolak","darab","bahagi","pecahan","perpuluhan","ukuran","geometri"],"5":["nombor","darab","bahagi","pecahan","perpuluhan","peratus","wang","geometri","data"],"6":["nombor","darab","bahagi","pecahan","perpuluhan","peratus","nisbah","laju","algebra","geometri"],"7":["integer","faktor","pecahan","peratus","nisbah","algebra","persamaan","sudut","koordinat","geometri","perpuluhan"]};
const SHAPES=[{"name":"Segi tiga","svg":"<polygon points=\"80,12 18,110 142,110\" fill=\"#ffdda1\" stroke=\"#bb8342\" stroke-width=\"5\" stroke-linejoin=\"round\"/>"},{"name":"Segi empat sama","svg":"<rect x=\"32\" y=\"15\" width=\"96\" height=\"96\" rx=\"7\" fill=\"#b1e9df\" stroke=\"#309b8c\" stroke-width=\"5\"/>"},{"name":"Segi empat tepat","svg":"<rect x=\"14\" y=\"32\" width=\"132\" height=\"64\" rx=\"7\" fill=\"#ded3fc\" stroke=\"#8b74cd\" stroke-width=\"5\"/>"},{"name":"Bulatan","svg":"<circle cx=\"80\" cy=\"63\" r=\"49\" fill=\"#ffc3d3\" stroke=\"#d56b97\" stroke-width=\"5\"/>"}];
function randint(a,b){return Math.floor(Math.random()*(b-a+1))+a;};
function pick(a){return a[randint(0,a.length-1)];};
function shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=randint(0,i);[b[i],b[j]]=[b[j],b[i]];}return b;};
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;};
function fraction(n,d){const g=gcd(n,d);return d/g===1?String(n/g):`${n/g}/${d/g}`;};
function fmt(n,opt={}){return (opt.prefix||"")+(opt.decimals!=null?Number(n).toFixed(opt.decimals):String(n))+(opt.suffix||"");};
function optionsFor(correct,extra=[]){
 const out=[String(correct)];
 for(const x of shuffle(extra.map(String))){if(!out.includes(x)){out.push(x);if(out.length===4)break;}}
 return shuffle(out);
};
function numeric(question,num,hint,opt={}){
 const step=opt.step??(Math.abs(num)>=1000?100:Math.abs(num)>=100?10:opt.decimals===2?0.25:opt.decimals===1?0.5:1);
 const min=opt.min??0;const rounding=10**(opt.decimals??0);
 let extras=[];
 for(const d of shuffle([-5,-4,-3,-2,-1,1,2,3,4,5,6,-6])){
   const v=Math.round((num+step*d)*rounding)/rounding;
   if(v>=min && v!==num)extras.push(fmt(v,opt));
 }
 for(let k=0;k<30&&extras.length<3;k++){const v=Math.round((num+step*(k+7))*rounding)/rounding;if(v>=min)extras.push(fmt(v,opt));}
 return {question,answer:fmt(num,opt),options:optionsFor(fmt(num,opt),extras),hint,visual:opt.visual||""};
};
function selected(question,answer,hint,alternatives,visual=""){
 return {question,answer:String(answer),options:optionsFor(answer,alternatives),hint,visual};
};
function generateQuestion(topic,grade,level){
 const boost=level==="mudah"?0:level==="sederhana"?1:2;
 const maxByGrade=[0,10,1000,10000,100000,1000000,1000000,1000000];
 const cap=Math.min(maxByGrade[grade],Math.round([0,10,100+boost*400,1000+boost*4500,10000+boost*35000,100000+boost*400000,100000+boost*400000,100000+boost*400000][grade]));
 let a,b,c,q,answer,d,kind,shape;
 if(topic==="nombor"){
   if(grade===1){
     kind=randint(0,2);a=randint(1,boost?Math.min(100,20+boost*30):10);
     if(kind===0)return numeric(`Apakah nombor selepas ${a}?`,a+1,"Kira satu langkah ke hadapan.",{min:0});
     if(kind===1)return numeric(`Apakah nombor sebelum ${a+1}?`,a,"Kira satu langkah ke belakang.");
     a=randint(2,10);return numeric("Berapakah bilangan bintang ini?",a,"Kira semua bintang satu demi satu.",{visual:'<div class="dotgroup">'+Array(a+1).join("⭐")+"</div>"});
   }
   if(grade<=3){
     a=randint(12,Math.max(30,cap-1));kind=randint(0,2);
     if(kind===0)return numeric(`Apakah nombor selepas ${a}?`,a+1,"Tambah satu pada nombor yang diberi.",{step:1});
     if(kind===1)return numeric(`Apakah nombor sebelum ${a}?`,a-1,"Tolak satu daripada nombor yang diberi.",{step:1});
     const value=grade===2?pick([10,100]):pick([10,100,1000]);const dig=randint(1,9),remainder=randint(0,value-1);a=dig*value+remainder;
     return numeric(`Apakah nilai digit ${dig} dalam nombor ${a}?`,dig*value,"Nilai tempat ialah nilai digit darab tempatnya.",{step:value});
   }
   a=pick([100,1000,10000]);b=randint(1,9);return numeric(`Digit ${b} berada di tempat ${a===100?"ratus":a===1000?"ribu":"puluh ribu"}. Apakah nilai digit itu?`,a*b,"Nilai digit = digit × nilai tempat.",{step:a});
 }
 if(topic==="tambah"){
   if(grade===1){a=randint(1,10+boost*10-1);b=randint(1,10+boost*10-a);q=numeric(`${a} + ${b} = ?`,a+b,`Mula dengan ${a}, kemudian kira ${b} lagi.`,{step:1});if(a+b<=10)q.visual='<div class="dotgroup">'+Array(a+1).join("🍎")+'<br>+ '+Array(b+1).join("🍏")+"</div>";return q;}
   a=randint(10,Math.floor(cap*.7));b=randint(1,Math.max(1,cap-a));return numeric(`${a} + ${b} = ?`,a+b,"Tambah dari kanan: sa, puluh, kemudian ratus.",{step:grade<=2?1:grade===3?10:100});
 }
 if(topic==="tolak"){
   a=grade===1?randint(2,10+boost*10):randint(20,cap);b=randint(1,a);
   return numeric(`${a} − ${b} = ?`,a-b,`Kira ${b} langkah ke belakang daripada ${a}.`,{step:grade<=2?1:grade===3?10:100});
 }
 if(topic==="darab"){
   if(grade===2){a=pick([2,5,10]);b=randint(1,10);return numeric(`${a} × ${b} = ?`,a*b,`Tambah ${a} sebanyak ${b} kali.`,{step:a});}
   a=grade===3?randint(2,9):grade===4?randint(4,20+boost*10):randint(11,30+boost*25);
   b=grade===3?randint(2,10):grade===4?randint(2,9):randint(2,12+boost*8);
   return numeric(`${a} × ${b} = ?`,a*b,`Pendaraban ialah tambah berulang: ${a} sebanyak ${b} kali.`,{step:Math.max(1,a)});
 }
 if(topic==="bahagi"){
   b=grade===2?pick([2,5,10]):randint(2,grade===3?9:12+boost*6);
   c=randint(2,grade===2?10:grade===3?15:30+boost*35);a=b*c;
   return numeric(`${a} ÷ ${b} = ?`,c,`Cari nombor yang apabila didarab dengan ${b} akan menjadi ${a}.`,{step:1});
 }
 if(topic==="wang"){
   if(grade===1){a=randint(1,4+boost*2);b=randint(1,4+boost*2);return numeric(`Ada RM${a}. Dapat lagi RM${b}. Berapakah jumlah wang?`,a+b,"Jumlah wang = wang asal + wang yang diterima.",{prefix:"RM",step:1});}
   if(grade===2){a=randint(5,30)*50;b=randint(2,20)*50;return numeric(`RM${(a/100).toFixed(2)} + RM${(b/100).toFixed(2)} = ?`,(a+b)/100,"Tambah jumlah ringgit dan sen.",{prefix:"RM",decimals:2,step:.5});}
   if(grade===3){a=randint(20,90)*25;b=randint(10,65)*25;return numeric(`Ali membeli barang RM${(a/100).toFixed(2)} dan RM${(b/100).toFixed(2)}. Jumlah harga?`,(a+b)/100,"Tambah dua harga untuk dapat jumlah.",{prefix:"RM",decimals:2,step:.5});}
   a=randint(20,70);b=pick([5,10,15,20]);return numeric(`Harga beg RM${a}. Diskaun RM${b}. Berapakah harga selepas diskaun?`,a-b,"Tolak nilai diskaun daripada harga asal.",{prefix:"RM",step:5});
 }
 if(topic==="masa"){
   if(grade===1){a=randint(1,9);b=randint(1,Math.min(3+boost,12-a));return numeric(`Sekarang pukul ${a}:00. ${b} jam kemudian pukul berapa?`,a+b,`Tambah ${b} jam pada pukul ${a}:00.`,{prefix:"Pukul ",step:1,min:1});}
   if(grade===2){a=randint(1,9);kind=randint(0,1);let ans=kind===0?`${a+1}:30`:`${a+1}:00`;return selected(`Sekarang pukul ${a}:${kind===0?"30":"00"}. Selepas 1 jam, pukul berapa?`,ans,"Tambah satu pada jam, minit kekal sama.",[`${a}:30`,`${a}:00`,`${a+2}:00`,`${a+2}:30`]);}
   a=randint(1,4)*15;b=randint(1,4)*15;return numeric(`${a} minit + ${b} minit = ?`,a+b,"Tambah kedua-dua tempoh dalam minit.",{suffix:" minit",step:15});
 }
 if(topic==="bentuk"){
   shape=pick(SHAPES);
   if(grade===1)return selected("Apakah nama bentuk ini?",shape.name,"Perhatikan sisi dan bentuk garisan.",SHAPES.map(x=>x.name),'<svg viewBox="0 0 160 122" role="img" aria-label="Bentuk geometri">'+shape.svg+"</svg>");
   if(shape.name==="Bulatan")return selected("Bentuk manakah tiada sisi lurus?","Bulatan","Sisi bulatan melengkung.",SHAPES.map(x=>x.name));
   const sides=shape.name==="Segi tiga"?3:4;return numeric(`Berapakah sisi lurus bentuk ini?`,sides,"Kira setiap garisan lurus pada keliling bentuk.",{step:1,visual:'<svg viewBox="0 0 160 122" role="img" aria-label="Bentuk geometri">'+shape.svg+"</svg>"});
 }
 if(topic==="pecahan"){
   if(grade===3){d=pick([2,3,4,5]);c=randint(2,9);return numeric(`Berapakah 1/${d} daripada ${d*c}?`,c,`Bahagikan ${d*c} kepada ${d} bahagian sama besar.`,{step:1});}
   if(grade<=5){d=pick(grade===4?[4,5,6,8]:[5,6,8,10]);a=randint(1,Math.max(1,Math.floor(d/2)));b=randint(1,d-a);answer=fraction(a+b,d);return selected(`${a}/${d} + ${b}/${d} = ?`,answer,"Penyebut sama: tambah pengangka, kemudian permudahkan.",[fraction(a+b+1,d),fraction(Math.abs(a-b)||1,d),fraction(a+b,d+1),fraction(a+b+2,d),`${a+b}/${d}`]);}
   if(grade===6){d=pick([2,3,4,5,6]);a=randint(1,d-1);b=randint(2,4);answer=fraction(a*b,d);return selected(`${a}/${d} × ${b} = ?`,answer,`Darab pengangka ${a} dengan ${b}, penyebut kekal ${d}. Permudahkan.`,[fraction(a+b,d),fraction(a,d*b),fraction(a*b+1,d),fraction(a*b,d+1),fraction(a*b+2,d)]);}
   d=pick([2,3,4,5,6]);a=randint(2,d);b=randint(1,a-1);answer=fraction(a-b,d);return selected(`${a}/${d} − ${b}/${d} = ?`,answer,"Untuk penyebut yang sama, tolak pengangka.",[fraction(a+b,d),fraction(b,d),fraction(a-b+1,d),fraction(a-b,d+1),fraction(a,d)]);}
 if(topic==="perpuluhan"){
   if(grade===4){a=randint(1,70);b=randint(1,25);return numeric(`${(a/10).toFixed(1)} + ${(b/10).toFixed(1)} = ?`,(a+b)/10,"Sejajarkan titik perpuluhan semasa menambah.",{decimals:1,step:.2});}
   if(grade===5){a=randint(105,850);b=randint(10,100);return numeric(`${(a/100).toFixed(2)} − ${(b/100).toFixed(2)} = ?`,(a-b)/100,"Susun digit mengikut nilai tempat dan tolak.",{decimals:2,step:.1});}
   if(grade===6){a=randint(11,95);b=randint(2,8);return numeric(`${(a/10).toFixed(1)} × ${b} = ?`,a*b/10,"Darab seperti nombor bulat dahulu, kemudian letakkan titik perpuluhan.",{decimals:1,step:.5});}
   a=randint(20,90);b=randint(2,5);return numeric(`${(a/10).toFixed(1)} ÷ ${b} = ?`,a/(10*b),"Bahagi nilai perpuluhan dengan nombor bulat.",{decimals:2,step:.25});
 }
 if(topic==="ukuran"){
   if(grade===3){a=randint(12,100);b=randint(7,70);return numeric(`${a} cm + ${b} cm = ?`,a+b,"Tambah ukuran yang mempunyai unit sama.",{suffix:" cm",step:10});}
   a=randint(1,grade===4?30:100);return numeric(`${a} meter bersamaan berapa sentimeter?`,a*100,"1 meter = 100 sentimeter.",{suffix:" cm",step:100});
 }
 if(topic==="geometri"){
   a=randint(3,12+boost*6);b=randint(2,11+boost*4);
   kind=grade===4?0:grade===5?randint(0,1):grade===6?randint(0,2):randint(0,2);
   if(kind===0)return numeric(`Segi empat tepat panjang ${a} cm, lebar ${b} cm. Berapakah perimeternya?`,2*(a+b),"Perimeter segi empat tepat = 2 × (panjang + lebar).",{suffix:" cm",step:2});
   if(kind===1)return numeric(`Segi empat tepat panjang ${a} cm, lebar ${b} cm. Berapakah luasnya?`,a*b,"Luas segi empat tepat = panjang × lebar.",{suffix:" cm²",step:b});
   a=randint(2,12)*2;return numeric(`Segi tiga mempunyai tapak ${a} cm dan tinggi ${b} cm. Berapakah luasnya?`,a*b/2,"Luas segi tiga = ½ × tapak × tinggi.",{suffix:" cm²",step:b});
 }
 if(topic==="peratus"){
   if(grade===5){b=pick([10,20,25,50]);a=randint(2,12)*(100/b);return numeric(`Berapakah ${b}% daripada ${a}?`,a*b/100,`${b}% = ${b}/100. Darab dengan ${a}.`,{step:1});}
   if(grade===6){b=pick([10,20,25,50]);a=randint(2,12)*(100/b);return numeric(`${b}% daripada ${a} murid ialah berapa murid?`,a*b/100,"Darab jumlah murid dengan peratus dan bahagi 100.",{suffix:" murid",step:1});}
   a=randint(3,15)*10;b=pick([10,20,30,40,50]);return numeric(`Harga RM${a}. Diskaun ${b}%. Berapakah harga selepas diskaun?`,a*(100-b)/100,"Harga selepas diskaun = harga asal × (100 − peratus diskaun) ÷ 100.",{prefix:"RM",decimals:2,step:5});
 }
 if(topic==="data"){
   a=randint(5,25);b=randint(1,Math.min(4,a-1));
   if(randint(0,1)===0)return numeric(`Tiga minggu mencatat ${a-b}, ${a} dan ${a+b} buku. Berapakah min (purata) bilangan buku?`,a,"Min = jumlah semua nilai ÷ 3.",{suffix:" buku",step:1});
   return numeric(`Data: ${a-b}, ${a}, ${a+b}. Berapakah julat data ini?`,2*b,"Julat = nilai tertinggi − nilai terendah.",{step:1});
 }
 if(topic==="nisbah"){
   a=randint(1,8);b=randint(1,8);c=randint(2,5);
   if(grade===6){return selected(`Ada ${a*c} guli merah dan ${b*c} guli biru. Permudahkan nisbah merah : biru.`,`${a/gcd(a,b)}:${b/gcd(a,b)}`,"Bahagikan kedua-dua nombor dengan faktor sepunya terbesar.",[`${a*c}:${b*c}`,`${b}:${a}`,`${a+1}:${b}`,`${a}:${b+1}`,`${b/gcd(a,b)}:${a/gcd(a,b)}`]);}
   a=randint(2,7);b=randint(2,7);c=randint(2,8);
   return numeric(`Nisbah murid lelaki : perempuan ialah ${a}:${b}. Jika ada ${a*c} murid lelaki, berapa murid perempuan?`,b*c,`Setiap bahagian bernilai ${c}. Murid perempuan = ${b} × ${c}.`,{suffix:" murid",step:c});
 }
 if(topic==="laju"){
   b=randint(2,5);c=randint(15,60);a=b*c;return numeric(`Sebuah bas bergerak ${a} km dalam ${b} jam. Berapakah lajunya?`,c,"Laju = jarak ÷ masa.",{suffix:" km/j",step:5});
 }
 if(topic==="algebra"){
   if(grade===6){a=randint(2,15);b=randint(2,15);return numeric(`Jika x + ${a} = ${a+b}, berapakah x?`,b,`Tolak ${a} pada kedua-dua belah persamaan.`,{step:1});}
   a=randint(2,9);b=randint(2,9);
   return selected(`Ringkaskan ${a}x + ${b}x.`,`${a+b}x`,"Tambah pekali kerana kedua-dua sebutan mengandungi x.",[`${a*b}x`,`${a+b}`,`${a}x`,`${b}x`,`${a+b}x²`,`${Math.abs(a-b)}x`]);
 }
 if(topic==="integer"){
   a=randint(-20,10);b=randint(-10,10);
   if(randint(0,1)===0)return numeric(`(${a}) + (${b}) = ?`,a+b,"Tambah pada garis nombor; ke kiri untuk negatif, ke kanan untuk positif.",{step:1,min:-50});
   return numeric(`(${a}) − (${b}) = ?`,a-b,"Menolak nombor negatif sama seperti menambah nombor positif.",{step:1,min:-50});
 }
 if(topic==="faktor"){
   if(randint(0,1)===0){a=pick([2,3,4,5,6,7]);b=randint(2,9);return numeric(`Berapakah gandaan ${a} yang ke-${b}?`,a*b,`Gandaan ke-${b} = ${a} × ${b}.`,{step:a});}
   a=pick([12,18,20,24,30,36,40,48]);b=pick([2,3,4,5,6,8]);return selected(`Antara berikut, yang manakah faktor bagi ${a}?`,pick([1,2,3,4,5,6,8,10,12].filter(x=>a%x===0)),"Faktor membahagi sesuatu nombor tanpa baki.",[7,11,13,17,19,23,29,31].map(String));
 }
 if(topic==="persamaan"){
   a=randint(2,7);b=randint(1,12);c=randint(2,15);
   return numeric(`Selesaikan ${a}x + ${b} = ${a*c+b}. Berapakah x?`,c,`Tolak ${b}, kemudian bahagi dengan ${a}.`,{step:1});
 }
 if(topic==="sudut"){
   const examples=[["tirus",randint(20,80)],["tegak",90],["cakah",randint(100,175)],["lurus",180]];
   const example=pick(examples);return selected(`Sudut ${example[1]}° ialah sudut jenis apa?`,example[0], "Sudut tirus <90°, tegak 90°, cakah antara 90° dan 180°, lurus 180°.",examples.map(x=>x[0]));
 }
 if(topic==="koordinat"){
   a=randint(-8,8);b=randint(-8,8);kind=randint(0,1);
   return numeric(`Titik P ialah (${a}, ${b}). Apakah koordinat ${kind===0?"x":"y"} bagi P?`,kind===0?a:b,"Dalam (x, y), nombor pertama ialah x dan nombor kedua ialah y.",{step:1,min:-12});
 }
 throw new Error("Topik tidak disokong: "+topic);
};
function makeRound(grade,level,topic){
 const types=topic==="campur"?shuffle(GRADES[grade].concat(shuffle(GRADES[grade]).slice(0,Math.max(0,10-GRADES[grade].length)))).slice(0,10):Array(10).fill(topic);
 const used=new Set();let questions=[];
 for(let t of types){let q,tries=0;do{q=generateQuestion(t,grade,level);tries++;}while(used.has(q.question+"::"+q.answer)&&tries<75);
   q.topic=t;used.add(q.question+"::"+q.answer);questions.push(q);}
 return questions;
};
window.MATH_TOPICS=TOPICS;
window.MATH_GRADES=GRADES;
window.MATH_ROUND=makeRound;
(function () {
"use strict";
const TOPICS = window.MATH_TOPICS;
const GRADES = window.MATH_GRADES;
const LEVELS = ["mudah","sederhana","mencabar"];
const $=id=>document.getElementById(id);
let selectedGrade=1,selectedTopic="campur",selectedLevel="mudah",game=null;
const bestKey=n=>"jom-matematik-best-grade-"+n;
function safeBest(n){try{return Number(localStorage.getItem(bestKey(n)))||0;}catch(_){return 0;}}
function storeBest(n,score){try{localStorage.setItem(bestKey(n),String(Math.max(safeBest(n),score)));}catch(_){}}
function show(s){for(const id of ["setup","quiz","end"])$(id).hidden=id!==s;window.scrollTo({top:0,behavior:"smooth"});}
function setText(id,str){$(id).textContent=String(str);}
function renderYears(){
 const root=$("year-grid");root.replaceChildren();
 for(let n=1;n<=7;n++){
  const btn=document.createElement("button");btn.type="button";btn.className="year-card";btn.dataset.grade=String(n);btn.setAttribute("aria-pressed",String(n===selectedGrade));
  const name=n===7?"Tingkatan 1":"Tahun "+n;
  const icon=n===1?"🌱":n===2?"🌼":n===3?"🌷":n===4?"🚀":n===5?"🧠":n===6?"🏅":"🎓";
  btn.innerHTML='<span class="year-emoji" aria-hidden="true">'+icon+'</span><strong>'+name+'</strong><small>'+(n===7?"Tahun 7 · ±13 tahun":"±"+(n+6)+" tahun")+"</small>";
  btn.addEventListener("click",()=>{selectedGrade=n;selectedTopic="campur";renderYears();renderTopics();});
  root.appendChild(btn);
 }
 setText("grade-status",selectedGrade===7?"Pilihan: Tingkatan 1 (Tahun 7)":"Pilihan: Tahun "+selectedGrade);
 setText("best-label","🏆 Rekod terbaik: "+safeBest(selectedGrade)+"/10");
}
function renderTopics(){
 const el=$("topic-grid");el.replaceChildren();
 const list=["campur"].concat(GRADES[selectedGrade]);
 list.forEach((t,i)=>{
  const info=t==="campur"?["🎲","Campur-campur","Semua topik"]:TOPICS[t];
  const btn=document.createElement("button");btn.type="button";btn.className="topic";btn.setAttribute("aria-pressed",String(t===selectedTopic));
  const icon=document.createElement("span");icon.className="topic-icon";icon.textContent=info[0];icon.setAttribute("aria-hidden","true");
  const desc=document.createElement("span");const strong=document.createElement("strong");strong.textContent=info[1];const small=document.createElement("small");small.textContent=info[2];desc.append(strong,small);btn.append(icon,desc);
  btn.addEventListener("click",()=>{selectedTopic=t;renderTopics();});
  el.appendChild(btn);
 });
}
function renderLevels(){
 document.querySelectorAll("[data-level]").forEach(button=>{
  button.setAttribute("aria-pressed",String(button.dataset.level===selectedLevel));
  button.onclick=()=>{selectedLevel=button.dataset.level;renderLevels();};
 });
}
function start(){
 game={questions:window.MATH_ROUND(selectedGrade,selectedLevel,selectedTopic),grade:selectedGrade,index:0,stars:0,hadError:false,done:false};
 show("quiz");render();
}
function render(){
 const q=game.questions[game.index];game.done=false;game.hadError=false;
 setText("counter",(game.grade===7?"Tingkatan 1":"Tahun "+game.grade)+" · Soalan "+(game.index+1)+"/10");
 setText("stars","⭐ "+game.stars+" bintang");
 $("progress-fill").style.width=(game.index/10*100)+"%";$("progress").setAttribute("aria-valuenow",game.index);
 setText("question",q.question);$("visual").innerHTML=q.visual||"";$("answers").replaceChildren();
 q.options.forEach(value=>{
  const btn=document.createElement("button");btn.type="button";btn.className="answer";btn.textContent=String(value);
  btn.addEventListener("click",()=>answer(btn,value));$("answers").appendChild(btn);
 });
 $("feedback").hidden=true;$("feedback").className="feedback";$("hint").hidden=false;$("reveal").hidden=false;
 $("next").hidden=true;setText("next",game.index===9?"Lihat keputusan 🏆":"Soalan seterusnya →");
}
function feedback(message,type){setText("feedback",message);$("feedback").className="feedback "+type;$("feedback").hidden=false;}
function closeQuestion(correct){
 game.done=true;if(correct&&!game.hadError)game.stars++;
 setText("stars","⭐ "+game.stars+" bintang");
 [...$("answers").children].forEach((b,i)=>{b.disabled=true;if(game.questions[game.index].options[i]===game.questions[game.index].answer)b.classList.add("good");});
 $("hint").hidden=true;$("reveal").hidden=true;$("next").hidden=false;
}
function answer(button,value){
 if(game.done||button.disabled)return;
 if(value===game.questions[game.index].answer){
  closeQuestion(true);feedback(game.hadError?"Tepat! Hebat kerana terus mencuba! 🌈":"Betul! Kamu dapat satu bintang! ⭐","ok");
 }else{game.hadError=true;button.disabled=true;button.classList.add("bad");feedback("Belum tepat. Cuba lagi! Kamu boleh. 💛","retry");}
}
function reveal(){
 if(game.done)return;
 game.hadError=true;const q=game.questions[game.index];closeQuestion(false);feedback("Jawapan: "+q.answer+". Sekarang kamu sudah tahu! 🌼","retry");
}
function next(){
 if(!game.done)return;
 game.index++;if(game.index<10){render();return;}
 storeBest(game.grade,game.stars);renderYears();show("end");
 $("progress-fill").style.width="100%";$("progress").setAttribute("aria-valuenow","10");
 const e=game.stars>=8;setText("end-emoji",e?"🏆":game.stars>=5?"🌟":"💛");
 setText("end-title",e?"Hebat sekali!":"Syabas kerana mencuba!");
 setText("final-score","⭐ "+game.stars+" / 10 bintang");
 setText("end-message",e?"Bagus! Boleh cuba tahap seterusnya.":"Setiap soalan membantu kita belajar. Cuba lagi dan kumpul lebih banyak bintang!");
}
$("start").addEventListener("click",start);$("again").addEventListener("click",start);
$("change").addEventListener("click",()=>show("setup"));$("back").addEventListener("click",()=>show("setup"));
$("hint").addEventListener("click",()=>{if(!game.done)feedback("💡 "+game.questions[game.index].hint,"retry");});
$("reveal").addEventListener("click",reveal);$("next").addEventListener("click",next);
renderYears();renderTopics();renderLevels();
})();
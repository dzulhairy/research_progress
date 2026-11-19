export const MODULES = [
 {id:'letters',icon:'🔤',title:'Kenali Huruf Arab',description:'Kenal 28 huruf hijaiyah dan nama huruf.',tint:'#ede7fc'},
 {id:'sounds',icon:'🧩',title:'Suku Kata & Bunyi',description:'Fathah, kasrah dan dammah. Jom sebut!',tint:'#eaf7dc'},
 {id:'trace',icon:'✍️',title:'Menulis Huruf',description:'Ikut bentuk huruf dengan jari atau tetikus.',tint:'#fff3d6'},
 {id:'vocab',icon:'📖',title:'Baca Perkataan',description:'Baca kosa kata Arab dan pilih maknanya.',tint:'#ffe9ef'},
 {id:'spell',icon:'⌨️',title:'Menulis Perkataan',description:'Eja perkataan dengan papan kekunci Arab.',tint:'#e2f3fb'},
 {id:'sentence',icon:'💭',title:'Bina Ayat',description:'Susun perkataan menjadi ayat Bahasa Arab.',tint:'#f9e7f7'},
 {id:'numbers',icon:'🎨',title:'Nombor & Warna',description:'Kenali nombor 1–10 dan warna di sekeliling.',tint:'#fff3d6'}
];
export const LETTERS = [
 ['ا','Alif'],['ب','Ba'],['ت','Ta'],['ث','Tha'],['ج','Jim'],['ح','Ha (ح)'],['خ','Kha'],['د','Dal'],['ذ','Dhal'],['ر','Ra'],['ز','Zai'],['س','Sin'],['ش','Shin'],['ص','Sad'],['ض','Dad'],['ط','To (ط)'],['ظ','Zo (ظ)'],['ع','Ain'],['غ','Ghain'],['ف','Fa'],['ق','Qaf'],['ك','Kaf'],['ل','Lam'],['م','Mim'],['ن','Nun'],['ه','Ha (ه)'],['و','Wau'],['ي','Ya']
].map(([ar,ms])=>({ar,ms}));
export const VOCAB = [
 ['بَيْت','Rumah','🏠'],['بَاب','Pintu','🚪'],['كِتَاب','Buku','📕'],['قَلَم','Pen','🖊️'],['كُرْسِيّ','Kerusi','🪑'],
 ['مَدْرَسَة','Sekolah','🏫'],['مَكْتَبَة','Perpustakaan','📚'],['فَصْل','Kelas','🏫'],['مُعَلِّم','Guru lelaki','👨‍🏫'],['طَالِب','Murid lelaki','🎒'],
 ['أَب','Ayah','👨'],['أُمّ','Ibu','👩'],['أَخ','Saudara lelaki','👦'],['أُخْت','Saudara perempuan','👧'],['جَدّ','Datuk','👴'],
 ['قِطّ','Kucing','🐈'],['كَلْب','Anjing','🐕'],['أَسَد','Singa','🦁'],['فِيل','Gajah','🐘'],['سَمَكَة','Ikan','🐟'],
 ['تُفَّاح','Epal','🍎'],['مَوْز','Pisang','🍌'],['خُبْز','Roti','🍞'],['حَلِيب','Susu','🥛'],['مَاء','Air','💧'],
 ['شَمْس','Matahari','☀️'],['قَمَر','Bulan','🌙'],['نَجْم','Bintang','⭐'],['شَجَرَة','Pokok','🌳'],['زَهْرَة','Bunga','🌸'],
 ['يَد','Tangan','✋'],['عَيْن','Mata','👁️'],['أُذُن','Telinga','👂'],['أَنْف','Hidung','👃'],['فَم','Mulut','👄'],
 ['سَيَّارَة','Kereta','🚗'],['حَافِلَة','Bas','🚌'],['قِطَار','Kereta api','🚆'],['طَائِرَة','Kapal terbang','✈️'],['دَرَّاجَة','Basikal','🚲'],
 ['مَسْجِد','Masjid','🕌'],['مُسْتَشْفَى','Hospital','🏥'],['سُوق','Pasar','🛍️'],['حَدِيقَة','Taman','🌷'],['مَطْعَم','Restoran','🍽️'],
 ['كُرَة','Bola','⚽'],['سَاعَة','Jam','🕒'],['حَقِيبَة','Beg','🎒'],['سَرِير','Katil','🛏️'],['نَافِذَة','Tingkap','🪟'],
 ['بَحْر','Laut','🌊'],['جَبَل','Gunung','⛰️'],['نَهْر','Sungai','🏞️'],['مَطَر','Hujan','🌧️'],['سَحَاب','Awan','☁️'],
 ['أَرْنَب','Arnab','🐇'],['بَقَرَة','Lembu','🐄'],['حِصَان','Kuda','🐎'],['طَائِر','Burung','🐦'],['بَطَّة','Itik','🦆']
].map(([ar,ms,emoji])=>({ar,ms,emoji}));
export const SENTENCES = [
 ['Saya murid lelaki.','أَنَا طَالِبٌ'],['Ini sebuah buku.','هَذَا كِتَابٌ'],['Ini sebuah sekolah.','هَذِهِ مَدْرَسَةٌ'],['Rumah itu besar.','الْبَيْتُ كَبِيرٌ'],['Buku itu baharu.','الْكِتَابُ جَدِيدٌ'],
 ['Saya suka Bahasa Arab.','أَنَا أُحِبُّ اللُّغَةَ الْعَرَبِيَّةَ'],['Ahmad membaca buku.','يَقْرَأُ أَحْمَدُ كِتَابًا'],['Fatimah minum susu.','تَشْرَبُ فَاطِمَةُ الْحَلِيبَ'],['Budak lelaki itu bermain bola.','يَلْعَبُ الْوَلَدُ بِالْكُرَةِ'],['Guru lelaki itu berada di dalam kelas.','الْمُعَلِّمُ فِي الْفَصْلِ'],
 ['Ahmad pergi ke perpustakaan.','يَذْهَبُ أَحْمَدُ إِلَى الْمَكْتَبَةِ'],['Fatimah pergi ke sekolah.','تَذْهَبُ فَاطِمَةُ إِلَى الْمَدْرَسَةِ'],['Kucing itu berada di bawah kerusi.','الْقِطُّ تَحْتَ الْكُرْسِيِّ'],['Pen itu berada di atas meja.','الْقَلَمُ عَلَى الْمَكْتَبِ'],['Saya makan epal setiap hari.','آكُلُ التُّفَّاحَ كُلَّ يَوْمٍ'],
 ['Murid lelaki itu menulis dengan pen.','يَكْتُبُ الطَّالِبُ بِالْقَلَمِ'],['Kami bermain di taman.','نَلْعَبُ فِي الْحَدِيقَةِ'],['Ibu berada di dalam rumah.','أُمِّي فِي الْبَيْتِ'],['Ayah pergi ke masjid.','يَذْهَبُ أَبِي إِلَى الْمَسْجِدِ'],['Saya ada sebuah beg baharu.','عِنْدِي حَقِيبَةٌ جَدِيدَةٌ']
].map(([ms,ar])=>({ms,ar}));
export const NUMBERS = [
 ['وَاحِد','Satu','١'],['اِثْنَان','Dua','٢'],['ثَلَاثَة','Tiga','٣'],['أَرْبَعَة','Empat','٤'],['خَمْسَة','Lima','٥'],['سِتَّة','Enam','٦'],['سَبْعَة','Tujuh','٧'],['ثَمَانِيَة','Lapan','٨'],['تِسْعَة','Sembilan','٩'],['عَشَرَة','Sepuluh','١٠']
].map(([ar,ms,symbol])=>({ar,ms,symbol}));
export const COLORS = [
 ['أَحْمَر','Merah','#ef6262'],['أَزْرَق','Biru','#5597ee'],['أَخْضَر','Hijau','#39aa80'],['أَصْفَر','Kuning','#f2cd50'],['أَبْيَض','Putih','#ffffff'],['أَسْوَد','Hitam','#292445'],['بُرْتُقَالِيّ','Jingga','#f09c48'],['بَنَفْسَجِيّ','Ungu','#9167da']
].map(([ar,ms,color])=>({ar,ms,color}));

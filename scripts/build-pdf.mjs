import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import fs from "node:fs";

fs.mkdirSync("output", { recursive: true });
fs.mkdirSync("output/sections", { recursive: true });

const sections=[["overview","Overview"],["team","Research team"],["research","Research progress"],["meetings","Supervisory meetings"],["outputs","Research outputs"],["field","Field highlights"],["logbook","Logbook"],["next","Timeline & milestones"]];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(20000);

const css=`
@page { size:A4 landscape; margin:10mm 10mm 12mm; }
html,body{background:#fff!important}
.sidebar,.top-actions,.presentation-controls,dialog,.skip,.no-print{display:none!important}
button:not(.image-button):not(.output-image):not(.gantt-bar){display:none!important}
.section-head:has(+ .gantt-scroll) .meta{display:none!important}
body:has(.gantt-scroll) .timeline-summary{padding:16px 22px!important;gap:16px!important}
body:has(.gantt-scroll) .timeline-summary h2{margin:4px 0!important;font-size:1.25rem!important}
body:has(.gantt-scroll) .timeline-summary p{font-size:.78rem!important;line-height:1.35!important}
body:has(.gantt-scroll) .section-head{margin:14px 0 8px!important}
body:has(.gantt-scroll) .section-head h2{margin:0!important}
body:has(.gantt-scroll) .gantt-scroll{break-inside:avoid!important;page-break-inside:avoid!important}
.gantt-scroll{overflow:visible!important}
.gantt{min-width:0!important;padding:8px!important}
.gantt-years,.gantt-months{grid-template-columns:185px repeat(17,minmax(0,1fr))!important}
.gantt-row{grid-template-columns:185px 1fr!important;min-height:58px!important}
.gantt-cell{min-height:58px!important}
.gantt-label{padding:8px 10px!important;font-size:.78rem!important}
.gantt-label small{margin-top:3px!important;font-size:.68rem!important}
.gantt-years>*{padding:7px 0!important}
.gantt-months span{padding:7px 0!important}
.gantt-bar{display:block!important;visibility:visible!important;opacity:1!important;print-color-adjust:exact!important;-webkit-print-color-adjust:exact!important;margin:0 2px!important;padding:8px 2px!important;min-height:32px!important;font-size:0!important;line-height:0!important;overflow:hidden!important}
.gantt-bar::after{content:""!important}
.gantt-bar:hover{filter:none!important;transform:none!important}
.image-button,.output-image{display:block!important;border:0!important;padding:0!important;background:transparent!important;width:100%!important}
.image-button img,.output-image img{display:block!important;width:100%!important;height:auto!important;max-height:115mm!important;object-fit:contain!important}
.expand-label{display:none!important}
.workspace{margin:0!important;width:100%!important}
main,.container,.content{max-width:none!important;width:auto!important}
#content{padding:0!important}
article,.card,.panel,.timeline-item,.activity-card,.team-card,figure,img,tr{break-inside:avoid;page-break-inside:avoid}
.eyebrow{margin-bottom:8px!important}
h1{font-size:2.15rem!important;margin-bottom:9px!important}
.intro{margin-bottom:16px!important;line-height:1.45!important}
.section-head{margin:18px 0 10px!important}
.panel{padding:18px!important}
.study-banner{margin:14px 0!important;padding:18px 22px!important}
.study-title{font-size:1.3rem!important;line-height:1.35!important}
.objective-card{min-height:0!important;padding:16px!important}
.objective-card .card-top{margin-bottom:12px!important}
.overview-bottom{margin-top:14px!important}
.status-line{padding-top:12px!important;margin-top:12px!important}
.work-item{padding:14px 0!important}
.note-box{margin-top:10px!important;padding:12px 16px!important}
.activity{padding:13px 16px!important;gap:14px!important}
.source-note{padding-top:8px!important}
.outputs-grid{margin:14px 0!important;gap:16px!important}
.award-panel{padding:22px!important}
.review-panel h2{margin:10px 0!important}
.review-track{padding-top:14px!important}
.table-wrap{overflow:visible!important}
td,th{padding:11px 13px!important}
.field-content{padding:18px!important}
.image-button{height:205px!important}
.field-content h2{font-size:1.15rem!important;margin:8px 0!important}
.field-content p{font-size:.84rem!important;line-height:1.55!important}
/* Final landscape flow compaction */
article,.card,.panel,.timeline-item,.activity-card,.team-card,figure,tr{break-inside:auto!important;page-break-inside:auto!important}
img{break-inside:avoid!important;page-break-inside:avoid!important}
body:has(.team-card) .team-card,
body:has(.field-card) .field-card,
body:has(.gantt-scroll) .gantt-scroll{break-inside:avoid!important;page-break-inside:avoid!important}
body:has(.team-card) .section-head,
body:has(.activity) .section-head,
body:has(.outputs-grid) .section-head{margin:10px 0 7px!important}
body:has(.team-card) .three-col{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important}
body:has(.team-card) .team-card{padding:10px!important;min-height:0!important}
body:has(.team-card) .team-card img{max-height:82px!important}
body:has(.team-card) .team-card h3{margin:7px 0 4px!important}
body:has(.team-card) .team-card p{margin:3px 0!important}
body:has(.outputs-grid) .outputs-grid{break-inside:auto!important;page-break-inside:auto!important;gap:12px!important;margin:6px 0 10px!important}
body:has(.outputs-grid) .review-panel,
body:has(.outputs-grid) .award-panel{break-inside:avoid!important;page-break-inside:avoid!important}
body:has(.outputs-grid) .panel{padding:14px!important}
body:has(.activity) .activity{break-inside:avoid!important;page-break-inside:avoid!important;padding:9px 12px!important;gap:10px!important}
body:has(.activity) .activity p{margin:2px 0!important;line-height:1.3!important}
body:has(.activity) .source-note{break-inside:avoid!important;page-break-inside:avoid!important;margin-top:4px!important;padding-top:4px!important}
body:has(table) table{break-inside:auto!important;page-break-inside:auto!important}
body:has(table) thead{display:table-header-group!important}
body:has(table) tr{break-inside:avoid!important;page-break-inside:avoid!important}
body:has(table) td,body:has(table) th{padding:8px 10px!important;line-height:1.3!important}
details{break-inside:auto!important;page-break-inside:auto!important}
details>summary{break-after:avoid!important;page-break-after:avoid!important}

/* Landscape section-specific pagination */
body:has(.outputs-grid) .outputs-grid{margin-top:8px!important}
body:has(.outputs-grid) .award-panel,
body:has(.outputs-grid) .review-panel{padding:16px!important}
body:has(.outputs-grid) .award-panel h2{font-size:1.35rem!important}
body:has(.outputs-grid) .award-number{font-size:4.4rem!important;margin:10px 0!important}
body:has(.outputs-grid) .metric-pair{padding-top:10px!important;margin-top:10px!important}
body:has(.outputs-grid) .review-track{margin-top:8px!important}
body:has(.team-card) .three-col{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important}
body:has(.team-card) .team-card{padding:12px!important}
body:has(.team-card) .team-card h3{font-size:.88rem!important;line-height:1.25!important}
body:has(.team-card) .team-card p{font-size:.75rem!important;line-height:1.35!important}
body:has(.team-card) .team-card img{max-height:95px!important;object-fit:contain!important}
body:has(.activity) .activity{grid-template-columns:92px minmax(0,1fr) 165px 70px!important}
body:has(.activity) .log-list{gap:7px!important}
body:has(.activity) .activity h3{font-size:.9rem!important}
body:has(.activity) .activity-date,
body:has(.activity) .activity-role{font-size:.76rem!important}
body:has(.activity) .activity-domain{font-size:.7rem!important}

img{max-width:100%!important;height:auto!important}
a{color:inherit!important;text-decoration:none!important}
*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
`;

for(let i=0;i<sections.length;i++){
 const [id,label]=sections[i];
 console.log(`Rendering ${i+1}/${sections.length}: ${label}`);
 await page.goto(`http://127.0.0.1:8000/#${id}`,{waitUntil:"domcontentloaded",timeout:20000});
 await page.waitForFunction(expected => document.title.toLowerCase().startsWith(expected.toLowerCase()), id==="next"?"Timeline":label, {timeout:10000}).catch(()=>{});
 await page.waitForTimeout(500);
 await page.addStyleTag({content:css + "\n@page { size: A4 landscape !important; margin:10mm 10mm 12mm; }\n"});
 await page.evaluate(async(id)=>{
   if(id==="next") document.querySelectorAll("details").forEach(d=>d.open=true);

   const pending=[...document.images].filter(x=>!x.complete);
   await Promise.race([
     Promise.all(pending.map(img=>new Promise(resolve=>{
       img.addEventListener("load",resolve,{once:true});
       img.addEventListener("error",resolve,{once:true});
     }))),
     new Promise(resolve=>setTimeout(resolve,5000))
   ]);
   if(document.fonts?.ready) await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]);
 }, id);
 const p=`output/sections/${String(i+1).padStart(2,"0")}-${id}.pdf`;
 await page.pdf({path:p,format:"A4",landscape:true,printBackground:true,preferCSSPageSize:false,displayHeaderFooter:true,headerTemplate:"<div></div>",footerTemplate:`<div style="font-size:8px;width:100%;text-align:center;color:#777;">DrPH Research Progress &nbsp; | &nbsp; ${label} &nbsp; | &nbsp; <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,margin:{top:"10mm",right:"10mm",bottom:"14mm",left:"10mm"}});
 console.log(`Finished: ${label}`);
}
await browser.close();

console.log("Merging section PDFs...");
const merged=await PDFDocument.create();
for(let i=0;i<sections.length;i++){
 const [id]=sections[i];
 const bytes=fs.readFileSync(`output/sections/${String(i+1).padStart(2,"0")}-${id}.pdf`);
 const src=await PDFDocument.load(bytes);
 const pages=await merged.copyPages(src,src.getPageIndices());
 pages.forEach(p=>merged.addPage(p));
}
fs.writeFileSync("output/DrPH_Research_Progress_Dzul_Hairy.pdf",await merged.save());
console.log(`Complete: ${merged.getPageCount()} pages`);

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
@page { size:A4; margin:10mm 10mm 12mm; }
html,body{background:#fff!important}
.sidebar,.top-actions,.presentation-controls,dialog,.skip,.no-print{display:none!important}
button:not(.image-button):not(.output-image):not(.gantt-bar){display:none!important}
.gantt-bar{display:block!important;visibility:visible!important;opacity:1!important;print-color-adjust:exact!important;-webkit-print-color-adjust:exact!important}
.image-button,.output-image{display:block!important;border:0!important;padding:0!important;background:transparent!important;width:100%!important}
.image-button img,.output-image img{display:block!important;width:100%!important;height:auto!important;max-height:115mm!important;object-fit:contain!important}
.expand-label{display:none!important}
.workspace{margin:0!important;width:100%!important}
main,.container,.content,section{max-width:none!important;width:auto!important}
section,article,.card,.panel,.timeline-item,.activity-card,.team-card,figure,img,tr{break-inside:avoid;page-break-inside:avoid}
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
 await page.addStyleTag({content:css});
 await page.evaluate(async()=>{
   const pending=[...document.images].filter(x=>!x.complete);
   await Promise.race([
     Promise.all(pending.map(img=>new Promise(resolve=>{
       img.addEventListener("load",resolve,{once:true});
       img.addEventListener("error",resolve,{once:true});
     }))),
     new Promise(resolve=>setTimeout(resolve,5000))
   ]);
   if(document.fonts?.ready) await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]);
 });
 const p=`output/sections/${String(i+1).padStart(2,"0")}-${id}.pdf`;
 await page.pdf({path:p,format:"A4",printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:"<div></div>",footerTemplate:`<div style="font-size:8px;width:100%;text-align:center;color:#777;">DrPH Research Progress &nbsp; | &nbsp; ${label} &nbsp; | &nbsp; <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,margin:{top:"10mm",right:"10mm",bottom:"14mm",left:"10mm"}});
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

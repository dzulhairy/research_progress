import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import fs from "node:fs";

fs.mkdirSync("output", { recursive: true });
fs.mkdirSync("output/sections", { recursive: true });

const sections = [
  ["overview","Overview"],
  ["team","Research team"],
  ["research","Research progress"],
  ["meetings","Supervisory meetings"],
  ["outputs","Research outputs"],
  ["field","Field highlights"],
  ["logbook","Logbook"],
  ["next","Timeline & milestones"]
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });

const printCSS = `
  @page { size: A4; margin: 10mm 10mm 12mm; }
  html, body { background: #fff !important; }
  .sidebar, .top-actions, .presentation-controls, dialog, button, .skip, .no-print { display: none !important; }
  .workspace { margin: 0 !important; width: 100% !important; }
  main, .container, .content, section { max-width: none !important; width: auto !important; }
  section, article, .card, .panel, .timeline-item, .activity-card, .team-card,
  figure, img, tr { break-inside: avoid; page-break-inside: avoid; }
  img { max-width: 100% !important; height: auto !important; }
  a { color: inherit !important; text-decoration: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
`;

for (let i=0; i<sections.length; i++) {
  const [id,label] = sections[i];
  await page.goto(`http://127.0.0.1:8000/#${id}`, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(700);
  await page.addStyleTag({content: printCSS});
  await page.evaluate(async () => {
    const imgs=[...document.images];
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
      img.addEventListener("load",resolve,{once:true}); img.addEventListener("error",resolve,{once:true});
    })));
    if(document.fonts?.ready) await document.fonts.ready;
  });
  await page.pdf({
    path: `output/sections/${String(i+1).padStart(2,"0")}-${id}.pdf`,
    format:"A4", printBackground:true, preferCSSPageSize:true,
    displayHeaderFooter:true, headerTemplate:"<div></div>",
    footerTemplate:`<div style="font-size:8px;width:100%;text-align:center;color:#777;">DrPH Research Progress &nbsp; | &nbsp; ${label} &nbsp; | &nbsp; <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
    margin:{top:"10mm",right:"10mm",bottom:"14mm",left:"10mm"}
  });
}
await browser.close();

const merged=await PDFDocument.create();
for(let i=0;i<sections.length;i++){
  const [id]=sections[i];
  const bytes=fs.readFileSync(`output/sections/${String(i+1).padStart(2,"0")}-${id}.pdf`);
  const src=await PDFDocument.load(bytes);
  const pages=await merged.copyPages(src,src.getPageIndices());
  pages.forEach(p=>merged.addPage(p));
}
fs.writeFileSync("output/DrPH_Research_Progress_Dzul_Hairy.pdf",await merged.save());
console.log("Created complete multi-section PDF.");

import { chromium } from "playwright";
import fs from "node:fs";

fs.mkdirSync("output", { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1
});

await page.goto("http://127.0.0.1:8000/#overview", {
  waitUntil: "networkidle",
  timeout: 120000
});

// Give client-rendered cards, images and fonts time to settle.
await page.waitForTimeout(2500);
await page.evaluate(async () => {
  const imgs = [...document.images];
  await Promise.all(imgs.map(img => img.complete ? Promise.resolve() :
    new Promise(resolve => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    })
  ));
  if (document.fonts?.ready) await document.fonts.ready;
});

// PDF-specific cleanup: show the full report and preserve the site's visual assets.
await page.addStyleTag({ content: `
  @page { size: A4; margin: 10mm 10mm 12mm; }
  html, body { background: #fff !important; }
  nav, .navbar, .mobile-nav, .menu-toggle, button, .no-print { display: none !important; }
  main, .container, .content, section { max-width: none !important; width: auto !important; }
  section, article, .card, .panel, .timeline-item, .activity-card, .team-card,
  figure, img { break-inside: avoid; page-break-inside: avoid; }
  img { max-width: 100% !important; height: auto !important; }
  a { color: inherit !important; text-decoration: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
` });

await page.emulateMedia({ media: "screen" });
await page.pdf({
  path: "output/DrPH_Research_Progress_Dzul_Hairy.pdf",
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#777;">
    DrPH Research Progress &nbsp; | &nbsp; <span class="pageNumber"></span>/<span class="totalPages"></span>
  </div>`,
  margin: { top: "10mm", right: "10mm", bottom: "14mm", left: "10mm" }
});

await browser.close();
console.log("Created output/DrPH_Research_Progress_Dzul_Hairy.pdf");

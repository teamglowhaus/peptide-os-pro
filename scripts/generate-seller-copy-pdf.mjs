// Regenerates marketing/delivery-pdfs/5-Etsy-Listing-Copy-SELLER.pdf from
// docs/etsy-listing-package.md — the single source of truth for listing
// copy, tags, pricing strategy, and channel-risk notes. Re-run whenever the
// listing package changes so the seller PDF never drifts from the doc.
//
// Usage: node scripts/generate-seller-copy-pdf.mjs
import { chromium } from "playwright-core";
import { chromiumLaunchOptions } from "./lib/chromium-launch.mjs";
import { EMBEDDED_FONT_CSS } from "./lib/embedded-fonts.mjs";
import { marked } from "marked";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const md = readFileSync(join(ROOT, "docs/etsy-listing-package.md"), "utf8");
const bodyHtml = marked.parse(md);

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
${EMBEDDED_FONT_CSS}
  @page { margin: 40px 45px; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #FFFFFF; }
  body { font-family: 'Figtree', sans-serif; font-size: 11.5px; color: #3E332B; line-height: 1.5; }
  .banner {
    background: #F5E3DC; border: 1.5px solid #DCA994; border-radius: 10px;
    padding: 10px 14px; font-weight: 600; color: #7A4A38; margin-bottom: 18px;
  }
  h1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; color: #2E2620; margin: 16px 0 6px; }
  h2 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 14.5px; color: #2E2620;
       margin: 22px 0 8px; padding-bottom: 6px; border-bottom: 1px solid #E6D9C4; }
  h3 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 12.5px; color: #2E2620; margin: 14px 0 6px; }
  p { margin: 8px 0; }
  em { color: #5C5045; }
  strong { color: #2E2620; }
  ul, ol { margin: 8px 0; padding-left: 20px; }
  li { margin: 4px 0; }
  hr { border: none; border-top: 1px solid #E6D9C4; margin: 16px 0; }
  code { font-family: 'JetBrains Mono', monospace; font-size: 10px; background: #F0E7D8; color: #6B5D4F; padding: 2px 5px; border-radius: 4px; }
  blockquote { margin: 8px 0; padding: 6px 12px; border-left: 3px solid #DCC08C; color: #5C5045; }
  table { border-collapse: collapse; margin: 10px 0; font-size: 10.5px; }
  th, td { border: 1px solid #E6D9C4; padding: 5px 8px; text-align: left; }
  .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #E6D9C4; font-size: 9.5px; color: #9C8F80; text-align: center; }
</style>
</head><body>
  <div class="banner">SELLER REFERENCE — do not upload this file to buyers. It contains your listing copy, tags, pricing strategy, and channel-risk notes.</div>
  ${bodyHtml}
  <div class="footer">© GlowHausDigital · Internal seller document</div>
</body></html>`;

const browser = await chromium.launch(chromiumLaunchOptions());
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: join(ROOT, "marketing/delivery-pdfs/5-Etsy-Listing-Copy-SELLER.pdf"),
  format: "Letter",
  printBackground: true,
  margin: { top: "0.5in", bottom: "0.5in", left: "0.55in", right: "0.55in" },
});
await browser.close();
console.log("✓ regenerated 5-Etsy-Listing-Copy-SELLER.pdf from docs/etsy-listing-package.md");

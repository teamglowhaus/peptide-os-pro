// Regenerates marketing/delivery-pdfs/1-Welcome-Start-Here.pdf from
// docs/buyer-guide.md — the single source of truth for the buyer's Welcome
// sheet. Re-run this anytime buyer-guide.md changes (new URL, new access
// code, copy edits) so the delivered PDF never drifts from its source again.
//
// Usage: node scripts/generate-buyer-guide-pdf.mjs
import { chromium } from "playwright-core";
import { chromiumLaunchOptions } from "./lib/chromium-launch.mjs";
import { marked } from "marked";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const md = readFileSync(join(ROOT, "docs/buyer-guide.md"), "utf8");
const bodyHtml = marked.parse(md);
const iconSvg = readFileSync(join(ROOT, "public/icons/icon.svg"), "utf8");
const iconDataUri = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString("base64")}`;

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..700;1,300..700&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=JetBrains+Mono:wght@400;700&display=swap" />
<style>
  @page { margin: 40px 45px; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #F7F1E8; }
  body {
    font-family: 'Figtree', sans-serif;
    font-size: 12.5px;
    color: #3E332B;
    line-height: 1.55;
  }
  .header {
    display: flex; align-items: center; gap: 14px;
    padding-bottom: 16px; margin-bottom: 22px;
    border-bottom: 1px solid #E6D9C4;
  }
  .header img { height: 46px; width: 46px; border-radius: 12px; }
  .header .title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 17px; color: #2E2620; }
  .header .eyebrow { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #B08D57; margin-top: 2px; }

  h1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 22px; color: #2E2620; margin: 18px 0 6px; }
  h1:first-of-type { margin-top: 0; }
  h2 {
    font-family: 'Fraunces', serif; font-weight: 600; font-size: 15.5px; color: #2E2620;
    margin: 26px 0 10px; padding-bottom: 8px; border-bottom: 1px solid #E6D9C4;
  }
  p { margin: 10px 0; }
  em { color: #5C5045; }
  strong { color: #2E2620; }
  ul { margin: 10px 0; padding-left: 22px; }
  li { margin: 5px 0; }
  hr { border: none; border-top: 1px solid #E6D9C4; margin: 20px 0; }
  code {
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px;
    background: #EFE4D3; color: #6B5D4F; padding: 3px 7px; border-radius: 5px;
  }
  .footer {
    margin-top: 30px; padding-top: 12px; border-top: 1px solid #E6D9C4;
    font-size: 10px; color: #9C8F80; text-align: center;
  }
</style>
</head><body>
  <div class="header">
    <img src="${iconDataUri}" />
    <div>
      <div class="title">The Ultimate Biohacker Wellness Planner</div>
      <div class="eyebrow">GlowHausDigital</div>
    </div>
  </div>
  ${bodyHtml}
  <div class="footer">© GlowHausDigital · For personal use only · Not medical advice — always consult your own physician.</div>
</body></html>`;

const browser = await chromium.launch(chromiumLaunchOptions());
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.pdf({
  path: join(ROOT, "marketing/delivery-pdfs/1-Welcome-Start-Here.pdf"),
  format: "Letter",
  printBackground: true,
  margin: { top: "0.5in", bottom: "0.5in", left: "0.55in", right: "0.55in" },
});
await browser.close();
console.log("✓ regenerated 1-Welcome-Start-Here.pdf from docs/buyer-guide.md");

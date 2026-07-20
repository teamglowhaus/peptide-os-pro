// Regenerates marketing/delivery-pdfs/3-License-and-Thank-You.pdf from
// docs/license-thank-you.md — the single source of truth for the buyer's
// thank-you page + license. Re-run anytime the source changes (new URL,
// new access code, copy edits) so the delivered PDF never drifts.
//
// Usage: node scripts/generate-license-pdf.mjs
import { chromium } from "playwright-core";
import { chromiumLaunchOptions } from "./lib/chromium-launch.mjs";
import { marked } from "marked";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const md = readFileSync(join(ROOT, "docs/license-thank-you.md"), "utf8");
const bodyHtml = marked.parse(md);
const iconSvg = readFileSync(join(ROOT, "public/icons/icon.svg"), "utf8");
const iconDataUri = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString("base64")}`;

// Caveat (the handwriting accent) is vendored in scripts/lib/fonts and
// embedded as base64: Google Fonts is not reachable from every build
// environment, and without a real Caveat the handwritten lines silently
// fall back to a serif — which defeats their entire purpose.
const caveat500 = readFileSync(join(ROOT, "scripts/lib/fonts/caveat-latin-500-normal.woff2")).toString("base64");
const caveat600 = readFileSync(join(ROOT, "scripts/lib/fonts/caveat-latin-600-normal.woff2")).toString("base64");

// Hand-drawn squiggle underline, matching the app's signature accent
const squiggle = `<svg viewBox="0 0 200 14" preserveAspectRatio="none" style="width:96px;height:8px;display:block;margin-top:6px;"><path d="M2 8 C 18 1, 33 1, 50 8 S 82 15, 100 8 S 132 1, 150 8 S 182 15, 198 7" fill="none" stroke="#A85D73" stroke-width="3.5" stroke-linecap="round"/></svg>`;

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..700;1,300..700&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=JetBrains+Mono:wght@400;700&display=swap" />
<style>
  @font-face {
    font-family: 'Caveat';
    font-style: normal;
    font-weight: 500;
    src: url(data:font/woff2;base64,${caveat500}) format('woff2');
  }
  @font-face {
    font-family: 'Caveat';
    font-style: normal;
    font-weight: 600;
    src: url(data:font/woff2;base64,${caveat600}) format('woff2');
  }
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

  h1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 24px; color: #2E2620; margin: 18px 0 4px; }
  h1:first-of-type { margin-top: 0; }
  h1 em, h1 + .squiggle { color: #8A3B55; }
  h2 {
    font-family: 'Fraunces', serif; font-weight: 600; font-size: 15.5px; color: #2E2620;
    margin: 24px 0 8px; padding-bottom: 7px; border-bottom: 1px solid #E6D9C4;
  }
  p { margin: 10px 0; }
  em { color: #5C5045; }
  strong { color: #2E2620; }
  ul { margin: 10px 0; padding-left: 22px; }
  li { margin: 5px 0; }
  hr { border: none; border-top: 1px solid #E6D9C4; margin: 20px 0; }
  code {
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11.5px;
    background: #EFE4D3; color: #6E2A42; padding: 3px 8px; border-radius: 6px 4px 7px 4px;
  }

  /* Handwritten asides — the human hand on the page */
  .hand { font-family: 'Caveat', cursive; font-weight: 500; font-size: 20px; color: #8A3B55; margin: 2px 0 14px; }
  .hand.sign { font-size: 23px; margin-top: 22px; }

  /* The access card — hand-cut corners, warm hero wash, wine accents */
  .code-card {
    margin: 18px 0;
    padding: 16px 20px;
    background: radial-gradient(130% 90% at 108% -8%, rgb(138 59 85 / 0.08), transparent 55%), linear-gradient(155deg, #F3E2C9 -20%, #FFFDF9 60%);
    border: 1.5px solid #DCC08C;
    border-radius: 22px 16px 21px 17px / 17px 21px 16px 22px;
  }
  .code-row { display: flex; align-items: baseline; gap: 12px; margin: 5px 0; }
  .code-label {
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    font-weight: 600; color: #857463; min-width: 110px;
  }
  .code-note { font-size: 11px; color: #857463; margin-top: 9px; }

  .page-break { page-break-after: always; }

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
      <div class="eyebrow">GlowHausDigital · License &amp; Thank You</div>
    </div>
  </div>
  ${bodyHtml.replace(/<\/h1>/, `</h1>${squiggle}`)}
  <div class="footer">© GlowHausDigital · For personal use only · Not medical advice — always consult your own physician.</div>
</body></html>`;

const browser = await chromium.launch(chromiumLaunchOptions());
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
// Fonts (especially the Caveat handwriting) must be fully loaded before
// printing, or the hand-written lines silently fall back to a serif.
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: join(ROOT, "marketing/delivery-pdfs/3-License-and-Thank-You.pdf"),
  format: "Letter",
  printBackground: true,
  margin: { top: "0.5in", bottom: "0.5in", left: "0.55in", right: "0.55in" },
});
await browser.close();
console.log("✓ regenerated 3-License-and-Thank-You.pdf from docs/license-thank-you.md");

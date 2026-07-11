// Generates the 15 Etsy listing thumbnails (2700x2025, oversampled 2x for
// crispness) from the live app. Usage:
//   node scripts/generate-thumbnails.mjs [slide-number|all]
// Requires a locally running preview build (npm run preview) at APP_URL.
import { chromium } from "/home/user/peptide-os-pro/node_modules/playwright-core/index.mjs";
import { seed as baseSeed } from "/tmp/claude-0/-home-user-peptide-os-pro/54abd27e-de26-5d27-9fff-6f7e05e954ad/scratchpad/fullseed.mjs";
import { execSync } from "child_process";

const APP_URL = "http://localhost:4173";
const OUT_DIR = "/home/user/peptide-os-pro/marketing/thumbnails";
const CANVAS_W = 2700, CANVAS_H = 2025;
const MOCK_W = 1280, MOCK_H = 1360; // tall enough to show the full 17-item sidebar, uncropped

function initGate({ seed, dark }) {
  localStorage.setItem("biohacker-os:v1", JSON.stringify(dark ? { ...seed, settings: { ...seed.settings, theme: "dark" } } : seed));
  localStorage.setItem("biohacker-os:gate", "1");
}

async function screenshotApp(browser, { route, dark, actions }) {
  const page = await browser.newPage({ viewport: { width: MOCK_W, height: MOCK_H }, deviceScaleFactor: 2 });
  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
  await page.addInitScript(initGate, { seed: baseSeed, dark: Boolean(dark) });
  await page.goto(`${APP_URL}/#/${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(900);
  if (actions) await actions(page);
  await page.waitForTimeout(300);
  const buf = await page.screenshot();
  await page.close();
  return buf;
}

// Composites a browser-chrome mockup + headline copy into the final thumbnail HTML.
function slideHtml({ eyebrow, headline, badge, screenshotDataUri, footer = true }) {
  return `<!doctype html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&family=Fraunces:opsz,wght@9..144,300..800&display=swap" />
<style>
  * { box-sizing: border-box; }
  html,body{margin:0;padding:0;width:${CANVAS_W}px;height:${CANVAS_H}px;overflow:hidden;
    background:linear-gradient(150deg,#FBF8F2 0%,#F3E9D8 100%);
    font-family:'Figtree',sans-serif;}
  .eyebrow{
    position:absolute; top:64px; left:0; right:0; text-align:center;
    font-size:30px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase;
    color:#B08D57;
  }
  .headline{
    position:absolute; top:120px; left:80px; right:80px; text-align:center;
    font-family:'Fraunces',serif; font-weight:700; font-size:92px; line-height:1.08;
    color:#2E2620;
  }
  .badge{
    position:absolute; top:${headline.length > 30 ? 370 : 320}px; left:0; right:0; text-align:center;
  }
  .badge span{
    display:inline-block; background:#57654F; color:#F7F1E8; font-weight:700; font-size:34px;
    letter-spacing:0.02em; padding:16px 40px; border-radius:999px;
  }
  .mockshot{
    position:absolute; left:50%; top:${headline.length > 30 ? 470 : 420}px;
    transform:translateX(-50%);
    border-radius:22px; overflow:hidden; box-shadow:0 40px 90px -30px rgba(46,38,32,.35);
    border:1px solid #E6D9C4;
  }
  .mockshot img{ display:block; width:${MOCK_W * 0.92}px; }
  .chromebar{
    position:absolute; left:50%; top:${headline.length > 30 ? 470 : 420}px; transform:translateX(-50%);
    width:${MOCK_W * 0.92}px; height:34px; background:#F0E7D8; border-radius:22px 22px 0 0;
    border:1px solid #E6D9C4; border-bottom:none;
    display:flex; align-items:center; gap:9px; padding-left:20px;
  }
  .dot{ width:12px; height:12px; border-radius:50%; }
  .footer{
    position:absolute; bottom:0; left:0; right:0; height:96px;
    background:#211B17; color:#F7F1E8; display:flex; align-items:center; justify-content:center;
    gap:26px; font-weight:800; font-size:28px; letter-spacing:0.03em;
  }
  .footer .sep{ color:#B08D57; }
</style></head>
<body>
  <div class="eyebrow">${eyebrow}</div>
  <div class="headline">${headline}</div>
  ${badge ? `<div class="badge"><span>${badge}</span></div>` : ""}
  ${screenshotDataUri ? `
    <div class="chromebar">
      <div class="dot" style="background:#DCA994"></div>
      <div class="dot" style="background:#DCC08C"></div>
      <div class="dot" style="background:#AAB99E"></div>
    </div>
    <div class="mockshot" style="top:${(headline.length > 30 ? 470 : 420) + 34}px;">
      <img src="${screenshotDataUri}" />
    </div>
  ` : ""}
  ${footer ? `<div class="footer">
    <span>INSTANT DOWNLOAD</span><span class="sep">✦</span>
    <span>PRINTABLE PDF + BONUS APP</span><span class="sep">✦</span>
    <span>ONE-TIME PURCHASE</span>
  </div>` : ""}
</body></html>`;
}

const SLIDES = [
  { n: "01-hero", eyebrow: "The Ultimate", headline: "Biohacker Wellness Planner", badge: "Printable PDF Binder + Bonus Web App", route: "dashboard" },
  { n: "04-peptide-library", eyebrow: "Peptide & GLP-1 Tracker", headline: "36-Entry Reference Library", badge: "Semaglutide · Tirzepatide · BPC-157 · NAD+", route: "peptides",
    actions: async (page) => { await page.getByRole("button", { name: "Library", exact: true }).click(); await page.waitForTimeout(400); } },
  { n: "06-menopause", eyebrow: "Menopause & HRT Suite", headline: "Track 20 Symptoms Daily", badge: "Charts Your Doctor Will Love", route: "hormones" },
];

async function build(slide, browser) {
  const buf = await screenshotApp(browser, { route: slide.route, dark: slide.dark, actions: slide.actions });
  const dataUri = `data:image/png;base64,${buf.toString("base64")}`;
  const html = slideHtml({ eyebrow: slide.eyebrow, headline: slide.headline, badge: slide.badge, screenshotDataUri: dataUri });
  const browser2 = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser2.newPage({ viewport: { width: CANVAS_W, height: CANVAS_H }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle" });
  const outPath = `${OUT_DIR}/${slide.n}-DRAFT.png`;
  await page.screenshot({ path: outPath });
  await browser2.close();
  // downscale the 2x-oversampled canvas back to 2700x2025 for a crisp final image
  execSync(`python3 -c "from PIL import Image; im=Image.open('${outPath}'); im.resize((${CANVAS_W},${CANVAS_H}), Image.LANCZOS).convert('RGB').save('${outPath.replace(".png", ".jpg")}', quality=94)"`);
  console.log(`✓ ${slide.n}`);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const slide of SLIDES) {
  await build(slide, browser);
}
await browser.close();

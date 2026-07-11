// Generates the Etsy listing thumbnails (2700x2025, oversampled 2x for
// crispness) from the live app. Each slide crops tight to ONE feature area
// and blows it up large (rather than shrinking the whole tall app into a
// small corner) so in-app text stays legible at gallery-thumbnail size.
//
// Usage: node scripts/generate-thumbnails.mjs
// Requires a locally running preview build (npm run preview) at APP_URL.
import { chromium } from "/home/user/peptide-os-pro/node_modules/playwright-core/index.mjs";
import { seed as baseSeed } from "/tmp/claude-0/-home-user-peptide-os-pro/54abd27e-de26-5d27-9fff-6f7e05e954ad/scratchpad/fullseed.mjs";
import { execSync } from "child_process";

const APP_URL = "http://localhost:4173";
const OUT_DIR = "/home/user/peptide-os-pro/marketing/thumbnails";
const CANVAS_W = 2700, CANVAS_H = 2025;
const MOCK_VIEWPORT_W = 1280; // CSS width of the app viewport we capture from
const CAPTURE_DSF = 4; // high oversampling so cropped regions can be blown up without blur
const MOCK_MAX_W = 2500, MOCK_MAX_H = 1460; // max on-canvas footprint for the mockup
const MOCK_TOP = 460; // top of the mockup band (below eyebrow/headline/badge)

function initGate({ seed, dark }) {
  localStorage.setItem("biohacker-os:v1", JSON.stringify(dark ? { ...seed, settings: { ...seed.settings, theme: "dark" } } : seed));
  localStorage.setItem("biohacker-os:gate", "1");
}

async function screenshotApp(browser, { route, dark, clip, actions }) {
  const page = await browser.newPage({
    viewport: { width: MOCK_VIEWPORT_W, height: clip.height + clip.y },
    deviceScaleFactor: CAPTURE_DSF,
  });
  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
  await page.addInitScript(initGate, { seed: baseSeed, dark: Boolean(dark) });
  await page.goto(`${APP_URL}/#/${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(900);
  if (actions) await actions(page);
  await page.waitForTimeout(300);
  const buf = await page.screenshot({ clip });
  await page.close();
  return buf;
}

// Composites a browser-chrome mockup + big headline copy into the final thumbnail HTML.
function slideHtml({ eyebrow, headline, badge, screenshotDataUri, mockW, mockH, footer = true }) {
  const big = headline.length <= 22;
  const mid = headline.length > 22 && headline.length <= 36;
  const headlineSize = big ? 122 : mid ? 92 : 74;
  const mockTop = MOCK_TOP + (MOCK_MAX_H - mockH) / 2;
  const mockLeft = (CANVAS_W - mockW) / 2;
  return `<!doctype html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&family=Fraunces:opsz,wght@9..144,300..800&display=swap" />
<style>
  * { box-sizing: border-box; }
  html,body{margin:0;padding:0;width:${CANVAS_W}px;height:${CANVAS_H}px;overflow:hidden;
    background:linear-gradient(150deg,#FBF8F2 0%,#F3E9D8 100%);
    font-family:'Figtree',sans-serif;}
  .glow{
    position:absolute; left:50%; top:${MOCK_TOP - 60}px; transform:translateX(-50%);
    width:2200px; height:1500px; border-radius:50%;
    background:radial-gradient(closest-side, rgba(176,141,87,0.16), rgba(176,141,87,0));
  }
  .eyebrow{
    position:absolute; top:58px; left:0; right:0; text-align:center;
    font-size:34px; font-weight:800; letter-spacing:0.24em; text-transform:uppercase;
    color:#A9803D;
  }
  .rule{
    position:absolute; top:112px; left:50%; transform:translateX(-50%);
    width:90px; height:4px; border-radius:2px; background:#C9A96A;
  }
  .headline{
    position:absolute; top:146px; left:70px; right:70px; text-align:center;
    font-family:'Fraunces',serif; font-weight:700; font-size:${headlineSize}px; line-height:1.08;
    color:#241D18;
  }
  .badge{
    position:absolute; top:${146 + (big ? 175 : mid ? 150 : 120)}px; left:0; right:0; text-align:center;
  }
  .badge span{
    display:inline-block; background:#57654F; color:#F7F1E8; font-weight:700; font-size:36px;
    letter-spacing:0.02em; padding:18px 44px; border-radius:999px;
    box-shadow:0 14px 30px -12px rgba(46,38,32,.4);
  }
  .mockshot{
    position:absolute; left:${mockLeft}px; top:${mockTop}px;
    border-radius:20px; overflow:hidden; box-shadow:0 46px 100px -30px rgba(46,38,32,.4);
    border:1px solid #E6D9C4;
  }
  .mockshot img{ display:block; width:${mockW}px; height:${mockH}px; object-fit:cover; object-position:top; }
  .chromebar{
    position:absolute; left:${mockLeft}px; top:${mockTop - 32}px;
    width:${mockW}px; height:32px; background:#F0E7D8; border-radius:20px 20px 0 0;
    border:1px solid #E6D9C4; border-bottom:none;
    display:flex; align-items:center; gap:9px; padding-left:22px;
  }
  .dot{ width:12px; height:12px; border-radius:50%; }
  .footer{
    position:absolute; bottom:0; left:0; right:0; height:100px;
    background:#211B17; color:#F7F1E8; display:flex; align-items:center; justify-content:center;
    gap:28px; font-weight:800; font-size:30px; letter-spacing:0.03em;
  }
  .footer .sep{ color:#B08D57; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="eyebrow">${eyebrow}</div>
  <div class="rule"></div>
  <div class="headline">${headline}</div>
  ${badge ? `<div class="badge"><span>${badge}</span></div>` : ""}
  <div class="chromebar">
    <div class="dot" style="background:#DCA994"></div>
    <div class="dot" style="background:#DCC08C"></div>
    <div class="dot" style="background:#AAB99E"></div>
  </div>
  <div class="mockshot" style="width:${mockW}px;height:${mockH}px;">
    <img src="${screenshotDataUri}" />
  </div>
  ${footer ? `<div class="footer">
    <span>INSTANT DOWNLOAD</span><span class="sep">✦</span>
    <span>PRINTABLE PDF + BONUS APP</span><span class="sep">✦</span>
    <span>ONE-TIME PURCHASE</span>
  </div>` : ""}
</body></html>`;
}

const SLIDES = [
  { n: "01-hero", eyebrow: "The Ultimate", headline: "Biohacker Wellness Planner", badge: "Printable PDF Binder + Bonus Web App",
    route: "dashboard", clip: { x: 0, y: 0, width: 1280, height: 900 } },
  { n: "04-peptide-library", eyebrow: "Peptide & GLP-1 Tracker", headline: "36-Entry Reference Library", badge: "Semaglutide · Tirzepatide · BPC-157 · NAD+",
    route: "peptides", clip: { x: 0, y: 0, width: 1280, height: 1150 },
    actions: async (page) => { await page.getByRole("button", { name: "Library", exact: true }).click(); await page.waitForTimeout(400); } },
  { n: "06-menopause", eyebrow: "Menopause & HRT Suite", headline: "Track 20 Symptoms Daily", badge: "Charts Your Doctor Will Love",
    route: "hormones", clip: { x: 0, y: 0, width: 1280, height: 1180 } },
];

async function build(slide, browser) {
  const buf = await screenshotApp(browser, { route: slide.route, dark: slide.dark, clip: slide.clip, actions: slide.actions });
  const dataUri = `data:image/png;base64,${buf.toString("base64")}`;
  const scale = Math.min(MOCK_MAX_W / slide.clip.width, MOCK_MAX_H / slide.clip.height);
  const mockW = Math.round(slide.clip.width * scale);
  const mockH = Math.round(slide.clip.height * scale);
  const html = slideHtml({ eyebrow: slide.eyebrow, headline: slide.headline, badge: slide.badge, screenshotDataUri: dataUri, mockW, mockH });
  const browser2 = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser2.newPage({ viewport: { width: CANVAS_W, height: CANVAS_H }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle" });
  const outPath = `${OUT_DIR}/${slide.n}-DRAFT.png`;
  await page.screenshot({ path: outPath });
  await browser2.close();
  execSync(`python3 -c "from PIL import Image; im=Image.open('${outPath}'); im.resize((${CANVAS_W},${CANVAS_H}), Image.LANCZOS).convert('RGB').save('${outPath.replace(".png", ".jpg")}', quality=95)"`);
  console.log(`✓ ${slide.n}`);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const slide of SLIDES) {
  await build(slide, browser);
}
await browser.close();

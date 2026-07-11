// Generates the Etsy listing thumbnails (2700x2025, oversampled 2x for
// crispness) from the live app. Each slide crops tight to ONE feature area
// and blows it up large (rather than shrinking the whole tall app into a
// small corner) so in-app text stays legible at gallery-thumbnail size.
// Styled after a warm, paper-textured "cozy Etsy planner" look: burgundy
// serif headlines, a laptop-style device frame, a checkmark trust row —
// no fabricated lifestyle photography (we don't have licensed stock photos).
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
const MOCK_MAX_W = 2460, MOCK_MAX_H = 1330; // max on-canvas footprint for the mockup screen
const MOCK_TOP = 470; // top of the mockup band (below eyebrow/headline/subhead)

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

// Composites a laptop-style mockup + warm serif headline copy into the final thumbnail HTML.
function slideHtml({ eyebrow, headline, subhead, screenshotDataUri, mockW, mockH, checks }) {
  const big = headline.length <= 22;
  const mid = headline.length > 22 && headline.length <= 36;
  const headlineSize = big ? 118 : mid ? 90 : 72;
  const screenTop = MOCK_TOP + (MOCK_MAX_H - mockH) / 2;
  const screenLeft = (CANVAS_W - mockW) / 2;
  const bezel = 20; // laptop bezel thickness around the screen
  const baseH = 34; // laptop base/hinge bar height
  const baseOverhang = 46; // how much wider the base is than the screen
  const checkRow = (checks || ["Instant download", "Printable + app", "One-time purchase"])
    .map((c) => `<span>${c}</span>`).join(`<span class="dot">·</span>`);
  return `<!doctype html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,600;1,500&family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,400..600&display=swap" />
<style>
  * { box-sizing: border-box; }
  html,body{margin:0;padding:0;width:${CANVAS_W}px;height:${CANVAS_H}px;overflow:hidden;
    background:
      radial-gradient(120% 90% at 50% 0%, rgba(255,252,246,0.9), rgba(255,252,246,0) 60%),
      radial-gradient(140% 120% at 50% 110%, rgba(122,60,62,0.10), rgba(122,60,62,0) 55%),
      linear-gradient(155deg,#F7EFE1 0%,#EFE2CB 55%,#EAD9BE 100%);
    font-family:'Figtree',sans-serif;}
  .grain{ position:absolute; inset:0; opacity:0.05; mix-blend-mode:multiply;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }
  .eyebrow{
    position:absolute; top:66px; left:0; right:0; text-align:center;
    font-family:'Fraunces',serif; font-style:italic; font-weight:500; font-size:32px;
    letter-spacing:0.04em; color:#8A5A3F;
  }
  .headline{
    position:absolute; top:118px; left:80px; right:80px; text-align:center;
    font-family:'Fraunces',serif; font-weight:600; font-size:${headlineSize}px; line-height:1.1;
    color:#6E2C33;
  }
  .subhead{
    position:absolute; top:${118 + (big ? 168 : mid ? 142 : 112)}px; left:100px; right:100px; text-align:center;
    font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-size:34px;
    color:#8A5A3F;
  }
  .laptop{
    position:absolute; left:${screenLeft - bezel}px; top:${screenTop - bezel}px;
    width:${mockW + bezel * 2}px; height:${mockH + bezel * 2}px;
    background:linear-gradient(165deg,#3A3430,#221D1A);
    border-radius:22px; box-shadow:0 50px 110px -30px rgba(46,30,26,.45);
  }
  .laptop .cam{ position:absolute; top:7px; left:50%; transform:translateX(-50%); width:6px; height:6px; border-radius:50%; background:#5b534c; }
  .screen{
    position:absolute; left:${screenLeft}px; top:${screenTop}px; width:${mockW}px; height:${mockH}px;
    border-radius:6px; overflow:hidden; background:#fff;
  }
  .screen img{ display:block; width:${mockW}px; height:${mockH}px; object-fit:cover; object-position:top; }
  .base{
    position:absolute; left:${screenLeft - bezel - baseOverhang / 2}px; top:${screenTop + mockH + bezel}px;
    width:${mockW + bezel * 2 + baseOverhang}px; height:${baseH}px;
    background:linear-gradient(180deg,#4A433D,#2C2724);
    border-radius:0 0 12px 12px;
  }
  .base::after{
    content:""; position:absolute; left:50%; top:0; transform:translateX(-50%);
    width:120px; height:9px; background:#1c1815; border-radius:0 0 8px 8px;
  }
  .checks{
    position:absolute; left:0; right:0; bottom:78px; text-align:center;
    font-family:'Fraunces',serif; font-style:italic; font-weight:500; font-size:32px;
    color:#6E2C33;
  }
  .checks span.dot{ color:#C9A96A; padding:0 20px; font-style:normal; }
  .checks span:not(.dot)::before{ content:"✓ "; color:#8FA06B; font-style:normal; font-weight:700; }
</style></head>
<body>
  <div class="grain"></div>
  <div class="eyebrow">${eyebrow}</div>
  <div class="headline">${headline}</div>
  ${subhead ? `<div class="subhead">${subhead}</div>` : ""}
  <div class="laptop"><div class="cam"></div></div>
  <div class="screen"><img src="${screenshotDataUri}" /></div>
  <div class="base"></div>
  <div class="checks">${checkRow}</div>
</body></html>`;
}

const SLIDES = [
  { n: "01-hero", eyebrow: "The Ultimate", headline: "Biohacker Wellness Planner", subhead: "Printable PDF binder + bonus web app",
    route: "dashboard", clip: { x: 0, y: 0, width: 1280, height: 900 } },
  { n: "04-peptide-library", eyebrow: "Peptide & GLP-1 Tracker", headline: "36-Entry Reference Library", subhead: "Semaglutide · Tirzepatide · BPC-157 · NAD+",
    route: "peptides", clip: { x: 0, y: 0, width: 1280, height: 1150 },
    actions: async (page) => { await page.getByRole("button", { name: "Library", exact: true }).click(); await page.waitForTimeout(400); } },
  { n: "06-menopause", eyebrow: "Menopause & HRT Suite", headline: "Track 20 Symptoms Daily", subhead: "Charts your doctor will love",
    route: "hormones", clip: { x: 0, y: 0, width: 1280, height: 1180 } },
];

async function build(slide, browser) {
  const buf = await screenshotApp(browser, { route: slide.route, dark: slide.dark, clip: slide.clip, actions: slide.actions });
  const dataUri = `data:image/png;base64,${buf.toString("base64")}`;
  const scale = Math.min(MOCK_MAX_W / slide.clip.width, MOCK_MAX_H / slide.clip.height);
  const mockW = Math.round(slide.clip.width * scale);
  const mockH = Math.round(slide.clip.height * scale);
  const html = slideHtml({ eyebrow: slide.eyebrow, headline: slide.headline, subhead: slide.subhead, screenshotDataUri: dataUri, mockW, mockH, checks: slide.checks });
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

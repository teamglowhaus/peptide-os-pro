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
import { chromium } from "playwright-core";
import { chromiumLaunchOptions } from "./lib/chromium-launch.mjs";
import { EMBEDDED_FONT_CSS } from "./lib/embedded-fonts.mjs";
import { seed as baseSeed } from "./fixtures/demo-seed.mjs";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOGO_DATA_URI = `data:image/svg+xml;base64,${readFileSync(join(ROOT, "public/icons/icon.svg")).toString("base64")}`;

const APP_URL = "http://localhost:4173";
const OUT_DIR = join(ROOT, "marketing/thumbnails");
const CANVAS_W = 2700, CANVAS_H = 2025;
const MOCK_VIEWPORT_W = 1280; // CSS width of the app viewport we capture from
const CAPTURE_DSF = 4; // high oversampling so cropped regions can be blown up without blur
const MOCK_MAX_W = 2460, MOCK_MAX_H = 1330; // max on-canvas footprint for the mockup screen
const MOCK_TOP = 470; // top of the mockup band (below eyebrow/headline/subhead)
const ZOOM = 1.5; // real CSS zoom applied to the app before capture, so text is genuinely bigger

function initGate({ seed, dark }) {
  localStorage.setItem("biohacker-os:v1", JSON.stringify(dark ? { ...seed, settings: { ...seed.settings, theme: "dark" } } : seed));
  localStorage.setItem("biohacker-os:gate", "1");
}

async function screenshotApp(browser, { route, dark, clip, actions, viewportW = MOCK_VIEWPORT_W }) {
  // CSS zoom shrinks the *logical* layout width (viewport / zoom), which can
  // shift Tailwind's responsive breakpoints and break grids. Counteract that
  // by widening the real viewport by the same factor, so the app still lays
  // itself out at the original logical width — just rendered bigger.
  // `viewportW` lets dense screens (e.g. the two-column symptom grid) run
  // wider so labels don't truncate in the marketing shot.
  const page = await browser.newPage({
    viewport: { width: Math.round(viewportW * ZOOM), height: Math.round((clip.height + clip.y) * ZOOM) },
    deviceScaleFactor: CAPTURE_DSF,
  });
  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
  await page.addInitScript(initGate, { seed: baseSeed, dark: Boolean(dark) });
  await page.goto(`${APP_URL}/#/${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(900);
  if (actions) await actions(page);
  await page.addStyleTag({ content: `html { zoom: ${ZOOM}; }` });
  await page.waitForTimeout(250);
  const zoomedClip = { x: clip.x * ZOOM, y: clip.y * ZOOM, width: clip.width * ZOOM, height: clip.height * ZOOM };
  const buf = await page.screenshot({ clip: zoomedClip });
  await page.close();
  return buf;
}

// A bold circled-stat callout badge, in the spirit of direct-response ad
// annotations — sized down to fit the shop's existing warm/serif brand
// rather than a full hustle-ad palette swap.
//
// This deliberately has no connecting arrow: the badge sits mostly above
// the laptop bezel, dipping only slightly onto its dark corner (never onto
// real screenshot content). There isn't enough vertical room between the
// headline block and the mockup for a badge-to-content arrow that's both
// visibly outside the badge's own circle AND guaranteed to stay off real
// buttons/text underneath — so the badge reads as a corner sticker instead.
function calloutBadge({ value, label, screenLeft, screenTop, mockW, side = "right", accent = "#E4572E", accentDark = "#B83A22" }) {
  const badgeSize = 230;
  const badgeCX = side === "right" ? screenLeft + mockW - 40 : screenLeft + 40;
  const badgeCY = screenTop - 100;
  const rotate = side === "right" ? -7 : 7;
  return `<div class="callout" style="left:${badgeCX - badgeSize / 2}px; top:${badgeCY - badgeSize / 2}px; width:${badgeSize}px; height:${badgeSize}px; background:radial-gradient(circle at 32% 28%, ${accent}, ${accentDark}); transform:rotate(${rotate}deg);">
    <span class="num">${value}</span><span class="label">${label}</span>
  </div>`;
}

// Composites a laptop-style mockup + warm serif headline copy into the final thumbnail HTML.
// screenshotDataUri may be null for a mockup-less closing/CTA slide, in which case a big
// pill-shaped CTA button is centered in the mockup's place instead.
function slideHtml({ eyebrow, headline, subhead, screenshotDataUri, mockW, mockH, checks, callout, ctaText }) {
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
  const calloutHtml = callout
    ? calloutBadge({ ...callout, screenLeft, screenTop, mockW })
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"/>
<style>
${EMBEDDED_FONT_CSS}
  * { box-sizing: border-box; }
  html,body{margin:0;padding:0;width:${CANVAS_W}px;height:${CANVAS_H}px;overflow:hidden;
    background:
      radial-gradient(120% 90% at 50% 0%, rgba(255,253,247,0.92), rgba(255,253,247,0) 60%),
      radial-gradient(150% 130% at 50% 112%, rgba(228,87,46,0.14), rgba(228,87,46,0) 55%),
      linear-gradient(155deg,#FDF3E0 0%,#F8DFA9 50%,#F0C97D 100%);
    font-family:'Figtree',sans-serif;}
  .grain{ position:absolute; inset:0; opacity:0.05; mix-blend-mode:multiply;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }
  .eyebrow{
    position:absolute; top:66px; left:0; right:0; text-align:center;
    font-family:'Fraunces',serif; font-style:italic; font-weight:500; font-size:32px;
    letter-spacing:0.04em; color:#A8481F;
  }
  .headline{
    position:absolute; top:118px; left:80px; right:80px; text-align:center;
    font-family:'Fraunces',serif; font-weight:700; font-size:${headlineSize}px; line-height:1.1;
    color:#7A1524;
  }
  .subhead{
    position:absolute; top:${118 + (big ? 168 : mid ? 142 : 112)}px; left:100px; right:100px; text-align:center;
    font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-size:34px;
    color:#A8481F;
  }
  .laptop{
    position:absolute; left:${screenLeft - bezel}px; top:${screenTop - bezel}px;
    width:${mockW + bezel * 2}px; height:${mockH + bezel * 2}px;
    background:linear-gradient(165deg,#3A3430,#221D1A);
    border-radius:22px; box-shadow:0 50px 110px -30px rgba(46,30,26,.5);
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
  .callout{
    position:absolute; z-index:7; border-radius:50%; border:7px solid #FFF6E7;
    box-shadow:0 24px 50px -14px rgba(30,15,10,.5);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    color:#fff; text-align:center;
  }
  .callout .num{ font-family:'Figtree',sans-serif; font-weight:800; font-size:68px; line-height:1; }
  .callout .label{ font-family:'Figtree',sans-serif; font-weight:800; font-size:17px; letter-spacing:0.04em;
    text-transform:uppercase; margin-top:6px; padding:0 18px; line-height:1.15; }
  .checks{
    position:absolute; left:0; right:0; bottom:78px; text-align:center;
    font-family:'Fraunces',serif; font-style:italic; font-weight:500; font-size:32px;
    color:#7A1524;
  }
  .checks span.dot{ color:#C9862E; padding:0 20px; font-style:normal; }
  .checks span:not(.dot)::before{ content:"✓ "; color:#5B7A3C; font-style:normal; font-weight:700; }
  .cta-wrap{
    position:absolute; left:0; right:0; top:0; bottom:170px;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:44px;
  }
  .cta-wrap .cta-logo{ width:380px; height:380px; border-radius:86px; box-shadow:0 46px 90px -24px rgba(46,30,26,.4); }
  .cta-wrap .cta-eyebrow{
    font-family:'Fraunces',serif; font-style:italic; font-weight:500; font-size:36px;
    letter-spacing:0.04em; color:#A8481F;
  }
  .cta-wrap .cta-headline{
    font-family:'Fraunces',serif; font-weight:700; font-size:150px; line-height:1.05;
    color:#7A1524; text-align:center; max-width:2300px;
  }
  .cta-wrap .cta-subhead{
    font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-size:44px;
    color:#A8481F; text-align:center;
  }
  .cta-button{
    white-space:nowrap;
    background:linear-gradient(160deg,#E4572E,#B83A22); color:#FFF6E7;
    font-family:'Figtree',sans-serif; font-weight:800; font-size:58px; letter-spacing:0.01em;
    padding:40px 74px; border-radius:999px; box-shadow:0 34px 80px -20px rgba(30,15,10,.55);
    border:6px solid #FFF6E7;
  }
  .cta-recap{
    font-family:'Fraunces',serif; font-style:italic; font-weight:500; font-size:30px; color:#8A5A3F;
    text-align:center;
  }
  .cta-recap b{ font-style:normal; color:#7A1524; font-weight:700; }
</style></head>
<body>
  <div class="grain"></div>
  ${screenshotDataUri == null ? `
  <div class="cta-wrap">
    <img class="cta-logo" src="${LOGO_DATA_URI}" />
    <div class="cta-eyebrow">${eyebrow}</div>
    <div class="cta-headline">${headline}</div>
    ${subhead ? `<div class="cta-subhead">${subhead}</div>` : ""}
    <div class="cta-button">${ctaText || "Get Your Planner Today"}</div>
    <div class="cta-recap"><b>36</b> peptides · <b>84</b> supplements · <b>30</b> biohacking tools · <b>20</b> symptoms — one system</div>
  </div>` : `
  <div class="eyebrow">${eyebrow}</div>
  <div class="headline">${headline}</div>
  ${subhead ? `<div class="subhead">${subhead}</div>` : ""}
  <div class="laptop"><div class="cam"></div></div>
  <div class="screen"><img src="${screenshotDataUri}" /></div>
  <div class="base"></div>
  ${calloutHtml}`}
  <div class="checks">${checkRow}</div>
</body></html>`;
}

// Standard content-only crop: skips the 288px sidebar entirely (it repeats on
// every slide and buyers care about the feature, not the nav) so the mockup
// scale-to-fit math has far less native content to shrink, and in-app text
// stays legible even at small Etsy gallery display sizes — the whole point
// of this redesign pass.
const CX = 290, CW = 990;

const SLIDES = [
  { n: "01-hero", eyebrow: "The Ultimate", headline: "Biohacker Wellness Planner", subhead: "Printable PDF binder + bonus web app",
    route: "dashboard", clip: { x: CX, y: 0, width: CW, height: 600 },
    callout: { value: "14", label: "Modules In One System", side: "right" } },
  { n: "04-peptide-library", eyebrow: "Peptide & GLP-1 Tracker", headline: "36-Entry Reference Library", subhead: "Semaglutide · Tirzepatide · BPC-157 · NAD+",
    route: "peptides", clip: { x: CX, y: 500, width: CW, height: 380 },
    actions: async (page) => { await page.getByRole("tab", { name: "Library", exact: true }).click(); await page.waitForTimeout(400); },
    callout: { value: "36", label: "Peptides Tracked", side: "right" } },
  { n: "06-menopause", eyebrow: "Menopause & HRT Suite", headline: "Track 20 Symptoms Daily", subhead: "Charts your doctor will love",
    route: "hormones", viewportW: 1480, clip: { x: CX, y: 195, width: 1180, height: 500 },
    callout: { value: "20", label: "Symptoms Tracked", side: "left", accent: "#D9A22C", accentDark: "#A6721B" } },
  { n: "02-whats-included", eyebrow: "Everything Included", headline: "14 Modules In One System", subhead: "Turn On Only What You Use",
    route: "settings", clip: { x: CX, y: 345, width: CW, height: 430 },
    callout: { value: "14", label: "Modules Included", side: "left", accent: "#D9A22C", accentDark: "#A6721B" } },
  { n: "03-peptide-log", eyebrow: "Peptide & Injectable Log", headline: "Never Guess Your Last Dose", subhead: "Schedule · Storage · On-Hand Tracking",
    route: "peptides", clip: { x: CX, y: 0, width: 700, height: 630 },
    callout: { value: "✓", label: "Every Dose Logged", side: "right" } },
  { n: "05-reconstitution", eyebrow: "Reconstitution Studio", headline: "Never Guess Your Dose Math", subhead: "mg ⇄ mcg · mL ⇄ Units · Visual Syringe",
    route: "calculator", clip: { x: CX, y: 0, width: CW, height: 820 },
    callout: { value: "✓", label: "Math Done For You", side: "right" } },
  { n: "07-hrt", eyebrow: "HRT Tracking", headline: "Every Prescription, Organized", subhead: "Refills · Next Labs · Provider Notes",
    route: "hormones", clip: { x: CX, y: 0, width: 700, height: 520 },
    actions: async (page) => { await page.getByRole("tab", { name: "My therapies", exact: false }).click(); await page.waitForTimeout(400); },
    callout: { value: "✓", label: "Refill Reminders", side: "left", accent: "#D9A22C", accentDark: "#A6721B" } },
  { n: "08-supplement-stacks", eyebrow: "Supplement Stacks", headline: "Morning To Bedtime, Sorted", subhead: "84 Supplements · 25 Categories",
    route: "supplements", clip: { x: CX, y: 0, width: CW, height: 620 },
    callout: { value: "84", label: "Supplements Tracked", side: "left", accent: "#D9A22C", accentDark: "#A6721B" } },
  { n: "09-supplement-add", eyebrow: "Supplement Library", headline: "84 Supplements, 25 Categories", subhead: "Search & Add In Seconds",
    route: "supplements", clip: { x: CX, y: 440, width: CW, height: 380 },
    actions: async (page) => { await page.getByRole("tab", { name: "Library", exact: true }).click(); await page.waitForTimeout(400); },
    callout: { value: "25", label: "Categories", side: "right" } },
  { n: "10-biohacking", eyebrow: "Biohacking Tools", headline: "30 Rituals, One Tap to Log", subhead: "Red Light · Cold Plunge · Sauna · HRV · More",
    route: "biohacking", clip: { x: CX, y: 170, width: CW, height: 400 },
    callout: { value: "30", label: "Tools Tracked", side: "right" } },
  { n: "10b-beauty", eyebrow: "Beauty Studio", headline: "Your Skincare, In Order", subhead: "Numbered AM/PM Steps · Retinol M·W·F · Dated History",
    route: "beauty", clip: { x: CX, y: 360, width: CW, height: 530 },
    actions: async (page) => { await page.getByRole("tab", { name: "Daily skincare", exact: false }).click(); await page.waitForTimeout(500); },
    callout: { value: "✓", label: "Check Off Each Step", side: "right" } },
  { n: "11-labs", eyebrow: "Labs & Biomarkers", headline: "Every Result, One Binder", subhead: "Filed By Panel · Charted Over Time",
    route: "labs", clip: { x: CX, y: 0, width: CW, height: 560 },
    callout: { value: "✓", label: "Doctor-Ready Charts", side: "left", accent: "#D9A22C", accentDark: "#A6721B" } },
  { n: "12-devices", eyebrow: "Wearables", headline: "Log Your Ring, Band & Watch", subhead: "Oura · WHOOP · Apple Health — Logged By Hand",
    route: "wearables", clip: { x: CX, y: 0, width: CW, height: 560 },
    callout: { value: "✓", label: "Quick Morning Log", side: "right" } },
  { n: "13-dark", eyebrow: "Day Or Night", headline: "Beautiful In Dark Mode Too", subhead: "Every Screen, Every Theme",
    route: "dashboard", dark: true, clip: { x: CX, y: 0, width: CW, height: 600 } },
  { n: "14-printables", eyebrow: "Printable Studio", headline: "Your Matching Paper Companion", subhead: "Pick Pages · Print · Or Save As PDF",
    route: "printables", clip: { x: CX, y: 0, width: CW, height: 1150 },
    callout: { value: "15", label: "Binder Pages", side: "right" } },
  { n: "15-start", eyebrow: "Ready When You Are", headline: "Start Tracking Today", subhead: "Your Calm, Private Wellness System Awaits",
    route: null, ctaText: "Get Your Planner Today" },
];

async function build(slide, browser) {
  let dataUri = null, mockW = 1900, mockH = 1150;
  if (slide.route) {
    const buf = await screenshotApp(browser, { route: slide.route, dark: slide.dark, clip: slide.clip, actions: slide.actions, viewportW: slide.viewportW });
    dataUri = `data:image/png;base64,${buf.toString("base64")}`;
    const scale = Math.min(MOCK_MAX_W / slide.clip.width, MOCK_MAX_H / slide.clip.height);
    mockW = Math.round(slide.clip.width * scale);
    mockH = Math.round(slide.clip.height * scale);
  }
  const html = slideHtml({ eyebrow: slide.eyebrow, headline: slide.headline, subhead: slide.subhead, screenshotDataUri: dataUri, mockW, mockH, checks: slide.checks, callout: slide.callout, ctaText: slide.ctaText });
  const browser2 = await chromium.launch(chromiumLaunchOptions());
  const page = await browser2.newPage({ viewport: { width: CANVAS_W, height: CANVAS_H }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle" });
  const outPath = `${OUT_DIR}/${slide.n}.png`; // .png is a scratch intermediate, gitignored — .jpg below is the real output
  await page.screenshot({ path: outPath });
  await browser2.close();
  // High quality, hi-def output: 2x-oversampled canvas downscaled via LANCZOS, saved near-lossless.
  execSync(`python3 -c "from PIL import Image; im=Image.open('${outPath}'); im.resize((${CANVAS_W},${CANVAS_H}), Image.LANCZOS).convert('RGB').save('${outPath.replace(".png", ".jpg")}', quality=98, subsampling=0)"`);
  console.log(`✓ ${slide.n}`);
}

// Optional CLI filter: node scripts/generate-thumbnails.mjs 12-devices 14-printables
const only = process.argv.slice(2);
const slidesToBuild = only.length ? SLIDES.filter((s) => only.includes(s.n)) : SLIDES;

const browser = await chromium.launch(chromiumLaunchOptions());
for (const slide of slidesToBuild) {
  await build(slide, browser);
}
await browser.close();

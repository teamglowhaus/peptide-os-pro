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
const ZOOM = 1.35; // real CSS zoom applied to the app before capture, so text is genuinely bigger

function initGate({ seed, dark }) {
  localStorage.setItem("biohacker-os:v1", JSON.stringify(dark ? { ...seed, settings: { ...seed.settings, theme: "dark" } } : seed));
  localStorage.setItem("biohacker-os:gate", "1");
}

async function screenshotApp(browser, { route, dark, clip, actions }) {
  // CSS zoom shrinks the *logical* layout width (viewport / zoom), which can
  // shift Tailwind's responsive breakpoints and break grids. Counteract that
  // by widening the real viewport by the same factor, so the app still lays
  // itself out at the original 1280 logical width — just rendered bigger.
  const page = await browser.newPage({
    viewport: { width: Math.round(MOCK_VIEWPORT_W * ZOOM), height: Math.round((clip.height + clip.y) * ZOOM) },
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

// A bold, hand-drawn-style callout (circled stat + arrow into the screenshot),
// in the spirit of direct-response ad annotations — sized down to fit the
// shop's existing warm/serif brand rather than a full hustle-ad palette swap.
function calloutSvgAndBadge({ value, label, screenLeft, screenTop, mockW, side = "right", accent = "#E4572E", accentDark = "#B83A22" }) {
  // Badge sits mostly above the laptop bezel; the arrow only grazes the very
  // top corner of the screen (never dips into the content area) so it never
  // covers real buttons, titles, or the wordmark underneath.
  const badgeSize = 230;
  const badgeCX = side === "right" ? screenLeft + mockW - 40 : screenLeft + 40;
  const badgeCY = screenTop - 100;
  const targetX = side === "right" ? screenLeft + mockW - 35 : screenLeft + 35;
  const targetY = screenTop + 8;
  const rotate = side === "right" ? -7 : 7;
  const startX = badgeCX + (side === "right" ? -70 : 70);
  const startY = badgeCY + 85;
  const midX = (startX + targetX) / 2 + (side === "right" ? 55 : -55);
  const midY = (startY + targetY) / 2;
  const svg = `<svg style="position:absolute;left:0;top:0;overflow:visible;z-index:6;pointer-events:none;" width="${CANVAS_W}" height="${CANVAS_H}">
    <defs><marker id="arrowhead-${side}" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="${accent}"/></marker></defs>
    <path d="M${startX},${startY} Q${midX},${midY} ${targetX},${targetY}" stroke="${accent}" stroke-width="8" fill="none" stroke-linecap="round" marker-end="url(#arrowhead-${side})"/>
  </svg>`;
  const badge = `<div class="callout" style="left:${badgeCX - badgeSize / 2}px; top:${badgeCY - badgeSize / 2}px; width:${badgeSize}px; height:${badgeSize}px; background:radial-gradient(circle at 32% 28%, ${accent}, ${accentDark}); transform:rotate(${rotate}deg);">
    <span class="num">${value}</span><span class="label">${label}</span>
  </div>`;
  return svg + badge;
}

// Composites a laptop-style mockup + warm serif headline copy into the final thumbnail HTML.
function slideHtml({ eyebrow, headline, subhead, screenshotDataUri, mockW, mockH, checks, callout }) {
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
    ? calloutSvgAndBadge({ ...callout, screenLeft, screenTop, mockW })
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,600;0,800;1,500&family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,400..600&display=swap" />
<style>
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
</style></head>
<body>
  <div class="grain"></div>
  <div class="eyebrow">${eyebrow}</div>
  <div class="headline">${headline}</div>
  ${subhead ? `<div class="subhead">${subhead}</div>` : ""}
  <div class="laptop"><div class="cam"></div></div>
  <div class="screen"><img src="${screenshotDataUri}" /></div>
  <div class="base"></div>
  ${calloutHtml}
  <div class="checks">${checkRow}</div>
</body></html>`;
}

const SLIDES = [
  { n: "01-hero", eyebrow: "The Ultimate", headline: "Biohacker Wellness Planner", subhead: "Printable PDF binder + bonus web app",
    route: "dashboard", clip: { x: 0, y: 0, width: 1280, height: 900 },
    callout: { value: "13", label: "Modules In One System", side: "right" } },
  { n: "04-peptide-library", eyebrow: "Peptide & GLP-1 Tracker", headline: "36-Entry Reference Library", subhead: "Semaglutide · Tirzepatide · BPC-157 · NAD+",
    route: "peptides", clip: { x: 0, y: 0, width: 1280, height: 1150 },
    actions: async (page) => { await page.getByRole("button", { name: "Library", exact: true }).click(); await page.waitForTimeout(400); },
    callout: { value: "36", label: "Peptides Tracked", side: "right" } },
  { n: "06-menopause", eyebrow: "Menopause & HRT Suite", headline: "Track 20 Symptoms Daily", subhead: "Charts your doctor will love",
    route: "hormones", clip: { x: 0, y: 0, width: 1280, height: 1180 },
    callout: { value: "20", label: "Symptoms Tracked", side: "left", accent: "#D9A22C", accentDark: "#A6721B" } },
];

async function build(slide, browser) {
  const buf = await screenshotApp(browser, { route: slide.route, dark: slide.dark, clip: slide.clip, actions: slide.actions });
  const dataUri = `data:image/png;base64,${buf.toString("base64")}`;
  const scale = Math.min(MOCK_MAX_W / slide.clip.width, MOCK_MAX_H / slide.clip.height);
  const mockW = Math.round(slide.clip.width * scale);
  const mockH = Math.round(slide.clip.height * scale);
  const html = slideHtml({ eyebrow: slide.eyebrow, headline: slide.headline, subhead: slide.subhead, screenshotDataUri: dataUri, mockW, mockH, checks: slide.checks, callout: slide.callout });
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

// Generates a reusable Canva master-template starter kit: 15 blank labeled
// pages (in the buyer's requested order) + standalone reusable template
// elements (device mockup, badge, checkmark row, background texture) as
// transparent PNGs, built from the same visual language already approved
// for the thumbnails (burgundy serif, warm background, laptop frame).
//
// Usage: node scripts/generate-canva-template-assets.mjs
import { chromium } from "playwright-core";
import { chromiumLaunchOptions } from "./lib/chromium-launch.mjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CANVAS_W = 2700, CANVAS_H = 2025;
const OUT = join(ROOT, "marketing/canva-template-package/master-template");

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,600;0,800;1,500&family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,400..600&display=swap" />`;

const BG_CSS = `background:
    radial-gradient(120% 90% at 50% 0%, rgba(255,253,247,0.92), rgba(255,253,247,0) 60%),
    radial-gradient(150% 130% at 50% 112%, rgba(228,87,46,0.14), rgba(228,87,46,0) 55%),
    linear-gradient(155deg,#FDF3E0 0%,#F8DFA9 50%,#F0C97D 100%);`;

async function shot(page, html, outPath, { transparent = false, w = CANVAS_W, h = CANVAS_H } = {}) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: outPath, omitBackground: transparent });
  console.log(`✓ ${outPath}`);
}

const browser = await chromium.launch(chromiumLaunchOptions());
const page = await browser.newPage({ deviceScaleFactor: 2 });

// --- 15 blank labeled starter pages, in the requested order ---
const PAGES = [
  "1 - Hero", "2 - Everything Included", "3 - Product Preview", "4 - Benefits",
  "5 - Features", "6 - Works With", "7 - Perfect For", "8 - How It Works",
  "9 - Bonuses", "10 - FAQ", "11 - More Page Previews", "12 - Lifestyle",
  "13 - Instant Download", "14 - Comparison", "15 - Final CTA",
];
for (const name of PAGES) {
  const html = `<!doctype html><html><head><meta charset="utf-8"/>${FONTS}<style>
    *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${CANVAS_W}px;height:${CANVAS_H}px;${BG_CSS}}
    .label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      font-family:'Fraunces',serif;font-weight:600;font-size:64px;color:#7A1524;opacity:0.28;
      text-align:center;padding:0 200px;line-height:1.3;}
    .frame{position:absolute;inset:40px;border:3px dashed rgba(122,21,36,0.25);border-radius:24px;}
  </style></head><body><div class="frame"></div><div class="label">${name}</div></body></html>`;
  const fileSafe = name.replace(/^(\d+) - /, (m, n) => n.padStart(2, "0") + "-").replace(/\s+/g, "-");
  await shot(page, html, `${OUT}/${fileSafe}.png`);
}

// --- Reusable element: laptop device mockup, transparent bg, empty white screen ---
{
  const mockW = 1900, mockH = 1150, bezel = 20, baseH = 34, baseOverhang = 46;
  const pad = 140; // canvas padding so the drop-shadow isn't clipped
  const w = mockW + pad * 2, h = mockH + pad * 2 + baseH + bezel * 2;
  const html = `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${w}px;height:${h}px;background:transparent;}
    .laptop{position:absolute;left:${pad}px;top:${pad}px;width:${mockW + bezel * 2}px;height:${mockH + bezel * 2}px;
      background:linear-gradient(165deg,#3A3430,#221D1A);border-radius:22px;box-shadow:0 50px 110px -30px rgba(46,30,26,.5);}
    .cam{position:absolute;top:7px;left:50%;transform:translateX(-50%);width:6px;height:6px;border-radius:50%;background:#5b534c;}
    .screen{position:absolute;left:${pad + bezel}px;top:${pad + bezel}px;width:${mockW}px;height:${mockH}px;border-radius:6px;background:#fff;}
    .base{position:absolute;left:${pad - baseOverhang / 2}px;top:${pad + mockH + bezel * 2}px;
      width:${mockW + bezel * 2 + baseOverhang}px;height:${baseH}px;background:linear-gradient(180deg,#4A433D,#2C2724);border-radius:0 0 12px 12px;}
    .base::after{content:"";position:absolute;left:50%;top:0;transform:translateX(-50%);width:120px;height:9px;background:#1c1815;border-radius:0 0 8px 8px;}
  </style></head><body>
    <div class="laptop"><div class="cam"></div></div><div class="screen"></div><div class="base"></div>
  </body></html>`;
  await shot(page, html, `${OUT}/elements/device-mockup-laptop.png`, { transparent: true, w, h });
}

// --- Reusable element: circled stat badge with arrow, transparent bg, placeholder text ---
{
  const w = 700, h = 700;
  const html = `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${w}px;height:${h}px;background:transparent;
      font-family:'Figtree',sans-serif;}
    .callout{position:absolute;left:${w / 2 - 115}px;top:${h / 2 - 115}px;width:230px;height:230px;border-radius:50%;
      border:7px solid #FFF6E7;box-shadow:0 24px 50px -14px rgba(30,15,10,.5);
      background:radial-gradient(circle at 32% 28%, #E4572E, #B83A22);
      display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;
      transform:rotate(-7deg);}
    .num{font-weight:800;font-size:68px;line-height:1;}
    .label{font-weight:800;font-size:17px;letter-spacing:0.04em;text-transform:uppercase;margin-top:6px;padding:0 18px;line-height:1.15;}
  </style></head><body><div class="callout"><span class="num">00</span><span class="label">Replace Me</span></div></body></html>`;
  await shot(page, html, `${OUT}/elements/badge-circle-stat.png`, { transparent: true, w, h });
}

// --- Reusable element: italic checkmark trust row, transparent bg ---
{
  const w = 1900, h = 140;
  const html = `<!doctype html><html><head><meta charset="utf-8"/>${FONTS}<style>
    *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${w}px;height:${h}px;background:transparent;}
    .checks{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
      font-family:'Fraunces',serif;font-style:italic;font-weight:500;font-size:32px;color:#7A1524;}
    .checks span.dot{color:#C9862E;padding:0 20px;font-style:normal;}
    .checks span:not(.dot)::before{content:"✓ ";color:#5B7A3C;font-style:normal;font-weight:700;}
  </style></head><body><div class="checks">
    <span>Instant download</span><span class="dot">·</span><span>Printable + app</span><span class="dot">·</span><span>One-time purchase</span>
  </div></body></html>`;
  await shot(page, html, `${OUT}/elements/checkmark-row.png`, { transparent: true, w, h });
}

// --- Reusable element: the warm background texture alone, full canvas ---
{
  const html = `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${CANVAS_W}px;height:${CANVAS_H}px;${BG_CSS}}
    .grain{position:absolute;inset:0;opacity:0.05;mix-blend-mode:multiply;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");}
  </style></head><body><div class="grain"></div></body></html>`;
  await shot(page, html, `${OUT}/elements/background-texture-warm.png`);
}

// --- Reusable element: soft decorative accent blob, transparent ---
{
  const w = 900, h = 900;
  const html = `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{box-sizing:border-box;} html,body{margin:0;padding:0;width:${w}px;height:${h}px;background:transparent;}
    .blob{position:absolute;inset:0;border-radius:50%;
      background:radial-gradient(closest-side, rgba(228,87,46,0.22), rgba(228,87,46,0));}
  </style></head><body><div class="blob"></div></body></html>`;
  await shot(page, html, `${OUT}/elements/decorative-glow-accent.png`, { transparent: true, w, h });
}

await browser.close();

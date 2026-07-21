// Generates the Etsy listing videos from the live app via Playwright screen
// recording, then encodes to web-optimized H.264 MP4 with ffmpeg.
// Usage: node scripts/generate-videos.mjs [tour|ritual|morning|all]
//
// Requires a full (non-stripped) ffmpeg with libx264 — the ffmpeg bundled with
// playwright-core is a stripped build. `pip install imageio-ffmpeg` gets one;
// set FFMPEG_BIN below to its path if it differs from the default.
import { chromium } from "playwright-core";
import { chromiumLaunchOptions } from "./lib/chromium-launch.mjs";
import { seed as baseSeed } from "./fixtures/demo-seed.mjs";
import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// Override with FFMPEG_BIN=/path/to/ffmpeg if your system's default ffmpeg
// lacks libx264 (e.g. the stripped build bundled with playwright-core).
const FFMPEG_BIN = process.env.FFMPEG_BIN || "ffmpeg";
const OUT_DIR = join(ROOT, "marketing/videos");
const VDIR = "/tmp/biohacker-video-frames";
const APP_URL = "http://localhost:4173";

const day = (o) => { const d = new Date(); d.setDate(d.getDate() - o); return d.toISOString().slice(0, 10); };
const uid = () => Math.random().toString(36).slice(2, 10);
const S = "p-ava";

function seedFor(mode) {
  // Base = the shared demo fixture (single source of truth for the Database
  // shape). A hand-rolled seed here once drifted from the schema as features
  // shipped — mode-specific overrides below still apply on top.
  const base = JSON.parse(JSON.stringify(baseSeed));
  if (mode === "morning") {
    // Lighter dataset for the morning-glance recording — fewer entries, a
    // still-open supplement checklist and injection log so those beats read
    // as genuinely "not yet done today" when the recording checks them off.
    return { ...base, injectables: [base.injectables[0]], injectionLogs: [], symptomLogs: [], hormones: [base.hormones[0]], supplements: base.supplements.slice(0, 4), redLight: [], coldPlunge: [], toolSessions: [], dailyLogs: base.dailyLogs.slice(-7), labs: [], appointments: [] };
  }
  return base;
}

const CAP = (text, sub = "") => `
(function(){
  let el=document.getElementById('vcap');
  if(!el){el=document.createElement('div');el.id='vcap';document.body.appendChild(el);
    el.style.cssText='position:fixed;left:50%;bottom:44px;transform:translateX(-50%);z-index:99999;'+
    'font-family:Figtree,sans-serif;text-align:center;pointer-events:none;transition:opacity .35s;max-width:88%;';}
  el.innerHTML='<div style="display:inline-block;background:rgba(46,38,32,.93);color:#FBF8F2;'+
    'padding:16px 32px;border-radius:999px;box-shadow:0 14px 34px -10px rgba(0,0,0,.5);">'+
    '<span style="font-family:Fraunces,serif;font-size:25px;font-weight:600;">${text.replace(/'/g, "\\'")}</span>'+
    ${sub ? `'<div style="font-size:15px;opacity:.85;margin-top:4px;">${sub.replace(/'/g, "\\'")}</div>'` : `''`}+'</div>';
  el.style.opacity='1';
})();`;
const HIDECAP = `(function(){const el=document.getElementById('vcap');if(el)el.style.opacity='0';})();`;

async function recordTourOrRitual(browser, mode) {
  const viewport = mode === "ritual" ? { width: 600, height: 1040 } : { width: 1280, height: 720 };
  const context = await browser.newContext({ viewport, recordVideo: { dir: VDIR, size: viewport }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.addInitScript((s) => { localStorage.setItem("biohacker-os:v1", JSON.stringify(s)); localStorage.setItem("biohacker-os:gate", "1"); }, seedFor(mode));
  const go = async (r) => { await page.goto(APP_URL + "/#/" + r, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(320); };
  const cap = (t, s = "") => page.evaluate(CAP(t, s));
  const hide = () => page.evaluate(HIDECAP);
  const wait = (ms) => page.waitForTimeout(ms);

  if (mode === "tour") {
    await go("dashboard");
    await cap("Your whole protocol", "one beautiful home"); await wait(1500);
    await go("peptides");
    await cap("Log every dose in seconds"); await wait(450);
    try { await page.locator('button:has-text("Log dose")').first().click(); await wait(650);
      await page.locator('button:has-text("Thigh · left")').first().click(); await wait(750);
      await page.locator('button:has-text("Save dose")').first().click(); } catch {} await wait(450);
    await go("hormones");
    await cap("Track 20 menopause symptoms"); await wait(450);
    try { for (const s of ["Night sweats", "Mood swings", "Anxiety"]) { await page.locator(`button:has-text("${s}")`).first().click(); await wait(360); } } catch {} await wait(450);
    await go("supplements");
    await cap("Check off your daily stacks"); await wait(450);
    try { const items = page.locator('button:has-text("per label")'); const n = Math.min(3, await items.count()); for (let i = 0; i < n; i++) { await items.nth(i).click(); await wait(320); } } catch {} await wait(450);
    await go("calculator");
    await cap("Mixing math, done for you"); await wait(400);
    try { const ins = page.locator("input"); await ins.nth(0).fill("5"); await wait(220); await ins.nth(1).fill("2"); await wait(220); await ins.nth(2).fill("0.25"); } catch {} await wait(900);
    await hide(); await wait(200);
    await page.evaluate(() => { const db = JSON.parse(localStorage.getItem("biohacker-os:v1")); db.settings.theme = "dark"; localStorage.setItem("biohacker-os:v1", JSON.stringify(db)); });
    await go("dashboard"); await cap("Dark mode, but make it luxury"); await wait(1300);
    await cap("The Biohacker Operating System", "GlowHausDigital"); await wait(1600);
  } else {
    await go("dashboard");
    await cap("6:30am", "morning check-in"); await wait(1400);
    try { await page.locator('button[aria-label="4 of 5"]').first().click(); await wait(700); } catch {}
    await go("supplements");
    await cap("Morning stack ✓"); await wait(450);
    try { const items = page.locator('button:has-text("per label")'); const n = Math.min(3, await items.count()); for (let i = 0; i < n; i++) { await items.nth(i).click(); await wait(360); } } catch {} await wait(500);
    await go("peptides");
    await cap("Sunday · log your shot"); await wait(450);
    try { await page.locator('button:has-text("Log dose")').first().click(); await wait(650);
      await page.locator('button:has-text("Thigh · left")').first().click(); await wait(750); } catch {} await wait(700);
    await page.evaluate(() => { const el = document.querySelector('[aria-label="Close"]'); el && el.click(); });
    await go("hormones");
    await cap("Evening · note how you feel"); await wait(500);
    try { await page.locator('button:has-text("Hot flashes")').first().click(); await wait(500); } catch {} await wait(600);
    await cap("Your day, beautifully tracked", "GlowHausDigital"); await wait(1600);
  }

  const video = page.video();
  await context.close();
  return await video.path();
}

async function recordMorningGlance(browser) {
  const viewport = { width: 1080, height: 1080 };
  const context = await browser.newContext({ viewport, recordVideo: { dir: VDIR, size: viewport }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.addInitScript((s) => { localStorage.setItem("biohacker-os:v1", JSON.stringify(s)); localStorage.setItem("biohacker-os:gate", "1"); }, seedFor("morning"));

  // First call does a real navigation (this stalls several seconds in
  // sandboxed environments — see note below); subsequent calls click the
  // actual sidebar nav button for an instant client-side route change.
  const NAV_LABEL = { dashboard: "Today", supplements: "Supplements", peptides: "Peptides & Injectables" };
  let loaded = false;
  const t0 = Date.now();
  let firstLoadDoneAt = null;
  const go = async (r) => {
    if (!loaded) {
      await page.goto(APP_URL + "/#/" + r, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
      loaded = true;
      firstLoadDoneAt = Date.now() - t0;
    } else {
      await page.locator(`aside button:has-text("${NAV_LABEL[r]}")`).first().click();
      await page.waitForTimeout(180);
    }
  };
  const cap = (t, s = "") => page.evaluate(CAP(t, s));
  const hide = () => page.evaluate(HIDECAP);
  const wait = (ms) => page.waitForTimeout(ms);

  await go("dashboard");
  await cap("Your whole wellness,", "finally in one place.");
  await wait(2200);
  try {
    await page.locator('button[aria-label="4 of 5"]').first().click();
    await wait(400);
  } catch {}
  await hide();
  await wait(200);

  await go("supplements");
  await cap("Peptides · Hormones · Supplements.");
  await wait(900);
  try {
    const items = page.locator('button:has-text("per label")');
    const n = Math.min(3, await items.count());
    for (let i = 0; i < n; i++) { await items.nth(i).click(); await wait(320); }
  } catch {}
  await wait(500);
  await hide();
  await wait(200);

  await go("peptides");
  await wait(350);
  try {
    await page.locator('button:has-text("Log dose")').first().click();
    await wait(650);
    await page.locator('button:has-text("Thigh · left")').first().click();
    await wait(700);
  } catch {}
  await wait(550);
  await hide();
  // Close the dose-log modal before the next in-app nav click, or its portal
  // overlay (fixed inset-0) blocks the sidebar underneath.
  try {
    await page.locator('button:has-text("Save dose")').first().click({ timeout: 1500 });
  } catch {
    await page.keyboard.press("Escape").catch(() => {});
  }
  await wait(300);

  await go("dashboard");
  await wait(400);
  await cap("The Biohacker Operating System", "GlowHausDigital");
  await wait(2700);

  const video = page.video();
  await context.close();
  const rawPath = await video.path();
  return { rawPath, firstLoadDoneAt };
}

function encode(rawPath, outPath, { trimSeconds = 0 } = {}) {
  const args = ["-y"];
  if (trimSeconds > 0) args.push("-ss", String(trimSeconds));
  args.push("-i", rawPath, "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow", "-movflags", "+faststart", "-an", outPath);
  execSync(`${FFMPEG_BIN} ${args.map((a) => `"${a}"`).join(" ")}`, { stdio: "inherit" });
}

async function main() {
  const mode = process.argv[2] || "all";
  if (existsSync(VDIR)) rmSync(VDIR, { recursive: true });
  mkdirSync(VDIR, { recursive: true });

  const browser = await chromium.launch(chromiumLaunchOptions());

  if (mode === "tour" || mode === "all") {
    const rawPath = await recordTourOrRitual(browser, "tour");
    encode(rawPath, `${OUT_DIR}/01-product-tour-15s.mp4`);
  }
  if (mode === "ritual" || mode === "all") {
    const rawPath = await recordTourOrRitual(browser, "ritual");
    encode(rawPath, `${OUT_DIR}/02-daily-ritual-mobile-12s.mp4`);
  }
  if (mode === "morning" || mode === "all") {
    const { rawPath, firstLoadDoneAt } = await recordMorningGlance(browser);
    // The first navigation in a fresh context reliably stalls several
    // seconds in this sandbox (observed ~13-14s — likely a blocked network
    // resource on initial load, e.g. the Google Fonts @import). Trim that
    // dead lead-in, leaving a small buffer so the dashboard is visible for
    // a beat before the first caption fades in.
    const trimSeconds = Math.max(0, (firstLoadDoneAt - 400) / 1000);
    console.log(`first load took ${firstLoadDoneAt}ms — trimming ${trimSeconds.toFixed(2)}s`);
    encode(rawPath, `${OUT_DIR}/03-morning-glance-square-13s.mp4`, { trimSeconds });
  }

  await browser.close();
  console.log("done");
}

await main();

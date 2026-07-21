// Overlays real AcroForm text fields + internal Link annotations onto the
// Playwright-rendered companion binder PDF, using the data-fillable /
// data-fillable-id / data-toc-target / data-sheet-page markers in
// src/pages/Printables.tsx. See docs/printable-companion-guide.md.
import { chromium } from "playwright-core";
import { chromiumLaunchOptions } from "./lib/chromium-launch.mjs";
import { seed as baseSeed } from "./fixtures/demo-seed.mjs";
import { PDFDocument, PDFName } from "pdf-lib";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "marketing/delivery-pdfs");
const APP_URL = "http://localhost:4173/#/printables";

// US Letter at 96 CSS px/in -> 72 pt/in
const PX_TO_PT = 72 / 96;
const PAGE_W_IN = 8.5;
const PAGE_H_IN = 11;
const MARGIN_IN = 0.3;

// Chromium's page.pdf() ignores the browser viewport entirely for layout —
// it always lays out the page at (paper size - margins) in CSS px, ignoring
// whatever viewport the page was loaded at. To capture DOM geometry that
// lines up with the actual rendered PDF, we must load/measure the page at
// that same effective width/height, with print media emulated.
const CONTENT_W_PX = Math.round((PAGE_W_IN - 2 * MARGIN_IN) * 96);
const CONTENT_H_PX = Math.round((PAGE_H_IN - 2 * MARGIN_IN) * 96);

const browser = await chromium.launch(chromiumLaunchOptions());
const page = await browser.newPage({ viewport: { width: CONTENT_W_PX, height: CONTENT_H_PX } });

// Seed from the shared demo fixture — the single source of truth for what a
// working Database looks like. (A hand-rolled seed here once drifted from the
// real schema after new features shipped, silently rendering the onboarding
// screen instead of the Printable Studio and wedging this script.)
await page.addInitScript(
  ({ seed }) => {
    localStorage.setItem("biohacker-os:v1", JSON.stringify(seed));
    localStorage.setItem("biohacker-os:gate", "1");
  },
  { seed: baseSeed }
);

await page.goto(APP_URL, { waitUntil: "domcontentloaded" });
// Fail fast and loudly if the Studio didn't render (e.g. seed drift again) —
// every later step assumes these page-picker buttons exist.
await page.waitForSelector('button:has-text("Binder cover page")', { timeout: 15000 });
await page.waitForTimeout(700);

// Turn off prefill (blank binder) and select all 15 pages.
await page.evaluate(() => {
  const prefill = [...document.querySelectorAll("input[type=checkbox]")][0];
  if (prefill && prefill.checked) prefill.click();
});
const labels = [
  "Binder cover page",
  "Weekly wellness dashboard",
  "Medication & dose card",
  "Peptide & injectable log",
  "HRT tracker",
  "Symptom tracker",
  "Supplement schedule",
  "Lab binder page",
  "Questions for my provider",
  "Red light tracker",
  "Cold plunge tracker",
  "Sauna tracker",
  "Pet health binder",
  "Monthly review",
  "Quarterly optimization review",
];
for (const l of labels) {
  try {
    const btn = page.locator(`button:has-text("${l}")`).first();
    const active = await btn.evaluate((el) => el.className.includes("champagne-400"));
    if (!active) await btn.click({ timeout: 1500 });
  } catch {}
}
await page.waitForTimeout(600);

// Switch to print media now that all screen-only controls have been clicked —
// this activates the print:* Tailwind classes (print:p-2, print:max-w-none,
// print:border-0, print:shadow-none, print:hidden on the controls panel) so
// the DOM geometry we capture next matches what page.pdf() will actually render.
await page.emulateMedia({ media: "print" });
await page.waitForTimeout(300);

// --- Capture geometry from the live DOM before rendering to PDF ---
// Each .print-page becomes exactly one physical PDF page, in DOM order.
const geometry = await page.evaluate(() => {
  const sheets = [...document.querySelectorAll(".print-page")];
  const pageOf = (el) => {
    const sheet = el.closest(".print-page");
    return sheet ? sheets.indexOf(sheet) : -1;
  };
  const rectOf = (el) => {
    const r = el.getBoundingClientRect();
    const sheetEl = el.closest(".print-page");
    const sheetRect = sheetEl.getBoundingClientRect();
    return {
      // position relative to the top-left of its own sheet, in CSS px
      x: r.left - sheetRect.left,
      y: r.top - sheetRect.top,
      w: r.width,
      h: r.height,
    };
  };

  const sheetKeys = sheets.map((s) => s.getAttribute("data-sheet-page"));

  const fillables = [...document.querySelectorAll("[data-fillable-id]")].map((el) => {
    const rect = rectOf(el);
    return { id: el.getAttribute("data-fillable-id"), type: el.getAttribute("data-fillable"), page: pageOf(el), ...rect };
  });

  // The destination of each TOC entry is the physical page carrying that
  // Sheet's own data-sheet-page marker — NOT the TOC list item itself (that
  // element lives on the cover page and only serves as the link's source rect).
  const tocTargets = {};
  sheets.forEach((s, idx) => {
    const key = s.getAttribute("data-sheet-page");
    if (key) tocTargets[key] = idx;
  });
  const tocLinks = [...document.querySelectorAll("[data-toc-target]")].map((el) => {
    const rect = rectOf(el);
    const targetKey = el.getAttribute("data-toc-target");
    return { targetKey, page: pageOf(el), ...rect };
  });

  return { sheetKeys, fillables, tocLinks, tocTargets };
});

console.log(
  `sheets=${geometry.sheetKeys.length} fillables=${geometry.fillables.length} tocLinks=${geometry.tocLinks.length}`
);

await page.pdf({
  path: `${OUT}/2-Companion-Binder-15-Pages.pdf`,
  format: "Letter",
  printBackground: true,
  margin: { top: "0.3in", bottom: "0.3in", left: "0.3in", right: "0.3in" },
});
await browser.close();

// --- Post-process with pdf-lib: real AcroForm fields + real internal links ---
const bytes = await (await import("fs/promises")).readFile(`${OUT}/2-Companion-Binder-15-Pages.pdf`);
const pdfDoc = await PDFDocument.load(bytes);
const form = pdfDoc.getForm();
const pdfPages = pdfDoc.getPages();

const pageWpt = PAGE_W_IN * 72;
const pageHpt = PAGE_H_IN * 72;
const marginPt = MARGIN_IN * 72;

function toPagePt(geo) {
  // geo.x/y/w/h are CSS px relative to the sheet's own top-left corner. The
  // browser viewport was set to exactly match the PDF's content box (paper
  // size minus margins), so the sheet renders at its *natural* height here —
  // it must NOT be stretched to fill the full page height. Just convert the
  // px measurement to pt and offset by the page margin.
  const xPt = marginPt + geo.x * PX_TO_PT;
  const wPt = geo.w * PX_TO_PT;
  const hPt = geo.h * PX_TO_PT;
  // PDF y-origin is bottom-left; geo.y is measured from the top of the sheet.
  const yTopPt = marginPt + geo.y * PX_TO_PT;
  const yPt = pageHpt - yTopPt - hPt;
  return { x: xPt, y: yPt, width: wPt, height: hPt };
}

let fieldCount = 0;
for (const f of geometry.fillables) {
  if (f.page < 0 || f.page >= pdfPages.length) continue;
  if (f.w < 4 || f.h < 4) continue;
  const pdfPage = pdfPages[f.page];
  const rect = toPagePt(f);
  try {
    const textField = form.createTextField(`field_${f.id}`);
    textField.addToPage(pdfPage, {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      borderWidth: 0,
      backgroundColor: undefined,
    });
    fieldCount++;
  } catch (e) {
    console.warn("field skip", f.id, e.message);
  }
}

let linkCount = 0;
for (const link of geometry.tocLinks) {
  const targetPageIdx = geometry.tocTargets[link.targetKey];
  if (targetPageIdx == null || targetPageIdx < 0 || targetPageIdx >= pdfPages.length) continue;
  if (link.page < 0 || link.page >= pdfPages.length) continue;
  const pdfPage = pdfPages[link.page];
  const rect = toPagePt(link);
  const targetPage = pdfPages[targetPageIdx];

  const context = pdfDoc.context;
  const destArray = context.obj([targetPage.ref, "XYZ", null, targetPage.getHeight(), null]);
  const linkAnnot = context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height],
    Border: [0, 0, 0],
    Dest: destArray,
  });
  const linkRef = context.register(linkAnnot);
  const existingAnnots = pdfPage.node.Annots();
  if (existingAnnots) {
    existingAnnots.push(linkRef);
  } else {
    pdfPage.node.set(PDFName.of("Annots"), context.obj([linkRef]));
  }
  linkCount++;
}

const finalBytes = await pdfDoc.save();
writeFileSync(`${OUT}/2-Companion-Binder-15-Pages.pdf`, finalBytes);
console.log(`✓ enhanced binder: ${fieldCount} form fields, ${linkCount} TOC links, ${pdfPages.length} pages`);

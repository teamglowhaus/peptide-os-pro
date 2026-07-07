// Exports each Printable Studio page as its own single-page, fillable PDF —
// for buyers who just want one sheet instead of the full 15-page binder.
// Bundles the 15 files into one zip (marketing/delivery-pdfs/4-Individual-Printable-Pages.zip).
// See docs/printable-companion-guide.md section 5.
import { chromium } from "/home/user/peptide-os-pro/node_modules/playwright-core/index.mjs";
import { PDFDocument } from "/home/user/peptide-os-pro/node_modules/pdf-lib/dist/pdf-lib.esm.js";
import { writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from "fs";
import { execSync } from "child_process";

const OUT_DIR = "/home/user/peptide-os-pro/marketing/delivery-pdfs/loose-pages";
const ZIP_PATH = "/home/user/peptide-os-pro/marketing/delivery-pdfs/4-Individual-Printable-Pages.zip";
const APP_URL = "http://localhost:4173/#/printables";

const PX_TO_PT = 72 / 96;
const PAGE_W_IN = 8.5;
const PAGE_H_IN = 11;
const MARGIN_IN = 0.3;
const CONTENT_W_PX = Math.round((PAGE_W_IN - 2 * MARGIN_IN) * 96);
const CONTENT_H_PX = Math.round((PAGE_H_IN - 2 * MARGIN_IN) * 96);
const pageHpt = PAGE_H_IN * 72;
const marginPt = MARGIN_IN * 72;

const PAGES = [
  { key: "cover", label: "Binder cover page", file: "00-Cover-Page" },
  { key: "weekly", label: "Weekly wellness dashboard", file: "01-Weekly-Wellness-Dashboard" },
  { key: "medcard", label: "Medication & dose card", file: "02-Medication-Dose-Card" },
  { key: "peptide", label: "Peptide & injectable log", file: "03-Peptide-Injectable-Log" },
  { key: "hrt", label: "HRT tracker", file: "04-HRT-Tracker" },
  { key: "symptoms", label: "Symptom tracker", file: "05-Symptom-Tracker" },
  { key: "supplements", label: "Supplement schedule", file: "06-Supplement-Schedule" },
  { key: "labs", label: "Lab binder page", file: "07-Lab-Binder" },
  { key: "questions", label: "Questions for my provider", file: "08-Questions-For-Provider" },
  { key: "redlight", label: "Red light tracker", file: "09-Red-Light-Tracker" },
  { key: "coldplunge", label: "Cold plunge tracker", file: "10-Cold-Plunge-Tracker" },
  { key: "sauna", label: "Sauna tracker", file: "11-Sauna-Tracker" },
  { key: "pet", label: "Pet health binder", file: "12-Pet-Health-Binder" },
  { key: "monthly", label: "Monthly review", file: "13-Monthly-Review" },
  { key: "quarterly", label: "Quarterly optimization review", file: "14-Quarterly-Optimization-Review" },
];

function seedInit() {
  return () => {
    localStorage.setItem(
      "biohacker-os:v1",
      JSON.stringify({
        version: 1,
        settings: {
          theme: "light",
          activeProfileId: "x",
          onboarding: {
            completed: true, mainGoal: "", peptides: true, glp1: true, hrt: true, menopause: true,
            supplements: true, redLight: true, coldPlunge: true, sauna: true, labs: true,
            wearables: true, pets: true, household: true, aesthetic: "cream",
          },
          cloud: { provider: "local", email: "", connected: false },
        },
        profiles: [{ id: "x", kind: "self", name: "Ava", emoji: "🌿", createdAt: "2026-01-01" }],
        pets: [], injectables: [], injectionLogs: [], hormones: [], symptomLogs: [],
        providerQuestions: [], supplements: [], supplementChecks: [], redLight: [], coldPlunge: [],
        sauna: [], toolSessions: [], dailyLogs: [], labs: [], appointments: [], wearables: [], lifestyle: [],
      })
    );
  };
}

function toPagePt(geo) {
  const xPt = marginPt + geo.x * PX_TO_PT;
  const wPt = geo.w * PX_TO_PT;
  const hPt = geo.h * PX_TO_PT;
  const yTopPt = marginPt + geo.y * PX_TO_PT;
  const yPt = pageHpt - yTopPt - hPt;
  return { x: xPt, y: yPt, width: wPt, height: hPt };
}

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let totalFields = 0;

for (const p of PAGES) {
  const page = await browser.newPage({ viewport: { width: CONTENT_W_PX, height: CONTENT_H_PX } });
  await page.addInitScript(seedInit());
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  await page.evaluate(() => {
    const prefill = [...document.querySelectorAll("input[type=checkbox]")][0];
    if (prefill && prefill.checked) prefill.click();
  });

  // Select only this one page — deselect/select each toggle to match target state.
  for (const other of PAGES) {
    try {
      const btn = page.locator(`button:has-text("${other.label}")`).first();
      const active = await btn.evaluate((el) => el.className.includes("champagne-400"));
      const shouldBeActive = other.key === p.key;
      if (active !== shouldBeActive) await btn.click({ timeout: 1500 });
    } catch {}
  }
  await page.waitForTimeout(400);
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(200);

  const geometry = await page.evaluate(() => {
    const sheets = [...document.querySelectorAll(".print-page")];
    const sheet = sheets[0];
    const sheetRect = sheet ? sheet.getBoundingClientRect() : null;
    const fillables = sheet
      ? [...sheet.querySelectorAll("[data-fillable-id]")].map((el) => {
          const r = el.getBoundingClientRect();
          return { id: el.getAttribute("data-fillable-id"), x: r.left - sheetRect.left, y: r.top - sheetRect.top, w: r.width, h: r.height };
        })
      : [];
    return { count: sheets.length, fillables };
  });

  if (geometry.count !== 1) {
    console.warn(`! ${p.file}: expected exactly 1 selected page, saw ${geometry.count} — skipping field overlay`);
  }

  const outPdf = `${OUT_DIR}/${p.file}.pdf`;
  await page.pdf({
    path: outPdf, format: "Letter", printBackground: true,
    margin: { top: "0.3in", bottom: "0.3in", left: "0.3in", right: "0.3in" },
  });
  await page.close();

  if (geometry.count === 1) {
    const bytes = readFileSync(outPdf);
    const pdfDoc = await PDFDocument.load(bytes);
    const form = pdfDoc.getForm();
    const pdfPage = pdfDoc.getPages()[0];
    let n = 0;
    for (const f of geometry.fillables) {
      if (f.w < 4 || f.h < 4) continue;
      const rect = toPagePt(f);
      try {
        const tf = form.createTextField(`field_${f.id}`);
        tf.addToPage(pdfPage, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, borderWidth: 0 });
        n++;
      } catch (e) {
        console.warn("field skip", f.id, e.message);
      }
    }
    const finalBytes = await pdfDoc.save();
    writeFileSync(outPdf, finalBytes);
    totalFields += n;
    console.log(`✓ ${p.file}.pdf (${n} fillable fields)`);
  }
}

await browser.close();

execSync(`cd "${OUT_DIR}" && zip -j -q "${ZIP_PATH}" *.pdf`);
console.log(`✓ zipped ${PAGES.length} pages (${totalFields} total fillable fields) -> ${ZIP_PATH}`);

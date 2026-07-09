#!/usr/bin/env node
/*
 * Pre-flight check: refuses to say "ready to upload" while the buyer-facing
 * deliverables still contain the seller-only placeholder URL. Run this
 * before every Etsy upload — it's the only thing standing between a real
 * customer and a PDF that tells them to visit "your-deployment-url.com".
 *
 * Usage: node scripts/check-listing-ready.mjs
 * Exit code 0 = clean. Exit code 1 = found a placeholder, do not upload yet.
 */
import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLACEHOLDER = "your-deployment-url.com";
let failed = false;

function fail(msg) {
  console.error(`✗ ${msg}`);
  failed = true;
}
function ok(msg) {
  console.log(`✓ ${msg}`);
}

// 1. Source of truth: the markdown the Welcome PDF is generated from.
const buyerGuidePath = join(ROOT, "docs/buyer-guide.md");
const buyerGuide = readFileSync(buyerGuidePath, "utf8");
if (buyerGuide.includes(PLACEHOLDER)) {
  fail(`docs/buyer-guide.md still has the placeholder URL — put the real deployed link in before regenerating the Welcome PDF.`);
} else {
  ok("docs/buyer-guide.md has a real access link.");
}

// 2. The actual delivered file — catches a stale PDF that was never
//    regenerated after step 1 was fixed. Best-effort: needs PyMuPDF (fitz)
//    via python3; skips with a warning if that's not available rather than
//    crashing the whole check.
const welcomePdf = join(ROOT, "marketing/delivery-pdfs/1-Welcome-Start-Here.pdf");
if (existsSync(welcomePdf)) {
  try {
    const text = execSync(
      `python3 -c "import fitz,sys; print(''.join(p.get_text() for p in fitz.open(sys.argv[1])))" "${welcomePdf}"`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    );
    if (text.includes(PLACEHOLDER)) {
      fail(`marketing/delivery-pdfs/1-Welcome-Start-Here.pdf still contains the placeholder URL — regenerate it from the fixed buyer-guide.md before uploading.`);
    } else {
      ok("1-Welcome-Start-Here.pdf has a real access link baked in.");
    }
  } catch {
    console.warn("⚠ Couldn't verify 1-Welcome-Start-Here.pdf's actual text (python3/PyMuPDF not available) — checked the markdown source only. Re-run in an environment with python3 + PyMuPDF for a full check.");
  }
} else {
  fail("marketing/delivery-pdfs/1-Welcome-Start-Here.pdf is missing entirely.");
}

// 3. The 5-file Etsy delivery slate should be complete and named correctly.
const expected = [
  "1-Welcome-Start-Here.pdf",
  "2-Companion-Binder-15-Pages.pdf",
  "3-License-and-Thank-You.pdf",
  "4-Individual-Printable-Pages.zip",
  "6-Canva-Template-Link.txt",
];
for (const f of expected) {
  if (!existsSync(join(ROOT, "marketing/delivery-pdfs", f))) {
    fail(`marketing/delivery-pdfs/${f} is missing — the 5-file Etsy slate isn't complete.`);
  }
}
if (expected.every((f) => existsSync(join(ROOT, "marketing/delivery-pdfs", f)))) {
  ok("All 5 buyer-facing delivery files are present.");
}

console.log("");
if (failed) {
  console.error("Not ready to upload — fix the above first.");
  process.exit(1);
} else {
  console.log("Listing deliverables look ready. (This checks the placeholder URL and file presence only — it does not proofread copy or verify the app link actually loads. Open it yourself before listing.)");
  process.exit(0);
}

# The Printable Companion System — Production Guide

The app's **Printable Studio** is the single source of truth for the paper companion: 15
brand-matched pages that print blank or pre-filled. This guide is honest about what has actually
been produced already vs. what would take additional manual work — don't advertise anything below
as "done" until it's genuinely in `marketing/delivery-pdfs/`.

## What's already been generated (real files, in this repo)

| File | What it actually is |
|------|---------------------|
| `marketing/delivery-pdfs/1-Welcome-Start-Here.pdf` | The buyer-guide.md welcome sheet, rendered to PDF by `scripts/generate-buyer-guide-pdf.mjs` — real access link + access code already in it, no placeholder |
| `marketing/delivery-pdfs/2-Companion-Binder-15-Pages.pdf` | The full 15-page binder, print-ready, **with a real clickable table of contents and real fillable form fields** — see below |
| `marketing/delivery-pdfs/3-License-and-Thank-You.pdf` | license.md + thank-you.md |
| `marketing/delivery-pdfs/4-Individual-Printable-Pages.zip` | All 15 pages as loose, single-page fillable PDFs |
| `marketing/delivery-pdfs/5-Etsy-Listing-Copy-SELLER.pdf` | For you, the seller — not a buyer-facing file |
| `marketing/delivery-pdfs/6-Canva-Template-Link.txt` | The real share link to the editable Canva bundle, packaged as an actual file |
| Canva design (editable, all 15 pages) | Live in your Canva account — every text layer is editable. The design was refreshed via `import-design-from-url` against the current binder PDF (the first import predated the cover-page table of contents added in this repo, so it was stale); the link in `6-Canva-Template-Link.txt` points at the current one. |

The hyperlinks and fillable fields described below are generated automatically by
`scripts/enhance-binder-pdf.mjs` — they are not a manual one-off edit, so they regenerate
correctly every time the binder is rebuilt.

## 1 · Hyperlinked PDF — real, built into the binder

The cover page's "In this binder" list is a genuine clickable table of contents: each line is a
PDF Link annotation with an internal `/Dest` pointing at that section's actual page object, not a
page-number lookup. `scripts/enhance-binder-pdf.mjs` builds this by:

1. Loading the app's own Printable Studio in a headless browser with every page selected.
2. Reading the on-screen position of each TOC line and of each page's own `data-sheet-page`
   marker directly from the rendered DOM.
3. Rendering the binder to PDF, then using `pdf-lib` to overlay a real Link annotation at each
   TOC line's exact position, targeting the correct destination page object.

This has been verified structurally (every link's `/Dest` reference matches the exact page object
xref of its intended target) and visually (each rendered page's overlay lines up with its printed
underlines/cells). It's safe to say "clickable table of contents" in the listing.

*The binder is still print-first — the TOC helps on tablets/PDF viewers, and a printed copy just
ignores it, so nothing is lost either way.*

## 2 · GoodNotes planner

GoodNotes imports any PDF: **GoodNotes → + → Import → `2-Companion-Binder-15-Pages.pdf`.**
This works today, as-is — no extra production step needed. Buyers can write on every page with
their stylus using GoodNotes' own pen tools; this is genuinely what "digital planner" means for
this kind of product. (If you added real link annotations per section 1 above, those work in
GoodNotes' read mode too.)

## 3 · Notability planner

Same PDF imports directly (Notability → Import) and is annotatable today, as-is. No changes needed.

## 4 · Fillable PDF — real AcroForm fields, built into the binder

The binder now has ~850 real AcroForm text fields — one over every blank write-line and every
empty table cell across all 15 pages — so it's genuinely fillable on a laptop with no stylus, in
addition to being print-and-write and annotatable in GoodNotes/Notability.

`scripts/enhance-binder-pdf.mjs` builds these the same way it builds the TOC links: every writable
blank in `src/pages/Printables.tsx` carries a `data-fillable` / `data-fillable-id` marker, the
script reads each marker's exact on-screen position from the live app, and `pdf-lib` overlays a
real `PDFTextField` at that position on the rendered PDF page.

This has been checked in Preview/PyMuPDF (the fields load, count correctly, and sit exactly on the
printed lines/cells) — before shipping, spot-check the actual PDF in Adobe Acrobat Reader too,
since form-field rendering can vary slightly across viewers. Prefilled cells (when a page is
generated with sample data instead of blank) are correctly left as plain printed text, not
fields — a fillable field would be pointless there since it already has an answer.

Given this, it's accurate to say **"fillable PDF"** in the listing — not just "print-and-write."

## 5 · Printable pages (loose) — done

`marketing/delivery-pdfs/4-Individual-Printable-Pages.zip` has all 15 pages (cover included) as
their own single-page, fillable PDF — for buyers who just want one sheet instead of the full
binder. Built by `scripts/generate-loose-pages.mjs`, which reuses the same geometry-capture
approach as the binder script (see section 4) scoped to one selected page at a time, so each loose
page gets real AcroForm fields too. Suggested print stock: 32 lb cream or ivory paper.

To regenerate after a page/copy change: `node scripts/generate-loose-pages.mjs` against a locally
running preview build.

## 6 · Canva template bundle — already done

This one is real: all 15 binder pages were imported into a Canva design with every text layer
editable (not flattened images), matching the brand palette and typography. The real share link
is packaged in `marketing/delivery-pdfs/6-Canva-Template-Link.txt`. If you need to re-do it after
a binder change, re-run `scripts/enhance-binder-pdf.mjs` first, then re-import the fresh PDF via
Canva's "Import design from URL" so the Canva copy doesn't go stale relative to the binder — this
already happened once (the first import predated the cover-page TOC) and was refreshed.

**Known PDF-import quirk, already fixed once:** Canva's PDF import collapsed each page's small
eyebrow label and large title into a single text box with too-tight line spacing, so the two
lines visually overlapped on all 14 content pages (not the cover). Fixed by increasing that text
box's line height. If you re-import after a binder change, check the top of a few pages for this
same overlap and re-apply a `line_height` of roughly 1.6 via `format_text` if it recurs.

## Delivery checklist (what to actually upload to Etsy)

Etsy allows 5 digital files ≤20 MB each. Only include files that exist and are accurately named —
don't promise "hyperlinked" or "fillable" in a filename unless section 1 or section 4 above has
genuinely been done:

| File | Contents | Status |
|------|----------|--------|
| `1-Welcome-Start-Here.pdf` | Buyer welcome sheet — real access link + access code already baked in | ✅ exists |
| `2-Companion-Binder-15-Pages.pdf` | The 15-page binder — print + GoodNotes/Notability ready, with a real clickable TOC and real fillable form fields | ✅ exists |
| `3-License-and-Thank-You.pdf` | License + thank-you | ✅ exists |
| `4-Individual-Printable-Pages.zip` | All 15 pages as loose, single-page fillable PDFs | ✅ exists |
| `6-Canva-Template-Link.txt` | The real share link to the editable Canva bundle | ✅ exists |

That's the full 5 of Etsy's 5-file limit. `5-Etsy-Listing-Copy-SELLER.pdf` is for you, not a
buyer-facing upload — don't include it in the 5.

If you ever regenerate the binder (new pages, copy changes, etc.), re-run
`node scripts/enhance-binder-pdf.mjs` against a locally running preview build to rebuild the
hyperlinks and fillable fields — a plain `page.pdf()` export on its own won't include them.

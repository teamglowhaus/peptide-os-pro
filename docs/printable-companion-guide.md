# The Printable Companion System — Production Guide

The app's **Printable Studio** is the single source of truth for the paper companion: 15
brand-matched pages that print blank or pre-filled. This guide is honest about what has actually
been produced already vs. what would take additional manual work — don't advertise anything below
as "done" until it's genuinely in `marketing/delivery-pdfs/`.

## What's already been generated (real files, in this repo)

| File | What it actually is |
|------|---------------------|
| `marketing/delivery-pdfs/1-Welcome-Start-Here.pdf` | The buyer-guide.md welcome sheet, exported to PDF |
| `marketing/delivery-pdfs/2-Companion-Binder-15-Pages.pdf` | The full 15-page binder, print-ready. **No real hyperlinks and no AcroForm fields** — see below for what that means |
| `marketing/delivery-pdfs/3-License-and-Thank-You.pdf` | license.md + thank-you.md |
| `marketing/delivery-pdfs/5-Etsy-Listing-Copy-SELLER.pdf` | For you, the seller — not a buyer-facing file |
| Canva design (editable, all 15 pages) | Imported into your Canva account — every text layer is live/editable. Ask for the current share link if you've lost it; it was created via `import-design-from-url` from the binder PDF. |

There is currently **no separate "hyperlinked" file and no separate "fillable" file** — only the
one flat binder PDF above. The sections below describe what those words honestly mean for this
product, and what it would take to build the real versions if you want them.

## 1 · "Hyperlinked PDF" — what this means today, and what it would take to build for real

The binder PDF does **not** currently have a clickable table of contents or internal page jumps.
If you want that:

1. Open `2-Companion-Binder-15-Pages.pdf` in a PDF editor that supports link annotations (Acrobat,
   PDF Expert, or free: LibreOffice Draw / pdfescape.com).
2. On the cover page, add invisible link rectangles from each line of a small table of contents
   to its target page.
3. Save as a new file — don't call it "hyperlinked" in your listing until this step is actually
   done, since the auto-generated PDF doesn't have this today.

*Tip: keep the plain PDF too — some buyers just want to hit print, and a TOC adds no value there.*

## 2 · GoodNotes planner

GoodNotes imports any PDF: **GoodNotes → + → Import → `2-Companion-Binder-15-Pages.pdf`.**
This works today, as-is — no extra production step needed. Buyers can write on every page with
their stylus using GoodNotes' own pen tools; this is genuinely what "digital planner" means for
this kind of product. (If you added real link annotations per section 1 above, those work in
GoodNotes' read mode too.)

## 3 · Notability planner

Same PDF imports directly (Notability → Import) and is annotatable today, as-is. No changes needed.

## 4 · "Fillable PDF" — say what you mean

**Important:** "fillable PDF" in the Etsy-planner world almost always means *"you can write on it
in GoodNotes/Notability with a stylus,"* not *"it has real Acrobat form fields you tab through on
a computer."* The binder as generated has neither AcroForm text fields nor checkboxes — it's a flat
PDF with printed underlines and table cells meant for a pen (physical or stylus).

**Do not advertise "fillable PDF" implying interactive Acrobat form fields** unless you actually
build them. If you want that (useful mainly for buyers filling it out on a laptop with no stylus):

1. Take the master PDF into a form editor (Acrobat "Prepare Form" auto-detects many underlined
   fields and table cells; free alternative: pdfescape.com or LibreOffice Draw form controls).
2. Auto-detection catches most write-lines because they're true underlines; add checkbox fields
   over the weekly-dashboard grid cells by hand.
3. Test the result opens correctly in Preview *and* Adobe Reader *and* a browser PDF viewer — form
   field support is inconsistent across viewers, so verify before shipping.
4. Only then export as e.g. `Biohacker-Binder-Fillable.pdf` and only then say "fillable" in your
   listing.

If you skip this step (reasonable — it's genuinely optional, manual work), describe the product
accurately instead: **"print-and-write, plus digitally annotatable in GoodNotes/Notability."**

## 5 · Printable pages (loose)

Export each Studio page as its own PDF (select one page at a time → Print → Save as PDF) for
buyers who want single sheets. Suggested print stock: 32 lb cream or ivory paper. Not yet done —
optional, do this only if you want to sell/offer individual pages separately.

## 6 · Canva template bundle — already done

This one is real: all 15 binder pages were imported into a Canva design with every text layer
editable (not flattened images), matching the brand palette and typography. If you need to re-do
it or create a fresh copy, use Canva's "Import design from URL" against the binder PDF, or open
your existing design and use "Make a copy."

## Delivery checklist (what to actually upload to Etsy)

Etsy allows 5 digital files ≤20 MB each. Only include files that exist and are accurately named —
don't promise "hyperlinked" or "fillable" in a filename unless section 1 or section 4 above has
genuinely been done:

| File | Contents | Status |
|------|----------|--------|
| `1-Welcome-Start-Here.pdf` | Buyer welcome sheet — **add your real app link before uploading** | ✅ exists |
| `2-Companion-Binder-15-Pages.pdf` | The 15-page binder, print + GoodNotes/Notability ready | ✅ exists |
| `3-License-and-Thank-You.pdf` | License + thank-you | ✅ exists |
| A Canva template link (as a short PDF or text file with the share link) | Editable Canva bundle | ✅ design exists — package the link |
| A true hyperlinked and/or fillable PDF | Only if you've done section 1 or 4 above | ⬜ optional, not done yet |

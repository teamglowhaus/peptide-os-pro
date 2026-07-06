# The Printable Companion System — Production Guide

The app's **Printable Studio** is the single source of truth for the paper companion: 15
brand-matched pages that print blank or pre-filled. This guide covers turning those pages into
the six deliverable formats the listing promises.

## 1 · Hyperlinked PDF (master file)

1. Open Printable Studio → select **all pages** → Print → *Save as PDF* (US Letter or A4).
2. Open the PDF in any editor that supports links (Acrobat, PDF Expert, or free: LibreOffice
   Draw / pdfescape.com).
3. On the cover page, add invisible link rectangles from each line of a small table of contents
   to its page. Save as `Biohacker-OS-Binder-Hyperlinked.pdf`.

*Tip: keep the un-linked print PDF too — some buyers just want to hit print.*

## 2 · GoodNotes planner

GoodNotes imports any PDF: **GoodNotes → + → Import → the hyperlinked PDF.**
- Hyperlinks work in read mode (tap with one finger).
- Recommend buyers use the fountain-pen tool in a cocoa or sage ink to match the aesthetic.
- Optional: export a `.goodnotes` file from your own GoodNotes to ship alongside the PDF.

## 3 · Notability planner

Same PDF imports directly (Notability → Import). Links work in read-only mode. No changes needed.

## 4 · Fillable PDF

1. Take the master PDF into a form editor (Acrobat "Prepare Form" auto-detects the underlined
   fields and table cells; free alternative: pdfescape.com or LibreOffice Draw form controls).
2. Auto-detection catches most write-lines because they're true underlines; add checkbox fields
   over the weekly-dashboard grid cells.
3. Export as `Biohacker-OS-Binder-Fillable.pdf` (test in Preview + Adobe Reader).

## 5 · Printable pages (loose)

Export each Studio page as its own PDF (select one page at a time → Print → Save as PDF) for
buyers who want single sheets. Suggested print stock: 32 lb cream or ivory paper.

## 6 · Canva template bundle

To offer an editable Canva version (buyers love customizing the cover):

1. Create a Canva design at **US Letter (8.5×11 in)**.
2. Brand kit: background `#FBF8F2` · ink `#2E2620` · taupe `#857463` · champagne `#C9A96A` ·
   sage `#8E9C83` · blush `#DCA994`. Fonts: **Fraunces** (headings — in Canva's library) and
   **Figtree** (body — also in Canva).
3. Rebuild each Studio page with Canva tables/lines (screenshot the Studio previews as tracing
   references — they're pixel-consistent).
4. Header pattern on every page: tiny uppercase champagne eyebrow → Fraunces title → thin
   champagne divider (the “flourish”).
5. Share → **Template link** → paste that link into a one-page PDF ("Your Canva Bundle") that
   ships with the download.

## Delivery checklist (what actually gets uploaded to Etsy)

Etsy allows 5 digital files ≤20 MB each. Recommended set:

| File | Contents |
|------|----------|
| `1-Welcome-Start-Here.pdf` | buyer-guide.md exported to PDF, with your live app URL |
| `2-Binder-Hyperlinked.pdf` | full 15-page companion, linked TOC |
| `3-Binder-Fillable.pdf` | form-fillable version |
| `4-Canva-Bundle.pdf` | Canva template link + brand kit values |
| `5-License-and-Thanks.pdf` | license.md + thank-you.md |

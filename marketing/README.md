# GlowHausDigital — Etsy Launch Assets

Everything you need to list **The Ultimate Biohacker Operating System** on Etsy.

## 📸 Listing images — `marketing/thumbnails/` (15 files, 2700×2025)
Upload in this order (Etsy shows up to 10 — the first 10 are the strongest; keep the rest for
Pinterest):
1. `01-hero` · 2 `02-whats-included` · 3 `03-peptide-log` · 4 `04-peptide-library` ·
5 `05-reconstitution` · 6 `06-menopause` · 7 `07-hrt` · 8 `08-supplement-stacks` ·
9 `09-supplement-add` · 10 `10-biohacking` · 11 `11-labs` · 12 `12-devices` ·
13 `13-dark` · 14 `14-printables` · 15 `15-start`

## 🎬 Videos — `marketing/videos/`
- `01-product-tour-15s.mp4` — main Etsy listing video (desktop tour)
- `02-daily-ritual-mobile-12s.mp4` — Pinterest / IG Reels / 2nd Etsy video
- `03-morning-glance-square-13s.mp4` — real screen-recording substitute for the original
  "woman at a table" brief; 3rd Etsy video / Instagram feed (see the videos README for why
  it's a screen recording, not live-action, and how to regenerate all three)

## 📄 Files buyers download — `marketing/delivery-pdfs/`
Attach these to the Etsy listing as the digital files (Etsy allows 5 — this is the full set):
- `1-Welcome-Start-Here.pdf` — **add your real app link first, see below — do not upload as-is**
- `2-Companion-Binder-15-Pages.pdf` — the printable binder, real clickable TOC + fillable fields
- `3-License-and-Thank-You.pdf`
- `4-Individual-Printable-Pages.zip` — all 15 pages as loose, single-page fillable PDFs
- `6-Canva-Template-Link.txt` — the real share link to the editable Canva bundle
- `5-Etsy-Listing-Copy-SELLER.pdf` — **for you, not buyers** (copy/paste your listing text —
  don't count this against Etsy's 5-file limit)

## ✍️ Listing text — `docs/etsy-listing-package.md`
SEO titles, 13 tags, description, FAQ, Pinterest + Instagram copy, pricing.

## 🔗 Before you list
1. Merge the pull request & get your app link → `docs/HOW-TO-MERGE-AND-GET-YOUR-LINK.md`
2. Put that link in `docs/buyer-guide.md` and regenerate `1-Welcome-Start-Here.pdf`
   (I'll do it — just send me the link)
3. Run `node scripts/check-listing-ready.mjs` — it fails loudly if step 2 didn't actually
   happen, so nothing with a placeholder link can accidentally go out
4. Canva editable bundle is already done — the real link is in `6-Canva-Template-Link.txt`

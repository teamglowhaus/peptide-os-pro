# The Ultimate Biohacker Operating System™

A premium, feminine, private wellness tracking system — a luxury Etsy digital planner transformed
into a powerful installable web app. Peptides & GLP-1, HRT & menopause, supplements, red light,
cold plunge, sauna, labs, wearables, daily rituals, pets, and household profiles — in one calm,
handcrafted home.

![Stack](https://img.shields.io/badge/React%2018-TypeScript-8E9C83) ![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-C9A96A) ![PWA](https://img.shields.io/badge/PWA-offline--first-DCA994)

## Quick start

```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build
```

Deploy `dist/` to any static host (Vercel/Netlify/Cloudflare Pages). The app is a PWA —
installable on iPhone, iPad, Android, and desktop, and works offline.

## What's inside

| Area | Details |
|------|---------|
| **Today dashboard** | Biohacker Score™ (7-day consistency ring), protocol cards, mood/energy/sleep/HRV/weight check-in + sparkline trends, reminders |
| **Peptides & injectables** | 37-entry reference library (GLP-1s, recovery & GH-axis peptides, longevity, vitamin shots) + unlimited custom; site-rotation map; vials, storage, inventory, refill reminders; printable travel card; full dose log |
| **Reconstitution Studio** | mg/mL/units arithmetic with a visual U-100 syringe, multi-syringe warning, mg⇄mcg and mL⇄units converters — math only, never dosing advice |
| **Hormones & menopause** | HRT therapies in 9 delivery forms, 20-symptom daily check-in with severity meters, cycle log, trend charts, refill/lab reminders, provider question list |
| **Supplement Sanctuary** | 90+ item library, 25 categories, 48 seed brands, barcode scanning (BarcodeDetector API), morning/afternoon/evening/bedtime stacks, with/without-food notes, inventory + reorder reminders, CSV import/export |
| **Body lab** | Biohacking tools (30 rituals), dedicated red light / cold plunge / sauna trackers with before/after mood & energy, labs & biomarker binder with per-marker trends, wearables shelf |
| **Daily rituals** | Nutrition, body, fitness, sleep, beauty, dental, hair, mindset |
| **Your world** | Household profiles (fully separated data per person), pet wellness binder (meds, vaccines, vet visits, weight), Printable Studio (15 brand-matched print-to-PDF pages, blank or pre-filled), settings with backup/restore + light/dark luxury themes |

## Safety by design

No medical advice anywhere: every dose field records the **user's own provider/label
instructions**; the calculator performs arithmetic only; the labs AI summary is a placeholder with
an explicit "organize, never diagnose" rule; disclaimers are rendered in-product.

## Architecture

- **Local-first**: all data persists on-device via a `SyncAdapter` (`src/lib/store.tsx`);
  export/import backup as a single JSON file.
- **Cloud-ready**: `docs/supabase-setup.md` + `supabase/schema.sql` provide a drop-in Supabase
  adapter (magic-link auth, RLS, whole-document sync) without touching any screen.
- **Design system**: hand-built component kit (`src/components/ui.tsx`) — cream/taupe/champagne/
  sage/blush palette, Fraunces + Figtree, paper grain, validated chart tokens, dark "espresso"
  theme.

## The product bundle

- `docs/etsy-listing-package.md` — SEO titles, 13 tags, description, FAQ, thumbnail overlays,
  video storyboard, Pinterest/Instagram copy, pricing strategy (from bestseller research)
- `docs/buyer-guide.md`, `docs/license.md`, `docs/thank-you.md` — the delivered PDFs
- `docs/printable-companion-guide.md` — producing the hyperlinked/fillable/GoodNotes/Notability/
  Canva versions from the in-app Printable Studio
- `marketing/thumbnails/` — 15 HD listing images (2700×2025)

*This software organizes personal wellness information. It is not a medical device and provides
no medical advice.*

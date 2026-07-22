# Etsy Listing Package — The Ultimate Biohacker Operating System

Informed by a category scan of bestselling listings in the GLP-1 tracker, menopause/HRT tracker,
supplement tracker, GoodNotes planner, Notion "Life OS," and biohacking planner niches (as of the
session that wrote this doc). **This is a directional read, not a cited or sourced study** — no
listing URLs, screenshots, or dated price snapshots back it up, and it should be treated as an
informed starting hypothesis to test, not settled fact. Two takeaways worth testing, not assuming:

- **No bestseller obviously bundles GLP-1 + menopause/HRT + biohacking in one system.** This could
  mean open white space — or it could mean the three audiences don't actually want the same
  product, and a hyper-focused single-niche competitor will out-convert a generalist bundle on
  search-intent match. The research doesn't distinguish between these two explanations, and only
  real conversion data will.
- **The price bands cited below ($2–15, $3–20, $4–32, $47–197)** are the same kind of directional
  read — reasonable-sounding, not independently verified. Don't treat them as more rigorous than
  the "$97 anchor" assumption they replaced; they're a better-calibrated guess, still a guess.

---

## ⚠️ Read this first — channel risk, pricing reality, and how to position the listing

This section exists because the obvious way to sell this product (lead with the web app, price
it like a $97 course, publish it only on Etsy) carries three real risks. Address these *before*
you list, not after a takedown or a return of silence at your price point.

**1. Etsy policy risk — position printables as the product, the app as the bonus.**
Etsy prohibits listings that promote or facilitate regulated drug use, and its digital-goods
policies are built around delivering *files*, not an externally hosted, ongoing *service* you
maintain. This product is both: it references prescription/research substances (semaglutide,
tirzepatide, BPC-157, etc.) by name, and its centerpiece is a live web app on your own server, not
a static file. To reduce (not eliminate) the risk of a policy flag or takedown:
  - Lead every listing's title, images, and description with the **printable PDF binder and Canva
    bundle** as the core deliverable — those are unambiguously "digital files."
  - Frame the web app as a **companion / bonus tool**, not the headline product.
  - Keep drug *brand* names (Ozempic, Wegovy, Mounjaro, Zepbound) out of titles/tags/images —
    generic names (semaglutide, tirzepatide) carry somewhat less trademark and policy exposure,
    but are still visibly drug-adjacent; use your judgment on how much to soften imagery.
  - **Have a non-Etsy fallback** (Gumroad, your own Shopify/website checkout) so a single takedown
    doesn't zero out the business. Do not build the whole venture on one channel you don't control.
  - **The "peptides" in this product are not one risk bucket — treat them differently.**
    Semaglutide and tirzepatide are FDA-approved prescription drugs; BPC-157, TB-500, KPV,
    Thymosin Alpha-1/Beta-4, and GHK-Cu are unapproved research chemicals with a meaningfully
    higher regulatory/platform-policy profile — they're sold and used outside any approved
    medical pathway. A reviewer flagging this listing is far more likely to focus on the research
    peptides than the GLP-1s. This has **not** been verified against Etsy's actual current
    Prohibited/Restricted Items policy text — read that yourself (not this doc, and not an LLM's
    judgment call) before deciding how much research-peptide detail belongs in public-facing tags,
    images, and descriptions.

**2. Pricing — $97 fights the category, don't assume it, test it.**
An informal scan of this niche suggests trackers/planners selling **$2–15**, digital planners
**$3–20**, Notion templates **$4–32**; the *only* things regularly selling **$47+** appear to be
genuine courses with
teaching content, or mega-bundles with visible "value math." A bare tracker at $97 — even with a
compare-at anchor — is untested against buyers calibrated to $6 GLP-1 PDFs. Two honest paths:
  - **Add real educational content** (a short written guide on *how to use* peptide/HRT/supplement
    tracking well — not medical advice, but genuine how-to-use-the-system teaching) to justify a
    premium price the way the $47–197 course-style products in this category do it, **or**
  - **Launch lower** ($19–37) as your primary hero price and test upward, rather than assuming a
    $97 anchor will convert cold Etsy traffic. Price is an experiment, not a foregone conclusion —
    watch conversion rate at your first price point before committing to it in ad spend or in more
    listings.

**3. The 3-listing SEO strategy risks a duplicate-listing flag.**
Publishing the same product as 3 near-identical listings to own multiple keyword clusters is
exactly the pattern Etsy's duplicate-listing detection looks for. If you use more than one listing,
make each one's *actual content* (bonus files, cover design, page count) meaningfully different —
don't just reskin the same description with swapped keywords.

**4. Don't advertise features that don't exist yet.**
Every claim below is written to match what the app *actually ships today*: no barcode scanning (removed —
`BarcodeDetector` doesn't work on iOS Safari, the core audience), no cloud sync/accounts (local-only
today). The binder PDF genuinely has a clickable table of contents and real Acrobat form fields
(built by `scripts/enhance-binder-pdf.mjs` — see `docs/printable-companion-guide.md`), in addition
to being GoodNotes/Notability annotatable — so "fillable PDF" and "clickable table of contents" are
both accurate claims now, not just "print-and-write." If you change the binder's pages later, re-run
that script before re-shipping so the claim stays true.

---

## 1 · SEO Titles (each ≤140 characters — Etsy's limit; primary keyword in the first 40)

Titles below lead with the **printable planner/PDF** — the actual "digital file" Etsy sells — and
mention the web app as a bonus, per the channel-risk note above.

**Primary listing (recommended — GLP-1 has the highest search volume + momentum):**

> GLP-1 Weight Loss Tracker Printable Planner | Menopause HRT Symptom Log, Supplement & Lab Binder | PDF + Bonus Companion Web App

**Second listing (menopause keyword cluster — only publish if its bonus content genuinely differs, see the duplicate-listing note above):**

> Menopause & Perimenopause Symptom Tracker Printable + GLP-1 Weight Loss Journal | Wellness Planner PDF Binder | Bonus Web App

**Third listing (premium/brand positioning):**

> Ultimate Biohacker Wellness Planner | Printable PDF Binder — GLP-1, HRT Menopause, Supplement, Lab & Recovery Tracking | Bonus App

*Strategy note: only run more than one listing if each has a genuinely different bonus/cover/page
count — see the duplicate-listing risk above. One well-optimized listing beats three flagged ones.*

---

## 2 · The 13 Tags (all ≤20 characters — Etsy's tag limit)

For the primary (GLP-1-led) listing:

1. `glp 1 tracker`
2. `glp1 weight loss`
3. `semaglutide tracker`
4. `tirzepatide journal`
5. `injection tracker`
6. `weight loss journal`
7. `menopause tracker`
8. `hrt tracker`
9. `supplement tracker`
10. `symptom tracker`
11. `wellness planner`
12. `biohacking planner`
13. `health planner women`

Rotate onto the menopause-led listing: `perimenopause log`, `hormone tracker`,
`longevity tracker`, `lab results tracker`, `self care planner`, `life os template`,
`medication tracker`.

*(Avoid third-party drug brand names — "ozempic tracker" etc. — in tags/titles unless you accept
trademark risk; competitors that use them lean on the non-affiliation disclaimer below.)*

---

## 3 · Listing Description

✨ **THE ULTIMATE BIOHACKER WELLNESS PLANNER** ✨
*A beautifully designed printable system for peptides, hormones, and supplements — made for women
who are done juggling six half-used planners. Plus a bonus companion web app.*

If you're navigating a GLP-1 journey, perimenopause, HRT, a supplement cabinet that keeps growing,
and a red-light panel in the corner of your bedroom… this was made specifically for you. One
private, beautiful home for all of it — designed like a luxury planner.

🌿 **WHAT'S INCLUDED**

**The Printable Companion Binder (PDF, print at home, unlimited)**
• 15 matching pages: weekly dashboard, medication card, peptide log, HRT tracker, symptom tracker, supplement schedule, lab binder, provider questions, red light / cold plunge / sauna logs, pet binder, monthly review, quarterly optimization review + cover page
• Print on your own paper, any number of times, for your own personal use
• Fillable PDF with a clickable table of contents — type directly into every blank on a laptop or tablet, no printer needed
• Or import into GoodNotes or Notability to write on every page with your stylus
• Bonus: every page also included as its own loose, single-sheet fillable PDF — just print (or fill in) the one page you need

**Bonus: a companion web app** (works in the browser on iPhone, iPad, Android & desktop —
installable like an app, no App Store needed)
• Today dashboard with your Biohacker Score, protocol checklist & gentle trends
• Streaks & badges — 13 earnable milestones, a daily streak flame, and a little celebration when you hit a new one (motivation, made pretty)
• Peptide & injectable tracker — 36-entry library (semaglutide, tirzepatide, BPC-157, NAD+ & more) + unlimited custom entries, site-rotation map, vial & refill reminders, travel cards
• Reconstitution Studio — mg/mL math with a visual 100-unit syringe (arithmetic only, never dosing advice, and gated behind an explicit "this is not medical advice" screen you must agree to before use)
• Hormones & Menopause suite — HRT log (creams, patches, pellets, troches & more), 20-symptom daily check-in (hot flashes, night sweats, brain fog & more), period & cycle tracking with estimated cycle day + phase and flow log (estimates from what you log — not a fertility or contraception tool), trend charts to bring to your provider, "ask my provider" list
• Supplement Sanctuary — 84-item library, 25 categories, 48 seed brands, morning/afternoon/evening/bedtime stacks, inventory & reorder reminders, CSV import/export
• Biohacking tools — red light, cold plunge, sauna, HRV, CGM, breathwork, PEMF + 20 more
• Beauty Studio — 42-entry treatment library (chemical peels, microneedling, Botox, filler, PRP & PRF, Fraxel, CO2, Halo & more lasers, LED masks, gua sha, dermaplaning & more, in-office and at-home), set your own repeat schedule and get a gentle "your peel is coming up" reminder you can log or skip, plus a numbered morning/evening skincare routine system — enter your whole program in order, check off each product as it goes on, schedule actives by day (retinol Mon·Wed·Fri), swap a product for one night or for good, and look back on a dated four-week history of what you used and how your skin responded
• Labs & Biomarker Binder with marker-by-marker trend lines
• Provider Visit Report — one tap assembles your last 30 or 90 days (current therapies, symptom patterns, cycle, check-in averages, labs, and your saved questions) into a clean printable report to hand your provider at the start of the appointment
• 8 daily ritual trackers: nutrition, body, fitness, sleep, beauty, dental, hair, mindset
• Household profiles (spouse, kids, parents) + full pet wellness binder 🐾
• Light & dark luxury themes · 100% private today — everything lives only in your own browser,
  nothing is sent to us (see "A note on the app" below for what that means in practice)

💛 **HOW IT WORKS**
1. Purchase → instantly download your files, including the Welcome PDF
2. Print your binder, or import it into GoodNotes/Notability
3. (Optional) Open your private app link and install the bonus companion app (60 seconds)
4. Take the 2-minute onboarding — the app shapes itself around what *you* track

📱 **FORMATS**
Fillable, hyperlinked PDF pages (US Letter/A4 friendly, print-ready too), GoodNotes/Notability-ready
via import, Canva template link, plus the bonus web app. One-time purchase, undated — start anytime.

❓ **FAQ**

*Is this a subscription?* No. One-time purchase.
*Do I need an app store for the bonus app?* No — it installs straight from your browser (Add to Home Screen).
*Is my data private?* In the bonus app, yes — your entries live only in your own browser; nothing is sent to us. Because of that, there's also no cloud backup, so please export a backup file regularly (the app reminds you) — it can't be recovered if your browser clears its storage.
*Does it tell me doses?* Never. Every dose field says "per your provider/label." The
reconstitution studio does arithmetic only and requires you to confirm you understand this before you can use it.
*Can I track my husband / mom / dog?* Yes — household profiles and pet profiles are built into the bonus app.
*Refunds?* Due to the instant-download nature of digital products, all sales are final — but
message us with any issue and we'll make it right.

⚠️ **IMPORTANT DISCLAIMER**
This planner is for personal organization and habit tracking only. It is not medical advice, does
not diagnose, treat, or prescribe, and is not a substitute for guidance from your licensed
healthcare provider. Always follow your own provider's and product labels' instructions. This
product is not affiliated with, endorsed by, or connected to any pharmaceutical brand, healthcare
provider, or the makers of Oura, WHOOP, Apple Health, GoodNotes, Notability, or Canva — those names
appear only to describe compatibility, and wearable data is logged in by hand, not synced.

**A note on the app:** the bonus web app is provided as-is and may change or be discontinued; it is
not a cloud service and has no account system today. Your printable binder is the part of this
purchase that works forever, offline, with no dependency on us keeping a server running.

© GlowHausDigital. For personal use only — see license page.

---

## 4 · "What's Included" one-liner (for image #2 grid)

15 Fillable, Hyperlinked Pages · Loose Single-Page PDFs Included · GoodNotes/Notability Ready ·
Canva Template · Bonus Web App (14 modules) · Peptide Library · Hormone Suite · Cycle & Period
Tracking · Beauty Studio & Skincare Routines · Supplement Library · Lab Binder · Streaks & Badges ·
Pet & Household Profiles · Light + Dark Mode

---

## 5 · Buyer Instructions (include as the delivered PDF — see docs/buyer-guide.md for full text)

---

## 6 · License Page (see docs/license.md)

## 7 · Thank-You Page (see docs/thank-you.md)

---

## 8 · 15 Thumbnail Text Overlays

Fully redesigned and rebuilt from scratch (burgundy serif headline + italic subhead on a warm
paper-textured background, a laptop-frame mockup of the real app, a circled-stat badge, and an
italic checkmark trust row) via a real, committed, regenerate-anytime script:
`scripts/generate-thumbnails.mjs`. Run it anytime the app or its data changes — there is no more
manual pixel-retouching or drift risk. Files are 2700×2025 px in `marketing/thumbnails/`.

1. **Hero** — "The Ultimate" / "Biohacker Wellness Planner" · Printable PDF binder + bonus web app
2. **Everything Included** — "14 Modules In One System" · Turn on only what you use
3. **Peptide & Injectable Log** — "Never Guess Your Last Dose" · Schedule · Storage · On-Hand Tracking
4. **Peptide & GLP-1 Tracker** — "36-Entry Reference Library" · Semaglutide · Tirzepatide · BPC-157 · NAD+
5. **Reconstitution Studio** — "Never Guess Your Dose Math" · mg ⇄ mcg · mL ⇄ Units · Visual Syringe
6. **Menopause & HRT Suite** — "Track 20 Symptoms Daily" · Charts your doctor will love
7. **HRT Tracking** — "Every Prescription, Organized" · Refills · Next Labs · Provider Notes
8. **Supplement Stacks** — "Morning To Bedtime, Sorted" · 84 Supplements · 25 Categories
9. **Supplement Library** — "84 Supplements, 25 Categories" · Search & Add In Seconds
10. **Biohacking Tools** — "30 Rituals, One Tap to Log" · Red Light · Cold Plunge · Sauna · HRV · More
11. **Labs & Biomarkers** — "Every Result, One Binder" · Filed By Panel · Charted Over Time
12. **Wearables** — "Log Your Ring, Band & Watch" · Oura · WHOOP · Apple Health — Logged By Hand
13. **Day Or Night** — "Beautiful In Dark Mode Too" · Every Screen, Every Theme
14. **Printable Studio** — "Your Matching Paper Companion" · Pick Pages · Print · Or Save As PDF
15. **Final CTA** — "Start Tracking Today" · Your Calm, Private Wellness System Awaits

---

## 9 · 15-Second Listing Video Storyboard (muted, 1080p+, screen recording)

| Sec | Shot |
|-----|------|
| 0–2 | Logo mark on cream, title fades in: "Your wellness, organized." |
| 2–4 | Onboarding "Build your operating system" screen — toggles flipping on |
| 4–6 | Dashboard scroll: Biohacker Score ring animates, protocol cards |
| 6–8 | Peptide tracker → tap "Log dose" → site rotation map |
| 8–10 | Hormone symptom check-in — severity pills tapping 0→3 |
| 10–12 | Supplement stacks checking off ✓✓✓ |
| 12–13 | Dark mode flip (same dashboard, espresso theme) |
| 13–15 | Printable binder pages fan out → "Instant download · biohackeros" end card |

---

## 10 · Pinterest Pin Copy (2:3 pins; inspiration-intent phrasing)

**Pin 1 (GLP-1):** "The prettiest way to track a GLP-1 journey 🤍 dose log, site rotation,
refills & mood — all in one private app + printable binder. #glp1journey #wellnessplanner"

**Pin 2 (Menopause):** "Perimenopause is a lot. Your tracker shouldn't be. 20 symptoms, HRT
schedule & charts your doctor will actually want to see. #perimenopause #hrtjourney"

**Pin 3 (Biohacking):** "My entire biohacking routine lives in one place now — red light, cold
plunge, supplements, labs. Soft-life biohacking ✨ #biohackingforwomen #longevity"

**Pin 4 (Printable):** "Print it. GoodNotes it. Binder it. The wellness planner that's also a web
app. #printableplanner #goodnotesplanner"

---

## 11 · Instagram Launch Caption

> POV: your peptides, your HRT, your 14 supplements, your cold plunge era — and *zero* chaos. 🌿
>
> Meet **The Biohacker Wellness Planner**: a printable system with a bonus web app that feels like
> a luxury planner. GLP-1 & peptide tracking with a site-rotation map, a full menopause + HRT suite,
> supplement stacks with reorder reminders, labs, red light, sauna… even your dog gets a profile.
>
> No subscription. No app store. No one sees your data but you.
> Plus a matching printable binder, because we're still *us*. 🖤
>
> Link in bio → instant download on Etsy.
>
> *Organization only — not medical advice. Doses always come from your own provider.*
>
> #biohackerwoman #glp1community #perimenopausesupport #hrtjourney #supplementstack
> #redlighttherapy #coldplunge #wellnessplanner #etsyfinds #digitalplanner

---

## 12 · Pricing Strategy — honest version, not an assumption

The earlier draft of this guide anchored at "$127 compare-at → sell $97" by analogy to bundle
sellers. Look at what the informal category scan suggests before committing to that — again, this
is a directional read, not a verified study (see the note at the top of this document):

- **What sells at $2–15:** simple trackers/planners (the bulk of this category).
- **What sells at $3–20:** digital planners (GoodNotes-style).
- **What sells at $4–32:** Notion templates.
- **What sells at $47–197:** only genuine **courses** with teaching content, or mega-bundles with
  explicit "$X value" math shown to the buyer.

This product today is a tracker + printable system — closer to the first three categories than the
fourth, unless you add real educational content. Two honest, testable options:

1. **Launch low, test up.** Start at **$19–27** as your real, primary price (not a fake "was
   $127" anchor). Watch actual conversion rate for 2–4 weeks before touching the price. This is the
   lower-risk path and matches what buyers in this category are calibrated to pay.
2. **Earn a premium price with premium content.** If you want $47–97+, build the thing that
   category actually pays for: a genuine short guide/course teaching *how to use* peptide tracking,
   HRT tracking, and supplement stacking well (not medical advice — organizational and habit-
   building teaching), bundled with the planner. Don't charge course prices for tracker content.

Either way:
- Don't invent a "compare-at" price with no sales history behind it — that's a dark pattern, not a
  pricing strategy, and Etsy buyers increasingly recognize fake strikethroughs.
- A **$9–17 "printables-only lite" listing** is a reasonable low-risk traffic/review engine that
  can upsell to a fuller bundle later, once you have real conversion data to justify a higher tier.
- Simple PDF competitors sit at $2–8 — you don't have to match that, but you do have to justify the
  gap with content the buyer can see, not just a claimed anchor price.

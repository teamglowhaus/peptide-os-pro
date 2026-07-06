# Listing Videos

Two high-def MP4s (H.264, web-optimized) ready to upload to your Etsy listing.
Etsy accepts videos 5–15 seconds; both fit.

| File | What it is | Size / length | Best for |
|------|-----------|---------------|----------|
| `01-product-tour-15s.mp4` | Desktop screen tour: dashboard → log a peptide dose → tap menopause symptoms → check supplement stacks → reconstitution math → dark mode. Captioned. | 1280×720 · 14.8s | Etsy listing video (main) |
| `02-daily-ritual-mobile-12s.mp4` | Vertical phone "a day with your OS": morning check-in → morning stack → Sunday shot → evening symptoms. Time-of-day captions. | 600×1040 · 11.4s | Pinterest / Instagram Reels / Etsy 2nd video |

Both are real screen recordings of the actual app — nothing mocked or blurry.

## The "woman at a table inputting her data" video

This one needs a **live-action / AI-avatar video generator**, which can't run in an
automated session. The **HeyGen** connector is installed but needs you to authorize it
once:

1. In Claude, open your **connector settings** (or run `/mcp` in an interactive session).
2. Sign in to **HyperFrames / HeyGen** and approve access.
3. Then ask: *"generate the woman-at-a-table video using the storyboard."*

Storyboard (15s, ready to hand to HeyGen or any videographer):

> A warm, sunlit kitchen table, morning light. A woman in her 40s–50s, cozy sweater,
> coffee beside her, holding her phone. She smiles softly, taps a few times (logging her
> morning stack), sets the phone in a phone stand showing the cream-colored app. Cut to a
> close-up of the screen — the dashboard with her Biohacker Score. Text overlays fade in:
> *"Your whole wellness, finally in one place."* → *"Peptides · Hormones · Supplements."*
> → *"The Biohacker Operating System™ · GlowHausDigital."* Soft, unhurried, editorial.

Until then, `02-daily-ritual-mobile-12s.mp4` is the closest stand-in — it reads as a
woman moving through her day with the app.

## Regenerating

Videos are produced from the live app with `scratchpad/video.mjs` (Playwright recording)
and encoded to MP4 with ffmpeg. Re-run against the deployed URL anytime the UI changes.

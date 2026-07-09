# Listing Videos

Three high-def MP4s (H.264, web-optimized) ready to upload to your Etsy listing.
Etsy accepts videos 5–15 seconds; all three fit.

| File | What it is | Size / length | Best for |
|------|-----------|---------------|----------|
| `01-product-tour-15s.mp4` | Desktop screen tour: dashboard → log a peptide dose → tap menopause symptoms → check supplement stacks → reconstitution math → dark mode. Captioned. | 1280×720 · 14.8s | Etsy listing video (main) |
| `02-daily-ritual-mobile-12s.mp4` | Vertical phone "a day with your OS": morning check-in → morning stack → Sunday shot → evening symptoms. Time-of-day captions. | 600×1040 · 11.4s | Pinterest / Instagram Reels / Etsy 2nd video |
| `03-morning-glance-square-13s.mp4` | Square screen recording following the original "woman at a table" storyboard's beats (morning check-in → supplement stack → logging a dose → Biohacker Score close), captioned with the exact lines from that brief. | 1080×1080 · 12.6s | Instagram feed / Etsy 3rd video |

All three are real screen recordings of the actual app — nothing mocked or blurry.

## About the "woman at a table" shot specifically

The original brief called for live-action or an AI-avatar video of an actual person —
that's a different medium than any of the three files above, and genuinely can't be
produced from this environment: no photorealistic video generator is available here, and
this sandbox has no network access to stock-footage sites (Pexels/Pixabay are blocked by
network policy). Two ways to get the literal shot if you still want it:

1. **Film it yourself** — ~15 seconds on a phone near a window, coffee in frame, tapping
   through the app on a stand. Send the raw clip and it can be edited/captioned to match.
2. **License a stock clip** on your own device (Pexels/Pixabay are free, no attribution
   required) and send the file over.

Storyboard, if you go either route:

> A warm, sunlit kitchen table, morning light. A woman in her 40s–50s, cozy sweater,
> coffee beside her, holding her phone. She smiles softly, taps a few times (logging her
> morning stack), sets the phone in a phone stand showing the cream-colored app. Cut to a
> close-up of the screen — the dashboard with her Biohacker Score. Text overlays fade in:
> *"Your whole wellness, finally in one place."* → *"Peptides · Hormones · Supplements."*
> → *"The Biohacker Operating System · GlowHausDigital."* Soft, unhurried, editorial.

Until then, `03-morning-glance-square-13s.mp4` delivers those same beats and captions
as real app footage.

## Regenerating

All three videos are produced by the single committed pipeline `scripts/generate-videos.mjs`
via Playwright recording against a locally running preview build, then encoded to MP4 with
ffmpeg:

```
node scripts/generate-videos.mjs tour      # 01-product-tour-15s.mp4
node scripts/generate-videos.mjs ritual    # 02-daily-ritual-mobile-12s.mp4
node scripts/generate-videos.mjs morning   # 03-morning-glance-square-13s.mp4
```

Re-run whichever mode anytime the UI changes — nothing here depends on an ephemeral scratch
script anymore.

Note: the first navigation in a fresh browser context stalls ~13s in this sandbox
(likely a blocked network resource on initial load) — the `morning` mode records through it
and the encode step trims the dead lead-in with `ffmpeg -ss`, computed per run from `mark()`
timestamps rather than a hardcoded offset.

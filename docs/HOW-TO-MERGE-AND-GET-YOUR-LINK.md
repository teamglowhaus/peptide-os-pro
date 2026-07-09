# How to Merge Your Pull Request & Get Your Permanent App Link
*Written for GlowHausDigital — no coding needed. About 5 minutes.*

Right now all your work lives on a "pull request" (think of it as a **draft folder** of
changes). Merging it just means **"approve the draft and make it official."** After that,
Vercel gives you a permanent web address for your app — the one that goes in your buyer
Welcome sheet.

---

## Part 1 · Merge the pull request (makes everything official)

1. Go to **github.com** and sign in.
2. Open your repository: **teamglowhaus/peptide-os-pro**
3. Click the **"Pull requests"** tab near the top.
4. Click the newest open one for this work (check the title and date — the number changes
   every time new work is added, so don't assume it's any specific PR number).
5. Scroll to the bottom. You'll see a green-ish button. If it says **"Ready for review"**
   first, click that once (it takes it out of draft mode).
6. Click **"Merge pull request"** → then **"Confirm merge."**
7. Done 🎉 You can click **"Delete branch"** when it offers — that's just tidy-up, totally safe.

*That's the whole merge. Everything you approved is now the real version of your app.*

---

## Part 2 · Get your permanent app link

The moment you merge, Vercel builds the official version and gives it a clean address.

1. Go to **vercel.com** and sign in (the same account already connected to your repo).
2. Click the project named **peptide-os-pro**.
3. At the top you'll see **"Domains"** with an address like
   **`peptide-os-pro.vercel.app`** (yours may differ slightly).
4. That is your permanent app link. Click it to open your live app and test it on your phone.

*Tip: if you ever want a prettier address like `app.glowhausdigital.com`, Vercel's
**Settings → Domains** lets you connect a custom domain you own. Optional — the free
`.vercel.app` link works perfectly for launch.*

---

## Part 3 · Put your link in the buyer Welcome sheet

Your buyers get a Welcome PDF that tells them where to open the app. It currently has a
placeholder. Send me your permanent link and I'll drop it in and regenerate the PDF (30
seconds) — **or** do it yourself:

1. Open `docs/buyer-guide.md`
2. Find the line: `Your access link: **https://your-deployment-url.com**`
3. Replace `https://your-deployment-url.com` with your real Vercel link.
4. Tell me, and I'll rebuild the `1-Welcome-Start-Here.pdf` for you.

---

## What you'll have after this

- ✅ Your app, permanently live at your own web address
- ✅ Installable on any phone/tablet/computer ("Add to Home Screen")
- ✅ Your Welcome PDF pointing buyers to the right place
- ✅ Ready to attach the 5 delivery files + 15 thumbnails + 3 videos to your Etsy listing
  (run `node scripts/check-listing-ready.mjs` first — it checks your Welcome PDF actually
  has your real link before you upload anything)

## If anything looks scary or different

GitHub and Vercel occasionally reword their buttons. If a screen doesn't match these
steps, take a screenshot and send it to me — I'll tell you exactly what to click.

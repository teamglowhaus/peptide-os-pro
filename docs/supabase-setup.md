# Cloud Sync — Supabase Setup (optional upgrade)

The app ships in **local demo mode**: all data persists to `localStorage` through the
`SyncAdapter` interface in `src/lib/store.tsx`. Cloud accounts drop in without touching any
screen — every record is already profile-scoped and serializable.

## Architecture

```
UI pages ──▶ useStore() ──▶ SyncAdapter
                             ├── LocalAdapter (shipped, default)
                             └── SupabaseAdapter (this guide)
```

The simplest robust sync model for this app is **whole-document sync with debounce**: the entire
`Database` object is stored per-user as one JSONB row, written at most every few seconds. At this
product's data sizes (<1 MB for years of entries) this is faster, conflict-safer, and far simpler
than row-per-record sync. `supabase/schema.sql` also includes a normalized schema for teams that
later want per-record queries.

## Steps

1. Create a project at supabase.com → note the URL + anon key.
2. Run `supabase/schema.sql` in the SQL editor (creates tables + RLS policies).
3. `npm i @supabase/supabase-js`
4. Add `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. Implement the adapter (drop-in):

```ts
// src/lib/supabaseAdapter.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import type { SyncAdapter } from "./store";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export class SupabaseAdapter implements SyncAdapter {
  private cache: Database | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  async signIn(email: string) {
    // passwordless magic link keeps the boutique feel
    await supabase.auth.signInWithOtp({ email });
  }

  load(): Database | null {
    return this.cache; // hydrate() fills this before StoreProvider mounts
  }

  async hydrate(): Promise<Database | null> {
    const { data } = await supabase.from("vaults").select("doc").single();
    this.cache = (data?.doc as Database) ?? null;
    return this.cache;
  }

  save(db: Database) {
    this.cache = db;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("vaults").upsert({ user_id: user.id, doc: db, updated_at: new Date() });
    }, 2500);
  }
}
```

6. In `StoreProvider`, choose the adapter from `settings.cloud.provider` and await `hydrate()`
   before first render (splash screen recommended).

## Privacy posture

- RLS: users can only ever read/write their own vault (enforced in schema.sql).
- Keep marketing honest: local mode = "never leaves your device"; cloud mode = "encrypted in
  transit, stored under your private account, never sold or shared."
- Household/pet profiles live inside the owner's vault — one purchase, one account, whole family.

## Deploying the app itself

Any static host works: Vercel, Netlify, Cloudflare Pages. `npm run build` → deploy `dist/`.
Custom domain (e.g. `app.yourshop.com`) makes the buyer link feel premium. Update the URL in
`docs/buyer-guide.md` before exporting the Welcome PDF.

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Card, Button, Input } from "./ui";

/* A shared passphrase, not real security — it's a plain string baked into
   this public bundle, visible to anyone who opens dev tools. Its only job
   is to stop a link from being effortlessly one-click-shareable; it's not
   meant to (and can't) stop a determined person. Real per-buyer access
   control would need actual accounts, which this app deliberately doesn't
   have — see README's "Data safety" section. */
// Year-free on purpose: a "2026" code reads stale to a 2027 buyer of a
// lifetime product.
const ACCESS_CODE = "glowhausritual";
const GATE_KEY = "biohacker-os:gate";

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(GATE_KEY) === "1");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === ACCESS_CODE) {
      localStorage.setItem(GATE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <Card className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex items-center justify-center gap-3">
          <img src="/icons/icon.svg" alt="" className="h-10 w-10 rounded-xl shadow-soft" />
          <div className="text-left">
            <p className="font-display text-[1.05rem] font-medium leading-tight text-ink-strong">
              Biohacker OS
            </p>
            <p className="text-[0.68rem] uppercase tracking-[0.16em] text-ink-faint">Wellness Operating System</p>
          </div>
        </div>
        <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-champagne-200/60 text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">
          <Lock size={18} />
        </span>
        <h1 className="font-display text-xl font-medium">Enter your access code</h1>
        <p className="mt-1.5 text-[0.85rem] text-ink-soft">
          This is in your Welcome PDF — a one-time code, then this device stays unlocked.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <Input
            autoFocus
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Access code"
            className="text-center"
          />
          {error && <p className="text-[0.82rem] font-medium text-blush-500">That code didn't match — check your Welcome PDF and try again.</p>}
          <Button type="submit" className="w-full justify-center">Unlock</Button>
        </form>
      </Card>
    </div>
  );
}

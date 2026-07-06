import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Database, Profile, Settings, ID } from "./types";

/* ————————————————————————————————————————————————
   Local-first store with a pluggable sync adapter.
   Demo mode persists to localStorage on this device.
   A Supabase adapter can be dropped in without touching
   any screen — see docs/supabase-setup.md + schema.sql.
   ———————————————————————————————————————————————— */

const STORAGE_KEY = "biohacker-os:v1";

export function uid(): ID {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Whole days between an ISO date and today, or null if iso is empty/invalid. */
export function daysSince(iso: string): number | null {
  if (!iso) return null;
  const then = new Date(iso + "T00:00:00");
  if (isNaN(then.getTime())) return null;
  const now = new Date(today() + "T00:00:00");
  return Math.round((now.getTime() - then.getTime()) / 86_400_000);
}

/** Triggers a browser download of a backup JSON string as a dated file. */
export function triggerBackupDownload(json: string): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  a.download = `biohacker-os-backup-${today()}.json`;
  a.click();
}

export function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function defaultSettings(): Settings {
  return {
    theme: "system",
    activeProfileId: "",
    onboarding: {
      completed: false,
      mainGoal: "",
      peptides: true,
      glp1: false,
      hrt: true,
      menopause: true,
      supplements: true,
      redLight: false,
      coldPlunge: false,
      sauna: false,
      labs: true,
      wearables: false,
      pets: false,
      household: false,
      aesthetic: "cream",
    },
    cloud: { provider: "local", email: "", connected: false },
    calculatorAcknowledged: false,
    lastBackupAt: "",
  };
}

export function emptyDatabase(): Database {
  const selfId = uid();
  const self: Profile = { id: selfId, kind: "self", name: "Me", emoji: "🌿", createdAt: today() };
  const settings = defaultSettings();
  settings.activeProfileId = selfId;
  return {
    version: 1,
    settings,
    profiles: [self],
    pets: [],
    injectables: [],
    injectionLogs: [],
    hormones: [],
    symptomLogs: [],
    providerQuestions: [],
    supplements: [],
    supplementChecks: [],
    redLight: [],
    coldPlunge: [],
    sauna: [],
    toolSessions: [],
    dailyLogs: [],
    labs: [],
    appointments: [],
    wearables: [],
    lifestyle: [],
  };
}

/* Sync adapter interface — LocalAdapter today, SupabaseAdapter tomorrow. */
export interface SyncAdapter {
  load(): Database | null;
  save(db: Database): void;
}

class LocalAdapter implements SyncAdapter {
  load(): Database | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Database;
    } catch {
      return null;
    }
  }
  save(db: Database) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      /* storage full or private mode — data stays in memory this session */
    }
  }
}

interface StoreContextValue {
  db: Database;
  update: (fn: (draft: Database) => void) => void;
  activeProfile: Profile;
  setActiveProfile: (id: ID) => void;
  resetAll: () => void;
  exportJson: () => string;
  importJson: (raw: string) => boolean;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const adapter = useRef<SyncAdapter>(new LocalAdapter());
  const [db, setDb] = useState<Database>(() => adapter.current.load() ?? emptyDatabase());

  useEffect(() => {
    adapter.current.save(db);
  }, [db]);

  // Best-effort: ask the browser not to silently evict this origin's storage
  // (Safari/iOS in particular will clear inactive-site storage over time).
  // This does not guarantee persistence — it's a mitigation, not a promise —
  // which is why we still track lastBackupAt and nudge for manual exports.
  useEffect(() => {
    navigator.storage?.persist?.().catch(() => {});
  }, []);

  // Theme application
  useEffect(() => {
    const t = db.settings.theme;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = t === "dark" || (t === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
  }, [db.settings.theme]);

  const value = useMemo<StoreContextValue>(() => {
    const update = (fn: (draft: Database) => void) => {
      setDb((prev) => {
        const draft: Database = JSON.parse(JSON.stringify(prev));
        fn(draft);
        return draft;
      });
    };
    const activeProfile =
      db.profiles.find((p) => p.id === db.settings.activeProfileId) ?? db.profiles[0];
    return {
      db,
      update,
      activeProfile,
      setActiveProfile: (id) => update((d) => void (d.settings.activeProfileId = id)),
      resetAll: () => setDb(emptyDatabase()),
      exportJson: () => {
        // Fire-and-forget: record that a backup was taken so the data-safety
        // reminder can stay quiet. Doesn't block the synchronous return value
        // the download flow needs.
        setDb((prev) => ({ ...prev, settings: { ...prev.settings, lastBackupAt: today() } }));
        return JSON.stringify(db, null, 2);
      },
      importJson: (raw) => {
        try {
          const parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.profiles)) return false;
          setDb(parsed as Database);
          return true;
        } catch {
          return false;
        }
      },
    };
  }, [db]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/* Convenience: profile-scoped list selectors */
export function byProfile<T extends { profileId: ID }>(rows: T[], profileId: ID): T[] {
  return rows.filter((r) => r.profileId === profileId);
}

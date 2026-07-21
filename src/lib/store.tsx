import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Database, Profile, Settings, ID, PeriodLog } from "./types";

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

/** Formats a Date as a local-calendar-day ISO string (YYYY-MM-DD). */
export function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Today's date in the user's local timezone (not UTC — see localDateStr). */
export function today(): string {
  return localDateStr(new Date());
}

/** Adds `days` (may be negative) to an ISO date, returning a local-day ISO string. */
export function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return localDateStr(d);
}

/** Whole days between an ISO date and today, or null if iso is empty/invalid. */
export function daysSince(iso: string): number | null {
  if (!iso) return null;
  const then = new Date(iso + "T00:00:00");
  if (isNaN(then.getTime())) return null;
  const now = new Date(today() + "T00:00:00");
  return Math.round((now.getTime() - then.getTime()) / 86_400_000);
}

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal" | "late";
export const CYCLE_PHASE_LABEL: Record<CyclePhase, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovulation: "Ovulation window",
  luteal: "Luteal",
  late: "Running longer than usual",
};

export interface CycleInfo {
  cycleDay: number;
  phase: CyclePhase;
  /** Personal average from >=2 logged cycles, or null if using the generic 28-day default. */
  avgCycleLength: number | null;
  cyclesLogged: number;
  lastPeriodStart: string;
}

/**
 * Derives cycle day + an estimated phase from logged period start dates —
 * never a guaranteed prediction, since perimenopausal cycles are frequently
 * irregular (see docs/etsy-listing-package.md's honesty guardrails: this is
 * an organizational estimate, not a fertility or contraception tool).
 * Returns null if no period has been logged yet for this profile.
 */
export function computeCycleInfo(periods: PeriodLog[], profileId: string, onDate: string = today()): CycleInfo | null {
  const own = periods.filter((p) => p.profileId === profileId).map((p) => p.startDate).filter(Boolean).sort();
  const priorStarts = own.filter((d) => d <= onDate);
  if (!priorStarts.length) return null;
  const lastPeriodStart = priorStarts[priorStarts.length - 1];
  // daysSince() always measures against the real wall-clock date, which
  // would silently ignore a non-"today" onDate — compute the diff directly
  // from the two ISO strings instead so this function's onDate param (used
  // by tests, and any future "what phase was I in on X date" feature) works.
  const cycleDay = Math.round((new Date(onDate + "T00:00:00").getTime() - new Date(lastPeriodStart + "T00:00:00").getTime()) / 86_400_000) + 1;

  let avgCycleLength: number | null = null;
  if (own.length >= 2) {
    const recentStarts = own.slice(-7); // last up to 6 cycles
    const gaps: number[] = [];
    for (let i = 1; i < recentStarts.length; i++) {
      const prev = new Date(recentStarts[i - 1] + "T00:00:00").getTime();
      const next = new Date(recentStarts[i] + "T00:00:00").getTime();
      const gap = Math.round((next - prev) / 86_400_000);
      if (gap > 10 && gap < 90) gaps.push(gap); // discard obvious data-entry errors
    }
    if (gaps.length) avgCycleLength = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
  }
  const cycleLength = avgCycleLength ?? 28;

  const lutealLength = 14; // relatively fixed clinically regardless of total cycle length
  const ovulationDay = Math.max(cycleLength - lutealLength, 8);
  const periodLength = Math.min(5, Math.round(cycleLength * 0.18));

  let phase: CyclePhase;
  if (cycleDay > cycleLength + 5) phase = "late";
  else if (cycleDay <= periodLength) phase = "menstrual";
  else if (cycleDay >= ovulationDay - 2 && cycleDay <= ovulationDay + 1) phase = "ovulation";
  else if (cycleDay < ovulationDay - 2) phase = "follicular";
  else phase = "luteal";

  return { cycleDay, phase, avgCycleLength, cyclesLogged: own.length, lastPeriodStart };
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
    periods: [],
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

const ARRAY_KEYS = [
  "profiles", "pets", "injectables", "injectionLogs", "hormones", "symptomLogs", "periods",
  "providerQuestions", "supplements", "supplementChecks", "redLight", "coldPlunge",
  "sauna", "toolSessions", "dailyLogs", "labs", "appointments", "wearables", "lifestyle",
] as const satisfies readonly (keyof Database)[];

/**
 * Coerces an arbitrary parsed JSON value (a hand-edited backup, an older
 * export missing newer fields, a corrupt/partial file) into a valid
 * Database — every list defaults to [], settings/onboarding/cloud are
 * merged onto current defaults, and profiles always has at least one entry.
 * This is what stands between a bad Restore/localStorage read and a
 * crashed blank screen.
 */
export function normalizeDatabase(raw: unknown): Database {
  const base = emptyDatabase();
  if (!raw || typeof raw !== "object") return base;
  const src = raw as Partial<Database>;

  const db: Database = { ...base };
  db.version = typeof src.version === "number" ? src.version : base.version;
  for (const key of ARRAY_KEYS) {
    const val = src[key];
    (db[key] as unknown[]) = Array.isArray(val) ? val : [];
  }
  if (db.profiles.length === 0) db.profiles = base.profiles;

  const srcSettings: Partial<Settings> = src.settings && typeof src.settings === "object" ? src.settings : {};
  db.settings = {
    ...base.settings,
    ...srcSettings,
    onboarding: { ...base.settings.onboarding, ...srcSettings.onboarding },
    cloud: { ...base.settings.cloud, ...srcSettings.cloud },
  };
  if (!db.profiles.some((p) => p.id === db.settings.activeProfileId)) {
    db.settings.activeProfileId = db.profiles[0].id;
  }
  return db;
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
      return normalizeDatabase(JSON.parse(raw));
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
        // Stamp lastBackupAt into the exact snapshot we both persist and
        // return, so the downloaded file's own record of "last backup" is
        // never a stale, pre-update value.
        const stamped: Database = { ...db, settings: { ...db.settings, lastBackupAt: today() } };
        setDb(stamped);
        return JSON.stringify(stamped, null, 2);
      },
      importJson: (raw) => {
        try {
          const parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== "object") return false;
          setDb(normalizeDatabase(parsed));
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

import type { Database, ID } from "./types";
import { addDays, today } from "./store";

/* ————————————————————————————————————————————————
   Streaks & badges — a gentle consistency game layered on
   top of data that's already being logged. Nothing here is
   stored separately: everything is derived from the same
   dated records every page already writes, so there's no new
   migration risk and a badge, once earned, can never be lost
   by a slow week (badges key off *lifetime* bests, not the
   currently-live streak).
   ———————————————————————————————————————————————— */

export interface StreakInfo {
  current: number;
  longest: number;
  totalActiveDays: number;
  activeToday: boolean;
}

export type BadgeColor = "gold" | "ruby" | "emerald" | "sapphire" | "amethyst";

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: "sparkles" | "flame" | "award" | "medal" | "trophy" | "syringe" | "pill" | "sun";
  color: BadgeColor;
  unlocked: boolean;
  progress: { current: number; target: number };
}

/** Every calendar date (profile-scoped) with at least one real logged entry. */
function activeDates(db: Database, pid: ID): Set<string> {
  const dates = new Set<string>();
  const add = (d?: string) => { if (d) dates.add(d); };

  for (const l of db.dailyLogs) {
    if (l.profileId === pid && (l.mood || l.energy || l.sleepHours || l.notes || l.gratitude || l.wins)) add(l.date);
  }
  for (const l of db.symptomLogs) {
    if (l.profileId === pid && (Object.keys(l.symptoms).length > 0 || l.flow)) add(l.date);
  }
  for (const l of db.injectionLogs) if (l.profileId === pid) add(l.date);
  for (const c of db.supplementChecks) if (c.profileId === pid && c.taken) add(c.date);
  for (const s of db.redLight) if (s.profileId === pid) add(s.date);
  for (const s of db.coldPlunge) if (s.profileId === pid) add(s.date);
  for (const s of db.sauna) if (s.profileId === pid) add(s.date);
  for (const s of db.toolSessions) if (s.profileId === pid) add(s.date);
  for (const l of db.labs) if (l.profileId === pid) add(l.date);
  for (const p of db.periods) if (p.profileId === pid) add(p.startDate);
  for (const b of db.beautyLogs) if (b.profileId === pid && !b.skipped) add(b.date);
  for (const c of db.skincareChecks) if (c.profileId === pid) add(c.date);

  return dates;
}

export function computeStreakInfo(db: Database, pid: ID, onDate: string = today()): StreakInfo {
  const dates = activeDates(db, pid);
  const totalActiveDays = dates.size;
  const activeToday = dates.has(onDate);

  let longest = 0, run = 0, prevDate: string | null = null;
  for (const d of [...dates].sort()) {
    run = prevDate && addDays(prevDate, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prevDate = d;
  }

  // Current streak counts back from today; a day not yet logged doesn't
  // zero out yesterday's streak until tomorrow actually arrives unlogged.
  let current = 0;
  let cursor = activeToday ? onDate : addDays(onDate, -1);
  while (dates.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }

  return { current, longest, totalActiveDays, activeToday };
}

export function computeBadges(db: Database, pid: ID, onDate: string = today()): Badge[] {
  const streak = computeStreakInfo(db, pid, onDate);
  const injectionCount = db.injectionLogs.filter((l) => l.profileId === pid).length;
  const supplementTakenCount = db.supplementChecks.filter((c) => c.profileId === pid && c.taken).length;
  const recoveryCount =
    db.redLight.filter((s) => s.profileId === pid).length +
    db.coldPlunge.filter((s) => s.profileId === pid).length +
    db.sauna.filter((s) => s.profileId === pid).length +
    db.toolSessions.filter((s) => s.profileId === pid).length;
  const beautyCount =
    db.beautyLogs.filter((l) => l.profileId === pid && !l.skipped).length +
    db.skincareChecks.filter((c) => c.profileId === pid).length;

  const streakBadge = (id: string, label: string, target: number): Badge => ({
    id, label, description: `Log something ${target} days in a row`,
    icon: "flame", color: "ruby", unlocked: streak.longest >= target,
    progress: { current: Math.min(streak.longest, target), target },
  });
  const totalDaysBadge = (id: string, label: string, target: number, icon: Badge["icon"]): Badge => ({
    id, label, description: `${target} total days logged`,
    icon, color: "gold", unlocked: streak.totalActiveDays >= target,
    progress: { current: Math.min(streak.totalActiveDays, target), target },
  });

  return [
    {
      id: "first-step", label: "First Step", description: "Log your very first day",
      icon: "sparkles", color: "gold", unlocked: streak.totalActiveDays >= 1,
      progress: { current: Math.min(streak.totalActiveDays, 1), target: 1 },
    },
    streakBadge("streak-3", "3-Day Streak", 3),
    streakBadge("streak-7", "7-Day Streak", 7),
    streakBadge("streak-14", "14-Day Streak", 14),
    streakBadge("streak-30", "30-Day Streak", 30),
    streakBadge("streak-60", "60-Day Streak", 60),
    streakBadge("streak-100", "Century", 100),
    totalDaysBadge("days-10", "10 Days", 10, "award"),
    totalDaysBadge("days-50", "50 Days", 50, "medal"),
    totalDaysBadge("days-100", "100 Days", 100, "trophy"),
    {
      id: "peptide-pro", label: "Peptide Pro", description: "Log 10 peptide/injectable doses",
      icon: "syringe", color: "sapphire", unlocked: injectionCount >= 10,
      progress: { current: Math.min(injectionCount, 10), target: 10 },
    },
    {
      id: "supplement-sage", label: "Supplements", description: "Check off 25 supplement doses",
      icon: "pill", color: "emerald", unlocked: supplementTakenCount >= 25,
      progress: { current: Math.min(supplementTakenCount, 25), target: 25 },
    },
    {
      id: "recovery-ritual", label: "Recovery", description: "Log 10 red light / cold plunge / sauna / tool sessions",
      icon: "sun", color: "amethyst", unlocked: recoveryCount >= 10,
      progress: { current: Math.min(recoveryCount, 10), target: 10 },
    },
    {
      id: "glow-ritual", label: "Glow Ritual", description: "Log 10 beauty treatments or skincare check-ins",
      icon: "sparkles", color: "ruby", unlocked: beautyCount >= 10,
      progress: { current: Math.min(beautyCount, 10), target: 10 },
    },
  ];
}

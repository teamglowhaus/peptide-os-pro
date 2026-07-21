import React, { useEffect, useMemo, useState } from "react";
import {
  Syringe, Pill, Flower2, Sun, Snowflake, Flame, FlaskConical, CalendarHeart,
  PawPrint, Moon, HeartPulse, Plus,
} from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid, daysSince, triggerBackupDownload, localDateStr } from "../lib/store";
import {
  Card, Ring, Sparkline, RatingDots, Button, Modal, Field, Input, Textarea, cx, BackupBanner, Squiggle,
} from "../components/ui";
import { STACK_TIMES } from "../data/supplements";
import type { DailyLog, StackTime } from "../lib/types";
import { computeStreakInfo, computeBadges } from "../lib/achievements";
import { BadgeShelf } from "../components/BadgeShelf";
import { Streamers, StreakToast } from "../components/Streamers";

function emptyLog(profileId: string): DailyLog {
  return {
    id: uid(), profileId, date: today(), mood: 0, energy: 0, sleepHours: "",
    sleepQuality: 0, hrv: "", weight: "", steps: "", water: "", protein: "",
    glucose: "", bloodPressure: "", notes: "", gratitude: "", wins: "",
  };
}

export function Dashboard() {
  const { db, update, activeProfile, exportJson } = useStore();
  const pid = activeProfile.id;
  const date = today();
  const ob = db.settings.onboarding;
  const [apptOpen, setApptOpen] = useState(false);
  const [apptTitle, setApptTitle] = useState("");
  const [apptDate, setApptDate] = useState(date);

  const addAppointment = () => {
    if (!apptTitle.trim()) return;
    update((d) => {
      d.appointments.push({
        id: uid(), profileId: pid, date: apptDate, time: "", title: apptTitle.trim(),
        provider: "", kind: "other", notes: "", done: false,
      });
    });
    setApptTitle("");
    setApptDate(date);
    setApptOpen(false);
  };

  const log = useMemo(
    () => db.dailyLogs.find((l) => l.profileId === pid && l.date === date) ?? emptyLog(pid),
    [db.dailyLogs, pid, date]
  );

  const saveLog = (patch: Partial<DailyLog>) =>
    update((d) => {
      const existing = d.dailyLogs.find((l) => l.profileId === pid && l.date === date);
      if (existing) Object.assign(existing, patch);
      else d.dailyLogs.push({ ...emptyLog(pid), ...patch });
    });

  /* Today's protocol pieces */
  const supplements = byProfile(db.supplements, pid).filter((s) => s.active);
  const injectables = byProfile(db.injectables, pid).filter((i) => i.active);
  const hormones = byProfile(db.hormones, pid).filter((h) => h.active);
  const checksToday = db.supplementChecks.filter((c) => c.profileId === pid && c.date === date);
  const takenCount = checksToday.filter((c) => c.taken).length;
  const totalDue = supplements.reduce((n, s) => n + s.stacks.length, 0);

  const upcoming = byProfile(db.appointments, pid)
    .filter((a) => !a.done && a.date >= date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const petReminders = db.pets
    .flatMap((p) => p.appointments.map((a) => ({ pet: p.name, ...a })))
    .filter((a) => a.date >= date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  /* Biohacker Score: gentle consistency measure across the last 7 days */
  const score = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return localDateStr(d);
    });
    let earned = 0;
    let possible = 0;
    for (const day of days) {
      const dl = db.dailyLogs.find((l) => l.profileId === pid && l.date === day);
      possible += 4;
      if (dl) {
        if (dl.mood > 0) earned += 1;
        if (dl.energy > 0) earned += 1;
        if (dl.sleepHours) earned += 1;
        if (dl.notes || dl.gratitude || dl.wins) earned += 1;
      }
      const dayChecks = db.supplementChecks.filter(
        (c) => c.profileId === pid && c.date === day && c.taken
      );
      possible += 1;
      if (dayChecks.length > 0) earned += 1;
      const sessions =
        db.redLight.filter((s) => s.profileId === pid && s.date === day).length +
        db.coldPlunge.filter((s) => s.profileId === pid && s.date === day).length +
        db.sauna.filter((s) => s.profileId === pid && s.date === day).length +
        db.toolSessions.filter((s) => s.profileId === pid && s.date === day).length;
      possible += 1;
      if (sessions > 0) earned += 1;
    }
    return possible ? Math.round((earned / possible) * 100) : 0;
  }, [db, pid]);

  const streak = useMemo(() => computeStreakInfo(db, pid, date), [db, pid, date]);
  const badges = useMemo(() => computeBadges(db, pid, date), [db, pid, date]);

  // Celebrate the moment a streak grows or a new badge unlocks — but only
  // once per real change, not on every render, by remembering what's
  // already been celebrated for this profile.
  const [streamerKey, setStreamerKey] = useState(0);
  const [celebration, setCelebration] = useState<string | null>(null);
  useEffect(() => {
    const storeKey = `biohacker-os:celebrated:${pid}`;
    let prev: { streak: number; unlocked: string[] } | null = null;
    try { prev = JSON.parse(localStorage.getItem(storeKey) || "null"); } catch { prev = null; }
    const unlockedIds = badges.filter((b) => b.unlocked).map((b) => b.id);
    const freshBadge = badges.find((b) => b.unlocked && !prev?.unlocked.includes(b.id));
    const streakGrew = streak.current > (prev?.streak ?? 0);
    if (prev && (freshBadge || streakGrew)) {
      setStreamerKey((k) => k + 1);
      setCelebration(freshBadge ? `Badge earned: ${freshBadge.label}` : `${streak.current}-Day Streak!`);
    }
    localStorage.setItem(storeKey, JSON.stringify({ streak: streak.current, unlocked: unlockedIds }));
  }, [badges, streak.current, pid]);

  const trendOf = (key: "mood" | "energy" | "sleepQuality"): number[] =>
    byProfile(db.dailyLogs, pid)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14)
      .map((l) => l[key])
      .filter((v) => v > 0);

  const weightTrend = byProfile(db.dailyLogs, pid)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((l) => parseFloat(l.weight))
    .filter((v) => !isNaN(v))
    .slice(-14);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <Streamers burstKey={streamerKey} />
      <StreakToast message={celebration} />
      <BackupBanner
        daysSince={daysSince(db.settings.lastBackupAt)}
        onExport={() => triggerBackupDownload(exportJson())}
      />
      <header className="mb-8">
        <p className="eyebrow mb-1.5">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-[1.9rem] font-medium leading-tight sm:text-4xl">
          {greeting},{" "}
          <span className="relative inline-block">
            {activeProfile.name === "Me" ? "gorgeous" : activeProfile.name}
            <Squiggle className="absolute -bottom-1.5 left-0 h-2.5 w-full text-champagne-400" />
          </span>
        </h1>
        {ob.mainGoal && (
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            This season's intention:{" "}
            <span className="handnote text-wine-500 dark:text-wine-300">{ob.mainGoal.toLowerCase()}</span>
          </p>
        )}
      </header>

      {/* Score + check-in row */}
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <Card className="card-hero relative flex items-center gap-6 overflow-hidden">
          <div
            className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-gold-400/25 blur-3xl dark:bg-gold-500/15"
            aria-hidden
          />
          <Ring value={score} size={148} label="Biohacker Score" />
          <div className="max-w-[190px]">
            <p className="font-display text-lg font-medium text-ink-strong">
              {score >= 70 ? "Beautifully consistent" : score >= 35 ? "Momentum is building" : "A soft start"}
            </p>
            <p className="mt-1.5 text-[0.83rem] leading-relaxed text-ink-soft">
              A gentle measure of your last 7 days of check-ins, stacks & sessions. Consistency over
              perfection, always.
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="eyebrow">Today's check-in</p>
            <Moon size={15} className="text-ink-faint" />
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[0.85rem] font-semibold text-ink">Mood</p>
              <RatingDots value={log.mood} onChange={(v) => saveLog({ mood: v })} tone="blush" />
            </div>
            <div>
              <p className="mb-2 text-[0.85rem] font-semibold text-ink">Energy</p>
              <RatingDots value={log.energy} onChange={(v) => saveLog({ energy: v })} tone="champagne" />
            </div>
            <div>
              <p className="mb-2 text-[0.85rem] font-semibold text-ink">Sleep quality</p>
              <RatingDots value={log.sleepQuality} onChange={(v) => saveLog({ sleepQuality: v })} />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Sleep hrs">
                <Input value={log.sleepHours} onChange={(e) => saveLog({ sleepHours: e.target.value })} placeholder="7.5" inputMode="decimal" />
              </Field>
              <Field label="HRV">
                <Input value={log.hrv} onChange={(e) => saveLog({ hrv: e.target.value })} placeholder="52" inputMode="numeric" />
              </Field>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <BadgeShelf streak={streak} badges={badges} />
      </div>

      {/* Today's protocol */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium">Today's protocol</h2>
          <span className="text-[0.8rem] text-ink-faint">
            {totalDue > 0 ? `${takenCount} of ${totalDue} supplement doses checked` : "Your day, your pace"}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(ob.supplements && supplements.length > 0) && (
            <ProtocolCard
              icon={<Pill size={17} />}
              title="Supplements due"
              tone="sage"
              lines={STACK_TIMES.map((st) => {
                const due = supplements.filter((s) => s.stacks.includes(st.key as StackTime));
                if (!due.length) return null;
                const done = due.filter((s) =>
                  checksToday.some((c) => c.supplementId === s.id && c.stack === st.key && c.taken)
                ).length;
                return `${st.label}: ${done}/${due.length}`;
              }).filter(Boolean) as string[]}
              route="supplements"
            />
          )}
          {(ob.hrt || ob.menopause) && hormones.length > 0 && (
            <ProtocolCard
              icon={<Flower2 size={17} />}
              title="HRT due"
              tone="blush"
              lines={hormones.slice(0, 3).map((h) => `${h.name} · ${h.schedule || h.form}`)}
              route="hormones"
            />
          )}
          {(ob.peptides || ob.glp1) && injectables.length > 0 && (
            <ProtocolCard
              icon={<Syringe size={17} />}
              title="Injectables"
              tone="champagne"
              lines={injectables.slice(0, 3).map((i) => `${i.name} · ${i.schedule || "see plan"}`)}
              route="peptides"
            />
          )}
          {ob.redLight && <SessionQuickCard icon={<Sun size={17} />} label="Red light session" route="redlight" doneToday={db.redLight.some((s) => s.profileId === pid && s.date === date)} />}
          {ob.coldPlunge && <SessionQuickCard icon={<Snowflake size={17} />} label="Cold plunge" route="coldplunge" doneToday={db.coldPlunge.some((s) => s.profileId === pid && s.date === date)} />}
          {ob.sauna && <SessionQuickCard icon={<Flame size={17} />} label="Sauna" route="sauna" doneToday={db.sauna.some((s) => s.profileId === pid && s.date === date)} />}
        </div>
        {supplements.length === 0 && injectables.length === 0 && hormones.length === 0 && (
          <Card className="mt-1 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-medium text-ink-strong">Your protocol is a blank page</p>
              <p className="mt-1 text-[0.88rem] text-ink-soft">
                Add your first supplement, hormone therapy, or injectable and it will greet you here each morning.
              </p>
            </div>
            <div className="flex gap-2">
              <NavButton route="supplements" label="Add supplement" />
              <NavButton route="peptides" label="Add injectable" />
            </div>
          </Card>
        )}
      </section>

      {/* Trends */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <TrendCard label="Mood" points={trendOf("mood")} tone="rose" latest={log.mood ? `${log.mood}/5` : "—"} />
        <TrendCard label="Energy" points={trendOf("energy")} tone="gold" latest={log.energy ? `${log.energy}/5` : "—"} />
        <TrendCard label="Sleep quality" points={trendOf("sleepQuality")} tone="sage" latest={log.sleepQuality ? `${log.sleepQuality}/5` : "—"} />
        <TrendCard label="Weight" points={weightTrend} tone="sage" latest={log.weight || "—"} editable onEdit={(v) => saveLog({ weight: v })} />
      </section>

      {/* Reminders row */}
      <section className="mt-8 grid gap-3 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarHeart size={16} className="text-champagne-600 dark:text-champagne-300" />
              <p className="font-display text-lg font-medium">Coming up</p>
            </div>
            <button
              onClick={() => setApptOpen(true)}
              className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-champagne-600"
              aria-label="Add appointment"
            >
              <Plus size={16} />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-[0.88rem] text-ink-soft">
              No appointments on the books. Add a provider visit, lab draw, or refill date with the + above.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 text-[0.9rem]">
                  <button
                    onClick={() => update((d) => {
                      const row = d.appointments.find((x) => x.id === a.id);
                      if (row) row.done = true;
                    })}
                    className="text-left font-medium text-ink hover:text-champagne-600"
                    title="Mark as done"
                  >
                    {a.title}
                  </button>
                  <span className="shrink-0 text-ink-faint">{fmtDate(a.date)}</span>
                </li>
              ))}
            </ul>
          )}
          <Modal open={apptOpen} onClose={() => setApptOpen(false)} title="Add an appointment">
            <div className="space-y-3">
              <Field label="What's this for?">
                <Input value={apptTitle} onChange={(e) => setApptTitle(e.target.value)} placeholder="Endocrinologist follow-up" />
              </Field>
              <Field label="Date">
                <Input type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)} />
              </Field>
              <Button onClick={addAppointment} className="w-full justify-center">Add to Coming up</Button>
            </div>
          </Modal>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <PawPrint size={16} className="text-sage-500 dark:text-sage-300" />
            <p className="font-display text-lg font-medium">Little loves</p>
          </div>
          {db.pets.length === 0 ? (
            <p className="text-[0.88rem] text-ink-soft">
              {ob.pets
                ? "Add your pets and their vet visits & supplements will show up here."
                : "Pet profiles are switched off — flip them on in Settings anytime."}
            </p>
          ) : petReminders.length === 0 ? (
            <p className="text-[0.88rem] text-ink-soft">
              {db.pets.map((p) => p.name).join(" & ")} — no upcoming vet dates. 🐾
            </p>
          ) : (
            <ul className="space-y-2.5">
              {petReminders.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 text-[0.9rem]">
                  <span className="font-medium text-ink">{r.pet}: {r.reason}</span>
                  <span className="shrink-0 text-ink-faint">{fmtDate(r.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* Evening journal */}
      <section className="mt-8">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <HeartPulse size={16} className="text-blush-400" />
            <p className="font-display text-lg font-medium">Tonight's soft landing</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Gratitude">
              <Textarea rows={2} value={log.gratitude} onChange={(e) => saveLog({ gratitude: e.target.value })} placeholder="Three small good things…" />
            </Field>
            <Field label="Today's win">
              <Textarea rows={2} value={log.wins} onChange={(e) => saveLog({ wins: e.target.value })} placeholder="One thing you did for future-you…" />
            </Field>
          </div>
        </Card>
      </section>
    </div>
  );
}

function NavButton({ route, label }: { route: string; label: string }) {
  return (
    <Button variant="outline" onClick={() => (window.location.hash = `/${route}`)}>
      <Plus size={15} /> {label}
    </Button>
  );
}

function ProtocolCard({
  icon, title, lines, route, tone,
}: {
  icon: React.ReactNode; title: string; lines: string[]; route: string;
  tone: "sage" | "blush" | "champagne";
}) {
  const tones = {
    sage: "bg-sage-100 text-sage-600 dark:bg-sage-600/25 dark:text-sage-300",
    blush: "bg-blush-100 text-blush-500 dark:bg-blush-500/25 dark:text-blush-200",
    champagne: "bg-champagne-200/60 text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200",
  };
  return (
    <button onClick={() => (window.location.hash = `/${route}`)} className="group card card-hover p-5 text-left">
      <span className={cx("mb-3 inline-flex h-9 w-9 -rotate-6 items-center justify-center rounded-xl transition-transform group-hover:rotate-0", tones[tone])}>
        {icon}
      </span>
      <p className="font-semibold text-ink-strong">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {lines.map((l, i) => (
          <li key={i} className="text-[0.83rem] text-ink-soft">{l}</li>
        ))}
      </ul>
    </button>
  );
}

function SessionQuickCard({
  icon, label, route, doneToday,
}: {
  icon: React.ReactNode; label: string; route: string; doneToday: boolean;
}) {
  return (
    <button onClick={() => (window.location.hash = `/${route}`)} className="group card card-hover flex items-center gap-4 p-5 text-left">
      <span className={cx(
        "flex h-9 w-9 -rotate-6 items-center justify-center rounded-xl transition-transform group-hover:rotate-0",
        doneToday ? "bg-sage-400 text-white" : "bg-sunken text-ink-faint"
      )}>
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-ink-strong">{label}</span>
        <span className="block text-[0.8rem] text-ink-soft">{doneToday ? "Logged today ✓" : "Not yet today"}</span>
      </span>
    </button>
  );
}

function TrendCard({
  label, points, tone, latest, editable, onEdit,
}: {
  label: string; points: number[]; tone: "sage" | "gold" | "rose"; latest: string;
  editable?: boolean; onEdit?: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between">
        <p className="eyebrow">{label}</p>
        {editable && !editing ? (
          <button onClick={() => setEditing(true)} className="font-display text-xl font-medium text-ink-strong underline decoration-dotted decoration-line-strong underline-offset-4">
            {latest}
          </button>
        ) : editable && editing ? (
          <input
            autoFocus
            defaultValue={latest === "—" ? "" : latest}
            onBlur={(e) => { onEdit?.(e.target.value); setEditing(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            className="w-20 rounded-lg border border-line bg-raised px-2 py-0.5 text-right font-display text-lg"
          />
        ) : (
          <p className="font-display text-xl font-medium text-ink-strong">{latest}</p>
        )}
      </div>
      <div className="mt-2">
        <Sparkline points={points} tone={tone} />
      </div>
    </Card>
  );
}

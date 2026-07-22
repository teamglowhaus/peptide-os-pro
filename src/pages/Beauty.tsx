import React, { useMemo, useState } from "react";
import {
  Gem, Plus, Trash2, Pencil, Sparkles, Sunrise, Moon, ArrowUp, ArrowDown, Check,
  CalendarClock, SkipForward, ArrowLeftRight, ListOrdered,
} from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid, addDays, daysSince } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, Chip, Tabs,
  EmptyState, Stat, Disclaimer, cx, useForm,
} from "../components/ui";
import { BEAUTY_LIBRARY } from "../data/beauty";
import type { BeautyTreatment, BeautyLog, SkincareStep, SkincareCheck, Database } from "../lib/types";

function blankTreatment(profileId: string): BeautyTreatment {
  return {
    id: uid(), profileId, name: "", kind: "office", product: "", provider: "",
    intervalDays: null, aftercare: "", notes: "", active: true, createdAt: today(),
  };
}

/** Next due date for a treatment: last log (done OR skipped) + interval.
 *  Skipping deliberately pushes the schedule instead of nagging forever. */
export function nextDueDate(t: BeautyTreatment, logs: BeautyLog[]): string | null {
  if (!t.intervalDays) return null;
  const own = logs.filter((l) => l.treatmentId === t.id).map((l) => l.date).sort();
  if (!own.length) return null;
  return addDays(own[own.length - 1], t.intervalDays);
}

/** Days until due — negative = overdue. */
function daysUntil(iso: string): number {
  return -(daysSince(iso) ?? 0);
}

export function Beauty() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [tab, setTab] = useState("treatments");
  const [editing, setEditing] = useState<BeautyTreatment | null>(null);
  const [logFor, setLogFor] = useState<BeautyTreatment | null>(null);

  const treatments = byProfile(db.beautyTreatments, pid).filter((t) => t.active);
  const logs = byProfile(db.beautyLogs, pid);

  const due = useMemo(
    () =>
      treatments
        .map((t) => ({ t, dueDate: nextDueDate(t, logs) }))
        .filter((x): x is { t: BeautyTreatment; dueDate: string } => x.dueDate != null && daysUntil(x.dueDate) <= 3)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [treatments, logs]
  );

  const skipTreatment = (t: BeautyTreatment) =>
    update((d) =>
      void d.beautyLogs.push({ id: uid(), profileId: pid, treatmentId: t.id, date: today(), skipped: true, reaction: "", notes: "Skipped — schedule pushed forward" })
    );

  return (
    <div>
      <PageHeader
        eyebrow="Body lab"
        title="Beauty Studio"
        sub="Peels, needles, masks, and the fifteen-step ritual only you understand — every treatment remembered, every reaction on record."
        actions={
          <Button onClick={() => setEditing(blankTreatment(pid))}>
            <Plus size={16} /> Add treatment
          </Button>
        }
      />

      {/* Due reminders — the "your peel is coming up" moment, with a real choice. */}
      {due.length > 0 && (
        <div className="mb-6 space-y-2">
          {due.map(({ t, dueDate }) => {
            const d = daysUntil(dueDate);
            return (
              <div key={t.id} className="ink-xl card-hero flex flex-wrap items-center justify-between gap-3 border-2 border-champagne-300/70 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-xl bg-blush-100 text-blush-500 dark:bg-blush-500/25 dark:text-blush-200">
                    <CalendarClock size={17} />
                  </span>
                  <div>
                    <p className="font-semibold text-ink-strong">{t.name}</p>
                    <p className="text-[0.8rem] text-ink-soft">
                      {d < 0 ? `was due ${fmtDate(dueDate)}` : d === 0 ? "due today" : `due ${fmtDate(dueDate)}`}
                      {t.intervalDays ? ` · your every-${humanInterval(t.intervalDays)} ritual` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="soft" onClick={() => setLogFor(t)}><Check size={15} /> Log it</Button>
                  <Button variant="ghost" onClick={() => skipTreatment(t)} title="Skips this round and moves the next reminder forward">
                    <SkipForward size={15} /> Skip
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Tabs
        tabs={[
          { key: "treatments", label: `My treatments (${treatments.length})` },
          { key: "skincare", label: "Daily skincare" },
          { key: "log", label: "History" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "treatments" && (
        treatments.length === 0 ? (
          <EmptyState
            icon={<Gem size={26} />}
            title="No treatments yet"
            body="Chemical peels, microneedling, LED masks, gua sha — add each in-office or at-home treatment you do, set the repeat your provider or label recommends, and the Studio will remember your schedule for you."
            action={<Button variant="soft" onClick={() => setEditing(blankTreatment(pid))}>Add my first treatment</Button>}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {treatments.map((t) => (
              <TreatmentCard
                key={t.id}
                t={t}
                logs={logs}
                onEdit={() => setEditing(t)}
                onLog={() => setLogFor(t)}
              />
            ))}
          </div>
        )
      )}

      {tab === "skincare" && <SkincareRoutines />}
      {tab === "log" && <TreatmentHistory treatments={db.beautyTreatments} />}

      {editing && (
        <TreatmentEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(t) => {
            update((d) => {
              const i = d.beautyTreatments.findIndex((x) => x.id === t.id);
              if (i >= 0) d.beautyTreatments[i] = t;
              else d.beautyTreatments.push(t);
            });
            setEditing(null);
            setTab("treatments");
          }}
        />
      )}
      {logFor && <LogTreatmentModal treatment={logFor} onClose={() => setLogFor(null)} />}

      <Disclaimer>
        The Studio organizes your own treatments and routines — it never suggests treatment
        intervals, peel strengths, needle depths, or products. Every schedule here is the one
        <em> you</em> set from your provider's, esthetician's, or product label's instructions.
        Patch-test new actives, and bring reactions to a professional you trust.
      </Disclaimer>
    </div>
  );
}

function humanInterval(days: number): string {
  if (days % 7 === 0) {
    const w = days / 7;
    return w === 1 ? "week" : `${w}-week`;
  }
  return days === 1 ? "day" : `${days}-day`;
}

/** "6 weeks" / "1 week" / "10 days" — for prose like "every 6 weeks". */
function plainInterval(days: number): string {
  if (days % 7 === 0) {
    const w = days / 7;
    return w === 1 ? "week" : `${w} weeks`;
  }
  return days === 1 ? "day" : `${days} days`;
}

function TreatmentCard({
  t, logs, onEdit, onLog,
}: { t: BeautyTreatment; logs: BeautyLog[]; onEdit: () => void; onLog: () => void }) {
  const { update } = useStore();
  const own = logs.filter((l) => l.treatmentId === t.id && !l.skipped).sort((a, b) => b.date.localeCompare(a.date));
  const last = own[0];
  const dueDate = nextDueDate(t, logs);
  const d = dueDate ? daysUntil(dueDate) : null;
  return (
    <Card hover className="group flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-xl bg-blush-100 text-blush-500 transition-transform group-hover:rotate-0 dark:bg-blush-500/25 dark:text-blush-200">
            <Gem size={17} />
          </span>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-blush-500 dark:text-blush-300">
              {t.kind === "office" ? "In office" : "At home"}
            </p>
            <h3 className="font-display text-xl font-medium text-ink-strong">{t.name}</h3>
            {t.product && <p className="mt-0.5 text-[0.83rem] text-ink-soft">{t.product}</p>}
          </div>
        </div>
        <div className="flex shrink-0">
          <button onClick={onEdit} aria-label="Edit" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-ink"><Pencil size={15} /></button>
          <button
            onClick={() => update((db) => { const x = db.beautyTreatments.find((y) => y.id === t.id); if (x) x.active = false; })}
            aria-label="Archive" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
          ><Trash2 size={15} /></button>
        </div>
      </div>
      <dl className="mt-3 space-y-1.5 text-[0.85rem]">
        {t.intervalDays && (
          <li className="list-none"><span className="text-ink-faint">Repeats: </span><span className="text-ink">every {plainInterval(t.intervalDays)}</span></li>
        )}
        {last && <li className="list-none"><span className="text-ink-faint">Last done: </span><span className="text-ink">{fmtDate(last.date)}</span></li>}
        {dueDate && (
          <li className="list-none">
            <span className="text-ink-faint">Next: </span>
            <span className={cx(d != null && d <= 0 ? "font-semibold text-blush-500 dark:text-blush-300" : "text-ink")}>
              {fmtDate(dueDate)}{d != null && d < 0 ? " · overdue" : d === 0 ? " · today" : ""}
            </span>
          </li>
        )}
        {t.provider && <li className="list-none"><span className="text-ink-faint">Provider: </span><span className="text-ink">{t.provider}</span></li>}
      </dl>
      <div className="mt-4 border-t border-line pt-3.5">
        <Button variant="soft" onClick={onLog}><Sparkles size={15} /> Log session</Button>
      </div>
    </Card>
  );
}

function TreatmentEditor({
  initial, onSave, onClose,
}: { initial: BeautyTreatment; onSave: (t: BeautyTreatment) => void; onClose: () => void }) {
  const { form, set, setForm } = useForm(initial);
  const [showLibrary, setShowLibrary] = useState(!initial.name);
  const [libFilter, setLibFilter] = useState<"all" | "office" | "home">("all");
  const [intervalCount, setIntervalCount] = useState(() =>
    initial.intervalDays ? (initial.intervalDays % 7 === 0 ? initial.intervalDays / 7 : initial.intervalDays) : ""
  );
  const [intervalUnit, setIntervalUnit] = useState<"weeks" | "days">(() =>
    initial.intervalDays && initial.intervalDays % 7 !== 0 ? "days" : "weeks"
  );

  const applyInterval = (t: BeautyTreatment): BeautyTreatment => {
    const n = Number(intervalCount);
    return { ...t, intervalDays: n > 0 ? Math.round(n * (intervalUnit === "weeks" ? 7 : 1)) : null };
  };

  const entries = BEAUTY_LIBRARY.filter((e) => libFilter === "all" || e.kind === libFilter);

  return (
    <Modal open onClose={onClose} title={initial.name || "Add a treatment"} wide>
      {showLibrary && (
        <div className="mb-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            <Chip active={libFilter === "all"} onClick={() => setLibFilter("all")}>All</Chip>
            <Chip active={libFilter === "office"} onClick={() => setLibFilter("office")}>In office</Chip>
            <Chip active={libFilter === "home"} onClick={() => setLibFilter("home")}>At home</Chip>
          </div>
          <div className="grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {entries.map((e) => (
              <button
                key={e.name}
                onClick={() => { setForm({ ...form, name: e.name, kind: e.kind }); setShowLibrary(false); }}
                className="input-ink border border-line bg-raised p-3 text-left transition-all hover:border-champagne-400 hover:shadow-[0_0_14px_rgb(201_169_106/0.2)]"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-blush-500 dark:text-blush-300">
                  {e.kind === "office" ? "In office" : "At home"}
                </p>
                <p className="font-semibold text-ink-strong">{e.name}</p>
                <p className="mt-0.5 text-[0.75rem] text-ink-faint">{e.hint}</p>
              </button>
            ))}
            <button
              onClick={() => setShowLibrary(false)}
              className="input-ink flex flex-col items-center justify-center border border-dashed border-line-strong p-3 text-center hover:border-champagne-400"
            >
              <Plus size={17} className="mb-1 text-ink-faint" />
              <p className="text-[0.85rem] font-medium text-ink-soft">Custom treatment</p>
            </button>
          </div>
        </div>
      )}

      {!showLibrary && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Treatment name" className="sm:col-span-2">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Chemical peel" />
            </Field>
            <Field label="Where">
              <Select value={form.kind} onChange={(e) => set("kind", e.target.value as "office" | "home")}>
                <option value="office">In office / professional</option>
                <option value="home">At home</option>
              </Select>
            </Field>
            <Field label="Product / strength" hint="Exactly as your label or provider states it.">
              <Input value={form.product} onChange={(e) => set("product", e.target.value)} placeholder="e.g. 30% glycolic · 0.5mm roller" />
            </Field>
            <Field label={form.kind === "office" ? "Provider / studio" : "Brand / device"}>
              <Input value={form.provider} onChange={(e) => set("provider", e.target.value)} placeholder={form.kind === "office" ? "Who does this for you" : "e.g. The Ordinary · NuFACE"} />
            </Field>
            <Field label="Repeat every…" hint="The cadence your provider or product label gave you — leave blank for no schedule.">
              <div className="flex gap-2">
                <Input
                  value={String(intervalCount)}
                  onChange={(e) => setIntervalCount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="6"
                  inputMode="numeric"
                  className="w-20"
                />
                <Select value={intervalUnit} onChange={(e) => setIntervalUnit(e.target.value as "weeks" | "days")}>
                  <option value="weeks">weeks</option>
                  <option value="days">days</option>
                </Select>
              </div>
            </Field>
            <Field label="Aftercare notes" className="sm:col-span-2" hint="What your provider or label says to do (and avoid) afterwards.">
              <Textarea rows={2} value={form.aftercare} onChange={(e) => set("aftercare", e.target.value)} placeholder="e.g. SPF religiously · no actives for 72h" />
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </Field>
          </div>
          <div className="mt-6 flex justify-between gap-2">
            <Button variant="ghost" onClick={() => setShowLibrary(true)}>← Library</Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={() => form.name.trim() && onSave(applyInterval(form))} disabled={!form.name.trim()}>
                Save treatment
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

function LogTreatmentModal({ treatment, onClose }: { treatment: BeautyTreatment; onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const { form, set } = useForm<BeautyLog>({
    id: uid(), profileId: activeProfile.id, treatmentId: treatment.id,
    date: today(), skipped: false, reaction: "", notes: "",
  });
  return (
    <Modal open onClose={onClose} title={`Log ${treatment.name}`}>
      <div className="space-y-4">
        <Field label="Date">
          <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        </Field>
        <Field label="How did skin react?" hint="Redness, purging, glow, nothing — the detail your future self will want.">
          <Input value={form.reaction} onChange={(e) => set("reaction", e.target.value)} placeholder="e.g. pink for 2 hours, calm by evening" />
        </Field>
        <Field label="Notes">
          <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Settings, products used, anything worth remembering" />
        </Field>
        {treatment.aftercare && (
          <p className="ink-xl bg-sunken/70 px-4 py-3 text-[0.8rem] leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">Your aftercare note:</span> {treatment.aftercare}
          </p>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { update((d) => void d.beautyLogs.push(form)); onClose(); }}>Save session</Button>
      </div>
    </Modal>
  );
}

function TreatmentHistory({ treatments }: { treatments: BeautyTreatment[] }) {
  const { db, update, activeProfile } = useStore();
  const logs = byProfile(db.beautyLogs, activeProfile.id).sort((a, b) => b.date.localeCompare(a.date));
  if (logs.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles size={26} />}
        title="No sessions logged yet"
        body="Every treatment you log builds the story of your skin — what you did, when, and how it reacted. Tap “Log session” on any treatment."
      />
    );
  }
  return (
    <div className="space-y-2">
      {logs.map((l) => {
        const t = treatments.find((x) => x.id === l.treatmentId);
        return (
          <Card key={l.id} className="flex items-center justify-between gap-4 !py-3.5">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink-strong">
                {t?.name ?? "Treatment"}
                {l.skipped && <span className="ml-2 rounded-full bg-sunken px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-faint">skipped</span>}
              </p>
              <p className="text-[0.78rem] text-ink-faint">
                {fmtDate(l.date)} {l.reaction && `· ${l.reaction}`} {l.notes && !l.skipped && `· ${l.notes}`}
              </p>
            </div>
            <button
              onClick={() => update((d) => void (d.beautyLogs = d.beautyLogs.filter((x) => x.id !== l.id)))}
              aria-label="Delete entry"
              className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
            >
              <Trash2 size={15} />
            </button>
          </Card>
        );
      })}
    </div>
  );
}

/* —— Daily skincare: ordered AM/PM product layers with per-step checks ——
   AM ends in SPF ("protect"), PM ends in actives/occlusives ("repair") —
   the thinnest-to-thickest layering convention dermatology guides teach.
   The app never dictates that order; it just makes the user's own order
   effortless to read: numbered steps, per-day scheduling (retinol M·W·F),
   one-night swaps, and a dated history of every change. */

const DAY_LABELS = ["Su", "M", "Tu", "W", "Th", "F", "Sa"] as const;

function dayOfWeek(iso: string): number {
  return new Date(iso + "T12:00:00").getDay();
}

/** Does this step apply on the given date? No days set = every day. */
function appliesOn(s: SkincareStep, iso: string): boolean {
  return !s.days?.length || s.days.includes(dayOfWeek(iso));
}

/** "M · W · F" — null when the step is daily (or all 7 days picked). */
function daysLabel(days?: number[]): string | null {
  if (!days?.length || days.length === 7) return null;
  return [...days].sort((a, b) => a - b).map((d) => DAY_LABELS[d]).join(" · ");
}

/** Drop a day's check record once it holds nothing worth keeping. */
function pruneCheck(d: Database, c: SkincareCheck) {
  if (!c.doneStepIds?.length && !c.issues && !c.swaps?.length) {
    d.skincareChecks = d.skincareChecks.filter((x) => x.id !== c.id);
  }
}

function SkincareRoutines() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <RoutineCard routine="am" />
        <RoutineCard routine="pm" />
      </div>
      <RoutineHistory />
    </div>
  );
}

function RoutineCard({ routine }: { routine: "am" | "pm" }) {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const date = today();
  const [editingStep, setEditingStep] = useState<SkincareStep | null>(null);
  const [swapping, setSwapping] = useState<SkincareStep | null>(null);
  const [setup, setSetup] = useState(false);

  const steps = byProfile(db.skincareSteps, pid)
    .filter((s) => s.routine === routine && s.active)
    .sort((a, b) => a.order - b.order);
  const todayIds = steps.filter((s) => appliesOn(s, date)).map((s) => s.id);
  const check = db.skincareChecks.find((c) => c.profileId === pid && c.date === date && c.routine === routine);
  // Pre-upgrade records have no doneStepIds — "Done today" meant the whole routine.
  const doneIds = check ? (check.doneStepIds ?? todayIds) : [];
  const doneCount = todayIds.filter((id) => doneIds.includes(id)).length;
  const allDone = todayIds.length > 0 && doneCount === todayIds.length;

  const withCheck = (fn: (c: SkincareCheck) => void) =>
    update((d) => {
      let c = d.skincareChecks.find((x) => x.profileId === pid && x.date === date && x.routine === routine);
      if (!c) {
        c = { id: uid(), profileId: pid, date, routine, issues: "", doneStepIds: [] };
        d.skincareChecks.push(c);
      }
      if (!c.doneStepIds) c.doneStepIds = [...todayIds];
      fn(c);
      pruneCheck(d, c);
    });

  const toggleStep = (id: string) =>
    withCheck((c) => {
      c.doneStepIds = c.doneStepIds!.includes(id) ? c.doneStepIds!.filter((x) => x !== id) : [...c.doneStepIds!, id];
    });

  const toggleAll = () => withCheck((c) => { c.doneStepIds = allDone ? [] : [...todayIds]; });

  const setIssues = (issues: string) => withCheck((c) => { c.issues = issues; });

  const move = (id: string, dir: -1 | 1) =>
    update((d) => {
      const own = d.skincareSteps.filter((s) => s.profileId === pid && s.routine === routine && s.active).sort((a, b) => a.order - b.order);
      const i = own.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= own.length) return;
      const a = own[i].order; own[i].order = own[j].order; own[j].order = a;
    });

  const removeStep = (s: SkincareStep) =>
    update((d) => {
      const x = d.skincareSteps.find((y) => y.id === s.id);
      if (x) x.active = false;
      d.skincareEvents.push({ id: uid(), profileId: pid, date, routine, text: `Removed ${s.product}` });
    });

  const label = routine === "am" ? "Morning" : "Evening";

  return (
    <Card>
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2.5 font-display text-lg font-medium">
          <span className="flex h-8 w-8 -rotate-6 items-center justify-center rounded-xl bg-champagne-200/60 text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">
            {routine === "am" ? <Sunrise size={16} /> : <Moon size={16} />}
          </span>
          {label}
          <span className="handnote mt-0.5 text-[0.82rem] font-normal text-ink-faint">
            {routine === "am" ? "protect" : "repair"}
          </span>
        </p>
        {todayIds.length > 0 && (
          <button
            onClick={toggleAll}
            className={cx(
              "btn-ink flex items-center gap-1.5 border-2 px-3 py-1.5 text-[0.8rem] font-semibold transition-all",
              allDone
                ? "border-sage-500 bg-sage-400 text-white"
                : "border-line-strong text-ink-soft hover:border-sage-400 hover:bg-sage-100/50 dark:hover:bg-sage-600/20"
            )}
          >
            <Check size={13} strokeWidth={3} />
            {allDone ? "Done today" : doneCount > 0 ? `${doneCount} of ${todayIds.length}` : "Check all"}
          </button>
        )}
      </div>
      {steps.length > 0 && (
        <p className="mb-3 text-[0.75rem] text-ink-faint">
          {todayIds.length === steps.length
            ? `${steps.length} step${steps.length === 1 ? "" : "s"}, in the order they go on`
            : `${todayIds.length} of ${steps.length} steps tonight’s date calls for`}
        </p>
      )}

      {steps.length === 0 && (
        <div className="py-2">
          <p className="handnote mb-3 text-[0.85rem] text-ink-faint">
            Have your {label.toLowerCase()} program mapped out? Enter every product in the order
            it goes on — then check them off as you go, night after night.
          </p>
          <Button variant="soft" onClick={() => setSetup(true)}>
            <ListOrdered size={15} /> Set up my {label.toLowerCase()} routine
          </Button>
        </div>
      )}

      <ol className="space-y-1.5">
        {steps.map((s, i) => {
          const isToday = appliesOn(s, date);
          const done = isToday && doneIds.includes(s.id);
          const swap = check?.swaps?.find((w) => w.stepId === s.id);
          const pill = daysLabel(s.days);
          return (
            <li
              key={s.id}
              className={cx(
                "input-ink group/step flex items-center gap-2.5 border border-line bg-raised px-3 py-2 transition-opacity",
                !isToday && "opacity-55"
              )}
            >
              <span className={cx(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold",
                done
                  ? "bg-sage-400 text-white"
                  : "bg-champagne-200/60 text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200"
              )}>
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cx("block truncate text-[0.9rem] font-medium", done ? "text-ink-faint line-through decoration-sage-400/70" : "text-ink")}>
                  {swap ? swap.product : s.product}
                </span>
                <span className="block truncate text-[0.75rem] text-ink-faint">
                  {swap
                    ? <>tonight only · usually {s.product}</>
                    : isToday
                      ? <>
                          {s.amount}
                          {pill && <span className={cx("font-semibold text-champagne-600 dark:text-champagne-300", s.amount && "ml-1.5")}>{pill}</span>}
                        </>
                      : <>
                          <span className="italic">not today</span>
                          {pill && <span className="ml-1.5 font-semibold text-champagne-600 dark:text-champagne-300">{pill}</span>}
                        </>}
                </span>
              </span>
              <span className="flex shrink-0 opacity-0 transition-opacity group-hover/step:opacity-100 focus-within:opacity-100">
                <button onClick={() => setSwapping(s)} aria-label="Swap product" title="Swap this product — for today or for good" className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-ink"><ArrowLeftRight size={14} /></button>
                <button onClick={() => setEditingStep(s)} aria-label="Edit step" className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-ink"><Pencil size={14} /></button>
                <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="Move up" className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-ink disabled:opacity-30"><ArrowUp size={14} /></button>
                <button onClick={() => move(s.id, 1)} disabled={i === steps.length - 1} aria-label="Move down" className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-ink disabled:opacity-30"><ArrowDown size={14} /></button>
                <button onClick={() => removeStep(s)} aria-label="Remove step" className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-blush-500"><Trash2 size={14} /></button>
              </span>
              {isToday ? (
                <button
                  onClick={() => toggleStep(s.id)}
                  aria-label={done ? `Uncheck ${s.product}` : `Check off ${s.product}`}
                  className={cx(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    done
                      ? "border-sage-500 bg-sage-400 text-white"
                      : "border-line-strong text-transparent hover:border-sage-400 hover:text-sage-400"
                  )}
                >
                  <Check size={14} strokeWidth={3.5} />
                </button>
              ) : (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center text-ink-faint/50" title={`Scheduled ${pill ?? ""}`}>—</span>
              )}
            </li>
          );
        })}
      </ol>

      {steps.length > 0 && (
        <button
          onClick={() => setEditingStep({ id: "", profileId: pid, routine, order: 0, product: "", amount: "", notes: "", active: true })}
          className="mt-3 flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.82rem] font-semibold text-champagne-600 hover:bg-sunken dark:text-champagne-300"
        >
          <Plus size={14} /> Add a step
        </button>
      )}

      {steps.length > 0 && (
        <Field label="Any issues today?" className="mt-4" hint="Redness, stinging, breakouts — patterns show up when you write them down.">
          <Input value={check?.issues ?? ""} onChange={(e) => setIssues(e.target.value)} placeholder="e.g. slight sting after the acid — skipped retinol" />
        </Field>
      )}

      {editingStep && <StepEditor routine={routine} initial={editingStep} onClose={() => setEditingStep(null)} />}
      {swapping && <SwapModal step={swapping} onClose={() => setSwapping(null)} />}
      {setup && <RoutineSetupModal routine={routine} onClose={() => setSetup(false)} />}
    </Card>
  );
}

/** Add or edit one step — product, amount, and which days it applies. */
function StepEditor({ routine, initial, onClose }: { routine: "am" | "pm"; initial: SkincareStep; onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const isNew = !initial.id;
  const [product, setProduct] = useState(initial.product);
  const [amount, setAmount] = useState(initial.amount);
  const [days, setDays] = useState<number[]>(initial.days ?? []);

  const toggleDay = (d: number) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)));

  const save = () => {
    const p = product.trim();
    if (!p) return;
    const normDays = days.length === 7 ? [] : days;
    update((d) => {
      if (isNew) {
        const max = Math.max(-1, ...d.skincareSteps.filter((s) => s.profileId === pid && s.routine === routine).map((s) => s.order));
        d.skincareSteps.push({ id: uid(), profileId: pid, routine, order: max + 1, product: p, amount: amount.trim(), notes: "", active: true, days: normDays });
        d.skincareEvents.push({ id: uid(), profileId: pid, date: today(), routine, text: `Added ${p}${daysLabel(normDays) ? ` · ${daysLabel(normDays)}` : ""}` });
      } else {
        const s = d.skincareSteps.find((x) => x.id === initial.id);
        if (!s) return;
        if (s.product !== p) d.skincareEvents.push({ id: uid(), profileId: pid, date: today(), routine, text: `Swapped ${s.product} → ${p}` });
        else if (daysLabel(s.days) !== daysLabel(normDays))
          d.skincareEvents.push({ id: uid(), profileId: pid, date: today(), routine, text: `${p} now ${daysLabel(normDays) ?? "every day"}` });
        s.product = p; s.amount = amount.trim(); s.days = normDays;
      }
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={isNew ? "Add a step" : `Edit ${initial.product}`}>
      <div className="space-y-4">
        <Field label="Product">
          <Input autoFocus value={product} onChange={(e) => setProduct(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} placeholder="e.g. Vitamin C serum" />
        </Field>
        <Field label="Amount" hint="How much goes on — 2 pumps · pea-size · 3 drops.">
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} placeholder="e.g. pea-size" />
        </Field>
        <Field label="Which days?" hint="Leave all unpicked for every day — or pick days for actives you rotate, like retinol on Mon · Wed · Fri.">
          <div className="flex flex-wrap gap-1.5">
            {DAY_LABELS.map((l, i) => (
              <Chip key={i} active={days.includes(i)} onClick={() => toggleDay(i)}>{l}</Chip>
            ))}
          </div>
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={!product.trim()}>{isNew ? "Add step" : "Save"}</Button>
      </div>
    </Modal>
  );
}

/** Swap a product out — for just today, or from now on. Both are dated. */
function SwapModal({ step, onClose }: { step: SkincareStep; onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const date = today();
  const [product, setProduct] = useState("");

  const swapToday = () => {
    const p = product.trim();
    if (!p) return;
    update((d) => {
      let c = d.skincareChecks.find((x) => x.profileId === pid && x.date === date && x.routine === step.routine);
      if (!c) {
        c = { id: uid(), profileId: pid, date, routine: step.routine, issues: "", doneStepIds: [] };
        d.skincareChecks.push(c);
      }
      c.swaps = [...(c.swaps ?? []).filter((w) => w.stepId !== step.id), { stepId: step.id, product: p }];
    });
    onClose();
  };

  const swapForever = () => {
    const p = product.trim();
    if (!p) return;
    update((d) => {
      const s = d.skincareSteps.find((x) => x.id === step.id);
      if (!s) return;
      d.skincareEvents.push({ id: uid(), profileId: pid, date, routine: step.routine, text: `Swapped ${s.product} → ${p}` });
      s.product = p;
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={`Swap out ${step.product}`}>
      <Field label="Using instead" hint="Product resting? Trying something new? Either way it goes on the record with today’s date.">
        <Input autoFocus value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Bakuchiol serum" />
      </Field>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="soft" onClick={swapToday} disabled={!product.trim()} title="One-night swap — your routine stays as it is">Just today</Button>
        <Button onClick={swapForever} disabled={!product.trim()} title="Updates the routine and dates the change in your history">From now on</Button>
      </div>
    </Modal>
  );
}

/** Enter a whole mapped-out program at once — every step, in order. */
function RoutineSetupModal({ routine, onClose }: { routine: "am" | "pm"; onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const pid = activeProfile.id;
  type Row = { product: string; amount: string; days: number[] };
  const [rows, setRows] = useState<Row[]>([{ product: "", amount: "", days: [] }, { product: "", amount: "", days: [] }, { product: "", amount: "", days: [] }]);

  const setRow = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const toggleRowDay = (i: number, d: number) =>
    setRow(i, { days: rows[i].days.includes(d) ? rows[i].days.filter((x) => x !== d) : [...rows[i].days, d].sort((a, b) => a - b) });

  const filled = rows.filter((r) => r.product.trim());
  const save = () => {
    if (!filled.length) return;
    update((db) => {
      const max = Math.max(-1, ...db.skincareSteps.filter((s) => s.profileId === pid && s.routine === routine).map((s) => s.order));
      filled.forEach((r, i) => {
        db.skincareSteps.push({
          id: uid(), profileId: pid, routine, order: max + 1 + i,
          product: r.product.trim(), amount: r.amount.trim(), notes: "", active: true,
          days: r.days.length === 7 ? [] : r.days,
        });
      });
      db.skincareEvents.push({
        id: uid(), profileId: pid, date: today(), routine,
        text: `Routine set up — ${filled.length} step${filled.length === 1 ? "" : "s"}`,
      });
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={`Your ${routine === "am" ? "morning" : "evening"} program`} wide>
      <p className="mb-4 text-[0.85rem] text-ink-soft">
        Enter each product in the order it goes on — step 1 first. Pick days only for
        products you rotate; everything else is daily.
      </p>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="input-ink border border-line bg-raised p-3">
            <div className="flex items-start gap-3">
              <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-champagne-200/60 text-[0.72rem] font-bold text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">
                {i + 1}
              </span>
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                <Input value={r.product} onChange={(e) => setRow(i, { product: e.target.value })} placeholder={i === 0 ? "e.g. Gentle cleanser" : "Product"} />
                <Input value={r.amount} onChange={(e) => setRow(i, { amount: e.target.value })} placeholder="Amount — 1 pump · pea-size" />
                <div className="flex flex-wrap gap-1 sm:col-span-2">
                  {DAY_LABELS.map((l, d) => (
                    <Chip key={d} active={r.days.includes(d)} onClick={() => toggleRowDay(i, d)}>{l}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setRows((prev) => [...prev, { product: "", amount: "", days: [] }])}
        className="mt-3 flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.82rem] font-semibold text-champagne-600 hover:bg-sunken dark:text-champagne-300"
      >
        <Plus size={14} /> Another step
      </button>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={!filled.length}>
          Save {filled.length > 0 ? `${filled.length} step${filled.length === 1 ? "" : "s"}` : "routine"}
        </Button>
      </div>
    </Modal>
  );
}

/* —— Routine history: the look-back that shows what worked ————————— */

type HistoryEntry = { date: string; routine: "am" | "pm"; text: string; kind: "change" | "swap" | "issue" };

function RoutineHistory() {
  const { db, activeProfile } = useStore();
  const pid = activeProfile.id;
  const steps = byProfile(db.skincareSteps, pid);
  const checks = byProfile(db.skincareChecks, pid);
  const events = byProfile(db.skincareEvents, pid);

  // 4-week completion grid, oldest week on top, today in the last cell.
  const gridDays = useMemo(() => Array.from({ length: 28 }, (_, i) => addDays(today(), i - 27)), []);

  const statusFor = (date: string, routine: "am" | "pm"): "full" | "part" | "none" => {
    const c = checks.find((x) => x.date === date && x.routine === routine);
    if (!c) return "none";
    if (!c.doneStepIds) return "full"; // pre-upgrade record: whole routine done
    const applicable = steps.filter((s) => s.routine === routine && s.active && appliesOn(s, date));
    const done = applicable.filter((s) => c.doneStepIds!.includes(s.id)).length;
    if (applicable.length > 0 && done >= applicable.length) return "full";
    return done > 0 || c.issues || c.swaps?.length ? "part" : "none";
  };

  const entries = useMemo<HistoryEntry[]>(() => {
    const out: HistoryEntry[] = events.map((e) => ({ date: e.date, routine: e.routine, text: e.text, kind: "change" }));
    for (const c of checks) {
      for (const w of c.swaps ?? []) {
        const s = steps.find((x) => x.id === w.stepId);
        out.push({ date: c.date, routine: c.routine, text: `Used ${w.product} instead of ${s?.product ?? "the usual"} — that day only`, kind: "swap" });
      }
      if (c.issues) out.push({ date: c.date, routine: c.routine, text: c.issues, kind: "issue" });
    }
    return out.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 40);
  }, [events, checks, steps]);

  if (steps.filter((s) => s.active).length === 0 && entries.length === 0) return null;

  return (
    <Card>
      <p className="mb-1 font-display text-lg font-medium">Your routine, over time</p>
      <p className="mb-4 text-[0.8rem] text-ink-soft">
        Four weeks at a glance, and every dated change below it — so you can look back
        and see what you were using when your skin was at its best.
      </p>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center">
        {gridDays.slice(0, 7).map((d) => (
          <span key={d} className="text-[0.65rem] font-semibold uppercase tracking-wide text-ink-faint">
            {DAY_LABELS[dayOfWeek(d)]}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {gridDays.map((d) => {
          const am = statusFor(d, "am");
          const pm = statusFor(d, "pm");
          const isToday = d === today();
          const dot = (s: "full" | "part" | "none") =>
            s === "full" ? "bg-sage-400" : s === "part" ? "bg-champagne-400" : "border border-line-strong bg-transparent";
          return (
            <div
              key={d}
              title={`${fmtDate(d)} — AM ${am === "none" ? "—" : am === "full" ? "done" : "partial"} · PM ${pm === "none" ? "—" : pm === "full" ? "done" : "partial"}`}
              className={cx(
                "flex flex-col items-center gap-1 rounded-lg py-1.5",
                isToday ? "bg-champagne-200/40 ring-1 ring-champagne-400 dark:bg-champagne-600/15" : "bg-sunken/50"
              )}
            >
              <span className={cx("text-[0.62rem] tabular-nums", isToday ? "font-bold text-ink" : "text-ink-faint")}>
                {Number(d.slice(8))}
              </span>
              <span className={cx("h-1.5 w-1.5 rounded-full", dot(am))} title="AM" />
              <span className={cx("h-1.5 w-1.5 rounded-full", dot(pm))} title="PM" />
            </div>
          );
        })}
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] text-ink-faint">
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-sage-400" /> all steps</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-champagne-400" /> some steps</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full border border-line-strong" /> nothing logged</span>
        <span>top dot AM · bottom dot PM</span>
      </p>

      {entries.length > 0 && (
        <ol className="mt-5 space-y-0 border-l-2 border-line pl-4">
          {entries.map((e, i) => (
            <li key={i} className="relative pb-3.5 last:pb-0">
              <span
                className={cx(
                  "absolute -left-[1.42rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-card",
                  e.kind === "change" ? "bg-champagne-400" : e.kind === "swap" ? "bg-blush-300" : "bg-sage-400"
                )}
              />
              <p className="text-[0.72rem] font-semibold uppercase tracking-wide text-ink-faint">
                {fmtDate(e.date)} · {e.routine === "am" ? "Morning" : "Evening"}
                {e.kind === "issue" && " · noted"}
              </p>
              <p className="text-[0.87rem] text-ink">{e.text}</p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

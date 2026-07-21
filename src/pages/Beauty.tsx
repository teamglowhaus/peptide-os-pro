import React, { useMemo, useState } from "react";
import {
  Gem, Plus, Trash2, Pencil, Sparkles, Sunrise, Moon, ArrowUp, ArrowDown, Check,
  CalendarClock, SkipForward,
} from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid, addDays, daysSince } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, Chip, Tabs,
  EmptyState, Stat, Disclaimer, cx, useForm,
} from "../components/ui";
import { BEAUTY_LIBRARY } from "../data/beauty";
import type { BeautyTreatment, BeautyLog, SkincareStep } from "../lib/types";

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

/* —— Daily skincare: ordered AM/PM product layers, checked off daily ———— */

function SkincareRoutines() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RoutineCard routine="am" />
      <RoutineCard routine="pm" />
    </div>
  );
}

function RoutineCard({ routine }: { routine: "am" | "pm" }) {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const date = today();
  const [adding, setAdding] = useState(false);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  const steps = byProfile(db.skincareSteps, pid)
    .filter((s) => s.routine === routine && s.active)
    .sort((a, b) => a.order - b.order);
  const check = db.skincareChecks.find((c) => c.profileId === pid && c.date === date && c.routine === routine);

  const addStep = () => {
    if (!product.trim()) return;
    update((d) => {
      const max = Math.max(-1, ...d.skincareSteps.filter((s) => s.profileId === pid && s.routine === routine).map((s) => s.order));
      d.skincareSteps.push({ id: uid(), profileId: pid, routine, order: max + 1, product: product.trim(), amount: amount.trim(), notes: "", active: true });
    });
    setProduct(""); setAmount(""); setAdding(false);
  };

  const move = (id: string, dir: -1 | 1) =>
    update((d) => {
      const own = d.skincareSteps.filter((s) => s.profileId === pid && s.routine === routine && s.active).sort((a, b) => a.order - b.order);
      const i = own.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= own.length) return;
      const a = own[i].order; own[i].order = own[j].order; own[j].order = a;
    });

  const toggleDone = () =>
    update((d) => {
      const existing = d.skincareChecks.find((c) => c.profileId === pid && c.date === date && c.routine === routine);
      if (existing) d.skincareChecks = d.skincareChecks.filter((c) => c.id !== existing.id);
      else d.skincareChecks.push({ id: uid(), profileId: pid, date, routine, issues: "" });
    });

  const setIssues = (issues: string) =>
    update((d) => {
      const existing = d.skincareChecks.find((c) => c.profileId === pid && c.date === date && c.routine === routine);
      if (existing) existing.issues = issues;
      else d.skincareChecks.push({ id: uid(), profileId: pid, date, routine, issues });
    });

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2.5 font-display text-lg font-medium">
          <span className="flex h-8 w-8 -rotate-6 items-center justify-center rounded-xl bg-champagne-200/60 text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">
            {routine === "am" ? <Sunrise size={16} /> : <Moon size={16} />}
          </span>
          {routine === "am" ? "Morning routine" : "Evening routine"}
        </p>
        {steps.length > 0 && (
          <button
            onClick={toggleDone}
            className={cx(
              "btn-ink flex items-center gap-1.5 border-2 px-3 py-1.5 text-[0.8rem] font-semibold transition-all",
              check
                ? "border-sage-500 bg-sage-400 text-white"
                : "border-line-strong text-ink-soft hover:border-sage-400 hover:bg-sage-100/50 dark:hover:bg-sage-600/20"
            )}
          >
            <Check size={13} strokeWidth={3} /> {check ? "Done today" : "Mark done"}
          </button>
        )}
      </div>

      {steps.length === 0 && !adding && (
        <p className="handnote mb-3 text-[0.85rem] text-ink-faint">
          Build your {routine === "am" ? "morning" : "evening"} layers in the order they go on…
        </p>
      )}

      <ol className="space-y-1.5">
        {steps.map((s, i) => (
          <li key={s.id} className="input-ink group/step flex items-center gap-3 border border-line bg-raised px-3 py-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-champagne-200/60 text-[0.72rem] font-bold text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.9rem] font-medium text-ink">{s.product}</span>
              {s.amount && <span className="block text-[0.75rem] text-ink-faint">{s.amount}</span>}
            </span>
            <span className="flex shrink-0 opacity-0 transition-opacity group-hover/step:opacity-100">
              <button onClick={() => move(s.id, -1)} disabled={i === 0} aria-label="Move up" className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-ink disabled:opacity-30"><ArrowUp size={14} /></button>
              <button onClick={() => move(s.id, 1)} disabled={i === steps.length - 1} aria-label="Move down" className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-ink disabled:opacity-30"><ArrowDown size={14} /></button>
              <button
                onClick={() => update((d) => { const x = d.skincareSteps.find((y) => y.id === s.id); if (x) x.active = false; })}
                aria-label="Remove step" className="rounded-full p-1.5 text-ink-faint hover:bg-sunken hover:text-blush-500"
              ><Trash2 size={14} /></button>
            </span>
          </li>
        ))}
      </ol>

      {adding ? (
        <div className="mt-3 space-y-2">
          <Input autoFocus value={product} onChange={(e) => setProduct(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addStep()} placeholder="Product name — e.g. Vitamin C serum" />
          <div className="flex gap-2">
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addStep()} placeholder="Amount — 2 pumps · pea-size · 3 drops" />
            <Button variant="soft" onClick={addStep}><Plus size={15} /></Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
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
    </Card>
  );
}

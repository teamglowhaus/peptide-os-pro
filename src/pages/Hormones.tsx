import React, { useMemo, useState } from "react";
import { Plus, Flower2, Trash2, Pencil, MessageCircleQuestion, Check, Droplet, FileHeart } from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid, computeCycleInfo, CYCLE_PHASE_LABEL } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, Tabs, EmptyState,
  SeverityMeter, Sparkline, Disclaimer, cx, useForm,
} from "../components/ui";
import { HORMONE_OPTIONS, HORMONE_FORMS, MENO_SYMPTOMS, SEVERITY_LABELS } from "../data/wellness";
import type { HormoneTherapy, SymptomLog, ProviderQuestion } from "../lib/types";

function blankTherapy(profileId: string): HormoneTherapy {
  return {
    id: uid(), profileId, name: "", form: "Cream", providerDose: "", schedule: "",
    provider: "", startDate: today(), refillReminder: "", labDate: "", providerNotes: "",
    notes: "", active: true, createdAt: today(),
  };
}

export function Hormones() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [tab, setTab] = useState("today");
  const [editing, setEditing] = useState<HormoneTherapy | null>(null);

  const therapies = byProfile(db.hormones, pid).filter((h) => h.active);
  const logs = byProfile(db.symptomLogs, pid).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <PageHeader
        eyebrow="Hormones"
        title="Hormones & Menopause"
        sub="HRT, cycles, and the twenty symptoms nobody warned you about — tracked with tenderness, charted over time."
        actions={
          <Button onClick={() => setEditing(blankTherapy(pid))}>
            <Plus size={16} /> Add therapy
          </Button>
        }
      />

      <Tabs
        tabs={[
          { key: "today", label: "Today's check-in" },
          { key: "therapies", label: `My therapies (${therapies.length})` },
          { key: "trends", label: "Trends" },
          { key: "questions", label: "Ask my provider" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "today" && <SymptomCheckin />}
      {tab === "therapies" && (
        therapies.length === 0 ? (
          <EmptyState
            icon={<Flower2 size={26} />}
            title="No therapies added yet"
            body="Estrogen, progesterone, testosterone, thyroid, DHEA — creams, patches, pellets, troches and more. Add each therapy exactly as your provider prescribed it."
            action={<Button variant="soft" onClick={() => setEditing(blankTherapy(pid))}>Add my first therapy</Button>}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {therapies.map((h) => (
              <TherapyCard key={h.id} h={h} onEdit={() => setEditing(h)} />
            ))}
          </div>
        )
      )}
      {tab === "trends" && <SymptomTrends logs={logs} />}
      {tab === "questions" && <ProviderQuestions />}

      {editing && (
        <TherapyEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(h) => {
            update((d) => {
              const i = d.hormones.findIndex((x) => x.id === h.id);
              if (i >= 0) d.hormones[i] = h;
              else d.hormones.push(h);
            });
            setEditing(null);
            setTab("therapies");
          }}
        />
      )}

      <Disclaimer>
        This module organizes your own prescriptions, symptoms, and questions — it is not medical
        advice and never suggests hormone doses. Perimenopause deserves real care: bring these
        charts to a provider you trust.
      </Disclaimer>
    </div>
  );
}

function TherapyCard({ h, onEdit }: { h: HormoneTherapy; onEdit: () => void }) {
  const { update } = useStore();
  return (
    <Card hover className="group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-xl bg-blush-100 text-blush-500 transition-transform group-hover:rotate-0 dark:bg-blush-500/25 dark:text-blush-200">
            <Flower2 size={17} />
          </span>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-blush-500 dark:text-blush-300">{h.form}</p>
            <h3 className="font-display text-xl font-medium text-ink-strong">{h.name}</h3>
          </div>
        </div>
        <div className="flex">
          <button onClick={onEdit} aria-label="Edit" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-ink"><Pencil size={15} /></button>
          <button
            onClick={() => update((d) => void (d.hormones = d.hormones.filter((x) => x.id !== h.id)))}
            aria-label="Delete" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
          ><Trash2 size={15} /></button>
        </div>
      </div>
      <dl className="mt-3 space-y-1.5 text-[0.85rem]">
        {h.providerDose && <li className="list-none"><span className="text-ink-faint">Dose (provider): </span><span className="text-ink">{h.providerDose}</span></li>}
        {h.schedule && <li className="list-none"><span className="text-ink-faint">Schedule: </span><span className="text-ink">{h.schedule}</span></li>}
        {h.refillReminder && <li className="list-none"><span className="text-ink-faint">Refill: </span><span className="text-ink">{fmtDate(h.refillReminder)}</span></li>}
        {h.labDate && <li className="list-none"><span className="text-ink-faint">Next labs: </span><span className="text-ink">{fmtDate(h.labDate)}</span></li>}
        {h.providerNotes && <li className="list-none"><span className="text-ink-faint">Provider notes: </span><span className="text-ink">{h.providerNotes}</span></li>}
      </dl>
    </Card>
  );
}

function TherapyEditor({
  initial, onSave, onClose,
}: { initial: HormoneTherapy; onSave: (h: HormoneTherapy) => void; onClose: () => void }) {
  const { form, set } = useForm(initial);
  const [custom, setCustom] = useState(!HORMONE_OPTIONS.includes(initial.name) && !!initial.name);
  return (
    <Modal open onClose={onClose} title={initial.name || "Add hormone therapy"} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Therapy" className={custom ? "" : "sm:col-span-2"}>
          <Select
            value={custom ? "Custom" : form.name || ""}
            onChange={(e) => {
              if (e.target.value === "Custom") { setCustom(true); set("name", ""); }
              else { setCustom(false); set("name", e.target.value); }
            }}
          >
            <option value="" disabled>Choose…</option>
            {HORMONE_OPTIONS.map((h) => <option key={h}>{h}</option>)}
          </Select>
        </Field>
        {custom && (
          <Field label="Custom therapy name">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your therapy" />
          </Field>
        )}
        <Field label="Delivery form">
          <Select value={form.form} onChange={(e) => set("form", e.target.value as any)}>
            {HORMONE_FORMS.map((f) => <option key={f}>{f}</option>)}
          </Select>
        </Field>
        <Field label="Dose from your provider" hint="Recorded, never suggested.">
          <Input value={form.providerDose} onChange={(e) => set("providerDose", e.target.value)} placeholder="per provider instructions" />
        </Field>
        <Field label="Schedule">
          <Input value={form.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="e.g. nightly · days 14–28" />
        </Field>
        <Field label="Provider">
          <Input value={form.provider} onChange={(e) => set("provider", e.target.value)} />
        </Field>
        <Field label="Start date">
          <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </Field>
        <Field label="Refill reminder">
          <Input type="date" value={form.refillReminder} onChange={(e) => set("refillReminder", e.target.value)} />
        </Field>
        <Field label="Next lab date">
          <Input type="date" value={form.labDate} onChange={(e) => set("labDate", e.target.value)} />
        </Field>
        <Field label="Provider notes" className="sm:col-span-2">
          <Textarea rows={2} value={form.providerNotes} onChange={(e) => set("providerNotes", e.target.value)} placeholder="What your provider said at the last visit" />
        </Field>
        <Field label="Before / after notes" className="sm:col-span-2">
          <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="How you felt before starting · what's shifted since" />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => form.name.trim() && onSave(form)} disabled={!form.name.trim()}>Save therapy</Button>
      </div>
    </Modal>
  );
}

function SymptomCheckin() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const date = today();
  const existing = db.symptomLogs.find((l) => l.profileId === pid && l.date === date);
  const log: SymptomLog = existing ?? {
    id: uid(), profileId: pid, date, symptoms: {}, flow: "", notes: "",
  };

  const save = (patch: Partial<SymptomLog>) =>
    update((d) => {
      const e = d.symptomLogs.find((l) => l.profileId === pid && l.date === date);
      if (e) Object.assign(e, patch);
      else d.symptomLogs.push({ ...log, ...patch });
    });

  const setSeverity = (key: string, v: number) =>
    save({ symptoms: { ...log.symptoms, [key]: v } });

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <p className="mb-1 font-display text-lg font-medium">How is your body speaking today?</p>
        <p className="mb-5 text-[0.85rem] text-ink-soft">Tap a symptom to cycle 0 → 4. Blank means “not today.”</p>
        <div className="grid gap-x-6 gap-y-3.5 xl:grid-cols-2">
          {MENO_SYMPTOMS.map((s) => {
            const v = log.symptoms[s.key] ?? 0;
            return (
              <button
                key={s.key}
                onClick={() => setSeverity(s.key, (v + 1) % 5)}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-sunken"
              >
                <span className={cx("min-w-0 truncate text-[0.9rem]", v > 0 ? "font-semibold text-ink-strong" : "text-ink-soft")}>
                  {s.label}
                </span>
                <SeverityMeter value={v} labels={SEVERITY_LABELS} className="shrink-0" />
              </button>
            );
          })}
        </div>
      </Card>
      <div className="space-y-4">
        <CycleCard flow={log.flow} onFlowChange={(flow) => save({ flow })} />
        <Card>
          <p className="mb-3 font-display text-lg font-medium">Notes for the chart</p>
          <Textarea
            rows={4}
            value={log.notes}
            onChange={(e) => save({ notes: e.target.value })}
            placeholder="Triggers, wins, anything your provider should see…"
          />
        </Card>
      </div>
    </div>
  );
}

function CycleCard({ flow, onFlowChange }: { flow: SymptomLog["flow"]; onFlowChange: (f: SymptomLog["flow"]) => void }) {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const periods = byProfile(db.periods, pid).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const info = computeCycleInfo(db.periods, pid);
  const startedToday = periods.some((p) => p.startDate === today());

  const logPeriodStart = () =>
    update((d) => void d.periods.push({ id: uid(), profileId: pid, startDate: today(), notes: "" }));
  const removePeriod = (id: string) =>
    update((d) => void (d.periods = d.periods.filter((p) => p.id !== id)));

  return (
    <Card className="card-hero relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blush-300/30 blur-3xl dark:bg-blush-500/15"
        aria-hidden
      />
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-display text-lg font-medium">Cycle</p>
        <button
          onClick={logPeriodStart}
          disabled={startedToday}
          className={cx(
            "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.78rem] font-semibold",
            startedToday ? "border-line text-ink-faint" : "border-blush-300 text-blush-600 hover:bg-blush-100/60 dark:text-blush-300"
          )}
        >
          <Droplet size={13} /> {startedToday ? "Logged today" : "Period started today"}
        </button>
      </div>

      {info ? (
        <div className="mb-4 rounded-2xl bg-sunken/60 px-4 py-3.5">
          <p className="font-display text-2xl font-medium text-ink-strong">Day {info.cycleDay}</p>
          <p className="text-[0.85rem] font-medium text-blush-600 dark:text-blush-300">{CYCLE_PHASE_LABEL[info.phase]}</p>
          <p className="mt-1 text-[0.78rem] text-ink-faint">
            {info.avgCycleLength
              ? `Estimated from your last ${info.cyclesLogged} logged cycles (avg ${info.avgCycleLength} days).`
              : "Estimated using a typical 28-day cycle — log your next period for a personal average."}
          </p>
        </div>
      ) : (
        <p className="mb-4 text-[0.85rem] text-ink-soft">
          Log your period's start date above to see your cycle day and estimated phase here.
        </p>
      )}

      <Field label="Flow today">
        <Select value={flow} onChange={(e) => onFlowChange(e.target.value as SymptomLog["flow"])}>
          <option value="">—</option>
          <option value="none">None</option>
          <option value="spotting">Spotting</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
        </Select>
      </Field>

      {periods.length > 0 && (
        <div className="mt-4 border-t border-line pt-3">
          <p className="eyebrow mb-2">Period history</p>
          <div className="space-y-1">
            {periods.slice(0, 6).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-[0.82rem]">
                <span className="text-ink-soft">{fmtDate(p.startDate)}</span>
                <button onClick={() => removePeriod(p.id)} aria-label="Delete period log" className="rounded-full p-1 text-ink-faint hover:text-blush-500">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-[0.72rem] leading-relaxed text-ink-faint">
        Estimates only, based on what you log — not a fertility or contraception tool. Perimenopausal
        cycles are often irregular, so treat this as a rough guide alongside your own body's signals.
      </p>
    </Card>
  );
}

function SymptomTrends({ logs }: { logs: SymptomLog[] }) {
  const withData = MENO_SYMPTOMS.map((s) => ({
    ...s,
    points: logs.map((l) => l.symptoms[s.key] ?? 0),
    total: logs.reduce((n, l) => n + (l.symptoms[s.key] ?? 0), 0),
  }))
    .filter((s) => s.total > 0)
    .sort((a, b) => b.total - a.total);

  if (logs.length < 2 || withData.length === 0) {
    return (
      <EmptyState
        icon={<Flower2 size={26} />}
        title="Trends appear after a few check-ins"
        body="Log symptoms for a handful of days and this page becomes the chart you bring to your provider — the pattern, not just the bad day."
      />
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {withData.map((s) => (
        <Card key={s.key} className="p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-semibold text-ink-strong">{s.label}</p>
            <p className="text-xs text-ink-faint">last {s.points.slice(-14).length} check-ins</p>
          </div>
          <div className="mt-2">
            <Sparkline points={s.points.slice(-14)} tone="rose" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProviderQuestions() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [text, setText] = useState("");
  const questions = byProfile(db.providerQuestions, pid).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const add = () => {
    if (!text.trim()) return;
    update((d) =>
      void d.providerQuestions.push({
        id: uid(), profileId: pid, question: text.trim(), context: "",
        asked: false, answer: "", createdAt: new Date().toISOString(),
      })
    );
    setText("");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="card-hero mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-medium text-ink-strong">Appointment coming up?</p>
          <p className="mt-0.5 text-[0.85rem] text-ink-soft">
            One tap builds a visit report — therapies, symptom patterns, cycle, labs, and these questions.
          </p>
        </div>
        <Button onClick={() => (window.location.hash = "/report")}>
          <FileHeart size={15} /> Build my visit report
        </Button>
      </Card>
      <Card>
        <p className="mb-1 font-display text-lg font-medium">Questions for my provider</p>
        <p className="mb-4 text-[0.85rem] text-ink-soft">
          The thing you meant to ask at 2 a.m. lives here until your appointment.
        </p>
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="e.g. Could my sleep changes be progesterone timing?"
          />
          <Button onClick={add}><Plus size={16} /></Button>
        </div>
      </Card>
      <div className="mt-4 space-y-2">
        {questions.length === 0 && (
          <p className="px-2 text-center text-[0.85rem] text-ink-faint">Nothing saved yet — your future self will thank you.</p>
        )}
        {questions.map((q) => (
          <Card key={q.id} className="!py-3.5">
            <div className="flex items-start gap-3">
              <button
                onClick={() => update((d) => {
                  const x = d.providerQuestions.find((p) => p.id === q.id);
                  if (x) x.asked = !x.asked;
                })}
                aria-label={q.asked ? "Mark unasked" : "Mark asked"}
                className={cx(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                  q.asked
                    ? "border-sage-500 bg-sage-400 text-white"
                    : "border-line-strong text-transparent hover:border-sage-400 hover:bg-sage-100/50 dark:hover:bg-sage-600/20"
                )}
              >
                <Check size={13} strokeWidth={3} />
              </button>
              <div className="min-w-0 flex-1">
                <p className={cx("text-[0.92rem]", q.asked ? "text-ink-faint line-through" : "text-ink")}>{q.question}</p>
                {q.asked && (
                  <Input
                    className="mt-2 !py-1.5 text-sm"
                    value={q.answer}
                    onChange={(e) => update((d) => {
                      const x = d.providerQuestions.find((p) => p.id === q.id);
                      if (x) x.answer = e.target.value;
                    })}
                    placeholder="What they said…"
                  />
                )}
              </div>
              <button
                onClick={() => update((d) => void (d.providerQuestions = d.providerQuestions.filter((p) => p.id !== q.id)))}
                aria-label="Delete question"
                className="rounded-full p-1.5 text-ink-faint hover:text-blush-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

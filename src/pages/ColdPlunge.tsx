import React, { useMemo, useState } from "react";
import { Snowflake, Plus, Trash2, Trophy } from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, EmptyState, Stat,
  Disclaimer, useForm,
} from "../components/ui";
import { BeforeAfter } from "./RedLight";
import type { ColdPlungeSession } from "../lib/types";

export function ColdPlunge() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [open, setOpen] = useState(false);
  const sessions = byProfile(db.coldPlunge, pid).sort((a, b) => b.date.localeCompare(a.date));

  const best = useMemo(() => {
    const withMin = sessions
      .map((s) => ({ s, mins: parseFloat(s.duration) }))
      .filter((x) => !isNaN(x.mins));
    if (!withMin.length) return null;
    return withMin.sort((a, b) => b.mins - a.mins)[0].s;
  }, [sessions]);

  return (
    <div>
      <PageHeader
        eyebrow="Body lab"
        title="Cold Plunge"
        sub="Temperature, minutes, breath — and the mood shift on the other side."
        actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Log plunge</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Total plunges" value={String(sessions.length)} tone="sage" />
        <Stat label="Personal best" value={best ? `${best.duration}${/[a-z]/i.test(best.duration) ? "" : " min"}` : "—"} detail={best ? `${best.temperature}° · ${fmtDate(best.date)}` : "log durations in minutes"} tone="champagne" />
        <Stat label="Last plunge" value={sessions[0] ? fmtDate(sessions[0].date) : "—"} detail={sessions[0] ? `${sessions[0].temperature}°` : ""} />
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={<Snowflake size={26} />}
          title="The water is waiting"
          body="Log each plunge — temp, time, breathwork — and watch your cold tolerance and calm grow week by week."
          action={<Button variant="soft" onClick={() => setOpen(true)}>Log my first plunge</Button>}
        />
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <Card key={s.id} className="!py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink-strong">
                    {s.temperature && `${s.temperature}°`} {s.duration && `· ${s.duration}${/[a-z]/i.test(s.duration) ? "" : " min"}`}
                    {s.personalBest && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-champagne-200/60 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">
                        <Trophy size={11} /> PB
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[0.78rem] text-ink-faint">
                    {fmtDate(s.date)} {s.breathwork && `· breath: ${s.breathwork}`} {s.recovery && `· ${s.recovery}`}
                  </p>
                  {(s.moodBefore > 0 || s.moodAfter > 0) && (
                    <p className="mt-1 text-[0.78rem] text-ink-soft">
                      Mood {s.moodBefore || "—"} → {s.moodAfter || "—"} · Energy {s.energyBefore || "—"} → {s.energyAfter || "—"}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => update((d) => void (d.coldPlunge = d.coldPlunge.filter((x) => x.id !== s.id)))}
                  aria-label="Delete" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
                ><Trash2 size={15} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Disclaimer>
        Cold exposure is intense by design — clear it with your provider first if you have any heart,
        blood pressure, or medical considerations, never plunge alone, and always listen to your body
        over your timer.
      </Disclaimer>

      {open && <PlungeModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function PlungeModal({ onClose }: { onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const { form, set } = useForm<ColdPlungeSession>({
    id: uid(), profileId: activeProfile.id, date: today(),
    temperature: "", duration: "", timeOfDay: "", breathwork: "",
    moodBefore: 0, moodAfter: 0, energyBefore: 0, energyAfter: 0,
    recovery: "", personalBest: false, notes: "",
  });
  return (
    <Modal open onClose={onClose} title="Log cold plunge" wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date"><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Time of day"><Input value={form.timeOfDay} onChange={(e) => set("timeOfDay", e.target.value)} placeholder="e.g. 6:45 am" /></Field>
        <Field label="Temperature (°)"><Input inputMode="decimal" value={form.temperature} onChange={(e) => set("temperature", e.target.value)} placeholder="e.g. 48" /></Field>
        <Field label="Duration (min)"><Input inputMode="decimal" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 3" /></Field>
        <Field label="Breathwork"><Input value={form.breathwork} onChange={(e) => set("breathwork", e.target.value)} placeholder="e.g. box breathing before" /></Field>
        <Field label="Recovery after"><Input value={form.recovery} onChange={(e) => set("recovery", e.target.value)} placeholder="warm shower · movement" /></Field>
        <BeforeAfter label="Mood" before={form.moodBefore} after={form.moodAfter} onBefore={(v) => set("moodBefore", v)} onAfter={(v) => set("moodAfter", v)} />
        <BeforeAfter label="Energy" before={form.energyBefore} after={form.energyAfter} onBefore={(v) => set("energyBefore", v)} onAfter={(v) => set("energyAfter", v)} />
        <Field label="Personal best?" className="sm:col-span-2">
          <label className="flex items-center gap-2 text-[0.9rem] text-ink">
            <input type="checkbox" checked={form.personalBest} onChange={(e) => set("personalBest", e.target.checked)} className="h-4 w-4 accent-[--color-champagne-500]" />
            Mark this plunge as a PB 🏆
          </label>
        </Field>
        <Field label="Safety & notes" className="sm:col-span-2">
          <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Who was with you, how exit felt…" />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { update((d) => void d.coldPlunge.push(form)); onClose(); }}>Save plunge</Button>
      </div>
    </Modal>
  );
}

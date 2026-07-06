import React, { useMemo, useState } from "react";
import { Sun, Plus, Trash2 } from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, EmptyState, RatingDots, Stat, useForm, cx,
} from "../components/ui";
import type { RedLightSession } from "../lib/types";

export function RedLight() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [open, setOpen] = useState(false);
  const sessions = byProfile(db.redLight, pid).sort((a, b) => b.date.localeCompare(a.date));

  /* weekly consistency: sessions in the last 7 / previous 7 days */
  const week = useMemo(() => {
    const now = new Date();
    const dayISO = (offset: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - offset);
      return d.toISOString().slice(0, 10);
    };
    const last7 = new Set(Array.from({ length: 7 }, (_, i) => dayISO(i)));
    return sessions.filter((s) => last7.has(s.date)).length;
  }, [sessions]);

  return (
    <div>
      <PageHeader
        eyebrow="Body lab"
        title="Red Light Ritual"
        sub="Device, distance, minutes, glow — and how you felt before and after."
        actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Log session</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="This week" value={`${week} session${week === 1 ? "" : "s"}`} detail="last 7 days" tone="champagne" />
        <Stat label="All time" value={String(sessions.length)} detail="sessions logged" />
        <Stat label="Last session" value={sessions[0] ? fmtDate(sessions[0].date) : "—"} detail={sessions[0]?.bodyArea || ""} />
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={<Sun size={26} />}
          title="No glow logged yet"
          body="Log your panel or mask sessions and this page becomes your consistency tracker — the secret ingredient of every red light story."
          action={<Button variant="soft" onClick={() => setOpen(true)}>Log my first session</Button>}
        />
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <Card key={s.id} className="!py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink-strong">
                    {s.bodyArea || "Session"}{s.duration && <span className="font-normal text-ink-soft"> · {s.duration}</span>}
                    {s.device && <span className="font-normal text-ink-faint"> · {s.device}</span>}
                  </p>
                  <p className="mt-0.5 text-[0.78rem] text-ink-faint">
                    {fmtDate(s.date)}
                    {s.distance && ` · ${s.distance}`}
                    {s.wavelength && ` · ${s.wavelength}`}
                    {s.timeOfDay && ` · ${s.timeOfDay}`}
                  </p>
                  {(s.moodBefore > 0 || s.moodAfter > 0) && (
                    <p className="mt-1 text-[0.78rem] text-ink-soft">
                      Mood {s.moodBefore || "—"} → {s.moodAfter || "—"} · Energy {s.energyBefore || "—"} → {s.energyAfter || "—"}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => update((d) => void (d.redLight = d.redLight.filter((x) => x.id !== s.id)))}
                  aria-label="Delete" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
                ><Trash2 size={15} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && <RedLightModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function RedLightModal({ onClose }: { onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const { form, set } = useForm<RedLightSession>({
    id: uid(), profileId: activeProfile.id, date: today(),
    device: "", bodyArea: "", wavelength: "", distance: "", duration: "",
    timeOfDay: "", skinGoal: "", recoveryGoal: "",
    moodBefore: 0, moodAfter: 0, energyBefore: 0, energyAfter: 0, notes: "",
  });
  return (
    <Modal open onClose={onClose} title="Log red light session" wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date"><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Device"><Input value={form.device} onChange={(e) => set("device", e.target.value)} placeholder="panel · mask · belt" /></Field>
        <Field label="Body area"><Input value={form.bodyArea} onChange={(e) => set("bodyArea", e.target.value)} placeholder="face · full body · knee" /></Field>
        <Field label="Wavelength notes"><Input value={form.wavelength} onChange={(e) => set("wavelength", e.target.value)} placeholder="e.g. 660/850 nm per device" /></Field>
        <Field label="Distance"><Input value={form.distance} onChange={(e) => set("distance", e.target.value)} placeholder="e.g. 12 in" /></Field>
        <Field label="Duration"><Input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 10 min" /></Field>
        <Field label="Time of day"><Input value={form.timeOfDay} onChange={(e) => set("timeOfDay", e.target.value)} placeholder="e.g. before coffee" /></Field>
        <Field label="Skin goal"><Input value={form.skinGoal} onChange={(e) => set("skinGoal", e.target.value)} placeholder="glow · texture · calm" /></Field>
        <Field label="Pain / recovery goal" className="sm:col-span-2"><Input value={form.recoveryGoal} onChange={(e) => set("recoveryGoal", e.target.value)} placeholder="what you're supporting" /></Field>
        <BeforeAfter label="Mood" before={form.moodBefore} after={form.moodAfter}
          onBefore={(v) => set("moodBefore", v)} onAfter={(v) => set("moodAfter", v)} />
        <BeforeAfter label="Energy" before={form.energyBefore} after={form.energyAfter}
          onBefore={(v) => set("energyBefore", v)} onAfter={(v) => set("energyAfter", v)} />
        <Field label="Notes & photos" className="sm:col-span-2" hint="Jot where progress photos live (your camera roll stays private).">
          <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { update((d) => void d.redLight.push(form)); onClose(); }}>Save session</Button>
      </div>
    </Modal>
  );
}

export function BeforeAfter({
  label, before, after, onBefore, onAfter,
}: {
  label: string; before: number; after: number;
  onBefore: (v: number) => void; onAfter: (v: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-sunken/60 p-3.5">
      <p className="mb-2 text-[0.8rem] font-semibold text-ink-soft">{label} · before → after</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <RatingDots value={before} onChange={onBefore} tone="blush" />
        <span className="text-ink-faint">→</span>
        <RatingDots value={after} onChange={onAfter} tone="sage" />
      </div>
    </div>
  );
}

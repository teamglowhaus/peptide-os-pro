import React, { useState } from "react";
import { Flame, Plus, Trash2 } from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, EmptyState, Stat,
  RatingDots, Disclaimer, useForm,
} from "../components/ui";
import type { SaunaSession } from "../lib/types";

export function Sauna() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [open, setOpen] = useState(false);
  const sessions = byProfile(db.sauna, pid).sort((a, b) => b.date.localeCompare(a.date));

  const thisWeek = sessions.filter((s) => {
    const d = new Date(s.date + "T12:00:00");
    return Date.now() - d.getTime() < 7 * 864e5;
  }).length;

  return (
    <div>
      <PageHeader
        eyebrow="Body lab"
        title="Sauna"
        sub="Infrared, traditional, or steam — heat, hydration, and how you slept after."
        actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Log sauna</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="This week" value={`${thisWeek} session${thisWeek === 1 ? "" : "s"}`} tone="champagne" />
        <Stat label="All time" value={String(sessions.length)} />
        <Stat label="Last session" value={sessions[0] ? fmtDate(sessions[0].date) : "—"} detail={sessions[0] ? `${sessions[0].kind} · ${sessions[0].temperature}°` : ""} />
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={<Flame size={26} />}
          title="No heat logged yet"
          body="Each sauna you log tracks temperature, minutes, hydration, and the sleep it gifts you that night."
          action={<Button variant="soft" onClick={() => setOpen(true)}>Log my first sauna</Button>}
        />
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <Card key={s.id} className="flex items-start justify-between gap-4 !py-4">
              <div className="min-w-0">
                <p className="font-medium capitalize text-ink-strong">
                  {s.kind} {s.temperature && `· ${s.temperature}°`} {s.duration && `· ${s.duration}`}
                </p>
                <p className="mt-0.5 text-[0.78rem] text-ink-faint">
                  {fmtDate(s.date)}
                  {s.hydration && ` · hydration: ${s.hydration}`}
                  {s.electrolytes && ` · electrolytes: ${s.electrolytes}`}
                  {s.sleepImpact && ` · sleep: ${s.sleepImpact}`}
                </p>
              </div>
              <button
                onClick={() => update((d) => void (d.sauna = d.sauna.filter((x) => x.id !== s.id)))}
                aria-label="Delete" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
              ><Trash2 size={15} /></button>
            </Card>
          ))}
        </div>
      )}

      <Disclaimer>
        Heat is a real stressor — hydrate generously, keep sessions within your comfort, and check
        with your provider if you're pregnant or managing blood pressure or heart considerations.
      </Disclaimer>

      {open && <SaunaModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function SaunaModal({ onClose }: { onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const { form, set } = useForm<SaunaSession>({
    id: uid(), profileId: activeProfile.id, date: today(),
    kind: "infrared", temperature: "", duration: "", hydration: "", electrolytes: "",
    mood: 0, sleepImpact: "", recovery: "", notes: "",
  });
  return (
    <Modal open onClose={onClose} title="Log sauna session" wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date"><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Type">
          <Select value={form.kind} onChange={(e) => set("kind", e.target.value as any)}>
            <option value="infrared">Infrared</option>
            <option value="traditional">Traditional</option>
            <option value="steam">Steam</option>
          </Select>
        </Field>
        <Field label="Temperature (°)"><Input inputMode="decimal" value={form.temperature} onChange={(e) => set("temperature", e.target.value)} placeholder="e.g. 140" /></Field>
        <Field label="Duration (min)"><Input inputMode="decimal" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 25" /></Field>
        <Field label="Hydration"><Input value={form.hydration} onChange={(e) => set("hydration", e.target.value)} placeholder="e.g. 24 oz water" /></Field>
        <Field label="Electrolytes"><Input value={form.electrolytes} onChange={(e) => set("electrolytes", e.target.value)} placeholder="e.g. LMNT after" /></Field>
        <Field label="Mood after">
          <RatingDots value={form.mood} onChange={(v) => set("mood", v)} tone="champagne" />
        </Field>
        <Field label="Sleep impact"><Input value={form.sleepImpact} onChange={(e) => set("sleepImpact", e.target.value)} placeholder="e.g. deeper, earlier" /></Field>
        <Field label="Recovery notes" className="sm:col-span-2">
          <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { update((d) => void d.sauna.push(form)); onClose(); }}>Save session</Button>
      </div>
    </Modal>
  );
}

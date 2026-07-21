import React, { useState } from "react";
import { Activity, Plus, Trash2 } from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, EmptyState,
  RatingDots, SearchBox, useForm,
} from "../components/ui";
import { BIOHACKING_TOOLS } from "../data/wellness";
import type { ToolSession } from "../lib/types";

export function Biohacking() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [search, setSearch] = useState("");
  const [logging, setLogging] = useState<string | null>(null);

  const sessions = byProfile(db.toolSessions, pid).sort((a, b) => b.date.localeCompare(a.date));
  const tools = BIOHACKING_TOOLS.filter(
    (t) => !search || t.label.toLowerCase().includes(search.toLowerCase())
  );

  const countFor = (key: string) => sessions.filter((s) => s.tool === key).length;

  return (
    <div>
      <PageHeader
        eyebrow="Body lab"
        title="Biohacking Tools"
        sub="Thirty rituals, one gentle log. Tap any tool to record a session — your consistency writes the story."
      />

      <div className="mb-5"><SearchBox value={search} onChange={setSearch} placeholder="Find a tool…" /></div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <button key={t.key} onClick={() => setLogging(t.key)} className="group card card-hover flex items-center gap-3.5 p-4 text-left">
            <span className="flex h-10 w-10 shrink-0 -rotate-6 items-center justify-center rounded-xl bg-sage-100 text-sage-500 transition-transform group-hover:rotate-0 dark:bg-sage-600/25 dark:text-sage-300">
              <Activity size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink-strong">{t.label}</span>
              <span className="block text-[0.75rem] text-ink-faint">{t.hint}</span>
            </span>
            {countFor(t.key) > 0 && (
              <span className="rounded-full bg-champagne-200/60 px-2.5 py-1 text-[0.7rem] font-bold text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">
                {countFor(t.key)}
              </span>
            )}
          </button>
        ))}
      </div>

      <section className="mt-9">
        <h2 className="mb-4 font-display text-xl font-medium">Recent sessions</h2>
        {sessions.length === 0 ? (
          <EmptyState
            icon={<Activity size={26} />}
            title="No sessions yet"
            body="Red light before coffee, ten minutes of breathwork, a Sunday sauna — log it here and watch your Biohacker Score warm up."
          />
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 20).map((s) => {
              const tool = BIOHACKING_TOOLS.find((t) => t.key === s.tool);
              return (
                <Card key={s.id} className="flex items-center justify-between gap-4 !py-3.5">
                  <div className="min-w-0">
                    <p className="font-medium text-ink-strong">
                      {tool?.label ?? s.tool}
                      {s.duration && <span className="font-normal text-ink-soft"> · {s.duration}</span>}
                    </p>
                    <p className="text-[0.78rem] text-ink-faint">
                      {fmtDate(s.date)} {s.detail && `· ${s.detail}`}
                    </p>
                  </div>
                  <button
                    onClick={() => update((d) => void (d.toolSessions = d.toolSessions.filter((x) => x.id !== s.id)))}
                    aria-label="Delete session" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
                  ><Trash2 size={15} /></button>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {logging && (
        <ToolLogModal
          toolKey={logging}
          onClose={() => setLogging(null)}
        />
      )}
    </div>
  );
}

function ToolLogModal({ toolKey, onClose }: { toolKey: string; onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const tool = BIOHACKING_TOOLS.find((t) => t.key === toolKey);
  const { form, set } = useForm<ToolSession>({
    id: uid(), profileId: activeProfile.id, date: today(),
    tool: toolKey, duration: "", detail: "", feeling: 0, notes: "",
  });
  return (
    <Modal open onClose={onClose} title={`Log · ${tool?.label ?? "Session"}`}>
      <div className="space-y-4">
        <Field label="Date"><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Duration"><Input value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 15 min" /></Field>
        <Field label="Details"><Input value={form.detail} onChange={(e) => set("detail", e.target.value)} placeholder={tool?.hint} /></Field>
        <Field label="How it felt">
          <RatingDots value={form.feeling} onChange={(v) => set("feeling", v)} tone="champagne" />
        </Field>
        <Field label="Notes"><Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { update((d) => void d.toolSessions.push(form)); onClose(); }}>Save session</Button>
      </div>
    </Modal>
  );
}

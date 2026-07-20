import React, { useState } from "react";
import { HeartPulse, Trash2 } from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Field, Input, Textarea, Tabs, EmptyState, RatingDots,
} from "../components/ui";
import { LIFESTYLE_TRACKERS } from "../data/wellness";
import type { LifestyleEntry } from "../lib/types";

/* Eight polished mini-trackers: nutrition, body, fitness, sleep,
   beauty, dental, hair, mindset — one shared, calm pattern. */

export function Lifestyle() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [tab, setTab] = useState(LIFESTYLE_TRACKERS[0].key);
  const tracker = LIFESTYLE_TRACKERS.find((t) => t.key === tab)!;
  const date = today();

  const entries = byProfile(db.lifestyle, pid)
    .filter((e) => e.tracker === tab)
    .sort((a, b) => b.date.localeCompare(a.date));
  const todayEntry = entries.find((e) => e.date === date);

  const saveField = (key: string, value: string) =>
    update((d) => {
      const e = d.lifestyle.find((x) => x.profileId === pid && x.tracker === tab && x.date === date);
      if (e) e.fields[key] = value;
      else d.lifestyle.push({
        id: uid(), profileId: pid, tracker: tab, date, fields: { [key]: value }, rating: 0, notes: "",
      });
    });

  const saveMeta = (patch: Partial<LifestyleEntry>) =>
    update((d) => {
      const e = d.lifestyle.find((x) => x.profileId === pid && x.tracker === tab && x.date === date);
      if (e) Object.assign(e, patch);
      else d.lifestyle.push({
        id: uid(), profileId: pid, tracker: tab, date, fields: {}, rating: 0, notes: "", ...patch,
      });
    });

  return (
    <div>
      <PageHeader
        eyebrow="Every day"
        title="Daily Rituals"
        sub="Eight small trackers for the life around your protocols — filled in seconds, kept for years."
      />

      <Tabs
        tabs={LIFESTYLE_TRACKERS.map((t) => ({ key: t.key, label: t.label }))}
        active={tab}
        onChange={setTab}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <p className="font-display text-lg font-medium">{tracker.label} · today</p>
          <p className="handnote mb-5 mt-0.5 text-[0.83rem] text-wine-500 dark:text-wine-300">{tracker.tagline}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {tracker.fields.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                className={f.full ? "sm:col-span-2" : undefined}
                labelClassName={f.full ? undefined : "min-h-[2.4em]"}
              >
                {f.multiline ? (
                  <Textarea
                    rows={3}
                    value={todayEntry?.fields[f.key] ?? ""}
                    onChange={(e) => saveField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <Input
                    className="truncate"
                    value={todayEntry?.fields[f.key] ?? ""}
                    onChange={(e) => saveField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                )}
              </Field>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[0.8rem] font-semibold text-ink-soft">How did it feel?</p>
              <RatingDots value={todayEntry?.rating ?? 0} onChange={(v) => saveMeta({ rating: v })} tone="champagne" />
            </div>
            <Field label="Note">
              <Textarea rows={2} value={todayEntry?.notes ?? ""} onChange={(e) => saveMeta({ notes: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card>
          <p className="mb-3 font-display text-lg font-medium">Recent days</p>
          {entries.length === 0 ? (
            <p className="text-[0.85rem] text-ink-faint">Your history will gather here, one gentle day at a time.</p>
          ) : (
            <ul className="space-y-2.5">
              {entries.slice(0, 10).map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-2 border-b border-line pb-2.5 last:border-0">
                  <div className="min-w-0">
                    <p className="text-[0.82rem] font-semibold text-ink">{fmtDate(e.date)}</p>
                    <p className="truncate text-[0.78rem] text-ink-faint">
                      {Object.values(e.fields).filter(Boolean).slice(0, 2).join(" · ") || e.notes || "—"}
                    </p>
                  </div>
                  <button
                    onClick={() => update((d) => void (d.lifestyle = d.lifestyle.filter((x) => x.id !== e.id)))}
                    aria-label="Delete day" className="rounded-full p-1.5 text-ink-faint hover:text-blush-500"
                  ><Trash2 size={13} /></button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

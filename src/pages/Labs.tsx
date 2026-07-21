import React, { useMemo, useRef, useState } from "react";
import { FlaskConical, Plus, Trash2, FileUp, Sparkle } from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, Chip, Tabs,
  EmptyState, Sparkline, Disclaimer, useForm, cx,
} from "../components/ui";
import { LAB_PANELS } from "../data/wellness";
import type { LabResult } from "../lib/types";

export function Labs() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [tab, setTab] = useState("binder");
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState("All");
  const fileRef = useRef<HTMLInputElement>(null);

  const labs = byProfile(db.labs, pid).sort((a, b) => b.date.localeCompare(a.date));
  const filtered = panel === "All" ? labs : labs.filter((l) => l.panel === panel);

  /* group by marker for trends */
  const markers = useMemo(() => {
    const map = new Map<string, LabResult[]>();
    for (const l of labs) {
      if (!l.marker) continue;
      const k = `${l.panel} · ${l.marker}`;
      map.set(k, [...(map.get(k) ?? []), l]);
    }
    return [...map.entries()]
      .map(([key, rows]) => ({
        key,
        rows: rows.sort((a, b) => a.date.localeCompare(b.date)),
        points: rows
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((r) => parseFloat(r.value))
          .filter((v) => !isNaN(v)),
      }))
      .filter((m) => m.points.length >= 2);
  }, [labs]);

  return (
    <div>
      <PageHeader
        eyebrow="Body lab"
        title="Labs & Biomarker Binder"
        sub="Every result in one elegant binder — filed by panel, charted over time, ready for your next appointment."
        actions={
          <>
            <Button variant="outline" onClick={() => fileRef.current?.click()}><FileUp size={15} /> Attach PDF</Button>
            <Button onClick={() => setOpen(true)}><Plus size={16} /> Add result</Button>
          </>
        }
      />
      <input
        ref={fileRef} type="file" accept=".pdf,image/*" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            update((d) =>
              void d.labs.push({
                id: uid(), profileId: pid, panel: "Custom", marker: "", value: "", unit: "",
                range: "", date: today(), flagged: false,
                notes: "Uploaded document — add individual markers from it when ready.",
                fileName: f.name,
              })
            );
            setTab("binder");
          }
          e.target.value = "";
        }}
      />

      <Tabs
        tabs={[
          { key: "binder", label: `Binder (${labs.length})` },
          { key: "trends", label: "Trends" },
          { key: "summary", label: "AI summary" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "binder" && (
        <>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {["All", ...LAB_PANELS].map((p) => (
              <Chip key={p} active={panel === p} onClick={() => setPanel(p)}>{p}</Chip>
            ))}
          </div>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<FlaskConical size={26} />}
              title="Your binder is empty"
              body="Add results by panel — CBC, thyroid, hormones, lipids and more — or attach the PDF from your portal. Over time this becomes the story of your bloodwork."
              action={<Button variant="soft" onClick={() => setOpen(true)}>Add my first result</Button>}
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((l) => (
                <Card key={l.id} className="flex items-center justify-between gap-4 !py-3.5">
                  <div className="min-w-0">
                    <p className="font-medium text-ink-strong">
                      {l.marker || l.fileName || l.panel}
                      {l.value && (
                        <span className={cx("ml-2", l.flagged ? "font-semibold text-blush-500 dark:text-blush-300" : "text-ink-soft")}>
                          {l.value} {l.unit}
                        </span>
                      )}
                      {l.flagged && <span className="ml-1.5 rounded-full bg-blush-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-blush-500 dark:bg-blush-500/20 dark:text-blush-200">flag</span>}
                    </p>
                    <p className="text-[0.78rem] text-ink-faint">
                      {l.panel} · {fmtDate(l.date)} {l.range && `· ref: ${l.range}`} {l.fileName && `· 📎 ${l.fileName}`}
                    </p>
                  </div>
                  <button
                    onClick={() => update((d) => void (d.labs = d.labs.filter((x) => x.id !== l.id)))}
                    aria-label="Delete" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
                  ><Trash2 size={15} /></button>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "trends" && (
        markers.length === 0 ? (
          <EmptyState
            icon={<FlaskConical size={26} />}
            title="Trends need two data points"
            body="Add the same marker from two different draw dates — TSH in March, TSH in September — and its trend line appears here."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {markers.map((m) => (
              <Card key={m.key} className="p-4">
                <p className="font-semibold text-ink-strong">{m.key}</p>
                <p className="text-xs text-ink-faint">
                  {m.rows[0].value} {m.rows[0].unit} → {m.rows[m.rows.length - 1].value} {m.rows[m.rows.length - 1].unit}
                </p>
                <div className="mt-2"><Sparkline points={m.points} tone="gold" /></div>
              </Card>
            ))}
          </div>
        )
      )}

      {tab === "summary" && (
        <Card className="mx-auto max-w-2xl text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 -rotate-6 items-center justify-center rounded-2xl bg-champagne-200/60 text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">
            <Sparkle size={22} />
          </span>
          <h3 className="font-display text-xl font-medium">AI lab summaries · coming soon</h3>
          <p className="mx-auto mt-2 max-w-md text-[0.9rem] leading-relaxed text-ink-soft">
            A future update will let AI organize your results and describe <em>trends</em> in plain
            language — which markers moved, which stayed steady — so your appointment starts smarter.
          </p>
          <p className="mx-auto mt-4 max-w-md rounded-2xl bg-sunken/70 px-4 py-3 text-[0.78rem] leading-relaxed text-ink-faint">
            Our AI rule, in writing: it may summarize and organize your information. It will never
            diagnose, prescribe, or tell you what a result means for your health — that conversation
            belongs to you and your provider.
          </p>
        </Card>
      )}

      {open && <LabModal onClose={() => setOpen(false)} />}

      <Disclaimer>
        Reference ranges vary by lab and by person. A flag here is your own bookmark — interpretation
        of any result always belongs with your provider.
      </Disclaimer>
    </div>
  );
}

function LabModal({ onClose }: { onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const { form, set } = useForm<LabResult>({
    id: uid(), profileId: activeProfile.id, panel: "Thyroid", marker: "", value: "",
    unit: "", range: "", date: today(), flagged: false, notes: "", fileName: "",
  });
  return (
    <Modal open onClose={onClose} title="Add lab result" wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Panel">
          <Select value={form.panel} onChange={(e) => set("panel", e.target.value)}>
            {LAB_PANELS.map((p) => <option key={p}>{p}</option>)}
          </Select>
        </Field>
        <Field label="Marker"><Input value={form.marker} onChange={(e) => set("marker", e.target.value)} placeholder="e.g. TSH · Ferritin · A1c" /></Field>
        <Field label="Value"><Input value={form.value} onChange={(e) => set("value", e.target.value)} placeholder="e.g. 2.1" /></Field>
        <Field label="Unit"><Input value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="e.g. mIU/L" /></Field>
        <Field label="Lab reference range"><Input value={form.range} onChange={(e) => set("range", e.target.value)} placeholder="as printed on your report" /></Field>
        <Field label="Draw date"><Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Bookmark as flagged?" className="sm:col-span-2">
          <label className="flex items-center gap-2 text-[0.9rem] text-ink">
            <input type="checkbox" checked={form.flagged} onChange={(e) => set("flagged", e.target.checked)} className="h-4 w-4 accent-[--color-blush-400]" />
            Mark to discuss with my provider
          </label>
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Fasted? Time of day? Cycle day?" />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { update((d) => void d.labs.push(form)); onClose(); }}>Save result</Button>
      </div>
    </Modal>
  );
}

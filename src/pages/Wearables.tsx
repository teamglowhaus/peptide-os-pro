import React, { useState } from "react";
import { Watch, Plus, Trash2 } from "lucide-react";
import { useStore, byProfile, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, EmptyState, useForm,
} from "../components/ui";
import { WEARABLE_BRANDS } from "../data/wellness";
import type { WearableDevice } from "../lib/types";

export function Wearables() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [open, setOpen] = useState(false);
  const devices = byProfile(db.wearables, pid);

  return (
    <div>
      <PageHeader
        eyebrow="Body lab"
        title="Wearables"
        sub="Your ring, band, watch, and sensors — with a home for the numbers they whisper each morning."
        actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Add device</Button>}
      />

      {devices.length === 0 ? (
        <EmptyState
          icon={<Watch size={26} />}
          title="No devices yet"
          body="Add your Oura, WHOOP, Apple Watch, CGM, or smart scale. Log the morning readings you care about on your Today page — HRV and sleep feed your Biohacker Score."
          action={<Button variant="soft" onClick={() => setOpen(true)}>Add my first device</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {devices.map((w) => (
            <Card key={w.id} hover className="group flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-xl bg-sage-100 text-sage-500 transition-transform group-hover:rotate-0 dark:bg-sage-600/25 dark:text-sage-300">
                  <Watch size={17} />
                </span>
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-sage-500 dark:text-sage-300">{w.brand}</p>
                  <p className="font-display text-lg font-medium text-ink-strong">{w.model || w.brand}</p>
                  {w.metricFocus && <p className="mt-1 text-[0.85rem] text-ink-soft">Watching: {w.metricFocus}</p>}
                  {w.syncNotes && <p className="mt-1 text-[0.78rem] text-ink-faint">{w.syncNotes}</p>}
                </div>
              </div>
              <button
                onClick={() => update((d) => void (d.wearables = d.wearables.filter((x) => x.id !== w.id)))}
                aria-label="Remove device" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
              ><Trash2 size={15} /></button>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6 bg-sunken/40">
        <p className="font-display text-lg font-medium">Auto-sync · on the roadmap</p>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink-soft">
          Direct imports from Oura, WHOOP, Apple Health and more are part of the cloud roadmap. For
          now, your morning HRV and sleep entries on the Today page take about four seconds — a
          ritual many members end up keeping even after sync arrives.
        </p>
      </Card>

      {open && <WearableModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function WearableModal({ onClose }: { onClose: () => void }) {
  const { update, activeProfile } = useStore();
  const { form, set } = useForm<WearableDevice>({
    id: uid(), profileId: activeProfile.id, brand: "Oura", model: "",
    metricFocus: "", syncNotes: "", active: true,
  });
  return (
    <Modal open onClose={onClose} title="Add wearable">
      <div className="space-y-4">
        <Field label="Brand">
          <Select value={form.brand} onChange={(e) => set("brand", e.target.value)}>
            {WEARABLE_BRANDS.map((b) => <option key={b}>{b}</option>)}
          </Select>
        </Field>
        <Field label="Model"><Input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="e.g. Ring Gen 4" /></Field>
        <Field label="Metrics you watch"><Input value={form.metricFocus} onChange={(e) => set("metricFocus", e.target.value)} placeholder="HRV · readiness · deep sleep" /></Field>
        <Field label="Notes"><Textarea rows={2} value={form.syncNotes} onChange={(e) => set("syncNotes", e.target.value)} placeholder="Charging routine, app quirks…" /></Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { update((d) => void d.wearables.push(form)); onClose(); }}>Save device</Button>
      </div>
    </Modal>
  );
}

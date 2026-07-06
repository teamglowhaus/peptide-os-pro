import React, { useState } from "react";
import { Users, Plus, Trash2, Pencil, ArrowRightCircle } from "lucide-react";
import { useStore, byProfile, uid, today } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Select, EmptyState, useForm,
} from "../components/ui";
import type { Profile, ProfileKind } from "../lib/types";

const KIND_LABELS: Record<ProfileKind, string> = {
  self: "Me", spouse: "Spouse / partner", child: "Child", parent: "Parent", custom: "Custom",
};

const EMOJI_CHOICES = ["🌿", "🌸", "🌙", "☀️", "🦋", "🌾", "🫧", "🌷", "🍃", "✨"];

export function Household() {
  const { db, update, activeProfile, setActiveProfile } = useStore();
  const [editing, setEditing] = useState<Profile | null>(null);

  const countsFor = (pid: string) => ({
    supplements: byProfile(db.supplements, pid).filter((s) => s.active).length,
    injectables: byProfile(db.injectables, pid).filter((i) => i.active).length,
    hormones: byProfile(db.hormones, pid).filter((h) => h.active).length,
    labs: byProfile(db.labs, pid).length,
    appointments: byProfile(db.appointments, pid).filter((a) => !a.done).length,
  });

  return (
    <div>
      <PageHeader
        eyebrow="Your world"
        title="Household Profiles"
        sub="Every person you care for gets their own private space — supplements, protocols, labs and appointments, all kept separate."
        actions={
          <Button onClick={() => setEditing({ id: uid(), kind: "spouse", name: "", emoji: "🌸", createdAt: today() })}>
            <Plus size={16} /> Add person
          </Button>
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        {db.profiles.map((p) => {
          const c = countsFor(p.id);
          const isActive = p.id === activeProfile.id;
          return (
            <Card key={p.id} hover className={isActive ? "!border-champagne-400" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush-100 text-2xl dark:bg-blush-500/25">
                    {p.emoji}
                  </span>
                  <div>
                    <p className="font-display text-xl font-medium text-ink-strong">{p.name}</p>
                    <p className="text-[0.75rem] uppercase tracking-wider text-ink-faint">{KIND_LABELS[p.kind]}</p>
                  </div>
                </div>
                <div className="flex">
                  <button onClick={() => setEditing(p)} aria-label="Edit" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-ink"><Pencil size={15} /></button>
                  {p.kind !== "self" && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${p.name}'s profile and all their data?`))
                          update((d) => {
                            d.profiles = d.profiles.filter((x) => x.id !== p.id);
                            if (d.settings.activeProfileId === p.id) d.settings.activeProfileId = d.profiles[0].id;
                            // scrub their records
                            const gone = (r: { profileId: string }) => r.profileId !== p.id;
                            d.supplements = d.supplements.filter(gone);
                            d.supplementChecks = d.supplementChecks.filter(gone);
                            d.injectables = d.injectables.filter(gone);
                            d.injectionLogs = d.injectionLogs.filter(gone);
                            d.hormones = d.hormones.filter(gone);
                            d.symptomLogs = d.symptomLogs.filter(gone);
                            d.providerQuestions = d.providerQuestions.filter(gone);
                            d.redLight = d.redLight.filter(gone);
                            d.coldPlunge = d.coldPlunge.filter(gone);
                            d.sauna = d.sauna.filter(gone);
                            d.toolSessions = d.toolSessions.filter(gone);
                            d.dailyLogs = d.dailyLogs.filter(gone);
                            d.labs = d.labs.filter(gone);
                            d.appointments = d.appointments.filter(gone);
                            d.wearables = d.wearables.filter(gone);
                            d.lifestyle = d.lifestyle.filter(gone);
                          });
                      }}
                      aria-label="Delete" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
                    ><Trash2 size={15} /></button>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 text-[0.72rem]">
                <Pillow label={`${c.supplements} supplements`} />
                <Pillow label={`${c.injectables} injectables`} />
                <Pillow label={`${c.hormones} hormone therapies`} />
                <Pillow label={`${c.labs} lab entries`} />
              </div>
              <div className="mt-4 border-t border-line pt-3.5">
                {isActive ? (
                  <p className="text-[0.82rem] font-semibold text-champagne-600 dark:text-champagne-300">✦ Currently viewing</p>
                ) : (
                  <Button variant="soft" onClick={() => setActiveProfile(p.id)}>
                    <ArrowRightCircle size={15} /> Switch to {p.name}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {editing && (
        <ProfileEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            update((d) => {
              const i = d.profiles.findIndex((x) => x.id === p.id);
              if (i >= 0) d.profiles[i] = p;
              else d.profiles.push(p);
            });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function Pillow({ label }: { label: string }) {
  return <span className="rounded-full bg-sunken px-2.5 py-1 font-medium text-ink-soft">{label}</span>;
}

function ProfileEditor({
  initial, onSave, onClose,
}: { initial: Profile; onSave: (p: Profile) => void; onClose: () => void }) {
  const { form, set } = useForm(initial);
  return (
    <Modal open onClose={onClose} title={initial.name || "Add household member"}>
      <div className="space-y-4">
        <Field label="Name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Their first name" /></Field>
        <Field label="Relationship">
          <Select value={form.kind} onChange={(e) => set("kind", e.target.value as ProfileKind)} disabled={initial.kind === "self"}>
            {(Object.keys(KIND_LABELS) as ProfileKind[]).map((k) => (
              <option key={k} value={k}>{KIND_LABELS[k]}</option>
            ))}
          </Select>
        </Field>
        <Field label="Avatar">
          <div className="flex flex-wrap gap-2">
            {EMOJI_CHOICES.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => set("emoji", e)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg ${
                  form.emoji === e ? "border-champagne-400 bg-champagne-200/40" : "border-line hover:border-line-strong"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => form.name.trim() && onSave(form)} disabled={!form.name.trim()}>Save profile</Button>
      </div>
    </Modal>
  );
}

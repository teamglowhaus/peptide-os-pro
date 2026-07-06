import React, { useState } from "react";
import { PawPrint, Plus, Trash2, Pencil } from "lucide-react";
import { useStore, today, fmtDate, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, Tabs, EmptyState,
  Disclaimer, useForm, cx,
} from "../components/ui";
import type { PetProfile, PetCareItem, PetAppointment, PetLogEntry, PetSpecies } from "../lib/types";

const SPECIES_EMOJI: Record<PetSpecies, string> = {
  dog: "🐕", cat: "🐈", horse: "🐎", bird: "🦜", rabbit: "🐇", other: "🐾",
};

function blankPet(): PetProfile {
  return {
    id: uid(), name: "", species: "dog", breed: "", weight: "", food: "", notes: "",
    supplements: [], medications: [], vaccines: [], appointments: [], symptoms: [],
    weights: [], custom: [], createdAt: today(),
  };
}

export function Pets() {
  const { db, update } = useStore();
  const [editing, setEditing] = useState<PetProfile | null>(null);
  const [selected, setSelected] = useState<string | null>(db.pets[0]?.id ?? null);

  const pet = db.pets.find((p) => p.id === selected) ?? db.pets[0] ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Your world"
        title="Pet Wellness"
        sub="Because their supplements, vet visits, and little symptoms deserve a beautiful binder too."
        actions={<Button onClick={() => setEditing(blankPet())}><Plus size={16} /> Add pet</Button>}
      />

      {db.pets.length === 0 ? (
        <EmptyState
          icon={<PawPrint size={26} />}
          title="No furry (or feathery) profiles yet"
          body="Add each companion — their food, meds, vaccine records and vet dates all live here, and reminders surface on your Today page."
          action={<Button variant="soft" onClick={() => setEditing(blankPet())}>Add my first pet</Button>}
        />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {db.pets.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={cx(
                  "flex items-center gap-2.5 rounded-full border px-4 py-2 transition-colors",
                  pet?.id === p.id
                    ? "border-champagne-400 bg-champagne-200/40 dark:bg-champagne-600/20"
                    : "border-line bg-card hover:border-line-strong"
                )}
              >
                <span className="text-lg">{SPECIES_EMOJI[p.species]}</span>
                <span className="font-semibold text-ink-strong">{p.name}</span>
              </button>
            ))}
          </div>
          {pet && <PetDetail pet={pet} onEdit={() => setEditing(pet)} />}
        </>
      )}

      {editing && (
        <PetEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            update((d) => {
              const i = d.pets.findIndex((x) => x.id === p.id);
              if (i >= 0) d.pets[i] = p;
              else d.pets.push(p);
            });
            setSelected(p.id);
            setEditing(null);
          }}
        />
      )}

      <Disclaimer>
        A loving record-keeper, not veterinary advice — dosing and care decisions for your animals
        always belong with your veterinarian.
      </Disclaimer>
    </div>
  );
}

function PetDetail({ pet, onEdit }: { pet: PetProfile; onEdit: () => void }) {
  const { update } = useStore();
  const [tab, setTab] = useState("care");

  const addItem = (listKey: "supplements" | "medications" | "vaccines" | "custom", item: PetCareItem) =>
    update((d) => {
      const p = d.pets.find((x) => x.id === pet.id);
      if (p) p[listKey].push(item);
    });

  const removeItem = (listKey: "supplements" | "medications" | "vaccines" | "custom", id: string) =>
    update((d) => {
      const p = d.pets.find((x) => x.id === pet.id);
      if (p) p[listKey] = p[listKey].filter((x) => x.id !== id);
    });

  return (
    <div>
      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-3xl dark:bg-sage-600/25">
            {SPECIES_EMOJI[pet.species]}
          </span>
          <div>
            <h2 className="font-display text-2xl font-medium text-ink-strong">{pet.name}</h2>
            <p className="text-[0.85rem] text-ink-soft">
              {[pet.breed, pet.weight && `${pet.weight}`, pet.food && `eats ${pet.food}`].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}><Pencil size={15} /> Edit profile</Button>
          <Button variant="danger" onClick={() => {
            if (confirm(`Remove ${pet.name}'s profile? This can't be undone.`))
              update((d) => void (d.pets = d.pets.filter((x) => x.id !== pet.id)));
          }}><Trash2 size={15} /></Button>
        </div>
      </Card>

      <Tabs
        tabs={[
          { key: "care", label: "Supplements & meds" },
          { key: "vaccines", label: "Vaccines" },
          { key: "appointments", label: "Vet visits" },
          { key: "log", label: "Symptoms & weight" },
          { key: "custom", label: "Custom care" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "care" && (
        <div className="grid gap-4 md:grid-cols-2">
          <CareList title="Supplements" items={pet.supplements}
            onAdd={(i) => addItem("supplements", i)} onRemove={(id) => removeItem("supplements", id)}
            placeholder="e.g. Omega-3 · per vet/label" />
          <CareList title="Medications" items={pet.medications}
            onAdd={(i) => addItem("medications", i)} onRemove={(id) => removeItem("medications", id)}
            placeholder="e.g. Heartworm preventive" />
        </div>
      )}
      {tab === "vaccines" && (
        <CareList title="Vaccine records" items={pet.vaccines} dated
          onAdd={(i) => addItem("vaccines", i)} onRemove={(id) => removeItem("vaccines", id)}
          placeholder="e.g. Rabies · 3-year" />
      )}
      {tab === "appointments" && <PetAppointments pet={pet} />}
      {tab === "log" && <PetLogs pet={pet} />}
      {tab === "custom" && (
        <CareList title="Custom care tracker" items={pet.custom}
          onAdd={(i) => addItem("custom", i)} onRemove={(id) => removeItem("custom", id)}
          placeholder="e.g. Grooming · teeth brushing · training" />
      )}
    </div>
  );
}

function CareList({
  title, items, onAdd, onRemove, placeholder, dated,
}: {
  title: string; items: PetCareItem[]; placeholder: string; dated?: boolean;
  onAdd: (i: PetCareItem) => void; onRemove: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [date, setDate] = useState("");
  const add = () => {
    if (!name.trim()) return;
    onAdd({ id: uid(), name: name.trim(), detail, schedule: "", date, notes: "" });
    setName(""); setDetail(""); setDate("");
  };
  return (
    <Card>
      <p className="mb-3 font-display text-lg font-medium">{title}</p>
      <div className="flex flex-wrap gap-2">
        <Input className="min-w-36 flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder={placeholder} onKeyDown={(e) => e.key === "Enter" && add()} />
        <Input className="min-w-32 flex-1" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="detail / dose per vet" onKeyDown={(e) => e.key === "Enter" && add()} />
        {dated && <Input type="date" className="w-40" value={date} onChange={(e) => setDate(e.target.value)} />}
        <Button onClick={add}><Plus size={15} /></Button>
      </div>
      <ul className="mt-4 space-y-2">
        {items.length === 0 && <p className="text-[0.83rem] text-ink-faint">Nothing here yet.</p>}
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-3 rounded-xl bg-sunken/60 px-3.5 py-2.5">
            <div className="min-w-0">
              <p className="font-medium text-ink">{i.name}</p>
              <p className="text-[0.75rem] text-ink-faint">{[i.detail, i.date && fmtDate(i.date)].filter(Boolean).join(" · ")}</p>
            </div>
            <button onClick={() => onRemove(i.id)} aria-label="Remove" className="rounded-full p-1.5 text-ink-faint hover:text-blush-500">
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PetAppointments({ pet }: { pet: PetProfile }) {
  const { update } = useStore();
  const { form, set, setForm } = useForm<PetAppointment>({ id: uid(), date: "", reason: "", clinic: "", notes: "" });
  const add = () => {
    if (!form.date || !form.reason.trim()) return;
    update((d) => {
      const p = d.pets.find((x) => x.id === pet.id);
      if (p) p.appointments.push({ ...form, id: uid() });
    });
    setForm({ id: uid(), date: "", reason: "", clinic: "", notes: "" });
  };
  return (
    <Card>
      <p className="mb-3 font-display text-lg font-medium">Vet appointments</p>
      <div className="flex flex-wrap gap-2">
        <Input type="date" className="w-40" value={form.date} onChange={(e) => set("date", e.target.value)} />
        <Input className="min-w-36 flex-1" value={form.reason} onChange={(e) => set("reason", e.target.value)} placeholder="Reason — annual, dental…" />
        <Input className="min-w-32 flex-1" value={form.clinic} onChange={(e) => set("clinic", e.target.value)} placeholder="Clinic" />
        <Button onClick={add}><Plus size={15} /></Button>
      </div>
      <ul className="mt-4 space-y-2">
        {pet.appointments.length === 0 && <p className="text-[0.83rem] text-ink-faint">No visits scheduled.</p>}
        {[...pet.appointments].sort((a, b) => a.date.localeCompare(b.date)).map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl bg-sunken/60 px-3.5 py-2.5">
            <div>
              <p className="font-medium text-ink">{a.reason} {a.clinic && <span className="font-normal text-ink-faint">· {a.clinic}</span>}</p>
              <p className="text-[0.75rem] text-ink-faint">{fmtDate(a.date)}</p>
            </div>
            <button
              onClick={() => update((d) => {
                const p = d.pets.find((x) => x.id === pet.id);
                if (p) p.appointments = p.appointments.filter((x) => x.id !== a.id);
              })}
              aria-label="Remove" className="rounded-full p-1.5 text-ink-faint hover:text-blush-500"
            ><Trash2 size={14} /></button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PetLogs({ pet }: { pet: PetProfile }) {
  const { update } = useStore();
  const [sym, setSym] = useState("");
  const [wt, setWt] = useState("");
  const push = (key: "symptoms" | "weights", value: string) => {
    if (!value.trim()) return;
    update((d) => {
      const p = d.pets.find((x) => x.id === pet.id);
      if (p) p[key].push({ id: uid(), date: today(), value: value.trim(), notes: "" });
    });
  };
  const List = ({ rows, listKey }: { rows: PetLogEntry[]; listKey: "symptoms" | "weights" }) => (
    <ul className="mt-4 space-y-2">
      {rows.length === 0 && <p className="text-[0.83rem] text-ink-faint">No entries yet.</p>}
      {[...rows].sort((a, b) => b.date.localeCompare(a.date)).map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-sunken/60 px-3.5 py-2.5">
          <p className="text-[0.9rem] text-ink"><span className="text-ink-faint">{fmtDate(r.date)} · </span>{r.value}</p>
          <button
            onClick={() => update((d) => {
              const p = d.pets.find((x) => x.id === pet.id);
              if (p) p[listKey] = p[listKey].filter((x) => x.id !== r.id);
            })}
            aria-label="Remove" className="rounded-full p-1.5 text-ink-faint hover:text-blush-500"
          ><Trash2 size={14} /></button>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <p className="mb-3 font-display text-lg font-medium">Symptom log</p>
        <div className="flex gap-2">
          <Input value={sym} onChange={(e) => setSym(e.target.value)} placeholder="e.g. limping after walks" onKeyDown={(e) => { if (e.key === "Enter") { push("symptoms", sym); setSym(""); } }} />
          <Button onClick={() => { push("symptoms", sym); setSym(""); }}><Plus size={15} /></Button>
        </div>
        <List rows={pet.symptoms} listKey="symptoms" />
      </Card>
      <Card>
        <p className="mb-3 font-display text-lg font-medium">Weight log</p>
        <div className="flex gap-2">
          <Input value={wt} onChange={(e) => setWt(e.target.value)} placeholder="e.g. 62 lb" onKeyDown={(e) => { if (e.key === "Enter") { push("weights", wt); setWt(""); } }} />
          <Button onClick={() => { push("weights", wt); setWt(""); }}><Plus size={15} /></Button>
        </div>
        <List rows={pet.weights} listKey="weights" />
      </Card>
    </div>
  );
}

function PetEditor({
  initial, onSave, onClose,
}: { initial: PetProfile; onSave: (p: PetProfile) => void; onClose: () => void }) {
  const { form, set } = useForm(initial);
  return (
    <Modal open onClose={onClose} title={initial.name || "Add a pet"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Willow" /></Field>
        <Field label="Species">
          <Select value={form.species} onChange={(e) => set("species", e.target.value as PetSpecies)}>
            <option value="dog">Dog</option><option value="cat">Cat</option><option value="horse">Horse</option>
            <option value="bird">Bird</option><option value="rabbit">Rabbit</option><option value="other">Other</option>
          </Select>
        </Field>
        <Field label="Breed"><Input value={form.breed} onChange={(e) => set("breed", e.target.value)} /></Field>
        <Field label="Weight"><Input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 12 lb" /></Field>
        <Field label="Food" className="sm:col-span-2"><Input value={form.food} onChange={(e) => set("food", e.target.value)} placeholder="Brand, portions, quirks" /></Field>
        <Field label="Notes" className="sm:col-span-2"><Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => form.name.trim() && onSave(form)} disabled={!form.name.trim()}>Save pet</Button>
      </div>
    </Modal>
  );
}

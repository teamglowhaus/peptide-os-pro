import React, { useMemo, useState } from "react";
import { Plus, Syringe, MapPin, Archive, IdCard, Trash2, Pencil } from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid, addDays } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, Chip, Tabs,
  EmptyState, DoseNote, SearchBox, Toggle, cx, useForm,
} from "../components/ui";
import { PEPTIDE_LIBRARY, INJECTABLE_CATEGORIES, INJECTION_SITES } from "../data/peptides";
import type { InjectableProtocol, InjectionLog, InjectableCategory } from "../lib/types";

function blankProtocol(profileId: string): InjectableProtocol {
  return {
    id: uid(), profileId, name: "", category: "Peptide", goal: "", provider: "",
    startDate: today(), endDate: "", vialSize: "", storage: "", reconstitution: "",
    providerDose: "", units: "", schedule: "", injectionSite: "", sideEffects: "",
    notes: "", refillReminder: "", inventory: "", active: true, createdAt: today(),
  };
}

export function Peptides() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [tab, setTab] = useState("protocols");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<InjectableProtocol | null>(null);
  const [logFor, setLogFor] = useState<InjectableProtocol | null>(null);
  const [travelFor, setTravelFor] = useState<InjectableProtocol | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<InjectableCategory | "All">("All");

  const protocols = byProfile(db.injectables, pid);
  const active = protocols.filter((p) => p.active);
  const archived = protocols.filter((p) => !p.active);

  const library = useMemo(() => {
    const q = search.toLowerCase();
    return PEPTIDE_LIBRARY.filter(
      (e) =>
        (catFilter === "All" || e.category === catFilter) &&
        (!q || e.name.toLowerCase().includes(q) || e.tags.some((t) => t.includes(q)))
    );
  }, [search, catFilter]);

  const startFromLibrary = (name: string, category: InjectableCategory, storage: string) => {
    setEditing({ ...blankProtocol(pid), name, category, storage });
    setEditorOpen(true);
  };

  const save = (p: InjectableProtocol) => {
    update((d) => {
      const idx = d.injectables.findIndex((x) => x.id === p.id);
      if (idx >= 0) d.injectables[idx] = p;
      else d.injectables.push(p);
    });
    setEditorOpen(false);
    setEditing(null);
    setTab("protocols");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Protocols"
        title="Peptides & Injectables"
        sub="Your protocols, vials, rotation map and refills — organized like a private apothecary."
        actions={
          <Button onClick={() => { setEditing(blankProtocol(pid)); setEditorOpen(true); }}>
            <Plus size={16} /> New protocol
          </Button>
        }
      />

      <Tabs
        tabs={[
          { key: "protocols", label: `My protocols (${active.length})` },
          { key: "library", label: "Library" },
          { key: "log", label: "Injection log" },
          ...(archived.length ? [{ key: "archive", label: `Archive (${archived.length})` }] : []),
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "protocols" && (
        active.length === 0 ? (
          <EmptyState
            icon={<Syringe size={26} />}
            title="No protocols yet"
            body="Start from the library — semaglutide to NAD+ and everything between — or create a fully custom entry. Doses always come from your own provider."
            action={<Button variant="soft" onClick={() => setTab("library")}>Browse the library</Button>}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((p) => (
              <ProtocolCard
                key={p.id}
                p={p}
                logs={db.injectionLogs.filter((l) => l.protocolId === p.id)}
                onLog={() => setLogFor(p)}
                onEdit={() => { setEditing(p); setEditorOpen(true); }}
                onTravel={() => setTravelFor(p)}
                onArchive={() => update((d) => {
                  const x = d.injectables.find((i) => i.id === p.id);
                  if (x) x.active = false;
                })}
              />
            ))}
          </div>
        )
      )}

      {tab === "library" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <SearchBox value={search} onChange={setSearch} placeholder="Search the library…" />
          </div>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {(["All", ...INJECTABLE_CATEGORIES] as const).map((c) => (
              <Chip key={c} active={catFilter === c} onClick={() => setCatFilter(c as any)}>
                {c}
              </Chip>
            ))}
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {library.map((e) => (
              <button
                key={e.name}
                onClick={() => startFromLibrary(e.name, e.category, e.storageNote)}
                className="card card-hover p-4 text-left"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-champagne-600 dark:text-champagne-300">
                  {e.category}
                </p>
                <p className="mt-0.5 font-display text-lg font-medium text-ink-strong">{e.name}</p>
                <p className="mt-1 text-[0.8rem] text-ink-soft">{e.commonGoal}</p>
                <p className="mt-2 text-[0.72rem] text-ink-faint">❄ {e.storageNote}</p>
              </button>
            ))}
            <button
              onClick={() => { setEditing(blankProtocol(pid)); setEditorOpen(true); }}
              className="card card-hover flex flex-col items-center justify-center border-dashed p-4 text-center"
            >
              <Plus size={20} className="mb-1 text-ink-faint" />
              <p className="font-medium text-ink-soft">Custom injectable</p>
              <p className="mt-0.5 text-[0.75rem] text-ink-faint">Anything your provider prescribes</p>
            </button>
          </div>
          <DoseNote />
        </div>
      )}

      {tab === "log" && <InjectionLogView protocols={protocols} />}

      {tab === "archive" && (
        <div className="grid gap-3 md:grid-cols-2">
          {archived.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg font-medium text-ink-strong">{p.name}</p>
                <p className="text-[0.8rem] text-ink-faint">{p.category} · started {fmtDate(p.startDate)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => update((d) => {
                  const x = d.injectables.find((i) => i.id === p.id);
                  if (x) x.active = true;
                })}>Restore</Button>
                <Button variant="danger" onClick={() => update((d) => {
                  d.injectables = d.injectables.filter((i) => i.id !== p.id);
                  d.injectionLogs = d.injectionLogs.filter((l) => l.protocolId !== p.id);
                })}><Trash2 size={15} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editorOpen && editing && (
        <ProtocolEditor
          initial={editing}
          onSave={save}
          onClose={() => { setEditorOpen(false); setEditing(null); }}
        />
      )}
      {logFor && <LogInjectionModal protocol={logFor} onClose={() => setLogFor(null)} />}
      {travelFor && <TravelCard protocol={travelFor} onClose={() => setTravelFor(null)} />}
    </div>
  );
}

function ProtocolCard({
  p, logs, onLog, onEdit, onTravel, onArchive,
}: {
  p: InjectableProtocol;
  logs: InjectionLog[];
  onLog: () => void;
  onEdit: () => void;
  onTravel: () => void;
  onArchive: () => void;
}) {
  const last = [...logs].sort((a, b) => b.date.localeCompare(a.date))[0];
  const refillSoon =
    p.refillReminder && p.refillReminder <= addDays(today(), 7);
  return (
    <Card hover className="group flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 -rotate-6 items-center justify-center rounded-xl bg-champagne-200/60 text-champagne-600 transition-transform group-hover:rotate-0 dark:bg-champagne-600/25 dark:text-champagne-200">
            <Syringe size={17} />
          </span>
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-champagne-600 dark:text-champagne-300">
              {p.category}
            </p>
            <h3 className="font-display text-xl font-medium text-ink-strong">{p.name}</h3>
            {p.goal && <p className="mt-0.5 text-[0.85rem] text-ink-soft">{p.goal}</p>}
          </div>
        </div>
        <button onClick={onEdit} aria-label="Edit" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-ink">
          <Pencil size={15} />
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.83rem]">
        {p.providerDose && <Info k="Provider dose" v={`${p.providerDose}${p.units ? ` ${p.units}` : ""}`} />}
        {p.schedule && <Info k="Schedule" v={p.schedule} />}
        {p.vialSize && <Info k="Vial" v={p.vialSize} />}
        {p.storage && <Info k="Storage" v={p.storage} />}
        {p.inventory && <Info k="On hand" v={p.inventory} />}
        {last && <Info k="Last dose" v={`${fmtDate(last.date)} · ${siteLabel(last.site)}`} />}
      </dl>

      {refillSoon && (
        <p className="mt-3 rounded-xl bg-blush-100 px-3 py-2 text-[0.8rem] font-medium text-blush-500 dark:bg-blush-500/20 dark:text-blush-200">
          ✦ Refill reminder: {fmtDate(p.refillReminder)}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        <Button variant="soft" onClick={onLog}><Syringe size={15} /> Log dose</Button>
        <Button variant="ghost" onClick={onTravel}><IdCard size={15} /> Travel card</Button>
        <Button variant="ghost" onClick={onArchive}><Archive size={15} /> Archive</Button>
      </div>
    </Card>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-faint">{k}</dt>
      <dd className="mt-0.5 text-ink">{v}</dd>
    </div>
  );
}

function siteLabel(key: string): string {
  return INJECTION_SITES.find((s) => s.key === key)?.label ?? key ?? "—";
}

/* —— Site rotation map: a soft, abstract body diagram —— */
function SiteRotationPicker({
  value, onChange, recentSites,
}: {
  value: string;
  onChange: (site: string) => void;
  recentSites: string[];
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {INJECTION_SITES.map((s) => {
          const recent = recentSites.includes(s.key);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange(s.key)}
              className={cx(
                "rounded-2xl border px-3.5 py-2.5 text-left text-[0.83rem] transition-colors",
                value === s.key
                  ? "border-champagne-400 bg-champagne-200/40 font-semibold text-cocoa-600 dark:bg-champagne-600/25 dark:text-champagne-200"
                  : recent
                    ? "border-blush-300/60 bg-blush-100/40 text-ink-soft dark:bg-blush-500/10"
                    : "border-line text-ink-soft hover:border-line-strong"
              )}
            >
              <MapPin size={12} className="mb-0.5 inline -translate-y-px" /> {s.label}
              {recent && <span className="block text-[0.68rem] text-blush-500 dark:text-blush-300">used recently — consider rotating</span>}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[0.73rem] text-ink-faint">
        Gentle rotation keeps sites happy. Recently used sites are tinted blush.
      </p>
    </div>
  );
}

function ProtocolEditor({
  initial, onSave, onClose,
}: {
  initial: InjectableProtocol;
  onSave: (p: InjectableProtocol) => void;
  onClose: () => void;
}) {
  const { form, set } = useForm(initial);
  return (
    <Modal open onClose={onClose} title={initial.name ? initial.name : "New protocol"} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" className="sm:col-span-2">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. BPC-157" />
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={(e) => set("category", e.target.value as any)}>
            {INJECTABLE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="Goal / why you're tracking it">
          <Input value={form.goal} onChange={(e) => set("goal", e.target.value)} placeholder="e.g. recovery support" />
        </Field>
        <Field label="Provider / clinic">
          <Input value={form.provider} onChange={(e) => set("provider", e.target.value)} placeholder="Who prescribed this" />
        </Field>
        <Field label="Dose from your provider" hint="Recorded exactly as your provider wrote it — this app never suggests doses.">
          <Input value={form.providerDose} onChange={(e) => set("providerDose", e.target.value)} placeholder="per provider instructions" />
        </Field>
        <Field label="Units (per provider)">
          <Input value={form.units} onChange={(e) => set("units", e.target.value)} placeholder="mg · mcg · IU · units" />
        </Field>
        <Field label="Schedule (your words)">
          <Input value={form.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="e.g. Weekly · Sunday evening" />
        </Field>
        <Field label="Start date">
          <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </Field>
        <Field label="End date (optional)">
          <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
        </Field>
        <Field label="Vial size">
          <Input value={form.vialSize} onChange={(e) => set("vialSize", e.target.value)} placeholder="e.g. 5 mg vial" />
        </Field>
        <Field label="Storage">
          <Input value={form.storage} onChange={(e) => set("storage", e.target.value)} placeholder="e.g. refrigerate after mixing" />
        </Field>
        <Field label="Reconstitution notes" className="sm:col-span-2" hint="Your pharmacy/provider's mixing instructions. The Reconstitution Studio can do the math.">
          <Textarea value={form.reconstitution} onChange={(e) => set("reconstitution", e.target.value)} placeholder="e.g. add 2 mL BAC water per pharmacy sheet" />
        </Field>
        <Field label="Inventory on hand">
          <Input value={form.inventory} onChange={(e) => set("inventory", e.target.value)} placeholder="e.g. 2 vials" />
        </Field>
        <Field label="Refill reminder">
          <Input type="date" value={form.refillReminder} onChange={(e) => set("refillReminder", e.target.value)} />
        </Field>
        <Field label="Side effects you notice" className="sm:col-span-2">
          <Textarea rows={2} value={form.sideEffects} onChange={(e) => set("sideEffects", e.target.value)} placeholder="For your provider conversation" />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => form.name.trim() && onSave(form)} disabled={!form.name.trim()}>Save protocol</Button>
      </div>
    </Modal>
  );
}

function LogInjectionModal({ protocol, onClose }: { protocol: InjectableProtocol; onClose: () => void }) {
  const { db, update, activeProfile } = useStore();
  const recent = db.injectionLogs
    .filter((l) => l.protocolId === protocol.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2)
    .map((l) => l.site);
  const { form, set } = useForm<InjectionLog>({
    id: uid(), profileId: activeProfile.id, protocolId: protocol.id,
    date: today(), site: "", doseTaken: protocol.providerDose, feltAfter: "", notes: "",
  });
  return (
    <Modal open onClose={onClose} title={`Log ${protocol.name}`}>
      <div className="space-y-4">
        <Field label="Date">
          <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        </Field>
        <Field label="Dose taken (per provider)">
          <Input value={form.doseTaken} onChange={(e) => set("doseTaken", e.target.value)} placeholder="as your provider instructed" />
        </Field>
        <Field label="Injection site">
          <SiteRotationPicker value={form.site} onChange={(s) => set("site", s)} recentSites={recent} />
        </Field>
        <Field label="How you felt after">
          <Input value={form.feltAfter} onChange={(e) => set("feltAfter", e.target.value)} placeholder="optional" />
        </Field>
        <Field label="Notes">
          <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { update((d) => void d.injectionLogs.push(form)); onClose(); }}>Save dose</Button>
      </div>
    </Modal>
  );
}

function InjectionLogView({ protocols }: { protocols: InjectableProtocol[] }) {
  const { db, update, activeProfile } = useStore();
  const logs = byProfile(db.injectionLogs, activeProfile.id).sort((a, b) => b.date.localeCompare(a.date));
  if (logs.length === 0) {
    return (
      <EmptyState
        icon={<Syringe size={26} />}
        title="No doses logged yet"
        body="Each dose you log builds your rotation history and refill picture. Tap “Log dose” on any protocol."
      />
    );
  }
  return (
    <div className="space-y-2">
      {logs.map((l) => {
        const p = protocols.find((x) => x.id === l.protocolId);
        return (
          <Card key={l.id} className="flex items-center justify-between gap-4 !py-3.5">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink-strong">
                {p?.name ?? "Protocol"} <span className="text-ink-faint">·</span>{" "}
                <span className="text-[0.85rem] font-normal text-ink-soft">{siteLabel(l.site)}</span>
              </p>
              <p className="text-[0.78rem] text-ink-faint">
                {fmtDate(l.date)} {l.doseTaken && `· ${l.doseTaken}`} {l.feltAfter && `· felt: ${l.feltAfter}`}
              </p>
            </div>
            <button
              onClick={() => update((d) => void (d.injectionLogs = d.injectionLogs.filter((x) => x.id !== l.id)))}
              aria-label="Delete entry"
              className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
            >
              <Trash2 size={15} />
            </button>
          </Card>
        );
      })}
    </div>
  );
}

/* Printable wallet card for travel */
function TravelCard({ protocol, onClose }: { protocol: InjectableProtocol; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title="Travel card">
      <div className="print-page rounded-2xl border-2 border-champagne-400/60 bg-cream-50 p-5 text-cocoa-700">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-champagne-600">
          Medication travel card
        </p>
        <h3 className="mt-1 font-display text-2xl font-medium">{protocol.name}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.82rem]">
          <Info k="Prescribed by" v={protocol.provider || "—"} />
          <Info k="Dose (per provider)" v={`${protocol.providerDose || "see Rx"} ${protocol.units}`} />
          <Info k="Schedule" v={protocol.schedule || "—"} />
          <Info k="Storage" v={protocol.storage || "—"} />
        </dl>
        <p className="mt-4 border-t border-champagne-300/50 pt-3 text-[0.7rem] leading-relaxed text-taupe-500">
          Carried with prescription documentation. In case of questions, contact the prescribing
          provider listed above.
        </p>
      </div>
      <div className="no-print mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button onClick={() => window.print()}>Print / save PDF</Button>
      </div>
    </Modal>
  );
}

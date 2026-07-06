import React, { useMemo, useRef, useState } from "react";
import {
  Plus, Pill, Trash2, Pencil, ScanBarcode, Download, Upload, Sunrise, Sun, Sunset, Moon,
} from "lucide-react";
import { useStore, byProfile, today, fmtDate, uid } from "../lib/store";
import {
  PageHeader, Card, Button, Modal, Field, Input, Textarea, Select, Chip, Tabs,
  EmptyState, Disclaimer, SearchBox, cx, useForm,
} from "../components/ui";
import { SUPPLEMENT_LIBRARY, SUPPLEMENT_CATEGORIES, BRAND_SEEDS, STACK_TIMES } from "../data/supplements";
import type { Supplement, StackTime } from "../lib/types";

const STACK_ICONS: Record<StackTime, React.ReactNode> = {
  morning: <Sunrise size={16} />,
  afternoon: <Sun size={16} />,
  evening: <Sunset size={16} />,
  bedtime: <Moon size={16} />,
};

function blankSupplement(profileId: string): Supplement {
  return {
    id: uid(), profileId, name: "", category: "Vitamins", brand: "", product: "",
    barcode: "", dose: "", form: "", stacks: ["morning"], withFood: "", foodNote: "",
    labelInstructions: "", providerInstructions: "", combineNotes: "", avoidNotes: "",
    sideEffects: "", inventory: "", reorderReminder: "", active: true, createdAt: today(),
  };
}

export function Supplements() {
  const { db, update, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [tab, setTab] = useState("stacks");
  const [editing, setEditing] = useState<Supplement | null>(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("All");
  const fileRef = useRef<HTMLInputElement>(null);

  const mine = byProfile(db.supplements, pid).filter((s) => s.active);
  const date = today();

  const library = useMemo(() => {
    const q = search.toLowerCase();
    return SUPPLEMENT_LIBRARY.filter(
      (e) => (cat === "All" || e.category === cat) && (!q || e.name.toLowerCase().includes(q))
    );
  }, [search, cat]);

  const toggleCheck = (supplementId: string, stack: StackTime) =>
    update((d) => {
      const existing = d.supplementChecks.find(
        (c) => c.profileId === pid && c.date === date && c.supplementId === supplementId && c.stack === stack
      );
      if (existing) existing.taken = !existing.taken;
      else d.supplementChecks.push({ id: uid(), profileId: pid, date, supplementId, stack, taken: true });
    });

  const isTaken = (supplementId: string, stack: StackTime) =>
    db.supplementChecks.some(
      (c) => c.profileId === pid && c.date === date && c.supplementId === supplementId && c.stack === stack && c.taken
    );

  /* CSV: name,category,brand,product,dose,form,stacks */
  const exportCsv = () => {
    const rows = [
      ["name", "category", "brand", "product", "dose", "form", "stacks"],
      ...mine.map((s) => [s.name, s.category, s.brand, s.product, s.dose, s.form, s.stacks.join("|")]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "my-supplements.csv";
    a.click();
  };

  const importCsv = (file: File) => {
    file.text().then((text) => {
      const lines = text.split(/\r?\n/).filter(Boolean);
      const parse = (line: string) =>
        (line.match(/("([^"]|"")*"|[^,]*)(,|$)/g) ?? [])
          .map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
      const [header, ...rows] = lines.map(parse);
      const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);
      const ni = col("name");
      if (ni < 0) return;
      update((d) => {
        for (const r of rows) {
          if (!r[ni]?.trim()) continue;
          d.supplements.push({
            ...blankSupplement(pid),
            id: uid(),
            name: r[ni].trim(),
            category: r[col("category")] || "Custom",
            brand: r[col("brand")] || "",
            product: r[col("product")] || "",
            dose: r[col("dose")] || "",
            form: r[col("form")] || "",
            stacks: ((r[col("stacks")] || "morning").split("|").filter(Boolean) as StackTime[]),
          });
        }
      });
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Protocols"
        title="Supplement Sanctuary"
        sub="Stacks, inventory, and reorder reminders — every bottle in one calm place."
        actions={
          <>
            <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload size={15} /> CSV</Button>
            <Button variant="outline" onClick={exportCsv}><Download size={15} /> Export</Button>
            <Button onClick={() => setEditing(blankSupplement(pid))}><Plus size={16} /> Add</Button>
          </>
        }
      />
      <input
        ref={fileRef} type="file" accept=".csv" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) importCsv(f); e.target.value = ""; }}
      />

      <Tabs
        tabs={[
          { key: "stacks", label: "Today's stacks" },
          { key: "cabinet", label: `My cabinet (${mine.length})` },
          { key: "library", label: "Library" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "stacks" && (
        mine.length === 0 ? (
          <EmptyState
            icon={<Pill size={26} />}
            title="Your cabinet is empty"
            body="Add supplements from the library — or scan a barcode — and your morning, afternoon, evening and bedtime stacks will assemble themselves here."
            action={<Button variant="soft" onClick={() => setTab("library")}>Browse the library</Button>}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {STACK_TIMES.map((st) => {
              const items = mine.filter((s) => s.stacks.includes(st.key as StackTime));
              return (
                <Card key={st.key}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 font-display text-lg font-medium">
                      <span className="text-champagne-600 dark:text-champagne-300">{STACK_ICONS[st.key as StackTime]}</span>
                      {st.label}
                    </p>
                    <span className="text-xs text-ink-faint">
                      {items.filter((s) => isTaken(s.id, st.key as StackTime)).length}/{items.length}
                    </span>
                  </div>
                  {items.length === 0 ? (
                    <p className="text-[0.85rem] text-ink-faint">Nothing scheduled — a quiet moment.</p>
                  ) : (
                    <ul className="space-y-1">
                      {items.map((s) => {
                        const taken = isTaken(s.id, st.key as StackTime);
                        return (
                          <li key={s.id}>
                            <button
                              onClick={() => toggleCheck(s.id, st.key as StackTime)}
                              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-sunken"
                            >
                              <span className={cx(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.6rem] font-bold",
                                taken ? "border-sage-500 bg-sage-400 text-white" : "border-line-strong text-transparent"
                              )}>✓</span>
                              <span className={cx("flex-1 text-[0.92rem]", taken ? "text-ink-faint line-through" : "text-ink")}>
                                {s.name}
                                {s.dose && <span className="text-ink-faint"> · {s.dose}</span>}
                              </span>
                              {s.withFood === "with" && <span className="text-[0.68rem] text-ink-faint">with food</span>}
                              {s.withFood === "without" && <span className="text-[0.68rem] text-ink-faint">empty stomach</span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Card>
              );
            })}
          </div>
        )
      )}

      {tab === "cabinet" && (
        mine.length === 0 ? (
          <EmptyState
            icon={<Pill size={26} />}
            title="Nothing in the cabinet"
            body="Everything you add — brand, dose, label instructions, inventory — lives here."
            action={<Button variant="soft" onClick={() => setEditing(blankSupplement(pid))}>Add a supplement</Button>}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {mine.map((s) => (
              <Card key={s.id} hover className="!p-4.5 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-sage-500 dark:text-sage-300">{s.category}</p>
                    <p className="font-display text-lg font-medium text-ink-strong">{s.name}</p>
                    {(s.brand || s.product) && (
                      <p className="truncate text-[0.8rem] text-ink-soft">{[s.brand, s.product].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                  <div className="flex shrink-0">
                    <button onClick={() => setEditing(s)} aria-label="Edit" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-ink"><Pencil size={15} /></button>
                    <button
                      onClick={() => update((d) => void (d.supplements = d.supplements.filter((x) => x.id !== s.id)))}
                      aria-label="Delete" className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-blush-500"
                    ><Trash2 size={15} /></button>
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {s.stacks.map((st) => (
                    <span key={st} className="rounded-full bg-sunken px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-soft">{st}</span>
                  ))}
                  {s.dose && <span className="rounded-full bg-champagne-200/50 px-2.5 py-1 text-[0.7rem] font-semibold text-champagne-600 dark:bg-champagne-600/25 dark:text-champagne-200">{s.dose}</span>}
                  {s.inventory && <span className="rounded-full bg-sunken px-2.5 py-1 text-[0.7rem] text-ink-soft">on hand: {s.inventory}</span>}
                </div>
                {s.reorderReminder && s.reorderReminder <= new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10) && (
                  <p className="mt-2.5 rounded-xl bg-blush-100 px-3 py-1.5 text-[0.78rem] font-medium text-blush-500 dark:bg-blush-500/20 dark:text-blush-200">
                    ✦ Reorder by {fmtDate(s.reorderReminder)}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )
      )}

      {tab === "library" && (
        <div>
          <div className="mb-4"><SearchBox value={search} onChange={setSearch} placeholder="Search 90+ supplements…" /></div>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {["All", ...SUPPLEMENT_CATEGORIES].map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
            ))}
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {library.map((e) => (
              <button
                key={e.name}
                onClick={() => setEditing({ ...blankSupplement(pid), name: e.name, category: e.category })}
                className="card card-hover p-4 text-left"
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-sage-500 dark:text-sage-300">{e.category}</p>
                <p className="mt-0.5 font-display text-[1.05rem] font-medium text-ink-strong">{e.name}</p>
                <p className="mt-1 text-[0.78rem] text-ink-faint">{e.commonForms} · {e.typicalTiming}</p>
              </button>
            ))}
            <button
              onClick={() => setEditing(blankSupplement(pid))}
              className="card card-hover flex flex-col items-center justify-center border-dashed p-4 text-center"
            >
              <Plus size={20} className="mb-1 text-ink-faint" />
              <p className="font-medium text-ink-soft">Custom supplement</p>
            </button>
          </div>
        </div>
      )}

      {editing && (
        <SupplementEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(s) => {
            update((d) => {
              const i = d.supplements.findIndex((x) => x.id === s.id);
              if (i >= 0) d.supplements[i] = s;
              else d.supplements.push(s);
            });
            setEditing(null);
            setTab("cabinet");
          }}
        />
      )}

      <Disclaimer>
        This tracker organizes what you already take. It makes no health claims and gives no advice
        about combining products — the “take together” and “keep apart” fields are your own notes
        from your label or provider. Review your full list with your practitioner or pharmacist.
      </Disclaimer>
    </div>
  );
}

/* Barcode capture: uses the native BarcodeDetector where available,
   with graceful manual entry everywhere else. */
function BarcodeCapture({ onCode }: { onCode: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const stopRef = useRef<() => void>(() => {});

  const start = async () => {
    const Detector = (window as any).BarcodeDetector;
    if (!Detector || !navigator.mediaDevices?.getUserMedia) {
      setUnsupported(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setScanning(true);
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      const detector = new Detector({ formats: ["ean_13", "upc_a", "upc_e", "ean_8", "code_128"] });
      let live = true;
      stopRef.current = () => {
        live = false;
        stream.getTracks().forEach((t) => t.stop());
        setScanning(false);
      };
      const tick = async () => {
        if (!live) return;
        try {
          const codes = await detector.detect(video);
          if (codes.length > 0) {
            onCode(codes[0].rawValue);
            stopRef.current();
            return;
          }
        } catch { /* keep trying */ }
        requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setUnsupported(true);
    }
  };

  return (
    <div>
      {!scanning ? (
        <Button type="button" variant="outline" onClick={start}>
          <ScanBarcode size={16} /> Scan barcode
        </Button>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <video ref={videoRef} className="h-40 w-full object-cover" muted playsInline />
          <button type="button" onClick={() => stopRef.current()} className="w-full bg-sunken py-2 text-[0.8rem] font-semibold text-ink-soft">
            Stop scanning
          </button>
        </div>
      )}
      {unsupported && (
        <p className="mt-2 text-[0.75rem] text-ink-faint">
          Camera scanning isn't available in this browser — type the barcode number instead.
        </p>
      )}
    </div>
  );
}

function SupplementEditor({
  initial, onSave, onClose,
}: { initial: Supplement; onSave: (s: Supplement) => void; onClose: () => void }) {
  const { form, set } = useForm(initial);
  const toggleStack = (st: StackTime) =>
    set("stacks", form.stacks.includes(st) ? form.stacks.filter((x) => x !== st) : [...form.stacks, st]);
  return (
    <Modal open onClose={onClose} title={initial.name || "Add supplement"} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" className="sm:col-span-2">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Magnesium Glycinate" />
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {SUPPLEMENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="Brand" hint="Pick a seed brand or type your own.">
          <Input list="brand-seeds" value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. Thorne" />
          <datalist id="brand-seeds">
            {BRAND_SEEDS.map((b) => <option key={b} value={b} />)}
          </datalist>
        </Field>
        <Field label="Product name">
          <Input value={form.product} onChange={(e) => set("product", e.target.value)} placeholder="Exact product on the bottle" />
        </Field>
        <Field label="Barcode">
          <Input value={form.barcode} onChange={(e) => set("barcode", e.target.value)} placeholder="UPC / EAN" inputMode="numeric" />
          <div className="mt-2"><BarcodeCapture onCode={(c) => set("barcode", c)} /></div>
        </Field>
        <Field label="Dose (from your label or provider)">
          <Input value={form.dose} onChange={(e) => set("dose", e.target.value)} placeholder="per label / provider instructions" />
        </Field>
        <Field label="Form">
          <Input value={form.form} onChange={(e) => set("form", e.target.value)} placeholder="capsule · powder · liquid…" />
        </Field>
        <Field label="Time of day" className="sm:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {STACK_TIMES.map((st) => (
              <Chip key={st.key} active={form.stacks.includes(st.key as StackTime)} onClick={() => toggleStack(st.key as StackTime)}>
                {st.label}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="With food?">
          <Select value={form.withFood} onChange={(e) => set("withFood", e.target.value as any)}>
            <option value="">Not noted</option>
            <option value="with">With food</option>
            <option value="without">Without food</option>
            <option value="note">See my note</option>
          </Select>
        </Field>
        <Field label="Food note">
          <Input value={form.foodNote} onChange={(e) => set("foodNote", e.target.value)} placeholder="e.g. with breakfast fat" />
        </Field>
        <Field label="Label instructions">
          <Input value={form.labelInstructions} onChange={(e) => set("labelInstructions", e.target.value)} placeholder="As printed on the bottle" />
        </Field>
        <Field label="Provider instructions">
          <Input value={form.providerInstructions} onChange={(e) => set("providerInstructions", e.target.value)} placeholder="If your provider adjusted it" />
        </Field>
        <Field label="I take it together with… (my notes)">
          <Input value={form.combineNotes} onChange={(e) => set("combineNotes", e.target.value)} placeholder="your own pairing notes" />
        </Field>
        <Field label="I keep it apart from… (my notes)">
          <Input value={form.avoidNotes} onChange={(e) => set("avoidNotes", e.target.value)} placeholder="your own spacing notes" />
        </Field>
        <Field label="Side effects noticed">
          <Input value={form.sideEffects} onChange={(e) => set("sideEffects", e.target.value)} />
        </Field>
        <Field label="Inventory on hand">
          <Input value={form.inventory} onChange={(e) => set("inventory", e.target.value)} placeholder="e.g. 60 capsules" />
        </Field>
        <Field label="Reorder reminder">
          <Input type="date" value={form.reorderReminder} onChange={(e) => set("reorderReminder", e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={() => form.name.trim() && onSave(form)} disabled={!form.name.trim()}>Save supplement</Button>
      </div>
    </Modal>
  );
}

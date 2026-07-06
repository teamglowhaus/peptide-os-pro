import React, { useState } from "react";
import { Printer, Check } from "lucide-react";
import { useStore, byProfile, fmtDate, today } from "../lib/store";
import { PageHeader, Card, Button, cx } from "../components/ui";
import { MENO_SYMPTOMS } from "../data/wellness";
import { STACK_TIMES } from "../data/supplements";

/* ————————————————————————————————————————————————
   Printable Studio — the companion binder.
   Every page prints on US Letter/A4 via the browser's
   print-to-PDF, pre-styled to match the brand. Pages can
   print blank (classic planner) or pre-filled with the
   active profile's real data.
   ———————————————————————————————————————————————— */

const PAGES = [
  { key: "cover", label: "Binder cover page" },
  { key: "weekly", label: "Weekly wellness dashboard" },
  { key: "medcard", label: "Medication & dose card" },
  { key: "peptide", label: "Peptide & injectable log" },
  { key: "hrt", label: "HRT tracker" },
  { key: "symptoms", label: "Symptom tracker (peri/meno)" },
  { key: "supplements", label: "Supplement schedule" },
  { key: "labs", label: "Lab binder page" },
  { key: "questions", label: "Questions for my provider" },
  { key: "redlight", label: "Red light tracker" },
  { key: "coldplunge", label: "Cold plunge tracker" },
  { key: "sauna", label: "Sauna tracker" },
  { key: "pet", label: "Pet health binder" },
  { key: "monthly", label: "Monthly review" },
  { key: "quarterly", label: "Quarterly optimization review" },
];

export function Printables() {
  const [selected, setSelected] = useState<string[]>(["cover", "weekly", "medcard"]);
  const [prefill, setPrefill] = useState(true);

  const toggle = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  return (
    <div>
      <div className="no-print">
        <PageHeader
          eyebrow="Your world"
          title="Printable Studio"
          sub="Your matching paper companion — choose pages, print or save as a PDF, and slip them into a binder, GoodNotes, or Notability."
          actions={
            <Button onClick={() => window.print()} disabled={selected.length === 0}>
              <Printer size={16} /> Print {selected.length || ""} page{selected.length === 1 ? "" : "s"}
            </Button>
          }
        />

        <Card className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-lg font-medium">Choose your pages</p>
            <label className="flex items-center gap-2 text-[0.85rem] text-ink-soft">
              <input type="checkbox" checked={prefill} onChange={(e) => setPrefill(e.target.checked)} className="h-4 w-4 accent-[--color-sage-400]" />
              Pre-fill with my current data
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PAGES.map((p) => (
              <button
                key={p.key}
                onClick={() => toggle(p.key)}
                className={cx(
                  "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[0.88rem] font-medium transition-colors",
                  selected.includes(p.key)
                    ? "border-champagne-400 bg-champagne-200/40 text-cocoa-600 dark:bg-champagne-600/20 dark:text-champagne-200"
                    : "border-line text-ink-soft hover:border-line-strong"
                )}
              >
                <span className={cx(
                  "flex h-4.5 w-4.5 h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  selected.includes(p.key) ? "border-champagne-500 bg-champagne-400 text-white" : "border-line-strong text-transparent"
                )}>
                  <Check size={11} strokeWidth={3.5} />
                </span>
                {p.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[0.78rem] leading-relaxed text-ink-faint">
            Tip: “Save as PDF” in the print dialog creates your digital binder — import it into
            GoodNotes or Notability and every page becomes writable with your stylus. Print on
            cream or ivory paper for the full boutique effect. 🤍
          </p>
        </Card>

        <p className="eyebrow mb-3">Preview</p>
      </div>

      {/* Printable sheets */}
      <div className="space-y-6 print:space-y-0">
        {selected.includes("cover") && (
          <Sheet pageKey="cover">
            <CoverPage toc={PAGES.filter((p) => p.key !== "cover" && selected.includes(p.key))} />
          </Sheet>
        )}
        {selected.includes("weekly") && <Sheet pageKey="weekly"><WeeklyPage /></Sheet>}
        {selected.includes("medcard") && <Sheet pageKey="medcard"><MedCardPage prefill={prefill} /></Sheet>}
        {selected.includes("peptide") && <Sheet pageKey="peptide"><PeptideLogPage prefill={prefill} /></Sheet>}
        {selected.includes("hrt") && <Sheet pageKey="hrt"><HrtPage prefill={prefill} /></Sheet>}
        {selected.includes("symptoms") && <Sheet pageKey="symptoms"><SymptomPage /></Sheet>}
        {selected.includes("supplements") && <Sheet pageKey="supplements"><SupplementPage prefill={prefill} /></Sheet>}
        {selected.includes("labs") && <Sheet pageKey="labs"><LabsPage prefill={prefill} /></Sheet>}
        {selected.includes("questions") && <Sheet pageKey="questions"><QuestionsPage prefill={prefill} /></Sheet>}
        {selected.includes("redlight") && <Sheet pageKey="redlight"><SimpleSessionPage title="Red Light Tracker" cols={["Date", "Device", "Area", "Minutes", "Distance", "Notes / glow"]} /></Sheet>}
        {selected.includes("coldplunge") && <Sheet pageKey="coldplunge"><SimpleSessionPage title="Cold Plunge Tracker" cols={["Date", "Temp", "Minutes", "Breathwork", "Mood after", "Notes"]} /></Sheet>}
        {selected.includes("sauna") && <Sheet pageKey="sauna"><SimpleSessionPage title="Sauna Tracker" cols={["Date", "Type", "Temp", "Minutes", "Hydration", "Sleep impact"]} /></Sheet>}
        {selected.includes("pet") && <Sheet pageKey="pet"><PetPage prefill={prefill} /></Sheet>}
        {selected.includes("monthly") && <Sheet pageKey="monthly"><MonthlyPage /></Sheet>}
        {selected.includes("quarterly") && <Sheet pageKey="quarterly"><QuarterlyPage /></Sheet>}
      </div>
    </div>
  );
}

/* —— sheet chrome —— */

function Sheet({ children, pageKey }: { children: React.ReactNode; pageKey?: string }) {
  return (
    <div
      data-sheet-page={pageKey}
      className="print-page card mx-auto w-full max-w-[720px] !rounded-[14px] bg-white p-8 text-cocoa-700 shadow-soft print:max-w-none print:border-0 print:p-2 print:shadow-none dark:bg-white"
    >
      {children}
      <div className="mt-6 flex items-center justify-between border-t border-taupe-200 pt-3">
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-taupe-400">The Biohacker Operating System</p>
        <p className="text-[0.6rem] text-taupe-400">Not medical advice · doses per your provider</p>
      </div>
    </div>
  );
}

function SheetTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-5 text-center">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-champagne-600">{eyebrow}</p>
      <h2 className="mt-1 font-display text-[1.7rem] font-medium text-cocoa-700">{title}</h2>
      <div className="mx-auto mt-2 h-px w-24 bg-champagne-300" />
    </header>
  );
}

/* data-fillable / data-fillable-id mark every writable blank so the PDF
   export pipeline (scripts/enhance-binder-pdf.mjs) can overlay a real
   AcroForm text field at that exact position — see
   docs/printable-companion-guide.md for what "fillable" honestly means. */

function WriteLine({ label, value, w }: { label: string; value?: string; w?: string }) {
  const id = React.useId();
  const blank = !value;
  return (
    <div className={cx("min-w-0", w)}>
      <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-taupe-400">{label}</p>
      <p
        data-fillable={blank ? "text" : undefined}
        data-fillable-id={blank ? id : undefined}
        className="min-h-[1.35rem] border-b border-taupe-300 pb-0.5 text-[0.85rem] text-cocoa-600"
      >
        {value || " "}
      </p>
    </div>
  );
}

function RuleTable({ cols, rows = 10, data }: { cols: string[]; rows?: number; data?: string[][] }) {
  const tableId = React.useId();
  return (
    <table className="w-full border-collapse text-[0.78rem]">
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c} className="border-b-2 border-champagne-300 pb-1.5 text-left text-[0.62rem] font-semibold uppercase tracking-wider text-taupe-500">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, i) => (
          <tr key={i}>
            {cols.map((c, j) => {
              const cell = data?.[i]?.[j];
              const blank = !cell;
              return (
                <td
                  key={j}
                  data-fillable={blank ? "text" : undefined}
                  data-fillable-id={blank ? `${tableId}-r${i}-c${j}` : undefined}
                  className="h-8 border-b border-taupe-200 pr-3 align-bottom text-cocoa-600"
                >
                  {cell ?? ""}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A blank writable line — freehand notes, before/after reflections, etc. */
function Blank({ className }: { className?: string }) {
  const id = React.useId();
  return <div data-fillable="text" data-fillable-id={id} className={cx("h-7 border-b border-taupe-200", className)} />;
}

/* —— individual pages —— */

function CoverPage({ toc = [] }: { toc?: { key: string; label: string }[] }) {
  const { activeProfile } = useStore();
  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
      <img src="/icons/icon.svg" alt="" className="mb-8 h-24 w-24 rounded-3xl" />
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-champagne-600">The Personal Wellness Binder of</p>
      <p className="mt-4 min-w-64 border-b border-taupe-300 pb-1 font-display text-3xl font-medium text-cocoa-700">
        {activeProfile.name !== "Me" ? activeProfile.name : " "}
      </p>
      <p className="mt-10 max-w-sm font-display text-lg italic leading-relaxed text-taupe-500">
        “Consistency over perfection —<br />every small ritual counts.”
      </p>
      {toc.length > 0 && (
        <div className="mt-10 w-full max-w-sm text-left">
          <p className="mb-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-taupe-400">In this binder</p>
          <ul className="columns-2 gap-x-6 space-y-1.5">
            {toc.map((p) => (
              <li key={p.key} className="break-inside-avoid text-[0.78rem] text-cocoa-600">
                <span data-toc-target={p.key}>{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-12 text-[0.65rem] uppercase tracking-[0.25em] text-taupe-400">Season · ____________</p>
    </div>
  );
}

function WeeklyPage() {
  return (
    <div>
      <SheetTitle eyebrow="Every day" title="Weekly Wellness Dashboard" />
      <div className="mb-4 flex gap-6">
        <WriteLine label="Week of" w="w-40" />
        <WriteLine label="This week's intention" w="flex-1" />
      </div>
      <RuleTable
        cols={["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        rows={9}
        data={[
          ["Morning stack"], ["Evening stack"], ["Injection / HRT"], ["Movement"],
          ["Sunlight / grounding"], ["Red light · cold · sauna"], ["Sleep hours"], ["Mood (1–5)"], ["Water"],
        ]}
      />
      <div className="mt-5 grid grid-cols-2 gap-6">
        <WriteLine label="Wins this week" />
        <WriteLine label="What I'm adjusting" />
      </div>
    </div>
  );
}

function MedCardPage({ prefill }: { prefill: boolean }) {
  const { db, activeProfile } = useStore();
  const pid = activeProfile.id;
  const meds = prefill
    ? [
        ...byProfile(db.injectables, pid).filter((i) => i.active).map((i) => [i.name, `${i.providerDose} ${i.units}`.trim(), i.schedule, i.provider]),
        ...byProfile(db.hormones, pid).filter((h) => h.active).map((h) => [h.name, h.providerDose, h.schedule, h.provider]),
      ]
    : undefined;
  return (
    <div>
      <SheetTitle eyebrow="Emergency & travel" title="Medication & Dose Card" />
      <div className="mb-4 grid grid-cols-3 gap-4">
        <WriteLine label="Name" value={prefill && activeProfile.name !== "Me" ? activeProfile.name : ""} />
        <WriteLine label="Emergency contact" />
        <WriteLine label="Pharmacy" />
      </div>
      <RuleTable cols={["Medication / injectable", "Dose (per provider)", "Schedule", "Prescriber"]} rows={12} data={meds} />
    </div>
  );
}

function PeptideLogPage({ prefill }: { prefill: boolean }) {
  const { db, activeProfile } = useStore();
  const logs = prefill
    ? byProfile(db.injectionLogs, activeProfile.id)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 14)
        .map((l) => {
          const p = db.injectables.find((x) => x.id === l.protocolId);
          return [fmtDate(l.date), p?.name ?? "", l.doseTaken, l.site, l.feltAfter];
        })
    : undefined;
  return (
    <div>
      <SheetTitle eyebrow="Protocols" title="Peptide & Injectable Log" />
      <RuleTable cols={["Date", "Peptide / injectable", "Dose (provider)", "Site", "Notes"]} rows={14} data={logs} />
      <p className="mt-4 text-center text-[0.65rem] italic text-taupe-400">
        Rotate gently: abdomen UL → UR → LL → LR → thighs → arms
      </p>
    </div>
  );
}

function HrtPage({ prefill }: { prefill: boolean }) {
  const { db, activeProfile } = useStore();
  const rows = prefill
    ? byProfile(db.hormones, activeProfile.id).filter((h) => h.active)
        .map((h) => [h.name, h.form, h.providerDose, h.schedule, h.refillReminder ? fmtDate(h.refillReminder) : ""])
    : undefined;
  return (
    <div>
      <SheetTitle eyebrow="Hormones" title="HRT Tracker" />
      <RuleTable cols={["Therapy", "Form", "Dose (provider)", "Schedule", "Refill due"]} rows={8} data={rows} />
      <div className="mt-5 grid grid-cols-2 gap-6">
        <WriteLine label="Next lab date" />
        <WriteLine label="Provider" />
      </div>
      <div className="mt-4">
        <p className="mb-1 text-[0.62rem] font-semibold uppercase tracking-wider text-taupe-400">Before / after notes</p>
        {[0, 1, 2].map((i) => <Blank key={i} />)}
      </div>
    </div>
  );
}

function SymptomPage() {
  return (
    <div>
      <SheetTitle eyebrow="Hormones" title="Symptom Tracker · Peri & Menopause" />
      <div className="mb-3 flex gap-6">
        <WriteLine label="Month" w="w-40" />
        <WriteLine label="Cycle notes" w="flex-1" />
      </div>
      <table className="w-full border-collapse text-[0.68rem]">
        <thead>
          <tr>
            <th className="border-b-2 border-champagne-300 pb-1 text-left text-[0.6rem] font-semibold uppercase tracking-wider text-taupe-500">Symptom · rate 0–4</th>
            {["Wk 1", "Wk 2", "Wk 3", "Wk 4"].map((w) => (
              <th key={w} className="w-14 border-b-2 border-champagne-300 pb-1 text-center text-[0.6rem] font-semibold uppercase tracking-wider text-taupe-500">{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MENO_SYMPTOMS.map((s) => (
            <tr key={s.key}>
              <td className="h-[1.42rem] border-b border-taupe-200 text-cocoa-600">{s.label}</td>
              {[0, 1, 2, 3].map((i) => (
                <td
                  key={i}
                  data-fillable="text"
                  data-fillable-id={`symptom-${s.key}-w${i}`}
                  className="border-b border-l border-taupe-200"
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SupplementPage({ prefill }: { prefill: boolean }) {
  const { db, activeProfile } = useStore();
  const pid = activeProfile.id;
  return (
    <div>
      <SheetTitle eyebrow="Protocols" title="Supplement Schedule" />
      {STACK_TIMES.map((st) => {
        const items = prefill
          ? byProfile(db.supplements, pid).filter((s) => s.active && s.stacks.includes(st.key as any))
              .map((s) => [s.name, s.dose, [s.brand, s.product].filter(Boolean).join(" · "), s.withFood === "with" ? "with food" : s.withFood === "without" ? "empty stomach" : s.foodNote])
          : undefined;
        return (
          <div key={st.key} className="mb-4">
            <p className="mb-1.5 font-display text-[1.02rem] font-medium text-cocoa-700">{st.label}</p>
            <RuleTable cols={["Supplement", "Dose (label/provider)", "Brand", "Notes"]} rows={Math.max(3, items?.length ?? 0)} data={items} />
          </div>
        );
      })}
    </div>
  );
}

function LabsPage({ prefill }: { prefill: boolean }) {
  const { db, activeProfile } = useStore();
  const rows = prefill
    ? byProfile(db.labs, activeProfile.id)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 14)
        .map((l) => [fmtDate(l.date), l.panel, l.marker, `${l.value} ${l.unit}`.trim(), l.range, l.flagged ? "★" : ""])
    : undefined;
  return (
    <div>
      <SheetTitle eyebrow="Body lab" title="Lab Binder" />
      <RuleTable cols={["Date", "Panel", "Marker", "Result", "Ref range", "Discuss"]} rows={14} data={rows} />
    </div>
  );
}

function QuestionsPage({ prefill }: { prefill: boolean }) {
  const { db, activeProfile } = useStore();
  const qs = prefill
    ? byProfile(db.providerQuestions, activeProfile.id).filter((q) => !q.asked).map((q) => q.question)
    : [];
  return (
    <div>
      <SheetTitle eyebrow="Appointments" title="Questions for My Provider" />
      <div className="mb-4 flex gap-6">
        <WriteLine label="Appointment date" w="w-44" />
        <WriteLine label="Provider" w="flex-1" />
      </div>
      {Array.from({ length: 10 }, (_, i) => {
        const hasQuestion = Boolean(qs[i]);
        return (
          <div key={i} className="mb-3.5">
            <p
              data-fillable={hasQuestion ? undefined : "text"}
              data-fillable-id={hasQuestion ? undefined : `question-${i}`}
              className="min-h-[1.3rem] border-b border-taupe-300 text-[0.85rem] text-cocoa-600"
            >
              {qs[i] ?? "\u00a0"}
            </p>
            <p
              data-fillable="text"
              data-fillable-id={`question-answer-${i}`}
              className="mt-1.5 min-h-[1.1rem] border-b border-dotted border-taupe-200 text-[0.75rem] text-taupe-500"
            >
              &nbsp;
            </p>
          </div>
        );
      })}
    </div>
  );
}

function SimpleSessionPage({ title, cols }: { title: string; cols: string[] }) {
  return (
    <div>
      <SheetTitle eyebrow="Body lab" title={title} />
      <RuleTable cols={cols} rows={16} />
    </div>
  );
}

function PetPage({ prefill }: { prefill: boolean }) {
  const { db } = useStore();
  const pet = prefill ? db.pets[0] : undefined;
  return (
    <div>
      <SheetTitle eyebrow="Little loves" title="Pet Health Binder" />
      <div className="mb-4 grid grid-cols-4 gap-4">
        <WriteLine label="Name" value={pet?.name} />
        <WriteLine label="Species / breed" value={pet ? [pet.species, pet.breed].filter(Boolean).join(" · ") : ""} />
        <WriteLine label="Weight" value={pet?.weight} />
        <WriteLine label="Vet clinic" />
      </div>
      <p className="mb-1.5 font-display text-[1.02rem] font-medium text-cocoa-700">Medications & supplements</p>
      <RuleTable cols={["Name", "Detail (per vet/label)", "Schedule"]} rows={6}
        data={pet ? [...pet.medications, ...pet.supplements].map((i) => [i.name, i.detail, i.schedule]) : undefined} />
      <p className="mb-1.5 mt-4 font-display text-[1.02rem] font-medium text-cocoa-700">Vaccines</p>
      <RuleTable cols={["Vaccine", "Date", "Next due"]} rows={5}
        data={pet ? pet.vaccines.map((v) => [v.name, v.date ? fmtDate(v.date) : "", ""]) : undefined} />
    </div>
  );
}

function MonthlyPage() {
  return (
    <div>
      <SheetTitle eyebrow="Reflection" title="Monthly Review" />
      <div className="mb-5 flex gap-6">
        <WriteLine label="Month" w="w-40" />
        <WriteLine label="Overall feeling (1–10)" w="w-40" />
      </div>
      {[
        "What improved this month?",
        "What protocols felt worth it?",
        "What am I letting go of?",
        "Symptoms or changes to mention to my provider",
        "Next month's single focus",
      ].map((q) => (
        <div key={q} className="mb-5">
          <p className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wider text-taupe-500">{q}</p>
          {[0, 1].map((i) => <Blank key={i} />)}
        </div>
      ))}
    </div>
  );
}

function QuarterlyPage() {
  return (
    <div>
      <SheetTitle eyebrow="Reflection" title="Quarterly Optimization Review" />
      <div className="mb-5 flex gap-6">
        <WriteLine label="Quarter" w="w-40" />
        <WriteLine label="Season theme" w="flex-1" />
      </div>
      <p className="mb-1.5 font-display text-[1.02rem] font-medium text-cocoa-700">Protocol audit</p>
      <RuleTable cols={["Protocol / supplement", "Keep · adjust · retire", "Why"]} rows={8} />
      <p className="mb-1.5 mt-5 font-display text-[1.02rem] font-medium text-cocoa-700">Labs & measurements</p>
      <RuleTable cols={["Marker", "Last quarter", "This quarter", "Direction"]} rows={5} />
      <div className="mt-5">
        <p className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wider text-taupe-500">The one change that would matter most next quarter</p>
        {[0, 1].map((i) => <Blank key={i} />)}
      </div>
    </div>
  );
}

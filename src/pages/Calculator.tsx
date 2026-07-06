import React, { useMemo, useState } from "react";
import { PageHeader, Card, Field, Input, Disclaimer, SectionTitle } from "../components/ui";

/* Reconstitution Studio — pure arithmetic, beautifully presented.
   It never recommends a dose; it only converts the numbers the
   user's provider already gave them. */

function parseNum(v: string): number | null {
  const n = parseFloat(v.replace(",", "."));
  return isNaN(n) || n < 0 ? null : n;
}

export function CalculatorPage() {
  const [vialMg, setVialMg] = useState("");
  const [diluentMl, setDiluentMl] = useState("");
  const [doseMg, setDoseMg] = useState("");

  const vial = parseNum(vialMg);
  const diluent = parseNum(diluentMl);
  const dose = parseNum(doseMg);

  const concentration = vial && diluent ? vial / diluent : null; // mg per mL
  const doseMl = concentration && dose != null ? dose / concentration : null;
  const doseUnits = doseMl != null ? doseMl * 100 : null; // U-100 insulin syringe
  const overflow = doseUnits != null && doseUnits > 100;

  return (
    <div>
      <PageHeader
        eyebrow="Studio"
        title="Reconstitution Studio"
        sub="Enter your vial, your diluent, and the dose from your provider — we do only the arithmetic."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle className="mb-4">Your vial</SectionTitle>
          <div className="space-y-4">
            <Field label="Peptide in the vial (mg)" hint="Printed on your vial label.">
              <Input inputMode="decimal" value={vialMg} onChange={(e) => setVialMg(e.target.value)} placeholder="e.g. 5" />
            </Field>
            <Field label="Diluent you add (mL)" hint="Bacteriostatic water per your pharmacy sheet.">
              <Input inputMode="decimal" value={diluentMl} onChange={(e) => setDiluentMl(e.target.value)} placeholder="e.g. 2" />
            </Field>
            <Field label="Dose from your provider (mg)" hint="Exactly as written by your provider — never guessed.">
              <Input inputMode="decimal" value={doseMg} onChange={(e) => setDoseMg(e.target.value)} placeholder="per provider instructions" />
            </Field>
          </div>
        </Card>

        <Card className="flex flex-col">
          <SectionTitle className="mb-4">The math</SectionTitle>
          <dl className="grid grid-cols-2 gap-3">
            <ResultTile label="Concentration" value={concentration ? `${trim(concentration)} mg/mL` : "—"} />
            <ResultTile label="Draw volume" value={doseMl != null ? `${trim(doseMl)} mL` : "—"} />
            <ResultTile
              label="U-100 insulin syringe"
              value={doseUnits != null ? `${trim(doseUnits)} units` : "—"}
              highlight
            />
            <ResultTile label="Per 1 mL" value={concentration ? `${trim(concentration)} mg` : "—"} />
          </dl>

          <div className="mt-6">
            <Syringe units={doseUnits ?? 0} />
          </div>

          {overflow && (
            <p className="mt-4 rounded-2xl bg-blush-100 px-4 py-3 text-[0.85rem] font-medium leading-relaxed text-blush-500 dark:bg-blush-500/20 dark:text-blush-200">
              ✦ This volume is more than one 100-unit syringe ({trim(doseUnits! / 100)} mL). Double-check
              the numbers with your provider or pharmacy before drawing anything.
            </p>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <MgMcgConverter />
        <MlUnitsConverter />
      </div>

      <Disclaimer>
        This studio performs arithmetic only — (mg in vial) ÷ (mL of diluent) and (provider dose) ÷
        (concentration). It does not recommend, adjust, or validate any dose. Always confirm your
        protocol, mixing instructions, and syringe type with your own licensed provider or pharmacist.
      </Disclaimer>
    </div>
  );
}

function trim(n: number): string {
  return parseFloat(n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2)).toString();
}

function ResultTile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={
        highlight
          ? "rounded-2xl bg-champagne-200/50 px-4 py-3 dark:bg-champagne-600/20"
          : "rounded-2xl bg-sunken/70 px-4 py-3"
      }
    >
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 font-display text-xl font-medium text-ink-strong">{value}</dd>
    </div>
  );
}

/* Visual U-100 syringe, 0–100 units with major ticks every 10 */
function Syringe({ units }: { units: number }) {
  const fill = Math.max(0, Math.min(100, units));
  const W = 320, H = 74;
  const bx = 24, bw = 250, by = 24, bh = 26; // barrel
  return (
    <div>
      <p className="eyebrow mb-2">Visual syringe · U-100</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md" role="img"
        aria-label={`Syringe showing ${trim(fill)} of 100 units`}>
        {/* needle */}
        <rect x={bx + bw} y={by + bh / 2 - 1.2} width={30} height={2.4} rx={1.2} fill="var(--ink-faint)" />
        {/* plunger */}
        <rect x={4} y={by + 4} width={14} height={bh - 8} rx={3} fill="var(--line-strong)" />
        <rect x={16} y={by + bh / 2 - 2} width={8} height={4} fill="var(--line-strong)" />
        {/* barrel */}
        <rect x={bx} y={by} width={bw} height={bh} rx={9} fill="var(--surface-sunken)" stroke="var(--line-strong)" />
        {/* fill */}
        {fill > 0 && (
          <rect x={bx + 2} y={by + 2} width={Math.max(4, (bw - 4) * (fill / 100))} height={bh - 4} rx={7}
            fill="var(--chart-gold)" opacity={0.55} />
        )}
        {/* ticks */}
        {Array.from({ length: 11 }, (_, i) => {
          const x = bx + 2 + ((bw - 4) * i) / 10;
          return (
            <g key={i}>
              <line x1={x} y1={by - 5} x2={x} y2={by} stroke="var(--ink-faint)" strokeWidth={1.2} />
              <text x={x} y={by - 9} textAnchor="middle" fontSize={8.5} fill="var(--ink-faint)" fontFamily="inherit">
                {i * 10}
              </text>
            </g>
          );
        })}
        {/* marker line at dose */}
        {fill > 0 && (
          <g>
            <line
              x1={bx + 2 + (bw - 4) * (fill / 100)} y1={by - 2}
              x2={bx + 2 + (bw - 4) * (fill / 100)} y2={by + bh + 4}
              stroke="var(--chart-rose)" strokeWidth={2} strokeLinecap="round"
            />
            <text
              x={bx + 2 + (bw - 4) * (fill / 100)} y={by + bh + 16}
              textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--chart-rose)" fontFamily="inherit"
            >
              {trim(fill)} u
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function MgMcgConverter() {
  const [mg, setMg] = useState("");
  const [mcg, setMcg] = useState("");
  return (
    <Card>
      <SectionTitle className="mb-1">mg ⇄ mcg</SectionTitle>
      <p className="mb-4 text-[0.82rem] text-ink-soft">1 mg = 1,000 mcg</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Milligrams (mg)">
          <Input inputMode="decimal" value={mg}
            onChange={(e) => {
              setMg(e.target.value);
              const n = parseNum(e.target.value);
              setMcg(n != null ? trim(n * 1000) : "");
            }} placeholder="0.25" />
        </Field>
        <Field label="Micrograms (mcg)">
          <Input inputMode="decimal" value={mcg}
            onChange={(e) => {
              setMcg(e.target.value);
              const n = parseNum(e.target.value);
              setMg(n != null ? trim(n / 1000) : "");
            }} placeholder="250" />
        </Field>
      </div>
    </Card>
  );
}

function MlUnitsConverter() {
  const [ml, setMl] = useState("");
  const [u, setU] = useState("");
  return (
    <Card>
      <SectionTitle className="mb-1">mL ⇄ insulin units</SectionTitle>
      <p className="mb-4 text-[0.82rem] text-ink-soft">On a U-100 syringe, 1 mL = 100 units</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Milliliters (mL)">
          <Input inputMode="decimal" value={ml}
            onChange={(e) => {
              setMl(e.target.value);
              const n = parseNum(e.target.value);
              setU(n != null ? trim(n * 100) : "");
            }} placeholder="0.3" />
        </Field>
        <Field label="Units (U-100)">
          <Input inputMode="decimal" value={u}
            onChange={(e) => {
              setU(e.target.value);
              const n = parseNum(e.target.value);
              setMl(n != null ? trim(n / 100) : "");
            }} placeholder="30" />
        </Field>
      </div>
    </Card>
  );
}

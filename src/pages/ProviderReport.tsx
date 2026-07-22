import React, { useMemo, useState } from "react";
import { Printer, ArrowLeft, FileHeart } from "lucide-react";
import { useStore, byProfile, today, fmtDate, addDays, computeCycleInfo, CYCLE_PHASE_LABEL } from "../lib/store";
import { PageHeader, Card, Button, Chip, Disclaimer } from "../components/ui";
import { MENO_SYMPTOMS, SEVERITY_LABELS } from "../data/wellness";

/* —— Provider visit report ————————————————————————
   One tap: everything a provider asks about in the first five minutes of an
   appointment — current therapies, symptom patterns, cycle, vitals, labs,
   and the questions saved at 2 a.m. — over the last 30 or 90 days, laid out
   to be printed or saved as a PDF and handed over. The report presents the
   user's own logged data verbatim; it draws no conclusions. */

export function ProviderReport() {
  const { db, activeProfile } = useStore();
  const pid = activeProfile.id;
  const [days, setDays] = useState<30 | 90>(30);
  const end = today();
  const start = addDays(end, -days);

  const inRange = (d: string) => d >= start && d <= end;

  const hormones = byProfile(db.hormones, pid).filter((h) => h.active);
  const injectables = byProfile(db.injectables, pid).filter((i) => i.active);
  const supplements = byProfile(db.supplements, pid).filter((s) => s.active);
  const injectionLogs = byProfile(db.injectionLogs, pid).filter((l) => inRange(l.date));
  const questions = byProfile(db.providerQuestions, pid).filter((q) => !q.asked);
  const labs = byProfile(db.labs, pid).filter((l) => l.marker).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
  const beautyLogs = byProfile(db.beautyLogs, pid).filter((l) => inRange(l.date) && !l.skipped);
  const cycle = computeCycleInfo(db.periods, pid);
  const periods = byProfile(db.periods, pid).filter((p) => inRange(p.startDate)).sort((a, b) => b.startDate.localeCompare(a.startDate));

  const symptomRows = useMemo(() => {
    const logs = byProfile(db.symptomLogs, pid).filter((l) => inRange(l.date));
    return MENO_SYMPTOMS.map((s) => {
      const vals = logs.map((l) => l.symptoms[s.key] ?? 0).filter((v) => v > 0);
      if (!vals.length) return null;
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const worst = Math.max(...vals);
      return { label: s.label, days: vals.length, avg, worst };
    })
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.days - a.days);
  }, [db.symptomLogs, pid, start, end]);

  const vitals = useMemo(() => {
    const logs = byProfile(db.dailyLogs, pid).filter((l) => inRange(l.date));
    const nums = (pick: (l: (typeof logs)[number]) => number) => logs.map(pick).filter((v) => v > 0);
    const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
    const sleepHrs = logs.map((l) => parseFloat(l.sleepHours)).filter((v) => !isNaN(v));
    const weights = logs
      .filter((l) => !isNaN(parseFloat(l.weight)))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((l) => parseFloat(l.weight));
    return {
      mood: avg(nums((l) => l.mood)),
      energy: avg(nums((l) => l.energy)),
      sleepQuality: avg(nums((l) => l.sleepQuality)),
      sleepHours: avg(sleepHrs),
      weightFirst: weights[0] ?? null,
      weightLast: weights.length > 1 ? weights[weights.length - 1] : null,
      daysLogged: logs.length,
    };
  }, [db.dailyLogs, pid, start, end]);

  const skinIssues = useMemo(
    () =>
      byProfile(db.skincareChecks, pid)
        .filter((c) => inRange(c.date) && c.issues.trim())
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6),
    [db.skincareChecks, pid, start, end]
  );

  const fmt1 = (n: number | null) => (n == null ? "—" : (Math.round(n * 10) / 10).toString());

  return (
    <div>
      <div className="no-print">
        <PageHeader
          eyebrow="For your appointment"
          title="Provider Report"
          sub="Your last weeks, organized the way appointments actually start — print it, save it as a PDF, or just hand your phone over."
          actions={
            <>
              <Button variant="outline" onClick={() => window.history.back()}><ArrowLeft size={15} /> Back</Button>
              <Button onClick={() => window.print()}><Printer size={16} /> Print / save PDF</Button>
            </>
          }
        />
        <div className="mb-6 flex items-center gap-2">
          <span className="text-[0.85rem] font-semibold text-ink-soft">Covering:</span>
          <Chip active={days === 30} onClick={() => setDays(30)}>Last 30 days</Chip>
          <Chip active={days === 90} onClick={() => setDays(90)}>Last 90 days</Chip>
        </div>
      </div>

      {/* —— The printable report —— */}
      <div className="print-page space-y-5">
        <Card className="print:border-0 print:shadow-none">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="eyebrow">Wellness visit report</p>
              <h2 className="font-display text-2xl font-medium text-ink-strong">{activeProfile.name}</h2>
              <p className="mt-1 text-[0.85rem] text-ink-soft">
                {fmtDate(start)} – {fmtDate(end)} · prepared {fmtDate(end)} · self-reported from The Biohacker Operating System
              </p>
            </div>
            <FileHeart size={22} className="no-print shrink-0 text-blush-400" />
          </div>

          {/* Current therapies */}
          <ReportSection title="Current therapies & medications (as recorded by me)">
            {hormones.length === 0 && injectables.length === 0 ? (
              <p className="text-[0.85rem] text-ink-faint">None recorded.</p>
            ) : (
              <ul className="space-y-1 text-[0.88rem]">
                {hormones.map((h) => (
                  <li key={h.id}>
                    <span className="font-semibold text-ink-strong">{h.name}</span>
                    <span className="text-ink-soft"> · {h.form}{h.providerDose && ` · ${h.providerDose}`}{h.schedule && ` · ${h.schedule}`}{h.provider && ` · prescribed by ${h.provider}`}</span>
                  </li>
                ))}
                {injectables.map((i) => (
                  <li key={i.id}>
                    <span className="font-semibold text-ink-strong">{i.name}</span>
                    <span className="text-ink-soft"> · {i.category}{i.providerDose && ` · ${i.providerDose}${i.units ? ` ${i.units}` : ""}`}{i.schedule && ` · ${i.schedule}`}</span>
                    {injectionLogs.some((l) => l.protocolId === i.id) && (
                      <span className="text-ink-faint"> · {injectionLogs.filter((l) => l.protocolId === i.id).length} doses logged this period</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </ReportSection>

          {/* Supplements */}
          <ReportSection title="Supplements">
            {supplements.length === 0 ? (
              <p className="text-[0.85rem] text-ink-faint">None recorded.</p>
            ) : (
              <p className="text-[0.88rem] leading-relaxed text-ink">
                {supplements.map((s) => s.name + (s.dose ? ` (${s.dose})` : "")).join(" · ")}
              </p>
            )}
          </ReportSection>

          {/* Symptoms */}
          <ReportSection title={`Symptom patterns · last ${days} days`}>
            {symptomRows.length === 0 ? (
              <p className="text-[0.85rem] text-ink-faint">No symptoms logged in this period.</p>
            ) : (
              <table className="w-full text-left text-[0.85rem]">
                <thead>
                  <tr className="text-[0.7rem] uppercase tracking-wider text-ink-faint">
                    <th className="py-1 pr-3 font-semibold">Symptom</th>
                    <th className="py-1 pr-3 font-semibold">Days reported</th>
                    <th className="py-1 pr-3 font-semibold">Typical severity</th>
                    <th className="py-1 font-semibold">Worst</th>
                  </tr>
                </thead>
                <tbody>
                  {symptomRows.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <td className="py-1.5 pr-3 font-medium text-ink-strong">{r.label}</td>
                      <td className="py-1.5 pr-3">{r.days} of {days}</td>
                      <td className="py-1.5 pr-3">{SEVERITY_LABELS[Math.round(r.avg)] ?? "—"}</td>
                      <td className="py-1.5">{SEVERITY_LABELS[r.worst] ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ReportSection>

          {/* Cycle */}
          {(cycle || periods.length > 0) && (
            <ReportSection title="Cycle">
              <p className="text-[0.88rem] text-ink">
                {periods.length > 0 && <>Period starts this period: {periods.map((p) => fmtDate(p.startDate)).join(", ")}. </>}
                {cycle && (
                  <>
                    Currently day {cycle.cycleDay} ({CYCLE_PHASE_LABEL[cycle.phase]}).
                    {cycle.avgCycleLength && <> Personal average cycle: {cycle.avgCycleLength} days over {cycle.cyclesLogged} cycles.</>}
                  </>
                )}
              </p>
              <p className="mt-1 text-[0.72rem] text-ink-faint">Estimates from self-logged period start dates — not a fertility or contraception tool.</p>
            </ReportSection>
          )}

          {/* Vitals */}
          <ReportSection title={`Daily check-in averages · ${vitals.daysLogged} days logged`}>
            <div className="flex flex-wrap gap-x-8 gap-y-1.5 text-[0.88rem] text-ink">
              <span>Mood: <b className="text-ink-strong">{fmt1(vitals.mood)}</b>/5</span>
              <span>Energy: <b className="text-ink-strong">{fmt1(vitals.energy)}</b>/5</span>
              <span>Sleep quality: <b className="text-ink-strong">{fmt1(vitals.sleepQuality)}</b>/5</span>
              <span>Sleep: <b className="text-ink-strong">{fmt1(vitals.sleepHours)}</b> hrs avg</span>
              {vitals.weightFirst != null && (
                <span>
                  Weight: <b className="text-ink-strong">{vitals.weightFirst}</b>
                  {vitals.weightLast != null && <> → <b className="text-ink-strong">{vitals.weightLast}</b></>} over the period
                </span>
              )}
            </div>
          </ReportSection>

          {/* Labs */}
          {labs.length > 0 && (
            <ReportSection title="Recent lab results (self-recorded)">
              <table className="w-full text-left text-[0.85rem]">
                <thead>
                  <tr className="text-[0.7rem] uppercase tracking-wider text-ink-faint">
                    <th className="py-1 pr-3 font-semibold">Marker</th>
                    <th className="py-1 pr-3 font-semibold">Value</th>
                    <th className="py-1 pr-3 font-semibold">Ref range</th>
                    <th className="py-1 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {labs.map((l) => (
                    <tr key={l.id} className="border-t border-line">
                      <td className="py-1.5 pr-3 font-medium text-ink-strong">{l.panel} · {l.marker}</td>
                      <td className="py-1.5 pr-3">{l.value} {l.unit}{l.flagged && <span className="ml-1.5 font-semibold text-blush-500">⚑</span>}</td>
                      <td className="py-1.5 pr-3">{l.range || "—"}</td>
                      <td className="py-1.5">{fmtDate(l.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ReportSection>
          )}

          {/* Beauty treatments */}
          {beautyLogs.length > 0 && (
            <ReportSection title="Cosmetic / skin treatments this period">
              <ul className="space-y-1 text-[0.88rem] text-ink">
                {beautyLogs.slice(0, 8).map((l) => {
                  const t = db.beautyTreatments.find((x) => x.id === l.treatmentId);
                  return (
                    <li key={l.id}>
                      {fmtDate(l.date)} · <span className="font-medium text-ink-strong">{t?.name ?? "Treatment"}</span>
                      {t?.product && ` (${t.product})`}{l.reaction && ` — ${l.reaction}`}
                    </li>
                  );
                })}
              </ul>
            </ReportSection>
          )}

          {/* Skin issues */}
          {skinIssues.length > 0 && (
            <ReportSection title="Skin reactions noted">
              <ul className="space-y-1 text-[0.88rem] text-ink">
                {skinIssues.map((c) => (
                  <li key={c.id}>{fmtDate(c.date)} · {c.issues}</li>
                ))}
              </ul>
            </ReportSection>
          )}

          {/* Questions */}
          <ReportSection title="Questions I'd like to ask">
            {questions.length === 0 ? (
              <p className="text-[0.85rem] text-ink-faint">No open questions saved.</p>
            ) : (
              <ol className="list-decimal space-y-1 pl-5 text-[0.88rem] text-ink">
                {questions.map((q) => (
                  <li key={q.id}>{q.question}</li>
                ))}
              </ol>
            )}
          </ReportSection>

          <p className="mt-5 border-t border-line pt-3 text-[0.72rem] leading-relaxed text-ink-faint">
            Self-reported data recorded by the patient in a personal organizational tool. Not a
            medical record, not medical advice, and not a substitute for clinical assessment. Doses
            shown are as the patient recorded them from their own providers and product labels.
          </p>
        </Card>
      </div>

      <div className="no-print">
        <Disclaimer>
          This report simply arranges your own logged entries for an appointment — it draws no
          conclusions and makes no recommendations. Bring it, hand it over, and let the
          conversation start further ahead.
        </Disclaimer>
      </div>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="eyebrow mb-2">{title}</h3>
      {children}
    </section>
  );
}

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useStore } from "../lib/store";
import { Button, Chip, cx } from "../components/ui";
import { MAIN_GOALS } from "../data/wellness";
import type { OnboardingAnswers } from "../lib/types";

/* A slow, spacious welcome — more boutique atelier than sign-up form. */

interface ModuleQuestion {
  key: keyof OnboardingAnswers;
  title: string;
  sub: string;
  emoji: string;
}

const MODULE_QUESTIONS: ModuleQuestion[] = [
  { key: "peptides", title: "Peptides & injectables", sub: "Protocol log, site rotation, vials & refills", emoji: "💉" },
  { key: "glp1", title: "GLP-1 journey", sub: "Semaglutide, tirzepatide & friends", emoji: "🌙" },
  { key: "hrt", title: "HRT", sub: "Estrogen, progesterone, testosterone, thyroid", emoji: "🌷" },
  { key: "menopause", title: "Peri & menopause", sub: "Symptoms, cycles, trends over time", emoji: "🔥" },
  { key: "supplements", title: "Supplements", sub: "Stacks, inventory, reorder reminders", emoji: "💊" },
  { key: "redLight", title: "Red light therapy", sub: "Sessions, consistency, before & after", emoji: "🔴" },
  { key: "coldPlunge", title: "Cold plunge", sub: "Temps, minutes, personal bests", emoji: "🧊" },
  { key: "sauna", title: "Sauna", sub: "Infrared, traditional, steam", emoji: "🔥" },
  { key: "labs", title: "Labs & biomarkers", sub: "A beautiful binder for your bloodwork", emoji: "🧪" },
  { key: "beauty", title: "Beauty Studio", sub: "Peels, microneedling, LED & your daily routine", emoji: "✨" },
  { key: "wearables", title: "Wearables", sub: "Oura, WHOOP, Apple Watch & more", emoji: "⌚" },
  { key: "pets", title: "Pet wellness", sub: "Their supplements & vet care too", emoji: "🐾" },
  { key: "household", title: "Household profiles", sub: "Track for the people you love", emoji: "🏡" },
];

export function Onboarding() {
  const { update } = useStore();
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, boolean>>({
    peptides: true, glp1: false, hrt: true, menopause: true, supplements: true,
    redLight: false, coldPlunge: false, sauna: false, labs: true, wearables: false,
    beauty: true, pets: false, household: false,
  });
  const [aesthetic, setAesthetic] = useState<"cream" | "sage" | "blush">("cream");

  const totalSteps = 4;

  const finish = () => {
    update((d) => {
      d.settings.onboarding = {
        completed: true,
        mainGoal: goals.join(" · "),
        peptides: answers.peptides, glp1: answers.glp1, hrt: answers.hrt,
        menopause: answers.menopause, supplements: answers.supplements,
        redLight: answers.redLight, coldPlunge: answers.coldPlunge, sauna: answers.sauna,
        labs: answers.labs, wearables: answers.wearables, beauty: answers.beauty,
        pets: answers.pets, household: answers.household, aesthetic,
      };
      if (name.trim()) d.profiles[0].name = name.trim();
    });
  };

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-12">
      {/* progress petals */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={cx(
              "h-1.5 rounded-full transition-all duration-500",
              i === step ? "w-10 bg-champagne-400" : i < step ? "w-4 bg-sage-400" : "w-4 bg-line-strong"
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="fade-up text-center">
          <img src="/icons/icon.svg" alt="" className="mx-auto mb-8 h-20 w-20 rounded-3xl shadow-lifted" />
          <p className="eyebrow mb-3">Welcome to</p>
          <h1 className="font-display text-4xl font-medium leading-tight sm:text-5xl">
            The Biohacker<br />Operating System
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
            One private, beautiful home for your peptides, hormones, supplements, and every
            small ritual that adds up to feeling like <em>you</em> again.
          </p>
          <div className="mt-10">
            <label className="mx-auto block max-w-xs text-left">
              <span className="mb-1.5 block text-[0.8rem] font-semibold tracking-wide text-ink-soft">
                What should we call you?
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                className="w-full rounded-2xl border border-line bg-raised px-4 py-3 text-center text-lg placeholder:text-ink-faint focus:border-champagne-400"
              />
            </label>
          </div>
          <Button className="mt-8 px-8 py-3 text-base" onClick={() => setStep(1)}>
            Begin <ArrowRight size={17} />
          </Button>
          <p className="mt-8 text-xs leading-relaxed text-ink-faint">
            Your data lives privately on this device. <strong className="text-ink-soft">We are not
            doctors and this is not medical advice</strong> — it's a planner. Always consult your own
            physician before changing any medication, peptide, hormone, or supplement. Full details
            live under Legal &amp; Disclaimers.
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="fade-up">
          <p className="eyebrow mb-2">Step 1 · Your intention</p>
          <h2 className="font-display text-3xl font-medium">What brings you here?</h2>
          <p className="mt-2 text-ink-soft">Choose as many as feel true right now — most of us are juggling more than one.</p>
          <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {MAIN_GOALS.map((g) => {
              const selected = goals.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => setGoals((gs) => (gs.includes(g) ? gs.filter((x) => x !== g) : [...gs, g]))}
                  className={cx(
                    "card card-hover flex items-center justify-between gap-3 px-5 py-4 text-left text-[0.95rem] font-medium",
                    selected && "!border-champagne-400 bg-champagne-200/30 dark:bg-champagne-600/15"
                  )}
                >
                  {g}
                  {selected && <Check size={17} className="shrink-0 text-champagne-600 dark:text-champagne-300" />}
                </button>
              );
            })}
          </div>
          <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={goals.length === 0} />
        </div>
      )}

      {step === 2 && (
        <div className="fade-up">
          <p className="eyebrow mb-2">Step 2 · Your modules</p>
          <h2 className="font-display text-3xl font-medium">Build your operating system</h2>
          <p className="mt-2 text-ink-soft">
            Turn on what you track today — everything can be changed later in Settings.
          </p>
          <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {MODULE_QUESTIONS.map((m) => {
              const on = answers[m.key as string];
              return (
                <button
                  key={m.key as string}
                  onClick={() => setAnswers((a) => ({ ...a, [m.key as string]: !on }))}
                  className={cx(
                    "card card-hover flex items-start gap-3.5 px-4.5 py-4 text-left",
                    on && "!border-sage-400 bg-sage-100/50 dark:bg-sage-600/15"
                  )}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.95rem] font-semibold text-ink-strong">{m.title}</span>
                    <span className="mt-0.5 block text-[0.8rem] text-ink-soft">{m.sub}</span>
                  </span>
                  <span
                    className={cx(
                      "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      on ? "border-sage-500 bg-sage-400 text-white" : "border-line-strong"
                    )}
                  >
                    {on && <Check size={12} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
          <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
        </div>
      )}

      {step === 3 && (
        <div className="fade-up">
          <p className="eyebrow mb-2">Step 3 · Your aesthetic</p>
          <h2 className="font-display text-3xl font-medium">Set the mood</h2>
          <p className="mt-2 text-ink-soft">A subtle accent that colors your dashboard.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {(
              [
                { key: "cream", label: "Champagne Cream", swatch: ["#F7F1E8", "#DCC08C", "#B08D57"] },
                { key: "sage", label: "Garden Sage", swatch: ["#E4E8DE", "#AAB99E", "#6F7F66"] },
                { key: "blush", label: "Soft Blush", swatch: ["#F5E3DC", "#DCA994", "#C98D7D"] },
              ] as const
            ).map((a) => (
              <button
                key={a.key}
                onClick={() => setAesthetic(a.key)}
                className={cx(
                  "card card-hover px-5 py-5 text-left",
                  aesthetic === a.key && "!border-champagne-400"
                )}
              >
                <span className="flex gap-1.5">
                  {a.swatch.map((c) => (
                    <span key={c} className="h-8 w-8 rounded-full border border-black/5" style={{ background: c }} />
                  ))}
                </span>
                <span className="mt-3 block font-display text-lg font-medium text-ink-strong">{a.label}</span>
                {aesthetic === a.key && (
                  <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-champagne-600 dark:text-champagne-300">
                    <Check size={13} /> Selected
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="card mt-8 px-5 py-4 text-[0.85rem] leading-relaxed text-ink-soft">
            ✨ <strong className="text-ink">You're all set{name ? `, ${name}` : ""}.</strong> Your
            operating system opens to today's protocol. Every module you switched on is waiting in
            the sidebar — and your printable companion binder lives in the Printable Studio.
          </div>
          <StepNav onBack={() => setStep(2)} onNext={finish} nextLabel="Enter my OS" />
        </div>
      )}
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-9 flex items-center justify-between">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft size={16} /> Back
      </Button>
      <Button onClick={onNext} disabled={nextDisabled} className="px-7">
        {nextLabel} <ArrowRight size={16} />
      </Button>
    </div>
  );
}

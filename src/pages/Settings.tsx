import React, { useRef, useState } from "react";
import { Download, Upload, Cloud, ShieldCheck, Sparkles, Smartphone } from "lucide-react";
import { useStore, triggerBackupDownload, daysSince } from "../lib/store";
import {
  PageHeader, Card, Button, Field, Input, Select, Toggle, Disclaimer, SectionTitle,
} from "../components/ui";
import type { OnboardingAnswers } from "../lib/types";

const MODULE_TOGGLES: { key: keyof OnboardingAnswers; label: string }[] = [
  { key: "peptides", label: "Peptides & injectables" },
  { key: "glp1", label: "GLP-1 journey" },
  { key: "hrt", label: "HRT" },
  { key: "menopause", label: "Peri & menopause" },
  { key: "supplements", label: "Supplements" },
  { key: "redLight", label: "Red light therapy" },
  { key: "coldPlunge", label: "Cold plunge" },
  { key: "sauna", label: "Sauna" },
  { key: "labs", label: "Labs & biomarkers" },
  { key: "wearables", label: "Wearables" },
  { key: "pets", label: "Pet profiles" },
  { key: "household", label: "Household profiles" },
];

export function SettingsPage() {
  const { db, update, exportJson, importJson, resetAll } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState("");
  const ob = db.settings.onboarding;

  const download = () => triggerBackupDownload(exportJson());
  const backupAge = daysSince(db.settings.lastBackupAt);

  return (
    <div>
      <PageHeader
        eyebrow="Your world"
        title="Settings"
        sub="Theme, modules, backups, and your privacy — all in one quiet corner."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <SectionTitle className="mb-4">Appearance</SectionTitle>
          <Field label="Theme">
            <Select
              value={db.settings.theme}
              onChange={(e) => update((d) => void (d.settings.theme = e.target.value as any))}
            >
              <option value="system">Follow my device</option>
              <option value="light">Light · cream & champagne</option>
              <option value="dark">Dark · espresso & candlelight</option>
            </Select>
          </Field>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Smartphone size={17} className="text-sage-500" />
            <SectionTitle>Install as an app</SectionTitle>
          </div>
          <p className="text-[0.88rem] leading-relaxed text-ink-soft">
            <strong className="text-ink">iPhone / iPad:</strong> open in Safari → Share → “Add to Home
            Screen.”<br />
            <strong className="text-ink">Android:</strong> Chrome menu → “Install app.”<br />
            <strong className="text-ink">Desktop:</strong> the install icon in your address bar.<br />
            It opens full-screen, works offline, and feels native.
          </p>
        </Card>

        <Card className="md:col-span-2">
          <SectionTitle className="mb-1">Modules</SectionTitle>
          <p className="mb-5 text-[0.85rem] text-ink-soft">Shape your sidebar — nothing is deleted when a module is off.</p>
          <div className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {MODULE_TOGGLES.map((m) => (
              <div key={m.key as string} className="flex items-center justify-between gap-3">
                <span className="text-[0.92rem] font-medium text-ink">{m.label}</span>
                <Toggle
                  checked={Boolean(ob[m.key])}
                  onChange={(v) => update((d) => void ((d.settings.onboarding as any)[m.key] = v))}
                  label={m.label}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck size={17} className="text-sage-500" />
            <SectionTitle>Backups & privacy</SectionTitle>
          </div>
          <p className="mb-4 text-[0.85rem] leading-relaxed text-ink-soft">
            Everything lives only in this browser — there is no server copy. Clearing your browser
            data, switching devices, or your browser silently evicting storage can erase it for
            good. Export a backup regularly; it's a single file you own, restorable on any device.
          </p>
          <p className={backupAge === null ? "mb-3 text-[0.82rem] font-semibold text-blush-500 dark:text-blush-300" : backupAge >= 14 ? "mb-3 text-[0.82rem] font-semibold text-blush-500 dark:text-blush-300" : "mb-3 text-[0.82rem] font-medium text-sage-600 dark:text-sage-300"}>
            {backupAge === null ? "You have never backed up." : backupAge === 0 ? "Backed up today. ✓" : `Last backup: ${backupAge} day${backupAge === 1 ? "" : "s"} ago.`}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={download}><Download size={15} /> Export backup</Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload size={15} /> Restore backup</Button>
          </div>
          <input
            ref={fileRef} type="file" accept=".json" className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) f.text().then((t) => setImportMsg(importJson(t) ? "Backup restored beautifully. ✨" : "That file didn't look like a Biohacker OS backup."));
              e.target.value = "";
            }}
          />
          {importMsg && <p className="mt-3 text-[0.83rem] font-medium text-sage-600 dark:text-sage-300">{importMsg}</p>}
          <div className="mt-6 border-t border-line pt-4">
            <Button
              variant="danger"
              onClick={() => {
                if (confirm("Erase everything and start fresh? Export a backup first if you want to keep your data."))
                  resetAll();
              }}
            >
              Erase all data
            </Button>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Cloud size={17} className="text-champagne-600 dark:text-champagne-300" />
            <SectionTitle>Cloud sync</SectionTitle>
          </div>
          <p className="text-[0.85rem] leading-relaxed text-ink-soft">
            You're in <strong className="text-ink">private device mode</strong> — nothing leaves this
            device, and there is currently no account or cloud sync feature in this version. Because
            everything lives only in this browser (see the backup reminder above), this is also why
            regular exports matter.
          </p>
          <Field label="Email for future updates (optional)" className="mt-4">
            <Input
              type="email"
              value={db.settings.cloud.email}
              onChange={(e) => update((d) => void (d.settings.cloud.email = e.target.value))}
              placeholder="you@example.com"
            />
          </Field>
        </Card>

        <Card className="md:col-span-2 bg-sunken/40">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-champagne-600 dark:text-champagne-300" />
            <SectionTitle>About</SectionTitle>
          </div>
          <p className="text-[0.85rem] leading-relaxed text-ink-soft">
            The Ultimate Biohacker Operating System · v1.0 · by GlowHausDigital — a private
            wellness planner for peptides, hormones, supplements and rituals. It organizes
            information you and your providers create; it never gives medical advice, suggests
            doses, or replaces care.
          </p>
          <button
            onClick={() => (window.location.hash = "/legal")}
            className="mt-3 text-[0.85rem] font-semibold text-champagne-600 underline underline-offset-2 dark:text-champagne-300"
          >
            Read the full Legal &amp; Disclaimers →
          </button>
        </Card>
      </div>

      <Disclaimer>
        If you rerun onboarding (below), your data stays safe — only the welcome flow repeats.
        <button
          className="ml-2 font-semibold text-champagne-600 underline underline-offset-2 dark:text-champagne-300"
          onClick={() => update((d) => void (d.settings.onboarding.completed = false))}
        >
          Rerun onboarding
        </button>
      </Disclaimer>
    </div>
  );
}

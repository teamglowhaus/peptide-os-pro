import React from "react";
import { ShieldAlert, Stethoscope, Scale, Building2, Lock, Phone } from "lucide-react";
import { PageHeader, Card, SectionTitle } from "../components/ui";

/* Legal & Disclaimers — the plain-language "please read" page.
   Also exported as docs/license.md for the Etsy delivery. */

export function Legal() {
  return (
    <div>
      <PageHeader
        eyebrow="Your world"
        title="Legal & Disclaimers"
        sub="The important, plain-language part. Please read it once — it protects you and keeps this planner honest about what it is."
      />

      {/* Medical disclaimer — the headline statement */}
      <Card className="border-2 !border-blush-300/70 bg-blush-100/40 dark:bg-blush-500/10">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-200/70 text-blush-500 dark:bg-blush-500/25 dark:text-blush-200">
            <ShieldAlert size={19} />
          </span>
          <SectionTitle>This is not medical advice</SectionTitle>
        </div>
        <div className="space-y-3 text-[0.92rem] leading-relaxed text-ink">
          <p>
            <strong className="text-ink-strong">
              We are not doctors, nurses, pharmacists, or any kind of licensed medical professional,
              and this app does not provide medical advice.
            </strong>{" "}
            The Ultimate Biohacker Operating System is a personal organization and journaling tool
            — nothing more. It helps you write down and keep track of information that you and your
            own providers create.
          </p>
          <p>
            <strong className="text-ink-strong">Always consult your own physician</strong> or a
            qualified healthcare provider before starting, stopping, or changing any medication,
            peptide, injectable, hormone therapy, supplement, or wellness practice — and with any
            question you have about a medical condition or symptom. Never disregard professional
            medical advice, or delay seeking it, because of something you organized in this app.
          </p>
          <p>
            Nothing in this app is intended to diagnose, treat, cure, or prevent any disease or
            health condition. Any dose, schedule, or note you record here should come directly from{" "}
            <strong className="text-ink-strong">your provider or the product's label</strong> — this
            app never suggests, recommends, calculates, or verifies a dose for you. The reconstitution
            tool performs basic arithmetic only on numbers you enter; it is not dosing guidance.
          </p>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Phone size={17} className="text-blush-500" />
            <SectionTitle>In an emergency</SectionTitle>
          </div>
          <p className="text-[0.9rem] leading-relaxed text-ink-soft">
            This app is not for emergencies and cannot help in one. If you think you may be having a
            medical emergency, call your local emergency number (911 in the US) or go to the nearest
            emergency room immediately. Do not rely on this app for urgent or time-sensitive needs.
          </p>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope size={17} className="text-sage-500" />
            <SectionTitle>No provider relationship</SectionTitle>
          </div>
          <p className="text-[0.9rem] leading-relaxed text-ink-soft">
            Using this app does not create a doctor–patient, pharmacist–patient, or any other
            professional-client relationship between you and GlowHausDigital. We cannot see your
            data and we do not review, monitor, or act on anything you record.
          </p>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert size={17} className="text-champagne-600 dark:text-champagne-300" />
            <SectionTitle>Your responsibility</SectionTitle>
          </div>
          <p className="text-[0.9rem] leading-relaxed text-ink-soft">
            You use this planner at your own discretion and risk. You are responsible for the accuracy
            of what you enter and for every health decision you make. Peptides, injectables, hormone
            therapies, supplements, cold exposure, heat exposure, and fasting all carry real risks —
            discuss them with your provider, who knows your history.
          </p>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Lock size={17} className="text-sage-500" />
            <SectionTitle>Your privacy</SectionTitle>
          </div>
          <p className="text-[0.9rem] leading-relaxed text-ink-soft">
            In device mode, your entries stay on your own device and are never transmitted to us or
            anyone else. You control your data completely, including exporting a backup or erasing
            everything from Settings. This app is not a HIPAA-covered service.
          </p>
        </Card>
      </div>

      {/* License */}
      <Card className="mt-4">
        <div className="mb-3 flex items-center gap-2">
          <Scale size={17} className="text-champagne-600 dark:text-champagne-300" />
          <SectionTitle>License &amp; terms of use</SectionTitle>
        </div>
        <div className="space-y-3 text-[0.9rem] leading-relaxed text-ink-soft">
          <p>
            Your purchase includes a lifetime, personal-use license from GlowHausDigital for you,
            your household members, and your pets.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sage-100/50 p-4 dark:bg-sage-600/15">
              <p className="mb-2 text-[0.8rem] font-bold uppercase tracking-wider text-sage-600 dark:text-sage-300">You may</p>
              <ul className="list-inside list-disc space-y-1 text-[0.86rem] text-ink">
                <li>Use the app on all of your own devices</li>
                <li>Track for your household and pets</li>
                <li>Print the companion pages as often as you like, for personal use</li>
                <li>Export, back up, and restore your own data</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-blush-100/50 p-4 dark:bg-blush-500/12">
              <p className="mb-2 text-[0.8rem] font-bold uppercase tracking-wider text-blush-500 dark:text-blush-200">You may not</p>
              <ul className="list-inside list-disc space-y-1 text-[0.86rem] text-ink">
                <li>Resell, redistribute, sublicense, or share the app link or files</li>
                <li>Upload the product for others to download</li>
                <li>Use the designs or pages to create products for sale</li>
                <li>Claim the work as your own</li>
              </ul>
            </div>
          </div>
          <p>
            <strong className="text-ink">Practitioner licensing:</strong> coaches or clinicians who'd
            like to share this system with clients can message GlowHausDigital for a practitioner
            license.
          </p>
          <p>
            <strong className="text-ink">No warranty; limitation of liability.</strong> This product
            is provided "as is," without warranties of any kind. To the fullest extent permitted by
            law, GlowHausDigital is not liable for any loss, injury, or damages arising from your use
            of — or inability to use — this app or its printable materials. Your sole remedy for any
            dissatisfaction is to stop using the product.
          </p>
        </div>
      </Card>

      {/* Non-affiliation */}
      <Card className="mt-4 bg-sunken/40">
        <div className="mb-3 flex items-center gap-2">
          <Building2 size={17} className="text-ink-soft" />
          <SectionTitle>Non-affiliation &amp; trademarks</SectionTitle>
        </div>
        <p className="text-[0.9rem] leading-relaxed text-ink-soft">
          This product is independent and is not affiliated with, endorsed by, sponsored by, or
          connected to any pharmaceutical company, supplement brand, device manufacturer, clinic, or
          healthcare provider. All product names, brand names, and trademarks that appear inside the
          app (for example in the reference libraries) belong to their respective owners and are
          shown solely to help you personally organize items you already use. Their inclusion is not
          a recommendation, and no brand has reviewed or approved this product.
        </p>
      </Card>

      <p className="mt-6 text-center text-[0.78rem] text-ink-faint">
        © GlowHausDigital · The Ultimate Biohacker Operating System · For personal use only.
        <br />
        This is an organizational tool. It is not medical advice and is not a medical device.
      </p>
    </div>
  );
}

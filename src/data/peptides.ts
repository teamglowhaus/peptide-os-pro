import type { InjectableCategory } from "../lib/types";

/* Reference library of peptides & injectables.
   Educational organization only — every dose field in the app reads
   "dose from your provider". Nothing here is medical advice. */

export interface PeptideLibraryEntry {
  name: string;
  category: InjectableCategory;
  commonGoal: string;    // why people track it — not a claim of effect
  storageNote: string;   // general handling reminder, verify with pharmacy
  tags: string[];
}

export const PEPTIDE_LIBRARY: PeptideLibraryEntry[] = [
  // — GLP-1 family —
  { name: "Semaglutide", category: "GLP-1", commonGoal: "Metabolic & weight journey", storageNote: "Refrigerate; follow pharmacy label", tags: ["glp-1", "weekly"] },
  { name: "Tirzepatide", category: "GLP-1", commonGoal: "Metabolic & weight journey", storageNote: "Refrigerate; follow pharmacy label", tags: ["glp-1", "gip", "weekly"] },
  { name: "Retatrutide", category: "GLP-1", commonGoal: "Metabolic & weight journey", storageNote: "Refrigerate; follow pharmacy label", tags: ["glp-1", "research"] },
  { name: "Liraglutide", category: "GLP-1", commonGoal: "Metabolic & weight journey", storageNote: "Refrigerate; follow pharmacy label", tags: ["glp-1", "daily"] },

  // — Recovery & repair peptides —
  { name: "BPC-157", category: "Peptide", commonGoal: "Recovery & gut support tracking", storageNote: "Refrigerate after reconstitution", tags: ["recovery"] },
  { name: "TB-500", category: "Peptide", commonGoal: "Recovery tracking", storageNote: "Refrigerate after reconstitution", tags: ["recovery"] },
  { name: "GHK-Cu", category: "Peptide", commonGoal: "Skin & hair tracking", storageNote: "Keep cool, away from light", tags: ["beauty", "copper"] },
  { name: "KPV", category: "Peptide", commonGoal: "Gut & skin comfort tracking", storageNote: "Refrigerate after reconstitution", tags: ["gut"] },
  { name: "Thymosin Alpha-1", category: "Peptide", commonGoal: "Immune wellness tracking", storageNote: "Refrigerate after reconstitution", tags: ["immune"] },
  { name: "Thymosin Beta-4", category: "Peptide", commonGoal: "Recovery tracking", storageNote: "Refrigerate after reconstitution", tags: ["recovery"] },

  // — Growth-hormone-axis peptides —
  { name: "CJC-1295", category: "Peptide", commonGoal: "Sleep, recovery & body composition tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },
  { name: "CJC-1295 DAC", category: "Peptide", commonGoal: "Sleep, recovery & body composition tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },
  { name: "Ipamorelin", category: "Peptide", commonGoal: "Sleep & recovery tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },
  { name: "Sermorelin", category: "Peptide", commonGoal: "Sleep & recovery tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },
  { name: "Tesamorelin", category: "Peptide", commonGoal: "Body composition tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },
  { name: "Hexarelin", category: "Peptide", commonGoal: "Recovery tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },
  { name: "GHRP-2", category: "Peptide", commonGoal: "Recovery tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },
  { name: "GHRP-6", category: "Peptide", commonGoal: "Recovery tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },
  { name: "AOD-9604", category: "Peptide", commonGoal: "Body composition tracking", storageNote: "Refrigerate after reconstitution", tags: ["gh-axis"] },

  // — Longevity & cellular —
  { name: "MOTS-c", category: "Longevity", commonGoal: "Mitochondrial & energy tracking", storageNote: "Refrigerate after reconstitution", tags: ["mitochondria"] },
  { name: "SS-31 (Elamipretide)", category: "Longevity", commonGoal: "Mitochondrial tracking", storageNote: "Refrigerate after reconstitution", tags: ["mitochondria"] },
  { name: "Epitalon", category: "Longevity", commonGoal: "Longevity protocol tracking", storageNote: "Refrigerate after reconstitution", tags: ["longevity"] },
  { name: "NAD+", category: "Longevity", commonGoal: "Energy & longevity tracking", storageNote: "Follow pharmacy label", tags: ["energy"] },

  // — Mood, cognition & sleep —
  { name: "Selank", category: "Peptide", commonGoal: "Calm & focus tracking", storageNote: "Often nasal; follow label", tags: ["mood"] },
  { name: "Semax", category: "Peptide", commonGoal: "Focus tracking", storageNote: "Often nasal; follow label", tags: ["focus"] },
  { name: "DSIP", category: "Peptide", commonGoal: "Sleep tracking", storageNote: "Refrigerate after reconstitution", tags: ["sleep"] },

  // — Intimacy & pigment —
  { name: "Melanotan II", category: "Peptide", commonGoal: "Pigment protocol tracking", storageNote: "Refrigerate after reconstitution", tags: ["pigment"] },
  { name: "PT-141 (Bremelanotide)", category: "Peptide", commonGoal: "Intimacy wellness tracking", storageNote: "Follow pharmacy label", tags: ["intimacy"] },
  { name: "Kisspeptin-10", category: "Hormone injection", commonGoal: "Hormone wellness tracking", storageNote: "Refrigerate after reconstitution", tags: ["hormone"] },

  // — Vitamin & wellness shots —
  { name: "Glutathione", category: "Wellness injection", commonGoal: "Antioxidant & glow tracking", storageNote: "Protect from light", tags: ["glow"] },
  { name: "L-Carnitine", category: "Vitamin injection", commonGoal: "Energy & fitness tracking", storageNote: "Room temp unless label says otherwise", tags: ["energy"] },
  { name: "Vitamin B12 (Methylcobalamin)", category: "Vitamin injection", commonGoal: "Energy tracking", storageNote: "Protect from light", tags: ["energy"] },
  { name: "MIC (Lipotropic blend)", category: "Vitamin injection", commonGoal: "Metabolic support tracking", storageNote: "Follow pharmacy label", tags: ["metabolic"] },
  { name: "Biotin injection", category: "Vitamin injection", commonGoal: "Hair & nails tracking", storageNote: "Follow pharmacy label", tags: ["beauty"] },
  { name: "Vitamin D injection", category: "Vitamin injection", commonGoal: "Vitamin D tracking", storageNote: "Follow pharmacy label", tags: ["immune"] },
  { name: "Amino blend", category: "Wellness injection", commonGoal: "Recovery & energy tracking", storageNote: "Follow pharmacy label", tags: ["recovery"] },
];

export const INJECTABLE_CATEGORIES: InjectableCategory[] = [
  "GLP-1", "Peptide", "Longevity", "Vitamin injection", "Hormone injection", "Wellness injection", "Custom",
];

/* Site-rotation map — 8 classic subcutaneous zones, in gentle rotation order */
export const INJECTION_SITES = [
  { key: "abd-ul", label: "Abdomen · upper left" },
  { key: "abd-ur", label: "Abdomen · upper right" },
  { key: "abd-ll", label: "Abdomen · lower left" },
  { key: "abd-lr", label: "Abdomen · lower right" },
  { key: "thigh-l", label: "Thigh · left" },
  { key: "thigh-r", label: "Thigh · right" },
  { key: "arm-l", label: "Back of arm · left" },
  { key: "arm-r", label: "Back of arm · right" },
];

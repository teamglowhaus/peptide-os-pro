import { useState, useEffect } from "react";

// ============================================================
// DATA: Complete Peptide Library
// ============================================================
const PEPTIDE_LIBRARY = [
  // HEALING & RECOVERY
  {
    id: "bpc157", name: "BPC-157", category: "Healing & Recovery",
    aka: "Body Protection Compound", color: "#00d4aa",
    halfLife: "4-6 hrs", commonDose: "250-500 mcg",
    adminRoute: ["SubQ", "IM", "Oral"],
    typicalFrequency: "1-2x daily",
    cycleLength: "4-12 weeks",
    benefits: ["Tissue repair", "Gut healing", "Tendon/ligament repair", "Anti-inflammatory"],
    link: "https://examine.com/supplements/bpc-157/",
    notes: "Most popular healing peptide. Refrigerate reconstituted. 28-day stability.",
    emoji: "🔬"
  },
  {
    id: "tb500", name: "TB-500", category: "Healing & Recovery",
    aka: "Thymosin Beta-4 Fragment", color: "#00d4aa",
    halfLife: "Days", commonDose: "2-5 mg",
    adminRoute: ["SubQ", "IM"],
    typicalFrequency: "2x/week",
    cycleLength: "4-6 weeks",
    benefits: ["Systemic tissue repair", "Cell migration", "Reduces inflammation", "Tendon healing"],
    link: "https://examine.com/supplements/thymosin-beta-4/",
    notes: "Often stacked with BPC-157 for synergistic healing effects.",
    emoji: "💪"
  },
  {
    id: "ghkcu", name: "GHK-Cu", category: "Skin & Anti-Aging",
    aka: "Copper Peptide GHK-Cu", color: "#c084fc",
    halfLife: "~1 hr", commonDose: "1-2 mg",
    adminRoute: ["SubQ", "Topical"],
    typicalFrequency: "Daily",
    cycleLength: "Ongoing",
    benefits: ["Collagen production", "Skin repair", "Wound healing", "Hair support", "Anti-aging"],
    link: "https://examine.com/supplements/ghk-cu/",
    notes: "Excellent safety profile. Topical or injectable. Longest research track record for skin.",
    emoji: "✨"
  },
  // GH AXIS
  {
    id: "cjc1295", name: "CJC-1295", category: "Growth Hormone",
    aka: "CJC-1295 w/ DAC", color: "#3b82f6",
    halfLife: "6-8 days (w/DAC)", commonDose: "1-2 mg",
    adminRoute: ["SubQ"],
    typicalFrequency: "1-2x/week",
    cycleLength: "12-16 weeks",
    benefits: ["GH release", "Muscle growth", "Fat loss", "Recovery", "Sleep quality"],
    link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2824650/",
    notes: "GHRH analog. Stack with Ipamorelin for synergistic GH pulse. Most popular GH combo.",
    emoji: "📈"
  },
  {
    id: "ipamorelin", name: "Ipamorelin", category: "Growth Hormone",
    aka: "GHRP-3 Analog", color: "#3b82f6",
    halfLife: "2 hrs", commonDose: "200-300 mcg",
    adminRoute: ["SubQ"],
    typicalFrequency: "1-3x daily",
    cycleLength: "12-16 weeks",
    benefits: ["GH pulse stimulation", "Muscle recovery", "Fat loss", "Anti-aging", "Sleep"],
    link: "https://examine.com/",
    notes: "Cleanest GHRP - minimal cortisol/prolactin spike. Best combined with CJC-1295.",
    emoji: "🔄"
  },
  {
    id: "sermorelin", name: "Sermorelin", category: "Growth Hormone",
    aka: "GHRH 1-29", color: "#3b82f6",
    halfLife: "10-20 min", commonDose: "200-500 mcg",
    adminRoute: ["SubQ"],
    typicalFrequency: "Nightly",
    cycleLength: "3-6 months",
    benefits: ["GH production", "Anti-aging", "Energy", "Sleep quality", "Body composition"],
    link: "https://www.ncbi.nlm.nih.gov/",
    notes: "Longest clinical track record of GH peptides. Previously FDA-approved.",
    emoji: "🌙"
  },
  {
    id: "tesamorelin", name: "Tesamorelin", category: "Growth Hormone",
    aka: "TH9507", color: "#3b82f6",
    halfLife: "26-38 min", commonDose: "1-2 mg",
    adminRoute: ["SubQ"],
    typicalFrequency: "Daily",
    cycleLength: "26-52 weeks",
    benefits: ["Visceral fat reduction", "GH release", "Body recomposition", "Cognitive support"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "FDA-approved for HIV lipodystrophy. Strong evidence for fat loss.",
    emoji: "🔥"
  },
  // GLP-1
  {
    id: "semaglutide", name: "Semaglutide", category: "GLP-1 / Metabolic",
    aka: "Ozempic / Wegovy", color: "#f59e0b",
    halfLife: "~1 week", commonDose: "0.25-2.4 mg",
    adminRoute: ["SubQ"],
    typicalFrequency: "Weekly",
    cycleLength: "Ongoing",
    benefits: ["Weight loss", "Blood sugar control", "Appetite reduction", "Cardiovascular health"],
    link: "https://examine.com/supplements/semaglutide/",
    notes: "FDA-approved. Titrate dose weekly. Store pen refrigerated. Most studied GLP-1.",
    emoji: "⚖️"
  },
  {
    id: "tirzepatide", name: "Tirzepatide", category: "GLP-1 / Metabolic",
    aka: "Mounjaro / Zepbound", color: "#f59e0b",
    halfLife: "~5 days", commonDose: "2.5-15 mg",
    adminRoute: ["SubQ"],
    typicalFrequency: "Weekly",
    cycleLength: "Ongoing",
    benefits: ["Superior weight loss", "Dual GLP-1/GIP", "Blood sugar control", "Metabolic health"],
    link: "https://examine.com/",
    notes: "FDA-approved. Dual agonist - often outperforms semaglutide for weight loss. Titrate slowly.",
    emoji: "🎯"
  },
  {
    id: "aod9604", name: "AOD-9604", category: "GLP-1 / Metabolic",
    aka: "Anti-Obesity Drug 9604", color: "#f59e0b",
    halfLife: "~3 hrs", commonDose: "250-300 mcg",
    adminRoute: ["SubQ", "Oral"],
    typicalFrequency: "Daily",
    cycleLength: "12-16 weeks",
    benefits: ["Fat metabolism", "Fat burning", "No effect on blood sugar", "Weight management"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "GH fragment peptide. Fat-targeting without GH side effects. Generally safe.",
    emoji: "🏃"
  },
  // COGNITIVE
  {
    id: "semax", name: "Semax", category: "Cognitive",
    aka: "ACTH 4-7 Analog", color: "#ec4899",
    halfLife: "Minutes (nasal)", commonDose: "200-600 mcg",
    adminRoute: ["Nasal", "SubQ"],
    typicalFrequency: "Daily",
    cycleLength: "2-4 weeks on, 1-2 off",
    benefits: ["Cognitive enhancement", "BDNF increase", "Memory", "Neuroprotection", "Focus"],
    link: "https://examine.com/",
    notes: "Russian nootropic peptide. Nasal form most common. Cycle to maintain sensitivity.",
    emoji: "🧠"
  },
  {
    id: "selank", name: "Selank", category: "Cognitive",
    aka: "Tuftsin Analog", color: "#ec4899",
    halfLife: "Minutes (nasal)", commonDose: "250-500 mcg",
    adminRoute: ["Nasal", "SubQ"],
    typicalFrequency: "Daily",
    cycleLength: "2-3 weeks",
    benefits: ["Anxiety reduction", "Cognitive enhancement", "Mood stabilization", "Anti-stress"],
    link: "https://examine.com/",
    notes: "Often paired with Semax. Anxiolytic without sedation. Russian peptide.",
    emoji: "🧘"
  },
  {
    id: "dihexa", name: "Dihexa", category: "Cognitive",
    aka: "PNB-0408", color: "#ec4899",
    halfLife: "Unknown", commonDose: "10-20 mg (topical)",
    adminRoute: ["Topical", "Oral"],
    typicalFrequency: "Daily",
    cycleLength: "4-8 weeks",
    benefits: ["Memory enhancement", "Neurogenesis", "Synaptogenesis", "Cognitive repair"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Highly potent nootropic. Start very low. Transdermal cream most common delivery.",
    emoji: "💡"
  },
  // LONGEVITY
  {
    id: "epitalon", name: "Epitalon", category: "Longevity",
    aka: "Epithalon", color: "#10b981",
    halfLife: "Unknown", commonDose: "5-10 mg",
    adminRoute: ["SubQ", "IM", "Nasal"],
    typicalFrequency: "Daily (cycled)",
    cycleLength: "10-20 days, 2-3x/year",
    benefits: ["Telomere extension", "Anti-aging", "Pineal regulation", "Longevity", "Sleep"],
    link: "https://examine.com/",
    notes: "Telomerase activator. Short cycles 2-3x per year. Pioneer longevity peptide.",
    emoji: "⏳"
  },
  {
    id: "motsc", name: "MOTS-c", category: "Longevity",
    aka: "Mitochondrial ORF of the 12S", color: "#10b981",
    halfLife: "~1-2 hrs", commonDose: "5-10 mg",
    adminRoute: ["SubQ"],
    typicalFrequency: "2-3x/week",
    cycleLength: "Ongoing or cycled",
    benefits: ["Metabolic regulation", "Exercise mimetic", "Insulin sensitivity", "Longevity", "Energy"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Mitochondria-derived peptide. Exercise mimetic effects. Emerging longevity compound.",
    emoji: "⚡"
  },
  {
    id: "ss31", name: "SS-31", category: "Longevity",
    aka: "Elamipretide", color: "#10b981",
    halfLife: "~1-2 hrs", commonDose: "1-5 mg",
    adminRoute: ["SubQ"],
    typicalFrequency: "Daily",
    cycleLength: "Ongoing",
    benefits: ["Mitochondrial function", "Cellular energy", "Anti-aging", "Cardiovascular", "Neuroprotection"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Targets mitochondrial inner membrane. Strong evidence in multiple aging models.",
    emoji: "🔋"
  },
  // SEXUAL HEALTH
  {
    id: "pt141", name: "PT-141", category: "Sexual Health",
    aka: "Bremelanotide", color: "#f97316",
    halfLife: "~2.7 hrs", commonDose: "1-2 mg",
    adminRoute: ["SubQ", "Nasal"],
    typicalFrequency: "As needed",
    cycleLength: "As needed",
    benefits: ["Libido boost", "Sexual function", "Arousal", "Works for men & women"],
    link: "https://examine.com/",
    notes: "FDA-approved for female sexual dysfunction. Use 45min-2hrs before. Dose carefully.",
    emoji: "❤️"
  },
  // PERFORMANCE
  {
    id: "igf1lr3", name: "IGF-1 LR3", category: "Performance",
    aka: "Insulin-like Growth Factor 1 LR3", color: "#6366f1",
    halfLife: "20-30 hrs", commonDose: "20-100 mcg",
    adminRoute: ["SubQ", "IM"],
    typicalFrequency: "Daily (post-workout)",
    cycleLength: "4-6 weeks",
    benefits: ["Muscle hypertrophy", "Fat loss", "Rapid size gains", "Cell proliferation"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Potent anabolic. Cycle strictly. Can cause hypoglycemia - have glucose available.",
    emoji: "💯"
  },
  {
    id: "mk677", name: "MK-677", category: "Performance",
    aka: "Ibutamoren", color: "#6366f1",
    halfLife: "~24 hrs", commonDose: "10-25 mg",
    adminRoute: ["Oral"],
    typicalFrequency: "Daily",
    cycleLength: "Ongoing or cycled",
    benefits: ["GH secretion", "IGF-1 increase", "Muscle mass", "Sleep quality", "Appetite"],
    link: "https://examine.com/supplements/ibutamoren/",
    notes: "Oral GH secretagogue. Increases appetite significantly. Take at bedtime.",
    emoji: "🏋️"
  },
  // HAIR
  {
    id: "ptd_dbm", name: "PTD-DBM", category: "Hair Growth",
    aka: "Protein Transduction Domain DBM", color: "#a78bfa",
    halfLife: "Unknown", commonDose: "Topical application",
    adminRoute: ["Topical"],
    typicalFrequency: "Daily",
    cycleLength: "Ongoing",
    benefits: ["Hair follicle regeneration", "Wnt pathway activation", "Hair growth"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Topical hair peptide. Apply to scalp. Often combined with GHK-Cu for hair protocols.",
    emoji: "💇"
  },
  // GLP-1 / METABOLIC - additions
  {
    id: "retatrutide", name: "Retatrutide", category: "GLP-1 / Metabolic",
    aka: "LY3437943 / Triple Agonist", color: "#f59e0b",
    halfLife: "~6 days", commonDose: "1-12 mg (titrated)",
    adminRoute: ["SubQ"],
    typicalFrequency: "Weekly",
    cycleLength: "48+ weeks",
    benefits: ["Superior weight loss (~28%)", "Triple GIP/GLP-1/Glucagon", "Blood sugar control", "Liver fat reduction", "Osteoarthritis relief"],
    link: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972",
    notes: "Investigational (Phase 3 - FDA approval expected 2026-2027). Titrate slowly: 1→2→4→6→9→12 mg over weeks. Phase 3 TRIUMPH-4 achieved 28.7% weight loss at 12 mg - highest recorded for any obesity medication. Titration is key for GI tolerance.",
    emoji: "🏆"
  },
  {
    id: "liraglutide", name: "Liraglutide", category: "GLP-1 / Metabolic",
    aka: "Victoza / Saxenda", color: "#f59e0b",
    halfLife: "~13 hrs", commonDose: "0.6-3 mg",
    adminRoute: ["SubQ"],
    typicalFrequency: "Daily",
    cycleLength: "Ongoing",
    benefits: ["Weight loss", "Blood sugar control", "Appetite suppression", "Cardiovascular benefits", "Daily dosing flexibility"],
    link: "https://examine.com/",
    notes: "FDA-approved GLP-1. Daily injection - useful for those who want more granular dose control vs weekly options. Titrate over 4-5 weeks from 0.6 mg.",
    emoji: "💊"
  },
  // IMMUNE SUPPORT
  {
    id: "thymosin_alpha1", name: "Thymosin Alpha-1", category: "Immune Support",
    aka: "Tα1 / Zadaxin", color: "#06b6d4",
    halfLife: "~2 hrs", commonDose: "1.6 mg",
    adminRoute: ["SubQ"],
    typicalFrequency: "2x/week",
    cycleLength: "4-6 weeks, cyclable",
    benefits: ["Immune modulation", "Anti-viral", "Cancer adjuvant support", "Inflammation control", "T-cell activation"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "FDA-approved in 30+ countries (hepatitis B, hepatitis C, cancer support). Considered one of the safest and most versatile immune peptides. Vials unstable - use within a few days of reconstitution.",
    emoji: "🛡️"
  },
  {
    id: "kpv", name: "KPV", category: "Immune Support",
    aka: "Lys-Pro-Val / α-MSH fragment", color: "#06b6d4",
    halfLife: "Short", commonDose: "100-500 mcg",
    adminRoute: ["SubQ", "Oral", "Topical"],
    typicalFrequency: "1-2x daily",
    cycleLength: "4-8 weeks",
    benefits: ["Anti-inflammatory", "Gut healing (IBD/IBS)", "Antimicrobial", "Wound healing", "Immune balance"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Tripeptide fragment of alpha-MSH. Excellent for gut inflammation - often stacked with BPC-157 for a powerful gut healing protocol. Oral bioavailability is useful.",
    emoji: "🌿"
  },
  {
    id: "ll37", name: "LL-37", category: "Immune Support",
    aka: "Cathelicidin / hCAP18", color: "#06b6d4",
    halfLife: "Short", commonDose: "50-200 mcg",
    adminRoute: ["SubQ", "Topical", "Nasal"],
    typicalFrequency: "Daily to 3x/week",
    cycleLength: "2-4 weeks",
    benefits: ["Antimicrobial", "Anti-viral", "Anti-fungal", "Innate immune defense", "Wound healing"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Natural antimicrobial peptide produced in the body (boosted by sunlight/vitamin D). Powerful broad-spectrum defense. Often used during illness or for chronic infection support.",
    emoji: "⚔️"
  },
  // COGNITIVE - additions
  {
    id: "vip", name: "VIP", category: "Cognitive",
    aka: "Vasoactive Intestinal Peptide", color: "#ec4899",
    halfLife: "~2 min (IV) / longer nasal", commonDose: "50-100 mcg",
    adminRoute: ["Nasal", "IV"],
    typicalFrequency: "2-4x daily (nasal)",
    cycleLength: "4-12 weeks",
    benefits: ["Neuroprotection", "Anti-inflammatory", "CIRS/mold illness", "Gut motility", "Lung health", "Immune regulation"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Key peptide in CIRS/mold illness protocols (Dr. Shoemaker protocol). Also studied for neuroprotection and gut health. Nasal spray most common route.",
    emoji: "🌬️"
  },
  {
    id: "dsip", name: "DSIP", category: "Cognitive",
    aka: "Delta Sleep-Inducing Peptide / Emideltide", color: "#ec4899",
    halfLife: "~30 min", commonDose: "100-600 mcg",
    adminRoute: ["SubQ", "IV"],
    typicalFrequency: "Nightly or as needed",
    cycleLength: "1-4 weeks cycled",
    benefits: ["Sleep architecture improvement", "Circadian rhythm regulation", "Stress reduction", "Chronic insomnia", "Opioid withdrawal support"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "One of the oldest studied neuropeptides. Under FDA review (July 2026) for opioid withdrawal and chronic insomnia. Best used short-term; cycle to preserve sensitivity.",
    emoji: "🌙"
  },
  // SEXUAL HEALTH - additions
  {
    id: "kisspeptin10", name: "Kisspeptin-10", category: "Sexual Health",
    aka: "Metastin / KP-10", color: "#f97316",
    halfLife: "~4 min", commonDose: "100-1000 mcg",
    adminRoute: ["SubQ", "IV"],
    typicalFrequency: "As needed or pulsed",
    cycleLength: "Varies",
    benefits: ["LH/FSH stimulation", "Testosterone support", "Libido", "Reproductive hormone regulation", "Fertility support"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Master regulator of reproductive hormones. Stimulates LH/FSH release - useful for natural testosterone support and fertility protocols. Emerging interest for both men and women.",
    emoji: "💫"
  },
  {
    id: "melanotan2", name: "Melanotan II", category: "Sexual Health",
    aka: "MT-2", color: "#f97316",
    halfLife: "~1-2 hrs", commonDose: "0.5-1 mg",
    adminRoute: ["SubQ", "Nasal"],
    typicalFrequency: "As needed (loading then maintenance)",
    cycleLength: "Loading phase then as needed",
    benefits: ["Libido enhancement", "Erectile function", "Tanning / skin pigmentation", "Appetite suppression", "Fat loss"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Melanocortin receptor agonist. Start very low (0.25 mg) to assess tolerance - nausea and flushing common at first. Sunlight exposure needed for tanning effects. Closely related to PT-141.",
    emoji: "☀️"
  },
  // PERFORMANCE - additions
  {
    id: "pegmgf", name: "PEG-MGF", category: "Performance",
    aka: "Pegylated Mechano Growth Factor", color: "#6366f1",
    halfLife: "~2-3 days (PEGylated)", commonDose: "200-400 mcg",
    adminRoute: ["SubQ", "IM"],
    typicalFrequency: "2x/week",
    cycleLength: "4-8 weeks",
    benefits: ["Muscle repair", "Satellite cell activation", "Local muscle growth", "Recovery acceleration", "Anti-catabolic"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Pegylated form of MGF extends half-life significantly. Activates muscle stem cells post-workout. Best injected close to the trained muscle. Often stacked with IGF-1 LR3.",
    emoji: "🦾"
  },
  // LONGEVITY - additions
  {
    id: "humanin", name: "Humanin", category: "Longevity",
    aka: "HN / Humanin G (HNG)", color: "#10b981",
    halfLife: "~4 hrs", commonDose: "2-4 mg",
    adminRoute: ["SubQ", "Nasal"],
    typicalFrequency: "3x/week",
    cycleLength: "Ongoing or cycled",
    benefits: ["Neuroprotection", "Mitochondrial health", "Alzheimer's protection", "Insulin sensitivity", "Anti-aging", "Longevity"],
    link: "https://pubmed.ncbi.nlm.nih.gov/",
    notes: "Mitochondria-derived peptide (like MOTS-c). Potent neuroprotective effects - often used in longevity stacks with SS-31 and MOTS-c for comprehensive mitochondrial support.",
    emoji: "🧩"
  },

  // ── ADDITIONAL GH PEPTIDES ──────────────────────────────────
  { id:"modgrf129", name:"ModGRF 1-29", category:"Growth Hormone", aka:"CJC-1295 No DAC", color:"#3b82f6", halfLife:"30 min", commonDose:"100-200 mcg", adminRoute:["SubQ"], typicalFrequency:"3x daily (fasted)", cycleLength:"12-16 weeks", benefits:["Pulsatile GH release","Natural GH pattern","Muscle growth","Fat loss","Recovery"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Short-acting CJC-1295 without DAC. Mimics natural GH pulses. Must be timed precisely with a GHRP inject fasted.", emoji:"⚡" },
  { id:"ghrp2", name:"GHRP-2", category:"Growth Hormone", aka:"Growth Hormone Releasing Peptide 2", color:"#3b82f6", halfLife:"~1-2 hrs", commonDose:"100-300 mcg", adminRoute:["SubQ"], typicalFrequency:"2-3x daily", cycleLength:"12-16 weeks", benefits:["Strong GH release","Hunger stimulation","Muscle growth","Anti-inflammatory","Sleep"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Stronger GH than Ipamorelin but raises cortisol/prolactin somewhat. Causes hunger. Inject fasted for best effect.", emoji:"💥" },
  { id:"ghrp6", name:"GHRP-6", category:"Growth Hormone", aka:"Growth Hormone Releasing Peptide 6", color:"#3b82f6", halfLife:"~2-3 hrs", commonDose:"100-300 mcg", adminRoute:["SubQ"], typicalFrequency:"2-3x daily", cycleLength:"12-16 weeks", benefits:["Strong GH release","Appetite stimulation","Muscle growth","Immune function","Sleep cycles"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Classic GHRP. Causes intense hunger (great for bulking). Stack with GHRH analog for synergistic GH release.", emoji:"🍽️" },
  { id:"hexarelin", name:"Hexarelin", category:"Growth Hormone", aka:"Examorelin / HEX", color:"#3b82f6", halfLife:"~3-4 hrs", commonDose:"100-200 mcg", adminRoute:["SubQ"], typicalFrequency:"2-3x daily (cycled)", cycleLength:"8 weeks on, 4 off", benefits:["Most potent GHRP","Cardiac protection","Muscle growth","Fat loss","Recovery"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Most potent GHRP - desensitizes quickly so cycle strictly 8 weeks max. Unique cardiac protection independent of GH.", emoji:"🏆" },
  // ── ADDITIONAL HEALING ───────────────────────────────────────
  { id:"ara290", name:"ARA-290", category:"Healing & Recovery", aka:"Cibinetide / ERB-041", color:"#00d4aa", halfLife:"~3 hrs", commonDose:"4 mg", adminRoute:["SubQ","IV"], typicalFrequency:"Daily", cycleLength:"4-8 weeks", benefits:["Neuropathic pain relief","Tissue protection","Anti-inflammatory","Wound healing","Nerve repair"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"EPO receptor agonist without blood-cell effects. Studied for small fiber neuropathy and diabetic complications.", emoji:"🩹" },
  // ── ADDITIONAL COGNITIVE ─────────────────────────────────────
  { id:"naSemax", name:"N-Acetyl Semax Amidate", category:"Cognitive", aka:"NA Semax Amidate", color:"#ec4899", halfLife:"Longer than standard", commonDose:"100-300 mcg", adminRoute:["Nasal"], typicalFrequency:"Daily", cycleLength:"2-4 weeks on, 1-2 off", benefits:["Enhanced BDNF","More potent than Semax","Cognitive boost","Memory","Longer duration"], link:"https://examine.com/", notes:"More potent and longer-acting than standard Semax. Lower dose required. Preferred version among experienced users. Same cycling rules.", emoji:"🧬" },
  { id:"pe2228", name:"PE-22-28", category:"Cognitive", aka:"Spadin Analog", color:"#ec4899", halfLife:"Unknown", commonDose:"1-3 mg", adminRoute:["SubQ","Nasal"], typicalFrequency:"Daily", cycleLength:"2-4 weeks", benefits:["Antidepressant effects","Rapid mood improvement","Neuroplasticity","TREK-1 channel blocker"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Fast-acting antidepressant peptide. May produce effects within hours. Excellent for mood support.", emoji:"😊" },
  { id:"p21pep", name:"P21", category:"Cognitive", aka:"CNTF-derived Peptide / P021", color:"#ec4899", halfLife:"Unknown", commonDose:"1-3 mg", adminRoute:["SubQ","Nasal"], typicalFrequency:"Daily", cycleLength:"4-8 weeks", benefits:["Neurogenesis","BDNF upregulation","Memory enhancement","Tau reduction","Neuroprotection"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"CNTF-derived peptide for neurodegenerative disease prevention. Strong BDNF effects. Often stacked with Dihexa.", emoji:"🌱" },
  { id:"pinealon", name:"Pinealon", category:"Cognitive", aka:"EDR / Pineal bioregulator", color:"#ec4899", halfLife:"Unknown", commonDose:"1-5 mg", adminRoute:["SubQ","Nasal"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Pineal regulation","Circadian rhythm","Memory","Neuroprotection","Anti-aging brain"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Russian bioregulator for pineal gland. Short 10-day cycles. For circadian disruption and brain anti-aging. Stack with Epitalon.", emoji:"🔮" },
  { id:"cerebrolysin", name:"Cerebrolysin", category:"Cognitive", aka:"FPF-1070 / Peptide mixture", color:"#ec4899", halfLife:"~1 hr", commonDose:"5-30 mL", adminRoute:["IV","IM"], typicalFrequency:"Daily (course)", cycleLength:"10-30 day courses", benefits:["Neurotropic activity","BDNF/NGF-like effects","Stroke recovery","Dementia support","Cognitive repair"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Multi-peptide porcine brain mixture. IV preferred. Approved 30+ countries. Requires medical supervision for IV.", emoji:"🫀" },
  // ── ADDITIONAL LONGEVITY ─────────────────────────────────────
  { id:"foxo4dri", name:"FOXO4-DRI", category:"Longevity", aka:"Senolytic Peptide", color:"#10b981", halfLife:"Unknown", commonDose:"1-5 mg", adminRoute:["SubQ"], typicalFrequency:"3-day pulses monthly", cycleLength:"3-day pulses quarterly", benefits:["Senescent cell clearance","Tissue rejuvenation","Physical function restoration","Longevity"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Powerful senolytic - clears zombie (senescent) cells. Dramatic results in animal models. Use pulsed short cycles.", emoji:"🧹" },
  // ── ADDITIONAL SKIN ──────────────────────────────────────────
  { id:"os01", name:"OS-01", category:"Skin & Anti-Aging", aka:"OneSkin Peptide / p21 activator", color:"#c084fc", halfLife:"Unknown", commonDose:"Topical (varies)", adminRoute:["Topical"], typicalFrequency:"Daily", cycleLength:"Ongoing", benefits:["Skin senescence reduction","p21 pathway","Skin rejuvenation","Cellular longevity"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Emerging topical peptide with senolytic properties for skin. Used in OneSkin products.", emoji:"🌸" },
  // ── ADDITIONAL SEXUAL HEALTH ─────────────────────────────────
  { id:"melanotan1", name:"Melanotan I", category:"Sexual Health", aka:"Afamelanotide / Scenesse", color:"#f97316", halfLife:"~24 hrs", commonDose:"16 mg (implant)", adminRoute:["SubQ implant"], typicalFrequency:"Monthly", cycleLength:"Ongoing", benefits:["Skin tanning","Erythropoietic protoporphyria","Photoprotection"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"FDA approved (Scenesse) for EPP. Tanning/photoprotection without libido effects. Long-acting implant.", emoji:"🌅" },
  { id:"gonadorelin", name:"Gonadorelin", category:"Sexual Health", aka:"GnRH / LHRH", color:"#f97316", halfLife:"~2-4 min", commonDose:"100-500 mcg", adminRoute:["SubQ","IV"], typicalFrequency:"Pulsed (every 90-120 min ideal)", cycleLength:"Per TRT protocol", benefits:["LH/FSH stimulation","Testosterone support","Testicular preservation","Fertility on TRT"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Used alongside TRT to maintain testicular size and fertility. Pulsatile dosing mimics hypothalamic GnRH. Very short half-life.", emoji:"⚗️" },
  // ── ADDITIONAL PERFORMANCE ───────────────────────────────────
  { id:"follistatin344", name:"Follistatin-344", category:"Performance", aka:"FST-344", color:"#6366f1", halfLife:"Unknown", commonDose:"50-100 mcg", adminRoute:["SubQ","IM"], typicalFrequency:"Daily (cycled)", cycleLength:"10-30 days, long off periods", benefits:["Myostatin inhibition","Muscle mass increase","Strength gains","Anti-catabolic"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Inhibits myostatin - the muscle-growth limiter. Very potent. Strictly cycle with long off periods.", emoji:"🦁" },
  // ── ADDITIONAL IMMUNE ────────────────────────────────────────
  { id:"tb4frag", name:"TB-4 Fragment (17-23)", category:"Immune Support", aka:"Thymosin Beta-4 Frag / Ac-SDKP", color:"#06b6d4", halfLife:"Unknown", commonDose:"200-500 mcg", adminRoute:["SubQ"], typicalFrequency:"Daily", cycleLength:"4-8 weeks", benefits:["Anti-inflammatory","Cardiac protection","Kidney protection","Immune modulation","Wound healing"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Smaller anti-inflammatory fragment of TB-500. Primarily cardiac/kidney protective - different profile from full TB-500.", emoji:"🫶" },
  // ── BIOREGULATORS ────────────────────────────────────────────
  { id:"bronchogen", name:"Bronchogen", category:"Bioregulators", aka:"Ala-Glu-Asp-Leu", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Lung tissue support","Bronchial health","Respiratory function","Anti-aging lung"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Russian Khavinson bioregulator for lung/bronchial tissue. 10-day cycles 2-3x/year.", emoji:"🫁" },
  { id:"cardiogen", name:"Cardiogen", category:"Bioregulators", aka:"Ala-Glu-Asp-Arg", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Cardiac tissue support","Heart function","Cardiovascular protection","Anti-aging heart"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Russian Khavinson bioregulator for heart tissue. Combines well with SS-31 for cardiac protocols.", emoji:"❤️" },
  { id:"livagen", name:"Livagen", category:"Bioregulators", aka:"Lys-Glu-Asp-Gly", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Liver support","Gut health","Immune modulation","DNA repair"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Russian Khavinson bioregulator for liver and immune function. Also studied for DNA chromatin effects.", emoji:"🟤" },
  { id:"vilon", name:"Vilon", category:"Bioregulators", aka:"Lys-Glu / dipeptide", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Immune system support","T-cell regulation","Anti-aging immune"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Dipeptide bioregulator for immune regulation. Oldest and simplest Russian bioregulator. Often combined with Thymalin.", emoji:"🔵" },
  { id:"thymalin", name:"Thymalin", category:"Bioregulators", aka:"Thymus Peptide Complex", color:"#78716c", halfLife:"Unknown", commonDose:"5-10 mg", adminRoute:["IM","SubQ"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day courses", benefits:["Immune restoration","Thymus function","T-cell production","Anti-aging immune","Longevity"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Thymus gland bioregulator. Used in Dr. Fahy TRIIM trial alongside Epitalon. Profound immune age reversal reported.", emoji:"🌀" },
  // ── COMBO BLENDS ─────────────────────────────────────────────
  { id:"combo_wolverine", name:"Wolverine Stack (BPC+TB-500)", category:"Combo Blends", aka:"BPC-157 + TB-500 Blend", color:"#f43f5e", halfLife:"Varies", commonDose:"250-500mcg BPC + 2-5mg TB", adminRoute:["SubQ","IM"], typicalFrequency:"2-3x/week", cycleLength:"4-6 weeks", benefits:["Synergistic tissue repair","Local + systemic healing","Tendon/ligament","Gut healing","Anti-inflammatory"], link:"https://examine.com/supplements/bpc-157/", notes:"Most popular combo. BPC-157 handles local repair; TB-500 works systemically. Can be pre-blended or separate.", emoji:"🐺", isCombo:true, components:["BPC-157","TB-500"] },
  { id:"combo_gh_stack", name:"GH Stack (CJC+Ipamorelin)", category:"Combo Blends", aka:"CJC-1295 + Ipamorelin", color:"#f43f5e", halfLife:"Varies", commonDose:"1-2mg CJC + 200-300mcg Ipa", adminRoute:["SubQ"], typicalFrequency:"1-2x/week CJC, nightly Ipa", cycleLength:"12-16 weeks", benefits:["Amplified GH pulses","Muscle growth","Fat loss","Sleep quality","Recovery","Anti-aging"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Most prescribed GH combo. GHRH + GHRP = synergistic GH amplification. Most searched peptide combination in the US.", emoji:"📈", isCombo:true, components:["CJC-1295","Ipamorelin"] },
  { id:"combo_semax_sel", name:"Semax + Selank (Cognitive)", category:"Combo Blends", aka:"Cognitive-Anxiety Nasal Blend", color:"#f43f5e", halfLife:"Short", commonDose:"200-300mcg each", adminRoute:["Nasal"], typicalFrequency:"Daily", cycleLength:"2-3 weeks on, 1 off", benefits:["Cognitive enhancement","Anxiety reduction","Focus + calm","BDNF boost","Neuroplasticity"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Classic nootropic combo. Semax for focus/BDNF, Selank for calm. Can be alternated in same nasal spray.", emoji:"🧠", isCombo:true, components:["Semax","Selank"] },
  { id:"combo_gut", name:"Gut Healing Stack (BPC+KPV)", category:"Combo Blends", aka:"BPC-157 + KPV", color:"#f43f5e", halfLife:"Varies", commonDose:"250-500mcg BPC + 100-500mcg KPV", adminRoute:["SubQ","Oral"], typicalFrequency:"1-2x daily", cycleLength:"4-8 weeks", benefits:["IBD/IBS healing","Gut lining repair","Anti-inflammatory GI","SIBO recovery"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"BPC-157 rebuilds gut tissue; KPV reduces inflammation. Both have oral bioavailability for gut-specific targeting.", emoji:"🌿", isCombo:true, components:["BPC-157","KPV"] },
  { id:"combo_quad", name:"Quad Healing Blend (BPC+TB+KPV+GHK)", category:"Combo Blends", aka:"Premium Healing Blend", color:"#f43f5e", halfLife:"Varies", commonDose:"250mcg BPC / 2mg TB / 200mcg KPV / 1mg GHK-Cu", adminRoute:["SubQ"], typicalFrequency:"2-3x/week", cycleLength:"4-8 weeks", benefits:["Comprehensive healing","Local+systemic+gut+skin","Anti-inflammatory","Collagen support"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Premium clinic protocol. BPC (local) + TB-500 (systemic) + KPV (gut/inflammation) + GHK-Cu (collagen/skin).", emoji:"🏥", isCombo:true, components:["BPC-157","TB-500","KPV","GHK-Cu"] },
  { id:"combo_mito_stack", name:"Mitochondrial Longevity Stack", category:"Combo Blends", aka:"MOTS-c + SS-31 + Humanin", color:"#f43f5e", halfLife:"Varies", commonDose:"5-10mg MOTS-c / 1-3mg SS-31 / 2-4mg Humanin", adminRoute:["SubQ"], typicalFrequency:"3x/week", cycleLength:"Ongoing or cycled", benefits:["Complete mitochondrial support","Anti-aging","Neuroprotection","Metabolic optimization"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Three mito-derived peptides: energy (MOTS-c) + membrane integrity (SS-31) + neuroprotection (Humanin).", emoji:"⚡", isCombo:true, components:["MOTS-c","SS-31","Humanin"] },
  { id:"combo_recomp_stack", name:"Body Recomp Stack", category:"Combo Blends", aka:"Tesamorelin + AOD + CJC/Ipa", color:"#f43f5e", halfLife:"Varies", commonDose:"Per individual protocols", adminRoute:["SubQ"], typicalFrequency:"Daily Tesam/AOD + weekly CJC", cycleLength:"12-16 weeks", benefits:["Visceral fat loss","Lean muscle","GH optimization","Body recomposition"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Tesamorelin targets visceral fat; AOD-9604 peripheral fat; CJC/Ipa for GH and muscle support.", emoji:"🎯", isCombo:true, components:["Tesamorelin","AOD-9604","CJC-1295","Ipamorelin"] },
  { id:"combo_immune_stack", name:"Immune Defense Stack", category:"Combo Blends", aka:"Thymosin α-1 + KPV + LL-37", color:"#f43f5e", halfLife:"Varies", commonDose:"1.6mg Ta1 / 200mcg KPV / 100mcg LL-37", adminRoute:["SubQ"], typicalFrequency:"2-3x/week", cycleLength:"4-6 weeks", benefits:["T-cell modulation","Broad-spectrum antimicrobial","Anti-inflammatory","Innate + adaptive immunity"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Comprehensive immune protocol: adaptive T-cell (Thymosin a-1) + mucosal (KPV) + frontline antimicrobial (LL-37).", emoji:"🛡️", isCombo:true, components:["Thymosin Alpha-1","KPV","LL-37"] },
  { id:"combo_antiage", name:"Anti-Aging Master Stack", category:"Combo Blends", aka:"Epitalon + GHK-Cu + Thymalin + CJC/Ipa", color:"#f43f5e", halfLife:"Varies", commonDose:"Per individual protocols", adminRoute:["SubQ"], typicalFrequency:"Per individual schedules", cycleLength:"Cycled per component", benefits:["Telomere support","Collagen & skin","Immune restoration","GH optimization"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Based on Khavinson/Fahy protocols: Epitalon (telomeres) + GHK-Cu (skin) + Thymalin (immune age) + CJC/Ipa (GH).", emoji:"⏳", isCombo:true, components:["Epitalon","GHK-Cu","Thymalin","CJC-1295"] },
  { id:"combo_sleep_stack", name:"Sleep & Recovery Stack", category:"Combo Blends", aka:"DSIP + MK-677 + BPC-157", color:"#f43f5e", halfLife:"Varies", commonDose:"100-300mcg DSIP / 10-25mg MK-677 / 250mcg BPC", adminRoute:["SubQ + Oral"], typicalFrequency:"Nightly", cycleLength:"4-8 weeks", benefits:["Deep sleep architecture","GH pulse during sleep","Overnight tissue repair","Recovery optimization"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"DSIP for sleep quality; MK-677 oral for GH pulse; BPC-157 for overnight tissue repair.", emoji:"🌙", isCombo:true, components:["DSIP","MK-677","BPC-157"] },
  { id:"combo_weightloss", name:"Next-Gen Weight Loss Stack", category:"Combo Blends", aka:"GLP-1 + AOD-9604", color:"#f43f5e", halfLife:"Varies", commonDose:"Per GLP-1 titration + 250mcg AOD", adminRoute:["SubQ"], typicalFrequency:"Weekly GLP-1 + Daily AOD", cycleLength:"Ongoing", benefits:["Maximum weight loss","Appetite control","Targeted fat metabolism","Complementary mechanisms"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Any GLP-1 (sema/tirzep/retatrutide) + AOD-9604. GLP-1 reduces appetite; AOD targets fat cell metabolism directly.", emoji:"🏃", isCombo:true, components:["Semaglutide / Tirzepatide / Retatrutide","AOD-9604"] },
  { id:"combo_trt_stack", name:"TRT Support Stack", category:"Combo Blends", aka:"Gonadorelin + Kisspeptin-10", color:"#f43f5e", halfLife:"Varies", commonDose:"100-250mcg Gon / 200-500mcg Kiss", adminRoute:["SubQ"], typicalFrequency:"2-3x/week", cycleLength:"Ongoing with TRT", benefits:["Testicular preservation","LH/FSH maintenance","Fertility support","Natural T axis"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Essential for TRT preserving fertility. Gonadorelin mimics GnRH pulses; Kisspeptin-10 stimulates LH/FSH.", emoji:"⚗️", isCombo:true, components:["Gonadorelin","Kisspeptin-10"] },
  // ── COSMETIC / TOPICAL PEPTIDES ─────────────────────────────
  { id:"argireline", name:"Argireline", category:"Skin & Anti-Aging", aka:"Acetyl Hexapeptide-3 / SNAP-6", color:"#c084fc", halfLife:"Topical (hrs)", commonDose:"5-10% in formulation", adminRoute:["Topical"], typicalFrequency:"1-2x daily", cycleLength:"Ongoing", benefits:["Reduces expression lines","Botox-like effect","Relaxes facial muscles","Collagen support","Forehead lines"], link:"https://examine.com/", notes:"The topical 'botox peptide'. Works by inhibiting neurotransmitter release at surface level. Safe, widely used in serums. Combine with GHK-Cu for synergistic anti-aging.", emoji:"💆", tags:["skin","topical","anti-aging","botox-like","cosmetic"] },
  { id:"snap8", name:"SNAP-8", category:"Skin & Anti-Aging", aka:"Acetyl Octapeptide-3", color:"#c084fc", halfLife:"Topical (hrs)", commonDose:"3-5% in formulation", adminRoute:["Topical"], typicalFrequency:"1-2x daily", cycleLength:"Ongoing", benefits:["Expression wrinkle reduction","More potent than Argireline","Forehead/eye lines","Non-invasive muscle relaxation"], link:"https://examine.com/", notes:"Extended version of Argireline - 8 amino acids vs 6. Considered more potent for expression lines around eyes and forehead. Combine with Matrixyl.", emoji:"✨", tags:["skin","topical","anti-aging","cosmetic","expression-lines"] },
  { id:"matrixyl", name:"Matrixyl 3000", category:"Skin & Anti-Aging", aka:"Palmitoyl Pentapeptide-4 + Palmitoyl Tetrapeptide-7", color:"#c084fc", halfLife:"Topical (hrs)", commonDose:"2-5% in formulation", adminRoute:["Topical"], typicalFrequency:"1-2x daily", cycleLength:"Ongoing", benefits:["Collagen synthesis","Wrinkle depth reduction","Skin firming","ECM repair","Hyaluronic acid support"], link:"https://examine.com/", notes:"One of the most studied anti-aging peptides. Stimulates collagen and elastin synthesis. Matrixyl 3000 is a synergistic blend of two Matrixyl peptides. Works well with GHK-Cu.", emoji:"🌟", tags:["skin","topical","collagen","anti-aging","cosmetic","evidence-backed"] },
  { id:"palghk", name:"Pal-GHK", category:"Skin & Anti-Aging", aka:"Palmitoyl Tripeptide-1 / GHK Basic", color:"#c084fc", halfLife:"Topical (hrs)", commonDose:"1-5% in formulation", adminRoute:["Topical"], typicalFrequency:"Daily", cycleLength:"Ongoing", benefits:["Collagen production","Wound healing","Anti-aging","Skin thickness","ECM remodeling"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Palmitoylated form of GHK for improved skin penetration. Precursor concept to GHK-Cu. Often combined with Matrixyl in anti-aging formulations.", emoji:"🧴", tags:["skin","topical","collagen","anti-aging","cosmetic"] },
  // ── HORMONAL / METABOLIC ─────────────────────────────────────
  { id:"nad_peptide", name:"NAD+ (Peptide Form)", category:"Longevity", aka:"Nicotinamide Adenine Dinucleotide / NMN/NR precursor", color:"#10b981", halfLife:"Minutes IV / longer SubQ", commonDose:"100-500 mg", adminRoute:["SubQ","IV","Oral"], typicalFrequency:"Daily to weekly", cycleLength:"Ongoing", benefits:["Cellular energy (ATP)","DNA repair","Sirtuins activation","Anti-aging","Brain health","Metabolic health"], link:"https://examine.com/supplements/nicotinamide-adenine-dinucleotide/", notes:"Can be injected (SubQ/IV) for higher bioavailability than oral. IV NAD+ causes flush/discomfort - go slow. SubQ is smoother. Potent longevity molecule.", emoji:"⚛️", tags:["longevity","energy","DNA-repair","anti-aging","sirtuins"] },
  { id:"oxytocin", name:"Oxytocin", category:"Cognitive", aka:"Love Hormone / OXT", color:"#ec4899", halfLife:"~3 min (IV) / ~20 min SubQ", commonDose:"10-40 IU", adminRoute:["SubQ","Nasal","IV"], typicalFrequency:"As needed", cycleLength:"As needed", benefits:["Social bonding","Anxiety reduction","Stress relief","Libido enhancement","Trust / empathy","Autism support (research)"], link:"https://examine.com/supplements/oxytocin/", notes:"Nasal form most popular. Low dose (10 IU) for anxiety/social; higher for libido. Short half-life means effects are brief. Use as needed - chronic use can blunt receptors.", emoji:"💕", tags:["mood","social","anxiety","libido","nasal","as-needed"] },
  { id:"glp2", name:"GLP-2", category:"Healing & Recovery", aka:"Glucagon-Like Peptide-2", color:"#00d4aa", halfLife:"~7 min (native) / ~2 hrs (teduglutide)", commonDose:"1-5 mg", adminRoute:["SubQ"], typicalFrequency:"Daily", cycleLength:"Ongoing", benefits:["Intestinal growth","Short bowel syndrome","Gut mucosal repair","Nutrient absorption","IBD support"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Sister peptide to GLP-1 but intestine-specific. Promotes gut mucosal growth. FDA-approved as teduglutide (Gattex) for short bowel syndrome.", emoji:"🫁", tags:["gut","IBD","healing","intestinal","FDA-approved-analog"] },
  // ── KHAVINSON BIOREGULATORS ──────────────────────────────────
  { id:"cortagen", name:"Cortagen", category:"Bioregulators", aka:"Ala-Glu-Asp-Pro", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Neurological support","Spinal cord repair","Brain cortex","Cognitive restoration","Neuroprotection"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Khavinson bioregulator targeting brain cortex and neurological tissue. Used in neurological rehabilitation protocols. 10-day cycles.", emoji:"🧠", tags:["bioregulator","neuro","brain","cognitive","cycle"] },
  { id:"chonluten", name:"Chonluten", category:"Bioregulators", aka:"Glu-Asp-Leu", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Lung/bronchial epithelium","Respiratory tissue","Anti-aging lung","Mucus regulation"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Khavinson tripeptide targeting lung epithelial cells. Distinct from Bronchogen. Used for chronic respiratory conditions and lung anti-aging.", emoji:"💨", tags:["bioregulator","lung","respiratory","cycle"] },
  { id:"ovagen", name:"Ovagen", category:"Bioregulators", aka:"Glu-Asp-Leu (Liver/Intestine)", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Liver tissue support","Intestinal mucosa","GI tract anti-aging","Hepatic protection"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Khavinson bioregulator for liver and intestinal tissue. Often combined with Livagen for comprehensive hepatic support.", emoji:"🟡", tags:["bioregulator","liver","intestine","GI","cycle"] },
  { id:"testagen", name:"Testagen", category:"Bioregulators", aka:"Lys-Glu-Asp-Gly (Testes)", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Testicular tissue support","Male reproductive health","Testosterone support","Anti-aging male"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Khavinson bioregulator targeting testicular tissue. Used to support male reproductive function and hormone production.", emoji:"⚙️", tags:["bioregulator","testosterone","male","reproductive","cycle"] },
  { id:"pancragen", name:"Pancragen", category:"Bioregulators", aka:"Lys-Glu-Asp (Pancreas)", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Pancreatic tissue support","Insulin regulation","Metabolic function","Anti-aging pancreas"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Khavinson bioregulator for pancreatic tissue. Used alongside metabolic protocols. May support insulin sensitivity when combined with MOTS-c.", emoji:"🫀", tags:["bioregulator","pancreas","insulin","metabolic","cycle"] },
  { id:"vesugen", name:"Vesugen", category:"Bioregulators", aka:"Lys-Glu-Asp (Vascular)", color:"#78716c", halfLife:"Unknown", commonDose:"1-2 mg", adminRoute:["SubQ","Oral"], typicalFrequency:"Daily (cycled)", cycleLength:"10-day cycles", benefits:["Vascular tissue support","Endothelial health","Blood vessel anti-aging","Circulation support"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Khavinson bioregulator targeting vascular endothelial tissue. Supports blood vessel health and circulation. Pairs with Cardiogen for cardiovascular protocols.", emoji:"🩸", tags:["bioregulator","vascular","endothelial","circulation","cycle"] },
  // ── EMERGING / ADVANCED PEPTIDES ────────────────────────────
  { id:"slu_pp332", name:"SLU-PP-332", category:"Performance", aka:"ERR Agonist / Exercise Mimetic", color:"#6366f1", halfLife:"Unknown (research)", commonDose:"10-50 mg (animal studies)", adminRoute:["Oral","SubQ"], typicalFrequency:"Daily", cycleLength:"Cycled", benefits:["Exercise mimetic","Fat loss without exercise","Mitochondrial biogenesis","Endurance","Metabolic rate increase"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Very early research compound. ERR alpha/beta/gamma agonist - triggers exercise-like gene expression. Animal data shows fat loss and endurance gains without exercise. Human data lacking.", emoji:"🔬", tags:["performance","exercise-mimetic","metabolic","emerging","research-only"] },
  { id:"b733", name:"B7-33", category:"Healing & Recovery", aka:"H2 Relaxin Fragment", color:"#00d4aa", halfLife:"Unknown", commonDose:"50-200 mcg", adminRoute:["SubQ"], typicalFrequency:"Daily to 3x/week", cycleLength:"4-8 weeks", benefits:["Anti-fibrotic","Heart failure support","Lung fibrosis","Collagen remodeling","Inflammation reduction"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Single-chain analog of relaxin hormone. Anti-fibrotic properties - may reverse scarring and fibrosis. Strong cardiac and lung research. Emerging use for post-injury scarring.", emoji:"💠", tags:["healing","anti-fibrotic","cardiac","lung","emerging"] },
  // ── ADDITIONAL COMBO BLENDS ──────────────────────────────────
  { id:"combo_cognitive_stack", name:"Advanced Cognitive Stack", category:"Combo Blends", aka:"Semax + Selank + Dihexa + P21", color:"#f43f5e", halfLife:"Varies", commonDose:"Per individual peptide", adminRoute:["Nasal","SubQ","Topical"], typicalFrequency:"Daily (nasal) + as needed (SubQ/topical)", cycleLength:"2-3 weeks on, 1 off", benefits:["BDNF + neurogenesis","Focus + calm","Memory + synaptic growth","Neuroprotection","Full-spectrum nootropic"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Start with Semax + Selank, then add Dihexa (topical) and P21 for a comprehensive stack. Each targets different neuroplasticity pathways.", emoji:"🧬", isCombo:true, components:["Semax","Selank","Dihexa","P21"] },
  { id:"combo_skin_anti_age", name:"Skin Anti-Aging Stack", category:"Combo Blends", aka:"GHK-Cu + Argireline + Matrixyl", color:"#f43f5e", halfLife:"Topical (hrs)", commonDose:"Per product concentration", adminRoute:["Topical"], typicalFrequency:"Daily AM & PM", cycleLength:"Ongoing", benefits:["Collagen synthesis","Expression line reduction","Skin thickness","Repair + rejuvenation","Non-invasive firming"], link:"https://examine.com/", notes:"The ultimate topical protocol. GHK-Cu rebuilds collagen; Argireline relaxes expression lines; Matrixyl stimulates ECM repair. Layer or blend in serum.", emoji:"✨", isCombo:true, components:["GHK-Cu","Argireline","SNAP-8","Matrixyl 3000"] },
  { id:"combo_bioregulator_longevity", name:"Bioregulator Longevity Protocol", category:"Combo Blends", aka:"Epitalon + Thymalin + Pinealon + Cardiogen", color:"#f43f5e", halfLife:"Varies", commonDose:"Per individual protocols", adminRoute:["SubQ"], typicalFrequency:"Per 10-day cycle schedules", cycleLength:"Sequential 10-day cycles 2x/year", benefits:["Pineal + thymus + heart + brain anti-aging","Immune restoration","Telomere support","Multi-organ bioregulation"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Full Khavinson bioregulator longevity protocol. Run peptides sequentially in 10-day cycles. Based on the same approach used in Russian longevity research.", emoji:"♾️", isCombo:true, components:["Epitalon","Thymalin","Pinealon","Cardiogen"] },
  { id:"combo_injury_rehab", name:"Injury Rehab Stack", category:"Combo Blends", aka:"BPC-157 + TB-500 + ARA-290 + CJC/Ipa", color:"#f43f5e", halfLife:"Varies", commonDose:"Per individual protocols", adminRoute:["SubQ","IM"], typicalFrequency:"2-3x/week", cycleLength:"6-12 weeks", benefits:["Comprehensive injury recovery","Neuropathic pain","Tissue repair","Systemic healing","GH optimization for recovery"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Advanced rehab protocol. BPC+TB-500 for tissue repair; ARA-290 for pain; CJC/Ipa for GH-driven recovery acceleration.", emoji:"🏥", isCombo:true, components:["BPC-157","TB-500","ARA-290","CJC-1295","Ipamorelin"] },
  { id:"combo_nad_longevity", name:"Cellular Energy Stack", category:"Combo Blends", aka:"NAD+ + MOTS-c + SS-31", color:"#f43f5e", halfLife:"Varies", commonDose:"Per individual protocols", adminRoute:["SubQ","IV"], typicalFrequency:"Weekly NAD+ / 3x week MOTS-c+SS-31", cycleLength:"Ongoing", benefits:["Maximum cellular energy","DNA repair","Mitochondrial membrane integrity","Metabolic optimization","Anti-aging"], link:"https://pubmed.ncbi.nlm.nih.gov/", notes:"Targets cellular energy from three angles: NAD+ for sirtuin/DNA repair, MOTS-c for AMPK/metabolic signaling, SS-31 for mitochondrial membrane function.", emoji:"⚛️", isCombo:true, components:["NAD+","MOTS-c","SS-31"] },

];

const CATEGORIES = [...new Set(PEPTIDE_LIBRARY.map(p => p.category))];
const CATEGORY_COLORS = {
  "Healing & Recovery": "#00d4aa",
  "Skin & Anti-Aging": "#c084fc",
  "Growth Hormone": "#3b82f6",
  "GLP-1 / Metabolic": "#f59e0b",
  "Cognitive": "#ec4899",
  "Longevity": "#10b981",
  "Sexual Health": "#f97316",
  "Performance": "#6366f1",
  "Hair Growth": "#a78bfa",
  "Immune Support": "#06b6d4",
  "Bioregulators": "#78716c",
  "Combo Blends": "#f43f5e"
};

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ADMIN_ICONS = { "SubQ": "💉", "IM": "🩸", "Oral": "💊", "Topical": "🧴", "Nasal": "👃" };

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [protocol, setProtocol] = useState([]);
  const [logs, setLogs] = useState({}); // {peptideId_date: {taken, dose, notes, siteUsed}}
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPeptide, setExpandedPeptide] = useState(null);
  const [notification, setNotification] = useState(null);
  const [reconCalc, setReconCalc] = useState({ vialMg: "", waterMl: "", targetMcg: "" });
  const [bodyStats, setBodyStats] = useState(() => { try{const v=localStorage.getItem("pep_body");return v?JSON.parse(v):[]}catch{return []} });
  const [vialInventory, setVialInventory] = useState(() => { try{const v=localStorage.getItem("pep_vials");return v?JSON.parse(v):[]}catch{return []} });
  const [journal, setJournal] = useState(() => { try{const v=localStorage.getItem("pep_journal");return v?JSON.parse(v):[]}catch{return []} });
  const [goals, setGoals] = useState(() => { try{const v=localStorage.getItem("pep_goals");return v?JSON.parse(v):{weight:"",bf:"",waist:"",notes:""};}catch{return {weight:"",bf:"",waist:"",notes:""};} });
  const [showAddStat, setShowAddStat] = useState(false);
  const [showAddVial, setShowAddVial] = useState(false);
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [bloodwork, setBloodwork] = useState(() => { try{const v=localStorage.getItem("pep_blood");return v?JSON.parse(v):[]}catch{return []} });
  const [showAddBlood, setShowAddBlood] = useState(false);
  const [showHalfLifeChart, setShowHalfLifeChart] = useState(null);
  const [calView, setCalView] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    try { return localStorage.getItem("pep_disclaimer_v1") === "yes"; } catch { return false; }
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("peptide_protocol_v2");
      if (saved) setProtocol(JSON.parse(saved));
      const savedLogs = localStorage.getItem("peptide_logs_v2");
      if (savedLogs) setLogs(JSON.parse(savedLogs));
    } catch(e) {}
  }, []);

  useEffect(() => { try{localStorage.setItem("pep_body",JSON.stringify(bodyStats))}catch{} }, [bodyStats]);
  useEffect(() => { try{localStorage.setItem("pep_vials",JSON.stringify(vialInventory))}catch{} }, [vialInventory]);
  useEffect(() => { try{localStorage.setItem("pep_journal",JSON.stringify(journal))}catch{} }, [journal]);
  useEffect(() => { try{localStorage.setItem("pep_goals",JSON.stringify(goals))}catch{} }, [goals]);
  useEffect(() => { try{localStorage.setItem("pep_blood",JSON.stringify(bloodwork))}catch{} }, [bloodwork]);

  const saveProtocol = (p) => {
    setProtocol(p);
    try { localStorage.setItem("peptide_protocol_v2", JSON.stringify(p)); } catch(e) {}
  };
  const saveLogs = (l) => {
    setLogs(l);
    try { localStorage.setItem("peptide_logs_v2", JSON.stringify(l)); } catch(e) {}
  };

  const showNotif = (msg, type="success") => {
    setNotification({msg, type});
    setTimeout(() => setNotification(null), 2500);
  };

  // Protocol helpers
  const addToProtocol = (peptideId, config) => {
    const exists = protocol.find(p => p.id === peptideId);
    if (exists) { showNotif("Already in your protocol!", "warn"); return; }
    const peptide = PEPTIDE_LIBRARY.find(p => p.id === peptideId);
    const entry = {
      id: peptideId,
      name: peptide.name,
      dose: config.dose || peptide.commonDose,
      unit: config.unit || "mcg",
      route: config.route || peptide.adminRoute[0],
      frequency: config.frequency || peptide.typicalFrequency,
      days: config.days || ["Mon","Wed","Fri"],
      startDate: config.startDate || selectedDate,
      notes: config.notes || "",
      active: true,
      injectionSites: [],
      vialMg: config.vialMg || "",
      waterMl: config.waterMl || "",
    };
    saveProtocol([...protocol, entry]);
    showNotif(`${peptide.name} added to your protocol! 🎉`);
    setShowAddModal(false);
  };

  const removeFromProtocol = (id) => {
    saveProtocol(protocol.filter(p => p.id !== id));
    showNotif("Removed from protocol");
  };

  const toggleDay = (protId, day) => {
    const updated = protocol.map(p => {
      if (p.id !== protId) return p;
      const days = p.days.includes(day) ? p.days.filter(d => d !== day) : [...p.days, day];
      return { ...p, days };
    });
    saveProtocol(updated);
  };

  const updateProtocolField = (id, field, value) => {
    saveProtocol(protocol.map(p => p.id === id ? {...p, [field]: value} : p));
  };

  // Logging
  const logDose = (peptideId, data) => {
    const key = `${peptideId}_${selectedDate}`;
    const newLogs = { ...logs, [key]: { ...data, timestamp: new Date().toISOString() }};
    saveLogs(newLogs);
    showNotif("Dose logged! ✅");
    setShowLogModal(null);
  };

  const getLog = (peptideId, date) => logs[`${peptideId}_${date}`];

  const todayProtocol = protocol.filter(p => {
    if (!p.active) return false;
    const dayName = new Date(selectedDate + "T12:00:00").toLocaleDateString('en-US',{weekday:'short'}).slice(0,3);
    return p.days.includes(dayName);
  });

  const todayCompleted = todayProtocol.filter(p => getLog(p.id, selectedDate)?.taken).length;

  // Reconstitution calc
  const calcRecon = () => {
    const { vialMg, waterMl, targetMcg } = reconCalc;
    if (!vialMg || !waterMl) return null;
    const concMgMl = parseFloat(vialMg) / parseFloat(waterMl);
    const concMcgMl = concMgMl * 1000;
    const units = targetMcg ? (parseFloat(targetMcg) / concMcgMl * 100).toFixed(1) : null;
    return { concMgMl: concMgMl.toFixed(3), concMcgMl: concMcgMl.toFixed(1), units };
  };
  const reconResult = calcRecon();

  // Stats
  const totalDoses = Object.values(logs).filter(l => l.taken).length;
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return d.toISOString().slice(0,10);
  });
  const last7Adherence = last7Days.map(date => {
    const scheduled = protocol.filter(p => {
      if (!p.active) return false;
      const dayName = new Date(date + "T12:00:00").toLocaleDateString('en-US',{weekday:'short'}).slice(0,3);
      return p.days.includes(dayName);
    });
    const taken = scheduled.filter(p => logs[`${p.id}_${date}`]?.taken).length;
    return scheduled.length > 0 ? Math.round((taken / scheduled.length) * 100) : null;
  }).reverse();

  const filteredLibrary = PEPTIDE_LIBRARY.filter(p => {
    const catMatch = filterCat === "All" || p.category === filterCat;
    const searchMatch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.aka.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
    return catMatch && searchMatch;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a14 0%, #0d1220 40%, #0a0f1a 100%)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      position: "relative"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        #root { min-height: 100vh; min-height: -webkit-fill-available; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0d1220; }
        ::-webkit-scrollbar-thumb { background: #2a3a5c; border-radius: 3px; }

        /* -- COMPONENTS -- */
        .pill-btn { cursor: pointer; border: none; border-radius: 999px; padding: 6px 14px; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; }
        .card-hover:hover { background: rgba(255,255,255,0.07); border-color: rgba(0,212,170,0.2); transform: translateY(-1px); transition: all 0.2s; }
        .day-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); background: transparent; cursor: pointer; font-size: 12px; font-weight: 700; color: #64748b; transition: all 0.2s; touch-action: manipulation; }
        .day-btn.on { background: rgba(0,212,170,0.2); border-color: #00d4aa; color: #00d4aa; }
        .day-btn:hover:not(.on) { border-color: rgba(255,255,255,0.3); color: #94a3b8; }
        .input-field { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 14px; color: #e2e8f0; font-size: 16px; font-family: inherit; outline: none; transition: border-color 0.2s; width: 100%; -webkit-appearance: none; }
        .input-field:focus { border-color: rgba(0,212,170,0.5); background: rgba(255,255,255,0.08); }
        .input-field option { background: #1a2035; }
        select.input-field { cursor: pointer; }
        .btn-primary { background: linear-gradient(135deg, #00d4aa, #0099cc); color: white; border: none; border-radius: 10px; padding: 12px 20px; font-weight: 700; cursor: pointer; font-family: inherit; font-size: 15px; transition: all 0.2s; touch-action: manipulation; min-height: 44px; }
        .btn-primary:active { transform: scale(0.97); }
        .btn-danger { background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 8px 14px; font-size: 13px; cursor: pointer; font-family: inherit; transition: all 0.2s; min-height: 36px; touch-action: manipulation; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
        .progress-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
        a { color: #00d4aa; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .notif { position: fixed; top: 20px; right: 16px; z-index: 999; padding: 12px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; animation: slideIn 0.3s ease; max-width: calc(100vw - 32px); }
        @keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
        @keyframes slideUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        .disclaimer-footer { position:relative; z-index:10; }
        @media (max-width:640px) { .disclaimer-footer { padding-bottom:calc(8px + env(safe-area-inset-bottom,0px)); font-size:10px; } }

        /* -- DESKTOP NAV -- */
        .desktop-nav { display: flex; gap: 2px; flex-wrap: wrap; }
        .tab-btn { cursor: pointer; background: none; border: none; color: #64748b; font-size: 12px; font-weight: 600; padding: 8px 14px; border-radius: 9px; transition: all 0.2s; font-family: inherit; white-space: nowrap; min-height: 36px; touch-action: manipulation; }
        .tab-btn.active { background: rgba(0,212,170,0.12); color: #00d4aa; }
        .tab-btn:hover:not(.active) { color: #94a3b8; background: rgba(255,255,255,0.04); }

        /* -- MOBILE BOTTOM NAV -- */
        .mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 60;
          background: rgba(10,10,20,0.97); border-top: 1px solid rgba(255,255,255,0.1);
          padding: 6px 0 env(safe-area-inset-bottom,8px); }
        .mobile-nav-inner { display: flex; justify-content: space-around; align-items: stretch; }
        .mob-tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 3px; padding: 6px 4px; cursor: pointer; background: none; border: none;
          color: #64748b; font-size: 10px; font-weight: 600; font-family: inherit;
          min-height: 52px; touch-action: manipulation; transition: color 0.15s; }
        .mob-tab .mob-icon { font-size: 20px; line-height: 1; }
        .mob-tab.active { color: #00d4aa; }
        .mob-tab.active .mob-icon { filter: drop-shadow(0 0 6px rgba(0,212,170,0.5)); }

        /* -- MORE DRAWER -- */
        .more-drawer { display: none; position: fixed; bottom: 64px; left: 0; right: 0; z-index: 59;
          background: rgba(13,18,32,0.98); border-top: 1px solid rgba(255,255,255,0.1);
          padding: 12px; animation: slideUp 0.2s ease; }
        .more-drawer.open { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .more-drawer-item { display: flex; align-items: center; gap: 10px; padding: 12px 14px;
          border-radius: 11px; background: rgba(255,255,255,0.05); border: none;
          cursor: pointer; font-family: inherit; color: #e2e8f0; font-size: 14px; font-weight: 600;
          touch-action: manipulation; }
        .more-drawer-item.active { background: rgba(0,212,170,0.12); color: #00d4aa; }
        .more-drawer-backdrop { display: none; position: fixed; inset: 0; z-index: 58; }
        .more-drawer-backdrop.open { display: block; }

        /* -- MODAL -- */
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 16px; }
        .modal { background: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;
          max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 24px; }

        /* -- RESPONSIVE GRIDS -- */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 14px; }
        .grid-calc { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* -- TABLET (max 900px) -- */
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
          .grid-calc { grid-template-columns: 1fr; }
          .desktop-nav { gap: 1px; }
          .tab-btn { padding: 7px 10px; font-size: 11px; }
        }

        /* -- MOBILE (max 640px) -- */
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block; }
          .main-content { padding-bottom: calc(68px + env(safe-area-inset-bottom, 8px)) !important; }
          .grid-2 { grid-template-columns: 1fr; }
          .grid-4 { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .grid-auto { grid-template-columns: 1fr; }
          .grid-calc { grid-template-columns: 1fr; }
          .modal { border-radius: 20px 20px 0 0; max-height: 92vh; padding: 20px 16px; margin: 0; align-self: flex-end; }
          .overlay { align-items: flex-end; padding: 0; }
          .notif { top: auto; bottom: 80px; right: 12px; left: 12px; text-align: center; }
          .stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .hide-mobile { display: none !important; }
          .page-title { font-size: 22px !important; }
          .page-header { flex-direction: column; align-items: flex-start; gap: 10px; }
          .day-btn { width: 36px; height: 36px; font-size: 11px; }
          table { font-size: 12px; }
          .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .lib-grid { grid-template-columns: 1fr !important; }
        }

        /* -- EXTRA SMALL (max 380px) -- */
        @media (max-width: 380px) {
          .grid-4 { grid-template-columns: 1fr 1fr; gap: 8px; }
          .stat-row { grid-template-columns: 1fr 1fr; gap: 8px; }
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="notif" style={{
          background: notification.type === "warn" ? "#92400e" : "#064e3b",
          color: notification.type === "warn" ? "#fde68a" : "#6ee7b7",
          border: `1px solid ${notification.type === "warn" ? "#d97706" : "#10b981"}`
        }}>{notification.msg}</div>
      )}

      {/* ── DESKTOP HEADER ─────────────────────────────────────── */}
      <div style={{background:"rgba(0,0,0,0.4)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"0 16px",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:34,height:34,background:"linear-gradient(135deg,#00d4aa,#3b82f6)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🧬</div>
            <div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:17,letterSpacing:"-0.3px"}}>PeptideOS Pro</div>
              <div style={{fontSize:9,color:"#64748b",letterSpacing:"0.5px",textTransform:"uppercase"}} className="hide-mobile">The Complete Protocol</div>
            </div>
          </div>
          <nav className="desktop-nav">
            {[
              {id:"dashboard",label:"📊 Dashboard"},
              {id:"today",label:"✅ Today"},
              {id:"protocol",label:"⚗️ Protocol"},
              {id:"library",label:"📚 Library"},
              {id:"calculator",label:"🔢 Calc"},
              {id:"progress",label:"📏 Progress"},
              {id:"inventory",label:"🧪 Inventory"},
              {id:"journal",label:"📓 Journal"},
              {id:"bloodwork",label:"🩸 Labs"},
              {id:"tools",label:"🛠 Tools"},
            ].map(tab=>(
              <button key={tab.id} className={`tab-btn ${activeTab===tab.id?"active":""}`} onClick={()=>setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────────── */}
      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          {[
            {id:"dashboard",icon:"📊",label:"Home"},
            {id:"today",icon:"✅",label:"Today"},
            {id:"protocol",icon:"⚗️",label:"Protocol"},
            {id:"library",icon:"📚",label:"Library"},
          ].map(t=>(
            <button key={t.id} className={`mob-tab ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
              <span className="mob-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
          <button className={`mob-tab ${["calculator","progress","inventory","journal","bloodwork","tools"].includes(activeTab)?"active":""}`} onClick={()=>setMoreDrawerOpen(v=>!v)}>
            <span className="mob-icon">⋯</span>
            <span>More</span>
          </button>
        </div>
      </div>

      {/* ── MORE DRAWER ────────────────────────────────────────── */}
      <div className={`more-drawer-backdrop ${moreDrawerOpen?"open":""}`} onClick={()=>setMoreDrawerOpen(false)}/>
      <div className={`more-drawer ${moreDrawerOpen?"open":""}`}>
        {[
          {id:"calculator",icon:"🔢",label:"Calculator"},
          {id:"progress",icon:"📏",label:"Progress"},
          {id:"inventory",icon:"🧪",label:"Inventory"},
          {id:"journal",icon:"📓",label:"Journal"},
          {id:"bloodwork",icon:"🩸",label:"Lab Results"},
          {id:"tools",icon:"🛠",label:"Tools"},
        ].map(t=>(
          <button key={t.id} className={`more-drawer-item ${activeTab===t.id?"active":""}`} onClick={()=>{setActiveTab(t.id);setMoreDrawerOpen(false);}}>
            <span style={{fontSize:22}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px"}} className="main-content">

        {/* ═══════════════════════════ DASHBOARD ═══════════════════════════ */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="page-title" style={{fontFamily:"'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6}}>
              Your Protocol Dashboard
            </h1>
            <p style={{color:"#64748b", marginBottom: 28, fontSize: 15}}>
              {new Date().toLocaleDateString('en-US',{weekday:'long', year:'numeric', month:'long', day:'numeric'})}
            </p>

            {/* Stats Row */}
            <div className="grid-4 stat-row" style={{marginBottom:24}}>
              {[
                { label:"Peptides Active", value: protocol.filter(p=>p.active).length, color:"#00d4aa", icon:"⚗️" },
                { label:"Total Doses Logged", value: totalDoses, color:"#3b82f6", icon:"💉" },
                { label:"Today's Progress", value: `${todayCompleted}/${todayProtocol.length}`, color:"#f59e0b", icon:"✅" },
                { label:"7-Day Streak", value: last7Adherence.filter(v=>v===100).length, color:"#ec4899", icon:"🔥" },
              ].map(stat => (
                <div key={stat.label} className="card stat-card">
                  <div style={{fontSize: 24, marginBottom: 8}}>{stat.icon}</div>
                  <div style={{fontSize: 28, fontWeight: 700, color: stat.color, fontFamily:"'Space Grotesk',sans-serif"}}>{stat.value}</div>
                  <div style={{fontSize: 12, color:"#64748b", marginTop: 4}}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* 7-Day Adherence */}
            <div className="card" style={{padding: 24, marginBottom: 24}}>
              <h3 style={{marginBottom: 20, fontWeight: 700, display:"flex", alignItems:"center", gap: 8}}>
                <span>📈</span> 7-Day Adherence
              </h3>
              <div style={{display:"flex", gap: 8, alignItems: "flex-end"}}>
                {last7Days.map((date, i) => {
                  const pct = last7Adherence[i];
                  const label = new Date(date + "T12:00:00").toLocaleDateString('en-US',{weekday:'short'});
                  return (
                    <div key={date} style={{flex:1, textAlign:"center"}}>
                      <div style={{
                        height: pct != null ? `${Math.max(pct * 0.8, 4)}px` : "4px",
                        background: pct === 100 ? "#00d4aa" : pct > 50 ? "#f59e0b" : pct > 0 ? "#f87171" : "#2a3a5c",
                        borderRadius: "4px 4px 0 0",
                        marginBottom: 8,
                        transition: "height 0.4s"
                      }} />
                      <div style={{fontSize: 11, color:"#64748b"}}>{label}</div>
                      <div style={{fontSize: 11, color:"#94a3b8", fontWeight: 600}}>
                        {pct != null ? `${pct}%` : "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Quick View */}
            <div className="card" style={{padding: 24}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 20}}>
                <h3 style={{fontWeight:700, display:"flex", alignItems:"center", gap:8}}>
                  <span>📅</span> Today's Schedule
                </h3>
                <button className="btn-primary" onClick={() => setActiveTab("today")} style={{fontSize:12, padding:"6px 14px"}}>
                  Log Doses →
                </button>
              </div>
              {todayProtocol.length === 0 ? (
                <div style={{textAlign:"center", color:"#475569", padding:"20px 0"}}>
                  No doses scheduled today. <span style={{cursor:"pointer", color:"#00d4aa"}} onClick={() => setActiveTab("protocol")}>Set up your protocol →</span>
                </div>
              ) : (
                <div style={{display:"flex", flexDirection:"column", gap: 10}}>
                  {todayProtocol.map(p => {
                    const log = getLog(p.id, selectedDate);
                    const pep = PEPTIDE_LIBRARY.find(x => x.id === p.id);
                    return (
                      <div key={p.id} style={{
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                        padding:"12px 16px", borderRadius: 12,
                        background: log?.taken ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${log?.taken ? "rgba(0,212,170,0.25)" : "rgba(255,255,255,0.06)"}`
                      }}>
                        <div style={{display:"flex", alignItems:"center", gap: 12}}>
                          <div style={{
                            width: 10, height: 10, borderRadius: "50%",
                            background: pep?.color || "#64748b"
                          }}/>
                          <div>
                            <div style={{fontWeight:600, fontSize:14}}>{p.name}</div>
                            <div style={{fontSize:12, color:"#64748b"}}>{p.dose} {p.unit} • {p.route}</div>
                          </div>
                        </div>
                        <div style={{display:"flex", alignItems:"center", gap: 8}}>
                          {log?.taken && <span style={{fontSize:12, color:"#00d4aa", fontWeight:600}}>✓ Logged</span>}
                          <div
                            className="taken-check"
                            style={{
                              background: log?.taken ? "rgba(0,212,170,0.2)" : "rgba(255,255,255,0.08)",
                              border: `1px solid ${log?.taken ? "#00d4aa" : "rgba(255,255,255,0.15)"}`
                            }}
                            onClick={() => {
                              if (!log?.taken) setShowLogModal(p);
                              else { const k=`${p.id}_${selectedDate}`; saveLogs({...logs, [k]: {...logs[k], taken:false}}); }
                            }}
                          >
                            {log?.taken ? "✓" : "+"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════ TODAY ═══════════════════════════ */}
        {activeTab === "today" && (
          <div>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 28}}>
              <div>
                <h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize: 26, fontWeight:700}}>Daily Log</h1>
                <p style={{color:"#64748b", fontSize:14, marginTop:4}}>Track your doses, notes & injection sites</p>
              </div>
              <input
                type="date"
                className="input-field"
                style={{width:"auto"}}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Progress */}
            {todayProtocol.length > 0 && (
              <div className="card" style={{padding:20, marginBottom:24}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
                  <span style={{fontWeight:600}}>Today's Progress</span>
                  <span style={{color:"#00d4aa", fontWeight:700}}>{todayCompleted} / {todayProtocol.length}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${todayProtocol.length > 0 ? (todayCompleted/todayProtocol.length)*100 : 0}%`,
                    background: "linear-gradient(90deg, #00d4aa, #3b82f6)"
                  }}/>
                </div>
              </div>
            )}

            {todayProtocol.length === 0 ? (
              <div className="card" style={{padding:40, textAlign:"center"}}>
                <div style={{fontSize:40, marginBottom:12}}>📋</div>
                <div style={{color:"#64748b", marginBottom:16}}>No doses scheduled for this day.</div>
                <button className="btn-primary" onClick={() => setActiveTab("protocol")}>Set Up Protocol →</button>
              </div>
            ) : (
              <div style={{display:"flex", flexDirection:"column", gap:12}}>
                {todayProtocol.map(p => {
                  const log = getLog(p.id, selectedDate);
                  const pep = PEPTIDE_LIBRARY.find(x => x.id === p.id);
                  return (
                    <div key={p.id} className="card" style={{
                      padding: "18px 20px",
                      borderColor: log?.taken ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.07)"
                    }}>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                        <div style={{display:"flex", gap:14, alignItems:"center"}}>
                          <div style={{
                            width:44, height:44, borderRadius:12,
                            background:`${pep?.color}20`,
                            border:`1px solid ${pep?.color}40`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:20
                          }}>{pep?.emoji || "💉"}</div>
                          <div>
                            <div style={{fontWeight:700, fontSize:16}}>{p.name}</div>
                            <div style={{fontSize:13, color:"#64748b", marginTop:2}}>
                              {p.dose} {p.unit} • {p.route} • {ADMIN_ICONS[p.route]} 
                            </div>
                            {log?.siteUsed && (
                              <div style={{fontSize:12, color:"#94a3b8", marginTop:2}}>📍 Site: {log.siteUsed}</div>
                            )}
                            {log?.notes && (
                              <div style={{fontSize:12, color:"#94a3b8", marginTop:2}}>📝 {log.notes}</div>
                            )}
                          </div>
                        </div>
                        <div style={{display:"flex", gap:8, alignItems:"center"}}>
                          {log?.taken ? (
                            <div style={{display:"flex", gap:8, alignItems:"center"}}>
                              <span style={{
                                background:"rgba(0,212,170,0.15)", color:"#00d4aa",
                                padding:"4px 12px", borderRadius:999, fontSize:13, fontWeight:700
                              }}>✓ Done</span>
                              <button style={{
                                background:"transparent", border:"none", color:"#475569",
                                cursor:"pointer", fontSize:12
                              }} onClick={() => {
                                const k=`${p.id}_${selectedDate}`;
                                saveLogs({...logs, [k]: {...logs[k], taken:false}});
                              }}>Undo</button>
                            </div>
                          ) : (
                            <button className="btn-primary" onClick={() => setShowLogModal(p)}>
                              Log Dose +
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* All non-scheduled peptides */}
            {protocol.filter(p => {
              if (!p.active) return false;
              const dayName = new Date(selectedDate + "T12:00:00").toLocaleDateString('en-US',{weekday:'short'}).slice(0,3);
              return !p.days.includes(dayName);
            }).length > 0 && (
              <div style={{marginTop:24}}>
                <h3 style={{fontSize:14, color:"#475569", marginBottom:12, fontWeight:600}}>⏸ Not Scheduled Today</h3>
                <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                  {protocol.filter(p => {
                    if (!p.active) return false;
                    const dayName = new Date(selectedDate + "T12:00:00").toLocaleDateString('en-US',{weekday:'short'}).slice(0,3);
                    return !p.days.includes(dayName);
                  }).map(p => (
                    <span key={p.id} style={{
                      background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                      padding:"6px 14px", borderRadius:999, fontSize:13, color:"#475569"
                    }}>{p.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════ PROTOCOL ═══════════════════════════ */}
        {activeTab === "protocol" && (
          <div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28}}>
              <div>
                <h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700}}>My Protocol</h1>
                <p style={{color:"#64748b", fontSize:14, marginTop:4}}>Configure dosages, frequencies & schedules</p>
              </div>
              <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                + Add Peptide
              </button>
            </div>

            {protocol.length === 0 ? (
              <div className="card" style={{padding:60, textAlign:"center"}}>
                <div style={{fontSize:48, marginBottom:16}}>⚗️</div>
                <h3 style={{fontWeight:700, marginBottom:8}}>No Protocol Yet</h3>
                <p style={{color:"#64748b", marginBottom:24}}>Browse the library and build your custom peptide protocol</p>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add Your First Peptide</button>
              </div>
            ) : (
              <div style={{display:"flex", flexDirection:"column", gap:16}}>
                {protocol.map(p => {
                  const pep = PEPTIDE_LIBRARY.find(x => x.id === p.id);
                  return (
                    <div key={p.id} className="card" style={{padding:22}}>
                      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16}}>
                        <div style={{display:"flex", gap:12, alignItems:"center"}}>
                          <div style={{
                            width:46, height:46, borderRadius:12,
                            background:`${pep?.color}18`,
                            border:`1px solid ${pep?.color}35`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:22
                          }}>{pep?.emoji}</div>
                          <div>
                            <div style={{display:"flex", alignItems:"center", gap:8}}>
                              <span style={{fontWeight:700, fontSize:16}}>{p.name}</span>
                              <span className="badge" style={{
                                background:`${pep?.color}20`, color: pep?.color, fontSize:10
                              }}>{pep?.category}</span>
                              {!p.active && <span className="badge" style={{background:"rgba(239,68,68,0.15)", color:"#f87171"}}>Paused</span>}
                            </div>
                            {pep?.aka && <div style={{fontSize:12, color:"#64748b"}}>{pep.aka}</div>}
                          </div>
                        </div>
                        <div style={{display:"flex", gap:8}}>
                          <button style={{
                            background: p.active ? "rgba(239,68,68,0.1)" : "rgba(0,212,170,0.1)",
                            color: p.active ? "#f87171" : "#00d4aa",
                            border: `1px solid ${p.active ? "rgba(239,68,68,0.3)" : "rgba(0,212,170,0.3)"}`,
                            borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontFamily:"inherit"
                          }} onClick={() => updateProtocolField(p.id, "active", !p.active)}>
                            {p.active ? "Pause" : "Resume"}
                          </button>
                          <button className="btn-danger" onClick={() => removeFromProtocol(p.id)}>Remove</button>
                        </div>
                      </div>

                      <div className="grid-2" style={{marginBottom:16}}>
                        <div>
                          <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px"}}>Dose</label>
                          <div style={{display:"flex", gap:6}}>
                            <input className="input-field" style={{flex:2}}
                              value={p.dose} placeholder="e.g. 250"
                              onChange={e => updateProtocolField(p.id,"dose",e.target.value)} />
                            <select className="input-field" style={{flex:1}}
                              value={p.unit}
                              onChange={e => updateProtocolField(p.id,"unit",e.target.value)}>
                              <option>mcg</option><option>mg</option><option>IU</option><option>units</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px"}}>Route</label>
                          <select className="input-field" value={p.route}
                            onChange={e => updateProtocolField(p.id,"route",e.target.value)}>
                            {(pep?.adminRoute || ["SubQ","IM","Oral","Topical","Nasal"]).map(r => (
                              <option key={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px"}}>Start Date</label>
                          <input type="date" className="input-field" value={p.startDate}
                            onChange={e => updateProtocolField(p.id,"startDate",e.target.value)} />
                        </div>
                        <div>
                          <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px"}}>Vial / BAC Water (for calc)</label>
                          <div style={{display:"flex", gap:6}}>
                            <input className="input-field" style={{flex:1}} placeholder="mg" value={p.vialMg||""}
                              onChange={e => updateProtocolField(p.id,"vialMg",e.target.value)} />
                            <input className="input-field" style={{flex:1}} placeholder="mL" value={p.waterMl||""}
                              onChange={e => updateProtocolField(p.id,"waterMl",e.target.value)} />
                          </div>
                        </div>
                      </div>

                      <div style={{marginBottom:14}}>
                        <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px"}}>Dosing Days</label>
                        <div style={{display:"flex", gap:6}}>
                          {DAYS_OF_WEEK.map(day => (
                            <button key={day} className={`day-btn ${p.days.includes(day)?"on":""}`}
                              onClick={() => toggleDay(p.id, day)}>
                              {day.slice(0,1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px"}}>Notes / Protocol Details</label>
                        <input className="input-field" placeholder="e.g. Take with food, morning fasted, cycle notes..."
                          value={p.notes} onChange={e => updateProtocolField(p.id,"notes",e.target.value)} />
                      </div>

                      {pep && (
                        <div style={{
                          marginTop:14, padding:"10px 14px", borderRadius:10,
                          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
                          display:"flex", gap:20, flexWrap:"wrap", fontSize:12
                        }}>
                          <span>⏱ Half-life: <strong>{pep.halfLife}</strong></span>
                          <span>📏 Common: <strong>{pep.commonDose}</strong></span>
                          <span>🔄 Typical cycle: <strong>{pep.cycleLength}</strong></span>
                          <a href={pep.link} target="_blank" rel="noopener noreferrer">🔗 Research →</a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════ LIBRARY ═══════════════════════════ */}
        {activeTab === "library" && (
          <div>
            <div style={{marginBottom:28}}>
              <h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:6}}>Peptide Library</h1>
              <p style={{color:"#64748b", fontSize:14}}>
                {PEPTIDE_LIBRARY.length} peptides across {CATEGORIES.length} categories. Click any card to learn more.
              </p>
            </div>

            {/* Search & Filter */}
            <div style={{display:"flex", gap:12, marginBottom:24, flexWrap:"wrap"}}>
              <input
                className="input-field"
                style={{flex:"1 1 240px"}}
                placeholder="🔍 Search peptides, benefits, names..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
                <button className="pill-btn" onClick={() => setFilterCat("All")}
                  style={{background: filterCat==="All" ? "rgba(0,212,170,0.2)" : "rgba(255,255,255,0.06)",
                    color: filterCat==="All" ? "#00d4aa" : "#64748b"}}>
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button key={cat} className="pill-btn"
                    onClick={() => setFilterCat(cat === filterCat ? "All" : cat)}
                    style={{
                      background: filterCat===cat ? `${CATEGORY_COLORS[cat]}25` : "rgba(255,255,255,0.06)",
                      color: filterCat===cat ? CATEGORY_COLORS[cat] : "#64748b"
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-auto lib-grid">
              {filteredLibrary.map(pep => {
                const inProtocol = protocol.some(p => p.id === pep.id);
                const isExpanded = expandedPeptide === pep.id;
                return (
                  <div key={pep.id} className="card card-hover"
                    style={{padding:20, cursor:"pointer", position:"relative",
                      borderColor: inProtocol ? `${pep.color}40` : "rgba(255,255,255,0.07)"}}
                    onClick={() => setExpandedPeptide(isExpanded ? null : pep.id)}>

                    {inProtocol && (
                      <div style={{
                        position:"absolute", top:12, right:12,
                        background:"rgba(0,212,170,0.15)", color:"#00d4aa",
                        fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999
                      }}>IN PROTOCOL</div>
                    )}

                    <div style={{display:"flex", gap:12, alignItems:"center", marginBottom:12}}>
                      <div style={{
                        width:44, height:44, borderRadius:12, fontSize:22,
                        background:`${pep.color}18`, border:`1px solid ${pep.color}30`,
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                      }}>{pep.emoji}</div>
                      <div>
                        <div style={{fontWeight:700, fontSize:15}}>{pep.name}</div>
                        <div style={{fontSize:11, color:"#64748b"}}>{pep.aka}</div>
                        <span className="badge" style={{background:`${pep.color}20`, color:pep.color, marginTop:4}}>
                          {pep.category}
                        </span>
                      </div>
                    </div>

                    <div style={{display:"flex", gap:8, marginBottom:12, flexWrap:"wrap"}}>
                      {pep.benefits.slice(0,3).map(b => (
                        <span key={b} style={{
                          fontSize:11, padding:"3px 8px", borderRadius:6,
                          background:"rgba(255,255,255,0.05)", color:"#94a3b8"
                        }}>{b}</span>
                      ))}
                    </div>

                    <div style={{display:"flex", gap:16, fontSize:12, color:"#64748b", marginBottom:12}}>
                      <span>📏 {pep.commonDose}</span>
                      <span>⏱ {pep.halfLife}</span>
                    </div>

                    {isExpanded && (
                      <div style={{
                        borderTop:"1px solid rgba(255,255,255,0.07)",
                        paddingTop:14, marginTop:4
                      }} onClick={e => e.stopPropagation()}>
                        <div style={{display:"flex", gap:16, marginBottom:12, fontSize:12, flexWrap:"wrap"}}>
                          <div><span style={{color:"#64748b"}}>Routes: </span>
                            {pep.adminRoute.map(r => `${ADMIN_ICONS[r]} ${r}`).join(", ")}
                          </div>
                          <div><span style={{color:"#64748b"}}>Frequency: </span>{pep.typicalFrequency}</div>
                          <div><span style={{color:"#64748b"}}>Cycle: </span>{pep.cycleLength}</div>
                        </div>
                        <div style={{
                          background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"10px 12px",
                          fontSize:12, color:"#94a3b8", marginBottom:12, lineHeight:1.6
                        }}>
                          📌 {pep.notes}
                        </div>
                        <div style={{display:"flex", gap:8, marginTop:8}}>
                          <a href={pep.link} target="_blank" rel="noopener noreferrer"
                            style={{flex:1, textAlign:"center", padding:"8px 0", borderRadius:8,
                              background:"rgba(0,212,170,0.1)", color:"#00d4aa",
                              fontSize:12, fontWeight:600}}>
                            🔗 Research Link
                          </a>
                          {!inProtocol ? (
                            <button onClick={() => {
                              addToProtocol(pep.id, {
                                dose: pep.commonDose.split("-")[0].replace(/[^\d.]/g,""),
                                unit: pep.commonDose.includes("mg") ? "mg" : "mcg",
                                route: pep.adminRoute[0],
                                days: ["Mon","Wed","Fri"]
                              });
                            }} style={{
                              flex:1, padding:"8px 0", borderRadius:8,
                              background:"rgba(0,212,170,0.2)", color:"#00d4aa",
                              border:"1px solid rgba(0,212,170,0.4)",
                              fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                            }}>+ Add to Protocol</button>
                          ) : (
                            <button onClick={() => setActiveTab("protocol")} style={{
                              flex:1, padding:"8px 0", borderRadius:8,
                              background:"rgba(59,130,246,0.15)", color:"#3b82f6",
                              border:"1px solid rgba(59,130,246,0.3)",
                              fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                            }}>⚙️ Edit Protocol</button>
                          )}
                        </div>
                      </div>
                    )}

                    <div style={{
                      fontSize:11, color:"#475569", textAlign:"center", marginTop:8
                    }}>{isExpanded ? "▲ collapse" : "▼ expand details"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════ CALCULATOR ═══════════════════════════ */}
        {activeTab === "calculator" && (
          <div>
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:6}}>
              Peptide Calculator
            </h1>
            <p style={{color:"#64748b", fontSize:14, marginBottom:28}}>
              Reconstitution calculator, syringe unit converter & dose planning tools
            </p>

            <div className="grid-2" style={{gap:24}}>
              {/* Recon Calc */}
              <div className="card" style={{padding:28}}>
                <h3 style={{fontWeight:700, marginBottom:6, display:"flex", alignItems:"center", gap:8}}>
                  🧪 Reconstitution Calculator
                </h3>
                <p style={{fontSize:12, color:"#64748b", marginBottom:20}}>
                  Calculate concentration and syringe units for any peptide vial
                </p>
                <div style={{display:"flex", flexDirection:"column", gap:14}}>
                  <div>
                    <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Vial Size (mg)</label>
                    <input className="input-field" type="number" placeholder="e.g. 5"
                      value={reconCalc.vialMg} onChange={e => setReconCalc({...reconCalc, vialMg:e.target.value})} />
                  </div>
                  <div>
                    <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Bacteriostatic Water (mL)</label>
                    <input className="input-field" type="number" placeholder="e.g. 2"
                      value={reconCalc.waterMl} onChange={e => setReconCalc({...reconCalc, waterMl:e.target.value})} />
                  </div>
                  <div>
                    <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Target Dose (mcg)</label>
                    <input className="input-field" type="number" placeholder="e.g. 250"
                      value={reconCalc.targetMcg} onChange={e => setReconCalc({...reconCalc, targetMcg:e.target.value})} />
                  </div>
                </div>

                {reconResult && (
                  <div style={{
                    marginTop:20, padding:16, borderRadius:12,
                    background:"rgba(0,212,170,0.08)", border:"1px solid rgba(0,212,170,0.2)"
                  }}>
                    <div style={{fontWeight:700, color:"#00d4aa", marginBottom:10, fontSize:14}}>📊 Results</div>
                    <div style={{display:"flex", flexDirection:"column", gap:8, fontSize:14}}>
                      <div style={{display:"flex", justifyContent:"space-between"}}>
                        <span style={{color:"#64748b"}}>Concentration:</span>
                        <span style={{fontWeight:700}}>{reconResult.concMcgMl} mcg/mL</span>
                      </div>
                      <div style={{display:"flex", justifyContent:"space-between"}}>
                        <span style={{color:"#64748b"}}>mg per mL:</span>
                        <span style={{fontWeight:700}}>{reconResult.concMgMl} mg/mL</span>
                      </div>
                      {reconResult.units && (
                        <>
                          <div style={{borderTop:"1px solid rgba(0,212,170,0.2)", paddingTop:8, marginTop:4}}>
                          </div>
                          <div style={{display:"flex", justifyContent:"space-between", padding:"10px 0",
                            background:"rgba(0,212,170,0.1)", borderRadius:8, paddingLeft:12, paddingRight:12}}>
                            <span style={{fontWeight:600}}>Draw on U-100 Syringe:</span>
                            <span style={{fontWeight:800, fontSize:18, color:"#00d4aa"}}>{reconResult.units} units</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <p style={{fontSize:11, color:"#475569", marginTop:14, lineHeight:1.5}}>
                  ⚠️ Always reconstitute with sterile bacteriostatic water. Inject BAC water slowly along vial wall. Do not shake - swirl gently. Refrigerate immediately. Most peptides stable 28 days refrigerated.
                </p>
              </div>

              {/* Quick Reference */}
              <div style={{display:"flex", flexDirection:"column", gap:16}}>
                <div className="card" style={{padding:22}}>
                  <h3 style={{fontWeight:700, marginBottom:14, display:"flex", alignItems:"center", gap:8}}>
                    💡 Common Stacks
                  </h3>
                  {[
                    {name:"Recovery Stack", peptides:["BPC-157", "TB-500"], desc:"Synergistic tissue healing - local + systemic"},
                    {name:"GH Pulse Stack", peptides:["CJC-1295", "Ipamorelin"], desc:"Most prescribed GH secretagogue combo"},
                    {name:"Longevity Stack", peptides:["Epitalon", "GHK-Cu", "MOTS-c"], desc:"Telomere, skin & mitochondrial support"},
                    {name:"Fat Loss Stack", peptides:["Semaglutide", "AOD-9604"], desc:"GLP-1 + targeted fat metabolism"},
                    {name:"Cognitive Stack", peptides:["Semax", "Selank"], desc:"Nootropic + anxiolytic synergy"},
                    {name:"Immune Stack", peptides:["Thymosin Alpha-1", "KPV", "LL-37"], desc:"T-cell + gut + antimicrobial defense"},
                    {name:"Mito Longevity Stack", peptides:["MOTS-c", "SS-31", "Humanin"], desc:"Complete mitochondrial support"},
                    {name:"Gut Healing Stack", peptides:["BPC-157", "KPV", "VIP"], desc:"Tissue repair + anti-inflammatory + motility"},
                    {name:"Next-Gen Weight Loss", peptides:["Retatrutide", "AOD-9604"], desc:"Triple agonist + targeted fat metabolism"},
                  ].map(stack => (
                    <div key={stack.name} style={{
                      marginBottom:10, padding:"10px 12px", borderRadius:10,
                      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)"
                    }}>
                      <div style={{fontWeight:700, fontSize:13, marginBottom:4}}>{stack.name}</div>
                      <div style={{display:"flex", gap:4, flexWrap:"wrap", marginBottom:4}}>
                        {stack.peptides.map(p => (
                          <span key={p} style={{
                            fontSize:11, padding:"2px 8px", borderRadius:999,
                            background:"rgba(0,212,170,0.1)", color:"#00d4aa"
                          }}>{p}</span>
                        ))}
                      </div>
                      <div style={{fontSize:11, color:"#64748b"}}>{stack.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{padding:22}}>
                  <h3 style={{fontWeight:700, marginBottom:14}}>💉 Injection Site Rotation</h3>
                  <div className="grid-2" style={{gap:8}}>
                    {["Left Abdomen", "Right Abdomen", "Left Thigh", "Right Thigh",
                      "Left Deltoid", "Right Deltoid", "Left Glute", "Right Glute"].map(site => (
                      <div key={site} style={{
                        padding:"8px 12px", borderRadius:8, fontSize:12,
                        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
                        textAlign:"center", color:"#94a3b8"
                      }}>{site}</div>
                    ))}
                  </div>
                  <p style={{fontSize:11, color:"#475569", marginTop:12}}>
                    Always rotate injection sites to prevent lipodystrophy and maximize absorption.
                  </p>
                </div>
              </div>
            </div>

            {/* Protocol Doses Today */}
            {protocol.filter(p => p.vialMg && p.waterMl).length > 0 && (
              <div className="card" style={{padding:24, marginTop:24}}>
                <h3 style={{fontWeight:700, marginBottom:16}}>⚗️ Protocol Quick Calc (from your vials)</h3>
                <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:12}}>
                  {protocol.filter(p => p.vialMg && p.waterMl).map(p => {
                    const concMcgMl = (parseFloat(p.vialMg)/parseFloat(p.waterMl))*1000;
                    const doseNum = parseFloat(p.dose);
                    const unit = p.unit;
                    const doseMcg = unit === "mg" ? doseNum*1000 : doseNum;
                    const units = (doseMcg/concMcgMl*100).toFixed(1);
                    return (
                      <div key={p.id} style={{
                        padding:14, borderRadius:10,
                        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)"
                      }}>
                        <div style={{fontWeight:700, marginBottom:6}}>{p.name}</div>
                        <div style={{fontSize:12, color:"#64748b", marginBottom:6}}>{p.dose}{p.unit} dose</div>
                        <div style={{fontSize:20, fontWeight:800, color:"#00d4aa"}}>{units} <span style={{fontSize:12, fontWeight:500}}>units</span></div>
                        <div style={{fontSize:11, color:"#475569"}}>on U-100 syringe</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ PROGRESS TRACKER ═══════════════════════════════ */}
        {activeTab === "progress" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div>
                <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:700,marginBottom:6}}>Progress Tracker</h1>
                <p style={{color:"#64748b",fontSize:14}}>Weight, body measurements & transformation tracking</p>
              </div>
              <button className="btn-primary" onClick={()=>setShowAddStat(true)}>+ Log Measurements</button>
            </div>
            {/* Goals */}
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:22,marginBottom:20}}>
              <div style={{fontWeight:700,marginBottom:14}}>🎯 Goals</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {[{l:"Target Weight (lbs)",k:"weight"},{l:"Target BF%",k:"bf"},{l:"Target Waist (in)",k:"waist"}].map(g=>(
                  <div key={g.k}>
                    <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>{g.l}</div>
                    <input className="input-field" placeholder="e.g. 160" value={goals[g.k]||""} onChange={e=>setGoals(v=>({...v,[g.k]:e.target.value}))}/>
                  </div>
                ))}
                <div>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Protocol Goal</div>
                  <input className="input-field" placeholder="e.g. Heal knee, lose 20 lbs" value={goals.notes||""} onChange={e=>setGoals(v=>({...v,notes:e.target.value}))}/>
                </div>
              </div>
            </div>
            {bodyStats.length === 0 ? (
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:50,textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>📏</div>
                <p style={{color:"#64748b"}}>No measurements logged yet. Log your first entry to start tracking progress.</p>
              </div>
            ) : (
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:22}}>
                <div style={{fontWeight:700,marginBottom:16}}>📊 Measurement History ({bodyStats.length} entries)</div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
                    <thead>
                      <tr style={{color:"#64748b",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                        {["Date","Weight","BF%","Waist","Hips","Chest","Arm","Thigh","Energy","Notes",""].map(h=>(
                          <th key={h} style={{textAlign:"left",padding:"6px 10px",fontWeight:600,fontSize:11,textTransform:"uppercase"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...bodyStats].reverse().map((s,i)=>{
                        const prev=bodyStats[bodyStats.length-2-i];
                        const wDiff=prev&&s.weight&&prev.weight?(parseFloat(s.weight)-parseFloat(prev.weight)).toFixed(1):null;
                        return (
                          <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",color:"#e2e8f0"}}>
                            <td style={{padding:"8px 10px",fontWeight:600}}>{s.date}</td>
                            <td style={{padding:"8px 10px"}}>{s.weight||"-"}{wDiff&&<span style={{fontSize:10,marginLeft:4,color:parseFloat(wDiff)<0?"#00d4aa":"#f87171"}}>{parseFloat(wDiff)<0?"↓":"↑"}{Math.abs(wDiff)}</span>}</td>
                            <td style={{padding:"8px 10px"}}>{s.bf||"-"}</td>
                            <td style={{padding:"8px 10px"}}>{s.waist||"-"}</td>
                            <td style={{padding:"8px 10px"}}>{s.hips||"-"}</td>
                            <td style={{padding:"8px 10px"}}>{s.chest||"-"}</td>
                            <td style={{padding:"8px 10px"}}>{s.arm||"-"}</td>
                            <td style={{padding:"8px 10px"}}>{s.thigh||"-"}</td>
                            <td style={{padding:"8px 10px"}}>{s.energy?["😴","😐","😊","🚀","⚡"][s.energy-1]:"-"}</td>
                            <td style={{padding:"8px 10px",maxWidth:120,color:"#64748b",fontSize:11}}>{s.notes||""}</td>
                            <td><button style={{background:"rgba(239,68,68,0.12)",color:"#f87171",border:"1px solid rgba(239,68,68,0.3)",borderRadius:6,padding:"3px 8px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setBodyStats(v=>v.filter((_,j)=>j!==bodyStats.length-1-i))}>✕</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ VIAL INVENTORY ══════════════════════════════════ */}
        {activeTab === "inventory" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div>
                <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:700,marginBottom:6}}>Vial Inventory</h1>
                <p style={{color:"#64748b",fontSize:14}}>Track your peptide stock, expiration dates & remaining doses</p>
              </div>
              <button className="btn-primary" onClick={()=>setShowAddVial(true)}>+ Add Vial</button>
            </div>
            {vialInventory.length === 0 ? (
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:50,textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>🧪</div>
                <p style={{color:"#64748b"}}>No vials tracked yet. Add your peptide inventory to track stock and expiry.</p>
              </div>
            ) : (
              <div className="grid-auto">
                {vialInventory.map((v,i)=>{
                  const expDate=new Date(v.reconDate);
                  expDate.setDate(expDate.getDate()+(parseInt(v.daysStable)||28));
                  const daysLeft=Math.round((expDate-new Date())/86400000);
                  const dosesPer=v.vialMg&&v.waterMl&&v.doseMcg?(parseFloat(v.vialMg)*1000/parseFloat(v.doseMcg)).toFixed(0):null;
                  const remaining=dosesPer&&v.dosesUsed!=null?Math.max(0,parseFloat(dosesPer)-v.dosesUsed):null;
                  return (
                    <div key={i} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${daysLeft<7?"rgba(239,68,68,0.4)":daysLeft<14?"rgba(245,158,11,0.4)":"rgba(255,255,255,0.07)"}`,borderRadius:16,padding:18}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                        <div>
                          <div style={{fontWeight:700,fontSize:15}}>{v.pepName}</div>
                          <div style={{fontSize:11,color:"#64748b"}}>{v.vialMg}mg · {v.vendor||"No vendor"}</div>
                          {v.batchNum&&<div style={{fontSize:11,color:"#64748b"}}>Batch: {v.batchNum}</div>}
                        </div>
                        <button style={{background:"rgba(239,68,68,0.12)",color:"#f87171",border:"1px solid rgba(239,68,68,0.3)",borderRadius:6,padding:"3px 8px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setVialInventory(x=>x.filter((_,j)=>j!==i))}>✕</button>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
                        <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 10px"}}>
                          <div style={{color:"#64748b",fontSize:10,marginBottom:2}}>EXPIRES</div>
                          <div style={{fontWeight:700,color:daysLeft<7?"#f87171":daysLeft<14?"#f59e0b":"#00d4aa"}}>{daysLeft>0?`${daysLeft}d`:"EXPIRED"}</div>
                          <div style={{fontSize:10,color:"#64748b"}}>{expDate.toLocaleDateString()}</div>
                        </div>
                        {remaining!=null&&(
                          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 10px"}}>
                            <div style={{color:"#64748b",fontSize:10,marginBottom:2}}>DOSES LEFT</div>
                            <div style={{fontWeight:700,fontSize:16}}>{remaining}</div>
                            <div style={{fontSize:10,color:"#64748b"}}>of {dosesPer} total</div>
                          </div>
                        )}
                      </div>
                      {remaining!=null&&(
                        <button style={{marginTop:10,width:"100%",background:"rgba(0,212,170,0.1)",color:"#00d4aa",border:"1px solid rgba(0,212,170,0.25)",borderRadius:8,padding:"7px 0",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setVialInventory(x=>x.map((vv,j)=>j===i?{...vv,dosesUsed:(vv.dosesUsed||0)+1}:vv));showNotif("Dose used ✓");}}>Mark 1 Dose Used</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ JOURNAL ═════════════════════════════════════════ */}
        {activeTab === "journal" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div>
                <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:700,marginBottom:6}}>Protocol Journal</h1>
                <p style={{color:"#64748b",fontSize:14}}>Track results, observations, side effects & how you feel</p>
              </div>
              <button className="btn-primary" onClick={()=>setShowJournalEntry(true)}>+ New Entry</button>
            </div>
            {journal.length === 0 ? (
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:50,textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>📓</div>
                <p style={{color:"#64748b"}}>No journal entries yet. Document your experience, results & observations.</p>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {[...journal].reverse().map((j,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:22}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:15}}>{j.title||"Journal Entry"}</div>
                        <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{j.date} · Week {j.week||"?"}</div>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        {j.energy&&<span style={{fontSize:20}}>{["😴","😐","😊","🚀","⚡"][j.energy-1]}</span>}
                        {j.rating&&<span style={{color:"#f59e0b",fontSize:14}}>{"★".repeat(j.rating)}</span>}
                        <button style={{background:"rgba(239,68,68,0.12)",color:"#f87171",border:"1px solid rgba(239,68,68,0.3)",borderRadius:6,padding:"3px 8px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setJournal(x=>x.filter((_,k)=>k!==journal.length-1-i))}>✕</button>
                      </div>
                    </div>
                    {j.peptides&&j.peptides.length>0&&(
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                        {j.peptides.map(p=><span key={p} style={{background:"rgba(0,212,170,0.1)",color:"#00d4aa",padding:"2px 8px",borderRadius:999,fontSize:11}}>{p}</span>)}
                      </div>
                    )}
                    <div style={{fontSize:13,color:"#e2e8f0",lineHeight:1.6}}>{j.body}</div>
                    {j.sideEffects&&<div style={{marginTop:8,fontSize:12,color:"#fda4af"}}>⚠️ Side effects: {j.sideEffects}</div>}
                    {j.improvements&&<div style={{marginTop:4,fontSize:12,color:"#86efac"}}>✅ Improvements: {j.improvements}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

        {/* ═══════════ BLOODWORK / LAB TRACKER ═════════════════════════ */}
        {activeTab === "bloodwork" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div>
                <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:700,marginBottom:6}}>Lab & Bloodwork Tracker</h1>
                <p style={{color:"#64748b",fontSize:14}}>Track IGF-1, testosterone, glucose, lipids & any custom biomarker over time</p>
              </div>
              <button className="btn-primary" onClick={()=>setShowAddBlood(true)}>+ Log Labs</button>
            </div>
            {bloodwork.length === 0 ? (
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:50,textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>🩸</div>
                <p style={{color:"#64748b",marginBottom:8}}>No lab results logged yet.</p>
                <p style={{color:"#475569",fontSize:13}}>Track IGF-1, testosterone, HbA1c, glucose, lipids and any other biomarker alongside your protocol.</p>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {Object.entries(
                  bloodwork.reduce((acc, entry) => {
                    (entry.markers||[]).forEach(m => {
                      if(!acc[m.name]) acc[m.name] = [];
                      acc[m.name].push({date:entry.date, value:m.value, unit:m.unit, range:m.range});
                    });
                    return acc;
                  }, {})
                ).map(([marker, readings]) => {
                  const latest = readings[readings.length-1];
                  const prev = readings.length > 1 ? readings[readings.length-2] : null;
                  const trend = prev ? (parseFloat(latest.value) - parseFloat(prev.value)) : null;
                  return (
                    <div key={marker} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                        <div>
                          <div style={{fontWeight:700,fontSize:15}}>{marker}</div>
                          <div style={{fontSize:11,color:"#64748b"}}>{readings.length} readings</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:22,fontWeight:700,color:"#00d4aa"}}>{latest.value} <span style={{fontSize:12,color:"#64748b"}}>{latest.unit}</span></div>
                          {trend !== null && <div style={{fontSize:12,color:trend > 0 ? "#f59e0b":"#00d4aa"}}>{trend > 0 ? "↑":"↓"} {Math.abs(trend).toFixed(1)} from prev</div>}
                          {latest.range && <div style={{fontSize:11,color:"#475569"}}>Ref: {latest.range}</div>}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        {readings.map((r,i) => (
                          <div key={i} style={{padding:"5px 10px",borderRadius:7,background:"rgba(255,255,255,0.05)",fontSize:12,textAlign:"center"}}>
                            <div style={{color:"#64748b",fontSize:10}}>{r.date}</div>
                            <div style={{fontWeight:600}}>{r.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20}}>
                  <div style={{fontWeight:700,marginBottom:12}}>📋 All Lab Entries</div>
                  {[...bloodwork].reverse().map((entry,i) => (
                    <div key={i} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontWeight:600,fontSize:13}}>{entry.date}</span>
                        <button style={{background:"rgba(239,68,68,0.12)",color:"#f87171",border:"1px solid rgba(239,68,68,0.3)",borderRadius:6,padding:"2px 7px",fontSize:10,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setBloodwork(v=>v.filter((_,j)=>j!==bloodwork.length-1-i))}>✕</button>
                      </div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
                        {(entry.markers||[]).map(m => (
                          <span key={m.name} style={{fontSize:12,padding:"3px 9px",borderRadius:7,background:"rgba(0,212,170,0.1)",color:"#00d4aa"}}>{m.name}: {m.value} {m.unit}</span>
                        ))}
                      </div>
                      {entry.notes && <div style={{fontSize:12,color:"#64748b",marginTop:6}}>{entry.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ TOOLS ══════════════════════════════════════════ */}
        {activeTab === "tools" && (
          <div>
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:700,marginBottom:6}}>Tools</h1>
            <p style={{color:"#64748b",fontSize:14,marginBottom:24}}>Half-life plasma charts, cycle countdowns, CSV export & custom peptide builder</p>

            {/* Cycle Countdowns */}
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:22,marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>⏱ Cycle Countdowns</div>
              {protocol.length === 0 ? (
                <p style={{color:"#64748b",fontSize:13}}>Add peptides to your protocol to see cycle countdowns.</p>
              ) : (
                <div className="grid-auto" style={{gap:12}}>
                  {protocol.filter(p=>p.active&&p.startDate).map(p => {
                    const pep = PEPTIDE_LIBRARY.find(x=>x.id===p.id);
                    const start = new Date(p.startDate+"T12:00:00");
                    const daysSince = Math.floor((new Date() - start) / 86400000);
                    const cycleText = pep?.cycleLength||"Unknown";
                    // Parse cycle length number
                    const cycleWeeks = parseInt(cycleText) || (cycleText.includes("12-16") ? 16 : cycleText.includes("4-8") ? 8 : cycleText.includes("4-6") ? 6 : 12);
                    const cycleDays = cycleWeeks * 7;
                    const daysLeft = Math.max(0, cycleDays - daysSince);
                    const pct = Math.min(100, Math.round((daysSince/cycleDays)*100));
                    return (
                      <div key={p.id} style={{padding:14,borderRadius:12,background:"rgba(255,255,255,0.04)",border:`1px solid ${pep?.color||"#64748b"}30`}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                          <span style={{fontSize:18}}>{pep?.emoji}</span>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:600,fontSize:13}}>{p.name}</div>
                            <div style={{fontSize:11,color:"#64748b"}}>{cycleText}</div>
                          </div>
                        </div>
                        <div style={{height:5,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden",marginBottom:6}}>
                          <div style={{height:"100%",width:`${pct}%`,background:pct>90?"#f87171":pct>70?"#f59e0b":"#00d4aa",borderRadius:3,transition:"width 0.5s"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b"}}>
                          <span>Day {daysSince}</span>
                          <span style={{color:daysLeft<7?"#f87171":"#94a3b8"}}>{daysLeft > 0 ? `${daysLeft}d left` : "⚠️ Cycle complete"}</span>
                        </div>
                        <div style={{fontSize:10,color:"#475569",marginTop:3}}>Started {p.startDate}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Half-Life Plasma Chart */}
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:22,marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>📉 Half-Life Plasma Level Estimator</div>
              <p style={{color:"#64748b",fontSize:13,marginBottom:14}}>Visualize estimated compound decay in your system after a dose</p>
              <div className="grid-auto" style={{gap:10,marginBottom:14}}>
                {protocol.filter(p=>p.active).map(p => {
                  const pep = PEPTIDE_LIBRARY.find(x=>x.id===p.id);
                  if(!pep||pep.halfLife==="Unknown"||pep.halfLife.includes("Topical")) return null;
                  const hlText = pep.halfLife;
                  // Parse half-life in hours
                  let hlHrs = 2;
                  if(hlText.includes("day")) { const n=parseFloat(hlText); hlHrs=(n||1)*24; }
                  else if(hlText.includes("hr")||hlText.includes("hour")) { const m=hlText.match(/[\d.]+/); hlHrs=m?parseFloat(m[0]):2; }
                  else if(hlText.includes("min")) { const m=hlText.match(/[\d.]+/); hlHrs=m?parseFloat(m[0])/60:0.5; }
                  else if(hlText.includes("week")) { const m=hlText.match(/[\d.]+/); hlHrs=m?parseFloat(m[0])*168:168; }
                  const totalHrs = hlHrs * 7;
                  const steps = 20;
                  const points = Array.from({length:steps+1},(_,i)=>{
                    const t=(i/steps)*totalHrs;
                    return Math.round(Math.pow(0.5,t/hlHrs)*100);
                  });
                  const max = 60; const chartW = 180; const chartH = 50;
                  const pts = points.map((v,i)=>`${Math.round((i/steps)*chartW)},${Math.round(chartH-(v/100)*chartH)}`).join(" ");
                  return (
                    <div key={p.id} style={{padding:12,borderRadius:11,background:"rgba(255,255,255,0.04)",border:`1px solid ${pep.color}25`}}>
                      <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:8}}>
                        <span style={{fontSize:16}}>{pep.emoji}</span>
                        <div>
                          <div style={{fontWeight:600,fontSize:12}}>{p.name}</div>
                          <div style={{fontSize:10,color:"#64748b"}}>t½ = {pep.halfLife}</div>
                        </div>
                      </div>
                      <svg width="100%" viewBox={`0 0 ${chartW} ${chartH+10}`} style={{overflow:"visible"}}>
                        <polyline points={pts} fill="none" stroke={pep.color||"#00d4aa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <text x="0" y={chartH+10} fill="#64748b" fontSize="8">0</text>
                        <text x={chartW-20} y={chartH+10} fill="#64748b" fontSize="8">{totalHrs>48?`${(totalHrs/24).toFixed(0)}d`:`${totalHrs.toFixed(0)}h`}</text>
                        <text x="2" y="8" fill="#94a3b8" fontSize="7">100%</text>
                        <line x1="0" y1={chartH} x2={chartW} y2={chartH} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                      </svg>
                      <div style={{fontSize:10,color:"#64748b",marginTop:2}}>50% at {hlHrs>24?`${(hlHrs/24).toFixed(1)}d`:`${hlHrs}h`} · gone ~{totalHrs>48?`${(totalHrs/24).toFixed(0)}d`:`${totalHrs.toFixed(0)}h`}</div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
              {protocol.filter(p=>p.active).length === 0 && <p style={{color:"#64748b",fontSize:13}}>Add peptides to your protocol to see plasma curves.</p>}
            </div>

            {/* CSV Export */}
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:22,marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>📤 Export Data</div>
              <p style={{color:"#64748b",fontSize:13,marginBottom:14}}>Download your data as CSV to share with your healthcare provider or import into a spreadsheet</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {[
                  {label:"Export Dose Log (CSV)", fn:()=>{
                    const rows=[["Date","Peptide","Dose","Unit","Site","Mood","Side Effects","Improvements","Rating","Notes"]];
                    Object.entries(logs).forEach(([key,log])=>{
                      if(!log.taken) return;
                      const [pepId,date]=key.split("_");
                      const pep=protocol.find(p=>p.id===pepId);
                      if(pep) rows.push([date,pep.name,log.actualDose||pep.dose,pep.unit,log.siteUsed||"",log.mood||"",log.sideEffects||"",log.improvements||"",log.rating||"",log.notes||""]);
                    });
                    const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("
");
                    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="peptide_dose_log.csv";a.click();
                  }},
                  {label:"Export Measurements (CSV)", fn:()=>{
                    const rows=[["Date","Weight","BF%","Waist","Hips","Chest","Arm","Thigh","Energy","Notes"]];
                    bodyStats.forEach(s=>rows.push([s.date,s.weight,s.bf,s.waist,s.hips,s.chest,s.arm,s.thigh,s.energy,s.notes||""]));
                    const csv=rows.map(r=>r.map(c=>`"${String(c||"").replace(/"/g,'""')}"`).join(",")).join("
");
                    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="body_measurements.csv";a.click();
                  }},
                  {label:"Export Protocol (CSV)", fn:()=>{
                    const rows=[["Peptide","Category","Dose","Unit","Route","Frequency","Days","Start Date","Notes"]];
                    protocol.forEach(p=>{
                      const pep=PEPTIDE_LIBRARY.find(x=>x.id===p.id);
                      rows.push([p.name,pep?.category||"",p.dose,p.unit,p.route,pep?.typicalFrequency||"",p.days.join(", "),p.startDate,p.notes||""]);
                    });
                    const csv=rows.map(r=>r.map(c=>`"${String(c||"").replace(/"/g,'""')}"`).join(",")).join("
");
                    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="peptide_protocol.csv";a.click();
                  }},
                  {label:"Export Lab Results (CSV)", fn:()=>{
                    const rows=[["Date","Marker","Value","Unit","Reference Range","Notes"]];
                    bloodwork.forEach(entry=>(entry.markers||[]).forEach(m=>rows.push([entry.date,m.name,m.value,m.unit,m.range||"",entry.notes||""])));
                    const csv=rows.map(r=>r.map(c=>`"${String(c||"").replace(/"/g,'""')}"`).join(",")).join("
");
                    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="lab_results.csv";a.click();
                  }},
                ].map(btn=>(
                  <button key={btn.label} onClick={btn.fn} style={{padding:"10px 16px",borderRadius:9,background:"rgba(0,212,170,0.1)",color:"#00d4aa",border:"1px solid rgba(0,212,170,0.3)",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,transition:"all 0.2s"}}>{btn.label}</button>
                ))}
              </div>
            </div>

            {/* ── STACK ANALYZER ─────────────────────────────────── */}
            <StackAnalyzer protocol={protocol}/>

            {/* ── INTERACTION CHECKER ─────────────────────────────── */}
            <InteractionChecker protocol={protocol}/>

            {/* Custom Peptide Builder */}
            <CustomPeptideBuilder onAdd={(pep)=>{
              const newProt={...pep, id:"custom_"+Date.now(), days:["Mon","Wed","Fri"], startDate:selectedDate, active:true};
              setProtocol(p=>[...p,newProt]);
              showNotif(`${pep.name} added! 🎉`);
            }}/>
          </div>
        )}

      </div>

      {/* ═══════════════════════════ MODALS ═══════════════════════════ */}

      {/* Add Bloodwork Modal */}
      {showAddBlood && (
        <AddBloodworkModal date={selectedDate} onSave={b=>{setBloodwork(v=>[...v,b]);showNotif("Lab results saved! 🩸");setShowAddBlood(false);}} onClose={()=>setShowAddBlood(false)}/>
      )}
      {/* Add Stat Modal */}
      {showAddStat && (
        <AddStatModal date={selectedDate} onSave={s=>{setBodyStats(v=>[...v,s]);showNotif("Measurements saved! 📏");setShowAddStat(false);}} onClose={()=>setShowAddStat(false)}/>
      )}
      {/* Add Vial Modal */}
      {showAddVial && (
        <AddVialModal peptideList={PEPTIDE_LIBRARY} onSave={v=>{setVialInventory(x=>[...x,v]);showNotif("Vial added! 🧪");setShowAddVial(false);}} onClose={()=>setShowAddVial(false)}/>
      )}
      {/* Journal Entry Modal */}
      {showJournalEntry && (
        <JournalEntryModal protocol={protocol} date={selectedDate} onSave={j=>{setJournal(v=>[...v,j]);showNotif("Journal entry saved! 📓");setShowJournalEntry(false);}} onClose={()=>setShowJournalEntry(false)}/>
      )}
      {/* Add Peptide Modal */}
      {showAddModal && (
        <AddPeptideModal
          protocol={protocol}
          onAdd={addToProtocol}
          onClose={() => setShowAddModal(false)}
          selectedDate={selectedDate}
        />
      )}

      {/* Log Dose Modal */}
      {showLogModal && (
        <LogDoseModal
          peptide={showLogModal}
          pepData={PEPTIDE_LIBRARY.find(p => p.id === showLogModal.id)}
          onLog={logDose}
          onClose={() => setShowLogModal(null)}
          existingLog={getLog(showLogModal.id, selectedDate)}
        />
      )}
      {/* ═══════════ DISCLAIMER MODAL (first run) ═══════════ */}
      {!disclaimerAccepted && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"#0d1220",border:"1px solid rgba(245,158,11,0.4)",borderRadius:20,maxWidth:560,width:"100%",maxHeight:"92vh",overflowY:"auto",padding:"28px 24px"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:42,marginBottom:10}}>⚠️</div>
              <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:20,color:"#f59e0b",marginBottom:6}}>Research Use Only - Legal Disclaimer</h2>
              <div style={{fontSize:12,color:"#64748b",textTransform:"uppercase",letterSpacing:"1px"}}>Please read and accept before continuing</div>
            </div>

            <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:12,padding:"16px 18px",marginBottom:16,fontSize:13,color:"#e2e8f0",lineHeight:1.8}}>
              <p style={{marginBottom:10}}><strong style={{color:"#f59e0b"}}>FOR RESEARCH AND INFORMATIONAL PURPOSES ONLY.</strong> PeptideOS is a personal research logging and reference tool. All compounds, dosages, protocols, and information contained in this application are provided strictly for educational and research documentation purposes.</p>
              <p style={{marginBottom:10}}>The peptides referenced in this application are <strong>research chemicals</strong> that are <strong>not approved by the FDA</strong> for human consumption, therapeutic use, or medical treatment, unless explicitly noted otherwise.</p>
              <p style={{marginBottom:10}}><strong style={{color:"#f87171"}}>This application is NOT medical advice.</strong> Nothing in PeptideOS constitutes medical advice, diagnosis, or treatment recommendations. The creators, developers, and distributors of this application are not medical professionals and accept no liability for any actions taken based on information in this app.</p>
              <p style={{marginBottom:10}}>By using this application you confirm that you are:</p>
              <ul style={{paddingLeft:18,marginBottom:10}}>
                <li style={{marginBottom:4}}>18 years of age or older</li>
                <li style={{marginBottom:4}}>Using this tool for personal research and documentation purposes only</li>
                <li style={{marginBottom:4}}>Complying with all applicable laws and regulations in your jurisdiction</li>
                <li style={{marginBottom:4}}>Consulting a qualified, licensed healthcare professional before beginning any protocol</li>
                <li style={{marginBottom:4}}>Assuming full personal responsibility for any decisions made</li>
              </ul>
              <p style={{color:"#94a3b8",fontSize:12}}><strong>The developer of this application expressly disclaims all liability</strong> for any direct, indirect, incidental, or consequential damages arising from use or misuse of any information presented herein. Use of this application constitutes full acceptance of these terms.</p>
            </div>

            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"12px 14px",marginBottom:20,fontSize:12,color:"#64748b",lineHeight:1.6}}>
              🔬 <strong style={{color:"#e2e8f0"}}>Research Use Only</strong> &nbsp;·&nbsp; 
              ⚕️ <strong style={{color:"#e2e8f0"}}>Not Medical Advice</strong> &nbsp;·&nbsp; 
              ⚖️ <strong style={{color:"#e2e8f0"}}>No Liability Assumed</strong> &nbsp;·&nbsp;
              👤 <strong style={{color:"#e2e8f0"}}>18+ Only</strong>
            </div>

            <button
              onClick={()=>{ setDisclaimerAccepted(true); try{localStorage.setItem("pep_disclaimer_v1","yes")}catch{} }}
              style={{width:"100%",padding:"14px 0",borderRadius:11,background:"linear-gradient(135deg,#f59e0b,#ef4444)",color:"white",border:"none",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.3px"}}>
              I Understand - I Am 18+ and Using This for Research Only
            </button>
            <p style={{fontSize:11,color:"#475569",textAlign:"center",marginTop:10,lineHeight:1.5}}>
              By clicking above you confirm you have read, understood, and agree to the full disclaimer above.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════ PERSISTENT DISCLAIMER FOOTER ═══════════ */}
      <div style={{background:"rgba(0,0,0,0.6)",borderTop:"1px solid rgba(245,158,11,0.15)",padding:"8px 16px",textAlign:"center",fontSize:11,color:"#475569",lineHeight:1.5}} className="disclaimer-footer">
        ⚠️ <strong style={{color:"#64748b"}}>For Research & Informational Purposes Only.</strong> Not medical advice. Not FDA approved for human use. Consult a licensed healthcare provider before starting any protocol. The developer assumes no liability for use or misuse of this information. 18+ only.
      </div>

    </div>
  );
}

// ============================================================
// BLOODWORK MODAL
// ============================================================
function AddBloodworkModal({ onSave, onClose, date }) {
  const COMMON_MARKERS = ["IGF-1","Testosterone (Total)","Testosterone (Free)","LH","FSH","Estradiol","DHEA-S","Cortisol","HbA1c","Fasting Glucose","Insulin","TSH","T3 Free","T4 Free","GH","IGF-BP3","LDL","HDL","Triglycerides","hsCRP","Vitamin D","Ferritin","CBC","ALT","AST","Creatinine","eGFR"];
  const [markers, setMarkers] = useState([{name:"IGF-1",value:"",unit:"ng/mL",range:"115-307"}]);
  const [notes, setNotes] = useState("");
  const addMarker = () => setMarkers(v=>[...v,{name:"",value:"",unit:"",range:""}]);
  const updateMarker = (i,field,val) => setMarkers(v=>v.map((m,j)=>j===i?{...m,[field]:val}:m));
  const removeMarker = (i) => setMarkers(v=>v.filter((_,j)=>j!==i));
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18}}>🩸 Log Lab Results - {date}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{maxHeight:380,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
          {markers.map((m,i) => (
            <div key={i} style={{padding:"12px 14px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,alignItems:"end"}}>
                <div>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4,textTransform:"uppercase"}}>Marker</div>
                  <input list={`markers-list-${i}`} className="input-field" value={m.name} placeholder="e.g. IGF-1" onChange={e=>updateMarker(i,"name",e.target.value)}/>
                  <datalist id={`markers-list-${i}`}>{COMMON_MARKERS.map(mk=><option key={mk} value={mk}/>)}</datalist>
                </div>
                <div>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4,textTransform:"uppercase"}}>Value</div>
                  <input className="input-field" value={m.value} placeholder="e.g. 230" onChange={e=>updateMarker(i,"value",e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4,textTransform:"uppercase"}}>Unit</div>
                  <input className="input-field" value={m.unit} placeholder="ng/mL" onChange={e=>updateMarker(i,"unit",e.target.value)}/>
                </div>
                <button onClick={()=>removeMarker(i)} style={{background:"rgba(239,68,68,0.12)",color:"#f87171",border:"1px solid rgba(239,68,68,0.3)",borderRadius:7,padding:"8px 10px",cursor:"pointer",fontFamily:"inherit",alignSelf:"flex-end"}}>✕</button>
              </div>
              <div style={{marginTop:8}}>
                <input className="input-field" style={{fontSize:12}} value={m.range} placeholder="Reference range, e.g. 115-307" onChange={e=>updateMarker(i,"range",e.target.value)}/>
              </div>
            </div>
          ))}
          <button onClick={addMarker} style={{padding:"9px 0",borderRadius:9,background:"rgba(255,255,255,0.05)",border:"1px dashed rgba(255,255,255,0.15)",color:"#64748b",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>+ Add Another Marker</button>
        </div>
        <div style={{marginTop:12}}>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Notes</div>
          <input className="input-field" placeholder="Fasted, morning draw, protocol week..." value={notes} onChange={e=>setNotes(e.target.value)}/>
        </div>
        <button className="btn-primary" style={{width:"100%",marginTop:16,padding:"12px 0"}} onClick={()=>{if(!markers[0].value){alert("Enter at least one value");return;}onSave({date,markers:markers.filter(m=>m.value),notes});}}>Save Lab Results</button>
      </div>
    </div>
  );
}

// ============================================================
// STACK ANALYZER
// ============================================================

// Synergy data: [pep1_id, pep2_id, score 0-100, mechanism, note]
const SYNERGY_DB = [
  // HEALING COMBOS
  ["bpc157","tb500",95,"tissue-repair","BPC-157 (local/vascular) + TB-500 (systemic/migration) = Wolverine Stack. Two non-overlapping repair pathways. Can mix in same syringe."],
  ["bpc157","kpv",88,"gut-healing","BPC-157 rebuilds gut tissue; KPV silences inflammation. Both oral-bioavailable for gut targeting. Stack for IBD/IBS."],
  ["bpc157","ghkcu",82,"regeneration","GHK-Cu adds collagen synthesis to BPC-157's vascular/tissue repair. Great skin + wound healing combo."],
  ["bpc157","ara290",80,"healing-pain","BPC-157 handles tissue repair; ARA-290 addresses neuropathic pain. Complementary mechanisms."],
  // GH COMBOS
  ["cjc1295","ipamorelin",95,"GH-axis","GHRH (CJC) + GHRP (Ipa) = synergistic GH pulse. Most prescribed GH combo. Can mix in same syringe."],
  ["cjc1295","ghrp2",88,"GH-axis","GHRH + GHRP produces amplified GH release vs either alone. Watch for hunger and cortisol spike from GHRP-2."],
  ["cjc1295","ghrp6",88,"GH-axis","GHRH + GHRP synergy. GHRP-6 causes more hunger than Ipamorelin - good for bulking."],
  ["cjc1295","hexarelin",85,"GH-axis","GHRH + strongest GHRP. Excellent GH output but watch desensitization - cycle Hexarelin strictly."],
  ["sermorelin","ipamorelin",90,"GH-axis","Classic clinical GH stack. Sermorelin (GHRH) + Ipamorelin (GHRP) for pulsatile GH. Very clean synergy."],
  ["tesamorelin","aod9604",85,"fat-loss","Tesamorelin targets visceral fat via GH; AOD-9604 targets peripheral fat directly. Different mechanisms for additive fat loss."],
  // COGNITIVE COMBOS
  ["semax","selank",90,"neuro","Semax (BDNF/focus) + Selank (anxiolytic/calm). Classic cognitive stack - sharp yet calm. Nasal, same spray."],
  ["semax","dihexa",85,"neuro","Semax boosts BDNF; Dihexa stimulates HGF for synaptogenesis. Complementary neuroplasticity pathways."],
  ["p21pep","dihexa",88,"neuro","Both stimulate synaptogenesis but via different pathways (CNTF vs HGF). Stack for maximum neuroplasticity."],
  ["vip","bpc157",80,"gut-neuro","VIP handles gut motility/inflammation via receptor; BPC-157 handles structural repair. Great gut stack."],
  // LONGEVITY COMBOS
  ["epitalon","thymalin",88,"longevity","Pineal telomere support (Epitalon) + thymic immune restoration (Thymalin). Core of the TRIIM trial protocol."],
  ["epitalon","pinealon",85,"longevity","Both target pineal function but different peptide sequences. Stacking covers more regulatory pathways."],
  ["motsc","ss31",90,"mito","MOTS-c (AMPK/metabolic) + SS-31 (inner membrane integrity). Together cover both aspects of mitochondrial health."],
  ["motsc","humanin",88,"mito","Both mitochondria-derived; MOTS-c is metabolic, Humanin is neuroprotective. Complementary coverage."],
  ["ss31","humanin",85,"mito","SS-31 (membrane) + Humanin (neuroprotection). Together with MOTS-c = complete mito longevity stack."],
  ["ghkcu","epitalon",80,"anti-aging","GHK-Cu for collagen/skin + Epitalon for telomeres/pineal. Cover two independent anti-aging mechanisms."],
  // IMMUNE COMBOS
  ["thymosin_alpha1","kpv",85,"immune","Thymosin α-1 (adaptive T-cell) + KPV (mucosal/anti-inflammatory). Different immune defense layers."],
  ["thymosin_alpha1","ll37",82,"immune","Adaptive immunity (Tα1) + innate antimicrobial (LL-37). Full-spectrum immune defense."],
  ["kpv","ll37",80,"immune","KPV (anti-inflammatory) + LL-37 (antimicrobial). Good for chronic infections with inflammation."],
  // GLP-1 COMBOS
  ["semaglutide","aod9604",78,"metabolic","GLP-1 appetite control + AOD-9604 fat metabolism. Different mechanisms for additive weight loss."],
  ["tirzepatide","aod9604",78,"metabolic","Same as sema+AOD. Tirzepatide may be slightly better due to dual GIP/GLP-1 mechanism."],
  ["retatrutide","aod9604",75,"metabolic","Triple agonist + AOD. Retatrutide already includes glucagon agonism; AOD adds direct fat cell metabolism."],
  // GH + HEALING
  ["cjc1295","bpc157",78,"recovery","CJC/Ipa GH boost + BPC-157 healing is a classic performance-recovery stack. GH accelerates BPC-157 results."],
  ["igf1lr3","bpc157",80,"anabolic-heal","IGF-1 drives muscle growth; BPC-157 accelerates tissue repair. Together allow harder training with faster recovery."],
  ["igf1lr3","pegmgf",85,"muscle","IGF-1 LR3 (systemic) + PEG-MGF (local satellite cell activation). Both anabolic but different mechanisms."],
  // SEXUAL HEALTH
  ["gonadorelin","kisspeptin10",88,"hormonal","Both stimulate LH/FSH but upstream/downstream. Kisspeptin-10 triggers hypothalamic GnRH; Gonadorelin mimics it."],
  ["pt141","melanotan2",60,"sexual","Both hit melanocortin receptors - overlapping mechanism. Lower synergy; use one or the other for libido."],
  // TRT SUPPORT
  ["gonadorelin","ipamorelin",75,"hormonal","On TRT: Gonadorelin preserves HPTA; Ipamorelin adds GH benefits. Complementary goals, no conflict."],
  // NAD + MITO
  ["nad_peptide","motsc",85,"energy","NAD+ for sirtuins/DNA repair + MOTS-c for AMPK activation. Both are cellular energy enhancers via different pathways."],
  ["nad_peptide","ss31",82,"mito","NAD+ for DNA/sirtuin + SS-31 for mitochondrial membrane. Together address two key mitochondrial decline mechanisms."],
];

// Conflict / caution data: [pep1_id, pep2_id, severity, reason]
const CONFLICT_DB = [
  ["semaglutide","tirzepatide","avoid","Two GLP-1 agonists targeting same receptor = receptor saturation. No extra benefit; doubles GI side effects and nausea risk."],
  ["semaglutide","retatrutide","avoid","Two GLP-1 agonists. Retatrutide already includes GLP-1 agonism. No additive benefit; stacks GI side effects."],
  ["tirzepatide","retatrutide","avoid","Both are GLP-1 multi-agonists. Stacking provides no extra weight loss; significantly increases nausea, vomiting, pancreatitis risk."],
  ["liraglutide","semaglutide","avoid","Two GLP-1 agonists - different half-lives but same receptor. No benefit to stacking."],
  ["liraglutide","tirzepatide","avoid","Two GLP-1 class drugs. Same receptor competition; additive side effects only."],
  ["ghrp2","ghrp6","caution","Two GHRPs competing at same ghrelin receptor. Diminishing returns; combined cortisol/prolactin spike increases. Pick one."],
  ["ghrp6","hexarelin","caution","Two strong GHRPs. Risk of receptor desensitization and significant cortisol elevation. Pick one GHRP."],
  ["ghrp2","hexarelin","caution","Two potent GHRPs - receptor competition and stacked cortisol effects. Not recommended together."],
  ["ipamorelin","ghrp2","caution","Both are GHRPs. Ipamorelin is clean; GHRP-2 adds cortisol. Stacking means losing Ipamorelin's clean advantage."],
  ["ipamorelin","hexarelin","caution","Two GHRPs. Hexarelin's potency negates Ipamorelin's clean profile when combined."],
  ["igf1lr3","semaglutide","caution","IGF-1 LR3 can increase insulin resistance at high doses; GLP-1 agonists target insulin sensitivity. Monitor glucose closely."],
  ["igf1lr3","tirzepatide","caution","Same as IGF-1+semaglutide - opposing effects on insulin signaling. Use with glucose monitoring."],
  ["foxo4dri","follistatin344","caution","Both are very potent and poorly studied in combination. Risk of excessive cell death (FOXO4-DRI senolytic) + rapid muscle growth (Follistatin). Go slowly."],
  ["melanotan2","pt141","caution","PT-141 is derived from Melanotan II - highly overlapping mechanism (MC3R/MC4R). Redundant stacking; increased side effect risk with no extra benefit."],
  ["melanotan1","melanotan2","caution","Different selectivity but overlapping melanocortin activity. Unlikely to be beneficial together; additive pigmentation and nausea risk."],
  ["cerebrolysin","dihexa","caution","Both are potent neurogenic compounds. Limited safety data for combined use. Start one at a time; monitor closely."],
  ["ll37","thymosin_alpha1","caution","LL-37 has pro-inflammatory properties at high doses; may partially counter Thymosin α-1's immune modulation. Use lower doses when combining."],
];

// Mechanism categories for radar chart
const MECHANISMS = [
  {key:"GH-axis", label:"GH / IGF-1", color:"#3b82f6"},
  {key:"tissue-repair", label:"Healing", color:"#00d4aa"},
  {key:"gut-healing", label:"Gut", color:"#10b981"},
  {key:"neuro", label:"Cognitive", color:"#ec4899"},
  {key:"metabolic", label:"Metabolic", color:"#f59e0b"},
  {key:"immune", label:"Immune", color:"#06b6d4"},
  {key:"mito", label:"Longevity", color:"#a78bfa"},
  {key:"hormonal", label:"Hormonal", color:"#f97316"},
  {key:"anti-aging", label:"Anti-Aging", color:"#c084fc"},
  {key:"anabolic-heal", label:"Performance", color:"#6366f1"},
];

// Map peptide categories to mechanism keys
const CAT_TO_MECH = {
  "Growth Hormone":"GH-axis","Healing & Recovery":"tissue-repair","Cognitive":"neuro",
  "GLP-1 / Metabolic":"metabolic","Immune Support":"immune","Longevity":"mito",
  "Sexual Health":"hormonal","Performance":"anabolic-heal","Skin & Anti-Aging":"anti-aging",
  "Bioregulators":"mito","Hair Growth":"anti-aging","Combo Blends":"tissue-repair",
};

function StackAnalyzer({ protocol }) {
  const active = protocol.filter(p=>p.active);
  if (active.length === 0) return (
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed rgba(255,255,255,0.12)",borderRadius:16,padding:28,textAlign:"center",marginBottom:16}}>
      <div style={{fontSize:32,marginBottom:8}}>🔬</div>
      <div style={{fontWeight:700,marginBottom:6}}>Stack Analyzer</div>
      <p style={{color:"#64748b",fontSize:13}}>Add peptides to your protocol to analyze your stack's synergies, conflicts, and mechanism coverage.</p>
    </div>
  );

  // Find synergies
  const synergies = [];
  const conflicts = [];
  for (let i=0;i<active.length;i++) {
    for (let j=i+1;j<active.length;j++) {
      const a=active[i].id, b=active[j].id;
      const syn = SYNERGY_DB.find(s=>(s[0]===a&&s[1]===b)||(s[0]===b&&s[1]===a));
      if (syn) synergies.push({p1:active[i].name,p2:active[j].name,score:syn[2],mech:syn[3],note:syn[4]});
      const con = CONFLICT_DB.find(c=>(c[0]===a&&c[1]===b)||(c[0]===b&&c[1]===a));
      if (con) conflicts.push({p1:active[i].name,p2:active[j].name,severity:con[2],reason:con[3]});
    }
  }

  // Mechanism coverage radar
  const coverage = {};
  MECHANISMS.forEach(m=>coverage[m.key]=0);
  active.forEach(p=>{
    const pep = PEPTIDE_LIBRARY.find(x=>x.id===p.id);
    if (!pep) return;
    const mech = CAT_TO_MECH[pep.category];
    if (mech) coverage[mech] = Math.min(100, coverage[mech]+40);
  });
  const coverageCount = Object.values(coverage).filter(v=>v>0).length;
  const avgSynergy = synergies.length ? Math.round(synergies.reduce((s,x)=>s+x.score,0)/synergies.length) : 0;

  // Radar chart via SVG
  const cx=100,cy=100,r=70;
  const N=MECHANISMS.length;
  const radarPoints = MECHANISMS.map((m,i)=>{
    const angle=(i/N)*2*Math.PI - Math.PI/2;
    const val=(coverage[m.key]||0)/100;
    return {
      x:cx+Math.cos(angle)*r*val,
      y:cy+Math.sin(angle)*r*val,
      lx:cx+Math.cos(angle)*(r+18),
      ly:cy+Math.sin(angle)*(r+18),
      label:m.label,color:m.color,val
    };
  });
  const polyPts = radarPoints.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  // Grid circles
  const gridR=[0.25,0.5,0.75,1].map(f=>f*r);
  // Spoke endpoints
  const spokes = MECHANISMS.map((_,i)=>{
    const angle=(i/N)*2*Math.PI - Math.PI/2;
    return {x:cx+Math.cos(angle)*r, y:cy+Math.sin(angle)*r};
  });

  return (
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:22,marginBottom:16}}>
      <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>🔬 Stack Analyzer</div>

      {/* Summary scores */}
      <div className="grid-4" style={{gap:10,marginBottom:20}}>
        {[
          {label:"Peptides",val:active.length,color:"#00d4aa",icon:"⚗️"},
          {label:"Synergies Found",val:synergies.length,color:"#3b82f6",icon:"🤝"},
          {label:"Avg Synergy Score",val:synergies.length?`${avgSynergy}/100`:"-",color:"#f59e0b",icon:"⭐"},
          {label:"Mechanisms Covered",val:`${coverageCount}/${MECHANISMS.length}`,color:"#ec4899",icon:"🎯"},
        ].map(s=>(
          <div key={s.label} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:14,textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{s.icon}</div>
            <div style={{fontWeight:800,fontSize:20,color:s.color}}>{s.val}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:3}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{gap:16,marginBottom:20}}>
        {/* Radar chart */}
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:16}}>
          <div style={{fontWeight:600,fontSize:13,marginBottom:12}}>📡 Mechanism Coverage</div>
          <svg viewBox="0 0 200 200" style={{width:"100%",maxWidth:220,display:"block",margin:"0 auto"}}>
            {gridR.map((gr,i)=>(
              <circle key={i} cx={cx} cy={cy} r={gr} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            ))}
            {spokes.map((sp,i)=>(
              <line key={i} x1={cx} y1={cy} x2={sp.x} y2={sp.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            ))}
            {radarPoints.length>2&&(
              <polygon points={polyPts} fill="rgba(0,212,170,0.15)" stroke="#00d4aa" strokeWidth="1.5"/>
            )}
            {radarPoints.map((p,i)=>(
              p.val>0&&<circle key={i} cx={p.x} cy={p.y} r={3} fill={p.color}/>
            ))}
            {radarPoints.map((p,i)=>(
              <text key={i} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle"
                fontSize="7" fill={p.val>0?p.color:"#475569"}>{p.label}</text>
            ))}
          </svg>
        </div>

        {/* Conflicts */}
        <div>
          {conflicts.length>0&&(
            <div style={{marginBottom:14}}>
              <div style={{fontWeight:600,fontSize:13,color:"#f87171",marginBottom:8}}>⚠️ Conflicts & Cautions ({conflicts.length})</div>
              {conflicts.map((c,i)=>(
                <div key={i} style={{padding:"10px 12px",borderRadius:10,marginBottom:8,
                  background:c.severity==="avoid"?"rgba(239,68,68,0.08)":"rgba(245,158,11,0.08)",
                  border:`1px solid ${c.severity==="avoid"?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}`}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:14}}>{c.severity==="avoid"?"🚫":"⚠️"}</span>
                    <span style={{fontWeight:700,fontSize:12,color:c.severity==="avoid"?"#f87171":"#f59e0b"}}>{c.severity==="avoid"?"AVOID":"CAUTION"}</span>
                    <span style={{fontSize:12,color:"#e2e8f0"}}>{c.p1} + {c.p2}</span>
                  </div>
                  <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5}}>{c.reason}</div>
                </div>
              ))}
            </div>
          )}
          {conflicts.length===0&&(
            <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(0,212,170,0.06)",border:"1px solid rgba(0,212,170,0.2)",marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:"#00d4aa",marginBottom:4}}>✅ No Conflicts Detected</div>
              <div style={{fontSize:12,color:"#64748b"}}>Your active peptides appear compatible based on known interaction data.</div>
            </div>
          )}
        </div>
      </div>

      {/* Synergies */}
      {synergies.length>0&&(
        <div>
          <div style={{fontWeight:600,fontSize:13,color:"#00d4aa",marginBottom:10}}>🤝 Synergies in Your Stack</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[...synergies].sort((a,b)=>b.score-a.score).map((s,i)=>(
              <div key={i} style={{padding:"11px 14px",borderRadius:10,background:"rgba(0,212,170,0.05)",border:"1px solid rgba(0,212,170,0.15)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontWeight:700,fontSize:13}}>{s.p1} + {s.p2}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{height:5,width:80,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${s.score}%`,background:s.score>=90?"#00d4aa":s.score>=80?"#3b82f6":"#f59e0b",borderRadius:3}}/>
                    </div>
                    <span style={{fontWeight:800,fontSize:14,color:s.score>=90?"#00d4aa":s.score>=80?"#3b82f6":"#f59e0b",minWidth:32}}>{s.score}</span>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5}}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// INTERACTION CHECKER
// ============================================================
function InteractionChecker({ protocol }) {
  const [pepA, setPepA] = useState("");
  const [pepB, setPepB] = useState("");
  const active = protocol.filter(p=>p.active);

  const checkInteraction = () => {
    if (!pepA||!pepB||pepA===pepB) return null;
    const syn = SYNERGY_DB.find(s=>(s[0]===pepA&&s[1]===pepB)||(s[0]===pepB&&s[1]===pepA));
    const con = CONFLICT_DB.find(c=>(c[0]===pepA&&c[1]===pepB)||(c[0]===pepB&&c[1]===pepA));
    return {syn,con};
  };

  const result = checkInteraction();
  const pepAname = PEPTIDE_LIBRARY.find(p=>p.id===pepA)?.name||"";
  const pepBname = PEPTIDE_LIBRARY.find(p=>p.id===pepB)?.name||"";

  // Same-syringe guidance
  const SAME_SYRINGE_OK = [
    ["bpc157","tb500"],["cjc1295","ipamorelin"],["cjc1295","ghrp2"],["cjc1295","ghrp6"],
    ["sermorelin","ipamorelin"],["bpc157","ghkcu"],["bpc157","kpv"],["thymosin_alpha1","kpv"],
  ];
  const canMix = pepA&&pepB&&SAME_SYRINGE_OK.some(pair=>(pair[0]===pepA&&pair[1]===pepB)||(pair[0]===pepB&&pair[1]===pepA));

  return (
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:22,marginBottom:16}}>
      <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>🔍 Interaction Checker</div>
      <p style={{fontSize:12,color:"#64748b",marginBottom:16}}>Check any two peptides for synergy, conflicts, and whether they can share a syringe</p>

      <div className="grid-2" style={{gap:12,marginBottom:16}}>
        <div>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Peptide A</div>
          <select className="input-field" value={pepA} onChange={e=>setPepA(e.target.value)}>
            <option value="">Select peptide...</option>
            {PEPTIDE_LIBRARY.filter(p=>!p.isCombo).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Peptide B</div>
          <select className="input-field" value={pepB} onChange={e=>setPepB(e.target.value)}>
            <option value="">Select peptide...</option>
            {PEPTIDE_LIBRARY.filter(p=>!p.isCombo&&p.id!==pepA).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {pepA&&pepB&&pepA!==pepB&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {/* Same syringe */}
          <div style={{padding:"10px 14px",borderRadius:10,background:canMix?"rgba(0,212,170,0.07)":"rgba(100,116,139,0.07)",border:`1px solid ${canMix?"rgba(0,212,170,0.25)":"rgba(100,116,139,0.2)"}`}}>
            <span style={{fontWeight:700,fontSize:13,color:canMix?"#00d4aa":"#64748b"}}>
              {canMix?"✅ Can mix in same syringe":"💉 Use separate syringes"}
            </span>
            <span style={{fontSize:12,color:"#64748b",marginLeft:8}}>
              {canMix?"These peptides are stable together and commonly pre-blended.":"Draw into separate syringes for this combination."}
            </span>
          </div>

          {/* Synergy result */}
          {result?.syn?(
            <div style={{padding:"12px 14px",borderRadius:10,background:"rgba(0,212,170,0.06)",border:"1px solid rgba(0,212,170,0.2)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontWeight:700,fontSize:13,color:"#00d4aa"}}>🤝 Synergy Score: {result.syn[2]}/100</span>
                <div style={{height:6,width:100,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${result.syn[2]}%`,background:"#00d4aa",borderRadius:3}}/>
                </div>
              </div>
              <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{result.syn[4]}</div>
            </div>
          ):(
            <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
              <span style={{fontSize:13,color:"#64748b"}}>No specific synergy data for this pair - they may still be complementary if they target different mechanisms.</span>
            </div>
          )}

          {/* Conflict result */}
          {result?.con&&(
            <div style={{padding:"12px 14px",borderRadius:10,
              background:result.con[2]==="avoid"?"rgba(239,68,68,0.08)":"rgba(245,158,11,0.08)",
              border:`1px solid ${result.con[2]==="avoid"?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}`}}>
              <div style={{fontWeight:700,fontSize:13,color:result.con[2]==="avoid"?"#f87171":"#f59e0b",marginBottom:6}}>
                {result.con[2]==="avoid"?"🚫 AVOID this combination":"⚠️ Use with caution"}
              </div>
              <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{result.con[3]}</div>
            </div>
          )}

          {!result?.syn&&!result?.con&&(
            <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(0,212,170,0.04)",border:"1px solid rgba(0,212,170,0.12)"}}>
              <div style={{fontSize:12,color:"#64748b"}}>
                <strong style={{color:"#e2e8f0"}}>{pepAname}</strong> and <strong style={{color:"#e2e8f0"}}>{pepBname}</strong> have no known conflicts - and if they target different mechanisms, they may be complementary in a stack.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CUSTOM PEPTIDE BUILDER
// ============================================================
function CustomPeptideBuilder({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [pep, setPep] = useState({name:"",dose:"",unit:"mcg",route:"SubQ",notes:""});
  if (!open) return (
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed rgba(255,255,255,0.12)",borderRadius:16,padding:22,textAlign:"center"}}>
      <div style={{fontSize:30,marginBottom:8}}>🔬</div>
      <div style={{fontWeight:600,marginBottom:6}}>Custom Peptide</div>
      <p style={{color:"#64748b",fontSize:13,marginBottom:14}}>Add any peptide not in the library to your protocol</p>
      <button onClick={()=>setOpen(true)} style={{padding:"9px 20px",borderRadius:9,background:"rgba(0,212,170,0.1)",color:"#00d4aa",border:"1px solid rgba(0,212,170,0.3)",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Add Custom Peptide</button>
    </div>
  );
  return (
    <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(0,212,170,0.2)",borderRadius:16,padding:22}}>
      <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>🔬 Custom Peptide Builder</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{gridColumn:"1/-1"}}>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4,textTransform:"uppercase"}}>Peptide Name</div>
          <input className="input-field" placeholder="e.g. My Custom Peptide" value={pep.name} onChange={e=>setPep(v=>({...v,name:e.target.value}))}/>
        </div>
        <div>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4,textTransform:"uppercase"}}>Dose</div>
          <input className="input-field" placeholder="250" value={pep.dose} onChange={e=>setPep(v=>({...v,dose:e.target.value}))}/>
        </div>
        <div>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4,textTransform:"uppercase"}}>Unit</div>
          <select className="input-field" value={pep.unit} onChange={e=>setPep(v=>({...v,unit:e.target.value}))}><option>mcg</option><option>mg</option><option>IU</option><option>units</option><option>mL</option></select>
        </div>
        <div>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4,textTransform:"uppercase"}}>Route</div>
          <select className="input-field" value={pep.route} onChange={e=>setPep(v=>({...v,route:e.target.value}))}><option>SubQ</option><option>IM</option><option>Oral</option><option>Nasal</option><option>Topical</option><option>IV</option></select>
        </div>
        <div>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4,textTransform:"uppercase"}}>Notes</div>
          <input className="input-field" placeholder="Vendor, protocol, notes..." value={pep.notes} onChange={e=>setPep(v=>({...v,notes:e.target.value}))}/>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:14}}>
        <button onClick={()=>setOpen(false)} style={{flex:1,padding:"9px 0",borderRadius:9,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#94a3b8",cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        <button onClick={()=>{if(!pep.name){alert("Enter a name");return;}onAdd(pep);setOpen(false);setPep({name:"",dose:"",unit:"mcg",route:"SubQ",notes:""}); }} className="btn-primary" style={{flex:2}}>Add to Protocol ✓</button>
      </div>
    </div>
  );
}

// ============================================================
// STAT / BODY MEASUREMENT MODAL
// ============================================================
function AddStatModal({ onSave, onClose, date }) {
  const [s, setS] = useState({weight:"",bf:"",waist:"",hips:"",chest:"",arm:"",thigh:"",energy:3,notes:""});
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18}}>📏 Log Measurements - {date}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{l:"Weight (lbs)",k:"weight"},{l:"Body Fat %",k:"bf"},{l:"Waist (in)",k:"waist"},{l:"Hips (in)",k:"hips"},{l:"Chest (in)",k:"chest"},{l:"Arm / Bicep (in)",k:"arm"},{l:"Thigh (in)",k:"thigh"}].map(f=>(
            <div key={f.k}>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>{f.l}</div>
              <input className="input-field" type="number" step="0.1" value={s[f.k]} onChange={e=>setS(v=>({...v,[f.k]:e.target.value}))}/>
            </div>
          ))}
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>Energy Level</div>
            <div style={{display:"flex",gap:6}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setS(v=>({...v,energy:n}))} style={{fontSize:20,cursor:"pointer",background:"none",border:"none",opacity:s.energy>=n?1:0.25}}>⚡</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{marginTop:12}}>
          <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Notes</div>
          <input className="input-field" placeholder="How are you feeling? Any changes noticed?" value={s.notes} onChange={e=>setS(v=>({...v,notes:e.target.value}))}/>
        </div>
        <button className="btn-primary" style={{width:"100%",marginTop:18,padding:"12px 0",fontSize:15}} onClick={()=>{if(!s.weight&&!s.waist&&!s.bf){alert("Enter at least one measurement");return;}onSave({...s,date});}}>Save Measurements</button>
      </div>
    </div>
  );
}

// ============================================================
// VIAL MODAL
// ============================================================
function AddVialModal({ peptideList, onSave, onClose }) {
  const [v, setV] = useState({pepName:"",vialMg:"",waterMl:"",doseMcg:"",reconDate:new Date().toISOString().slice(0,10),daysStable:28,vendor:"",batchNum:"",dosesUsed:0,notes:""});
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18}}>🧪 Add Vial to Inventory</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Peptide</div>
            <select className="input-field" value={v.pepName} onChange={e=>setV(x=>({...x,pepName:e.target.value}))}>
              <option value="">Select peptide...</option>
              {peptideList.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
              <option value="Custom">Custom / Not Listed</option>
            </select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{l:"Vial Size (mg)",k:"vialMg",t:"number"},{l:"BAC Water Added (mL)",k:"waterMl",t:"number"},{l:"Per-Dose Target (mcg)",k:"doseMcg",t:"number"},{l:"Days Stable (default 28)",k:"daysStable",t:"number"},{l:"Vendor",k:"vendor",t:"text"},{l:"Batch Number",k:"batchNum",t:"text"}].map(f=>(
              <div key={f.k}>
                <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>{f.l}</div>
                <input className="input-field" type={f.t} value={v[f.k]} onChange={e=>setV(x=>({...x,[f.k]:e.target.value}))}/>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Reconstitution Date</div>
            <input type="date" className="input-field" value={v.reconDate} onChange={e=>setV(x=>({...x,reconDate:e.target.value}))}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Notes</div>
            <input className="input-field" placeholder="Storage notes, source, etc..." value={v.notes} onChange={e=>setV(x=>({...x,notes:e.target.value}))}/>
          </div>
        </div>
        <button className="btn-primary" style={{width:"100%",marginTop:18,padding:"12px 0",fontSize:15}} onClick={()=>{if(!v.pepName){alert("Select a peptide");return;}onSave(v);}}>Add Vial</button>
      </div>
    </div>
  );
}

// ============================================================
// JOURNAL ENTRY MODAL
// ============================================================
function JournalEntryModal({ protocol, onSave, onClose, date }) {
  const [j, setJ] = useState({title:"",week:"",body:"",energy:3,rating:0,sideEffects:"",improvements:"",peptides:[]});
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18}}>📓 New Journal Entry - {date}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"3fr 1fr",gap:10}}>
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Title</div>
              <input className="input-field" placeholder="e.g. Week 4 - knee pain much better" value={j.title} onChange={e=>setJ(v=>({...v,title:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Week #</div>
              <input className="input-field" type="number" value={j.week} onChange={e=>setJ(v=>({...v,week:e.target.value}))}/>
            </div>
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>Active Peptides This Entry</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {protocol.map(p=>(
                <button key={p.id} onClick={()=>setJ(v=>({...v,peptides:v.peptides.includes(p.name)?v.peptides.filter(x=>x!==p.name):[...v.peptides,p.name]}))} style={{padding:"5px 10px",borderRadius:8,fontSize:11,cursor:"pointer",background:j.peptides.includes(p.name)?"rgba(0,212,170,0.2)":"rgba(255,255,255,0.06)",border:`1px solid ${j.peptides.includes(p.name)?"rgba(0,212,170,0.4)":"rgba(255,255,255,0.1)"}`,color:j.peptides.includes(p.name)?"#00d4aa":"#94a3b8",fontFamily:"inherit"}}>{p.name}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Entry</div>
            <textarea className="input-field" style={{minHeight:100,resize:"vertical",lineHeight:1.6}} placeholder="How are you feeling? What changes have you noticed? Sleep, energy, pain levels, recovery..." value={j.body} onChange={e=>setJ(v=>({...v,body:e.target.value}))}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Side Effects</div>
              <input className="input-field" placeholder="None, or describe..." value={j.sideEffects} onChange={e=>setJ(v=>({...v,sideEffects:e.target.value}))}/>
            </div>
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:5,textTransform:"uppercase"}}>Improvements Noticed</div>
              <input className="input-field" placeholder="Pain ↓, energy ↑, sleep better..." value={j.improvements} onChange={e=>setJ(v=>({...v,improvements:e.target.value}))}/>
            </div>
          </div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>Energy</div>
              <div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setJ(v=>({...v,energy:n}))} style={{fontSize:18,cursor:"pointer",background:"none",border:"none",opacity:j.energy>=n?1:0.2}}>⚡</button>)}</div>
            </div>
            <div>
              <div style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>Overall Rating</div>
              <div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setJ(v=>({...v,rating:v.rating===n?0:n}))} style={{fontSize:18,cursor:"pointer",background:"none",border:"none",color:j.rating>=n?"#f59e0b":"#2a3a5c"}}>★</button>)}</div>
            </div>
          </div>
        </div>
        <button className="btn-primary" style={{width:"100%",marginTop:18,padding:"12px 0",fontSize:15}} onClick={()=>{if(!j.body){alert("Write something first");return;}onSave({...j,date});}}>Save Entry</button>
      </div>
    </div>
  );
}

// ============================================================
// ADD PEPTIDE MODAL
// ============================================================
function AddPeptideModal({ protocol, onAdd, onClose, selectedDate }) {
  const [step, setStep] = useState("select");
  const [selected, setSelected] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [config, setConfig] = useState({
    dose: "", unit: "mcg", route: "", days: ["Mon","Wed","Fri"],
    startDate: selectedDate, notes: "", vialMg: "", waterMl: ""
  });

  const inProtocolIds = protocol.map(p => p.id);

  const filtered = PEPTIDE_LIBRARY.filter(p => {
    const catMatch = filterCat === "All" || p.category === filterCat;
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.benefits.some(b => b.toLowerCase().includes(search.toLowerCase()));
    return catMatch && searchMatch;
  });

  const selectPeptide = (pep) => {
    if (inProtocolIds.includes(pep.id)) return;
    setSelected(pep);
    const doseStr = pep.commonDose.split("-")[0].replace(/[^\d.]/g,"");
    setConfig({
      dose: doseStr,
      unit: pep.commonDose.toLowerCase().includes("mg") ? "mg" : "mcg",
      route: pep.adminRoute[0],
      days: ["Mon","Wed","Fri"],
      startDate: selectedDate,
      notes: "",
      vialMg: "", waterMl: ""
    });
    setStep("configure");
  };

  const toggleDay = (day) => {
    setConfig(c => ({
      ...c,
      days: c.days.includes(day) ? c.days.filter(d => d !== day) : [...c.days, day]
    }));
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="page-header" style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:20}}>
            {step === "select" ? "Add Peptide to Protocol" : `Configure ${selected?.name}`}
          </h2>
          <button onClick={onClose} style={{background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer"}}>✕</button>
        </div>

        {step === "select" ? (
          <>
            <input className="input-field" placeholder="🔍 Search peptides..."
              value={search} onChange={e => setSearch(e.target.value)} style={{marginBottom:12}} />
            <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:16}}>
              {["All", ...CATEGORIES].map(cat => (
                <button key={cat} className="pill-btn"
                  onClick={() => setFilterCat(cat)}
                  style={{
                    background: filterCat===cat ? "rgba(0,212,170,0.2)" : "rgba(255,255,255,0.06)",
                    color: filterCat===cat ? "#00d4aa" : "#64748b", fontSize:11
                  }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:8, maxHeight:360, overflowY:"auto"}}>
              {filtered.map(pep => {
                const inProtocol = inProtocolIds.includes(pep.id);
                return (
                  <div key={pep.id} onClick={() => selectPeptide(pep)}
                    style={{
                      display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                      borderRadius:10, cursor: inProtocol ? "not-allowed" : "pointer",
                      background: inProtocol ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                      border:"1px solid rgba(255,255,255,0.07)",
                      opacity: inProtocol ? 0.5 : 1,
                      transition:"all 0.15s"
                    }}
                    className={inProtocol ? "" : "card-hover"}>
                    <span style={{fontSize:22}}>{pep.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600, fontSize:14}}>{pep.name}</div>
                      <div style={{fontSize:11, color:"#64748b"}}>{pep.category} • {pep.commonDose}</div>
                    </div>
                    {inProtocol ? (
                      <span style={{fontSize:11, color:"#475569"}}>✓ Added</span>
                    ) : (
                      <span style={{fontSize:18, color:"#00d4aa"}}>+</span>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div style={{
              display:"flex", gap:12, alignItems:"center", padding:"14px 16px",
              borderRadius:12, background:`${selected.color}12`,
              border:`1px solid ${selected.color}30`, marginBottom:20
            }}>
              <span style={{fontSize:28}}>{selected.emoji}</span>
              <div>
                <div style={{fontWeight:700}}>{selected.name}</div>
                <div style={{fontSize:12, color:"#64748b"}}>{selected.aka} • {selected.category}</div>
                <div style={{fontSize:12, color:"#94a3b8", marginTop:4}}>📌 {selected.notes}</div>
              </div>
            </div>

            <div style={{display:"flex", flexDirection:"column", gap:14}}>
              <div className="grid-2">
                <div>
                  <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Dose</label>
                  <input className="input-field" type="text" value={config.dose}
                    onChange={e => setConfig({...config, dose:e.target.value})}
                    placeholder={selected.commonDose} />
                </div>
                <div>
                  <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Unit</label>
                  <select className="input-field" value={config.unit} onChange={e => setConfig({...config, unit:e.target.value})}>
                    <option>mcg</option><option>mg</option><option>IU</option><option>units</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Administration Route</label>
                <select className="input-field" value={config.route} onChange={e => setConfig({...config, route:e.target.value})}>
                  {selected.adminRoute.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:8, textTransform:"uppercase"}}>Dosing Days</label>
                <div style={{display:"flex", gap:6}}>
                  {DAYS_OF_WEEK.map(day => (
                    <button key={day} className={`day-btn ${config.days.includes(day)?"on":""}`}
                      onClick={() => toggleDay(day)}>
                      {day.slice(0,1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Vial (mg) - for calc</label>
                  <input className="input-field" type="number" placeholder="e.g. 5"
                    value={config.vialMg} onChange={e => setConfig({...config, vialMg:e.target.value})} />
                </div>
                <div>
                  <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>BAC Water (mL)</label>
                  <input className="input-field" type="number" placeholder="e.g. 2"
                    value={config.waterMl} onChange={e => setConfig({...config, waterMl:e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Start Date</label>
                <input type="date" className="input-field" value={config.startDate}
                  onChange={e => setConfig({...config, startDate:e.target.value})} />
              </div>
              <div>
                <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Notes</label>
                <input className="input-field" placeholder="Protocol notes, source, batch number..."
                  value={config.notes} onChange={e => setConfig({...config, notes:e.target.value})} />
              </div>
            </div>

            <div style={{display:"flex", gap:10, marginTop:20}}>
              <button onClick={() => setStep("select")} style={{
                flex:1, padding:"11px 0", borderRadius:10,
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                color:"#94a3b8", cursor:"pointer", fontFamily:"inherit", fontWeight:600
              }}>← Back</button>
              <button className="btn-primary" style={{flex:2}}
                onClick={() => onAdd(selected.id, config)}>
                Add to Protocol ✓
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// LOG DOSE MODAL
// ============================================================
function LogDoseModal({ peptide, pepData, onLog, onClose, existingLog }) {
  const SITES = ["Left Abdomen","Right Abdomen","Left Thigh","Right Thigh","Left Deltoid","Right Deltoid","Left Glute","Right Glute","Other"];
  const [data, setData] = useState({
    taken: true,
    actualDose: existingLog?.actualDose || peptide.dose,
    siteUsed: existingLog?.siteUsed || "",
    notes: existingLog?.notes || "",
    mood: existingLog?.mood || "",
    sideEffects: existingLog?.sideEffects || "",
    rating: existingLog?.rating || 0,
  });

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
          <h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:20}}>
            {pepData?.emoji} Log {peptide.name}
          </h2>
          <button onClick={onClose} style={{background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer"}}>✕</button>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <div className="grid-2">
            <div>
              <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Actual Dose</label>
              <div style={{display:"flex", gap:6, alignItems:"center"}}>
                <input className="input-field" value={data.actualDose}
                  onChange={e => setData({...data, actualDose:e.target.value})} />
                <span style={{color:"#64748b", fontSize:13, whiteSpace:"nowrap"}}>{peptide.unit}</span>
              </div>
            </div>
            <div>
              <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Injection Site</label>
              <select className="input-field" value={data.siteUsed}
                onChange={e => setData({...data, siteUsed:e.target.value})}>
                <option value="">Select site...</option>
                {SITES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>How do you feel? (optional)</label>
            <div style={{display:"flex", gap:8}}>
              {["😴 Tired", "😐 Neutral", "😊 Good", "🚀 Great", "⚡ Energy"].map(mood => (
                <button key={mood} onClick={() => setData({...data, mood: data.mood===mood ? "" : mood})}
                  style={{
                    padding:"6px 10px", borderRadius:8, fontSize:12, cursor:"pointer",
                    background: data.mood===mood ? "rgba(0,212,170,0.2)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${data.mood===mood ? "rgba(0,212,170,0.4)" : "rgba(255,255,255,0.1)"}`,
                    color: data.mood===mood ? "#00d4aa" : "#94a3b8",
                    fontFamily:"inherit"
                  }}>{mood}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Side Effects / Reactions</label>
            <input className="input-field" placeholder="None, or describe any reactions..."
              value={data.sideEffects} onChange={e => setData({...data, sideEffects:e.target.value})} />
          </div>

          <div>
            <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase"}}>Notes</label>
            <input className="input-field" placeholder="Timing, observations, protocol notes..."
              value={data.notes} onChange={e => setData({...data, notes:e.target.value})} />
          </div>

          <div>
            <label style={{fontSize:11, color:"#64748b", fontWeight:600, display:"block", marginBottom:8, textTransform:"uppercase"}}>Effectiveness Rating</label>
            <div style={{display:"flex", gap:6}}>
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setData({...data, rating: data.rating===star ? 0 : star})}
                  style={{
                    fontSize:22, cursor:"pointer", background:"none", border:"none",
                    color: data.rating >= star ? "#f59e0b" : "#2a3a5c",
                    transition:"all 0.15s"
                  }}>★</button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn-primary" style={{width:"100%", marginTop:20, padding:"13px 0", fontSize:16}}
          onClick={() => onLog(peptide.id, {...data, taken:true})}>
          ✓ Log Dose
        </button>

        <p style={{fontSize:11, color:"#475569", textAlign:"center", marginTop:10}}>
          ⚠️ For research purposes only. Always consult a qualified healthcare provider.
        </p>
      </div>
    </div>
  );
}

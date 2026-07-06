/* Supplement starter library — organization & tracking only.
   No cure claims, no combination advice; the app records the
   user's own label/provider instructions and personal notes. */

export const SUPPLEMENT_CATEGORIES = [
  "Vitamins", "Minerals", "Amino acids", "Adaptogens", "Nootropics", "Longevity",
  "Mitochondrial support", "Gut health", "Detox & liver", "Sleep", "Stress",
  "Hormone support", "Beauty · skin · hair", "Fitness & recovery", "Immune",
  "Women's wellness", "Men's wellness", "Electrolytes", "Protein", "Greens powders",
  "Reds powders", "Collagen", "Probiotics", "Specialty formulas", "Custom",
] as const;

export interface SupplementLibraryEntry {
  name: string;
  category: (typeof SUPPLEMENT_CATEGORIES)[number];
  commonForms: string;
  typicalTiming: string; // convention people follow — always defer to label/provider
}

export const SUPPLEMENT_LIBRARY: SupplementLibraryEntry[] = [
  // Vitamins
  { name: "Vitamin D3", category: "Vitamins", commonForms: "Softgel · drops", typicalTiming: "Morning, per label" },
  { name: "Vitamin C", category: "Vitamins", commonForms: "Capsule · powder · liposomal", typicalTiming: "Any, per label" },
  { name: "Vitamin A", category: "Vitamins", commonForms: "Softgel", typicalTiming: "Per label" },
  { name: "Vitamin E", category: "Vitamins", commonForms: "Softgel", typicalTiming: "Per label" },
  { name: "Vitamin K2 (MK-7)", category: "Vitamins", commonForms: "Softgel · drops", typicalTiming: "Per label" },
  { name: "B Complex", category: "Vitamins", commonForms: "Capsule", typicalTiming: "Morning, per label" },
  { name: "Vitamin B12 (Methylcobalamin)", category: "Vitamins", commonForms: "Lozenge · liquid", typicalTiming: "Morning, per label" },
  { name: "Folate (5-MTHF)", category: "Vitamins", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Biotin", category: "Vitamins", commonForms: "Capsule · gummy", typicalTiming: "Per label" },
  // Minerals
  { name: "Magnesium Glycinate", category: "Minerals", commonForms: "Capsule · powder", typicalTiming: "Evening, per label" },
  { name: "Magnesium Citrate", category: "Minerals", commonForms: "Capsule · powder", typicalTiming: "Per label" },
  { name: "Zinc", category: "Minerals", commonForms: "Capsule · lozenge", typicalTiming: "Per label" },
  { name: "Selenium", category: "Minerals", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Iodine", category: "Minerals", commonForms: "Drops · capsule", typicalTiming: "Per provider" },
  { name: "Iron (Bisglycinate)", category: "Minerals", commonForms: "Capsule", typicalTiming: "Per provider" },
  { name: "Calcium", category: "Minerals", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Potassium", category: "Minerals", commonForms: "Capsule · powder", typicalTiming: "Per label" },
  { name: "Copper", category: "Minerals", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Boron", category: "Minerals", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Chromium", category: "Minerals", commonForms: "Capsule", typicalTiming: "Per label" },
  // Detox & liver
  { name: "NAC (N-Acetyl Cysteine)", category: "Detox & liver", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "TUDCA", category: "Detox & liver", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Milk Thistle", category: "Detox & liver", commonForms: "Capsule · tincture", typicalTiming: "Per label" },
  { name: "Glutathione (Liposomal)", category: "Detox & liver", commonForms: "Liquid · capsule", typicalTiming: "Per label" },
  // Amino acids
  { name: "Glycine", category: "Amino acids", commonForms: "Powder · capsule", typicalTiming: "Evening, per label" },
  { name: "Taurine", category: "Amino acids", commonForms: "Powder · capsule", typicalTiming: "Per label" },
  { name: "Creatine Monohydrate", category: "Fitness & recovery", commonForms: "Powder", typicalTiming: "Daily, per label" },
  { name: "L-Glutamine", category: "Gut health", commonForms: "Powder", typicalTiming: "Per label" },
  { name: "Acetyl-L-Carnitine", category: "Amino acids", commonForms: "Capsule", typicalTiming: "Morning, per label" },
  { name: "L-Carnitine", category: "Amino acids", commonForms: "Capsule · liquid", typicalTiming: "Per label" },
  // Beauty
  { name: "Collagen Peptides", category: "Collagen", commonForms: "Powder", typicalTiming: "Any, per label" },
  { name: "Hyaluronic Acid", category: "Beauty · skin · hair", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "MSM", category: "Beauty · skin · hair", commonForms: "Powder · capsule", typicalTiming: "Per label" },
  { name: "Silica (Bamboo)", category: "Beauty · skin · hair", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Astaxanthin", category: "Beauty · skin · hair", commonForms: "Softgel", typicalTiming: "With a meal, per label" },
  // Omegas
  { name: "Omega-3 (EPA/DHA)", category: "Longevity", commonForms: "Softgel · liquid", typicalTiming: "With a meal, per label" },
  { name: "Fish Oil", category: "Longevity", commonForms: "Softgel", typicalTiming: "With a meal, per label" },
  { name: "Krill Oil", category: "Longevity", commonForms: "Softgel", typicalTiming: "With a meal, per label" },
  { name: "Flaxseed Oil", category: "Longevity", commonForms: "Softgel · liquid", typicalTiming: "Per label" },
  // Mitochondria & longevity
  { name: "CoQ10 (Ubiquinol)", category: "Mitochondrial support", commonForms: "Softgel", typicalTiming: "With a meal, per label" },
  { name: "PQQ", category: "Mitochondrial support", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "NMN", category: "Longevity", commonForms: "Capsule · powder", typicalTiming: "Morning, per label" },
  { name: "NR (Nicotinamide Riboside)", category: "Longevity", commonForms: "Capsule", typicalTiming: "Morning, per label" },
  { name: "Resveratrol", category: "Longevity", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Quercetin", category: "Longevity", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Fisetin", category: "Longevity", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Spermidine", category: "Longevity", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Alpha Lipoic Acid", category: "Mitochondrial support", commonForms: "Capsule", typicalTiming: "Per label" },
  // Gut
  { name: "Probiotic (Multi-strain)", category: "Probiotics", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Prebiotic Fiber", category: "Gut health", commonForms: "Powder", typicalTiming: "Per label" },
  { name: "Digestive Enzymes", category: "Gut health", commonForms: "Capsule", typicalTiming: "With meals, per label" },
  { name: "Betaine HCl", category: "Gut health", commonForms: "Capsule", typicalTiming: "Per provider" },
  { name: "Colostrum", category: "Gut health", commonForms: "Powder · capsule", typicalTiming: "Per label" },
  { name: "Butyrate", category: "Gut health", commonForms: "Capsule", typicalTiming: "Per label" },
  // Sleep & stress
  { name: "Melatonin", category: "Sleep", commonForms: "Tablet · gummy", typicalTiming: "Bedtime, per label" },
  { name: "L-Theanine", category: "Stress", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "GABA", category: "Sleep", commonForms: "Capsule · powder", typicalTiming: "Evening, per label" },
  { name: "Apigenin", category: "Sleep", commonForms: "Capsule", typicalTiming: "Evening, per label" },
  { name: "Valerian Root", category: "Sleep", commonForms: "Capsule · tea", typicalTiming: "Evening, per label" },
  // Adaptogens
  { name: "Ashwagandha", category: "Adaptogens", commonForms: "Capsule · powder", typicalTiming: "Per label" },
  { name: "Rhodiola Rosea", category: "Adaptogens", commonForms: "Capsule", typicalTiming: "Morning, per label" },
  { name: "Holy Basil (Tulsi)", category: "Adaptogens", commonForms: "Capsule · tea", typicalTiming: "Per label" },
  { name: "Reishi", category: "Adaptogens", commonForms: "Powder · capsule", typicalTiming: "Evening, per label" },
  { name: "Cordyceps", category: "Adaptogens", commonForms: "Powder · capsule", typicalTiming: "Morning, per label" },
  { name: "Lion's Mane", category: "Nootropics", commonForms: "Powder · capsule", typicalTiming: "Morning, per label" },
  { name: "Bacopa Monnieri", category: "Nootropics", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Phosphatidylserine", category: "Nootropics", commonForms: "Softgel", typicalTiming: "Per label" },
  // Hormone & women's wellness
  { name: "DIM", category: "Hormone support", commonForms: "Capsule", typicalTiming: "Per provider" },
  { name: "Myo-Inositol", category: "Hormone support", commonForms: "Powder", typicalTiming: "Per label" },
  { name: "Chasteberry (Vitex)", category: "Women's wellness", commonForms: "Capsule", typicalTiming: "Per label" },
  { name: "Maca Root", category: "Women's wellness", commonForms: "Powder · capsule", typicalTiming: "Per label" },
  { name: "Evening Primrose Oil", category: "Women's wellness", commonForms: "Softgel", typicalTiming: "Per label" },
  { name: "Prenatal Multi", category: "Women's wellness", commonForms: "Capsule", typicalTiming: "Per label" },
  // Men's
  { name: "Saw Palmetto", category: "Men's wellness", commonForms: "Softgel", typicalTiming: "Per label" },
  { name: "Tongkat Ali", category: "Men's wellness", commonForms: "Capsule", typicalTiming: "Per label" },
  // Performance & daily
  { name: "Electrolytes", category: "Electrolytes", commonForms: "Powder · packets", typicalTiming: "Morning / training" },
  { name: "Protein Powder", category: "Protein", commonForms: "Powder", typicalTiming: "Per goal" },
  { name: "EAAs", category: "Fitness & recovery", commonForms: "Powder", typicalTiming: "Training days" },
  { name: "BCAAs", category: "Fitness & recovery", commonForms: "Powder", typicalTiming: "Training days" },
  { name: "Beta-Alanine", category: "Fitness & recovery", commonForms: "Powder", typicalTiming: "Pre-training, per label" },
  // Immune
  { name: "Elderberry", category: "Immune", commonForms: "Syrup · gummy", typicalTiming: "Per label" },
  { name: "Echinacea", category: "Immune", commonForms: "Capsule · tincture", typicalTiming: "Per label" },
  // Powders
  { name: "Greens Powder", category: "Greens powders", commonForms: "Powder", typicalTiming: "Morning" },
  { name: "Reds Powder", category: "Reds powders", commonForms: "Powder", typicalTiming: "Morning" },
];

/* Seed brand list — a starting point, not a catalog of the world.
   Users add unlimited custom brands; barcode scan + CSV import cover the rest. */
export const BRAND_SEEDS = [
  "Thorne", "Pure Encapsulations", "Life Extension", "NOW Foods", "Designs for Health",
  "Metagenics", "Integrative Therapeutics", "Seeking Health", "Nordic Naturals", "Jarrow Formulas",
  "Solgar", "Garden of Life", "MaryRuth's", "Ancient Nutrition", "Vital Proteins", "Needed",
  "Ritual", "AG1", "Cymbiotika", "Momentous", "Onnit", "Transparent Labs", "Trace Minerals",
  "LMNT", "Ultima Replenisher", "Organifi", "Moon Juice", "Primal Queen", "Ancestral Supplements",
  "Heart & Soil", "Seed", "Pendulum", "MegaFood", "Nature Made", "Nature's Bounty",
  "Sports Research", "Gaia Herbs", "Herb Pharm", "Nutrafol", "Nutrafol Women", "Nutrafol Men",
  "Viviscal", "HUM Nutrition", "Olly", "SmartyPants", "Codeage", "Double Wood", "BulkSupplements",
];

export const STACK_TIMES = [
  { key: "morning", label: "Morning Stack", icon: "sunrise" },
  { key: "afternoon", label: "Afternoon Stack", icon: "sun" },
  { key: "evening", label: "Evening Stack", icon: "sunset" },
  { key: "bedtime", label: "Bedtime Stack", icon: "moon" },
] as const;

/* Shared reference data: hormone therapies, symptoms, biohacking tools,
   wearables, lab panels, lifestyle trackers. */

export const HORMONE_OPTIONS = [
  "Estradiol (Estrogen)", "Progesterone", "Testosterone", "DHEA", "Pregnenolone",
  "Thyroid (Levothyroxine)", "Thyroid (NP / Armour)", "Vaginal Estrogen", "Custom",
];

export const HORMONE_FORMS = [
  "Cream", "Gel", "Patch", "Pill", "Pellet", "Injection", "Troche", "Vaginal", "Other",
] as const;

export const MENO_SYMPTOMS = [
  { key: "hotFlashes", label: "Hot flashes" },
  { key: "nightSweats", label: "Night sweats" },
  { key: "brainFog", label: "Brain fog" },
  { key: "moodSwings", label: "Mood swings" },
  { key: "anxiety", label: "Anxiety" },
  { key: "irritability", label: "Irritability" },
  { key: "libido", label: "Low libido" },
  { key: "sleepChanges", label: "Sleep changes" },
  { key: "weightChanges", label: "Weight changes" },
  { key: "bellyFat", label: "Belly fat" },
  { key: "hairShedding", label: "Hair shedding" },
  { key: "skinDryness", label: "Skin dryness" },
  { key: "jointPain", label: "Joint pain" },
  { key: "breastTenderness", label: "Breast tenderness" },
  { key: "bloating", label: "Bloating" },
  { key: "spotting", label: "Spotting" },
  { key: "periodChanges", label: "Period changes" },
  { key: "vaginalDryness", label: "Vaginal dryness" },
  { key: "headaches", label: "Headaches" },
  { key: "fatigue", label: "Fatigue" },
];

export const SEVERITY_LABELS = ["None", "Mild", "Moderate", "Strong", "Intense"];

export interface BiohackingTool {
  key: string;
  label: string;
  hint: string; // what to jot down
}

export const BIOHACKING_TOOLS: BiohackingTool[] = [
  { key: "red-light", label: "Red Light Therapy", hint: "Device, area, minutes" },
  { key: "cold-plunge", label: "Cold Plunge", hint: "Temp, minutes, breath" },
  { key: "sauna", label: "Sauna", hint: "Type, temp, minutes" },
  { key: "hrv", label: "HRV Tracking", hint: "Morning reading" },
  { key: "sleep", label: "Sleep Tracking", hint: "Hours, quality" },
  { key: "cgm", label: "CGM / Glucose", hint: "Reading, meal context" },
  { key: "wearable", label: "Wearable Check-in", hint: "Readiness, recovery" },
  { key: "smart-scale", label: "Smart Scale", hint: "Weight, body comp" },
  { key: "blood-pressure", label: "Blood Pressure", hint: "Systolic / diastolic" },
  { key: "vo2", label: "VO2 Max Session", hint: "Test or estimate" },
  { key: "strength", label: "Strength Training", hint: "Focus, sets" },
  { key: "zone2", label: "Zone 2 Cardio", hint: "Minutes, activity" },
  { key: "breathwork", label: "Breathwork", hint: "Style, minutes" },
  { key: "meditation", label: "Meditation", hint: "Minutes, style" },
  { key: "grounding", label: "Grounding", hint: "Minutes outside" },
  { key: "sunlight", label: "Morning Sunlight", hint: "Minutes before 10am" },
  { key: "blue-light", label: "Blue Light Blocking", hint: "Evening glasses on" },
  { key: "vibration", label: "Vibration Plate", hint: "Minutes, setting" },
  { key: "compression", label: "Compression Boots", hint: "Minutes, level" },
  { key: "lymphatic", label: "Lymphatic Drainage", hint: "Method, minutes" },
  { key: "massage-gun", label: "Massage Gun", hint: "Area, minutes" },
  { key: "pemf", label: "PEMF", hint: "Program, minutes" },
  { key: "ems", label: "EMS", hint: "Area, program" },
  { key: "hbot", label: "Hyperbaric Oxygen", hint: "Pressure, minutes" },
  { key: "iv", label: "IV Therapy", hint: "Blend, clinic" },
  { key: "nad", label: "NAD+ Session", hint: "Route, clinic notes" },
  { key: "facial-device", label: "Facial Device", hint: "Device, program" },
  { key: "skin-device", label: "Skin Device", hint: "Device, area" },
  { key: "hair-device", label: "Hair Growth Device", hint: "Device, minutes" },
  { key: "custom", label: "Custom Tool", hint: "Your own ritual" },
];

export const WEARABLE_BRANDS = [
  "Oura", "WHOOP", "Apple Watch", "Garmin", "Fitbit", "Ultrahuman",
  "Eight Sleep", "Dexcom", "FreeStyle Libre", "Withings", "Custom",
];

export const LAB_PANELS = [
  "CBC", "CMP", "Thyroid", "Hormones", "Lipids", "Glucose & Insulin",
  "Inflammation", "Iron & Ferritin", "Vitamins & Minerals", "Kidney & Liver",
  "Autoimmune", "Custom",
];

export interface LifestyleTracker {
  key: string;
  label: string;
  tagline: string;
  fields: { key: string; label: string; placeholder: string; multiline?: boolean; full?: boolean }[];
}

export const LIFESTYLE_TRACKERS: LifestyleTracker[] = [
  {
    key: "nutrition", label: "Nutrition", tagline: "Nourishment, not restriction",
    fields: [
      { key: "protein", label: "Protein", placeholder: "e.g. 110 g" },
      { key: "water", label: "Water", placeholder: "e.g. 80 oz" },
      { key: "fiber", label: "Fiber", placeholder: "e.g. 28 g" },
      { key: "meals", label: "Meals & timing", placeholder: "e.g. 3 meals, kitchen closed 7pm" },
    ],
  },
  {
    key: "body", label: "Body & Measurements", tagline: "Data with kindness",
    fields: [
      { key: "weight", label: "Weight", placeholder: "your unit, your business" },
      { key: "waist", label: "Waist", placeholder: "inches / cm" },
      { key: "hips", label: "Hips", placeholder: "inches / cm" },
      { key: "photos", label: "Progress photo taken?", placeholder: "yes / no / angle" },
    ],
  },
  {
    key: "fitness", label: "Fitness", tagline: "Strong is a practice",
    fields: [
      { key: "workout", label: "Workout", placeholder: "e.g. lower body strength" },
      { key: "duration", label: "Duration", placeholder: "e.g. 45 min" },
      { key: "steps", label: "Steps", placeholder: "e.g. 9,500" },
      { key: "recovery", label: "Recovery feel", placeholder: "how the body feels" },
    ],
  },
  {
    key: "sleep", label: "Sleep", tagline: "The original biohack",
    fields: [
      { key: "bedtime", label: "Bedtime", placeholder: "e.g. 10:15 pm" },
      { key: "wake", label: "Wake time", placeholder: "e.g. 6:30 am" },
      { key: "hours", label: "Hours", placeholder: "e.g. 7.8" },
      { key: "winddown", label: "Wind-down ritual", placeholder: "what you did" },
    ],
  },
  {
    key: "beauty", label: "Beauty & Skin", tagline: "Glow is cumulative",
    fields: [
      { key: "am", label: "AM routine", placeholder: "cleanser, SPF…" },
      { key: "pm", label: "PM routine", placeholder: "retinoid night?" },
      { key: "treatments", label: "Treatments", placeholder: "mask, gua sha, device" },
      { key: "skinNote", label: "Skin today", placeholder: "calm, glowy, reactive…" },
    ],
  },
  {
    key: "dental", label: "Dental & Oral", tagline: "Oral health is whole-body health",
    fields: [
      { key: "routine", label: "Routine", placeholder: "brush, floss, tongue scrape" },
      { key: "oilPull", label: "Oil pulling / rinse", placeholder: "minutes / product" },
      { key: "appliance", label: "Night guard / aligners", placeholder: "worn?" },
      { key: "note", label: "Notes", placeholder: "sensitivity, checkup due…" },
    ],
  },
  {
    key: "hair", label: "Hair", tagline: "Patience + consistency",
    fields: [
      { key: "wash", label: "Wash day?", placeholder: "products used" },
      { key: "treatment", label: "Treatment", placeholder: "oil, mask, serum" },
      { key: "device", label: "Device", placeholder: "red light cap, derma stamp" },
      { key: "shedNote", label: "Shedding note", placeholder: "more / less / same" },
    ],
  },
  {
    key: "mindset", label: "Mindset & Meditation", tagline: "The inner protocol",
    fields: [
      // — Meditation (premium) —
      { key: "medMinutes", label: "Meditation · minutes", placeholder: "e.g. 12 min" },
      { key: "medStyle", label: "Meditation · style", placeholder: "guided · breath · body scan · loving-kindness · mantra · walking" },
      { key: "medGuide", label: "Guide / app / teacher", placeholder: "Calm · Headspace · Insight Timer · unguided" },
      { key: "medTime", label: "Time of day", placeholder: "e.g. 6:30 am, before coffee" },
      { key: "medBeforeAfter", label: "State: before → after", placeholder: "e.g. anxious → settled" },
      { key: "medStreak", label: "Streak / days this week", placeholder: "e.g. day 5" },
      { key: "medReflection", label: "How it went — reflection", placeholder: "Calm or restless? What came up? Any insight, image, or feeling to remember…", multiline: true, full: true },
      // — Wider inner practice —
      { key: "breathwork", label: "Breathwork / stillness", placeholder: "style · minutes (box, 4-7-8, coherence)" },
      { key: "gratitude", label: "Gratitude", placeholder: "three little things" },
      { key: "intention", label: "Intention", placeholder: "one word for today" },
      { key: "practice", label: "Other inner practice", placeholder: "journaling, therapy, prayer, visualization" },
      { key: "win", label: "Today's win", placeholder: "celebrate something" },
    ],
  },
];

export const MAIN_GOALS = [
  "Feel like myself again",
  "Energy & metabolism",
  "Peptide & injectable organization",
  "Hormone balance through peri/menopause",
  "Longevity & healthspan",
  "Skin, hair & glow",
  "Strength & body recomposition",
  "Better sleep & calm",
];

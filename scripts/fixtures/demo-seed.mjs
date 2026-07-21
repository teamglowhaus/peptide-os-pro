// Fake demo data used only to populate marketing screenshots/thumbnails —
// fictional profile "marie", fictional pet, fictional provider names. Not
// real user data. Shared by scripts/generate-thumbnails.mjs and any other
// script that needs a populated app to screenshot.
export const day = (o) => { const d = new Date(); d.setDate(d.getDate() - o); return d.toISOString().slice(0, 10); };
export const uid = () => Math.random().toString(36).slice(2, 10);
export const S = "p-ava";
export const seed = {
  version: 1,
  settings: { theme: "light", activeProfileId: S,
    onboarding: { completed: true, mainGoal: "Feel like myself again", peptides: true, glp1: true, hrt: true, menopause: true, supplements: true, redLight: true, coldPlunge: true, sauna: true, labs: true, wearables: true, pets: true, household: true, aesthetic: "cream" },
    cloud: { provider: "local", email: "", connected: false }, calculatorAcknowledged: true, lastBackupAt: day(1) },
  profiles: [{ id: S, kind: "self", name: "marie", emoji: "🌿", createdAt: day(90) }],
  pets: [{ id: "pet1", name: "Biscuit", species: "dog", breed: "Golden Retriever", weight: "62 lb", food: "", notes: "", supplements: [], medications: [], vaccines: [], appointments: [{ id: "pa1", date: day(-10), reason: "Annual checkup", clinic: "Dr. Kim", notes: "" }], symptoms: [], weights: [], custom: [], createdAt: day(900) }],
  injectables: [{ id: "inj1", profileId: S, name: "Tirzepatide", category: "GLP-1", goal: "Metabolic journey", provider: "Dr. Reyes", startDate: day(60), endDate: "", vialSize: "", storage: "Refrigerated", reconstitution: "", providerDose: "per provider", units: "", schedule: "Weekly · Sunday", injectionSite: "", sideEffects: "", notes: "", refillReminder: day(-9), inventory: "3 pens", active: true, createdAt: day(60) }],
  injectionLogs: [{ id: uid(), profileId: S, protocolId: "inj1", date: day(2), site: "abd-ul", doseTaken: "per provider", feltAfter: "steady", notes: "" }],
  hormones: [{ id: uid(), profileId: S, name: "Progesterone", form: "Pill", providerDose: "per provider", schedule: "Nightly", provider: "Dr. Reyes", startDate: day(120), refillReminder: day(-20), labDate: day(-30), providerNotes: "Recheck 3mo", notes: "", active: true, createdAt: day(120) }],
  symptomLogs: [{id: uid(), profileId: S, date: day(0), symptoms: {hotFlashes:0,nightSweats:3,brainFog:0,moodSwings:2}, flow:"", notes:""}],
  providerQuestions: [{ id: uid(), profileId: S, question: "Could my 3am waking be progesterone timing?", context: "", asked: false, answer: "", createdAt: new Date().toISOString() }],
  supplements: [["Magnesium Glycinate", "Minerals", "Thorne", "bedtime"], ["Omega-3 (EPA/DHA)", "Longevity", "Nordic Naturals", "morning"], ["Creatine Monohydrate", "Fitness & recovery", "Momentous", "morning"]].map(([name, category, brand, st], i) => ({ id: "s" + i, profileId: S, name, category, brand, product: "", barcode: "", dose: "per label", form: "capsule", stacks: [st], withFood: st === "morning" ? "with" : "", foodNote: "", labelInstructions: "", providerInstructions: "", combineNotes: "", avoidNotes: "", sideEffects: "", inventory: "", reorderReminder: "", active: true, createdAt: day(80) })),
  supplementChecks: [],
  redLight: [{ id: uid(), profileId: S, date: day(0), device: "Panel", bodyArea: "Face & chest", wavelength: "660/850", distance: "12 in", duration: "10 min", timeOfDay: "7 am", skinGoal: "glow", recoveryGoal: "", moodBefore: 3, moodAfter: 4, energyBefore: 2, energyAfter: 4, notes: "" }],
  coldPlunge: [{ id: uid(), profileId: S, date: day(1), temperature: "50", duration: "3", timeOfDay: "6:45 am", breathwork: "box breathing", moodBefore: 2, moodAfter: 5, energyBefore: 2, energyAfter: 5, recovery: "warm walk", personalBest: true, notes: "" }],
  sauna: [{ id: uid(), profileId: S, date: day(0), kind: "infrared", temperature: "170", duration: "20", hydration: "16 oz", electrolytes: "", mood: 4, sleepImpact: "", recovery: "", notes: "" }],
  toolSessions: [{ id: uid(), profileId: S, date: day(0), tool: "sunlight", duration: "10 min", detail: "walk", feeling: 4, notes: "" }],
  dailyLogs: Array.from({ length: 7 }, (_, i) => ({ id: uid(), profileId: S, date: day(6 - i), mood: 3, energy: 3, sleepHours: "7.5", sleepQuality: 3, hrv: "48", weight: "150", steps: "", water: "", protein: "", glucose: "", bloodPressure: "", notes: "", gratitude: "", wins: "" })),
  labs: [{ id: uid(), profileId: S, panel: "Thyroid", marker: "TSH", value: "2.4", unit: "mIU/L", range: "0.4-4.0", date: day(180), flagged: false, notes: "", fileName: "" }],
  appointments: [{ id: uid(), profileId: S, date: day(-15), time: "9:30", title: "HRT follow-up", provider: "Dr. Reyes", kind: "provider", notes: "", done: false }],
  wearables: [{ id: uid(), profileId: S, brand: "Oura", model: "Ring Gen 4", metricFocus: "HRV · sleep", syncNotes: "", active: true }],
  lifestyle: [],
  beautyTreatments: [
    { id: "bt-peel", profileId: S, name: "Chemical peel", kind: "office", product: "30% glycolic", provider: "Glow Aesthetics", intervalDays: 42, aftercare: "SPF religiously · no actives for 72h", notes: "", active: true, createdAt: day(120) },
    { id: "bt-led", profileId: S, name: "LED mask", kind: "home", product: "Red light · 10 min", provider: "CurrentBody", intervalDays: 7, aftercare: "", notes: "", active: true, createdAt: day(90) },
    { id: "bt-guasha", profileId: S, name: "Gua sha", kind: "home", product: "With rosehip oil", provider: "", intervalDays: null, aftercare: "", notes: "", active: true, createdAt: day(60) },
  ],
  beautyLogs: [
    { id: uid(), profileId: S, treatmentId: "bt-peel", date: day(41), skipped: false, reaction: "Pink for 2 hours, calm by evening", notes: "" },
    { id: uid(), profileId: S, treatmentId: "bt-led", date: day(2), skipped: false, reaction: "", notes: "" },
    { id: uid(), profileId: S, treatmentId: "bt-guasha", date: day(1), skipped: false, reaction: "Depuffed", notes: "" },
  ],
  skincareSteps: [
    { id: "sk-am1", profileId: S, routine: "am", order: 0, product: "Gentle cleanser", amount: "1 pump", notes: "", active: true },
    { id: "sk-am2", profileId: S, routine: "am", order: 1, product: "Vitamin C serum", amount: "3 drops", notes: "", active: true },
    { id: "sk-am3", profileId: S, routine: "am", order: 2, product: "Peptide moisturizer", amount: "2 pumps", notes: "", active: true },
    { id: "sk-am4", profileId: S, routine: "am", order: 3, product: "SPF 50", amount: "two fingers", notes: "", active: true },
    { id: "sk-pm1", profileId: S, routine: "pm", order: 0, product: "Oil cleanser", amount: "2 pumps", notes: "", active: true },
    { id: "sk-pm2", profileId: S, routine: "pm", order: 1, product: "Retinal 0.1%", amount: "pea-size", notes: "", active: true },
    { id: "sk-pm3", profileId: S, routine: "pm", order: 2, product: "Barrier cream", amount: "generous", notes: "", active: true },
  ],
  skincareChecks: [
    { id: uid(), profileId: S, date: day(0), routine: "am", issues: "" },
    { id: uid(), profileId: S, date: day(1), routine: "pm", issues: "Slight sting after the acid — skipped retinal" },
  ],
};

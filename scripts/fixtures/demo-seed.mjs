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
};

/* ————————————————————————————————————————————————
   Core data model for the Biohacker Operating System
   All records are profile-scoped and stored via the
   storage adapter (local-first, cloud-sync ready).
   ———————————————————————————————————————————————— */

export type ID = string;

export type ProfileKind = "self" | "spouse" | "child" | "parent" | "custom";
export type PetSpecies = "dog" | "cat" | "horse" | "bird" | "rabbit" | "other";

export interface Profile {
  id: ID;
  kind: ProfileKind;
  name: string;
  emoji: string; // avatar glyph, keeps it personal without photos
  createdAt: string;
}

export interface PetProfile {
  id: ID;
  name: string;
  species: PetSpecies;
  breed: string;
  weight: string;
  food: string;
  notes: string;
  supplements: PetCareItem[];
  medications: PetCareItem[];
  vaccines: PetCareItem[];
  appointments: PetAppointment[];
  symptoms: PetLogEntry[];
  weights: PetLogEntry[];
  custom: PetCareItem[];
  createdAt: string;
}

export interface PetCareItem {
  id: ID;
  name: string;
  detail: string; // dose per label/vet, lot #, etc.
  schedule: string;
  date?: string;
  notes: string;
}

export interface PetAppointment {
  id: ID;
  date: string;
  reason: string;
  clinic: string;
  notes: string;
}

export interface PetLogEntry {
  id: ID;
  date: string;
  value: string;
  notes: string;
}

/* —— Peptides & injectables —— */

export type InjectableCategory =
  | "GLP-1"
  | "Peptide"
  | "Longevity"
  | "Vitamin injection"
  | "Hormone injection"
  | "Wellness injection"
  | "Custom";

export interface InjectableProtocol {
  id: ID;
  profileId: ID;
  name: string;
  category: InjectableCategory;
  goal: string;
  provider: string;
  startDate: string;
  endDate: string;
  vialSize: string;
  storage: string;
  reconstitution: string;
  providerDose: string; // always provider-given — the app never suggests doses
  units: string;
  schedule: string; // e.g. "Weekly · Sunday evening" — user's own words
  injectionSite: string;
  sideEffects: string;
  notes: string;
  refillReminder: string; // date
  inventory: string;
  active: boolean;
  createdAt: string;
}

export interface InjectionLog {
  id: ID;
  profileId: ID;
  protocolId: ID;
  date: string;
  site: string; // rotation map site key
  doseTaken: string; // as given by provider
  feltAfter: string;
  notes: string;
}

/* —— Hormones (HRT / peri / menopause) —— */

export type HormoneDeliveryForm =
  | "Cream" | "Gel" | "Patch" | "Pill" | "Pellet" | "Injection" | "Troche" | "Vaginal" | "Other";

export interface HormoneTherapy {
  id: ID;
  profileId: ID;
  name: string; // Estradiol, Progesterone, Testosterone, DHEA, Pregnenolone, Thyroid, custom
  form: HormoneDeliveryForm;
  providerDose: string;
  schedule: string;
  provider: string;
  startDate: string;
  refillReminder: string;
  labDate: string;
  providerNotes: string;
  notes: string;
  active: boolean;
  createdAt: string;
}

export interface SymptomLog {
  id: ID;
  profileId: ID;
  date: string;
  symptoms: Record<string, number>; // symptom key -> 0-4 severity
  flow: "" | "none" | "spotting" | "light" | "medium" | "heavy";
  notes: string;
}

// A logged period start — the source of truth for cycle-day and phase
// estimates, replacing manual day-number entry with something computed.
export interface PeriodLog {
  id: ID;
  profileId: ID;
  startDate: string;
  notes: string;
}

/* —— Beauty Studio ————————————————————————————————
   Treatments are episodic events (a peel, microneedling, a facial) with a
   user-set repeat interval; the interval always comes from the user's own
   provider, esthetician, or product label — the app never suggests spacing. */
export interface BeautyTreatment {
  id: ID;
  profileId: ID;
  name: string;
  kind: "office" | "home";
  /** Product/strength exactly as the label or provider states it, e.g. "30% glycolic". */
  product: string;
  provider: string;
  /** Repeat interval in days, chosen by the user (their provider's/label's cadence). null = no schedule. */
  intervalDays: number | null;
  aftercare: string;
  notes: string;
  active: boolean;
  createdAt: string;
}

export interface BeautyLog {
  id: ID;
  profileId: ID;
  treatmentId: ID;
  date: string;
  /** true = the user chose "skip" on a due reminder; pushes the next due date without counting as done. */
  skipped: boolean;
  /** How skin reacted — the detail estheticians ask about at the next visit. */
  reaction: string;
  notes: string;
}

/** One product step in an ordered AM/PM skincare routine. */
export interface SkincareStep {
  id: ID;
  profileId: ID;
  routine: "am" | "pm";
  /** Layer order, 0-based — the sequence products go on. */
  order: number;
  product: string;
  /** Free-text amount: "2 pumps", "pea-size", "3 drops". */
  amount: string;
  notes: string;
  active: boolean;
  /** Days of week this step applies (0=Sun … 6=Sat), e.g. retinol Mon/Wed/Fri.
   *  Missing or empty = every day. Older installs have no field — daily. */
  days?: number[];
}

/** One product substituted for a single day, without touching the routine. */
export interface SkincareSwap {
  stepId: ID;
  /** What was actually used instead, e.g. "Bakuchiol (skin felt raw)". */
  product: string;
}

/** A day's routine record: which steps were checked off, one-day product
 *  swaps, and any issues noticed (redness, purging…).
 *  Older installs recorded only "routine done" with no step detail —
 *  a record with no doneStepIds field means the whole routine was done. */
export interface SkincareCheck {
  id: ID;
  profileId: ID;
  date: string;
  routine: "am" | "pm";
  issues: string;
  doneStepIds?: ID[];
  swaps?: SkincareSwap[];
}

/** A dated change to a routine — added/removed/swapped a product — so the
 *  user can look back and see exactly what they were using in any week. */
export interface SkincareEvent {
  id: ID;
  profileId: ID;
  date: string;
  routine: "am" | "pm";
  /** Human sentence, e.g. "Swapped Vitamin C serum → Azelaic acid". */
  text: string;
}

export interface ProviderQuestion {
  id: ID;
  profileId: ID;
  question: string;
  context: string;
  asked: boolean;
  answer: string;
  createdAt: string;
}

/* —— Supplements —— */

export type StackTime = "morning" | "afternoon" | "evening" | "bedtime";

export interface Supplement {
  id: ID;
  profileId: ID;
  name: string;
  category: string;
  brand: string;
  product: string;
  barcode: string;
  dose: string;
  form: string; // capsule, powder, liquid, gummy…
  stacks: StackTime[];
  withFood: "" | "with" | "without" | "note";
  foodNote: string;
  labelInstructions: string;
  providerInstructions: string;
  combineNotes: string; // user's own "take together with…" notes
  avoidNotes: string;   // user's own "keep apart from…" notes
  sideEffects: string;
  inventory: string;
  reorderReminder: string;
  active: boolean;
  createdAt: string;
}

export interface SupplementCheck {
  id: ID;
  profileId: ID;
  date: string; // yyyy-mm-dd
  supplementId: ID;
  stack: StackTime;
  taken: boolean;
}

/* —— Biohacking sessions —— */

export interface RedLightSession {
  id: ID; profileId: ID; date: string;
  device: string; bodyArea: string; wavelength: string; distance: string;
  duration: string; timeOfDay: string; skinGoal: string; recoveryGoal: string;
  moodBefore: number; moodAfter: number; energyBefore: number; energyAfter: number;
  notes: string;
}

export interface ColdPlungeSession {
  id: ID; profileId: ID; date: string;
  temperature: string; duration: string; timeOfDay: string; breathwork: string;
  moodBefore: number; moodAfter: number; energyBefore: number; energyAfter: number;
  recovery: string; personalBest: boolean; notes: string;
}

export interface SaunaSession {
  id: ID; profileId: ID; date: string;
  kind: "infrared" | "traditional" | "steam";
  temperature: string; duration: string; hydration: string; electrolytes: string;
  mood: number; sleepImpact: string; recovery: string; notes: string;
}

export interface ToolSession {
  id: ID; profileId: ID; date: string;
  tool: string; // key from biohacking tool library or custom
  duration: string; detail: string; feeling: number; notes: string;
}

/* —— Daily wellness log (dashboard metrics) —— */

export interface DailyLog {
  id: ID;
  profileId: ID;
  date: string; // yyyy-mm-dd
  mood: number;      // 0-5
  energy: number;    // 0-5
  sleepHours: string;
  sleepQuality: number;
  hrv: string;
  weight: string;
  steps: string;
  water: string;
  protein: string;
  glucose: string;
  bloodPressure: string;
  notes: string;
  gratitude: string;
  wins: string;
}

/* —— Labs —— */

export interface LabResult {
  id: ID;
  profileId: ID;
  panel: string;   // CBC, CMP, Thyroid…
  marker: string;  // e.g. TSH
  value: string;
  unit: string;
  range: string;
  date: string;
  flagged: boolean;
  notes: string;
  fileName: string; // uploaded PDF/image name (stored locally)
}

/* —— Appointments & reminders —— */

export interface Appointment {
  id: ID;
  profileId: ID;
  date: string;
  time: string;
  title: string;
  provider: string;
  kind: "provider" | "labs" | "pet" | "self-care" | "other";
  notes: string;
  done: boolean;
}

/* —— Wearables —— */

export interface WearableDevice {
  id: ID;
  profileId: ID;
  brand: string;
  model: string;
  metricFocus: string;
  syncNotes: string;
  active: boolean;
}

/* —— Lifestyle trackers (nutrition/body/fitness/sleep/beauty/dental/hair/mindset) —— */

export interface LifestyleEntry {
  id: ID;
  profileId: ID;
  tracker: string;  // "nutrition" | "body" | "fitness" | "sleep" | "beauty" | "dental" | "hair" | "mindset"
  date: string;
  fields: Record<string, string>;
  rating: number;
  notes: string;
}

/* —— Onboarding / settings —— */

export interface OnboardingAnswers {
  completed: boolean;
  mainGoal: string;
  peptides: boolean;
  glp1: boolean;
  hrt: boolean;
  menopause: boolean;
  supplements: boolean;
  redLight: boolean;
  coldPlunge: boolean;
  sauna: boolean;
  labs: boolean;
  wearables: boolean;
  /** Beauty Studio: in-office & at-home treatments + daily skincare routines.
   *  Optional (missing on installs older than this module) — normalizeDatabase
   *  defaults it on, so existing users discover the new module in their nav. */
  beauty?: boolean;
  pets: boolean;
  household: boolean;
  aesthetic: "cream" | "sage" | "blush";
}

export interface Settings {
  theme: "light" | "dark" | "system";
  onboarding: OnboardingAnswers;
  activeProfileId: ID;
  cloud: {
    provider: "local" | "supabase";
    email: string;
    connected: boolean;
  };
  /** User has explicitly acknowledged the Reconstitution Studio's arithmetic-only,
   *  not-medical-advice disclaimer this install. Gates the calculator's outputs. */
  calculatorAcknowledged: boolean;
  /** ISO date of the last successful "Export backup" — drives the data-safety
   *  reminder banner. Empty string means never backed up. */
  lastBackupAt: string;
}

/* —— Root database shape (per install) —— */

export interface Database {
  version: number;
  settings: Settings;
  profiles: Profile[];
  pets: PetProfile[];
  injectables: InjectableProtocol[];
  injectionLogs: InjectionLog[];
  hormones: HormoneTherapy[];
  symptomLogs: SymptomLog[];
  periods: PeriodLog[];
  providerQuestions: ProviderQuestion[];
  supplements: Supplement[];
  supplementChecks: SupplementCheck[];
  redLight: RedLightSession[];
  coldPlunge: ColdPlungeSession[];
  sauna: SaunaSession[];
  toolSessions: ToolSession[];
  dailyLogs: DailyLog[];
  labs: LabResult[];
  appointments: Appointment[];
  wearables: WearableDevice[];
  lifestyle: LifestyleEntry[];
  beautyTreatments: BeautyTreatment[];
  beautyLogs: BeautyLog[];
  skincareSteps: SkincareStep[];
  skincareChecks: SkincareCheck[];
  skincareEvents: SkincareEvent[];
}

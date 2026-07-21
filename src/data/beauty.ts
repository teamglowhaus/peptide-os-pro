/* —— Beauty Studio library ————————————————————————
   Seeded from what women in skincare communities actually do — professional
   med-spa/derm treatments plus the at-home tools and actives the
   r/30PlusSkinCare world lives by. Entries carry NO suggested intervals on
   purpose: spacing always comes from the user's own provider, esthetician,
   or product label (chemical peel strength and microneedling depth are real
   safety territory — the app records, it never advises). */

export interface BeautyLibraryEntry {
  name: string;
  kind: "office" | "home";
  hint: string;
}

export const BEAUTY_LIBRARY: BeautyLibraryEntry[] = [
  /* —— In office / professional —— */
  { name: "Chemical peel", kind: "office", hint: "Glycolic, lactic, salicylic, TCA — log the strength your provider used" },
  { name: "Microneedling", kind: "office", hint: "Collagen induction — track depth & downtime per session" },
  { name: "Microneedling + PRP", kind: "office", hint: "With platelet-rich plasma — note how skin recovered" },
  { name: "HydraFacial", kind: "office", hint: "Cleanse, extract, hydrate — note the boosters used" },
  { name: "Laser resurfacing", kind: "office", hint: "Fraxel, CO2 & friends — real downtime, log it honestly" },
  { name: "IPL / photofacial", kind: "office", hint: "Pigment & redness — sessions usually run in a series" },
  { name: "Laser hair removal", kind: "office", hint: "Track the area & session number in your series" },
  { name: "Neurotoxin (Botox etc.)", kind: "office", hint: "Log units & areas exactly as your injector recorded them" },
  { name: "Dermal filler", kind: "office", hint: "Product, area, amount — per your injector's notes" },
  { name: "Microdermabrasion", kind: "office", hint: "Physical resurfacing — note how skin felt after" },
  { name: "Professional facial", kind: "office", hint: "Your esthetician's protocol — log what they used" },
  { name: "Dermaplaning (professional)", kind: "office", hint: "Blade exfoliation at the spa — smooth-canvas day" },
  { name: "LED therapy (professional)", kind: "office", hint: "In-office panel sessions — note wavelengths if given" },
  { name: "Radiofrequency / ultrasound", kind: "office", hint: "Morpheus8, Ultherapy & friends — log settings & downtime" },
  { name: "Brow / lash service", kind: "office", hint: "Lamination, tint, lift — track how long results held" },

  /* —— At home —— */
  { name: "At-home chemical peel", kind: "home", hint: "Follow your product's label exactly — log strength & wear time" },
  { name: "Dermaplaning (at home)", kind: "home", hint: "Peach-fuzz + dead-skin pass — note any irritation" },
  { name: "Derma-rolling", kind: "home", hint: "At-home needling — log needle length & skin response" },
  { name: "LED mask", kind: "home", hint: "Red/blue light sessions — consistency is the whole game" },
  { name: "Microcurrent device", kind: "home", hint: "NuFACE-style lifting — cumulative, note your settings" },
  { name: "Gua sha", kind: "home", hint: "Sculpt & drain with oil — a ritual worth keeping streaks for" },
  { name: "Facial massage / lymphatic", kind: "home", hint: "Depuff & circulate — morning favorite" },
  { name: "Ice rolling / cryo globes", kind: "home", hint: "Cool-down for puffiness & post-active calm" },
  { name: "Exfoliating acid treatment", kind: "home", hint: "AHA/BHA nights — log which acid & how skin took it" },
  { name: "Retinoid night", kind: "home", hint: "Track your ramp-up & any purging honestly" },
  { name: "Sheet mask / treatment mask", kind: "home", hint: "Hydration or clay night — note favorites" },
  { name: "Slugging", kind: "home", hint: "Occlusive overnight seal — great after barrier-stressing weeks" },
  { name: "Scalp treatment", kind: "home", hint: "Oiling, exfoliating, massage — hair counts as beauty too" },
  { name: "Self-tan / body treatment", kind: "home", hint: "Track application days so fade never surprises you" },
  { name: "Hair removal (at home)", kind: "home", hint: "Wax, epilate, IPL device — log the area & date" },
];

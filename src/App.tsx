import React from "react";
import { useStore } from "./lib/store";
import { Shell, useRoute } from "./components/shell";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { Peptides } from "./pages/Peptides";
import { CalculatorPage } from "./pages/Calculator";
import { Hormones } from "./pages/Hormones";
import { Supplements } from "./pages/Supplements";
import { Biohacking } from "./pages/Biohacking";
import { RedLight } from "./pages/RedLight";
import { ColdPlunge } from "./pages/ColdPlunge";
import { Sauna } from "./pages/Sauna";
import { Labs } from "./pages/Labs";
import { Wearables } from "./pages/Wearables";
import { Lifestyle } from "./pages/Lifestyle";
import { Pets } from "./pages/Pets";
import { Household } from "./pages/Household";
import { Printables } from "./pages/Printables";
import { Legal } from "./pages/Legal";
import { SettingsPage } from "./pages/Settings";

const PAGES: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  peptides: Peptides,
  calculator: CalculatorPage,
  hormones: Hormones,
  supplements: Supplements,
  biohacking: Biohacking,
  redlight: RedLight,
  coldplunge: ColdPlunge,
  sauna: Sauna,
  labs: Labs,
  wearables: Wearables,
  lifestyle: Lifestyle,
  pets: Pets,
  household: Household,
  printables: Printables,
  legal: Legal,
  settings: SettingsPage,
};

export default function App() {
  const { db } = useStore();
  const [route, nav] = useRoute();
  const ob = db.settings.onboarding;

  if (!ob.completed) return <Onboarding />;

  // Modules chosen at onboarding shape the nav; everything stays reachable via Settings.
  const enabled = (key: string): boolean => {
    switch (key) {
      case "peptides": return ob.peptides || ob.glp1;
      case "calculator": return ob.peptides || ob.glp1;
      case "hormones": return ob.hrt || ob.menopause;
      case "supplements": return ob.supplements;
      case "redlight": return ob.redLight;
      case "coldplunge": return ob.coldPlunge;
      case "sauna": return ob.sauna;
      case "labs": return ob.labs;
      case "wearables": return ob.wearables;
      case "pets": return ob.pets;
      case "household": return ob.household;
      default: return true;
    }
  };

  const Page = PAGES[route] ?? Dashboard;

  return (
    <Shell route={route} nav={nav} enabled={enabled}>
      <div key={route} className="fade-up mx-auto max-w-5xl">
        <Page />
      </div>
    </Shell>
  );
}

import React, { useEffect, useState } from "react";
import {
  Sparkles, Syringe, Calculator, Flower2, Pill, Activity, Sun, Snowflake, Flame,
  FlaskConical, Watch, HeartPulse, PawPrint, Users, Printer, Settings as SettingsIcon,
  Moon, SunMedium, ChevronDown, Menu, X, ScrollText,
} from "lucide-react";
import { useStore, today } from "../lib/store";
import { cx } from "./ui";

export interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  group: "daily" | "protocols" | "body" | "home";
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Today", icon: <Sparkles size={18} />, group: "daily" },
  { key: "peptides", label: "Peptides & Injectables", icon: <Syringe size={18} />, group: "protocols" },
  { key: "calculator", label: "Reconstitution Studio", icon: <Calculator size={18} />, group: "protocols" },
  { key: "hormones", label: "Hormones & Menopause", icon: <Flower2 size={18} />, group: "protocols" },
  { key: "supplements", label: "Supplements", icon: <Pill size={18} />, group: "protocols" },
  { key: "biohacking", label: "Biohacking Tools", icon: <Activity size={18} />, group: "body" },
  { key: "redlight", label: "Red Light", icon: <Sun size={18} />, group: "body" },
  { key: "coldplunge", label: "Cold Plunge", icon: <Snowflake size={18} />, group: "body" },
  { key: "sauna", label: "Sauna", icon: <Flame size={18} />, group: "body" },
  { key: "labs", label: "Labs & Biomarkers", icon: <FlaskConical size={18} />, group: "body" },
  { key: "wearables", label: "Wearables", icon: <Watch size={18} />, group: "body" },
  { key: "lifestyle", label: "Daily Rituals", icon: <HeartPulse size={18} />, group: "daily" },
  { key: "pets", label: "Pets", icon: <PawPrint size={18} />, group: "home" },
  { key: "household", label: "Household", icon: <Users size={18} />, group: "home" },
  { key: "printables", label: "Printable Studio", icon: <Printer size={18} />, group: "home" },
  { key: "legal", label: "Legal & Disclaimers", icon: <ScrollText size={18} />, group: "home" },
  { key: "settings", label: "Settings", icon: <SettingsIcon size={18} />, group: "home" },
];

const GROUP_LABELS: Record<NavItem["group"], string> = {
  daily: "Every day",
  protocols: "Protocols",
  body: "Body lab",
  home: "Your world",
};

export function useRoute(): [string, (r: string) => void] {
  const [route, setRoute] = useState(() => window.location.hash.replace("#/", "") || "dashboard");
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace("#/", "") || "dashboard");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const nav = (r: string) => {
    window.location.hash = `/${r}`;
    window.scrollTo({ top: 0 });
  };
  return [route, nav];
}

function ProfileSwitcher() {
  const { db, activeProfile, setActiveProfile, update } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-2xl border border-line bg-card px-3.5 py-2.5 text-left shadow-soft hover:border-line-strong"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-lg dark:bg-blush-500/25">
          {activeProfile.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="eyebrow block">Profile</span>
          <span className="block truncate text-[0.95rem] font-semibold text-ink-strong">
            {activeProfile.name}
          </span>
        </span>
        <ChevronDown size={16} className={cx("text-ink-faint transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="fade-up absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-card shadow-lifted">
          {db.profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActiveProfile(p.id); setOpen(false); }}
              className={cx(
                "flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-sunken",
                p.id === activeProfile.id && "bg-sunken/70"
              )}
            >
              <span className="text-lg">{p.emoji}</span>
              <span className="flex-1 truncate text-[0.9rem] font-medium">{p.name}</span>
              <span className="text-[0.7rem] uppercase tracking-wider text-ink-faint">{p.kind}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const name = prompt("Who is this profile for?");
              if (!name) return;
              update((d) => {
                const id = Math.random().toString(36).slice(2, 10);
                d.profiles.push({ id, kind: "custom", name, emoji: "🌸", createdAt: today() });
                d.settings.activeProfileId = id;
              });
              setOpen(false);
            }}
            className="w-full border-t border-line px-3.5 py-2.5 text-left text-[0.85rem] font-semibold text-champagne-600 hover:bg-sunken dark:text-champagne-300"
          >
            + Add household profile
          </button>
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { db, update } = useStore();
  const isDark = document.documentElement.classList.contains("dark");
  return (
    <button
      onClick={() =>
        update((d) => {
          d.settings.theme = isDark ? "light" : "dark";
        })
      }
      aria-label="Toggle light and dark mode"
      className="rounded-full border border-line p-2.5 text-ink-soft hover:bg-sunken"
    >
      {isDark ? <SunMedium size={17} /> : <Moon size={17} />}
    </button>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-3 px-1">
      <img src="/icons/icon.svg" alt="" className="h-10 w-10 rounded-xl shadow-soft" />
      <div>
        <p className="font-display text-[1.05rem] font-medium leading-tight text-ink-strong">
          Biohacker OS
        </p>
        <p className="text-[0.68rem] tracking-[0.16em] uppercase text-ink-faint">Wellness Operating System</p>
      </div>
    </div>
  );
}

export function Shell({
  route,
  nav,
  enabled,
  children,
}: {
  route: string;
  nav: (r: string) => void;
  enabled: (key: string) => boolean;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = NAV_ITEMS.filter((i) => enabled(i.key));
  const groups: NavItem["group"][] = ["daily", "protocols", "body", "home"];

  const NavList = ({ onPick }: { onPick?: () => void }) => (
    <nav className="mt-6 flex-1 space-y-6 overflow-y-auto pb-8 pr-1">
      {groups.map((g) => {
        const groupItems = items.filter((i) => i.group === g);
        if (!groupItems.length) return null;
        return (
          <div key={g}>
            <p className="eyebrow mb-2 px-3">{GROUP_LABELS[g]}</p>
            <div className="space-y-0.5">
              {groupItems.map((i) => (
                <button
                  key={i.key}
                  onClick={() => { nav(i.key); onPick?.(); }}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.92rem] font-medium transition-all",
                    route === i.key
                      ? "bg-champagne-500/30 text-champagne-50 shadow-[0_0_16px_rgb(201_169_106/0.25)] dark:bg-champagne-500/35 dark:text-champagne-50"
                      : "text-ink-soft hover:bg-champagne-400/10 hover:text-ink hover:shadow-[0_0_14px_rgb(201_169_106/0.2)] dark:hover:bg-champagne-400/15 dark:hover:text-champagne-100"
                  )}
                >
                  <span className={cx(route === i.key ? "text-champagne-100 dark:text-champagne-100" : "text-ink-faint")}>
                    {i.icon}
                  </span>
                  {i.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-[1400px]">
      {/* Desktop sidebar */}
      <aside className="dark sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r border-line bg-page px-5 py-6 lg:flex">
        <Wordmark />
        <div className="mt-6">
          <ProfileSwitcher />
        </div>
        <NavList />
        <div className="flex items-center justify-between border-t border-line pt-4">
          <p className="text-[0.7rem] text-ink-faint">Private · stored on your device</p>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="no-print fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-page/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <Wordmark />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="rounded-full border border-line p-2.5 text-ink-soft"
          >
            <Menu size={17} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-cocoa-800/40 backdrop-blur-[2px]" onClick={() => setMenuOpen(false)} />
          <div className="dark fade-up absolute inset-y-0 left-0 flex w-[84%] max-w-xs flex-col bg-page px-5 py-6 shadow-lifted">
            <div className="flex items-center justify-between">
              <Wordmark />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-full p-2 text-ink-faint hover:bg-sunken">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5">
              <ProfileSwitcher />
            </div>
            <NavList onPick={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="min-w-0 flex-1 px-4 pb-24 pt-20 sm:px-8 lg:px-10 lg:pt-10 print:p-0 print:pt-0">
        {children}
      </main>
    </div>
  );
}

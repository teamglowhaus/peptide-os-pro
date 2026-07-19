import React, { useState } from "react";
import { Flame, Sparkles, Award, Medal, Trophy, Syringe, Pill, Sun, type LucideIcon } from "lucide-react";
import { Card, Modal, cx } from "./ui";
import type { Badge, BadgeColor, StreakInfo } from "../lib/achievements";

const ICONS: Record<Badge["icon"], LucideIcon> = {
  sparkles: Sparkles, flame: Flame, award: Award, medal: Medal, trophy: Trophy,
  syringe: Syringe, pill: Pill, sun: Sun,
};

const COLOR_GRADIENT: Record<BadgeColor, string> = {
  gold: "linear-gradient(155deg, var(--color-gold-400), var(--color-gold-600))",
  ruby: "linear-gradient(155deg, var(--color-ruby-400), var(--color-ruby-600))",
  emerald: "linear-gradient(155deg, var(--color-emerald-400), var(--color-emerald-600))",
  sapphire: "linear-gradient(155deg, var(--color-sapphire-400), var(--color-sapphire-600))",
  amethyst: "linear-gradient(155deg, var(--color-amethyst-400), var(--color-amethyst-600))",
};

function BadgeTile({ badge, onSelect }: { badge: Badge; onSelect: (b: Badge) => void }) {
  const Icon = ICONS[badge.icon];
  return (
    <button
      onClick={() => onSelect(badge)}
      className="flex flex-col items-center gap-1.5 rounded-2xl p-2 text-center transition-transform hover:-translate-y-0.5"
      aria-label={`${badge.label} — ${badge.unlocked ? "unlocked" : "locked"}`}
    >
      <span
        className={cx(
          "flex h-14 w-14 items-center justify-center rounded-full text-white",
          !badge.unlocked && "grayscale opacity-35"
        )}
        style={{ background: COLOR_GRADIENT[badge.color], boxShadow: badge.unlocked ? "var(--shadow-glow)" : undefined }}
      >
        <Icon size={22} />
      </span>
      <span className={cx("max-w-[72px] truncate text-[0.68rem] font-medium", badge.unlocked ? "text-ink" : "text-ink-faint")}>
        {badge.label}
      </span>
    </button>
  );
}

export function BadgeShelf({ streak, badges }: { streak: StreakInfo; badges: Badge[] }) {
  const [selected, setSelected] = useState<Badge | null>(null);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full text-white"
            style={{ background: COLOR_GRADIENT.ruby, boxShadow: "var(--shadow-glow)" }}
          >
            <Flame size={19} />
          </span>
          <div>
            <p className="font-display text-lg font-medium text-ink-strong leading-tight">
              {streak.current > 0 ? `${streak.current}-day streak` : "Start your streak today"}
            </p>
            <p className="text-[0.78rem] text-ink-soft">
              Best: {streak.longest} days · {unlockedCount}/{badges.length} badges earned
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6">
        {badges.map((b) => (
          <BadgeTile key={b.id} badge={b} onSelect={setSelected} />
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.label ?? ""}>
        {selected && (
          <div className="text-center">
            <span
              className={cx(
                "mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white",
                !selected.unlocked && "grayscale opacity-35"
              )}
              style={{ background: COLOR_GRADIENT[selected.color], boxShadow: selected.unlocked ? "var(--shadow-glow)" : undefined }}
            >
              {(() => { const Icon = ICONS[selected.icon]; return <Icon size={26} />; })()}
            </span>
            <p className="mt-3 text-[0.9rem] text-ink-soft">{selected.description}</p>
            <p className="mt-3 text-[0.85rem] font-semibold text-ink-faint">
              {selected.unlocked ? "Earned ✓" : `${selected.progress.current} / ${selected.progress.target}`}
            </p>
          </div>
        )}
      </Modal>
    </Card>
  );
}

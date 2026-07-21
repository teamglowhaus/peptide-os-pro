import React, { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { RIBBON_CLIP } from "./ui";

const COLORS = [
  "var(--color-gold-500)", "var(--color-ruby-500)", "var(--color-emerald-500)",
  "var(--color-sapphire-500)", "var(--color-amethyst-500)",
];

interface Piece {
  id: number;
  left: number;
  color: string;
  width: number;
  height: number;
  duration: number;
  delay: number;
  sway: number;
}

/** A one-shot streamer burst — curling ribbons + a few sparkle dots — replayed each time
 * `burstKey` increments (0 = never fired). */
export function Streamers({ burstKey }: { burstKey: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (burstKey <= 0) return;
    const next: Piece[] = Array.from({ length: 46 }, (_, i) => {
      const isRibbon = i % 3 !== 0;
      return {
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        width: isRibbon ? 6 : 8 + Math.random() * 5,
        height: isRibbon ? 34 + Math.random() * 22 : 8 + Math.random() * 5,
        duration: 2.4 + Math.random() * 1.6,
        delay: Math.random() * 0.5,
        sway: 10 + Math.random() * 22,
      };
    });
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 4600);
    return () => clearTimeout(t);
  }, [burstKey]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="streamer-piece absolute top-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            boxShadow: "0 1px 2px rgb(0 0 0 / 0.15)",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--sway": `${p.sway}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/** A ribbon-banner toast that pops in to celebrate a genuine new streak day or badge unlock. */
export function StreakToast({ message }: { message: string | null }) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    setShown(message);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [message]);

  if (!shown) return null;

  return (
    <div
      className={
        "pointer-events-none fixed inset-x-0 top-6 z-[80] flex justify-center transition-all duration-500 " +
        (visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95")
      }
    >
      <div
        className="flex items-center gap-2 px-8 py-2.5 text-[0.95rem] font-semibold text-cocoa-800 shadow-lifted"
        style={{
          background: "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-500))",
          clipPath: RIBBON_CLIP,
        }}
      >
        <Flame size={17} className="shrink-0" />
        {shown}
      </div>
    </div>
  );
}

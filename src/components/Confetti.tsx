import React, { useEffect, useState } from "react";

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
}

/** A one-shot confetti burst, replayed each time `burstKey` increments (0 = never fired). */
export function Confetti({ burstKey }: { burstKey: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (burstKey <= 0) return;
    const next: Piece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      width: 6 + Math.random() * 7,
      height: 10 + Math.random() * 8,
      duration: 1.7 + Math.random() * 1.3,
      delay: Math.random() * 0.4,
    }));
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 3400);
    return () => clearTimeout(t);
  }, [burstKey]);

  if (!pieces.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

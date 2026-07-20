import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShieldAlert, Download } from "lucide-react";

/* ————————————————————————————————————————————————
   Hand-crafted component kit — shadcn-inspired API,
   styled entirely to the house look.
   ———————————————————————————————————————————————— */

export function cx(...parts: (string | false | undefined | null)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* —— Buttons —— */

type ButtonVariant = "primary" | "soft" | "ghost" | "outline" | "danger";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const styles: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-br from-wine-400 to-wine-600 text-cream-50 hover:from-wine-300 hover:to-wine-500 shadow-soft",
    soft:
      "bg-sage-200/60 text-sage-600 hover:bg-sage-300/70 dark:bg-sage-600/30 dark:text-sage-200 dark:hover:bg-sage-600/50",
    ghost: "text-ink-soft hover:bg-champagne-200/50 hover:text-cocoa-600 dark:hover:bg-champagne-600/20 dark:hover:text-champagne-200",
    outline: "border-2 border-line-strong text-ink hover:border-wine-400 hover:bg-wine-200/25 hover:text-wine-600 dark:hover:border-wine-300 dark:hover:bg-wine-500/15 dark:hover:text-wine-200",
    danger: "bg-blush-100 text-blush-500 hover:bg-blush-200 dark:bg-blush-500/20 dark:text-blush-200 dark:hover:bg-blush-500/30",
  };
  return (
    <button
      className={cx(
        // btn-ink: hand-drawn asymmetric corners + candlelight halo on hover
        "btn-ink inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[0.9rem] font-semibold tracking-wide transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none disabled:hover:translate-y-0",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

/* —— Cards & sections —— */

export function Card({
  className,
  hover,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div className={cx("card p-5 sm:p-6", hover && "card-hover", className)} {...props}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}) {
  // Editorial signature: the last word of every title is set as a wine italic —
  // the typographic equivalent of a hand-finished flourish.
  const words = title.trim().split(" ");
  const lastWord = words.length > 1 ? words.pop() : null;
  return (
    <header className="fade-up mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="header-wash">
        <p className="eyebrow mb-1.5">{eyebrow}</p>
        <h1 className="text-[1.9rem] leading-tight sm:text-4xl font-medium">
          {lastWord ? (
            <>
              {words.join(" ")}{" "}
              <em className="font-light text-wine-500 dark:text-wine-300">{lastWord}</em>
            </>
          ) : (
            title
          )}
        </h1>
        <Squiggle className="mt-1.5 h-2 w-24 text-wine-400/70 dark:text-wine-300/70" />
        {sub && <p className="mt-2 max-w-xl text-[0.95rem] text-ink-soft">{sub}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cx("font-display text-xl font-medium text-ink-strong", className)}>{children}</h2>
  );
}

/** A single hand-drawn wavy underline — a signature accent, not a straight rule. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 14" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M2 8 C 18 1, 33 1, 50 8 S 82 15, 100 8 S 132 1, 150 8 S 182 15, 198 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A ribbon/pennant shape — two notched ends, like a banner. Used for stickers & toasts. */
export const RIBBON_CLIP = "polygon(0% 50%, 7% 0%, 93% 0%, 100% 50%, 93% 100%, 7% 100%)";

export function Flourish({ label }: { label?: string }) {
  return (
    <div className="flourish my-6 text-champagne-500">
      {label ? <span className="eyebrow !text-champagne-500">{label}</span> : <span aria-hidden>✦</span>}
    </div>
  );
}

/* —— Form primitives —— */

const inputBase =
  "input-ink w-full border border-line bg-raised px-4 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-faint transition-all";

export function Field({
  label,
  hint,
  children,
  className,
  labelClassName,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  /** Extra classes for the label text — e.g. a min-height to keep inputs aligned
   * across a row of Fields whose labels wrap to different numbers of lines. */
  labelClassName?: string;
}) {
  return (
    <label className={cx("block", className)}>
      <span className={cx("mb-1.5 block text-[0.8rem] font-semibold tracking-wide text-ink-soft", labelClassName)}>{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  /* Do not add `truncate` to inputBase/here by default: it silently ellipsizes short,
     exact VALUES too (e.g. Dashboard's "Sleep hrs" showing "7.5" as "7.."), not just long
     placeholder text. Pass `className="truncate"` per call site only where the field holds
     free-text prose in a narrow column (see Lifestyle.tsx) — never for compact numeric/short
     fixed-format fields. */
  return <input {...props} className={cx(inputBase, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={cx(inputBase, "resize-y", props.className)} />;
}

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cx(inputBase, "appearance-none pr-9 bg-no-repeat", props.className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23A08F7B' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 0.9rem center",
        ...props.style,
      }}
    >
      {children}
    </select>
  );
}

export function Chip({
  active,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cx(
        "btn-ink border px-3.5 py-1.5 text-[0.82rem] font-medium transition-all",
        active
          ? "border-wine-400 bg-wine-200/40 text-wine-600 dark:border-wine-300 dark:bg-wine-500/20 dark:text-wine-200"
          : "border-line text-ink-soft hover:border-line-strong hover:text-ink",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-sage-400" : "bg-taupe-200 dark:bg-cocoa-500"
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition-transform",
          checked ? "translate-x-[1.35rem]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

/* 0-5 rating as soft dots — used for mood/energy */
export function RatingDots({
  value,
  onChange,
  max = 5,
  tone = "sage",
}: {
  value: number;
  onChange?: (v: number) => void;
  max?: number;
  tone?: "sage" | "blush" | "champagne";
}) {
  const tones = {
    sage: "bg-sage-400 border-sage-400",
    blush: "bg-blush-400 border-blush-400",
    champagne: "bg-champagne-400 border-champagne-400",
  };
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          aria-label={`${n} of ${max}`}
          onClick={() => onChange?.(n === value ? 0 : n)}
          className={cx(
            "dot-ink h-5 w-5 border transition-all",
            n <= value ? tones[tone] : "border-line-strong bg-transparent hover:bg-sunken"
          )}
        />
      ))}
    </div>
  );
}

/* —— Modal sheet —— */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  // Portal to <body> so the overlay escapes any transformed ancestor
  // (page transitions apply a CSS transform, which would otherwise trap
  // position:fixed inside the content column instead of the viewport).
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-cocoa-800/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          "sheet-ink fade-up relative z-10 max-h-[92dvh] w-full overflow-y-auto bg-card p-6 shadow-lifted border border-line",
          wide ? "sm:max-w-3xl" : "sm:max-w-lg"
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-medium text-ink-strong">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-ink-faint hover:bg-sunken hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

/* —— Empty state with a hand-set botanical flourish —— */

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="ink-xl fade-up flex flex-col items-center border-2 border-dashed border-line-strong bg-card/60 px-8 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-500 dark:bg-sage-600/25 dark:text-sage-300">
        {icon}
      </div>
      <h3 className="font-display text-xl font-medium text-ink-strong">{title}</h3>
      <p className="mt-2 max-w-sm text-[0.92rem] leading-relaxed text-ink-soft">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* —— Stat tile —— */

export function Stat({
  label,
  value,
  detail,
  tone = "neutral",
  hero,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "neutral" | "sage" | "blush" | "champagne";
  /** The one headline stat per page gets the warm hero wash. */
  hero?: boolean;
}) {
  const tones = {
    neutral: "",
    sage: "text-sage-600 dark:text-sage-300",
    blush: "text-blush-500 dark:text-blush-300",
    champagne: "text-champagne-600 dark:text-champagne-300",
  };
  return (
    <div className={cx("card p-4", hero && "card-hero")}>
      <p className="eyebrow">{label}</p>
      <p className={cx("mt-1 font-display text-2xl font-medium text-ink-strong", tones[tone])}>{value}</p>
      {detail && <p className="mt-0.5 text-xs text-ink-faint">{detail}</p>}
    </div>
  );
}

/* —— Charts (single-series; value always shown as text) —— */

export function Sparkline({
  points,
  tone = "sage",
  height = 44,
}: {
  points: number[];
  tone?: "sage" | "gold" | "rose";
  height?: number;
}) {
  const w = 160;
  const stroke = `var(--chart-${tone})`;
  if (points.length < 2) {
    return (
      <div className="flex h-11 items-center text-xs text-ink-faint">
        Log a few days to see your trend
      </div>
    );
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => ({
    x: +(i * step).toFixed(1),
    y: +((height - 8) - ((p - min) / span) * (height - 16) + 4).toFixed(1),
  }));
  const d = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const last = coords[coords.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="4" fill={stroke} stroke="var(--surface-card)" strokeWidth="2" />
    </svg>
  );
}

export function Ring({
  value,
  size = 132,
  label,
}: {
  value: number; // 0..100
  size?: number;
  label: string;
}) {
  const gradientId = React.useId();
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-gold-400)" />
            <stop offset="100%" stopColor="var(--color-gold-600)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="9" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-medium text-ink-strong">{Math.round(pct)}</span>
        <span className="eyebrow mt-0.5 max-w-[70%] text-center !text-[0.58rem] leading-snug">{label}</span>
      </div>
    </div>
  );
}

/* Severity meter: 5 soft cells, single hue by intensity, value named in text */
export function SeverityMeter({ value, labels, className }: { value: number; labels: string[]; className?: string }) {
  return (
    <div className={cx("flex items-center gap-2", className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className="h-2.5 w-5 rounded-full"
            style={{
              background: n <= value ? "var(--chart-rose)" : "var(--line)",
              opacity: n <= value ? 0.45 + 0.14 * n : 1,
            }}
          />
        ))}
      </div>
      <span className="whitespace-nowrap text-xs font-medium text-ink-soft">{labels[value] ?? ""}</span>
    </div>
  );
}

/* —— Disclaimers —— */

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <p className="ink-xl mt-6 bg-sunken/70 px-4 py-3 text-[0.78rem] leading-relaxed text-ink-faint">
      {children}
    </p>
  );
}

export function DoseNote() {
  return (
    <Disclaimer>
      This planner organizes information only — it never suggests doses or medical decisions. Every
      dose you record should come from <em>your own provider or product label</em>. Questions belong
      with your licensed practitioner.
    </Disclaimer>
  );
}

/* —— Data-safety reminder ——
   Real risk, not hypothetical: this app stores data in browser storage only.
   Clearing site data, switching devices, or (on iOS Safari) simply not
   opening the app for a while can silently erase everything. A one-time
   "Export backup" button that nobody remembers to press isn't a safety
   net — this banner is, because it resurfaces until a backup actually
   happens. */
export function BackupBanner({
  daysSince,
  onExport,
}: {
  daysSince: number | null; // null = never backed up
  onExport: () => void;
}) {
  const stale = daysSince === null || daysSince >= 14;
  if (!stale) return null;
  const never = daysSince === null;
  return (
    <div className="ink-xl fade-up mb-6 flex flex-wrap items-center justify-between gap-3 border-2 border-blush-300/70 bg-blush-100/50 px-5 py-4 dark:bg-blush-500/10">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-200/70 text-blush-500 dark:bg-blush-500/25 dark:text-blush-200">
          <ShieldAlert size={16} />
        </span>
        <div>
          <p className="text-[0.9rem] font-semibold text-ink-strong">
            {never ? "Your data has never been backed up" : `Your last backup was ${daysSince} days ago`}
          </p>
          <p className="mt-0.5 max-w-md text-[0.8rem] leading-relaxed text-ink-soft">
            Everything here lives only in this browser. Clearing your browser data, switching
            devices, or your browser quietly clearing storage can erase it permanently — a backup
            takes ten seconds and protects months of tracking.
          </p>
        </div>
      </div>
      <Button variant="soft" onClick={onExport} className="shrink-0">
        <Download size={15} /> Back up now
      </Button>
    </div>
  );
}

/* —— Tabs —— */

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
}) {
  // Planner folder-tabs: each rests at its own slight tilt on a shared
  // baseline; the active section sits up straight, lifted, in wine, glowing.
  return (
    <div className="tab-row mb-6" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className="tab-folder"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* —— Searchable picker used by libraries —— */

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cx(inputBase, "max-w-md")}
    />
  );
}

/* Small helper for local form state */
export function useForm<T extends object>(initial: T) {
  const [form, setForm] = useState<T>(initial);
  const set = <K extends keyof T>(key: K, value: T[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  return { form, set, setForm };
}

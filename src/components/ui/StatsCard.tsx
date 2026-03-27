import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  label: string;
  value: string;
  description: string;
  accent?: "default" | "positive" | "negative" | "info";
  icon?: LucideIcon;
  meta?: string;
};

export default function StatsCard({
  label,
  value,
  description,
  accent = "default",
  icon: Icon,
  meta,
}: StatsCardProps) {
  const valueClass =
    accent === "positive"
      ? "text-emerald-400"
      : accent === "negative"
        ? "text-rose-400"
        : accent === "info"
          ? "text-blue-400"
          : "text-white";

  const iconWrapClass =
    accent === "positive"
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
      : accent === "negative"
        ? "border-rose-400/20 bg-rose-500/10 text-rose-300"
        : accent === "info"
          ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
          : "border-white/10 bg-white/5 text-slate-300";

  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_0_24px_rgba(15,23,42,0.28)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <p className={`mt-3 text-3xl font-bold tracking-tight ${valueClass}`}>
            {value}
          </p>
        </div>

        {Icon ? (
          <div
            className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${iconWrapClass}`}
          >
            <Icon size={18} />
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-slate-300">{description}</p>

      {meta ? (
        <p className="mt-3 text-xs font-medium text-slate-400">{meta}</p>
      ) : null}
    </article>
  );
}
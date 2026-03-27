import type { ReactNode } from "react";

type SectionCardProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function SectionCard({
  eyebrow,
  title,
  children,
  action,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:p-6 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
            {title}
          </h2>
        </div>

        {action ? <div>{action}</div> : null}
      </div>

      {children}
    </section>
  );
}

import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  aside,
}: PageHeaderProps) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:rounded-[2rem] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-tight">
            {title}
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            {description}
          </p>
        </div>

        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}
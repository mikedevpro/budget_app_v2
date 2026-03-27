import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export default function ErrorState({
  title = "Something went wrong",
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-100 shadow-[0_0_24px_rgba(244,63,94,0.08)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-300">
        Error
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-rose-200/90">{message}</p>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
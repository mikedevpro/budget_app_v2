"use client";

type ToastProps = {
  message: string;
  visible: boolean;
};

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`pointer-events-none fixed bottom-5 right-5 z-[60] transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0"
      }`}
    >
      <div className="rounded-2xl border border-emerald-400/20 bg-slate-950/95 px-4 py-3 shadow-[0_0_30px_rgba(16,185,129,0.18)] backdrop-blur-md">
        <p className="text-sm font-medium text-emerald-300">{message}</p>
      </div>
    </div>
  );
}
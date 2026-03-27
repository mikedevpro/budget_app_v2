import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-3rem)] items-center">
      <section className="w-full rounded-[2rem] border border-white/5 bg-white/5 p-6 shadow-[0_0_60px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:p-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          
          {/* LEFT SIDE — CONTENT */}
          <div className="max-w-xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Budget App v2
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl sm:leading-tight">
              A calmer, smarter way to track your spending.
            </h1>

            <p className="text-base leading-7 text-slate-300 sm:text-lg">
              A premium personal finance dashboard built with Next.js, TypeScript,
              and Supabase—designed to help you understand your money without
              overwhelming you.
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-2">
              {[
                "Real-time insights",
                "Persistent data",
                "Clean dashboard UI",
              ].map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs text-slate-300"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:bg-emerald-400"
              >
                Enter Dashboard
              </Link>

              <Link
                href="/expenses"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-[1px] hover:bg-slate-900/50"
              >
                Enter Expenses
              </Link>

              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-[1px] hover:bg-slate-900/50"
              >
                Sign In (Inactive)
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — MOCK DASHBOARD PREVIEW */}
          <div className="relative">
            <div className="rounded-[2rem] border border-white/5 bg-slate-950/40 p-4 shadow-[0_0_40px_rgba(15,23,42,0.5)] backdrop-blur-md">
              
              {/* Fake summary cards */}
              <div className="grid grid-cols-2 gap-3">
                {["Total Spent", "Remaining", "Top Category", "Transactions"].map(
                  (label) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/5 bg-white/5 p-3"
                    >
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        $— 
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Fake chart area */}
              <div className="mt-4 h-32 rounded-xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-blue-500/10" />

              {/* Fake transactions */}
              <div className="mt-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm text-slate-300">Transaction</span>
                    <span className="text-sm text-rose-400">-$—</span>
                  </div>
                ))}
              </div>
            </div>

            {/* glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_60%)]" />
          </div>
        </div>
      </section>
    </main>
  );
}

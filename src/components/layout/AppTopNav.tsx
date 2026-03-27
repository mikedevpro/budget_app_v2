"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/layout/SignOutButton";

type AppTopNavProps = {
  email?: string | null;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/insights", label: "Insights" },
];

export default function AppTopNav({ email }: AppTopNavProps) {
  const pathname = usePathname();

  return (
    <header className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 shadow-[0_0_24px_rgba(15,23,42,0.22)] backdrop-blur-sm sm:mb-8 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.25)]">
              B
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                Budget App v2
              </p>
              <p className="text-xs text-slate-400">
                Calm, modern personal finance
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-slate-300">
            {email || "Signed in"}
          </div>

          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

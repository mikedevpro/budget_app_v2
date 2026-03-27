"use client";

import SpendingByCategoryChart from "@/components/charts/SpendingByCategoryChart";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";

type Props = {
  chartData: { name: string; value: number }[];
  trendData: { date: string; total: number }[];
  totalSpent: number;
  averageExpense: number;
  expenseCount: number;
  topCategory: string;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_0_24px_rgba(15,23,42,0.28)] backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
    </article>
  );
}

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function InsightsPageShell({
  chartData,
  trendData,
  totalSpent,
  averageExpense,
  expenseCount,
  topCategory,
}: Props) {
  return (
    <main className="space-y-6 sm:space-y-8">
      <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:rounded-[2rem] sm:p-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
            Financial analytics
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-tight">
            Insights
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            Understand your spending patterns with a clearer view of categories,
            trends, and overall activity.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Spent"
          value={formatMoney(totalSpent)}
          description="Total across all recorded expenses"
        />
        <StatCard
          label="Average Expense"
          value={formatMoney(averageExpense)}
          description="Average amount per transaction"
        />
        <StatCard
          label="Transactions"
          value={String(expenseCount)}
          description="Recorded expenses in your dataset"
        />
        <StatCard
          label="Top Category"
          value={topCategory}
          description="Highest spend category overall"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard eyebrow="Breakdown" title="Spending by Category">
          <SpendingByCategoryChart data={chartData} />
        </SectionCard>

        <SectionCard eyebrow="Trend" title="Monthly Spending Trend">
          <MonthlyTrendChart data={trendData} />
        </SectionCard>
      </div>
    </main>
  );
}
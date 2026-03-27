"use client";

import SpendingByCategoryChart from "@/components/charts/SpendingByCategoryChart";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";
import EmptyState from "@/components/ui/EmptyState";
import StatsCard from "@/components/ui/StatsCard";
import { BarChart3, FolderOpen, Receipt, Wallet } from "lucide-react";

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
        <StatsCard
          label="Total Spent"
          value={formatMoney(totalSpent)}
          description="Total across all recorded expenses"
          icon={Wallet}
        />
        <StatsCard
          label="Average Expense"
          value={formatMoney(averageExpense)}
          description="Average amount per transaction"
          accent="info"
          icon={BarChart3}
        />
        <StatsCard
          label="Transactions"
          value={String(expenseCount)}
          description="Recorded expenses in your dataset"
          icon={Receipt}
        />
        <StatsCard
          label="Top Category"
          value={topCategory}
          description="Highest spend category overall"
          icon={FolderOpen}
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

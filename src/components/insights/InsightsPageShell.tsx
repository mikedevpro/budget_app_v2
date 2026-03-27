"use client";

import { useEffect, useState } from "react";
import { BarChart3, FolderOpen, Receipt, Target, Wallet } from "lucide-react";
import SpendingByCategoryChart from "@/components/charts/SpendingByCategoryChart";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";
import EditBudgetModal from "@/components/dashboard/EditBudgetModal";
import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import StatsCard from "@/components/ui/StatsCard";
import Toast from "@/components/ui/Toast";
import { formatMoney } from "@/lib/utils/formatters";

type Props = {
  chartData: { name: string; value: number }[];
  trendData: { date: string; total: number }[];
  totalSpent: number;
  averageExpense: number;
  expenseCount: number;
  topCategory: string;
  budgetAmount: number;
  budgetPeriod: "weekly" | "monthly" | "yearly";
  periodLabel: string;
  selectedRange: "period" | "7d" | "30d" | "90d" | "all";
};

export default function InsightsPageShell({
  chartData,
  trendData,
  totalSpent,
  averageExpense,
  expenseCount,
  topCategory,
  budgetAmount,
  budgetPeriod,
  periodLabel,
  selectedRange,
}: Props) {
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = window.setTimeout(() => {
      setToastMessage("");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  return (
    <main className="space-y-6 sm:space-y-8">
      <PageHeader
        eyebrow="Financial analytics"
        title="Insights"
        description="Understand your spending patterns with a clearer view of categories, trends, and overall activity."
        aside={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Monthly Budget
              </p>
              <p className="mt-1 font-medium text-white">
                {formatMoney(budgetAmount)}
              </p>
              <p className="mt-1 font-medium text-white">
                {budgetPeriod.charAt(0).toUpperCase() + budgetPeriod.slice(1)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setBudgetOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Edit Budget
            </button>

            <select
              value={selectedRange}
              onChange={(event) => {
                window.location.href = `/insights?range=${event.target.value}`;
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="period" className="bg-slate-900 text-white">
                Budget Period
              </option>
              <option value="7d" className="bg-slate-900 text-white">
                Last 7 Days
              </option>
              <option value="30d" className="bg-slate-900 text-white">
                Last 30 Days
              </option>
              <option value="90d" className="bg-slate-900 text-white">
                Last 90 Days
              </option>
              <option value="all" className="bg-slate-900 text-white">
                All Time
              </option>
            </select>
          </div>
        }
      />

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
        <StatsCard
          label="Monthly Budget"
          value={formatMoney(budgetAmount)}
          description="Current monthly limit"
          icon={Target}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard eyebrow="Breakdown" title="Spending by Category">
          <SpendingByCategoryChart data={chartData} />
        </SectionCard>

        <SectionCard eyebrow="Trend" title={`${periodLabel} Spending Trend`}>
          <MonthlyTrendChart data={trendData} />
        </SectionCard>

        <EditBudgetModal
          open={budgetOpen}
          onClose={() => setBudgetOpen(false)}
          initialValue={budgetAmount}
          initialPeriod={budgetPeriod}
          onSuccess={() => setToastMessage("Monthly budget updated successfully.")}
        />

        <Toast visible={!!toastMessage} message={toastMessage} />
      </div>
    </main>
  );
}

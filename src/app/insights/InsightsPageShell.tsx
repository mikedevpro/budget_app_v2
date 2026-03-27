"use client";

import { useEffect, useState } from "react";
import { BarChart3, FolderOpen, Receipt, Target, Wallet } from "lucide-react";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";
import SpendingByCategoryChart from "@/components/charts/SpendingByCategoryChart";
import EditBudgetModal from "@/components/dashboard/EditBudgetModal";
import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import StatsCard from "@/components/ui/StatsCard";
import Toast from "@/components/ui/Toast";
import type { BudgetPeriod, RelativeRange } from "@/lib/utils/dateRanges";
import { formatMoney } from "@/lib/utils/formatters";

type Props = {
  chartData: { name: string; value: number }[];
  trendData: { date: string; total: number }[];
  totalSpent: number;
  averageExpense: number;
  expenseCount: number;
  topCategory: string;
  budgetAmount: number;
  budgetPeriod: BudgetPeriod;
  periodLabel: string;
  selectedRange: RelativeRange;
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
    <>
      <main className="space-y-6 sm:space-y-8">
        <PageHeader
          eyebrow="Financial analytics"
          title="Insights"
          description="Understand your spending patterns with a clearer view of categories, trends, and overall activity."
          aside={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Budget Period
                </p>
                <p className="mt-1 font-medium text-white">{periodLabel}</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setBudgetOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Edit Budget
                </button>
              </div>
            </div>
          }
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatsCard
            label="Total Spent"
            value={formatMoney(totalSpent)}
            description={`Total for ${periodLabel.toLowerCase()}`}
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
            description="Recorded expenses in current view"
            icon={Receipt}
          />
          <StatsCard
            label="Top Category"
            value={topCategory}
            description={`Highest spend category for ${periodLabel.toLowerCase()}`}
            icon={FolderOpen}
          />
          <StatsCard
            label="Budget"
            value={formatMoney(budgetAmount)}
            description={`Current ${budgetPeriod} spending target`}
            icon={Target}
          />
        </section>

        <section className="sticky top-16 z-30 -mx-1 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-3 shadow-[0_0_24px_rgba(2,6,23,0.35)] backdrop-blur-md sm:top-20 sm:mx-0 sm:rounded-[1.75rem] sm:bg-white/5 sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 xl:w-auto xl:grid-cols-[220px]">
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
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard eyebrow="Breakdown" title="Spending by Category">
            <SpendingByCategoryChart data={chartData} />
          </SectionCard>

          <SectionCard eyebrow="Trend" title={`${periodLabel} Spending Trend`}>
            <MonthlyTrendChart data={trendData} />
          </SectionCard>
        </div>
      </main>

      <EditBudgetModal
        open={budgetOpen}
        onClose={() => setBudgetOpen(false)}
        initialValue={budgetAmount}
        initialPeriod={budgetPeriod}
        onSuccess={() => setToastMessage("Budget updated successfully.")}
      />

      <Toast visible={!!toastMessage} message={toastMessage} />
    </>
  );
}

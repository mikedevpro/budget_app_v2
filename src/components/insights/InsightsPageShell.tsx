"use client";

import SpendingByCategoryChart from "@/components/charts/SpendingByCategoryChart";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";
import EmptyState from "@/components/ui/EmptyState";
import SectionCard from "@/components/ui/SectionCard";
import StatsCard from "@/components/ui/StatsCard";
import { BarChart3, FolderOpen, Receipt, Wallet } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

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
      <PageHeader
        eyebrow="Financial analytics"
        title="Insights"
        description="Understand your spending patterns with a clearer view of categories, trends, and overall activity."
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

import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getExpenseAnalytics } from "@/lib/server/getExpenseAnalytics";
import { formatMoney } from "@/lib/utils/formatters";

type DashboardPageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const analytics = await getExpenseAnalytics(params.range);

  if (!analytics) {
    redirect("/login");
  }

  const summaryCards = [
    {
      label: "Total Spent",
      value: formatMoney(analytics.totalSpent),
      description: `${analytics.periodLabel} across ${analytics.expenseCount} transactions`,
    },
    {
      label: "Budget",
      value: formatMoney(analytics.budget.amount),
      description: `Current ${analytics.budget.period} spending target`,
    },
    {
      label: "Remaining",
      value: formatMoney(analytics.remaining),
      description: `Available for ${analytics.periodLabel.toLowerCase()}`,
      accent: analytics.remaining >= 0 ? "positive" : "negative",
    },
    {
      label: "Top Category",
      value: analytics.topCategory,
      description: `Highest spend category for ${analytics.periodLabel.toLowerCase()}`,
    },
  ] as const;

  return (
    <DashboardShell
      summaryCards={[...summaryCards]}
      transactions={analytics.recentExpenses}
      chartData={analytics.chartData}
      trendData={analytics.trendData}
      userEmail={analytics.userEmail}
      budgetAmount={analytics.budget.amount}
      budgetPeriod={analytics.budget.period}
      periodLabel={analytics.periodLabel}
      selectedRange={analytics.selectedRange}
    />
  );
}

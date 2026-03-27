import { redirect } from "next/navigation";
import AppTopNav from "@/components/layout/AppTopNav";
import InsightsPageShell from "@/components/insights/InsightsPageShell";
import { getExpenseAnalytics } from "@/lib/server/getExpenseAnalytics";

type InsightsPageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function InsightsPage({
  searchParams,
}: InsightsPageProps) {
  const params = await searchParams;
  const analytics = await getExpenseAnalytics(params.range);

  if (!analytics) {
    redirect("/login");
  }

  return (
    <>
      <AppTopNav email={analytics.userEmail} />
      <InsightsPageShell
        chartData={analytics.chartData}
        trendData={analytics.trendData}
        totalSpent={analytics.totalSpent}
        averageExpense={analytics.averageExpense}
        expenseCount={analytics.expenseCount}
        topCategory={analytics.topCategory}
        budgetAmount={analytics.budget.amount}
        budgetPeriod={analytics.budget.period}
        periodLabel={analytics.periodLabel}
        selectedRange={analytics.selectedRange}
      />
    </>
  );
}

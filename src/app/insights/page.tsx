import { redirect } from "next/navigation";
import AppTopNav from "@/components/layout/AppTopNav";
import InsightsPageShell from "@/components/insights/InsightsPageShell";
import { createClient } from "@/lib/supabase/server";
import {
  formatBudgetPeriodLabel,
  getPeriodDateRange,
  getRelativeRangeStart,
  isDateWithinRange,
  type RelativeRange,
  type BudgetPeriod,
} from "@/lib/utils/dateRanges";

function formatShortLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

type InsightsPageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function InsightsPage({
  searchParams,
}: InsightsPageProps) {
  const params = await searchParams;
  const selectedRange = (params.range ?? "period") as RelativeRange;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let budgetRow:
    | { monthly_limit?: number | string | null; period?: string | null }
    | null = null;

  const { data: budgetWithPeriod, error: budgetWithPeriodError } = await supabase
    .from("budgets")
    .select("monthly_limit, period")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (budgetWithPeriodError) {
    const message = String(budgetWithPeriodError.message ?? "").toLowerCase();

    if (message.includes("column") && message.includes("period")) {
      const { data: budgetWithoutPeriod } = await supabase
        .from("budgets")
        .select("monthly_limit")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      budgetRow = budgetWithoutPeriod;
    } else {
      console.error("Failed to load budget:", budgetWithPeriodError);
    }
  } else {
    budgetRow = budgetWithPeriod;
  }

  const budgetAmount = budgetRow?.monthly_limit
    ? Number(budgetRow.monthly_limit)
    : 2000;

  const budgetPeriod: BudgetPeriod =
    budgetRow?.period === "weekly" ||
    budgetRow?.period === "monthly" ||
    budgetRow?.period === "yearly"
      ? budgetRow.period
      : "monthly";

  const { data, error } = await supabase
    .from("expenses")
    .select("id, name, category, amount, spent_at")
    .eq("user_id", user.id)
    .order("spent_at", { ascending: false });

  if (error) {
    console.error("Failed to load insights data:", error);
  }

  const expenses =
    data?.map((expense) => ({
      id: expense.id,
      name: expense.name,
      category: expense.category,
      amount: Number(expense.amount),
      spentAt: expense.spent_at,
    })) ?? [];

  let filteredExpenses = expenses;

  if (selectedRange === "period") {
    const { start, end } = getPeriodDateRange(budgetPeriod);
    filteredExpenses = expenses.filter((item) =>
      isDateWithinRange(item.spentAt, start, end)
    );
  } else if (selectedRange !== "all") {
    const start = getRelativeRangeStart(selectedRange);
    filteredExpenses = expenses.filter(
      (item) => !!start && new Date(item.spentAt) >= start
    );
  }

  const totalSpent = filteredExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const averageExpense = filteredExpenses.length
    ? totalSpent / filteredExpenses.length
    : 0;

  const categoryTotals = filteredExpenses.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const topCategory = chartData[0]?.name ?? "None";

  const trendMap = filteredExpenses.reduce<Record<string, number>>(
    (acc, item) => {
      const dayKey = new Date(item.spentAt).toISOString().slice(0, 10);
      acc[dayKey] = (acc[dayKey] || 0) + item.amount;
      return acc;
    },
    {}
  );

  const trendData = Object.entries(trendMap)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, total]) => ({
      date: formatShortLabel(date),
      total: Number(total.toFixed(2)),
    }));

  const rangeLabelMap: Record<RelativeRange, string> = {
    period: formatBudgetPeriodLabel(budgetPeriod),
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    all: "All Time",
  };

  const periodLabel = rangeLabelMap[selectedRange];

  return (
    <>
      <AppTopNav email={user.email ?? null} />
      <InsightsPageShell
        chartData={chartData}
        trendData={trendData}
        totalSpent={totalSpent}
        averageExpense={averageExpense}
        expenseCount={filteredExpenses.length}
        topCategory={topCategory}
        budgetAmount={budgetAmount}
        budgetPeriod={budgetPeriod}
        periodLabel={periodLabel}
        selectedRange={selectedRange}
      />
    </>
  );
}
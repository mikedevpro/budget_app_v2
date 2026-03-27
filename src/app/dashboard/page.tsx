import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import {
  formatBudgetPeriodLabel,
  getPeriodDateRange,
  getRelativeRangeStart,
  isDateWithinRange,
  type RelativeRange,
  type BudgetPeriod,
} from "@/lib/utils/dateRanges";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatShortLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

type DashboardPageProps = {
  searchParams: Promise<{ range?: string }>;
};

type ExpenseRow = {
  id: string;
  name: string;
  category: string;
  amount: number;
  spentAt: string;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
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

  const { data: expenseRows, error: expensesError } = await supabase
    .from("expenses")
    .select("id, name, category, amount, spent_at")
    .eq("user_id", user.id)
    .order("spent_at", { ascending: false });

  if (expensesError) {
    console.error("Failed to load expenses:", expensesError);
  }

  const allTransactions: ExpenseRow[] =
    expenseRows?.map((expense) => ({
      id: expense.id,
      name: expense.name,
      category: expense.category,
      amount: Number(expense.amount),
      spentAt: expense.spent_at,
    })) ?? [];

  let filteredTransactions = allTransactions;

  if (selectedRange === "period") {
    const { start, end } = getPeriodDateRange(budgetPeriod);
    filteredTransactions = allTransactions.filter((item) =>
      isDateWithinRange(item.spentAt, start, end)
    );
  } else if (selectedRange !== "all") {
    const start = getRelativeRangeStart(selectedRange);
    filteredTransactions = allTransactions.filter(
      (item) => !!start && new Date(item.spentAt) >= start
    );
  }

  const totalSpent = filteredTransactions.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const remaining = budgetAmount - totalSpent;

  const categoryTotals = filteredTransactions.reduce<Record<string, number>>(
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

  const trendMap = filteredTransactions.reduce<Record<string, number>>(
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

  const recentTransactions = filteredTransactions.slice(0, 5);

  const rangeLabelMap: Record<RelativeRange, string> = {
    period: formatBudgetPeriodLabel(budgetPeriod),
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    all: "All Time",
  };

  const periodLabel = rangeLabelMap[selectedRange];
  const userEmail = user.email ?? null;

  const summaryCards = [
    {
      label: "Total Spent",
      value: formatMoney(totalSpent),
      description: `${periodLabel} across ${filteredTransactions.length} transactions`,
    },
    {
      label: "Budget",
      value: formatMoney(budgetAmount),
      description: `Current ${budgetPeriod} spending target`,
    },
    {
      label: "Remaining",
      value: formatMoney(remaining),
      description: `Available for ${periodLabel.toLowerCase()}`,
      accent: remaining >= 0 ? "positive" : "negative",
    },
    {
      label: "Top Category",
      value: topCategory,
      description: `Highest spend category for ${periodLabel.toLowerCase()}`,
    },
  ] as const;

  return (
    <DashboardShell
      summaryCards={[...summaryCards]}
      transactions={recentTransactions}
      chartData={chartData}
      trendData={trendData}
      userEmail={userEmail}
      budgetAmount={budgetAmount}
      budgetPeriod={budgetPeriod}
      periodLabel={periodLabel}
      selectedRange={selectedRange}
    />
  );
}
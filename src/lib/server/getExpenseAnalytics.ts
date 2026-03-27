import { createClient } from "@/lib/supabase/server";
import {
  formatBudgetPeriodLabel,
  getPeriodDateRange,
  getRelativeRangeStart,
  isDateWithinRange,
  type BudgetPeriod,
  type RelativeRange,
} from "@/lib/utils/dateRanges";
import { formatShortDate } from "@/lib/utils/formatters";

export type ExpenseRecord = {
  id: string;
  name: string;
  category: string;
  amount: number;
  spentAt: string;
};

export type BudgetRecord = {
  amount: number;
  period: BudgetPeriod;
};

export type ExpenseAnalyticsResult = {
  userEmail: string | null;
  budget: BudgetRecord;
  periodLabel: string;
  selectedRange: RelativeRange;
  filteredExpenses: ExpenseRecord[];
  recentExpenses: ExpenseRecord[];
  totalSpent: number;
  averageExpense: number;
  remaining: number;
  expenseCount: number;
  topCategory: string;
  chartData: { name: string; value: number }[];
  trendData: { date: string; total: number }[];
};

function normalizeBudgetPeriod(value: string | null | undefined): BudgetPeriod {
  if (value === "weekly" || value === "monthly" || value === "yearly") {
    return value;
  }
  return "monthly";
}

export async function getExpenseAnalytics(
  rangeInput: string | undefined
): Promise<ExpenseAnalyticsResult | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
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

  const budgetPeriod = normalizeBudgetPeriod(budgetRow?.period);

  const { data: expenseRows, error: expensesError } = await supabase
    .from("expenses")
    .select("id, name, category, amount, spent_at")
    .eq("user_id", user.id)
    .order("spent_at", { ascending: false });

  if (expensesError) {
    console.error("Failed to load expenses:", expensesError);
  }

  const allExpenses: ExpenseRecord[] =
    expenseRows?.map((expense) => ({
      id: expense.id,
      name: expense.name,
      category: expense.category,
      amount: Number(expense.amount),
      spentAt: expense.spent_at,
    })) ?? [];

  const selectedRange: RelativeRange =
    rangeInput === "7d" ||
    rangeInput === "30d" ||
    rangeInput === "90d" ||
    rangeInput === "all" ||
    rangeInput === "period"
      ? rangeInput
      : "period";

  let filteredExpenses = allExpenses;

  if (selectedRange === "period") {
    const { start, end } = getPeriodDateRange(budgetPeriod);
    filteredExpenses = allExpenses.filter((item) =>
      isDateWithinRange(item.spentAt, start, end)
    );
  } else if (selectedRange !== "all") {
    const start = getRelativeRangeStart(selectedRange);
    filteredExpenses = allExpenses.filter(
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

  const remaining = budgetAmount - totalSpent;

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
      date: formatShortDate(date),
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

  return {
    userEmail: user.email ?? null,
    budget: {
      amount: budgetAmount,
      period: budgetPeriod,
    },
    periodLabel,
    selectedRange,
    filteredExpenses,
    recentExpenses: filteredExpenses.slice(0, 5),
    totalSpent,
    averageExpense,
    remaining,
    expenseCount: filteredExpenses.length,
    topCategory,
    chartData,
    trendData,
  };
}
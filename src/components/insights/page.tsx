import { redirect } from "next/navigation";
import AppTopNav from "@/components/layout/AppTopNav";
import InsightsPageShell from "@/components/insights/InsightsPageShell";
import { createClient } from "@/lib/supabase/server";
import { formatBudgetPeriodLabel } from "@/lib/utils/dateRanges";

function formatShortLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export default async function InsightsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let budgetRow: { monthly_limit?: number | string | null; period?: string | null } | null =
    null;

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
  const budgetPeriod =
    budgetRow?.period === "weekly" ||
    budgetRow?.period === "monthly" ||
    budgetRow?.period === "yearly"
      ? budgetRow.period
      : "monthly";

  const { data, error } = await supabase
    .from("expenses")
    .select("id, name, category, amount, spent_at")
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

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const averageExpense = expenses.length ? totalSpent / expenses.length : 0;

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";

  const trendMap = expenses.reduce<Record<string, number>>((acc, item) => {
    const dayKey = new Date(item.spentAt).toISOString().slice(0, 10);
    acc[dayKey] = (acc[dayKey] || 0) + item.amount;
    return acc;
  }, {});

  const trendData = Object.entries(trendMap)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, total]) => ({
      date: formatShortLabel(date),
      total: Number(total.toFixed(2)),
    }));

  return (
    <>
      <AppTopNav email={user.email ?? null} />
      <InsightsPageShell
        chartData={chartData}
        trendData={trendData}
        totalSpent={totalSpent}
        averageExpense={averageExpense}
        expenseCount={expenses.length}
        topCategory={topCategory}
        budgetAmount={budgetAmount}
        budgetPeriod={budgetPeriod}
        periodLabel={formatBudgetPeriodLabel(budgetPeriod)}
        selectedRange="period"
      />
    </>
  );
}

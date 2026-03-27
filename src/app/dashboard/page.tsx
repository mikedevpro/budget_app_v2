import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";

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

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: budgetRow } = await supabase
  .from("budgets")
  .select("monthly_limit")
  .eq("user_id", user.id)
  .maybeSingle();

  const monthlyBudget = budgetRow?.monthly_limit
    ? Number(budgetRow.monthly_limit)
    : 2000;

  const userEmail = user.email ?? null;

  const { data } = await supabase
    .from("expenses")
    .select("id, name, category, amount, spent_at")
    .order("spent_at", { ascending: false })
    .limit(5);

  const transactions =
    data?.map((expense) => ({
      id: expense.id,
      name: expense.name,
      category: expense.category,
      amount: Number(expense.amount),
      spentAt: expense.spent_at,
    })) ?? [];

  const totalSpent = transactions.reduce((sum, item) => sum + item.amount, 0);
  // const monthlyBudget = 2000;
  const remaining = monthlyBudget - totalSpent;

  const categoryTotals = transactions.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const trendMap = transactions.reduce<Record<string, number>>((acc, item) => {
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

  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";

  const summaryCards = [
    {
      label: "Total Spent",
      value: formatMoney(totalSpent),
      description: `Across ${transactions.length} recent transactions`,
      meta: "+12% from last month",
    },
    {
      label: "Monthly Budget",
      value: formatMoney(monthlyBudget),
      description: "Your current target for this period",
    },
    {
      label: "Remaining",
      value: formatMoney(remaining),
      description: "Still available before reaching budget",
      accent: remaining >= 0 ? "positive" : "negative",
    },
    {
      label: "Top Category",
      value: topCategory,
      description: "Highest spend category in current view",
    },
  ] as const;

  return (
    <DashboardShell
      summaryCards={[...summaryCards]}
      transactions={transactions}
      chartData={chartData}
      trendData={trendData}
      userEmail={userEmail}
      monthlyBudget={monthlyBudget}
    />
  );
}

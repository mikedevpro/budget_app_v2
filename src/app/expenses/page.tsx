import { redirect } from "next/navigation";
import AppTopNav from "@/components/layout/AppTopNav";
import ExpensesPageShell from "@/components/expenses/ExpensesPageShell";
import { createClient } from "@/lib/supabase/server";

export default async function ExpensesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("id, name, category, amount, spent_at")
    .order("spent_at", { ascending: false });

  if (error) {
    console.error("Failed to load expenses:", error);
  }

  const expenses =
    data?.map((expense) => ({
      id: expense.id,
      name: expense.name,
      category: expense.category,
      amount: Number(expense.amount),
      spentAt: expense.spent_at,
    })) ?? [];

  return (
    <>
      <AppTopNav email={user.email ?? null} />
      <ExpensesPageShell expenses={expenses} />
    </>
  );
}
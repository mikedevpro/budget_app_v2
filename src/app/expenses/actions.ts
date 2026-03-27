"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteExpense(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to delete an expense.");
  }

  const expenseId = String(formData.get("expenseId") ?? "").trim();

  if (!expenseId) {
    throw new Error("Missing expense id.");
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete expense:", error);
    throw new Error("Failed to delete expense.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
}

type UpdateExpenseState = {
  error?: string;
  success?: boolean;
};

export async function updateExpense(
  _prevState: UpdateExpenseState,
  formData: FormData
): Promise<UpdateExpenseState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be signed in to edit an expense." };
  }

  const expenseId = String(formData.get("expenseId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "General").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const spentAtRaw = String(formData.get("spent_at") ?? "").trim();

  if (!expenseId) {
    return { error: "Missing expense id." };
  }

  if (!name) {
    return { error: "Expense name is required." };
  }

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Amount must be greater than 0." };
  }

  const spentAt = spentAtRaw
    ? new Date(`${spentAtRaw}T12:00:00`).toISOString()
    : new Date().toISOString();

  const { error } = await supabase
    .from("expenses")
    .update({
      name,
      category: category || "General",
      amount,
      spent_at: spentAt,
    })
    .eq("id", expenseId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to update expense:", error);
    return { error: "Failed to update expense." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/expenses");

  return { success: true };
}

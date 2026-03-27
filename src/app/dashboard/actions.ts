"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = {
  error?: string;
  success?: boolean;
};

export async function addExpense(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("addExpense user:", user?.id, userError);

    if (userError || !user) {
      return { error: "You must be signed in to add an expense." };
    }

    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "General").trim();
    const amountRaw = String(formData.get("amount") ?? "").trim();
    const spentAtRaw = String(formData.get("spent_at") ?? "").trim();

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

    const payload = {
      user_id: user.id,
      name,
      category: category || "General",
      amount,
      spent_at: spentAt,
    };

    console.log("addExpense payload:", payload);

    const { data, error } = await supabase
      .from("expenses")
      .insert(payload)
      .select();

    console.log("addExpense insert result:", data, error);

    if (error) {
      return { error: `Failed to save expense: ${error.message}` };
    }

    revalidatePath("/dashboard");
    revalidatePath("/expenses");

    return { success: true };
  } catch (error) {
    console.error("addExpense unexpected error:", error);
    return { error: "Something unexpected went wrong while saving." };
  }
}

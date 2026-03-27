"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type BudgetActionState = {
  error?: string;
  success?: boolean;
};

export async function saveMonthlyBudget(
  _prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update your budget." };
  }

  const monthlyLimitRaw = String(formData.get("monthly_limit") ?? "").trim();
  const monthlyLimit = Number(monthlyLimitRaw);

  if (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0) {
    return { error: "Monthly budget must be greater than 0." };
  }

  const { data: existingBudget, error: fetchError } = await supabase
    .from("budgets")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("Failed to fetch budget:", fetchError);
    return { error: "Unable to load current budget." };
  }

  if (existingBudget?.id) {
    const { error: updateError } = await supabase
      .from("budgets")
      .update({
        monthly_limit: monthlyLimit,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingBudget.id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to update budget:", updateError);
      return { error: "Unable to update monthly budget." };
    }
  } else {
    const { error: insertError } = await supabase.from("budgets").insert({
      user_id: user.id,
      monthly_limit: monthlyLimit,
    });

    if (insertError) {
      console.error("Failed to create budget:", insertError);
      return { error: "Unable to save monthly budget." };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/insights");

  return { success: true };
}
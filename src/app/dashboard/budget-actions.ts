"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type BudgetActionState = {
  error?: string;
  success?: boolean;
};

type SupabaseErrorLike = {
  message?: string;
  code?: string;
} | null;

function isMissingPeriodColumn(error: SupabaseErrorLike) {
  if (!error) return false;
  const message = String(error.message ?? "").toLowerCase();
  const code = String(error.code ?? "").toLowerCase();

  return (
    (message.includes("column") && message.includes("period")) ||
    code === "42703" ||
    code === "pgrst204"
  );
}

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
  const period = String(formData.get("period") ?? "monthly")
    .trim()
    .toLowerCase();
  const monthlyLimit = Number(monthlyLimitRaw);

  if (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0) {
    return { error: "Monthly budget must be greater than 0." };
  }

  if (!["weekly", "monthly", "yearly"].includes(period)) {
    return { error: "Invalid budget period." };
  }

  const { data: existingRows, error: fetchError } = await supabase
    .from("budgets")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (fetchError) {
    console.error("Failed to fetch budget:", fetchError);
    return { error: `Unable to load current budget: ${fetchError.message}` };
  }

  const existingBudget = existingRows?.[0] ?? null;

  if (existingBudget?.id) {
    const basePayload = {
      monthly_limit: monthlyLimit,
      updated_at: new Date().toISOString(),
    };

    const { error: updateWithPeriodError } = await supabase
      .from("budgets")
      .update({
        ...basePayload,
        period,
      })
      .eq("id", existingBudget.id)
      .eq("user_id", user.id);

    let updateError = updateWithPeriodError;

    if (isMissingPeriodColumn(updateError)) {
      const { error: fallbackError } = await supabase
        .from("budgets")
        .update(basePayload)
        .eq("id", existingBudget.id)
        .eq("user_id", user.id);
      updateError = fallbackError;
    }

    if (updateError) {
      console.error("Failed to update budget:", updateError);
      return { error: `Unable to update monthly budget: ${updateError.message}` };
    }
  } else {
    const basePayload = {
      user_id: user.id,
      monthly_limit: monthlyLimit,
    };

    const { error: insertWithPeriodError } = await supabase.from("budgets").insert({
      ...basePayload,
      period,
    });

    let insertError = insertWithPeriodError;

    if (isMissingPeriodColumn(insertError)) {
      const { error: fallbackError } = await supabase
        .from("budgets")
        .insert(basePayload);
      insertError = fallbackError;
    }

    if (insertError) {
      console.error("Failed to create budget:", insertError);
      return { error: `Unable to save monthly budget: ${insertError.message}` };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/insights");

  return { success: true };
}

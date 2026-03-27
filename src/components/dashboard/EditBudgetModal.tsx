"use client";

import { useActionState, useEffect, useState } from "react";
import { saveMonthlyBudget } from "@/app/dashboard/budget-actions";
import ErrorState from "@/components/ui/ErrorState";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValue: number;
  onSuccess?: () => void;
};

const initialState = {
  error: "",
  success: false,
};

export default function EditBudgetModal({
  open,
  onClose,
  initialValue,
  onSuccess,
}: Props) {
  const [state, formAction, pending] = useActionState(
    saveMonthlyBudget,
    initialState
  );
  const [monthlyLimit, setMonthlyLimit] = useState(String(initialValue));

  useEffect(() => {
    setMonthlyLimit(String(initialValue));
  }, [initialValue, open]);

  useEffect(() => {
    if (state.success) {
      onClose();
      onSuccess?.();
    }
  }, [state.success, onClose, onSuccess]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_0_40px_rgba(2,6,23,0.45)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Budget Settings
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Update monthly budget
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Set a monthly budget that matches your current financial goal.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="monthly-limit"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Monthly budget
            </label>
            <input
              id="monthly-limit"
              name="monthly_limit"
              type="number"
              inputMode="decimal"
              min="1"
              step="0.01"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </div>

          {state.error ? (
            <ErrorState
              title="Unable to update budget"
              message={state.error}
            />
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
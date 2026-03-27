"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { addExpense } from "@/app/dashboard/actions";
import { getCategoryOptions } from "@/lib/utils/categories";
import ErrorState from "@/components/ui/ErrorState";

type AddExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const initialState = {
  error: "",
  success: false,
};

export default function AddExpenseModal({
  open,
  onClose,
  onSuccess,
}: AddExpenseModalProps) {
  const categoryOptions = getCategoryOptions().filter(
    (option) => option !== "Income"
  );
  const [state, formAction, pending] = useActionState(addExpense, initialState);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [spentAt, setSpentAt] = useState("");

  useEffect(() => {
    if (state.success) {
      setName("");
      setAmount("");
      setCategory("General");
      setSpentAt("");
      onClose();
      onSuccess?.();
    }
  }, [state.success, onClose, onSuccess]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_0_40px_rgba(2,6,23,0.45)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              New Expense
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Add an expense
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Log a new transaction and keep your dashboard up to date.
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
              htmlFor="expense-name"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Expense name
            </label>
            <input
              id="expense-name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Groceries"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="expense-amount"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Amount
              </label>
              <input
                id="expense-amount"
                name="amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="42.50"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <div>
              <label
                htmlFor="expense-category"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Category
              </label>
              <select
                id="expense-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option} className="bg-slate-900 text-white">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="expense-date"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Date
            </label>
            <input
              id="expense-date"
              name="spent_at"
              type="date"
              value={spentAt}
              onChange={(e) => setSpentAt(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          {state.error ? (
            <ErrorState
              title="Unable to save expense"
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
              {pending ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

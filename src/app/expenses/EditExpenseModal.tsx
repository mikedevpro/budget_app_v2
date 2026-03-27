"use client";

import { useActionState, useEffect, useState } from "react";
import { updateExpense } from "@/app/expenses/edit-actions";

type Expense = {
  id: string;
  name: string;
  category: string;
  amount: number;
  spentAt: string;
};

type Props = {
  expense: Expense | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const initialState = {
  error: "",
  success: false,
};

function toDateInputValue(value: string) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export default function EditExpenseModal({
  expense,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [state, formAction, pending] = useActionState(updateExpense, initialState);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [spentAt, setSpentAt] = useState("");

  useEffect(() => {
    if (!expense) return;

    setName(expense.name);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setSpentAt(toDateInputValue(expense.spentAt));
  }, [expense]);

  useEffect(() => {
    if (state.success) {
      onClose();
      onSuccess?.();
    }
  }, [state.success, onClose, onSuccess]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_0_40px_rgba(2,6,23,0.45)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Edit Expense
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Update expense
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Make changes and keep your records accurate.
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
          <input type="hidden" name="expenseId" value={expense.id} />

          <div>
            <label htmlFor="edit-expense-name" className="mb-2 block text-sm font-medium text-slate-200">
              Expense name
            </label>
            <input
              id="edit-expense-name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-expense-amount" className="mb-2 block text-sm font-medium text-slate-200">
                Amount
              </label>
              <input
                id="edit-expense-amount"
                name="amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-expense-category" className="mb-2 block text-sm font-medium text-slate-200">
                Category
              </label>
              <select
                id="edit-expense-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              >
                <option className="bg-slate-900 text-white">General</option>
                <option className="bg-slate-900 text-white">Food</option>
                <option className="bg-slate-900 text-white">Transportation</option>
                <option className="bg-slate-900 text-white">Utilities</option>
                <option className="bg-slate-900 text-white">Subscriptions</option>
                <option className="bg-slate-900 text-white">Entertainment</option>
                <option className="bg-slate-900 text-white">Health</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="edit-expense-date" className="mb-2 block text-sm font-medium text-slate-200">
              Date
            </label>
            <input
              id="edit-expense-date"
              name="spent_at"
              type="date"
              value={spentAt}
              onChange={(e) => setSpentAt(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          {state.error ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-200">
              {state.error}
            </div>
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
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
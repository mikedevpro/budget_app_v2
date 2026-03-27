"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { deleteExpense } from "@/app/expenses/actions";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";
import EditExpenseModal from "@/components/expenses/EditExpenseModal";
import EmptyState from "@/components/ui/EmptyState";
import Toast from "@/components/ui/Toast";
import CategoryBadge from "@/components/ui/CategoryBadge";

type Expense = {
  id: string;
  name: string;
  category: string;
  amount: number;
  spentAt: string;
};

type Props = {
  expenses: Expense[];
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function EditExpenseButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-emerald-500/10 hover:text-emerald-300"
      aria-label="Edit expense"
      title="Edit expense"
    >
      <Pencil size={16} />
    </button>
  );
}

function DeleteExpenseButton({
  expenseId,
  onSuccess,
}: {
  expenseId: string;
  onSuccess?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const confirmed = window.confirm(
          "Delete this expense? This action cannot be undone."
        );

        if (!confirmed) return;

        startTransition(async () => {
          const formData = new FormData();
          formData.append("expenseId", expenseId);
          await deleteExpense(formData);
          onSuccess?.();
        });
      }}
      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Delete expense"
      title="Delete expense"
    >
      <Trash2 size={16} />
    </button>
  );
}

export default function ExpensesPageShell({ expenses }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("newest");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const categories = useMemo(() => {
    return [
      "All Categories",
      ...Array.from(new Set(expenses.map((expense) => expense.category))).sort(),
    ];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    let next = [...expenses];

    const term = search.trim().toLowerCase();

    if (term) {
      next = next.filter(
        (expense) =>
          expense.name.toLowerCase().includes(term) ||
          expense.category.toLowerCase().includes(term)
      );
    }

    if (category !== "All Categories") {
      next = next.filter((expense) => expense.category === category);
    }

    next.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime();
      }

      if (sort === "oldest") {
        return new Date(a.spentAt).getTime() - new Date(b.spentAt).getTime();
      }

      if (sort === "highest") {
        return b.amount - a.amount;
      }

      if (sort === "lowest") {
        return a.amount - b.amount;
      }

      return 0;
    });

    return next;
  }, [expenses, search, category, sort]);

  const totalVisible = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <>
      <main className="space-y-6 sm:space-y-8">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:rounded-[2rem] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
              Expense management
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-tight">
              Expenses
            </h1>

            <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
              Search, filter, and review your full expense history in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Visible Total
              </p>
              <p className="mt-1 font-medium text-white">
                {formatMoney(totalVisible)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Add Expense
              </button>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Results
                </p>
                <p className="mt-1 font-medium text-white">
                  {filteredExpenses.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

        <section className="sticky top-16 z-30 -mx-1 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-3 shadow-[0_0_24px_rgba(2,6,23,0.35)] backdrop-blur-md sm:top-20 sm:mx-0 sm:rounded-[1.75rem] sm:bg-white/5 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search expenses..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[200px_180px]">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            >
              {categories.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="bg-slate-900 text-white"
                >
                  {option}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="newest" className="bg-slate-900 text-white">
                Newest First
              </option>
              <option value="oldest" className="bg-slate-900 text-white">
                Oldest First
              </option>
              <option value="highest" className="bg-slate-900 text-white">
                Highest Amount
              </option>
              <option value="lowest" className="bg-slate-900 text-white">
                Lowest Amount
              </option>
            </select>
          </div>
        </div>
      </section>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Full History
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              All Expenses
            </h2>
          </div>
        </div>

        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="px-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Name
                  </th>
                  <th className="px-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Category
                  </th>
                  <th className="px-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Date
                  </th>
                  <th className="px-4 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Amount
                  </th>
                  <th className="px-4 text-right text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/30 transition hover:bg-slate-900/40"
                  >
                    <td className="rounded-l-2xl px-4 py-4 text-sm font-semibold text-white">
                      {expense.name}
                    </td>
                    <td className="px-4 py-4">
                      <CategoryBadge category={expense.category} />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-300">
                      {formatDate(expense.spentAt)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-semibold text-rose-400">
                      -{formatMoney(expense.amount)}
                    </td>
                    <td className="rounded-r-2xl px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <EditExpenseButton
                          onClick={() => {
                            setSelectedExpense(expense);
                            setEditOpen(true);
                          }}
                        />
                        <DeleteExpenseButton
                          expenseId={expense.id}
                          onSuccess={() => setToastMessage("Expense deleted successfully.")}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            eyebrow="No Results"
            title="No expenses match your current filters"
            description="Try another search term or choose a different category."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                  setSort("newest");
                }}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Reset Filters
              </button>
            }
          />
        )}
        </section>
      </main>

      <AddExpenseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => setToastMessage("Expense added successfully.")}
      />

      <EditExpenseModal
        expense={selectedExpense}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedExpense(null);
        }}
        onSuccess={() => setToastMessage("Expense updated successfully.")}
      />

      <Toast visible={!!toastMessage} message={toastMessage} />
    </>
  );
}

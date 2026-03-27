"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Edit, Pencil, Trash2 } from "lucide-react";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";
import SpendingByCategoryChart from "@/components/charts/SpendingByCategoryChart";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";
import Toast from "@/components/ui/Toast";
import AppTopNav from "@/components/layout/AppTopNav";
import { deleteExpense } from "@/app/expenses/actions";
import CategoryBadge from "@/components/ui/CategoryBadge";
import SectionCard from "@/components/ui/SectionCard";
import StatsCard from "@/components/ui/StatsCard";
import { DollarSign, FolderOpen, Target, Wallet } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { exportExpensesToCsv } from "@/lib/utils/exportExpensesToCsv";
import EditBudgetModal from "@/components/dashboard/EditBudgetModal";
import { formatMoney, formatShortDate } from "@/lib/utils/formatters";

type SummaryCardData = {
  label: string;
  value: string;
  description: string;
  meta?: string;
  accent?: "default" | "positive" | "negative" | "info";
};

type Transaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  spentAt: string;
};

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

function RecentTransactionsCard({
  transactions,
  onDeleteSuccess,
}: {
  transactions: Transaction[];
  onDeleteSuccess?: () => void;
}) {
  return (
    <SectionCard
      eyebrow="Activity"
      title="Recent Transactions"
      action={
        <Link
          href="/expenses"
          className="hidden rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:inline-flex"
        >
          View all
        </Link>
      }
    >
      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 transition hover:-translate-y-[1px] hover:bg-slate-900/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {transaction.name}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <CategoryBadge category={transaction.category} />
                  <span className="text-xs text-slate-400">
                    {formatShortDate(transaction.spentAt)}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-rose-400">
                  -{formatMoney(transaction.amount)}
                </p>
                <div className="mt-2 flex justify-end gap-2">
                  <EditExpenseButton onClick={() => undefined} />
                  <DeleteExpenseButton
                    expenseId={transaction.id}
                    onSuccess={onDeleteSuccess}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/20 p-6 text-center">
          <p className="text-sm font-medium text-white">No transactions yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Add your first expense to start building your spending history.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

export default function DashboardShell({
  summaryCards,
  transactions,
  chartData,
  trendData,
  userEmail,
  budgetAmount,
  budgetPeriod,
  periodLabel,
  selectedRange,
}: {
  summaryCards: SummaryCardData[];
  transactions: Transaction[];
  chartData: { name: string; value: number }[];
  trendData: { date: string; total: number }[];
  userEmail: string | null;
  budgetAmount: number;
  budgetPeriod: "weekly" | "monthly" | "yearly";
  periodLabel: string;
  selectedRange: "period" | "7d" | "30d" | "90d" | "all";
}) {
  const [open, setOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = window.setTimeout(() => {
      setToastMessage("");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  function handleExpenseAdded() {
    setToastMessage("Expense added successfully.");
  }

  return (
    <>
      <AppTopNav email={userEmail} />

      <main className="space-y-6 sm:space-y-8">
        <PageHeader
          eyebrow="Personal finance dashboard"
          title="Budget Dashboard"
          description="Track spending, monitor trends, and stay in control with a calmer, more polished financial dashboard built for clarity."
          aside={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Snapshot
                </p>
                <p className="mt-1 font-medium text-white">
                  Budget {formatMoney(budgetAmount)}
                </p>
                <p className="mt-1 font-medium text-white">{periodLabel}</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-emerald-400"
                >
                  Add Expense
                </button>

                <button
                  type="button"
                  onClick={() => setBudgetOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Edit Budget
                </button>

                <button
                  type="button"
                  onClick={() => exportExpensesToCsv(transactions, "budget-dashboard-expenses.csv")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Export CSV
                </button>
              </div>
            </div>
          }
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const iconMap = {
              "Total Spent": Wallet,
              "Monthly Budget": Target,
              "Remaining": DollarSign,
              "Top Category": FolderOpen,
            };

            const Icon = iconMap[card.label as keyof typeof iconMap];

            return (
              <StatsCard
                key={card.label}
                label={card.label}
                value={card.value}
                description={card.description}
                meta={card.meta}
                accent={card.accent}
                icon={Icon}
              />
            );
          })}
        </section>

        <section className="sticky top-16 z-30 -mx-1 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-3 shadow-[0_0_24px_rgba(2,6,23,0.35)] backdrop-blur-md sm:top-20 sm:mx-0 sm:rounded-[1.75rem] sm:bg-white/5 sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search expenses..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto xl:grid-cols-[180px_180px_180px]">
              <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20">
                <option className="bg-slate-900 text-white">All Categories</option>
                <option className="bg-slate-900 text-white">Food</option>
                <option className="bg-slate-900 text-white">Transportation</option>
                <option className="bg-slate-900 text-white">Utilities</option>
              </select>

              <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20">
                <option className="bg-slate-900 text-white">Newest First</option>
                <option className="bg-slate-900 text-white">Oldest First</option>
                <option className="bg-slate-900 text-white">Highest Amount</option>
                <option className="bg-slate-900 text-white">Lowest Amount</option>
              </select>

              <select
                value={selectedRange}
                onChange={(event) => {
                  window.location.href = `/dashboard?range=${event.target.value}`;
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              >
                <option value="period" className="bg-slate-900 text-white">
                  Budget Period
                </option>
                <option value="7d" className="bg-slate-900 text-white">
                  Last 7 Days
                </option>
                <option value="30d" className="bg-slate-900 text-white">
                  Last 30 Days
                </option>
                <option value="90d" className="bg-slate-900 text-white">
                  Last 90 Days
                </option>
                <option value="all" className="bg-slate-900 text-white">
                  All Time
                </option>
              </select>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
          <RecentTransactionsCard
            transactions={transactions}
            onDeleteSuccess={() => setToastMessage("Expense deleted successfully.")}
          />

          <div className="space-y-6">
            <SectionCard eyebrow="Insights" title="Spending by Category">
              <SpendingByCategoryChart data={chartData} />
            </SectionCard>

            <SectionCard eyebrow="Trends" title={`${periodLabel} Spending Trend`}>
              <MonthlyTrendChart data={trendData} />
            </SectionCard>
          </div>
        </div>
      </main>

      <AddExpenseModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleExpenseAdded}
      />
      <EditBudgetModal
        open={budgetOpen}
        onClose={() => setBudgetOpen(false)}
        initialValue={budgetAmount}
        initialPeriod={budgetPeriod}
        onSuccess={() => setToastMessage("Monthly budget updated successfully.")}
      />
      <Toast
        visible={!!toastMessage} message={toastMessage}
      />
    </>
  );
}

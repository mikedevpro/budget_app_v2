export type BudgetPeriod = "weekly" | "monthly" | "yearly";

export function getPeriodDateRange(
  period: BudgetPeriod,
  now = new Date()
): { start: Date; end: Date } {
  const current = new Date(now);
  current.setHours(0, 0, 0, 0);

  if (period === "weekly") {
    const start = new Date(current);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return { start, end };
  }

  if (period === "yearly") {
    const start = new Date(current.getFullYear(), 0, 1);
    const end = new Date(current.getFullYear() + 1, 0, 1);
    return { start, end };
  }

  const start = new Date(current.getFullYear(), current.getMonth(), 1);
  const end = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  return { start, end };
}

export function isDateWithinRange(
  dateValue: string | Date,
  start: Date,
  end: Date
) {
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  return date >= start && date < end;
}

export function formatBudgetPeriodLabel(period: BudgetPeriod) {
  if (period === "weekly") return "This week";
  if (period === "yearly") return "This year";
  return "This month";
}

export type RelativeRange = "period" | "7d" | "30d" | "90d" | "all";

export function getRelativeRangeStart(range: RelativeRange, now = new Date()) {
  if (range === "all" || range === "period") return null;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (range === "7d") start.setDate(start.getDate() - 7);
  if (range === "30d") start.setDate(start.getDate() - 30);
  if (range === "90d") start.setDate(start.getDate() - 90);

  return start;
}
import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Car,
  HeartPulse,
  LayoutGrid,
  Popcorn,
  Receipt,
  Tv,
  Utensils,
  Wrench,
} from "lucide-react";

export type CategoryConfig = {
  label: string;
  icon: LucideIcon;
  dotColor: string;
  badgeClassName: string;
  chartColor: string;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  General: {
    label: "General",
    icon: LayoutGrid,
    dotColor: "bg-slate-400",
    badgeClassName:
      "border-white/10 bg-white/5 text-slate-300",
    chartColor: "#94a3b8",
  },
  Food: {
    label: "Food",
    icon: Utensils,
    dotColor: "bg-emerald-400",
    badgeClassName:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    chartColor: "#10b981",
  },
  Transportation: {
    label: "Transportation",
    icon: Car,
    dotColor: "bg-blue-400",
    badgeClassName:
      "border-blue-400/20 bg-blue-500/10 text-blue-300",
    chartColor: "#3b82f6",
  },
  Utilities: {
    label: "Utilities",
    icon: Wrench,
    dotColor: "bg-amber-400",
    badgeClassName:
      "border-amber-400/20 bg-amber-500/10 text-amber-300",
    chartColor: "#f59e0b",
  },
  Subscriptions: {
    label: "Subscriptions",
    icon: Tv,
    dotColor: "bg-violet-400",
    badgeClassName:
      "border-violet-400/20 bg-violet-500/10 text-violet-300",
    chartColor: "#8b5cf6",
  },
  Entertainment: {
    label: "Entertainment",
    icon: Popcorn,
    dotColor: "bg-pink-400",
    badgeClassName:
      "border-pink-400/20 bg-pink-500/10 text-pink-300",
    chartColor: "#ec4899",
  },
  Health: {
    label: "Health",
    icon: HeartPulse,
    dotColor: "bg-rose-400",
    badgeClassName:
      "border-rose-400/20 bg-rose-500/10 text-rose-300",
    chartColor: "#f43f5e",
  },
  Income: {
    label: "Income",
    icon: Banknote,
    dotColor: "bg-teal-400",
    badgeClassName:
      "border-teal-400/20 bg-teal-500/10 text-teal-300",
    chartColor: "#14b8a6",
  },
};

export function getCategoryConfig(category?: string): CategoryConfig {
  if (!category) return CATEGORY_CONFIG.General;
  return CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.General;
}

export function getCategoryChartColor(category?: string): string {
  return getCategoryConfig(category).chartColor;
}

export function getCategoryOptions(): string[] {
  return Object.keys(CATEGORY_CONFIG);
}
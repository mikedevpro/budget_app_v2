"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { formatMoneyCompact } from "@/lib/utils/formatters";

type TrendDatum = {
  date: string;
  total: number;
};

type Props = {
  data: TrendDatum[];
};

export default function MonthlyTrendChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/20 text-sm text-slate-400">
        Add a few expenses to see your monthly trend.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            formatter={(
              value: number | string | readonly (number | string)[] | undefined
            ) => [formatMoneyCompact(Number(Array.isArray(value) ? value[0] : value ?? 0)), "Spent"]}
            contentStyle={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#fff",
            }}
            itemStyle={{ color: "#e2e8f0" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: "#10b981" }}
            activeDot={{ r: 6, fill: "#10b981" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

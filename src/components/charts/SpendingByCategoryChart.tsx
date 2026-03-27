"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getCategoryChartColor, getCategoryConfig } from "@/lib/utils/categories";

type ChartDatum = {
  name: string;
  value: number;
};

type Props = {
  data: ChartDatum[];
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function SpendingByCategoryChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/20 text-sm text-slate-400">
        Start tracking your spending by adding your first expense.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={58}
              outerRadius={84}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((item) => (
                <Cell
                  key={item.name}
                  fill={getCategoryChartColor(item.name)}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                formatMoney(Number(value ?? 0)),
                String(name ?? ""),
              ]}
              contentStyle={{
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              itemStyle={{ color: "#e2e8f0" }}
              labelStyle={{ color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          const config = getCategoryConfig(item.name);
          const Icon = config.icon;

          return (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/25 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: config.chartColor }}
                />
                <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <Icon size={14} />
                  {config.label}
                </span>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {formatMoney(item.value)}
                </p>
                <p className="text-xs text-slate-400">{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

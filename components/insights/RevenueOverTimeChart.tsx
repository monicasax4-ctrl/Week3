"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { MrrByMonth, CustomerMrrPoint } from "@/lib/insights/aggregate";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatMonthLabel(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
}

interface RevenueOverTimeChartProps {
  data: MrrByMonth[];
  selectedCustomerName?: string | null;
  customerSeries?: CustomerMrrPoint[] | null;
  onClearSelection?: () => void;
}

export function RevenueOverTimeChart({
  data,
  selectedCustomerName,
  customerSeries,
  onClearSelection,
}: RevenueOverTimeChartProps) {
  const chartData = data.map((d, i) => ({
    ...d,
    label: formatMonthLabel(d.month),
    customerMrr: customerSeries?.[i]?.customerMrr,
  }));

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          Revenue over time
        </h3>
        {selectedCustomerName && (
          <button
            onClick={onClearSelection}
            className="flex items-center gap-1 rounded-[var(--radius)] bg-[var(--surface-1)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Comparing: {selectedCustomerName}
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
      <div style={{ position: "relative", width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border-strong)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => currencyFormatter.format(v)}
              width={56}
            />
            <Tooltip
              formatter={(value) => currencyFormatter.format(Number(value))}
              contentStyle={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--text-primary)" }}
            />
            <Legend
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
            />
            <Line
              type="monotone"
              dataKey="activeMrr"
              name="Active MRR"
              stroke="var(--series-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="newMrr"
              name="New MRR"
              stroke="var(--series-2)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            {selectedCustomerName && (
              <Line
                type="monotone"
                dataKey="customerMrr"
                name={selectedCustomerName}
                stroke="var(--series-3)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

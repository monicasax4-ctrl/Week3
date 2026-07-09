"use client";

import type { CsmPerformance } from "@/lib/insights/aggregate";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

export function CsmPerformanceTable({ data }: { data: CsmPerformance[] }) {
  const maxMrr = Math.max(...data.map((d) => d.totalMrr), 1);

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <h3 className="mb-4 text-sm font-medium text-[var(--text-primary)]">
        CSM performance
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
              <th className="py-2 pr-4 font-medium">CSM</th>
              <th className="py-2 pr-4 font-medium">Customers</th>
              <th className="py-2 pr-4 font-medium">MRR managed</th>
              <th className="py-2 pr-4 font-medium">Avg NPS</th>
              <th className="py-2 pr-4 font-medium">Churn rate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.csmName}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="py-2 pr-4 text-[var(--text-primary)]">
                  {row.csmName}
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)]">
                  {row.customerCount}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-primary)] tabular-nums">
                      {currencyFormatter.format(row.totalMrr)}
                    </span>
                    <span
                      className="h-1.5 rounded-full bg-[var(--series-1)]"
                      style={{
                        width: `${Math.max((row.totalMrr / maxMrr) * 64, 4)}px`,
                      }}
                    />
                  </div>
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)] tabular-nums">
                  {row.avgNps}
                </td>
                <td className="py-2 pr-4 tabular-nums">
                  <span
                    className={
                      row.churnRate > 0.2
                        ? "text-[var(--status-critical)]"
                        : row.churnRate > 0
                          ? "text-[var(--status-warning)]"
                          : "text-[var(--text-secondary)]"
                    }
                  >
                    {percentFormatter.format(row.churnRate)}
                  </span>
                  <span className="ml-1 text-[var(--text-muted)]">
                    ({row.churnedCount})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

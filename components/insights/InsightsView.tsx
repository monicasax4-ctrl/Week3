import type { ReactNode } from "react";
import type { CustomerRow } from "@/lib/csv/types";
import {
  getMrrByMonth,
  getCsmPerformance,
  getCustomerHealthRows,
  getSummaryMetrics,
} from "@/lib/insights/aggregate";
import { RevenueOverTimeChart } from "./RevenueOverTimeChart";
import { CsmPerformanceTable } from "./CsmPerformanceTable";
import { CustomerHealthTable } from "./CustomerHealthTable";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

interface InsightsViewProps {
  rows: CustomerRow[];
  actions?: ReactNode;
}

export function InsightsView({ rows, actions }: InsightsViewProps) {
  const mrrByMonth = getMrrByMonth(rows);
  const csmPerformance = getCsmPerformance(rows);
  const healthRows = getCustomerHealthRows(rows);
  const summary = getSummaryMetrics(rows);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-[var(--text-primary)]">
          Insights
        </h1>
        {actions}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Customers" value={summary.totalCustomers.toString()} />
        <MetricCard
          label="Active MRR"
          value={currencyFormatter.format(summary.activeMrr)}
        />
        <MetricCard
          label="Churn rate"
          value={percentFormatter.format(summary.churnRate)}
        />
        <MetricCard label="Avg NPS" value={summary.avgNps.toString()} />
      </div>

      <RevenueOverTimeChart data={mrrByMonth} />
      <CsmPerformanceTable data={csmPerformance} />
      <CustomerHealthTable data={healthRows} />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius)] bg-[var(--surface-1)] p-4">
      <p className="text-[13px] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-2xl font-medium tabular-nums text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

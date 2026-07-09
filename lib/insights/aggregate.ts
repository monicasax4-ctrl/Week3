import type { CustomerRow } from "@/lib/csv/types";

function toDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00Z`);
  return isNaN(d.getTime()) ? null : d;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}`;
}

function monthEnd(key: string): Date {
  const [year, month] = key.split("-").map(Number);
  // day 0 of next month = last day of this month
  return new Date(Date.UTC(year, month, 0, 23, 59, 59));
}

function nextMonthKey(key: string): string {
  const [year, month] = key.split("-").map(Number);
  const d = new Date(Date.UTC(year, month, 1));
  return monthKey(d);
}

export interface MrrByMonth {
  month: string;
  newMrr: number;
  activeMrr: number;
}

function getMonthRange(rows: CustomerRow[]): string[] {
  const starts = rows
    .map((r) => toDate(r.start_date))
    .filter((d): d is Date => d !== null);
  const churns = rows
    .map((r) => (r.churn_date ? toDate(r.churn_date) : null))
    .filter((d): d is Date => d !== null);

  if (starts.length === 0) return [];

  const allDates = [...starts, ...churns];
  const minMonth = monthKey(
    new Date(Math.min(...starts.map((d) => d.getTime())))
  );
  const maxMonth = monthKey(
    new Date(Math.max(...allDates.map((d) => d.getTime())))
  );

  const months: string[] = [];
  let cursor = minMonth;
  while (cursor <= maxMonth) {
    months.push(cursor);
    cursor = nextMonthKey(cursor);
  }

  return months;
}

export function getMrrByMonth(rows: CustomerRow[]): MrrByMonth[] {
  const months = getMonthRange(rows);

  return months.map((month) => {
    const end = monthEnd(month);

    let newMrr = 0;
    let activeMrr = 0;

    for (const row of rows) {
      const start = toDate(row.start_date);
      if (!start) continue;

      if (monthKey(start) === month) {
        newMrr += row.mrr;
      }

      const churn = row.churn_date ? toDate(row.churn_date) : null;
      const startedByMonthEnd = start.getTime() <= end.getTime();
      const stillActiveAtMonthEnd = !churn || churn.getTime() > end.getTime();

      if (startedByMonthEnd && stillActiveAtMonthEnd) {
        activeMrr += row.mrr;
      }
    }

    return { month, newMrr, activeMrr };
  });
}

export interface CustomerMrrPoint {
  month: string;
  customerMrr: number;
}

/**
 * A single customer's MRR contribution per month, bucketed over the same
 * month range as getMrrByMonth(allRows) so the two series plot on shared
 * x-axis ticks. Value is the customer's MRR while active that month, 0
 * otherwise (before start_date or after churn_date).
 */
export function getCustomerMrrByMonth(
  row: CustomerRow,
  allRows: CustomerRow[]
): CustomerMrrPoint[] {
  const months = getMonthRange(allRows);
  const start = toDate(row.start_date);
  const churn = row.churn_date ? toDate(row.churn_date) : null;

  return months.map((month) => {
    const end = monthEnd(month);
    const startedByMonthEnd = start ? start.getTime() <= end.getTime() : false;
    const stillActiveAtMonthEnd = !churn || churn.getTime() > end.getTime();
    return {
      month,
      customerMrr: startedByMonthEnd && stillActiveAtMonthEnd ? row.mrr : 0,
    };
  });
}

export interface CsmPerformance {
  csmName: string;
  customerCount: number;
  totalMrr: number;
  avgNps: number;
  churnedCount: number;
  churnRate: number;
}

export function getCsmPerformance(rows: CustomerRow[]): CsmPerformance[] {
  const groups = new Map<string, CustomerRow[]>();

  for (const row of rows) {
    const name = row.csm_name?.trim() || "Unassigned";
    const group = groups.get(name) ?? [];
    group.push(row);
    groups.set(name, group);
  }

  const result: CsmPerformance[] = [];
  for (const [csmName, group] of groups) {
    const customerCount = group.length;
    const totalMrr = group.reduce((sum, r) => sum + r.mrr, 0);
    const avgNps =
      group.reduce((sum, r) => sum + r.nps_score, 0) / customerCount;
    const churnedCount = group.filter(
      (r) => r.status.toLowerCase() === "churned"
    ).length;

    result.push({
      csmName,
      customerCount,
      totalMrr,
      avgNps: Math.round(avgNps * 10) / 10,
      churnedCount,
      churnRate: churnedCount / customerCount,
    });
  }

  return result.sort((a, b) => b.totalMrr - a.totalMrr);
}

export interface CustomerHealthRow {
  companyName: string;
  status: string;
  monthsAsCustomer: number;
  mrr: number;
  npsScore: number;
  supportTickets90d: number;
  renewalQuarter: string;
  csmName: string;
}

export interface SummaryMetrics {
  totalCustomers: number;
  activeMrr: number;
  churnRate: number;
  avgNps: number;
}

export function getSummaryMetrics(rows: CustomerRow[]): SummaryMetrics {
  const totalCustomers = rows.length;
  const activeMrr = rows
    .filter((r) => r.status.toLowerCase() !== "churned")
    .reduce((sum, r) => sum + r.mrr, 0);
  const churnedCount = rows.filter(
    (r) => r.status.toLowerCase() === "churned"
  ).length;
  const avgNps =
    totalCustomers === 0
      ? 0
      : rows.reduce((sum, r) => sum + r.nps_score, 0) / totalCustomers;

  return {
    totalCustomers,
    activeMrr,
    churnRate: totalCustomers === 0 ? 0 : churnedCount / totalCustomers,
    avgNps: Math.round(avgNps * 10) / 10,
  };
}

export function getCustomerHealthRows(rows: CustomerRow[]): CustomerHealthRow[] {
  return rows.map((row) => ({
    companyName: row.company_name,
    status: row.status,
    monthsAsCustomer: row.months_as_customer,
    mrr: row.mrr,
    npsScore: row.nps_score,
    supportTickets90d: row.support_tickets_90d,
    renewalQuarter: row.renewal_quarter,
    csmName: row.csm_name?.trim() || "Unassigned",
  }));
}

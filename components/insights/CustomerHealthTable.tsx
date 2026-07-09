"use client";

import { useMemo, useState } from "react";
import type { CustomerHealthRow } from "@/lib/insights/aggregate";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type SortKey = keyof CustomerHealthRow;

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "companyName", label: "Company" },
  { key: "status", label: "Status" },
  { key: "monthsAsCustomer", label: "Tenure (mo)", numeric: true },
  { key: "mrr", label: "MRR", numeric: true },
  { key: "npsScore", label: "NPS", numeric: true },
  { key: "supportTickets90d", label: "Tickets (90d)", numeric: true },
  { key: "renewalQuarter", label: "Renewal" },
  { key: "csmName", label: "CSM" },
];

function statusClasses(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === "active")
    return "bg-[var(--bg-success)] text-[var(--text-success)]";
  if (normalized === "at-risk" || normalized === "at risk")
    return "bg-[color-mix(in_srgb,var(--status-warning)_18%,transparent)] text-[var(--status-warning)]";
  if (normalized === "churned")
    return "bg-[var(--bg-danger)] text-[var(--text-danger)]";
  return "bg-[var(--surface-1)] text-[var(--text-secondary)]";
}

interface CustomerHealthTableProps {
  data: CustomerHealthRow[];
  selectedCompanyName?: string | null;
  onSelectCustomer?: (companyName: string) => void;
}

export function CustomerHealthTable({
  data,
  selectedCompanyName,
  onSelectCustomer,
}: CustomerHealthTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("mrr");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          Customer health
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Click a company name to compare its MRR on the chart above.
        </p>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-[var(--surface-2)]">
            <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none py-2 pr-4 font-medium hover:text-[var(--text-secondary)]"
                >
                  {col.label}
                  {sortKey === col.key && (sortDir === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isSelected = row.companyName === selectedCompanyName;
              return (
              <tr
                key={row.companyName}
                className={`border-b border-[var(--border)] last:border-0 ${
                  isSelected ? "bg-[var(--bg-accent)]" : ""
                }`}
              >
                <td className="py-2 pr-4">
                  <button
                    onClick={() => onSelectCustomer?.(row.companyName)}
                    className={`text-left hover:underline ${
                      isSelected
                        ? "font-medium text-[var(--text-accent)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {row.companyName}
                  </button>
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={`rounded-[var(--radius)] px-2 py-0.5 text-xs font-medium ${statusClasses(row.status)}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-2 pr-4 tabular-nums text-[var(--text-secondary)]">
                  {row.monthsAsCustomer}
                </td>
                <td className="py-2 pr-4 tabular-nums text-[var(--text-primary)]">
                  {currencyFormatter.format(row.mrr)}
                </td>
                <td className="py-2 pr-4 tabular-nums text-[var(--text-secondary)]">
                  {row.npsScore}
                </td>
                <td className="py-2 pr-4 tabular-nums text-[var(--text-secondary)]">
                  {row.supportTickets90d}
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)]">
                  {row.renewalQuarter}
                </td>
                <td className="py-2 pr-4 text-[var(--text-secondary)]">
                  {row.csmName}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

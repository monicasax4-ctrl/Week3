export const EXPECTED_COLUMNS = [
  "customer_id",
  "company_name",
  "industry",
  "company_size",
  "employees",
  "plan",
  "contract_type",
  "mrr",
  "start_date",
  "churn_date",
  "status",
  "csm_assigned",
  "csm_name",
  "product_usage_score",
  "support_tickets_90d",
  "last_login_days_ago",
  "nps_score",
  "churn_reason",
  "months_as_customer",
  "renewal_quarter",
] as const;

const NUMERIC_COLUMNS = new Set([
  "employees",
  "mrr",
  "product_usage_score",
  "support_tickets_90d",
  "last_login_days_ago",
  "nps_score",
  "months_as_customer",
]);

export function isNumericColumn(column: string): boolean {
  return NUMERIC_COLUMNS.has(column);
}

export interface HeaderValidationResult {
  valid: boolean;
  missing: string[];
  unexpected: string[];
}

export function validateHeaders(headers: string[]): HeaderValidationResult {
  const normalized = headers.map((h) => h.trim().toLowerCase());
  const expected = new Set<string>(EXPECTED_COLUMNS);
  const seen = new Set(normalized);

  const missing = EXPECTED_COLUMNS.filter((col) => !seen.has(col));
  const unexpected = normalized.filter((col) => !expected.has(col));

  return {
    valid: missing.length === 0,
    missing,
    unexpected,
  };
}

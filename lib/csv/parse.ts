import Papa from "papaparse";
import { EXPECTED_COLUMNS, isNumericColumn, validateHeaders } from "./schema";
import type { CustomerRow } from "./types";

const NULLABLE_COLUMNS = new Set(["churn_date", "csm_name", "churn_reason"]);

export interface ParseResult {
  rows: CustomerRow[];
  error: string | null;
}

export function parseCustomerCsv(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        const validation = validateHeaders(headers);

        if (!validation.valid) {
          resolve({
            rows: [],
            error: `CSV is missing required column${validation.missing.length > 1 ? "s" : ""}: ${validation.missing.join(", ")}`,
          });
          return;
        }

        const rows: CustomerRow[] = results.data.map((raw) => {
          const row: Record<string, unknown> = {};
          for (const column of EXPECTED_COLUMNS) {
            const value = (raw[column] ?? "").trim();
            if (isNumericColumn(column)) {
              row[column] = value === "" ? 0 : Number(value);
            } else if (NULLABLE_COLUMNS.has(column)) {
              row[column] = value === "" ? null : value;
            } else {
              row[column] = value;
            }
          }
          return row as unknown as CustomerRow;
        });

        resolve({ rows, error: null });
      },
      error: (err: Error) => {
        resolve({ rows: [], error: err.message });
      },
    });
  });
}

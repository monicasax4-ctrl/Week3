"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CsvDropzone } from "@/components/upload/CsvDropzone";
import { CsvValidationError } from "@/components/upload/CsvValidationError";
import { AppHeader } from "@/components/ui/AppHeader";
import { parseCustomerCsv } from "@/lib/csv/parse";
import { useDatasetStore } from "@/store/datasetStore";

export default function UploadPage() {
  const router = useRouter();
  const setDataset = useDatasetStore((s) => s.setDataset);
  const [error, setError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  async function handleFile(file: File) {
    setParsing(true);
    setError(null);

    const result = await parseCustomerCsv(file);

    if (result.error) {
      setError(result.error);
      setParsing(false);
      return;
    }

    if (result.rows.length === 0) {
      setError("The CSV has no data rows.");
      setParsing(false);
      return;
    }

    setDataset(result.rows, file.name);
    router.push("/insights");
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-[var(--text-primary)]">
          Upload customer data
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Upload a CSV shaped like the Helix customers export to generate revenue,
          CSM, and customer health insights.
        </p>
      </div>

      <CsvDropzone onFileSelected={handleFile} disabled={parsing} />

      {parsing && (
        <p className="mt-4 text-sm text-[var(--text-muted)]">Parsing CSV…</p>
      )}

      {error && (
        <div className="mt-4">
          <CsvValidationError message={error} />
        </div>
      )}
      </div>
    </div>
  );
}

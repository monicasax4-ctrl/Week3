"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { InsightsView } from "@/components/insights/InsightsView";
import { ShareButton } from "@/components/share/ShareButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { useDatasetStore } from "@/store/datasetStore";

export default function InsightsPage() {
  const router = useRouter();
  const rows = useDatasetStore((s) => s.rows);
  const fileName = useDatasetStore((s) => s.fileName);
  const hydrateFromStorage = useDatasetStore((s) => s.hydrateFromStorage);
  const hasAttemptedHydration = useRef(false);

  useEffect(() => {
    if (rows.length > 0) return;

    if (!hasAttemptedHydration.current) {
      hasAttemptedHydration.current = true;
      hydrateFromStorage();
      return;
    }

    router.replace("/upload");
  }, [rows.length, hydrateFromStorage, router]);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {fileName && (
          <p className="mb-4 text-xs text-[var(--text-muted)]">
            Loaded from {fileName}
          </p>
        )}
        <InsightsView rows={rows} actions={<ShareButton rows={rows} />} />
      </div>
    </div>
  );
}

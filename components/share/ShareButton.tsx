"use client";

import { useState } from "react";
import { ShareUrlDialog } from "./ShareUrlDialog";
import type { CustomerRow } from "@/lib/csv/types";

export function ShareButton({ rows }: { rows: CustomerRow[] }) {
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleShare() {
    setSharing(true);
    setError(null);

    try {
      const res = await fetch("/api/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: rows }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to share snapshot");
      }

      const { id } = await res.json();
      setShareUrl(`${window.location.origin}/shared/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to share snapshot");
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handleShare}
          disabled={sharing}
          className="rounded-[var(--radius)] bg-[var(--text-primary)] px-3 py-2 text-sm font-medium text-[var(--surface-2)] disabled:opacity-50"
        >
          {sharing ? "Sharing…" : "Share snapshot"}
        </button>
        {error && (
          <p className="text-xs text-[var(--text-danger)]">{error}</p>
        )}
      </div>

      {shareUrl && (
        <ShareUrlDialog url={shareUrl} onClose={() => setShareUrl(null)} />
      )}
    </>
  );
}

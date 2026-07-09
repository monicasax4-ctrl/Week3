"use client";

import { useState } from "react";

interface ShareUrlDialogProps {
  url: string;
  onClose: () => void;
}

export function ShareUrlDialog({ url, onClose }: ShareUrlDialogProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] p-5"
      >
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          Snapshot shared
        </h3>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Anyone with this link can view this snapshot&apos;s insights — no
          login required.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <input
            readOnly
            value={url}
            onClick={(e) => e.currentTarget.select()}
            className="flex-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-primary)]"
          />
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-[var(--radius)] border border-[var(--border-strong)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-1)]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useRef, useState } from "react";

interface CsvDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function CsvDropzone({ onFileSelected, disabled }: CsvDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={`flex flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed px-6 py-16 text-center transition-colors ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${
        isDragging
          ? "border-[var(--border-accent)] bg-[var(--bg-accent)]"
          : "border-[var(--border-strong)] bg-[var(--surface-2)]"
      }`}
    >
      <p className="text-sm font-medium text-[var(--text-primary)]">
        Drop a CSV file here, or click to browse
      </p>
      <p className="text-xs text-[var(--text-muted)]">
        Expects the helix_customers.csv column format
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        disabled={disabled}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

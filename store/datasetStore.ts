import { create } from "zustand";
import type { CustomerRow } from "@/lib/csv/types";

const STORAGE_KEY = "helix-dataset";

interface StoredDataset {
  rows: CustomerRow[];
  fileName: string;
  uploadedAt: string;
}

interface DatasetState {
  rows: CustomerRow[];
  fileName: string | null;
  uploadedAt: string | null;
  setDataset: (rows: CustomerRow[], fileName: string) => void;
  hydrateFromStorage: () => void;
  clear: () => void;
}

export const useDatasetStore = create<DatasetState>()((set) => ({
  rows: [],
  fileName: null,
  uploadedAt: null,
  setDataset: (rows, fileName) => {
    const uploadedAt = new Date().toISOString();
    set({ rows, fileName, uploadedAt });
    if (typeof window !== "undefined") {
      const payload: StoredDataset = { rows, fileName, uploadedAt };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  },
  hydrateFromStorage: () => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as StoredDataset;
      set({
        rows: parsed.rows,
        fileName: parsed.fileName,
        uploadedAt: parsed.uploadedAt,
      });
    } catch {
      // Corrupt or stale storage entry — ignore and leave state empty.
    }
  },
  clear: () => {
    set({ rows: [], fileName: null, uploadedAt: null });
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  },
}));

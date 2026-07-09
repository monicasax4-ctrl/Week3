import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { InsightsView } from "@/components/insights/InsightsView";
import type { CustomerRow } from "@/lib/csv/types";

export default async function SharedSnapshotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("snapshots")
    .select("data, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const rows = data.data as CustomerRow[];
  const createdAt = new Date(data.created_at).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] px-3 py-2 text-xs text-[var(--text-secondary)]">
        Shared snapshot · created {createdAt}
      </div>
      <InsightsView rows={rows} />
    </div>
  );
}

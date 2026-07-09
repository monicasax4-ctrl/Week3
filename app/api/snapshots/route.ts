import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { CustomerRow } from "@/lib/csv/types";

export async function POST(request: Request) {
  const body = await request.json();
  const rows = body?.data as CustomerRow[] | undefined;

  if (!Array.isArray(rows) || rows.length === 0) {
    return Response.json({ error: "No data provided" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("snapshots")
    .insert({ data: rows })
    .select("id")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ id: data.id });
}

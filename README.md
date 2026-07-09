# Helix Insights

A password-gated internal tool for exploring customer-success CSV data: upload a
CSV, view revenue/CSM/customer-health insights, and share a read-only snapshot
via a public link.

## Pages

- `/login` — single shared password (`APP_PASSWORD`, default `OPS123`)
- `/upload` — upload a CSV shaped like `helix_customers.csv`
- `/insights` — revenue over time, CSM performance, customer health table, and a
  "Share snapshot" button
- `/shared/[id]` — public, read-only view of a shared snapshot (no login required)

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   APP_PASSWORD=OPS123
   SESSION_SECRET=<a long random string>
   NEXT_PUBLIC_SUPABASE_URL=<your Supabase project URL>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your Supabase anon/publishable key>
   ```

3. Apply the `snapshots` table migration in `supabase/migrations/0001_create_snapshots.sql`
   to your Supabase project (via the Supabase SQL editor, CLI, or MCP `apply_migration`).

4. Run the dev server:

   ```bash
   npm run dev
   ```

> **Note:** if this project lives inside a cloud-synced folder (OneDrive, Dropbox,
> Google Drive), the sync client can trigger spurious file-watcher rebuilds during
> `next dev`. If you see repeated unexplained "Fast Refresh" cycles in the console,
> pause sync for this folder while developing, or move the project outside the
> synced directory.

## Expected CSV format

Header row (order-independent, case-insensitive):

```
customer_id,company_name,industry,company_size,employees,plan,contract_type,mrr,
start_date,churn_date,status,csm_assigned,csm_name,product_usage_score,
support_tickets_90d,last_login_days_ago,nps_score,churn_reason,months_as_customer,
renewal_quarter
```

## Deploying

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Set `APP_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in the Vercel project.
4. Deploy.

## Data model

One Supabase table, `snapshots` (`id uuid`, `created_at timestamptz`, `data jsonb`).
Row Level Security allows the `anon` key to insert new snapshots and select any
snapshot by `id`. Snapshot ids are unguessable v4 UUIDs and the app never exposes
a "list snapshots" endpoint — treat snapshot links like unlisted-link secrets.

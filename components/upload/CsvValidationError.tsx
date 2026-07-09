export function CsvValidationError({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-danger)] px-4 py-3 text-sm text-[var(--text-danger)]">
      {message}
    </div>
  );
}

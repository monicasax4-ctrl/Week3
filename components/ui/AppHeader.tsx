"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/upload"
          className="text-sm font-medium text-[var(--text-primary)]"
        >
          Helix Insights
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

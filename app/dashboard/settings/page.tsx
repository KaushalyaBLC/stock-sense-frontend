import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, User, Bell, ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { getCurrentUser } from "@/lib/server-auth";

export const metadata: Metadata = { title: "Settings — StockSense" };

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Manage your account and preferences.
      </p>

      {/* Account (real) */}
      <section className="mt-6 rounded-[16px] border border-border bg-card p-6 shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]">
        <div className="mb-4 flex items-center gap-2">
          <User className="size-[18px] text-primary" />
          <h2 className="text-base font-bold">Account</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-navy text-base font-semibold text-white">
            {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <div className="text-sm font-semibold">{user?.name || "Your account"}</div>
            <div className="text-[13px] text-text-muted">{user?.email}</div>
          </div>
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <LogoutButton />
        </div>
      </section>

      {/* Preferences (coming soon) */}
      <section className="mt-4 rounded-[16px] border border-border bg-card p-6 shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]">
        <div className="mb-1 flex items-center gap-2">
          <Bell className="size-[18px] text-primary" />
          <h2 className="text-base font-bold">Notifications</h2>
          <span className="ml-auto rounded-full bg-warn/12 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warn">
            Coming soon
          </span>
        </div>
        <p className="text-[13px] text-text-secondary">
          Choose how and when you get alerts about your watchlist and market news.
        </p>
      </section>

      <section className="mt-4 rounded-[16px] border border-border bg-card p-6 shadow-[var(--shadow,0_1px_2px_rgba(15,23,42,0.05))]">
        <div className="mb-1 flex items-center gap-2">
          <ShieldCheck className="size-[18px] text-primary" />
          <h2 className="text-base font-bold">Security</h2>
          <span className="ml-auto rounded-full bg-warn/12 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warn">
            Coming soon
          </span>
        </div>
        <p className="text-[13px] text-text-secondary">
          Change your password and manage active sessions.
        </p>
      </section>

      <p className="mt-6 text-center text-xs text-text-muted">
        StockSense is not financial advice. For informational purposes only.
      </p>
    </div>
  );
}

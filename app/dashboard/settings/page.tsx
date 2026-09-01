import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, User, Mail, Bell, ShieldCheck } from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { DigestToggle } from "@/components/dashboard/digest-toggle";
import { Reveal } from "@/components/reveal";
import { getCurrentUser } from "@/lib/server-auth";

export const metadata: Metadata = { title: "Settings - StockSense" };

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-[720px]">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-1.5 text-[13.5px] text-text-secondary transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <h1 className="text-[26px] font-semibold tracking-tight">Settings</h1>
      <p className="mt-1.5 text-[14px] text-text-secondary">
        Manage your account and preferences.
      </p>

      {/* Account (real) */}
      <Reveal className="mt-8 rounded-[10px] border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <User className="size-[17px] text-primary" />
          <h2 className="text-[14px] font-semibold tracking-tight">Account</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-navy text-base font-semibold text-white">
            {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <div className="text-[13.5px] font-semibold">{user?.name || "Your account"}</div>
            <div className="text-[13px] text-text-muted">{user?.email}</div>
          </div>
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <LogoutButton />
        </div>
      </Reveal>

      {/* Email digest (real) */}
      <Reveal delay={0.06} className="mt-4 rounded-[10px] border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="size-[17px] text-primary" />
          <h2 className="text-[14px] font-semibold tracking-tight">Email digest</h2>
        </div>
        <DigestToggle />
      </Reveal>

      {/* Preferences (coming soon) */}
      <Reveal delay={0.1} className="mt-4 rounded-[10px] border border-border bg-card p-6">
        <div className="mb-1 flex items-center gap-2">
          <Bell className="size-[17px] text-primary" />
          <h2 className="text-[14px] font-semibold tracking-tight">Notifications</h2>
          <span className="ml-auto rounded-full bg-warn/12 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warn">
            Coming soon
          </span>
        </div>
        <p className="text-[13px] text-text-secondary">
          Choose how and when you get alerts about your watchlist and market news.
        </p>
      </Reveal>

      <Reveal delay={0.14} className="mt-4 rounded-[10px] border border-border bg-card p-6">
        <div className="mb-1 flex items-center gap-2">
          <ShieldCheck className="size-[17px] text-primary" />
          <h2 className="text-[14px] font-semibold tracking-tight">Security</h2>
          <span className="ml-auto rounded-full bg-warn/12 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warn">
            Coming soon
          </span>
        </div>
        <p className="text-[13px] text-text-secondary">
          Change your password and manage active sessions.
        </p>
      </Reveal>

      <p className="mt-6 text-center text-[11.5px] text-text-muted">
        StockSense is not financial advice. For informational purposes only.
      </p>
    </div>
  );
}

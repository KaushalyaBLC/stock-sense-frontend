import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { getCurrentUser } from "@/lib/server-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: verify the cookie token resolves to a real user.
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const initials = (user.name || user.email)
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="grid h-[100dvh] overflow-hidden lg:grid-cols-[260px_1fr]">
      {/* Sidebar - fixed height, scrolls independently if content overflows */}
      <aside className="hidden flex-col border-r border-border bg-surface overflow-y-auto lg:flex">
        <div className="flex h-[68px] shrink-0 items-center border-b border-border px-6">
          <Logo />
        </div>
        <div className="flex flex-1 flex-col justify-between p-3.5">
          <SidebarNav />
          <div className="border-t border-border pt-3.5">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main - its own scroll context; header sticks to the top of this column */}
      <div className="flex min-w-0 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-[68px] shrink-0 items-center gap-4 border-b border-border bg-card/85 px-5 backdrop-blur-md sm:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>

          {/* Search */}
          <div className="hidden flex-1 items-center gap-2.5 rounded-[7px] border border-border bg-background px-3.5 py-2 transition-colors focus-within:border-primary/40 sm:flex sm:max-w-[420px]">
            <Search className="size-[15px] text-text-muted" />
            <input
              placeholder="Search companies, news, or sectors"
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-text-muted"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="mr-1 hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-text-secondary md:inline-flex">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-up opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-up" />
              </span>
              Market live
            </span>
            <NotificationBell />
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:border-primary/25">
              <span className="grid size-7 place-items-center rounded-full bg-navy text-[11px] font-semibold text-white">
                {initials || "U"}
              </span>
              <span className="hidden text-[13px] font-medium sm:block">
                {user.name?.split(" ")[0] || "Account"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}

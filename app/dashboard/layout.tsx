import { redirect } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { LogoutButton } from "@/components/dashboard/logout-button";
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
        <div className="flex h-[72px] shrink-0 items-center border-b border-border px-6">
          <Logo />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <SidebarNav />
          <div className="border-t border-border pt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main - its own scroll context; header sticks to the top of this column */}
      <div className="flex min-w-0 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center gap-4 border-b border-border bg-card/80 px-5 backdrop-blur-sm sm:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>

          {/* Search */}
          <div className="hidden flex-1 items-center gap-2.5 rounded-md border border-border bg-background px-3.5 py-2.5 sm:flex sm:max-w-[440px]">
            <Search className="size-4 text-text-muted" />
            <input
              placeholder="Search companies, news, or sectors"
              className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-text-muted"
            />
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <button
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-md border border-border bg-card text-text-secondary transition-colors hover:text-foreground"
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-down" />
            </button>
            <ThemeToggle />
            <div className="flex items-center gap-2.5 rounded-full border border-border py-1 pl-1 pr-3">
              <span className="grid size-8 place-items-center rounded-full bg-navy text-xs font-semibold text-white">
                {initials || "U"}
              </span>
              <span className="hidden text-[13px] font-semibold sm:block">
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Eye,
  Newspaper,
  Building2,
  MessageSquareText,
  Bell,
  FileText,
  LineChart,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Watchlist", href: "/dashboard/watchlist", icon: Eye },
  { label: "Market News", href: "/dashboard/news", icon: Newspaper },
  { label: "Companies", href: "/dashboard/companies", icon: Building2 },
  { label: "AI Assistant", href: "/dashboard/chat", icon: MessageSquareText },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Weekly Summary", href: "/dashboard/summary", icon: FileText },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: LineChart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-sm transition-colors",
              active
                ? "bg-brand-soft font-medium text-primary"
                : "text-text-secondary hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

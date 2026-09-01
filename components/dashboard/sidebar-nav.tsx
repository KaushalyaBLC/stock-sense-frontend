"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  LayoutDashboard,
  Eye,
  Newspaper,
  Building2,
  MessageSquareText,
  FileText,
  BarChart2,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Watchlist", href: "/dashboard/watchlist", icon: Eye },
  { label: "Market News", href: "/dashboard/news", icon: Newspaper },
  { label: "Companies", href: "/dashboard/companies", icon: Building2 },
  { label: "Price Charts", href: "/dashboard/charts", icon: BarChart2 },
  { label: "AI Assistant", href: "/dashboard/chat", icon: MessageSquareText },
  { label: "Weekly Summary", href: "/dashboard/summary", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <nav className="flex flex-col gap-0.5">
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
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-2.5 rounded-[7px] px-3 py-2 text-[13.5px] transition-colors duration-150",
              active
                ? "font-medium text-primary"
                : "font-normal text-text-secondary hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-0 rounded-[7px] bg-brand-soft"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 32 }
                }
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-10 h-4 w-[2.5px] rounded-full bg-primary transition-opacity duration-150",
                active ? "opacity-100" : "opacity-0",
              )}
            />
            <Icon
              className={cn(
                "relative z-10 size-4 shrink-0 transition-all duration-150",
                active
                  ? "text-primary"
                  : "text-text-muted group-hover:translate-x-0.5 group-hover:text-text-secondary",
              )}
              strokeWidth={active ? 2.25 : 1.75}
            />
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

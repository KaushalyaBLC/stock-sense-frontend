"use client";

import { Bell } from "lucide-react";

/** Notification bell with a live-pinging alert dot, matching the product's "LIVE" language. */
export function NotificationBell() {
  return (
    <button
      aria-label="Notifications"
      className="relative grid size-9 place-items-center rounded-[7px] border border-border bg-card text-text-secondary transition-colors hover:border-primary/25 hover:text-foreground"
    >
      <Bell className="size-[17px]" />
      <span className="absolute right-2 top-2 flex size-[7px]">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-down opacity-75" />
        <span className="relative inline-flex size-[7px] rounded-full border-2 border-card bg-down" />
      </span>
    </button>
  );
}

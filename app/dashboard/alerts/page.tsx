import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Alerts — StockSense" };

export default function AlertsPage() {
  return (
    <ComingSoon
      icon={Bell}
      title="Alerts"
      description="Get notified the moment important news breaks for the companies and sectors you follow — no need to check all day."
    />
  );
}

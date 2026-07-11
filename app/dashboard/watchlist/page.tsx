import type { Metadata } from "next";
import { Eye } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Watchlist — StockSense" };

export default function WatchlistPage() {
  return (
    <ComingSoon
      icon={Eye}
      title="Your Watchlist"
      description="Soon you'll be able to follow the CSE companies you care about and get an alert whenever high-impact news moves them."
    />
  );
}

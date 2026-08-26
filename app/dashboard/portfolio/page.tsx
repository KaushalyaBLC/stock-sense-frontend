import type { Metadata } from "next";
import { LineChart } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Portfolio - StockSense" };

export default function PortfolioPage() {
  return (
    <ComingSoon
      icon={LineChart}
      title="Your Portfolio"
      description="Add your holdings to see how news and AI signals affect the stocks you actually own, a personalized view of your positions."
    />
  );
}

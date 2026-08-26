import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Companies - StockSense" };

export default function CompaniesPage() {
  return (
    <ComingSoon
      icon={Building2}
      title="Browse Companies"
      description="A directory of every CSE company we track, with its latest AI signal, sector, and recent news, all in one place."
    />
  );
}

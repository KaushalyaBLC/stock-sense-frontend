import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "AI Assistant — StockSense" };

export default function ChatPage() {
  return (
    <ComingSoon
      icon={MessageSquareText}
      title="AI Assistant"
      description="Ask questions in plain English about any CSE company or news story, and get clear answers backed by our AI analysis."
    />
  );
}

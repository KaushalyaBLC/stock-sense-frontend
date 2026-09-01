"use client";

import { ChatPanel } from "@/components/chat/chat-panel";
import { useGeneralChatMutation, type ChatTurn } from "@/lib/store/chat-api";

const SUGGESTIONS = [
  "What's the outlook for banking stocks this week?",
  "Any recent positive news on the CSE?",
  "Which companies were affected by tourism news?",
  "Summarize this week's market mood",
];

export default function ChatPage() {
  const [generalChat] = useGeneralChatMutation();

  async function send(message: string, history: ChatTurn[]) {
    const res = await generalChat({ message, history }).unwrap();
    return res.answer;
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="mb-6">
        <h1 className="text-[26px] font-semibold tracking-tight">AI Assistant</h1>
        <p className="mt-1.5 text-[14px] text-text-secondary">
          Ask anything about CSE companies and the news that moves them.
        </p>
      </div>
      <ChatPanel
        send={send}
        suggestions={SUGGESTIONS}
        emptyTitle="Ask StockSense AI"
        emptyBody="I know CSE company profiles and recent news. Ask me anything, in plain English."
      />
    </div>
  );
}

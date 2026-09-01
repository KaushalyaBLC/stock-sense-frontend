"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Send, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatTurn } from "@/lib/store/chat-api";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = ChatTurn & { pending?: boolean; error?: boolean };

/**
 * Reusable chat panel. The parent supplies `send(message, history)` (wired to
 * whichever chat mutation) so the same UI serves general / news / company chat.
 */
export function ChatPanel({
  send,
  suggestions = [],
  placeholder = "Ask about CSE companies or news...",
  emptyTitle = "Ask StockSense AI",
  emptyBody = "Get plain-English answers about CSE companies and the news that moves them.",
}: {
  send: (message: string, history: ChatTurn[]) => Promise<string>;
  suggestions?: string[];
  placeholder?: string;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  async function submit(text: string) {
    const q = text.trim();
    if (!q || busy) return;

    const history: ChatTurn[] = messages
      .filter((m) => !m.pending && !m.error)
      .map((m) => ({ role: m.role, content: m.content }));

    setInput("");
    setBusy(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: q },
      { role: "assistant", content: "", pending: true },
    ]);
    scrollToEnd();

    try {
      const answer = await send(q, history);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: answer };
        return next;
      });
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn't answer that just now. Please try again.",
          error: true,
        };
        return next;
      });
    } finally {
      setBusy(false);
      scrollToEnd();
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100dvh-9rem)] flex-col rounded-[10px] border border-border bg-card">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
        {empty ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center"
          >
            <span className="grid size-14 place-items-center rounded-[10px] bg-brand-soft text-primary">
              <Sparkles className="size-7" />
            </span>
            <h2 className="mt-4 text-[17px] font-semibold tracking-tight">{emptyTitle}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">{emptyBody}</p>
            {suggestions.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => submit(s)}
                    className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:text-foreground"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} reduce={!!reduce} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mx-auto flex max-w-2xl items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            rows={1}
            placeholder={placeholder}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-[7px] border border-border bg-background px-3.5 py-2.5 text-[13.5px] outline-none transition-colors placeholder:text-text-muted focus:border-primary/40"
          />
          <Button
            type="submit"
            size="icon"
            className="size-11 shrink-0 rounded-[7px] transition-transform active:scale-[0.96]"
            disabled={busy || !input.trim()}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </form>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-text-muted">
          AI can be wrong. Not financial advice, always do your own research.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message, reduce }: { message: Message; reduce: boolean }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full",
          isUser ? "bg-navy text-white" : "bg-brand-soft text-primary",
        )}
      >
        {isUser ? <User className="size-4" /> : <Sparkles className="size-4" />}
      </span>
      <div
        className={cn(
          "max-w-[80%] rounded-[10px] px-3.5 py-2.5 text-[13.5px] leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : message.error
              ? "bg-down/8 text-down-strong"
              : "bg-surface-2 text-foreground",
        )}
      >
        {message.pending ? (
          <span className="inline-flex items-center gap-2 text-text-secondary">
            <span className="flex gap-1">
              <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-text-muted" />
            </span>
            Thinking...
          </span>
        ) : isUser ? (
          <span className="whitespace-pre-wrap">{message.content}</span>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Headings
                h1: ({ children }) => (
                  <h1 className="mb-2 mt-3 text-base font-bold tracking-tight first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-1.5 mt-3 text-[13px] font-semibold uppercase tracking-wider text-text-secondary first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-1 mt-2.5 text-[13.5px] font-semibold first:mt-0">{children}</h3>
                ),
                // Paragraphs
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                // Bold / italic
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic opacity-90">{children}</em>,
                // Lists
                ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="leading-snug">{children}</li>,
                // Horizontal rule
                hr: () => <hr className="my-2.5 border-border" />,
                // Code blocks: pre wraps block code, so code inside pre is block-level
                pre: ({ children }) => (
                  <pre className="my-2 overflow-x-auto rounded-lg bg-surface-1 p-2.5 font-mono text-[12px]">
                    {children}
                  </pre>
                ),
                code: ({ children, className }) =>
                  className ? (
                    // Block code (has language class from fenced code block)
                    <code className={className}>{children}</code>
                  ) : (
                    // Inline code
                    <code className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[12px] text-primary">
                      {children}
                    </code>
                  ),
                // Block quote
                blockquote: ({ children }) => (
                  <blockquote className="my-2 border-l-[3px] border-primary/40 pl-3 text-text-secondary">
                    {children}
                  </blockquote>
                ),
                // Tables (GFM)
                table: ({ children }) => (
                  <div className="my-2 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-[12.5px]">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-surface-1">{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr className="border-b border-border last:border-0">{children}</tr>,
                th: ({ children }) => (
                  <th className="px-3 py-1.5 text-left font-semibold text-text-secondary">{children}</th>
                ),
                td: ({ children }) => <td className="px-3 py-1.5">{children}</td>,
                // Links
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline decoration-primary/30 hover:decoration-primary"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

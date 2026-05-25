"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  X,
  MessageSquare,
  User,
  Sparkles,
  GripVertical,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Settings } from "@/lib/types";

interface ChatPanelProps {
  settings: Settings | null;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ChatMessageBubble({
  message,
  onRetry,
}: {
  message: { id: string; role: string; content: string; result?: any; error?: string };
  onRetry?: () => void;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
          isUser
            ? "bg-primary/10 border border-primary/20 text-foreground"
            : "bg-card border border-border text-foreground"
        }`}
      >
        {message.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  if (!inline && match) {
                    return (
                      <div className="relative group my-2">
                        <button
                          onClick={() => handleCopyCode(codeString)}
                          className="absolute top-2 right-2 p-1 rounded-md bg-muted/80 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </button>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg text-xs"
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  return (
                    <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }: any) {
                  return (
                    <div className="overflow-x-auto my-2">
                      <table className="text-xs border w-full">{children}</table>
                    </div>
                  );
                },
                th({ children }: any) {
                  return <th className="text-left p-1 border-b bg-muted/50">{children}</th>;
                },
                td({ children }: any) {
                  return <td className="p-1 border-b border-muted-foreground/20">{children}</td>;
                },
              }}
            >
              {message.content}
            </Markdown>
          </div>
        )}

        {/* Result rendering */}
        {message.result?.type === "image" && typeof message.result.data === "string" && (
          <div className="mt-2">
            <img
              src={`data:image/png;base64,${message.result.data}`}
              alt="Result chart"
              className="max-w-full rounded-lg border border-border"
            />
          </div>
        )}

        {message.result?.type === "table" && message.result.data &&
          typeof message.result.data === "object" &&
          "columns" in message.result.data &&
          Array.isArray((message.result.data as any).columns) &&
          "rows" in message.result.data &&
          Array.isArray((message.result.data as any).rows) && (
          <div className="mt-2 overflow-x-auto">
            <table className="text-xs border w-full">
              <thead>
                <tr className="bg-muted/50">
                  {(message.result.data as any).columns.map((c: string) => (
                    <th key={c} className="text-left p-1 border-b">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(message.result.data as any).rows.slice(0, 10).map((row: any, i: number) => (
                  <tr key={i}>
                    {(message.result.data as any).columns.map((c: string) => (
                      <td key={c} className="p-1 border-b border-muted-foreground/20">
                        {String(row[c] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {message.error && (
          <div className="mt-2 text-destructive text-xs">
            <p>{message.error}</p>
            {onRetry && (
              <button onClick={onRetry} className="underline mt-1 hover:no-underline">
                Retry
              </button>
            )}
          </div>
        )}

        <div className={`mt-1 text-[10px] text-muted-foreground ${isUser ? "text-right" : "text-left"}`}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </motion.div>
  );
}

function ChatInputArea({ onSend, disabled }: { onSend: (content: string) => void; disabled: boolean }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-border">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Configure API key in settings..." : "Ask a question about your data..."}
        disabled={disabled}
        className="min-h-[40px] max-h-[120px] resize-none text-sm"
        rows={1}
      />
      <Button size="icon" onClick={handleSend} disabled={disabled || !input.trim()} className="shrink-0">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ChatPanel({ settings, open, onClose, onOpen }: ChatPanelProps) {
  const { messages, isLoading, send } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(380);
  const isDragging = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(
    (content: string) => {
      if (!settings?.provider || !settings?.api_key) return;
      send(content, settings.provider, settings.api_key);
    },
    [settings, send]
  );

  const handleMouseDown = () => {
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const newWidth = window.innerWidth - e.clientX;
    setPanelWidth(Math.max(280, Math.min(600, newWidth)));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  return (
    <>
      {/* FAB when collapsed */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={onOpen}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-tally-hover transition-colors"
            aria-label="Open chat"
          >
            <MessageSquare className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 right-0 h-full z-40 flex"
            style={{ width: panelWidth }}
          >
            {/* Resize handle */}
            <div
              onMouseDown={handleMouseDown}
              className="w-3 cursor-col-resize flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/30" />
            </div>

            <div className="flex-1 flex flex-col bg-card border-l border-border shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">AI Chat</h3>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {!settings?.api_key ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Configure your API key in Settings to use the chat.
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Ask a question about your dataset.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <ChatMessageBubble
                        key={msg.id}
                        message={msg}
                        onRetry={msg.role === "user" ? () => handleSend(msg.content) : undefined}
                      />
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="bg-card border border-border rounded-xl px-4 py-2">
                          <TypingIndicator />
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <ChatInputArea
                onSend={handleSend}
                disabled={isLoading || !settings?.api_key}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Settings } from "@/lib/types";
import { useEffect, useRef } from "react";

interface Props {
  settings: Settings | null;
}

export function ChatPanel({ settings }: Props) {
  const { messages, isLoading, send } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (content: string) => {
    if (!settings?.provider || !settings?.api_key) return;
    send(content, settings.provider, settings.api_key);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 border-b">
        <h3 className="font-semibold text-sm">AI Chat</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        {!settings?.api_key ? (
          <p className="text-sm text-muted-foreground text-center mt-8">
            Configure your API key in Settings (gear icon) to use the chat.
          </p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center mt-8">
            Ask a question about your dataset.
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onRetry={msg.role === "user" ? () => handleSend(msg.content) : undefined} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <Separator />
      <ChatInput onSend={handleSend} disabled={isLoading || !settings?.api_key} />
    </div>
  );
}

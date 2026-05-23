"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, Provider } from "@/lib/types";
import { sendChatMessage as apiSend } from "@/lib/api";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(async (content: string, provider: Provider, apiKey: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const history = [...messages, userMsg];
    setMessages(history);
    setIsLoading(true);

    try {
      const historyForApi = history
        .filter((m) => m.role !== "system")
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await apiSend({
        messages: historyForApi,
        provider,
        api_key: apiKey,
      });

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.response,
        result: res.result,
        error: res.error || undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      return assistantMsg;
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        error: e.message || "Chat request failed",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, send, clearChat };
}

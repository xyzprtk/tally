"use client";

import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface Props {
  message: ChatMessageType;
  onRetry?: () => void;
}

export function ChatMessage({ message, onRetry }: Props) {
  const isUser = message.role === "user";

  const renderResult = () => {
    const r = message.result;
    if (!r) return null;

    if (r.type === "image" && typeof r.data === "string") {
      return (
        <div className="mt-2">
          <img src={`data:image/png;base64,${r.data}`} alt="Result chart" className="max-w-full rounded border" />
        </div>
      );
    }

    if (r.type === "table" && r.data && typeof r.data === "object" && "rows" in r.data && "columns" in r.data) {
      const data = r.data as { columns: string[]; rows: Record<string, any>[] };
      return (
        <div className="mt-2 overflow-x-auto">
          <table className="text-xs border w-full">
            <thead>
              <tr className="bg-background/50">
                {data.columns.map((c) => (
                  <th key={c} className="text-left p-1 border-b">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.slice(0, 10).map((row, i) => (
                <tr key={i}>
                  {data.columns.map((c) => (
                    <td key={c} className="p-1 border-b border-muted-foreground/20">{String(row[c] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
        {renderResult()}

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
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface Props {
  rows?: number;
  cols?: number;
}

export function DataTableSkeleton({ rows = 6, cols = 4 }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="h-4 bg-muted-foreground/20 rounded animate-pulse"
            style={{ width: `${60 + Math.random() * 80}px`, flex: i === cols - 1 ? 1 : undefined }}
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={`r-${r}`}
          className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={`c-${c}`}
              className="h-4 bg-muted-foreground/10 rounded animate-pulse"
              style={{
                width: `${60 + Math.random() * 80}px`,
                flex: c === cols - 1 ? 1 : undefined,
                animationDelay: `${r * 0.05 + c * 0.02}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

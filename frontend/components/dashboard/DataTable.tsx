"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyState } from "./EmptyState";
import { type ReactNode } from "react";

export interface DataTableColumn {
  key: string;
  title: string;
  align?: "left" | "right" | "center";
  numeric?: boolean;
  sortable?: boolean;
}

interface Props {
  columns: DataTableColumn[];
  rows: Record<string, any>[];
  maxHeight?: string;
  stickyHeader?: boolean;
  rowHover?: boolean;
  zebra?: boolean;
  sortable?: boolean;
  onRowClick?: (row: Record<string, any>) => void;
  emptyState?: { icon: ReactNode; title: string; message: string };
}

export function DataTable({
  columns,
  rows,
  maxHeight = "max-h-96",
  stickyHeader = true,
  rowHover = true,
  zebra = true,
  sortable = false,
  onRowClick,
  emptyState,
}: Props) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (!sortable) return;
    const col = columns.find((c) => c.key === key);
    if (!col?.sortable) return;

    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortKey || !sortable) return rows;
    const col = columns.find((c) => c.key === sortKey);
    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1 * dir;
      if (bv == null) return -1 * dir;
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [rows, sortKey, sortDir, sortable, columns]);

  if (rows.length === 0 && emptyState) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          message={emptyState.message}
        />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`rounded-xl border border-border bg-card overflow-hidden ${maxHeight ? `overflow-auto ${maxHeight}` : ""}`}>
        <table className="w-full text-sm">
          <thead className={stickyHeader ? "sticky top-0 z-10" : undefined}>
            <tr className="bg-muted/50 border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${sortable && col.sortable ? "cursor-pointer select-none" : ""}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"}`}>
                    <span>{col.title}</span>
                    {sortable && col.sortable && (
                      <span className="inline-flex flex-col -space-y-1">
                        <ChevronUp
                          className={`h-3 w-3 transition-transform duration-200 ${
                            sortKey === col.key && sortDir === "asc"
                              ? "text-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-200 ${
                            sortKey === col.key && sortDir === "desc"
                              ? "text-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: i * 0.02 }}
                className={`border-b border-border last:border-b-0 ${
                  zebra ? "even:bg-muted/20" : ""
                } ${rowHover ? "hover:bg-accent/30 transition-colors duration-150" : ""} ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  const str = value != null ? String(value) : "";
                  const isNumeric = col.numeric || col.align === "right";
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-2.5 ${
                        isNumeric ? "text-right font-mono tabular-nums" : ""
                      }`}
                    >
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="block max-w-[200px] truncate">
                            {str}
                          </span>
                        </TooltipTrigger>
                        {str.length > 20 && (
                          <TooltipContent side="top" className="max-w-xs">
                            {str}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
}

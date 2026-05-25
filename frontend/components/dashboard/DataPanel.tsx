"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu, ChevronLeft, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { DatasetInfo } from "@/lib/types";

interface Props {
  dataset: DatasetInfo;
  onUploadNew: (file: File) => Promise<void>;
}

export function getDtypeBadgeClass(dtype: string): string {
  const d = dtype.toLowerCase();
  if (d.includes("int") || d.includes("float")) {
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }
  if (d.includes("object") || d.includes("string") || d.includes("category")) {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }
  if (d.includes("datetime") || d.includes("timedelta")) {
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
  if (d.includes("bool")) {
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
  return "bg-muted text-muted-foreground border-border";
}

const sidebarVariants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 350, damping: 28 },
  },
  exit: {
    opacity: 0,
    x: -40,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 500, damping: 25, delay: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.6,
    transition: { duration: 0.15 },
  },
};

export function DataPanel({ dataset, onUploadNew }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredColumns = useMemo(() => {
    if (!search.trim()) return dataset.columns;
    return dataset.columns.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [dataset.columns, search]);

  const numericCount = useMemo(
    () => dataset.columns.filter((c) => getDtypeBadgeClass(c.dtype).includes("blue")).length,
    [dataset.columns]
  );

  const handleCopy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      toast.success(`Copied "${name}" to clipboard`);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onUploadNew(f);
  };

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.div
            key="collapsed"
            variants={pillVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col justify-start pt-2 shrink-0"
          >
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={() => setCollapsed(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-border shadow-lg shadow-black/10 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Expand sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ) : (
          <motion.aside
            key="expanded"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[320px] h-full flex flex-col rounded-2xl bg-card shadow-lg shadow-black/5 overflow-hidden shrink-0 relative"
          >
            {/* Collapse toggle */}
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={() => setCollapsed(true)}
                  className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Collapse sidebar
              </TooltipContent>
            </Tooltip>

            <ScrollArea className="flex-1 h-full">
              <div className="p-5 space-y-5">
                {/* Dataset header card */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <h3 className="font-semibold text-sm mb-1">Dataset</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {dataset.row_count.toLocaleString()} rows · {dataset.columns.length} columns
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Overview of your uploaded data. Browse columns, check stats, or upload a new file.
                  </p>
                </div>

                {/* Search bar */}
                <div>
                  <Input
                    placeholder="Search columns..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                {/* Columns card */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Columns
                  </h4>
                  <div className="space-y-1">
                    <AnimatePresence>
                      {filteredColumns.map((col, i) => (
                        <motion.div
                          key={col.name}
                          initial={{ opacity: 0, y: 2 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15, delay: i * 0.02 }}
                          className="flex items-center justify-between group cursor-pointer rounded-lg px-2.5 py-2 hover:bg-accent/30 transition-colors"
                          onClick={() => handleCopy(col.name)}
                        >
                          <span className="text-sm truncate mr-2">{col.name}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {copied === col.name ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded border ${getDtypeBadgeClass(col.dtype)}`}
                            >
                              {col.dtype}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Quick Stats card */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Quick Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="text-base font-semibold text-foreground">{dataset.row_count.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Total Rows</div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="text-base font-semibold text-foreground">{dataset.columns.length}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Total Columns</div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="text-base font-semibold text-primary">{numericCount}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Numeric</div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <div className="text-base font-semibold text-foreground">{dataset.columns.length - numericCount}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Categorical</div>
                    </div>
                  </div>
                </div>

                {/* Upload button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl h-9 text-xs font-medium"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New Dataset
                </Button>
              </div>
            </ScrollArea>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}

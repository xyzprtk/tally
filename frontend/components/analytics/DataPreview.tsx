"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DataTable } from "@/components/dashboard/DataTable";
import { DataTableSkeleton } from "@/components/dashboard/DataTableSkeleton";
import { GlidingPillNav } from "@/components/dashboard/GlidingPillNav";
import { getPreview } from "@/lib/api";

const previewPills = [
  { key: "head", label: "First 10 rows" },
  { key: "tail", label: "Last 10 rows" },
];

export function DataPreview() {
  const [mode, setMode] = useState<"head" | "tail">("head");
  const [data, setData] = useState<{ columns: string[]; rows: Record<string, any>[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPreview(mode === "tail")
      .then((res) => {
        setData(res);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [mode]);

  const columns = data?.columns.map((c) => ({
    key: c,
    title: c,
    align: "left" as const,
    sortable: false,
  })) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Data Preview</h2>
        <GlidingPillNav pills={previewPills} active={mode} onSelect={(k) => setMode(k as "head" | "tail")} />
      </div>

      {loading ? (
        <DataTableSkeleton rows={6} cols={Math.min(columns.length || 4, 6)} />
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : data ? (
        <motion.div
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DataTable
            columns={columns}
            rows={data.rows}
            maxHeight="max-h-[600px]"
            stickyHeader
            rowHover
            zebra
          />
        </motion.div>
      ) : null}
    </div>
  );
}

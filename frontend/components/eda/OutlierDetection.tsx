"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { DataTableSkeleton } from "@/components/dashboard/DataTableSkeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ConfirmationDialog } from "@/components/dashboard/ConfirmationDialog";
import { ShieldCheck, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getOutliersSummary, getOutliersDetail, removeOutliers } from "@/lib/api";
import type { OutlierRow } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

const columnsDef: DataTableColumn[] = [
  { key: "column", title: "Column", sortable: true },
  { key: "outlier_count", title: "Outlier Count", align: "right", numeric: true, sortable: true },
  { key: "outlier_pct", title: "Outlier %", align: "right", numeric: true, sortable: true },
];

export function OutlierDetection() {
  const { isLoading, error, run } = useEda();
  const [rows, setRows] = useState<OutlierRow[]>([]);
  const [expandedCol, setExpandedCol] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [confirmCol, setConfirmCol] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    const result = await getOutliersSummary();
    if (result.type === "table" && result.data && "rows" in (result.data as any)) {
      setRows((result.data as any).rows as OutlierRow[]);
    }
  }, []);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  const loadDetail = async (column: string) => {
    if (expandedCol === column) {
      setExpandedCol(null);
      setDetail(null);
      return;
    }
    setExpandedCol(column);
    const result = await run(() => getOutliersDetail(column));
    if (result && result.data) {
      setDetail(result.data);
    }
  };

  const handleRemove = async () => {
    if (!confirmCol) return;
    const result = await run(() => removeOutliers(confirmCol, "remove"));
    if (result) {
      toast.success(`Removed outliers from "${confirmCol}"`);
      await loadSummary();
      setExpandedCol(null);
      setDetail(null);
    } else if (error) {
      toast.error(error);
    }
    setConfirmCol(null);
  };

  const tableRows = rows.map((r) => ({
    column: r.column,
    outlier_count: r.outlier_count,
    outlier_pct: `${r.outlier_pct.toFixed(2)}%`,
    _actions: r.column,
  }));

  if (isLoading && rows.length === 0) {
    return <DataTableSkeleton rows={6} cols={4} />;
  }

  if (rows.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={<ShieldCheck className="h-5 w-5" />}
        title="No outliers detected"
        message="All values fall within expected ranges."
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <DataTable
        columns={[
          ...columnsDef,
          { key: "_actions", title: "Actions", align: "right" },
        ]}
        rows={tableRows}
        maxHeight="max-h-[400px]"
        stickyHeader
        rowHover
        zebra
        sortable
      />

      {/* Inline action rows */}
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.column} className="flex items-center gap-2 text-sm border border-border rounded-lg p-3 bg-card">
            <span className="font-medium min-w-[120px]">{row.column}</span>
            <span className="text-muted-foreground text-xs">{row.outlier_count} outliers ({row.outlier_pct}%)</span>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => loadDetail(row.column)} disabled={isLoading}>
                {expandedCol === row.column ? <ChevronDown className="h-3.5 w-3.5 mr-1" /> : <ChevronRight className="h-3.5 w-3.5 mr-1" />}
                Details
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setConfirmCol(row.column)} disabled={isLoading}>
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {expandedCol && detail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-border rounded-xl p-4 bg-card space-y-4 overflow-hidden"
          >
            <h3 className="font-semibold text-sm">Outlier Detail: {expandedCol}</h3>

            {detail.boxplot && (
              <div className="border border-border rounded-lg overflow-hidden">
                <img
                  src={`data:image/png;base64,${detail.boxplot}`}
                  alt={`Box plot of ${expandedCol}`}
                  className="max-w-full h-auto"
                />
              </div>
            )}

            {detail.summary && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {Object.entries(detail.summary).map(([k, v]) => (
                  <div key={k} className="border border-border rounded-lg p-3 bg-background">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</div>
                    <div className="font-semibold">{String(v)}</div>
                  </div>
                ))}
              </div>
            )}

            {detail.outlier_rows && (
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted/50 sticky top-0">
                      {(detail.outlier_rows.columns as string[]).map((c: string) => (
                        <th key={c} className="text-left p-2 border-b font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detail.outlier_rows.rows.slice(0, 10).map((r: any, i: number) => (
                      <tr key={i} className="border-b border-border">
                        {(detail.outlier_rows.columns as string[]).map((c: string) => (
                          <td key={c} className="p-2">{String(r[c] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationDialog
        open={!!confirmCol}
        onClose={() => setConfirmCol(null)}
        onConfirm={handleRemove}
        title="Remove Outliers"
        description={`Remove outliers from "${confirmCol}"? This cannot be undone.`}
        confirmText="Remove"
        confirmVariant="destructive"
      />
    </div>
  );
}

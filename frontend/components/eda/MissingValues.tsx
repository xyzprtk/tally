"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { DataTableSkeleton } from "@/components/dashboard/DataTableSkeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ConfirmationDialog } from "@/components/dashboard/ConfirmationDialog";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getMissingSummary, fillMissing, dropColumn } from "@/lib/api";
import type { MissingRow } from "@/lib/types";

const FILL_METHODS = [
  { value: "mean", label: "Mean" },
  { value: "median", label: "Median" },
  { value: "mode", label: "Mode" },
  { value: "ffill", label: "Forward Fill" },
  { value: "zero", label: "Fill with Zero" },
];

const columnsDef: DataTableColumn[] = [
  { key: "column", title: "Column", sortable: true },
  { key: "missing_count", title: "Missing Count", align: "right", numeric: true, sortable: true },
  { key: "missing_pct", title: "Missing %", align: "right", numeric: true, sortable: true },
  { key: "total_rows", title: "Total Rows", align: "right", numeric: true, sortable: true },
];

export function MissingValues() {
  const { isLoading, error, run } = useEda();
  const [rows, setRows] = useState<MissingRow[]>([]);
  const [sortBy, setSortBy] = useState("missing_pct");
  const [sortDir, setSortDir] = useState("desc");
  const [fillMethods, setFillMethods] = useState<Record<string, string>>({});
  const [confirmAction, setConfirmAction] = useState<{
    type: "fill" | "drop";
    column: string;
    method?: string;
  } | null>(null);

  const load = useCallback(async () => {
    const result = await getMissingSummary(sortBy, sortDir);
    if (result.type === "table" && result.data && "rows" in (result.data as any)) {
      setRows((result.data as any).rows as MissingRow[]);
    }
  }, [sortBy, sortDir]);

  useEffect(() => { load(); }, [load]);

  const handleFill = async () => {
    if (!confirmAction || confirmAction.type !== "fill" || !confirmAction.method) return;
    const result = await run(() => fillMissing(confirmAction.column, confirmAction.method));
    if (result) {
      toast.success(`Filled missing values in "${confirmAction.column}" with ${confirmAction.method}`);
      await load();
    } else if (error) {
      toast.error(error);
    }
    setConfirmAction(null);
  };

  const handleDrop = async () => {
    if (!confirmAction || confirmAction.type !== "drop") return;
    const result = await run(() => dropColumn(confirmAction.column));
    if (result) {
      toast.success(`Dropped column "${confirmAction.column}"`);
      await load();
    } else if (error) {
      toast.error(error);
    }
    setConfirmAction(null);
  };

  const tableRows = rows.map((r) => ({
    column: r.column,
    missing_count: r.missing_count,
    missing_pct: `${r.missing_pct.toFixed(2)}%`,
    total_rows: r.total_rows,
    _actions: r.column,
  }));

  const actionColumns: DataTableColumn[] = [
    {
      key: "_actions",
      title: "Actions",
      align: "right",
    },
  ];

  const allColumns = [...columnsDef, ...actionColumns];

  if (isLoading && rows.length === 0) {
    return <DataTableSkeleton rows={6} cols={5} />;
  }

  if (rows.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={<CheckCircle className="h-5 w-5" />}
        title="No missing values found"
        message="Your dataset is clean."
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <DataTable
        columns={allColumns}
        rows={tableRows}
        maxHeight="max-h-[500px]"
        stickyHeader
        rowHover
        zebra
        sortable
      />

      {/* Custom action row renderer is not possible with generic DataTable, so we overlay or we skip custom actions per row for P0 */}
      {/* For P0, we keep the action buttons inline but styled properly */}
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.column} className="flex items-center gap-2 text-sm border border-border rounded-lg p-3 bg-card">
            <span className="font-medium min-w-[120px]">{row.column}</span>
            <span className="text-muted-foreground text-xs">{row.missing_count} missing ({row.missing_pct}%)</span>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Select
                value={fillMethods[row.column] || ""}
                onValueChange={(v: string | null) => setFillMethods((p) => ({ ...p, [row.column]: v ?? "" }))}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Method..." />
                </SelectTrigger>
                <SelectContent>
                  {FILL_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                disabled={!fillMethods[row.column] || isLoading}
                onClick={() =>
                  setConfirmAction({
                    type: "fill",
                    column: row.column,
                    method: fillMethods[row.column],
                  })
                }
              >
                Fill
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmAction({ type: "drop", column: row.column })}
                disabled={isLoading}
              >
                Drop
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationDialog
        open={confirmAction?.type === "fill"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleFill}
        title="Fill Missing Values"
        description={`Fill missing values in "${confirmAction?.column}" with ${confirmAction?.method}?`}
        confirmText="Fill"
        confirmVariant="default"
      />

      <ConfirmationDialog
        open={confirmAction?.type === "drop"}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleDrop}
        title="Drop Column"
        description={`Drop column "${confirmAction?.column}"? This cannot be undone.`}
        confirmText="Drop"
        confirmVariant="destructive"
      />
    </div>
  );
}

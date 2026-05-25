"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { DataTableSkeleton } from "@/components/dashboard/DataTableSkeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ConfirmationDialog } from "@/components/dashboard/ConfirmationDialog";
import { CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getDatasetInfo, getDuplicates, dropDuplicates } from "@/lib/api";

export function DuplicateDetection() {
  const { isLoading, error, run } = useEda();
  const [colList, setColList] = useState<string[]>([]);
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [duplicateRows, setDuplicateRows] = useState<any>(null);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showDropConfirm, setShowDropConfirm] = useState(false);

  useEffect(() => {
    getDatasetInfo().then((info) => {
      const names = info.columns.map((c) => c.name);
      setColList(names);
    });
  }, []);

  const toggleColumn = (col: string) => {
    setSelectedCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleView = async () => {
    const result = await run(() => getDuplicates(selectedCols.length > 0 ? selectedCols : undefined));
    if (result?.data) {
      const d = result.data as any;
      setSummary(d.summary);
      setDuplicateRows(d.duplicate_rows);
      setShowDuplicates(true);
      if (d.summary?.duplicate_rows === 0) {
        toast.info("No duplicate rows found");
      }
    } else if (error) {
      toast.error(error);
    }
  };

  const handleDrop = async () => {
    const result = await run(() => dropDuplicates(selectedCols.length > 0 ? selectedCols : undefined));
    if (result) {
      toast.success("Duplicate rows dropped successfully");
      setSummary(null);
      setDuplicateRows(null);
      setShowDuplicates(false);
    } else if (error) {
      toast.error(error);
    }
    setShowDropConfirm(false);
  };

  const tableColumns: DataTableColumn[] = duplicateRows?.columns?.map((c: string) => ({
    key: c,
    title: c,
  })) ?? [];

  if (isLoading && !summary) {
    return <DataTableSkeleton rows={6} cols={4} />;
  }

  if (summary && summary.duplicate_rows === 0) {
    return (
      <EmptyState
        icon={<CheckCircle className="h-5 w-5" />}
        title="No duplicates found"
        message="All rows are unique."
      />
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div>
        <label className="text-sm font-medium block mb-2">
          Select Columns for duplicate check (leave empty for all)
        </label>
        <div className="flex flex-wrap gap-2">
          {colList.map((col) => (
            <button
              key={col}
              onClick={() => toggleColumn(col)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedCols.includes(col)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-input hover:bg-muted"
              }`}
            >
              {col}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {selectedCols.length === 0
            ? "All columns will be used"
            : `${selectedCols.length} column(s) selected`}
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleView} disabled={isLoading}>
          Find Duplicates
        </Button>
        <Button
          variant="destructive"
          onClick={() => setShowDropConfirm(true)}
          disabled={isLoading || !summary}
        >
          Drop Duplicates
        </Button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="border border-border rounded-lg p-3 bg-card">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Duplicate Rows</div>
            <div className="text-lg font-bold">{summary.duplicate_rows}</div>
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Duplicate %</div>
            <div className="text-lg font-bold">{summary.duplicate_pct}%</div>
          </div>
          <div className="border border-border rounded-lg p-3 bg-card">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Rows</div>
            <div className="text-lg font-bold">{summary.total_rows}</div>
          </div>
        </div>
      )}

      {summary && duplicateRows && (
        <div className="space-y-2">
          <button
            onClick={() => setShowDuplicates(!showDuplicates)}
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            {showDuplicates ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Duplicate Rows ({duplicateRows.rows?.length || 0})
          </button>

          {showDuplicates && duplicateRows.columns && (
            <DataTable
              columns={tableColumns}
              rows={duplicateRows.rows}
              maxHeight="max-h-80"
              stickyHeader
              rowHover
              zebra
            />
          )}
        </div>
      )}

      <ConfirmationDialog
        open={showDropConfirm}
        onClose={() => setShowDropConfirm(false)}
        onConfirm={handleDrop}
        title="Drop Duplicates"
        description="This will remove all duplicate rows from the dataset. This action cannot be undone."
        confirmText="Drop"
        confirmVariant="destructive"
      />
    </div>
  );
}

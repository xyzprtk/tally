"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { getDatasetInfo, getDuplicates, dropDuplicates } from "@/lib/api";

export function DuplicateDetection() {
  const { isLoading, error, run } = useEda();
  const [colList, setColList] = useState<string[]>([]);
  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [duplicateRows, setDuplicateRows] = useState<any>(null);
  const [showDuplicates, setShowDuplicates] = useState(false);

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
    }
  };

  const handleDrop = async () => {
    const result = await run(() => dropDuplicates(selectedCols.length > 0 ? selectedCols : undefined));
    if (result) {
      setSummary(null);
      setDuplicateRows(null);
      setShowDuplicates(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Duplicate Detection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            View Duplicates
          </Button>
          <Button variant="destructive" onClick={handleDrop} disabled={isLoading || !summary}>
            Drop Duplicates
          </Button>
        </div>

        {summary && (
          <div className="grid grid-cols-3 gap-3">
            <div className="border rounded p-3">
              <div className="text-xs text-muted-foreground">Duplicate Rows</div>
              <div className="text-lg font-bold">{summary.duplicate_rows}</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-muted-foreground">Duplicate %</div>
              <div className="text-lg font-bold">{summary.duplicate_pct}%</div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-muted-foreground">Total Rows</div>
              <div className="text-lg font-bold">{summary.total_rows}</div>
            </div>
          </div>
        )}

        {summary && duplicateRows && (
          <div>
            <button
              onClick={() => setShowDuplicates(!showDuplicates)}
              className="flex items-center gap-1 text-sm font-medium hover:underline"
            >
              {showDuplicates ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Duplicate Rows ({duplicateRows.rows?.length || 0})
            </button>

            {showDuplicates && duplicateRows.columns && (
              <div className="overflow-x-auto max-h-80 mt-2">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-muted sticky top-0">
                      {duplicateRows.columns.map((c: string) => (
                        <th key={c} className="text-left p-2 border-b font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {duplicateRows.rows.map((r: any, i: number) => (
                      <tr key={i} className="border-b">
                        {duplicateRows.columns.map((c: string) => (
                          <td key={c} className="p-2">{String(r[c] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

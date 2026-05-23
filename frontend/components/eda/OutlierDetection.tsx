"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { getOutliersSummary, getOutliersDetail, removeOutliers } from "@/lib/api";
import type { OutlierRow } from "@/lib/types";

export function OutlierDetection() {
  const { isLoading, error, run } = useEda();
  const [rows, setRows] = useState<OutlierRow[]>([]);
  const [expandedCol, setExpandedCol] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);

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

  const handleRemove = async (column: string, action: string) => {
    const result = await run(() => removeOutliers(column, action));
    if (result) {
      await loadSummary();
      setExpandedCol(null);
      setDetail(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outlier Detection (IQR)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b font-medium">Column Name</th>
                <th className="text-left p-2 border-b font-medium">Outlier Count</th>
                <th className="text-left p-2 border-b font-medium">Outlier %</th>
                <th className="text-left p-2 border-b font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.column} className="border-b">
                  <td className="p-2 font-medium">{row.column}</td>
                  <td className="p-2">{row.outlier_count}</td>
                  <td className="p-2">{row.outlier_pct}%</td>
                  <td className="p-2 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => loadDetail(row.column)} disabled={isLoading}>
                      {expandedCol === row.column ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      Details
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRemove(row.column, "remove")} disabled={isLoading}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {expandedCol && detail && isLoading && (
          <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading detail...</div>
        )}

        {expandedCol && detail && !isLoading && (
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold">Outlier Detail: {expandedCol}</h3>

            {detail.boxplot && (
              <div className="border rounded-lg overflow-hidden">
                <img src={`data:image/png;base64,${detail.boxplot}`} alt={`Box plot of ${expandedCol}`} className="max-w-full h-auto" />
              </div>
            )}

            {detail.summary && (
              <div className="grid grid-cols-3 gap-2 text-sm">
                {Object.entries(detail.summary).map(([k, v]) => (
                  <div key={k} className="border rounded p-2">
                    <span className="text-muted-foreground">{k}:</span>{" "}
                    <span className="font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}

            {detail.outlier_rows && (
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-muted sticky top-0">
                      {(detail.outlier_rows.columns as string[]).map((c: string) => (
                        <th key={c} className="text-left p-2 border-b font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detail.outlier_rows.rows.map((r: any, i: number) => (
                      <tr key={i} className="border-b">
                        {(detail.outlier_rows.columns as string[]).map((c: string) => (
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

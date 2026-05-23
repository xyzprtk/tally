"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getValueCounts } from "@/lib/api";

export function ValueCounts() {
  const { isLoading, error, run } = useEda();
  const [columns, setColumns] = useState<any[]>([]);

  const load = useCallback(async () => {
    const result = await run(() => getValueCounts(20));
    if (result?.data) {
      setColumns((result.data as any).columns);
    }
  }, [run]);

  useEffect(() => { load(); }, [load]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Value Counts (Top 20)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}

        {isLoading && (
          <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
        )}

        <div className="space-y-6">
          {columns.map((col: any) => (
            <div key={col.column} className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-2">
                {col.column}
                <span className="text-muted-foreground font-normal ml-2">
                  ({col.total_unique} unique values)
                </span>
              </h4>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 border-b font-medium">Value</th>
                    <th className="text-left p-2 border-b font-medium">Count</th>
                    <th className="text-left p-2 border-b font-medium">%</th>
                  </tr>
                </thead>
                <tbody>
                  {col.rows.map((r: any, i: number) => (
                    <tr key={i} className="border-b">
                      <td className="p-2 font-mono text-xs max-w-[300px] truncate" title={r.value}>
                        {r.value}
                      </td>
                      <td className="p-2">{r.count}</td>
                      <td className="p-2">{r.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

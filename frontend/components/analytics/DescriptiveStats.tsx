"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getDatasetInfo } from "@/lib/api";

export function DescriptiveStats() {
  const { result, isLoading, error, run } = useAnalytics();
  const [columns, setColumns] = useState<string>("all");
  const [colList, setColList] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    getDatasetInfo().then((info) => {
      setColList(info.columns.map((c) => c.name));
      setLoaded(true);
    });
  }

  const handleRun = () => run("descriptive_stats", { columns: columns === "all" ? "all" : [columns] });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Descriptive Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Column</label>
            <Select value={columns} onValueChange={(v: string | null) => setColumns(v ?? "all")}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Numeric Columns</SelectItem>
                {colList.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Compute
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {result?.type === "table" && result.data && typeof result.data === "object" && "rows" in result.data && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-muted">
                  {(result.data as any).columns.map((c: string) => (
                    <th key={c} className="text-left p-2 border-b font-medium">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray((result.data as any).rows) &&
                  (result.data as any).rows.map((row: any, i: number) => (
                    <tr key={i} className="border-b">
                      {(result.data as any).columns.map((c: string) => (
                        <td key={c} className="p-2">{String(row[c] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowUpDown } from "lucide-react";
import { getMissingSummary, fillMissing, dropColumn } from "@/lib/api";
import type { MissingRow } from "@/lib/types";

const FILL_METHODS = [
  { value: "mean", label: "Mean" },
  { value: "median", label: "Median" },
  { value: "mode", label: "Mode" },
  { value: "ffill", label: "Forward Fill" },
  { value: "zero", label: "Fill with Zero" },
];

export function MissingValues() {
  const { isLoading, error, run } = useEda();
  const [rows, setRows] = useState<MissingRow[]>([]);
  const [sortBy, setSortBy] = useState("missing_pct");
  const [sortDir, setSortDir] = useState("desc");
  const [fillMethods, setFillMethods] = useState<Record<string, string>>({});
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await getMissingSummary(sortBy, sortDir);
    if (result.type === "table" && result.data && "rows" in (result.data as any)) {
      setRows((result.data as any).rows as MissingRow[]);
    }
  }, [sortBy, sortDir]);

  useEffect(() => { load(); }, [load]);

  const handleFill = async (column: string) => {
    const method = fillMethods[column];
    if (!method) return;
    const result = await run(() => fillMissing(column, method));
    if (result) {
      setActionMsg(result.message);
      await load();
    }
  };

  const handleDrop = async (column: string) => {
    const result = await run(() => dropColumn(column));
    if (result) {
      setActionMsg(result.message);
      await load();
    }
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const sortIndicator = (col: string) => {
    if (sortBy !== col) return null;
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Missing Values</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {actionMsg && <p className="text-sm text-green-600">{actionMsg}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-muted">
                {["column", "missing_count", "missing_pct", "total_rows"].map((col) => (
                  <th
                    key={col}
                    className="text-left p-2 border-b font-medium cursor-pointer hover:bg-muted-foreground/10"
                    onClick={() => toggleSort(col)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.replace(/_/g, " ")}
                      <ArrowUpDown className="h-3 w-3" />
                      {sortIndicator(col)}
                    </span>
                  </th>
                ))}
                <th className="text-left p-2 border-b font-medium">Fill</th>
                <th className="text-left p-2 border-b font-medium">Drop</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.column} className="border-b">
                  <td className="p-2 font-medium">{row.column}</td>
                  <td className="p-2">{row.missing_count}</td>
                  <td className="p-2">{row.missing_pct}%</td>
                  <td className="p-2">{row.total_rows}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      <Select
                        value={fillMethods[row.column] || ""}
                        onValueChange={(v: string | null) => setFillMethods((p) => ({ ...p, [row.column]: v ?? "" }))}
                      >
                        <SelectTrigger className="w-[130px]">
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
                        onClick={() => handleFill(row.column)}
                      >
                        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Fill"}
                      </Button>
                    </div>
                  </td>
                  <td className="p-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDrop(row.column)}
                      disabled={isLoading}
                    >
                      Drop
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

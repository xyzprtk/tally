"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { getDtypeOptions, convertDtype, downloadDataset } from "@/lib/api";
import type { DtypeColumn } from "@/lib/types";

export function DtypeManagement() {
  const { isLoading, error, run } = useEda();
  const [columns, setColumns] = useState<DtypeColumn[]>([]);
  const [changes, setChanges] = useState<Record<string, string>>({});

  const loadOptions = useCallback(async () => {
    const data = await getDtypeOptions();
    setColumns(data.columns);
  }, []);

  useEffect(() => { loadOptions(); }, [loadOptions]);

  const handleConvert = async (column: string) => {
    const target = changes[column];
    if (!target) return;
    const result = await run(() => convertDtype(column, target));
    if (result) {
      setColumns(result.columns);
      setChanges({});
    }
  };

  const handleDownload = async () => {
    const blob = await downloadDataset();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dataset_processed.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dtype Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2 border-b font-medium">Column Name</th>
                <th className="text-left p-2 border-b font-medium">Current Dtype</th>
                <th className="text-left p-2 border-b font-medium">New Dtype</th>
                <th className="text-left p-2 border-b font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => (
                <tr key={col.name} className="border-b">
                  <td className="p-2 font-medium">{col.name}</td>
                  <td className="p-2">{col.current_dtype}</td>
                  <td className="p-2">
                    {col.options.length > 0 ? (
                      <Select
                        value={changes[col.name] || ""}
                        onValueChange={(v) => setChanges((p) => ({ ...p, [col.name]: v }))}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {col.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground text-xs">No conversions available</span>
                    )}
                  </td>
                  <td className="p-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!changes[col.name] || isLoading}
                      onClick={() => handleConvert(col.name)}
                    >
                      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button onClick={handleDownload} className="gap-2" variant="secondary">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </CardContent>
    </Card>
  );
}

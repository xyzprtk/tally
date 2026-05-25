"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { getDtypeOptions, convertDtype, downloadDataset } from "@/lib/api";
import type { DtypeColumn } from "@/lib/types";

export function DtypeManagement() {
  const { isLoading, error, run } = useEda();
  const [columns, setColumns] = useState<DtypeColumn[]>([]);

  const loadOptions = useCallback(async () => {
    const data = await getDtypeOptions();
    setColumns(data.columns);
  }, []);

  useEffect(() => { loadOptions(); }, [loadOptions]);

  const handleConvert = async (column: string, target: string) => {
    const result = await run(() => convertDtype(column, target));
    if (result) {
      setColumns(result.columns);
      toast.success(`Converted "${column}" to ${target}`);
    } else if (error) {
      toast.error(error);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadDataset();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dataset_processed.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Dataset downloaded");
    } catch (e: any) {
      toast.error(e.message || "Download failed");
    }
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
                <th className="text-left p-2 border-b font-medium">Convert To</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => (
                <tr key={col.name} className="border-b">
                  <td className="p-2 font-medium">{col.name}</td>
                  <td className="p-2">{col.current_dtype}</td>
                  <td className="p-2">
                    {col.options.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {col.options.map((opt) => (
                          <Button
                            key={opt}
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleConvert(col.name, opt)}
                          >
                            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : `→ ${opt}`}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">No conversions available</span>
                    )}
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

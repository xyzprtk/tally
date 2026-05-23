"use client";

import { useState, useEffect, useCallback } from "react";
import { useEda } from "@/hooks/useEda";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getDatasetInfo, getDistribution } from "@/lib/api";

export function Distribution() {
  const { isLoading, error, run } = useEda();
  const [colList, setColList] = useState<string[]>([]);
  const [selectedCol, setSelectedCol] = useState("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    getDatasetInfo().then((info) => {
      const numeric = info.columns
        .filter((c) => c.dtype.startsWith("int") || c.dtype.startsWith("float"))
        .map((c) => c.name);
      setColList(numeric);
      if (numeric.length > 0) setSelectedCol(numeric[0]);
    });
  }, []);

  const handleRun = async () => {
    if (!selectedCol) return;
    const res = await run(() => getDistribution(selectedCol));
    if (res?.data) setResult(res.data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-end gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Column</label>
            <Select value={selectedCol} onValueChange={(v) => setSelectedCol(v)}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleRun} disabled={isLoading || !selectedCol}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze
          </Button>
        </div>

        {result?.image && (
          <div className="border rounded-lg overflow-hidden">
            <img src={`data:image/png;base64,${result.image}`} alt="Histogram" className="max-w-full h-auto" />
          </div>
        )}

        {result?.stats && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-muted">
                  {Object.keys(result.stats).map((k) => (
                    <th key={k} className="text-left p-2 border-b font-medium">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  {Object.values(result.stats).map((v, i) => (
                    <td key={i} className="p-2 font-mono">{String(v)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Table2 } from "lucide-react";
import { toast } from "sonner";
import { getDatasetInfo } from "@/lib/api";

type OpType = "filter" | "sort" | "groupby";

export function DataOperations() {
  const { result, isLoading, error, run } = useAnalytics();
  const [opType, setOpType] = useState<OpType>("filter");
  const [colList, setColList] = useState<string[]>([]);

  const [filterCol, setFilterCol] = useState("");
  const [filterOp, setFilterOp] = useState("==");
  const [filterVal, setFilterVal] = useState("");

  const [sortCol, setSortCol] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const [groupCol, setGroupCol] = useState("");
  const [aggCol, setAggCol] = useState("");
  const [aggFn, setAggFn] = useState("mean");

  useEffect(() => {
    getDatasetInfo().then((info) => {
      const names = info.columns.map((c) => c.name);
      setColList(names);
      if (names.length > 0) {
        setFilterCol(names[0]);
        setSortCol(names[0]);
        setGroupCol(names[0]);
        setAggCol(names[0]);
      }
    });
  }, []);

  const handleRun = async () => {
    const params: Record<string, any> = {};
    switch (opType) {
      case "filter":
        params.column = filterCol;
        params.operator = filterOp;
        params.value = filterVal;
        break;
      case "sort":
        params.column = sortCol;
        params.direction = sortDir;
        break;
      case "groupby":
        params.group_column = groupCol;
        params.agg_column = aggCol;
        params.agg_func = aggFn;
        break;
    }
    try {
      await run(opType, params);
      toast.success("Operation applied successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to apply operation");
    }
  };

  const operators = ["==", "!=", ">", "<", ">=", "<=", "contains"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="space-y-2">
            <Label>Operation</Label>
            <Select value={opType} onValueChange={(v: string | null) => setOpType((v ?? "filter") as OpType)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="filter">Filter</SelectItem>
                <SelectItem value="sort">Sort</SelectItem>
                <SelectItem value="groupby">Group By</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {opType === "filter" && (
            <>
              <div className="space-y-2">
                <Label>Column</Label>
                <Select value={filterCol} onValueChange={(v: string | null) => setFilterCol(v ?? "")}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Operator</Label>
                <Select value={filterOp} onValueChange={(v: string | null) => setFilterOp(v ?? "==")}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{operators.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input value={filterVal} onChange={(e) => setFilterVal(e.target.value)} className="w-[160px]" />
              </div>
            </>
          )}

          {opType === "sort" && (
            <>
              <div className="space-y-2">
                <Label>Column</Label>
                <Select value={sortCol} onValueChange={(v: string | null) => setSortCol(v ?? "")}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select value={sortDir} onValueChange={(v: string | null) => setSortDir(v ?? "asc")}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {opType === "groupby" && (
            <>
              <div className="space-y-2">
                <Label>Group By</Label>
                <Select value={groupCol} onValueChange={(v: string | null) => setGroupCol(v ?? "")}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Agg Column</Label>
                <Select value={aggCol} onValueChange={(v: string | null) => setAggCol(v ?? "")}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Function</Label>
                <Select value={aggFn} onValueChange={(v: string | null) => setAggFn(v ?? "mean")}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["mean", "sum", "count", "min", "max", "std"].map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {!result && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Table2 className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Apply an operation to see the transformed data.</p>
          </div>
        )}

        {result?.type === "table" && result.data && typeof result.data === "object" && "rows" in result.data && (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-muted sticky top-0">
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

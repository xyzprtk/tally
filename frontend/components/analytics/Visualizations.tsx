"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Image } from "lucide-react";
import { toast } from "sonner";
import { getDatasetInfo } from "@/lib/api";
import { PlotCard } from "@/components/shared/PlotCard";

type ChartType = "scatter_plot" | "bar_chart" | "histogram" | "line_chart" | "box_plot" | "correlation_heatmap";

export function Visualizations() {
  const { result, isLoading, error, run } = useAnalytics();
  const [chartType, setChartType] = useState<ChartType>("scatter_plot");
  const [colList, setColList] = useState<string[]>([]);
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [catColumn, setCatColumn] = useState("");
  const [valColumn, setValColumn] = useState("");
  const [aggFunc, setAggFunc] = useState("mean");
  const [bins, setBins] = useState("20");
  const [column, setColumn] = useState("");

  useEffect(() => {
    getDatasetInfo().then((info) => {
      const names = info.columns.map((c) => c.name);
      setColList(names);
      if (names.length > 0) {
        setXColumn(names[0]);
        setYColumn(names.length > 1 ? names[1] : names[0]);
        setCatColumn(names[0]);
        setValColumn(names[0]);
        setColumn(names[0]);
      }
    });
  }, []);

  const handleRun = async () => {
    const params: Record<string, any> = {};
    switch (chartType) {
      case "scatter_plot":
      case "line_chart":
        params.x_column = xColumn;
        params.y_column = yColumn;
        break;
      case "bar_chart":
        params.category_column = catColumn;
        params.value_column = valColumn;
        params.agg_func = aggFunc;
        break;
      case "histogram":
        params.column = column;
        params.bins = parseInt(bins) || 20;
        break;
      case "box_plot":
        params.column = column;
        break;
    }
    try {
      await run(chartType, params);
      toast.success("Visualization generated");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate visualization");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualizations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="space-y-2">
            <Label>Chart Type</Label>
            <Select value={chartType} onValueChange={(v: string | null) => setChartType((v ?? "scatter_plot") as ChartType)}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scatter_plot">Scatter Plot</SelectItem>
                <SelectItem value="bar_chart">Bar Chart</SelectItem>
                <SelectItem value="histogram">Histogram</SelectItem>
                <SelectItem value="line_chart">Line Chart</SelectItem>
                <SelectItem value="box_plot">Box Plot</SelectItem>
                <SelectItem value="correlation_heatmap">Correlation Heatmap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(chartType === "scatter_plot" || chartType === "line_chart") && (
            <>
              <div className="space-y-2">
                <Label>X Column</Label>
                <Select value={xColumn} onValueChange={(v: string | null) => setXColumn(v ?? "")}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Y Column</Label>
                <Select value={yColumn} onValueChange={(v: string | null) => setYColumn(v ?? "")}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}

          {chartType === "bar_chart" && (
            <>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={catColumn} onValueChange={(v: string | null) => setCatColumn(v ?? "")}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Select value={valColumn} onValueChange={(v: string | null) => setValColumn(v ?? "")}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Aggregation</Label>
                <Select value={aggFunc} onValueChange={(v: string | null) => setAggFunc(v ?? "mean")}>
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

          {(chartType === "histogram" || chartType === "box_plot") && (
            <div className="space-y-2">
              <Label>Column</Label>
              <Select value={column} onValueChange={(v: string | null) => setColumn(v ?? "")}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>{colList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {chartType === "histogram" && (
            <div className="space-y-2">
              <Label>Bins</Label>
              <Input type="number" value={bins} onChange={(e) => setBins(e.target.value)} className="w-24" />
            </div>
          )}

          <Button onClick={handleRun} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {!result && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Image className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Select parameters and click Generate to create a chart.</p>
          </div>
        )}

        {result?.type === "image" && typeof result.data === "string" && (
          <PlotCard src={result.data} alt="Chart" title={chartType.replace(/_/g, " ")} />
        )}
      </CardContent>
    </Card>
  );
}

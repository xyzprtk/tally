"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { restoreDataset } from "@/lib/api";
import { DtypeManagement } from "./DtypeManagement";
import { MissingValues } from "./MissingValues";
import { OutlierDetection } from "./OutlierDetection";
import { Distribution } from "./Distribution";
import { ValueCounts } from "./ValueCounts";
import { DuplicateDetection } from "./DuplicateDetection";

export function EdaTabs() {
  const [restoreKey, setRestoreKey] = useState(0);
  const [restoring, setRestoring] = useState(false);

  const handleRestore = useCallback(async () => {
    setRestoring(true);
    try {
      await restoreDataset();
      setRestoreKey((k) => k + 1);
    } finally {
      setRestoring(false);
    }
  }, []);

  return (
    <Tabs key={restoreKey} defaultValue="dtype" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="dtype">Dtype</TabsTrigger>
          <TabsTrigger value="missing">Missing</TabsTrigger>
          <TabsTrigger value="outliers">Outliers</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" onClick={handleRestore} disabled={restoring} className="gap-2 shrink-0 ml-4">
          <RotateCcw className="h-4 w-4" />
          Restore Original
        </Button>
      </div>

      <TabsContent value="dtype"><DtypeManagement /></TabsContent>
      <TabsContent value="missing"><MissingValues /></TabsContent>
      <TabsContent value="outliers"><OutlierDetection /></TabsContent>
      <TabsContent value="distribution"><Distribution /></TabsContent>
      <TabsContent value="values"><ValueCounts /></TabsContent>
      <TabsContent value="duplicates"><DuplicateDetection /></TabsContent>
    </Tabs>
  );
}

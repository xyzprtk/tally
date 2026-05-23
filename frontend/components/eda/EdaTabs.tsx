"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DtypeManagement } from "./DtypeManagement";
import { MissingValues } from "./MissingValues";
import { OutlierDetection } from "./OutlierDetection";
import { Distribution } from "./Distribution";
import { ValueCounts } from "./ValueCounts";
import { DuplicateDetection } from "./DuplicateDetection";

export function EdaTabs() {
  return (
    <Tabs defaultValue="dtype" className="w-full">
      <TabsList className="mb-6 flex-wrap">
        <TabsTrigger value="dtype">Dtype</TabsTrigger>
        <TabsTrigger value="missing">Missing</TabsTrigger>
        <TabsTrigger value="outliers">Outliers</TabsTrigger>
        <TabsTrigger value="distribution">Distribution</TabsTrigger>
        <TabsTrigger value="values">Values</TabsTrigger>
        <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
      </TabsList>

      <TabsContent value="dtype"><DtypeManagement /></TabsContent>
      <TabsContent value="missing"><MissingValues /></TabsContent>
      <TabsContent value="outliers"><OutlierDetection /></TabsContent>
      <TabsContent value="distribution"><Distribution /></TabsContent>
      <TabsContent value="values"><ValueCounts /></TabsContent>
      <TabsContent value="duplicates"><DuplicateDetection /></TabsContent>
    </Tabs>
  );
}

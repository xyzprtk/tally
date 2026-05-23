"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DescriptiveStats } from "./DescriptiveStats";
import { Visualizations } from "./Visualizations";
import { DataOperations } from "./DataOperations";

export function AnalyticsTabs() {
  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="stats">Descriptive Stats</TabsTrigger>
        <TabsTrigger value="viz">Visualizations</TabsTrigger>
        <TabsTrigger value="ops">Data Operations</TabsTrigger>
      </TabsList>

      <TabsContent value="stats">
        <DescriptiveStats />
      </TabsContent>
      <TabsContent value="viz">
        <Visualizations />
      </TabsContent>
      <TabsContent value="ops">
        <DataOperations />
      </TabsContent>
    </Tabs>
  );
}

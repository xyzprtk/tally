"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DescriptiveStats } from "./DescriptiveStats";
import { Visualizations } from "./Visualizations";
import { DataOperations } from "./DataOperations";
import { EdaTabs } from "@/components/eda/EdaTabs";

export function AnalyticsTabs() {
  return (
    <Tabs defaultValue="stats" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="stats">Descriptive Stats</TabsTrigger>
        <TabsTrigger value="viz">Visualizations</TabsTrigger>
        <TabsTrigger value="ops">Data Operations</TabsTrigger>
        <TabsTrigger value="eda">EDA</TabsTrigger>
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
      <TabsContent value="eda">
        <EdaTabs />
      </TabsContent>
    </Tabs>
  );
}

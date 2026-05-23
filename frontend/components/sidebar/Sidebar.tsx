"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DatasetInfo } from "@/lib/types";

interface Props {
  dataset: DatasetInfo;
  onUploadNew: (file: File) => Promise<void>;
}

export function Sidebar({ dataset, onUploadNew }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onUploadNew(f);
  };

  return (
    <aside className="w-[280px] border-r bg-background flex flex-col shrink-0">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm mb-1">Dataset</h3>
        <p className="text-xs text-muted-foreground">
          {dataset.row_count} rows · {dataset.columns.length} columns
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase">Columns</h4>
        <div className="space-y-1.5">
          {dataset.columns.map((col) => (
            <div key={col.name} className="flex items-center justify-between text-sm">
              <span className="truncate">{col.name}</span>
              <Badge variant="secondary" className="text-[10px] shrink-0 ml-2">
                {col.dtype}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase">Preview</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  {dataset.columns.slice(0, 4).map((col) => (
                    <th key={col.name} className="text-left py-1 pr-3 font-medium">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataset.sample.map((row, i) => (
                  <tr key={i} className="border-b border-muted/50">
                    {dataset.columns.slice(0, 4).map((col) => (
                      <td key={col.name} className="py-1 pr-3 text-muted-foreground">
                        {String(row[col.name] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload New Dataset
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </aside>
  );
}

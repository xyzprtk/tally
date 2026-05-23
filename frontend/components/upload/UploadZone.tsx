"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface Props {
  onUpload: (file: File) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function UploadZone({ onUpload, isLoading, error }: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "json") return;
    onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`w-full max-w-lg border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
        dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">Upload Dataset</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop a CSV or JSON file, or click to browse
      </p>
      <label>
        <Button variant="outline" disabled={isLoading} className="pointer-events-none">
          {isLoading ? "Uploading..." : "Choose File"}
        </Button>
        <input type="file" accept=".csv,.json" onChange={handleChange} className="hidden" />
      </label>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  );
}

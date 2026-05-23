"use client";

import { useState } from "react";
import type { DatasetInfo } from "@/lib/types";
import { uploadDataset as apiUpload } from "@/lib/api";

export function useDataset() {
  const [dataset, setDataset] = useState<DatasetInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiUpload(file);
      setDataset(data);
      return data;
    } catch (e: any) {
      setError(e.message || "Upload failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const clearDataset = () => {
    setDataset(null);
    setError(null);
  };

  return { dataset, isLoading, error, upload, clearDataset };
}

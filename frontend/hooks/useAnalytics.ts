"use client";

import { useState } from "react";
import type { AnalyticsResult } from "@/lib/types";
import { runAnalytics as apiRun } from "@/lib/api";

export function useAnalytics() {
  const [result, setResult] = useState<AnalyticsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (operation: string, params: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiRun({ operation, params });
      setResult(data);
      return data;
    } catch (e: any) {
      setError(e.message || "Analytics operation failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return { result, isLoading, error, run, clearResult };
}

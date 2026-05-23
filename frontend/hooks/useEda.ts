"use client";

import { useState, useCallback } from "react";

interface EdaState {
  isLoading: boolean;
  error: string | null;
}

export function useEda() {
  const [state, setState] = useState<EdaState>({ isLoading: false, error: null });

  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setState({ isLoading: true, error: null });
    try {
      const result = await fn();
      setState({ isLoading: false, error: null });
      return result;
    } catch (e: any) {
      setState({ isLoading: false, error: e.message || "Operation failed" });
      return null;
    }
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    run,
    clearError: () => setState((s) => ({ ...s, error: null })),
  };
}

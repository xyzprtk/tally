import type {
  DatasetInfo,
  AnalyticsRequest,
  AnalyticsResult,
  ChatRequest,
  ChatResponse,
  DtypeOptions,
} from "./types";

const API_BASE = "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function uploadDataset(file: File): Promise<DatasetInfo> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<DatasetInfo>(res);
}

export async function getDatasetInfo(): Promise<DatasetInfo & { has_dataset: boolean }> {
  const res = await fetch(`${API_BASE}/api/dataset/info`);
  return handleResponse(res);
}

export async function getPreview(tail = false): Promise<{ columns: string[]; rows: Record<string, any>[] }> {
  const res = await fetch(`${API_BASE}/api/dataset/preview${tail ? "?tail=true" : ""}`);
  return handleResponse(res);
}

export async function runAnalytics(req: AnalyticsRequest): Promise<AnalyticsResult> {
  const res = await fetch(`${API_BASE}/api/analyze/basic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  return handleResponse<AnalyticsResult>(res);
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  return handleResponse<ChatResponse>(res);
}

export async function downloadDataset(): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/dataset/download`);
  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}

// EDA endpoints

export async function getDtypeOptions(): Promise<DtypeOptions> {
  const res = await fetch(`${API_BASE}/api/eda/dtype-options`);
  return handleResponse<DtypeOptions>(res);
}

export async function convertDtype(column: string, targetDtype: string): Promise<DtypeOptions> {
  const res = await fetch(`${API_BASE}/api/eda/convert-dtype`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ column, target_dtype: targetDtype }),
  });
  return handleResponse<DtypeOptions>(res);
}

export async function getMissingSummary(sortBy = "missing_pct", sortDir = "desc"): Promise<AnalyticsResult> {
  const res = await fetch(`${API_BASE}/api/eda/missing?sort_by=${sortBy}&sort_dir=${sortDir}`);
  return handleResponse<AnalyticsResult>(res);
}

export async function fillMissing(column: string, method: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/eda/fill-missing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ column, method }),
  });
  return handleResponse(res);
}

export async function dropColumn(column: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/eda/drop-column`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ column }),
  });
  return handleResponse(res);
}

export async function getOutliersSummary(): Promise<AnalyticsResult> {
  const res = await fetch(`${API_BASE}/api/eda/outliers`);
  return handleResponse<AnalyticsResult>(res);
}

export async function getOutliersDetail(column: string): Promise<AnalyticsResult> {
  const res = await fetch(`${API_BASE}/api/eda/outliers/detail?column=${encodeURIComponent(column)}`);
  return handleResponse<AnalyticsResult>(res);
}

export async function removeOutliers(column: string, action: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/eda/outliers/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ column, action }),
  });
  return handleResponse(res);
}

export async function getDistribution(column: string): Promise<AnalyticsResult> {
  const res = await fetch(`${API_BASE}/api/eda/distribution?column=${encodeURIComponent(column)}`);
  return handleResponse<AnalyticsResult>(res);
}

export async function getValueCounts(topN = 20): Promise<AnalyticsResult> {
  const res = await fetch(`${API_BASE}/api/eda/value-counts?top_n=${topN}`);
  return handleResponse<AnalyticsResult>(res);
}

export async function getDuplicates(columns?: string[]): Promise<AnalyticsResult> {
  const qs = columns?.length ? `?columns=${columns.map(encodeURIComponent).join(",")}` : "";
  const res = await fetch(`${API_BASE}/api/eda/duplicates${qs}`);
  return handleResponse<AnalyticsResult>(res);
}

export async function dropDuplicates(columns?: string[]): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/eda/duplicates/drop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columns: columns || [] }),
  });
  return handleResponse(res);
}

export async function restoreDataset(): Promise<DtypeOptions> {
  const res = await fetch(`${API_BASE}/api/eda/restore`, {
    method: "POST",
  });
  return handleResponse<DtypeOptions>(res);
}

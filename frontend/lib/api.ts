import type {
  DatasetInfo,
  AnalyticsRequest,
  AnalyticsResult,
  ChatRequest,
  ChatResponse,
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

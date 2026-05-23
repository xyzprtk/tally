export interface ColumnInfo {
  name: string;
  dtype: string;
}

export interface DatasetInfo {
  columns: ColumnInfo[];
  row_count: number;
  sample: Record<string, any>[];
}

export interface AnalyticsRequest {
  operation: string;
  params: Record<string, any>;
}

export interface AnalyticsResult {
  type: "table" | "image";
  data: TableData | string;
}

export interface TableData {
  columns: string[];
  rows: Record<string, any>[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  result?: AnalyticsResult;
  error?: string;
}

export interface ChatRequest {
  messages: { role: string; content: string }[];
  provider: string;
  api_key: string;
}

export interface ChatResponse {
  response: string;
  result?: AnalyticsResult;
  error?: string;
}

export type Provider = "openrouter" | "groq";

export interface Settings {
  provider: Provider;
  api_key: string;
}

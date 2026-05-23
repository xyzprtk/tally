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

export interface DtypeColumn {
  name: string;
  current_dtype: string;
  options: string[];
}

export interface DtypeOptions {
  columns: DtypeColumn[];
}

export interface MissingRow {
  column: string;
  missing_count: number;
  missing_pct: number;
  total_rows: number;
}

export interface MissingResult {
  columns: string[];
  rows: MissingRow[];
}

export interface OutlierRow {
  column: string;
  outlier_count: number;
  outlier_pct: number;
}

export interface OutlierDetail {
  boxplot: string;
  outlier_rows: TableData;
  summary: {
    Q1: number;
    Q3: number;
    IQR: number;
    lower_bound: number;
    upper_bound: number;
    outlier_count: number;
  };
}

export interface DistributionResult {
  image: string;
  stats: Record<string, number>;
}

export interface ValueCountColumn {
  column: string;
  total_unique: number;
  rows: { value: string; count: number; pct: number }[];
}

export interface DuplicateSummary {
  duplicate_rows: number;
  duplicate_pct: number;
  total_rows: number;
  columns_used: string[];
}

export type Provider = "openrouter" | "groq";

export interface Settings {
  provider: Provider;
  api_key: string;
}

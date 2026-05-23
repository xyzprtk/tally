from pydantic import BaseModel, Field
from typing import Any, Optional


class ColumnInfo(BaseModel):
    name: str
    dtype: str


class UploadResponse(BaseModel):
    columns: list[ColumnInfo]
    row_count: int
    sample: list[dict]


class BasicAnalyticsRequest(BaseModel):
    operation: str
    params: dict


class BasicAnalyticsResponse(BaseModel):
    type: str
    data: Any


class ChatRequest(BaseModel):
    messages: list[dict]
    provider: str
    api_key: str


class ChatResponse(BaseModel):
    response: str
    result: Optional[dict] = None
    error: Optional[str] = None


class ErrorResponse(BaseModel):
    detail: str

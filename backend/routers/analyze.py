from fastapi import APIRouter, HTTPException

from services import dataset, analytics
from models.schemas import BasicAnalyticsRequest, BasicAnalyticsResponse

router = APIRouter()


@router.post("/api/analyze/basic", response_model=BasicAnalyticsResponse)
async def run_basic_analytics(req: BasicAnalyticsRequest):
    df = dataset.get_dataset()
    return analytics.run_operation(df, req.operation, req.params)


@router.get("/api/dataset/info")
async def get_dataset_info():
    if not dataset.has_dataset():
        return {"columns": [], "row_count": 0, "sample": [], "has_dataset": False}
    df = dataset.get_dataset()
    columns = dataset.get_columns()
    sample = df.head(5).fillna(value=None).to_dict(orient="records")
    return {
        "columns": [{"name": c.name, "dtype": c.dtype} for c in columns],
        "row_count": len(df),
        "sample": sample,
        "has_dataset": True,
    }

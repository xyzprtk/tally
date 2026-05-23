import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from services import dataset, eda
from models.schemas import BasicAnalyticsResponse

router = APIRouter()


# ---------------------------------------------------------------------------
# Dtype Management
# ---------------------------------------------------------------------------

@router.get("/api/eda/dtype-options")
async def get_dtype_options():
    df = dataset.get_dataset()
    return eda.get_available_conversions(df)


@router.post("/api/eda/convert-dtype")
async def convert_dtype(params: dict):
    df = dataset.get_dataset()
    new_df = eda.convert_dtype(df, params)
    dataset.set_dataset(new_df)
    return eda.get_available_conversions(new_df)


# ---------------------------------------------------------------------------
# Missing Values
# ---------------------------------------------------------------------------

@router.get("/api/eda/missing")
async def missing_summary(sort_by: str = "missing_pct", sort_dir: str = "desc"):
    df = dataset.get_dataset()
    return eda.missing_summary(df, {"sort_by": sort_by, "sort_dir": sort_dir})


@router.post("/api/eda/fill-missing")
async def fill_missing(params: dict):
    df = dataset.get_dataset()
    new_df = eda.fill_missing(df, params)
    dataset.set_dataset(new_df)
    return {"message": f"Filled missing values in column '{params['column']}'"}


@router.post("/api/eda/drop-column")
async def drop_column(params: dict):
    df = dataset.get_dataset()
    new_df = eda.drop_column(df, params)
    dataset.set_dataset(new_df)
    return {"message": f"Dropped column '{params['column']}'"}


# ---------------------------------------------------------------------------
# Outlier Detection
# ---------------------------------------------------------------------------

@router.get("/api/eda/outliers")
async def outliers_summary():
    df = dataset.get_dataset()
    return eda.outliers_summary(df, {})


@router.get("/api/eda/outliers/detail")
async def outliers_detail(column: str):
    df = dataset.get_dataset()
    return eda.outliers_detail(df, {"column": column})


@router.post("/api/eda/outliers/remove")
async def remove_outliers(params: dict):
    df = dataset.get_dataset()
    new_df = eda.remove_outliers(df, params)
    dataset.set_dataset(new_df)
    return {"message": f"Removed outliers from column '{params['column']}'"}


# ---------------------------------------------------------------------------
# Distribution
# ---------------------------------------------------------------------------

@router.get("/api/eda/distribution")
async def distribution(column: str):
    df = dataset.get_dataset()
    return eda.distribution(df, {"column": column})


# ---------------------------------------------------------------------------
# Value Counts
# ---------------------------------------------------------------------------

@router.get("/api/eda/value-counts")
async def value_counts(top_n: int = 20):
    df = dataset.get_dataset()
    return eda.value_counts_all(df, {"top_n": top_n})


# ---------------------------------------------------------------------------
# Duplicates
# ---------------------------------------------------------------------------

@router.get("/api/eda/duplicates")
async def duplicates_summary(columns: str = ""):
    df = dataset.get_dataset()
    col_list = [c.strip() for c in columns.split(",") if c.strip()] if columns else []
    return eda.duplicates_summary(df, {"columns": col_list})


@router.post("/api/eda/duplicates/drop")
async def drop_duplicates(params: dict):
    df = dataset.get_dataset()
    new_df = eda.drop_duplicates(df, params)
    dataset.set_dataset(new_df)
    return {"message": "Dropped duplicate rows"}


# ---------------------------------------------------------------------------
# Download
# ---------------------------------------------------------------------------

@router.get("/api/dataset/download")
async def download_dataset():
    df = dataset.get_dataset()
    filename = dataset.get_filename()

    stream = io.StringIO()
    df.to_csv(stream, index=False)
    stream.seek(0)

    download_name = filename.rsplit(".", 1)[0] + "_processed.csv"

    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
    )

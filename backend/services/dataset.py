import io
import pandas as pd
from fastapi import UploadFile, HTTPException

from models.schemas import ColumnInfo, UploadResponse

_df: pd.DataFrame | None = None
_filename: str | None = None


def load_dataset(file: UploadFile) -> UploadResponse:
    global _df, _filename

    filename = file.filename or "unknown"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ("csv", "json"):
        raise HTTPException(status_code=415, detail="Only CSV and JSON files are supported")

    content = file.file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        if ext == "csv":
            _df = pd.read_csv(io.BytesIO(content))
        else:
            _df = pd.read_json(io.BytesIO(content), orient="records")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse file: {str(e)}")

    if _df is None or _df.empty or len(_df.columns) == 0:
        raise HTTPException(status_code=400, detail="Dataset must have at least 1 row and 1 column")

    _filename = filename

    columns = [ColumnInfo(name=str(col), dtype=str(_df[col].dtype)) for col in _df.columns]
    sample = _df.head(5).fillna(value=None).to_dict(orient="records")

    return UploadResponse(
        columns=columns,
        row_count=len(_df),
        sample=sample,
    )


def get_dataset() -> pd.DataFrame:
    if _df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    return _df


def get_columns() -> list[ColumnInfo]:
    if _df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    return [ColumnInfo(name=str(col), dtype=str(_df[col].dtype)) for col in _df.columns]


def clear_dataset() -> None:
    global _df, _filename
    _df = None
    _filename = None


def set_dataset(df: pd.DataFrame) -> None:
    global _df
    _df = df


def get_filename() -> str:
    return _filename or "dataset"


def has_dataset() -> bool:
    return _df is not None

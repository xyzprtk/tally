import io
import base64
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from fastapi import HTTPException

from models.schemas import BasicAnalyticsResponse
from services.plot_theme import apply_theme

# ---------------------------------------------------------------------------
# Plot helpers (duplicated from analytics.py to keep services independent)
# ---------------------------------------------------------------------------

def _plot_to_base64() -> str:
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png", dpi=100, bbox_inches="tight", facecolor=plt.gcf().get_facecolor())
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close("all")
    buf.close()
    return b64


def _df_to_table(df: pd.DataFrame, limit: int = 100) -> dict:
    out = df.head(limit).copy()
    out = out.replace([float("inf"), float("-inf")], None).fillna(value=None)
    for col in out.columns:
        if out[col].dtype == "object":
            continue
        out[col] = out[col].apply(
            lambda x: int(x) if isinstance(x, (np.integer,))
            else float(x) if isinstance(x, (np.floating,))
            else x
        )
    return {"columns": [str(c) for c in out.columns], "rows": out.to_dict(orient="records")}


# ---------------------------------------------------------------------------
# 1. Dtype Management
# ---------------------------------------------------------------------------

VALID_DTYPE_CONVERSIONS = {
    "string": ["datetime", "numeric", "category"],
    "datetime": ["string"],
    "numeric": ["string"],
    "int64": ["string"],
    "float64": ["string"],
    "object": ["datetime", "numeric", "category"],
}

DTYPE_LABELS = {
    "datetime": "datetime",
    "numeric": "numeric",
    "category": "category",
    "string": "string",
}


def _normalize_dtype(dtype_str: str) -> str:
    s = str(dtype_str).lower()
    if s.startswith("int") or s.startswith("float"):
        return "numeric"
    if "datetime" in s:
        return "datetime"
    if s == "object":
        return "string"
    return s


def get_available_conversions(df: pd.DataFrame):
    columns = []
    for col in df.columns:
        current = _normalize_dtype(df[col].dtype)
        options = [DTYPE_LABELS[t] for t in VALID_DTYPE_CONVERSIONS.get(current, [])]
        columns.append({
            "name": str(col),
            "current_dtype": current,
            "options": options,
        })
    return {"columns": columns}


def convert_dtype(df: pd.DataFrame, params: dict) -> pd.DataFrame:
    column = params["column"]
    target = params["target_dtype"]

    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")

    df = df.copy()

    if target == "datetime":
        df[column] = pd.to_datetime(df[column], errors="coerce")
    elif target == "numeric":
        df[column] = pd.to_numeric(df[column], errors="coerce")
    elif target == "category":
        df[column] = df[column].astype("category")
    elif target == "string":
        if pd.api.types.is_datetime64_any_dtype(df[column]):
            df[column] = df[column].dt.strftime("%Y-%m-%d %H:%M:%S")
        else:
            df[column] = df[column].astype(str)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported target dtype: {target}")

    return df


# ---------------------------------------------------------------------------
# 2. Missing Values
# ---------------------------------------------------------------------------

def missing_summary(df: pd.DataFrame, params: dict):
    sort_by = params.get("sort_by", "missing_pct")
    sort_dir = params.get("sort_dir", "desc")

    rows = []
    total = len(df)
    for col in df.columns:
        missing = int(df[col].isna().sum())
        rows.append({
            "column": str(col),
            "missing_count": missing,
            "missing_pct": round(missing / total * 100, 2) if total > 0 else 0,
            "total_rows": total,
        })

    reverse = sort_dir == "desc"
    rows.sort(key=lambda r: r.get(sort_by, 0), reverse=reverse)

    return BasicAnalyticsResponse(
        type="table",
        data={"columns": ["column", "missing_count", "missing_pct", "total_rows"], "rows": rows},
    )


def fill_missing(df: pd.DataFrame, params: dict) -> pd.DataFrame:
    column = params["column"]
    method = params["method"]

    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")

    df = df.copy()
    series = df[column]

    if method == "mean":
        if not pd.api.types.is_numeric_dtype(series):
            raise HTTPException(status_code=400, detail="Mean fill only works on numeric columns")
        df[column] = series.fillna(series.mean())
    elif method == "median":
        if not pd.api.types.is_numeric_dtype(series):
            raise HTTPException(status_code=400, detail="Median fill only works on numeric columns")
        df[column] = series.fillna(series.median())
    elif method == "mode":
        mode_val = series.mode()
        fill_val = mode_val.iloc[0] if not mode_val.empty else None
        df[column] = series.fillna(fill_val)
    elif method == "ffill":
        df[column] = series.ffill()
    elif method == "zero":
        if not pd.api.types.is_numeric_dtype(series):
            raise HTTPException(status_code=400, detail="Zero fill only works on numeric columns")
        df[column] = series.fillna(0)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported fill method: {method}")

    return df


def drop_column(df: pd.DataFrame, params: dict) -> pd.DataFrame:
    column = params["column"]
    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")
    return df.drop(columns=[column])


# ---------------------------------------------------------------------------
# 3. Outlier Detection (IQR)
# ---------------------------------------------------------------------------

def outliers_summary(df: pd.DataFrame, params: dict):
    numeric_cols = df.select_dtypes(include="number").columns.tolist()
    rows = []
    total = len(df)
    for col in numeric_cols:
        series = df[col].dropna()
        Q1 = series.quantile(0.25)
        Q3 = series.quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        mask = (df[col] < lower) | (df[col] > upper)
        outlier_count = int(mask.sum())
        rows.append({
            "column": str(col),
            "outlier_count": outlier_count,
            "outlier_pct": round(outlier_count / total * 100, 2) if total > 0 else 0,
        })

    return BasicAnalyticsResponse(
        type="table",
        data={"columns": ["column", "outlier_count", "outlier_pct"], "rows": rows},
    )


def outliers_detail(df: pd.DataFrame, params: dict):
    apply_theme(params.get("theme", "dark"))
    column = params["column"]
    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")
    if not pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(status_code=400, detail=f"Column '{column}' is not numeric")

    series = df[column].dropna()
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR

    mask = (df[column] < lower) | (df[column] > upper)
    outlier_rows = df[mask]

    # Boxplot
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.boxplot(series, labels=[column])
    ax.set_ylabel(column)
    ax.set_title(f"Box Plot of {column}")
    b64 = _plot_to_base64()

    return BasicAnalyticsResponse(
        type="table",
        data={
            "boxplot": b64,
            "outlier_rows": _df_to_table(outlier_rows, limit=200),
            "summary": {
                "Q1": round(float(Q1), 2),
                "Q3": round(float(Q3), 2),
                "IQR": round(float(IQR), 2),
                "lower_bound": round(float(lower), 2),
                "upper_bound": round(float(upper), 2),
                "outlier_count": int(outlier_rows.shape[0]),
            },
        },
    )


def remove_outliers(df: pd.DataFrame, params: dict) -> pd.DataFrame:
    column = params["column"]
    action = params.get("action", "remove")

    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")
    if not pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(status_code=400, detail=f"Column '{column}' is not numeric")

    series = df[column].dropna()
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR

    mask = (df[column] < lower) | (df[column] > upper)

    if action == "remove":
        return df[~mask]
    elif action == "nullify":
        df = df.copy()
        df.loc[mask, column] = None
        return df
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported action: {action}")


# ---------------------------------------------------------------------------
# 4. Distribution
# ---------------------------------------------------------------------------

def distribution(df: pd.DataFrame, params: dict):
    apply_theme(params.get("theme", "dark"))
    column = params["column"]
    if column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{column}' not found")

    series = df[column].dropna()

    if not pd.api.types.is_numeric_dtype(df[column]):
        raise HTTPException(status_code=400, detail="Distribution is only available for numeric columns")

    # Histogram
    plt.figure(figsize=(8, 6))
    plt.hist(series, bins=20, edgecolor="none", alpha=0.85)
    plt.xlabel(column)
    plt.ylabel("Frequency")
    plt.title(f"Distribution of {column}")
    b64 = _plot_to_base64()

    stats = {
        "mean": round(float(series.mean()), 2),
        "median": round(float(series.median()), 2),
        "min": round(float(series.min()), 2),
        "max": round(float(series.max()), 2),
        "std": round(float(series.std()), 2),
        "skewness": round(float(series.skew()), 2),
        "kurtosis": round(float(series.kurtosis()), 2),
        "Q1": round(float(series.quantile(0.25)), 2),
        "Q2": round(float(series.quantile(0.50)), 2),
        "Q3": round(float(series.quantile(0.75)), 2),
    }

    return BasicAnalyticsResponse(
        type="table",
        data={"image": b64, "stats": stats},
    )


# ---------------------------------------------------------------------------
# 5. Value Counts
# ---------------------------------------------------------------------------

def value_counts_all(df: pd.DataFrame, params: dict):
    top_n = params.get("top_n", 20)
    columns_data = []

    for col in df.columns:
        vc = df[col].value_counts(dropna=False).head(top_n)
        total = int(vc.sum())
        rows = []
        for val, count in vc.items():
            val_str = "null" if (val is None or (isinstance(val, float) and np.isnan(val))) else str(val)
            rows.append({
                "value": val_str,
                "count": int(count),
                "pct": round(count / total * 100, 2) if total > 0 else 0,
            })
        columns_data.append({
            "column": str(col),
            "total_unique": int(df[col].nunique()),
            "rows": rows,
        })

    return BasicAnalyticsResponse(
        type="table",
        data={"columns": columns_data},
    )


# ---------------------------------------------------------------------------
# 6. Duplicates
# ---------------------------------------------------------------------------

def duplicates_summary(df: pd.DataFrame, params: dict):
    columns = params.get("columns", [])
    if not columns:
        columns = list(df.columns)

    unknown = [c for c in columns if c not in df.columns]
    if unknown:
        raise HTTPException(status_code=400, detail=f"Column(s) not found: {unknown}")

    dup_mask = df.duplicated(subset=columns, keep=False)
    dup_count = int(dup_mask.sum())
    total = len(df)

    duplicate_rows = df[dup_mask].drop_duplicates(subset=columns, keep="first")

    return BasicAnalyticsResponse(
        type="table",
        data={
            "summary": {
                "duplicate_rows": dup_count,
                "duplicate_pct": round(dup_count / total * 100, 2) if total > 0 else 0,
                "total_rows": total,
                "columns_used": columns,
            },
            "duplicate_rows": _df_to_table(duplicate_rows, limit=200),
        },
    )


def drop_duplicates(df: pd.DataFrame, params: dict) -> pd.DataFrame:
    columns = params.get("columns", [])
    if not columns:
        columns = list(df.columns)

    unknown = [c for c in columns if c not in df.columns]
    if unknown:
        raise HTTPException(status_code=400, detail=f"Column(s) not found: {unknown}")

    return df.drop_duplicates(subset=columns, keep="first")

import io
import base64
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from fastapi import HTTPException

from models.schemas import BasicAnalyticsResponse


def _plot_to_base64() -> str:
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png", dpi=100, bbox_inches="tight")
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
        out[col] = out[col].apply(lambda x: int(x) if isinstance(x, (np.integer,)) else float(x) if isinstance(x, (np.floating,)) else x)
    return {"columns": [str(c) for c in out.columns], "rows": out.to_dict(orient="records")}


def descriptive_stats(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    columns = params.get("columns", "all")
    if columns == "all":
        columns = list(df.select_dtypes(include="number").columns)
    else:
        unknown = [c for c in columns if c not in df.columns]
        if unknown:
            raise HTTPException(status_code=400, detail=f"Column(s) not found: {unknown}")

    rows = []
    for col in columns:
        if not pd.api.types.is_numeric_dtype(df[col]):
            continue
        series = df[col].dropna()
        rows.append({
            "column": col,
            "mean": round(float(series.mean()), 2),
            "median": round(float(series.median()), 2),
            "min": round(float(series.min()), 2),
            "max": round(float(series.max()), 2),
            "std": round(float(series.std()), 2),
            "count": int(series.count()),
            "unique": int(series.nunique()),
        })

    return BasicAnalyticsResponse(
        type="table",
        data={"columns": ["column", "mean", "median", "min", "max", "std", "count", "unique"], "rows": rows},
    )


def scatter_plot(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    x_col = params["x_column"]
    y_col = params["y_column"]
    if x_col not in df.columns or y_col not in df.columns:
        raise HTTPException(status_code=400, detail="Column not found")
    plt.figure(figsize=(8, 6))
    plt.scatter(df[x_col], df[y_col], alpha=0.6)
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.title(f"{y_col} vs {x_col}")
    b64 = _plot_to_base64()
    return BasicAnalyticsResponse(type="image", data=b64)


def bar_chart(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    cat_col = params["category_column"]
    val_col = params["value_column"]
    agg_func = params.get("agg_func", "mean")
    for col in [cat_col, val_col]:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
    plt.figure(figsize=(10, 6))
    df.groupby(cat_col)[val_col].agg(agg_func).plot(kind="bar")
    plt.xlabel(cat_col)
    plt.ylabel(f"{agg_func} of {val_col}")
    plt.title(f"{agg_func.capitalize()} of {val_col} by {cat_col}")
    plt.xticks(rotation=45, ha="right")
    b64 = _plot_to_base64()
    return BasicAnalyticsResponse(type="image", data=b64)


def histogram(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    col = params["column"]
    bins = params.get("bins", 20)
    if col not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
    plt.figure(figsize=(8, 6))
    plt.hist(df[col].dropna(), bins=bins, edgecolor="black", alpha=0.7)
    plt.xlabel(col)
    plt.ylabel("Frequency")
    plt.title(f"Histogram of {col}")
    b64 = _plot_to_base64()
    return BasicAnalyticsResponse(type="image", data=b64)


def line_chart(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    x_col = params["x_column"]
    y_col = params["y_column"]
    for col in [x_col, y_col]:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
    sorted_df = df.sort_values(by=x_col)
    plt.figure(figsize=(8, 6))
    plt.plot(sorted_df[x_col], sorted_df[y_col], marker="o", linestyle="-")
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.title(f"{y_col} vs {x_col}")
    b64 = _plot_to_base64()
    return BasicAnalyticsResponse(type="image", data=b64)


def box_plot(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    col = params["column"]
    if col not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
    plt.figure(figsize=(6, 8))
    plt.boxplot(df[col].dropna(), labels=[col])
    plt.ylabel(col)
    plt.title(f"Box Plot of {col}")
    b64 = _plot_to_base64()
    return BasicAnalyticsResponse(type="image", data=b64)


def correlation_heatmap(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    numeric_df = df.select_dtypes(include="number")
    if numeric_df.empty:
        raise HTTPException(status_code=400, detail="No numeric columns for correlation")
    corr = numeric_df.corr()
    fig, ax = plt.subplots(figsize=(10, 8))
    im = ax.imshow(corr, cmap="coolwarm", aspect="auto", vmin=-1, vmax=1)
    plt.colorbar(im, ax=ax)
    ax.set_xticks(range(len(corr.columns)))
    ax.set_yticks(range(len(corr.columns)))
    ax.set_xticklabels(corr.columns, rotation=45, ha="right")
    ax.set_yticklabels(corr.columns)
    for i in range(len(corr.columns)):
        for j in range(len(corr.columns)):
            ax.text(j, i, f"{corr.iloc[i, j]:.2f}", ha="center", va="center", fontsize=8)
    plt.title("Correlation Heatmap")
    b64 = _plot_to_base64()
    return BasicAnalyticsResponse(type="image", data=b64)


def filter_rows(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    col = params["column"]
    operator = params["operator"]
    value = params["value"]
    if col not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{col}' not found")

    op_map = {
        "==": lambda s, v: s == v,
        "!=": lambda s, v: s != v,
        ">": lambda s, v: pd.to_numeric(s, errors="coerce") > float(v),
        "<": lambda s, v: pd.to_numeric(s, errors="coerce") < float(v),
        ">=": lambda s, v: pd.to_numeric(s, errors="coerce") >= float(v),
        "<=": lambda s, v: pd.to_numeric(s, errors="coerce") <= float(v),
        "contains": lambda s, v: s.astype(str).str.contains(v, case=False, na=False),
    }
    if operator not in op_map:
        raise HTTPException(status_code=400, detail=f"Unsupported operator: {operator}")

    try:
        mask = op_map[operator](df[col], value)
        result = df[mask]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Filter failed: {str(e)}")

    return BasicAnalyticsResponse(type="table", data=_df_to_table(result))


def sort_rows(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    col = params["column"]
    ascending = params.get("direction", "asc") == "asc"
    if col not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{col}' not found")
    result = df.sort_values(by=col, ascending=ascending)
    return BasicAnalyticsResponse(type="table", data=_df_to_table(result))


def groupby_agg(df: pd.DataFrame, params: dict) -> BasicAnalyticsResponse:
    group_col = params["group_column"]
    agg_col = params["agg_column"]
    agg_func = params["agg_func"]
    for col in [group_col, agg_col]:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{col}' not found")

    valid_funcs = {"mean", "sum", "count", "min", "max", "std"}
    if agg_func not in valid_funcs:
        raise HTTPException(status_code=400, detail=f"Unsupported aggregation: {agg_func}")

    result = df.groupby(group_col)[agg_col].agg(agg_func).reset_index()
    return BasicAnalyticsResponse(type="table", data=_df_to_table(result))


OPERATIONS = {
    "descriptive_stats": descriptive_stats,
    "scatter_plot": scatter_plot,
    "bar_chart": bar_chart,
    "histogram": histogram,
    "line_chart": line_chart,
    "box_plot": box_plot,
    "correlation_heatmap": correlation_heatmap,
    "filter": filter_rows,
    "sort": sort_rows,
    "groupby": groupby_agg,
}


def run_operation(df: pd.DataFrame, operation: str, params: dict) -> BasicAnalyticsResponse:
    if operation not in OPERATIONS:
        raise HTTPException(status_code=400, detail=f"Unknown operation: {operation}")
    return OPERATIONS[operation](df, params)

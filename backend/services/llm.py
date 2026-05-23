import httpx
import pandas as pd
from fastapi import HTTPException

PROVIDERS = {
    "openrouter": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "default_model": "deepseek/deepseek-v4-flash",
    },
    "groq": {
        "url": "https://api.groq.com/openai/v1/chat/completions",
        "default_model": "llama-3.1-70b-versatile",
    },
}

SYSTEM_PROMPT = """You are a data analysis assistant. You have access to a pandas DataFrame called `df`.

Columns and types:
{column_list}

First 5 rows for reference:
{sample_rows}

When answering:
1. Write ONLY the Python code to answer the query, inside triple backticks with python tag.
2. Use print() to output text results.
3. For plots, use matplotlib.pyplot as plt — the plot will be captured automatically.
4. The code runs in a sandbox — only pandas (as pd), numpy (as np), matplotlib (as plt) are available. They are already imported.
5. Do NOT import os, sys, subprocess, shutil, or use open().
6. If the query is unclear, ask a clarifying question before writing code.
7. Be concise in your text responses."""


def build_system_prompt(df: pd.DataFrame) -> str:
    columns = [f"  - {col} ({dtype})" for col, dtype in zip(df.columns, df.dtypes)]
    column_list = "\n".join(columns)
    sample_rows = df.head(5).to_string(index=False)
    return SYSTEM_PROMPT.format(column_list=column_list, sample_rows=sample_rows)


def build_messages(chat_history: list[dict], df: pd.DataFrame) -> list[dict]:
    system_prompt = build_system_prompt(df)
    return [{"role": "system", "content": system_prompt}] + chat_history


async def call_llm(messages: list[dict], provider: str, api_key: str) -> str:
    if provider not in PROVIDERS:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {provider}")

    config = PROVIDERS[provider]
    payload = {
        "model": config["default_model"],
        "messages": messages,
        "temperature": 0.1,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(config["url"], json=payload, headers=headers)
            if response.status_code != 200:
                detail = response.text
                raise HTTPException(status_code=502, detail=f"Provider returned {response.status_code}: {detail[:200]}")
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except httpx.TimeoutException:
            raise HTTPException(status_code=502, detail="LLM provider request timed out")
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Failed to reach LLM provider: {str(e)}")

import re
import asyncio
import tempfile
import os
import pandas as pd

SANDBOX_TEMPLATE = """\
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
import os

# Load the dataset
_data_path = os.environ.get("SANDBOX_DF_PATH")
df = pd.read_csv(_data_path) if _data_path else pd.DataFrame()

# User's code
{user_code}

# Capture any plot
if len(plt.get_fignums()) > 0:
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close('all')
    print(f"__PLOT_B64_START__{{img_b64}}__PLOT_B64_END__")
"""

FORBIDDEN_PATTERNS = [
    r"import\s+os",
    r"import\s+sys",
    r"import\s+subprocess",
    r"import\s+shutil",
    r"import\s+importlib",
    r"from\s+os\s+import",
    r"from\s+sys\s+import",
    r"from\s+subprocess\s+import",
    r"from\s+shutil\s+import",
    r"from\s+importlib\s+import",
    r"exec\s*\(",
    r"eval\s*\(",
    r"__import__\s*\(",
    r"open\s*\(",
]


def validate_code(code: str) -> None:
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, code):
            raise ValueError(f"Generated code uses restricted patterns: {pattern}")


def _parse_output(stdout: str) -> dict:
    plot_match = re.search(r"__PLOT_B64_START__(.*?)__PLOT_B64_END__", stdout, re.DOTALL)
    if plot_match:
        text_parts = re.sub(r"__PLOT_B64_START__.*?__PLOT_B64_END__", "", stdout, flags=re.DOTALL).strip()
        return {"type": "image", "data": plot_match.group(1), "text": text_parts}
    return {"type": "table", "data": stdout.strip(), "text": stdout.strip()}


async def execute_code(code: str, df: pd.DataFrame) -> dict:
    try:
        validate_code(code)
    except ValueError as e:
        return {"error": str(e)}

    sandbox_code = SANDBOX_TEMPLATE.format(user_code=code)

    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, prefix="sandbox_") as tmp:
        tmp.write(sandbox_code)
        script_path = tmp.name

    with tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=False, prefix="sandbox_df_") as df_tmp:
        df.to_csv(df_tmp.name, index=False)
        df_path = df_tmp.name

    env = os.environ.copy()
    env["SANDBOX_DF_PATH"] = df_path

    try:
        proc = await asyncio.create_subprocess_exec(
            "python3", script_path,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
        )
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=30.0)
        except asyncio.TimeoutError:
            proc.kill()
            await proc.wait()
            return {"error": "Execution timed out after 30 seconds"}

        stdout_str = stdout.decode("utf-8", errors="replace")
        stderr_str = stderr.decode("utf-8", errors="replace")

        if stderr_str:
            return {"error": stderr_str.strip()}

        return _parse_output(stdout_str)
    finally:
        for path in (script_path, df_path):
            try:
                os.unlink(path)
            except OSError:
                pass

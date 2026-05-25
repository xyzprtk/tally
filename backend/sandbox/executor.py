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

# Theme setup
{theme_setup}

# Load the dataset
_data_path = os.environ.get("SANDBOX_DF_PATH")
df = pd.read_csv(_data_path) if _data_path else pd.DataFrame()

# User's code
{user_code}

# Capture any plot
if len(plt.get_fignums()) > 0:
    for fig_num in plt.get_fignums():
        fig = plt.figure(fig_num)
        fig.patch.set_facecolor(plt.rcParams['figure.facecolor'])
        for ax in fig.axes:
            ax.set_facecolor(plt.rcParams['axes.facecolor'])
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor=plt.gcf().get_facecolor())
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close('all')
    print(f"__PLOT_B64_START__{{img_b64}}__PLOT_B64_END__")
"""

THEME_SETUP_DARK = """\
import matplotlib.pyplot as plt
plt.rcParams.update({
    'figure.facecolor': '#161514',
    'figure.edgecolor': 'none',
    'axes.facecolor': '#1E1D1C',
    'axes.edgecolor': '#2B2A29',
    'axes.labelcolor': '#F9F8F6',
    'axes.titlecolor': '#F9F8F6',
    'axes.grid': True,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'xtick.color': '#F9F8F6',
    'ytick.color': '#F9F8F6',
    'xtick.labelcolor': '#F9F8F6',
    'ytick.labelcolor': '#F9F8F6',
    'grid.color': '#2B2A29',
    'grid.linestyle': '-',
    'grid.linewidth': 0.5,
    'grid.alpha': 0.5,
    'text.color': '#F9F8F6',
    'legend.facecolor': '#1E1D1C',
    'legend.edgecolor': '#2B2A29',
    'legend.labelcolor': '#F9F8F6',
    'legend.framealpha': 0.95,
    'lines.color': '#C05C46',
    'lines.linewidth': 2,
    'patch.facecolor': '#C05C46',
    'patch.edgecolor': '#2B2A29',
    'patch.linewidth': 1,
    'boxplot.boxprops.color': '#F9F8F6',
    'boxplot.capprops.color': '#F9F8F6',
    'boxplot.whiskerprops.color': '#F9F8F6',
    'boxplot.flierprops.color': '#C05C46',
    'boxplot.flierprops.markerfacecolor': '#C05C46',
    'boxplot.medianprops.color': '#C05C46',
    'boxplot.meanprops.color': '#C05C46',
    'axes.prop_cycle': plt.cycler(color=['#C05C46', '#6B6864', '#A8A5A0', '#8B8680', '#4A4744', '#D4715A', '#2E2C2A', '#F0EEEB']),
})
"""

THEME_SETUP_LIGHT = """\
import matplotlib.pyplot as plt
plt.rcParams.update({
    'figure.facecolor': '#F9F8F6',
    'figure.edgecolor': 'none',
    'axes.facecolor': '#FFFFFF',
    'axes.edgecolor': '#E3E0DD',
    'axes.labelcolor': '#161514',
    'axes.titlecolor': '#161514',
    'axes.grid': True,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'xtick.color': '#161514',
    'ytick.color': '#161514',
    'xtick.labelcolor': '#161514',
    'ytick.labelcolor': '#161514',
    'grid.color': '#E3E0DD',
    'grid.linestyle': '-',
    'grid.linewidth': 0.5,
    'grid.alpha': 0.5,
    'text.color': '#161514',
    'legend.facecolor': '#FFFFFF',
    'legend.edgecolor': '#E3E0DD',
    'legend.labelcolor': '#161514',
    'legend.framealpha': 0.95,
    'lines.color': '#C05C46',
    'lines.linewidth': 2,
    'patch.facecolor': '#C05C46',
    'patch.edgecolor': '#E3E0DD',
    'patch.linewidth': 1,
    'boxplot.boxprops.color': '#161514',
    'boxplot.capprops.color': '#161514',
    'boxplot.whiskerprops.color': '#161514',
    'boxplot.flierprops.color': '#C05C46',
    'boxplot.flierprops.markerfacecolor': '#C05C46',
    'boxplot.medianprops.color': '#C05C46',
    'boxplot.meanprops.color': '#C05C46',
    'axes.prop_cycle': plt.cycler(color=['#C05C46', '#6B6864', '#A8A5A0', '#8B8680', '#4A4744', '#D4715A', '#2E2C2A', '#F0EEEB']),
})
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


async def execute_code(code: str, df: pd.DataFrame, theme: str = "dark") -> dict:
    try:
        validate_code(code)
    except ValueError as e:
        return {"error": str(e)}

    theme_setup = THEME_SETUP_DARK if theme == "dark" else THEME_SETUP_LIGHT
    sandbox_code = SANDBOX_TEMPLATE.format(theme_setup=theme_setup, user_code=code)

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

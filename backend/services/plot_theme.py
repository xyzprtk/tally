import matplotlib.pyplot as plt

# Colors matching the frontend app's CSS variables
_THEMES = {
    "dark": {
        "background": "#161514",
        "card": "#1E1D1C",
        "foreground": "#F9F8F6",
        "muted": "#2E2C2A",
        "muted_foreground": "#A8A5A0",
        "border": "#2B2A29",
        "primary": "#C05C46",
        "grid": "#2B2A29",
    },
    "light": {
        "background": "#F9F8F6",
        "card": "#FFFFFF",
        "foreground": "#161514",
        "muted": "#F0EEEB",
        "muted_foreground": "#6B6864",
        "border": "#E3E0DD",
        "primary": "#C05C46",
        "grid": "#E3E0DD",
    },
}

CHART_COLORS = [
    "#C05C46",  # primary / coral
    "#6B6864",  # muted warm gray
    "#A8A5A0",  # light warm gray
    "#8B8680",  # mid warm gray
    "#4A4744",  # dark warm gray
    "#D4715A",  # coral hover
    "#2E2C2A",  # warm charcoal
    "#F0EEEB",  # off-white
]


def apply_theme(theme: str = "dark") -> None:
    """Configure matplotlib rcParams to match the application theme."""
    colors = _THEMES.get(theme, _THEMES["dark"])
    bg = colors["background"]
    card = colors["card"]
    fg = colors["foreground"]
    muted = colors["muted"]
    border = colors["border"]
    primary = colors["primary"]
    grid = colors["grid"]

    plt.rcParams.update(
        {
            # Figure
            "figure.facecolor": bg,
            "figure.edgecolor": "none",
            "figure.dpi": 100,
            # Axes
            "axes.facecolor": card,
            "axes.edgecolor": border,
            "axes.labelcolor": fg,
            "axes.titlecolor": fg,
            "axes.grid": True,
            "axes.grid.axis": "both",
            "axes.spines.top": False,
            "axes.spines.right": False,
            # Ticks
            "xtick.color": fg,
            "ytick.color": fg,
            "xtick.labelcolor": fg,
            "ytick.labelcolor": fg,
            "xtick.direction": "out",
            "ytick.direction": "out",
            # Grid
            "grid.color": grid,
            "grid.linestyle": "-",
            "grid.linewidth": 0.5,
            "grid.alpha": 0.5,
            # Text
            "text.color": fg,
            # Legend
            "legend.facecolor": card,
            "legend.edgecolor": border,
            "legend.labelcolor": fg,
            "legend.framealpha": 0.95,
            # Lines
            "lines.color": primary,
            "lines.linewidth": 2,
            # Patch (bars, boxes)
            "patch.facecolor": primary,
            "patch.edgecolor": border,
            "patch.linewidth": 1,
            # Boxplot
            "boxplot.boxprops.color": fg,
            "boxplot.capprops.color": fg,
            "boxplot.whiskerprops.color": fg,
            "boxplot.flierprops.color": primary,
            "boxplot.flierprops.markerfacecolor": primary,
            "boxplot.medianprops.color": primary,
            "boxplot.meanprops.color": primary,
            # Color cycle
            "axes.prop_cycle": plt.cycler(color=CHART_COLORS),
        }
    )


def reset_theme() -> None:
    """Reset matplotlib rcParams to defaults."""
    plt.rcdefaults()

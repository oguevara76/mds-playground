#!/usr/bin/env python3
"""
Completa html[data-theme="dark"] en styles/primeng-tokens.css con los --p-* del bloque light
que falten (mantiene overrides ya definidos en dark). Ejecutar tras editar el bloque light.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOKENS = ROOT / "styles" / "primeng-tokens.css"

MARKER_LIGHT = 'html[data-theme="light"]'
MARKER_DARK = 'html[data-theme="dark"]'

SHELL_DARK_BLOCK = """
  /* ── App shell (contenedor legacy: body, topbar, sidebar, preview-tabs) ── */
  --app-bg:         var(--surface-950, var(--p-surface-950));
  --sidebar-bg:     var(--surface-950, var(--p-surface-950));
  --sidebar-border: var(--surface-700, var(--p-surface-700));
  --topbar-bg:      var(--surface-950, var(--p-surface-950));
  --topbar-border:  var(--surface-700, var(--p-surface-700));

  --p-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.35);
  --p-shadow-2: 0 4px 12px rgba(0, 0, 0, 0.4);
""".strip()

SHELL_VAR_NAMES = (
    "--app-bg",
    "--sidebar-bg",
    "--sidebar-border",
    "--topbar-bg",
    "--topbar-border",
)


def extract_declarations(body: str) -> dict[str, str]:
    """Map --p-* name → full declaration text (supports multiline values)."""
    decls: dict[str, str] = {}
    i = 0
    while i < len(body):
        m = re.match(r"\n?(\s*)(--p-[\w-]+):\s*", body[i:])
        if not m:
            i += 1
            continue
        indent, name = m.group(1), m.group(2)
        start = i + m.start()
        val_start = i + m.end()
        j = val_start
        paren = 0
        while j < len(body):
            ch = body[j]
            if ch == "(":
                paren += 1
            elif ch == ")":
                paren = max(0, paren - 1)
            elif ch == ";" and paren == 0:
                break
            j += 1
        line = body[start : j + 1].strip("\n")
        if name not in decls:
            decls[name] = line
        i = j + 1
    return decls


def strip_shell_block(body: str) -> str:
    """Quita bloque shell dark previo para reinyectarlo al final."""
    body = re.sub(
        r"\n\s*/\* ── App shell \(contenedor legacy.*?\n(?:\s*--[\w-]+:.*\n)+",
        "\n",
        body,
        flags=re.DOTALL,
    )
    for name in SHELL_VAR_NAMES:
        body = re.sub(rf"^\s*{re.escape(name)}:.*\n", "", body, flags=re.MULTILINE)
    return body.rstrip()


def main() -> None:
    css = TOKENS.read_text(encoding="utf-8")
    if MARKER_LIGHT not in css or MARKER_DARK not in css:
        raise SystemExit("No se encontraron bloques light/dark en primeng-tokens.css")

    before_dark, rest = css.split(MARKER_DARK, 1)
    light_body = before_dark.split(MARKER_LIGHT, 1)[1]
    dark_open, dark_rest = rest.split("{", 1)
    dark_body, after = dark_rest.rsplit("}", 1)

    light_decls = extract_declarations(light_body)
    dark_decls = extract_declarations(strip_shell_block(dark_body))

    merged_keys = list(dark_decls.keys())
    for key in light_decls:
        if key not in dark_decls:
            merged_keys.append(key)

    lines = [MARKER_DARK + " {"]
    for key in merged_keys:
        lines.append("  " + dark_decls.get(key, light_decls[key]))
    lines.append(SHELL_DARK_BLOCK)
    lines.append("}")
    lines.append(after.lstrip("\n") if after.startswith("\n") else after)

    TOKENS.write_text(before_dark + "\n".join(lines), encoding="utf-8")
    added = len(merged_keys) - len(dark_decls)
    print(f"dark: {len(dark_decls)} → {len(merged_keys)} vars (+{added})")


if __name__ == "__main__":
    main()

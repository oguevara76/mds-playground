#!/usr/bin/env python3
"""Regenera js/mds-vars-data.js desde styles/mds-primitives.css, mds-semantic-*.css y mds-components.css."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLES = ROOT / "styles"
OUT = ROOT / "js" / "mds-vars-data.js"


def extract_block(css: str, selector: str) -> str:
    i = css.find(selector)
    if i < 0:
        return ""
    j = css.find("{", i)
    if j < 0:
        return ""
    depth = 0
    start = j + 1
    for k in range(j, len(css)):
        if css[k] == "{":
            depth += 1
        elif css[k] == "}":
            depth -= 1
            if depth == 0:
                return css[start:k]
    return ""


def parse_vars(inner: str):
    seen = {}
    for m in re.finditer(r"(--[\w-]+)\s*:\s*([^;}\n]+);", inner):
        seen[m.group(1).strip()] = m.group(2).strip()
    return sorted(seen.items(), key=lambda x: x[0])


def esc_js_string(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def emit_arr(pairs, indent="    "):
    lines = [f'{indent}{{ name: "{n}", value: "{esc_js_string(v)}" }},' for n, v in pairs]
    return "\n".join(lines)


def main():
    prim_css = (STYLES / "mds-primitives.css").read_text(encoding="utf-8")
    comp_css = (STYLES / "mds-components.css").read_text(encoding="utf-8")
    light_css = (STYLES / "mds-semantic-light.css").read_text(encoding="utf-8")
    dark_css = (STYLES / "mds-semantic-dark.css").read_text(encoding="utf-8")

    prim = parse_vars(extract_block(prim_css, "html:root"))
    comp = parse_vars(extract_block(comp_css, "html:root"))
    light = parse_vars(extract_block(light_css, 'html[data-theme="light"]'))
    dark = parse_vars(extract_block(dark_css, 'html[data-theme="dark"]'))

    out = (
        "/* AUTO-GENERATED — do not edit by hand. Run: python3 scripts/regen-mds-vars-data.py */\n"
        "const MDS_VARS = {\n  prim: [\n"
        + emit_arr(prim)
        + "\n  ],\n  light: [\n"
        + emit_arr(light)
        + "\n  ],\n  dark: [\n"
        + emit_arr(dark)
        + "\n  ],\n  comp: [\n"
        + emit_arr(comp)
        + "\n  ]\n};\n"
    )
    OUT.write_text(out, encoding="utf-8")
    print(f"OK: prim={len(prim)} light={len(light)} dark={len(dark)} comp={len(comp)} → {OUT}")


if __name__ == "__main__":
    main()

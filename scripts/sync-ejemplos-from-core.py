#!/usr/bin/env python3
"""
Regenera ejemplos/* desde styles/mds-*.css preservando colores CTA (primary, highlight, button-primary).
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLES = ROOT / "styles"
EJEMPLOS = ROOT / "ejemplos"

CORE = {
    "primitives": STYLES / "mds-primitives.css",
    "components": STYLES / "mds-components.css",
    "semantic-light": STYLES / "mds-semantic-light.css",
    "semantic-dark": STYLES / "mds-semantic-dark.css",
}

SELECTORS = {
    "primitives": "html:root",
    "components": "html:root",
    "semantic-light": 'html[data-theme="light"]',
    "semantic-dark": 'html[data-theme="dark"]',
}

# Tokens semánticos que definen el color CTA del ejemplo
SEM_CTA_RE = re.compile(
    r"^--(?:primary(?:-\d+)?|primary-(?:color|hover-color|active-color|contrast-color)|"
    r"surface-context-(?:fixed-primary|primary-medium|primary-soft|primary-subtle)|"
    r"highlight-(?:background|color|focus-background|focus-color))$"
)

COMP_CTA_RE = re.compile(r"^--button-primary-")


def strip_layer(css: str) -> str:
    return re.sub(r"@layer\s+mds-core;\s*\n?", "", css)


def extract_header(css: str) -> str:
    m = re.match(r"(\s*/\*[\s\S]*?\*/\s*)", css)
    return m.group(1).rstrip() if m else ""


def extract_block(css: str, selector: str) -> str:
    css = strip_layer(css)
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


def parse_vars(inner: str) -> dict[str, str]:
    seen: dict[str, str] = {}
    for m in re.finditer(r"(--[\w-]+)\s*:\s*([^;}\n]+);", inner):
        seen[m.group(1).strip()] = m.group(2).strip()
    return seen


def format_block(selector: str, vars_map: dict[str, str]) -> str:
    lines = [f"  {k}: {v};" for k, v in sorted(vars_map.items(), key=lambda x: x[0])]
    return f"{selector} {{\n" + "\n".join(lines) + "\n}\n"


def preserved_sem_cta(vars_map: dict[str, str]) -> dict[str, str]:
    return {k: v for k, v in vars_map.items() if SEM_CTA_RE.match(k)}


def preserved_comp_cta(vars_map: dict[str, str]) -> dict[str, str]:
    return {k: v for k, v in vars_map.items() if COMP_CTA_RE.match(k)}


def preserved_primitive_ramp(vars_map: dict[str, str]) -> dict[str, str]:
    """Rampas de color custom (--blue-*, --olive-*, etc.) definidas solo en el ejemplo."""
    ramps: dict[str, str] = {}
    for k, v in vars_map.items():
        m = re.match(r"--([a-z]+)-(50|100|200|300|400|500|600|700|800|900|950)$", k)
        if not m:
            continue
        family = m.group(1)
        ramps[k] = v
    return ramps


def merge_maps(base: dict[str, str], override: dict[str, str]) -> dict[str, str]:
    out = dict(base)
    out.update(override)
    return out


def process_example(example_dir: Path) -> None:
    name = example_dir.name
    print(f"  {name}")

    for key, core_path in CORE.items():
        selector = SELECTORS[key]
        core_css = core_path.read_text(encoding="utf-8")
        core_vars = parse_vars(extract_block(core_css, selector))

        ejemplo_path = example_dir / (
            "primitives.css"
            if key == "primitives"
            else "components.css"
            if key == "components"
            else f"semantic-{'light' if 'light' in key else 'dark'}.css"
        )

        if not ejemplo_path.exists():
            print(f"    omitido (no existe {ejemplo_path.name})")
            continue

        old_css = ejemplo_path.read_text(encoding="utf-8")
        header = extract_header(old_css)
        old_vars = parse_vars(extract_block(old_css, selector))

        if key == "primitives":
            preserve = preserved_primitive_ramp(old_vars)
            merged = merge_maps(core_vars, preserve)
        elif key == "components":
            preserve = preserved_comp_cta(old_vars)
            merged = merge_maps(core_vars, preserve)
        else:
            preserve = preserved_sem_cta(old_vars)
            merged = merge_maps(core_vars, preserve)

        body = format_block(selector, merged)
        out = (header + "\n\n" if header else "") + body
        ejemplo_path.write_text(out, encoding="utf-8")
        print(f"    {ejemplo_path.name}: {len(merged)} vars ({len(preserve)} CTA preservadas)")


def main() -> None:
    if not EJEMPLOS.is_dir():
        raise SystemExit(f"No existe {EJEMPLOS}")

    print("Sincronizando ejemplos desde core…")
    for d in sorted(EJEMPLOS.iterdir()):
        if d.is_dir() and not d.name.startswith("."):
            process_example(d)
    print("Listo.")


if __name__ == "__main__":
    main()

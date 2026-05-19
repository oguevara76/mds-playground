#!/usr/bin/env python3
"""
Vacía ejemplos/* y regenera primitives, components, semantic-light/dark desde el core MDS,
aplicando los colores de brand definidos en scripts/ejemplos-brand.json.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLES = ROOT / "styles"
EJEMPLOS = ROOT / "ejemplos"
MANIFEST = ROOT / "scripts" / "ejemplos-brand.json"

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

FILE_NAMES = {
    "primitives": "primitives.css",
    "components": "components.css",
    "semantic-light": "semantic-light.css",
    "semantic-dark": "semantic-dark.css",
}


def strip_layer(css: str) -> str:
    return re.sub(r"@layer\s+mds-core;\s*\n?", "", css)


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
    return f"{selector} {{\n" + "\n".join(lines) + "\n}}\n"


def merge_maps(base: dict[str, str], override: dict[str, str]) -> dict[str, str]:
    out = dict(base)
    out.update(override)
    return out


def clear_ejemplos() -> None:
    for d in sorted(EJEMPLOS.iterdir()):
        if not d.is_dir() or d.name.startswith("."):
            continue
        for f in d.iterdir():
            if f.is_file():
                f.unlink()
            elif f.is_dir():
                import shutil

                shutil.rmtree(f)


def load_manifest() -> dict:
    if not MANIFEST.is_file():
        raise SystemExit(
            f"No existe {MANIFEST}. Ejecuta primero la extracción de brand desde ejemplos existentes."
        )
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def rebuild_example(name: str, brand: dict) -> None:
    example_dir = EJEMPLOS / name
    example_dir.mkdir(parents=True, exist_ok=True)
    headers = brand.get("headers", {})
    overrides = brand.get("overrides", {})

    print(f"  {name}")
    for key, core_path in CORE.items():
        selector = SELECTORS[key]
        core_vars = parse_vars(extract_block(core_path.read_text(encoding="utf-8"), selector))
        brand_vars = overrides.get(key, {})
        merged = merge_maps(core_vars, brand_vars)

        header = headers.get(key, "").strip()
        body = format_block(selector, merged)
        out = (header + "\n\n" if header else "") + body

        out_path = example_dir / FILE_NAMES[key]
        out_path.write_text(out, encoding="utf-8")
        print(f"    {out_path.name}: {len(merged)} vars ({len(brand_vars)} brand)")


def main() -> None:
    if not EJEMPLOS.is_dir():
        raise SystemExit(f"No existe {EJEMPLOS}")

    manifest = load_manifest()
    print("Limpiando carpetas ejemplos/…")
    clear_ejemplos()
    print("Reconstruyendo desde core + brand…")
    for name in sorted(manifest.keys()):
        rebuild_example(name, manifest[name])
    print("Listo.")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Análisis de componente PrimeNG para incorporar al playground MDS."""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import (
    STAGING_DEFAULT,
    load_core_vars,
    load_export_vars,
    load_registry,
    merged_catalog,
    read_bridge_vars,
    resolve_var_exists,
    suggest_bridge_entry,
)
from mds_component_lib import (
    REFERENCE_BY_CATALOG,
    find_showcase,
    normalize_component,
    scan_index_for_anchor,
    suggest_catalog,
    suggest_reference,
    var_prefix,
)

POPOVER_EXCLUDE = {
    "ngmodel",
    "formcontrol",
    "formcontrolname",
    "inputid",
    "id",
    "name",
    "style",
    "styleclass",
    "class",
    "aria",
    "tabindex",
    "autofocus",
    "placeholder",
    "options",
    "datakey",
    "optionlabel",
    "optionvalue",
    "optiondisabled",
    "optiongrouplabel",
    "optiongroupchildren",
    "filterby",
    "scrollheight",
    "virtualscroll",
    "virtualscrollitemsize",
    "virtualscrolloptions",
    "lazy",
    "loading",
    "loadingicon",
    "dropdownicon",
    "showclear",
    "editable",
    "appendto",
    "autocomplete",
    "autofocus",
    "binary",
    "value",
    "model",
    "pt",
    "dt",
    "unstyled",
}

POPOVER_PREFERRED = {
    "size": ("p-selectbutton", "small | normal | large"),
    "variant": ("p-select", "outlined | filled"),
    "severity": ("p-select", "primary | secondary | …"),
    "disabled": ("p-toggleswitch", "true | false"),
    "rounded": ("p-toggleswitch", "true | false"),
    "raised": ("p-toggleswitch", "true | false"),
    "outlined": ("p-toggleswitch", "true | false"),
    "text": ("p-toggleswitch", "true | false"),
    "position": ("p-select", "top | bottom | left | right"),
    "showdelay": ("p-select", "ms"),
    "hidedelay": ("p-select", "ms"),
    "removable": ("p-toggleswitch", "true | false"),
    "iconpos": ("p-select", "left | right"),
    "floatlabelvariant": ("p-select", "over | on | in"),
}

INPUT_PATTERNS = [
    re.compile(r"@Input\(\)\s+(?:readonly\s+)?(\w+)"),
    re.compile(r"readonly\s+(\w+)\s*=\s*input(?:<[^>]+>)?\("),
    re.compile(r"(\w+)\s*=\s*input(?:<[^>]+>)?\([^)]*\)", re.I),
]


def collect_mds_vars(prefix: str, catalog: dict[str, str]) -> dict[str, str]:
    needle = f"--{prefix}-"
    return {k: v for k, v in catalog.items() if k.startswith(needle)}


def collect_bridge_for_prefix(prefix: str, bridge: dict[str, str]) -> dict[str, str]:
    needle = f"--p-{prefix}-"
    return {k: v for k, v in bridge.items() if k.startswith(needle)}


def scan_primeng_inputs(component: str) -> tuple[list[str], list[str]]:
    """Devuelve (inputs, warnings)."""
    warnings: list[str] = []
    base = Path(__file__).resolve().parents[1] / "node_modules" / "primeng" / component
    if not base.is_dir():
        return [], [f"node_modules/primeng/{component} no encontrado — instala deps con pnpm install"]

    inputs: set[str] = set()
    for ts in base.rglob("*.ts"):
        if ts.name.endswith(".spec.ts"):
            continue
        text = ts.read_text(encoding="utf-8", errors="ignore")
        for pat in INPUT_PATTERNS:
            for m in pat.finditer(text):
                name = m.group(1)
                if name and name[0].islower():
                    inputs.add(name)
    return sorted(inputs), warnings


def propose_popover_props(inputs: list[str], reference: str) -> list[dict]:
    props: list[dict] = []
    ref_defaults = _reference_popover_defaults(reference)

    for inp in inputs:
        key = inp.lower()
        if key in POPOVER_EXCLUDE or key.endswith("icon") and key not in {"iconpos"}:
            continue
        if key in POPOVER_PREFERRED:
            control, values = POPOVER_PREFERRED[key]
            props.append(
                {
                    "property": inp,
                    "control": control,
                    "demo_values": values,
                    "include": True,
                    "reason": "Prop visual frecuente en playground",
                }
            )
        elif key in {"size", "variant", "severity", "disabled", "rounded", "raised", "outlined"}:
            control, values = POPOVER_PREFERRED.get(key, ("p-select", "—"))
            props.append(
                {
                    "property": inp,
                    "control": control,
                    "demo_values": values,
                    "include": True,
                    "reason": "API PrimeNG relevante para demo",
                }
            )

    if not props and ref_defaults:
        return ref_defaults

    # Dedupe by property
    seen: set[str] = set()
    unique: list[dict] = []
    for p in props:
        if p["property"] in seen:
            continue
        seen.add(p["property"])
        unique.append(p)
    return unique[:12]


def _reference_popover_defaults(reference: str) -> list[dict]:
    templates: dict[str, list[dict]] = {
        "checkbox": [
            {"property": "variant", "control": "p-select", "demo_values": "outlined | filled", "include": True, "reason": "Theme (como checkbox)"},
            {"property": "size", "control": "p-selectbutton", "demo_values": "small | normal | large", "include": True, "reason": "Size (como checkbox)"},
        ],
        "inputtext": [
            {"property": "variant", "control": "p-select", "demo_values": "default | floatlabel | iftalabel", "include": True, "reason": "Variante showcase"},
            {"property": "size", "control": "p-selectbutton", "demo_values": "small | normal | large", "include": True, "reason": "Size"},
        ],
        "button": [
            {"property": "severity", "control": "p-select", "demo_values": "primary | secondary | …", "include": True, "reason": "Variant"},
            {"property": "size", "control": "p-selectbutton", "demo_values": "small | normal | large", "include": True, "reason": "Size"},
        ],
        "tag": [
            {"property": "severity", "control": "p-select", "demo_values": "primary | success | …", "include": True, "reason": "Severity"},
        ],
        "tooltip": [
            {"property": "position", "control": "p-select", "demo_values": "top | bottom | …", "include": True, "reason": "Position"},
        ],
    }
    return templates.get(reference, templates["checkbox"])


def classify_variables(
    prefix: str,
    mds_vars: dict[str, str],
    bridge_vars: dict[str, str],
    full_catalog: dict[str, str],
    staging_vars: dict[str, str] | None,
) -> dict[str, list[dict]]:
    categories: dict[str, list[dict]] = {
        "ok": [],
        "new_in_core": [],
        "new_figma": [],
        "missing_in_core": [],
        "deprecated": [],
    }

    for name, value in sorted(mds_vars.items()):
        p_name = f"--p-{name[2:]}"
        bridge_ok = p_name in bridge_vars
        resolves = resolve_var_exists(name, full_catalog)
        if bridge_ok and resolves:
            categories["ok"].append({"var": name, "value": value, "bridge": p_name})
        elif resolves and not bridge_ok:
            entry = suggest_bridge_entry(name, value)
            categories["new_in_core"].append(
                {"var": name, "value": value, "suggested_bridge": entry["name"], "bridge_value": entry["value"]}
            )
        else:
            categories["missing_in_core"].append({"var": name, "value": value})

    if staging_vars:
        for name, value in sorted(staging_vars.items()):
            if name.startswith(f"--{prefix}-") and name not in mds_vars:
                categories["new_figma"].append({"var": name, "value": value})

    return categories


def load_staging_component_vars(prefix: str) -> dict[str, str] | None:
    if not STAGING_DEFAULT.is_dir():
        return None
    export, errors = load_export_vars(STAGING_DEFAULT)
    if errors or not export:
        return None
    comp = export.get("components", {})
    return {k: v for k, v in comp.items() if k.startswith(f"--{prefix}-")}


def files_to_modify(catalog: str, new_catalog: bool) -> list[str]:
    cat_dir = f"src/app/catalogs/{catalog}"
    files = [
        f"{cat_dir}/{catalog}-catalog.config.ts",
        f"{cat_dir}/{catalog}-catalog.component.ts",
        f"{cat_dir}/{catalog}-catalog.component.html",
        "src/app/layout/playground-component-index.ts",
        "scripts/mds-component-registry.json",
    ]
    if new_catalog:
        files.extend(
            [
                f"{cat_dir}/{catalog}-catalog.component.css",
                "src/app/app.routes.ts",
                "src/app/layout/app-shell.component.html",
            ]
        )
    return files


def run_analysis(component_arg: str) -> dict:
    component = normalize_component(component_arg)
    prefix = var_prefix(component)
    anchor = f"pg-{component}"

    showcase_exists, showcase_file = find_showcase(anchor)
    in_index = scan_index_for_anchor(anchor)

    slots = load_core_vars()
    full_catalog = merged_catalog(slots)
    mds_vars = collect_mds_vars(prefix, slots.get("components", {}))
    bridge = read_bridge_vars()
    bridge_prefix = collect_bridge_for_prefix(prefix, bridge)
    staging_vars = load_staging_component_vars(prefix)

    var_categories = classify_variables(prefix, mds_vars, bridge, full_catalog, staging_vars)

    inputs, input_warnings = scan_primeng_inputs(component)
    catalog = suggest_catalog(component)
    reference = suggest_reference(component, catalog)
    alt_reference = REFERENCE_BY_CATALOG.get(catalog, ["checkbox"])[0]
    if alt_reference == reference and len(REFERENCE_BY_CATALOG.get(catalog, [])) > 1:
        alt_reference = REFERENCE_BY_CATALOG[catalog][1]
    else:
        alt_reference = REFERENCE_BY_CATALOG.get(catalog, ["checkbox"])[0]

    popover_props = propose_popover_props(inputs, reference)
    hint_parts = [p["property"].replace("variant", "Theme").title() for p in popover_props if p.get("include")][:6]
    popover_hint = ", ".join(hint_parts) if hint_parts else "Theme, Size"

    registry = load_registry()
    registry_entry = registry.get(component) or registry.get(prefix)

    return {
        "component": component,
        "prefix": prefix,
        "anchor": anchor,
        "showcase": {"exists": showcase_exists, "file": showcase_file, "in_index": in_index},
        "catalog_suggested": catalog,
        "reference_suggested": reference,
        "reference_alternative": alt_reference,
        "primeng_inputs": inputs,
        "input_warnings": input_warnings,
        "popover_props": popover_props,
        "popover_hint": popover_hint,
        "variable_counts": {k: len(v) for k, v in var_categories.items()},
        "variables": var_categories,
        "mds_var_total": len(mds_vars),
        "bridge_var_total": len(bridge_prefix),
        "registry_entry": registry_entry,
        "files_to_modify": files_to_modify(catalog, new_catalog=catalog not in {"button", "form", "messages", "data", "panel", "menu", "overlay", "misc"}),
    }


def format_markdown(report: dict) -> str:
    lines = [
        f"# Análisis — `{report['component']}`\n",
        f"**Prefijo vars:** `--{report['prefix']}-*` · **Ancla:** `{report['anchor']}`\n",
    ]

    sc = report["showcase"]
    if sc["exists"]:
        lines.append(f"**Showcase:** ya existe en `{sc['file']}`")
    else:
        lines.append("**Showcase:** no encontrado — incorporación pendiente")
    lines.append(f"**Índice playground:** {'sí' if sc['in_index'] else 'no'}\n")

    lines.append("## Catálogo sugerido\n")
    lines.append(f"- Catálogo: `{report['catalog_suggested']}`")
    lines.append(f"- Referencia: `{report['reference_suggested']}` (alternativa: `{report['reference_alternative']}`)\n")

    if report["input_warnings"]:
        lines.append("## Avisos\n")
        for w in report["input_warnings"]:
            lines.append(f"- ⚠ {w}")
        lines.append("")

    lines.append("## Popover CONFIGURAR (propuesta)\n")
    lines.append("| Propiedad | Control UI | Valores demo | Incluir | Motivo |")
    lines.append("|-----------|------------|--------------|---------|--------|")
    for p in report["popover_props"]:
        inc = "sí" if p.get("include") else "no"
        lines.append(
            f"| `{p['property']}` | {p['control']} | {p['demo_values']} | {inc} | {p['reason']} |"
        )
    lines.append(f"\n**Hint sugerido:** {report['popover_hint']}\n")

    lines.append("## Variables CSS\n")
    lines.append(f"Total MDS: **{report['mds_var_total']}** · Puente `--p-*`: **{report['bridge_var_total']}**\n")
    for cat, items in report["variables"].items():
        if not items:
            continue
        lines.append(f"### {cat} ({len(items)})\n")
        for item in items[:8]:
            var = item["var"]
            extra = ""
            if "suggested_bridge" in item:
                extra = f" → bridge `{item['suggested_bridge']}`"
            lines.append(f"- `{var}`{extra}")
        if len(items) > 8:
            lines.append(f"- … y {len(items) - 8} más")
        lines.append("")

    lines.append("## Ficheros previstos\n")
    for f in report["files_to_modify"]:
        lines.append(f"- `{f}`")

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Analizar componente PrimeNG para el playground")
    parser.add_argument("--component", required=True)
    parser.add_argument("--format", choices=("markdown", "json"), default="markdown")
    args = parser.parse_args()

    report = run_analysis(args.component)
    if args.format == "json":
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(format_markdown(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

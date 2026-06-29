#!/usr/bin/env python3
"""QA estático tras incorporar un componente al playground."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import (
    ROOT,
    load_core_vars,
    load_registry,
    merged_catalog,
    resolve_var_exists,
    var_matches_pattern,
)
from mds_component_lib import find_showcase, normalize_component, scan_index_for_anchor, suggest_catalog, var_prefix

PENDING_PATH = Path(__file__).resolve().parent / "mds-component-pending.json"
CATALOGS_DIR = ROOT / "src" / "app" / "catalogs"

BASE_MARKERS = [
    ("catalog-block-head", "header de bloque"),
    ("btn-section-title", "subtítulo Interaction/States"),
]

LEGACY_CONFIG_MARKERS = [
    ("button-config-aside", "aside CONFIGURAR"),
    ("button-config-popover", "clase popover"),
    ("CONFIGURAR", "botón CONFIGURAR"),
]

PREVIEW_FRAME_MARKERS = [
    ("mds-catalog-preview-frame", "contenedor PREVIEW"),
    ("catalog-preview-section", "sección PREVIEW"),
]


def load_pending_open(component: str) -> list[dict]:
    if not PENDING_PATH.is_file():
        return []
    data = json.loads(PENDING_PATH.read_text(encoding="utf-8"))
    return [
        i
        for i in data.get("items", [])
        if not i.get("resolved_at") and i.get("component") in {component, var_prefix(component)}
    ]


def check_structure(html_path: Path) -> list[str]:
    text = html_path.read_text(encoding="utf-8", errors="ignore")
    issues = []
    for marker, label in BASE_MARKERS:
        if marker not in text:
            issues.append(f"Falta `{marker}` ({label})")

    has_legacy_config = all(marker in text for marker, _ in LEGACY_CONFIG_MARKERS)
    has_preview_frame = all(marker in text for marker, _ in PREVIEW_FRAME_MARKERS)
    if not has_legacy_config and not has_preview_frame:
        issues.append(
            "Falta configurador: patrón legacy (CONFIGURAR + button-config-aside) "
            "o PREVIEW (mds-catalog-preview-frame)"
        )

    has_legacy_interaction = "Interaction" in text or "catalog-interaction-section" in text
    has_preview_section = "mds-catalog-preview-frame" in text or "catalog-preview-section" in text
    if not has_legacy_interaction and not has_preview_section:
        issues.append("Falta sección Interaction o PREVIEW")
    return issues


def check_popover_bindings(html_path: Path) -> list[str]:
    text = html_path.read_text(encoding="utf-8", errors="ignore")
    issues = []
    uses_preview_frame = "mds-catalog-preview-frame" in text
    has_popover_markup = "p-popover" in text or uses_preview_frame
    if not has_popover_markup:
        return issues
    if "ngModel" not in text and "ngModelChange" not in text:
        if "p-select" not in text and "p-selectbutton" not in text and "p-toggleswitch" not in text:
            issues.append("Popover sin controles p-select / p-selectbutton / p-toggleswitch detectados")
    return issues


def check_registry_watch(prefix: str, catalog: dict[str, str], registry: dict) -> list[str]:
    entry = registry.get(prefix)
    if not entry:
        return [f"Sin entrada en mds-component-registry.json para `{prefix}`"]
    issues = []
    for pattern in entry.get("watch_vars", []):
        if pattern.startswith("--p-"):
            continue
        matching = [n for n in catalog if var_matches_pattern(n, pattern)]
        if not matching and pattern.endswith("*"):
            issues.append(f"watch_var sin coincidencias: {pattern}")
        for name in matching:
            if not resolve_var_exists(name, catalog):
                issues.append(f"Cadena rota en watch: {name}")
    return issues


def run_qa(component_arg: str) -> dict:
    component = normalize_component(component_arg)
    prefix = var_prefix(component)
    anchor = f"pg-{component}"

    checks: list[dict] = []
    ok = True

    showcase_exists, showcase_file = find_showcase(anchor)
    checks.append(
        {
            "id": "showcase_anchor",
            "label": f"Ancla `{anchor}` en catálogo",
            "status": "PASS" if showcase_exists else "FAIL",
            "detail": showcase_file or "no encontrado",
        }
    )
    if not showcase_exists:
        ok = False

    in_index = scan_index_for_anchor(anchor)
    checks.append(
        {
            "id": "playground_index",
            "label": "Entrada en playground-component-index.ts",
            "status": "PASS" if in_index else "FAIL",
            "detail": "",
        }
    )
    if not in_index:
        ok = False

    structure_issues: list[str] = []
    popover_issues: list[str] = []
    if showcase_file:
        html_path = ROOT / showcase_file
        structure_issues = check_structure(html_path)
        popover_issues = check_popover_bindings(html_path)
    elif not showcase_exists:
        structure_issues = ["Showcase no implementado"]
        popover_issues = ["Sin popover — componente no incorporado"]

    checks.append(
        {
            "id": "structure",
            "label": "Estructura HTML (títulos, Interaction/PREVIEW, configurador)",
            "status": "PASS" if not structure_issues else "FAIL",
            "detail": "; ".join(structure_issues) or "OK",
        }
    )
    if structure_issues:
        ok = False

    checks.append(
        {
            "id": "popover",
            "label": "Popover CONFIGURAR",
            "status": "PASS" if not popover_issues else ("FAIL" if not showcase_exists else "WARN"),
            "detail": "; ".join(popover_issues) or "OK",
        }
    )
    if popover_issues and not showcase_exists:
        ok = False

    slots = load_core_vars()
    catalog = merged_catalog(slots)
    registry = load_registry()
    reg_issues = check_registry_watch(prefix, catalog, registry)
    checks.append(
        {
            "id": "registry",
            "label": "Registry + watch_vars",
            "status": "PASS" if not reg_issues else ("WARN" if reg_issues[0].startswith("Sin entrada") else "FAIL"),
            "detail": "; ".join(reg_issues) or "OK",
        }
    )
    if any("Cadena rota" in i for i in reg_issues):
        ok = False

    pending = load_pending_open(component)
    checks.append(
        {
            "id": "pending_log",
            "label": "Pendientes abiertos en mds-component-pending.json",
            "status": "WARN" if pending else "PASS",
            "detail": f"{len(pending)} abiertos" if pending else "ninguno",
        }
    )

    catalog_route = suggest_catalog(component)
    return {
        "ok": ok,
        "component": component,
        "anchor": anchor,
        "route": f"/{catalog_route}#{anchor}",
        "checks": checks,
        "visual_checklist": [
            f"Configurador (icono settings o CONFIGURAR) en /{catalog_route}#{anchor}",
            "Variants & States + Sizes (si aplica)",
            "Light + dark",
            f"Tokens --{prefix}-* en /tokens",
        ],
        "pending_open": len(pending),
    }


def format_markdown(report: dict) -> str:
    status = "PASS" if report["ok"] else "FAIL"
    lines = [
        f"# QA componente — `{report['component']}`\n",
        f"**Estado global:** {status}",
        f"**Ruta:** `{report['route']}`\n",
        "## Checks\n",
    ]
    for c in report["checks"]:
        icon = {"PASS": "✓", "WARN": "⚠", "FAIL": "✗"}.get(c["status"], "?")
        detail = f" — {c['detail']}" if c.get("detail") else ""
        lines.append(f"- {icon} **{c['label']}**: {c['status']}{detail}")
    lines.append("\n## Checklist visual\n")
    for item in report["visual_checklist"]:
        lines.append(f"- [ ] {item}")
    if report["pending_open"]:
        lines.append(f"\n⚠ {report['pending_open']} variable(s) pendiente(s) en `scripts/mds-component-pending.json`")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="QA de componente incorporado al playground")
    parser.add_argument("--component", required=True)
    parser.add_argument("--format", choices=("markdown", "json"), default="markdown")
    args = parser.parse_args()

    report = run_qa(args.component)
    if args.format == "json":
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(format_markdown(report))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

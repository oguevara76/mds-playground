#!/usr/bin/env python3
"""Remedia solo el puente PrimeNG tras actualizar core MDS."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import (
    STAGING_DEFAULT,
    apply_bridge_fixes,
    find_catalog_token_masks,
    find_core_legacy_vars,
    load_core_vars,
    load_export_vars,
    merged_catalog,
    remediate_bridge_tokens,
)


def run_remediate(staging_dir: Path | None, apply: bool) -> dict:
    slots = load_core_vars()
    catalog = merged_catalog(slots)
    export_components: dict[str, str] | None = None
    if staging_dir and staging_dir.is_dir():
        export, errors = load_export_vars(staging_dir)
        if not errors and export:
            export_components = export.get("components")

    bridge_report, bridge_fixes = remediate_bridge_tokens(catalog)
    legacy_vars = find_core_legacy_vars(export_components)
    catalog_masks = find_catalog_token_masks(catalog)

    result: dict = {
        "ok": True,
        "bridge_fixes": bridge_report,
        "core_legacy_vars": legacy_vars,
        "catalog_token_masks": catalog_masks,
        "applied": {},
    }

    if not apply:
        result["dry_run"] = True
        return result

    result["applied"]["bridge"] = apply_bridge_fixes(bridge_fixes)

    return result


def format_markdown(report: dict) -> str:
    lines = ["# Remediación core MDS (solo puente)\n"]
    if report.get("dry_run"):
        lines.append("_Modo dry-run — usar `--apply` para escribir cambios._\n")

    lines.append(f"## Puente ({len(report.get('bridge_fixes', []))} fixes)\n")
    for item in report.get("bridge_fixes", [])[:20]:
        val = item.get("new_value") or "(eliminar)"
        lines.append(f"- `{item['p_var']}` ({item['kind']}): → `{val}`")

    legacy = report.get("core_legacy_vars", [])
    if legacy:
        lines.append(f"\n## Legacy en core ({len(legacy)})\n")
        for name in legacy:
            lines.append(f"- `{name}`")

    masks = report.get("catalog_token_masks", [])
    if masks:
        lines.append(f"\n## Catálogos enmascarando tokens ({len(masks)})\n")
        for m in masks:
            lines.append(f"- `{m['var']}` en `{m['file']}`: core `{m['core']}` vs local `{m['local']}`")

    if report.get("applied"):
        lines.append("\n## Aplicado\n")
        for k, v in report["applied"].items():
            lines.append(f"- **{k}**: {v}")

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Remedia puente PrimeNG tras update core")
    parser.add_argument("--staging", type=Path, default=STAGING_DEFAULT)
    parser.add_argument("--apply", action="store_true", help="Escribir cambios (default: dry-run)")
    parser.add_argument("--format", choices=("json", "markdown"), default="markdown")
    args = parser.parse_args()

    staging = args.staging if args.staging.is_dir() else None
    report = run_remediate(staging, apply=args.apply)

    if args.format == "json":
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(format_markdown(report))

    return 0 if report.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())

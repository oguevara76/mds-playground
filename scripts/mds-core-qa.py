#!/usr/bin/env python3
"""QA estático tras actualizar el core MDS."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import (
    ROOT,
    BRIDGE_FROZEN_WHEN_MDS_REMOVED,
    collect_var_refs_from_text,
    find_catalog_token_masks,
    load_core_vars,
    load_registry,
    merged_catalog,
    remediate_bridge_tokens,
    resolve_var_exists,
    var_matches_pattern,
)

THEME_DIR = ROOT / "src" / "app" / "theme"

# Refs MDS opcionales en parity (var(--mds, var(--p-*, fallback))).
PARITY_OPTIONAL_DEPRECATED_REFS = frozenset({"--galleria-transition-duration"})

DEPRECATED_MDS_VARS = frozenset(
    p_name.replace("--p-", "--", 1) for p_name in BRIDGE_FROZEN_WHEN_MDS_REMOVED
) - PARITY_OPTIONAL_DEPRECATED_REFS


def check_file_refs(path: Path, catalog: dict[str, str], label: str) -> list[dict]:
    if not path.is_file():
        return []
    text = path.read_text(encoding="utf-8")
    refs = collect_var_refs_from_text(text)
    failures = []
    for ref in refs:
        if ref.startswith("--p-"):
            continue
        if ref not in catalog and not resolve_var_exists(ref, catalog):
            failures.append({"var": ref, "referenced_in": label, "file": str(path.relative_to(ROOT))})
    return failures


def check_broken_refs_in_core(slots: dict) -> list[dict]:
    """Solo referencias rotas dentro de los 4 ficheros core MDS."""
    catalog = merged_catalog(slots)
    failures = []
    for slot, vars_map in slots.items():
        for name, value in vars_map.items():
            for ref in collect_var_refs_from_text(value):
                if ref.startswith("--p-"):
                    continue
                if not resolve_var_exists(ref, catalog):
                    failures.append({"var": name, "broken_ref": ref, "slot": slot})
    return failures


def check_fragile_watch_vars(catalog: dict[str, str], registry: dict) -> dict[str, dict]:
    """Solo valida que las watch_vars del registry existen y resuelven."""
    results: dict[str, dict] = {}
    for prefix, meta in registry.items():
        watch = meta.get("watch_vars", [])
        issues = []
        for pattern in watch:
            if pattern.startswith("--p-"):
                continue
            matching = [n for n in catalog if var_matches_pattern(n, pattern)]
            if not matching and pattern.endswith("*"):
                issues.append(f"Ninguna var coincide con {pattern}")
            for name in matching:
                if not resolve_var_exists(name, catalog):
                    issues.append(f"Cadena rota: {name}")
        status = "PASS" if not issues else "FAIL"
        results[prefix] = {
            "status": status,
            "issues": issues,
            "anchor": meta.get("playground_anchor"),
        }
    return results


def check_bridge_remediation(catalog: dict[str, str]) -> list[dict]:
    """Puente pendiente de remediar tras eliminar vars del core."""
    _, fixes = remediate_bridge_tokens(catalog)
    return [{"p_var": k, "new_value": v} for k, v in fixes.items()]


def check_parity_deprecated_refs(catalog: dict[str, str]) -> list[dict]:
    """Referencias a vars MDS deprecadas aún presentes en parity (deben usar --p-*)."""
    failures = []
    styles_dir = ROOT / "src" / "styles"
    for f in styles_dir.glob("primeng-*-parity.css"):
        text = f.read_text(encoding="utf-8")
        for ref in collect_var_refs_from_text(text):
            if ref in DEPRECATED_MDS_VARS and ref not in catalog:
                failures.append(
                    {"var": ref, "referenced_in": f.name, "file": str(f.relative_to(ROOT))}
                )
    return failures


def run_qa() -> dict:
    slots = load_core_vars()
    catalog = merged_catalog(slots)
    registry = load_registry()

    broken_core = check_broken_refs_in_core(slots)
    fragile = check_fragile_watch_vars(catalog, registry)
    bridge_pending = check_bridge_remediation(catalog)
    parity_deprecated = check_parity_deprecated_refs(catalog)
    catalog_masks = find_catalog_token_masks(catalog)

    override_warns = []
    for f in THEME_DIR.glob("*-mds-overrides.ts"):
        override_warns.extend(check_file_refs(f, catalog, f.name))

    fragile_fail = any(v["status"] == "FAIL" for v in fragile.values())
    critical_fail = bool(broken_core) or fragile_fail or bool(bridge_pending) or bool(parity_deprecated)

    post_update_components = [
        {"component": "Carousel", "route": "/media#pg-carousel", "auto": "puente + parity"},
        {"component": "Galleria", "route": "/media#pg-galleria", "auto": "puente + parity"},
        {"component": "Stepper", "route": "/panel#pg-stepper", "auto": "puente + parity + override"},
        {"component": "ToggleSwitch", "route": "/form#pg-toggleswitch", "auto": "watch_vars registry"},
        {"component": "InputText", "route": "/form#pg-inputtext", "auto": "watch_vars registry"},
        {"component": "Button", "route": "/button#pg-button", "auto": "watch_vars registry"},
    ]

    return {
        "ok": not critical_fail,
        "checks": {
            "broken_refs_core": {"count": len(broken_core), "items": broken_core[:20], "severity": "FAIL"},
            "bridge_remediation_pending": {
                "count": len(bridge_pending),
                "items": bridge_pending[:10],
                "severity": "FAIL",
            },
            "parity_deprecated_refs": {
                "count": len(parity_deprecated),
                "items": parity_deprecated[:10],
                "severity": "FAIL",
            },
            "catalog_token_masks": {"count": len(catalog_masks), "items": catalog_masks[:10], "severity": "WARN"},
            "fragile_components": fragile,
            "override_refs_warn": {"count": len(override_warns), "items": override_warns[:10], "severity": "WARN"},
        },
        "post_update_components": post_update_components,
        "visual_checklist": [
            item
            for item in post_update_components
            if item["component"] in {"ToggleSwitch", "InputText", "Button"}
        ],
    }


def format_markdown(report: dict) -> str:
    lines = ["# QA core MDS\n", f"**Estado global:** {'PASS' if report['ok'] else 'FAIL'}\n"]
    checks = report["checks"]
    for key, data in checks.items():
        if key == "fragile_components":
            lines.append("## Componentes frágiles (watch vars)\n")
            for prefix, info in data.items():
                icon = {"PASS": "✓", "WARN": "⚠", "FAIL": "✗"}.get(info["status"], "?")
                lines.append(f"- {icon} **{prefix}** ({info.get('anchor', '')}): {info['status']}")
                for issue in info.get("issues", [])[:5]:
                    lines.append(f"  - {issue}")
            lines.append("")
        else:
            count = data["count"]
            sev = data.get("severity", "INFO")
            status = "OK" if count == 0 else f"{sev} ({count})"
            lines.append(f"- **{key}**: {status}")
            for item in data.get("items", [])[:5]:
                lines.append(f"  - {item}")
    lines.append("\n## Componentes post-update (auto-validados)\n")
    for item in report.get("post_update_components", []):
        lines.append(f"- **{item['component']}** (`{item['route']}`): {item['auto']}")

    if report.get("visual_checklist"):
        lines.append("\n## Checklist visual manual (solo si QA FAIL)\n")
        for item in report.get("visual_checklist", []):
            checks = item.get("checks") or item.get("auto", "")
            lines.append(f"- **{item['component']}** (`{item['route']}`): {checks}")
    lines.append("\n_Ejecutar `pnpm run mds:remediate --apply` antes del QA si el diff eliminó vars._")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="QA estático del core MDS")
    parser.add_argument("--format", choices=["json", "markdown"], default="json")
    parser.add_argument("-o", "--output", type=Path)
    args = parser.parse_args()

    report = run_qa()
    if args.format == "markdown":
        text = format_markdown(report)
        if args.output:
            args.output.write_text(text, encoding="utf-8")
        print(text)
    else:
        out = json.dumps(report, indent=2, ensure_ascii=False)
        if args.output:
            args.output.write_text(out, encoding="utf-8")
        print(out)

    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())

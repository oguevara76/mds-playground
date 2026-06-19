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
    collect_var_refs_from_text,
    load_core_vars,
    load_registry,
    merged_catalog,
    resolve_var_exists,
    var_matches_pattern,
)

THEME_DIR = ROOT / "src" / "app" / "theme"


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


def run_qa() -> dict:
    slots = load_core_vars()
    catalog = merged_catalog(slots)
    registry = load_registry()

    broken_core = check_broken_refs_in_core(slots)
    fragile = check_fragile_watch_vars(catalog, registry)

    override_warns = []
    for f in THEME_DIR.glob("*-mds-overrides.ts"):
        override_warns.extend(check_file_refs(f, catalog, f.name))

    fragile_fail = any(v["status"] == "FAIL" for v in fragile.values())
    critical_fail = bool(broken_core) or fragile_fail

    return {
        "ok": not critical_fail,
        "checks": {
            "broken_refs_core": {"count": len(broken_core), "items": broken_core[:20], "severity": "FAIL"},
            "fragile_components": fragile,
            "override_refs_warn": {"count": len(override_warns), "items": override_warns[:10], "severity": "WARN"},
        },
        "visual_checklist": [
            {"component": "ToggleSwitch", "route": "/form#pg-toggleswitch", "checks": "handle off/on/hover/checked/disabled"},
            {"component": "InputText default", "route": "/form#pg-inputtext", "checks": "borde, focus, invalid"},
            {"component": "InputText FloatLabel", "route": "/form#pg-inputtext", "checks": "variant floatlabel over/on/in"},
            {"component": "InputText IftaLabel", "route": "/form#pg-inputtext", "checks": "variant iftalabel"},
            {"component": "Button Contrast", "route": "/button", "checks": "primary/contrast/outlined"},
            {"component": "WATCH tokens", "route": "sidebar inspector", "checks": "primary-color, btn-fill-bg, font"},
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
    lines.append("\n## Checklist visual manual\n")
    for item in report.get("visual_checklist", []):
        lines.append(f"- **{item['component']}** (`{item['route']}`): {item['checks']}")
    lines.append("\n_Revisar en light y dark._")
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

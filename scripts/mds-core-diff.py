#!/usr/bin/env python3
"""Compara exports MDS con el core actual y genera resumen de cambios."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import (
    STAGING_DEFAULT,
    SLOT_LABELS,
    comp_label,
    comp_prefix_from_var,
    diff_maps,
    load_core_vars,
    load_export_vars,
    load_registry,
    read_bridge_vars,
    scan_playground_refs,
    suggest_bridge_entry,
    var_matches_pattern,
)
from mds_core_lib import Slot

ROOT = Path(__file__).resolve().parents[1]


def build_slot_diff(core: dict, export: dict) -> dict:
    d = diff_maps(core, export)
    return {
        "added": d.added,
        "removed": d.removed,
        "changed": {k: {"old": v[0], "new": v[1]} for k, v in d.changed.items()},
        "renames": [{"old": r[0], "new": r[1], "reason": r[2]} for r in d.renames],
        "counts": {
            "added": len(d.added),
            "removed": len(d.removed),
            "changed": len(d.changed),
            "renames": len(d.renames),
        },
    }


def build_impact(diff_by_slot: dict, playground_refs: dict) -> dict:
    impact: dict = {
        "removed_referenced": [],
        "changed_ref_chain": [],
        "new_without_bridge": [],
        "new_component_info": [],
    }
    bridge = read_bridge_vars()
    registry = load_registry()
    registry_prefixes = set(registry.keys())

    all_removed: dict[str, str] = {}
    all_added: dict[str, str] = {}
    all_changed: dict[str, dict] = {}
    for slot, d in diff_by_slot.items():
        for name, val in d["removed"].items():
            all_removed[name] = slot
        for name, val in d["added"].items():
            all_added[name] = (slot, val)
        for name, ch in d["changed"].items():
            all_changed[name] = (slot, ch)

    for source, refs in playground_refs.items():
        for ref in refs:
            if ref in all_removed:
                impact["removed_referenced"].append(
                    {"var": ref, "slot": all_removed[ref], "referenced_in": source}
                )

    for name, (slot, ch) in all_changed.items():
        old_ref = ch["old"]
        new_ref = ch["new"]
        if old_ref != new_ref:
            impact["changed_ref_chain"].append(
                {"var": name, "slot": slot, "old": old_ref, "new": new_ref}
            )

    for name, (slot, val) in all_added.items():
        prefix = comp_prefix_from_var(name)
        if slot == "components" and prefix:
            p_name = f"--p-{name[2:]}"
            if p_name not in bridge:
                entry = suggest_bridge_entry(name, val)
                has_showcase = prefix in registry_prefixes
                item = {
                    "mds_var": name,
                    "bridge": entry,
                    "has_showcase": has_showcase,
                    "comp_prefix": prefix,
                }
                if has_showcase:
                    impact["new_without_bridge"].append(item)
                else:
                    impact["new_component_info"].append(item)

    return impact


def group_components(diff: dict) -> dict[str, dict]:
    groups: dict[str, dict] = {}
    for kind in ("added", "removed", "changed"):
        items = diff.get(kind, {})
        if kind == "changed":
            for name, ch in items.items():
                grp = comp_label(name)
                groups.setdefault(grp, {"added": {}, "removed": {}, "changed": {}})
                groups[grp]["changed"][name] = ch
        else:
            for name, val in items.items():
                grp = comp_label(name)
                groups.setdefault(grp, {"added": {}, "removed": {}, "changed": {}})
                groups[grp][kind][name] = val
    return dict(sorted(groups.items()))


def format_markdown(report: dict) -> str:
    lines = ["# Resumen de actualización core MDS\n"]

    if report.get("metadata"):
        lines.append("## Metadatos del export\n")
        for slot, meta in report["metadata"].items():
            ver = meta.get("version", "?")
            updated = meta.get("last_updated", "?")
            lines.append(f"- **{SLOT_LABELS.get(slot, slot)}**: v{ver}, {updated}")
        lines.append("")

    for slot in ("primitives", "semantic-light", "semantic-dark", "components"):
        d = report["diff"][slot]
        c = d["counts"]
        if not any(c.values()):
            continue
        lines.append(f"## {SLOT_LABELS[slot]}")
        lines.append(
            f"+{c['added']} nuevas | ~{c['changed']} modificadas | "
            f"-{c['removed']} eliminadas | ↔{c['renames']} renombradas\n"
        )
        for name, val in sorted(d["added"].items()):
            lines.append(f"- `+ {name}`: `{val}`")
        for name, ch in sorted(d["changed"].items()):
            lines.append(f"- `~ {name}`: `{ch['old']}` → `{ch['new']}`")
        for name, val in sorted(d["removed"].items()):
            lines.append(f"- `- {name}`: `{val}`")
        if d["renames"]:
            lines.append("\n**Posibles renombrados:**")
            for r in d["renames"]:
                lines.append(f"- `{r['old']}` → `{r['new']}` ({r['reason']})")
        lines.append("")

    comp_groups = report.get("component_groups", {})
    if comp_groups:
        lines.append("## Componentes (detalle por prefijo)\n")
        for grp, gd in comp_groups.items():
            na, nc, nr = len(gd["added"]), len(gd["changed"]), len(gd["removed"])
            if not (na or nc or nr):
                continue
            lines.append(f"### {grp}")
            lines.append(f"+{na} | ~{nc} | -{nr}\n")
            for name, val in sorted(gd["added"].items()):
                lines.append(f"  + `{name}`: `{val}`")
            for name, ch in sorted(gd["changed"].items()):
                lines.append(f"  ~ `{name}`: `{ch['old']}` → `{ch['new']}`")
            for name, val in sorted(gd["removed"].items()):
                lines.append(f"  - `{name}`: `{val}`")
            lines.append("")

    impact = report.get("impact", {})
    if impact.get("removed_referenced"):
        lines.append("## Impacto: variables eliminadas referenciadas en playground\n")
        for item in impact["removed_referenced"]:
            lines.append(f"- `{item['var']}` ({item['slot']}) → usada en `{item['referenced_in']}`")
        lines.append("")

    if impact.get("changed_ref_chain"):
        lines.append("## Impacto: cadenas var() modificadas\n")
        for item in impact["changed_ref_chain"]:
            lines.append(f"- `{item['var']}`: `{item['old']}` → `{item['new']}`")
        lines.append("")

    if impact.get("new_without_bridge"):
        lines.append("## Puente PrimeNG sugerido (requiere tu OK)\n")
        for item in impact["new_without_bridge"]:
            b = item["bridge"]
            lines.append(
                f"- [ ] `{b['name']}`: `{b['value']}` "
                f"(componente: {item['comp_prefix']}, showcase: sí)"
            )
        lines.append("")

    if impact.get("new_component_info"):
        lines.append("## Variables nuevas sin showcase en playground (informativo)\n")
        for item in impact["new_component_info"]:
            lines.append(f"- `{item['mds_var']}` (prefijo: {item['comp_prefix']})")
        lines.append("")

    totals = report.get("totals", {})
    lines.append("## Totales\n")
    lines.append(
        f"**+{totals.get('added', 0)}** nuevas | "
        f"**~{totals.get('changed', 0)}** modificadas | "
        f"**-{totals.get('removed', 0)}** eliminadas | "
        f"**↔{totals.get('renames', 0)}** renombradas"
    )
    return "\n".join(lines)


def run_diff(staging_dir: Path) -> dict:
    import importlib.util

    preflight_path = Path(__file__).resolve().parent / "mds-core-preflight.py"
    spec = importlib.util.spec_from_file_location("mds_core_preflight", preflight_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    preflight = mod.run_preflight(staging_dir)
    if not preflight["ok"]:
        return {"ok": False, "errors": preflight["errors"], "preflight": preflight}

    core = load_core_vars()
    export, errors = load_export_vars(staging_dir)
    if errors or not export:
        return {"ok": False, "errors": errors or ["No se pudieron cargar exports"]}

    diff_by_slot: dict = {}
    totals = {"added": 0, "removed": 0, "changed": 0, "renames": 0}
    for slot in ("primitives", "semantic-light", "semantic-dark", "components"):
        d = build_slot_diff(core[slot], export[slot])
        diff_by_slot[slot] = d
        for k in totals:
            totals[k] += d["counts"][k]

    playground_refs = scan_playground_refs()
    impact = build_impact(diff_by_slot, playground_refs)

    bridge_suggestions = []
    for item in impact.get("new_without_bridge", []):
        b = item["bridge"]
        bridge_suggestions.append(
            {
                "approved": False,
                "name": b["name"],
                "value": b["value"],
                "mds_var": b["mds_var"],
                "comp_prefix": item["comp_prefix"],
            }
        )

    report = {
        "ok": True,
        "metadata": preflight.get("metadata", {}),
        "warnings": preflight.get("warnings", []),
        "diff": diff_by_slot,
        "component_groups": group_components(diff_by_slot.get("components", {})),
        "impact": impact,
        "bridge_suggestions": bridge_suggestions,
        "totals": totals,
    }
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Diff exports MDS vs core actual")
    parser.add_argument("--staging", type=Path, default=STAGING_DEFAULT)
    parser.add_argument("--format", choices=["json", "markdown"], default="json")
    parser.add_argument("-o", "--output", type=Path, help="Guardar informe en fichero")
    args = parser.parse_args()

    report = run_diff(args.staging)
    if not report.get("ok"):
        if args.format == "markdown":
            print("FAIL: " + "; ".join(report.get("errors", [])))
        else:
            print(json.dumps(report, indent=2, ensure_ascii=False))
        return 1

    if args.format == "markdown":
        text = format_markdown(report)
        if args.output:
            args.output.write_text(text, encoding="utf-8")
            print(f"Informe guardado en {args.output}")
        else:
            print(text)
    else:
        out = json.dumps(report, indent=2, ensure_ascii=False)
        if args.output:
            args.output.write_text(out, encoding="utf-8")
            default_plan = args.staging / "diff-report.json"
            default_plan.write_text(out, encoding="utf-8")
            print(f"Informe guardado en {args.output}")
        else:
            default_plan = args.staging / "diff-report.json"
            default_plan.write_text(out, encoding="utf-8")
            print(out)

    return 0


if __name__ == "__main__":
    sys.exit(main())

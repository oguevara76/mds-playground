#!/usr/bin/env python3
"""Aplica actualizaciones selectivas al core MDS."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from copy import deepcopy
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import (
    STAGING_DEFAULT,
    STYLES,
    CORE_DEST_FILES,
    CORE_SELECTORS,
    Slot,
    apply_vars_to_core_file,
    comp_prefix_from_var,
    diff_maps,
    insert_bridge_entries,
    load_core_vars,
    load_export_vars,
    var_matches_pattern,
)

ROOT = Path(__file__).resolve().parents[1]

DEFAULT_COLLECTION_MODES = {
    "primitives": "all",
    "semantic-light": "all",
    "semantic-dark": "all",
    "components": "all",
}


def build_plan_from_mode(mode: str) -> dict:
    if mode == "all":
        return {
            "collections": {k: {"mode": "all"} for k in DEFAULT_COLLECTION_MODES},
            "bridge_entries": [],
            "exclude_vars": [],
            "component_prefixes": [],
            "semantic_prefixes": [],
        }
    return {
        "collections": {k: {"mode": mode} for k in DEFAULT_COLLECTION_MODES},
        "bridge_entries": [],
        "exclude_vars": [],
        "component_prefixes": [],
        "semantic_prefixes": [],
    }


def should_include_var(
    name: str,
    slot: Slot,
    mode: str,
    diff,
    exclude_vars: list[str],
    component_prefixes: list[str],
    semantic_prefixes: list[str],
) -> bool:
    for ex in exclude_vars:
        if var_matches_pattern(name, ex):
            return False

    if slot == "components" and component_prefixes:
        prefix = comp_prefix_from_var(name)
        if prefix not in component_prefixes:
            return False

    if slot in ("semantic-light", "semantic-dark") and semantic_prefixes:
        if not any(var_matches_pattern(name, p) for p in semantic_prefixes):
            return False

    if mode == "all":
        return True
    if mode == "none":
        return False
    if mode == "changed_only":
        return name in diff.changed
    if mode == "added_only":
        return name in diff.added
    if mode == "removed_only":
        return name in diff.removed
    if mode == "add_and_changed":
        return name in diff.added or name in diff.changed
    return False


def compute_final_vars(
    core: dict[str, str],
    export: dict[str, str],
    slot: Slot,
    plan: dict,
) -> dict[str, str]:
    diff = diff_maps(core, export)
    coll_plan = plan.get("collections", {}).get(slot, {})
    mode = coll_plan.get("mode", "none")
    exclude = plan.get("exclude_vars", [])
    comp_prefixes = plan.get("component_prefixes", [])
    sem_prefixes = plan.get("semantic_prefixes", [])

    final = deepcopy(core)

    if mode == "all":
        final = deepcopy(export)
    elif mode == "removed_only":
        for name in diff.removed:
            if should_include_var(name, slot, mode, diff, exclude, comp_prefixes, sem_prefixes):
                final.pop(name, None)
    else:
        for name, val in export.items():
            if should_include_var(name, slot, mode, diff, exclude, comp_prefixes, sem_prefixes):
                final[name] = val
        if mode == "removed_only":
            pass
        elif coll_plan.get("exclude_removed", False):
            pass
        else:
            for name in diff.removed:
                if should_include_var(name, slot, "removed_only", diff, exclude, comp_prefixes, sem_prefixes):
                    final.pop(name, None)

    for ex in exclude:
        for name in list(final.keys()):
            if var_matches_pattern(name, ex):
                if name in core:
                    final[name] = core[name]
                else:
                    final.pop(name, None)

    return final


def run_apply(staging_dir: Path, plan: dict, skip_backup: bool = False) -> dict:
    export, errors = load_export_vars(staging_dir)
    if errors or not export:
        return {"ok": False, "errors": errors or ["No export"]}

    core = load_core_vars()
    applied: dict[str, int] = {}

    if not skip_backup:
        backup_script = ROOT / "scripts" / "create-backup.sh"
        if backup_script.is_file():
            subprocess.run(["bash", str(backup_script)], cwd=ROOT, check=False)

    for slot, filename in CORE_DEST_FILES.items():
        final = compute_final_vars(core[slot], export[slot], slot, plan)
        dest = STYLES / filename
        apply_vars_to_core_file(
            dest,
            CORE_SELECTORS[slot],
            final,
            synthesize=(slot == "components"),
        )
        applied[slot] = len(final)

    bridge_added = 0
    bridge_entries = plan.get("bridge_entries", [])
    if bridge_entries:
        bridge_added = insert_bridge_entries(bridge_entries)

    return {
        "ok": True,
        "applied": applied,
        "bridge_entries_added": bridge_added,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Aplica plan de actualización core MDS")
    parser.add_argument("--staging", type=Path, default=STAGING_DEFAULT)
    parser.add_argument("--plan", type=Path, help="Plan JSON de aplicación")
    parser.add_argument(
        "--mode",
        choices=["all", "changed_only", "added_only", "removed_only", "add_and_changed"],
        help="Modo rápido sin plan JSON",
    )
    parser.add_argument("--skip-backup", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.plan and args.plan.is_file():
        plan = json.loads(args.plan.read_text(encoding="utf-8"))
    elif args.mode:
        plan = build_plan_from_mode(args.mode)
    else:
        default_plan = args.staging / "plan.json"
        if default_plan.is_file():
            plan = json.loads(default_plan.read_text(encoding="utf-8"))
        else:
            print("ERROR: especifica --plan o --mode", file=sys.stderr)
            return 1

    if args.dry_run:
        export, errors = load_export_vars(args.staging)
        if errors:
            print(json.dumps({"ok": False, "errors": errors}, indent=2))
            return 1
        core = load_core_vars()
        preview = {}
        for slot in CORE_DEST_FILES:
            preview[slot] = len(compute_final_vars(core[slot], export[slot], slot, plan))
        print(json.dumps({"ok": True, "dry_run": True, "var_counts": preview}, indent=2))
        return 0

    result = run_apply(args.staging, plan, skip_backup=args.skip_backup)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    sys.exit(main())

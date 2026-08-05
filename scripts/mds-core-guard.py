#!/usr/bin/env python3
"""Comprueba que el update core no haya tocado capas protegidas (parity, overrides, catálogos)."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import (
    CORE_LEGACY_BRIDGE_ALIASES,
    ROOT,
    merged_catalog,
    load_core_vars,
    protected_violations_in_update,
)


def git_changed_paths() -> list[str]:
    paths: set[str] = set()
    for cmd in (
        ["git", "diff", "--name-only", "HEAD"],
        ["git", "diff", "--cached", "--name-only", "HEAD"],
        ["git", "ls-files", "--others", "--exclude-standard"],
    ):
        proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, check=False)
        if proc.returncode != 0:
            continue
        for line in proc.stdout.splitlines():
            line = line.strip()
            if line:
                paths.add(line)
    return sorted(paths)


def check_legacy_aliases_in_core() -> list[str]:
    catalog = merged_catalog(load_core_vars())
    return sorted(name for name in CORE_LEGACY_BRIDGE_ALIASES if name not in catalog)


def run_guard() -> dict:
    changed = git_changed_paths()
    protected = protected_violations_in_update(changed)
    missing_aliases = check_legacy_aliases_in_core()
    ok = not protected and not missing_aliases
    return {
        "ok": ok,
        "changed_files": len(changed),
        "protected_layers_touched": protected,
        "missing_legacy_aliases": missing_aliases,
    }


def format_markdown(report: dict) -> str:
    lines = ["# Guard update core MDS\n", f"**Estado:** {'PASS' if report['ok'] else 'FAIL'}\n"]
    protected = report.get("protected_layers_touched", [])
    if protected:
        lines.append("## Capas protegidas modificadas (no permitido en update core)\n")
        for path in protected:
            lines.append(f"- `{path}`")
        lines.append(
            "\n_Revierte esos cambios. Parity, overrides y catálogos se mantienen fuera del flujo._\n"
        )
    missing = report.get("missing_legacy_aliases", [])
    if missing:
        lines.append("## Aliases runtime ausentes en core\n")
        for name in missing:
            lines.append(f"- `{name}`")
        lines.append("")
    if report["ok"]:
        lines.append("Capas protegidas intactas y aliases runtime presentes.")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Guardia de capas protegidas tras update core")
    parser.add_argument("--format", choices=("json", "markdown"), default="markdown")
    args = parser.parse_args()

    report = run_guard()
    if args.format == "json":
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(format_markdown(report))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

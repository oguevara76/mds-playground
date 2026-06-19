#!/usr/bin/env python3
"""Pre-validación de exports MDS antes del diff."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import (
    STAGING_DEFAULT,
    detect_slot_content,
    parse_metadata,
    parse_vars_from_css,
    resolve_staging_files,
    transform_export,
    CORE_SELECTORS,
)

ROOT = Path(__file__).resolve().parents[1]


def run_preflight(staging_dir: Path) -> dict:
    mapped, errors = resolve_staging_files(staging_dir)
    warnings: list[str] = []
    files_info: dict = {}
    metadata: dict = {}

    if not mapped:
        return {"ok": False, "errors": errors, "warnings": warnings, "files": {}, "metadata": {}}

    for slot, path in mapped.items():
        raw = path.read_text(encoding="utf-8")
        transformed = transform_export(raw)
        meta = parse_metadata(raw)
        if meta:
            metadata[slot] = meta

        detected = detect_slot_content(transformed)
        if detected and detected != slot:
            warnings.append(
                f"{path.name}: contenido parece ser '{detected}' pero el contrato espera '{slot}'"
            )

        vars_map = parse_vars_from_css(transformed, CORE_SELECTORS[slot])
        files_info[slot] = {
            "path": str(path),
            "name": path.name,
            "var_count": len(vars_map),
        }

        if not vars_map:
            errors.append(f"{path.name}: sin variables CSS en bloque {CORE_SELECTORS[slot]}")

    return {
        "ok": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "files": files_info,
        "metadata": metadata,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Pre-valida exports MDS (4 ficheros fijos)")
    parser.add_argument(
        "--staging",
        type=Path,
        default=STAGING_DEFAULT,
        help="Directorio con Primitives.css, Semantic-light.css, Semantic-dark.css, Components.css",
    )
    parser.add_argument("--json", action="store_true", help="Salida JSON")
    args = parser.parse_args()

    result = run_preflight(args.staging)

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        if result["ok"]:
            print("OK: pre-validación superada")
            for slot, info in result["files"].items():
                print(f"  {slot}: {info['name']} ({info['var_count']} vars)")
            if result["metadata"]:
                print("\nMetadatos:")
                for slot, meta in result["metadata"].items():
                    ver = meta.get("version", "?")
                    updated = meta.get("last_updated", "?")
                    print(f"  {slot}: v{ver}, {updated}")
        else:
            print("FAIL: pre-validación")
            for e in result["errors"]:
                print(f"  ✗ {e}")
        for w in result["warnings"]:
            print(f"  ⚠ {w}")

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())

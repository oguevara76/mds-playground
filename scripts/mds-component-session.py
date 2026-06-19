#!/usr/bin/env python3
"""Estado del wizard de incorporación de componentes."""
from __future__ import annotations

import argparse
import json
import sys
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from mds_core_lib import ROOT

STAGING_DIR = ROOT / ".mds-component-staging"
SESSION_PATH = STAGING_DIR / "session.json"

DEFAULT_SESSION = {
    "component": "",
    "step": 0,
    "catalog": "",
    "reference": "",
    "popover": {"confirmed": False, "props": [], "hint": ""},
    "variables": {"actions": []},
    "implementation": {"approved": False, "scope_notes": ""},
    "qa": {"status": None},
    "history": [],
}


def _ensure_dir() -> None:
    STAGING_DIR.mkdir(parents=True, exist_ok=True)


def _load() -> dict:
    if not SESSION_PATH.is_file():
        return deepcopy(DEFAULT_SESSION)
    return json.loads(SESSION_PATH.read_text(encoding="utf-8"))


def _save(data: dict) -> None:
    _ensure_dir()
    SESSION_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def cmd_init(args: argparse.Namespace) -> int:
    data = deepcopy(DEFAULT_SESSION)
    data["component"] = args.component
    data["step"] = 0
    _save(data)
    print(json.dumps(data, indent=2, ensure_ascii=False))
    return 0


def cmd_get(_: argparse.Namespace) -> int:
    print(json.dumps(_load(), indent=2, ensure_ascii=False))
    return 0


def cmd_set_step(args: argparse.Namespace) -> int:
    data = _load()
    data["step"] = args.step
    data.setdefault("history", []).append(
        {
            "step": args.step,
            "choice": args.note or f"set_step_{args.step}",
            "at": datetime.now(timezone.utc).isoformat(),
        }
    )
    _save(data)
    print(json.dumps({"step": data["step"]}, indent=2))
    return 0


def cmd_patch(args: argparse.Namespace) -> int:
    data = _load()
    patch = json.loads(args.json)
    for key, value in patch.items():
        if isinstance(value, dict) and isinstance(data.get(key), dict):
            data[key].update(value)
        else:
            data[key] = value
    if args.note:
        data.setdefault("history", []).append(
            {"step": data.get("step", 0), "choice": args.note, "at": datetime.now(timezone.utc).isoformat()}
        )
    _save(data)
    print(json.dumps(data, indent=2, ensure_ascii=False))
    return 0


def cmd_clear(_: argparse.Namespace) -> int:
    if SESSION_PATH.is_file():
        SESSION_PATH.unlink()
    print("OK")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Sesión wizard add-playground-component")
    sub = parser.add_subparsers(dest="command", required=True)

    init_p = sub.add_parser("init", help="Iniciar sesión")
    init_p.add_argument("--component", required=True)
    init_p.set_defaults(func=cmd_init)

    sub.add_parser("get", help="Leer sesión").set_defaults(func=cmd_get)

    step_p = sub.add_parser("set-step", help="Fijar paso actual")
    step_p.add_argument("--step", type=int, required=True)
    step_p.add_argument("--note", default="")
    step_p.set_defaults(func=cmd_set_step)

    patch_p = sub.add_parser("patch", help='Merge JSON parcial, ej. \'{"catalog":"form"}\'')
    patch_p.add_argument("--json", required=True)
    patch_p.add_argument("--note", default="")
    patch_p.set_defaults(func=cmd_patch)

    sub.add_parser("clear", help="Borrar sesión").set_defaults(func=cmd_clear)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())

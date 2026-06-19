#!/usr/bin/env python3
"""Log persistente de variables pendientes al incorporar componentes."""
from __future__ import annotations

import argparse
import json
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

PENDING_PATH = Path(__file__).resolve().parent / "mds-component-pending.json"


def _load() -> dict:
    if not PENDING_PATH.is_file():
        return {"items": []}
    return json.loads(PENDING_PATH.read_text(encoding="utf-8"))


def _save(data: dict) -> None:
    PENDING_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def cmd_add(args: argparse.Namespace) -> int:
    data = _load()
    item = {
        "id": str(uuid.uuid4()),
        "component": args.component,
        "var": args.var if args.var.startswith("--") else f"--{args.var}",
        "category": args.category,
        "action": args.action or "pending",
        "suggested_value": args.suggested_value or "",
        "notes": args.notes or "",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "resolved_at": None,
    }
    data["items"].append(item)
    _save(data)
    print(item["id"])
    return 0


def cmd_list(args: argparse.Namespace) -> int:
    data = _load()
    items = data.get("items", [])
    if args.component:
        items = [i for i in items if i.get("component") == args.component]
    if args.open_only:
        items = [i for i in items if not i.get("resolved_at")]
    if args.format == "json":
        print(json.dumps(items, indent=2, ensure_ascii=False))
        return 0
    if not items:
        print("Sin entradas.")
        return 0
    for item in items:
        status = "RESUELTO" if item.get("resolved_at") else "PENDIENTE"
        print(f"- [{status}] {item.get('id', '?')[:8]}… {item.get('var')} ({item.get('category')})")
        if item.get("notes"):
            print(f"    notas: {item['notes']}")
    return 0


def cmd_resolve(args: argparse.Namespace) -> int:
    data = _load()
    found = False
    for item in data.get("items", []):
        if item.get("id") == args.id or item.get("id", "").startswith(args.id):
            item["resolved_at"] = datetime.now(timezone.utc).isoformat()
            if args.notes:
                item["notes"] = (item.get("notes") or "") + (" " if item.get("notes") else "") + args.notes
            found = True
            break
    if not found:
        print(f"No se encontró id: {args.id}", file=sys.stderr)
        return 1
    _save(data)
    print("OK")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Log de variables pendientes (playground components)")
    sub = parser.add_subparsers(dest="command", required=True)

    add_p = sub.add_parser("add", help="Añadir entrada pendiente")
    add_p.add_argument("--component", required=True)
    add_p.add_argument("--var", required=True)
    add_p.add_argument("--category", default="missing_in_core")
    add_p.add_argument("--action", default="pending")
    add_p.add_argument("--suggested-value", dest="suggested_value", default="")
    add_p.add_argument("--notes", default="")
    add_p.set_defaults(func=cmd_add)

    list_p = sub.add_parser("list", help="Listar entradas")
    list_p.add_argument("--component", default="")
    list_p.add_argument("--open-only", action="store_true")
    list_p.add_argument("--format", choices=("text", "json"), default="text")
    list_p.set_defaults(func=cmd_list)

    resolve_p = sub.add_parser("resolve", help="Marcar entrada como resuelta")
    resolve_p.add_argument("--id", required=True)
    resolve_p.add_argument("--notes", default="")
    resolve_p.set_defaults(func=cmd_resolve)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())

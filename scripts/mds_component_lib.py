"""Utilidades compartidas para incorporar componentes al playground."""
from __future__ import annotations

import re
from pathlib import Path

from mds_core_lib import ROOT

CATALOGS_DIR = ROOT / "src" / "app" / "catalogs"
INDEX_PATH = ROOT / "src" / "app" / "layout" / "playground-component-index.ts"

PREFIX_ALIASES: dict[str, str] = {
    "inputswitch": "toggleswitch",
    "dropdown": "select",
    "calendar": "datepicker",
}

CATALOG_HINTS: dict[str, str] = {
    "button": "button",
    "splitbutton": "button",
    "speeddial": "button",
    "checkbox": "form",
    "radiobutton": "form",
    "toggleswitch": "form",
    "togglebutton": "form",
    "inputtext": "form",
    "inputgroup": "form",
    "inputgroupaddon": "form",
    "inputotp": "form",
    "rating": "form",
    "textarea": "form",
    "select": "form",
    "multiselect": "form",
    "listbox": "form",
    "password": "form",
    "inputnumber": "form",
    "datepicker": "form",
    "colorpicker": "form",
    "selectbutton": "form",
    "message": "messages",
    "toast": "messages",
    "paginator": "data",
    "datatable": "data",
    "table": "data",
    "divider": "panel",
    "tabs": "panel",
    "panel": "panel",
    "accordion": "panel",
    "breadcrumb": "menu",
    "menu": "menu",
    "tooltip": "overlay",
    "dialog": "overlay",
    "confirmdialog": "overlay",
    "confirmpopup": "overlay",
    "popover": "overlay",
    "tag": "misc",
    "badge": "misc",
    "chip": "misc",
    "avatar": "misc",
}

REFERENCE_BY_CATALOG: dict[str, list[str]] = {
    "button": ["button"],
    "form": ["inputtext", "checkbox", "toggleswitch"],
    "messages": ["message", "toast"],
    "data": ["paginator"],
    "panel": ["tabs", "divider"],
    "menu": ["breadcrumb"],
    "overlay": ["tooltip"],
    "misc": ["tag", "badge"],
}


def normalize_component(name: str) -> str:
    n = name.strip().lower().replace("_", "").replace(" ", "")
    if n.startswith("p-"):
        n = n[2:]
    return PREFIX_ALIASES.get(n, n)


def var_prefix(component: str) -> str:
    return PREFIX_ALIASES.get(component, component)


def find_showcase(anchor: str) -> tuple[bool, str | None]:
    needle = f'id="{anchor}"'
    needle2 = f"id='{anchor}'"
    loose = anchor  # pg-checkbox en formAnchorId, index, etc.
    for html in CATALOGS_DIR.rglob("*.html"):
        text = html.read_text(encoding="utf-8", errors="ignore")
        if needle in text or needle2 in text:
            return True, str(html.relative_to(ROOT))
        if loose in text and ("formAnchorId" in text or f'"{anchor}"' in text or f"'{anchor}'" in text):
            return True, str(html.relative_to(ROOT))
    # Bloques form/button con helper dinámico: comprobar index + kind en config
    prefix = anchor.removeprefix("pg-")
    for config in CATALOGS_DIR.rglob("*-catalog.config.ts"):
        text = config.read_text(encoding="utf-8", errors="ignore")
        if re.search(rf"kind:\s*['\"]{re.escape(prefix)}['\"]", text):
            html_name = config.name.replace("-catalog.config.ts", "-catalog.component.html")
            html_guess = config.parent / html_name
            if html_guess.is_file():
                return True, str(html_guess.relative_to(ROOT))
    return False, None


def scan_index_for_anchor(anchor: str) -> bool:
    if not INDEX_PATH.is_file():
        return False
    return anchor in INDEX_PATH.read_text(encoding="utf-8")


def suggest_catalog(component: str) -> str:
    return CATALOG_HINTS.get(component, "form")


def suggest_reference(component: str, catalog: str) -> str:
    refs = REFERENCE_BY_CATALOG.get(catalog, ["checkbox"])
    if component in refs:
        return component
    return refs[0]

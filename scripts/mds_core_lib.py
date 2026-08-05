#!/usr/bin/env python3
"""Utilidades compartidas para actualizar el core MDS del playground."""
from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Literal

ROOT = Path(__file__).resolve().parents[1]
STYLES = ROOT / "styles"
STAGING_DEFAULT = ROOT / ".mds-core-staging"
REGISTRY_PATH = Path(__file__).resolve().parent / "mds-component-registry.json"

Slot = Literal["primitives", "semantic-light", "semantic-dark", "components"]

EXPECTED_EXPORT_FILES: dict[str, Slot] = {
    "primitives.css": "primitives",
    "semantic-light.css": "semantic-light",
    "semantic-dark.css": "semantic-dark",
    "components.css": "components",
}

CORE_DEST_FILES: dict[Slot, str] = {
    "primitives": "mds-primitives.css",
    "semantic-light": "mds-semantic-light.css",
    "semantic-dark": "mds-semantic-dark.css",
    "components": "mds-components.css",
}

CORE_SELECTORS: dict[Slot, str] = {
    "primitives": "html:root",
    "semantic-light": 'html[data-theme="light"]',
    "semantic-dark": 'html[data-theme="dark"]',
    "components": "html:root",
}

COMP_PREFIX_RE = re.compile(
    r"^--("
    r"button|accordion|autocomplete|badge|breadcrumb|calendar|card|carousel|checkbox|chip|"
    r"colorpicker|confirmdialog|confirmpopup|contextmenu|datatable|dataview|dialog|divider|dropdown|editor|"
    r"fieldset|fileupload|galleria|image|inlinemessage|inputgroup|inputnumber|inputotp|"
    r"inputswitch|inputtext|knob|listbox|megamenu|menu|menubar|message|multiselect|orderlist|"
    r"organizationchart|overlaypanel|paginator|panel|panelmenu|password|picklist|progressbar|"
    r"progressspinner|radio|radiobutton|rating|scrollpanel|selectbutton|sidebar|skeleton|slider|"
    r"speeddial|splitbutton|steps|tabmenu|tabs|tabview|tag|terminal|textarea|tieredmenu|"
    r"timeline|toast|togglebutton|toggleswitch|toolbar|tooltip|tree|treetable|tristatecheckbox|"
    r"virtualscroller"
    r")-"
)

COMPONENT_VAR_RE = re.compile(
    r"--(?:accordion|autocomplete|avatar|badge|blockui|breadcrumb|button|calendar|card|"
    r"cascadeselect|checkbox|chip|colorpicker|contextmenu|datatable|datepicker|dialog|divider|"
    r"dock|dropdown|fieldset|fileupload|galleria|image|inplace|input|knob|listbox|menu|menubar|"
    r"megamenu|multiselect|orderlist|organizationchart|overlay|paginator|panel|password|picklist|"
    r"radiobutton|rating|scrollpanel|select|sidebar|skeleton|slider|splitbutton|stepper|table|tabs|"
    r"textarea|tieredmenu|toast|togglebutton|toggleswitch|toolbar|tooltip|tree|treeselect|"
    r"treetable|virtualscroller)(?:-[a-zA-Z0-9_]+)+\s*:",
    re.I,
)

PRIMITIVE_PALETTE_RE = re.compile(
    r"--(?:teal|blue|red|amber|green|purple|sky|slate|neutral|stone|zinc|gray|violet|indigo|"
    r"pink|orange|lime|emerald|cyan|fuchsia|yellow|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\s*:",
    re.I,
)

DATA_THEME_SELECTOR_RE = re.compile(r'html\[data-theme="([^"]+)"\]')
SEMANTICS_THEME_COMMENT_RE = re.compile(
    r'(/\*\s*Semantics\s*-\s*Theme:\s*)([^*\n]+)(\s*\*/)',
    re.I,
)

# Sufijos de tema reconocidos en exports con prefijo de producto (core--*, ctr--*, …).
# Cualquier otro valor de data-theme no se toca.
SEMANTIC_LIGHT_SUFFIXES = frozenset({"light"})
SEMANTIC_DARK_SUFFIXES = frozenset({"dark", "darkbrand"})

VAR_DECL_RE = re.compile(r"(--[\w-]+)\s*:\s*([^;}\n]+);")
VAR_REF_RE = re.compile(r"var\(\s*(--[^,\s)]+)")
METADATA_RE = re.compile(r"/\*\s*(Version|Last Updated|Description|Author):\s*([^*]+)\*/", re.I)

SLOT_LABELS: dict[Slot, str] = {
    "primitives": "Primitivos",
    "semantic-light": "Semánticos light",
    "semantic-dark": "Semánticos dark",
    "components": "Componentes",
}


@dataclass
class DiffResult:
    added: dict[str, str] = field(default_factory=dict)
    removed: dict[str, str] = field(default_factory=dict)
    changed: dict[str, tuple[str, str]] = field(default_factory=dict)
    renames: list[tuple[str, str, str]] = field(default_factory=list)


def normalize_filename(name: str) -> str:
    return name.strip().lower()


def resolve_staging_files(staging_dir: Path) -> tuple[dict[Slot, Path] | None, list[str]]:
    if not staging_dir.is_dir():
        return None, [f"No existe el directorio de staging: {staging_dir}"]

    css_files = [f for f in staging_dir.iterdir() if f.is_file() and f.suffix.lower() == ".css"]
    errors: list[str] = []

    if len(css_files) != 4:
        names = [f.name for f in css_files]
        errors.append(
            f"Se esperan exactamente 4 ficheros CSS; encontrados {len(css_files)}: {names or '(ninguno)'}"
        )

    mapped: dict[Slot, Path] = {}
    seen_slots: set[Slot] = set()
    for f in css_files:
        key = normalize_filename(f.name)
        slot = EXPECTED_EXPORT_FILES.get(key)
        if not slot:
            errors.append(
                f"Fichero no reconocido: {f.name} "
                f"(contrato: {', '.join(EXPECTED_EXPORT_FILES)})"
            )
            continue
        if slot in seen_slots:
            errors.append(f"Slot duplicado para {slot}: {f.name}")
            continue
        mapped[slot] = f
        seen_slots.add(slot)

    for expected_name, slot in EXPECTED_EXPORT_FILES.items():
        if slot not in mapped:
            errors.append(f"Falta fichero: {expected_name}")

    if errors:
        return None, errors
    return mapped, []


def semantic_mode_from_theme_id(theme_id: str) -> Literal["light", "dark"] | None:
    """Deriva light/dark ignorando prefijos de producto en el id de tema."""
    if theme_id == "light":
        return "light"
    if theme_id == "dark":
        return "dark"
    segment = theme_id.rsplit("--", 1)[-1]
    if segment in SEMANTIC_LIGHT_SUFFIXES:
        return "light"
    if segment in SEMANTIC_DARK_SUFFIXES:
        return "dark"
    return None


def normalize_project_metadata(css: str) -> str:
    """Elimina prefijos de producto en comentarios Semantics - Theme: …"""

    def repl(m: re.Match[str]) -> str:
        mode = semantic_mode_from_theme_id(m.group(2).strip())
        if mode:
            return f"{m.group(1)}{mode}{m.group(3)}"
        return m.group(0)

    return SEMANTICS_THEME_COMMENT_RE.sub(repl, css)


def normalize_project_theme_selectors(css: str) -> str:
    """Convierte data-theme con prefijo de proyecto al selector canónico light/dark."""

    def repl(m: re.Match[str]) -> str:
        mode = semantic_mode_from_theme_id(m.group(1))
        if mode:
            return f'html[data-theme="{mode}"]'
        return m.group(0)

    return DATA_THEME_SELECTOR_RE.sub(repl, css)


def transform_export(css: str) -> str:
    out = re.sub(r"@layer\s+csisarqref", "@layer mds-core", css, flags=re.I)
    out = normalize_project_metadata(out)
    out = normalize_project_theme_selectors(out)
    return out


def extract_block(css: str, selector: str) -> str:
    i = css.find(selector)
    if i < 0:
        return ""
    j = css.find("{", i)
    if j < 0:
        return ""
    depth = 0
    start = j + 1
    for k in range(j, len(css)):
        if css[k] == "{":
            depth += 1
        elif css[k] == "}":
            depth -= 1
            if depth == 0:
                return css[start:k]
    return ""


def parse_vars_from_css(css: str, selector: str | None = None) -> dict[str, str]:
    inner = extract_block(css, selector) if selector else css
    if not inner and selector:
        return {}
    seen: dict[str, str] = {}
    for m in VAR_DECL_RE.finditer(inner):
        seen[m.group(1).strip()] = m.group(2).strip()
    return seen


def parse_metadata(css: str) -> dict[str, str]:
    meta: dict[str, str] = {}
    for m in METADATA_RE.finditer(css):
        meta[m.group(1).strip().lower().replace(" ", "_")] = m.group(2).strip()
    return meta


def comp_label(name: str) -> str:
    n = name[4:] if name.startswith("--p-") else name[2:]
    m = re.match(r"^([\w]+)", n)
    return m.group(1).capitalize() if m else "Otros"


def extract_var_ref(value: str) -> str | None:
    m = VAR_REF_RE.search(value or "")
    return m.group(1).strip() if m else None


def diff_maps(old: dict[str, str], new: dict[str, str]) -> DiffResult:
    result = DiffResult()
    for name in sorted(set(new) - set(old)):
        result.added[name] = new[name]
    for name in sorted(set(old) - set(new)):
        result.removed[name] = old[name]
    for name in sorted(set(old) & set(new)):
        if old[name] != new[name]:
            result.changed[name] = (old[name], new[name])
    result.renames = detect_renames(result.added, result.removed)
    return result


def detect_renames(
    added: dict[str, str], removed: dict[str, str]
) -> list[tuple[str, str, str]]:
    renames: list[tuple[str, str, str]] = []
    used_new: set[str] = set()
    for old_name, old_val in removed.items():
        old_ref = extract_var_ref(old_val) or old_val.strip()
        for new_name, new_val in added.items():
            if new_name in used_new:
                continue
            new_ref = extract_var_ref(new_val) or new_val.strip()
            if old_val == new_val or old_ref == new_ref:
                renames.append((old_name, new_name, "same_value_or_ref"))
                used_new.add(new_name)
                break
    return renames


def detect_slot_content(css: str) -> Slot | None:
    if 'html[data-theme="light"]' in css or re.search(r'data-theme="[^"]*light', css):
        return "semantic-light"
    if 'html[data-theme="dark"]' in css or re.search(r'data-theme="[^"]*dark', css):
        return "semantic-dark"
    if COMPONENT_VAR_RE.search(css):
        return "components"
    if PRIMITIVE_PALETTE_RE.search(css):
        return "primitives"
    if COMP_PREFIX_RE.search(css):
        return "components"
    return "primitives"


def load_core_vars() -> dict[Slot, dict[str, str]]:
    result: dict[Slot, dict[str, str]] = {}
    for slot, filename in CORE_DEST_FILES.items():
        path = STYLES / filename
        css = path.read_text(encoding="utf-8") if path.is_file() else ""
        result[slot] = parse_vars_from_css(css, CORE_SELECTORS[slot])
    return result


def load_export_vars(staging_dir: Path) -> tuple[dict[Slot, dict[str, str]] | None, list[str]]:
    mapped, errors = resolve_staging_files(staging_dir)
    if errors or not mapped:
        return None, errors

    result: dict[Slot, dict[str, str]] = {}
    for slot, path in mapped.items():
        raw = path.read_text(encoding="utf-8")
        transformed = transform_export(raw)
        vars_map = parse_vars_from_css(transformed, CORE_SELECTORS[slot])
        if not vars_map:
            errors.append(f"{path.name}: no se encontraron variables CSS en el bloque esperado")
        result[slot] = vars_map
    return (None, errors) if errors else (result, [])


def load_registry() -> dict:
    if REGISTRY_PATH.is_file():
        return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    return {}


def var_matches_pattern(name: str, pattern: str) -> bool:
    if pattern.endswith("*"):
        return name.startswith(pattern[:-1])
    return name == pattern


def suggest_bridge_entry(comp_var: str, value: str) -> dict[str, str]:
    if not comp_var.startswith("--"):
        comp_var = f"--{comp_var}"
    token = comp_var[2:]
    p_name = f"--p-{token}"
    ref = extract_var_ref(value)
    fallback = f"var({comp_var}, var({ref}))" if ref else f"var({comp_var}, {value})"
    return {"name": p_name, "value": fallback, "mds_var": comp_var}


def read_bridge_vars() -> dict[str, str]:
    path = STYLES / "primeng-tokens.css"
    if not path.is_file():
        return {}
    css = path.read_text(encoding="utf-8")
    light = parse_vars_from_css(css, 'html[data-theme="light"]')
    root = parse_vars_from_css(css, "html:root")
    return {**root, **light}


def collect_var_refs_from_text(text: str) -> set[str]:
    return {m.group(1).strip() for m in VAR_REF_RE.finditer(text)}


def resolve_var_exists(name: str, catalog: dict[str, str], depth: int = 0) -> bool:
    if depth > 12:
        return False
    if name not in catalog:
        return False
    ref = extract_var_ref(catalog[name])
    if not ref:
        return True
    return resolve_var_exists(ref, catalog, depth + 1)


def merged_catalog(slots: dict[Slot, dict[str, str]]) -> dict[str, str]:
    merged: dict[str, str] = {}
    for slot in ("primitives", "semantic-light", "semantic-dark", "components"):
        merged.update(slots.get(slot, {}))
    return merged


def read_file_header(css: str) -> str:
    lines: list[str] = []
    for line in css.splitlines():
        stripped = line.strip()
        if stripped.startswith("html"):
            break
        if stripped.startswith("/*") or stripped.startswith("@layer") or not stripped:
            lines.append(line)
        else:
            break
    return "\n".join(lines).strip()


def apply_vars_to_core_file(
    dest_path: Path,
    selector: str,
    final_vars: dict[str, str],
) -> None:
    css = dest_path.read_text(encoding="utf-8") if dest_path.is_file() else ""
    header = read_file_header(css) if css else ""

    if css and selector in css:
        idx = css.find(selector)
        brace = css.find("{", idx)
        depth = 0
        end = brace
        for k in range(brace, len(css)):
            if css[k] == "{":
                depth += 1
            elif css[k] == "}":
                depth -= 1
                if depth == 0:
                    end = k
                    break
        lines = [f"  {name}: {value};" for name, value in sorted(final_vars.items())]
        new_inner = "\n" + "\n".join(lines) + "\n"
        css = css[: brace + 1] + new_inner + css[end:]
        dest_path.write_text(css, encoding="utf-8")
    else:
        layer = "@layer mds-core;\n\n" if "@layer" not in (header or "") else ""
        decl = "\n".join(f"  {k}: {v};" for k, v in sorted(final_vars.items()))
        body = f"{selector} {{\n{decl}\n}}\n"
        content = (header + "\n\n" if header else "") + layer + body
        dest_path.write_text(content, encoding="utf-8")


def insert_bridge_entries(entries: list[dict]) -> int:
    path = STYLES / "primeng-tokens.css"
    if not path.is_file() or not entries:
        return 0
    css = path.read_text(encoding="utf-8")
    selector = 'html[data-theme="light"]'
    existing = read_bridge_vars()
    to_add: dict[str, str] = {}
    for entry in entries:
        if not entry.get("approved"):
            continue
        name = entry["name"]
        if name not in existing:
            to_add[name] = entry["value"]
    if not to_add:
        return 0
    idx = css.find(selector)
    brace = css.find("{", idx)
    depth = 0
    end = brace
    for k in range(brace, len(css)):
        if css[k] == "{":
            depth += 1
        elif css[k] == "}":
            depth -= 1
            if depth == 0:
                end = k
                break
    insert_lines = "".join(f"  {n}: {v};\n" for n, v in sorted(to_add.items()))
    css = css[:end] + insert_lines + css[end:]
    path.write_text(css, encoding="utf-8")
    return len(to_add)


def comp_prefix_from_var(name: str) -> str | None:
    m = COMP_PREFIX_RE.match(name)
    return m.group(1) if m else None


def scan_playground_refs() -> dict[str, set[str]]:
    """Escanea archivos del playground que referencian variables CSS."""
    refs: dict[str, set[str]] = {
        "primeng-tokens.css": set(),
        "overrides": set(),
        "parity": set(),
        "catalogs": set(),
    }
    bridge_path = STYLES / "primeng-tokens.css"
    if bridge_path.is_file():
        refs["primeng-tokens.css"] = collect_var_refs_from_text(bridge_path.read_text(encoding="utf-8"))

    theme_dir = ROOT / "src" / "app" / "theme"
    for f in theme_dir.glob("*-mds-overrides.ts"):
        refs["overrides"] |= collect_var_refs_from_text(f.read_text(encoding="utf-8"))

    styles_dir = ROOT / "src" / "styles"
    for f in styles_dir.glob("primeng-*-parity.css"):
        refs["parity"] |= collect_var_refs_from_text(f.read_text(encoding="utf-8"))

    catalogs_dir = ROOT / "src" / "app" / "catalogs"
    if catalogs_dir.is_dir():
        for f in catalogs_dir.rglob("*-catalog.component.css"):
            refs["catalogs"] |= collect_var_refs_from_text(f.read_text(encoding="utf-8"))

    return refs


# Puente: vars MDS eliminadas del export → valor congelado (sin leer var MDS).
# No incluir shorthands/aliases que se mantienen en core a propósito (galleria/stepper).
BRIDGE_FROZEN_WHEN_MDS_REMOVED: dict[str, str | None] = {
    "--p-galleria-close-button-focus-ring-style": "var(--p-focus-ring-style, solid)",
    "--p-galleria-indicator-button-focus-ring-style": "var(--p-focus-ring-style, solid)",
    "--p-galleria-nav-button-focus-ring-style": "var(--p-focus-ring-style, solid)",
    "--p-galleria-thumbnail-nav-button-focus-ring-style": "var(--p-focus-ring-style, solid)",
    "--p-galleria-transition-duration": "var(--p-transition-duration, 180ms)",
    "--p-stepper-transition-duration": "var(--p-transition-duration, 0.2s)",
}

# Fallbacks del puente desincronizados con el core (solo casos conocidos).
# Carousel showcase en /media usa override local x16; el puente debe reflejar core x4.
BRIDGE_STALE_FALLBACKS: dict[str, str] = {
    "--p-carousel-content-gap": "var(--carousel-content-gap, var(--dimension-scale-x4))",
}

# Aliases legacy en core que el bridge/parity siguen necesitando aunque Figma las elimine.
CORE_LEGACY_BRIDGE_ALIASES: frozenset[str] = frozenset(
    {
        "--galleria-thumbnails-content-padding",
        "--stepper-separator-margin",
        "--stepper-steppanel-indent",
        "--stepper-steppanels-padding",
    }
)

# Overrides intencionales en catálogos (showcase ≠ core).
CATALOG_INTENTIONAL_MASKS: frozenset[tuple[str, str]] = frozenset(
    {
        ("--carousel-content-gap", "src/app/catalogs/media/media-catalog.component.css"),
        ("--galleria-thumbnails-content-padding", "src/app/catalogs/media/media-catalog.component.css"),
        ("--galleria-thumbnails-content-padding-x", "src/app/catalogs/media/media-catalog.component.css"),
        ("--galleria-thumbnails-content-padding-y", "src/app/catalogs/media/media-catalog.component.css"),
    }
)


def split_var_fallback(value: str) -> tuple[str | None, str | None]:
    """Primer var(--name, fallback) de un valor CSS."""
    m = re.match(r"var\(\s*(--[^,\s)]+)\s*,\s*(.+)\)\s*$", (value or "").strip())
    if not m:
        return None, None
    return m.group(1).strip(), m.group(2).strip()


def resolve_token_value(name: str, catalog: dict[str, str], depth: int = 0) -> str | None:
    """Resuelve un token MDS a valor terminal (literal o var primitiva)."""
    if depth > 12 or name not in catalog:
        return None
    val = catalog[name].strip()
    ref = extract_var_ref(val)
    if not ref:
        return val
    return resolve_token_value(ref, catalog, depth + 1) or val


def update_bridge_declaration(css: str, p_name: str, new_value: str | None) -> tuple[str, bool]:
    """Actualiza o elimina una declaración --p-* en todo primeng-tokens.css."""
    pattern = re.compile(
        rf"^[ \t]*{re.escape(p_name)}:\s*[^;]+;\n?",
        re.MULTILINE,
    )
    if new_value is None:
        updated, n = pattern.subn("", css)
        return updated, n > 0
    replacement = f"  {p_name}: {new_value};\n"
    if pattern.search(css):
        updated, n = pattern.subn(replacement, css)
        return updated, n > 0
    return css, False


def remediate_bridge_tokens(catalog: dict[str, str]) -> tuple[list[dict], dict[str, str | None]]:
    """Calcula fixes de puente: vars MDS ausentes y fallbacks obsoletos conocidos."""
    bridge = read_bridge_vars()
    fixes: dict[str, str | None] = {}
    report: list[dict] = []

    for p_name, frozen in BRIDGE_FROZEN_WHEN_MDS_REMOVED.items():
        if p_name not in bridge:
            continue
        mds_var = p_name.replace("--p-", "--", 1)
        if mds_var not in catalog and bridge[p_name] != frozen:
            fixes[p_name] = frozen
            report.append(
                {
                    "kind": "frozen_removed_mds",
                    "p_var": p_name,
                    "mds_var": mds_var,
                    "new_value": frozen,
                }
            )

    for p_name, new_value in BRIDGE_STALE_FALLBACKS.items():
        if p_name in bridge and bridge[p_name] != new_value:
            fixes[p_name] = new_value
            report.append(
                {
                    "kind": "stale_fallback",
                    "p_var": p_name,
                    "new_value": new_value,
                }
            )

    return report, fixes


def apply_bridge_fixes(fixes: dict[str, str | None]) -> int:
    path = STYLES / "primeng-tokens.css"
    if not path.is_file() or not fixes:
        return 0
    css = path.read_text(encoding="utf-8")
    applied = 0
    for p_name, new_value in fixes.items():
        css, changed = update_bridge_declaration(css, p_name, new_value)
        if changed:
            applied += 1
    path.write_text(css, encoding="utf-8")
    return applied


def find_core_legacy_vars(export_components: dict[str, str] | None) -> list[str]:
    """Vars en core components que ya no están en el export (excluye aliases de bridge)."""
    if not export_components:
        return []
    core = load_core_vars().get("components", {})
    legacy = sorted(set(core) - set(export_components))
    return [name for name in legacy if name not in CORE_LEGACY_BRIDGE_ALIASES]


def find_catalog_token_masks(catalog: dict[str, str]) -> list[dict]:
    """Detecta redefiniciones locales de tokens MDS con valor distinto al core."""
    masks: list[dict] = []
    catalogs_dir = ROOT / "src" / "app" / "catalogs"
    if not catalogs_dir.is_dir():
        return masks
    decl_re = re.compile(r"(--[\w-]+)\s*:\s*([^;}\n]+);")
    for css_path in catalogs_dir.rglob("*-catalog.component.css"):
        rel = str(css_path.relative_to(ROOT))
        for m in decl_re.finditer(css_path.read_text(encoding="utf-8")):
            name, val = m.group(1).strip(), m.group(2).strip()
            if name.startswith("--p-"):
                continue
            if name not in catalog:
                continue
            core_val = catalog[name].strip()
            if val.strip() == core_val.strip():
                continue
            core_res = resolve_token_value(name, catalog)
            local_ref = extract_var_ref(val)
            local_res = resolve_token_value(local_ref, catalog) if local_ref else val.strip()
            if core_res and local_res and core_res != local_res:
                if (name, rel) in CATALOG_INTENTIONAL_MASKS:
                    continue
                masks.append(
                    {
                        "var": name,
                        "file": rel,
                        "core": core_val,
                        "local": val,
                    }
                )
    return masks

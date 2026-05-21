#!/usr/bin/env python3
"""Genera el puente runtime MDS → PrimeNG (--p-*) sin fallbacks Aura.

Lee styles/primeng-tokens.css (misma fuente que el playground estático) y produce
apps/playground/src/app/theme/prime-runtime-bridge.generated.ts

Tras el tema inyectado por @primeuix, Angular reaplica todas las variables --p-*
desde los tokens MDS (--button-*, --form-field-*, --primary-*, etc.) que viven
en el core + en los CSS subidos por el usuario.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "styles" / "primeng-tokens.css"
OUT = ROOT / "apps" / "playground" / "src" / "app" / "theme" / "prime-runtime-bridge.generated.ts"

# Variables de shell que también deben seguir al core MDS
SHELL_VARS = frozenset(
    {
        "--app-bg",
        "--sidebar-bg",
        "--sidebar-border",
        "--topbar-bg",
        "--topbar-border",
    }
)


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


def parse_decls(inner: str) -> dict[str, str]:
    decls: dict[str, str] = {}
    for m in re.finditer(r"(--[\w-]+)\s*:\s*([^;]+);", inner, re.MULTILINE):
        decls[m.group(1).strip()] = m.group(2).strip()
    return decls


def first_var_name(value: str):
    m = re.search(r"var\(\s*(--[^,\s)]+)", value)
    return m.group(1).strip() if m else None


def is_mds_token(name: str) -> bool:
    return not name.startswith("--p-")


def resolve_mds_var(name: str, decls: dict[str, str], cache, depth: int = 0):
    if name in cache:
        return cache[name]
    if depth > 12:
        cache[name] = None
        return None
    val = decls.get(name)
    if not val:
        cache[name] = None
        return None
    tok = first_var_name(val)
    if not tok:
        cache[name] = None
        return None
    if is_mds_token(tok):
        cache[name] = tok
        return tok
    resolved = resolve_mds_var(tok, decls, cache, depth + 1)
    cache[name] = resolved
    return resolved


def bridge_declarations(decls: dict[str, str]) -> list[tuple[str, str]]:
    cache: dict[str, str | None] = {}
    out: list[tuple[str, str]] = []
    for name, value in decls.items():
        if not (name.startswith("--p-") or name in SHELL_VARS):
            continue
        mds = resolve_mds_var(name, decls, cache)
        if mds:
            out.append((name, f"var({mds})"))
    return sorted(out, key=lambda x: x[0])


def emit_block(selector: str, pairs: list[tuple[str, str]]) -> str:
    if not pairs:
        return ""
    lines = [f"  {n}: {v};" for n, v in pairs]
    return f"{selector} {{\n" + "\n".join(lines) + "\n}\n"


def main() -> None:
    css = SRC.read_text(encoding="utf-8")
    light_inner = extract_block(css, "html[data-theme=\"light\"]") or extract_block(css, ":root")
    dark_inner = extract_block(css, 'html[data-theme="dark"]') or extract_block(
        css, '[data-theme="dark"]'
    )

    light_pairs = bridge_declarations(parse_decls(light_inner))
    dark_specific = bridge_declarations(parse_decls(dark_inner))

    # Dark: hereda todo el puente light y aplica overrides del bloque dark de primeng-tokens.
    merged_dark = dict(light_pairs)
    merged_dark.update(dark_specific)

    dark_shell = parse_decls(dark_inner)
    for shell in SHELL_VARS:
        if shell in dark_shell:
            merged_dark[shell] = dark_shell[shell]

    dark_pairs = sorted(merged_dark.items(), key=lambda x: x[0])

    css_out = (
        "/* Auto-generated — NO EDITAR. scripts/regen-prime-runtime-bridge.py */\n"
        "/* Reaplica tokens MDS sobre el tema runtime de PrimeNG (todos los --p-*). */\n"
        "/* Shell (--app-bg, sidebar, topbar): solo por data-theme, nunca en :root global. */\n"
        + emit_block('html[data-theme="light"]', light_pairs)
        + emit_block('html[data-theme="dark"]', dark_pairs)
    )

    ts = f"""/* eslint-disable */
/** Generado por scripts/regen-prime-runtime-bridge.py — no editar a mano. */
export const MDS_RUNTIME_BRIDGE_STYLE_ID = 'mds-prime-runtime-bridge';

export const PRIME_RUNTIME_BRIDGE_CSS = {css_out!r};
"""

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(ts, encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(light_pairs)} light, {len(dark_pairs)} dark declarations)")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Form catalog: un preview frame por bloque + States/Sizes en catalogPreviewDetails."""

from __future__ import annotations

import re
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "src/app/catalogs/form/form-catalog.component.html"

FRAME_ATTRS = """
            [showExpand]="true"
            [showConfig]="block.kind !== 'toggleswitch'"
            [expandAriaLabel]="'Expandir estados y tamaños de ' + block.title"
            [collapseAriaLabel]="'Contraer estados y tamaños de ' + block.title"
"""

CASE_OPEN = re.compile(r"^            (@case \('([^']+)'\)|@default) \{\s*$")
INTERACTION_CASE_OPEN = re.compile(r"^            @case \('([^']+)'\) \{\s*$")
CASE_CLOSE = re.compile(r"^            \}\s*$")


def section_between(html: str, start_marker: str, end_marker: str) -> str:
    start = html.index(start_marker)
    end = html.index(end_marker, start)
    return html[start:end]


INPUT_KINDS = frozenset({"select", "textarea", "inputtext", "password", "inputotp", "rating"})


def parse_switch_cases(section: str) -> dict[str, str]:
    cases: dict[str, str] = {}
    current: str | None = None
    body: list[str] = []

    for line in section.splitlines():
        case_match = CASE_OPEN.match(line)
        if case_match:
            if current is not None:
                cases[current] = "\n".join(body).strip()
            current = case_match.group(2) or "default"
            body = []
            continue

        if current is not None and CASE_CLOSE.match(line):
            cases[current] = "\n".join(body).strip()
            current = None
            body = []
            continue

        if current is not None:
            body.append(line)

    return cases


def case_state_body(kind: str, states: dict[str, str]) -> str:
    if kind in states:
        return states[kind]
    if kind in INPUT_KINDS:
        return states.get("default", "")
    return ""


def case_size_body(kind: str, sizes: dict[str, str]) -> str:
    if kind in sizes:
        return sizes[kind]
    if kind in INPUT_KINDS:
        return sizes.get("default", "")
    return ""


def patch_frame_open(html: str) -> str:
    def repl(match: re.Match[str]) -> str:
        if "showExpand" in match.group(0):
            return match.group(0)
        config = match.group(1)
        if config:
            return (
                "<mds-catalog-preview-frame\n"
                '                class="btn-section catalog-preview-section"\n'
                f"{FRAME_ATTRS}\n"
                f"{config}"
                "              >"
            )
        return match.group(0)

    return re.sub(
        r"<mds-catalog-preview-frame\s*\n\s*class=\"btn-section catalog-preview-section\"\s*\n"
        r"((?:\s*\[showConfig\]=\"[^\"]*\"\s*\n|\s*configAriaLabel=\"[^\"]*\"\s*\n)*)\s*>",
        repl,
        html,
    )


def build_details(kind: str, states: dict[str, str], sizes: dict[str, str]) -> str:
    state_body = case_state_body(kind, states).strip()
    if not state_body:
        return ""

    lines = [
        "                <ng-container catalogPreviewDetails>",
        '                  <mds-catalog-info-block title="States" icon="list">',
        state_body,
        "                  </mds-catalog-info-block>",
    ]

    if kind not in {"toggleswitch", "rating"}:
        size_body = case_size_body(kind, sizes).strip()
        if size_body:
            lines.extend(
                [
                    '                  <mds-catalog-info-block title="Sizes" icon="arrows-v">',
                    size_body,
                    "                  </mds-catalog-info-block>",
                ]
            )

    lines.append("                </ng-container>")
    return "\n".join(lines) + "\n"


def inject_details(html: str, states: dict[str, str], sizes: dict[str, str]) -> str:
    states_marker = "        <!-- States -->"
    interaction_html = html[: html.index(states_marker)] if states_marker in html else html
    tail = html[len(interaction_html) :]

    lines = interaction_html.splitlines()
    out: list[str] = []
    current_kind: str | None = None

    for line in lines:
        case_match = INTERACTION_CASE_OPEN.match(line)
        if case_match:
            current_kind = case_match.group(1)
            out.append(line)
            continue

        if current_kind and line.strip() == "</mds-catalog-preview-frame>":
            details = build_details(current_kind, states, sizes)
            if details:
                out.append(details.rstrip("\n"))
            out.append(line)
            continue

        if current_kind and CASE_CLOSE.match(line):
            current_kind = None

        out.append(line)

    return "\n".join(out) + tail


def remove_legacy_sections(html: str) -> str:
    start = html.index("        <!-- States -->")
    end_marker = "        }\n        </div>\n      </section>"
    end = html.rindex(end_marker)
    if end < start:
        raise ValueError("Could not locate end of States/Sizes section")
    return html[:start] + html[end + len("        }\n") :]


def main() -> None:
    html = PATH.read_text(encoding="utf-8")
    states_section = section_between(
        html,
        "        <!-- States -->",
        "        <!-- Sizes (ToggleSwitch y Rating: un solo tamaño MDS, sin sección) -->",
    )
    sizes_section = section_between(
        html,
        "        <!-- Sizes (ToggleSwitch y Rating: un solo tamaño MDS, sin sección) -->",
        "        }\n        </div>\n      </section>",
    )
    states = parse_switch_cases(states_section)
    sizes = parse_switch_cases(sizes_section)

    html = patch_frame_open(html)
    html = inject_details(html, states, sizes)
    html = remove_legacy_sections(html)

    PATH.write_text(html, encoding="utf-8")
    print("OK", PATH)
    print("states", sorted(states.keys()))
    print("sizes", sorted(sizes.keys()))


if __name__ == "__main__":
    main()

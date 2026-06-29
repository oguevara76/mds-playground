#!/usr/bin/env python3
"""Form catalog: ng-template compartido para States/Sizes en catalogPreviewDetails."""

from __future__ import annotations

from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "src/app/catalogs/form/form-catalog.component.html"

DETAILS = """
                <ng-container catalogPreviewDetails>
                  <mds-catalog-info-block title="States" icon="list">
                    <ng-container *ngTemplateOutlet="formCatalogStates" />
                  </mds-catalog-info-block>
                  @if (showFormSizesSection(block.kind)) {
                    <mds-catalog-info-block title="Sizes" icon="arrows-v">
                      <ng-container *ngTemplateOutlet="formCatalogSizes" />
                    </mds-catalog-info-block>
                  }
                </ng-container>
"""


def extract_switch_block(section: str) -> str:
    lines = section.splitlines()
    start_idx = next(i for i, line in enumerate(lines) if line.strip() == "@switch (block.kind) {")
    depth = 0
    collected: list[str] = []

    for line in lines[start_idx:]:
        depth += line.count("{") - line.count("}")
        collected.append(line)
        if len(collected) > 1 and depth == 0:
            break

    return "\n".join(collected).strip()


def main() -> None:
    html = PATH.read_text(encoding="utf-8")

    states_section = html.split("        <!-- States -->", 1)[1].split(
        "        <!-- Sizes (ToggleSwitch y Rating: un solo tamaño MDS, sin sección) -->", 1
    )[0]
    sizes_section = html.split(
        "        <!-- Sizes (ToggleSwitch y Rating: un solo tamaño MDS, sin sección) -->", 1
    )[1]

    states_switch = extract_switch_block(states_section)
    sizes_switch = extract_switch_block(sizes_section)

    templates = f"""
        <ng-template #formCatalogStates>
          {states_switch}
        </ng-template>

        <ng-template #formCatalogSizes>
          {sizes_switch}
        </ng-template>
"""

    legacy_start = html.index("        <!-- States -->")
    legacy_end = html.rindex("        @if (block.kind !== 'toggleswitch' && block.kind !== 'rating') {")
    legacy_end = html.index("        }\n        </div>\n      </section>", legacy_end)

    html = html[:legacy_start] + templates + html[legacy_end + len("        }\n") :]

    html = html.replace("              </mds-catalog-preview-frame>", DETAILS + "              </mds-catalog-preview-frame>")

    PATH.write_text(html, encoding="utf-8")
    print("OK", PATH, "lines", len(html.splitlines()))

if __name__ == "__main__":
    main()

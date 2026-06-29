#!/usr/bin/env python3
"""Reestructura form-catalog: un preview frame por bloque con expand + info blocks."""

from pathlib import Path
import re

PATH = Path(__file__).resolve().parents[1] / "src/app/catalogs/form/form-catalog.component.html"

FRAME_OPEN = """
          <mds-catalog-preview-frame
            class="btn-section catalog-preview-section"
            [showExpand]="true"
            [showConfig]="block.kind !== 'toggleswitch'"
            [configAriaLabel]="'Configurar ' + block.title"
            [expandAriaLabel]="'Expandir estados y tamaños de ' + block.title"
            [collapseAriaLabel]="'Contraer estados y tamaños de ' + block.title"
          >
"""

def main() -> None:
    html = PATH.read_text(encoding="utf-8")

    html = html.replace(
        '        <div class="catalog-block-body" [ngClass]="formThemeContainerClass(block.kind)">\n          @switch (block.kind) {',
        '        <div class="catalog-block-body" [ngClass]="formThemeContainerClass(block.kind)">' + FRAME_OPEN + "          @switch (block.kind) {",
        1,
    )

    html = re.sub(
        r"\s*<mds-catalog-preview-frame\s*\n\s*class=\"btn-section catalog-preview-section\"\s*\n"
        r"(?:\s*\[showConfig\]=\"false\"\s*\n|\s*configAriaLabel=\"[^\"]*\"\s*\n)\s*>",
        "",
        html,
    )
    html = html.replace("              </mds-catalog-preview-frame>\n", "")

    html = html.replace(
        """        <!-- States -->
        <div class="btn-section">
          <p class="btn-section-title">States</p>

          @switch (block.kind) {""",
        """            <ng-container catalogPreviewDetails>
              <mds-catalog-info-block title="States" icon="list">
          @switch (block.kind) {""",
        1,
    )

    html = html.replace(
        """          }
        </div>

        <!-- Sizes (ToggleSwitch y Rating: un solo tamaño MDS, sin sección) -->
        @if (block.kind !== 'toggleswitch' && block.kind !== 'rating') {
        <div class="btn-section">
          <p class="btn-section-title">Sizes</p>

          @switch (block.kind) {""",
        """          }
              </mds-catalog-info-block>

        @if (block.kind !== 'toggleswitch' && block.kind !== 'rating') {
              <mds-catalog-info-block title="Sizes" icon="arrows-v">
          @switch (block.kind) {""",
        1,
    )

    html = html.replace(
        """          }
        </div>
        }
        </div>
      </section>""",
        """          }
              </mds-catalog-info-block>
        }
            </ng-container>
          </mds-catalog-preview-frame>
        </div>
      </section>""",
        1,
    )

    PATH.write_text(html, encoding="utf-8")
    print("OK", PATH)

if __name__ == "__main__":
    main()

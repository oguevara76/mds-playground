import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';
import {
  OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT,
  OVERLAY_CATALOG_TOOLTIP_POSITIONS,
  type TooltipPositionKey,
} from './overlay-catalog.config';

@Component({
  selector: 'app-overlay-catalog',
  standalone: true,
  imports: [Tooltip, InputText, FormsModule],
  templateUrl: './overlay-catalog.component.html',
  styleUrl: './overlay-catalog.component.css',
  host: { class: 'overlay-catalog-page' },
})
export class OverlayCatalogComponent {
  readonly tooltipText = OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT;
  readonly positionDemos = OVERLAY_CATALOG_TOOLTIP_POSITIONS;

  projectName = '';

  trackPosition(_: number, demo: { key: TooltipPositionKey }): TooltipPositionKey {
    return demo.key;
  }
}

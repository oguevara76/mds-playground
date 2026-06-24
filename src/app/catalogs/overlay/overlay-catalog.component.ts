import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import {
  OVERLAY_CATALOG_DRAWER_CONFIG_HINT,
  OVERLAY_CATALOG_DRAWER_CONTENT,
  OVERLAY_CATALOG_DRAWER_FULLSCREEN_ICON,
  OVERLAY_CATALOG_DRAWER_FULLSCREEN_LABEL,
  OVERLAY_CATALOG_DRAWER_HEADER,
  OVERLAY_CATALOG_DRAWER_POSITIONS,
  OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT,
  OVERLAY_CATALOG_TOOLTIP_POSITIONS,
  type DrawerCatalogInteractionState,
  type DrawerPositionKey,
  type TooltipPositionKey,
} from './overlay-catalog.config';

@Component({
  selector: 'app-overlay-catalog',
  standalone: true,
  imports: [
    Tooltip,
    InputText,
    FormsModule,
    Drawer,
    Button,
    Popover,
    ToggleSwitch,
  ],
  templateUrl: './overlay-catalog.component.html',
  styleUrl: './overlay-catalog.component.css',
  host: { class: 'overlay-catalog-page' },
})
export class OverlayCatalogComponent {
  readonly tooltipText = OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT;
  readonly positionDemos = OVERLAY_CATALOG_TOOLTIP_POSITIONS;
  readonly drawerPositionDemos = OVERLAY_CATALOG_DRAWER_POSITIONS;
  readonly drawerHeader = OVERLAY_CATALOG_DRAWER_HEADER;
  readonly drawerContent = OVERLAY_CATALOG_DRAWER_CONTENT;
  readonly drawerFullScreenLabel = OVERLAY_CATALOG_DRAWER_FULLSCREEN_LABEL;
  readonly drawerFullScreenIcon = OVERLAY_CATALOG_DRAWER_FULLSCREEN_ICON;
  readonly drawerConfigHint = OVERLAY_CATALOG_DRAWER_CONFIG_HINT;

  projectName = '';

  readonly drawerIx = signal<DrawerCatalogInteractionState>({
    position: 'left',
    fullScreen: false,
    modal: true,
  });

  drawerVisible = false;

  trackPosition(_: number, demo: { key: TooltipPositionKey }): TooltipPositionKey {
    return demo.key;
  }

  trackDrawerPosition(_: number, demo: { key: DrawerPositionKey }): DrawerPositionKey {
    return demo.key;
  }

  patchDrawerIx(patch: Partial<DrawerCatalogInteractionState>): void {
    this.drawerIx.update((state) => ({ ...state, ...patch }));
  }

  openDrawer(position: DrawerPositionKey): void {
    this.patchDrawerIx({ position, fullScreen: false });
    this.drawerVisible = true;
  }

  openDrawerFullScreen(): void {
    this.patchDrawerIx({ fullScreen: true });
    this.drawerVisible = true;
  }
}

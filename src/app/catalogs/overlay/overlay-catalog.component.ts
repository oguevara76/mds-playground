import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
  OVERLAY_CATALOG_DIALOG_CONTENT,
  OVERLAY_CATALOG_DIALOG_HEADER,
  OVERLAY_CATALOG_DIALOG_OPEN_ICON,
  OVERLAY_CATALOG_DIALOG_OPEN_LABEL,
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
    CatalogBlockHeadTitlePipe,
    CatalogInfoBlockComponent,
    CatalogPreviewFrameComponent,
    CatalogStateTagComponent,
    Tooltip,
    InputText,
    FormsModule,
    Dialog,
    Drawer,
    Button,
    ToggleSwitch,
  ],
  templateUrl: './overlay-catalog.component.html',
  styleUrl: './overlay-catalog.component.css',
  host: { class: 'overlay-catalog-page' },
})
export class OverlayCatalogComponent {
  readonly tooltipText = OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT;
  readonly positionDemos = OVERLAY_CATALOG_TOOLTIP_POSITIONS;

  readonly dialogHeader = OVERLAY_CATALOG_DIALOG_HEADER;
  readonly dialogContent = OVERLAY_CATALOG_DIALOG_CONTENT;
  readonly dialogOpenLabel = OVERLAY_CATALOG_DIALOG_OPEN_LABEL;
  readonly dialogOpenIcon = OVERLAY_CATALOG_DIALOG_OPEN_ICON;

  dialogVisible = false;

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

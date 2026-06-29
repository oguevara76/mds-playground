import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
  BREADCRUMB_CATALOG_DISPLAY_MODE_DEMOS,
  BREADCRUMB_CATALOG_DISPLAY_MODE_OPTIONS,
  BREADCRUMB_CATALOG_HOME_ARIA_LABEL,
  BREADCRUMB_CATALOG_ITEM_COUNT_OPTIONS,
  buildBreadcrumbHomeItem,
  buildBreadcrumbModel,
  breadcrumbCatalogShowsTooltipNote,
  breadcrumbDisplayModeClass,
  type BreadcrumbCatalogDisplayMode,
  type BreadcrumbCatalogInteractionState,
  type BreadcrumbCatalogItemCount,
} from './menu-catalog.config';

@Component({
  selector: 'app-menu-catalog',
  standalone: true,
  imports: [Breadcrumb, CatalogBlockHeadTitlePipe, CatalogPreviewFrameComponent, CatalogStateTagComponent, FormsModule, Select, SelectButton, Divider],
  templateUrl: './menu-catalog.component.html',
  styleUrl: './menu-catalog.component.css',
  host: { class: 'menu-catalog-page' },
})
export class MenuCatalogComponent {
  readonly itemCountOptions = BREADCRUMB_CATALOG_ITEM_COUNT_OPTIONS;
  readonly displayModeOptions = BREADCRUMB_CATALOG_DISPLAY_MODE_OPTIONS;
  readonly displayModeDemos = BREADCRUMB_CATALOG_DISPLAY_MODE_DEMOS;
  readonly homeAriaLabel = BREADCRUMB_CATALOG_HOME_ARIA_LABEL;

  readonly breadcrumbIx = signal<BreadcrumbCatalogInteractionState>({
    itemCount: 5,
    displayMode: 'icon-text',
  });

  readonly breadcrumbHome = computed<MenuItem>(() =>
    buildBreadcrumbHomeItem(this.breadcrumbIx().displayMode),
  );

  readonly breadcrumbModel = computed<MenuItem[]>(() =>
    buildBreadcrumbModel(
      this.breadcrumbIx().itemCount,
      this.breadcrumbIx().displayMode,
    ),
  );

  readonly breadcrumbDisplayClass = computed(() =>
    breadcrumbDisplayModeClass(this.breadcrumbIx().displayMode),
  );

  readonly configAsideHint = 'Items, Display mode';

  readonly breadcrumbTooltipNoteVisible = computed(() =>
    breadcrumbCatalogShowsTooltipNote(this.breadcrumbIx().displayMode),
  );

  patchBreadcrumbIx(patch: Partial<BreadcrumbCatalogInteractionState>): void {
    this.breadcrumbIx.update((state) => ({ ...state, ...patch }));
  }

  trackDisplayMode(_: number, demo: { key: BreadcrumbCatalogDisplayMode }): BreadcrumbCatalogDisplayMode {
    return demo.key;
  }

  demoHome(displayMode: BreadcrumbCatalogDisplayMode): MenuItem {
    return buildBreadcrumbHomeItem(displayMode, false);
  }

  demoModel(
    displayMode: BreadcrumbCatalogDisplayMode,
    itemCount: BreadcrumbCatalogItemCount = 4,
  ): MenuItem[] {
    return buildBreadcrumbModel(itemCount, displayMode, false);
  }

  demoDisplayClass(displayMode: BreadcrumbCatalogDisplayMode): string {
    return breadcrumbDisplayModeClass(displayMode);
  }
}

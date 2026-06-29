import { NgClass } from '@angular/common';
import { afterNextRender, Component, inject, Injector, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
  DIVIDER_ALIGN_OPTIONS,
  DIVIDER_BORDER_TYPE_OPTIONS,
  DIVIDER_STATE_DEMOS,
  PANEL_CATALOG_TAB_STATE_DEMOS,
  PANEL_CATALOG_TABS,
  type DividerInteractionState,
  type DividerStateDemo,
  type DividerStateKey,
  type PanelCatalogTabStateKey,
} from './panel-catalog.config';

@Component({
  selector: 'app-panel-catalog',
  standalone: true,
  imports: [CatalogBlockHeadTitlePipe, CatalogPreviewFrameComponent, CatalogStateTagComponent, Tabs, TabList, Tab, TabPanels, TabPanel, ToggleSwitch, FormsModule, NgClass, Divider, Select],
  templateUrl: './panel-catalog.component.html',
  styleUrl: './panel-catalog.component.css',
  host: { class: 'panel-catalog-page' },
})
export class PanelCatalogComponent {
  private readonly injector = inject(Injector);

  // ─── Tabs ──────────────────────────────────────────────────────────────────

  readonly tabs = PANEL_CATALOG_TABS;
  readonly tabStateDemos = PANEL_CATALOG_TAB_STATE_DEMOS;

  readonly activeTab = signal('0');
  readonly showLeftIcon = signal(false);
  readonly showRightIcon = signal(false);

  iconVisibilityClass(): Record<string, boolean> {
    return {
      'show-left-icon': this.showLeftIcon(),
      'show-right-icon': this.showRightIcon(),
    };
  }

  setShowLeftIcon(value: boolean): void {
    this.showLeftIcon.set(value);
    this.scheduleTabsInkbarSync();
  }

  setShowRightIcon(value: boolean): void {
    this.showRightIcon.set(value);
    this.scheduleTabsInkbarSync();
  }

  trackTab(_: number, tab: { value: string }): string {
    return tab.value;
  }

  trackTabState(_: number, s: { key: PanelCatalogTabStateKey }): PanelCatalogTabStateKey {
    return s.key;
  }

  onTabChange(value: string | number | undefined): void {
    if (value === undefined || value === null) {
      return;
    }
    this.activeTab.set(String(value));
    this.scheduleTabsInkbarSync();
  }

  /** Paridad legacy: recoloca la barra activa tras cambiar iconos o pestaña. */
  private scheduleTabsInkbarSync(): void {
    afterNextRender(
      () => {
        const tablist = document.querySelector<HTMLElement>(
          '.tabs-catalog-live .p-tablist-tab-list',
        );
        if (!tablist) {
          return;
        }
        const inkbar = tablist.querySelector<HTMLElement>('.p-tablist-active-bar');
        const active = tablist.querySelector<HTMLElement>('.p-tab-active');
        if (!inkbar || !active) {
          return;
        }
        inkbar.style.width = `${active.offsetWidth}px`;
        inkbar.style.left = `${active.offsetLeft}px`;
      },
      { injector: this.injector },
    );
  }

  // ─── Divider ───────────────────────────────────────────────────────────────

  readonly dividerBorderTypeOptions = DIVIDER_BORDER_TYPE_OPTIONS;
  readonly dividerAlignOptions = DIVIDER_ALIGN_OPTIONS;
  readonly dividerStateDemos = DIVIDER_STATE_DEMOS;

  readonly dividerIx = signal<DividerInteractionState>({
    type: 'solid',
    align: 'center',
    showLabel: false,
  });

  patchDividerIx(patch: Partial<DividerInteractionState>): void {
    this.dividerIx.update((s) => ({ ...s, ...patch }));
  }

  trackDividerState(_: number, demo: DividerStateDemo): DividerStateKey {
    return demo.key;
  }
}

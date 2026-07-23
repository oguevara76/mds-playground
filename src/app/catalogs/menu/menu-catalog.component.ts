import { Component, computed, signal, ViewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Menu } from 'primeng/menu';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { TieredMenu } from 'primeng/tieredmenu';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
  BREADCRUMB_CATALOG_DISPLAY_MODE_DEMOS,
  BREADCRUMB_CATALOG_DISPLAY_MODE_OPTIONS,
  BREADCRUMB_CATALOG_HOME_ARIA_LABEL,
  BREADCRUMB_CATALOG_ITEM_COUNT_OPTIONS,
  buildBreadcrumbHomeItem,
  buildBreadcrumbModel,
  buildMenuCatalogModel,
  buildMenuToggleableModel,
  buildTieredMenuCatalogModel,
  breadcrumbCatalogShowsTooltipNote,
  breadcrumbDisplayModeClass,
  MENU_CATALOG_EXAMPLE_DEMOS,
  MENU_CATALOG_EXAMPLE_OPTIONS,
  MENU_CATALOG_POPUP_TRIGGER_ICON,
  MENU_CATALOG_POPUP_TRIGGER_LABEL,
  MENU_CATALOG_TOGGLEABLE_DEFAULT_EXPANDED,
  type BreadcrumbCatalogDisplayMode,
  type BreadcrumbCatalogInteractionState,
  type BreadcrumbCatalogItemCount,
  type MenuCatalogExample,
  type MenuCatalogInteractionState,
  type MenuCatalogToggleableExpandedState,
  type MenuCatalogToggleableSection,
  TIEREDMENU_CATALOG_BUTTON_STYLE_OPTIONS,
  TIEREDMENU_CATALOG_MENU_BUTTON_ICON,
  TIEREDMENU_CATALOG_POPUP_TRIGGER_ICON,
  TIEREDMENU_CATALOG_POPUP_TRIGGER_LABEL,
  TIEREDMENU_CATALOG_VARIANT_OPTIONS,
  type TieredMenuCatalogButtonStyle,
  type TieredMenuCatalogInteractionState,
} from './menu-catalog.config';

@Component({
  selector: 'app-menu-catalog',
  standalone: true,
  imports: [
    Breadcrumb,
    Button,
    CatalogBlockHeadTitlePipe,
    CatalogInfoBlockComponent,
    CatalogPreviewFrameComponent,
    CatalogStateTagComponent,
    FormsModule,
    Menu,
    NgTemplateOutlet,
    Ripple,
    Select,
    SelectButton,
    Divider,
    TieredMenu,
  ],
  templateUrl: './menu-catalog.component.html',
  styleUrl: './menu-catalog.component.css',
  host: { class: 'menu-catalog-page' },
})
export class MenuCatalogComponent {
  @ViewChild('menuPopup') menuPopup?: Menu;
  @ViewChild('tieredMenuPopup') tieredMenuPopup?: TieredMenu;

  private menuPopupAnchor: HTMLElement | null = null;
  private tieredMenuPopupAnchor: HTMLElement | null = null;

  readonly itemCountOptions = BREADCRUMB_CATALOG_ITEM_COUNT_OPTIONS;
  readonly displayModeOptions = BREADCRUMB_CATALOG_DISPLAY_MODE_OPTIONS;
  readonly displayModeDemos = BREADCRUMB_CATALOG_DISPLAY_MODE_DEMOS;
  readonly homeAriaLabel = BREADCRUMB_CATALOG_HOME_ARIA_LABEL;

  readonly menuExampleOptions = MENU_CATALOG_EXAMPLE_OPTIONS;
  readonly menuExampleDemos = MENU_CATALOG_EXAMPLE_DEMOS;
  readonly menuPopupTriggerLabel = MENU_CATALOG_POPUP_TRIGGER_LABEL;
  readonly menuPopupTriggerIcon = MENU_CATALOG_POPUP_TRIGGER_ICON;

  readonly tieredMenuVariantOptions = TIEREDMENU_CATALOG_VARIANT_OPTIONS;
  readonly tieredMenuButtonStyleOptions = TIEREDMENU_CATALOG_BUTTON_STYLE_OPTIONS;
  readonly tieredMenuPopupTriggerLabel = TIEREDMENU_CATALOG_POPUP_TRIGGER_LABEL;
  readonly tieredMenuPopupTriggerIcon = TIEREDMENU_CATALOG_POPUP_TRIGGER_ICON;
  readonly tieredMenuMenuButtonIcon = TIEREDMENU_CATALOG_MENU_BUTTON_ICON;

  readonly breadcrumbIx = signal<BreadcrumbCatalogInteractionState>({
    itemCount: 3,
    displayMode: 'text',
  });

  readonly menuIx = signal<MenuCatalogInteractionState>({
    example: 'basic',
  });

  readonly tieredMenuIx = signal<TieredMenuCatalogInteractionState>({
    variant: 'popup',
    buttonStyle: 'button-default',
  });

  readonly menuToggleableExpanded = signal<MenuCatalogToggleableExpandedState>({
    ...MENU_CATALOG_TOGGLEABLE_DEFAULT_EXPANDED,
  });

  readonly menuToggleableStaticExpanded = signal<MenuCatalogToggleableExpandedState>({
    ...MENU_CATALOG_TOGGLEABLE_DEFAULT_EXPANDED,
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

  readonly menuModel = computed<MenuItem[]>(() => {
    const example = this.menuIx().example;
    if (example === 'toggleable') {
      return buildMenuToggleableModel(
        this.menuToggleableExpanded(),
        (section) => this.toggleMenuToggleableSection(section),
      );
    }
    return buildMenuCatalogModel(example);
  });

  readonly toggleableStaticMenuModel = computed<MenuItem[]>(() =>
    buildMenuToggleableModel(
      this.menuToggleableStaticExpanded(),
      (section) => this.toggleMenuToggleableStaticSection(section),
    ),
  );

  readonly tieredMenuModel = computed<MenuItem[]>(() => buildTieredMenuCatalogModel());

  readonly tieredMenuIsPopup = computed(() => this.tieredMenuIx().variant === 'popup');

  readonly tieredMenuUsesMenuButton = computed(
    () => this.tieredMenuIsPopup() && this.tieredMenuIx().buttonStyle === 'menu-button',
  );

  readonly breadcrumbTooltipNoteVisible = computed(() =>
    breadcrumbCatalogShowsTooltipNote(this.breadcrumbIx().displayMode),
  );

  patchBreadcrumbIx(patch: Partial<BreadcrumbCatalogInteractionState>): void {
    this.breadcrumbIx.update((state) => ({ ...state, ...patch }));
  }

  patchTieredMenuIx(patch: Partial<TieredMenuCatalogInteractionState>): void {
    if (patch.variant === 'basic') {
      this.tieredMenuPopup?.hide();
    }
    this.tieredMenuIx.update((state) => ({ ...state, ...patch }));
  }

  setMenuExample(example: MenuCatalogExample): void {
    this.menuPopup?.hide();
    if (example === 'toggleable') {
      this.menuToggleableExpanded.set({ ...MENU_CATALOG_TOGGLEABLE_DEFAULT_EXPANDED });
    }
    this.menuIx.update((state) => ({ ...state, example }));
  }

  toggleMenuToggleableSection(section: MenuCatalogToggleableSection): void {
    const menu = this.menuPopup;
    const anchor = (menu?.target ?? this.menuPopupAnchor) as HTMLElement | undefined;

    this.menuToggleableExpanded.update((state) => ({
      ...state,
      [section]: !state[section],
    }));

    if (this.menuIx().example !== 'toggleable' || !menu || !anchor) {
      return;
    }

    // En popup, PrimeNG cierra el menú en cada click; reabrimos con el modelo actualizado.
    queueMicrotask(() => {
      menu.show({ currentTarget: anchor });
    });
  }

  toggleMenuToggleableStaticSection(section: MenuCatalogToggleableSection): void {
    this.menuToggleableStaticExpanded.update((state) => ({
      ...state,
      [section]: !state[section],
    }));
  }

  toggleMenuPopup(event: Event): void {
    const target = event.currentTarget;
    if (target instanceof HTMLElement) {
      this.menuPopupAnchor = target;
    }
    this.menuPopup?.toggle(event);
  }

  toggleTieredMenuPopup(event: Event): void {
    const target = event.currentTarget;
    if (target instanceof HTMLElement) {
      this.tieredMenuPopupAnchor = target;
    }
    this.tieredMenuPopup?.toggle(event);
  }

  trackDisplayMode(_: number, demo: { key: BreadcrumbCatalogDisplayMode }): BreadcrumbCatalogDisplayMode {
    return demo.key;
  }

  trackMenuExample(_: number, demo: { key: MenuCatalogExample }): MenuCatalogExample {
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

  demoMenuModel(example: MenuCatalogExample): MenuItem[] {
    if (example === 'toggleable') {
      return this.toggleableStaticMenuModel();
    }
    return buildMenuCatalogModel(example);
  }

  menuToggleHeader(item: MenuItem): boolean {
    return item.styleClass?.includes('mds-menu-toggle-header') ?? false;
  }

  menuToggleHeaderExpanded(item: MenuItem): boolean {
    return item.styleClass?.includes('is-expanded') ?? false;
  }
}

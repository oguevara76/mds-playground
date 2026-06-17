import type { MenuItem, TooltipOptions } from 'primeng/api';

export type BreadcrumbCatalogDisplayMode = 'text' | 'icon' | 'icon-text' | 'custom';

export type BreadcrumbCatalogItemCount = 3 | 4 | 5 | 6 | 7 | 8;

export interface BreadcrumbCatalogItemTemplate {
  label: string;
  icon: string;
}

export interface BreadcrumbCatalogDisplayModeDemo {
  key: BreadcrumbCatalogDisplayMode;
  caption: string;
}

export const BREADCRUMB_CATALOG_ITEM_TEMPLATES: readonly BreadcrumbCatalogItemTemplate[] = [
  { label: 'Electronics', icon: 'pi pi-box' },
  { label: 'Computers', icon: 'pi pi-desktop' },
  { label: 'Accessories', icon: 'pi pi-shopping-bag' },
  { label: 'Keyboards', icon: 'pi pi-table' },
  { label: 'Mechanical', icon: 'pi pi-cog' },
  { label: 'Gaming', icon: 'pi pi-play' },
  { label: 'RGB Series', icon: 'pi pi-palette' },
  { label: 'Pro Model X', icon: 'pi pi-star' },
];

export const BREADCRUMB_CATALOG_ITEM_COUNT_OPTIONS: {
  label: string;
  value: BreadcrumbCatalogItemCount;
}[] = [
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
];

export const BREADCRUMB_CATALOG_DISPLAY_MODE_OPTIONS: {
  label: string;
  value: BreadcrumbCatalogDisplayMode;
}[] = [
  { label: 'Text', value: 'text' },
  { label: 'Icon', value: 'icon' },
  { label: 'Icon & label', value: 'icon-text' },
  { label: 'Custom', value: 'custom' },
];

export const BREADCRUMB_CATALOG_DISPLAY_MODE_DEMOS: BreadcrumbCatalogDisplayModeDemo[] = [
  { key: 'text', caption: 'Text' },
  { key: 'icon', caption: 'Icon' },
  { key: 'icon-text', caption: 'Icon & label' },
  { key: 'custom', caption: 'Custom' },
];

export const BREADCRUMB_CATALOG_HOME_LABEL = 'Inicio';
export const BREADCRUMB_CATALOG_HOME_ICON = 'pi pi-home';
export const BREADCRUMB_CATALOG_HOME_ARIA_LABEL = 'Ir al inicio';

export interface BreadcrumbCatalogInteractionState {
  itemCount: BreadcrumbCatalogItemCount;
  displayMode: BreadcrumbCatalogDisplayMode;
}

export function breadcrumbCatalogShowsTooltipNote(
  displayMode: BreadcrumbCatalogDisplayMode,
): boolean {
  return displayMode === 'icon' || displayMode === 'custom';
}

function breadcrumbItemTooltipOptions(label: string): TooltipOptions {
  return {
    tooltipLabel: label,
    tooltipPosition: 'top',
    appendTo: 'body',
  };
}

function shouldAttachBreadcrumbItemTooltip(
  displayMode: BreadcrumbCatalogDisplayMode,
  hasVisibleLabel: boolean,
): boolean {
  if (displayMode === 'icon') {
    return true;
  }
  if (displayMode === 'custom') {
    return !hasVisibleLabel;
  }
  return false;
}

function attachBreadcrumbItemTooltip(item: MenuItem, label: string): void {
  item.tooltipOptions = breadcrumbItemTooltipOptions(label);
}

export function buildBreadcrumbHomeItem(
  displayMode: BreadcrumbCatalogDisplayMode,
  interactive = true,
): MenuItem {
  const item: MenuItem = interactive ? { url: '#' } : {};
  const hasVisibleLabel = displayMode === 'text' || displayMode === 'icon-text';

  if (hasVisibleLabel) {
    item.label = BREADCRUMB_CATALOG_HOME_LABEL;
  }

  if (displayMode === 'icon' || displayMode === 'icon-text' || displayMode === 'custom') {
    item.icon = BREADCRUMB_CATALOG_HOME_ICON;
  }

  if (interactive && shouldAttachBreadcrumbItemTooltip(displayMode, hasVisibleLabel)) {
    attachBreadcrumbItemTooltip(item, BREADCRUMB_CATALOG_HOME_LABEL);
  }

  return item;
}

function applyBreadcrumbItemFields(
  item: MenuItem,
  template: BreadcrumbCatalogItemTemplate,
  displayMode: BreadcrumbCatalogDisplayMode,
  index: number,
  itemCount: number,
  interactive: boolean,
): void {
  const isLast = index === itemCount - 1;
  let hasVisibleLabel = false;

  if (displayMode === 'text' || displayMode === 'icon-text') {
    item.label = template.label;
    hasVisibleLabel = true;
  }

  if (displayMode === 'icon' || displayMode === 'icon-text') {
    item.icon = template.icon;
  }

  if (displayMode === 'custom') {
    item.icon = template.icon;
    if (isLast) {
      item.label = template.label;
      hasVisibleLabel = true;
    }
  }

  if (interactive && shouldAttachBreadcrumbItemTooltip(displayMode, hasVisibleLabel)) {
    attachBreadcrumbItemTooltip(item, template.label);
  }
}

export function buildBreadcrumbModel(
  itemCount: BreadcrumbCatalogItemCount,
  displayMode: BreadcrumbCatalogDisplayMode,
  interactive = true,
): MenuItem[] {
  const modelItemCount = itemCount - 1;

  return BREADCRUMB_CATALOG_ITEM_TEMPLATES.slice(0, modelItemCount).map((template, index) => {
    const isLast = index === modelItemCount - 1;
    const item: MenuItem =
      !interactive || isLast ? {} : { url: '#' };

    applyBreadcrumbItemFields(item, template, displayMode, index, modelItemCount, interactive);

    return item;
  });
}

export function breadcrumbDisplayModeClass(
  displayMode: BreadcrumbCatalogDisplayMode,
): string {
  return `breadcrumb-display-${displayMode}`;
}

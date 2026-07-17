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

  if (isLast) {
    item.styleClass = 'mds-breadcrumb-item-active';
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

/** Ejemplo activo del Menu en Interaction (popover). */
export type MenuCatalogExample = 'basic' | 'group' | 'toggleable';

export interface MenuCatalogExampleDemo {
  key: MenuCatalogExample;
  caption: string;
}

export interface MenuCatalogInteractionState {
  example: MenuCatalogExample;
}

export const MENU_CATALOG_EXAMPLE_OPTIONS: { label: string; value: MenuCatalogExample }[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Group', value: 'group' },
  { label: 'Toggleable', value: 'toggleable' },
];

export const MENU_CATALOG_EXAMPLE_DEMOS: MenuCatalogExampleDemo[] = [
  { key: 'basic', caption: 'Basic' },
  { key: 'group', caption: 'Group' },
  { key: 'toggleable', caption: 'Toggleable' },
];

export const MENU_CATALOG_POPUP_TRIGGER_LABEL = 'Account';
export const MENU_CATALOG_POPUP_TRIGGER_ICON = 'pi pi-user';

export function buildMenuBasicModel(): MenuItem[] {
  return [
    {
      label: 'Account',
      items: [
        { label: 'Profile', icon: 'pi pi-user' },
        { label: 'Settings', icon: 'pi pi-cog' },
        { label: 'Logout', icon: 'pi pi-sign-out' },
      ],
    },
  ];
}

export function buildMenuGroupModel(): MenuItem[] {
  return [
    {
      label: 'Notifications',
      items: [
        { label: 'Enable notifications', icon: 'pi pi-check' },
        { separator: true },
        { label: 'Play sound' },
        { label: 'Marketing emails' },
      ],
    },
    { separator: true },
    {
      label: 'System',
      items: [{ label: 'Auto-update apps' }],
    },
    { separator: true },
    {
      label: 'Appearance',
      items: [
        { label: 'Light' },
        { label: 'Dark', icon: 'pi pi-check' },
        { label: 'System' },
      ],
    },
    { separator: true },
    {
      label: 'Language',
      items: [
        { label: 'English', icon: 'pi pi-check' },
        { label: 'Türkçe' },
        { label: 'Deutsch' },
      ],
    },
  ];
}

export type MenuCatalogToggleableSection = 'import' | 'export' | 'share';

export interface MenuCatalogToggleableExpandedState {
  import: boolean;
  export: boolean;
  share: boolean;
}

/** Paridad con el demo Toggleable de PrimeNG: Import abierto, Export/Share cerrados. */
export const MENU_CATALOG_TOGGLEABLE_DEFAULT_EXPANDED: MenuCatalogToggleableExpandedState = {
  import: true,
  export: false,
  share: false,
};

function menuToggleableSectionHeader(
  section: MenuCatalogToggleableSection,
  label: string,
  icon: string,
  expanded: boolean,
  toggleSection?: (section: MenuCatalogToggleableSection) => void,
): MenuItem {
  return {
    id: `menu-${section}`,
    label,
    icon,
    styleClass: `mds-menu-toggle-header${expanded ? ' is-expanded' : ''}`,
    command: toggleSection ? () => toggleSection(section) : undefined,
  };
}

function menuToggleableNestedItem(label: string, icon: string): MenuItem {
  return { label, icon, styleClass: 'mds-menu-toggle-child' };
}

/** Toggleable — grupo Document con Import, Export y Share desplegables (PrimeNG docs). */
export function buildMenuToggleableModel(
  expanded: MenuCatalogToggleableExpandedState = MENU_CATALOG_TOGGLEABLE_DEFAULT_EXPANDED,
  toggleSection?: (section: MenuCatalogToggleableSection) => void,
): MenuItem[] {
  const documentItems: MenuItem[] = [
    { label: 'New file', icon: 'pi pi-plus' },
    { label: 'Open recent', icon: 'pi pi-clock' },
    { label: 'Duplicate', icon: 'pi pi-copy' },
    menuToggleableSectionHeader('import', 'Import', 'pi pi-download', expanded.import, toggleSection),
  ];

  if (expanded.import) {
    documentItems.push(
      menuToggleableNestedItem('From file', 'pi pi-file'),
      menuToggleableNestedItem('From cloud', 'pi pi-cloud'),
      menuToggleableNestedItem('From URL', 'pi pi-globe'),
    );
  }

  documentItems.push(
    menuToggleableSectionHeader('export', 'Export', 'pi pi-upload', expanded.export, toggleSection),
  );

  if (expanded.export) {
    documentItems.push(
      menuToggleableNestedItem('To file', 'pi pi-file'),
      menuToggleableNestedItem('To cloud', 'pi pi-cloud'),
    );
  }

  documentItems.push(
    menuToggleableSectionHeader('share', 'Share', 'pi pi-share-alt', expanded.share, toggleSection),
  );

  if (expanded.share) {
    documentItems.push(
      menuToggleableNestedItem('Copy link', 'pi pi-link'),
      menuToggleableNestedItem('Email', 'pi pi-envelope'),
    );
  }

  documentItems.push({ label: 'Rename', icon: 'pi pi-pencil' });

  return [{ label: 'Document', items: documentItems }];
}

export function buildMenuCatalogModel(
  example: MenuCatalogExample,
  toggleableExpanded?: MenuCatalogToggleableExpandedState,
  toggleSection?: (section: MenuCatalogToggleableSection) => void,
): MenuItem[] {
  switch (example) {
    case 'group':
      return buildMenuGroupModel();
    case 'toggleable':
      return buildMenuToggleableModel(toggleableExpanded, toggleSection);
    default:
      return buildMenuBasicModel();
  }
}

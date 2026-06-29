export interface PanelCatalogTab {
  value: string;
  label: string;
  leftIcon: string;
  rightIcon: string;
  content: string;
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export type DividerBorderType = 'solid' | 'dashed' | 'dotted';
export type DividerAlignOption = 'left' | 'center' | 'right';

export interface DividerInteractionState {
  type: DividerBorderType;
  align: DividerAlignOption;
  showLabel: boolean;
}

export const DIVIDER_BORDER_TYPE_OPTIONS: { label: string; value: DividerBorderType }[] = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
];

export const DIVIDER_ALIGN_OPTIONS: { label: string; value: DividerAlignOption }[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

export type DividerStateKey = 'default' | 'labeled' | 'icon';

export interface DividerStateDemo {
  key: DividerStateKey;
  caption: string;
  label?: string;
  icon?: string;
}

export const DIVIDER_STATE_DEMOS: DividerStateDemo[] = [
  { key: 'default', caption: 'Default' },
  { key: 'labeled', caption: 'Labeled', label: 'Sección' },
  { key: 'icon', caption: 'With icon', icon: 'pi pi-star' },
];

export const PANEL_CATALOG_TABS: PanelCatalogTab[] = [
  {
    value: '0',
    label: 'General',
    leftIcon: 'pi pi-home',
    rightIcon: 'pi pi-angle-right',
    content:
      'Resumen del expediente, estado actual y acciones rápidas para el equipo.',
  },
  {
    value: '1',
    label: 'Detalles',
    leftIcon: 'pi pi-file',
    rightIcon: 'pi pi-angle-right',
    content:
      'Datos de contacto, dirección fiscal y preferencias de notificación del titular.',
  },
  {
    value: '2',
    label: 'Historial',
    leftIcon: 'pi pi-history',
    rightIcon: 'pi pi-angle-right',
    content:
      'Registro de cambios, aprobaciones y eventos sincronizados en los últimos 30 días.',
  },
];

export type PanelCatalogTabStateKey = 'active' | 'inactive';

export interface PanelCatalogTabStateDemo {
  key: PanelCatalogTabStateKey;
  caption: string;
}

export const PANEL_CATALOG_TAB_STATE_DEMOS: PanelCatalogTabStateDemo[] = [
  { key: 'active', caption: 'Active' },
  { key: 'inactive', caption: 'Inactive' },
];

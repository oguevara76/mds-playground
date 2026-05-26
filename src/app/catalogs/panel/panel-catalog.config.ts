export interface PanelCatalogTab {
  value: string;
  label: string;
  leftIcon: string;
  rightIcon: string;
  content: string;
}

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
  { key: 'active', caption: 'Activa' },
  { key: 'inactive', caption: 'Inactiva' },
];

export const OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT =
  'Usa un nombre corto y único. Solo letras, números y guiones.';

export const OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT = 'Tooltip text';

export type TooltipPositionKey = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipPositionDemo {
  key: TooltipPositionKey;
  caption: string;
  text: string;
  frameClass: string;
  tooltipClass: string;
}

export type DrawerPositionKey = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerCatalogInteractionState {
  position: DrawerPositionKey;
  fullScreen: boolean;
  modal: boolean;
}

export interface DrawerPositionDemo {
  key: DrawerPositionKey;
  label: string;
  buttonIcon: string;
  caption: string;
  shapeClass: string;
}

export const OVERLAY_CATALOG_DRAWER_CONFIG_HINT = 'Modal';

export const OVERLAY_CATALOG_DRAWER_FULLSCREEN_LABEL = 'Full screen';
export const OVERLAY_CATALOG_DRAWER_FULLSCREEN_ICON = 'pi pi-window-maximize';

export const OVERLAY_CATALOG_DRAWER_POSITIONS: DrawerPositionDemo[] = [
  {
    key: 'left',
    label: 'Left',
    buttonIcon: 'pi pi-arrow-left',
    caption: 'Left',
    shapeClass: 'drawer-catalog-position-shape--left',
  },
  {
    key: 'right',
    label: 'Right',
    buttonIcon: 'pi pi-arrow-right',
    caption: 'Right',
    shapeClass: 'drawer-catalog-position-shape--right',
  },
  {
    key: 'top',
    label: 'Top',
    buttonIcon: 'pi pi-arrow-up',
    caption: 'Top',
    shapeClass: 'drawer-catalog-position-shape--top',
  },
  {
    key: 'bottom',
    label: 'Bottom',
    buttonIcon: 'pi pi-arrow-down',
    caption: 'Bottom',
    shapeClass: 'drawer-catalog-position-shape--bottom',
  },
];

export const OVERLAY_CATALOG_DRAWER_HEADER = 'Panel lateral';
export const OVERLAY_CATALOG_DRAWER_CONTENT =
  'Contenido del drawer con acciones secundarias y texto de apoyo para validar padding, tipografía y contraste del overlay.';

export const OVERLAY_CATALOG_TOOLTIP_POSITIONS: TooltipPositionDemo[] = [
  {
    key: 'top',
    caption: 'Top',
    text: OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT,
    frameClass: 'tooltip-catalog-position-frame--top',
    tooltipClass: 'p-tooltip-top',
  },
  {
    key: 'right',
    caption: 'Right',
    text: OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT,
    frameClass: 'tooltip-catalog-position-frame--right',
    tooltipClass: 'p-tooltip-right',
  },
  {
    key: 'bottom',
    caption: 'Bottom',
    text: OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT,
    frameClass: 'tooltip-catalog-position-frame--bottom',
    tooltipClass: 'p-tooltip-bottom',
  },
  {
    key: 'left',
    caption: 'Left',
    text: OVERLAY_CATALOG_TOOLTIP_POSITION_TEXT,
    frameClass: 'tooltip-catalog-position-frame--left',
    tooltipClass: 'p-tooltip-left',
  },
];

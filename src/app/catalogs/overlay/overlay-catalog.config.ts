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

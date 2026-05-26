export const OVERLAY_CATALOG_TOOLTIP_INTERACTION_TEXT =
  'Usa un nombre corto y único. Solo letras, números y guiones.';

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
    text: 'Texto de ayuda arriba del objetivo.',
    frameClass: 'tooltip-catalog-position-frame--top',
    tooltipClass: 'p-tooltip-top',
  },
  {
    key: 'right',
    caption: 'Right',
    text: 'Texto de ayuda a la derecha.',
    frameClass: 'tooltip-catalog-position-frame--right',
    tooltipClass: 'p-tooltip-right',
  },
  {
    key: 'bottom',
    caption: 'Bottom',
    text: 'Texto de ayuda debajo del objetivo.',
    frameClass: 'tooltip-catalog-position-frame--bottom',
    tooltipClass: 'p-tooltip-bottom',
  },
  {
    key: 'left',
    caption: 'Left',
    text: 'Texto de ayuda a la izquierda.',
    frameClass: 'tooltip-catalog-position-frame--left',
    tooltipClass: 'p-tooltip-left',
  },
];

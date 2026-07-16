import { BUTTON_BLOCKS, BUTTON_TEXT_VARIANT_SPECS, BUTTON_VARIANT_SPECS } from '../catalogs/button/button-catalog.config';
import {
  FORM_BLOCKS,
  FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS,
  FORM_SIZE_OPTIONS,
  type FormBlockKind,
} from '../catalogs/form/form-catalog.config';
import { PAGINATOR_CATALOG_STATE_DEMOS } from '../catalogs/data/data-catalog.config';
import {
  AVATAR_CATALOG_VARIANT_OPTIONS,
  AVATAR_GROUP_CATALOG_COUNT_OPTIONS,
  BADGE_CATALOG_SEVERITIES,
  CHIP_CATALOG_VARIANT_SELECT_OPTIONS,
  TAG_CATALOG_SEVERITIES,
} from '../catalogs/misc/misc-catalog.config';
import { MESSAGE_VARIANTS } from '../catalogs/messages/messages-catalog.config';
import { TOAST_CATALOG_SEVERITIES } from '../catalogs/messages/toast-catalog.config';
import {
  ACCORDION_CATALOG_STATE_DEMOS,
  CARD_EXAMPLE_OPTIONS,
  DIVIDER_STATE_DEMOS,
  PANEL_CATALOG_TAB_STATE_DEMOS,
  PANEL_EXAMPLE_OPTIONS,
} from '../catalogs/panel/panel-catalog.config';
import { BREADCRUMB_CATALOG_DISPLAY_MODE_DEMOS } from '../catalogs/menu/menu-catalog.config';
import { OVERLAY_CATALOG_TOOLTIP_POSITIONS, OVERLAY_CATALOG_DRAWER_POSITIONS } from '../catalogs/overlay/overlay-catalog.config';
import { MDS_VARS_CATALOG } from '../theme/mds-vars-catalog.generated';

export type PlaygroundCatalogRoute =
  | 'button'
  | 'form'
  | 'messages'
  | 'data'
  | 'panel'
  | 'menu'
  | 'overlay'
  | 'misc';

export interface PlaygroundComponentEntry {
  /** ID del ancla en el DOM (`#pg-…`). */
  id: string;
  name: string;
  route: PlaygroundCatalogRoute;
  /** Pestaña / sección del playground (Button, Form, …). */
  sectionLabel: string;
  keywords: string[];
  variantCount: number;
  variableCount: number;
}

const TOKEN_PREFIXES: Record<string, string> = {
  'pg-button': 'button',
  'pg-button-icon': 'button',
  'pg-button-text': 'button',
  'pg-splitbutton': 'splitbutton',
  'pg-radiobutton': 'radiobutton',
  'pg-checkbox': 'checkbox',
  'pg-toggleswitch': 'toggleswitch',
  'pg-togglebutton': 'togglebutton',
  'pg-selectbutton': 'selectbutton',
  'pg-inputtext': 'inputtext',
  'pg-inputgroup': 'inputgroup',
  'pg-inputnumber': 'inputnumber',
  'pg-select': 'select',
  'pg-cascadeselect': 'cascadeselect',
  'pg-password': 'password',
  'pg-inputotp': 'inputotp',
  'pg-rating': 'rating',
  'pg-textarea': 'textarea',
  'pg-message': 'message',
  'pg-toast': 'toast',
  'pg-paginator': 'paginator',
  'pg-divider': 'divider',
  'pg-panel': 'panel',
  'pg-card': 'card',
  'pg-accordion': 'accordion',
  'pg-tabs': 'tabs',
  'pg-breadcrumb': 'breadcrumb',
  'pg-tooltip': 'tooltip',
  'pg-dialog': 'dialog',
  'pg-confirmdialog': 'confirmdialog',
  'pg-drawer': 'drawer',
  'pg-popover': 'popover',
  'pg-tag': 'tag',
  'pg-chip': 'chip',
  'pg-badge': 'badge',
  'pg-avatar': 'avatar',
  'pg-avatargroup': 'avatar',
};

function countComponentVariables(anchorId: string): number {
  const prefix = TOKEN_PREFIXES[anchorId];
  if (!prefix) return 0;
  const needle = `--${prefix}-`;
  return MDS_VARS_CATALOG.comp.filter((v) => v.name.startsWith(needle)).length;
}

function buttonVariantCount(kind: string): number {
  return kind === 'text' ? BUTTON_TEXT_VARIANT_SPECS.length : BUTTON_VARIANT_SPECS.length;
}

const FORM_VARIANT_COUNTS: Record<string, number> = {
  radio: 4,
  checkbox: 4,
  toggleswitch: 4,
  togglebutton: 4,
  selectbutton: 4,
  inputtext: FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS.length,
  inputgroup: FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS.length,
  inputnumber: 6,
  select: FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS.length,
  cascadeselect: FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS.length,
  password: FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS.length,
  inputotp: 6,
  rating: 4,
  textarea: FORM_INPUTTEXT_VARIANT_SELECT_OPTIONS.length,
};

function buildIndex(): PlaygroundComponentEntry[] {
  const entries: Omit<PlaygroundComponentEntry, 'variableCount'>[] = [
    ...BUTTON_BLOCKS.map((b) => ({
      id: `pg-button${b.kind === 'standard' ? '' : `-${b.kind}`}`,
      name: b.title,
      route: 'button' as const,
      sectionLabel: 'Button',
      keywords: ['btn', 'p-button', b.kind],
      variantCount: buttonVariantCount(b.kind),
    })),
    {
      id: 'pg-splitbutton',
      name: 'SplitButton',
      route: 'button' as const,
      sectionLabel: 'Button',
      keywords: ['p-splitbutton', 'splitbutton', 'split button', 'dropdown'],
      variantCount: BUTTON_VARIANT_SPECS.length,
    },
    ...FORM_BLOCKS.map((b) => ({
      id: `pg-${b.kind === 'toggleswitch' ? 'toggleswitch' : b.kind}`,
      name: b.title,
      route: 'form' as const,
      sectionLabel: 'Form',
      keywords: [b.kind, b.category, 'input', 'formulario'],
      variantCount: FORM_VARIANT_COUNTS[b.kind] ?? FORM_SIZE_OPTIONS.length,
    })),
    {
      id: 'pg-message',
      name: 'Message',
      route: 'messages',
      sectionLabel: 'Messages',
      keywords: ['p-message', 'alert', 'inline'],
      variantCount: MESSAGE_VARIANTS.length,
    },
    {
      id: 'pg-toast',
      name: 'Toast',
      route: 'messages',
      sectionLabel: 'Messages',
      keywords: ['p-toast', 'notification', 'notificación'],
      variantCount: TOAST_CATALOG_SEVERITIES.length,
    },
    {
      id: 'pg-paginator',
      name: 'Paginator',
      route: 'data',
      sectionLabel: 'Data',
      keywords: ['p-paginator', 'pagination', 'paginación'],
      variantCount: PAGINATOR_CATALOG_STATE_DEMOS.length,
    },
    {
      id: 'pg-panel',
      name: 'Panel',
      route: 'panel',
      sectionLabel: 'Panel',
      keywords: ['p-panel', 'contenedor', 'toggleable', 'colapsable'],
      variantCount: PANEL_EXAMPLE_OPTIONS.length,
    },
    {
      id: 'pg-card',
      name: 'Card',
      route: 'panel',
      sectionLabel: 'Panel',
      keywords: ['p-card', 'tarjeta', 'container', 'contenedor'],
      variantCount: CARD_EXAMPLE_OPTIONS.length,
    },
    {
      id: 'pg-accordion',
      name: 'Accordion',
      route: 'panel',
      sectionLabel: 'Panel',
      keywords: ['p-accordion', 'acordeón', 'panel', 'expandible'],
      variantCount: ACCORDION_CATALOG_STATE_DEMOS.length,
    },
    {
      id: 'pg-divider',
      name: 'Divider',
      route: 'panel',
      sectionLabel: 'Panel',
      keywords: ['p-divider', 'separador'],
      variantCount: DIVIDER_STATE_DEMOS.length,
    },
    {
      id: 'pg-tabs',
      name: 'Tabs',
      route: 'panel',
      sectionLabel: 'Panel',
      keywords: ['p-tabs', 'tabview', 'pestañas'],
      variantCount: PANEL_CATALOG_TAB_STATE_DEMOS.length,
    },
    {
      id: 'pg-breadcrumb',
      name: 'Breadcrumb',
      route: 'menu',
      sectionLabel: 'Menu',
      keywords: ['p-breadcrumb', 'miga de pan', 'navegación', 'navigation'],
      variantCount: BREADCRUMB_CATALOG_DISPLAY_MODE_DEMOS.length,
    },
    {
      id: 'pg-tooltip',
      name: 'Tooltip',
      route: 'overlay',
      sectionLabel: 'Overlay',
      keywords: ['p-tooltip', 'hint'],
      variantCount: OVERLAY_CATALOG_TOOLTIP_POSITIONS.length,
    },
    {
      id: 'pg-dialog',
      name: 'Dialog',
      route: 'overlay',
      sectionLabel: 'Overlay',
      keywords: ['p-dialog', 'modal', 'overlay', 'diálogo'],
      variantCount: 2,
    },
    {
      id: 'pg-confirmdialog',
      name: 'ConfirmDialog',
      route: 'overlay',
      sectionLabel: 'Overlay',
      keywords: ['p-confirmdialog', 'confirm', 'confirmation', 'alertdialog'],
      variantCount: 2,
    },
    {
      id: 'pg-drawer',
      name: 'Drawer',
      route: 'overlay',
      sectionLabel: 'Overlay',
      keywords: ['p-drawer', 'sidebar', 'panel', 'overlay'],
      variantCount: OVERLAY_CATALOG_DRAWER_POSITIONS.length,
    },
    {
      id: 'pg-popover',
      name: 'Popover',
      route: 'overlay',
      sectionLabel: 'Overlay',
      keywords: ['p-popover', 'overlay', 'popup', 'floating'],
      variantCount: 2,
    },
    {
      id: 'pg-tag',
      name: 'Tag',
      route: 'misc',
      sectionLabel: 'Misc',
      keywords: ['p-tag', 'etiqueta'],
      variantCount: TAG_CATALOG_SEVERITIES.length,
    },
    {
      id: 'pg-chip',
      name: 'Chip',
      route: 'misc',
      sectionLabel: 'Misc',
      keywords: ['p-chip'],
      variantCount: CHIP_CATALOG_VARIANT_SELECT_OPTIONS.length,
    },
    {
      id: 'pg-badge',
      name: 'Badge',
      route: 'misc',
      sectionLabel: 'Misc',
      keywords: ['p-badge', 'overlaybadge'],
      variantCount: BADGE_CATALOG_SEVERITIES.length,
    },
    {
      id: 'pg-avatar',
      name: 'Avatar',
      route: 'misc',
      sectionLabel: 'Misc',
      keywords: ['p-avatar', 'avatar'],
      variantCount: AVATAR_CATALOG_VARIANT_OPTIONS.length,
    },
    {
      id: 'pg-avatargroup',
      name: 'Avatar Group',
      route: 'misc',
      sectionLabel: 'Misc',
      keywords: ['p-avatargroup', 'avatar group', 'grupo'],
      variantCount: AVATAR_GROUP_CATALOG_COUNT_OPTIONS.length,
    },
  ];

  return entries.map((e) => ({
    ...e,
    variableCount: countComponentVariables(e.id),
  }));
}

export const PLAYGROUND_COMPONENT_INDEX: PlaygroundComponentEntry[] = buildIndex();

/** Componentes únicos (variantes del mismo componente cuentan como uno). */
export const PLAYGROUND_COMPONENT_COUNT = new Set(
  PLAYGROUND_COMPONENT_INDEX.map((e) => TOKEN_PREFIXES[e.id] ?? e.id),
).size;

export function playgroundAnchorId(id: string): string {
  return id;
}

export function buttonPlaygroundAnchorId(kind: 'standard' | 'icon' | 'text'): string {
  return kind === 'standard' ? 'pg-button' : `pg-button-${kind}`;
}

export const splitbuttonPlaygroundAnchorId = 'pg-splitbutton';

export function formPlaygroundAnchorId(kind: FormBlockKind): string {
  return `pg-${kind}`;
}

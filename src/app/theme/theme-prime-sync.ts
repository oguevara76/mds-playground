import {
  MDS_OVERLAY_OVERRIDE_STYLE_ID,
  OVERLAY_MDS_OVERRIDE_CSS,
} from './overlay-mds-overrides';
import { MDS_TABS_OVERRIDE_STYLE_ID, TABS_MDS_OVERRIDE_CSS } from './tabs-mds-overrides';
import { MDS_AVATAR_OVERRIDE_STYLE_ID, AVATAR_MDS_OVERRIDE_CSS } from './avatar-mds-overrides';
import { MDS_CHIP_OVERRIDE_STYLE_ID, CHIP_MDS_OVERRIDE_CSS } from './chip-mds-overrides';
import { MDS_BADGE_OVERRIDE_STYLE_ID, BADGE_MDS_OVERRIDE_CSS } from './badge-mds-overrides';
import { MDS_TAG_OVERRIDE_STYLE_ID, TAG_MDS_OVERRIDE_CSS } from './tag-mds-overrides';
import {
  BREADCRUMB_MDS_OVERRIDE_CSS,
  MDS_BREADCRUMB_OVERRIDE_STYLE_ID,
} from './breadcrumb-mds-overrides';
import { MDS_TOOLTIP_OVERRIDE_STYLE_ID, TOOLTIP_MDS_OVERRIDE_CSS } from './tooltip-mds-overrides';
import {
  MDS_RUNTIME_BRIDGE_STYLE_ID,
  PRIME_RUNTIME_BRIDGE_CSS,
} from './prime-runtime-bridge.generated';
import {
  MDS_TOGGLESWITCH_OVERRIDE_STYLE_ID,
  TOGGLESWITCH_MDS_OVERRIDE_CSS,
} from './toggleswitch-mds-overrides';
import { MDS_BUTTON_OVERRIDE_STYLE_ID, BUTTON_MDS_OVERRIDE_CSS } from './button-mds-overrides';
import {
  MDS_SPLITBUTTON_OVERRIDE_STYLE_ID,
  SPLITBUTTON_MDS_OVERRIDE_CSS,
} from './splitbutton-mds-overrides';
import {
  MDS_PAGINATOR_OVERRIDE_STYLE_ID,
  PAGINATOR_MDS_OVERRIDE_CSS,
} from './paginator-mds-overrides';
import { MDS_PANEL_OVERRIDE_STYLE_ID, PANEL_MDS_OVERRIDE_CSS } from './panel-mds-overrides';
import {
  CONFIRMDIALOG_MDS_OVERRIDE_CSS,
  MDS_CONFIRMDIALOG_OVERRIDE_STYLE_ID,
} from './confirmdialog-mds-overrides';

export type CssColorReader = (varName: string) => string;
export type InjectStyleFn = (id: string, css: string) => void;

export { MDS_RUNTIME_BRIDGE_STYLE_ID, MDS_TABS_OVERRIDE_STYLE_ID };
export { MDS_SPLITBUTTON_OVERRIDE_STYLE_ID } from './splitbutton-mds-overrides';

/**
 * Reaplica el puente --p-* ← tokens MDS (primeng-tokens.css + uploads).
 *
 * No usamos updatePrimaryPalette / updateSurfacePalette: en modo oscuro MDS invierte
 * la numeración (p. ej. --primary-50 → teal-950) y PrimeNG espera 50 = tinte claro.
 * Eso dejaba componentes con fondos/textos invertidos al cambiar light ↔ dark.
 */
export function syncPrimeUixPalettesFromMds(
  _readRgb: CssColorReader,
  injectStyle: InjectStyleFn
): void {
  injectStyle(MDS_RUNTIME_BRIDGE_STYLE_ID, PRIME_RUNTIME_BRIDGE_CSS);
  injectStyle(MDS_OVERLAY_OVERRIDE_STYLE_ID, OVERLAY_MDS_OVERRIDE_CSS);
  injectStyle(MDS_TABS_OVERRIDE_STYLE_ID, TABS_MDS_OVERRIDE_CSS);
  injectStyle(MDS_TOOLTIP_OVERRIDE_STYLE_ID, TOOLTIP_MDS_OVERRIDE_CSS);
  injectStyle(MDS_BREADCRUMB_OVERRIDE_STYLE_ID, BREADCRUMB_MDS_OVERRIDE_CSS);
  injectStyle(MDS_TAG_OVERRIDE_STYLE_ID, TAG_MDS_OVERRIDE_CSS);
  injectStyle(MDS_BADGE_OVERRIDE_STYLE_ID, BADGE_MDS_OVERRIDE_CSS);
  injectStyle(MDS_CHIP_OVERRIDE_STYLE_ID, CHIP_MDS_OVERRIDE_CSS);
  injectStyle(MDS_AVATAR_OVERRIDE_STYLE_ID, AVATAR_MDS_OVERRIDE_CSS);
  injectStyle(MDS_TOGGLESWITCH_OVERRIDE_STYLE_ID, TOGGLESWITCH_MDS_OVERRIDE_CSS);
  injectStyle(MDS_BUTTON_OVERRIDE_STYLE_ID, BUTTON_MDS_OVERRIDE_CSS);
  injectStyle(MDS_SPLITBUTTON_OVERRIDE_STYLE_ID, SPLITBUTTON_MDS_OVERRIDE_CSS);
  injectStyle(MDS_PAGINATOR_OVERRIDE_STYLE_ID, PAGINATOR_MDS_OVERRIDE_CSS);
  injectStyle(MDS_PANEL_OVERRIDE_STYLE_ID, PANEL_MDS_OVERRIDE_CSS);
  injectStyle(MDS_CONFIRMDIALOG_OVERRIDE_STYLE_ID, CONFIRMDIALOG_MDS_OVERRIDE_CSS);
}

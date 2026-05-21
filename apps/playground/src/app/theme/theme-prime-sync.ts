import { updatePrimaryPalette, updateSurfacePalette } from '@primeuix/themes';

import {
  BUTTON_MDS_OVERRIDE_CSS,
  MDS_BUTTON_OVERRIDE_STYLE_ID,
} from './button-mds-overrides';
import {
  MDS_OVERLAY_OVERRIDE_STYLE_ID,
  OVERLAY_MDS_OVERRIDE_CSS,
} from './overlay-mds-overrides';
import {
  MDS_RUNTIME_BRIDGE_STYLE_ID,
  PRIME_RUNTIME_BRIDGE_CSS,
} from './prime-runtime-bridge.generated';

const SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

export type CssColorReader = (varName: string) => string;
export type InjectStyleFn = (id: string, css: string) => void;

export { MDS_RUNTIME_BRIDGE_STYLE_ID };

/**
 * 1. Rampas primary/surface → preset PrimeNG (colores base del tema).
 * 2. Puente completo --p-* ← tokens MDS (mismo mapa que primeng-tokens.css en estático).
 */
export function syncPrimeUixPalettesFromMds(
  readRgb: CssColorReader,
  injectStyle: InjectStyleFn
): void {
  const primary = readScaleAsHex('primary', readRgb);
  if (Object.keys(primary).length >= 3) {
    updatePrimaryPalette(primary);
  }

  const surface = readScaleAsHex('surface', readRgb);
  if (Object.keys(surface).length >= 3) {
    updateSurfacePalette(surface);
  }

  injectStyle(MDS_RUNTIME_BRIDGE_STYLE_ID, PRIME_RUNTIME_BRIDGE_CSS);
  injectStyle(MDS_BUTTON_OVERRIDE_STYLE_ID, BUTTON_MDS_OVERRIDE_CSS);
  injectStyle(MDS_OVERLAY_OVERRIDE_STYLE_ID, OVERLAY_MDS_OVERRIDE_CSS);
}

function readScaleAsHex(
  prefix: 'primary' | 'surface',
  readRgb: CssColorReader
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const step of SCALE_STEPS) {
    const hex = rgbToHex(readRgb(`--${prefix}-${step}`));
    if (hex) out[step] = `#${hex}`;
  }
  return out;
}

function rgbToHex(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return '';
  return [m[1], m[2], m[3]].map((n) => parseInt(n, 10).toString(16).padStart(2, '0')).join('');
}

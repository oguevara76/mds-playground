import { updatePrimaryPalette, updateSurfacePalette } from '@primeuix/themes';

const SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

export type CssColorReader = (varName: string) => string;

/** Convierte la rampa MDS (--primary-*, --surface-*) al preset runtime de PrimeNG. */
export function syncPrimeUixPalettesFromMds(readRgb: CssColorReader): void {
  const primary = readScaleAsHex('primary', readRgb);
  if (Object.keys(primary).length >= 3) {
    updatePrimaryPalette(primary);
  }

  const surface = readScaleAsHex('surface', readRgb);
  if (Object.keys(surface).length >= 3) {
    updateSurfacePalette(surface);
  }
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

import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Preset base Aura (PrimeNG v20). Los tokens MDS/Figma se aplican encima vía
 * hoja de estilos del repo (mds-*.css + primeng-tokens.css), misma cascada que legacy.
 * Fase posterior: generar este preset desde mds-css-to-preset.
 */
export const MdsPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}',
    },
  },
});

export const mdsThemeOptions = {
  prefix: 'p',
  darkModeSelector: 'html[data-theme="dark"]',
  cssLayer: false,
} as const;

import type { ButtonDemoState, ButtonDsSeverity, ButtonVariantSpec } from './button-catalog.config';

export type ButtonDemoStyleOptions = {
  text?: boolean;
  severity?: ButtonDsSeverity;
  outlined?: boolean;
};

/**
 * Simulación hover/active en Variants & States vía tokens --p-button-* (puente MDS).
 */
export function buttonDemoWrapStyle(
  variant: ButtonVariantSpec,
  state: ButtonDemoState,
  options: ButtonDemoStyleOptions | boolean = {},
): Record<string, string> | null {
  const opts: ButtonDemoStyleOptions =
    typeof options === 'boolean' ? { text: options } : options;
  const isText = !!opts.text;
  const severity = opts.severity ?? 'primary';
  const isOutlined = opts.outlined ?? !!variant.outlined;

  if (state === 'default' || state === 'disabled') {
    return null;
  }

  const phase = state === 'hover' ? 'hover' : 'active';

  if (isText) {
    return {
      '--btn-demo-bg': `var(--p-button-text-${severity}-${phase}-background)`,
      '--btn-demo-border': 'transparent',
      '--btn-demo-color': `var(--p-button-text-${severity}-color)`,
    };
  }

  if (isOutlined) {
    return {
      '--btn-demo-bg': `var(--p-button-outlined-${severity}-${phase}-background)`,
      '--btn-demo-border': `var(--p-button-outlined-${severity}-border-color)`,
      '--btn-demo-color': `var(--p-button-outlined-${severity}-color)`,
    };
  }

  return {
    '--btn-demo-bg': `var(--p-button-${severity}-${phase}-background)`,
    '--btn-demo-border': `var(--p-button-${severity}-${phase}-border-color, var(--p-button-${severity}-border-color))`,
    '--btn-demo-color': `var(--p-button-${severity}-${phase}-color, var(--p-button-${severity}-color))`,
  };
}

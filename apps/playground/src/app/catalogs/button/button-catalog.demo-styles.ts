import type { ButtonDemoState, ButtonVariantSpec } from './button-catalog.config';

/**
 * Tokens MDS de componente (--button-*) resueltos por tema activo en <html>.
 * Más fiable que --p-button-* en dark, donde el puente puede estar incompleto.
 */
export function buttonDemoWrapStyle(
  variant: ButtonVariantSpec,
  state: ButtonDemoState,
  forceText = false,
): Record<string, string> | null {
  if (state === 'default' || state === 'disabled') {
    return null;
  }

  const phase = state === 'hover' ? 'hover' : 'active';
  const outlined = !!variant.outlined;
  const isText = forceText;

  if (isText) {
    if (outlined) {
      return {
        '--btn-demo-bg': `var(--button-outlined-primary-${phase}-background)`,
        '--btn-demo-border': 'var(--button-outlined-primary-border-color)',
        '--btn-demo-color': 'var(--button-outlined-primary-color)',
      };
    }
    return {
      '--btn-demo-bg': `var(--button-text-primary-${phase}-background)`,
      '--btn-demo-border': 'transparent',
      '--btn-demo-color': 'var(--button-text-primary-color)',
    };
  }

  if (outlined) {
    return {
      '--btn-demo-bg': `var(--button-outlined-primary-${phase}-background)`,
      '--btn-demo-border': 'var(--button-outlined-primary-border-color)',
      '--btn-demo-color': 'var(--button-outlined-primary-color)',
    };
  }

  return {
    '--btn-demo-bg': `var(--button-primary-${phase}-background)`,
    '--btn-demo-border': `var(--button-primary-${phase}-border-color)`,
    '--btn-demo-color': `var(--button-primary-${phase}-color, var(--button-primary-color))`,
  };
}

/** Inyectado después del tema PrimeNG runtime para alinear <p-button> con tokens MDS en light y dark. */
export const MDS_BUTTON_OVERRIDE_STYLE_ID = 'mds-button-overrides';

const severityBlocks = ['primary', 'secondary', 'danger', 'contrast'] as const;

function filledSeverityRules(severity: (typeof severityBlocks)[number]): string {
  const p = severity;
  const base = `.p-button.p-button-${p}:not(.p-button-text):not(.p-button-outlined)`;
  return `
${base} {
  background: var(--button-${p}-background) !important;
  border-color: var(--button-${p}-border-color) !important;
  color: var(--button-${p}-color) !important;
}
${base}:not(:disabled):hover {
  background: var(--button-${p}-hover-background) !important;
  border-color: var(--button-${p}-hover-border-color) !important;
  color: var(--button-${p}-hover-color, var(--button-${p}-color)) !important;
}
${base}:not(:disabled):active {
  background: var(--button-${p}-active-background) !important;
  border-color: var(--button-${p}-active-border-color, var(--button-${p}-active-background)) !important;
  color: var(--button-${p}-active-color, var(--button-${p}-color)) !important;
}`;
}

export const BUTTON_MDS_OVERRIDE_CSS =
  '/* MDS → PrimeNG <p-button> (filled severities del DS) */\n' +
  severityBlocks.map(filledSeverityRules).join('\n');

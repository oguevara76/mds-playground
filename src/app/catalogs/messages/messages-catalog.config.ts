export type MessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

export type MessageVariantKey = 'filled' | 'outlined' | 'simple';

export type MessageInteractionSize = 'small' | 'normal' | 'large';

/** PrimeNG `variant`; `filled` = sin atributo. */
export type MessagePrimeVariant = 'outlined' | 'simple' | undefined;

export const MESSAGE_CONTENT = 'Message Content';

export const MESSAGE_SEVERITIES: { key: MessageSeverity; label: string }[] = [
  { key: 'success', label: 'Success' },
  { key: 'info', label: 'Info' },
  { key: 'warn', label: 'Warn' },
  { key: 'error', label: 'Error' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'contrast', label: 'Contrast' },
];

export const MESSAGE_VARIANTS: {
  key: MessageVariantKey;
  caption: string;
  primeVariant: MessagePrimeVariant;
}[] = [
  { key: 'filled', caption: 'FILLED', primeVariant: undefined },
  { key: 'outlined', caption: 'OUTLINED', primeVariant: 'outlined' },
  { key: 'simple', caption: 'SIMPLE', primeVariant: 'simple' },
];

export const MESSAGE_SIZE_OPTIONS: {
  key: MessageInteractionSize;
  caption: string;
  pSize?: 'small' | 'large';
}[] = [
  { key: 'small', caption: 'Pequeño', pSize: 'small' },
  { key: 'normal', caption: 'Normal' },
  { key: 'large', caption: 'Grande', pSize: 'large' },
];

/** Iconos de severidad (paridad legacy / index.html). */
export const MESSAGE_SEVERITY_ICONS: Record<MessageSeverity, string> = {
  success: 'pi pi-check',
  info: 'pi pi-info-circle',
  warn: 'pi pi-exclamation-triangle',
  error: 'pi pi-times-circle',
  secondary: 'pi pi-cog',
  contrast: 'pi pi-bolt',
};

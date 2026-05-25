export type ToastCatalogSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'error'
  | 'secondary'
  | 'contrast';

export const TOAST_CATALOG_KEY = 'catalog';

/** Clase para animación de entrada (bounce izquierda → derecha). */
export const TOAST_CATALOG_ENTER_CLASS = 'toast-catalog-bounce-enter';

export const TOAST_CATALOG_LIFE_MS = 10_000;

/** Separación vertical entre toasts en el contenedor vivo. */
export const TOAST_CATALOG_STACK_GAP_PX = 10;

export type ToastCatalogButtonSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';

export const TOAST_CATALOG_SEVERITIES: {
  key: ToastCatalogSeverity;
  label: string;
  buttonSeverity: ToastCatalogButtonSeverity;
  buttonIcon: string;
}[] = [
  { key: 'success', label: 'Success', buttonSeverity: 'success', buttonIcon: 'pi pi-check' },
  { key: 'info', label: 'Info', buttonSeverity: 'info', buttonIcon: 'pi pi-info-circle' },
  { key: 'warn', label: 'Warn', buttonSeverity: 'warn', buttonIcon: 'pi pi-exclamation-triangle' },
  { key: 'error', label: 'Error', buttonSeverity: 'danger', buttonIcon: 'pi pi-times-circle' },
  { key: 'secondary', label: 'Secondary', buttonSeverity: 'secondary', buttonIcon: 'pi pi-cog' },
  { key: 'contrast', label: 'Contrast', buttonSeverity: 'contrast', buttonIcon: 'pi pi-bolt' },
];

export const TOAST_CATALOG_ICONS: Record<ToastCatalogSeverity, string> = {
  success: 'pi pi-check',
  info: 'pi pi-info-circle',
  warn: 'pi pi-exclamation-triangle',
  error: 'pi pi-times-circle',
  secondary: 'pi pi-cog',
  contrast: 'pi pi-bolt',
};

export const TOAST_CATALOG_STATIC: {
  severity: ToastCatalogSeverity;
  summary: string;
  detail: string;
  live: 'polite' | 'assertive';
}[] = [
  {
    severity: 'success',
    summary: 'Correcto',
    detail: 'El recurso se creó sin errores.',
    live: 'polite',
  },
  {
    severity: 'info',
    summary: 'Aviso',
    detail: 'Hay una nueva versión del manual de estilo.',
    live: 'polite',
  },
  {
    severity: 'warn',
    summary: 'Advertencia',
    detail: 'La cuota de almacenamiento está cerca del límite.',
    live: 'polite',
  },
  {
    severity: 'error',
    summary: 'Error',
    detail: 'No se pudo validar la sesión. Vuelve a iniciar sesión.',
    live: 'assertive',
  },
  {
    severity: 'secondary',
    summary: 'Secundario',
    detail: 'Preferencias actualizadas en segundo plano.',
    live: 'polite',
  },
  {
    severity: 'contrast',
    summary: 'Contraste',
    detail: 'Modo de alto contraste activo para esta vista.',
    live: 'polite',
  },
];

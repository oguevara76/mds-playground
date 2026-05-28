export type TagCatalogSeverityKey =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast';

/** Severidad en p-tag (primary = sin atributo, tema MDS vía .p-tag-primary). */
export type TagCatalogPrimeSeverity = Exclude<TagCatalogSeverityKey, 'primary'>;

export interface TagCatalogSeverityDemo {
  key: TagCatalogSeverityKey;
  label: string;
  primeSeverity?: TagCatalogPrimeSeverity;
  icon: string;
}

export const TAG_CATALOG_SEVERITIES: TagCatalogSeverityDemo[] = [
  { key: 'primary', label: 'Primary', icon: 'pi pi-bookmark' },
  { key: 'secondary', label: 'Secondary', primeSeverity: 'secondary', icon: 'pi pi-cog' },
  { key: 'success', label: 'Success', primeSeverity: 'success', icon: 'pi pi-check' },
  { key: 'info', label: 'Info', primeSeverity: 'info', icon: 'pi pi-info-circle' },
  { key: 'warn', label: 'Warn', primeSeverity: 'warn', icon: 'pi pi-exclamation-triangle' },
  { key: 'danger', label: 'Danger', primeSeverity: 'danger', icon: 'pi pi-times-circle' },
  { key: 'contrast', label: 'Contrast', primeSeverity: 'contrast', icon: 'pi pi-bolt' },
];

export interface BadgeCatalogSeverityDemo {
  key: TagCatalogSeverityKey;
  label: string;
  primeSeverity?: TagCatalogPrimeSeverity;
}

export const BADGE_CATALOG_SEVERITIES: BadgeCatalogSeverityDemo[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary', primeSeverity: 'secondary' },
  { key: 'success', label: 'Success', primeSeverity: 'success' },
  { key: 'info', label: 'Info', primeSeverity: 'info' },
  { key: 'warn', label: 'Warn', primeSeverity: 'warn' },
  { key: 'danger', label: 'Danger', primeSeverity: 'danger' },
  { key: 'contrast', label: 'Contrast', primeSeverity: 'contrast' },
];

export type BadgeCatalogSize = 'small' | 'large' | 'xlarge';

export const BADGE_CATALOG_SIZE_OPTIONS: { label: string; value: BadgeCatalogSize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Large', value: 'large' },
  { label: 'XLarge', value: 'xlarge' },
];

/** Variante del chip en Interaction (popover). */
export type ChipCatalogVariant = 'simple' | 'icon' | 'avatar';

export const CHIP_CATALOG_VARIANT_SELECT_OPTIONS: { label: string; value: ChipCatalogVariant }[] = [
  { label: 'Simple', value: 'simple' },
  { label: 'Icon', value: 'icon' },
  { label: 'Avatar', value: 'avatar' },
];

/** Avatar demo PrimeNG (prop `image`, no `icon`). */
export const CHIP_CATALOG_DEMO_AVATAR_URL =
  'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';

export const CHIP_CATALOG_DEMO_ICON = 'pi pi-bookmark';
export const CHIP_CATALOG_INTERACTION_LABEL = 'Chip interactivo';

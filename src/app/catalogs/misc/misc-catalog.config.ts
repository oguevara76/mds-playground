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

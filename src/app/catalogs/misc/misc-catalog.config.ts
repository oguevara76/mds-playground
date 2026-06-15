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

/** URL Unsplash optimizada para avatares (256×256, crop rostro). */
function unsplashAvatarPhoto(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=256&h=256&q=80&crop=faces`;
}

/**
 * Retratos demo homogéneos (mujer, hombre, mujer, hombre, mujer).
 * Fuente: https://unsplash.com/
 */
export const AVATAR_GROUP_CATALOG_IMAGES: readonly string[] = [
  unsplashAvatarPhoto('photo-1494790108377-be9c29b29330'),
  unsplashAvatarPhoto('photo-1507003211169-0a1dd7228f2d'),
  unsplashAvatarPhoto('photo-1438761681033-6461ffad8d80'),
  unsplashAvatarPhoto('photo-1500648767791-00dcc994a43e'),
  unsplashAvatarPhoto('photo-1544005313-94ddf0286df2'),
];

/** Avatar demo en Chip (prop `image`, no `icon`). */
export const CHIP_CATALOG_DEMO_AVATAR_URL = AVATAR_GROUP_CATALOG_IMAGES[0];

export const CHIP_CATALOG_DEMO_ICON = 'pi pi-bookmark';
export const CHIP_CATALOG_INTERACTION_LABEL = 'Chip interactivo';

/** Variante del avatar en Interaction (popover). */
export type AvatarCatalogVariant = 'label' | 'icon' | 'image';

export type AvatarCatalogSize = 'normal' | 'large' | 'xlarge';

export type AvatarCatalogShape = 'square' | 'circle';

export const AVATAR_CATALOG_VARIANT_OPTIONS: { label: string; value: AvatarCatalogVariant }[] = [
  { label: 'Label', value: 'label' },
  { label: 'Icon', value: 'icon' },
  { label: 'Image', value: 'image' },
];

export const AVATAR_CATALOG_SIZE_OPTIONS: { label: string; value: AvatarCatalogSize }[] = [
  { label: 'Normal', value: 'normal' },
  { label: 'Large', value: 'large' },
  { label: 'XLarge', value: 'xlarge' },
];

export const AVATAR_CATALOG_SHAPE_OPTIONS: { label: string; value: AvatarCatalogShape }[] = [
  { label: 'Square', value: 'square' },
  { label: 'Circle', value: 'circle' },
];

export const AVATAR_CATALOG_DEMO_LABEL = 'JD';
export const AVATAR_CATALOG_DEMO_ICON = 'pi pi-user';
/** Foto demo para Avatar (Image) — misma imagen en Interaction y previews. */
export const AVATAR_CATALOG_DEMO_IMAGE_URL = AVATAR_GROUP_CATALOG_IMAGES[0];

/** Valor demo del badge sobre el avatar (p-overlayBadge). */
export const AVATAR_CATALOG_BADGE_DEMO_VALUE = 2;

export type AvatarGroupCatalogCount = 2 | 3 | 4 | 5;

export const AVATAR_GROUP_CATALOG_COUNT_OPTIONS: { label: string; value: AvatarGroupCatalogCount }[] = [
  { label: '2 avatares', value: 2 },
  { label: '3 avatares', value: 3 },
  { label: '4 avatares', value: 4 },
  { label: '5 avatares', value: 5 },
];

/** Máximo de fotos visibles antes del avatar contador (+N). */
export const AVATAR_GROUP_CATALOG_MAX_VISIBLE = 3;

/** Etiqueta demo del avatar contador en previews estáticas. */
export const AVATAR_GROUP_CATALOG_OVERFLOW_LABEL = '+2';

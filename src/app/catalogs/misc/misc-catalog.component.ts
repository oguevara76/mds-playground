import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Divider } from 'primeng/divider';
import { OverlayBadge } from 'primeng/overlaybadge';
import { Popover } from 'primeng/popover';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import {
  AVATAR_CATALOG_BADGE_DEMO_VALUE,
  AVATAR_CATALOG_DEMO_ICON,
  AVATAR_CATALOG_DEMO_IMAGE_URL,
  AVATAR_CATALOG_DEMO_LABEL,
  AVATAR_CATALOG_SHAPE_OPTIONS,
  AVATAR_CATALOG_SIZE_OPTIONS,
  AVATAR_CATALOG_VARIANT_OPTIONS,
  AVATAR_GROUP_CATALOG_COUNT_OPTIONS,
  AVATAR_GROUP_CATALOG_IMAGES,
  AVATAR_GROUP_CATALOG_MAX_VISIBLE,
  AVATAR_GROUP_CATALOG_OVERFLOW_LABEL,
  BADGE_CATALOG_SEVERITIES,
  BADGE_CATALOG_SIZE_OPTIONS,
  CHIP_CATALOG_DEMO_AVATAR_URL,
  CHIP_CATALOG_DEMO_ICON,
  CHIP_CATALOG_INTERACTION_LABEL,
  CHIP_CATALOG_VARIANT_SELECT_OPTIONS,
  TAG_CATALOG_SEVERITIES,
  type AvatarCatalogShape,
  type AvatarCatalogSize,
  type AvatarCatalogVariant,
  type AvatarGroupCatalogCount,
  type ChipCatalogVariant,
  type BadgeCatalogSeverityDemo,
  type TagCatalogSeverityDemo,
  type TagCatalogSeverityKey,
} from './misc-catalog.config';

interface ChipInteractionState {
  variant: ChipCatalogVariant;
  removable: boolean;
}

interface AvatarInteractionState {
  variant: AvatarCatalogVariant;
  size: AvatarCatalogSize;
  shape: AvatarCatalogShape;
  showBadge: boolean;
  badgeShape: AvatarCatalogShape;
}

interface AvatarGroupInteractionState {
  count: AvatarGroupCatalogCount;
  size: AvatarCatalogSize;
  shape: AvatarCatalogShape;
  showTextAvatar: boolean;
}

@Component({
  selector: 'app-misc-catalog',
  standalone: true,
  imports: [
    Tag,
    Chip,
    Badge,
    OverlayBadge,
    Button,
    Avatar,
    AvatarGroup,
    FormsModule,
    Popover,
    Select,
    SelectButton,
    ToggleSwitch,
    Divider,
  ],
  templateUrl: './misc-catalog.component.html',
  styleUrl: './misc-catalog.component.css',
  host: { class: 'misc-catalog-page' },
})
export class MiscCatalogComponent {
  readonly severities = TAG_CATALOG_SEVERITIES;
  readonly badgeSizeOptions = BADGE_CATALOG_SIZE_OPTIONS;
  readonly badgeSeverities = BADGE_CATALOG_SEVERITIES;
  /** Un dígito → PrimeNG aplica `.p-badge-circle`. */
  readonly badgeDemoValue = 8;
  readonly chipVariantSelectOptions = CHIP_CATALOG_VARIANT_SELECT_OPTIONS;
  readonly chipDemoAvatarUrl = CHIP_CATALOG_DEMO_AVATAR_URL;
  readonly chipDemoIcon = CHIP_CATALOG_DEMO_ICON;
  readonly chipInteractionLabel = CHIP_CATALOG_INTERACTION_LABEL;

  readonly avatarVariantOptions = AVATAR_CATALOG_VARIANT_OPTIONS;
  readonly avatarSizeOptions = AVATAR_CATALOG_SIZE_OPTIONS;
  readonly avatarBadgeShapeOptions = AVATAR_CATALOG_SHAPE_OPTIONS;
  readonly avatarDemoLabel = AVATAR_CATALOG_DEMO_LABEL;
  readonly avatarDemoIcon = AVATAR_CATALOG_DEMO_ICON;
  readonly avatarDemoImageUrl = AVATAR_CATALOG_DEMO_IMAGE_URL;
  readonly avatarBadgeDemoValue = AVATAR_CATALOG_BADGE_DEMO_VALUE;
  readonly avatarGroupCountOptions = AVATAR_GROUP_CATALOG_COUNT_OPTIONS;
  readonly avatarGroupImages = AVATAR_GROUP_CATALOG_IMAGES;
  readonly avatarGroupMaxVisible = AVATAR_GROUP_CATALOG_MAX_VISIBLE;
  readonly avatarGroupOverflowDemoLabel = AVATAR_GROUP_CATALOG_OVERFLOW_LABEL;
  readonly avatarGroupSizeDemoRows: ReadonlyArray<{ label: string; size: AvatarCatalogSize }> = [
    { label: 'Normal', size: 'normal' },
    { label: 'Large', size: 'large' },
    { label: 'XLarge', size: 'xlarge' },
  ];

  chipIx: ChipInteractionState = { variant: 'simple', removable: false };
  chipInteractionKey = 0;

  avatarIx: AvatarInteractionState = {
    variant: 'label',
    size: 'normal',
    shape: 'square',
    showBadge: false,
    badgeShape: 'circle',
  };
  avatarGroupIx: AvatarGroupInteractionState = {
    count: 5,
    size: 'normal',
    shape: 'circle',
    showTextAvatar: false,
  };
  avatarGroupInteractionKey = 0;

  trackSeverity(_: number, s: { key: TagCatalogSeverityKey }): TagCatalogSeverityKey {
    return s.key;
  }

  isPrimary(sev: TagCatalogSeverityDemo): boolean {
    return sev.key === 'primary';
  }

  trackBadgeSeverity(_: number, sev: BadgeCatalogSeverityDemo): string {
    return sev.key;
  }

  badgeIsPrimary(sev: BadgeCatalogSeverityDemo): boolean {
    return sev.key === 'primary';
  }

  badgeSeverityStyleClass(sev: BadgeCatalogSeverityDemo, shape: 'circle' | 'square'): string | undefined {
    const classes: string[] = [];
    if (this.badgeIsPrimary(sev)) {
      classes.push('p-badge-primary');
    }
    if (shape === 'square') {
      classes.push('p-badge-square');
    }
    return classes.length ? classes.join(' ') : undefined;
  }

  chipShowsIcon(): boolean {
    return this.chipIx.variant === 'icon';
  }

  chipShowsAvatar(): boolean {
    return this.chipIx.variant === 'avatar';
  }

  patchChipIx(patch: Partial<ChipInteractionState>): void {
    Object.assign(this.chipIx, patch);
    this.resetInteractionChip();
  }

  onChipRemove(): void {
    this.resetInteractionChip();
  }

  patchAvatarIx(patch: Partial<AvatarInteractionState>): void {
    Object.assign(this.avatarIx, patch);
  }

  avatarIsCircle(): boolean {
    return this.avatarIx.shape === 'circle';
  }

  avatarPrimeShape(): AvatarCatalogShape {
    return this.avatarIsCircle() ? 'circle' : 'square';
  }

  avatarBadgeStyleClass(): string {
    const classes = ['p-badge-primary'];
    if (this.avatarIx.badgeShape === 'square') {
      classes.push('p-badge-square');
    }
    return classes.join(' ');
  }

  patchAvatarGroupIx(patch: Partial<AvatarGroupInteractionState>): void {
    const next = { ...patch };
    if (next.count !== undefined) {
      next.count = Number(next.count) as AvatarGroupCatalogCount;
    }
    Object.assign(this.avatarGroupIx, next);
    this.avatarGroupInteractionKey += 1;
  }

  avatarShowsLabel(): boolean {
    return this.avatarIx.variant === 'label';
  }

  avatarShowsIcon(): boolean {
    return this.avatarIx.variant === 'icon';
  }

  avatarShowsImage(): boolean {
    return this.avatarIx.variant === 'image';
  }

  /** PrimeNG `size`: omitir en Normal. */
  avatarPrimeSize(size: AvatarCatalogSize): 'large' | 'xlarge' | undefined {
    return size === 'normal' ? undefined : size;
  }

  avatarGroupVisiblePhotos(): readonly string[] {
    return this.avatarGroupImages.slice(0, this.avatarGroupIx.count);
  }

  /** Capas de apilamiento: el primero (izquierda) al fondo, el último (derecha) delante. */
  avatarGroupLayerStyleClass(index: number, overflow = false): string {
    const layer = `avatar-group-layer-${index + 1}`;
    return overflow ? `avatar-group-overflow ${layer}` : layer;
  }

  private resetInteractionChip(): void {
    this.chipInteractionKey += 1;
  }
}

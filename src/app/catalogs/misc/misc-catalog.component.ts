import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Divider } from 'primeng/divider';
import { OverlayBadge } from 'primeng/overlaybadge';
import { ProgressBar } from 'primeng/progressbar';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
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
  PROGRESSBAR_CATALOG_EXAMPLE_OPTIONS,
  PROGRESSBAR_CATALOG_TEMPLATE_MAX_BYTES,
  PROGRESSBAR_CATALOG_VALUE_OPTIONS,
  TAG_CATALOG_SEVERITIES,
  type AvatarCatalogShape,
  type AvatarCatalogSize,
  type AvatarCatalogVariant,
  type AvatarGroupCatalogCount,
  type ChipCatalogVariant,
  type ProgressbarCatalogExample,
  type ProgressbarCatalogValue,
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

interface ProgressbarInteractionState {
  example: ProgressbarCatalogExample;
  value: ProgressbarCatalogValue;
  showValue: boolean;
}

/** Intervalo demo Dynamic/Template (PrimeNG progressbar). */
const PROGRESSBAR_CATALOG_ANIMATION_MS = 800;

@Component({
  selector: 'app-misc-catalog',
  standalone: true,
  imports: [
    CatalogBlockHeadTitlePipe,
    CatalogInfoBlockComponent,
    CatalogPreviewFrameComponent,
    Tag,
    Chip,
    Badge,
    OverlayBadge,
    Button,
    Avatar,
    AvatarGroup,
    ProgressBar,
    FormsModule,
    Select,
    SelectButton,
    ToggleSwitch,
    Divider,
  ],
  templateUrl: './misc-catalog.component.html',
  styleUrl: './misc-catalog.component.css',
  host: { class: 'misc-catalog-page' },
})
export class MiscCatalogComponent implements OnInit, OnDestroy {
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
  readonly progressbarExampleOptions = PROGRESSBAR_CATALOG_EXAMPLE_OPTIONS;
  readonly progressbarValueOptions = PROGRESSBAR_CATALOG_VALUE_OPTIONS;
  readonly progressbarTemplateMaxBytes = PROGRESSBAR_CATALOG_TEMPLATE_MAX_BYTES;
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
    shape: 'circle',
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

  progressbarIx: ProgressbarInteractionState = {
    example: 'basic',
    value: 50,
    showValue: true,
  };

  /** Valor animado compartido por Dynamic y Template. */
  progressbarAnimatedValue = 0;

  private progressbarAnimationTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.syncProgressbarAnimation();
  }

  ngOnDestroy(): void {
    this.stopProgressbarAnimation();
  }

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

  progressbarIsBasicExample(): boolean {
    return this.progressbarIx.example === 'basic';
  }

  progressbarTemplatePercentLabel(): string {
    return `${this.progressbarAnimatedValue.toFixed(1)}%`;
  }

  progressbarTemplateFileSizeLabel(): string {
    const uploaded = (this.progressbarAnimatedValue / 100) * this.progressbarTemplateMaxBytes;
    return `${this.formatProgressbarBytes(uploaded)} / ${this.formatProgressbarBytes(this.progressbarTemplateMaxBytes)}`;
  }

  progressbarTemplateTimeLabel(): string {
    const remaining = Math.max(0, Math.round((100 - this.progressbarAnimatedValue) / 4));
    return `${Math.round(this.progressbarAnimatedValue)}% (${remaining}s remaining)`;
  }

  progressbarTemplateStatusLabel(): string {
    if (this.progressbarAnimatedValue < 20) {
      return 'Preparing file...';
    }
    if (this.progressbarAnimatedValue < 80) {
      return 'Uploading...';
    }
    if (this.progressbarAnimatedValue < 100) {
      return 'Finishing...';
    }
    return 'Complete';
  }

  patchProgressbarIx(patch: Partial<ProgressbarInteractionState>): void {
    Object.assign(this.progressbarIx, patch);
    if (patch.example !== undefined) {
      this.syncProgressbarAnimation();
    }
  }

  private syncProgressbarAnimation(): void {
    this.stopProgressbarAnimation();
    this.progressbarAnimatedValue = 0;

    if (this.progressbarIx.example !== 'dynamic' && this.progressbarIx.example !== 'template') {
      return;
    }

    this.progressbarAnimationTimer = setInterval(() => {
      const step = Math.floor(Math.random() * 8) + 4;
      this.progressbarAnimatedValue = Math.min(100, this.progressbarAnimatedValue + step);
      if (this.progressbarAnimatedValue >= 100) {
        this.progressbarAnimatedValue = 0;
      }
    }, PROGRESSBAR_CATALOG_ANIMATION_MS);
  }

  private stopProgressbarAnimation(): void {
    if (this.progressbarAnimationTimer !== null) {
      clearInterval(this.progressbarAnimationTimer);
      this.progressbarAnimationTimer = null;
    }
  }

  private formatProgressbarBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes.toFixed(bytes % 1 === 0 ? 0 : 2)} B`;
    }
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  private resetInteractionChip(): void {
    this.chipInteractionKey += 1;
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Divider } from 'primeng/divider';
import { OverlayBadge } from 'primeng/overlaybadge';
import { Popover } from 'primeng/popover';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import {
  BADGE_CATALOG_SIZE_OPTIONS,
  CHIP_CATALOG_DEMO_AVATAR_URL,
  CHIP_CATALOG_DEMO_ICON,
  CHIP_CATALOG_INTERACTION_LABEL,
  CHIP_CATALOG_VARIANT_SELECT_OPTIONS,
  TAG_CATALOG_SEVERITIES,
  type ChipCatalogVariant,
  type TagCatalogSeverityDemo,
  type TagCatalogSeverityKey,
} from './misc-catalog.config';

interface ChipInteractionState {
  variant: ChipCatalogVariant;
  removable: boolean;
}

interface BadgeSeverityOption {
  label: string;
  severity?: 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
  styleClass?: string;
}

@Component({
  selector: 'app-misc-catalog',
  standalone: true,
  imports: [Tag, Chip, Badge, OverlayBadge, Button, FormsModule, Popover, Select, ToggleSwitch, Divider],
  templateUrl: './misc-catalog.component.html',
  styleUrl: './misc-catalog.component.css',
  host: { class: 'misc-catalog-page' },
})
export class MiscCatalogComponent {
  readonly severities = TAG_CATALOG_SEVERITIES;
  readonly badgeSizeOptions = BADGE_CATALOG_SIZE_OPTIONS;
  readonly badgeSeverityOptions: ReadonlyArray<BadgeSeverityOption> = [
    { label: 'Primary', styleClass: 'p-badge-primary' },
    { label: 'Secondary', severity: 'secondary' },
    { label: 'Success', severity: 'success' },
    { label: 'Info', severity: 'info' },
    { label: 'Warn', severity: 'warn' },
    { label: 'Danger', severity: 'danger' },
    { label: 'Contrast', severity: 'contrast' },
  ];
  readonly badgeDemoValue = 8;
  readonly chipVariantSelectOptions = CHIP_CATALOG_VARIANT_SELECT_OPTIONS;
  readonly chipDemoAvatarUrl = CHIP_CATALOG_DEMO_AVATAR_URL;
  readonly chipDemoIcon = CHIP_CATALOG_DEMO_ICON;
  readonly chipInteractionLabel = CHIP_CATALOG_INTERACTION_LABEL;

  chipIx: ChipInteractionState = { variant: 'simple', removable: false };
  chipInteractionKey = 0;

  trackSeverity(_: number, s: { key: TagCatalogSeverityKey }): TagCatalogSeverityKey {
    return s.key;
  }

  isPrimary(sev: TagCatalogSeverityDemo): boolean {
    return sev.key === 'primary';
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

  private resetInteractionChip(): void {
    this.chipInteractionKey += 1;
  }
}

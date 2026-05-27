import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chip } from 'primeng/chip';
import { Divider } from 'primeng/divider';
import { Popover } from 'primeng/popover';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import {
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

@Component({
  selector: 'app-misc-catalog',
  standalone: true,
  imports: [Tag, Chip, FormsModule, Popover, Select, ToggleSwitch, Divider],
  templateUrl: './misc-catalog.component.html',
  styleUrl: './misc-catalog.component.css',
  host: { class: 'misc-catalog-page' },
})
export class MiscCatalogComponent {
  readonly severities = TAG_CATALOG_SEVERITIES;
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

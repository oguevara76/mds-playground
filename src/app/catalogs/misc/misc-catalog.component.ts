import { Component } from '@angular/core';
import { Tag } from 'primeng/tag';
import {
  TAG_CATALOG_SEVERITIES,
  type TagCatalogSeverityDemo,
  type TagCatalogSeverityKey,
} from './misc-catalog.config';

@Component({
  selector: 'app-misc-catalog',
  standalone: true,
  imports: [Tag],
  templateUrl: './misc-catalog.component.html',
  styleUrl: './misc-catalog.component.css',
  host: { class: 'misc-catalog-page' },
})
export class MiscCatalogComponent {
  readonly severities = TAG_CATALOG_SEVERITIES;

  trackSeverity(_: number, s: { key: TagCatalogSeverityKey }): TagCatalogSeverityKey {
    return s.key;
  }

  isPrimary(sev: TagCatalogSeverityDemo): boolean {
    return sev.key === 'primary';
  }
}

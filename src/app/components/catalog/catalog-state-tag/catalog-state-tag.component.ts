import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'mds-catalog-state-tag',
  standalone: true,
  imports: [Tag],
  host: {
    class: 'catalog-button-state-caption',
  },
  template: `<p-tag class="catalog-state-tag p-tag-sm" [value]="label()" severity="secondary" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogStateTagComponent {
  readonly label = input.required<string>();
}

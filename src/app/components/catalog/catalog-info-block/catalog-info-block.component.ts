import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mds-catalog-info-block',
  standalone: true,
  templateUrl: './catalog-info-block.component.html',
  styleUrl: './catalog-info-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogInfoBlockComponent {
  readonly title = input.required<string>();
  /** Clase PrimeIcons sin prefijo `pi` (p. ej. `objects-column`). */
  readonly icon = input.required<string>();
}

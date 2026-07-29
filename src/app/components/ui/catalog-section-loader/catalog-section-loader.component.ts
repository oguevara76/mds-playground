import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'mds-catalog-section-loader',
  standalone: true,
  imports: [ProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="catalog-section-loader"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p-progressSpinner
        strokeWidth="3"
        [style]="{ width: '48px', height: '48px' }"
        [ariaLabel]="ariaLabel()"
      />
      @if (label()) {
        <span class="catalog-section-loader__label">{{ label() }}</span>
      }
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }

    .catalog-section-loader {
      position: fixed;
      inset: 0;
      z-index: 12000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      box-sizing: border-box;
      background: var(--surface-context-base, var(--p-surface-50, #f8f9fa));
      color: var(--text-color, var(--p-text-color, #334155));
    }

    :host-context([data-theme='dark']) .catalog-section-loader {
      background: var(--surface-context-base, var(--p-surface-950, #0b1220));
    }

    .catalog-section-loader__label {
      font-family: var(--p-font-family);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.01em;
      color: var(--text-muted-color, var(--p-text-muted-color, #64748b));
    }
  `,
})
export class CatalogSectionLoaderComponent {
  readonly label = input<string>('');
  readonly ariaLabel = input<string>('Cargando sección');
}

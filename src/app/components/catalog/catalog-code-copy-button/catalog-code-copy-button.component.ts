import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'mds-catalog-code-copy-button',
  standalone: true,
  imports: [Tooltip],
  templateUrl: './catalog-code-copy-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogCodeCopyButtonComponent {
  readonly code = input.required<string>();

  readonly copied = signal(false);

  copyCode(): void {
    const text = this.code();
    if (!text) {
      return;
    }

    void navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      window.setTimeout(() => this.copied.set(false), 2000);
    });
  }

  copyAriaLabel(): string {
    return this.copied() ? 'Código copiado' : 'Copiar código';
  }

  copyTooltip(): string {
    return this.copied() ? 'Copiado' : 'Copiar';
  }
}

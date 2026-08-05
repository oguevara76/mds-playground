import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CatalogCodeCopyButtonComponent } from '../catalog-code-copy-button/catalog-code-copy-button.component';

@Component({
  selector: 'mds-catalog-code-snippet',
  standalone: true,
  imports: [CatalogCodeCopyButtonComponent],
  templateUrl: './catalog-code-snippet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogCodeSnippetComponent {
  readonly code = input.required<string>();
  readonly ariaLabel = input('Código de uso del componente');
  readonly hideToolbar = input(false);
}

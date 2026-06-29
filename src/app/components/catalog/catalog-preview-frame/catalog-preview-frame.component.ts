import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'mds-catalog-preview-frame',
  standalone: true,
  imports: [Popover],
  templateUrl: './catalog-preview-frame.component.html',
  styleUrl: './catalog-preview-frame.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPreviewFrameComponent {
  readonly label = input<string>('Preview');
  readonly showConfig = input(true);
  readonly showCode = input(true);
  readonly configAriaLabel = input<string>('Configurar');
  readonly codeAriaLabel = input<string>('Ver código');

  private readonly configPopover = viewChild<Popover>('configPopover');

  toggleConfig(event: Event): void {
    this.configPopover()?.toggle(event);
  }

  configPopoverVisible(): boolean {
    return this.configPopover()?.overlayVisible ?? false;
  }
}

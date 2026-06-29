import { AfterViewChecked, Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { TimesIcon } from 'primeng/icons/times';
import { Toast } from 'primeng/toast';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import {
  TOAST_CATALOG_ENTER_CLASS,
  TOAST_CATALOG_ICONS,
  TOAST_CATALOG_KEY,
  TOAST_CATALOG_LIFE_MS,
  TOAST_CATALOG_STACK_GAP_PX,
  TOAST_CATALOG_SEVERITIES,
  TOAST_CATALOG_STATIC,
  type ToastCatalogSeverity,
} from './toast-catalog.config';

@Component({
  selector: 'app-toast-catalog',
  standalone: true,
  imports: [CatalogBlockHeadTitlePipe, CatalogInfoBlockComponent, CatalogPreviewFrameComponent, Toast, Button, TimesIcon],
  templateUrl: './toast-catalog.component.html',
  styleUrl: './toast-catalog.component.css',
})
export class ToastCatalogComponent implements AfterViewChecked {
  private readonly messages = inject(MessageService);
  private placeNewToastScheduled = false;
  private pendingNewToastSlot = false;

  readonly toastKey = TOAST_CATALOG_KEY;
  readonly severities = TOAST_CATALOG_SEVERITIES;
  readonly staticToasts = TOAST_CATALOG_STATIC;

  pushToast(severity: ToastCatalogSeverity): void {
    const sample = TOAST_CATALOG_STATIC.find((t) => t.severity === severity);
    this.messages.add({
      key: TOAST_CATALOG_KEY,
      severity,
      summary: sample?.summary ?? 'Toast',
      detail: sample?.detail ?? 'Ejemplo.',
      icon: TOAST_CATALOG_ICONS[severity],
      life: TOAST_CATALOG_LIFE_MS,
      styleClass: TOAST_CATALOG_ENTER_CLASS,
    });
    this.pendingNewToastSlot = true;
    this.schedulePlaceNewToast();
  }

  hideAllToasts(): void {
    this.messages.clear(TOAST_CATALOG_KEY);
    const root = document.querySelector<HTMLElement>('.p-toast.toast-catalog-live');
    if (root) {
      root.style.minHeight = '';
    }
  }

  ngAfterViewChecked(): void {
    if (!this.pendingNewToastSlot) {
      return;
    }
    this.pendingNewToastSlot = false;
    this.schedulePlaceNewToast();
    window.setTimeout(() => this.placeNewToastSlot(), 720);
  }

  private schedulePlaceNewToast(): void {
    if (this.placeNewToastScheduled) {
      return;
    }
    this.placeNewToastScheduled = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.placeNewToastScheduled = false;
        this.placeNewToastSlot();
      });
    });
  }

  /**
   * Solo asigna slot al toast nuevo (abajo). Al cerrar otros, no se recalcula `top`:
   * desaparecen en su sitio con fade y el resto no sube.
   */
  private placeNewToastSlot(): void {
    const root = document.querySelector<HTMLElement>('.p-toast.toast-catalog-live');
    if (!root) {
      return;
    }

    const items = [...root.querySelectorAll<HTMLElement>('p-toastitem .p-toast-message')];
    if (!items.length) {
      root.style.minHeight = '';
      return;
    }

    const newest = items[items.length - 1];
    let offset = 0;

    if (items.length > 1) {
      for (let i = 0; i < items.length - 1; i++) {
        const el = items[i];
        const top = Number.parseFloat(el.style.top);
        const base = Number.isFinite(top) ? top : 0;
        offset = Math.max(offset, base + el.offsetHeight + TOAST_CATALOG_STACK_GAP_PX);
      }
    }

    newest.style.top = `${offset}px`;
    this.refreshToastViewport(root, items);
  }

  private refreshToastViewport(root: HTMLElement, items: HTMLElement[]): void {
    let maxBottom = 0;
    for (const el of items) {
      const top = Number.parseFloat(el.style.top);
      const base = Number.isFinite(top) ? top : 0;
      maxBottom = Math.max(maxBottom, base + el.offsetHeight);
    }
    root.style.minHeight = maxBottom > 0 ? `${maxBottom}px` : '';
  }

  staticIcon(severity: ToastCatalogSeverity): string {
    return TOAST_CATALOG_ICONS[severity];
  }

  trackSeverity(_: number, s: { key: ToastCatalogSeverity }): ToastCatalogSeverity {
    return s.key;
  }
}

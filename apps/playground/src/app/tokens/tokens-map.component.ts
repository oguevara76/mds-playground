import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { TokenCatalogService } from '../theme/token-catalog.service';
import { ThemeUploadService } from '../theme/theme-upload.service';
import { TokenMapController } from './token-map.controller';

/** Espera al refresh del inspector tras inyectar CSS en el DOM. */
const REFRESH_DELAY_MS = 140;

@Component({
  selector: 'app-tokens-map',
  standalone: true,
  templateUrl: './tokens-map.component.html',
  styleUrl: './tokens-map.component.css',
})
export class TokensMapComponent implements AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private readonly catalog = inject(TokenCatalogService);
  private readonly upload = inject(ThemeUploadService);
  private readonly mapHost = viewChild<ElementRef<HTMLElement>>('mapHost');

  readonly mapLoading = signal(false);

  private controller: TokenMapController | null = null;
  private readonly viewReady = signal(false);
  private showLoaderOnRefresh = false;
  private suppressEffectRefresh = true;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private refreshGen = 0;

  constructor() {
    effect(() => {
      if (!this.viewReady() || !this.catalog.mapMode()) return;
      this.upload.inspectorTick();
      this.upload.loadedSlots();
      this.catalog.sections();
      if (this.suppressEffectRefresh) return;
      this.queueMapRefresh(true);
    });
  }

  ngAfterViewInit(): void {
    const el = this.mapHost()?.nativeElement;
    if (!el) return;
    this.controller = new TokenMapController(this.doc, el, this.catalog);
    this.controller.render();
    this.viewReady.set(true);
    setTimeout(() => {
      this.showLoaderOnRefresh = true;
      this.suppressEffectRefresh = false;
    }, 400);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.mapLoading.set(false);
    this.controller?.destroy();
    this.controller = null;
  }

  private queueMapRefresh(reconnect: boolean): void {
    if (!this.controller) return;

    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    const gen = ++this.refreshGen;

    if (this.showLoaderOnRefresh) this.mapLoading.set(true);

    this.refreshTimer = setTimeout(() => {
      if (gen !== this.refreshGen) return;

      requestAnimationFrame(() => {
        if (gen !== this.refreshGen || !this.controller) return;

        const done = () => {
          if (gen === this.refreshGen) this.mapLoading.set(false);
        };

        if (reconnect) {
          this.controller.refreshWithReconnect(done);
        } else {
          this.controller.render(done);
        }
      });
    }, REFRESH_DELAY_MS);
  }
}

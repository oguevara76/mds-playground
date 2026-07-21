import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TokenCatalogService } from '../theme/token-catalog.service';
import { ThemeUploadService } from '../theme/theme-upload.service';
import { TokenMapController, type TokenMapUiState } from './token-map.controller';

/** Espera al refresh del inspector tras inyectar CSS en el DOM. */
const REFRESH_DELAY_MS = 140;

@Component({
  selector: 'app-tokens-component-map',
  standalone: true,
  templateUrl: './tokens-component-map.component.html',
  styleUrl: './tokens-component-map.component.css',
})
export class TokensComponentMapComponent implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  readonly catalog = inject(TokenCatalogService);
  private readonly upload = inject(ThemeUploadService);
  private readonly mapHost = viewChild<ElementRef<HTMLElement>>('mapHost');

  readonly mapLoading = signal(false);
  readonly uiReady = signal(false);
  readonly uiChange = output<TokenMapUiState>();

  private controller: TokenMapController | null = null;
  private controllerHost: HTMLElement | null = null;
  private showLoaderOnRefresh = false;
  private suppressEffectRefresh = true;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private refreshGen = 0;
  private bootstrapped = false;
  private lastRenderedLabel: string | null = null;

  constructor() {
    effect(() => {
      if (this.catalog.tokensViewMode() !== 'component') return;

      const label = this.catalog.selectedComponentLabel();
      const host = this.mapHost()?.nativeElement ?? null;

      this.upload.inspectorTick();
      this.upload.loadedSlots();
      this.catalog.sections();

      if (!label || !host) {
        this.teardownController();
        this.lastRenderedLabel = null;
        this.uiReady.set(false);
        return;
      }

      if (!this.controller || this.controllerHost !== host) {
        this.teardownController();
        this.controller = new TokenMapController(this.doc, host, this.catalog);
        this.controllerHost = host;
        this.controller.setUiListener((state) => {
          this.uiReady.set(true);
          this.uiChange.emit(state);
        });
        this.controller.setComponentFilter(label);
        this.lastRenderedLabel = label;
        this.controller.render();
        if (!this.bootstrapped) {
          this.bootstrapped = true;
          setTimeout(() => {
            this.showLoaderOnRefresh = true;
            this.suppressEffectRefresh = false;
          }, 400);
        }
        return;
      }

      const labelChanged = this.lastRenderedLabel !== label;
      this.controller.setComponentFilter(label);
      if (labelChanged) {
        this.lastRenderedLabel = label;
        this.queueMapRefresh(true);
        return;
      }

      if (this.suppressEffectRefresh) return;
      this.queueMapRefresh(true);
    });
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.mapLoading.set(false);
    this.teardownController();
  }

  zoomIn(): void {
    this.controller?.zoomIn();
  }

  zoomOut(): void {
    this.controller?.zoomOut();
  }

  resetView(): void {
    this.controller?.resetView();
  }

  setMapSearch(query: string): void {
    this.controller?.setMapSearch(query);
  }

  private teardownController(): void {
    this.controller?.setUiListener(null);
    this.controller?.destroy();
    this.controller = null;
    this.controllerHost = null;
    this.uiReady.set(false);
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

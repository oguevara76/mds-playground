import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  PLAYGROUND_COMPONENT_INDEX,
  type PlaygroundComponentEntry,
} from './playground-component-index';

const SCROLL_OFFSET_PX = 88;
/**
 * Tras un cambio de ruta el scrollport conserva el scroll anterior y PrimeNG
 * sigue cambiando alturas. Recolocamos el ancla durante esta ventana.
 */
const ROUTE_SCROLL_MIN_MS = 180;
const ROUTE_SCROLL_SETTLE_MS = 1000;
/** Contenedor principal del bloque en catálogo (`.catalog-preview`). */
export const PG_COMPONENT_FOCUS_CLASS = 'pg-component-focus';

@Injectable({ providedIn: 'root' })
export class PlaygroundComponentSearchService {
  private readonly router = inject(Router);

  private focusContainer: HTMLElement | null = null;
  private dismissListenerReady = false;
  private scrollGeneration = 0;

  readonly all = PLAYGROUND_COMPONENT_INDEX;

  search(query: string, limit = 12): PlaygroundComponentEntry[] {
    const q = normalize(query);
    if (!q) return [];

    const scored = this.all
      .map((entry) => ({ entry, score: matchScore(entry, q) }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name, 'es'));

    return scored.slice(0, limit).map((row) => row.entry);
  }

  goTo(entry: PlaygroundComponentEntry): void {
    const target = `/${entry.route}`;
    const sameRoute = this.router.url.startsWith(target);
    const generation = ++this.scrollGeneration;
    const navigate = sameRoute ? Promise.resolve(true) : this.router.navigate([target]);

    void navigate.then((ok) => {
      if (!ok || generation !== this.scrollGeneration) return;
      if (sameRoute) {
        this.scrollAfterRender(entry.id);
        return;
      }
      this.scrollAfterRouteChange(entry.id, target, generation);
    });
  }

  private scrollAfterRender(anchorId: string, attempt = 0): void {
    const el = document.getElementById(anchorId);
    if (el) {
      this.scrollToAnchor(anchorId);
      return;
    }
    if (attempt < 12) {
      requestAnimationFrame(() => this.scrollAfterRender(anchorId, attempt + 1));
    }
  }

  /**
   * El ancla existe en cuanto acaba la navegación, pero `.preview-area` aún
   * arrastra el scroll de la pantalla anterior y el bloque cambia de altura
   * al pintar PrimeNG. Un único `scrollTo` suave en ese frame se descarta
   * (el estilo de foco sí se queda). Aquí el scroll es inmediato y se repite
   * hasta que la posición del ancla deja de moverse.
   */
  private scrollAfterRouteChange(anchorId: string, targetPath: string, generation: number): void {
    const started = performance.now();
    let lastTop = Number.NaN;
    let stableFrames = 0;
    const abort = new AbortController();
    const container = this.previewArea();

    const cancel = () => {
      if (generation === this.scrollGeneration) this.scrollGeneration++;
    };
    container?.addEventListener('wheel', cancel, { passive: true, signal: abort.signal });
    container?.addEventListener('touchmove', cancel, { passive: true, signal: abort.signal });
    container?.addEventListener('pointerdown', cancel, { signal: abort.signal });

    const stop = () => abort.abort();

    const tick = () => {
      if (generation !== this.scrollGeneration) {
        stop();
        return;
      }

      const path = this.router.url.split(/[?#]/)[0];
      if (path !== targetPath && !path.startsWith(`${targetPath}/`)) {
        stop();
        return;
      }

      const el = document.getElementById(anchorId);
      const box = this.previewArea();
      const elapsed = performance.now() - started;

      if (!el || !box || !box.contains(el) || el.getBoundingClientRect().height === 0) {
        if (elapsed < ROUTE_SCROLL_SETTLE_MS) requestAnimationFrame(tick);
        else stop();
        return;
      }

      this.alignAnchor(el, box);
      if (!this.focusContainer?.isConnected || !this.focusContainer.contains(el)) {
        this.setFocusedComponent(anchorId);
      }

      const top = Math.round(el.getBoundingClientRect().top);
      if (top === lastTop) stableFrames++;
      else {
        stableFrames = 0;
        lastTop = top;
      }

      const settled = elapsed >= ROUTE_SCROLL_MIN_MS && stableFrames >= 2;
      if (settled || elapsed > ROUTE_SCROLL_SETTLE_MS) {
        stop();
        return;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  scrollToAnchor(anchorId: string): void {
    const el = document.getElementById(anchorId);
    const container = this.previewArea();
    if (!el || !container || !container.contains(el)) return;

    container.scrollTo({ top: this.scrollTopFor(el, container), behavior: 'smooth' });
    this.setFocusedComponent(anchorId);
  }

  private alignAnchor(el: HTMLElement, container: HTMLElement): void {
    const top = this.scrollTopFor(el, container);
    if (Math.abs(container.scrollTop - top) < 2) return;
    container.scrollTop = top;
  }

  private scrollTopFor(el: HTMLElement, container: HTMLElement): number {
    const delta =
      el.getBoundingClientRect().top - container.getBoundingClientRect().top - SCROLL_OFFSET_PX;
    return Math.max(0, container.scrollTop + delta);
  }

  private previewArea(): HTMLElement | null {
    return document.querySelector<HTMLElement>('.preview-area');
  }

  setFocusedComponent(anchorId: string): void {
    this.ensureDismissListener();
    this.clearFocus();

    const anchor = document.getElementById(anchorId);
    if (!anchor) return;

    const block =
      (anchor.closest('.catalog-preview') as HTMLElement | null) ??
      (anchor.classList.contains('catalog-block-section') ? anchor : null);
    if (!block) return;

    block.classList.add(PG_COMPONENT_FOCUS_CLASS);
    this.focusContainer = block;
  }

  clearFocus(): void {
    document.querySelectorAll(`.${PG_COMPONENT_FOCUS_CLASS}`).forEach((node) => {
      node.classList.remove(PG_COMPONENT_FOCUS_CLASS);
    });
    this.focusContainer = null;
  }

  private ensureDismissListener(): void {
    if (this.dismissListenerReady) return;
    this.dismissListenerReady = true;
    document.addEventListener('click', (event) => this.onDocumentClick(event));
  }

  private onDocumentClick(event: MouseEvent): void {
    if (!this.focusContainer) return;

    const target = event.target;
    if (!(target instanceof Node)) return;

    if (this.focusContainer.contains(target)) return;

    const searchHost = document.querySelector('app-playground-component-search');
    if (searchHost?.contains(target)) return;

    this.clearFocus();
  }
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function matchScore(entry: PlaygroundComponentEntry, q: string): number {
  const name = normalize(entry.name);
  const section = normalize(entry.sectionLabel);
  const keywords = entry.keywords.map(normalize);

  if (name === q) return 100;
  if (name.startsWith(q)) return 90;
  if (name.includes(q)) return 75;

  for (const kw of keywords) {
    if (kw === q) return 70;
    if (kw.startsWith(q)) return 65;
    if (kw.includes(q)) return 55;
  }

  if (section.includes(q)) return 40;
  if (normalize(entry.route).includes(q)) return 35;

  return 0;
}

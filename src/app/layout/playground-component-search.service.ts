import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  PLAYGROUND_COMPONENT_INDEX,
  type PlaygroundComponentEntry,
} from './playground-component-index';

const SCROLL_OFFSET_PX = 88;
/** Contenedor principal del bloque en catálogo (`.catalog-preview`). */
export const PG_COMPONENT_FOCUS_CLASS = 'pg-component-focus';

@Injectable({ providedIn: 'root' })
export class PlaygroundComponentSearchService {
  private readonly router = inject(Router);

  private focusContainer: HTMLElement | null = null;
  private dismissListenerReady = false;

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
    const navigate = this.router.url.startsWith(target)
      ? Promise.resolve(true)
      : this.router.navigate([target]);

    void navigate.then(() => this.scrollAfterRender(entry.id));
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

  scrollToAnchor(anchorId: string): void {
    const el = document.getElementById(anchorId);
    const container = document.querySelector<HTMLElement>('.preview-area');
    if (!el || !container) return;

    const elTop = el.getBoundingClientRect().top;
    const containerTop = container.getBoundingClientRect().top;
    const nextTop = container.scrollTop + (elTop - containerTop) - SCROLL_OFFSET_PX;
    container.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
    this.setFocusedComponent(anchorId);
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

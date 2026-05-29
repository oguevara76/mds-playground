import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PLAYGROUND_COMPONENT_INDEX,
  type PlaygroundComponentEntry,
} from './playground-component-index';
import { PlaygroundComponentSearchService } from './playground-component-search.service';

@Component({
  selector: 'app-playground-component-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './playground-component-search.component.html',
  styleUrl: './playground-component-search.component.css',
})
export class PlaygroundComponentSearchComponent {
  private readonly search = inject(PlaygroundComponentSearchService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly query = signal('');
  readonly panelOpen = signal(false);
  readonly highlightIndex = signal(0);

  readonly results = signal<PlaygroundComponentEntry[]>([]);

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  onQueryChange(value: string): void {
    this.query.set(value);
    const next = this.search.search(value);
    this.results.set(next);
    this.highlightIndex.set(0);
    this.panelOpen.set(value.trim().length > 0 && next.length > 0);
  }

  clear(): void {
    this.query.set('');
    this.results.set([]);
    this.highlightIndex.set(0);
    this.panelOpen.set(false);
    this.inputRef()?.nativeElement.focus();
  }

  openPanel(): void {
    const q = this.query().trim();
    if (!q) return;
    const next = this.search.search(q);
    this.results.set(next);
    this.panelOpen.set(next.length > 0);
  }

  select(entry: PlaygroundComponentEntry): void {
    this.search.goTo(entry);
    this.clear();
    this.panelOpen.set(false);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.results();
    if (!this.panelOpen() || !items.length) {
      if (event.key === 'Escape') {
        this.clear();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightIndex.update((i) => (i + 1) % items.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightIndex.update((i) => (i - 1 + items.length) % items.length);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const idx = this.highlightIndex();
      const entry = items[idx];
      if (entry) this.select(entry);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.clear();
    }
  }

  metaLine(entry: PlaygroundComponentEntry): string {
    const v = entry.variantCount;
    const vars = entry.variableCount;
    const variantLabel = v === 1 ? 'variante' : 'variantes';
    const varLabel = vars === 1 ? 'variable' : 'variables';
    return `${v} ${variantLabel} · ${vars} ${varLabel}`;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.panelOpen.set(false);
    }
  }

  /** Placeholder con conteo total de componentes indexados. */
  readonly totalComponents = PLAYGROUND_COMPONENT_INDEX.length;
}

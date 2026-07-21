import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TokenCatalogService } from '../theme/token-catalog.service';
import { TokensComponentMapComponent } from './tokens-component-map.component';
import type { TokenMapUiState } from './token-map.controller';
import { TokensMapComponent } from './tokens-map.component';

@Component({
  selector: 'app-tokens-view',
  standalone: true,
  imports: [FormsModule, TokensMapComponent, TokensComponentMapComponent],
  templateUrl: './tokens-view.component.html',
  styleUrl: './tokens-view.component.css',
})
export class TokensViewComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly catalog = inject(TokenCatalogService);

  readonly listView = this.catalog.listView;
  readonly primaryBadge = this.catalog.primaryReplacementBadge;

  private readonly tokensMap = viewChild(TokensMapComponent);
  private readonly tokensComponentMap = viewChild(TokensComponentMapComponent);
  private readonly componentSearchInput =
    viewChild<ElementRef<HTMLInputElement>>('componentSearchInput');

  readonly mapZoomPercent = signal(100);
  readonly mapVarQuery = signal('');

  readonly listPanelOpen = signal(false);
  readonly listResults = signal<string[]>([]);
  readonly listHighlightIndex = signal(0);

  readonly componentQuery = signal('');
  readonly componentResults = signal<string[]>([]);
  readonly componentPanelOpen = signal(false);
  readonly componentHighlightIndex = signal(0);

  onSearchInput(value: string): void {
    this.catalog.setSearchQuery(value);
    const next = this.catalog.searchTokenNames(value);
    this.listResults.set(next);
    this.listHighlightIndex.set(0);
    this.listPanelOpen.set(value.trim().length > 0);
  }

  clearSearch(): void {
    this.catalog.clearSearch();
    this.listResults.set([]);
    this.listHighlightIndex.set(0);
    this.listPanelOpen.set(false);
  }

  openListPanel(): void {
    const q = this.catalog.searchQuery().trim();
    if (!q) return;
    const next = this.catalog.searchTokenNames(q);
    this.listResults.set(next);
    this.listPanelOpen.set(true);
  }

  selectListToken(name: string): void {
    this.catalog.setSearchQuery(name);
    this.listResults.set([]);
    this.listPanelOpen.set(false);
    this.listHighlightIndex.set(0);
  }

  onListKeydown(event: KeyboardEvent): void {
    const items = this.listResults();
    if (!this.listPanelOpen()) {
      if (event.key === 'Escape') this.clearSearch();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!items.length) return;
      this.listHighlightIndex.update((i) => (i + 1) % items.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!items.length) return;
      this.listHighlightIndex.update((i) => (i - 1 + items.length) % items.length);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const entry = items[this.listHighlightIndex()];
      if (entry) this.selectListToken(entry);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.listPanelOpen.set(false);
    }
  }

  onComponentQueryChange(value: string): void {
    this.componentQuery.set(value);
    const selected = this.catalog.selectedComponentLabel();
    if (selected && value.trim() !== selected) {
      this.catalog.setSelectedComponentLabel(null);
      this.clearMapVarSearch();
    }
    const next = this.catalog.searchComponentLabels(value);
    this.componentResults.set(next);
    this.componentHighlightIndex.set(0);
    this.componentPanelOpen.set(value.trim().length > 0);
  }

  openComponentPanel(): void {
    const q = this.componentQuery().trim();
    if (!q) return;
    const next = this.catalog.searchComponentLabels(q);
    this.componentResults.set(next);
    this.componentPanelOpen.set(true);
  }

  clearComponentSearch(): void {
    this.componentQuery.set('');
    this.componentResults.set([]);
    this.componentHighlightIndex.set(0);
    this.componentPanelOpen.set(false);
    this.catalog.setSelectedComponentLabel(null);
    this.clearMapVarSearch();
    this.componentSearchInput()?.nativeElement.focus();
  }

  selectComponent(label: string): void {
    this.catalog.setSelectedComponentLabel(label);
    this.componentQuery.set(label);
    this.componentResults.set([]);
    this.componentPanelOpen.set(false);
    this.componentHighlightIndex.set(0);
    this.clearMapVarSearch();
  }

  onComponentKeydown(event: KeyboardEvent): void {
    const items = this.componentResults();
    if (!this.componentPanelOpen()) {
      if (event.key === 'Escape') this.clearComponentSearch();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!items.length) return;
      this.componentHighlightIndex.update((i) => (i + 1) % items.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!items.length) return;
      this.componentHighlightIndex.update((i) => (i - 1 + items.length) % items.length);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const entry = items[this.componentHighlightIndex()];
      if (entry) this.selectComponent(entry);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.componentPanelOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    const compRoot = this.host.nativeElement.querySelector('.tv-comp-search');
    if (compRoot && !compRoot.contains(target)) {
      this.componentPanelOpen.set(false);
    }
    const listRoot = this.host.nativeElement.querySelector('.tv-list-search');
    if (listRoot && !listRoot.contains(target)) {
      this.listPanelOpen.set(false);
    }
  }

  showList(): void {
    this.catalog.setTokensViewMode('list');
    this.resetComponentSearch();
    this.resetListSearchUi();
    this.resetMapChrome();
  }

  showMap(): void {
    this.catalog.setTokensViewMode('map');
    this.resetComponentSearch();
    this.resetListSearchUi();
    this.resetMapChrome();
  }

  showComponent(): void {
    this.catalog.setTokensViewMode('component');
    this.resetComponentSearch();
    this.resetListSearchUi();
    this.resetMapChrome();
  }

  onMapUiChange(state: TokenMapUiState): void {
    this.mapZoomPercent.set(state.zoomPercent);
    this.mapVarQuery.set(state.mapSearchQuery);
  }

  mapZoomIn(): void {
    this.activeMapChrome()?.zoomIn();
  }

  mapZoomOut(): void {
    this.activeMapChrome()?.zoomOut();
  }

  mapResetView(): void {
    this.activeMapChrome()?.resetView();
  }

  onMapVarSearch(value: string): void {
    this.mapVarQuery.set(value);
    this.activeMapChrome()?.setMapSearch(value);
  }

  clearMapVarSearch(): void {
    this.mapVarQuery.set('');
    this.activeMapChrome()?.setMapSearch('');
  }

  showMapChrome(): boolean {
    const mode = this.catalog.tokensViewMode();
    if (mode === 'map') return true;
    return mode === 'component' && !!this.catalog.selectedComponentLabel();
  }

  /** Search variable en toolbar de Map; en Component va al lado del buscador de componente. */
  showMapVarSearch(): boolean {
    return this.catalog.tokensViewMode() === 'map';
  }

  showComponentVarSearch(): boolean {
    return (
      this.catalog.tokensViewMode() === 'component' &&
      !!this.catalog.selectedComponentLabel()
    );
  }

  private activeMapChrome(): TokensMapComponent | TokensComponentMapComponent | undefined {
    const mode = this.catalog.tokensViewMode();
    if (mode === 'map') return this.tokensMap();
    if (mode === 'component') return this.tokensComponentMap();
    return undefined;
  }

  private resetMapChrome(): void {
    this.mapZoomPercent.set(100);
    this.mapVarQuery.set('');
  }

  private resetComponentSearch(): void {
    this.componentQuery.set('');
    this.componentResults.set([]);
    this.componentHighlightIndex.set(0);
    this.componentPanelOpen.set(false);
  }

  private resetListSearchUi(): void {
    this.listResults.set([]);
    this.listHighlightIndex.set(0);
    this.listPanelOpen.set(false);
  }
}

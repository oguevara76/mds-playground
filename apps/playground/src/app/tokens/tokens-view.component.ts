import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TokenCatalogService } from '../theme/token-catalog.service';
import { TokensMapComponent } from './tokens-map.component';

@Component({
  selector: 'app-tokens-view',
  standalone: true,
  imports: [FormsModule, TokensMapComponent],
  templateUrl: './tokens-view.component.html',
  styleUrl: './tokens-view.component.css',
})
export class TokensViewComponent {
  readonly catalog = inject(TokenCatalogService);

  readonly listView = this.catalog.listView;
  readonly primaryBadge = this.catalog.primaryReplacementBadge;

  onSearchInput(value: string): void {
    this.catalog.setSearchQuery(value);
  }

  clearSearch(): void {
    this.catalog.clearSearch();
  }

  showList(): void {
    this.catalog.setMapMode(false);
  }

  showMap(): void {
    this.catalog.setMapMode(true);
  }
}

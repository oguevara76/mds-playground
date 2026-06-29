import { Component, signal } from '@angular/core';
import { Paginator, type PaginatorState } from 'primeng/paginator';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
  PAGINATOR_CATALOG_ROWS_OPTIONS,
  PAGINATOR_CATALOG_STATE_DEMOS,
  PAGINATOR_CATALOG_TOTAL,
  type PaginatorCatalogStateKey,
} from './data-catalog.config';

@Component({
  selector: 'app-data-catalog',
  standalone: true,
  imports: [CatalogBlockHeadTitlePipe, CatalogInfoBlockComponent, CatalogPreviewFrameComponent, CatalogStateTagComponent, Paginator],
  templateUrl: './data-catalog.component.html',
  styleUrl: './data-catalog.component.css',
  host: { class: 'data-catalog-page' },
})
export class DataCatalogComponent {
  readonly totalRecords = PAGINATOR_CATALOG_TOTAL;
  readonly rowsPerPageOptions = [...PAGINATOR_CATALOG_ROWS_OPTIONS];
  readonly stateDemos = PAGINATOR_CATALOG_STATE_DEMOS;
  readonly pageReportTemplate = '{first} - {last} de {totalRecords}';

  readonly first = signal(0);
  readonly rows = signal(10);

  onPageChange(event: PaginatorState): void {
    const nextRows = event.rows ?? this.rows();
    const rowsChanged = nextRows !== this.rows();

    this.rows.set(nextRows);
    this.first.set(rowsChanged ? 0 : (event.first ?? 0));
  }

  trackState(_: number, s: { key: PaginatorCatalogStateKey }): PaginatorCatalogStateKey {
    return s.key;
  }
}

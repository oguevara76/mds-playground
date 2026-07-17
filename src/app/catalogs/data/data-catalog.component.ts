import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { OrderList } from 'primeng/orderlist';
import { Paginator, type PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CatalogBlockHeadTitlePipe } from '../../components/catalog/catalog-block-head-title.pipe';
import { CatalogInfoBlockComponent } from '../../components/catalog/catalog-info-block/catalog-info-block.component';
import { CatalogPreviewFrameComponent } from '../../components/catalog/catalog-preview-frame/catalog-preview-frame.component';
import { CatalogStateTagComponent } from '../../components/catalog/catalog-state-tag/catalog-state-tag.component';
import {
  ORDERLIST_CATALOG_EXAMPLE_OPTIONS,
  ORDERLIST_CATALOG_ITEMS,
  PAGINATOR_CATALOG_ROWS_OPTIONS,
  PAGINATOR_CATALOG_STATE_DEMOS,
  PAGINATOR_CATALOG_TOTAL,
  type OrderlistCatalogExample,
  type OrderlistCatalogItem,
  type OrderlistInteractionState,
  type PaginatorCatalogStateKey,
} from './data-catalog.config';

@Component({
  selector: 'app-data-catalog',
  standalone: true,
  imports: [
    CatalogBlockHeadTitlePipe,
    CatalogInfoBlockComponent,
    CatalogPreviewFrameComponent,
    CatalogStateTagComponent,
    Checkbox,
    Divider,
    FormsModule,
    OrderList,
    Paginator,
    Select,
    ToggleSwitch,
  ],
  templateUrl: './data-catalog.component.html',
  styleUrl: './data-catalog.component.css',
  host: { class: 'data-catalog-page' },
})
export class DataCatalogComponent {
  readonly totalRecords = PAGINATOR_CATALOG_TOTAL;
  readonly rowsPerPageOptions = [...PAGINATOR_CATALOG_ROWS_OPTIONS];
  readonly stateDemos = PAGINATOR_CATALOG_STATE_DEMOS;
  readonly pageReportTemplate = '{first} - {last} de {totalRecords}';

  readonly orderlistExampleOptions = ORDERLIST_CATALOG_EXAMPLE_OPTIONS;
  readonly orderlistScrollHeight = '15rem';

  readonly first = signal(0);
  readonly rows = signal(10);

  orderlistItems: OrderlistCatalogItem[] = ORDERLIST_CATALOG_ITEMS.map((item) => ({ ...item }));
  orderlistCheckboxSelection: OrderlistCatalogItem[] = [];

  orderlistIx: OrderlistInteractionState = {
    example: 'basic',
    filter: false,
  };

  onPageChange(event: PaginatorState): void {
    const nextRows = event.rows ?? this.rows();
    const rowsChanged = nextRows !== this.rows();

    this.rows.set(nextRows);
    this.first.set(rowsChanged ? 0 : (event.first ?? 0));
  }

  trackState(_: number, s: { key: PaginatorCatalogStateKey }): PaginatorCatalogStateKey {
    return s.key;
  }

  orderlistFilterBy(): string | undefined {
    return this.orderlistIx.filter ? 'name' : undefined;
  }

  orderlistDragdropEnabled(): boolean {
    return this.orderlistIx.example === 'checkbox';
  }

  orderlistIsCheckboxExample(): boolean {
    return this.orderlistIx.example === 'checkbox';
  }

  patchOrderlistIx(patch: Partial<OrderlistInteractionState>): void {
    if (patch.example !== undefined && patch.example !== this.orderlistIx.example) {
      this.orderlistCheckboxSelection = [];
    }
    Object.assign(this.orderlistIx, patch);
  }

  resetOrderlistItems(): void {
    this.orderlistItems = ORDERLIST_CATALOG_ITEMS.map((item) => ({ ...item }));
  }

  onOrderlistExampleChange(example: OrderlistCatalogExample): void {
    this.patchOrderlistIx({ example });
    this.resetOrderlistItems();
  }
}

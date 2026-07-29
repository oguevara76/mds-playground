import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate, TreeNode } from 'primeng/api';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { OrderList } from 'primeng/orderlist';
import { Paginator, type PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { Timeline } from 'primeng/timeline';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tree } from 'primeng/tree';
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
  TIMELINE_CATALOG_EVENTS,
  TIMELINE_CATALOG_TEMPLATE_BODY,
  TIMELINE_CATALOG_BULLET_TYPE_OPTIONS,
  TIMELINE_CATALOG_HORIZONTAL_ALIGN_OPTIONS,
  TIMELINE_CATALOG_LAYOUT_OPTIONS,
  TIMELINE_CATALOG_VARIANT_OPTIONS,
  TIMELINE_CATALOG_VERTICAL_ALIGN_OPTIONS,
  TREE_CATALOG_NODES,
  TREE_CATALOG_SELECTION_MODE_OPTIONS,
  type OrderlistCatalogExample,
  type OrderlistCatalogItem,
  type OrderlistInteractionState,
  type PaginatorCatalogStateKey,
  type TimelineCatalogAlign,
  type TimelineCatalogLayout,
  type TimelineCatalogVariant,
  type TimelineInteractionState,
  type TreeCatalogSelectionMode,
  type TreeInteractionState,
} from './data-catalog.config';

@Component({
  selector: 'app-data-catalog',
  standalone: true,
  imports: [
    CatalogBlockHeadTitlePipe,
    CatalogInfoBlockComponent,
    CatalogPreviewFrameComponent,
    CatalogStateTagComponent,
    Card,
    Checkbox,
    Button,
    Divider,
    FormsModule,
    OrderList,
    Paginator,
    PrimeTemplate,
    Select,
    SelectButton,
    Timeline,
    ToggleSwitch,
    Tree,
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

  readonly treeSelectionModeOptions = TREE_CATALOG_SELECTION_MODE_OPTIONS;
  readonly treeScrollHeight = '15rem';

  readonly timelineEvents = TIMELINE_CATALOG_EVENTS;
  readonly timelineTemplateBody = TIMELINE_CATALOG_TEMPLATE_BODY;
  readonly timelineVariantOptions = TIMELINE_CATALOG_VARIANT_OPTIONS;
  readonly timelineLayoutOptions = TIMELINE_CATALOG_LAYOUT_OPTIONS;
  readonly timelineBulletTypeOptions = TIMELINE_CATALOG_BULLET_TYPE_OPTIONS;

  readonly first = signal(0);
  readonly rows = signal(10);

  orderlistItems: OrderlistCatalogItem[] = ORDERLIST_CATALOG_ITEMS.map((item) => ({ ...item }));
  orderlistCheckboxSelection: OrderlistCatalogItem[] = [];

  orderlistIx: OrderlistInteractionState = {
    example: 'basic',
    filter: false,
  };

  treeNodes: TreeNode[] = this.cloneTreeNodes();
  treeSelection: TreeNode | TreeNode[] | null = null;

  treeIx: TreeInteractionState = {
    selectionMode: 'single',
    filter: false,
  };

  readonly timelineIx = signal<TimelineInteractionState>({
    variant: 'basic',
    layout: 'vertical',
    align: 'left',
    bulletType: 'default',
  });

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

  treeSelectionMode(): 'single' | 'multiple' | 'checkbox' | undefined {
    return this.treeIx.selectionMode === 'none' ? undefined : this.treeIx.selectionMode;
  }

  patchTreeIx(patch: Partial<TreeInteractionState>): void {
    if (patch.selectionMode !== undefined && patch.selectionMode !== this.treeIx.selectionMode) {
      this.treeSelection =
        patch.selectionMode === 'multiple' || patch.selectionMode === 'checkbox' ? [] : null;
      this.treeNodes = this.cloneTreeNodes();
    }
    Object.assign(this.treeIx, patch);
  }

  onTreeSelectionModeChange(selectionMode: TreeCatalogSelectionMode): void {
    this.patchTreeIx({ selectionMode });
  }

  timelineIsBasic(): boolean {
    return this.timelineIx().variant === 'basic';
  }

  timelineIsTemplate(): boolean {
    return this.timelineIx().variant === 'template';
  }

  timelineBasicUsesIconBullet(): boolean {
    return this.timelineIsBasic() && this.timelineIx().bulletType === 'icon';
  }

  timelineDisplayLayout(): TimelineCatalogLayout {
    return this.timelineIsTemplate() ? 'vertical' : this.timelineIx().layout;
  }

  timelineDisplayAlign(): TimelineCatalogAlign {
    return this.timelineIsTemplate() ? 'alternate' : this.timelineIx().align;
  }

  timelineAlignOptions(): { label: string; value: TimelineCatalogAlign }[] {
    return this.timelineIx().layout === 'horizontal'
      ? TIMELINE_CATALOG_HORIZONTAL_ALIGN_OPTIONS
      : TIMELINE_CATALOG_VERTICAL_ALIGN_OPTIONS;
  }

  patchTimelineIx(patch: Partial<TimelineInteractionState>): void {
    this.timelineIx.update((current) => {
      const next = { ...current, ...patch };
      if (patch.layout !== undefined && patch.layout !== current.layout) {
        next.align = patch.layout === 'horizontal' ? 'top' : 'left';
      }
      return next;
    });
  }

  onTimelineVariantChange(variant: TimelineCatalogVariant): void {
    this.patchTimelineIx({ variant });
  }

  onTimelineLayoutChange(layout: TimelineCatalogLayout): void {
    this.patchTimelineIx({ layout });
  }

  private cloneTreeNodes(): TreeNode[] {
    return structuredClone(TREE_CATALOG_NODES) as TreeNode[];
  }
}

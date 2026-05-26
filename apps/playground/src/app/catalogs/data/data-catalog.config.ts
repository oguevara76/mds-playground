export const PAGINATOR_CATALOG_TOTAL = 120;

export const PAGINATOR_CATALOG_ROWS_OPTIONS = [10, 20, 30] as const;

export type PaginatorCatalogStateKey =
  | 'inactive'
  | 'active'
  | 'hover'
  | 'disabled'
  | 'report';

export interface PaginatorCatalogStateDemo {
  key: PaginatorCatalogStateKey;
  caption: string;
}

export const PAGINATOR_CATALOG_STATE_DEMOS: PaginatorCatalogStateDemo[] = [
  { key: 'inactive', caption: 'Inactiva' },
  { key: 'active', caption: 'Activa' },
  { key: 'hover', caption: 'Hover' },
  { key: 'disabled', caption: 'Deshabilitada' },
  { key: 'report', caption: 'Informe' },
];

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
  { key: 'inactive', caption: 'Inactive' },
  { key: 'active', caption: 'Active' },
  { key: 'hover', caption: 'Hover' },
  { key: 'disabled', caption: 'Disabled' },
  { key: 'report', caption: 'Report' },
];

export interface OrderlistCatalogItem {
  id: number;
  name: string;
}

/** Películas demo (PrimeNG OrderList — Basic / Checkbox). */
export const ORDERLIST_CATALOG_ITEMS: OrderlistCatalogItem[] = [
  { id: 1, name: 'The Shawshank Redemption' },
  { id: 2, name: 'Inception' },
  { id: 3, name: 'Interstellar' },
  { id: 4, name: 'The Dark Knight' },
  { id: 5, name: 'Pulp Fiction' },
  { id: 6, name: 'Baby Driver' },
  { id: 7, name: 'Whiplash' },
  { id: 8, name: 'Eternal Sunshine of the Spotless Mind' },
  { id: 9, name: 'La La Land' },
  { id: 10, name: 'Parasite' },
];

export type OrderlistCatalogExample = 'basic' | 'checkbox';

export const ORDERLIST_CATALOG_EXAMPLE_OPTIONS: {
  label: string;
  value: OrderlistCatalogExample;
}[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Checkbox', value: 'checkbox' },
];

export interface OrderlistInteractionState {
  example: OrderlistCatalogExample;
  filter: boolean;
}

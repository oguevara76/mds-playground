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

export type TreeCatalogSelectionMode = 'none' | 'single' | 'multiple' | 'checkbox';

export const TREE_CATALOG_SELECTION_MODE_OPTIONS: {
  label: string;
  value: TreeCatalogSelectionMode;
}[] = [
  { label: 'None', value: 'none' },
  { label: 'Single', value: 'single' },
  { label: 'Multiple', value: 'multiple' },
  { label: 'Checkbox', value: 'checkbox' },
];

/** Árbol demo (PrimeNG Tree — selection modes + filter). */
export const TREE_CATALOG_NODES = [
  {
    label: 'Documents',
    data: 'Documents',
    icon: 'pi pi-folder',
    expanded: true,
    children: [
      {
        label: 'Work',
        data: 'Work',
        icon: 'pi pi-folder',
        expanded: true,
        children: [
          { label: 'Expenses.doc', icon: 'pi pi-file', data: 'Expenses.doc' },
          { label: 'Resume.doc', icon: 'pi pi-file', data: 'Resume.doc' },
        ],
      },
      {
        label: 'Home',
        data: 'Home',
        icon: 'pi pi-folder',
        children: [{ label: 'Invoices.txt', icon: 'pi pi-file', data: 'Invoices.txt' }],
      },
    ],
  },
  {
    label: 'Pictures',
    data: 'Pictures',
    icon: 'pi pi-folder',
    children: [
      { label: 'barcelona.jpg', icon: 'pi pi-image', data: 'barcelona.jpg' },
      { label: 'logo.jpg', icon: 'pi pi-image', data: 'logo.jpg' },
      { label: 'prime.jpg', icon: 'pi pi-image', data: 'prime.jpg' },
    ],
  },
  {
    label: 'Movies',
    data: 'Movies',
    icon: 'pi pi-folder',
    children: [
      {
        label: 'Al Pacino',
        data: 'Pacino Movies',
        icon: 'pi pi-folder',
        children: [
          { label: 'Scarface', icon: 'pi pi-video', data: 'Scarface' },
          { label: 'Serpico', icon: 'pi pi-video', data: 'Serpico' },
        ],
      },
    ],
  },
];

export interface TreeInteractionState {
  selectionMode: TreeCatalogSelectionMode;
  filter: boolean;
}

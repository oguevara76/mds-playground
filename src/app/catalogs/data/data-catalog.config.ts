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

export type TimelineCatalogVariant = 'basic' | 'template';

export type TimelineCatalogLayout = 'vertical' | 'horizontal';

export type TimelineCatalogVerticalAlign = 'left' | 'right' | 'alternate';

export type TimelineCatalogHorizontalAlign = 'top' | 'bottom';

export type TimelineCatalogAlign = TimelineCatalogVerticalAlign | TimelineCatalogHorizontalAlign;

export type TimelineCatalogBulletType = 'default' | 'icon';

export interface TimelineCatalogEvent {
  status: string;
  date: string;
  icon: string;
  color?: string;
  title?: string;
  description?: string;
  image?: string;
}

/** Cuerpo demo del showcase Template (PrimeNG Timeline — Custom). */
export const TIMELINE_CATALOG_TEMPLATE_BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const TIMELINE_CDN = 'https://primefaces.org/cdn/primeng/images/product';

/** Eventos demo (PrimeNG Timeline — Basic / Template). */
export const TIMELINE_CATALOG_EVENTS: TimelineCatalogEvent[] = [
  {
    status: 'Ordered',
    date: '15/10/2020 10:30',
    icon: 'pi pi-shopping-cart',
    color: '#9C27B0',
    title: 'Order placed',
    description: 'Your order #1234 has been placed successfully.',
    image: `${TIMELINE_CDN}/bamboo-watch.jpg`,
  },
  {
    status: 'Processing',
    date: '15/10/2020 14:00',
    icon: 'pi pi-cog',
    color: '#673AB7',
    title: 'Processing',
    description: 'We are preparing your items for shipment.',
  },
  {
    status: 'Shipped',
    date: '15/10/2020 16:15',
    icon: 'pi pi-truck',
    color: '#FF9800',
    title: 'Shipped',
    description: 'Your package has left our warehouse.',
  },
  {
    status: 'Delivered',
    date: '16/10/2020 10:00',
    icon: 'pi pi-check',
    color: '#607D8B',
    title: 'Delivered',
    description: 'Order delivered to the customer.',
  },
];

export const TIMELINE_CATALOG_VARIANT_OPTIONS: {
  label: string;
  value: TimelineCatalogVariant;
}[] = [
  { label: 'Basic', value: 'basic' },
  { label: 'Template', value: 'template' },
];

export const TIMELINE_CATALOG_LAYOUT_OPTIONS: {
  label: string;
  value: TimelineCatalogLayout;
}[] = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
];

export const TIMELINE_CATALOG_VERTICAL_ALIGN_OPTIONS: {
  label: string;
  value: TimelineCatalogVerticalAlign;
}[] = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Serrated', value: 'alternate' },
];

export const TIMELINE_CATALOG_HORIZONTAL_ALIGN_OPTIONS: {
  label: string;
  value: TimelineCatalogHorizontalAlign;
}[] = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
];

export const TIMELINE_CATALOG_BULLET_TYPE_OPTIONS: {
  label: string;
  value: TimelineCatalogBulletType;
}[] = [
  { label: 'Default', value: 'default' },
  { label: 'Icon', value: 'icon' },
];

export interface TimelineInteractionState {
  variant: TimelineCatalogVariant;
  layout: TimelineCatalogLayout;
  align: TimelineCatalogAlign;
  bulletType: TimelineCatalogBulletType;
}

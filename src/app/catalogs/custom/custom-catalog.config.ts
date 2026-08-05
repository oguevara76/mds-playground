export type MdsHeaderCatalogVariant = 'default' | 'custom';

export interface MdsHeaderCatalogNavItem {
  label: string;
  link?: string;
}

export interface MdsHeaderCatalogState {
  variant: MdsHeaderCatalogVariant;
  productName: string;
  showLocation: boolean;
  showExternalComm: boolean;
  showNotifications: boolean;
  userName: string;
  userRole: string;
  showProfileOverlay: boolean;
  customLogoUrl: string;
  navItems: MdsHeaderCatalogNavItem[];
}

export const MDS_HEADER_CATALOG_DEMO_HEIGHT = '56px';

export const MDS_HEADER_CATALOG_VARIANT_OPTIONS: {
  label: string;
  value: MdsHeaderCatalogVariant;
}[] = [
  { label: 'Default', value: 'default' },
  { label: 'Custom', value: 'custom' },
];

export const MDS_HEADER_CATALOG_DEFAULT_NAV_ITEMS: MdsHeaderCatalogNavItem[] = [
  { label: 'Products', link: '#' },
  { label: 'Solutions', link: '#' },
  { label: 'Resources', link: '#' },
  { label: 'Pricing', link: '#' },
];

export const MDS_HEADER_CATALOG_DEFAULT_STATE: MdsHeaderCatalogState = {
  variant: 'default',
  productName: 'Product Name',
  showLocation: true,
  showExternalComm: true,
  showNotifications: true,
  userName: 'Estefania Gómez Campos',
  userRole: 'Role profile',
  showProfileOverlay: true,
  customLogoUrl: 'brand-logo.svg',
  navItems: [...MDS_HEADER_CATALOG_DEFAULT_NAV_ITEMS],
};

export const MDS_HEADER_CATALOG_EXTERNAL_COMM_BADGES = [
  { value: '10', severity: 'success' as const },
  { value: '10', severity: 'info' as const },
  { value: '10', severity: 'warn' as const },
  { value: '10', severity: 'danger' as const },
];

export const MDS_HEADER_CATALOG_TIMEZONES = [
  {
    timezone: 'UTC',
    time: '12:00',
    date: '2025-06-30',
    selected: false,
  },
  {
    timezone: 'UTC',
    time: '12:00',
    date: '2025-06-30',
    selected: true,
  },
] as const;

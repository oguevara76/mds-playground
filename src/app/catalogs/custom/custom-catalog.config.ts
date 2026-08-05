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

function escapeAttr(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** Snippet de uso para desarrolladores según el estado del showcase. */
export function buildMdsHeaderUsageCode(state: MdsHeaderCatalogState): string {
  const lines: string[] = [
    "import { MdsHeaderComponent } from './custom/mds-header/mds-header.component';",
    "import type { MdsHeaderBadge, MdsHeaderTimezonePair } from './custom/mds-header/mds-header.types';",
    '',
    '// En el @Component imports: [MdsHeaderComponent]',
    '// timezones y externalCommBadges: arrays tipados en el host',
    '',
  ];

  if (state.variant === 'custom') {
    lines.push('<mds-header');
    lines.push('  variant="custom"');
    lines.push(`  [showNotifications]="${state.showNotifications}"`);
    lines.push(`  userName="${escapeAttr(state.userName)}"`);
    lines.push(`  userRole="${escapeAttr(state.userRole)}"`);
    lines.push(`  [showProfileOverlay]="${state.showProfileOverlay}"`);
    lines.push('>');
    lines.push(`  <img headerBrand src="${escapeAttr(state.customLogoUrl)}" alt="Brand" />`);
    lines.push('  <nav headerCustom aria-label="Navigation">');
    for (const item of state.navItems) {
      const href = escapeAttr(item.link ?? '#');
      lines.push(`    <a href="${href}">${item.label}</a>`);
    }
    lines.push('  </nav>');
    lines.push('</mds-header>');
    return lines.join('\n');
  }

  lines.push('<mds-header');
  lines.push('  variant="default"');
  lines.push(`  productName="${escapeAttr(state.productName)}"`);
  lines.push(`  [showLocation]="${state.showLocation}"`);
  lines.push('  [timezones]="timezones"');
  lines.push(`  [showExternalComm]="${state.showExternalComm}"`);
  if (state.showExternalComm) {
    lines.push('  [externalCommBadges]="externalCommBadges"');
  }
  lines.push(`  [showNotifications]="${state.showNotifications}"`);
  lines.push(`  userName="${escapeAttr(state.userName)}"`);
  lines.push(`  userRole="${escapeAttr(state.userRole)}"`);
  lines.push(`  [showProfileOverlay]="${state.showProfileOverlay}"`);
  lines.push('/>');

  return lines.join('\n');
}

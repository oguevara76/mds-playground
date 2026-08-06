export interface MdsHeaderCatalogState {
  productName: string;
  showLocation: boolean;
  showExternalComm: boolean;
  showNotifications: boolean;
  userName: string;
  userRole: string;
  showProfileOverlay: boolean;
}

export const MDS_HEADER_CATALOG_DEMO_HEIGHT = '56px';
export const MDS_FOOTER_CATALOG_DEMO_HEIGHT = '31px';

export const MDS_HEADER_CATALOG_DEFAULT_STATE: MdsHeaderCatalogState = {
  productName: 'Product Name',
  showLocation: true,
  showExternalComm: true,
  showNotifications: true,
  userName: 'Estefania Gómez Campos',
  userRole: 'Role profile',
  showProfileOverlay: true,
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
    '<mds-header',
    `  productName="${escapeAttr(state.productName)}"`,
    `  [showLocation]="${state.showLocation}"`,
    '  [timezones]="timezones"',
    `  [showExternalComm]="${state.showExternalComm}"`,
  ];

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

/** Snippet de uso estático (footer sin configurador en el showcase). */
export function buildMdsFooterUsageCode(): string {
  const lines: string[] = [
    "import { MdsFooterComponent } from './custom/mds-footer/mds-footer.component';",
    "import type { MdsFooterLink } from './custom/mds-footer/mds-footer.types';",
    '',
    '// En el @Component imports: [MdsFooterComponent]',
    '// links: array tipado en el host',
    '',
    '<mds-footer',
    '  productVersion="A-CDM V 1.0.0"',
    '  copyrightText="© Copyright 2026"',
    '  companyLinkLabel="www.indracompany.com"',
    '  companyLinkHref="https://www.indracompany.com"',
    '  [links]="links"',
    '  logoSrc="indra-logo.png"',
    '/>',
  ];

  return lines.join('\n');
}
